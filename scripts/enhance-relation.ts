
import { createDirectus, rest, staticToken, updateRelation, createField } from '@directus/sdk';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

const client = createDirectus(DIRECTUS_URL)
    .with(rest())
    .with(staticToken(ADMIN_TOKEN));

async function enhanceRelation() {
    try {
        console.log('Enhancing clases -> cursos relationship...');

        // 1. Create O2M alias field in 'cursos' (optional but good for UI)
        // Usually updating the relation with 'one_field' is enough, Directus creates the alias?
        // Let's try updating relation first.

        await client.request(updateRelation('clases', 'curso', {
            meta: {
                one_field: 'clases', // Error might occur if field doesn't exist? Directus usually handles this in UI.
                one_collection: 'cursos',
                many_collection: 'clases',
                many_field: 'curso'
            }
        }));
        console.log('Relation updated with one_field: clases');

    } catch (e: any) {
        console.error('Error updating relation:', e.message);
        // If it fails, maybe we need to create the field "clases" in "cursos" first?
        // "alias" fields are needed for O2M.
        try {
            console.log('Attempting to create alias field classes in cursos...');
            await client.request(createField('cursos', {
                field: 'clases',
                type: 'alias',
                meta: {
                    interface: 'list-o2m',
                    special: ['o2m'],
                    display: 'related-values'
                }
            }));
            // Try update relation again
            await client.request(updateRelation('clases', 'curso', {
                meta: {
                    one_field: 'clases'
                }
            }));
            console.log('Relation updated after creating alias.');
        } catch (e2: any) {
            console.error('Final error:', e2.message);
        }
    }
}

enhanceRelation();
