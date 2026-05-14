import { Head, Link } from '@inertiajs/react';
import ChoirManagerLayout from '../../Layouts/ChoirManagerLayout';
import GlassCard from '../../Components/GlassCard';

export default function ChoirManagerDashibodi({ auth, choir, stats, recentNyimbo }) {
    const isVerified = choir?.is_verified;

    return (
        <ChoirManagerLayout user={auth?.user}>
            <Head title="Manager Dashibodi" />

            <div className="space-y-8">
                {/* Header */}
                <div>
                    <p className="text-xs text-blue-400 font-bold uppercase tracking-widest mb-1">Manager Portal</p>
                    <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
                        Karibu, {auth?.user?.name}
                    </h2>
                    <p className="text-white/40 text-sm mt-1">
                        {choir ? choir.name : 'Bado huna wasifu wa kwaya — uanzishe hapa chini.'}
                    </p>
                </div>

                {/* No choir warning */}
                {!choir && (
                    <GlassCard className="border-amber-500/30">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-2xl flex-shrink-0">⚠️</div>
                            <div className="flex-1">
                                <h4 className="font-bold text-white mb-1">Hakuna Wasifu wa Kwaya Uliopatikana</h4>
                                <p className="text-white/50 text-sm">Unahitaji kuunda wasifu wa kwaya kabla ya kupakia albamu na nyimbo.</p>
                            </div>
                            <Link href="/manager/choir" className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-sm transition flex-shrink-0">
                                Unda Wasifu →
                            </Link>
                        </div>
                    </GlassCard>
                )}

                {/* Uthibitisho badge */}
                {choir && !isVerified && (
                    <GlassCard className="border-orange-500/20 !p-4">
                        <div className="flex items-center gap-3">
                            <span className="text-orange-400 text-lg">⏳</span>
                            <p className="text-white/70 text-sm">
                                Kwaya yako iko <strong className="text-orange-400">inasubiri uthibitisho</strong>. 
                                Ikithibitishwa, utapata beji na kuonekana kwenye orodha maarufu.
                            </p>
                        </div>
                    </GlassCard>
                )}
                {choir && isVerified && (
                    <GlassCard className="border-emerald-500/20 !p-4">
                        <div className="flex items-center gap-3">
                            <span className="text-emerald-400 text-lg">✅</span>
                            <p className="text-white/70 text-sm">
                                Kwaya yako <strong className="text-emerald-400">imethibitishwa</strong>. 
                                Unaonekana kwenye saraka maarufu ya Kwaya.
                            </p>
                        </div>
                    </GlassCard>
                )}

                {/* Stat Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                        { label: 'Albamu',        value: stats?.total_albums ?? 0, icon: '💿', href: '/manager/albums', color: 'bg-blue-500/20 text-blue-400' },
                        { label: 'Nyimbo',        value: stats?.total_tracks ?? 0, icon: '🎵', href: '/manager/tracks', color: 'bg-purple-500/20 text-purple-400' },
                        { label: 'Choir Status',  value: isVerified ? 'Verified' : 'Pending', icon: isVerified ? '✅' : '⏳', href: '/manager/choir', color: 'bg-amber-500/20 text-amber-400' },
                    ].map(s => (
                        <Link key={s.label} href={s.href}>
                            <GlassCard className="!p-5 group hover:border-white/20 cursor-pointer transition-all">
                                <div className={`w-11 h-11 rounded-xl ${s.color} flex items-center justify-center text-lg mb-3 group-hover:scale-110 transition-transform`}>
                                    {s.icon}
                                </div>
                                <div className="text-2xl font-bold text-white">{s.value}</div>
                                <div className="text-white/40 text-xs mt-1 font-medium">{s.label}</div>
                            </GlassCard>
                        </Link>
                    ))}
                </div>

                {/* Quick Actions */}
                <div>
                    <p className="text-xs text-white/30 uppercase tracking-widest font-semibold mb-4">Vitendo vya Haraka</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { href: '/manager/choir',   label: 'Hariri Wasifu wa Kwaya', desc: 'Sasisha jina, bio, mahali',      icon: '🎶', border: 'border-amber-500/20 hover:border-amber-500/40' },
                            { href: '/manager/albums',  label: 'Simamia Albamu',         desc: 'Unda na panga albamu',          icon: '💿', border: 'border-blue-500/20 hover:border-blue-500/40' },
                            { href: '/manager/tracks',  label: 'Pakia Nyimbo',           desc: 'Ongeza faili za sauti kwenye albamu', icon: '🎵', border: 'border-purple-500/20 hover:border-purple-500/40' },
                        ].map(action => (
                            <Link key={action.href} href={action.href}>
                                <GlassCard className={`group cursor-pointer !p-5 transition-all ${action.border}`}>
                                    <div className="text-2xl mb-3 group-hover:scale-110 transition-transform">{action.icon}</div>
                                    <p className="font-semibold text-white text-sm">{action.label}</p>
                                    <p className="text-white/40 text-xs mt-1">{action.desc}</p>
                                </GlassCard>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recent Nyimbo */}
                {recentNyimbo?.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs text-white/30 uppercase tracking-widest font-semibold">Recent Nyimbo</p>
                            <Link href="/manager/tracks" className="text-xs text-blue-400 hover:text-blue-300 transition">View All →</Link>
                        </div>
                        <GlassCard className="!p-0">
                            {recentNyimbo.map((track, i) => (
                                <div key={track.id} className={`flex flex-col px-5 py-3.5 hover:bg-white/[0.02] transition ${i < recentNyimbo.length - 1 ? 'border-b border-white/5' : ''}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">🎵</div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white text-sm font-medium truncate">{track.title}</p>
                                            <p className="text-white/40 text-xs">{track.album?.title ?? 'No album'}</p>
                                        </div>
                                        <div className="text-white/30 text-xs font-mono">{track.duration_label}</div>
                                        {track.is_premium && <span className="text-amber-400 text-xs">✨</span>}
                                    </div>
                                    <div className="mt-3 pl-12">
                                        <audio controls src={`/storage/${track.file_path}`} className="w-full h-8" />
                                    </div>
                                </div>
                            ))}
                        </GlassCard>
                    </div>
                )}
            </div>
        </ChoirManagerLayout>
    );
}
