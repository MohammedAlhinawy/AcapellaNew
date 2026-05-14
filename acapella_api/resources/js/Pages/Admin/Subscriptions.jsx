import { Head } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import GlassCard from '../../Components/GlassCard';

const statusBadge = {
    active:    'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    expired:   'bg-red-900/30 text-red-400 border border-red-800/40',
    cancelled: 'bg-white/5 text-white/40 border border-white/10',
};

export default function AdminUsajili({ auth, subscriptions }) {
    return (
        <AdminLayout user={auth?.user}>
            <Head title="Usajili" />

            <div className="space-y-6">
                <div>
                    <p className="text-xs text-red-400 font-bold uppercase tracking-widest mb-1">Admin Panel</p>
                    <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">Usajili</h2>
                    <p className="text-white/40 text-sm mt-1">{subscriptions?.total ?? 0} rekodi zote za usajili</p>
                </div>

                <GlassCard className="!p-0 overflow-hidden">
                    <div className="hidden sm:flex items-center px-6 py-3 border-b border-white/5 text-xs text-white/30 uppercase tracking-widest">
                        <div className="flex-1">Mtumiaji</div>
                        <div className="w-28 text-center">Hali</div>
                        <div className="w-40 text-center">Kiasi</div>
                        <div className="w-44 text-center">Inaisha</div>
                        <div className="w-36 text-right">Kumb. ya Malipo</div>
                    </div>

                    {subscriptions?.data?.length > 0 ? (
                        <div className="divide-y divide-white/5">
                            {subscriptions.data.map(sub => (
                                <div key={sub.id} className="flex flex-col sm:flex-row sm:items-center px-4 sm:px-6 py-4 hover:bg-white/[0.02] transition gap-2 sm:gap-0">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-semibold text-sm truncate">{sub.user?.name ?? '—'}</p>
                                        <p className="text-white/40 text-xs truncate">{sub.user?.email ?? '—'}</p>
                                    </div>
                                    <div className="sm:w-28 sm:text-center">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusBadge[sub.status] ?? statusBadge.cancelled}`}>
                                            {sub.status}
                                        </span>
                                    </div>
                                    <div className="sm:w-40 text-white/60 text-sm sm:text-center">
                                        {sub.amount ? `${sub.currency ?? 'TZS'} ${Number(sub.amount).toLocaleString()}` : '—'}
                                    </div>
                                    <div className="sm:w-44 text-white/40 text-xs font-mono sm:text-center">
                                        {sub.expires_at
                                            ? new Date(sub.expires_at).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })
                                            : <span className="text-white/20">No expiry</span>}
                                    </div>
                                    <div className="sm:w-36 sm:text-right text-white/30 text-xs font-mono truncate">
                                        {sub.gateway_reference ?? '—'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 text-white/30">
                            <div className="text-5xl mb-4">💳</div>
                            <p>Bado hakuna usajili.</p>
                            <p className="text-sm mt-2">Malipo yaliyofanywa kupitia Mongike yataonekana hapa.</p>
                        </div>
                    )}
                </GlassCard>
            </div>
        </AdminLayout>
    );
}
