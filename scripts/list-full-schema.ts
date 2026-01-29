
import { createDirectus, rest, staticToken, readCollections, readFields } from '@directus/sdk';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

const client = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(ADMIN_TOKEN));

async function listSchema() {
    try {
        const collections = await client.request(readCollections());
        const appCollections = collections.filter(c => !c.collection.startsWith('directus_'));

        console.log("=== ESTRUCTURA COMPLETA DE BASE DE DATOS ===");

        for (const col of appCollections) {
            console.log(`\n📦 COLECICÓN: ${col.collection.toUpperCase()}`);
            const fields = await client.request(readFields(col.collection));
            fields.forEach(f => {
                const type = f.type;
                const fieldName = f.field;
                const isHidden = f.meta?.hidden ? ' (Oculto)' : '';
                console.log(`  - ${fieldName} [${type}]${isHidden}`);
            });
        }

    } catch (e: any) {
        console.error("Error obteniendo el esquema:", e.message);
    }
}

listSchema();
