import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const boundary = vi.hoisted(() => ({
  verifyIdToken: vi.fn(), verifySessionCookie: vi.fn(), createSessionCookie: vi.fn(),
  createUser: vi.fn(), setCustomUserClaims: vi.fn(), set: vi.fn(), fetch: vi.fn(),
}));
vi.mock("@/lib/firebase", () => ({
  adminAuth: () => boundary,
  db: () => ({ collection: () => ({ doc: () => ({ set: boundary.set }) }) }),
}));
vi.mock("@/lib/env", () => ({ getEnv: () => ({ FIREBASE_WEB_API_KEY: "test-placeholder" }) }));
import { login, refresh, register, verifyIdToken } from "@/lib/services/auth";
import { registerSchema } from "@/lib/schemas";

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubGlobal("fetch", boundary.fetch);
  boundary.verifyIdToken.mockResolvedValue({ uid: "u-test", email: "demo@example.test", role: "student" });
  boundary.fetch.mockResolvedValue(Response.json({ idToken: "test-id", refreshToken: "test-refresh", expiresIn: "3600" }));
});
afterEach(() => vi.unstubAllGlobals());

describe("autenticación con Firebase y HTTP simulados", () => {
  it("login devuelve tokens y usa el rol del token verificado", async () => {
    boundary.verifyIdToken.mockResolvedValue({ uid: "u-test", role: "librarian" });
    expect(await login("demo@example.test", "test-password")).toMatchObject({
      tokens: { idToken: "test-id", expiresIn: 3600 }, user: { role: "librarian" },
    });
    expect(boundary.verifyIdToken).toHaveBeenCalledWith("test-id");
  });
  it("refresh intercambia el token y verifica la identidad resultante", async () => {
    boundary.fetch.mockResolvedValue(Response.json({ id_token: "new-id", refresh_token: "new-refresh", expires_in: "3600" }));
    expect((await refresh("old-refresh")).tokens).toEqual({ idToken: "new-id", refreshToken: "new-refresh", expiresIn: 3600 });
    const init = boundary.fetch.mock.calls[0][1];
    expect(init.body.get("grant_type")).toBe("refresh_token");
    expect(init.body.get("refresh_token")).toBe("old-refresh");
  });
  it.each(["INVALID_LOGIN_CREDENTIALS", "INVALID_PASSWORD", "EMAIL_NOT_FOUND", "INVALID_REFRESH_TOKEN", "TOKEN_EXPIRED"])
    ("no revela detalles privados cuando Firebase devuelve %s", async (message) => {
      boundary.fetch.mockResolvedValue(Response.json({ error: { message } }, { status: 400 }));
      await expect(login("demo@example.test", "wrong")).rejects.toMatchObject({
        status: 401, code: "INVALID_CREDENTIALS", message: "Correo o contraseña incorrectos",
      });
    });
  it("rechaza tokens no verificables y no confía en roles desconocidos", async () => {
    boundary.verifyIdToken.mockRejectedValueOnce(new Error("invalid signature"));
    await expect(verifyIdToken("invalid")).rejects.toMatchObject({ status: 401, code: "UNAUTHENTICATED" });
    boundary.verifyIdToken.mockResolvedValue({ uid: "u-test", role: "admin" });
    expect((await verifyIdToken("test-id")).role).toBe("student");
  });
  it("registro descarta rol enviado y asigna student antes del login", async () => {
    boundary.createUser.mockResolvedValue({ uid: "u-test" });
    const parsed = registerSchema.parse({ email: "Demo@Example.test", password: "test-password", displayName: "Demo", role: "librarian" });
    expect(parsed).not.toHaveProperty("role");
    await register(parsed.email, parsed.password, parsed.displayName);
    expect(boundary.setCustomUserClaims).toHaveBeenCalledWith("u-test", { role: "student" });
    expect(boundary.set).toHaveBeenCalledWith(expect.objectContaining({ role: "student", email: "demo@example.test" }));
    expect(boundary.setCustomUserClaims.mock.invocationCallOrder[0]).toBeLessThan(boundary.fetch.mock.invocationCallOrder[0]);
  });
  it("registro duplicado devuelve 409 y no inicia sesión", async () => {
    boundary.createUser.mockRejectedValue({ code: "auth/email-already-exists" });
    await expect(register("demo@example.test", "test-password", "Demo")).rejects.toMatchObject({ status: 409, code: "EMAIL_IN_USE" });
    expect(boundary.fetch).not.toHaveBeenCalled();
  });
});
