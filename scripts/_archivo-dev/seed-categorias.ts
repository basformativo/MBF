
import { createDirectus, rest, staticToken, createItems } from '@directus/sdk';
import { v4 as uuidv4 } from 'uuid'; // We need to install uuid or just use a simple random string for now if it's not strictly validated as uuid format in SDK (it usually is)
// Actually, let's just use crypto.randomUUID() if available in node environment (Node 19+) or a polyfill.
// Since we are in a potentially older environment or just want to be safe, I'll use a simple helper.

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

const client = createDirectus(DIRECTUS_URL)
    .with(rest())
    .with(staticToken(ADMIN_TOKEN));

const categorias = [
    {
        id: crypto.randomUUID(),
        nombre: "Mini Básquet",
        slug: "mini-basquet",
        descripcion: "Cursos enfocados en la enseñanza para niños de 5 a 12 años. Fundamentos, juegos y pedagogía infantil."
    },
    {
        id: crypto.randomUUID(),
        nombre: "Tecnificación Individual",
        slug: "tecnificacion",
        descripcion: "Desarrollo de habilidades técnicas específicas: tiro, bote, finalizaciones y juego de pies."
    },
    {
        id: crypto.randomUUID(),
        nombre: "Táctica y Estrategia",
        slug: "tactica",
        descripcion: "Sistemas ofensivos, defensivos, scouting y lectura de juego para entrenadores de niveles competitivos."
    },
    {
        id: crypto.randomUUID(),
        nombre: "Preparación Física",
        slug: "fisico",
        descripcion: "Entrenamiento condicional, fuerza, velocidad y prevención de lesiones aplicado al baloncesto."
    },
    {
        id: crypto.randomUUID(),
        nombre: "Psicología Deportiva",
        slug: "psicologia",
        descripcion: "Herramientas de liderazgo, motivación, gestión de grupo y fortaleza mental."
    },
    {
        id: crypto.randomUUID(),
        nombre: "Dirección de Equipo",
        slug: "direccion-equipo",
        descripcion: "Metodología de entrenamiento, planificación de temporada y gestión de vestuario."
    }
];

async function seedCategorias() {
    try {
        console.log('Insertando categorías de ejemplo con UUIDs manuales...');
        await client.request(createItems('categorias', categorias));
        console.log('Categorías creadas correctamente.');
    } catch (e: any) {
        console.error('Error insertando categorías:', e?.errors?.[0]?.message || e.message);
    }
}

seedCategorias();
