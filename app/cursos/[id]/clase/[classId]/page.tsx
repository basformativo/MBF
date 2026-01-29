
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import { getCourseBySlug, getImageUrl, getCourseProgress } from "../../../../lib/courses";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { loginAction, buyCourseAction, toggleProgressAction } from "../../../../lib/actions";
import { createDirectus, rest, staticToken, readMe } from "@directus/sdk";

export const dynamic = 'force-dynamic';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

export default async function ClasePage({
    params,
}: {
    params: Promise<{ id: string; classId: string }>;
}) {
    const { id, classId } = await params;
    const course = await getCourseBySlug(id);

    if (!course) {
        notFound();
    }

    const currentClass = course.clases?.find(c => c.slug === classId);

    if (!currentClass) {
        notFound();
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value;
    const isLoggedIn = !!token;

    let user = null;
    let completedClasses: string[] = [];
    if (token) {
        try {
            const client = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(token));
            user = await client.request(readMe());
            const progress = await getCourseProgress(user.id, course.id);
            completedClasses = progress.map(p => p.clase);
        } catch (e) { }
    }

    const purchasedCourses = cookieStore.get('purchased_courses')?.value || '';
    const hasPurchased = purchasedCourses.includes(course.id) || purchasedCourses.includes(course.slug);
    const canAccess = currentClass.es_gratis ? isLoggedIn : (isLoggedIn && hasPurchased);
    const isCompleted = completedClasses.includes(currentClass.id);

    return (
        <>
            <Header />
            <main className="w-full bg-background-light dark:bg-background-dark min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                    {/* Breadcrumbs */}
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
                        <Link href="/cursos" className="hover:text-primary transition-colors">Cursos</Link>
                        <span className="material-icons text-[10px]">chevron_right</span>
                        <Link href={`/cursos/${course.slug}`} className="hover:text-primary transition-colors">{course.titulo}</Link>
                        <span className="material-icons text-[10px]">chevron_right</span>
                        <span className="text-gray-900 dark:text-gray-200 font-medium">{currentClass.titulo}</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                        {/* Player Section */}
                        <div className="lg:col-span-3 space-y-8">

                            {/* Video Player Box */}
                            <div className="aspect-video bg-black rounded-3xl overflow-hidden relative shadow-2xl border border-white/10">
                                {canAccess ? (
                                    <div className="w-full h-full">
                                        {currentClass.Video ? (
                                            <video
                                                src={getImageUrl(currentClass.Video)}
                                                controls
                                                className="w-full h-full object-contain"
                                                poster={getImageUrl(course.Imagen_Portada)}
                                            />
                                        ) : currentClass.video_url ? (
                                            <iframe
                                                src={currentClass.video_url.replace('watch?v=', 'embed/')}
                                                className="absolute inset-0 w-full h-full"
                                                allow="autoplay; fullscreen; picture-in-picture"
                                                allowFullScreen
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-white bg-surface-dark/50">
                                                <span className="material-icons text-8xl mb-4 text-gray-600">videocam_off</span>
                                                <p className="text-xl display-font uppercase tracking-widest text-gray-500">Video no disponible</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-black/60 backdrop-blur-md">
                                        <div className="bg-white/10 p-6 rounded-full mb-6">
                                            <span className="material-icons text-6xl text-white">lock</span>
                                        </div>
                                        {!isLoggedIn ? (
                                            <div className="max-w-md">
                                                <h2 className="text-3xl display-font text-white mb-4">CONTENIDO PROTEGIDO</h2>
                                                <p className="text-gray-300 mb-8">Debes iniciar sesión para acceder a nuestras clases.</p>
                                                <Link href="/login" className="bg-primary text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:scale-105 transition-transform inline-block">Iniciar Sesión</Link>
                                            </div>
                                        ) : (
                                            <div className="max-w-md">
                                                <h2 className="text-3xl display-font text-white mb-4">ACCESO REQUERIDO</h2>
                                                <p className="text-gray-300 mb-8">Esta clase es exclusiva para alumnos inscritos en este curso.</p>
                                                <form action={async () => { 'use server'; await buyCourseAction(course.id); }}>
                                                    <button type="submit" className="bg-primary text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-xl">Inscribirme Ahora</button>
                                                </form>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Class Info & Completion Button */}
                            <div className="bg-white dark:bg-surface-dark p-8 rounded-3xl border border-border-light dark:border-border-dark shadow-sm">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h1 className="text-3xl display-font">{currentClass.titulo}</h1>
                                            {isCompleted && (
                                                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase flex items-center">
                                                    <span className="material-icons text-xs mr-1">check</span> Completada
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-400 text-sm font-mono uppercase">Módulo 1 • Clase {currentClass.orden}</p>
                                    </div>

                                    {canAccess && (
                                        <form action={async () => { 'use server'; await toggleProgressAction(course.id, currentClass.id, !isCompleted); }}>
                                            <button
                                                type="submit"
                                                className={`px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs transition-all flex items-center gap-2 ${isCompleted ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-black dark:bg-white text-white dark:text-black hover:bg-primary dark:hover:bg-primary hover:text-white dark:hover:text-white shadow-lg'}`}
                                            >
                                                <span className="material-icons text-sm">{isCompleted ? 'published_with_changes' : 'check_circle'}</span>
                                                {isCompleted ? 'Marcar como pendiente' : 'Finalizar Clase'}
                                            </button>
                                        </form>
                                    )}
                                </div>

                                <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 border-b border-border-light dark:border-border-dark pb-8 mb-8">
                                    {currentClass.descripcion}
                                </div>

                                {/* Downloadable Resources Section */}
                                <div>
                                    <h3 className="font-bold display-font uppercase tracking-wider text-sm mb-4">Recursos de la Clase</h3>
                                    <div className="flex flex-wrap gap-4">
                                        {/* @ts-ignore */}
                                        {currentClass.documento ? (
                                            <a
                                                /* @ts-ignore */
                                                href={getImageUrl(currentClass.documento)}
                                                target="_blank"
                                                className="flex items-center gap-3 bg-gray-50 dark:bg-black/20 px-5 py-3 rounded-2xl border border-border-light dark:border-border-dark hover:border-primary transition-colors group"
                                            >
                                                <span className="material-icons text-primary">description</span>
                                                <div className="text-left">
                                                    <p className="text-xs font-bold uppercase tracking-tighter">Guía de Ejercicios.pdf</p>
                                                    <p className="text-[10px] text-gray-400">PDF • 2.4 MB</p>
                                                </div>
                                                <span className="material-icons text-sm ml-2 opacity-0 group-hover:opacity-100 transition-opacity">download</span>
                                            </a>
                                        ) : (
                                            <p className="text-xs text-gray-400 italic">No hay archivos adicionales para esta clase.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar: Class List with Progress Checkmarks */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-surface-dark rounded-3xl border border-border-light dark:border-border-dark overflow-hidden sticky top-8">
                                <div className="p-6 border-b border-border-light dark:border-border-dark bg-gray-50/50 dark:bg-black/20 flex justify-between items-center">
                                    <h3 className="font-bold display-font uppercase tracking-wider text-sm">Contenido</h3>
                                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                                        {completedClasses.length}/{course.clases?.length}
                                    </span>
                                </div>
                                <div className="max-h-[60vh] overflow-y-auto">
                                    {course.clases?.map((clase, idx) => {
                                        const isActive = clase.slug === classId;
                                        const completed = completedClasses.includes(clase.id);
                                        return (
                                            <Link
                                                key={clase.id}
                                                href={`/cursos/${course.slug}/clase/${clase.slug}`}
                                                className={`flex items-start p-4 border-b border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group ${isActive ? 'bg-primary/5 dark:bg-primary/10 border-l-4 border-l-primary' : ''}`}
                                            >
                                                <div className={`mt-1 mr-3 shrink-0 ${isActive ? 'text-primary' : completed ? 'text-green-500' : 'text-gray-400 group-hover:text-primary'}`}>
                                                    <span className="material-icons text-xl">
                                                        {completed ? 'check_circle' : (isActive ? 'play_circle_filled' : 'play_circle_outline')}
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <p className={`text-sm font-medium leading-tight mb-1 ${isActive ? 'text-primary' : 'text-gray-900 dark:text-gray-200'}`}>
                                                        {clase.titulo}
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] text-gray-500 uppercase font-mono">Clase {clase.orden || (idx + 1)}</span>
                                                        {completed && <span className="material-icons text-xs text-green-500">done_all</span>}
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
