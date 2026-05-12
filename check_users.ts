
import { createDirectus, rest, staticToken, readUsers } from '@directus/sdk';

const DIRECTUS_URL = 'https://directuscontrol.basketformativo.com';
const ADMIN_TOKEN = 'WmX7KmV0IYu8uqyJoUnt7lCLRlDO-_9a';

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
