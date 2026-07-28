import { cookies } from 'next/headers';
import Link from 'next/link';
import { createDirectus, rest, staticToken, readMe } from '@directus/sdk';
import { getApprovedCourseAccess } from '../lib/courses';

interface Props {
    courseId: string;
    disponible: boolean;
}

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

function NoDisponibleButton() {
    return (
        <button
            disabled
            className="bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-10 py-5 rounded-full font-bold uppercase tracking-widest text-lg w-full md:w-auto cursor-not-allowed text-center"
        >
            No disponible
        </button>
    );
}

export default async function EnrollButton({ courseId, disponible }: Props) {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value;

    if (!token) {
        if (!disponible) return <NoDisponibleButton />;

        return (
            <Link
                href="/login"
                className="bg-accent hover:bg-accent/90 text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest text-lg w-full md:w-auto shadow-lg hover:shadow-accent/30 transition-all inline-block text-center"
            >
                Registrarse para inscribirse
            </Link>
        );
    }

    const userClient = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(token));

    let hasAccess = false;
    let courseSlug = '';

    try {
        const user = await userClient.request(readMe());
        const access = await getApprovedCourseAccess(user.id, courseId);

        if (access) {
            hasAccess = true;
            courseSlug = access.curso?.slug || '';
        }
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Error desconocido';
        console.error('Error verificando acceso (EnrollButton):', message);
    }

    if (hasAccess) {
        return (
            <Link
                href={`/cursos/${courseSlug}`}
                className="bg-green-600 hover:bg-green-700 text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest text-lg w-full md:w-auto shadow-lg transition-all inline-block text-center"
            >
                Ya tienes acceso - Ver curso
            </Link>
        );
    }

    if (!disponible) return <NoDisponibleButton />;

    return (
        <Link
            href={`/checkout/${courseId}`}
            className="bg-accent hover:bg-accent/90 text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest text-lg w-full md:w-auto shadow-lg transition-all inline-block text-center"
        >
            Comprar Curso
        </Link>
    );
}
