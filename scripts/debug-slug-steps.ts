
import { createDirectus, rest, staticToken, readItems } from '@directus/sdk';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

async function debugSlugFetchStepByStep() {
    const client = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(ADMIN_TOKEN));
    const slug = 'basquet-formativo-fundamentos';

    try {
        console.log("--- TEST 1: Solo categorías ---");
        const res1 = await client.request(readItems('cursos', {
            filter: { slug: { _eq: slug } },
            fields: ['id', { categorias: ['id'] }],
            limit: 1
        }));
        console.log("Test 1 OK");

        console.log("--- TEST 2: Solo instructores ---");
        const res2 = await client.request(readItems('cursos', {
            filter: { slug: { _eq: slug } },
            fields: ['id', { instructores: ['id'] }],
            limit: 1
        }));
        console.log("Test 2 OK");

        console.log("--- TEST 3: Solo clases ---");
        const res3 = await client.request(readItems('cursos', {
            filter: { slug: { _eq: slug } },
            fields: ['id', { clases: ['id'] }],
            limit: 1
        }));
        console.log("Test 3 OK");

    } catch (e: any) {
        console.error("Fallo detectado:");
        console.error("Status:", e.response?.status);
        console.error("Errors:", JSON.stringify(e.response?.data?.errors, null, 2));
    }
}

debugSlugFetchStepByStep();
