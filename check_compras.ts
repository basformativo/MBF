
import { createDirectus, rest, staticToken, readItems } from '@directus/sdk';
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
