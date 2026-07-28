
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import { getCourses, getImageUrl } from "../lib/courses";

export const dynamic = 'force-dynamic'; // Ensure fresh data

export default async function CursosPage() {
    const courses = await getCourses();

    return (
        <>
            <Header />
            <main className="w-full bg-bg-site min-h-screen">

                {/* Header Section */}
                <section className="relative overflow-hidden py-24 md:py-36 border-b border-border-site">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/Fondo.png"
                            alt=""
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/70"></div>
                    </div>
                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-6xl md:text-8xl display-font text-white mb-6">
                            NUESTROS<br />CURSOS
                        </h1>
                        <p className="text-xl max-w-2xl text-white/80">
                            Formación especializada para entrenadores que buscan la excelencia. Explora nuestro catálogo y lleva tu carrera al siguiente nivel.
                        </p>
                    </div>
                </section>

                {/* Courses Grid */}
                <section className="bg-black dark:bg-white py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {courses.map((course) => {
                                const mainCategory = course.categorias?.[0]?.categoria?.nombre || 'General';
                                return (
                                    <Link
                                        key={course.id}
                                        href={`/cursos/${course.slug}`}
                                        className="group block cursor-pointer bg-surface-site rounded-2xl overflow-hidden border border-border-site hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                                    >
                                        <div className="relative h-64 overflow-hidden bg-gray-200">
                                            <img
                                                src={getImageUrl(course.Imagen_Portada)}
                                                alt={course.titulo}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-x-4 top-4 z-20 flex items-start justify-between gap-2">
                                                <span className="bg-surface-site text-text-site text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-border-site truncate">
                                                    {mainCategory}
                                                </span>
                                                {course.disponible ? (
                                                    <span className="shrink-0 whitespace-nowrap bg-green-500/15 text-green-600 dark:text-green-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-green-500/30 backdrop-blur-sm">
                                                        Disponible
                                                    </span>
                                                ) : (
                                                    <span className="shrink-0 whitespace-nowrap bg-red-500/15 text-red-600 dark:text-red-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-red-500/30 backdrop-blur-sm">
                                                        No disponible
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-8">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-border-site text-text-site/60">
                                                    {course.nivel}
                                                </span>
                                                <span className="bg-accent/10 text-accent font-mono font-bold text-sm px-3 py-1 rounded-full">
                                                    {course.moneda === 'USD' ? 'US$' : '$'}{new Intl.NumberFormat('es-AR').format(course.precio)}
                                                </span>
                                            </div>
                                            <h3 className="text-2xl display-font text-text-site mb-3 group-hover:text-primary transition-colors">
                                                {course.titulo}
                                            </h3>
                                            <p className="text-text-site opacity-60 text-sm leading-relaxed mb-8 line-clamp-3">
                                                {course.descripcion_corta}
                                            </p>

                                            <div className="flex items-center justify-end pt-6 border-t border-border-site">
                                                <span className="material-icons text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all">arrow_forward</span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="py-20 bg-primary text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-4xl md:text-6xl display-font mb-6">¿LISTO PARA EMPEZAR?</h2>
                        <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
                            Únete a miles de entrenadores que ya están aplicando nuestros métodos en sus equipos.
                        </p>
                        <button className="bg-white text-primary px-10 py-4 rounded-full font-bold uppercase tracking-wide hover:bg-black hover:text-white transition-colors duration-300">
                            Obtener Acceso Total
                        </button>
                    </div>
                </section>

            </main>
            <Footer />
        </>
    );
}
