import {
    createDirectus,
    rest,
    staticToken,
    createCollection,
    createField,
    createRelation
} from '@directus/sdk';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://76.13.172.131:8055';
const DIRECTUS_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;

if (!DIRECTUS_TOKEN) {
    console.error('Error: DIRECTUS_ADMIN_TOKEN is not defined.');
    process.exit(1);
}

const client = createDirectus(DIRECTUS_URL)
    .with(rest())
    .with(staticToken(DIRECTUS_TOKEN));

async function createCollectionSafe(collection: string, options: any = {}) {
    try {
        await client.request(createCollection({
            collection,
            schema: {
                // @ts-ignore
                primary_key: 'id'
            },
            meta: options.meta || {},
            ...options
        }));
        console.log(`✅ Colección creada: ${collection}`);
    } catch (e: any) {
        if (e.errors?.[0]?.code === 'RECORD_NOT_UNIQUE' || e.errors?.[0]?.extensions?.code === 'RECORD_NOT_UNIQUE') {
            console.log(`⚠️ Colección ya existe: ${collection}`);
        } else {
            console.error(`❌ Error creando colección ${collection}:`, e);
        }
    }
}

async function createFieldSafe(collection: string, field: string, type: string, meta: any = {}, schema: any = {}) {
    try {
        await client.request(createField(collection, {
            field,
            type,
            meta,
            schema
        }));
        console.log(`  🔹 Campo creado: ${field} (${type}) en ${collection}`);
    } catch (e: any) {
        // Skip if already exists
    }
}

async function main() {
    console.log('--- Iniciando Configuración de Base de Datos Completa ---');

    // 1. INSTRUCTORES
    await createCollectionSafe('instructores', { meta: { note: 'Información de los instructores' } });
    await createFieldSafe('instructores', 'id', 'uuid', { interface: 'input', readonly: true }, { primary_key: true, has_auto_increment: false });
    await createFieldSafe('instructores', 'nombre', 'string', { interface: 'input' });
    await createFieldSafe('instructores', 'apellido', 'string', { interface: 'input' });
    await createFieldSafe('instructores', 'bio', 'text', { interface: 'input-multiline' });
    await createFieldSafe('instructores', 'foto', 'uuid', { interface: 'file' });
    await createFieldSafe('instructores', 'especialidad', 'string', { interface: 'input' });
    await createFieldSafe('instructores', 'experiencia_anios', 'integer', { interface: 'input' });
    await createFieldSafe('instructores', 'instagram', 'string', { interface: 'input' });
    await createFieldSafe('instructores', 'youtube', 'string', { interface: 'input' });
    await createFieldSafe('instructores', 'email', 'string', { interface: 'input' });

    // 2. CATEGORÍAS
    await createCollectionSafe('categorias', { meta: { note: 'Categorías de los cursos' } });
    await createFieldSafe('categorias', 'id', 'uuid', { interface: 'input' }, { primary_key: true });
    await createFieldSafe('categorias', 'nombre', 'string', { interface: 'input' });
    await createFieldSafe('categorias', 'slug', 'string', { interface: 'slug', options: { template: '{{nombre}}' } });
    await createFieldSafe('categorias', 'descripcion', 'text', { interface: 'input-multiline' });

    // 3. CURSOS
    await createCollectionSafe('cursos', { meta: { note: 'Cursos de la plataforma' } });
    await createFieldSafe('cursos', 'id', 'uuid', { interface: 'input' }, { primary_key: true });
    await createFieldSafe('cursos', 'titulo', 'string', { interface: 'input' });
    await createFieldSafe('cursos', 'slug', 'string', { interface: 'slug', options: { template: '{{titulo}}' } });
    await createFieldSafe('cursos', 'descripcion', 'text', { interface: 'wysiwyg' });
    await createFieldSafe('cursos', 'descripcion_corta', 'text', { interface: 'input-multiline' });
    await createFieldSafe('cursos', 'nivel', 'string', {
        interface: 'select-dropdown',
        options: {
            choices: [
                { text: 'Principiante', value: 'principiante' },
                { text: 'Intermedio', value: 'intermedio' },
                { text: 'Avanzado', value: 'avanzado' }
            ]
        }
    });
    await createFieldSafe('cursos', 'precio', 'decimal', { interface: 'input', options: { precision: 10, scale: 2 } });
    await createFieldSafe('cursos', 'moneda', 'string', { interface: 'input', options: { placeholder: 'USD, ARS' } });
    await createFieldSafe('cursos', 'imagen_portada', 'uuid', { interface: 'file' });
    await createFieldSafe('cursos', 'estado', 'string', {
        interface: 'select-dropdown',
        options: {
            choices: [
                { text: 'Borrador', value: 'borrador' },
                { text: 'Publicado', value: 'publicado' }
            ]
        }
    });
    await createFieldSafe('cursos', 'destacado', 'boolean', { interface: 'boolean' });
    await createFieldSafe('cursos', 'date_created', 'timestamp', { interface: 'datetime', readonly: true, special: ['date-created'] });
    await createFieldSafe('cursos', 'date_updated', 'timestamp', { interface: 'datetime', readonly: true, special: ['date-updated'] });

    // 4. CLASES
    await createCollectionSafe('clases', { meta: { note: 'Lecciones de cada curso' } });
    await createFieldSafe('clases', 'id', 'uuid', { interface: 'input' }, { primary_key: true });
    await createFieldSafe('clases', 'curso', 'uuid', { interface: 'select-dropdown-m2o' }, { foreign_key_table: 'cursos' });
    await createFieldSafe('clases', 'titulo', 'string', { interface: 'input' });
    await createFieldSafe('clases', 'slug', 'string', { interface: 'slug', options: { template: '{{titulo}}' } });
    await createFieldSafe('clases', 'descripcion', 'text', { interface: 'input-multiline' });
    await createFieldSafe('clases', 'contenido', 'text', { interface: 'wysiwyg' }); // Markdown o texto largo
    await createFieldSafe('clases', 'video', 'uuid', { interface: 'file' });
    await createFieldSafe('clases', 'video_url', 'string', { interface: 'input' });
    await createFieldSafe('clases', 'duracion', 'integer', { interface: 'input' }); // Minutos
    await createFieldSafe('clases', 'orden', 'integer', { interface: 'input' });
    await createFieldSafe('clases', 'es_gratis', 'boolean', { interface: 'boolean' });
    await createFieldSafe('clases', 'fecha_publicacion', 'timestamp', { interface: 'datetime' });

    // 5. JUNCTION TABLES (M2M)
    // Cursos <-> Instructores
    await createCollectionSafe('cursos_instructores');
    await createFieldSafe('cursos_instructores', 'id', 'integer', { interface: 'input', hidden: true }, { primary_key: true, has_auto_increment: true });
    await createFieldSafe('cursos_instructores', 'curso', 'uuid', {}, { foreign_key_table: 'cursos' });
    await createFieldSafe('cursos_instructores', 'instructor', 'uuid', {}, { foreign_key_table: 'instructores' });
    await createFieldSafe('cursos_instructores', 'rol', 'string', {
        interface: 'select-dropdown',
        options: {
            choices: [
                { text: 'Principal', value: 'principal' },
                { text: 'Asistente', value: 'asistente' }
            ]
        }
    });

    // Cursos <-> Categorías
    await createCollectionSafe('cursos_categorias');
    await createFieldSafe('cursos_categorias', 'id', 'integer', { interface: 'input', hidden: true }, { primary_key: true, has_auto_increment: true });
    await createFieldSafe('cursos_categorias', 'curso', 'uuid', {}, { foreign_key_table: 'cursos' });
    await createFieldSafe('cursos_categorias', 'categoria', 'uuid', {}, { foreign_key_table: 'categorias' });

    // 6. PERFILES DE ALUMNOS (Extends directus_users)
    await createCollectionSafe('perfiles_alumnos', { meta: { note: 'Datos adicionales de los alumnos' } });
    await createFieldSafe('perfiles_alumnos', 'id', 'uuid', { interface: 'input' }, { primary_key: true });
    await createFieldSafe('perfiles_alumnos', 'usuario', 'uuid', { interface: 'select-dropdown-m2o' }, { foreign_key_table: 'directus_users' });
    await createFieldSafe('perfiles_alumnos', 'nombre', 'string', { interface: 'input' });
    await createFieldSafe('perfiles_alumnos', 'apellido', 'string', { interface: 'input' });
    await createFieldSafe('perfiles_alumnos', 'avatar', 'uuid', { interface: 'file' });
    await createFieldSafe('perfiles_alumnos', 'nivel_juego', 'string', { interface: 'input' });
    await createFieldSafe('perfiles_alumnos', 'posicion', 'string', {
        interface: 'select-dropdown',
        options: {
            choices: [
                { text: 'Base', value: 'base' },
                { text: 'Escolta', value: 'escolta' },
                { text: 'Alero', value: 'alero' },
                { text: 'Ala-pívot', value: 'ala-pivot' },
                { text: 'Pívot', value: 'pivot' }
            ]
        }
    });

    // 7. COMPRAS
    await createCollectionSafe('compras', { meta: { note: 'Registro de compras' } });
    await createFieldSafe('compras', 'id', 'uuid', { interface: 'input' }, { primary_key: true });
    await createFieldSafe('compras', 'usuario', 'uuid', { interface: 'select-dropdown-m2o' }, { foreign_key_table: 'directus_users' });
    await createFieldSafe('compras', 'curso', 'uuid', { interface: 'select-dropdown-m2o' }, { foreign_key_table: 'cursos' });
    await createFieldSafe('compras', 'precio_pagado', 'decimal', { interface: 'input' });
    await createFieldSafe('compras', 'moneda', 'string', { interface: 'input' });
    await createFieldSafe('compras', 'metodo_pago', 'string', {
        interface: 'select-dropdown',
        options: {
            choices: [
                { text: 'Stripe', value: 'stripe' },
                { text: 'MercadoPago', value: 'mercadopago' },
                { text: 'PayPal', value: 'paypal' }
            ]
        }
    });
    await createFieldSafe('compras', 'estado_pago', 'string', {
        interface: 'select-dropdown',
        options: {
            choices: [
                { text: 'Pendiente', value: 'pendiente' },
                { text: 'Aprobado', value: 'aprobado' },
                { text: 'Rechazado', value: 'rechazado' }
            ]
        }
    });
    await createFieldSafe('compras', 'fecha_compra', 'timestamp', { interface: 'datetime', special: ['date-created'] });

    // 8. ACCESO A CURSOS
    await createCollectionSafe('accesos_cursos');
    await createFieldSafe('accesos_cursos', 'id', 'uuid', {}, { primary_key: true });
    await createFieldSafe('accesos_cursos', 'usuario', 'uuid', {}, { foreign_key_table: 'directus_users' });
    await createFieldSafe('accesos_cursos', 'curso', 'uuid', {}, { foreign_key_table: 'cursos' });
    await createFieldSafe('accesos_cursos', 'fecha_inicio', 'timestamp', { interface: 'datetime', special: ['date-created'] });
    await createFieldSafe('accesos_cursos', 'fecha_fin', 'timestamp', { interface: 'datetime' });
    await createFieldSafe('accesos_cursos', 'activo', 'boolean', { interface: 'boolean', default_value: true });

    // 9. PROGRESO POR CLASE
    await createCollectionSafe('progreso_clases');
    await createFieldSafe('progreso_clases', 'id', 'uuid', {}, { primary_key: true });
    await createFieldSafe('progreso_clases', 'usuario', 'uuid', {}, { foreign_key_table: 'directus_users' });
    await createFieldSafe('progreso_clases', 'curso', 'uuid', {}, { foreign_key_table: 'cursos' });
    await createFieldSafe('progreso_clases', 'clase', 'uuid', {}, { foreign_key_table: 'clases' });
    await createFieldSafe('progreso_clases', 'completado', 'boolean', { interface: 'boolean', default_value: false });
    await createFieldSafe('progreso_clases', 'porcentaje_visto', 'integer', { interface: 'input' });
    await createFieldSafe('progreso_clases', 'fecha_ultimo_acceso', 'timestamp', { interface: 'datetime', special: ['date-updated'] });

    // 10. EQUIPO (Sobre Nosotros)
    await createCollectionSafe('equipo', { meta: { note: 'Miembros del equipo de Básquet Formativo' } });
    await createFieldSafe('equipo', 'id', 'integer', { interface: 'input' }, { primary_key: true, auto_increment: true });
    await createFieldSafe('equipo', 'nombre', 'string', { interface: 'input' });
    await createFieldSafe('equipo', 'apellido', 'string', { interface: 'input' });
    await createFieldSafe('equipo', 'titulo', 'string', { interface: 'input' }, { note: 'Ej: Entrenador equipo X' });
    await createFieldSafe('equipo', 'foto', 'uuid', { interface: 'file' });
    await createFieldSafe('equipo', 'email', 'string', { interface: 'input' });
    await createFieldSafe('equipo', 'orden', 'integer', { interface: 'input' });

    // 11. COMENTARIOS
    await createCollectionSafe('comentarios');
    await createFieldSafe('comentarios', 'id', 'uuid', {}, { primary_key: true });
    await createFieldSafe('comentarios', 'usuario', 'uuid', {}, { foreign_key_table: 'directus_users' });
    await createFieldSafe('comentarios', 'curso', 'uuid', {}, { foreign_key_table: 'cursos' });
    await createFieldSafe('comentarios', 'clase', 'uuid', {}, { foreign_key_table: 'clases' });
    await createFieldSafe('comentarios', 'contenido', 'text', { interface: 'input-multiline' });
    await createFieldSafe('comentarios', 'fecha', 'timestamp', { interface: 'datetime', special: ['date-created'] });
    await createFieldSafe('comentarios', 'padre', 'uuid', {}, { foreign_key_table: 'comentarios' }); // Para respuestas
    await createFieldSafe('comentarios', 'es_instructor', 'boolean', { interface: 'boolean', default_value: false });

    console.log('--- Configuración Finalizada con ÉXITO ---');
}


main().catch(console.error);
