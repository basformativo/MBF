import { createDirectus, rest, staticToken } from '@directus/sdk';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;

// Cliente base que intenta usar el token si está disponible
export const directus = createDirectus(DIRECTUS_URL)
    .with(rest())
    .with(staticToken(ADMIN_TOKEN || ''));

// Función para obtener un cliente con el token garantizado
export const getAdminClient = () => {
    if (!ADMIN_TOKEN) {
        console.warn('DIRECTUS_ADMIN_TOKEN is not defined in environment variables');
    }
    return createDirectus(DIRECTUS_URL)
        .with(rest())
        .with(staticToken(ADMIN_TOKEN || ''));
};
