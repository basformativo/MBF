
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { registerAction } from '../../lib/actions';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const result = await registerAction(formData);

        if (result?.error) {
            setError(result.error);
            setIsLoading(false);
        } else {
            router.push('/login?registered=true');
        }
    }

    return (
        <div className="bg-white dark:bg-surface-dark rounded-3xl shadow-2xl border border-border-light dark:border-border-dark overflow-hidden">
            <div className="p-8 md:p-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl display-font mb-2">Únete a la Academia</h1>
                    <p className="text-gray-500 dark:text-gray-400">Comienza tu formación profesional hoy mismo</p>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl mb-8 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Nombre</label>
                            <input
                                name="first_name"
                                type="text"
                                required
                                placeholder="Juan"
                                className="w-full bg-gray-50 dark:bg-black/20 border border-border-light dark:border-border-dark rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Apellido</label>
                            <input
                                name="last_name"
                                type="text"
                                required
                                placeholder="Pérez"
                                className="w-full bg-gray-50 dark:bg-black/20 border border-border-light dark:border-border-dark rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            placeholder="tu@email.com"
                            className="w-full bg-gray-50 dark:bg-black/20 border border-border-light dark:border-border-dark rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Contraseña</label>
                        <input
                            name="password"
                            type="password"
                            required
                            placeholder="••••••••"
                            className="w-full bg-gray-50 dark:bg-black/20 border border-border-light dark:border-border-dark rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <button
                        disabled={isLoading}
                        type="submit"
                        className="w-full bg-primary text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:shadow-lg hover:shadow-primary/30 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                    </button>
                </form>

                <div className="mt-10 text-center text-sm text-gray-500">
                    ¿Ya tienes una cuenta?{' '}
                    <Link href="/login" className="text-primary font-bold hover:underline">
                        Inicia sesión aquí
                    </Link>
                </div>
            </div>
        </div>
    );
}
