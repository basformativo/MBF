import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createDirectus, rest, staticToken, readMe, readItems } from '@directus/sdk';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PurchaseActions from './PurchaseActions';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN || '';
const ADMIN_ROLE_ID = process.env.ADMIN_ROLE_ID || '';

export const dynamic = 'force-dynamic';

export default async function AdminComprasPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value;
    if (!token) redirect('/login');

    // Verificar que sea admin
    const userClient = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(token));
    let user: any;
    try {
        user = await userClient.request(readMe({ fields: ['id', 'role', 'first_name'] }));
    } catch {
        redirect('/login');
    }

    const adminClient = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(ADMIN_TOKEN));

    // Verificar rol admin (ID del rol administrador en Directus)
    const ADMIN_ROLE_ID_KNOWN = '583770fb-b647-4f1d-ade0-d0fb4851d559';
    let isAdmin = user.role === ADMIN_ROLE_ID_KNOWN;

    // Si no coincide con el ID conocido, intentamos verificar dinámicamente
    if (!isAdmin) {
        try {
            const roles = await adminClient.request(
                (await import('@directus/sdk')).readItems('directus_roles' as any, {
                    filter: { id: { _eq: user.role } },
                    fields: ['admin_access'],
                    limit: 1,
                })
            );
            isAdmin = (roles as any[])[0]?.admin_access === true;
        } catch {
            // Si falla la consulta dinámica (ej. permisos), nos quedamos con el resultado de ADMIN_ROLE_ID_KNOWN
        }
    }

    if (!isAdmin) {
        redirect('/dashboard');
    }

    // Obtener todas las solicitudes
    const solicitudes = await adminClient.request(
        readItems('compras' as any, {
            sort: ['-fecha_compra'],
            fields: [
                'id', 'estado', 'estado_pago', 'fecha_compra',
                'precio_pagado', 'moneda',
                'nombre', 'apellido', 'email', 'dni',
                'telefono', 'ciudad', 'pais',
                'redes_sociales', 'como_enteraste', 'consultas',
                'medio_pago', 'metodo_pago', 'comprobante', 'notas_admin',
                { usuario: ['id', 'first_name', 'last_name', 'email'] },
                { curso: ['id', 'titulo', 'precio', 'moneda'] },
            ],
        })
    ).catch((e) => {
        console.error('Error fetching solicitudes:', e);
        return [];
    });

    const pendientes = (solicitudes as any[]).filter(s => s.estado === 'pendiente' || !s.estado);
    const procesadas = (solicitudes as any[]).filter(s => s.estado === 'aprobado' || s.estado === 'rechazado');
    const aprobadas = (solicitudes as any[]).filter(s => s.estado === 'aprobado');

    const totalVentas = aprobadas.reduce((acc, s) => acc + (Number(s.curso?.precio) || 0), 0);

    return (
        <>
            <Header />
            <main className="min-h-screen bg-background-light dark:bg-background-dark py-12">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-black display-font mb-1">Panel de Control</h1>
                            <p className="text-gray-500 dark:text-gray-400">
                                Gestión de alumnos y solicitudes de inscripción
                            </p>
                        </div>
                    </div>

                    {/* Dashboard Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                        <StatCard 
                            label="Pendientes" 
                            value={pendientes.length.toString()} 
                            icon="pending_actions" 
                            color="text-yellow-600 bg-yellow-100" 
                        />
                        <StatCard 
                            label="Aprobadas" 
                            value={aprobadas.length.toString()} 
                            icon="check_circle" 
                            color="text-green-600 bg-green-100" 
                        />
                        <StatCard 
                            label="Total Ventas" 
                            value={`$${totalVentas}`} 
                            icon="payments" 
                            color="text-primary bg-primary/10" 
                        />
                        <StatCard 
                            label="Alumnos Registrados" 
                            value={solicitudes.length.toString()} 
                            icon="people" 
                            color="text-blue-600 bg-blue-100" 
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
                        <div className="lg:col-span-3">
                            {/* Pendientes */}
                            {pendientes.length > 0 && (
                                <section className="mb-12">
                                    <h2 className="text-xl font-bold uppercase tracking-widest mb-4 text-yellow-600 dark:text-yellow-400">
                                        Pendientes de revisión
                                    </h2>
                                    <div className="space-y-4">
                                        {pendientes.map((s: any) => (
                                            <PurchaseCard key={s.id} solicitud={s} directusUrl={DIRECTUS_URL} />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Procesadas */}
                            {procesadas.length > 0 && (
                                <section>
                                    <h2 className="text-xl font-bold uppercase tracking-widest mb-4 text-gray-400">
                                        Procesadas recientemente
                                    </h2>
                                    <div className="space-y-4">
                                        {procesadas.slice(0, 5).map((s: any) => (
                                            <PurchaseCard key={s.id} solicitud={s} directusUrl={DIRECTUS_URL} />
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white dark:bg-surface-dark p-6 rounded-3xl border border-border-light dark:border-border-dark shadow-sm">
                                <h3 className="font-bold display-font uppercase tracking-wider text-sm mb-4">Accesos Rápidos</h3>
                                <div className="space-y-3">
                                    <a 
                                        href={DIRECTUS_URL} 
                                        target="_blank" 
                                        className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-black/20 hover:bg-primary/5 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="material-icons text-primary text-sm">settings</span>
                                            <span className="text-sm font-semibold">CMS Directus</span>
                                        </div>
                                        <span className="material-icons text-xs text-gray-400 group-hover:translate-x-1 transition-transform">open_in_new</span>
                                    </a>
                                    <Link 
                                        href="/cursos" 
                                        className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-black/20 hover:bg-primary/5 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="material-icons text-primary text-sm">visibility</span>
                                            <span className="text-sm font-semibold">Ver Web Pública</span>
                                        </div>
                                        <span className="material-icons text-xs text-gray-400 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                    </Link>
                                </div>
                            </div>

                            <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10">
                                <h3 className="font-bold display-font uppercase tracking-wider text-xs text-primary mb-2">Ayuda Administrador</h3>
                                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                    Al aprobar una compra, el alumno recibirá acceso inmediato al curso en su panel "Mis Cursos". Si rechazas una solicitud, puedes dejar una nota explicando el motivo.
                                </p>
                            </div>
                        </div>
                    </div>

                    {(solicitudes as any[]).length === 0 && (
                        <div className="text-center py-20 text-gray-400">
                            <p className="text-5xl mb-4">📭</p>
                            <p className="text-xl font-semibold">No hay solicitudes de compra todavía</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}

function PurchaseCard({ solicitud: s, directusUrl }: { solicitud: any; directusUrl: string }) {
    const estadoColor: Record<string, string> = {
        pendiente: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        aprobado: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        rechazado: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };

    const fecha = s.date_created
        ? new Date(s.date_created).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        : '—';

    const redes = Array.isArray(s.redes_sociales) ? s.redes_sociales.join(', ') : (s.redes_sociales || '—');

    return (
        <div className="bg-white dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-light dark:border-border-dark">
                <div>
                    <p className="font-bold text-lg">{s.nombre} {s.apellido}</p>
                    <p className="text-sm text-gray-500">{s.email} · {fecha}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${estadoColor[s.estado] || ''}`}>
                    {s.estado}
                </span>
            </div>

            {/* Body */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <InfoRow label="Curso" value={s.curso?.titulo} />
                <InfoRow label="Precio" value={`${s.curso?.moneda === 'USD' ? 'USD' : '$'} ${s.curso?.precio}`} />
                <InfoRow label="Medio de pago" value={s.medio_pago} />
                <InfoRow label="DNI / ID" value={s.dni} />
                <InfoRow label="Teléfono" value={s.telefono} />
                <InfoRow label="Ciudad / País" value={`${s.ciudad || '—'}, ${s.pais || '—'}`} />
                <InfoRow label="Estado Pago" value={s.estado_pago} highlight={s.estado_pago === 'aprobado'} />
                <InfoRow label="Redes" value={redes} />
                <InfoRow label="Como se enteró" value={s.como_enteraste} />
                {s.consultas && <InfoRow label="Consultas" value={s.consultas} />}
                {s.notas_admin && <InfoRow label="Notas admin" value={s.notas_admin} highlight />}
            </div>

            {/* Comprobante */}
            {s.comprobante && (
                <div className="px-6 pb-4">
                    <a
                        href={`${directusUrl}/assets/${s.comprobante}?download`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                    >
                        📎 Ver comprobante de pago
                    </a>
                </div>
            )}

            {/* Acciones */}
            {s.estado === 'pendiente' && (
                <div className="px-6 pb-6">
                    <PurchaseActions solicitudId={s.id} />
                </div>
            )}
        </div>
    );
}

function InfoRow({ label, value, highlight = false }: { label: string; value?: string; highlight?: boolean }) {
    return (
        <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-0.5">{label}</p>
            <p className={`font-medium ${highlight ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-800 dark:text-gray-200'}`}>
                {value || '—'}
            </p>
        </div>
    );
}

function StatCard({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
    return (
        <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-border-light dark:border-border-dark shadow-sm">
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${color}`}>
                    <span className="material-icons">{icon}</span>
                </div>
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</p>
                    <p className="text-2xl font-black">{value}</p>
                </div>
            </div>
        </div>
    );
}
