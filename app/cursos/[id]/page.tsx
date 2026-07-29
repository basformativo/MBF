
import sanitizeHtml from "sanitize-html";
import { cookies } from "next/headers";
import { createDirectus, rest, staticToken, readMe } from "@directus/sdk";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Link from "next/link";
import { getCourseBySlug, getApprovedCourseAccess, getImageUrl } from "../../lib/courses";
import { isCourseInCart } from "../../lib/cart";
import { notFound } from "next/navigation";
import EnrollButton from "../../components/EnrollButton";
import CartIconButton, { CartIconState } from "../../components/CartIconButton";

export const dynamic = 'force-dynamic';
const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

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

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value;

    let cartIconState: CartIconState = 'guest';
    if (token) {
        try {
            const userClient = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(token));
            const user = await userClient.request(readMe());
            const access = await getApprovedCourseAccess(user.id, course.id);
            if (access) {
                cartIconState = 'owned';
            } else if (await isCourseInCart(user.id, course.id)) {
                cartIconState = 'in_cart';
            } else if (course.disponible === false) {
                cartIconState = 'unavailable';
            } else {
                cartIconState = 'add';
            }
        } catch (e) {
            cartIconState = 'guest';
        }
    } else if (course.disponible === false) {
        cartIconState = 'unavailable';
    }

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
                                <span className="bg-accent/10 text-accent font-mono font-bold text-3xl px-4 py-1 rounded-full">
                                    {course.moneda === 'USD' ? 'US$' : '$'}{new Intl.NumberFormat('es-AR').format(course.precio)}
                                </span>
                                <CartIconButton courseId={course.id} state={cartIconState} />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Acceso de por vida • Soporte 24/7</p>
                        </div>
                        <div className="flex flex-col items-center md:items-end">
                            <EnrollButton courseId={course.id} disponible={course.disponible} />
                        </div>
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
                                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(course.descripcion) }}
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
