
import { createDirectus, rest, staticToken, createItems, readItems } from '@directus/sdk';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

const client = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(ADMIN_TOKEN));

async function seedFullCourse() {
    try {
        console.log("Creando curso completo de prueba...");

        // 1. Obtener IDs de categorías e instructores existentes
        const cats = await client.request(readItems('categorias'));
        const insts = await client.request(readItems('instructores'));

        if (cats.length === 0 || insts.length === 0) {
            throw new Error("Faltan categorías o instructores iniciales. Por favor, crea al menos uno en Directus.");
        }

        const courseId = crypto.randomUUID();

        // 2. Crear el Curso
        await client.request(createItems('cursos', [{
            id: courseId,
            titulo: "Tecnificación Individual Avanzada",
            slug: "tecnificacion-individual-avanzada",
            descripcion: "<h3>Domina los fundamentos técnicos</h3><p>Este curso está diseñado para jugadores y entrenadores que buscan perfeccionar el tiro, el drible y la técnica individual bajo presión. Incluye análisis biomecánico y ejercicios prácticos de alto nivel.</p>",
            descripcion_corta: "Lleva tu técnica individual al siguiente nivel profesional.",
            nivel: "avanzado",
            precio: 75.00,
            moneda: "USD",
            estado: "publicado",
            destacado: true
        }]));

        // 3. Vincular Categoría (M2M)
        await client.request(createItems('cursos_categorias', [{
            curso: courseId,
            categoria: cats[0].id
        }]));

        // 4. Vincular Instructor (M2M)
        await client.request(createItems('cursos_instructores', [{
            curso: courseId,
            instructor: insts[0].id,
            rol: 'principal'
        }]));

        // 5. Crear 3 Clases vinculadas al curso
        await client.request(createItems('clases', [
            {
                id: crypto.randomUUID(),
                curso: courseId,
                titulo: "Clase 1: Mecánica de Tiro",
                slug: "mecanica-de-tiro",
                descripcion: "Análisis completo de la posición de pies, agarre y seguimiento.",
                contenido: "## Guía de Tiro\n1. Estabilidad\n2. Dirección\n3. Finalización.",
                orden: 1,
                es_gratis: true,
                fecha_publicacion: new Date().toISOString()
            },
            {
                id: crypto.randomUUID(),
                curso: courseId,
                titulo: "Clase 2: El Drible Progresivo",
                slug: "drible-progresivo",
                descripcion: "Manejo de balón con ambas manos y cambios de ritmo.",
                contenido: "## Ejercicios\n- Zig zag con cambio por delante\n- Cambio entre piernas bajo presión.",
                orden: 2,
                es_gratis: false,
                fecha_publicacion: new Date().toISOString()
            },
            {
                id: crypto.randomUUID(),
                curso: courseId,
                titulo: "Clase 3: Movimientos en el Poste",
                slug: "movimientos-poste",
                descripcion: "Juego de pies y finalizaciones cerca del aro.",
                contenido: "## Tácticas\n- Drop step\n- Baby hook con mano izquierda.",
                orden: 3,
                es_gratis: false,
                fecha_publicacion: new Date().toISOString()
            }
        ]));

        console.log("¡Éxito! Curso 'Tecnificación Individual Avanzada' creado con 3 clases.");

    } catch (e: any) {
        console.error("Error:", e.message);
    }
}

seedFullCourse();
