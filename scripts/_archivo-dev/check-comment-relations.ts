
import { createDirectus, rest, staticToken, readRelations } from '@directus/sdk';
import * as dotenv from 'dotenv';

dotenv.config();

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || '';
const ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN || '';

const client = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(ADMIN_TOKEN));

async function checkRelations() {
    try {
        console.log('Fetching relations for "comentarios"...');
        const relations = await client.request(readRelations());
        const commentRelations = relations.filter((r: any) => r.collection === 'comentarios');

        console.log(`Found ${commentRelations.length} relations for "comentarios":`);
        commentRelations.forEach((r: any) => {
            console.log(`- ${r.field} -> ${r.related_collection}`);
        });

    } catch (e: any) {
        console.error('Error:', e.message || e);
    }
}

checkRelations();
