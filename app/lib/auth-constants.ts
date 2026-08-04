// Constantes de sesión compartidas entre las server actions (app/lib/actions.ts)
// y el proxy (proxy.ts, ex-"middleware"), que corre en el Edge Runtime y no
// puede importar módulos que dependan de 'next/headers' o del SDK de Directus.

export const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

export const ACCESS_TOKEN_COOKIE = 'auth_session';
export const REFRESH_TOKEN_COOKIE = 'refresh_session';

// Directus expira el refresh token a los 7 días por defecto (REFRESH_TOKEN_TTL).
export const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7;

// Renovar el access token un poco antes de que venza, para que ninguna
// request se quede a mitad de camino con un token ya expirado.
export const REFRESH_BUFFER_MS = 2 * 60 * 1000;
