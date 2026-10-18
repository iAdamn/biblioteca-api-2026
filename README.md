# Biblioteca · API y sitio web

Base **Next.js 16** (App Router) adaptada para la asignatura *Desarrollo Móvil* (Unidad 03). Estado D01, 18/10/2026: catálogo y autenticación verificados con Firebase propio `biblioteca-aiden-2026`. Pasaron 27 comprobaciones reales, incluidas 14 peticiones HTTP. Préstamos, portadas, web completa por rol y publicación Vercel siguen pendientes de D02. Las funciones presentes en el código no se consideran verificadas por existir.

1. **API REST** (`/api/...`) prevista para la app móvil Expo, que tendrá un repositorio independiente.
2. **Sitio web** con las mismas funcionalidades que la app (estudiante y bibliotecario).

Los datos y la autenticación están en **Firebase** (Authentication + Firestore), que solo se usa desde el servidor.

## Guías para construirla paso a paso

Orden de trabajo: **primero esta API, después la app.**

1. [Referencia oficial API y Guía 1](https://github.com/justojaramillo/library-api).
2. [Referencia oficial móvil y Guía 2](https://github.com/justojaramillo/library-app).

Procedencia y revisión exacta en [PROCEDENCIA.md](PROCEDENCIA.md). Las guías originales se conservan fuera de este repositorio. No se ha ejecutado el replay docente ni se atribuyen sus resultados a esta adaptación.

> Usa `firebase-admin` **13** a propósito: la 14 depende de `jwks-rsa` 4, que hace `require()` de un módulo ESM y falla en Vercel si su Node es anterior a 22.12 (500 sin mensaje, `ERR_REQUIRE_ESM`).

## Puesta en marcha

1. **Firebase** (consola): crea un proyecto, habilita *Authentication → Correo/contraseña*, crea una base de datos *Firestore* y genera una clave de cuenta de servicio (detalle en la sección 2.2 de la guía).
2. Copia `.env.example` a `.env` y completa las cuatro variables.
3. Usa Node 24 compatible. El manifiesto docente declara pnpm 11.2.2; D01 comprobó instalación con pnpm 11.25.0 y el lockfile intacto. Instala y carga datos únicamente en tu proyecto Firebase identificado:

```bash
pnpm install --frozen-lockfile
pnpm seed          # carga los 10 libros
pnpm dev           # http://localhost:3000   (pnpm dev:lan para usarla desde el teléfono)
```

**Usuarios:** las cuentas propias de evaluación todavía no están creadas. Los siguientes comandos docentes crean o actualizan cuentas; ejecutarlos solo sobre tu proyecto. Su contraseña puede quedar en el historial y en los argumentos del proceso. Guarda los accesos fuera de Git y evita pegar credenciales en logs o chat:

```bash
pnpm create-user -- estudiante@tucorreo.com "TuClave" "Tu Nombre" student
pnpm create-user -- bibliotecario@tucorreo.com "TuClave" "Tu Nombre" librarian
```

> ⚠️ El `.json` de la cuenta de servicio y `.env` son credenciales: no se suben a git (ya están en `.gitignore`). Mueve o borra el `.json` después de copiar sus valores.

## Comandos

| Comando | Qué hace |
|---|---|
| `pnpm dev` / `pnpm dev:lan` | Desarrollo (el segundo acepta conexiones de la red local) |
| `pnpm build` / `pnpm start` | Producción |
| `pnpm test` | Pruebas unitarias (Vitest) |
| `pnpm typecheck` · `pnpm lint` | Tipos y reglas de código |
| `pnpm seed` | Carga los 10 libros (no crea usuarios) |
| `pnpm create-user -- correo clave "Nombre" librarian` | Crea (o actualiza) un usuario con rol `librarian` o `student` |
| `pnpm set-role -- correo librarian` | Cambia el rol de un usuario que ya existe |
| `pnpm smoke` | Prueba de humo contra Firebase real (41 comprobaciones; usa usuarios temporales y limpia todo lo que crea) |
| `pnpm reset-demo` | Borra préstamos y portadas y restaura ejemplares |

`seed` sin `--reset` conserva libros existentes; `seed -- --reset` puede alterar inventario. `smoke` crea y borra datos temporales, y `reset-demo` es destructivo. Revisar los scripts y el destino antes de ejecutarlos. D01 no ejecutó ninguno contra Firebase.

## Verificación local anticipada de D01 en D00

**Integración real D01, 18/10:** registro201 con student, login200, refresh200, me200 (incluido token renovado), catálogo200 con diez libros, búsqueda/detalle200, privados sin token401, credenciales incorrectas/refresh inválido401 y libro ausente404. Se comprobó persistencia users y que role=librarian en registro no otorga ese rol. Seed sin reset se ejecutó dos veces:0→10→10 libros y segunda ejecución sin cambios en ningún documento. Hay una cuenta técnica student de prueba; los accesos principales de evaluación aún se prepararán en D02. Credenciales y evidencias privadas permanecen fuera de este repositorio.

`pnpm typecheck`, `pnpm test`, `pnpm lint` y `pnpm build`: pasados. Vitest: 8 archivos y 50 pruebas, incluidos los controles docentes existentes de reglas, imagen y OpenAPI; sus resultados unitarios no validan las funciones D02 contra Firestore. Catálogo y auth tienen pruebas nuevas con fronteras simuladas. Ocho comprobaciones HTTP locales pasadas: login/registro servidos, catálogo/detalle/me sin token rechazados y cuerpos inválidos rechazados en login/registro/refresh. Firebase real, cuentas, sesión web completa, smoke y Vercel siguen pendientes. No se configuraron secretos ni una URL pública. Pasos del siguiente bloque en [CONFIGURACION_FIREBASE.md](CONFIGURACION_FIREBASE.md).

## Endpoints

| Ruta | Quién |
|---|---|
| `POST /api/auth/register` · `login` · `refresh`, `GET /api/auth/me` | Público / autenticado |
| `GET /api/books` (`?q=&category=&updatedSince=`), `GET /api/books/:id` | Autenticado |
| `GET /api/openapi.json` · `GET /api/docs` | Público (especificación OpenAPI y Swagger UI) |
| `GET /api/books/:id/cover` | Público |
| `PUT /api/books/:id/cover` | Bibliotecario |
| `GET /api/loans`, `POST /api/loans` (idempotente por `clientRequestId`) | Autenticado / estudiante |
| `PATCH /api/loans/:id` (`approve` · `reject` · `return`) | Bibliotecario |

Errores uniformes: `{ "error": { "code": "NO_COPIES", "message": "…" } }`.

## Estructura

```text
app/api/        Route Handlers (la API)
app/(auth)/     login y registro del sitio web
app/(app)/      libros y préstamos del sitio web
app/actions.ts  Server Actions
lib/domain/     reglas de préstamo (puras, con pruebas)
lib/data/       acceso a Firestore
lib/services/   Firebase Authentication
proxy.ts        redirección optimista a /login
scripts/        seed, set-role, smoke, reset-demo
tests/          pruebas con Vitest
PROCEDENCIA.md  revisión y diferencias respecto al material docente
```

Notas de Next.js 16 que usa el proyecto: `proxy.ts` (antes *middleware*), `cacheComponents` (lo que depende de la petición se lee dentro de `<Suspense>`) y tipos `RouteContext`/`PageProps` generados con `next typegen`.
