import { Head } from '@inertiajs/react';
import ChoirManagerLayout from '../../Layouts/ChoirManagerLayout';
import GlassCard from '../../Components/GlassCard';

export default function ChoirManagerTakwimu({ auth, choir, stats }) {
    const hasChoir = Boolean(choir);

    return (
        <ChoirManagerLayout user={auth?.user}>
            <Head title="Takwimu" />

            <div className="space-y-8">
                <div>
                    <p className="text-xs text-blue-400 font-bold uppercase tracking-widest mb-1">Manager Portal</p>
                    <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">Takwimu</h2>
                    <p className="text-white/40 text-sm mt-1">
                        {hasChoir ? `Performance overview for ${choir.name}` : 'Set up your choir to see analytics.'}
                    </p>
                </div>

                {!hasChoir && (
                    <GlassCard className="border-amber-500/20 text-center !py-16">
                        <div className="text-5xl mb-4">📊</div>
                        <p className="text-white/40 mb-3">No choir profile found.</p>
                        <a href="/manager/choir" className="text-blue-400 hover:underline text-sm">Create choir profile →</a>
                    </GlassCard>
                )}

                {hasChoir && (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {[
                                { label: 'Total Albamu', value: stats?.total_albums ?? 0, icon: '💿', color: 'bg-blue-500/20 text-blue-400' },
                                { label: 'Total Nyimbo', value: stats?.total_tracks ?? 0, icon: '🎵', color: 'bg-purple-500/20 text-purple-400' },
                                { label: 'Choir Status', value: choir.is_verified ? 'Verified' : 'Pending', icon: choir.is_verified ? '✅' : '⏳', color: 'bg-amber-500/20 text-amber-400' },
                            ].map(s => (
                                <GlassCard key={s.label} className="!p-5">
                                    <div className={`w-11 h-11 rounded-xl ${s.color} flex items-center justify-center text-lg mb-3`}>{s.icon}</div>
                                    <div className="text-2xl font-bold text-white">{s.value}</div>
                                    <div className="text-white/40 text-xs mt-1 font-medium">{s.label}</div>
                                </GlassCard>
                            ))}
                        </div>

                        <GlassCard className="border-blue-500/10">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-lg flex-shrink-0">ℹ️</div>
                                <div>
                                    <h4 className="font-bold text-white mb-1">Advanced Takwimu Coming Soon</h4>
                                    <p className="text-white/50 text-sm">
                                        Stream counts, listener demographics, revenue reports, and play history will be available here once Acapella is live. Stay tuned.
                                    </p>
                                </div>
                            </div>
                        </GlassCard>
                    </>
                )}
            </div>
        </ChoirManagerLayout>
    );
}
