
import { createDirectus, rest, staticToken, readItems } from '@directus/sdk';
import * as dotenv from 'dotenv';

dotenv.config();

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || '';
const ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN || '';

const client = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(ADMIN_TOKEN));

async function checkComments() {
    try {
        console.log('Fetching comments...');
        const result = await client.request(readItems('comentarios' as any, {
            fields: ['*']
        }));

        console.log(`Found ${result.length} comments.`);
        if (result.length > 0) {
            console.log('First comment:', JSON.stringify(result[0], null, 2));
        }

    } catch (e: any) {
        console.error('Error:', e.message || e);
        if (e.response?.data) {
            console.error('Response data:', JSON.stringify(e.response.data, null, 2));
        }
    }
}

checkComments();
