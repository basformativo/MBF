
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createDirectus, rest, staticToken, readMe } from '@directus/sdk';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import CartCheckoutForm from './CartCheckoutForm';
import { getCartItems } from '../../lib/cart';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

export const dynamic = 'force-dynamic';

export default async function CarritoCheckoutPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value;
    if (!token) redirect('/login');

    const userClient = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(token));
    let user: any;
    try {
        user = await userClient.request(readMe());
    } catch {
        redirect('/login');
    }

    const items = await getCartItems(user.id);

    // Carrito vacío o con algún curso ya no disponible: no se permite iniciar el pago
    if (items.length === 0 || items.some(item => item.curso?.disponible === false)) {
        redirect('/carrito');
    }

    return (
        <>
            <Header />
            <main className="w-full bg-bg-site min-h-screen py-12">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold mb-2 display-font text-text-site">Inscripción a los cursos</h1>
                    <p className="text-text-site/60 mb-8">{items.length} curso{items.length > 1 ? 's' : ''} en tu carrito</p>
                    <CartCheckoutForm
                        items={items}
                        user={{
                            id: user.id,
                            first_name: user.first_name || '',
                            last_name: user.last_name || '',
                            email: user.email || '',
                        }}
                    />
                </div>
            </main>
            <Footer />
        </>
    );
}
