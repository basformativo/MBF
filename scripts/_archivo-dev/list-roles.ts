
import { createDirectus, rest, staticToken, readRoles } from '@directus/sdk';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

const client = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(ADMIN_TOKEN));

async function listRolesExtended() {
    try {
        const roles = await client.request(readRoles());
        console.log(JSON.stringify(roles, null, 2));
    } catch (e: any) {
        console.error("Error:", e.message);
    }
}

listRolesExtended();
