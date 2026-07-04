
import { createDirectus, rest, staticToken } from '@directus/sdk';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

const client = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(ADMIN_TOKEN));

async function setPublicPermissions() {
    const collections = [
        'cursos', 'clases', 'instructores', 'categorias',
        'cursos_instructores', 'cursos_categorias', 'noticias',
        'directus_files'
    ];

    console.log("Configurando permisos públicos de lectura...");

    // El ID del rol público suele ser este UUID fijo en Directus
    const PUBLIC_ROLE = 'null'; // In API we usually use role: null for public

    try {
        for (const col of collections) {
            try {
                // Intentamos crear el permiso de lectura
                // @ts-ignore
                await client.request(() => ({
                    path: '/permissions',
                    method: 'POST',
                    body: JSON.stringify({
                        role: null,
                        collection: col,
                        action: 'read',
                        permissions: {},
                        validation: null,
                        fields: ['*']
                    })
                }));
                console.log(`- Lectura pública activada para '${col}'.`);
            } catch (e: any) {
                console.log(`- '${col}' ya tiene permisos o hubo un error: ${e.message}`);
            }
        }
        console.log("¡Hecho! Ahora los datos deberían ser accesibles sin token.");
    } catch (error: any) {
        console.error("Error general:", error.message);
    }
}

setPublicPermissions();
