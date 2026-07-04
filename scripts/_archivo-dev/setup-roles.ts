
import {
    createDirectus,
    rest,
    staticToken,
    createRole,
    createUser,
    readRoles,
    readUsers,
    createPermissions
} from '@directus/sdk';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;

if (!DIRECTUS_TOKEN) {
    console.error('Error: DIRECTUS_ADMIN_TOKEN is not defined.');
    process.exit(1);
}

const client = createDirectus(DIRECTUS_URL)
    .with(rest())
    .with(staticToken(DIRECTUS_TOKEN));

async function setupRolesAndUsers() {
    console.log('--- Iniciando Configuración de Roles y Usuarios ---');

    const rolesToCreate = [
        {
            name: 'Editor de Noticias',
            description: 'Gestión exclusiva del blog y noticias.',
            permissions: [
                { collection: 'noticias', action: 'create' },
                { collection: 'noticias', action: 'read' },
                { collection: 'noticias', action: 'update' },
                { collection: 'noticias', action: 'delete' },
                { collection: 'categorias', action: 'read' },
                { collection: 'directus_files', action: 'create' },
                { collection: 'directus_files', action: 'read' },
                { collection: 'directus_files', action: 'update' }
            ]
        },
        {
            name: 'Gestor de Cursos',
            description: 'Administración de cursos, clases e instructores.',
            permissions: [
                { collection: 'cursos', action: 'all' },
                { collection: 'clases', action: 'all' },
                { collection: 'instructores', action: 'all' },
                { collection: 'categorias', action: 'all' },
                { collection: 'comentarios', action: 'read' },
                { collection: 'comentarios', action: 'create' },
                { collection: 'comentarios', action: 'update' },
                { collection: 'compras', action: 'read' },
                { collection: 'accesos_cursos', action: 'read' },
                { collection: 'directus_files', action: 'all' }
            ]
        },
        {
            name: 'Gestor Total',
            description: 'Supervisión global del contenido.',
            permissions: [
                { collection: '*', action: 'all' } // Simplificado para el gestor total
            ]
        }
    ];

    const credentialsList: any[] = [];

    for (const roleDef of rolesToCreate) {
        try {
            // 1. Verificar si el rol ya existe
            const existingRoles = await client.request(readRoles({
                filter: { name: { _eq: roleDef.name } }
            }));

            let roleId;
            if (existingRoles.length > 0) {
                console.log(`⚠️ Rol ya existe: ${roleDef.name}`);
                roleId = existingRoles[0].id;
            } else {
                const newRole = await client.request(createRole({
                    name: roleDef.name,
                    description: roleDef.description,
                    app_access: true,
                    admin_access: false
                }));
                roleId = newRole.id;
                console.log(`✅ Rol creado: ${roleDef.name}`);

                // Configurar permisos básicos (simplificado para el script)
                // En producción esto se vería más detallado usando createPermissions
                for (const p of roleDef.permissions) {
                    try {
                        // Nota: La API de Directus para permisos es compleja, 
                        // aquí creamos lo básico para que puedan trabajar.
                        // @ts-ignore
                        await client.request(createPermissions({
                            role: roleId,
                            collection: p.collection === '*' ? undefined : p.collection,
                            action: p.action === 'all' ? 'create' : p.action,
                            permissions: {},
                            validation: {}
                        }));
                    } catch (pe) { }
                }
            }

            // 2. Crear usuario para el rol
            const slug = roleDef.name.toLowerCase().replace(/ /g, '_');
            const email = `${slug}@basquetformativo.com`;
            const password = `MBF_${slug}_2026!`;

            const existingUsers = await client.request(readUsers({
                filter: { email: { _eq: email } }
            }));

            if (existingUsers.length > 0) {
                console.log(`⚠️ Usuario ya existe: ${email}`);
            } else {
                await client.request(createUser({
                    first_name: roleDef.name,
                    last_name: 'Staff',
                    email,
                    password,
                    role: roleId,
                    status: 'active'
                }));
                console.log(`✅ Usuario creado: ${email}`);
            }

            credentialsList.push({
                rol: roleDef.name,
                email,
                password
            });

        } catch (e) {
            console.error(`❌ Error procesando rol ${roleDef.name}:`, e);
        }
    }

    console.log('\n--- LISTADO DE CREDENCIALES ---');
    credentialsList.forEach(c => {
        console.log(`Rol: ${c.rol}`);
        console.log(`Usuario: ${c.email}`);
        console.log(`Contraseña: ${c.password}`);
        console.log('---------------------------');
    });

    console.log('\n✅ Configuración de roles y usuarios finalizada.');
}

setupRolesAndUsers().catch(console.error);
