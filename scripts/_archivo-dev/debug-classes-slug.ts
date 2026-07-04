
import { createDirectus, rest, staticToken, readItems } from '@directus/sdk';
import * as dotenv from 'dotenv';

dotenv.config();

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || '';
const ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN || '';

const client = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(ADMIN_TOKEN));

async function debugClasses() {
    try {
        const slug = 'basquet-formativo-fundamentos';
        console.log(`Checking course: ${slug}`);

        const courses = await client.request(readItems('cursos', {
            filter: { slug: { _eq: slug } },
            limit: 1
        }));

        if (courses.length === 0) {
            console.log('Course not found');
            return;
        }

        const course = courses[0];
        console.log(`Course ID: ${course.id}`);

        const clases = await client.request(readItems('clases', {
            filter: { curso: { _eq: course.id } }
        }));

        console.log(`Found ${clases.length} classes:`);
        clases.forEach((c: any) => {
            console.log(`- Title: ${c.titulo}, Slug: ${c.slug}, ID: ${c.id}`);
        });

    } catch (e: any) {
        console.error('Error:', e.message || e);
    }
}

debugClasses();
