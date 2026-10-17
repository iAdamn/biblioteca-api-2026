# Procedencia y adaptación

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
