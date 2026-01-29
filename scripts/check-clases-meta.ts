
import { createDirectus, rest, staticToken, readCollection } from '@directus/sdk';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

const client = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(ADMIN_TOKEN));

async function checkClasesCollection() {
    try {
        const col = await client.request(readCollection('clases'));
        console.log("Metadata de Clases:", JSON.stringify(col.meta, null, 2));
    } catch (e: any) {
        console.error("No se puede leer la metadata de 'clases':", e.message);
    }
}

checkClasesCollection();
