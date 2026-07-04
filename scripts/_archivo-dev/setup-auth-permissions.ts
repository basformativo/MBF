
import { createDirectus, rest, staticToken, readRoles, createRole, createPermission } from '@directus/sdk';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

const client = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(ADMIN_TOKEN));

async function setupAuth() {
    try {
        console.log("Configurando roles y permisos para registro público...");

        // 1. Obtener todos los roles usando el SDK
        const roles = await client.request(readRoles());
        console.log(`Roles encontrados: ${roles.length}`);

        let alumnoRole = roles.find((r: any) => r.name === 'Alumno');

        if (!alumnoRole) {
            console.log("Creando rol 'Alumno'...");
            alumnoRole = await client.request(createRole({
                name: 'Alumno',
                icon: 'school',
                description: 'Rol para estudiantes registrados'
            }));
        } else {
            console.log("Rol 'Alumno' ya existe.");
        }

        const roleId = alumnoRole.id;
        console.log(`ID del rol Alumno: ${roleId}`);

        // 2. Habilitar registro público (Permitir a Public crear usuarios)
        // El rol público es NULL en Directus
        try {
            console.log("Habilitando creación de usuarios para público...");
            await client.request(createPermission({
                role: null,
                collection: 'directus_users',
                action: 'create',
                fields: ['email', 'password', 'first_name', 'last_name', 'role']
            }));
        } catch (e: any) {
            console.log("Permiso de creación de usuario ya existe o no se pudo crear.");
        }

        // 3. Dar permisos al rol Alumno para sus propias cosas
        const collectionsToRead = ['cursos', 'clases', 'noticias', 'instructores', 'categorias', 'directus_files'];
        for (const col of collectionsToRead) {
            try {
                await client.request(createPermission({
                    role: roleId,
                    collection: col,
                    action: 'read',
                    fields: ['*']
                }));
            } catch (e) { }
        }

        // Permisos de progreso
        try {
            await client.request(createPermission({
                role: roleId,
                collection: 'progreso_clases',
                action: 'create',
                fields: ['*']
            }));

            await client.request(createPermission({
                role: roleId,
                collection: 'progreso_clases',
                action: 'read',
                fields: ['*'],
                permissions: { user: { _eq: '$CURRENT_USER' } }
            }));
        } catch (e) { }

        console.log("=== CONFIGURACIÓN DE AUTH COMPLETADA ===");
        console.log(`IMPORTANTE: El roleId para nuevos alumnos es: ${roleId}`);

    } catch (e: any) {
        console.error("Error crítico en setupAuth:", e.message, e);
    }
}

setupAuth();
