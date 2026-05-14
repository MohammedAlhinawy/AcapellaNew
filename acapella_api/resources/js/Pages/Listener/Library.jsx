import { Head, Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import GlassCard from '../../Components/GlassCard';

export default function ListenerMaktaba({ auth }) {
    return (
        <AppLayout user={auth?.user}>
            <Head title="My Maktaba" />

            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="font-serif text-4xl font-bold text-white">My Maktaba</h2>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <GlassCard className="group cursor-pointer hover:border-white/20">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-amber-500/20 flex items-center justify-center text-2xl">❤️</div>
                            <div>
                                <h3 className="text-white font-bold text-lg">Nyimbo Zilizopendwa</h3>
                                <p className="text-white/50 text-sm">0 nyimbo</p>
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard className="group cursor-pointer hover:border-white/20">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center text-2xl">📥</div>
                            <div>
                                <h3 className="text-white font-bold text-lg">Zilizopakiwa</h3>
                                <p className="text-white/50 text-sm">
                                    {auth?.user?.is_premium ? '0 nyimbo' : (
                                        <Link href="/premium" className="text-amber-400 hover:underline">Premium tu →</Link>
                                    )}
                                </p>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                <div className="text-center py-20 text-white/30">
                    <div className="text-6xl mb-4">🎵</div>
                    <p className="text-lg">Maktaba yako iko tupu.</p>
                    <p className="text-sm mt-2">Anza kusikiliza kujenga mkusanyiko wako.</p>
                    <Link href="/discover" className="mt-6 inline-block px-6 py-3 bg-white/10 hover:bg-white/15 rounded-full text-white text-sm font-medium transition">
                        Tafuta Muziki
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
