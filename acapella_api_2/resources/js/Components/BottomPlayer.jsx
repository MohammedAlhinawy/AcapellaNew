import { useAudio } from '../Context/AudioContext';
import { usePage, router } from '@inertiajs/react';
import { FaPlay, FaPause } from 'react-icons/fa6';
import '../../css/listener.css';
import useTranslation from '../hooks/useTranslation';

export default function BottomPlayer() {
    const { t } = useTranslation();
    const { currentTrack, isPlaying, togglePlay, stopTrack } = useAudio();
    const { component } = usePage();

    // Don't show bottom player on PlayTrack page
    if (!currentTrack || component === 'Listener/PlayTrack' || component === 'PlayTrack') {
        return null;
    }

    const handleTrackClick = () => {
        router.get(`/play-track/${currentTrack.id}`);
    };

    return (
        <div className="bottom-player">
            <div className="bottom-player-content">
                <div className="bottom-player-track-info" onClick={handleTrackClick} style={{ flex: 1 }}>
                    <div className="bottom-player-cover">
                        {currentTrack.cover_path ? (
                            <img src={currentTrack.cover_path} alt={currentTrack.title} className="bottom-player-image" />
                        ) : (
                            <div className="bottom-player-placeholder">
                                <span>🎵</span>
                            </div>
                        )}
                    </div>
                    <div className="bottom-player-details">
                        <h4 className="bottom-player-title">{currentTrack.title || t('common.unknown_track')}</h4>
                        <p className="bottom-player-subtitle">{currentTrack.duration_label || '0:00'}</p>
                    </div>
                </div>

                <div className="bottom-player-controls">
                    <button className="bottom-player-button" onClick={togglePlay}>
                        {isPlaying ? <FaPause /> : <FaPlay />}
                    </button>
                    <button className="bottom-player-close" onClick={stopTrack}>
                        ✕
                    </button>
                </div>
            </div>
        </div>
    );
}
