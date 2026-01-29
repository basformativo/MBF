
import { createDirectus, rest, staticToken, createCollection, createField, createItems } from '@directus/sdk';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

const client = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(ADMIN_TOKEN));

async function setupNews() {
    try {
        console.log("Creando colección 'noticias'...");
        await client.request(createCollection({
            collection: 'noticias',
            schema: { name: 'noticias' },
            meta: { note: 'Artículos y noticias del sitio' },
            fields: [
                {
                    field: 'id',
                    type: 'uuid',
                    meta: { hidden: true },
                    schema: { is_primary_key: true, has_auto_increment: false }
                }
            ]
        }));

        const fields = [
            { field: 'titulo', type: 'string' },
            { field: 'slug', type: 'string', meta: { interface: 'slug', options: { template: '{{titulo}}' } } },
            { field: 'fecha', type: 'string' },
            { field: 'categoria', type: 'string' },
            { field: 'imagen', type: 'uuid', meta: { interface: 'file-image' } },
            { field: 'resumen', type: 'text' },
            { field: 'contenido', type: 'text', meta: { interface: 'input-rich-text-html' } },
            { field: 'autor', type: 'string' },
            { field: 'date_created', type: 'timestamp', meta: { special: ['date-created'], hidden: true } },
            { field: 'id', type: 'uuid', meta: { special: ['uuid'], hidden: true } }
        ];

        for (const f of fields) {
            try {
                await client.request(createField('noticias', f));
            } catch (e) { }
        }

        console.log("Insertando noticias de ejemplo...");
        await client.request(createItems('noticias', [
            {
                id: crypto.randomUUID(),
                titulo: "La importancia del Mini-Básquet",
                slug: "importancia-mini-basquet",
                fecha: "2026-03-10",
                categoria: "Metodología",
                resumen: "Analizamos cómo las primeras etapas formativas influyen decisivamente.",
                contenido: "<p>El Mini-Básquet es fundamental...</p>",
                autor: "Laura Martínez"
            }
        ]));

        console.log("Colección 'noticias' lista.");
    } catch (error: any) {
        console.error("Error:", error.message);
    }
}

setupNews();
