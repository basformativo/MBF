import { NextRequest, NextResponse } from 'next/server';
import { CreateMultipartUploadCommand } from '@aws-sdk/client-s3';
import { getAdminUser } from '../../../../lib/adminAuth';
import { r2Client, R2_BUCKET_NAME } from '../../../../lib/r2';

export const dynamic = 'force-dynamic';

function sanitizeFilename(name: string) {
    return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

export async function POST(request: NextRequest) {
    const user = await getAdminUser(request.cookies.get('auth_session')?.value);
    if (!user) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { filename, contentType } = await request.json();
    if (!filename) {
        return NextResponse.json({ error: 'Falta el nombre del archivo' }, { status: 400 });
    }

    const key = `staging/${Date.now()}-${sanitizeFilename(filename)}`;

    try {
        const result = await r2Client.send(new CreateMultipartUploadCommand({
            Bucket: R2_BUCKET_NAME,
            Key: key,
            ContentType: contentType || 'video/mp4',
        }));

        return NextResponse.json({ uploadId: result.UploadId, key });
    } catch (err) {
        console.error('[admin/videos/start] Error creando multipart upload:', err);
        return NextResponse.json({ error: 'No se pudo iniciar la subida a R2' }, { status: 502 });
    }
}
