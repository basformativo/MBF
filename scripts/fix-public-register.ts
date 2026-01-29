
import { createDirectus, rest, staticToken, createPermission } from '@directus/sdk';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

const client = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(ADMIN_TOKEN));

async function fixPublicRegister() {
    const PUBLIC_POLICY_ID = 'abf8a154-5b1c-4a46-ac9c-7300570f4f17';
    try {
        console.log("Habilitando registro público...");
        await client.request(createPermission({
            // @ts-ignore
            policy: PUBLIC_POLICY_ID,
            collection: 'directus_users',
            action: 'create',
            fields: ['email', 'password', 'first_name', 'last_name', 'role']
        }));
        console.log("¡Registro público habilitado!");
    } catch (e: any) {
        console.error("Error:", e.message);
    }
}

fixPublicRegister();
