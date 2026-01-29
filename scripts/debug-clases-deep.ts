
import { createDirectus, rest, staticToken, readItems } from '@directus/sdk';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

const client = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(ADMIN_TOKEN));

async function debugClasesDeep() {
    const slug = 'basquet-formativo-fundamentos';
    try {
        console.log("Intentando fetch de clases con campos limitados...");
        const res = await client.request(readItems('cursos', {
            filter: { slug: { _eq: slug } },
            fields: ['id', { clases: ['titulo', 'orden'] }],
            limit: 1
        }));
        console.log("Éxito:", JSON.stringify(res, null, 2));

    } catch (e: any) {
        console.error("Error:", e.response?.status, e.response?.data);
    }
}

debugClasesDeep();
