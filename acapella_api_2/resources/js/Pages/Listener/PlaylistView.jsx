import { useState, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import playlistService from '../../Services/playlistService';
import apiService from '../../Services/apiService';
import MainLayout from '../../Layout/MainLayout';
import { toast } from '../../Components/ToastContainer';
import SheetTrackDropdown from '../../Components/SheetTrackDropdown';
import CustomAlertDialog from '../../Components/CustomAlertDialog';
import '../../../css/listener.css';
import { FaPlay, FaPause } from 'react-icons/fa6';
import { useAudio } from '../../Context/AudioContext';
import useTranslation from '../../hooks/useTranslation';

export default function PlaylistView() {
    const { isPlaying, togglePlay, playAllTracks, currentTrack } = useAudio();
    const { t } = useTranslation();

    const { props } = usePage();
    // eslint-disable-next-line react/prop-types
    const playlistId = props.playlistId;
    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeMenu, setActiveMenu] = useState(null);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

    // Premium gate — playlists are a premium feature
    useEffect(() => {
        const checkPremium = async () => {
            try {
                const response = await apiService.get('/users/me');
                if (!response.data?.data?.is_premium) {
                    toast.error(t('playlist_view.premium_feature'));
                    router.visit('/payments?plan=monthly');
                }
            } catch {
                router.visit('/payments?plan=monthly');
            }
        };
        checkPremium();
    }, [t]);

    const fetchPlaylist = async () => {
        try {
            const response = await playlistService.getPlaylist(playlistId);
            const data = response.data || response;
            setPlaylist(data);
        } catch (error) {
            console.error('Error fetching playlist:', error);
            toast.error(t('playlist_view.failed_to_load'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (playlistId) {
            fetchPlaylist();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playlistId]);

    const handleTrackClick = (trackId) => {
        router.get(`/play-track/${trackId}`);
    };

    const handleDeletePlaylist = () => {
        setIsDeleteAlertOpen(true);
    };

    const confirmDeletePlaylist = async () => {
        try {
            await playlistService.deletePlaylist(playlistId);
            toast.success(t('playlist_view.deleted'));
            router.get('/library');
        } catch (error) {
            console.error('Error deleting playlist:', error);
            toast.error(t('playlist_view.failed_to_delete'));
        }
    };


    if (loading) {
        return (
            <MainLayout>
                <div className="listener-page">
                    <div className="loading-state">{t('playlist_view.loading')}</div>
                </div>
            </MainLayout>
        );
    }

    if (!playlist) {
        return (
            <MainLayout>
                <div className="listener-page">
                    <div className="empty-state">{t('playlist_view.not_found')}</div>
                </div>
            </MainLayout>
        );
    }

    const tracks = playlist.tracks || [];
    const isPlaylistTrackCurrent = currentTrack && tracks.some(t => t.id === currentTrack.id);

    const handlePlayPlaylist = () => {
        if (isPlaylistTrackCurrent) {
            togglePlay();
        } else if (tracks.length > 0) {
            playAllTracks(tracks);
        } else {
            toast.error(t('playlist_view.empty'));
        }
    };

    return (
        <MainLayout>
            <div className="listener-page">
                <div className="album-header">
                    <div className="album-cover-large">
                        {playlist.cover_image ? (
                            <img src={playlist.cover_image} alt={playlist.name} className="album-cover-image" />
                        ) : (
                            <span>{playlist.name?.charAt(0).toUpperCase() || 'P'}</span>
                        )}
                    </div>
                    <div className="album-info">
                        <h1 className="album-title">{playlist.name}</h1>
                        {playlist.description && (
                            <p className="album-year">{playlist.description}</p>
                        )}
                        <p className="album-year">{t('playlist_view.label')} • {tracks.length} {t('playlist_view.songs')}</p>
                        <button
                            onClick={handleDeletePlaylist}
                            style={{
                                marginTop: '12px',
                                background: 'transparent',
                                color: '#ff6b6b',
                                border: '1px solid #ff6b6b',
                                padding: '6px 14px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                            }}
                        >
                            {t('playlist_view.delete')}
                        </button>

                        <CustomAlertDialog
                            isOpen={isDeleteAlertOpen}
                            onClose={() => setIsDeleteAlertOpen(false)}
                            onConfirm={confirmDeletePlaylist}
                            title={t('playlist_view.delete_confirm_title')}
                            message={t('playlist_view.delete_confirm_message')}
                            confirmText={t('playlist_view.delete_confirm')}
                            cancelText={t('common.cancel')}
                            type="danger"
                        />
                    </div>

                    <div className='album-controls'>
                        <button
                            className='album-play-button'
                            onClick={handlePlayPlaylist}
                        >
                            {isPlaying && isPlaylistTrackCurrent ? <FaPause /> : <FaPlay />}
                        </button>
                    </div>
                </div>

                <div className="album-tracks">
                    <div className="track-list">
                        {tracks.length > 0 ? (
                            tracks.map((track) => (
                                <div key={track.id} className="track-item" onClick={() => handleTrackClick(track.id)}>
                                    <div className="track-cover">
                                        {track.cover_path ? (
                                            <img src={track.cover_path} alt={track.title} className="track-cover-image" />
                                        ) : (
                                            <div className="track-cover-placeholder">
                                                <span>🎵</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="track-info">
                                        <span className="track-name">{track?.title || t('play_track.unknown_track')}</span>
                                        <span className="track-album">
                                            {track?.album?.title || t('album.unknown_album')} • <span className="track-duration">{track?.duration_label || '0:00'}</span>
                                        </span>
                                    </div>

                                    {track?.is_premium && (
                                        <span className="premium-badge">{t('album.premium')}</span>
                                    )}

                                    <SheetTrackDropdown
                                        track={track}
                                        activeMenu={activeMenu}
                                        setActiveMenu={setActiveMenu}
                                        queue={[]}
                                        onUnlikeSuccess={undefined}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <p>{t('playlist_view.no_tracks')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
