
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
            <main className="w-full bg-background-light dark:bg-background-dark min-h-screen">

                {/* Header Section */}
                <section className="bg-surface-light dark:bg-surface-dark py-20 border-b border-border-light dark:border-border-dark">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-6xl md:text-8xl display-font text-black dark:text-white mb-6">
                            NUESTROS<br />CURSOS
                        </h1>
                        <p className="text-xl max-w-2xl text-gray-600 dark:text-gray-300">
                            Formación especializada para entrenadores que buscan la excelencia. Explora nuestro catálogo y lleva tu carrera al siguiente nivel.
                        </p>
                    </div>
                </section>

                {/* Courses Grid */}
                <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map((course) => {
                            const mainCategory = course.categorias?.[0]?.categoria?.nombre || 'General';
                            return (
                                <div key={course.id} className="group bg-white dark:bg-surface-dark rounded-2xl overflow-hidden border border-border-light dark:border-border-dark hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                                    <div className="relative h-64 overflow-hidden bg-gray-200">
                                        <img
                                            src={getImageUrl(course.Imagen_Portada)}
                                            alt={course.titulo}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute top-4 left-4 z-20">
                                            <span className="bg-white dark:bg-black text-black dark:text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-border-light dark:border-border-dark">
                                                {mainCategory}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-8">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-xs font-mono text-gray-400 uppercase">{course.nivel}</span>
                                            <span className="text-primary font-bold text-lg">
                                                {course.moneda === 'USD' ? '$' : ''}{course.precio} {course.moneda !== 'USD' ? course.moneda : ''}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl display-font text-black dark:text-white mb-3 group-hover:text-primary transition-colors">
                                            {course.titulo}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-8 line-clamp-3">
                                            {course.descripcion_corta}
                                        </p>

                                        <div className="flex items-center justify-between pt-6 border-t border-border-light dark:border-border-dark">
                                            <Link href={`/cursos/${course.slug}`} className="text-sm font-bold uppercase tracking-wide flex items-center hover:text-primary transition-colors">
                                                Ver Detalles
                                            </Link>
                                            <span className="material-icons text-gray-300 group-hover:text-primary transition-colors">arrow_forward</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
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
