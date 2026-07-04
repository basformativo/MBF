
import { createDirectus, rest, staticToken, readItems } from '@directus/sdk';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

async function debugSlugFetch() {
    const client = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(ADMIN_TOKEN));
    const slug = 'basquet-formativo-fundamentos';

    try {
        console.log(`Buscando curso con slug: ${slug}`);
        const result = await client.request(readItems('cursos', {
            filter: { slug: { _eq: slug } },
            fields: [
                '*',
                { categorias: [{ categoria: ['*'] }] },
                { instructores: [{ instructor: ['*'] }] },
                { clases: ['*'] }
            ],
            limit: 1
        }));

        console.log("Resultado del fetch:", JSON.stringify(result, null, 2));

    } catch (e: any) {
        console.error("Error capturado en el script:");
        if (e.response) {
            console.error("Status:", e.response.status);
            console.error("Data:", JSON.stringify(e.response.data, null, 2));
        } else {
            console.error("Error Object:", e);
        }
    }
}

debugSlugFetch();
