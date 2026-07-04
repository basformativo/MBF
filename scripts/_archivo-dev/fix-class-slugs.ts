
import { createDirectus, rest, staticToken, readItems, updateItem } from '@directus/sdk';
import * as dotenv from 'dotenv';

dotenv.config();

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || '';
const ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN || '';

const client = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(ADMIN_TOKEN));

function generateSlug(text: string) {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

async function fixClassSlugs() {
    try {
        console.log('Fetching all classes...');
        const clases = await client.request(readItems('clases', {
            fields: ['id', 'titulo', 'slug']
        }));

        console.log(`Found ${clases.length} classes.`);

        for (const clase of clases) {
            if (!clase.slug) {
                const newSlug = generateSlug(clase.titulo);
                console.log(`Fixing slug for: "${clase.titulo}" -> "${newSlug}"`);

                await client.request(updateItem('clases', clase.id, {
                    slug: newSlug
                }));
            } else {
                console.log(`Class "${clase.titulo}" already has slug: ${clase.slug}`);
            }
        }

        console.log('Finished fixing slugs.');

    } catch (e: any) {
        console.error('Error:', e.message || e);
    }
}

fixClassSlugs();
