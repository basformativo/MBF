
import { createDirectus, rest, staticToken, readFields } from '@directus/sdk';
import * as dotenv from 'dotenv';

dotenv.config();

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || '';
const ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN || '';

const client = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(ADMIN_TOKEN));

async function checkFields() {
    try {
        console.log('Fetching fields for "comentarios"...');
        // readFields() returns all fields of all collections
        const fields = await client.request(readFields());
        const commentFields = fields.filter((f: any) => f.collection === 'comentarios');

        console.log(`Found ${commentFields.length} fields for "comentarios":`);
        commentFields.forEach((f: any) => {
            console.log(`- ${f.field} (Type: ${f.type})`);
        });

    } catch (e: any) {
        console.error('Error:', e.message || e);
    }
}

checkFields();
