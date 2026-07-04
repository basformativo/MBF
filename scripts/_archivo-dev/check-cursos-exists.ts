
import { createDirectus, rest, staticToken, readCollection } from '@directus/sdk';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

const client = createDirectus(DIRECTUS_URL)
    .with(rest())
    .with(staticToken(ADMIN_TOKEN));

async function check() {
    try {
        const c = await client.request(readCollection('cursos'));
        console.log('Curso collection found:', c);
    } catch (e: any) {
        console.error('Error reading cursos:', e.message);
    }
}

check();
