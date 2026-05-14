import { Head, Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import GlassCard from '../../Components/GlassCard';
import TrackList from '../../Components/TrackList';

export default function ListenerDashibodi({ auth }) {
    const recentNyimbo = [
        { id: 101, title: 'Mwanakondoo', choir: 'Kwaya ya Mt. Kizito', isPremium: false, duration_label: '04:15' },
        { id: 102, title: 'Utukufu', choir: 'Kwaya Kuu', isPremium: true, duration_label: '05:30' },
        { id: 103, title: 'Niongoze', choir: 'Vijana St. Joseph', isPremium: false, duration_label: '03:45' },
    ];

    const isPremium = auth?.user?.is_premium;

    return (
        <AppLayout user={auth?.user}>
            <Head title="My Dashibodi" />

            <div className="space-y-10">
                {/* Welcome Banner */}
                <GlassCard className="relative overflow-hidden !p-8">
                    <div className="absolute -right-10 -top-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white/50 text-sm mb-1">Karibu tena,</p>
                            <h2 className="font-serif text-3xl font-bold text-white">
                                {auth?.user?.name ?? 'Listener'} 👋
                            </h2>
                            <p className="text-white/50 text-sm mt-2">
                                {isPremium
                                    ? '✨ Una usajili wa Premium unaofanya kazi.'
                                    : 'Uko kwenye mpango wa Bure. Panda daraja kwa kucheza nyuma ya skrini na kupakua.'}
                            </p>
                        </div>
                        {!isPremium && (
                            <Link
                                href="/premium"
                                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-full text-sm hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] hover:scale-105 transition-all"
                            >
                                Panda Daraja la Premium →
                            </Link>
                        )}
                    </div>
                </GlassCard>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: 'Nyimbo Zilizopendwa', value: '0', icon: '❤️' },
                        { label: 'Zilizochezwa Hivi Karibuni', value: '0', icon: '🎵' },
                        { label: 'Kwaya Zilizofuatwa', value: '0', icon: '🎶' },
                    ].map(stat => (
                        <GlassCard key={stat.label} className="text-center !py-6">
                            <div className="text-3xl mb-2">{stat.icon}</div>
                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                            <div className="text-white/50 text-xs mt-1">{stat.label}</div>
                        </GlassCard>
                    ))}
                </div>

                {/* Recently Played */}
                <div>
                    <h3 className="font-serif text-2xl font-bold text-white mb-4">Zilizochezwa Hivi Karibuni</h3>
                    <GlassCard className="!p-0">
                        <TrackList tracks={recentNyimbo} />
                    </GlassCard>
                </div>
            </div>
        </AppLayout>
    );
}
