
import { createDirectus, rest, staticToken, readFields } from '@directus/sdk';
import * as dotenv from 'dotenv';

dotenv.config();

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || '';
const ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN || '';

const client = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(ADMIN_TOKEN));

async function checkCommentFields() {
    try {
        console.log('Checking fields for "comentarios"...');
        const fields = await client.request(readFields('comentarios'));

        console.log('Fields found:');
        fields.forEach((f: any) => {
            console.log(`- ${f.field} (${f.type})`);
        });

    } catch (e: any) {
        console.error('Error checking fields:', e.message || e);
    }
}

checkCommentFields();
