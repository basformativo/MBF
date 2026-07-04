
import { createDirectus, rest, staticToken } from '@directus/sdk';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

const client = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(ADMIN_TOKEN));

async function setupV11Permissions() {
    try {
        console.log("Configurando Políticas y Permisos para Alumnos (v11)...");

        const ALUMNO_ROLE_ID = 'c6d89d18-ac96-4281-8567-f88e36838980';
        const PUBLIC_POLICY_ID = 'abf8a154-5b1c-4a46-ac9c-7300570f4f17';

        // 1. Crear la Política de Alumnos
        console.log("Creando política para Alumnos...");
        // @ts-ignore
        const policyRes = await client.request(() => ({
            path: '/policies',
            method: 'POST',
            body: JSON.stringify({
                name: 'Política Alumnos',
                icon: 'school',
                description: 'Permisos para estudiantes',
                roles: [ALUMNO_ROLE_ID]
            })
        }));
        const alumnoPolicyId = policyRes.data.id;
        console.log(`ID de la nueva política: ${alumnoPolicyId}`);

        // 2. Agregar permisos a la política de Alumnos
        const collections = ['cursos', 'clases', 'instructores', 'categorias', 'noticias', 'directus_files'];
        console.log("Agregando permisos de lectura...");
        for (const col of collections) {
            // @ts-ignore
            await client.request(() => ({
                path: '/permissions',
                method: 'POST',
                body: JSON.stringify({
                    policy: alumnoPolicyId,
                    collection: col,
                    action: 'read',
                    fields: ['*']
                })
            })).catch(() => { });
        }

        // 3. Habilitar Registro Público
        console.log("Habilitando creación de usuarios en la política Pública...");
        // @ts-ignore
        await client.request(() => ({
            path: '/permissions',
            method: 'POST',
            body: JSON.stringify({
                policy: PUBLIC_POLICY_ID,
                collection: 'directus_users',
                action: 'create',
                fields: ['email', 'password', 'first_name', 'last_name', 'role']
            })
        })).catch(() => { });

        // 4. Permisos de progreso para Alumnos
        console.log("Configurando permisos de progreso...");
        // @ts-ignore
        await client.request(() => ({
            path: '/permissions',
            method: 'POST',
            body: JSON.stringify({
                policy: alumnoPolicyId,
                collection: 'progreso_clases',
                action: 'create',
                fields: ['*']
            })
        }));
        // @ts-ignore
        await client.request(() => ({
            path: '/permissions',
            method: 'POST',
            body: JSON.stringify({
                policy: alumnoPolicyId,
                collection: 'progreso_clases',
                action: 'read',
                fields: ['*'],
                permissions: { usuario: { _eq: '$CURRENT_USER' } }
            })
        }));

        console.log("=== CONFIGURACIÓN COMPLETADA ===");

    } catch (e: any) {
        console.error("Error:", e.message);
    }
}

setupV11Permissions();
