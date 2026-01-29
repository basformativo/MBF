import Link from "next/link";
import { cookies } from "next/headers";
import { logoutAction } from "../lib/actions";

export default async function Header() {
    const cookieStore = await cookies();
    const isLoggedIn = cookieStore.has('auth_session');

    return (
        <header className="w-full border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link href="/" className="text-xl md:text-2xl font-bold display-font italic text-primary">
                            BÁSQUET FORMATIVO
                        </Link>
                    </div>
                    <nav className="hidden md:flex space-x-8">
                        <Link href="/cursos" className="text-sm font-semibold uppercase hover:text-primary transition-colors">
                            Cursos
                        </Link>
                        <Link href="/noticias" className="text-sm font-semibold uppercase hover:text-primary transition-colors">
                            Noticias
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
                    </nav>
                    <div className="flex items-center space-x-4">

                        {isLoggedIn ? (
                            <div className="flex items-center space-x-4">
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
                    </div>
                </div>
            </div>
        </header>
    );
}
