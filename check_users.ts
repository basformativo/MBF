
import { createDirectus, rest, staticToken, readUsers } from '@directus/sdk';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const DIRECTUS_URL = 'https://directuscontrol.basketformativo.com';
const ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;

if (!ADMIN_TOKEN) {
    throw new Error('DIRECTUS_ADMIN_TOKEN no está definida. Configurala en .env.local antes de ejecutar este script.');
}

const adminClient = createDirectus(DIRECTUS_URL)
    .with(rest())
    .with(staticToken(ADMIN_TOKEN));

async function checkUsers() {
    try {
        const users = await adminClient.request(readUsers({
            filter: { status: { _neq: 'active' } },
            fields: ['id', 'email', 'status', 'first_name']
        }));
        console.log('--- Usuarios no activos ---');
        console.table(users);
    } catch (error) {
        console.error('Error:', error);
    }
}

checkUsers();
