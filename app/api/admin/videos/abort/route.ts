import { NextRequest, NextResponse } from 'next/server';
import { AbortMultipartUploadCommand } from '@aws-sdk/client-s3';
import { getAdminUser } from '../../../../lib/adminAuth';
import { r2Client, R2_BUCKET_NAME } from '../../../../lib/r2';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    const user = await getAdminUser(request.cookies.get('auth_session')?.value);
    if (!user) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { key, uploadId } = await request.json();
    if (!key || !uploadId) {
        return NextResponse.json({ error: 'Faltan datos para abortar la subida' }, { status: 400 });
    }

    try {
        await r2Client.send(new AbortMultipartUploadCommand({ Bucket: R2_BUCKET_NAME, Key: key, UploadId: uploadId }));
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('[admin/videos/abort] Error abortando subida:', err);
        return NextResponse.json({ error: 'No se pudo abortar la subida' }, { status: 502 });
    }
}
