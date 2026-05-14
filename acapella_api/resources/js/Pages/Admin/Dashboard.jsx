import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import GlassCard from '../../Components/GlassCard';

function StatCard({ label, value, icon, colorClass, bgClass, trend }) {
    return (
        <GlassCard className="!p-5 group hover:border-white/20 transition-all">
            <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl ${bgClass} ${colorClass} flex items-center justify-center text-lg flex-shrink-0`}>
                    {icon}
                </div>
                {trend != null && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${trend >= 0 ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                        {trend >= 0 ? '+' : ''}{trend}%
                    </span>
                )}
            </div>
            <div className="text-3xl font-bold text-white tabular-nums">{value.toLocaleString()}</div>
            <div className="text-white/40 text-xs mt-1 font-medium tracking-wide">{label}</div>
        </GlassCard>
    );
}

export default function AdminDashibodi({ auth, stats, recentNyimbo }) {
    const s = stats ?? {};

    const primaryStats = [
        { label: 'Total Watumiaji',       value: s.total_users          ?? 0, icon: '👥', colorClass: 'text-blue-400',    bgClass: 'bg-blue-500/20',    trend: null },
        { label: 'Listeners',         value: s.total_listeners      ?? 0, icon: '🎧', colorClass: 'text-green-400',   bgClass: 'bg-green-500/20',   trend: null },
        { label: 'Choir Managers',    value: s.total_choir_managers ?? 0, icon: '🎶', colorClass: 'text-purple-400',  bgClass: 'bg-purple-500/20',  trend: null },
        { label: 'Premium Watumiaji',     value: s.premium_users        ?? 0, icon: '✨', colorClass: 'text-amber-400',   bgClass: 'bg-amber-500/20',   trend: null },
    ];

    const choirStats = [
        { label: 'Total Kwaya',          value: s.total_choirs    ?? 0, icon: '🏛️', colorClass: 'text-pink-400',    bgClass: 'bg-pink-500/20'    },
        { label: 'Verified',              value: s.verified_choirs ?? 0, icon: '✅', colorClass: 'text-emerald-400', bgClass: 'bg-emerald-500/20' },
        { label: 'Pending Uthibitisho',  value: s.pending_choirs  ?? 0, icon: '⏳', colorClass: 'text-orange-400', bgClass: 'bg-orange-500/20'  },
        { label: 'Admins',                value: s.total_admins    ?? 0, icon: '🛡️', colorClass: 'text-red-400',     bgClass: 'bg-red-900/30'     },
    ];

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Admin Dashibodi" />

            <div className="space-y-10">

                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div>
                        <p className="text-xs text-red-400 font-bold uppercase tracking-widest mb-1">Control Center</p>
                        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
                            Acapella Overview
                        </h2>
                        <p className="text-white/40 text-sm mt-1">
                            {new Date().toLocaleDateString('sw-TZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href="/admin/users"
                            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium transition"
                        >
                            Simamia Watumiaji →
                        </Link>
                    </div>
                </div>

                {/* Divider */}
                <div>
                    <p className="text-xs text-white/30 uppercase tracking-widest font-semibold mb-4">Takwimu za Watumiaji</p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {primaryStats.map(s => <StatCard key={s.label} {...s} />)}
                    </div>
                </div>

                <div>
                    <p className="text-xs text-white/30 uppercase tracking-widest font-semibold mb-4">Takwimu za Kwaya</p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {choirStats.map(s => <StatCard key={s.label} {...s} />)}
                    </div>
                </div>

                {/* Recent Nyimbo */}
                {recentNyimbo?.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs text-white/30 uppercase tracking-widest font-semibold">Recent Nyimbo</p>
                        </div>
                        <GlassCard className="!p-0">
                            {recentNyimbo.map((track, i) => (
                                <div key={track.id} className={`flex flex-col px-5 py-3.5 hover:bg-white/[0.02] transition ${i < recentNyimbo.length - 1 ? 'border-b border-white/5' : ''}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">🎵</div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white text-sm font-medium truncate">{track.title}</p>
                                            <p className="text-white/40 text-xs truncate">
                                                {track.choir?.name ?? 'Unknown Choir'} • {track.album?.title ?? 'No album'}
                                            </p>
                                        </div>
                                        <div className="text-white/30 text-xs font-mono">{track.duration_label}</div>
                                        {track.is_premium && <span className="text-amber-400 text-xs">✨</span>}
                                    </div>
                                    <div className="mt-3 pl-12">
                                        <audio controls src={`/storage/${track.file_path}`} className="w-full h-8" />
                                    </div>
                                </div>
                            ))}
                        </GlassCard>
                    </div>
                )}

                {/* Action Cards */}
                <div>
                    <p className="text-xs text-white/30 uppercase tracking-widest font-semibold mb-4">Vitendo vya Haraka</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            {
                                href:   '/admin/verification',
                                label:  'Foleni ya Uthibitisho',
                                desc:   `${s.pending_choirs ?? 0} kwaya zinasubiri ukaguzi`,
                                icon:   '✅',
                                border: 'border-emerald-500/20 hover:border-emerald-500/40',
                                glow:   'group-hover:bg-emerald-500/5',
                                badge:  s.pending_choirs > 0 ? s.pending_choirs : null,
                            },
                            {
                                href:   '/admin/users',
                                label:  'Simamia Watumiaji & Majukumu',
                                desc:   `${s.total_users ?? 0} akaunti zilizosajiliwa`,
                                icon:   '👥',
                                border: 'border-blue-500/20 hover:border-blue-500/40',
                                glow:   'group-hover:bg-blue-500/5',
                                badge:  null,
                            },
                            {
                                href:   '/admin/choirs',
                                label:  'Tazama Kwaya Zote',
                                desc:   `${s.total_choirs ?? 0} kwaya kwenye jukwaa`,
                                icon:   '🎶',
                                border: 'border-purple-500/20 hover:border-purple-500/40',
                                glow:   'group-hover:bg-purple-500/5',
                                badge:  null,
                            },
                        ].map(action => (
                            <Link key={action.href} href={action.href}>
                                <GlassCard className={`group cursor-pointer !p-5 transition-all ${action.border}`}>
                                    <div className={`absolute inset-0 rounded-2xl transition-all ${action.glow}`} />
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-2xl group-hover:scale-110 transition-transform">{action.icon}</span>
                                        {action.badge != null && (
                                            <span className="w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                                                {action.badge}
                                            </span>
                                        )}
                                    </div>
                                    <p className="font-semibold text-white text-sm">{action.label}</p>
                                    <p className="text-white/40 text-xs mt-1">{action.desc}</p>
                                </GlassCard>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* System health strip */}
                <GlassCard className="!p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                            <p className="text-white text-sm font-semibold">Mfumo Unafanya Kazi</p>
                        </div>
                        <div className="flex flex-wrap gap-4 text-xs text-white/40">
                            <span>API <span className="text-emerald-400 font-bold">✓ Mtandaoni</span></span>
                            <span>Hifadhidata <span className="text-emerald-400 font-bold">✓ Imeunganishwa</span></span>
                            <span>Malipo <span className="text-amber-400 font-bold">⚡ Mongike Tayari</span></span>
                        </div>
                    </div>
                </GlassCard>

            </div>
        </AdminLayout>
    );
}
