
import { createDirectus, rest, staticToken, readItems } from '@directus/sdk';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

const client = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(ADMIN_TOKEN));

async function debugAssets() {
    try {
        console.log("Verificando archivos en Directus...");
        const files = await client.request(readItems('directus_files', {
            limit: 5
        }));

        console.log(`Encontrados ${files.length} archivos.`);
        files.forEach(f => {
            console.log(`- ID: ${f.id} | Nombre: ${f.filename_download}`);
            console.log(`  URL probable: ${DIRECTUS_URL}/assets/${f.id}`);
        });

        const courses = await client.request(readItems('cursos', {
            fields: ['titulo', 'Imagen_Portada']
        }));

        console.log("\nAsignación en Cursos:");
        courses.forEach(c => {
            console.log(`- ${c.titulo}: ${c.Imagen_Portada}`);
        });

    } catch (e: any) {
        console.error("Error:", e.message);
    }
}

debugAssets();
