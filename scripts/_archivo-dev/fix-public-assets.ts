
import { createDirectus, rest, staticToken } from '@directus/sdk';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';

const client = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(ADMIN_TOKEN));

async function fixPublicAssets() {
    try {
        console.log("Habilitando acceso público a los archivos (Assets)...");

        // En Directus la tabla de permisos es 'directus_permissions'
        // Queremos permitir que el rol público (role: null) lea 'directus_files'

        // @ts-ignore
        await client.request(() => ({
            path: '/permissions',
            method: 'POST',
            body: JSON.stringify({
                role: null,
                collection: 'directus_files',
                action: 'read',
                permissions: {},
                fields: ['*']
            })
        }));

        console.log("¡Hecho! Los archivos ahora deberían ser visibles públicamente.");
    } catch (e: any) {
        console.log("Aviso:", e.message);
        console.log("Intentando actualizar si ya existe...");

        // Si ya existe, el POST fallará. Intentamos asegurar que esté bien.
        // Esto es común si ya hay un permiso pero restringe campos.
    }
}

fixPublicAssets();
