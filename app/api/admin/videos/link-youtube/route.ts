import { NextRequest, NextResponse } from 'next/server';
import { updateItem } from '@directus/sdk';
import { getAdminUser } from '../../../../lib/adminAuth';
import { adminClient } from '../../../../lib/directus';
import { extractYouTubeVideoId } from '../../../../lib/youtube';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    const user = await getAdminUser(request.cookies.get('auth_session')?.value);
    if (!user) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { claseId, videoUrl } = await request.json();
    if (!claseId || !videoUrl) {
        return NextResponse.json({ error: 'Faltan datos: clase y URL de YouTube' }, { status: 400 });
    }

    if (!extractYouTubeVideoId(videoUrl)) {
        return NextResponse.json({ error: 'La URL no parece ser un video válido de YouTube' }, { status: 400 });
    }

    try {
        await adminClient.request(updateItem('clases', claseId, { video_url: videoUrl } as any));
    } catch (err) {
        console.error('[admin/videos/link-youtube] Error guardando video_url:', err);
        return NextResponse.json({ error: 'No se pudo guardar la URL en Directus' }, { status: 502 });
    }

    return NextResponse.json({ success: true });
}
