import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import GlassCard from '../../Components/GlassCard';

function VerifyButton({ choir }) {
    const { patch, processing } = useForm();

    const toggle = () => {
        const url = choir.is_verified
            ? `/admin/choirs/${choir.id}/unverify`
            : `/admin/choirs/${choir.id}/verify`;
        patch(url);
    };

    return choir.is_verified ? (
        <button
            onClick={toggle}
            disabled={processing}
            className="text-xs bg-red-900/30 border border-red-800/50 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-900/50 disabled:opacity-50 transition"
        >
            {processing ? '…' : 'Batilisha Uthibitisho'}
        </button>
    ) : (
        <button
            onClick={toggle}
            disabled={processing}
            className="text-xs bg-emerald-600/20 border border-emerald-700/50 text-emerald-400 px-3 py-1.5 rounded-lg hover:bg-emerald-600/40 disabled:opacity-50 transition"
        >
            {processing ? '…' : '✓ Thibitisha'}
        </button>
    );
}

export default function AdminKwaya({ auth, choirs }) {
    return (
        <AdminLayout user={auth?.user}>
            <Head title="Manage Kwaya" />

            <div className="space-y-6">
                <div>
                    <p className="text-xs text-red-400 font-bold uppercase tracking-widest mb-1">Admin Panel</p>
                    <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">Kwaya</h2>
                    <p className="text-white/40 text-sm mt-1">{choirs?.total ?? 0} kwaya kwenye jukwaa</p>
                </div>

                <GlassCard className="!p-0 overflow-hidden">
                    <div className="hidden sm:flex items-center px-6 py-3 border-b border-white/5 text-xs text-white/30 uppercase tracking-widest">
                        <div className="flex-1">Kwaya</div>
                        <div className="w-40 text-center">Msimamizi</div>
                        <div className="w-28 text-center">Hali</div>
                        <div className="w-40 text-right">Vitendo</div>
                    </div>

                    {choirs?.data?.length > 0 ? (
                        <div className="divide-y divide-white/5">
                            {choirs.data.map(choir => (
                                <div key={choir.id} className="flex flex-col sm:flex-row sm:items-center px-4 sm:px-6 py-4 hover:bg-white/[0.02] transition gap-3 sm:gap-0">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-semibold text-sm">{choir.name}</p>
                                        {choir.location && (
                                            <p className="text-white/40 text-xs mt-0.5 flex items-center gap-1">
                                                <span>📍</span>{choir.location}
                                            </p>
                                        )}
                                    </div>
                                    <div className="sm:w-40 text-white/50 text-xs sm:text-center truncate">
                                        {choir.user?.name ?? <span className="text-white/20">—</span>}
                                    </div>
                                    <div className="sm:w-28 sm:text-center">
                                        {choir.is_verified ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                                            ✅ Imethibitishwa
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
                                                ⏳ Inasubiri
                                            </span>
                                        )}
                                    </div>
                                    <div className="sm:w-40 flex sm:justify-end">
                                        <VerifyButton choir={choir} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 text-white/30">
                            <div className="text-5xl mb-4">🏛️</div>
                            <p>Bado hakuna kwaya zilizosajiliwa.</p>
                        </div>
                    )}
                </GlassCard>
            </div>
        </AdminLayout>
    );
}
