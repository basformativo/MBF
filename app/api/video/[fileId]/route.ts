import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ fileId: string }> }
) {
    const { fileId } = await params;

    if (!fileId) {
        return new NextResponse('File ID requerido', { status: 400 });
    }

    const range = request.headers.get('range');

    const fetchHeaders: HeadersInit = {};
    if (ADMIN_TOKEN) {
        fetchHeaders['Authorization'] = `Bearer ${ADMIN_TOKEN}`;
    }
    // Reenviar Range para soporte de seeking / reproducción parcial
    if (range) {
        fetchHeaders['Range'] = range;
    }

    let upstream: Response;
    try {
        upstream = await fetch(`${DIRECTUS_URL}/assets/${fileId}`, {
            headers: fetchHeaders,
        });
    } catch (err) {
        console.error('[VideoProxy] Error al conectar con Directus:', err);
        return new NextResponse('Error al obtener el video', { status: 502 });
    }

    if (!upstream.ok && upstream.status !== 206) {
        return new NextResponse('Video no encontrado', { status: upstream.status });
    }

    // Construir headers de respuesta
    const responseHeaders = new Headers();

    // ← Clave: forzar video/mp4 para que Chrome/Firefox intenten decodificar H.264
    responseHeaders.set('Content-Type', 'video/mp4');
    responseHeaders.set('Accept-Ranges', 'bytes');

    // Propagar Content-Length y Content-Range para que el seeking funcione
    const contentLength = upstream.headers.get('Content-Length');
    if (contentLength) responseHeaders.set('Content-Length', contentLength);

    const contentRange = upstream.headers.get('Content-Range');
    if (contentRange) responseHeaders.set('Content-Range', contentRange);

    // Cache moderado en el cliente (1 hora)
    responseHeaders.set('Cache-Control', 'private, max-age=3600');

    return new NextResponse(upstream.body, {
        status: upstream.status, // 200 o 206 (partial)
        headers: responseHeaders,
    });
}
