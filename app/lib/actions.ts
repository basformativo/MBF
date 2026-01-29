
'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { createDirectus, rest, createUser, staticToken, createItem, updateItem, readItems, readMe } from '@directus/sdk';
import { redirect } from 'next/navigation';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://basquet-formativo-directus-d4c125-76-13-172-131.traefik.me';
const ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN || 'AXM_R-cgsyY4qfaDvzO-fU8BOkvmK5FD';
const ALUMNO_ROLE_ID = 'c6d89d18-ac96-4281-8567-f88e36838980';

const adminClient = createDirectus(DIRECTUS_URL)
    .with(rest())
    .with(staticToken(ADMIN_TOKEN));

const publicClient = createDirectus(DIRECTUS_URL)
    .with(rest());

export async function registerAction(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const first_name = formData.get('first_name') as string;
    const last_name = formData.get('last_name') as string;

    if (!email || !password || !first_name || !last_name) {
        return { error: 'Todos los campos son obligatorios' };
    }

    try {
        // Usamos adminClient en lugar de publicClient porque las acciones de servidor (use server)
        // son seguras y nos permiten saltarnos las restricciones de permisos del rol Público de Directus.
        await adminClient.request(createUser({
            email,
            password,
            first_name,
            last_name,
            role: ALUMNO_ROLE_ID,
            status: 'active'
        }));

        // Si se crea con éxito, lo logueamos o redirigimos al login
        return { success: true };
    } catch (e: any) {
        console.error('Error en registro:', e);
        return { error: e.message || 'Error al crear la cuenta' };
    }
}

export async function loginAction(formData?: FormData) {
    const cookieStore = await cookies();

    // Si viene de la simulación antigua (sin formData)
    if (!formData) {
        cookieStore.set('auth_session', 'true', { path: '/' });
        revalidatePath('/');
        return;
    }

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
        const response = await fetch(`${DIRECTUS_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.data && data.data.access_token) {
            cookieStore.set('auth_session', data.data.access_token, {
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: data.data.expires / 1000
            });
            revalidatePath('/');
            return { success: true };
        } else {
            return { error: 'Credenciales inválidas' };
        }
    } catch (e: any) {
        return { error: 'Error al iniciar sesión' };
    }
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('auth_session');
    revalidatePath('/');
    redirect('/');
}


export async function toggleProgressAction(courseId: string, classId: string, completed: boolean) {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value;

    if (!token) return { error: 'No autorizado' };

    const client = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(token));

    try {
        const user = await client.request(readMe());

        // Buscamos si ya existe un registro de progreso
        const existing = await adminClient.request(readItems('progreso_clases', {
            filter: {
                usuario: { _eq: user.id },
                clase: { _eq: classId }
            }
        }));

        if (existing.length > 0) {
            await adminClient.request(updateItem('progreso_clases', existing[0].id, {
                completado: completed
            }));
        } else {
            await adminClient.request(createItem('progreso_clases', {
                usuario: user.id,
                curso: courseId,
                clase: classId,
                completado: completed
            }));
        }

        revalidatePath(`/cursos/${courseId}`);
        return { success: true };
    } catch (e: any) {
        console.error('Error actualizando progreso:', e);
        return { error: 'Error al actualizar el progreso' };
    }
}

export async function buyCourseAction(courseId: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value;

    if (!token) return { error: 'Inicia sesión para comprar' };

    const client = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(token));

    try {
        const user = await client.request(readMe());

        // Creamos la compra y el acceso
        await adminClient.request(createItem('compras', {
            usuario: user.id,
            curso: courseId,
            estado_pago: 'aprobado',
            metodo_pago: 'simulado'
        }));

        await adminClient.request(createItem('accesos_cursos', {
            usuario: user.id,
            curso: courseId,
            activo: true
        }));

        // Mantener simulación por cookies para compatibilidad actual
        const current = cookieStore.get('purchased_courses')?.value || '';
        const updated = current ? `${current},${courseId}` : courseId;
        cookieStore.set('purchased_courses', updated, { path: '/' });

        revalidatePath('/');
        return { success: true };
    } catch (e: any) {
        return { error: 'Error al procesar la compra' };
    }
}

