
import { createDirectus, rest, staticToken, createRelation } from '@directus/sdk';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

const client = createDirectus(DIRECTUS_URL)
    .with(rest())
    .with(staticToken(ADMIN_TOKEN));

async function setupRelations() {
    const relations = [
        { collection: 'clases', field: 'curso', related: 'cursos' },
        { collection: 'cursos_instructores', field: 'curso', related: 'cursos' },
        { collection: 'cursos_instructores', field: 'instructor', related: 'instructores' },
        { collection: 'cursos_categorias', field: 'curso', related: 'cursos' },
        { collection: 'cursos_categorias', field: 'categoria', related: 'categorias' },
        { collection: 'perfiles_alumnos', field: 'usuario', related: 'directus_users' },
        { collection: 'compras', field: 'usuario', related: 'directus_users' },
        { collection: 'compras', field: 'curso', related: 'cursos' },
        { collection: 'accesos_cursos', field: 'usuario', related: 'directus_users' },
        { collection: 'accesos_cursos', field: 'curso', related: 'cursos' },
        { collection: 'progreso_clases', field: 'usuario', related: 'directus_users' },
        { collection: 'progreso_clases', field: 'curso', related: 'cursos' },
        { collection: 'progreso_clases', field: 'clase', related: 'clases' },
        { collection: 'comentarios', field: 'usuario', related: 'directus_users' },
        { collection: 'comentarios', field: 'curso', related: 'cursos' },
        { collection: 'comentarios', field: 'clase', related: 'clases' },
        { collection: 'certificados', field: 'usuario', related: 'directus_users' },
        { collection: 'certificados', field: 'curso', related: 'cursos' },
    ];

    for (const r of relations) {
        console.log(`Setting up ${r.collection}.${r.field} -> ${r.related}`);
        try {
            await client.request(createRelation({
                collection: r.collection,
                field: r.field,
                related_collection: r.related,
                schema: { onDelete: 'SET NULL' }
            }));
            console.log('Success');
        } catch (e: any) {
            console.log(`Error:`, e?.errors?.[0]?.message || e.message);
        }
    }
}

setupRelations();
