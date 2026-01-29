
import { createDirectus, rest, staticToken, readRelation, readFields } from '@directus/sdk';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

const client = createDirectus(DIRECTUS_URL)
    .with(rest())
    .with(staticToken(ADMIN_TOKEN));

async function checkClasesRelation() {
    try {
        console.log("Checking fields in 'clases'...");
        const fields = await client.request(readFields('clases'));
        const cursoField = fields.find(f => f.field === 'curso');
        console.log("Field 'curso' in 'clases':", cursoField);

        if (cursoField) {
            console.log("Checking relations for 'clases'...");
            try {
                const relation = await client.request(readRelation('clases', 'curso'));
                console.log("Relation found:", relation);
            } catch (e: any) {
                console.log("Error reading relation (might not exist):", e.message || e);
            }
        }

    } catch (e: any) {
        console.error("Error reading fields:", e.message || e);
    }
}

checkClasesRelation();
