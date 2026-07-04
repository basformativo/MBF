
import { createDirectus, rest, staticToken, readCollections } from '@directus/sdk';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

const client = createDirectus(DIRECTUS_URL)
    .with(rest())
    .with(staticToken(ADMIN_TOKEN));

async function list() {
    try {
        const collections = await client.request(readCollections());
        console.log('Collections:', collections.map(c => c.collection));
    } catch (e) {
        console.error(e);
    }
}

list();
