/**
 * Extrae el ID de video de una URL de YouTube en cualquiera de sus formatos comunes:
 *   - https://www.youtube.com/watch?v=ID
 *   - https://youtu.be/ID
 *   - https://www.youtube.com/embed/ID
 *   - https://www.youtube.com/shorts/ID
 *   - Con parámetros extra como &t=, ?si=, etc.
 * Devuelve null si la URL no es de YouTube o no se puede parsear.
 */
export function extractYouTubeVideoId(url: string | null | undefined): string | null {
    if (!url) return null;

    const trimmed = url.trim();
    if (!trimmed) return null;

    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

    let parsed: URL;
    try {
        parsed = new URL(withProtocol);
    } catch {
        return null;
    }

    const host = parsed.hostname.replace(/^www\./i, '').toLowerCase();

    let id: string | null = null;

    if (host === 'youtu.be') {
        id = parsed.pathname.split('/').filter(Boolean)[0] ?? null;
    } else if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
        if (parsed.pathname === '/watch') {
            id = parsed.searchParams.get('v');
        } else if (parsed.pathname.startsWith('/embed/')) {
            id = parsed.pathname.split('/embed/')[1]?.split('/')[0] ?? null;
        } else if (parsed.pathname.startsWith('/shorts/')) {
            id = parsed.pathname.split('/shorts/')[1]?.split('/')[0] ?? null;
        } else if (parsed.pathname.startsWith('/v/')) {
            id = parsed.pathname.split('/v/')[1]?.split('/')[0] ?? null;
        }
    } else {
        return null;
    }

    if (!id) return null;

    if (!/^[a-zA-Z0-9_-]{11}$/.test(id)) return null;

    return id;
}

/**
 * Construye la URL de embed de YouTube (sin autoplay) a partir de una URL "cruda"
 * cargada por el cliente en el campo "Video URL" de Directus.
 * Devuelve null si la URL no se pudo interpretar como un video de YouTube válido.
 */
export function getYouTubeEmbedUrl(url: string | null | undefined): string | null {
    const id = extractYouTubeVideoId(url);
    if (!id) return null;
    return `https://www.youtube.com/embed/${id}`;
}
