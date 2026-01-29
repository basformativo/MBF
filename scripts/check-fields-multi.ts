
import { createDirectus, rest, staticToken, readFields } from '@directus/sdk';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

const client = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(ADMIN_TOKEN));

async function listAllFields() {
    try {
        console.log("=== TODOS LOS CAMPOS DE TODAS LAS COLECCIONES ===");
        const fields = await client.request(readFields());
        const myCollections = ['cursos', 'clases', 'noticias', 'instructores', 'categorias'];

        for (const col of myCollections) {
            console.log(`\n📦 ${col.toUpperCase()}:`);
            fields.filter(f => f.collection === col).forEach(f => {
                console.log(`  - ${f.field}`);
            });
        }
    } catch (e: any) {
        console.error("Error:", e.message);
    }
}

listAllFields();
