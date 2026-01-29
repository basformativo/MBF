
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoginForm from '../components/auth/LoginForm';

export default function LoginPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-background-light dark:bg-background-dark py-20 px-4">
                <div className="max-w-md mx-auto">

                    <LoginForm />

                </div>
            </main>
            <Footer />
        </>
    );
}
