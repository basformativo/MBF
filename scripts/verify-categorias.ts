
import { createDirectus, rest, staticToken, readItems } from '@directus/sdk';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

const client = createDirectus(DIRECTUS_URL)
    .with(rest())
    .with(staticToken(ADMIN_TOKEN));

async function listCategorias() {
    try {
        console.log('Verificando categorías en Directus...');
        const cats = await client.request(readItems('categorias'));
        console.log('------------------------------');
        console.log(`Total encontrado: ${cats.length}`);
        cats.forEach((c: any) => {
            console.log(`- ${c.nombre} (${c.slug})`);
        });
        console.log('------------------------------');
    } catch (e: any) {
        console.error('Error leyendo categorías:', e.message);
    }
}

listCategorias();
