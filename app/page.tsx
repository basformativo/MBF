import Link from "next/link";
import sanitizeHtml from "sanitize-html";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { getHomePageData } from "./lib/home";
import { getImageUrl } from "./lib/courses";

export const revalidate = 0;

export default async function Home() {
  const data = await getHomePageData();

  return (
    <>
      <Header />

      <main className="w-full overflow-hidden">
        {/* Hero Section */}
        <section className="relative pt-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
            <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-5 pointer-events-none select-none overflow-hidden text-text-site">
              <h1 className="text-[8rem] md:text-[12rem] leading-none whitespace-nowrap">
                {data?.inicio_texto_fondo || "ENTRENA"}
              </h1>
            </div>
            <div className="lg:col-span-4 mt-20 relative z-10">
              <div className="border-t-2 border-border-site pt-4 mb-4">
                <span className="text-sm font-mono opacity-60">
                  {data?.inicio_subtitulo || "EST. 2026"}
                </span>
              </div>
              <h1 className="text-6xl md:text-8xl display-font leading-none mb-6 text-text-site">
                {data?.inicio_titulo ? (
                  <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(data.inicio_titulo) }} />
                ) : (
                  <>MEJORA TU<br />JUEGO HOY</>
                )}
              </h1>
            </div>
            <div className="lg:col-span-4 flex justify-center relative z-20 -mt-10 lg:mt-0">
              <div className="bg-primary p-8 rounded-2xl shadow-2xl text-white transform rotate-2 hover:rotate-0 transition-transform duration-500 w-full max-w-sm">
                <div className="flex justify-between items-start mb-12">
                  <span className="material-icons text-4xl">sports_basketball</span>
                  <span className="text-xs border border-white px-2 py-1 rounded-full">
                    {data?.inicio_tarjeta_titulo || "ÚNETE AHORA"}
                  </span>
                </div>
                <p className="text-lg font-medium leading-relaxed mb-8">
                  {data?.inicio_tarjeta_descripcion || "Capacítate para ser el mejor entrenador. Aumenta tus conocimientos y habilidades con nuestros cursos especializados en básquet formativo."}
                </p>
                <div className="flex justify-between items-end border-t border-white/30 pt-4">
                  <span className="text-xs uppercase tracking-wider">
                    {data?.inicio_tarjeta_pie || "Desde 2016"}
                  </span>
                  <span className="material-icons animate-bounce">
                    arrow_downward
                  </span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-4 flex flex-col items-end justify-center lg:mt-20">
              <div className="border-b-2 border-border-site w-full text-right pb-4 mb-4">
                <span className="text-5xl md:text-7xl display-font text-text-site">
                  {data?.inicio_etiqueta || "NIVEL PRO"}
                </span>
              </div>
              <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-border-site mt-4 bg-surface-site">
                <img
                  alt="Basketball hoop"
                  className="w-full h-full object-cover"
                  src={data?.inicio_imagen_principal ? getImageUrl(data.inicio_imagen_principal) : "/basketball_hoop.png"}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <span className="material-icons text-white text-4xl">
                    play_circle
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About/Methodology Section */}
        <section className="py-20 bg-surface-site">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h2 className="text-sm font-bold uppercase tracking-widest opacity-50 mb-2">
                {data?.filosofia_subtitulo || "Nuestra Filosofía"}
              </h2>
              <p className="max-w-2xl text-xl text-text-site leading-relaxed">
                {data?.filosofia_descripcion || "En Básquet Formativo, nos aseguramos de contar con entrenadores altamente calificados, comprometidos en ayudarte a alcanzar el máximo rendimiento."}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-border-site rounded-3xl p-8 flex flex-col items-center justify-center hover:shadow-lg transition-all bg-bg-site group cursor-pointer h-64 relative overflow-hidden">
                <div className="absolute top-4 left-4 text-xs font-mono text-gray-400">
                  01
                </div>
                <span className="material-icons text-6xl mb-4 group-hover:text-primary transition-colors">
                  school
                </span>
                <h3 className="text-2xl display-font">{data?.filosofia_caract_1_titulo || "Formativo"}</h3>
                <p className="text-center text-sm text-gray-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {data?.filosofia_caract_1_desc || "Habilidades fundamentales para iniciación deportiva."}
                </p>
                <div className="absolute bottom-4 w-full px-8">
                  <div className="h-1 w-full bg-border-site rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-0 group-hover:w-full transition-all duration-700"></div>
                  </div>
                </div>
              </div>
              <div className="border border-border-site rounded-3xl p-8 flex flex-col items-center justify-center hover:shadow-lg transition-all bg-bg-site group cursor-pointer h-64 relative overflow-hidden">
                <div className="absolute top-4 left-4 text-xs font-mono text-gray-400">
                  02
                </div>
                <span className="material-icons text-6xl mb-4 group-hover:text-primary transition-colors">
                  emoji_events
                </span>
                <h3 className="text-2xl display-font">{data?.filosofia_caract_2_titulo || "Avanzado"}</h3>
                <p className="text-center text-sm text-gray-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {data?.filosofia_caract_2_desc || "Estrategias defensivas y liderazgo de equipo."}
                </p>
                <div className="absolute bottom-4 w-full px-8">
                  <div className="h-1 w-full bg-border-site rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-0 group-hover:w-full transition-all duration-700 delay-100"></div>
                  </div>
                </div>
              </div>
              <div className="border border-border-site rounded-3xl p-8 flex flex-col items-center justify-center hover:shadow-lg transition-all bg-bg-site group cursor-pointer h-64 relative overflow-hidden">
                <div className="absolute top-4 left-4 text-xs font-mono text-gray-400">
                  03
                </div>
                <span className="material-icons text-6xl mb-4 group-hover:text-primary transition-colors">
                  military_tech
                </span>
                <h3 className="text-2xl display-font">{data?.filosofia_caract_3_titulo || "Elite"}</h3>
                <p className="text-center text-sm text-gray-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {data?.filosofia_caract_3_desc || "Tecnificación y análisis de rendimiento superior."}
                </p>
                <div className="absolute bottom-4 w-full px-8">
                  <div className="h-1 w-full bg-border-site rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-0 group-hover:w-full transition-all duration-700 delay-200"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Highlight Section */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
              <img
                alt="Entrenador en acción"
                className="w-full h-[600px] object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700"
                src={data?.cursos_imagen_destacada ? getImageUrl(data.cursos_imagen_destacada) : "https://directuscontrol.basketformativo.com/assets/ec337dc4-1de0-4de7-9d35-e2cfe27afd51"}
              />
              <div className="absolute top-6 right-6 bg-primary text-white w-24 h-24 rounded-full flex items-center justify-center animate-spin-slow">
                <svg className="absolute w-full h-full" viewBox="0 0 100 100">
                  <path d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" id="circle" fill="none"></path>
                  <text fill="white" fontSize="12" fontWeight="bold" letterSpacing="1.8">
                    <textPath xlinkHref="#circle">{data?.cursos_etiqueta_flotante || "BÁSQUET FORMATIVO • 2026 •"}</textPath>
                  </text>
                </svg>
                <span className="material-icons text-3xl transform -rotate-12">bolt</span>
              </div>
              <div className="absolute bottom-0 left-0 p-8 bg-gradient-to-t from-black/80 to-transparent w-full">
                <h3 className="text-white text-5xl display-font mb-2">
                  {data?.cursos_imagen_titulo || "Cursos Online"}
                </h3>
                <Link href="/cursos" className="text-white underline decoration-primary decoration-2 underline-offset-4 font-bold hover:text-primary transition-colors">
                  {data?.cursos_imagen_boton || "VER CATÁLOGO"}
                </Link>
              </div>
            </div>
            <div className="flex flex-col space-y-8">
              <div className="border-t-4 border-primary pt-6">
                <h2 className="text-4xl md:text-5xl display-font mb-4 text-text-site">
                  {data?.cursos_titulo ? (
                    <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(data.cursos_titulo) }} />
                  ) : (
                    <>INNOVANDO CON<br />CONOCIMIENTO</>
                  )}
                </h2>
                <p className="text-text-site opacity-70 mb-6 leading-relaxed">
                  {data?.cursos_descripcion || "Creemos que el conocimiento es clave para el éxito en el baloncesto. Nuestros programas están diseñados para brindarte las herramientas teóricas y prácticas necesarias para destacar en la formación de jugadores."}
                </p>
                <div className="space-y-4 py-4">
                  <div className="flex items-center space-x-4 p-4 rounded-xl bg-surface-site border border-border-site group hover:border-primary transition-colors">
                    <span className="material-icons text-primary text-3xl font-normal">psychology</span>
                    <div>
                      <h4 className="font-bold text-sm uppercase text-text-site">{data?.cursos_beneficio_1_titulo || "Metodología Avanzada"}</h4>
                      <p className="text-xs text-text-site opacity-60">{data?.cursos_beneficio_1_desc || "Sistemas de entrenamiento validados por expertos."}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 rounded-xl bg-surface-site border border-border-site group hover:border-primary transition-colors">
                    <span className="material-icons text-primary text-3xl font-normal">groups</span>
                    <div>
                      <h4 className="font-bold text-sm uppercase text-text-site">{data?.cursos_beneficio_2_titulo || "Comunidad de Élite"}</h4>
                      <p className="text-xs text-text-site opacity-60">{data?.cursos_beneficio_2_desc || "Red exclusiva de entrenadores internacionales."}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 rounded-xl bg-surface-site border border-border-site group hover:border-primary transition-colors">
                    <span className="material-icons text-primary text-3xl font-normal">workspace_premium</span>
                    <div>
                      <h4 className="font-bold text-sm uppercase text-text-site">{data?.cursos_beneficio_3_titulo || "Certificación Pro"}</h4>
                      <p className="text-xs text-text-site opacity-60">{data?.cursos_beneficio_3_desc || "Validez curricular para tu carrera profesional."}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-border-site">
                  <Link href="/cursos" className="text-sm font-bold uppercase tracking-wide flex items-center hover:text-primary transition-colors">
                    Saber Más <span className="material-icons ml-2 text-sm bg-primary text-white rounded-full p-0.5">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* New Mentoring 1a1 Section */}
        <section className="py-24 bg-surface-site border-y border-border-site relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-5 pointer-events-none hidden lg:block">
            <span className="text-[20rem] display-font text-primary select-none rotate-12">{data?.mentorias_texto_fondo || "VIP"}</span>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-primary font-bold uppercase tracking-widest text-sm mb-4 block">{data?.mentorias_subtitulo || "Experiencia Exclusiva"}</span>
                <h2 className="text-5xl md:text-7xl display-font text-text-site mb-8 leading-none">
                  {data?.mentorias_titulo ? (
                    <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(data.mentorias_titulo) }} />
                  ) : (
                    <>MENTORÍAS<br /><span className="text-primary italic">1 A 1</span></>
                  )}
                </h2>
                <p className="text-lg text-text-site opacity-70 mb-10 leading-relaxed max-w-xl">
                  {data?.mentorias_descripcion || "Lleva tu carrera como entrenador al siguiente nivel con feedback directo de los mejores. Sesiones personalizadas de 60 minutos enfocadas exclusivamente en tus desafíos tácticos, gestión de grupos y planificación estratégica."}
                </p>
                <div className="grid grid-cols-2 gap-8 mb-12">
                  <div className="flex flex-col space-y-2">
                    <span className="material-icons text-primary text-3xl">videocam</span>
                    <h4 className="font-bold uppercase text-sm">{data?.mentorias_caract_1_titulo || "Sesiones en Vivo"}</h4>
                    <p className="text-xs opacity-60 italic">{data?.mentorias_caract_1_desc || "Online sin fronteras."}</p>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <span className="material-icons text-primary text-3xl">trending_up</span>
                    <h4 className="font-bold uppercase text-sm">{data?.mentorias_caract_2_titulo || "Análisis Táctico"}</h4>
                    <p className="text-xs opacity-60 italic">{data?.mentorias_caract_2_desc || "Feedback accionable."}</p>
                  </div>
                </div>
                <Link href="/mentorias" className="inline-block bg-primary text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest hover:bg-black transition-all hover:shadow-2xl hover:shadow-primary/20 transform hover:-translate-y-1">
                  {data?.mentorias_boton || "AGENDAR MI SESIÓN"}
                </Link>
              </div>
              <div className="relative">
                <div className="rounded-[3rem] overflow-hidden shadow-2xl border-2 border-border-site group">
                  <img 
                    src={data?.mentorias_imagen ? getImageUrl(data.mentorias_imagen) : "https://directuscontrol.basketformativo.com/assets/78a0c97f-6c61-42bc-a1a8-637637f53051"} 
                    alt="Mentoria 1 a 1" 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                {/* Decorative floating element */}
                <div className="absolute -bottom-8 -left-8 bg-white dark:bg-black p-8 rounded-3xl shadow-2xl border border-border-site hidden sm:block animate-bounce-slow">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white">
                      <span className="material-icons">event_available</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider">{data?.mentorias_etiqueta_titulo || "Cupos Limitados"}</p>
                      <p className="text-[10px] opacity-50">{data?.mentorias_etiqueta_desc || "Solo 5 plazas por mes"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-bg-site border-t border-border-site">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center mb-8">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mr-4">
                {data?.estadisticas_subtitulo || "De Un Vistazo"}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-surface-site p-8 rounded-2xl border border-border-site">
                <h3 className="text-5xl display-font mb-2 text-text-site">{data?.estadisticas_1_valor || "85%"}</h3>
                <p className="text-sm text-gray-500">
                  {data?.estadisticas_1_desc || "Aumento en habilidades técnicas reportado por nuestros alumnos."}
                </p>
              </div>
              <div className="bg-surface-site p-8 rounded-2xl border border-border-site">
                <h3 className="text-5xl display-font mb-2 text-text-site">{data?.estadisticas_2_valor || "90%"}</h3>
                <p className="text-sm text-gray-500">
                  {data?.estadisticas_2_desc || "Mejora significativa en la toma de decisiones en cancha."}
                </p>
              </div>
              <div className="bg-primary text-white p-8 rounded-2xl">
                <h3 className="text-5xl display-font mb-2">{data?.estadisticas_3_valor || "100+"}</h3>
                <p className="text-sm opacity-90">
                  {data?.estadisticas_3_desc || "Entrenadores capacitados en nuestra plataforma."}
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
