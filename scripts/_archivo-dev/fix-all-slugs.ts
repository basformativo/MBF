
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

async function fixAllSlugs() {
    try {
        // Fix Course Slugs
        console.log('Fetching all courses...');
        const courses = await client.request(readItems('cursos', {
            fields: ['id', 'titulo', 'slug']
        }));

        for (const course of courses) {
            if (!course.slug) {
                const newSlug = generateSlug(course.titulo);
                console.log(`Fixing slug for course: "${course.titulo}" -> "${newSlug}"`);
                await client.request(updateItem('cursos', course.id, {
                    slug: newSlug
                }));
            }
        }

        // Fix Class Slugs
        console.log('\nFetching all classes...');
        const clases = await client.request(readItems('clases', {
            fields: ['id', 'titulo', 'slug']
        }));

        for (const clase of clases) {
            if (!clase.slug) {
                const newSlug = generateSlug(clase.titulo);
                console.log(`Fixing slug for class: "${clase.titulo}" -> "${newSlug}"`);
                await client.request(updateItem('clases', clase.id, {
                    slug: newSlug
                }));
            }
        }

        console.log('\nFinished fixing all slugs.');

    } catch (e: any) {
        console.error('Error:', e.message || e);
    }
}

fixAllSlugs();
