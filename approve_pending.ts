
import { createDirectus, rest, staticToken, readItems, readItem, createItem, updateItem } from '@directus/sdk';

const DIRECTUS_URL = 'https://directuscontrol.basketformativo.com';
const ADMIN_TOKEN = 'WmX7KmV0IYu8uqyJoUnt7lCLRlDO-_9a';

const adminClient = createDirectus(DIRECTUS_URL)
    .with(rest())
    .with(staticToken(ADMIN_TOKEN));

async function approveAllPending() {
    console.log('--- Iniciando aprobación masiva ---');
    console.log('URL:', DIRECTUS_URL);
    try {
        const pending = await adminClient.request(readItems('compras' as any, {
            filter: {
                _or: [
                    { estado: { _eq: 'pendiente' } },
                    { estado: { _null: true } }
                ]
            }
        }));

        console.log(`Encontradas ${pending.length} solicitudes pendientes.`);

        for (const solicitud of pending as any[]) {
            console.log(`Procesando solicitud ${solicitud.id} para usuario ${solicitud.usuario}...`);

            // 1. Crear acceso
            const existing = await adminClient.request(readItems('accesos_cursos', {
                filter: {
                    usuario: { _eq: solicitud.usuario },
                    curso: { _eq: solicitud.curso },
                }
            }));

            if ((existing as any[]).length === 0) {
                await adminClient.request(createItem('accesos_cursos', {
                    usuario: solicitud.usuario,
                    curso: solicitud.curso,
                    activo: true,
                }));
                console.log('   - Acceso creado.');
            } else {
                await adminClient.request(updateItem('accesos_cursos', (existing as any[])[0].id, { activo: true }));
                console.log('   - Acceso actualizado.');
            }

            // 2. Marcar compra como aprobada
            await adminClient.request(updateItem('compras' as any, solicitud.id, {
                estado: 'aprobado',
                estado_pago: 'aprobado'
            }));
            console.log(`   - Compra ${solicitud.id} aprobada.`);
        }

        console.log('--- Proceso completado con éxito ---');
    } catch (error) {
        console.error('Error durante la aprobación masiva:', error);
    }
}

approveAllPending();
