
import { createDirectus, rest, staticToken, readFields, updateField } from '@directus/sdk';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

const client = createDirectus(DIRECTUS_URL)
    .with(rest())
    .with(staticToken(ADMIN_TOKEN));

async function automateFields() {
    try {
        console.log("Configurando automatización de campos...");

        // 1. Configurar SLUG automático para Cursos (basado en titulo)
        await client.request(updateField('cursos', 'slug', {
            meta: {
                interface: 'slug',
                options: {
                    template: '{{titulo}}'
                }
            }
        }));
        console.log("Slug automático configurado para Cursos.");

        // 2. Configurar SLUG automático para Clases (basado en titulo)
        await client.request(updateField('clases', 'slug', {
            meta: {
                interface: 'slug',
                options: {
                    template: '{{titulo}}'
                }
            }
        }));
        console.log("Slug automático configurado para Clases.");

        // 3. Configurar SLUG automático para Categorias (basado en nombre)
        await client.request(updateField('categorias', 'slug', {
            meta: {
                interface: 'slug',
                options: {
                    template: '{{nombre}}'
                }
            }
        }));
        console.log("Slug automático configurado para Categorías.");

        // 4. Verificar Fechas (ya deberían estar, pero aseguramos)
        // Directus usa campos especiales: date_created y date_updated
        // Ya los creamos con special: ['date-created'] etc.

        console.log("¡Todo listo! IDs, Slugs y Fechas ahora se gestionan automáticamente.");

    } catch (e: any) {
        console.error("Error:", e.message || e);
    }
}

automateFields();
