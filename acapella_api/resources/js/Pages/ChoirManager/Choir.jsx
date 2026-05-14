import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import ChoirManagerLayout from '../../Layouts/ChoirManagerLayout';
import GlassCard from '../../Components/GlassCard';

export default function ChoirManagerChoir({ auth, choir }) {
    const { data, setData, post, processing, errors } = useForm({
        name:     choir?.name     ?? '',
        location: choir?.location ?? '',
        bio:      choir?.bio      ?? '',
        image:    null,
        _method:  choir ? 'POST' : 'POST',  // always POST (controller checks existence)
    });

    const [preview, setPreview] = useState(
        choir?.image_path ? `/storage/${choir.image_path}` : null
    );

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setData('image', file);
        setPreview(URL.createObjectURL(file));
    };

    const submit = (e) => {
        e.preventDefault();
        post('/manager/choir', { forceFormData: true });
    };

    return (
        <ChoirManagerLayout user={auth?.user}>
            <Head title="Choir Profile" />

            <div className="max-w-2xl space-y-8">
                <div>
                    <p className="text-xs text-blue-400 font-bold uppercase tracking-widest mb-1">Manager Portal</p>
                    <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                        {choir ? 'Edit Choir Profile' : 'Create Choir Profile'}
                    </h2>
                    <p className="text-white/40 text-sm mt-1">
                        {choir ? 'Update your choir\'s public information.' : 'Set up your choir to start uploading music.'}
                    </p>
                </div>

                {choir?.is_verified && (
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <span className="text-emerald-400">✅</span>
                        <p className="text-emerald-300/90 text-sm font-medium">This choir is verified by Acapella.</p>
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    {/* Cover Image */}
                    <GlassCard>
                        <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider mb-4">Choir Image</h3>
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/10 flex-shrink-0 bg-white/5">
                                {preview ? (
                                    <img src={preview} alt="Choir" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl text-white/20">🎶</div>
                                )}
                            </div>
                            <div>
                                <label className="cursor-pointer px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-white text-sm font-medium transition inline-block">
                                    {preview ? 'Change Image' : 'Upload Image'}
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
                                </label>
                                <p className="text-white/30 text-xs mt-2">JPG, PNG or WebP · Max 4 MB</p>
                                {errors.image && <p className="text-red-400 text-xs mt-1">{errors.image}</p>}
                            </div>
                        </div>
                    </GlassCard>

                    {/* Profile Details */}
                    <GlassCard>
                        <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider mb-4">Profile Details</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs text-white/50 font-semibold uppercase tracking-wider mb-1.5">Choir Name *</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="e.g. Kwaya ya Mt. Kizito"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition placeholder-white/20"
                                />
                                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-xs text-white/50 font-semibold uppercase tracking-wider mb-1.5">Location</label>
                                <input
                                    type="text"
                                    value={data.location}
                                    onChange={e => setData('location', e.target.value)}
                                    placeholder="e.g. Dar es Salaam"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition placeholder-white/20"
                                />
                                {errors.location && <p className="text-red-400 text-xs mt-1">{errors.location}</p>}
                            </div>
                            <div>
                                <label className="block text-xs text-white/50 font-semibold uppercase tracking-wider mb-1.5">Bio</label>
                                <textarea
                                    value={data.bio}
                                    onChange={e => setData('bio', e.target.value)}
                                    rows={4}
                                    placeholder="Tell listeners about your choir — when it was founded, your mission, your music style…"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition resize-none placeholder-white/20"
                                />
                                {errors.bio && <p className="text-red-400 text-xs mt-1">{errors.bio}</p>}
                            </div>
                        </div>
                    </GlassCard>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 sm:flex-none px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-2"
                        >
                            {processing ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                    </svg>
                                    Saving…
                                </>
                            ) : (choir ? 'Save Changes' : 'Create Choir')}
                        </button>
                    </div>
                </form>
            </div>
        </ChoirManagerLayout>
    );
}
