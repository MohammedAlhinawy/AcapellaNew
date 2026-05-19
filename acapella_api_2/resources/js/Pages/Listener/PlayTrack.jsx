import { useState, useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import { FaChevronDown } from 'react-icons/fa';
import { useAudio } from '../../Context/AudioContext';
import MainLayout from '../../Layout/MainLayout';
import trackService from '../../Services/trackService';
import { toast } from '../../Components/ToastContainer';
import CustomTrackPlayer from '../../Components/CustomTrackPlayer';
import SheetTrackDropdown from '../../Components/SheetTrackDropdown';
import '../../../css/listener.css';
import '../../../css/track-player.css';
import useTranslation from '../../hooks/useTranslation';

export default function PlayTrack() {
    const { props } = usePage();
    const { t } = useTranslation();
    const { currentTrack, playTrack } = useAudio();
    const [track, setTrack] = useState(null);
    const [loading, setLoading] = useState(true);
    const currentTrackIdRef = useRef(null);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('up-next');
    const [queue, setQueue] = useState([]);
    const [relatedTracks, setRelatedTracks] = useState([]);
    const [sheetLoading, setSheetLoading] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const sheetRef = useRef(null);
    const startYRef = useRef(0);
    const currentYRef = useRef(0);
    const isDraggingRef = useRef(false);

    useEffect(() => {
        // eslint-disable-next-line react/prop-types
        const trackId = props.trackId;

        const fetchTrack = async () => {
            try {
                const response = await trackService.getTrack(trackId);
                const trackData = response.data || response;
                setTrack(trackData);
                
                // Only play if this is a different track than what we've already loaded
                if (currentTrackIdRef.current !== trackData.id) {
                    playTrack(trackData);
                    currentTrackIdRef.current = trackData.id;
                }
            } catch {
                toast.error(t('play_track.failed_to_load'));
            } finally {
                setLoading(false);
            }
        };

        if (trackId) {
            fetchTrack();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps, react/prop-types
    }, [props.trackId]);

    // Sync local track state with AudioContext currentTrack
    useEffect(() => {
        if (currentTrack && currentTrack.id !== currentTrackIdRef.current) {
            setTrack(currentTrack);
            currentTrackIdRef.current = currentTrack.id;
        }
    }, [currentTrack]);

    const handleSheetMouseDown = (e) => {
        startYRef.current = e.clientY;
        currentYRef.current = e.clientY;
        isDraggingRef.current = true;
    };

    const handleSheetMouseMove = (e) => {
        if (!isDraggingRef.current) return;
        const deltaY = startYRef.current - e.clientY;
        
        if (deltaY > 0) {
            setSheetOpen(true);
        } else if (deltaY < -50) {
            setSheetOpen(false);
        }
    };

    const handleSheetMouseUp = () => {
        isDraggingRef.current = false;
    };

    const toggleSheet = (tab = 'up-next') => {
        setActiveTab(tab);
        setSheetOpen(!sheetOpen);
        
        if (!sheetOpen) {
            fetchSheetData(tab);
        }
    };

    const fetchSheetData = async (tab) => {
        setSheetLoading(true);
        try {
            if (tab === 'up-next') {
                // Fetch queue from backend
                const response = await trackService.getQueue();
                const queueData = response.data || response;
                
                // Remove duplicates from queue (by track.id)
                const uniqueQueue = queueData.filter((queueItem, index, self) =>
                    index === self.findIndex(q => q.track.id === queueItem.track.id)
                );
                
                setQueue(uniqueQueue);
            } else if (tab === 'related' && track) {
                // Fetch related tracks
                const response = await trackService.getRelatedTracks(track.id);
                const relatedTracksData = response.data || response;
                
                // Remove duplicates from related tracks itself
                const uniqueRelatedTracks = relatedTracksData.filter((track, index, self) =>
                    index === self.findIndex(t => t.id === track.id)
                );
                
                setRelatedTracks(uniqueRelatedTracks);
            }
        } catch {
            // Backend endpoint not available yet - set empty states
            if (tab === 'up-next') {
                setQueue([]);
            } else if (tab === 'related') {
                setRelatedTracks([]);
            }
        } finally {
            setSheetLoading(false);
        }
    };

    // Live-refresh the Up Next list whenever the audio context changes the
    // queue (next track auto-advance, repeat-all repopulation, shuffle, etc.).
    useEffect(() => {
        const handleQueueUpdated = () => {
            if (sheetOpen && activeTab === 'up-next') {
                fetchSheetData('up-next');
            }
        };
        window.addEventListener('queue-updated', handleQueueUpdated);
        return () => window.removeEventListener('queue-updated', handleQueueUpdated);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sheetOpen, activeTab]);

    if (loading) {
        return (
            <MainLayout>
                <div className="listener-page">
                    <div className="loading-state">{t('play_track.loading')}</div>
                </div>
            </MainLayout>
        );
    }

    if (!track) {
        return (
            <MainLayout>
                <div className="listener-page">
                    <div className="empty-state">
                        <p>{t('play_track.not_found')}</p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <>
            <div className={`track-player ${track.is_premium ? 'premium' : ''}`}>
                <div className="track-player-nav-button">
                    <button className="track-player-nav-button-back-btn" onClick={() => window.history.back()}>
                        <FaChevronDown size={18} />
                    </button>
                    <SheetTrackDropdown 
                        track={track}
                        activeMenu={activeMenu}
                        setActiveMenu={setActiveMenu}
                        queue={queue}
                        onUnlikeSuccess={undefined}
                    />
                </div>
                <div className="track-player-cover">
                    {track.cover_path ? (
                        <img src={track.cover_path} alt={track.title} className="track-player-image" />
                    ) : (
                        <div className="track-player-placeholder">
                            <span>🎵</span>
                        </div>
                    )}
                    {track.is_premium && <span className="track-player-badge premium">{t('album.premium')}</span>}
                </div>

                <div className="track-player-info">
                    <h1 className="track-player-title">{track.title || t('play_track.unknown_track')}</h1>
                    <CustomTrackPlayer src={track.file_path} duration={track.duration_sec} />
                </div>

                <div className="track-player-controls">
                    <button className='track-player-control up-next' onClick={() => toggleSheet('up-next')}>
                        {t('play_track.up_next')}
                    </button>
                    <div className='controls-divider'></div>
                    <button className='track-player-control related' onClick={() => toggleSheet('related')}>
                        {t('play_track.related')}
                    </button>
                </div>
            </div>

            {sheetOpen && (
                <div 
                    className="draggable-sheet-overlay"
                    onClick={toggleSheet}
                >
                    <div 
                        className="draggable-sheet"
                        ref={sheetRef}
                        onMouseDown={handleSheetMouseDown}
                        onMouseMove={handleSheetMouseMove}
                        onMouseUp={handleSheetMouseUp}
                        onMouseLeave={handleSheetMouseUp}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sheet-handle"></div>
                        <div className="sheet-tabs">
                            <button 
                                className={`sheet-tab ${activeTab === 'up-next' ? 'active' : ''}`}
                                onClick={() => { setActiveTab('up-next'); fetchSheetData('up-next'); }}
                            >
                                {t('play_track.up_next')}
                            </button>
                            <button 
                                className={`sheet-tab ${activeTab === 'related' ? 'active' : ''}`}
                                onClick={() => { setActiveTab('related'); fetchSheetData('related'); }}
                            >
                                {t('play_track.related')}
                            </button>
                        </div>
                        <div className="sheet-content">
                            {sheetLoading ? (
                                <div className="sheet-loading">{t('play_track.loading_sheet')}</div>
                            ) : activeTab === 'up-next' ? (
                                queue.length > 0 ? (
                                    queue.map((queueItem) => (
                                        <div 
                                            key={queueItem.id} 
                                            className="sheet-track-item"
                                            onClick={() => { playTrack(queueItem.track); setSheetOpen(false); }}
                                        >
                                            <div className="sheet-track-cover">
                                                {queueItem.track.cover_path ? (
                                                    <img src={queueItem.track.cover_path} alt={queueItem.track.title} />
                                                ) : (
                                                    <div className="sheet-track-placeholder">
                                                        <span>🎵</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="sheet-track-info">
                                                <h4>{queueItem.track.title || t('play_track.unknown_track')}</h4>
                                                <p>{queueItem.track.duration_label || '0:00'}</p>
                                            </div>
                                            <SheetTrackDropdown 
                                                track={queueItem.track}
                                                activeMenu={activeMenu}
                                                setActiveMenu={setActiveMenu}
                                                queue={queue}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <div className="sheet-empty">{t('play_track.queue_empty')}</div>
                                )
                            ) : (
                                relatedTracks.length > 0 ? (
                                    relatedTracks.map((relatedTrack) => {
                                        // Derive a smart-recommendation reason chip
                                        let reason = null;
                                        if (track && relatedTrack.choir_id && relatedTrack.choir_id === track.choir_id) {
                                            reason = { label: t('play_track.same_artist'), color: '#9333ea' };
                                        } else if (track && relatedTrack.album_id && relatedTrack.album_id === track.album_id) {
                                            reason = { label: t('play_track.from_album'), color: '#0ea5e9' };
                                        } else if (Number(relatedTrack.score) >= 3) {
                                            reason = { label: t('play_track.you_may_like'), color: '#10b981' };
                                        } else {
                                            reason = { label: t('play_track.popular'), color: '#f59e0b' };
                                        }

                                        return (
                                        <div 
                                            key={relatedTrack.id} 
                                            className="sheet-track-item"
                                        >
                                            <div 
                                                className="sheet-track-cover"
                                                onClick={() => { playTrack(relatedTrack); setSheetOpen(false); }}
                                            >
                                                {relatedTrack.cover_path ? (
                                                    <img src={relatedTrack.cover_path} alt={relatedTrack.title} />
                                                ) : (
                                                    <div className="sheet-track-placeholder">
                                                        <span>🎵</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div 
                                                className="sheet-track-info"
                                                onClick={() => { playTrack(relatedTrack); setSheetOpen(false); }}
                                            >
                                                <h4>{relatedTrack.title || t('play_track.unknown_track')}</h4>
                                                <p style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                                                    <span
                                                        className="recommendation-chip"
                                                        style={{
                                                            background: `${reason.color}22`,
                                                            color: reason.color,
                                                            fontSize: '0.7rem',
                                                            fontWeight: 600,
                                                            padding: '2px 8px',
                                                            borderRadius: 999,
                                                            whiteSpace: 'nowrap',
                                                        }}
                                                    >
                                                        {reason.label}
                                                    </span>
                                                    <span>
                                                        {relatedTrack.choir?.name || relatedTrack.album?.title || 'Unknown'} • {relatedTrack.duration_label || '0:00'}
                                                    </span>
                                                </p>
                                            </div>
                                            <SheetTrackDropdown 
                                                track={relatedTrack}
                                                activeMenu={activeMenu}
                                                setActiveMenu={setActiveMenu}
                                                queue={queue}
                                                onUnlikeSuccess={undefined}
                                            />
                                        </div>
                                        );
                                    })
                                ) : (
                                    <div className="sheet-empty">{t('play_track.no_related')}</div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
