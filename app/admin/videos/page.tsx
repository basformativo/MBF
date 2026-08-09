import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { readItems } from '@directus/sdk';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getAdminUser } from '../../lib/adminAuth';
import { adminClient } from '../../lib/directus';
import VideoUploadForm from './VideoUploadForm';

export const dynamic = 'force-dynamic';

export interface CursoConClases {
    id: string;
    titulo: string;
    clases: { id: string; titulo: string; Video: string | null }[];
}

export default async function AdminVideosPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value;
    if (!token) redirect('/login');

    const user = await getAdminUser(token);
    if (!user) redirect('/dashboard');

    const cursosBase = await adminClient.request(
        readItems('cursos', {
            fields: ['id', 'titulo'] as any,
            sort: ['titulo'],
        })
    ).catch((e) => {
        console.error('Error fetching cursos para admin/videos:', e);
        return [];
    });

    const todasLasClases = await adminClient.request(
        readItems('clases', {
            fields: ['id', 'titulo', 'Video', 'curso'] as any,
            sort: ['orden'],
            limit: -1,
        })
    ).catch((e) => {
        console.error('Error fetching clases para admin/videos:', e);
        return [];
    });

    const cursos: CursoConClases[] = (cursosBase as any[]).map(c => ({
        id: c.id,
        titulo: c.titulo,
        clases: (todasLasClases as any[])
            .filter(cl => cl.curso === c.id)
            .map(cl => ({ id: cl.id, titulo: cl.titulo, Video: cl.Video })),
    }));

    return (
        <>
            <Header />
            <main className="min-h-screen bg-background-light dark:bg-background-dark py-12">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-10">
                        <h1 className="text-4xl font-black display-font mb-1">Subir Video</h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            Subí el video de una clase directo a R2. No hace falta tocar Directus.
                        </p>
                    </div>

                    <VideoUploadForm cursos={cursos} />
                </div>
            </main>
            <Footer />
        </>
    );
}
