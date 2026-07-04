
import { createDirectus, rest, readItems, staticToken } from '@directus/sdk';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

async function testConnection() {
    console.log("Probando conexión a Directus...");
    console.log("URL:", DIRECTUS_URL);

    const client = createDirectus(DIRECTUS_URL)
        .with(rest())
        .with(staticToken(ADMIN_TOKEN));

    try {
        console.log("Intentando leer colección 'cursos'...");
        const result = await client.request(readItems('cursos', {
            fields: ['id', 'titulo', 'estado']
        }));

        console.log("¡Éxito! Cursos encontrados:", result.length);
        result.forEach(c => console.log(`- [${c.estado}] ${c.titulo}`));

        if (result.length === 0) {
            console.log("Advertencia: No hay cursos en la base de datos.");
        } else {
            const publicados = result.filter(c => c.estado === 'publicado');
            if (publicados.length === 0) {
                console.log("Ojo: Tienes cursos pero ninguno está en estado 'publicado'. La web filtra por publicados.");
            }
        }

    } catch (e: any) {
        console.error("Error detallado:");
        if (e.response) {
            console.error("Status:", e.response.status);
            console.error("Data:", JSON.stringify(e.response.data, null, 2));
        } else {
            console.error("Mensaje:", e.message);
        }
    }
}

testConnection();
