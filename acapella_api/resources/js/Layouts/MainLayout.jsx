import { Link } from '@inertiajs/react';
import AudioPlayer from '../Components/AudioPlayer';

export default function MainLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#0a0a0c] text-white overflow-x-hidden font-sans">
            {/* Background ambient lighting */}
            <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-amber-600/10 blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[120px] pointer-events-none" />

            {/* Glassmorphism Header */}
            <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0a0a0c]/60 border-b border-white/5 h-16 pointer-events-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/images/logo.png" alt="Acapella Logo" className="w-8 h-8 object-contain" />
                        <h1 className="font-serif text-xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
                            Acapella
                        </h1>
                    </div>
                    
                    <nav className="flex space-x-6 text-sm font-medium">
                        <Link href="/" className="text-white hover:text-amber-400 hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] transition-all duration-300">Nyumbani</Link>
                        <Link href="/discover" className="text-white/60 hover:text-white hover:text-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-300">Gundua</Link>
                        <Link href="/choirs" className="text-white/60 hover:text-white hover:text-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-300">Kwaya</Link>
                    </nav>

                    <div className="flex items-center space-x-4">
                        <Link href="/login" className="text-sm font-medium text-white/80 hover:text-amber-400 hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.6)] transition-all duration-300">
                            Ingia
                        </Link>
                        <Link href="/register" className="px-5 py-2.5 text-sm font-bold text-black bg-gradient-to-r from-white to-gray-200 rounded-full hover:scale-105 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all duration-300">
                            Jisajili
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
                {children}
            </main>

            {/* Bottom Audio Player Drawer */}
            <AudioPlayer />
        </div>
    );
}
