
import { createDirectus, rest, staticToken, updateRole } from '@directus/sdk';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

const client = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(ADMIN_TOKEN));

async function linkRolePolicy() {
    const ALUMNO_ROLE_ID = 'c6d89d18-ac96-4281-8567-f88e36838980';
    const POLICY_ID = '4ba84ce0-ab71-4a36-b650-eb286367029e';

    try {
        console.log("Vinculando rol a política vía SDK...");
        await client.request(updateRole(ALUMNO_ROLE_ID, {
            // @ts-ignore
            policies: [POLICY_ID]
        }));
        console.log("¡Hecho!");
    } catch (e: any) {
        console.error("Error SDK:", e.message);
    }
}

linkRolePolicy();
