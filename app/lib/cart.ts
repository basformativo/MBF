
import { adminClient } from './directus';
import { readItems } from '@directus/sdk';

export interface CartItem {
    id: string;
    fecha_agregado: string;
    curso: {
        id: string;
        titulo: string;
        slug: string;
        precio: number;
        moneda: string;
        Imagen_Portada: string;
        nivel: string;
        disponible: boolean;
    };
}

export async function getCartItems(userId: string): Promise<CartItem[]> {
    try {
        const result = await adminClient.request(readItems('carrito_items' as any, {
            filter: { usuario: { _eq: userId } },
            sort: ['-fecha_agregado'],
            fields: [
                'id',
                'fecha_agregado',
                { curso: ['id', 'titulo', 'slug', 'precio', 'moneda', 'Imagen_Portada', 'nivel', 'disponible'] }
            ]
        }));
        return result as unknown as CartItem[];
    } catch (error) {
        console.error('Error fetching cart items:', error);
        return [];
    }
}

export async function getCartCount(userId: string): Promise<number> {
    return (await getCartItems(userId)).length;
}

export async function getCartCourseIds(userId: string): Promise<Set<string>> {
    const items = await getCartItems(userId);
    return new Set(items.map(item => item.curso.id));
}

export async function isCourseInCart(userId: string, courseId: string): Promise<boolean> {
    try {
        const result = await adminClient.request(readItems('carrito_items' as any, {
            filter: {
                usuario: { _eq: userId },
                curso: { _eq: courseId }
            },
            fields: ['id'],
            limit: 1
        }));
        return result.length > 0;
    } catch (error) {
        console.error('Error checking cart membership:', error);
        return false;
    }
}
