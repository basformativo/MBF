
import { createDirectus, rest, staticToken, createField, updateRelation, readRelations } from '@directus/sdk';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

const client = createDirectus(DIRECTUS_URL)
    .with(rest())
    .with(staticToken(ADMIN_TOKEN));

async function setupM2M() {
    try {
        console.log("Configurando relación Many-to-Many Cursos <-> Categorías...");

        // 1. Asegurar campo alias en 'cursos'
        try {
            await client.request(createField('cursos', {
                field: 'categorias',
                type: 'alias',
                meta: {
                    interface: 'list-m2m',
                    special: ['m2m'],
                    display: 'related-values',
                    display_options: {
                        template: '{{categoria.nombre}}'
                    }
                }
            }));
            console.log("Campo alias 'categorias' creado en 'cursos'.");
        } catch (e: any) {
            console.log("Campo alias 'categorias' ya existe o hubo un error:", e.message);
        }

        // 2. Asegurar campo alias en 'categorias'
        try {
            await client.request(createField('categorias', {
                field: 'cursos',
                type: 'alias',
                meta: {
                    interface: 'list-m2m',
                    special: ['m2m'],
                    display: 'related-values',
                    display_options: {
                        template: '{{curso.titulo}}'
                    }
                }
            }));
            console.log("Campo alias 'cursos' creado en 'categorias'.");
        } catch (e: any) {
            console.log("Campo alias 'cursos' ya existe o hubo un error:", e.message);
        }

        // 3. Actualizar relaciones para conectar los alias
        // Relación curso -> junction
        try {
            await client.request(updateRelation('cursos_categorias', 'curso', {
                meta: {
                    one_field: 'categorias',
                    junction_field: 'categoria'
                }
            }));
            console.log("Relación cursos_categorias.curso actualizada.");
        } catch (e: any) {
            console.log("Error actualizando relación curso:", e.message);
        }

        // Relación categoria -> junction
        try {
            await client.request(updateRelation('cursos_categorias', 'categoria', {
                meta: {
                    one_field: 'cursos',
                    junction_field: 'curso'
                }
            }));
            console.log("Relación cursos_categorias.categoria actualizada.");
        } catch (e: any) {
            console.log("Error actualizando relación categoria:", e.message);
        }

        console.log("Configuración M2M finalizada.");

    } catch (e: any) {
        console.error("Error general:", e.message || e);
    }
}

setupM2M();
