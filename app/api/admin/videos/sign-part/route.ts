import { NextRequest, NextResponse } from 'next/server';
import { UploadPartCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getAdminUser } from '../../../../lib/adminAuth';
import { r2Client, R2_BUCKET_NAME } from '../../../../lib/r2';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    const user = await getAdminUser(request.cookies.get('auth_session')?.value);
    if (!user) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { key, uploadId, partNumber } = await request.json();
    if (!key || !uploadId || !partNumber) {
        return NextResponse.json({ error: 'Faltan datos de la parte a subir' }, { status: 400 });
    }

    try {
        const url = await getSignedUrl(
            r2Client,
            new UploadPartCommand({
                Bucket: R2_BUCKET_NAME,
                Key: key,
                UploadId: uploadId,
                PartNumber: partNumber,
            }),
            { expiresIn: 3600 }
        );

        return NextResponse.json({ url });
    } catch (err) {
        console.error('[admin/videos/sign-part] Error firmando parte:', err);
        return NextResponse.json({ error: 'No se pudo firmar la parte' }, { status: 502 });
    }
}
