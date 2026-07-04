"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { logoutAction } from "../lib/actions";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

export default function MobileMenu({ isLoggedIn }: { isLoggedIn: boolean }) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Close menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <div className="lg:hidden flex items-center">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-primary focus:outline-none"
                aria-label="Menu"
            >
                {isOpen ? (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
            </button>

            {isOpen && (
                <div className="fixed top-16 left-0 right-0 h-[calc(100vh-4rem)] bg-surface-site border-t border-border-site z-[100] overflow-y-auto">
                    <div className="flex flex-col p-6 space-y-4">
                        <Link href="/cursos" className="text-xl font-semibold uppercase hover:text-primary transition-colors border-b border-border-site pb-4">
                            Cursos
                        </Link>
                        <Link href="/podcast" className="text-xl font-semibold uppercase hover:text-primary transition-colors border-b border-border-site pb-4">
                            Podcast
                        </Link>
                        <Link href="/mentorias" className="text-xl font-semibold uppercase hover:text-primary transition-colors border-b border-border-site pb-4">
                            Mentorías
                        </Link>
                        <Link href="/sobre-nosotros" className="text-xl font-semibold uppercase hover:text-primary transition-colors border-b border-border-site pb-4">
                            Sobre Nosotros
                        </Link>
                        <Link href="/contacto" className="text-xl font-semibold uppercase hover:text-primary transition-colors border-b border-border-site pb-4">
                            Contacto
                        </Link>

                        {/* Auth links for Mobile */}
                        <div className="pt-6">
                            {isLoggedIn ? (
                                <div className="flex flex-col space-y-4">
                                    <Link href="/dashboard" className="text-lg font-bold uppercase text-center bg-black dark:bg-white text-white dark:text-black px-4 py-4 rounded-full hover:bg-primary dark:hover:bg-primary transition-all">
                                        Mis Cursos
                                    </Link>
                                    <form action={logoutAction} className="w-full">
                                        <button type="submit" className="w-full text-lg font-bold uppercase text-center text-red-500 hover:text-red-700 transition-all border border-red-500 rounded-full py-4">
                                            Salir
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <div className="flex flex-col space-y-4">
                                    <Link href="/login" className="text-lg font-bold uppercase text-center border border-primary text-primary px-4 py-4 rounded-full hover:bg-primary hover:text-white transition-all">
                                        Entrar
                                    </Link>
                                    <Link href="/registro" className="text-lg font-bold uppercase text-center bg-primary text-white px-4 py-4 rounded-full shadow-md transition-all">
                                        Registrarse
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Dark mode toggle */}
                        <div className="pt-6 border-t border-border-site flex items-center justify-between">
                            <span className="text-sm font-semibold uppercase text-gray-500">Apariencia</span>
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
}
