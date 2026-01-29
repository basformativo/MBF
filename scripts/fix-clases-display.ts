
import { createDirectus, rest, staticToken, updateField } from '@directus/sdk';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

const client = createDirectus(DIRECTUS_URL)
    .with(rest())
    .with(staticToken(ADMIN_TOKEN));

async function fixClasesDisplay() {
    try {
        console.log("Corrigiendo la visualización del curso en la lista de clases...");

        await client.request(updateField('clases', 'curso', {
            meta: {
                display: 'related-values',
                display_options: {
                    template: '{{titulo}}'
                }
            }
        }));

        console.log("¡Hecho! Ahora deberías ver el título del curso en la tabla de clases.");
    } catch (e: any) {
        console.error("Error:", e.message || e);
    }
}

fixClasesDisplay();
