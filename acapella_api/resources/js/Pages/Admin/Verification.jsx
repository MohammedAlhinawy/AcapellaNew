import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import GlassCard from '../../Components/GlassCard';

function VerifyButton({ choir }) {
    const { patch, processing } = useForm();
    return (
        <button
            onClick={() => patch(`/admin/choirs/${choir.id}/verify`)}
            disabled={processing}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600/20 border border-emerald-700/50 text-emerald-400 rounded-lg hover:bg-emerald-600/40 disabled:opacity-50 transition text-sm font-semibold"
        >
            {processing ? '…' : '✓ Kubali & Thibitisha'}
        </button>
    );
}

export default function AdminUthibitisho({ auth, pending }) {
    return (
        <AdminLayout user={auth?.user}>
            <Head title="Uthibitisho Queue" />

            <div className="space-y-6">
                <div>
                    <p className="text-xs text-red-400 font-bold uppercase tracking-widest mb-1">Admin Panel</p>
                    <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">Uthibitisho Queue</h2>
                    <p className="text-white/40 text-sm mt-1">{pending?.total ?? 0} kwaya zinasubiri ukaguzi</p>
                </div>

                {(pending?.data?.length ?? 0) === 0 ? (
                    <GlassCard className="text-center !py-20 text-white/30">
                        <div className="text-5xl mb-4">✅</div>
                        <p className="text-lg font-medium text-white/50">Umekwisha!</p>
                        <p className="text-sm mt-2">Hakuna kwaya zinazosubiri uthibitisho.</p>
                    </GlassCard>
                ) : (
                    <div className="space-y-4">
                        {pending.data.map(choir => (
                            <GlassCard key={choir.id} className="!p-5 hover:border-white/15 transition-all">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    {/* Choir avatar */}
                                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex-shrink-0">
                                        {choir.image_path
                                            ? <img src={`/storage/${choir.image_path}`} alt={choir.name} className="w-full h-full object-cover" />
                                            : <div className="w-full h-full flex items-center justify-center text-2xl text-white/20">🎶</div>
                                        }
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white font-bold text-base">{choir.name}</h3>
                                        <div className="flex flex-wrap gap-3 mt-1 text-white/40 text-xs">
                                            {choir.location && <span>📍 {choir.location}</span>}
                                            <span>👤 {choir.user?.name ?? 'Unknown manager'}</span>
                                            <span>📧 {choir.user?.email ?? '—'}</span>
                                        </div>
                                        {choir.bio && (
                                            <p className="text-white/50 text-xs mt-2 line-clamp-2">{choir.bio}</p>
                                        )}
                                    </div>

                                    {/* Action */}
                                    <div className="flex-shrink-0">
                                        <VerifyButton choir={choir} />
                                    </div>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
