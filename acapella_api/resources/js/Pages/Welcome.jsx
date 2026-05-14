import MainLayout from '../Layouts/MainLayout';
import GlassCard from '../Components/GlassCard';
import { Head } from '@inertiajs/react';
export default function Welcome({ stats = { choirs: 0, tracks: 0 } }) {
    return (
        <MainLayout>
            <Head title="Karibu Acapella" />
            
            <div className="py-12 flex flex-col items-center justify-center min-h-[70vh] text-center">
                <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-sm font-medium tracking-wide">
                    Uzoefu Bora wa Kwaya
                </div>
                
                <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
                    Sikiliza <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-600">
                        Sauti za Tanzania
                    </span>
                </h1>
                
                <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12 font-light">
                    Experience exclusive high-fidelity Christian Kwaya music from over <span className="font-bold text-amber-400">{stats.choirs} kwaya zilizothibitishwa</span> and <span className="font-bold text-amber-400">{stats.tracks} tracks</span>. Saidia kwaya za ndani moja kwa moja kupitia ushirikiano rahisi wa malipo ya simu wa Mongike.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mx-auto text-left">
                    <GlassCard className="group cursor-pointer">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Sauti ya Ubora wa Juu</h3>
                        <p className="text-white/50 text-sm font-light">
                            Premium offline playback and background listening features for an uninterrupted spiritual journey.
                        </p>
                    </GlassCard>

                    <GlassCard className="group cursor-pointer">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Support Kwaya</h3>
                        <p className="text-white/50 text-sm font-light">
                            Direct subscription payouts to verified Kwaya managers through integrated financial systems.
                        </p>
                    </GlassCard>

                    <GlassCard className="group cursor-pointer">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Usawazishaji wa Papo Hapo</h3>
                        <p className="text-white/50 text-sm font-light">
                            Real-time payment notifications and instantaneous premium unlocks powered by Laravel Reverb.
                        </p>
                    </GlassCard>
                </div>
            </div>
            
            <footer className="text-center text-sm text-white/30 pb-4 border-t border-white/5 pt-8 mt-12">
                <div className="flex items-center justify-center gap-6 mb-4">
                    <a href="/privacy-policy" className="hover:text-amber-400 transition-colors">Privacy Policy</a>
                    <a href="/terms-of-service" className="hover:text-amber-400 transition-colors">Terms of Service</a>
                </div>
            </footer>
        </MainLayout>
    );
}
