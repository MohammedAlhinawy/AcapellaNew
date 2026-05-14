import { useState, useEffect, useRef } from 'react';

export default function AudioPlayer() {
    const [track, setTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);

    useEffect(() => {
        const handlePlay = (e) => {
            setTrack(e.detail);
            setIsPlaying(true);
            setTimeout(() => {
                if (audioRef.current) {
                    audioRef.current.play().catch(console.error);
                }
            }, 50);
        };
        window.addEventListener('play-track', handlePlay);
        return () => window.removeEventListener('play-track', handlePlay);
    }, []);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setProgress(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const formatTime = (time) => {
        if (!time || isNaN(time)) return '0:00';
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!track) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 h-24 backdrop-blur-2xl bg-[#0a0a0c]/90 border-t border-white/10 flex justify-between items-center px-4 md:px-8 z-50">
            <audio 
                ref={audioRef} 
                src={track.file_path ? `/storage/${track.file_path}` : ''}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
            />

            {/* Track Info */}
            <div className="flex items-center gap-4 w-1/4 min-w-[200px]">
                <div className="w-14 h-14 rounded-lg bg-gray-800 border border-white/5 overflow-hidden flex-shrink-0">
                    <img src={track.album?.cover_path ? `/storage/${track.album?.cover_path}` : 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=100&h=100&fit=crop'} alt="Album Cover" className="w-full h-full object-cover" />
                </div>
                <div className="overflow-hidden">
                    <h4 className="text-sm font-bold text-white truncate">{track.title}</h4>
                    <p className="text-xs text-white/50 truncate">{typeof track.choir === 'object' ? track.choir?.name : track.choir}</p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center justify-center w-2/4 max-w-[600px] gap-2">
                <div className="flex items-center gap-6">
                    <button onClick={togglePlay} className="w-10 h-10 rounded-full bg-amber-500 text-black flex items-center justify-center hover:scale-105 transition shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                        {isPlaying ? (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                        ) : (
                            <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        )}
                    </button>
                </div>
                
                <div className="flex items-center gap-3 w-full text-xs font-mono text-white/50">
                    <span className="w-8 text-right">{formatTime(progress)}</span>
                    <div 
                        className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden cursor-pointer group"
                        onClick={(e) => {
                            if (!audioRef.current) return;
                            const rect = e.currentTarget.getBoundingClientRect();
                            const pos = (e.clientX - rect.left) / rect.width;
                            audioRef.current.currentTime = pos * duration;
                        }}
                    >
                        <div className="h-full bg-gradient-to-r from-amber-500 to-amber-300 relative" style={{ width: `${(progress / duration) * 100}%` }}></div>
                    </div>
                    <span className="w-8">{formatTime(duration)}</span>
                </div>
            </div>

            {/* Extra Controls */}
            <div className="flex items-center justify-end w-1/4 gap-4">
                <button 
                    onClick={() => {
                        if (audioRef.current) audioRef.current.pause();
                        setTrack(null);
                        setIsPlaying(false);
                    }} 
                    className="p-2 text-white/40 hover:text-red-400 transition rounded-full hover:bg-white/5"
                    title="Close Player"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
        </div>
    );
}
