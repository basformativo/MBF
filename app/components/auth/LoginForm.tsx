
'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { loginAction } from '../../lib/actions';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginFormInner() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams.get('registered')) {
            setMessage('¡Cuenta creada con éxito! Ya puedes iniciar sesión.');
        }
    }, [searchParams]);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const result = await loginAction(formData);

        if (result?.error) {
            setError(result.error);
            setIsLoading(false);
        } else {
            router.push('/cursos');
            router.refresh();
        }
    }

    return (
        <div className="bg-white dark:bg-surface-dark rounded-3xl shadow-2xl border border-border-light dark:border-border-dark overflow-hidden">
            <div className="p-8 md:p-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl display-font mb-2">Bienvenido</h1>
                    <p className="text-gray-500 dark:text-gray-400">Accede a tu panel de entrenamiento</p>
                </div>

                {message && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 p-4 rounded-xl mb-8 text-sm text-center font-medium">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl mb-8 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
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
                        <div className="flex justify-between">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Contraseña</label>
                            <Link href="#" className="text-xs text-primary font-bold hover:underline">¿La olvidaste?</Link>
                        </div>
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
                        {isLoading ? 'Iniciando sesión...' : 'Entrar'}
                    </button>
                </form>

                <div className="mt-10 text-center text-sm text-gray-500">
                    ¿No tienes una cuenta?{' '}
                    <Link href="/registro" className="text-primary font-bold hover:underline">
                        Regístrate gratis
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function LoginForm() {
    return (
        <Suspense fallback={<div className="p-12 text-center">Cargando formulario...</div>}>
            <LoginFormInner />
        </Suspense>
    );
}
