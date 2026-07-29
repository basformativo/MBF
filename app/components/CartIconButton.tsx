'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { addToCartAction } from '../lib/actions';

export type CartIconState = 'guest' | 'owned' | 'in_cart' | 'unavailable' | 'add';

interface Props {
    courseId: string;
    state: CartIconState;
}

const baseClasses = 'w-9 h-9 shrink-0 rounded-full flex items-center justify-center transition-all';

export default function CartIconButton({ courseId, state }: Props) {
    const [localState, setLocalState] = useState<CartIconState>(state);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    if (localState === 'unavailable') return null;

    if (localState === 'guest') {
        return (
            <Link
                href="/login"
                onClick={(e) => e.stopPropagation()}
                aria-label="Iniciar sesión para comprar"
                title="Iniciar sesión para comprar"
                className={`${baseClasses} bg-black/5 dark:bg-white/10 text-text-site/60 hover:bg-accent hover:text-white`}
            >
                <span className="material-icons text-lg">shopping_cart</span>
            </Link>
        );
    }

    if (localState === 'owned') {
        return (
            <span
                aria-label="Ya tenés acceso"
                title="Ya tenés acceso"
                className={`${baseClasses} bg-green-500/15 text-green-600 dark:text-green-400`}
            >
                <span className="material-icons text-lg">check_circle</span>
            </span>
        );
    }

    if (localState === 'in_cart') {
        return (
            <Link
                href="/carrito"
                onClick={(e) => e.stopPropagation()}
                aria-label="Ver carrito"
                title="Ver carrito"
                className={`${baseClasses} bg-green-500/15 text-green-600 dark:text-green-400 hover:bg-green-600 hover:text-white`}
            >
                <span className="material-icons text-lg">shopping_cart</span>
            </Link>
        );
    }

    return (
        <button
            type="button"
            disabled={isPending}
            aria-label="Agregar al carrito"
            title="Agregar al carrito"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                startTransition(async () => {
                    const result = await addToCartAction(courseId);
                    if (!result?.error) {
                        setLocalState('in_cart');
                        router.refresh();
                    }
                });
            }}
            className={`${baseClasses} bg-accent/10 text-accent hover:bg-accent hover:text-white disabled:opacity-50`}
        >
            <span className="material-icons text-lg">
                {isPending ? 'hourglass_empty' : 'add_shopping_cart'}
            </span>
        </button>
    );
}
