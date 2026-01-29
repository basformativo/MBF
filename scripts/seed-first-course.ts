
import { createDirectus, rest, staticToken, createItems, readItems } from '@directus/sdk';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

const client = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(ADMIN_TOKEN));

async function seedInitialCourse() {
    try {
        console.log("Verificando existencia de cursos...");
        const existing = await client.request(readItems('cursos'));

        if (existing.length > 0) {
            console.log("Ya existen cursos. Asegúrate de poner uno en estado 'publicado' en el panel.");
            return;
        }

        console.log("Creando curso de prueba inicial...");
        // 1. Buscamos una categoría para asociar
        const cats = await client.request(readItems('categorias'));
        const catId = cats[0]?.id;

        // 2. Buscamos un instructor
        const insts = await client.request(readItems('instructores'));
        const instId = insts[0]?.id;

        const courseId = crypto.randomUUID();

        await client.request(createItems('cursos', [{
            id: courseId,
            titulo: "Básquet Formativo: Los Fundamentos",
            slug: "basquet-formativo-fundamentos",
            descripcion: "<p>Aprende las bases del básquet moderno.</p>",
            descripcion_corta: "El curso esencial para todo entrenador que empieza.",
            nivel: "principiante",
            precio: 49.99,
            moneda: "USD",
            estado: "publicado",
            destacado: true
        }]));

        if (catId) {
            await client.request(createItems('cursos_categorias', [{
                curso: courseId,
                categoria: catId
            }]));
        }

        if (instId) {
            await client.request(createItems('cursos_instructores', [{
                curso: courseId,
                instructor: instId,
                rol: 'principal'
            }]));
        }

        console.log("¡Curso de prueba creado y publicado!");

    } catch (e: any) {
        console.error("Error al poblar datos:", e.message);
    }
}

seedInitialCourse();
