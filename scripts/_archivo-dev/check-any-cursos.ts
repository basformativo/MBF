
import { createDirectus, rest, staticToken, readItems } from '@directus/sdk';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

const client = createDirectus(DIRECTUS_URL)
    .with(rest())
    .with(staticToken(ADMIN_TOKEN));

async function checkCursos() {
    try {
        const items = await client.request(readItems('cursos'));
        console.log(`Cursos found: ${items.length}`);
        items.forEach(i => console.log(`- ${i.titulo}`));
    } catch (e: any) {
        console.error("Error:", e.message);
    }
}

checkCursos();
