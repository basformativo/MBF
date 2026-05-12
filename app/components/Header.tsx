import Link from "next/link";
import { cookies } from "next/headers";
import { logoutAction } from "../lib/actions";
import { createDirectus, rest, staticToken, readMe } from "@directus/sdk";
import MobileMenu from "./MobileMenu";
import ThemeToggle from "./ThemeToggle";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const ADMIN_ROLE_ID_KNOWN = '583770fb-b647-4f1d-ade0-d0fb4851d559';

export default async function Header() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value;
    const isLoggedIn = !!token;

    let isAdmin = false;
    if (token) {
        try {
            const client = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(token));
            const user = await client.request(readMe({ fields: ['role'] }));
            isAdmin = user.role === ADMIN_ROLE_ID_KNOWN;
        } catch (e) {
            // No es admin o error de token
        }
    }

    return (
        <header className="w-full border-b border-border-site bg-surface-site sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link href="/" className="text-xl md:text-2xl font-bold display-font italic text-primary">
                            BÁSQUET FORMATIVO
                        </Link>
                    </div>
                    <nav className="hidden lg:flex space-x-8">
                        <Link href="/cursos" className="text-sm font-semibold uppercase hover:text-primary transition-colors">
                            Cursos
                        </Link>
                        <Link href="/podcast" className="text-sm font-semibold uppercase hover:text-primary transition-colors">
                            Podcast
                        </Link>
                        <Link href="/mentorias" className="text-sm font-semibold uppercase hover:text-primary transition-colors">
                            Mentorías
                        </Link>
                        <Link href="/sobre-nosotros" className="text-sm font-semibold uppercase hover:text-primary transition-colors">
                            Sobre Nosotros
                        </Link>
                        <Link href="/contacto" className="text-sm font-semibold uppercase hover:text-primary transition-colors">
                            Contacto
                        </Link>
                        {isAdmin && (
                            <Link href="/admin/compras" className="text-sm font-black uppercase text-primary hover:text-primary/80 transition-colors border-l border-border-site pl-8">
                                Administración
                            </Link>
                        )}
                    </nav>
                    <div className="flex items-center">
                        <div className="hidden lg:flex items-center space-x-4">
                            {isLoggedIn ? (
                                <div className="flex items-center space-x-4">
                                    {isAdmin && (
                                        <Link href="/admin/compras" className="text-xs font-bold uppercase text-primary hover:text-primary/80 transition-all">
                                            Admin
                                        </Link>
                                    )}
                                    <Link href="/dashboard" className="text-xs font-bold uppercase bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-full hover:bg-primary dark:hover:bg-primary hover:text-white dark:hover:text-white transition-all">
                                        Mis Cursos
                                    </Link>
                                    <form action={logoutAction}>
                                        <button type="submit" className="text-xs font-bold uppercase text-red-500 hover:text-red-700 transition-all">
                                            Salir
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <Link href="/login" className="text-xs font-bold uppercase px-4 py-2 hover:text-primary transition-all">
                                        Entrar
                                    </Link>
                                    <Link href="/registro" className="text-xs font-bold uppercase bg-primary text-white px-4 py-2 rounded-full hover:shadow-lg hover:shadow-primary/30 transition-all">
                                        Registrarse
                                    </Link>
                                </div>
                            )}
                            <ThemeToggle />
                        </div>
                        <MobileMenu isLoggedIn={isLoggedIn} />
                    </div>
                </div>
            </div>
        </header>
    );
}
