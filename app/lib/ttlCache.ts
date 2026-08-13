// Caché en memoria con expiración, pensada para procesos Node de vida larga
// (este proyecto corre "next start"/standalone en Docker, no serverless).
// No se comparte entre réplicas ni sobrevive un restart — eso es aceptable acá,
// porque su único trabajo es evitar volver a pegarle a Directus por cada pedido
// de rango de un mismo video dentro de una ventana corta.
export class TTLCache<K, V> {
    private store = new Map<K, { value: V; expiresAt: number }>();

    constructor(private defaultTtlMs: number) {}

    get(key: K): V | undefined {
        const entry = this.store.get(key);
        if (!entry) return undefined;
        if (Date.now() > entry.expiresAt) {
            this.store.delete(key);
            return undefined;
        }
        return entry.value;
    }

    set(key: K, value: V, ttlMs?: number): void {
        this.store.set(key, { value, expiresAt: Date.now() + (ttlMs ?? this.defaultTtlMs) });
    }
}
