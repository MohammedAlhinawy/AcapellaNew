import { Head } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';
import GlassCard from '../Components/GlassCard';
import TrackList from '../Components/TrackList';

export default function Gundua({ auth, popularAlbamu = [], trendingNyimbo = [] }) {

    return (
        <AppLayout user={auth?.user}>
            <Head title="Gundua" />
            
            {/* Hero Section */}
            <div className="relative rounded-3xl overflow-hidden h-[400px] mb-12 flex items-end p-10 bg-cover bg-center border border-white/10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1525926477800-7a3eaa989f5a?q=80&w=2938&auto=format&fit=crop')" }}>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/60 to-transparent"></div>
                <div className="relative z-10 w-full">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white mb-4 inline-block uppercase tracking-widest border border-white/20">Featured Release</span>
                    <h2 className="font-serif text-5xl md:text-7xl font-bold text-white mb-4">Sauti ya Jangwani</h2>
                    <p className="text-lg text-white/80 max-w-2xl mb-6">Experience the highly anticipated new album from Kwaya ya Mt. Kizito Makuburi. Available now exclusively on Acapella.</p>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => trendingNyimbo?.length > 0 && window.dispatchEvent(new CustomEvent('play-track', { detail: trendingNyimbo[0] }))}
                            className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 hover:scale-105 transition flex items-center gap-2"
                        >
                            <svg className="w-5 h-5 ml-1 inline" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                            Cheza Sasa
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Grids */}
            <h3 className="font-serif text-3xl font-bold mb-6 text-white tracking-wide">Trending Albamu</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                {popularAlbamu.map(album => (
                    <GlassCard key={album.id} className="!p-4 group cursor-pointer border shadow-lg shadow-black/20">
                        <div className="relative aspect-square rounded-xl overflow-hidden mb-4 shadow-[0_4px_15px_rgba(0,0,0,0.5)]">
                            <img src={album.cover_path ? `/storage/${album.cover_path}` : (album.cover ?? 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop')} alt={album.title} className="w-full h-full object-cover group-hover:scale-110 group-hover:blur-[2px] transition duration-500" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.6)] flex items-center justify-center translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                     <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                </div>
                            </div>
                        </div>
                        <h4 className="text-white font-bold truncate text-lg">{album.title}</h4>
                        <p className="text-white/60 text-sm truncate">{typeof album.choir === 'object' ? album.choir?.name : album.choir}</p>
                    </GlassCard>
                ))}
            </div>

            <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-3xl font-bold text-white tracking-wide">Top Nyimbo</h3>
                <span className="text-sm font-medium text-amber-500 uppercase tracking-widest hover:text-amber-400 cursor-pointer">View All</span>
            </div>
            
            <GlassCard className="!p-0 border shadow-lg shadow-black/20">
                <TrackList tracks={trendingNyimbo} />
            </GlassCard>
        </AppLayout>
    );
}
