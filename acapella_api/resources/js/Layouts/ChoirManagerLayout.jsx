import { Link } from '@inertiajs/react';

export default function ChoirManagerLayout({ children, user }) {
    return (
        <div className="flex h-screen bg-[#0a0a0c] text-slate-200 overflow-hidden font-sans">
            {/* Ambient backgrounds */}
            <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/10 blur-[120px] pointer-events-none" />

            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 border-r border-white/5 backdrop-blur-3xl bg-black/40 flex flex-col pt-8 relative z-10">
                <div className="px-6 mb-2 flex items-center gap-3">
                    <img src="/images/logo.png" alt="Acapella" className="w-8 h-8 object-contain" />
                    <div>
                        <h1 className="font-serif text-lg font-bold text-white">Acapella</h1>
                        <p className="text-[10px] text-blue-400 font-semibold uppercase tracking-widest">Manager Portal</p>
                    </div>
                </div>

                <div className="px-6 py-4 mb-4">
                    <div className="w-full h-px bg-white/10" />
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    {[
                        { href: '/manager/dashboard', icon: '🏠', label: 'Dashibodi' },
                        { href: '/manager/choir', icon: '🎶', label: 'My Choir' },
                        { href: '/manager/albums', icon: '💿', label: 'Albamu' },
                        { href: '/manager/tracks', icon: '🎵', label: 'Nyimbo' },
                        { href: '/manager/analytics', icon: '📊', label: 'Takwimu' },
                    ].map(item => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 text-white/70 hover:text-white transition-all text-sm font-medium"
                        >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="px-4 pb-6 mt-auto">
                    <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                        <p className="text-xs text-white/50 truncate">{user?.name}</p>
                        <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mt-0.5">Choir Manager</p>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto relative z-10">
                <header className="sticky top-0 z-40 backdrop-blur-md bg-[#0a0a0c]/60 border-b border-white/5 h-16 flex items-center justify-end px-8 gap-4">
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="text-sm text-white/50 hover:text-red-400 transition"
                    >
                        Logout
                    </Link>
                </header>
                <div className="p-8 max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
