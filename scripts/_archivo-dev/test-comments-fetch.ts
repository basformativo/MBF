
import { createDirectus, rest, staticToken, readItems } from '@directus/sdk';
import * as dotenv from 'dotenv';

dotenv.config();

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || '';
const ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN || '';

const client = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(ADMIN_TOKEN));

async function checkComments() {
    try {
        console.log('Fetching comments with specific fields...');
        const result = await client.request(readItems('comentarios' as any, {
            fields: [
                '*',
                { usuario: ['id', 'first_name', 'last_name'] }
            ]
        }));

        console.log(`Found ${result.length} comments.`);

    } catch (e: any) {
        console.error('Error:', e.message || e);
        if (e.errors) {
            console.error('Errors details:', JSON.stringify(e.errors, null, 2));
        }
    }
}

checkComments();
