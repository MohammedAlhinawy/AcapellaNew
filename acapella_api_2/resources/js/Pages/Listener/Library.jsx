import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import MainLayout from '../../Layout/MainLayout';
import trackService from '../../Services/trackService';
import playlistService from '../../Services/playlistService';
import apiService from '../../Services/apiService';
import { toast } from '../../Components/ToastContainer';
import SheetTrackDropdown from '../../Components/SheetTrackDropdown';
import CustomInputAlert from '../../Components/CustomInputAlert';
import '../../../css/listener.css';
import useTranslation from '../../hooks/useTranslation';

export default function Library() {
    const { t } = useTranslation();
    const [likedTracks, setLikedTracks] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [activeTab, setActiveTab] = useState('liked');
    const [loading, setLoading] = useState(true);
    const [activeMenu, setActiveMenu] = useState(null);
    const [isPremium, setIsPremium] = useState(true); // assume true until checked to avoid flash
    const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await apiService.get('/users/me');
                setIsPremium(!!response.data?.data?.is_premium);
            } catch {
                setIsPremium(false);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const fetchLikedTracks = async () => {
            try {
                const response = await trackService.getTracks({ liked: true });
                const tracks = response.data || response;
                setLikedTracks(tracks);
            } catch (error) {
                console.error('Error fetching liked tracks:', error);
                toast.error(t('library.failed_to_load_liked'));
            } finally {
                setLoading(false);
            }
        };

        const fetchPlaylists = async () => {
            try {
                const response = await playlistService.getPlaylists();
                setPlaylists(response.data || response);
            } catch (error) {
                console.error('Error fetching playlists:', error);
                toast.error(t('library.failed_to_load_playlists'));
            } finally {
                setLoading(false);
            }
        };

        if (activeTab === 'liked') {
            fetchLikedTracks();
        } else {
            fetchPlaylists();
        }
    }, [activeTab, t]);

    const handleUnlikeSuccess = () => {
        console.log('Unlike success, refreshing liked tracks...');
        const refreshLikedTracks = async () => {
            try {
                const response = await trackService.getTracks({ liked: true });
                const tracks = response.data || response;
                console.log('Liked tracks refreshed:', tracks);
                setLikedTracks(tracks);
            } catch (error) {
                console.error('Error refreshing liked tracks:', error);
            }
        };
        refreshLikedTracks();
    };

    const handleCreatePlaylist = () => {
        setIsCreatePlaylistOpen(true);
    };

    const confirmCreatePlaylist = async (name) => {
        if (!name || !name.trim()) return;
        try {
            await playlistService.createPlaylist({ name: name.trim() });
            toast.success(t('library.playlist_created'));
            const response = await playlistService.getPlaylists();
            setPlaylists(response.data || response);
        } catch (error) {
            console.error('Error creating playlist:', error);
            toast.error(t('library.failed_to_create_playlist'));
        }
    };

    return (
        <MainLayout>
            <div className="listener-page">
                <div className="listener-header">
                    <h1 className="listener-header h1">{t('library.title')}</h1>
                    <p className="listener-header p">{t('library.subtitle')}</p>
                </div>

                <div className="library-tabs">
                    <button 
                        className={`library-tab ${activeTab === 'liked' ? 'active' : ''}`}
                        onClick={() => setActiveTab('liked')}
                    >
                        {t('library.liked')}
                    </button>
                    <button 
                        className={`library-tab ${activeTab === 'playlist' ? 'active' : ''}`}
                        onClick={() => setActiveTab('playlist')}
                    >
                        {t('library.playlist')}
                    </button>
                </div>

                <div className="library-content">
                    {!isPremium ? (
                        <div className="section">
                            <div
                                style={{
                                    textAlign: 'center',
                                    padding: '48px 24px',
                                    background: 'linear-gradient(135deg, rgba(184,134,11,0.18), rgba(184,134,11,0.05))',
                                    borderRadius: '16px',
                                    border: '1px solid rgba(184,134,11,0.4)',
                                }}
                            >
                                <div style={{ fontSize: '56px', marginBottom: '12px' }}>✦</div>
                                <h2 style={{ color: '#fff', marginBottom: '8px', fontSize: '1.6rem' }}>
                                    {activeTab === 'liked' ? t('library.liked_songs_premium') : t('library.playlists_premium')}
                                </h2>
                                <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: '480px', margin: '0 auto 24px' }}>
                                    {t('library.upgrade_premium_full', { action: activeTab === 'liked' ? t('library.upgrade_premium_liked') : t('library.upgrade_premium_playlist') })}
                                </p>
                                <button
                                    onClick={() => router.visit('/payments?plan=monthly')}
                                    style={{
                                        background: '#B8860B',
                                        color: '#fff',
                                        border: 'none',
                                        padding: '12px 28px',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        fontSize: '1rem',
                                        marginRight: '12px',
                                        marginBottom: '12px',
                                    }}
                                >
                                    ✦ {t('library.upgrade_premium')}
                                </button>
                                <button
                                    onClick={() => router.visit('/donate')}
                                    style={{
                                        background: 'transparent',
                                        color: '#fff',
                                        border: '1px solid rgba(255,255,255,0.4)',
                                        padding: '12px 24px',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        fontSize: '0.95rem',
                                    }}
                                >
                                    ☕ {t('library.buy_coffee')}
                                </button>
                            </div>
                        </div>
                    ) : activeTab === 'liked' ? (
                        <div className="section">
                            <h2 className="section-title">{t('library.liked_songs')}</h2>
                            <div className="track-list">
                                {loading ? (
                                    <div className="loading-state">{t('library.loading_liked')}</div>
                                ) : likedTracks.length > 0 ? (
                                    likedTracks.map((track) => (
                                        <div key={track.id} className="track-item" onClick={() => router.get(`/play-track/${track.id}`)}>
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
                                                <span className="track-name">{track?.title || t('album.unknown_track')}</span>
                                                <span className="track-album">{track?.album?.title || t('album.unknown_album')} • <span className="track-duration">{track?.duration_label || '0:00'}</span></span>
                                            </div>
                                            
                                            {track?.is_premium && (
                                                <span className="premium-badge">{t('album.premium')}</span>
                                            )}
                                            
                                            <SheetTrackDropdown 
                                                track={track}
                                                activeMenu={activeMenu}
                                                setActiveMenu={setActiveMenu}
                                                queue={[]}
                                                onUnlikeSuccess={handleUnlikeSuccess}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <div className="empty-state">
                                        <p>{t('library.no_liked_songs')}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="section">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <h2 className="section-title" style={{ margin: 0 }}>{t('library.your_playlists')}</h2>
                                <button
                                    onClick={handleCreatePlaylist}
                                    style={{
                                        background: '#B8860B',
                                        color: '#fff',
                                        border: 'none',
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        fontSize: '0.9rem',
                                    }}
                                >
                                    {t('library.new_playlist')}
                                </button>

                                <CustomInputAlert
                                    isOpen={isCreatePlaylistOpen}
                                    onClose={() => setIsCreatePlaylistOpen(false)}
                                    onConfirm={confirmCreatePlaylist}
                                    title={t('library.create_playlist')}
                                    message={t('library.playlist_name_placeholder')}
                                    placeholder={t('library.playlist_name_example')}
                                    confirmText={t('library.create')}
                                    cancelText={t('common.cancel')}
                                    type="primary"
                                />
                            </div>
                            <div className="track-list">
                                {loading ? (
                                    <div className="loading-state">{t('library.loading_playlists')}</div>
                                ) : playlists.length > 0 ? (
                                    playlists.map((playlist) => (
                                        <div
                                            key={playlist.id}
                                            className="track-item"
                                            onClick={() => router.get(`/playlist/${playlist.id}`)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className="track-cover">
                                                {playlist.cover_image ? (
                                                    <img src={playlist.cover_image} alt={playlist.name} className="track-cover-image" />
                                                ) : (
                                                    <div className="track-cover-placeholder">
                                                        <span>🎵</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="track-info">
                                                <span className="track-name">{playlist.name}</span>
                                                <span className="track-duration">{playlist.tracks_count || 0} {t('library.tracks_count')}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="empty-state">
                                        <p>{t('library.no_playlists')}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
