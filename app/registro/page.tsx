
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';
import RegisterForm from '../components/auth/RegisterForm';

export default function RegisterPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-background-light dark:bg-background-dark py-20 px-4">
                <div className="max-w-md mx-auto">

                    <RegisterForm />

                    <p className="mt-8 text-center text-xs text-gray-400">
                        Al registrarte, aceptas nuestros <Link href="#" className="underline">Términos de Servicio</Link> y <Link href="#" className="underline">Política de Privacidad</Link>.
                    </p>
                </div>
            </main>
            <Footer />
        </>
    );
}
