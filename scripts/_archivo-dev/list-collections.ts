
import { createDirectus, rest, staticToken, readCollections } from '@directus/sdk';
import * as dotenv from 'dotenv';

dotenv.config();

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || '';
const ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN || '';

const client = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(ADMIN_TOKEN));

async function listCollections() {
    try {
        console.log('Listing collections...');
        const collections = await client.request(readCollections());

        console.log('Collections:');
        collections.forEach((c: any) => {
            if (!c.collection.startsWith('directus_')) {
                console.log(`- ${c.collection}`);
            }
        });

    } catch (e: any) {
        console.error('Error:', e.message || e);
    }
}

listCollections();
