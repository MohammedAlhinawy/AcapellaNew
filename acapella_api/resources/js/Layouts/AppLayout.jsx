import { Link } from '@inertiajs/react';
import AudioPlayer from '../Components/AudioPlayer';

export default function AppLayout({ children, user }) {
    return (
        <div className="flex h-screen bg-[#0a0a0c] text-slate-200 overflow-hidden font-sans">
            {/* Ambient Backgrounds */}
            <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-amber-600/10 blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[120px] pointer-events-none" />

            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 border-r border-white/5 backdrop-blur-3xl bg-black/40 flex flex-col pt-8 relative z-10">
                <div className="px-6 mb-10 flex items-center gap-3">
                    <img src="/images/logo.png" alt="Acapella Logo" className="w-8 h-8 object-contain" />
                    <h1 className="font-serif text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
                        Acapella
                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <Link href="/discover" className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 text-white/80 hover:text-white transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                        <span className="font-medium text-sm">Gundua</span>
                    </Link>
                    <Link href="/choirs" className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 text-white/80 hover:text-white transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        <span className="font-medium text-sm">Kwaya</span>
                    </Link>
                    <Link href="/premium" className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-amber-500/10 text-amber-400/80 hover:text-amber-400 transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
                        <span className="font-medium text-sm">Premium</span>
                    </Link>
                </nav>
            </aside>

            {/* Main scrollable viewport */}
            <main className="flex-1 overflow-y-auto pb-32 relative z-10">
                <header className="sticky top-0 z-40 backdrop-blur-md bg-[#0a0a0c]/60 border-b border-white/5 h-16 flex items-center justify-end px-8">
                   {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium">{user.name}</span>
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                {user.name.charAt(0)}
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-4">
                            <Link href="/login" className="text-sm font-medium hover:text-amber-400 transition-colors pt-2">Ingia</Link>
                            <Link href="/register" className="px-4 py-2 text-sm font-semibold text-black bg-white rounded-full hover:bg-gray-200 shadow-[0_0_15px_rgba(255,255,255,0.2)]">Jisajili</Link>
                        </div>
                    )}
                </header>

                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>

            {/* Bottom Audio Player Drawer */}
            <AudioPlayer />
        </div>
    );
}
