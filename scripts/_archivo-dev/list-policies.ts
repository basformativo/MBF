
import { createDirectus, rest, staticToken } from '@directus/sdk';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

const client = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(ADMIN_TOKEN));

async function listPolicies() {
    try {
        // @ts-ignore
        const policies = await client.request(() => ({
            path: '/policies',
            method: 'GET'
        }));
        console.log(JSON.stringify(policies, null, 2));
    } catch (e: any) {
        console.error("Error:", e.message);
    }
}

listPolicies();
