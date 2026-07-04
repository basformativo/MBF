
import { createDirectus, rest, staticToken, createCollection, createField, createRelation } from '@directus/sdk';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

const client = createDirectus(DIRECTUS_URL)
    .with(rest())
    .with(staticToken(ADMIN_TOKEN));

// Definition of collections with UUID primary key
const collections = [
    { collection: 'cursos', meta: { note: 'Cursos disponibles' } },
    { collection: 'clases', meta: { note: 'Clases de los cursos' } },
    { collection: 'instructores', meta: { note: 'Instructores' } },
    { collection: 'cursos_instructores', meta: { note: 'Relación Cursos - Instructores' } },
    { collection: 'categorias', meta: { note: 'Categorías de cursos' } },
    { collection: 'cursos_categorias', meta: { note: 'Relación Cursos - Categorías' } },
    { collection: 'perfiles_alumnos', meta: { note: 'Perfiles extendidos de alumnos' } },
    { collection: 'compras', meta: { note: 'Registro de compras' } },
    { collection: 'accesos_cursos', meta: { note: 'Control de acceso a cursos' } },
    { collection: 'progreso_clases', meta: { note: 'Progreso de usuarios en clases' } },
    { collection: 'comentarios', meta: { note: 'Comentarios en cursos/clases' } },
    { collection: 'certificados', meta: { note: 'Certificados emitidos' } },
];

async function setup() {
    console.log('Iniciando configuración de Directus con UUIDs...');

    // 1. Crear Colecciones con PK UUID
    for (const c of collections) {
        try {
            console.log(`Creando colección: ${c.collection}`);
            await client.request(createCollection({
                collection: c.collection,
                schema: { name: c.collection },
                meta: c.meta,
                fields: [
                    {
                        field: 'id',
                        type: 'uuid',
                        meta: { hidden: true, interface: 'input' },
                        schema: { is_primary_key: true, has_auto_increment: false } // UUID no es auto-increment
                    }
                ]
            }));
        } catch (e: any) {
            if (e?.errors?.[0]?.extensions?.code === 'RECORD_NOT_UNIQUE') {
                console.log(`Colección ${c.collection} ya existe.`);
            } else {
                console.error(`Error creando colección ${c.collection}:`, e);
            }
        }
    }

    // Helper para crear campo si no existe
    const ensureField = async (collection: string, field: string, type: string, meta: any = {}, schema: any = {}) => {
        try {
            console.log(`Creando campo ${collection}.${field}`);
            await client.request(createField(collection, {
                field,
                type,
                meta: { ...meta, interface: meta.interface || 'input' },
                schema
            }));
        } catch (e: any) {
            if (e?.errors?.[0]?.extensions?.code === 'RECORD_NOT_UNIQUE' || e?.message?.includes('already exists')) {
                console.log(`Campo ${field} en ${collection} ya existe.`);
            } else {
                console.error(`Error creando campo ${collection}.${field}:`, e);
            }
        }
    };

    // --- Cursos ---
    await ensureField('cursos', 'titulo', 'string');
    await ensureField('cursos', 'slug', 'string');
    await ensureField('cursos', 'descripcion', 'text', { interface: 'input-rich-text-html' });
    await ensureField('cursos', 'descripcion_corta', 'text');
    await ensureField('cursos', 'nivel', 'string', {
        interface: 'select-dropdown',
        options: { choices: [{ text: 'Principiante', value: 'principiante' }, { text: 'Intermedio', value: 'intermedio' }, { text: 'Avanzado', value: 'avanzado' }] }
    });
    await ensureField('cursos', 'precio', 'float');
    await ensureField('cursos', 'moneda', 'string');
    await ensureField('cursos', 'imagen_portada', 'uuid', { interface: 'file-image' });
    await ensureField('cursos', 'estado', 'string', {
        interface: 'select-dropdown',
        options: { choices: [{ text: 'Borrador', value: 'borrador' }, { text: 'Publicado', value: 'publicado' }] }
    });
    await ensureField('cursos', 'destacado', 'boolean');
    await ensureField('cursos', 'date_created', 'timestamp', { special: ['date-created'] });
    await ensureField('cursos', 'date_updated', 'timestamp', { special: ['date-updated'] });

    // --- Clases ---
    await ensureField('clases', 'curso', 'uuid', { interface: 'many-to-one', special: ['m2o'] }); // Relación UUID
    await ensureField('clases', 'titulo', 'string');
    await ensureField('clases', 'slug', 'string');
    await ensureField('clases', 'descripcion', 'text');
    await ensureField('clases', 'contenido', 'text', { interface: 'input-rich-text-markdown' });
    await ensureField('clases', 'video', 'uuid', { interface: 'file' });
    await ensureField('clases', 'video_url', 'string');
    await ensureField('clases', 'duracion', 'integer');
    await ensureField('clases', 'orden', 'integer');
    await ensureField('clases', 'es_gratis', 'boolean');
    await ensureField('clases', 'fecha_publicacion', 'dateTime');

    // --- Instructores ---
    await ensureField('instructores', 'nombre', 'string');
    await ensureField('instructores', 'apellido', 'string');
    await ensureField('instructores', 'bio', 'text');
    await ensureField('instructores', 'foto', 'uuid', { interface: 'file-image' });
    await ensureField('instructores', 'especialidad', 'string');
    await ensureField('instructores', 'experiencia_anios', 'integer');
    await ensureField('instructores', 'instagram', 'string');
    await ensureField('instructores', 'youtube', 'string');
    await ensureField('instructores', 'email', 'string');

    // --- Cursos <-> Instructores (M2M) ---
    await ensureField('cursos_instructores', 'curso', 'uuid'); // UUID
    await ensureField('cursos_instructores', 'instructor', 'uuid'); // UUID
    await ensureField('cursos_instructores', 'rol', 'string', {
        interface: 'select-dropdown',
        options: { choices: [{ text: 'Principal', value: 'principal' }, { text: 'Asistente', value: 'asistente' }] }
    });

    // --- Categorias ---
    await ensureField('categorias', 'nombre', 'string');
    await ensureField('categorias', 'slug', 'string');
    await ensureField('categorias', 'descripcion', 'text');

    // --- Cursos <-> Categorias ---
    await ensureField('cursos_categorias', 'curso', 'uuid');
    await ensureField('cursos_categorias', 'categoria', 'uuid');

    // --- Perfiles Alumnos ---
    await ensureField('perfiles_alumnos', 'usuario', 'uuid'); // directus_users usa UUID
    await ensureField('perfiles_alumnos', 'nombre', 'string');
    await ensureField('perfiles_alumnos', 'apellido', 'string');
    await ensureField('perfiles_alumnos', 'avatar', 'uuid', { interface: 'file-image' });
    await ensureField('perfiles_alumnos', 'nivel_juego', 'string');
    await ensureField('perfiles_alumnos', 'posicion', 'string');

    // --- Compras ---
    await ensureField('compras', 'usuario', 'uuid');
    await ensureField('compras', 'curso', 'uuid');
    await ensureField('compras', 'precio_pagado', 'float');
    await ensureField('compras', 'moneda', 'string');
    await ensureField('compras', 'metodo_pago', 'string');
    await ensureField('compras', 'estado_pago', 'string', {
        interface: 'select-dropdown',
        options: { choices: [{ text: 'Pendiente', value: 'pendiente' }, { text: 'Aprobado', value: 'aprobado' }, { text: 'Rechazado', value: 'rechazado' }] }
    });
    await ensureField('compras', 'fecha_compra', 'dateTime');

    // --- Accesos Cursos ---
    await ensureField('accesos_cursos', 'usuario', 'uuid');
    await ensureField('accesos_cursos', 'curso', 'uuid');
    await ensureField('accesos_cursos', 'fecha_inicio', 'dateTime');
    await ensureField('accesos_cursos', 'fecha_fin', 'dateTime');
    await ensureField('accesos_cursos', 'activo', 'boolean');

    // --- Progreso Clases ---
    await ensureField('progreso_clases', 'usuario', 'uuid');
    await ensureField('progreso_clases', 'curso', 'uuid');
    await ensureField('progreso_clases', 'clase', 'uuid');
    await ensureField('progreso_clases', 'completado', 'boolean');
    await ensureField('progreso_clases', 'porcentaje_visto', 'integer');
    await ensureField('progreso_clases', 'fecha_ultimo_acceso', 'dateTime');

    // --- Comentarios ---
    await ensureField('comentarios', 'usuario', 'uuid');
    await ensureField('comentarios', 'curso', 'uuid');
    await ensureField('comentarios', 'clase', 'uuid');
    await ensureField('comentarios', 'contenido', 'text');
    await ensureField('comentarios', 'fecha', 'dateTime');
    await ensureField('comentarios', 'aprobado', 'boolean');

    // --- Certificados ---
    await ensureField('certificados', 'usuario', 'uuid');
    await ensureField('certificados', 'curso', 'uuid');
    await ensureField('certificados', 'codigo_certificado', 'string');
    await ensureField('certificados', 'fecha_emision', 'dateTime');
    await ensureField('certificados', 'archivo_pdf', 'uuid', { interface: 'file' });

    console.log('Campos UUID configurados.');

    // Helper para configurar relación
    const setupRelation = async (collection: string, field: string, relatedCollection: string) => {
        console.log(`Configurando relación ${collection}.${field} -> ${relatedCollection}`);
        try {
            // createRelation via request object is not explicitly exported simply as createRelation that takes arguments like this in SDK v21?
            // It seems createRelation works with the client.
            // Using rest().createRelation(...)

            await client.request(createRelation({
                collection: collection,
                field: field,
                related_collection: relatedCollection,
                schema: { onDelete: 'SET NULL' }
            }));
        } catch (e: any) {
            if (e?.errors?.[0]?.extensions?.code === 'RECORD_NOT_UNIQUE') {
                // Ignore
            } else {
                console.log(`Nota sobre relación ${collection}.${field}: ${e.message}`);
            }
        }
    };

    // Configurar relaciones
    await setupRelation('clases', 'curso', 'cursos'); // M2O

    await setupRelation('cursos_instructores', 'curso', 'cursos');
    await setupRelation('cursos_instructores', 'instructor', 'instructores');

    await setupRelation('cursos_categorias', 'curso', 'cursos');
    await setupRelation('cursos_categorias', 'categoria', 'categorias');

    await setupRelation('perfiles_alumnos', 'usuario', 'directus_users');

    await setupRelation('compras', 'usuario', 'directus_users');
    await setupRelation('compras', 'curso', 'cursos');

    await setupRelation('accesos_cursos', 'usuario', 'directus_users');
    await setupRelation('accesos_cursos', 'curso', 'cursos');

    await setupRelation('progreso_clases', 'usuario', 'directus_users');
    await setupRelation('progreso_clases', 'curso', 'cursos');
    await setupRelation('progreso_clases', 'clase', 'clases');

    await setupRelation('comentarios', 'usuario', 'directus_users');
    await setupRelation('comentarios', 'curso', 'cursos');
    await setupRelation('comentarios', 'clase', 'clases');

    await setupRelation('certificados', 'usuario', 'directus_users');
    await setupRelation('certificados', 'curso', 'cursos');

    console.log('Proceso finalizado. Verifique el panel de Admin para ajustar interfaces si es necesario.');
}

setup().catch(console.error);
