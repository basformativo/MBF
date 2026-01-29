
import { createDirectus, rest, staticToken, updateCollection, updateField } from '@directus/sdk';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

const client = createDirectus(DIRECTUS_URL)
    .with(rest())
    .with(staticToken(ADMIN_TOKEN));

async function fixDisplay() {
    try {
        console.log("Setting display template for 'categorias' collection...");
        await client.request(updateCollection('categorias', {
            meta: {
                display_template: '{{nombre}}'
            }
        }));

        console.log("Updating 'categorias' field in 'cursos' to show name in interface...");
        await client.request(updateField('cursos', 'categorias', {
            meta: {
                interface: 'list-m2m',
                options: {
                    enableCreate: true,
                    enableSelect: true,
                    template: '{{categoria.nombre}}'
                },
                display: 'related-values',
                display_options: {
                    template: '{{categoria.nombre}}'
                }
            }
        }));

        console.log("Updating 'cursos' field in 'categorias' as well...");
        await client.request(updateField('categorias', 'cursos', {
            meta: {
                interface: 'list-m2m',
                options: {
                    template: '{{curso.titulo}}'
                },
                display: 'related-values',
                display_options: {
                    template: '{{curso.titulo}}'
                }
            }
        }));

        console.log("Display configuration updated successfully.");
    } catch (e: any) {
        console.error("Error updating display:", e.message);
    }
}

fixDisplay();
