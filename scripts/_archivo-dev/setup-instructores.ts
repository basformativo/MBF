
import { createDirectus, rest, staticToken, createField, updateRelation, updateCollection, createItems } from '@directus/sdk';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

const client = createDirectus(DIRECTUS_URL)
    .with(rest())
    .with(staticToken(ADMIN_TOKEN));

async function setupInstructores() {
    try {
        console.log("Configurando relación M2M Cursos <-> Instructores...");

        // 1. Configurar colecciones para mostrar nombres por defecto
        await client.request(updateCollection('instructores', {
            meta: { display_template: '{{nombre}} {{apellido}}' }
        }));

        // 2. Crear campos alias M2M
        try {
            await client.request(createField('cursos', {
                field: 'instructores',
                type: 'alias',
                meta: {
                    interface: 'list-m2m',
                    special: ['m2m'],
                    display: 'related-values',
                    display_options: { template: '{{instructor.nombre}} {{instructor.apellido}}' }
                }
            }));
        } catch (e) { }

        try {
            await client.request(createField('instructores', {
                field: 'cursos',
                type: 'alias',
                meta: {
                    interface: 'list-m2m',
                    special: ['m2m'],
                    display: 'related-values',
                    display_options: { template: '{{curso.titulo}}' }
                }
            }));
        } catch (e) { }

        // 3. Vincular relaciones
        try {
            await client.request(updateRelation('cursos_instructores', 'curso', {
                meta: { one_field: 'instructores', junction_field: 'instructor' }
            }));
            await client.request(updateRelation('cursos_instructores', 'instructor', {
                meta: { one_field: 'cursos', junction_field: 'curso' }
            }));
        } catch (e) { }

        console.log("Creando instructores de ejemplo...");
        const instructores = [
            {
                id: crypto.randomUUID(),
                nombre: "Manu",
                apellido: "Ginóbili",
                bio: "Leyenda del básquetbol mundial, 4 veces campeón de la NBA y Oro Olímpico. Especialista en lectura de juego y técnica individual.",
                especialidad: "Técnica individual y Mentalidad",
                experiencia_anios: 25,
                email: "manu@basquetformativo.com"
            },
            {
                id: crypto.randomUUID(),
                nombre: "Sergio",
                apellido: "Hernández",
                bio: "Entrenador histórico de la Selección Argentina. Especialista en táctica colectiva y liderazgo de equipos de alto rendimiento.",
                especialidad: "Táctica y Estrategia",
                experiencia_anios: 30,
                email: "oveja@basquetformativo.com"
            }
        ];

        await client.request(createItems('instructores', instructores));
        console.log("Instructores creados y conexión configurada.");

    } catch (e: any) {
        console.error("Error:", e.message);
    }
}

setupInstructores();
