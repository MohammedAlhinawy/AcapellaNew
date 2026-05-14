import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import ChoirManagerLayout from '../../Layouts/ChoirManagerLayout';
import GlassCard from '../../Components/GlassCard';

function TrackModal({ onClose, track, albums }) {
    const isEdit = Boolean(track);
    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: track?.title ?? '',
        album_id: track?.album_id ?? (albums[0]?.id ?? ''),
        is_premium: track?.is_premium ?? false,
        track_number: track?.track_number ?? '',
        audio: null,
        cover: null,
    });
    const [audioName, setAudioName] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        const opts = { forceFormData: true, onSuccess: () => { reset(); onClose(); } };
        isEdit ? put(`/manager/tracks/${track.id}`, opts) : post('/manager/tracks', opts);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <GlassCard className="!p-8 border-purple-500/20">
                    <div className="flex items-start justify-between mb-6">
                        <h3 className="text-xl font-bold text-white">{isEdit ? 'Edit Track' : 'Upload Track'}</h3>
                        <button onClick={onClose} className="text-white/40 hover:text-white transition ml-4">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                    </div>
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-xs text-white/50 uppercase tracking-wider mb-1.5">Title *</label>
                            <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} placeholder="e.g. Mwanakondoo"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition placeholder-white/20" />
                            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
                        </div>
                        <div>
                            <label className="block text-xs text-white/50 uppercase tracking-wider mb-1.5">Album *</label>
                            <select value={data.album_id} onChange={e => setData('album_id', e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition">
                                {albums.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
                            </select>
                            {errors.album_id && <p className="text-red-400 text-xs mt-1">{errors.album_id}</p>}
                        </div>
                        <div>
                            <label className="block text-xs text-white/50 uppercase tracking-wider mb-1.5">Track Number</label>
                            <input type="number" value={data.track_number} onChange={e => setData('track_number', e.target.value)} min="1" placeholder="e.g. 1"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition placeholder-white/20" />
                        </div>
                        {!isEdit && (
                            <div>
                                <label className="block text-xs text-white/50 uppercase tracking-wider mb-1.5">Audio File * (MP3, M4A — max 50 MB)</label>
                                <label className="flex items-center gap-3 cursor-pointer w-full bg-white/5 border border-dashed border-white/20 hover:border-purple-500/50 rounded-xl px-4 py-4 transition">
                                    <span className="text-2xl">🎵</span>
                                    <span className="text-sm text-white/50 truncate">{audioName ?? 'Choose audio file'}</span>
                                    <input type="file" accept=".mp3,.m4a" className="hidden" onChange={e => { const f = e.target.files[0]; if (f) { setData('audio', f); setAudioName(f.name); }}} />
                                </label>
                                {errors.audio && <p className="text-red-400 text-xs mt-1">{errors.audio}</p>}
                            </div>
                        )}
                        <div>
                            <label className="block text-xs text-white/50 uppercase tracking-wider mb-1.5">Cover Art (optional)</label>
                            <label className="cursor-pointer px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 text-white text-xs font-medium transition inline-block">
                                Choose Image
                                <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files[0]; if (f) setData('cover', f); }} />
                            </label>
                        </div>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <div onClick={() => setData('is_premium', !data.is_premium)} className={`w-10 h-5 rounded-full border transition-all relative ${data.is_premium ? 'bg-amber-500 border-amber-500' : 'bg-white/10 border-white/20'}`}>
                                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${data.is_premium ? 'translate-x-5' : 'translate-x-0.5'}`} />
                            </div>
                            <span className="text-sm text-white/70">Premium track <span className="text-amber-400">(✨ paid only)</span></span>
                        </label>
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 text-sm font-medium transition">Cancel</button>
                            <button type="submit" disabled={processing} className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-sm transition">
                                {processing ? 'Saving…' : (isEdit ? 'Save' : 'Upload')}
                            </button>
                        </div>
                    </form>
                </GlassCard>
            </div>
        </div>
    );
}

export default function ChoirManagerNyimbo({ auth, choir, tracks, albums }) {
    const [modal, setModal] = useState(null);
    const { delete: destroy, processing: deleting } = useForm();

    const deleteTrack = (track) => {
        if (!confirm(`Delete "${track.title}"?`)) return;
        destroy(`/manager/tracks/${track.id}`);
    };

    return (
        <ChoirManagerLayout user={auth?.user}>
            <Head title="Nyimbo" />
            {modal && <TrackModal onClose={() => setModal(null)} track={modal === 'create' ? null : modal} albums={albums ?? []} />}

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <p className="text-xs text-blue-400 font-bold uppercase tracking-widest mb-1">Manager Portal</p>
                        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">Nyimbo</h2>
                        <p className="text-white/40 text-sm mt-1">{tracks?.total ?? 0} tracks</p>
                    </div>
                    <button onClick={() => setModal('create')}
                        disabled={!choir || (albums?.length ?? 0) === 0}
                        title={!choir ? 'Create a choir profile first' : (albums?.length === 0 ? 'Create an album first' : '')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition self-start sm:self-auto">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                        Upload Track
                    </button>
                </div>

                {(!choir || (albums?.length ?? 0) === 0) && (
                    <GlassCard className="border-amber-500/20 !py-10 text-center">
                        <p className="text-white/40 mb-2">{!choir ? 'Create a choir profile and at least one album first.' : 'Create at least one album before uploading tracks.'}</p>
                        <a href={!choir ? '/manager/choir' : '/manager/albums'} className="text-blue-400 hover:underline text-sm">{!choir ? 'Set up choir →' : 'Create album →'}</a>
                    </GlassCard>
                )}

                {(tracks?.data?.length ?? 0) === 0 && choir && (albums?.length ?? 0) > 0 && (
                    <GlassCard className="text-center !py-16 text-white/30">
                        <div className="text-5xl mb-4">🎵</div>
                        <p>No tracks yet. Upload your first audio file.</p>
                    </GlassCard>
                )}

                {(tracks?.data?.length ?? 0) > 0 && (
                    <GlassCard className="!p-0 overflow-hidden">
                        <div className="hidden sm:flex items-center px-6 py-3 border-b border-white/5 text-xs text-white/30 uppercase tracking-widest">
                            <div className="w-8 text-center">#</div>
                            <div className="flex-1 ml-4">Title</div>
                            <div className="w-36 text-center">Album</div>
                            <div className="w-20 text-center">Premium</div>
                            <div className="w-20 text-center">Duration</div>
                            <div className="w-28 text-right">Actions</div>
                        </div>
                        <div className="divide-y divide-white/5">
                            {tracks.data.map((track, i) => (
                                <div key={track.id} className="flex flex-col px-4 sm:px-6 py-4 hover:bg-white/[0.02] transition gap-2 border-b border-white/5">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
                                        <div className="hidden sm:flex w-8 justify-center text-white/30 text-sm">{track.track_number ?? (i + 1)}</div>
                                        <div className="flex-1 sm:ml-4 min-w-0">
                                            <p className="text-white font-medium text-sm truncate">{track.title}</p>
                                        </div>
                                        <div className="sm:w-36 text-white/40 text-xs sm:text-center">{track.album?.title ?? '—'}</div>
                                        <div className="sm:w-20 sm:text-center">
                                            {track.is_premium ? <span className="text-amber-400 text-xs font-bold">✨ Yes</span> : <span className="text-white/25 text-xs">Free</span>}
                                        </div>
                                        <div className="sm:w-20 text-white/40 text-xs font-mono sm:text-center">{track.duration_label}</div>
                                        <div className="sm:w-28 flex sm:justify-end gap-2">
                                            <button onClick={() => setModal(track)} className="text-xs text-blue-400 border border-blue-500/30 px-2.5 py-1.5 rounded-lg hover:border-blue-500/60 transition">Edit</button>
                                            <button onClick={() => deleteTrack(track)} disabled={deleting} className="text-xs text-red-400 border border-red-800/40 px-2.5 py-1.5 rounded-lg hover:border-red-700/60 transition">Delete</button>
                                        </div>
                                    </div>
                                    <div className="mt-2 pl-0 sm:pl-12">
                                        <audio controls src={`/storage/${track.file_path}`} className="w-full h-8" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                )}
            </div>
        </ChoirManagerLayout>
    );
}
