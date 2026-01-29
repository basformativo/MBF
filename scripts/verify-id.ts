
import { createDirectus, rest, staticToken, readField } from '@directus/sdk';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

const client = createDirectus(DIRECTUS_URL)
    .with(rest())
    .with(staticToken(ADMIN_TOKEN));

async function verifyId() {
    try {
        const field = await client.request(readField('cursos', 'id'));
        console.log("Meta for ID in cursos:", JSON.stringify(field.meta, null, 2));
    } catch (e: any) {
        console.error("Error:", e.message);
    }
}

verifyId();
