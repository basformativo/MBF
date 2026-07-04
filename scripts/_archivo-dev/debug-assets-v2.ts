
import { createDirectus, rest, staticToken, readItems } from '@directus/sdk';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

const client = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(ADMIN_TOKEN));

async function debugAssetsCorrectly() {
    try {
        console.log("Verificando archivos en Directus (Raw API)...");
        // @ts-ignore
        const files = await client.request(() => ({
            path: '/files',
            method: 'GET'
        }));

        console.log(`Encontrados ${files.data.length} archivos.`);
        files.data.forEach((f: any) => {
            console.log(`- ID: ${f.id} | Nombre: ${f.filename_download}`);
        });

        const courses = await client.request(readItems('cursos', {
            fields: ['titulo', 'Imagen_Portada']
        }));

        console.log("\nAsignación en Cursos:");
        courses.forEach(c => {
            const imgId = typeof c.Imagen_Portada === 'object' ? (c.Imagen_Portada as any)?.id : c.Imagen_Portada;
            console.log(`- ${c.titulo}: ${imgId}`);
        });

    } catch (e: any) {
        console.error("Error:", e.message);
    }
}

debugAssetsCorrectly();
