
import { createDirectus, rest, staticToken } from '@directus/sdk';

const DIRECTUS_URL = 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = 'AXM_R-cgsyY47faDvzO-fU8BOkvmK5FD'; // Fixing typo in token if any

const client = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken('AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD'));

async function openPermissions() {
    try {
        console.log("Configurando permisos de archivos...");

        // Obtenemos los permisos actuales para ver el formato
        // @ts-ignore
        const current = await client.request(() => ({
            path: '/permissions',
            method: 'GET'
        }));

        console.log("Permisos actuales encontrados. Aplicando apertura de lectura pública...");

        // Intentamos habilitar lectura para el rol público
        // @ts-ignore
        await client.request(() => ({
            path: '/permissions',
            method: 'POST',
            body: JSON.stringify({
                role: null,
                collection: 'directus_files',
                action: 'read',
                fields: ['*']
            })
        }));

        console.log("¡Éxito! Lectura pública de archivos activada.");
    } catch (e: any) {
        console.log("Error o ya configurado:", e.message);
    }
}

openPermissions();
