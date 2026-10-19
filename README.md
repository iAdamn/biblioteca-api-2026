# Biblioteca · API y sitio web

Base **Next.js 16** (App Router) adaptada para la asignatura *Desarrollo Móvil* (Unidad 03). Estado D02, 19/10/2026: Firebase propio biblioteca-aiden-2026. Integración de préstamos, transacciones, permisos, idempotencia, catálogo incremental, portadas y OpenAPI: 50/50 controles reales y 47 HTTP. Calidad: 52 tests, tipos, lint y build correctos. Web: 19 comprobaciones de navegador. Producción verificada en https://biblioteca-api-2026.vercel.app: 50/50 controles de integración (47 HTTP) y 9/9 de cuentas principales (8 HTTP). La app móvil corresponde a un bloque posterior.

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

**Usuarios:** existen dos cuentas propias de demostración, student y librarian; sus credenciales se conservan exclusivamente en un archivo privado fuera de este repositorio. Los siguientes comandos docentes crean o actualizan cuentas; ejecutarlos solo sobre tu proyecto. Su contraseña puede quedar en el historial y en los argumentos del proceso. Guarda los accesos fuera de Git y evita pegar credenciales en logs o chat:

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

`seed` sin `--reset` conserva libros existentes; `seed -- --reset` puede alterar inventario. `smoke` también restaura inventario y elimina portadas de clean-code/rayuela; no usarlo sobre datos que se deban preservar. La integración D02 usa fixtures propias aisladas. `reset-demo` es destructivo. Revisar los scripts y el destino antes de ejecutarlos. D01 ejecutó seed sin reset dos veces; smoke y reset-demo no se ejecutaron. D02 usó fixtures aisladas con comparación del catálogo original antes y después.

## Verificación local anticipada de D01 en D00

**Integración real D01, 18/10:** registro201 con student, login200, refresh200, me200 (incluido token renovado), catálogo200 con diez libros, búsqueda/detalle200, privados sin token401, credenciales incorrectas/refresh inválido401 y libro ausente404. Se comprobó persistencia users y que role=librarian en registro no otorga ese rol. Seed sin reset se ejecutó dos veces:0→10→10 libros y segunda ejecución sin cambios en ningún documento. Hay una cuenta técnica student histórica; D02 añadió dos accesos principales y verificó sus roles por API y web. Credenciales y evidencias privadas permanecen fuera de este repositorio.

`pnpm typecheck`, `pnpm test`, `pnpm lint` y `pnpm build`: pasados. Vitest: 8 archivos y 50 pruebas, incluidos los controles docentes existentes de reglas, imagen y OpenAPI; sus resultados unitarios no validan las funciones D02 contra Firestore. Catálogo y auth tienen pruebas nuevas con fronteras simuladas. Ocho comprobaciones HTTP locales pasadas: login/registro servidos, catálogo/detalle/me sin token rechazados y cuerpos inválidos rechazados en login/registro/refresh. Firebase real, cuentas, sesión web completa, smoke y Vercel siguen pendientes. En D00 no había secretos ni URL pública; D01 configuró Firebase propio y D02 publicó la URL indicada al inicio. Pasos del siguiente bloque en [CONFIGURACION_FIREBASE.md](CONFIGURACION_FIREBASE.md).

## Endpoints

| Ruta | Quién |
|---|---|
| `POST /api/auth/register` · `login` · `refresh`, `GET /api/auth/me` | Público / autenticado |
| `GET /api/books` (`?q=&category=&updatedSince=`), `GET /api/books/:id` | Autenticado |
| `GET /api/openapi.json` · `GET /api/docs` | Público (especificación OpenAPI y Swagger UI) |
| `GET /api/books/:id/cover` | Público |
| `PUT /api/books/:id/cover` | Bibliotecario |
| `GET /api/loans`, `GET /api/loans/:id`, `POST /api/loans` (idempotente por `clientRequestId`) | Autenticado / estudiante |
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

## Despliegue propio verificado en D02

Sitio y API: https://biblioteca-api-2026.vercel.app. Swagger: https://biblioteca-api-2026.vercel.app/api/docs. Proyecto biblioteca-api-2026 en el equipo Biblioteca Aiden, plan Hobby; Firebase biblioteca-aiden-2026, Spark. La integración GitHub está limitada a este repositorio.

Variables de servidor en Vercel: FIREBASE_PROJECT_ID, FIREBASE_WEB_API_KEY, FIREBASE_CLIENT_EMAIL y FIREBASE_PRIVATE_KEY. Se configuraron como sensibles para Production/Preview; no usar NEXT_PUBLIC_*. La clave admite saltos de línea reales o barras n escapadas. No incluir secretos en vercel.json ni en el cliente.

Recorrido: estudiante inicia sesión, abre un libro y solicita; bibliotecario entra a Gestión de préstamos y presta/rechaza o registra devolución. requested no reserva, approved descuenta y returned repone. La cookie web es HttpOnly/SameSite lax/Secure en producción. La API usa Bearer y refresh; los permisos se verifican en servidor.

Para reproducir API: obtener tokens con POST /api/auth/login; enviar Authorization: Bearer <idToken> a GET /api/books y POST /api/loans con bookId y un clientRequestId estable. Repetir la misma intención devuelve el mismo préstamo (201 inicial,200 repetición). Un librarian usa PATCH /api/loans/<id> con action approve, reject o return. Ver esquemas/errores reales en OpenAPI; no copiar tokens a archivos versionados.

Verificación pública: ciclo completo, competencia por el último ejemplar, devolución única, idempotencia simultánea/tardía,403 roles,404 ajenos,400/409, portadas y cursor. Las cuentas principales tienen login/me/rol/listas comprobados; contraseñas solo en la documentación privada de entrega. Pruebas locales:52 casos únicos, con15 afectados reejecutados al corregir prerender; tipos/lint/build correctos.

Límites: validación de imagen por firma/tipo/tamaño, sin decodificación completa. El móvil no se desarrolló en D02. El repositorio se mantiene privado; el acceso docente se resolverá en el cierre de entrega.
