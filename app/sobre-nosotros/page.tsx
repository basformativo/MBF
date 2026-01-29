
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getAdminClient } from "../lib/directus";
import { readItems } from "@directus/sdk";
import { getImageUrl } from "../lib/courses";

export const dynamic = 'force-dynamic';

async function getTeam() {
    try {
        const client = getAdminClient();
        const result = await client.request(readItems('equipo' as any, {
            sort: ['orden' as any],
            fields: ['*']
        }));
        return result;
    } catch (error: any) {
        console.error('Error fetching team from Directus:', error.message || error);
        return [];
    }
}

export default async function AboutPage() {
    const team = await getTeam();

    return (
        <>
            <Header />
            <main className="w-full bg-background-light dark:bg-background-dark min-h-screen">

                {/* Hero Section */}
                <section className="relative py-20 border-b border-border-light dark:border-border-dark overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-10 pointer-events-none">
                        <span className="text-[20rem] display-font text-primary">BF</span>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <h1 className="text-6xl md:text-8xl display-font text-black dark:text-white mb-8 uppercase">
                            NUESTRA<br />PASIÓN
                        </h1>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-light">
                            <p>
                                Básquet Formativo nació con una misión clara: profesionalizar la enseñanza del baloncesto en las etapas iniciales. Creemos que el futuro de este deporte depende de la calidad de los entrenadores que forman a los más jóvenes.
                            </p>
                            <p>
                                No somos solo una plataforma de cursos; somos una comunidad de apasionados por el aro, la pizarra y el desarrollo humano. Combinamos la ciencia del deporte con la pedagogía aplicada.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Stats / Impact */}
                <section className="bg-primary text-white py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div>
                                <span className="block text-5xl display-font mb-2">10+</span>
                                <span className="text-sm uppercase tracking-wider opacity-90">Años de experiencia</span>
                            </div>
                            <div>
                                <span className="block text-5xl display-font mb-2">5k+</span>
                                <span className="text-sm uppercase tracking-wider opacity-90">Alumnos Graduados</span>
                            </div>
                            <div>
                                <span className="block text-5xl display-font mb-2">15</span>
                                <span className="text-sm uppercase tracking-wider opacity-90">Países Alcanzados</span>
                            </div>
                            <div>
                                <span className="block text-5xl display-font mb-2">50+</span>
                                <span className="text-sm uppercase tracking-wider opacity-90">Cursos Producidos</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Grid */}
                <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl md:text-5xl display-font mb-16 text-center text-black dark:text-white uppercase tracking-tighter">Nuestros Pilares</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-surface-light dark:bg-surface-dark p-10 rounded-3xl border border-border-light dark:border-border-dark group hover:border-primary transition-colors">
                            <span className="material-icons text-5xl text-primary mb-6">school</span>
                            <h3 className="text-xl font-bold mb-4 uppercase">Educación Continua</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                El baloncesto evoluciona y nosotros también. Actualizamos nuestros contenidos constantemente para estar a la vanguardia.
                            </p>
                        </div>
                        <div className="bg-surface-light dark:bg-surface-dark p-10 rounded-3xl border border-border-light dark:border-border-dark group hover:border-primary transition-colors">
                            <span className="material-icons text-5xl text-primary mb-6">groups</span>
                            <h3 className="text-xl font-bold mb-4 uppercase">Comunidad</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                Fomentamos el intercambio de conocimientos entre entrenadores novatos y expertos internacionales.
                            </p>
                        </div>
                        <div className="bg-surface-light dark:bg-surface-dark p-10 rounded-3xl border border-border-light dark:border-border-dark group hover:border-primary transition-colors">
                            <span className="material-icons text-5xl text-primary mb-6">psychology</span>
                            <h3 className="text-xl font-bold mb-4 uppercase">Visión Integral</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                Formamos jugadores, pero sobre todo formamos personas. Los valores humanos son nuestra base innegociable.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="py-24 bg-gray-50 dark:bg-black/20 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                            <div>
                                <h2 className="text-5xl md:text-8xl display-font text-black dark:text-white uppercase leading-none">Nuestro Staff</h2>
                                <p className="text-gray-500 dark:text-gray-400 mt-6 text-xl font-light">El equipo detrás de tu formación profesional.</p>
                            </div>
                            <div className="h-[2px] w-32 bg-primary rounded-full hidden md:block"></div>
                        </div>

                        {team.length === 0 ? (
                            <div className="bg-white dark:bg-surface-dark p-20 rounded-3xl text-center border border-dashed border-gray-300 dark:border-gray-700">
                                <span className="material-icons text-6xl text-gray-200 mb-4">person_off</span>
                                <p className="text-gray-500 italic">No se han podido cargar los miembros del equipo. Por favor, revisa la conexión con Directus.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20">
                                {team.map((member: any) => (
                                    <div key={member.id} className="group">
                                        <div className="aspect-3/4 bg-gray-200 dark:bg-surface-dark rounded-[2.5rem] overflow-hidden mb-8 relative shadow-xl group-hover:shadow-2xl transition-all duration-700">
                                            <img
                                                src={getImageUrl(member.foto)}
                                                alt={`${member.nombre} ${member.apellido}`}
                                                className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-1000 transform group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                                                <p className="text-white text-[10px] font-mono uppercase tracking-[0.2em] mb-2">Contacto Directo</p>
                                                <p className="text-white text-sm font-bold truncate">{member.email}</p>
                                            </div>
                                        </div>
                                        <h3 className="text-3xl display-font text-black dark:text-white group-hover:text-primary transition-colors duration-500">
                                            {member.nombre}<br />{member.apellido}
                                        </h3>
                                        <div className="flex items-center gap-3 mt-4">
                                            <div className="h-[2px] w-6 bg-primary transition-all duration-500 group-hover:w-12"></div>
                                            <p className="text-primary text-[11px] uppercase font-black tracking-widest">{member.titulo}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

            </main>
            <Footer />
        </>
    );
}
