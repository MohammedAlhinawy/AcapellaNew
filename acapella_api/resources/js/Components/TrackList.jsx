export default function TrackList({ tracks }) {
    return (
        <div className="w-full">
            <div className="flex items-center px-4 py-2 text-xs font-medium text-white/40 border-b border-white/5 mb-2 uppercase tracking-wider">
                <div className="w-10 text-center">#</div>
                <div className="flex-1">Title</div>
                <div className="w-20 text-center">Premium</div>
                <div className="w-24 text-right">Duration</div>
            </div>

            <div className="flex flex-col">
                {tracks.map((track, i) => (
                    <div 
                        key={track.id} 
                        onClick={() => window.dispatchEvent(new CustomEvent('play-track', { detail: track }))}
                        className="group flex items-center px-4 py-3 hover:bg-white/[0.03] rounded-lg transition cursor-pointer"
                    >
                        <div className="w-10 text-center text-sm text-white/50 group-hover:hidden">
                            {i + 1}
                        </div>
                        <div className="w-10 text-center hidden group-hover:flex justify-center text-amber-500">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                        
                        <div className="flex-1 flex flex-col">
                            <span className="text-white font-medium text-sm group-hover:text-amber-400 transition-colors">{track.title}</span>
                            <span className="text-white/40 text-xs">{typeof track.choir === 'object' ? track.choir?.name : track.choir}</span>
                        </div>
                        
                        <div className="w-20 flex justify-center">
                            {(track.isPremium || track.is_premium) && (
                                <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 17a2 2 0 100-4 2 2 0 000 4zm6-9a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V10a2 2 0 012-2h1V6a5 5 0 0110 0v2h1zm-6-5a3 3 0 00-3 3v2h6V6a3 3 0 00-3-3z" />
                                </svg>
                            )}
                        </div>

                        <div className="w-24 text-right text-sm text-white/50 font-mono">
                            {track.duration_label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
