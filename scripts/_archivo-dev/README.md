# Archivo de scripts de desarrollo

Esta carpeta contiene scripts sueltos (`.ts`, ejecutables con `npx tsx <archivo>.ts`)
usados durante el armado inicial del proyecto y para tareas puntuales de debug
contra Directus: setup de colecciones y roles, fixes de slugs, chequeos de
campos/relaciones, seeds de datos de prueba, etc.

No forman parte de la aplicación (`app/`) ni se ejecutan en producción o en el
build de Next.js — quedan acá solo como referencia histórica y por si hace
falta reutilizar alguno para una tarea similar en el futuro.

Requieren las mismas variables de entorno que la app (ver `.env.example` en la
raíz), generalmente cargadas vía `dotenv.config({ path: '.env.local' })`.
