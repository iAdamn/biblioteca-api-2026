import { beforeEach, describe, expect, it, vi } from "vitest";

const store = vi.hoisted(() => ({ collection: vi.fn() }));
vi.mock("@/lib/firebase", () => ({ db: () => store }));
import { getBook, listBooks, listCategories, toBook } from "@/lib/data/books";

const records = [
  { id: "rayuela", title: "Rayuela", author: "Julio Cortázar", category: "Novela" },
  { id: "clean-code", title: "Clean Code", author: "Robert C. Martin", category: "Tecnología" },
  { id: "cien-anos", title: "Cien años de soledad", author: "Gabriel García Márquez", category: "Novela" },
].map(({ id, ...book }) => ({
  id,
  data: () => ({ ...book, year: 1967, description: "Ejemplo", totalCopies: 2, availableCopies: 2,
    updatedAt: "2026-10-17T12:00:00.000Z" }),
}));

beforeEach(() => {
  vi.clearAllMocks();
  store.collection.mockReturnValue({
    get: async () => ({ docs: records }),
    doc: (id: string) => ({ get: async () => {
      const record = records.find((item) => item.id === id);
      return { exists: Boolean(record), id, data: record?.data };
    } }),
  });
});

describe("catálogo contra frontera Firestore simulada", () => {
  it("ordena por título y busca autor ignorando tildes y mayúsculas", async () => {
    expect((await listBooks()).map((book) => book.id)).toEqual(["cien-anos", "clean-code", "rayuela"]);
    expect((await listBooks({ q: "GARCIA" })).map((book) => book.id)).toEqual(["cien-anos"]);
  });
  it("combina categoría y búsqueda; devuelve vacío cuando no hay coincidencias", async () => {
    expect((await listBooks({ category: "Novela", q: "rayuela" })).map((book) => book.id)).toEqual(["rayuela"]);
    expect(await listBooks({ category: "Tecnología", q: "rayuela" })).toEqual([]);
    expect(await listCategories()).toEqual(["Novela", "Tecnología"]);
  });
  it("devuelve detalle y un 404 estable para un libro ausente", async () => {
    expect(await getBook("rayuela")).toMatchObject({ id: "rayuela", title: "Rayuela", coverUrl: null });
    await expect(getBook("ausente")).rejects.toMatchObject({ status: 404, code: "NOT_FOUND" });
  });
  it("expone URL de portada solo cuando existe versión", () => {
    expect(toBook("rayuela", { ...records[0].data(), coverVersion: 2 }).coverUrl)
      .toBe("/api/books/rayuela/cover?v=2");
  });
});
