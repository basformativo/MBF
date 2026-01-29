
import { createDirectus, rest, staticToken, createCollection } from '@directus/sdk';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

const client = createDirectus(DIRECTUS_URL)
    .with(rest())
    .with(staticToken(ADMIN_TOKEN));

async function createCursos() {
    try {
        console.log(`Creando colección: cursos`);
        await client.request(createCollection({
            collection: 'cursos',
            schema: { name: 'cursos' },
            meta: { note: 'Cursos disponibles' },
            fields: [
                {
                    field: 'id',
                    type: 'uuid',
                    meta: { hidden: true, interface: 'input' },
                    schema: { is_primary_key: true, has_auto_increment: false }
                }
            ]
        }));
        console.log('Cursos creado exitosamente');
    } catch (e: any) {
        console.error('Error creando cursos:', JSON.stringify(e, null, 2));
    }
}

createCursos();
