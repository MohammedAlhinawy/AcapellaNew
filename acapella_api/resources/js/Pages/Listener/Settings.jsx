import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import GlassCard from '../../Components/GlassCard';

export default function ListenerMipangilio({ auth }) {
    const { data, setData, patch, processing } = useForm({
        name: auth?.user?.name ?? '',
        language: auth?.user?.language ?? 'sw',
    });

    return (
        <AppLayout user={auth?.user}>
            <Head title="Account Mipangilio" />

            <div className="max-w-2xl space-y-8">
                <h2 className="font-serif text-4xl font-bold text-white">Account Mipangilio</h2>

                <GlassCard>
                    <h3 className="text-lg font-bold text-white mb-6">Taarifa za Wasifu</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-white/60 mb-1">Jina la Kuonyesha</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-white/60 mb-1">Lugha</label>
                            <select
                                value={data.language}
                                onChange={e => setData('language', e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            >
                                <option value="sw">Kiswahili</option>
                                <option value="en">English</option>
                            </select>
                        </div>
                        <button
                            disabled={processing}
                            className="px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition text-sm"
                        >
                            Hifadhi Mabadiliko
                        </button>
                    </div>
                </GlassCard>

                <GlassCard>
                    <h3 className="text-lg font-bold text-white mb-4">Hali ya Usajili</h3>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white/70 text-sm">
                                {auth?.user?.is_premium ? '✨ Premium — Inafanya Kazi' : '🔒 Mpango wa Bure'}
                            </p>
                        </div>
                        {!auth?.user?.is_premium && (
                            <Link href="/premium" className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-full text-sm hover:scale-105 transition">
                                Panda Daraja
                            </Link>
                        )}
                    </div>
                </GlassCard>
            </div>
        </AppLayout>
    );
}
