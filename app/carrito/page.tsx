
import { cookies } from "next/headers";
import { createDirectus, rest, staticToken, readMe } from "@directus/sdk";
import { redirect } from "next/navigation";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getCartItems } from "../lib/cart";
import { getImageUrl } from "../lib/courses";
import { removeFromCartAction } from "../lib/actions";

export const dynamic = 'force-dynamic';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

export default async function CarritoPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value;

    if (!token) {
        redirect('/login');
    }

    const client = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(token));
    let user;
    try {
        user = await client.request(readMe());
    } catch {
        redirect('/login');
    }

    const items = await getCartItems(user.id);
    const hayNoDisponible = items.some(item => item.curso?.disponible === false);
    const total = items.reduce((sum, item) => sum + (item.curso?.precio || 0), 0);
    const moneda = items[0]?.curso?.moneda === 'USD' ? 'US$' : '$';

    return (
        <>
            <Header />
            <main className="w-full bg-bg-site min-h-screen">
                <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <h1 className="text-4xl md:text-6xl display-font text-text-site mb-10">MI CARRITO</h1>

                    {items.length === 0 ? (
                        <div className="bg-surface-site rounded-3xl p-12 text-center border border-dashed border-border-site">
                            <span className="material-icons text-6xl text-text-site/20 mb-4">shopping_cart</span>
                            <p className="text-text-site/60 mb-6">Tu carrito está vacío.</p>
                            <Link href="/cursos" className="bg-primary text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:scale-105 transition-transform inline-block">
                                Explorar Cursos
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4 mb-10">
                                {items.map((item) => {
                                    async function handleRemove() {
                                        'use server';
                                        await removeFromCartAction(item.id);
                                    }

                                    return (
                                    <div key={item.id} className="flex items-center gap-4 bg-surface-site border border-border-site rounded-2xl p-4">
                                        <div className="relative w-24 h-20 shrink-0 rounded-xl overflow-hidden bg-gray-200">
                                            <img
                                                src={getImageUrl(item.curso.Imagen_Portada)}
                                                alt={item.curso.titulo}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <Link href={`/cursos/${item.curso.slug}`} className="font-bold text-text-site hover:text-primary transition-colors line-clamp-1">
                                                {item.curso.titulo}
                                            </Link>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-border-site text-text-site/60">
                                                    {item.curso.nivel}
                                                </span>
                                                {item.curso.disponible === false && (
                                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30">
                                                        No disponible
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="font-mono font-bold text-accent">
                                                {item.curso.moneda === 'USD' ? 'US$' : '$'}{new Intl.NumberFormat('es-AR').format(item.curso.precio)}
                                            </p>
                                        </div>
                                        <form action={handleRemove}>
                                            <button
                                                type="submit"
                                                className="text-text-site/40 hover:text-red-500 transition-colors p-2"
                                                aria-label="Quitar del carrito"
                                            >
                                                <span className="material-icons text-xl">close</span>
                                            </button>
                                        </form>
                                    </div>
                                    );
                                })}
                            </div>

                            {hayNoDisponible && (
                                <p className="text-sm text-red-600 dark:text-red-400 mb-6 text-center">
                                    Hay un curso que ya no está disponible en tu carrito. Quitalo para poder continuar con el pago.
                                </p>
                            )}

                            <div className="bg-surface-site border border-border-site rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div>
                                    <span className="text-sm font-bold uppercase tracking-widest text-text-site/60 mb-2 block">Total</span>
                                    <span className="bg-accent/10 text-accent font-mono font-bold text-3xl px-4 py-1 rounded-full">
                                        {moneda}{new Intl.NumberFormat('es-AR').format(total)}
                                    </span>
                                </div>
                                {hayNoDisponible ? (
                                    <button
                                        disabled
                                        className="bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-10 py-5 rounded-full font-bold uppercase tracking-widest text-lg w-full md:w-auto cursor-not-allowed"
                                    >
                                        Proceder al Pago
                                    </button>
                                ) : (
                                    <Link
                                        href="/carrito/checkout"
                                        className="bg-accent hover:bg-accent/90 text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest text-lg w-full md:w-auto shadow-lg transition-all inline-block text-center"
                                    >
                                        Proceder al Pago
                                    </Link>
                                )}
                            </div>
                        </>
                    )}
                </section>
            </main>
            <Footer />
        </>
    );
}
