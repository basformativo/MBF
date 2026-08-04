import { NextRequest, NextResponse } from 'next/server';
import {
    DIRECTUS_URL,
    ACCESS_TOKEN_COOKIE,
    REFRESH_TOKEN_COOKIE,
    REFRESH_TOKEN_MAX_AGE,
    REFRESH_BUFFER_MS,
} from './app/lib/auth-constants';

function getTokenExpiryMs(token: string): number | null {
    try {
        const payload = token.split('.')[1];
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const json = atob(base64);
        const { exp } = JSON.parse(json);
        return typeof exp === 'number' ? exp * 1000 : null;
    } catch {
        return null;
    }
}

function isExpiringSoon(token: string): boolean {
    const expiryMs = getTokenExpiryMs(token);
    if (expiryMs === null) return true;
    return expiryMs - Date.now() < REFRESH_BUFFER_MS;
}

export async function proxy(request: NextRequest) {
    const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
    const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

    // Sin refresh token no hay nada para renovar: seguimos con lo que haya
    // (o sin sesión) y dejamos que cada ruta decida qué hacer.
    if (!refreshToken) {
        return NextResponse.next();
    }

    if (accessToken && !isExpiringSoon(accessToken)) {
        return NextResponse.next();
    }

    try {
        const refreshRes = await fetch(`${DIRECTUS_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: refreshToken, mode: 'json' }),
        });

        if (!refreshRes.ok) {
            // No forzamos logout acá: puede ser una carrera entre varias
            // requests concurrentes (p.ej. los fragments del video) que ya
            // rotaron el refresh token en otra request. El access token
            // vigente sigue sirviendo hasta que efectivamente venza.
            return NextResponse.next();
        }

        const data = await refreshRes.json();
        const newAccessToken = data.data?.access_token;
        const newRefreshToken = data.data?.refresh_token;
        const expires = data.data?.expires;

        if (!newAccessToken || !newRefreshToken) {
            return NextResponse.next();
        }

        // Actualizamos también las cookies de la request entrante para que
        // esta misma request (Server Components, route handlers) ya vea el
        // token renovado, sin esperar a la próxima navegación.
        request.cookies.set(ACCESS_TOKEN_COOKIE, newAccessToken);
        request.cookies.set(REFRESH_TOKEN_COOKIE, newRefreshToken);

        const response = NextResponse.next({ request });
        const secure = process.env.NODE_ENV === 'production';

        response.cookies.set(ACCESS_TOKEN_COOKIE, newAccessToken, {
            path: '/',
            httpOnly: true,
            secure,
            maxAge: expires ? Math.floor(expires / 1000) : 15 * 60,
        });
        response.cookies.set(REFRESH_TOKEN_COOKIE, newRefreshToken, {
            path: '/',
            httpOnly: true,
            secure,
            maxAge: REFRESH_TOKEN_MAX_AGE,
        });

        return response;
    } catch (e) {
        console.error('[Proxy] Error renovando sesión:', e);
        return NextResponse.next();
    }
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/cursos/:path*',
        '/carrito/:path*',
        '/checkout/:path*',
        '/admin/:path*',
        '/api/video/:path*',
    ],
};
