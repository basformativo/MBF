
import { directus, adminClient } from './directus';
import { readItems } from '@directus/sdk';

export interface Instructor {
    id: string;
    nombre: string;
    apellido: string;
    bio: string;
    foto: string;
    especialidad: string;
    email?: string;
    experiencia_anios?: number;
    instagram?: string;
    whatsapp?: string;
    youtube?: string;
}

export async function getInstructors(): Promise<Instructor[]> {
    try {
        const result = await adminClient.request(readItems('instructores', {
            sort: ['nombre']
        }));
        return result as unknown as Instructor[];
    } catch (error) {
        console.error('Error fetching instructors:', error);
        return [];
    }
}


export interface Categoria {
    id: string;
    nombre: string;
    slug: string;
}

export interface Clase {
    id: string;
    titulo: string;
    slug: string;
    descripcion: string;
    contenido: string;
    Video?: string; // Nombre exacto en Directus. Solo presente cuando el usuario tiene acceso (ver getClaseVideoFields).
    video_url?: string; // Idem: solo presente cuando el usuario tiene acceso.
    duracion: number;
    orden: number;
    es_gratis: boolean;
}

export interface ClaseProgress {
    clase: string;
    completado: boolean;
}


export interface Course {
    id: string;
    titulo: string;
    slug: string;
    descripcion: string;
    descripcion_corta: string;
    nivel: string;
    precio: number;
    moneda: string;
    Imagen_Portada: string; // Nombre exacto corregido
    estado: string;
    destacado: boolean;
    disponible: boolean;
    categorias: { categoria: Categoria }[]; // M2M junction
    instructores: { instructor: Instructor }[]; // M2M junction
    clases: Clase[]; // Alias O2M
}

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;
const ASSETS_URL = `${DIRECTUS_URL.replace(/\/$/, '')}/assets/`;
const DEFAULT_PLACEHOLDER = '/placeholder.png';

export function getImageUrl(id: string | null) {
    if (!id) return DEFAULT_PLACEHOLDER;
    if (typeof id === 'string' && id.startsWith('http')) return id;
    const imageId = typeof id === 'object' ? (id as any)?.id : id;
    if (!imageId) return DEFAULT_PLACEHOLDER;
    return `${ASSETS_URL}${imageId}`;
}

export async function getCourses(): Promise<Course[]> {
    try {
        console.log('[Courses] Fetching all courses...');
        const result = await adminClient.request(readItems('cursos', {
            fields: [
                '*',
                { categorias: [{ categoria: ['nombre', 'slug'] }] },
                { instructores: [{ instructor: ['nombre', 'apellido', 'foto'] }] }
            ],
        }));
        return result as unknown as Course[];
    } catch (error: any) {
        console.error('Error fetching courses from Directus:', error.message || error);
        return [];
    }
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
    try {
        const result = await adminClient.request(readItems('cursos', {
            filter: { slug: { _eq: slug } },
            fields: [
                '*',
                { categorias: [{ categoria: ['*'] }] },
                { instructores: [{ instructor: ['*'] }] }
            ],
            limit: 1
        }));

        if (!result || result.length === 0) return null;

        const course = result[0] as unknown as Course;

        // Fetch Clases. IMPORTANTE: no se piden acá los campos "video_url" ni "Video" —
        // esta lista se usa para el listado/temario del curso, visible sin verificar
        // acceso todavía. Los campos de video se buscan aparte, por clase, únicamente
        // después de confirmar que el usuario tiene acceso (ver getClaseVideoFields),
        // para que la URL del video no viaje al cliente si no le corresponde.
        try {
            const { adminClient } = await import('./directus');
            const clasesResult = await adminClient.request(readItems('clases', {
                fields: ['id', 'curso', 'titulo', 'slug', 'descripcion', 'contenido', 'duracion', 'orden', 'es_gratis', 'fecha_publicacion'] as any,
                filter: { curso: { _eq: course.id } },
                sort: ['orden']
            }));
            course.clases = clasesResult as unknown as Clase[];
        } catch (claseError) {
            console.warn(`No se pudieron cargar las clases del curso ${slug}:`, claseError);
            course.clases = [];
        }

        return course;
    } catch (error: any) {
        console.error(`Error fetching course with slug ${slug}:`, error.message || error);
        return null;
    }
}

export async function getUserCourses(userId: string): Promise<Course[]> {
    try {
        const result = await adminClient.request(readItems('compras' as any, {
            filter: {
                usuario: { _eq: userId },
                _or: [
                    { estado: { _in: ['aprobado', 'Aprobado'] } },
                    { estado_pago: { _in: ['aprobado', 'Aprobado'] } }
                ]
            },
            fields: [
                'curso.*',
                { curso: [{ instructores: [{ instructor: ['nombre', 'apellido'] }] }] }
            ]
        }));
        return result.map((a: any) => a.curso as Course);
    } catch (error) {
        console.error('Error fetching user courses from purchases:', error);
        return [];
    }
}

export async function getApprovedCourseAccess(userId: string, courseId: string) {
    try {
        const result = await adminClient.request(readItems('compras' as any, {
            filter: {
                usuario: { _eq: userId },
                curso: { _eq: courseId },
                _or: [
                    { estado: { _in: ['aprobado', 'Aprobado'] } },
                    { estado_pago: { _in: ['aprobado', 'Aprobado'] } }
                ]
            },
            fields: ['id', 'curso.slug'],
            limit: 1
        }));

        return (result as any[])[0] || null;
    } catch (error) {
        console.error('Error checking approved course access:', error);
        return null;
    }
}

// Trae el video_url de una clase puntual. Llamar SOLO después de confirmar que
// el usuario tiene acceso a esa clase (canAccess) — así la URL de YouTube nunca
// se pide, ni viaja al cliente, para alguien sin acceso. La reproducción es
// únicamente por YouTube: el campo "Video" (archivo en R2) no se lee acá.
export async function getClaseVideoFields(claseId: string): Promise<{ video_url: string | null } | null> {
    try {
        const result = await adminClient.request(readItems('clases', {
            filter: { id: { _eq: claseId } },
            fields: ['video_url'] as any,
            limit: 1
        }));

        return (result as any[])[0] || null;
    } catch (error) {
        console.error('Error fetching clase video fields:', error);
        return null;
    }
}
export interface Comment {
    id: string;
    usuario: {
        id: string;
        first_name: string;
        last_name: string;
    };
    contenido: string;
    fecha: string;
    padre?: string;
    es_instructor: boolean;
    respuestas?: Comment[];
}

export async function getComments(classId: string): Promise<Comment[]> {
    try {
        if (!classId) {
            console.warn('[Comments] No classId provided');
            return [];
        }
        console.log(`[Comments] Fetching for classId: ${classId}`);
        const result = await adminClient.request(readItems('comentarios' as any, {
            filter: { clase: { _eq: classId } },
            sort: ['fecha'],
            fields: [
                '*',
                { usuario: ['id', 'first_name', 'last_name'] }
            ]
        }));

        const allComments = result as unknown as Comment[];

        // Organizar en hilos (padre/hijo)
        const rootComments = allComments.filter(c => !c.padre);
        rootComments.forEach(root => {
            root.respuestas = allComments.filter(c => c.padre === root.id);
        });

        return rootComments;
    } catch (error: any) {
        console.error('Error fetching comments:', error.message || error);
        if (error.response?.data) {
            console.error('Directus Error Details:', JSON.stringify(error.response.data, null, 2));
        }
        return [];
    }
}

export async function getCourseProgress(userId: string, courseId: string): Promise<ClaseProgress[]> {
    try {
        const result = await adminClient.request(readItems('progreso_clases', {
            filter: {
                usuario: { _eq: userId },
                curso: { _eq: courseId },
                completado: { _eq: true }
            },
            fields: ['clase', 'completado']
        }));
        return result as ClaseProgress[];
    } catch (error) {
        return [];
    }
}

