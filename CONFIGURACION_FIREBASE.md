# Configurar Firebase propio en D01

D01 del 18/10/2026: proyecto propio `biblioteca-aiden-2026` operativo en Spark. Authentication email/password habilitado, Firestore Standard `(default)` en `nam5` con reglas de producción y app web `biblioteca-web` sin Hosting. `.env` local privado configurado. Pasaron 27 controles reales, incluidas 14 peticiones HTTP, registro/login/refresh/me, catálogo/búsqueda/detalle y segunda siembra sin cambios. Las instrucciones siguientes permiten reproducir la configuración con credenciales propias; nunca usar las demos del profesor.

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

## Importación local sin enviar secretos al chat

Como alternativa a editar .env manualmente, guardar dentro de la carpeta hermana `privado/` (fuera de este repositorio):

- `firebase-service-account.json`: JSON descargado del proyecto propio.
- `firebase-web-api-key.txt`: solo la apiKey de la configuración web del mismo proyecto.

Desde `C:\!Codex\Biblioteca_Desarrollo_Movil_2026`, ejecutar el importador de documentación con el ID real confirmado:

```powershell
node documentacion/herramientas/configurar_firebase.mjs biblioteca-aiden-2026
```

El importador verifica proyecto/correo de servicio/clave, comprueba que Git excluye .env y crea el archivo sin sobrescribirlo ni imprimir sus valores. La coincidencia de la clave API web se acredita después con las operaciones reales. Este helper es herramienta local del paquete de documentación; no vive en los repositorios de producto ni contiene secretos.

## Comprobación dirigida de D01

Tras configurar .env, iniciar API local en `127.0.0.1:3118` desde library_api con `pnpm exec next start -H 127.0.0.1 -p 3118`. La build de D00 puede reutilizarse mientras el código no cambie. Desde la raíz del paquete:

```powershell
node --env-file=library_api/.env documentacion/herramientas/verificar_d01.mjs biblioteca-aiden-2026
```

El comprobador requiere que el ID confirmado coincida con FIREBASE_PROJECT_ID y usa exclusivamente HTTP local. Verifica acceso Admin/Auth/Firestore, ejecuta seed sin reset dos veces y compara documentos, registra un estudiante real de prueba y comprueba login/refresh/me, catálogo/búsqueda/detalle, protección401, credenciales incorrectas y libro ausente404. Guarda evidencias redactadas en evidencias/D01_FECHA_REAL/ y los accesos de esa cuenta solo en privado/d01_estudiante.json. Si se repite, reutiliza esa cuenta sin borrar datos. No crea el bibliotecario ni verifica préstamos/portadas/Vercel. Las respuestas esperadas no cuentan como resultados hasta ejecutar con Firebase propio.
