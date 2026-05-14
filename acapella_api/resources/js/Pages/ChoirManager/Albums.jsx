import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import ChoirManagerLayout from '../../Layouts/ChoirManagerLayout';
import GlassCard from '../../Components/GlassCard';

// ── Create / Edit Album Modal ────────────────────────────────────────────────
function AlbumModal({ onClose, album }) {
    const isEdit = Boolean(album);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        title:      album?.title      ?? '',
        year:       album?.year       ?? new Date().getFullYear(),
        genre:      album?.genre      ?? '',
        is_premium: album?.is_premium ?? false,
        cover:      null,
        _method:    isEdit ? 'PUT' : 'POST',
    });

    const [preview, setPreview] = useState(album?.cover_path ? `/storage/${album.cover_path}` : null);

    const handleCover = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setData('cover', file);
        setPreview(URL.createObjectURL(file));
    };

    const submit = (e) => {
        e.preventDefault();
        const url   = isEdit ? `/manager/albums/${album.id}` : '/manager/albums';
        const method = isEdit ? put : post;
        method(url, { forceFormData: true, onSuccess: () => { reset(); onClose(); } });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-md">
                <GlassCard className="!p-8 border-blue-500/20">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-white">{isEdit ? 'Edit Album' : 'Create Album'}</h3>
                            <p className="text-white/40 text-sm mt-1">Organise your tracks into a collection.</p>
                        </div>
                        <button onClick={onClose} className="text-white/40 hover:text-white transition ml-4">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        {/* Cover art */}
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/10 bg-white/5 flex-shrink-0">
                                {preview
                                    ? <img src={preview} alt="Cover" className="w-full h-full object-cover" />
                                    : <div className="w-full h-full flex items-center justify-center text-3xl text-white/20">💿</div>
                                }
                            </div>
                            <label className="cursor-pointer px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 text-white text-xs font-medium transition">
                                {preview ? 'Change Cover' : 'Add Cover Art'}
                                <input type="file" accept="image/*" className="hidden" onChange={handleCover} />
                            </label>
                        </div>

                        <div>
                            <label className="block text-xs text-white/50 font-semibold uppercase tracking-wider mb-1.5">Album Title *</label>
                            <input type="text" value={data.title} onChange={e => setData('title', e.target.value)}
                                placeholder="e.g. Ukuu wa Mungu"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition placeholder-white/20"
                            />
                            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs text-white/50 font-semibold uppercase tracking-wider mb-1.5">Year</label>
                                <input type="number" value={data.year} onChange={e => setData('year', e.target.value)}
                                    min="1900" max={new Date().getFullYear() + 1}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-white/50 font-semibold uppercase tracking-wider mb-1.5">Genre</label>
                                <input type="text" value={data.genre} onChange={e => setData('genre', e.target.value)}
                                    placeholder="e.g. Gospel"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition placeholder-white/20"
                                />
                            </div>
                        </div>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <div
                                onClick={() => setData('is_premium', !data.is_premium)}
                                className={`w-10 h-5 rounded-full border transition-all ${data.is_premium ? 'bg-amber-500 border-amber-500' : 'bg-white/10 border-white/20'} relative`}
                            >
                                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${data.is_premium ? 'translate-x-5' : 'translate-x-0.5'}`} />
                            </div>
                            <span className="text-sm text-white/70">Premium album <span className="text-amber-400">(✨ paid listeners only)</span></span>
                        </label>

                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white text-sm font-medium transition">Cancel</button>
                            <button type="submit" disabled={processing}
                                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm transition">
                                {processing ? 'Saving…' : (isEdit ? 'Save Changes' : 'Create Album')}
                            </button>
                        </div>
                    </form>
                </GlassCard>
            </div>
        </div>
    );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function ChoirManagerAlbamu({ auth, choir, albums }) {
    const [modal, setModal]       = useState(null); // null | 'create' | album object
    const { delete: destroy, processing: deleting } = useForm();

    const deleteAlbum = (album) => {
        if (! confirm(`Delete "${album.title}"? This will also remove all its tracks.`)) return;
        destroy(`/manager/albums/${album.id}`);
    };

    return (
        <ChoirManagerLayout user={auth?.user}>
            <Head title="Albamu" />
            {modal && <AlbumModal onClose={() => setModal(null)} album={modal === 'create' ? null : modal} />}

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <p className="text-xs text-blue-400 font-bold uppercase tracking-widest mb-1">Manager Portal</p>
                        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">Albamu</h2>
                        <p className="text-white/40 text-sm mt-1">{albums?.total ?? 0} albums</p>
                    </div>
                    <button
                        onClick={() => setModal('create')}
                        disabled={!choir}
                        title={!choir ? 'Create a choir profile first' : ''}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition self-start sm:self-auto"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                        Create Album
                    </button>
                </div>

                {!choir && (
                    <GlassCard className="border-amber-500/20 text-center !py-10">
                        <p className="text-white/40 mb-3">You need a choir profile before creating albums.</p>
                        <a href="/manager/choir" className="text-blue-400 hover:underline text-sm">Set up your choir →</a>
                    </GlassCard>
                )}

                {choir && albums?.data?.length === 0 && (
                    <GlassCard className="text-center !py-16 text-white/30">
                        <div className="text-5xl mb-4">💿</div>
                        <p className="text-lg">No albums yet.</p>
                        <p className="text-sm mt-2">Create your first album to start adding tracks.</p>
                    </GlassCard>
                )}

                {albums?.data?.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {albums.data.map(album => (
                            <GlassCard key={album.id} className="group !p-5 hover:border-white/20 transition-all">
                                <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-white/5 border border-white/5">
                                    {album.cover_path
                                        ? <img src={`/storage/${album.cover_path}`} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                                        : <div className="w-full h-full flex items-center justify-center text-5xl text-white/10">💿</div>
                                    }
                                    {album.is_premium && (
                                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-500/80 text-black text-[10px] font-bold">✨ Premium</span>
                                    )}
                                </div>
                                <h3 className="text-white font-bold text-base truncate">{album.title}</h3>
                                <div className="flex items-center gap-3 text-white/40 text-xs mt-1">
                                    {album.year && <span>{album.year}</span>}
                                    {album.genre && <span>· {album.genre}</span>}
                                    <span>· {album.tracks_count} track{album.tracks_count !== 1 ? 's' : ''}</span>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={() => setModal(album)}
                                        className="flex-1 py-2 rounded-lg text-xs font-semibold border border-blue-500/30 text-blue-400 hover:border-blue-500/60 hover:bg-blue-500/10 transition"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteAlbum(album)}
                                        disabled={deleting}
                                        className="flex-1 py-2 rounded-lg text-xs font-semibold border border-red-800/40 text-red-400 hover:border-red-700/60 hover:bg-red-900/20 transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                )}
            </div>
        </ChoirManagerLayout>
    );
}
