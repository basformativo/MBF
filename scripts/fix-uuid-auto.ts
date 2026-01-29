
import { createDirectus, rest, staticToken, updateField } from '@directus/sdk';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

const client = createDirectus(DIRECTUS_URL)
    .with(rest())
    .with(staticToken(ADMIN_TOKEN));

async function fixAutoUUID() {
    const collections = [
        'cursos', 'clases', 'instructores', 'categorias', 'cursos_instructores',
        'cursos_categorias', 'perfiles_alumnos', 'compras', 'accesos_cursos',
        'progreso_clases', 'comentarios', 'certificados'
    ];

    console.log("Configurando generación automática de UUID para los IDs...");

    for (const collection of collections) {
        try {
            await client.request(updateField(collection, 'id', {
                schema: {
                    default_value: 'NEXTVAL' // This is for sequences, but for UUID we usually use a function or special flag
                },
                meta: {
                    special: ['uuid'],
                    interface: 'uuid', // or 'input' with hidden: true
                    readonly: true,
                    hidden: true
                }
            }));
            console.log(`- ID de '${collection}' configurado para autogenerar UUID.`);
        } catch (e: any) {
            console.error(`- Error en '${collection}':`, e.message);

            // Intentamos otra forma si la primera falla, usando el flag 'uuid' en special
            try {
                await client.request(updateField(collection, 'id', {
                    meta: {
                        special: ['uuid'],
                        hidden: true
                    }
                }));
                console.log(`- ID de '${collection}' re-intentado con special: uuid.`);
            } catch (e2: any) {
                console.error(`- Error crítico en '${collection}':`, e2.message);
            }
        }
    }

    console.log("Proceso terminado. Por favor intenta crear un registro ahora.");
}

fixAutoUUID();
