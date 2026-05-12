import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { createDirectus, rest, staticToken, readMe } from '@directus/sdk';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import CheckoutForm from './CheckoutForm';
import { adminClient } from '../../lib/directus';
import { getApprovedCourseAccess } from '../../lib/courses';
import { readItems } from '@directus/sdk';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

export const dynamic = 'force-dynamic';

export default async function CheckoutPage({
    params,
}: {
    params: Promise<{ courseId: string }>;
}) {
    const { courseId } = await params;

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value;
    if (!token) redirect('/login');

    // Obtener datos del usuario
    const userClient = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(token));
    let user: any;
    try {
        user = await userClient.request(readMe());
    } catch {
        redirect('/login');
    }

    // Obtener datos del curso
    let courses: any[] = [];
    try {
        courses = await adminClient.request(readItems('cursos', {
            filter: { id: { _eq: courseId } },
            fields: ['id', 'titulo', 'precio', 'moneda', 'Imagen_Portada'],
            limit: 1,
        }));
    } catch {
        notFound();
    }

    if (!courses || courses.length === 0) notFound();
    const course = courses[0];

    // Verificar si ya tiene acceso por compra aprobada en Directus
    const access = await getApprovedCourseAccess(user.id, courseId);

    if (access) {
        redirect('/dashboard');
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-background-light dark:bg-background-dark py-12">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold mb-2 display-font">Inscripción al curso</h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">{course.titulo}</p>
                    <CheckoutForm
                        course={course}
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
