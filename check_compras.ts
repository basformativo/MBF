
import { createDirectus, rest, staticToken, readItems } from '@directus/sdk';

const DIRECTUS_URL = 'https://directuscontrol.basketformativo.com';
const ADMIN_TOKEN = 'WmX7KmV0IYu8uqyJoUnt7lCLRlDO-_9a';

const adminClient = createDirectus(DIRECTUS_URL)
    .with(rest())
    .with(staticToken(ADMIN_TOKEN));

async function checkStatuses() {
    try {
        const items = await adminClient.request(readItems('compras' as any, {
            fields: ['id', 'estado', 'usuario']
        }));
        console.log('--- Listado de compras ---');
        console.table(items);
    } catch (error) {
        console.error('Error:', error);
    }
}

checkStatuses();
