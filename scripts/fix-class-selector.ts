
import { createDirectus, rest, staticToken, readField, updateField } from '@directus/sdk';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

const client = createDirectus(DIRECTUS_URL)
    .with(rest())
    .with(staticToken(ADMIN_TOKEN));

async function fixClassSelector() {
    try {
        const field = await client.request(readField('clases', 'curso'));
        console.log("Current field meta:", JSON.stringify(field.meta, null, 2));

        console.log("Forcing M2O interface for Classes -> Courses...");
        await client.request(updateField('clases', 'curso', {
            meta: {
                interface: 'select-relational',
                display: 'related-values',
                display_options: {
                    template: '{{titulo}}'
                }
            }
        }));
        console.log("Successfully updated to 'select-relational'.");

    } catch (e: any) {
        console.error("Error:", e.message);
    }
}

fixClassSelector();
