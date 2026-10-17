# Configurar Firebase propio en D01

Estado 17/10/2026: no existe proyecto de esta actividad ni archivo `.env` configurado. Nombre propuesto por el usuario: `biblioteca-aiden-2026`; el ID definitivo depende de disponibilidad. No se configurará hoy D00.

## Acciones en Firebase Console

1. En [Firebase Console](https://console.firebase.google.com/), crear un proyecto nuevo exclusivo para Biblioteca. Registrar el **ID real** asignado, aunque difiera del nombre sugerido. Google Analytics no es necesario para las funciones de esta actividad.
2. En Authentication, abrir los métodos de acceso y habilitar **Correo/contraseña**. No basta con crear un usuario en la consola si el proveedor sigue deshabilitado. [Referencia oficial](https://firebase.google.com/docs/auth/web/password-auth).
3. Crear Firestore en modo nativo, edición Standard, base `(default)`, con reglas de producción. Elegir región disponible apropiada antes de crearla. El Admin SDK del servidor utiliza IAM; no abrir las reglas públicas para que funcione esta aplicación. [Configuración oficial de bases](https://firebase.google.com/docs/firestore/manage-databases).
4. En Configuración del proyecto → Cuentas de servicio, generar una clave privada del Admin SDK. Guardar el JSON en una ubicación privada fuera de los repositorios. De sus campos se obtienen `project_id`, `client_email` y `private_key`. [Configuración oficial Admin SDK](https://firebase.google.com/docs/admin/setup).
5. En Configuración del proyecto → General, obtener la clave API web del mismo proyecto. Si no aparece, registrar una aplicación web para consultar su objeto de configuración y copiar `apiKey`. No hace falta integrar el SDK cliente de Firebase en Expo.
6. Copiar `.env.example` a `.env` dentro de `library_api` y sustituir los cuatro marcadores localmente. No pegar valores ni el JSON en el chat. Confirmar después únicamente que el archivo está listo y cuál es el ID del proyecto.

## Correspondencia de valores

| Variable de .env | Origen |
|---|---|
| FIREBASE_PROJECT_ID | project_id del JSON y del proyecto propio |
| FIREBASE_CLIENT_EMAIL | client_email del JSON de servicio |
| FIREBASE_PRIVATE_KEY | private_key completa, entre comillas dobles, con saltos escritos como \n |
| FIREBASE_WEB_API_KEY | apiKey de la configuración web del mismo proyecto |

Los cuatro valores deben pertenecer al mismo proyecto. `lib/env.ts` valida su presencia; `lib/firebase.ts` inicializa Admin de forma perezosa. Por eso una compilación sin secretos puede pasar y la integración seguir pendiente.

## Checkpoint de D01 después de configurar

Desde `library_api`: `git check-ignore .env` debe confirmar exclusión. No imprimir su contenido. Ejecutar `pnpm dev`, verificar el ID propio y revisar `scripts/seed.mts` antes de `pnpm seed` sin reset. El script contiene diez libros, conserva los existentes y no crea cuentas. Comprobar luego registro student, login, refresh, me, catálogo, búsqueda y detalle con peticiones al entorno propio. Guardar evidencias sin tokens ni contraseñas.

Las cuentas principales student/librarian se preparan y verifican en D02. El registro público siempre asigna student; librarian exige el mecanismo administrativo. No ejecutar smoke o reset-demo hasta revisar sus escrituras y confirmar destino. Vercel y sus variables pertenecen a D02. No hay despliegue creado ni facturación autorizada por esta guía.
