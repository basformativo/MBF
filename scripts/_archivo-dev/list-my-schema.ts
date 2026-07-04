
import { createDirectus, rest, staticToken, readFields } from '@directus/sdk';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

const client = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(ADMIN_TOKEN));

const myCollections = [
    'cursos', 'clases', 'instructores', 'cursos_instructores',
    'categorias', 'cursos_categorias', 'perfiles_alumnos',
    'compras', 'accesos_cursos', 'progreso_clases',
    'comentarios', 'certificados'
];

async function listSchema() {
    try {
        console.log("=== RESUMEN DE CAMPOS POR COLECCIÓN ===");

        for (const collection of myCollections) {
            console.log(`\n📦 ${collection.toUpperCase()}`);
            const fields = await client.request(readFields(collection));
            fields.forEach(f => {
                // Solo mostrar campos que no sean técnicos de sistema ocultos si queremos limpieza, 
                // pero el usuario pidió "cada campo". Mostraremos todos los relevantes.
                const hidden = f.meta?.hidden ? '[Oculto]' : '';
                console.log(`  |- ${f.field} (${f.type}) ${hidden}`);
            });
        }

    } catch (e: any) {
        console.error("Error:", e.message);
    }
}

listSchema();
