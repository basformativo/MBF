
import { createDirectus, rest, staticToken, readItems } from '@directus/sdk';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

const client = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(ADMIN_TOKEN));

async function checkImages() {
    try {
        console.log("Verificando imágenes en los cursos...");
        const result = await client.request(readItems('cursos', {
            fields: ['id', 'titulo', 'imagen_portada']
        }));

        result.forEach(c => {
            console.log(`- Curso: ${c.titulo}`);
            console.log(`  Imagen ID: ${c.imagen_portada || 'NULO'}`);
        });

    } catch (e: any) {
        console.error("Error:", e.message);
    }
}

checkImages();
