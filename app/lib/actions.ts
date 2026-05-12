
'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { createDirectus, rest, createUser, staticToken, createItem, updateItem, readItems, readMe } from '@directus/sdk';
import { redirect } from 'next/navigation';

import { adminClient, DIRECTUS_URL, ADMIN_TOKEN } from './directus';

const ALUMNO_ROLE_ID = 'c6d89d18-ac96-4281-8567-f88e36838980';

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

            // Verificar si es admin para redirección
            let isAdmin = false;
            try {
                const client = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(data.data.access_token));
                const user = await client.request(readMe({ fields: ['role'] }));
                
                // Usamos el ID conocido o verificamos el objeto del rol
                const ADMIN_ROLE_ID_KNOWN = '583770fb-b647-4f1d-ade0-d0fb4851d559';
                isAdmin = user.role === ADMIN_ROLE_ID_KNOWN;
            } catch (e) {
                console.error('Error verificando admin en login:', e);
            }

            revalidatePath('/');
            return { success: true, isAdmin };
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

export async function requestPasswordResetAction(formData: FormData) {
    const email = formData.get('email') as string;
    if (!email) return { error: 'El email es obligatorio' };

    try {
        const response = await fetch(`${DIRECTUS_URL}/auth/password/request`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, reset_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/recuperar-contrasena/reset` })
        });

        if (!response.ok) {
            const data = await response.json();
            return { error: data.errors?.[0]?.message || 'Error al enviar el email' };
        }

        return { success: true };
    } catch (e: any) {
        return { error: 'Error al procesar la solicitud' };
    }
}

export async function resetPasswordAction(formData: FormData) {
    const token = formData.get('token') as string;
    const password = formData.get('password') as string;

    if (!token || !password) return { error: 'Datos incompletos' };
    if (password.length < 8) return { error: 'La contraseña debe tener al menos 8 caracteres' };

    try {
        const response = await fetch(`${DIRECTUS_URL}/auth/password/reset`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, password })
        });

        if (!response.ok) {
            const data = await response.json();
            return { error: data.errors?.[0]?.message || 'Token inválido o expirado' };
        }

        return { success: true };
    } catch (e: any) {
        return { error: 'Error al restablecer la contraseña' };
    }
}

export async function buyCourseAction(courseId: string) {
    return { error: 'Las inscripciones de pago no están disponibles actualmente en modo de prueba.' };
}

// ─── PURCHASE FLOW ────────────────────────────────────────────────────────────

export async function submitPurchaseAction(formData: FormData) {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value;
    if (!token) return { error: 'Debes iniciar sesión para comprar' };

    const client = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(token));

    try {
        const user = await client.request(readMe());

        // Subir el comprobante de pago a Directus Files
        const comprobanteFile = formData.get('comprobante') as File | null;
        let comprobanteId: string | null = null;

        if (comprobanteFile && comprobanteFile.size > 0) {
            const fileForm = new FormData();
            fileForm.append('file', comprobanteFile, comprobanteFile.name);

            const uploadRes = await fetch(`${DIRECTUS_URL}/files`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
                body: fileForm,
            });
            const uploadData = await uploadRes.json();
            if (!uploadRes.ok) {
                console.error('Error subiendo comprobante:', uploadData);
                return { error: 'Error al subir el comprobante. Intentá de nuevo.' };
            }
            comprobanteId = uploadData.data?.id ?? null;
        }

        const redesRaw = formData.get('redes_sociales') as string;
        const redes = redesRaw ? JSON.parse(redesRaw) : [];

        await adminClient.request(createItem('compras' as any, {
            usuario: user.id,
            curso: formData.get('curso_id') as string,
            nombre: formData.get('nombre') as string,
            apellido: formData.get('apellido') as string,
            email: formData.get('email') as string,
            dni: formData.get('dni') as string,
            fecha_nacimiento: formData.get('fecha_nacimiento') as string || null,
            telefono: formData.get('telefono') as string,
            ciudad: formData.get('ciudad') as string,
            pais: formData.get('pais') as string,
            redes_sociales: redes,
            como_enteraste: formData.get('como_enteraste') as string,
            consultas: formData.get('consultas') as string,
            medio_pago: formData.get('medio_pago') as string,
            metodo_pago: formData.get('medio_pago') as string, // Para compatibilidad
            comprobante: comprobanteId,
            estado: 'pendiente',
            estado_pago: 'pendiente', // Para compatibilidad
        }));

        revalidatePath('/dashboard');
        revalidatePath('/admin/compras');
        return { success: true };
    } catch (e: any) {
        console.error('Error al guardar solicitud de compra:', e);
        return { error: 'Error al enviar la solicitud. Intentá de nuevo.' };
    }
}

export async function approvePurchaseAction(solicitudId: string) {
    try {
        // Marcar solicitud como aprobada. El acceso se comprueba desde compras.
        await adminClient.request(updateItem('compras' as any, solicitudId, { 
            estado: 'aprobado',
            estado_pago: 'aprobado' // Normalizado a minúsculas
        }));

        revalidatePath('/admin/compras');
        revalidatePath('/dashboard');
        return { success: true };
    } catch (e: any) {
        console.error('Error aprobando compra:', e);
        return { error: 'Error al aprobar la compra' };
    }
}

export async function rejectPurchaseAction(solicitudId: string, notas?: string) {
    try {
        await adminClient.request(updateItem('compras' as any, solicitudId, {
            estado: 'rechazado',
            notas_admin: notas || '',
        }));

        revalidatePath('/admin/compras');
        return { success: true };
    } catch (e: any) {
        console.error('Error rechazando compra:', e);
        return { error: 'Error al rechazar la compra' };
    }
}

export async function postCommentAction(courseId: string, classId: string, content: string, parentId?: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value;

    if (!token) return { error: 'Debes iniciar sesión para comentar' };
    if (!content.trim()) return { error: 'El comentario no puede estar vacío' };

    const client = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(token));

    try {
        const user = await client.request(readMe());

        // Verificamos si es un instructor (opcional, por ahora lo marcamos falso por defecto a menos que sea admin)
        const isInstructor = user.role === '00000000-0000-0000-0000-000000000000'; // Ajustar según ID del rol instructor si existiera

        await adminClient.request(createItem('comentarios' as any, {
            usuario: user.id,
            curso: courseId,
            clase: classId,
            contenido: content,
            padre: parentId || null,
            es_instructor: isInstructor
        }));

        revalidatePath(`/cursos/${courseId}/clase/${classId}`);
        return { success: true };
    } catch (e: any) {
        console.error('Error posteando comentario:', e);
        return { error: 'Error al enviar el comentario' };
    }
}
