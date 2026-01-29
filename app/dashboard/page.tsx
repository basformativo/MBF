
import Header from "../components/Header";
import Footer from "../components/Footer";
import { cookies } from "next/headers";
import { createDirectus, rest, staticToken, readMe } from "@directus/sdk";
import { getUserCourses, getCourseProgress, getImageUrl, getCourseBySlug } from "../lib/courses";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

export default async function DashboardPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value;

    if (!token) {
        redirect('/login');
    }

    const client = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(token));
    let user;
    try {
        user = await client.request(readMe());
    } catch (e) {
        redirect('/login');
    }

    const courses = await getUserCourses(user.id);

    return (
        <>
            <Header />
            <main className="min-h-screen bg-background-light dark:bg-background-dark pb-20">

                {/* Dashboard Header */}
                <section className="bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-4xl md:text-6xl display-font mb-4 uppercase">Panel de Alumno</h1>
                        <p className="text-gray-500 dark:text-gray-400">Bienvenido de nuevo, <span className="text-primary font-bold">{user.first_name}</span>. Continúa con tu formación.</p>
                    </div>
                </section>

                {/* Courses List */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex justify-between items-end mb-8 border-b border-border-light dark:border-border-dark pb-4">
                        <h2 className="text-2xl display-font uppercase">Mis Cursos</h2>
                    </div>

                    {courses.length === 0 ? (
                        <div className="bg-white dark:bg-surface-dark rounded-3xl p-12 text-center border border-dashed border-gray-300 dark:border-gray-700">
                            <span className="material-icons text-6xl text-gray-200 mb-4">school</span>
                            <p className="text-gray-500 mb-6">Aún no te has inscrito en ningún curso.</p>
                            <Link href="/cursos" className="bg-primary text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:scale-105 transition-transform inline-block">
                                Explorar Cursos
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {await Promise.all(courses.map(async (course) => {
                                const completedClasses = await getCourseProgress(user.id, course.id);
                                const fullCourse = await getCourseBySlug(course.slug);

                                const totalClases = fullCourse?.clases?.length || 0;
                                const progressPercent = totalClases > 0 ? Math.round((completedClasses.length / totalClases) * 100) : 0;

                                // Determinar a qué clase redirigir (la primera por defecto o la primera no completada)
                                const firstClassSlug = fullCourse?.clases?.[0]?.slug || 'introduccion';
                                const continueSlug = fullCourse?.clases?.find(c => !completedClasses.some(p => p.clase === c.id))?.slug || firstClassSlug;

                                return (
                                    <div key={course.id} className="group bg-white dark:bg-surface-dark rounded-3xl overflow-hidden border border-border-light dark:border-border-dark shadow-sm hover:shadow-xl transition-all duration-300">
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={getImageUrl(course.Imagen_Portada)}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                alt={course.titulo}
                                            />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/cursos/${course.slug}`} className="bg-white text-black px-6 py-2 rounded-full font-bold uppercase text-xs tracking-widest">
                                                    Ver Detalles
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl display-font mb-4 min-h-12 line-clamp-2">{course.titulo}</h3>

                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-tighter">
                                                    <span className="text-gray-400">Completado</span>
                                                    <span className="text-primary">{progressPercent}%</span>
                                                </div>
                                                <div className="w-full h-2 bg-gray-100 dark:bg-black/20 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary transition-all duration-1000"
                                                        style={{ width: `${progressPercent}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mt-8 flex items-center justify-between">
                                                <span className="text-[10px] text-gray-400 font-mono uppercase">
                                                    {completedClasses.length} de {totalClases} lecciones
                                                </span>
                                                <Link
                                                    href={`/cursos/${course.slug}/clase/${continueSlug}`}
                                                    className="flex items-center text-primary font-bold uppercase text-xs tracking-widest hover:underline"
                                                >
                                                    {progressPercent === 100 ? 'Repasar' : 'Continuar'} <span className="material-icons text-sm ml-1">arrow_forward</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }))}
                        </div>
                    )}
                </section>

                {/* Quick Info / Stats */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white dark:bg-surface-dark p-6 rounded-3xl border border-border-light dark:border-border-dark flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <span className="material-icons">history</span>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Última actividad</p>
                                <p className="font-bold text-sm">Hoy</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-surface-dark p-6 rounded-3xl border border-border-light dark:border-border-dark flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                                <span className="material-icons">local_library</span>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Cursos activos</p>
                                <p className="font-bold text-sm">{courses.length}</p>
                            </div>
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </>
    );
}
