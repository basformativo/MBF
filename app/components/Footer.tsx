import Link from "next/link";

export default function Footer() {
    return (
        <footer className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t-2 border-black dark:border-white pt-12">
                <div>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-8">
                        Nuestra Misión
                    </h2>
                    <div className="relative">
                        <h3 className="text-5xl md:text-6xl display-font uppercase leading-none text-gray-300 dark:text-gray-700">
                            Formando<br />El Futuro<br />Del
                        </h3>
                        <h3 className="text-5xl md:text-6xl display-font uppercase leading-none mt-2 text-black dark:text-white">
                            Básquetbol<br />Latino
                        </h3>
                        <span className="material-icons absolute top-0 right-0 md:right-auto md:left-[350px] text-4xl text-primary animate-bounce">
                            sports_basketball
                        </span>
                    </div>
                </div>
                <div className="flex flex-col justify-between">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                        <div>
                            <h4 className="font-bold uppercase text-sm mb-4">Navegar</h4>
                            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <li><Link className="hover:text-primary" href="/cursos">Cursos</Link></li>
                                <li><Link className="hover:text-primary" href="/podcast">Podcast</Link></li>
                                <li><Link className="hover:text-primary" href="/mentorias">Mentorías</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold uppercase text-sm mb-4">Compañía</h4>
                            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <li><Link className="hover:text-primary" href="/sobre-nosotros">Sobre Nosotros</Link></li>
                                <li><Link className="hover:text-primary" href="/contacto">Contacto</Link></li>
                                <li><Link className="hover:text-primary" href="/login">Ingresar</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold uppercase text-sm mb-4">Conectar</h4>
                            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <li>
                                    <a
                                        className="hover:text-primary inline-flex items-center"
                                        href="https://x.com/MBFormadores"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Twitter / X"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                                        </svg>
                                        <span className="sr-only">Twitter / X</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="hover:text-primary inline-flex items-center"
                                        href="https://facebook.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Facebook"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                        </svg>
                                        <span className="sr-only">Facebook</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="hover:text-primary inline-flex items-center"
                                        href="https://www.instagram.com/basketformativo2026?igsh=aHJ1NXBhOHkzODk2&utm_source=qr"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Instagram"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                        </svg>
                                        <span className="sr-only">Instagram</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="hover:text-primary inline-flex items-center"
                                        href="https://wa.me/5491166557437"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="WhatsApp"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm0 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 012.41 5.82c0 4.54-3.7 8.23-8.24 8.23-1.48 0-2.93-.39-4.19-1.15l-.3-.17-3.12.82.83-3.04-.2-.32a8.188 8.188 0 01-1.26-4.37c.01-4.54 3.7-8.24 8.25-8.24zm-4.52 4.71c-.15 0-.4.06-.61.29-.21.23-.8.78-.8 1.91s.82 2.22.93 2.37c.11.15 1.61 2.46 3.9 3.45.55.24.97.38 1.31.48.55.17 1.05.15 1.44.09.44-.07 1.36-.56 1.55-1.09.19-.54.19-1 .13-1.09-.06-.09-.21-.15-.44-.26-.23-.11-1.36-.67-1.57-.75-.21-.08-.36-.11-.51.11-.15.23-.59.75-.72.9-.13.15-.27.17-.5.06-.23-.11-.96-.35-1.83-1.13-.68-.6-1.14-1.35-1.27-1.58-.13-.23-.01-.35.1-.47.1-.1.23-.27.34-.4.11-.14.15-.23.23-.39.08-.15.04-.29-.02-.4-.06-.11-.51-1.26-.72-1.72-.19-.45-.38-.39-.51-.39z"></path>
                                        </svg>
                                        <span className="sr-only">WhatsApp</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 flex flex-col md:flex-row justify-between items-end md:items-center">
                        <div className="text-xs text-gray-500">
                            © 2026 Basquet Formativo. Desarrollado por Horizont.
                        </div>
                        <div className="flex space-x-4 mt-4 md:mt-0">
                            <Link className="text-xs text-gray-500 hover:text-black dark:hover:text-white" href="#">
                                Privacidad
                            </Link>
                            <Link className="text-xs text-gray-500 hover:text-black dark:hover:text-white" href="#">
                                Términos
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
