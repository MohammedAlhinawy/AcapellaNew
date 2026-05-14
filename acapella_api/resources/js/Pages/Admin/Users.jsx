import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import GlassCard from '../../Components/GlassCard';

// ── Create Choir Manager Modal ────────────────────────────────────────────────
function CreateManagerModal({ onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', email: '', password: '', password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/users/create-manager', { onSuccess: () => { reset(); onClose(); } });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-md">
                <GlassCard className="!p-8 border-blue-500/20">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-white">Unda Msimamizi wa Kwaya</h3>
                            <p className="text-white/40 text-sm mt-1">Akaunti hii itakuwa na ufikiaji wa usimamizi wa kwaya.</p>
                        </div>
                        <button onClick={onClose} className="text-white/40 hover:text-white transition ml-4">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <form onSubmit={submit} className="space-y-4">
                        {[
                            { key: 'name',                  label: 'Full Name',          type: 'text',     ph: 'e.g. Peter Makena' },
                            { key: 'email',                 label: 'Email Address',      type: 'email',    ph: 'manager@kwaya.co.tz' },
                            { key: 'password',              label: 'Temporary Password', type: 'password', ph: 'Min. 8 characters' },
                            { key: 'password_confirmation', label: 'Confirm Password',   type: 'password', ph: 'Repeat password' },
                        ].map(f => (
                            <div key={f.key}>
                                <label className="block text-xs text-white/50 font-semibold uppercase tracking-wider mb-1.5">{f.label}</label>
                                <input type={f.type} value={data[f.key]} onChange={e => setData(f.key, e.target.value)} placeholder={f.ph}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition placeholder-white/20" />
                                {errors[f.key] && <p className="text-red-400 text-xs mt-1">{errors[f.key]}</p>}
                            </div>
                        ))}
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 text-sm font-medium transition">Ghairi</button>
                            <button type="submit" disabled={processing} className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm transition">
                                {processing ? 'Inaunda…' : 'Unda Msimamizi'}
                            </button>
                        </div>
                    </form>
                </GlassCard>
            </div>
        </div>
    );
}

// ── Edit Role Modal ───────────────────────────────────────────────────────────
function EditRoleModal({ user, onClose }) {
    const { data, setData, patch, processing, errors } = useForm({ role: user.role });

    const submit = (e) => {
        e.preventDefault();
        patch(`/admin/users/${user.id}/role`, { onSuccess: onClose });
    };

    const roles = [
        { value: 'listener',      label: 'Msikilizaji',        desc: 'Mtumiaji wa kawaida — anaweza kutafuta na kutiririka muziki.',   color: 'border-white/20 hover:border-white/40', active: 'border-white/60 bg-white/10' },
        { value: 'choir_manager', label: 'Msimamizi wa Kwaya', desc: 'Anaweza kupakia albamu na nyimbo za kwaya yake.',                color: 'border-blue-500/30 hover:border-blue-500/60', active: 'border-blue-500 bg-blue-500/15' },
        { value: 'admin',         label: 'Msimamizi Mkuu',     desc: 'Ufikiaji kamili — simamia watumiaji, kwaya, na maudhui yote.', color: 'border-red-800/40 hover:border-red-700/60', active: 'border-red-500 bg-red-900/30' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-md">
                <GlassCard className="!p-8 border-white/10">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-white">Hariri Jukumu</h3>
                            <p className="text-white/40 text-sm mt-1">{user.name} · {user.email}</p>
                        </div>
                        <button onClick={onClose} className="text-white/40 hover:text-white transition ml-4">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <form onSubmit={submit} className="space-y-3">
                        {roles.map(r => (
                            <button
                                key={r.value}
                                type="button"
                                onClick={() => setData('role', r.value)}
                                className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all ${data.role === r.value ? r.active : r.color}`}
                            >
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold text-white text-sm">{r.label}</p>
                                    {data.role === r.value && (
                                        <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center">
                                            <div className="w-2 h-2 rounded-full bg-black" />
                                        </div>
                                    )}
                                </div>
                                <p className="text-white/40 text-xs mt-0.5">{r.desc}</p>
                            </button>
                        ))}

                        {errors.role && <p className="text-red-400 text-xs">{errors.role}</p>}

                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 text-sm font-medium transition">Ghairi</button>
                            <button type="submit" disabled={processing} className="flex-1 py-3 rounded-xl bg-white text-black font-bold text-sm hover:bg-gray-200 disabled:opacity-50 transition">
                                {processing ? 'Inahifadhi…' : 'Hifadhi Jukumu'}
                            </button>
                        </div>
                    </form>
                </GlassCard>
            </div>
        </div>
    );
}

// ── Role badge styles ──────────────────────────────────────────────────────────
const roleBadge = {
    admin:         'bg-red-900/40 text-red-300 border border-red-800/50',
    choir_manager: 'bg-blue-900/40 text-blue-300 border border-blue-800/50',
    listener:      'bg-white/5 text-white/50 border border-white/10',
};

// ── Flash message ─────────────────────────────────────────────────────────────
function Flash({ message }) {
    if (!message) return null;
    return (
        <div className="px-4 py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm font-medium flex items-center gap-2">
            <span>✅</span> {message}
        </div>
    );
}

export default function AdminWatumiaji({ auth, users, flash }) {
    const [showCreate, setShowCreate] = useState(false);
    const [editUser,   setEditUser]   = useState(null);

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Manage Watumiaji" />
            {showCreate && <CreateManagerModal onClose={() => setShowCreate(false)} />}
            {editUser   && <EditRoleModal user={editUser} onClose={() => setEditUser(null)} />}

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <p className="text-xs text-red-400 font-bold uppercase tracking-widest mb-1">Admin Panel</p>
                        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">Watumiaji</h2>
                        <p className="text-white/40 text-sm mt-1">{users?.total ?? 0} akaunti zilizosajiliwa</p>
                    </div>
                    <button
                        onClick={() => setShowCreate(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] self-start sm:self-auto"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        Unda Msimamizi wa Kwaya
                    </button>
                </div>

                <Flash message={flash?.success} />

                <GlassCard className="!p-0 overflow-hidden">
                    <div className="hidden sm:flex items-center px-6 py-3 border-b border-white/5 text-xs text-white/30 uppercase tracking-widest">
                        <div className="flex-1">Mtumiaji</div>
                        <div className="w-36 text-center">Jukumu</div>
                        <div className="w-24 text-center">Premium</div>
                        <div className="w-32 text-right">Vitendo</div>
                    </div>

                    {users?.data?.length > 0 ? (
                        <div className="divide-y divide-white/5">
                            {users.data.map(u => (
                                <div key={u.id} className="flex flex-col sm:flex-row sm:items-center px-4 sm:px-6 py-4 hover:bg-white/[0.02] transition gap-3 sm:gap-0">
                                    <div className="flex-1 flex items-center gap-3 min-w-0">
                                        <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                                            {u.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-white font-semibold text-sm truncate">{u.name}</p>
                                            <p className="text-white/40 text-xs truncate">{u.email}</p>
                                        </div>
                                    </div>
                                    <div className="sm:w-36 flex sm:justify-center">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${roleBadge[u.role] ?? roleBadge.listener}`}>
                                            {u.role}
                                        </span>
                                    </div>
                                    <div className="sm:w-24 sm:text-center text-sm">
                                        {u.is_premium
                                            ? <span className="text-amber-400 font-bold">✨ Yes</span>
                                            : <span className="text-white/25 text-xs">Free</span>}
                                    </div>
                                    <div className="sm:w-32 flex sm:justify-end">
                                        <button
                                            onClick={() => setEditUser(u)}
                                            className="text-xs text-blue-400 hover:text-blue-300 border border-blue-500/30 hover:border-blue-500/60 px-3 py-1.5 rounded-lg transition"
                                        >
                                            Hariri Jukumu
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 text-white/30">
                            <div className="text-5xl mb-4">👥</div>
                            <p>Hakuna watumiaji waliopatikana.</p>
                        </div>
                    )}
                </GlassCard>
            </div>
        </AdminLayout>
    );
}
