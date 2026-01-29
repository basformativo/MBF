
import { createDirectus, rest, staticToken, updateField } from '@directus/sdk';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

const client = createDirectus(DIRECTUS_URL)
    .with(rest())
    .with(staticToken(ADMIN_TOKEN));

async function fixClassSelectorDropdown() {
    try {
        console.log("Setting interface to select-dropdown-m2o for Clases -> Curso...");
        await client.request(updateField('clases', 'curso', {
            meta: {
                interface: 'select-dropdown-m2o',
                options: {
                    template: '{{titulo}}'
                },
                display: 'related-values',
                display_options: {
                    template: '{{titulo}}'
                }
            }
        }));
        console.log("Updated to 'select-dropdown-m2o'.");

    } catch (e: any) {
        console.error("Error:", e.message);
    }
}

fixClassSelectorDropdown();
