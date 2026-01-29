
import { createDirectus, rest, staticToken, updateField } from '@directus/sdk';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

const client = createDirectus(DIRECTUS_URL)
    .with(rest())
    .with(staticToken(ADMIN_TOKEN));

async function hideInternalFields() {
    const collectionsToFix = ['cursos', 'clases', 'categorias', 'instructores', 'compras', 'accesos_cursos', 'progreso_clases', 'comentarios', 'certificados'];
    const fieldsToHide = ['id', 'date_created', 'date_updated'];

    try {
        console.log("Ocultando campos automáticos de los formularios...");

        for (const collection of collectionsToFix) {
            for (const field of fieldsToHide) {
                try {
                    await client.request(updateField(collection, field, {
                        meta: {
                            hidden: true
                        }
                    }));
                    console.log(`- Campo '${field}' oculto en '${collection}'.`);
                } catch (e) {
                    // Algunos campos pueden no existir en todas las colecciones, ignoramos errores menores
                }
            }
        }

        console.log("¡Hecho! Los formularios ahora están limpios de campos técnicos.");
    } catch (e: any) {
        console.error("Error general:", e.message);
    }
}

hideInternalFields();
