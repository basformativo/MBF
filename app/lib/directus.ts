import { createDirectus, rest, staticToken } from '@directus/sdk';

export const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

if (!process.env.DIRECTUS_ADMIN_TOKEN) {
    throw new Error('[Directus] DIRECTUS_ADMIN_TOKEN no está definida. Configurá la variable de entorno antes de iniciar la aplicación.');
}

export const ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;

console.log('[Directus] Connecting to:', DIRECTUS_URL);

// Cliente base para peticiones públicas (o con token de sesión en el cliente)
export const directus = createDirectus(DIRECTUS_URL).with(rest());

// Cliente administrativo para acciones del servidor
export const adminClient = createDirectus(DIRECTUS_URL)
    .with(rest())
    .with(staticToken(ADMIN_TOKEN));

export const getAdminClient = () => adminClient;
