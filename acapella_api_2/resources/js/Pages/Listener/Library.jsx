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

export default function Library() {
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
                toast.error('Failed to load liked songs');
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
                toast.error('Failed to load playlists');
            } finally {
                setLoading(false);
            }
        };

        if (activeTab === 'liked') {
            fetchLikedTracks();
        } else {
            fetchPlaylists();
        }
    }, [activeTab]);

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
            toast.success('Playlist created');
            const response = await playlistService.getPlaylists();
            setPlaylists(response.data || response);
        } catch (error) {
            console.error('Error creating playlist:', error);
            toast.error('Failed to create playlist');
        }
    };

    return (
        <MainLayout>
            <div className="listener-page">
                <div className="listener-header">
                    <h1 className="listener-header h1">Your Library</h1>
                    <p className="listener-header p">All your liked songs and playlists in one place</p>
                </div>

                <div className="library-tabs">
                    <button 
                        className={`library-tab ${activeTab === 'liked' ? 'active' : ''}`}
                        onClick={() => setActiveTab('liked')}
                    >
                        Liked
                    </button>
                    <button 
                        className={`library-tab ${activeTab === 'playlist' ? 'active' : ''}`}
                        onClick={() => setActiveTab('playlist')}
                    >
                        PlayList
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
                                    {activeTab === 'liked' ? 'Liked Songs are Premium' : 'Playlists are Premium'}
                                </h2>
                                <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: '480px', margin: '0 auto 24px' }}>
                                    Upgrade to Premium to {activeTab === 'liked' ? 'like songs and access your liked library' : 'create and manage personal playlists'}, download tracks, and enjoy ad-free background play.
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
                                    ✦ Upgrade to Premium
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
                                    ☕ Buy Us a Coffee
                                </button>
                            </div>
                        </div>
                    ) : activeTab === 'liked' ? (
                        <div className="section">
                            <h2 className="section-title">Liked Songs</h2>
                            <div className="track-list">
                                {loading ? (
                                    <div className="loading-state">Loading liked songs...</div>
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
                                                <span className="track-name">{track?.title || 'Unknown Track'}</span>
                                                <span className="track-album">{track?.album?.title || 'Unknown Album'} • <span className="track-duration">{track?.duration_label || '0:00'}</span></span>
                                            </div>
                                            
                                            {track?.is_premium && (
                                                <span className="premium-badge">Premium</span>
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
                                        <p>No liked songs yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="section">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <h2 className="section-title" style={{ margin: 0 }}>Your Playlists</h2>
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
                                    + New Playlist
                                </button>

                                <CustomInputAlert
                                    isOpen={isCreatePlaylistOpen}
                                    onClose={() => setIsCreatePlaylistOpen(false)}
                                    onConfirm={confirmCreatePlaylist}
                                    title="Create Playlist"
                                    message="Enter a name for your new playlist:"
                                    placeholder="My Awesome Playlist"
                                    confirmText="Create"
                                    cancelText="Cancel"
                                    type="primary"
                                />
                            </div>
                            <div className="track-list">
                                {loading ? (
                                    <div className="loading-state">Loading playlists...</div>
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
                                                <span className="track-duration">{playlist.tracks_count || 0} tracks</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="empty-state">
                                        <p>No playlists yet</p>
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
