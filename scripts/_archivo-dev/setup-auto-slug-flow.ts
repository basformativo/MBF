
import { createDirectus, rest, staticToken, createFlow, createOperation, readFlows, deleteFlow } from '@directus/sdk';
import * as dotenv from 'dotenv';
dotenv.config();

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || '';
const ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN || '';

const client = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(ADMIN_TOKEN));

async function setupAutoSlugFlow() {
    try {
        console.log("Limpiando configuración previa si existe...");
        const existingFlows = await client.request(readFlows({
            filter: { name: { _eq: 'Auto Slug Cursos y Clases' } }
        }));
        
        for (const f of existingFlows) {
            console.log(`Eliminando flow antiguo: ${f.id}`);
            await client.request(deleteFlow(f.id));
        }

        console.log("Iniciando configuración de Flow para Slug automático...");

        // 1. Crear el Flow
        const flowResponse = await client.request(createFlow({
            name: 'Auto Slug Cursos y Clases',
            icon: 'link',
            status: 'active',
            trigger: 'event',
            accountability: 'all',
            options: {
                type: 'filter',
                scope: ['items.create', 'items.update'],
                collections: ['cursos', 'clases']
            }
        }));
        const flowId = (flowResponse as any).id;
        console.log(`✅ Flow creado con ID: ${flowId}`);

        // 2. Crear la Operación
        const scriptCode = `
module.exports = async function(data) {
    const payload = data.payload;
    // Si ya trae slug, no hacemos nada
    if (payload.slug) return payload;

    const textToSlug = payload.titulo || payload.nombre;
    if (textToSlug) {
        payload.slug = textToSlug
            .toString()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\\u0300-\\u036f]/g, '')
            .replace(/\\s+/g, '-')
            .replace(/[^\\w\\-]+/g, '')
            .replace(/\\-\\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    }
    return payload;
};`.trim();

        await client.request(createOperation({
            name: 'Slugify Title',
            key: 'slugify',
            type: 'exec-script',
            position_x: 20,
            position_y: 20,
            options: {
                code: scriptCode
            },
            flow: flowId
        }));

        console.log("✅ Operación 'Run Script' vinculada al Flow.");
        console.log("🚀 ¡Configuración completada con éxito!");

    } catch (e: any) {
        console.error("❌ Error configurando el Flow:");
        if (e.errors) {
            console.error(JSON.stringify(e.errors, null, 2));
        } else {
            console.error(e.message || e);
        }
    }
}

setupAutoSlugFlow();
