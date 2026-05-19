import { useState, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import PropTypes from 'prop-types';
import albumService from '../../Services/albumService';
import trackService from '../../Services/trackService';
import '../../../css/listener.css';
import MainLayout from '../../Layout/MainLayout';
import SheetTrackDropdown from '../../Components/SheetTrackDropdown';
import { FaPlay, FaPause } from 'react-icons/fa6';
import { useAudio } from '../../Context/AudioContext';
import useTranslation from '../../hooks/useTranslation';

export default function AlbumView({ album, tracks }) {
    const { isPlaying, togglePlay, playAllTracks, currentTrack } = useAudio();
    const { t } = useTranslation();

    const { props } = usePage();
    const [albumData, setAlbumData] = useState(album);
    const [tracksData, setTracksData] = useState(tracks);
    const [loading, setLoading] = useState(!album || !tracks);
    const [activeMenu, setActiveMenu] = useState(null);

    const isAlbumTrackCurrent = currentTrack && tracksData?.some(t => t.id === currentTrack.id);

    const handlePlayAlbum = () => {
        if (isAlbumTrackCurrent) {
            togglePlay();
        } else if (tracksData && tracksData.length > 0) {
            playAllTracks(tracksData);
        }
    };

    const handleTrackClick = (trackId) => {
        router.get(`/play-track/${trackId}`);
    };

    useEffect(() => {
        if (!album || !tracks) {
            const fetchData = async () => {
                try {
                    // eslint-disable-next-line react/prop-types
                    const albumId = props.albumId;
                    
                    if (albumId) {
                        const albumResponse = await albumService.getAlbum(albumId);
                        const albumData = albumResponse.data || albumResponse;
                        setAlbumData(albumData);
                        
                        const tracksResponse = await trackService.getTracks({ album_id: albumId });
                        const tracksData = tracksResponse.data || tracksResponse;
                        setTracksData(tracksData);
                    } else {
                        console.warn('No albumId provided in props');
                    }
                } catch (error) {
                    console.error('Error fetching album data:', error);
                } finally {
                    setLoading(false);
                }
            };
            
            fetchData();
        }
    }, [album, tracks, props.albumId]); // eslint-disable-line react/prop-types

    if (loading) {
        return (
            <div className="listener-page">
                <div className="loading-state">{t('album.loading')}</div>
            </div>
        );
    }

    return (
        <MainLayout>
            <div className="listener-page">
                <div className="album-header">
                    <div className="album-cover-large">
                        {albumData?.cover_path ? (
                            <img src={albumData.cover_path} alt={albumData.title} className="album-cover-image" />
                        ) : (
                            <span>{albumData?.title?.charAt(0) || 'A'}</span>
                        )}
                    </div>
                    <div className="album-info">
                        <h1 className="album-title">{albumData?.title || t('album.album_name')}</h1>
                        <p className="album-year">{t('album.playlist')} • {albumData?.year || '2024'}</p>
                        <p className="album-year">{tracksData?.length || 0} {t('album.songs')}</p>
                        {/* Choir Description */}
                    </div>
                    <div className='album-controls'>
                        <button
                            className='album-play-button'
                            onClick={handlePlayAlbum}
                        >
                            {isPlaying && isAlbumTrackCurrent ? <FaPause /> : <FaPlay />}
                        </button>
                    </div>
                </div>

                <div className="album-tracks">
                    <div className="track-list">
                        {tracksData?.map((track, index) => (
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
                                    <span className="track-name">{track?.title || t('album.unknown_track')}</span>
                                    <span className="track-album">{albumData?.title || t('album.unknown_album')} • <span className="track-duration" >{track?.duration_label || '0:00'}</span></span>
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
                        ))}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

AlbumView.propTypes = {
    album: PropTypes.object,
    tracks: PropTypes.array,
};
