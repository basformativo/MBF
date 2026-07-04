'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { submitPurchaseAction } from '../../lib/actions';

const PAISES = [
    'Argentina', 'Bolivia', 'Brasil', 'Chile', 'Colombia', 'Costa Rica',
    'Cuba', 'Ecuador', 'El Salvador', 'España', 'Guatemala', 'Honduras',
    'México', 'Nicaragua', 'Panamá', 'Paraguay', 'Perú', 'Puerto Rico',
    'República Dominicana', 'Uruguay', 'Venezuela', 'Otro',
];

const COMO_ENTERASTE = [
    'Instagram', 'Facebook', 'Twitter / X', 'YouTube', 'Un amigo o conocido',
    'Google', 'Podcast', 'Otro',
];

const CVU_MERCADOPAGO = '0000003100092415067264';
const ALIAS_MERCADOPAGO = 'chapex.mp';
const NOMBRE_MERCADOPAGO = 'Nicolás Daniel Boeri';
const PAYPAL_EMAIL = 'mmarcos0202@gmail.com';

interface Props {
    course: { id: string; titulo: string; precio: number; moneda: string };
    user: { id: string; first_name: string; last_name: string; email: string };
}

export default function CheckoutForm({ course, user }: Props) {
    const router = useRouter();
    const fileRef = useRef<HTMLInputElement>(null);

    const [medioPago, setMedioPago] = useState<'mercadopago' | 'paypal' | ''>('');
    const [redes, setRedes] = useState<string[]>([]);
    const [comprobante, setComprobante] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState<'form' | 'pago' | 'ok'>('form');

    function toggleRed(red: string) {
        setRedes(prev =>
            prev.includes(red) ? prev.filter(r => r !== red) : [...prev, red]
        );
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!medioPago) { setError('Seleccioná un medio de pago'); return; }
        if (!comprobante) { setError('Debés subir el comprobante de pago'); return; }

        setIsLoading(true);
        setError(null);

        const fd = new FormData(e.currentTarget);
        fd.set('redes_sociales', JSON.stringify(redes));
        fd.set('medio_pago', medioPago);
        fd.set('comprobante', comprobante);
        fd.set('curso_id', course.id);

        const result = await submitPurchaseAction(fd);

        if (result?.error) {
            setError(result.error);
            setIsLoading(false);
        } else {
            setStep('ok');
        }
    }

    if (step === 'ok') {
        return (
            <div className="bg-white dark:bg-surface-dark rounded-3xl shadow-xl border border-border-light dark:border-border-dark p-10 text-center">
                <div className="text-5xl mb-4">✅</div>
                <h2 className="text-2xl font-bold mb-2 display-font">¡Solicitud enviada!</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Recibimos tu comprobante. Un administrador revisará tu pago y habilitará el acceso al curso en las próximas horas.
                </p>
                <button
                    onClick={() => router.push('/dashboard')}
                    className="bg-primary text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-primary/90 transition-all"
                >
                    Ir a mi panel
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* ── DATOS PERSONALES ────────────────────────────── */}
            <section className="bg-white dark:bg-surface-dark rounded-3xl shadow-xl border border-border-light dark:border-border-dark p-8">
                <h2 className="text-lg font-bold uppercase tracking-widest mb-6 border-b border-border-light dark:border-border-dark pb-4">
                    Completá tus datos
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field label="Nombre" name="nombre" defaultValue={user.first_name} required />
                    <Field label="Apellido" name="apellido" defaultValue={user.last_name} required />
                    <Field label="Email" name="email" type="email" defaultValue={user.email} required />
                    <Field label="DNI / ID" name="dni" />
                    <Field label="Fecha de nacimiento" name="fecha_nacimiento" type="date" />
                    <Field label="Teléfono / Whatsapp" name="telefono" type="tel" />
                    <Field label="Ciudad" name="ciudad" />

                    {/* País */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">País</label>
                        <select
                            name="pais"
                            className="bg-gray-50 dark:bg-black/20 border border-border-light dark:border-border-dark rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        >
                            <option value="">Seleccioná tu país</option>
                            {PAISES.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                </div>

                {/* Redes sociales */}
                <div className="mt-6">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500 block mb-3">
                        ¿Qué redes sociales utilizás?
                    </label>
                    <div className="flex flex-wrap gap-3">
                        {['Facebook', 'Twitter / X', 'LinkedIn', 'Instagram', 'YouTube', 'TikTok'].map(red => (
                            <button
                                key={red}
                                type="button"
                                onClick={() => toggleRed(red)}
                                className={`px-4 py-2 rounded-full border text-sm font-semibold transition-all ${
                                    redes.includes(red)
                                        ? 'bg-primary border-primary text-white'
                                        : 'border-border-light dark:border-border-dark text-gray-600 dark:text-gray-300 hover:border-primary'
                                }`}
                            >
                                {red}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Como te enteraste */}
                <div className="mt-6">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500 block mb-1">
                        ¿Cómo te enteraste del curso?
                    </label>
                    <select
                        name="como_enteraste"
                        className="w-full bg-gray-50 dark:bg-black/20 border border-border-light dark:border-border-dark rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    >
                        <option value="">Seleccioná una opción</option>
                        {COMO_ENTERASTE.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                </div>

                {/* Consultas */}
                <div className="mt-6">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500 block mb-1">
                        Consultas
                    </label>
                    <textarea
                        name="consultas"
                        rows={3}
                        placeholder="¿Tenés alguna pregunta antes de inscribirte?"
                        className="w-full bg-gray-50 dark:bg-black/20 border border-border-light dark:border-border-dark rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                    />
                </div>
            </section>

            {/* ── FORMAS DE PAGO ──────────────────────────────── */}
            <section className="bg-white dark:bg-surface-dark rounded-3xl shadow-xl border border-border-light dark:border-border-dark p-8">
                <h2 className="text-lg font-bold uppercase tracking-widest mb-6 border-b border-border-light dark:border-border-dark pb-4">
                    Formas de pago
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <PaymentOption
                        id="mercadopago"
                        label="Mercado Pago"
                        icon="💳"
                        selected={medioPago === 'mercadopago'}
                        onSelect={() => setMedioPago('mercadopago')}
                    />
                    <PaymentOption
                        id="paypal"
                        label="PayPal"
                        icon="🅿️"
                        selected={medioPago === 'paypal'}
                        onSelect={() => setMedioPago('paypal')}
                    />
                </div>

                {/* Datos bancarios / CVU */}
                {medioPago && (
                    <div className="bg-gray-50 dark:bg-black/20 rounded-2xl border border-border-light dark:border-border-dark p-6 space-y-4">
                        <h3 className="font-bold text-sm uppercase tracking-widest text-gray-500">
                            {medioPago === 'mercadopago' ? 'Datos para transferencia — Mercado Pago' : 'Datos de pago — PayPal'}
                        </h3>

                        {medioPago === 'mercadopago' ? (
                            <>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Alias</p>
                                    <div className="flex items-center gap-3 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl px-4 py-3">
                                        <span className="font-mono text-lg font-bold tracking-widest text-primary flex-1">{ALIAS_MERCADOPAGO}</span>
                                        <button type="button" onClick={() => navigator.clipboard.writeText(ALIAS_MERCADOPAGO)} className="text-xs text-gray-400 hover:text-primary transition-colors font-semibold">Copiar</button>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">CVU</p>
                                    <div className="flex items-center gap-3 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl px-4 py-3">
                                        <span className="font-mono text-lg font-bold tracking-widest text-primary flex-1">{CVU_MERCADOPAGO}</span>
                                        <button type="button" onClick={() => navigator.clipboard.writeText(CVU_MERCADOPAGO)} className="text-xs text-gray-400 hover:text-primary transition-colors font-semibold">Copiar</button>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Titular</p>
                                    <p className="font-bold text-lg text-black dark:text-white">{NOMBRE_MERCADOPAGO}</p>
                                </div>
                            </>
                        ) : (
                            <div>
                                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Email de PayPal</p>
                                <div className="flex items-center gap-3 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl px-4 py-3">
                                    <span className="font-mono text-lg font-bold tracking-widest text-primary flex-1">{PAYPAL_EMAIL}</span>
                                    <button type="button" onClick={() => navigator.clipboard.writeText(PAYPAL_EMAIL)} className="text-xs text-gray-400 hover:text-primary transition-colors font-semibold">Copiar</button>
                                </div>
                            </div>
                        )}

                        <div>
                            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Monto a pagar</p>
                            <p className="text-3xl font-black text-primary">
                                {course.moneda === 'USD' ? 'USD' : '$'} {course.precio}
                            </p>
                        </div>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Realizá la transferencia por el monto exacto y luego subí el comprobante abajo.
                        </p>
                    </div>
                )}

                {/* Upload comprobante */}
                {medioPago && (
                    <div className="mt-6">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 block mb-2">
                            Subir comprobante de pago *
                        </label>
                        <div
                            className="border-2 border-dashed border-border-light dark:border-border-dark rounded-2xl p-6 text-center cursor-pointer hover:border-primary transition-colors"
                            onClick={() => fileRef.current?.click()}
                        >
                            {comprobante ? (
                                <div className="space-y-1">
                                    <p className="font-semibold text-green-600 dark:text-green-400">✅ {comprobante.name}</p>
                                    <p className="text-xs text-gray-400">Hacé click para cambiar el archivo</p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    <p className="text-4xl">📎</p>
                                    <p className="font-semibold text-gray-700 dark:text-gray-300">Arrastrá o hacé click para subir</p>
                                    <p className="text-xs text-gray-400">PNG, JPG, PDF — máx. 10 MB</p>
                                </div>
                            )}
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*,application/pdf"
                                className="hidden"
                                onChange={e => setComprobante(e.target.files?.[0] ?? null)}
                            />
                        </div>
                    </div>
                )}
            </section>

            {/* ── ERROR + SUBMIT ───────────────────────────────── */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm text-center font-medium">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-accent text-white py-5 rounded-full font-bold uppercase tracking-widest text-lg hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Enviando solicitud...' : 'Enviar comprobante e inscribirme'}
            </button>
        </form>
    );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function Field({ label, name, type = 'text', defaultValue = '', required = false }: {
    label: string; name: string; type?: string; defaultValue?: string; required?: boolean;
}) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">{label}</label>
            <input
                name={name}
                type={type}
                defaultValue={defaultValue}
                required={required}
                className="bg-gray-50 dark:bg-black/20 border border-border-light dark:border-border-dark rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
        </div>
    );
}

function PaymentOption({ id, label, icon, selected, onSelect }: {
    id: string; label: string; icon: string; selected: boolean; onSelect: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onSelect}
            className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all font-semibold text-left ${
                selected
                    ? 'border-primary bg-primary/5 dark:bg-primary/10 text-primary'
                    : 'border-border-light dark:border-border-dark hover:border-primary/50'
            }`}
        >
            <span className="text-2xl">{icon}</span>
            <span>{label}</span>
            {selected && <span className="ml-auto text-primary">✓</span>}
        </button>
    );
}
