import { useState, useEffect, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';
import MainLayout from '../../Layout/MainLayout';
import managerService from '../../Services/managerService';
import uploadService from '../../Services/uploadService';
import { toast } from '../../Components/ToastContainer';
import EditTrackDialog from '../../Components/EditTrackDialog';
import EditTrackDraggableBox from '../../Components/EditTrackDraggableBox';
import '../../../css/manager.css';
import useTranslation from '../../hooks/useTranslation';

export default function AlbumTracks() {
    const { t } = useTranslation();
    const { props } = usePage();
    // eslint-disable-next-line react/prop-types
    const albumId = props.album_id || null;
    // eslint-disable-next-line react/prop-types
    const choirId = props.choir_id || null;
    
    const [album, setAlbum] = useState({});
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [playingTrackId, setPlayingTrackId] = useState(null);
    const [isEditTrackDialogOpen, setIsEditTrackDialogOpen] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!albumId) return;
            
            try {
                // Fetch specific album by ID
                const albumResponse = await managerService.getAlbumById(albumId);
                const tracksData = await managerService.getMyTracks(albumId);
                
                const tracksArray = Array.isArray(tracksData) ? tracksData : [];
                
                setAlbum(albumResponse || {});
                setTracks(tracksArray);
            } catch (error) {
                console.error('Error fetching album data:', error);
                setAlbum({});
                setTracks([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [albumId, choirId]);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Cleanup audio when component unmounts
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const handlePlayTrack = (track) => {
        if (playingTrackId === track.id) {
            // Pause current track
            if (audioRef.current) {
                audioRef.current.pause();
            }
            setPlayingTrackId(null);
        } else {
            // Play new track
            if (audioRef.current) {
                audioRef.current.pause();
            }
            const audio = new Audio(track.file_path);
            audioRef.current = audio;
            audio.play();
            setPlayingTrackId(track.id);
            
            audio.addEventListener('ended', () => {
                setPlayingTrackId(null);
            });
        }
    };

    const handleEditTrack = (track) => {
        setSelectedTrack(track);
        setIsEditTrackDialogOpen(true);
    };

    const handleCloseEditTrackDialog = () => {
        setSelectedTrack(null);
        setIsEditTrackDialogOpen(false);
    };

    const handleUpdateTrack = async (data) => {
        try {
            if (data.audio_file instanceof File) {
                const formData = new FormData();
                formData.append('title', data.title);
                formData.append('track_number', data.track_number || 1);
                formData.append('file_path', data.audio_file);
                formData.append('duration_sec', data.duration_sec || 0);
                
                await uploadService.updateTrack(selectedTrack.id, formData);
            } else {
                const trackData = {
                    title: data.title,
                    track_number: data.track_number,
                };
                await managerService.updateTrack(selectedTrack.id, trackData);
            }
            
            handleCloseEditTrackDialog();
            toast.success(t('manager.track_updated_success'));
            
            // Refresh tracks
            const tracksData = await managerService.getMyTracks(albumId);
            const tracksArray = Array.isArray(tracksData) ? tracksData : [];
            setTracks(tracksArray);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 
                                error.response?.data?.errors?.title?.[0] ||
                                error.response?.data?.errors?.audio_file?.[0] ||
                                error.response?.data?.errors?.file_path?.[0] ||
                                'Failed to update track';
            toast.error(errorMessage);
        }
    };

    return (
        <>
        <MainLayout>
            <div className="manager-page">
                <div className="manager-container">
                    {/* Header */}
                    <div className="manager-header">
                        <Link 
                            href={`/manager/choirs/${choirId}/content`} 
                            className="manager-back-link"
                        >
                            ← {t('manager.back_to_content')}
                        </Link>
                        <h1>{album.title || 'Album'} - {t('manager.tracks')}</h1>
                        <p>{t('manager.manage_tracks_album')}</p>
                    </div>

                    {/* Album Info */}
                    <div className="manager-album-info" style={{ marginBottom: 'var(--spacing-2xl)' }}>
                        <div className='manager-album-cover-large-container'>
                            <div className="manager-album-cover-large">
                                {album.cover_path ? (
                                    <img
                                        src={album.cover_path}
                                        alt={album.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    album.title?.charAt(0).toUpperCase() || 'A'
                                )}
                            </div>
                        </div>
                        <div className="manager-album-details">
                            <h2 className="manager-album-title-large">{album.title}</h2>
                            <p className="manager-album-year">{album.year}</p>
                            {album.genre && (
                                <p className="manager-album-genre">{album.genre}</p>
                            )}
                            {album.is_premium && (
                                <span className="manager-album-badge">Premium</span>
                            )}
                            <div className="manager-stats">
                                <div className="manager-stat-card">
                                    <span className="manager-stat-icon">🎵</span>
                                    <div>
                                        <div className="manager-stat-value green">{loading ? '—' : tracks.length}</div>
                                        <div className="manager-stat-label">{t('manager.tracks')}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tracks Section */}
                    <div>
                        <div className="manager-section-header">
                            <h2>{t('dialog.all_tracks')}</h2>
                            <Link 
                                href={`/manager/choirs/${choirId}/content`}
                                className="manager-primary-button"
                            >
                                + {t('manager.add_track')}
                            </Link>
                        </div>

                        {loading ? (
                            <div className="manager-empty-state">
                                <p>{t('manager.loading')}</p>
                            </div>
                        ) : tracks.length === 0 ? (
                            <div className="manager-empty-state">
                                <div className="manager-empty-icon">🎵</div>
                                <h3 className="manager-empty-title">{t('manager.no_tracks_yet')}</h3>
                                <p className="manager-empty-description">
                                    {t('manager.no_tracks_album_yet')}
                                </p>
                                <Link 
                                    href={`/manager/choirs/${choirId}/content`}
                                    className="manager-primary-button"
                                >
                                    {t('manager.add_first_track')}
                                </Link>
                            </div>
                        ) : (
                            <div className="manager-tracks-list">
                                {tracks.map((track) => (
                                    <div key={track.id} className="manager-track-card">
                                        <div className="manager-track-cover">
                                            {track.cover_path ? (
                                                <img
                                                    src={track.cover_path}
                                                    alt={track.title}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <div className="manager-track-cover-fallback">
                                                    {track.title?.charAt(0).toUpperCase() || 'T'}
                                                </div>
                                            )}
                                        </div>
                                        <div className="manager-track-details">
                                            <div className="manager-track-header">
                                                <div className="manager-track-number-badge">{track.track_number}</div>
                                                <h3 className="manager-track-title">{track.title}</h3>
                                            </div>
                                            <div className="manager-track-meta">
                                                <span className="manager-track-duration">{track.duration_label}</span>
                                                {track.is_premium && (
                                                    <span className="manager-track-badge">Premium</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="manager-track-actions">
                                            <button 
                                                className="manager-track-play-button"
                                                onClick={() => handlePlayTrack(track)}
                                            >
                                                {playingTrackId === track.id ? '⏸' : '▶'}
                                            </button>
                                            <button 
                                                className="manager-track-edit-button"
                                                onClick={() => handleEditTrack(track)}
                                            >
                                                {t('manager.edit')}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            </MainLayout>

            {/* Edit Track Dialog */}
            {isMobile ? (
                <EditTrackDraggableBox
                    isOpen={isEditTrackDialogOpen}
                    onClose={handleCloseEditTrackDialog}
                    onSave={handleUpdateTrack}
                    track={selectedTrack}
                />
            ) : (
                <EditTrackDialog
                    isOpen={isEditTrackDialogOpen}
                    onClose={handleCloseEditTrackDialog}
                    onSave={handleUpdateTrack}
                    track={selectedTrack}
                />
            )}
        </>
    );
}
