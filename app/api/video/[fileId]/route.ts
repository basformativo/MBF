import { NextRequest, NextResponse } from 'next/server';
import { createDirectus, rest, staticToken, readMe, readItems } from '@directus/sdk';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { DIRECTUS_URL, adminClient } from '../../../lib/directus';
import { getApprovedCourseAccess } from '../../../lib/courses';
import { r2Client, R2_BUCKET_NAME } from '../../../lib/r2';

export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ fileId: string }> }
) {
    const { fileId } = await params;

    if (!fileId) {
        return new NextResponse('File ID requerido', { status: 400 });
    }

    // Buscar a qué clase/curso pertenece este archivo para poder verificar acceso
    const clases = await adminClient.request(readItems('clases', {
        filter: { Video: { _eq: fileId } },
        fields: ['id', 'curso', 'es_gratis'] as any,
        limit: 1,
    }));
    const clase = (clases as any[])[0];

    if (!clase) {
        return new NextResponse('Video no encontrado', { status: 404 });
    }

    const sessionToken = request.cookies.get('auth_session')?.value;

    if (!sessionToken) {
        return new NextResponse('No autorizado', { status: 401 });
    }

    let userId: string;
    try {
        const userClient = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(sessionToken));
        const user = await userClient.request(readMe());
        userId = user.id as string;
    } catch (e) {
        return new NextResponse('No autorizado', { status: 401 });
    }

    if (!clase.es_gratis) {
        const access = await getApprovedCourseAccess(userId, clase.curso);
        if (!access) {
            return new NextResponse('Acceso denegado', { status: 403 });
        }
    }

    const range = request.headers.get('range');

    const fetchHeaders: HeadersInit = {};
    // Reenviar Range para soporte de seeking / reproducción parcial
    if (range) {
        fetchHeaders['Range'] = range;
    }

    let upstream: Response;
    try {
        const signedUrl = await getSignedUrl(
            r2Client,
            new GetObjectCommand({ Bucket: R2_BUCKET_NAME, Key: `${fileId}.mp4` }),
            { expiresIn: 300 }
        );
        upstream = await fetch(signedUrl, { headers: fetchHeaders, cache: 'no-store' });
    } catch (err) {
        console.error('[VideoProxy] Error al conectar con R2:', err);
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
