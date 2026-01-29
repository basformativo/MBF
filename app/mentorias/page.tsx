
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getInstructors, getImageUrl } from "../lib/courses";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function MentoriasPage() {
    const instructors = await getInstructors();

    return (
        <>
            <Header />
            <main className="w-full bg-background-light dark:bg-background-dark min-h-screen">

                {/* Hero Mentorías */}
                <section className="relative py-24 border-b border-border-light dark:border-border-dark overflow-hidden bg-surface-light dark:bg-surface-dark">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-5 pointer-events-none">
                        <span className="text-[25rem] display-font text-primary select-none">Vip</span>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                        <span className="bg-primary/10 text-primary px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.3em] mb-8 inline-block">
                            Experiencia Exclusiva
                        </span>
                        <h1 className="text-6xl md:text-8xl display-font text-black dark:text-white mb-8 uppercase tracking-tighter leading-none">
                            Mentorías<br /><span className="text-primary italic">1 a 1</span>
                        </h1>
                        <p className="text-xl max-w-2xl mx-auto text-gray-500 dark:text-gray-400 font-light leading-relaxed">
                            Acelera tu carrera como entrenador trabajando directamente con los líderes de la industria. Sesiones personalizadas, análisis de video y planificación estratégica.
                        </p>
                    </div>
                </section>

                {/* Benefits / How it works */}
                <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-black dark:bg-white text-white dark:text-black rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                                <span className="material-icons text-3xl">videocam</span>
                            </div>
                            <h3 className="text-xl font-bold uppercase mb-4">Análisis Directo</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">Revisión profunda de tus sesiones de entrenamiento y tácticas de juego.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-20 h-20 bg-primary text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20">
                                <span className="material-icons text-3xl">calendar_month</span>
                            </div>
                            <h3 className="text-xl font-bold uppercase mb-4">Flexibilidad Total</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">Agenda tus sesiones según tu disponibilidad y ritmo de aprendizaje.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-20 h-20 bg-black dark:bg-white text-white dark:text-black rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                                <span className="material-icons text-3xl">trending_up</span>
                            </div>
                            <h3 className="text-xl font-bold uppercase mb-4">Crecimiento Real</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">Recibe feedback accionable para implementar en tu equipo mañana mismo.</p>
                        </div>
                    </div>
                </section>

                {/* Instructors Grid */}
                <section className="py-24 bg-gray-50 dark:bg-black/20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                            <div>
                                <h2 className="text-4xl md:text-6xl display-font text-black dark:text-white uppercase tracking-tighter">Nuestros Mentores</h2>
                                <p className="text-gray-500 dark:text-gray-400 mt-4 text-lg">Selecciona al profesional que mejor se adapte a tus objetivos.</p>
                            </div>
                            <div className="h-[1px] flex-1 bg-border-light dark:bg-border-dark mb-4 mx-8 hidden lg:block"></div>
                        </div>

                        {instructors.length === 0 ? (
                            <div className="bg-white dark:bg-surface-dark p-2 text-center rounded-3xl border border-dashed border-gray-300 dark:border-gray-700 py-20">
                                <p className="text-gray-400 italic">Buscando mentores disponibles...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {instructors.map((inst) => (
                                    <div key={inst.id} className="group bg-white dark:bg-surface-dark rounded-[2.5rem] overflow-hidden border border-border-light dark:border-border-dark flex flex-col sm:flex-row shadow-sm hover:shadow-2xl transition-all duration-500">
                                        <div className="w-full sm:w-2/5 aspect-[4/5] sm:aspect-auto overflow-hidden relative">
                                            <img
                                                src={getImageUrl(inst.foto)}
                                                alt={`${inst.nombre} ${inst.apellido}`}
                                                className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-1000 transform group-hover:scale-110"
                                            />
                                        </div>
                                        <div className="flex-1 p-8 sm:p-10 flex flex-col justify-between">
                                            <div>
                                                <span className="text-primary text-[10px] uppercase font-black tracking-widest mb-2 block">{inst.especialidad}</span>
                                                <h3 className="text-3xl display-font text-black dark:text-white mb-4">
                                                    {inst.nombre}<br />{inst.apellido}
                                                </h3>
                                                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 mb-6 font-light leading-relaxed">
                                                    {inst.bio}
                                                </p>
                                            </div>

                                            <div className="flex flex-col gap-4">
                                                <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
                                                    <span className="flex items-center gap-1"><span className="material-icons text-sm">stars</span> Experto</span>
                                                    <span className="flex items-center gap-1"><span className="material-icons text-sm">schedule</span> 1h sesión</span>
                                                </div>
                                                <a
                                                    href={`mailto:${inst.email || 'info@basquetformativo.com'}?subject=Consulta Mentoria con ${inst.nombre} ${inst.apellido}`}
                                                    className="bg-black dark:bg-white text-white dark:text-black hover:bg-primary dark:hover:bg-primary hover:text-white dark:hover:text-white transition-all text-center py-4 rounded-full font-bold uppercase tracking-widest text-xs shadow-lg hover:shadow-primary/20"
                                                >
                                                    Solicitar Mentoría
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* FAQ / Final CTA */}
                <section className="py-32 text-center bg-white dark:bg-background-dark">
                    <div className="max-w-3xl mx-auto px-4">
                        <h2 className="text-3xl md:text-5xl display-font mb-8 uppercase tracking-tighter">¿Tienes dudas sobre el proceso?</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-12">Nuestro equipo técnico te ayudará a seleccionar al mentor ideal según tu nivel y objetivos actuales.</p>
                        <Link href="/contacto" className="inline-flex items-center gap-3 border-b-2 border-primary pb-2 font-bold uppercase tracking-widest hover:text-primary transition-colors">
                            Hablar con Soporte <span className="material-icons">arrow_forward</span>
                        </Link>
                    </div>
                </section>

            </main>
            <Footer />
        </>
    );
}
