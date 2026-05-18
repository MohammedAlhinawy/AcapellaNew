import { useState, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import { HiBadgeCheck } from 'react-icons/hi';
import MainLayout from '../../Layout/MainLayout';
import choirService from '../../Services/choirService';
import albumService from '../../Services/albumService';
import trackService from '../../Services/trackService';
import { toast } from '../../Components/ToastContainer';
import SheetTrackDropdown from '../../Components/SheetTrackDropdown';
import '../../../css/listener.css';

export default function ChoirView() {
    const { props } = usePage();
    const [choir, setChoir] = useState(null);
    const [albums, setAlbums] = useState([]);
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeMenu, setActiveMenu] = useState(null);

    const handleTrackClick = (trackId) => {
        router.get(`/play-track/${trackId}`);
    };

    const handleAlbumClick = (albumId) => {
        router.get(`/album/${albumId}`);
    };

    useEffect(() => {
        // eslint-disable-next-line react/prop-types
        const choirId = props.choirId;

        const fetchChoirData = async () => {
            try {
                const [choirResponse, albumsResponse, tracksResponse] = await Promise.all([
                    choirService.getChoir(choirId),
                    albumService.getAlbums({ choir_id: choirId }),
                    trackService.getTracks({ choir_id: choirId })
                ]);
                
                const choirData = choirResponse.data || choirResponse;
                
                setChoir(choirData);
                setAlbums(albumsResponse.data || albumsResponse);
                setTracks(tracksResponse.data || tracksResponse);
            } catch (error) {
                console.error('Error fetching choir data:', error);
                toast.error('Failed to load choir');
            } finally {
                setLoading(false);
            }
        };

        if (choirId) {
            fetchChoirData();
        }
        // eslint-disable-next-line react/prop-types
    }, [props.choirId]);

    if (loading) {
        return (
            <MainLayout>
                <div className="listener-page">
                    <div className="loading-state">Loading choir...</div>
                </div>
            </MainLayout>
        );
    }

    if (!choir) {
        return (
            <MainLayout>
                <div className="listener-page">
                    <div className="empty-state">
                        <p>Choir not found</p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="listener-page">
                <div className="choir-header">
                    <div className="choir-cover">
                        <div className="choir-avatar">
                            {choir.image_path ? (
                                <img src={choir.image_path} alt={choir.name} className="choir-avatar-image" />
                            ) : (
                                <span>{choir.name?.charAt(0) || 'C'}</span>
                            )}
                        </div>
                        {choir.is_verified && (
                            <span className="verified-badge"><HiBadgeCheck size={36}/></span>
                        )}
                    </div>
                    <div className="choir-info">
                        <div className="choir-name">
                            <h1>{choir.name}</h1>
                        </div>
                        <p className="choir-location">{choir.location || 'Unknown Location'}</p>
                        <p className="choir-bio">{choir.description || 'No description available'}</p>
                    </div>
                </div>

                <div className="choir-content">
                    <div className="section">
                        <h2 className="section-title">Albums</h2>
                        <div className="card-grid">
                            {albums.length > 0 ? (
                                albums.map((album) => (
                                    <div key={album.id} className="explore-card" onClick={() => handleAlbumClick(album.id)}>
                                        <div className="explore-card-content">
                                            <div className="explore-card-cover">
                                                {album.cover_path ? (
                                                    <img src={album.cover_path} alt={album.title} className="explore-card-image" />
                                                ) : (
                                                    <div className="explore-card-placeholder album">
                                                        <span>{album.title?.charAt(0) || 'A'}</span>
                                                    </div>
                                                )}
                                                {album.is_premium && <span className="explore-card-badge premium">Premium</span>}
                                            </div>
                                            <div className="explore-card-info">
                                                <h3 className="explore-card-title">{album.title}</h3>
                                                <p className="explore-card-subtitle">{album.year || '2024'} • {album.genre || 'Unknown'}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state">
                                    <p>No albums available</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="section track">
                        <h2 className="section-title">Top Tracks</h2>
                        <div className="track-list">
                            {tracks.length > 0 ? (
                                tracks.map((track, index) => (
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
                                        <span className="track-number" style={{ display: 'none' }}>{index + 1}</span>
                                        <div className="track-info">
                                            <span className="track-name">{track?.title || 'Unknown Track'}</span>
                                            <span className="track-album">{track.album?.title || 'Unknown Album'} • <span className="track-duration">{track?.duration_label || '0:00'}</span></span>
                                        </div>
                                        
                                        {track?.is_premium && (
                                            <span className="premium-badge">Premium</span>
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
                                    <p>No tracks available</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
