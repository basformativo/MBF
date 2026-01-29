
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Link from "next/link";
import { getCourseBySlug, getImageUrl } from "../../lib/courses";
import { buyCourseAction } from "../../lib/actions";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function CourseDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    // We are treating the [id] dynamic segment as the slug
    const course = await getCourseBySlug(id);

    if (!course) {
        notFound();
    }

    const firstInstructor = course.instructores?.[0]?.instructor;
    const allCategories = course.categorias?.map(c => c.categoria.nombre).join(', ') || 'Sin categoría';

    return (
        <>
            <Header />
            <main className="w-full bg-background-light dark:bg-background-dark min-h-screen pb-20">
                {/* Hero Course */}
                <section className="relative h-[60vh] min-h-[500px] flex items-end">
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src={getImageUrl(course.Imagen_Portada)}
                            alt={course.titulo}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent"></div>
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16 text-white">
                        <div className="flex space-x-4 mb-4">
                            <span className="bg-primary px-4 py-1 text-sm font-bold uppercase tracking-wider rounded-full">
                                {allCategories}
                            </span>
                            <span className="border border-white/50 px-4 py-1 text-sm font-bold uppercase tracking-wider rounded-full">
                                {course.nivel}
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-7xl display-font mb-4 leading-none">
                            {course.titulo}
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-200 max-w-3xl font-light">
                            {course.descripcion_corta}
                        </p>
                    </div>
                </section>

                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
                    <div className="bg-white dark:bg-surface-dark rounded-3xl shadow-2xl border border-border-light dark:border-border-dark p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div>
                            <span className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-2 block">
                                Precio del Curso
                            </span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl display-font text-primary">
                                    {course.moneda === 'USD' ? '$' : ''}{course.precio} {course.moneda !== 'USD' ? course.moneda : ''}
                                </span>
                                <span className="text-gray-400 line-through text-lg">$99.99</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Acceso de por vida • Soporte 24/7</p>
                        </div>
                        <form action={async () => { 'use server'; await buyCourseAction(course.id); }}>
                            <button type="submit" className="bg-black dark:bg-white text-white dark:text-black hover:bg-primary dark:hover:bg-primary hover:text-white dark:hover:text-white transition-all px-10 py-5 rounded-full font-bold uppercase tracking-widest text-lg w-full md:w-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                                Comprar Ahora (Simulado)
                            </button>
                        </form>
                    </div>
                </section>

                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        <div className="space-y-12">
                            <div>
                                <h2 className="text-3xl display-font mb-8 border-b-2 border-black dark:border-white pb-4 inline-block">
                                    Descripción del Curso
                                </h2>
                                <div
                                    className="prose dark:prose-invert max-w-none text-lg text-gray-700 dark:text-gray-300"
                                    dangerouslySetInnerHTML={{ __html: course.descripcion }}
                                />
                            </div>

                            {/* Syllabus / Temario Section */}
                            <div>
                                <h2 className="text-3xl display-font mb-8 border-b-2 border-black dark:border-white pb-4 inline-block">
                                    Temario del Curso
                                </h2>
                                <div className="space-y-4">
                                    <div className="bg-gray-50 dark:bg-surface-dark p-6 rounded-2xl border border-border-light dark:border-border-dark">
                                        <h3 className="text-xl font-bold mb-4 flex items-center">
                                            <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-xs mr-3">1</span>
                                            Contenido de Clases
                                        </h3>
                                        <ul className="space-y-3">
                                            {course.clases?.map((clase, cIdx) => (
                                                <li key={cIdx}>
                                                    <Link
                                                        href={`/cursos/${course.slug}/clase/${clase.slug}`}
                                                        className="flex items-center text-gray-600 dark:text-gray-400 text-sm hover:text-primary transition-colors cursor-pointer justify-between group"
                                                    >
                                                        <div className="flex items-center">
                                                            <span className="material-icons text-xs mr-2 group-hover:scale-110 transition-transform">play_circle</span>
                                                            {clase.titulo}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {clase.es_gratis && (
                                                                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase">Gratis</span>
                                                            )}
                                                            <span className="material-icons text-xs opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                                                        </div>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    {(!course.clases || course.clases.length === 0) && (
                                        <p className="text-gray-500 italic">Temario en preparación...</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-3xl display-font mb-8 border-b-2 border-black dark:border-white pb-4 inline-block">
                                Instructores
                            </h2>
                            <div className="space-y-6">
                                {course.instructores?.map((item, idx) => {
                                    const inst = item.instructor;
                                    return (
                                        <div key={idx} className="bg-white dark:bg-surface-dark p-8 rounded-2xl border border-border-light dark:border-border-dark flex items-center space-x-6">
                                            <div className="w-24 h-24 rounded-full bg-gray-300 overflow-hidden shrink-0">
                                                <img
                                                    src={getImageUrl(inst.foto)}
                                                    alt={inst.nombre}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold mb-1">{inst.nombre} {inst.apellido}</h3>
                                                <p className="text-sm text-primary font-bold uppercase mb-2">{inst.especialidad}</p>
                                                <p className="text-sm text-gray-500">
                                                    {inst.bio}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                                {(!course.instructores || course.instructores.length === 0) && (
                                    <p className="text-gray-500 italic">No hay instructores asignados aún.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
