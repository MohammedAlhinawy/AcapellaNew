import { Head } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';
import GlassCard from '../Components/GlassCard';

export default function Kwaya({ auth, choirs = [] }) {
    return (
        <AppLayout user={auth?.user}>
            <Head title="Kwaya Hub" />
            
            <div className="flex items-end justify-between mb-8 pb-6 border-b border-white/10">
                <div>
                    <h2 className="font-serif text-4xl font-bold text-white mb-2">Kwaya Directory</h2>
                    <p className="text-white/50 font-light">Gundua and support verified Kwaya creators across Tanzania.</p>
                </div>
                
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Search choirs..." 
                        className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white focus:outline-none focus:border-amber-500/50 w-64"
                    />
                    <svg className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {choirs.map(choir => (
                    <GlassCard key={choir.id} className="flex gap-4 items-center group cursor-pointer hover:border-white/20">
                        <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-white/10 group-hover:border-amber-500/50 transition-colors">
                            <img src={choir.image_path ? `/storage/${choir.image_path}` : (choir.image ?? 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop')} alt={choir.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-white font-bold text-lg truncate group-hover:text-amber-400 transition-colors">{choir.name}</h3>
                                {(choir.isVerified || choir.is_verified) && (
                                    <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                    </svg>
                                )}
                            </div>
                            <p className="text-white/50 text-xs mb-2 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                {choir.location ?? 'Tanzania'}
                            </p>
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-white/10 text-white/70">
                                {choir.followers ?? '0'} Followers
                            </span>
                        </div>
                    </GlassCard>
                ))}
            </div>
        </AppLayout>
    );
}
