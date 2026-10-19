# Procedencia y adaptación

## Verificación y ajustes D02 del 19 de octubre

Se conservaron transacciones, máquina de estados, DAL web y OpenAPI docentes. La integración propia confirmó idempotencia simultánea, competencia por el último ejemplar, devolución concurrente, permisos y portadas: 50 controles/47 HTTP sobre Firebase real con fixtures aisladas. No se ejecutó el smoke docente porque su limpieza restaura inventario y elimina portadas de libros existentes; se utilizó un runner local fuera del repositorio que borra únicamente sus fixtures.

Dos fallos reales motivaron cambios mínimos: createLoanSchema ahora restringe bookId a letras ASCII, números, guion y guion bajo (IDs usados por el catálogo), para responder 400 a rutas malformadas en lugar de 500; sniffImageType comprueba los ocho bytes de firma PNG en lugar de cuatro. Dos pruebas de regresión fallaron antes y pasan después. La firma no equivale a decodificar completamente una imagen. Manifiesto y lockfile permanecen intactos.

## Integración propia D01 del 18 de octubre

Se configuró Firebase exclusivo biblioteca-aiden-2026 y se verificó Auth/Firestore con 27 controles dirigidos, 14 HTTP. No cambió código de producción, dependencias ni lockfile respecto a la base adaptada. Se reutilizaron scripts y rutas existentes, incluida siembra sin reset dos veces. Se actualizaron README y CONFIGURACION_FIREBASE con resultados reales; el JSON de servicio, .env y credenciales técnicas están fuera de Git. Préstamos, portadas y web completa siguen pendientes D02. Helpers/evidencias/Word del estudiante viven fuera del repositorio conforme a la organización del paquete.

Base autorizada: [library-api de Justo Jasmany Jaramillo Olarte](https://github.com/justojaramillo/library-api).
Revisión conservada: `1870eaddf1cf248c4e74d7d69bb8aa59e6fe94ae`, recuperada durante la preparación del 17/10/2026.

El código docente se reutiliza para la actividad de Desarrollo Móvil. No se atribuye su autoría original al estudiante. Se conservan sus comentarios y avisos. No se copió su historial Git ni se configuró su remoto como destino propio. No se encontró un archivo LICENSE en esa revisión; la autorización académica consta en el correo del docente conservado fuera de este repositorio. No se añade una licencia nueva sobre el material ajeno.

## Avance independiente de D01 realizado en D00 el 17/10/2026

- Incorporación de la base completa para conservar sus dependencias y contratos. Préstamos, portadas, sesión web y OpenAPI están presentes, pero su verificación funcional corresponde a D02.
- Manifiesto, lockfile y pnpm-workspace.yaml conservados. Gestor disponible: pnpm 11.25.0; declarado por la referencia: 11.2.2. Se comprueba instalación con `--frozen-lockfile`, sin cambiar dependencias ni configuración global.
- Exclusiones privadas del repositorio vacío conservadas y combinadas con las docentes.
- Guías PDF y docs docentes no duplicados en el repositorio de producto: permanecen en el paquete privado de contexto. Los enlaces oficiales se incluyen en README.
- Pruebas adicionales de catálogo y servicio de autenticación con dobles en las fronteras Firebase/HTTP. No sustituyen integración con Firebase propio.

No se usaron las demos docentes ni del compañero para escribir datos. Los informes, fuentes académicas privadas y Word permanecen fuera del repositorio de producto.
