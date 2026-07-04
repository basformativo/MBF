
import { createDirectus, rest, staticToken, readFields } from '@directus/sdk';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

const client = createDirectus(DIRECTUS_URL)
    .with(rest())
    .with(staticToken(ADMIN_TOKEN));

async function checkFields() {
    try {
        const fields = await client.request(readFields('cursos'));
        console.log('Cursos fields:', fields.map(f => f.field));
    } catch (e) {
        console.error(e);
    }
}

checkFields();
