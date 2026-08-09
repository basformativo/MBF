import { NextRequest, NextResponse } from 'next/server';
import { updateItem } from '@directus/sdk';
import {
    CompleteMultipartUploadCommand,
    CopyObjectCommand,
    DeleteObjectCommand,
    GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getAdminUser } from '../../../../lib/adminAuth';
import { r2Client, R2_BUCKET_NAME } from '../../../../lib/r2';
import { DIRECTUS_URL, ADMIN_TOKEN, adminClient } from '../../../../lib/directus';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    const user = await getAdminUser(request.cookies.get('auth_session')?.value);
    if (!user) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { key, uploadId, parts, title, filenameDownload, claseId } = await request.json();
    if (!key || !uploadId || !Array.isArray(parts) || parts.length === 0 || !title) {
        return NextResponse.json({ error: 'Faltan datos para completar la subida' }, { status: 400 });
    }

    try {
        await r2Client.send(new CompleteMultipartUploadCommand({
            Bucket: R2_BUCKET_NAME,
            Key: key,
            UploadId: uploadId,
            MultipartUpload: { Parts: parts },
        }));
    } catch (err) {
        console.error('[admin/videos/complete] Error completando multipart upload:', err);
        return NextResponse.json({ error: 'No se pudo completar la subida a R2' }, { status: 502 });
    }

    // Directus necesita bajar el archivo desde una URL: le damos una firmada de lectura.
    let importResult: any;
    try {
        const signedUrl = await getSignedUrl(
            r2Client,
            new GetObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }),
            { expiresIn: 3600 }
        );

        const importRes = await fetch(`${DIRECTUS_URL}/files/import`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${ADMIN_TOKEN}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                url: signedUrl,
                data: { title, filename_download: filenameDownload || title },
            }),
        });
        importResult = await importRes.json();
        if (!importRes.ok || !importResult?.data?.id) {
            console.error('[admin/videos/complete] Directus no importó el archivo:', importResult);
            return NextResponse.json({ error: 'Directus no pudo importar el video' }, { status: 502 });
        }
    } catch (err) {
        console.error('[admin/videos/complete] Error importando a Directus:', err);
        return NextResponse.json({ error: 'Error al importar el video en Directus' }, { status: 502 });
    }

    const fileId = importResult.data.id as string;

    // El reproductor (app/api/video/[fileId]) busca el archivo en R2 bajo "<id>.mp4"
    try {
        const copySource = `${R2_BUCKET_NAME}/${key.split('/').map(encodeURIComponent).join('/')}`;
        await r2Client.send(new CopyObjectCommand({ Bucket: R2_BUCKET_NAME, CopySource: copySource, Key: `${fileId}.mp4` }));
        await r2Client.send(new DeleteObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }));
    } catch (err) {
        console.error('[admin/videos/complete] Error copiando a la key final en R2:', err);
        return NextResponse.json({ error: 'El video se importó pero no se pudo dejar listo para reproducir', fileId }, { status: 502 });
    }

    if (claseId) {
        try {
            await adminClient.request(updateItem('clases', claseId, { Video: fileId } as any));
        } catch (err) {
            console.error('[admin/videos/complete] Error asignando el video a la clase:', err);
            return NextResponse.json({ error: 'El video se subió pero no se pudo asignar a la clase', fileId }, { status: 502 });
        }
    }

    return NextResponse.json({ fileId, assignedToClase: Boolean(claseId) });
}
