/**
 * Script para crear la colección `solicitudes_compra` en Directus.
 * Ejecutar una sola vez: npx tsx scripts/setup-directus-compras.ts
 */

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN || '';

async function req(path: string, body: object) {
    const res = await fetch(`${DIRECTUS_URL}${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
        body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) console.error(`Error en ${path}:`, JSON.stringify(data));
    else console.log(`OK ${path}`);
    return data;
}

async function setup() {
    // 1. Crear colección
    await req('/collections', {
        collection: 'solicitudes_compra',
        meta: { icon: 'shopping_cart', note: 'Solicitudes de compra de cursos' },
        schema: {},
        fields: [
            { field: 'id', type: 'uuid', meta: { hidden: true, readonly: true }, schema: { is_primary_key: true, has_auto_increment: false } },
            { field: 'date_created', type: 'timestamp', meta: { special: ['date-created'], hidden: true, readonly: true, display: 'datetime' } },
            { field: 'estado', type: 'string', meta: { interface: 'select-dropdown', display: 'labels', options: { choices: [{ text: 'Pendiente', value: 'pendiente' }, { text: 'Aprobado', value: 'aprobado' }, { text: 'Rechazado', value: 'rechazado' }] } }, schema: { default_value: 'pendiente' } },
            { field: 'nombre', type: 'string', schema: {} },
            { field: 'apellido', type: 'string', schema: {} },
            { field: 'email', type: 'string', schema: {} },
            { field: 'dni', type: 'string', schema: {} },
            { field: 'fecha_nacimiento', type: 'date', schema: {} },
            { field: 'telefono', type: 'string', schema: {} },
            { field: 'ciudad', type: 'string', schema: {} },
            { field: 'pais', type: 'string', schema: {} },
            { field: 'redes_sociales', type: 'json', schema: {} },
            { field: 'como_enteraste', type: 'string', schema: {} },
            { field: 'consultas', type: 'text', schema: {} },
            { field: 'medio_pago', type: 'string', schema: {} },
            { field: 'comprobante', type: 'uuid', meta: { interface: 'file', special: ['file'] }, schema: {} },
            { field: 'notas_admin', type: 'text', meta: { note: 'Notas internas del administrador' }, schema: {} },
        ],
    });

    // 2. Relación usuario → directus_users
    await req('/fields/solicitudes_compra', {
        field: 'usuario',
        type: 'uuid',
        meta: { interface: 'select-dropdown-m2o', special: ['m2o'], display: 'related-values', options: { template: '{{first_name}} {{last_name}}' } },
        schema: { foreign_key_table: 'directus_users', foreign_key_column: 'id' },
    });
    await req('/relations', {
        collection: 'solicitudes_compra',
        field: 'usuario',
        related_collection: 'directus_users',
    });

    // 3. Relación curso → cursos
    await req('/fields/solicitudes_compra', {
        field: 'curso',
        type: 'uuid',
        meta: { interface: 'select-dropdown-m2o', special: ['m2o'], display: 'related-values', options: { template: '{{titulo}}' } },
        schema: { foreign_key_table: 'cursos', foreign_key_column: 'id' },
    });
    await req('/relations', {
        collection: 'solicitudes_compra',
        field: 'curso',
        related_collection: 'cursos',
    });

    console.log('\n✅ Colección solicitudes_compra creada en Directus.');
    console.log('Recuerda configurar los permisos en Directus > Settings > Roles & Permissions.');
}

setup().catch(console.error);
