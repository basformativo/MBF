
import { createDirectus, rest, staticToken } from '@directus/sdk';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

const client = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(ADMIN_TOKEN));

async function checkPermissionsSchema() {
    try {
        // @ts-ignore
        const permissions = await client.request(() => ({
            path: '/permissions',
            method: 'GET',
            params: { limit: 1 }
        }));
        console.log("Estructura de un permiso:");
        console.log(JSON.stringify(permissions.data[0], null, 2));
    } catch (e: any) {
        console.error("Error:", e.message);
    }
}

checkPermissionsSchema();
