
import { createDirectus, rest, staticToken, updateCollection, updateField } from '@directus/sdk';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

const client = createDirectus(DIRECTUS_URL)
    .with(rest())
    .with(staticToken(ADMIN_TOKEN));

async function fixClasesRelation() {
    try {
        console.log("Configurando visualización de Cursos en las Clases...");

        // 1. Asegurar que la colección 'cursos' muestre el 'titulo' por defecto
        await client.request(updateCollection('cursos', {
            meta: {
                display_template: '{{titulo}}'
            }
        }));
        console.log("Colección 'cursos' configurada para mostrar 'titulo'.");

        // 2. Asegurar que el campo 'curso' en 'clases' sea un selector amigable
        await client.request(updateField('clases', 'curso', {
            meta: {
                interface: 'select-relational', // O 'many-to-one'
                display: 'related-values',
                display_options: {
                    template: '{{titulo}}'
                },
                width: 'full'
            }
        }));
        console.log("Campo 'curso' en 'clases' actualizado.");

        console.log("¡Listo! Ahora al crear una clase podrás elegir el curso por su nombre.");

    } catch (e: any) {
        console.error("Error:", e.message || e);
    }
}

fixClasesRelation();
