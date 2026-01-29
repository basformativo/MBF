
import { createDirectus, rest, staticToken, createItem } from '@directus/sdk';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import FormData from 'form-data';
import axios from 'axios';

dotenv.config({ path: '.env.local' });

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || '';
const ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN || '';

const client = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(ADMIN_TOKEN));

async function uploadFile(filePath: string, title: string) {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    form.append('title', title);

    try {
        const response = await axios.post(`${DIRECTUS_URL}/files`, form, {
            headers: {
                ...form.getHeaders(),
                'Authorization': `Bearer ${ADMIN_TOKEN}`
            }
        });
        return response.data.data.id;
    } catch (error: any) {
        console.error(`Error uploading ${title}:`, error.response?.data || error.message);
        return null;
    }
}

async function seedTeam() {
    console.log('Starting team seeding...');

    // Members data
    const members = [
        {
            nombre: 'Damián',
            apellido: 'Ruiz',
            titulo: 'Fundador & CEO',
            email: 'damian@basquetformativo.com',
            orden: 1,
            imagePath: 'C:/Users/Damian/.gemini/antigravity/brain/0e7b8c69-2056-4b39-b3ce-ec82e6f68cdb/staff_ceo_portrait_1769725923605.png'
        },
        {
            nombre: 'Silvia',
            apellido: 'Conti',
            titulo: 'Directora Académica',
            email: 'silvia@basquetformativo.com',
            orden: 2,
            imagePath: 'C:/Users/Damian/.gemini/antigravity/brain/0e7b8c69-2056-4b39-b3ce-ec82e6f68cdb/staff_academic_portrait_1769725936186.png'
        }
    ];

    for (const member of members) {
        console.log(`Processing ${member.nombre} ${member.apellido}...`);

        const photoId = await uploadFile(member.imagePath, `${member.nombre} Profile`);

        if (photoId) {
            await client.request(createItem('equipo', {
                nombre: member.nombre,
                apellido: member.apellido,
                titulo: member.titulo,
                email: member.email,
                orden: member.orden,
                foto: photoId
            }));
            console.log(`Successfully added ${member.nombre} to Directus.`);
        }
    }

    console.log('Team seeding completed!');
}

seedTeam().catch(console.error);
