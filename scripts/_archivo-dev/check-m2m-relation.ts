
import { createDirectus, rest, staticToken, readFields, readRelations } from '@directus/sdk';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

const client = createDirectus(DIRECTUS_URL)
    .with(rest())
    .with(staticToken(ADMIN_TOKEN));

async function checkM2MRelation() {
    try {
        console.log("Checking relations involving 'cursos_categorias'...");
        const relations = await client.request(readRelations());
        const m2mRelations = relations.filter(r => r.collection === 'cursos_categorias');
        console.log("Relations for 'cursos_categorias':", JSON.stringify(m2mRelations, null, 2));

        const cursoFields = await client.request(readFields('cursos'));
        console.log("Fields in 'cursos':", cursoFields.map(f => f.field));

    } catch (e: any) {
        console.error("Error:", e.message || e);
    }
}

checkM2MRelation();
