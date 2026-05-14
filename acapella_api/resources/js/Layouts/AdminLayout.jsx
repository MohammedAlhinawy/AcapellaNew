import { useState } from 'react';
import { Link } from '@inertiajs/react';

export default function AdminLayout({ children, user }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems = [
        { href: '/admin/dashboard', icon: '📊', label: 'Dashibodi' },
        { href: '/admin/users',     icon: '👥', label: 'Watumiaji' },
        { href: '/admin/choirs',    icon: '🎶', label: 'Kwaya' },
        { href: '/admin/verification', icon: '✅', label: 'Uthibitisho' },
        { href: '/admin/subscriptions', icon: '💳', label: 'Usajili' },
    ];

    return (
        <div className="flex h-screen bg-[#07070a] text-slate-200 overflow-hidden font-sans">
            {/* Ambient glow */}
            <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-red-900/10 blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-rose-900/10 blur-[120px] pointer-events-none" />

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/60 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-40 w-64 flex-shrink-0
                border-r border-white/5 bg-black/80 lg:bg-black/60
                backdrop-blur-xl flex flex-col pt-8 transition-transform duration-300
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Logo */}
                <div className="px-6 mb-2 flex items-center gap-3">
                    <img src="/images/logo.png" alt="Acapella" className="w-9 h-9 object-contain rounded-full shadow-[0_0_15px_rgba(239,68,68,0.3)]" />
                    <div>
                        <h1 className="font-serif text-lg font-bold text-white leading-tight">Acapella</h1>
                        <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest">Admin Panel</p>
                    </div>
                </div>

                <div className="px-6 py-4 mb-2">
                    <div className="w-full h-px bg-white/10" />
                </div>

                <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                    {navItems.map(item => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-all text-sm font-medium group"
                        >
                            <span className="text-base group-hover:scale-110 transition-transform">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Admin badge */}
                <div className="px-4 pb-8 mt-auto">
                    <div className="px-4 py-3 rounded-xl bg-red-900/20 border border-red-800/30">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-red-500/30 flex items-center justify-center text-sm font-bold text-red-300 flex-shrink-0">
                                {user?.name?.charAt(0) ?? 'A'}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-xs text-white/70 truncate font-medium">{user?.name}</p>
                                <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider">System Admin</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto relative z-10 min-w-0">
                {/* Topbar */}
                <header className="sticky top-0 z-40 backdrop-blur-md bg-[#07070a]/80 border-b border-white/5 h-16 flex items-center justify-between px-4 lg:px-8 gap-4">
                    {/* Hamburger — mobile only */}
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden text-white/60 hover:text-white transition p-1"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    <span className="hidden lg:block text-sm font-medium text-white/30 uppercase tracking-widest">
                        Admin Control Panel
                    </span>

                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="text-sm text-white/50 hover:text-red-400 transition ml-auto"
                    >
                        Logout
                    </Link>
                </header>

                <div className="p-4 lg:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
