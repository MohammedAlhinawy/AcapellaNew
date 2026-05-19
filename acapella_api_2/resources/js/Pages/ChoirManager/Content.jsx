import { useState, useEffect, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';
import MainLayout from '../../Layout/MainLayout';
import managerService from '../../Services/managerService';
import uploadService from '../../Services/uploadService';
import { toast } from '../../Components/ToastContainer';
import CreateAlbumDialog from '../../Components/CreateAlbumDialog';
import CreateAlbumDraggableBox from '../../Components/CreateAlbumDraggableBox';
import UploadTrackDialog from '../../Components/UploadTrackDialog';
import UploadTrackDraggableBox from '../../Components/UploadTrackDraggableBox';
import EditAlbumDialog from '../../Components/EditAlbumDialog';
import EditAlbumDraggableBox from '../../Components/EditAlbumDraggableBox';
import EditTrackDialog from '../../Components/EditTrackDialog';
import EditTrackDraggableBox from '../../Components/EditTrackDraggableBox';
import '../../../css/manager.css';
import useTranslation from '../../hooks/useTranslation';

export default function Content() {
    const { t } = useTranslation();
    const { props } = usePage();
    // eslint-disable-next-line react/prop-types
    const choirId = props.choir_id || null;
    
    // Extract choir_id from URL if not in props
    const pathChoirId = window.location.pathname.match(/\/manager\/choirs\/(\d+)/)?.[1];
    const finalChoirId = choirId || (pathChoirId ? parseInt(pathChoirId) : null);
    
    const [choir, setChoir] = useState({});
    const [albums, setAlbums] = useState([]);
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateAlbumDialogOpen, setIsCreateAlbumDialogOpen] = useState(false);
    const [isUploadTrackDialogOpen, setIsUploadTrackDialogOpen] = useState(false);
    const [isEditAlbumDialogOpen, setIsEditAlbumDialogOpen] = useState(false);
    const [isEditTrackDialogOpen, setIsEditTrackDialogOpen] = useState(false);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [playingTrackId, setPlayingTrackId] = useState(null);
    const audioRef = useRef(null);

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

    useEffect(() => {
        const fetchData = async () => {
            if (!finalChoirId) {
                setLoading(false);
                return;
            }
            
            try {
                const [choirData, albumsData] = await Promise.all([
                    managerService.getMyChoirs(),
                    managerService.getMyAlbums(finalChoirId),
                ]);
                
                const choirsArray = Array.isArray(choirData) ? choirData : [];
                const albumsArray = Array.isArray(albumsData) ? albumsData : [];
                
                const choirInfo = choirsArray.find(c => c.id === finalChoirId);
                setChoir(choirInfo || {});

                const tracksData = await managerService.getMyTracksByChoir(finalChoirId);
                const tracksArray = Array.isArray(tracksData) ? tracksData : [];
                
                setAlbums(albumsArray);
                setTracks(tracksArray);
            } catch {
                setAlbums([]);
                setTracks([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [finalChoirId]);

    const handleCreateAlbum = () => {
        if (!finalChoirId) {
            toast.error(t('manager.unable_create_album_choir_id'));
            return;
        }
        setIsCreateAlbumDialogOpen(true);
    };

    const handleSaveAlbum = async (data) => {
        if (!finalChoirId) {
            toast.error(t('manager.unable_create_album_choir_id'));
            return;
        }

        try {
            // If there's a cover image file, use FormData and uploadService
            if (data.cover_path instanceof File) {
                const formData = new FormData();
                formData.append('title', data.title);
                formData.append('year', data.year);
                formData.append('genre', data.genre || '');
                formData.append('is_premium', data.is_premium ? '1' : '0');
                formData.append('choir_id', finalChoirId);
                formData.append('cover_path', data.cover_path);
                
                await uploadService.createAlbum(formData);
            } else {
                // No image, use regular managerService
                const albumData = { 
                    ...data, 
                    choir_id: finalChoirId,
                    cover_path: data.cover_path || null
                };
                await managerService.createAlbum(albumData);
            }
            
            setIsCreateAlbumDialogOpen(false);
            toast.success(t('manager.album_created_success'));
            
            // Refresh albums
            const albumsData = await managerService.getMyAlbums(finalChoirId);
            const albumsArray = Array.isArray(albumsData) ? albumsData : [];
            setAlbums(albumsArray);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 
                                error.response?.data?.errors?.title?.[0] ||
                                error.response?.data?.errors?.year?.[0] ||
                                error.response?.data?.errors?.choir_id?.[0] ||
                                error.response?.data?.errors?.cover_path?.[0] ||
                                'Failed to create album';
            toast.error(errorMessage);
        }
    };

    const handleEditAlbum = (album) => {
        setSelectedAlbum(album);
        setIsEditAlbumDialogOpen(true);
    };

    const handleCloseEditAlbumDialog = () => {
        setSelectedAlbum(null);
        setIsEditAlbumDialogOpen(false);
    };

    const handleUpdateAlbum = async (data) => {
        try {
            if (data.cover_path instanceof File) {
                const formData = new FormData();
                formData.append('title', data.title);
                formData.append('year', data.year);
                formData.append('is_premium', data.is_premium);
                formData.append('genre', data.genre);
                formData.append('cover_path', data.cover_path);
                
                await uploadService.updateAlbum(selectedAlbum.id, formData);
            } else {
                const albumData = {
                    title: data.title,
                    year: data.year,
                    is_premium: data.is_premium,
                    genre: data.genre,
                };
                await managerService.updateAlbum(selectedAlbum.id, albumData);
            }
            
            handleCloseEditAlbumDialog();
            toast.success(t('manager.album_updated_success'));
            
            // Refresh albums
            const albumsData = await managerService.getMyAlbums(finalChoirId);
            const albumsArray = Array.isArray(albumsData) ? albumsData : [];
            setAlbums(albumsArray);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 
                                error.response?.data?.errors?.title?.[0] ||
                                error.response?.data?.errors?.year?.[0] ||
                                error.response?.data?.errors?.cover_path?.[0] ||
                                'Failed to update album';
            toast.error(errorMessage);
        }
    };

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

    const handleUploadTrack = () => {
        setIsUploadTrackDialogOpen(true);
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
            if (data.audio_file instanceof File || data.cover_file instanceof File) {
                const formData = new FormData();
                formData.append('title', data.title);
                formData.append('track_number', data.track_number || 1);
                formData.append('duration_sec', data.duration_sec || 0);
                if (data.audio_file instanceof File) {
                    formData.append('file_path', data.audio_file);
                }
                if (data.cover_file instanceof File) {
                    formData.append('cover_path', data.cover_file);
                }
                
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
            const tracksData = await managerService.getMyTracksByChoir(finalChoirId);
            setTracks(Array.isArray(tracksData) ? tracksData : []);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 
                                error.response?.data?.errors?.title?.[0] ||
                                error.response?.data?.errors?.audio_file?.[0] ||
                                error.response?.data?.errors?.file_path?.[0] ||
                                'Failed to update track';
            toast.error(errorMessage);
        }
    };

    const handleSaveTrack = async (data) => {
        try {
            if (data.audio_file instanceof File) {
                const formData = new FormData();
                formData.append('title', data.title);
                formData.append('track_number', data.track_number || 1);
                if (data.album_id) {
                    formData.append('album_id', data.album_id);
                }
                formData.append('choir_id', finalChoirId);
                formData.append('file_path', data.audio_file);
                formData.append('duration_sec', data.duration_sec || 0);
                if (data.cover_file) {
                    formData.append('cover_path', data.cover_file);
                }
                
                await uploadService.createTrack(formData);
            } else {
                const trackData = { ...data, choir_id: finalChoirId };
                await managerService.createTrack(trackData);
            }
            
            setIsUploadTrackDialogOpen(false);
            toast.success(t('manager.track_uploaded_success'));
            
            // Refresh tracks
            const tracksData = await managerService.getMyTracksByChoir(finalChoirId);
            setTracks(Array.isArray(tracksData) ? tracksData : []);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 
                                error.response?.data?.errors?.title?.[0] ||
                                error.response?.data?.errors?.audio_file?.[0] ||
                                error.response?.data?.errors?.file_path?.[0] ||
                                error.response?.data?.errors?.choir_id?.[0] ||
                                'Failed to upload track';
            toast.error(errorMessage);
        }
    };

    return (
        <MainLayout>
            <div className="manager-page">
                <div className="manager-container">
                    {/* Header */}
                    <div className="manager-header">
                        <Link href="/manager/choirs" className="manager-back-link">
                            ← {t('manager.back_to_choirs')}
                        </Link>
                        <h1>{choir.name || 'Choir'} - {t('manager.content_manager')}</h1>
                        <p>{t('manager.manage_albums_tracks')}</p>
                    </div>

                    {/* Quick Stats */}
                    <div className="manager-stats">
                        <div className="manager-stat-card">
                            <span className="manager-stat-icon">💿</span>
                            <div>
                                <div className="manager-stat-value blue">{loading ? '—' : albums.length}</div>
                                <div className="manager-stat-label">{t('manager.albums')}</div>
                            </div>
                        </div>
                        <div className="manager-stat-card">
                            <span className="manager-stat-icon">🎵</span>
                            <div>
                                <div className="manager-stat-value green">{loading ? '—' : tracks.length}</div>
                                <div className="manager-stat-label">{t('manager.total_tracks')}</div>
                            </div>
                        </div>
                    </div>

                    {/* Albums Section */}
                    <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
                        <div className="manager-section-header">
                            <h2>{t('manager.albums')}</h2>
                            <button onClick={handleCreateAlbum} className="manager-primary-button">
                                + {t('manager.create_album')}
                            </button>
                        </div>

                        {loading ? (
                            <div className="manager-empty-state">
                                <p>Loading...</p>
                            </div>
                        ) : albums.length === 0 ? (
                            <div className="manager-empty-state">
                                <div className="manager-empty-icon">💿</div>
                                <h3 className="manager-empty-title">{t('manager.no_albums_yet')}</h3>
                                <p className="manager-empty-description">
                                    {t('manager.create_first_album')}
                                </p>
                                <button onClick={handleCreateAlbum} className="manager-primary-button">
                                    {t('manager.create_first_album_btn')}
                                </button>
                            </div>
                        ) : (
                            <div className="manager-albums-grid">
                                {albums.map((album) => (
                                    <div key={album.id} className="manager-album-card">
                                        <div className="manager-album-cover">
                                            {album.cover_path ? (
                                                <img
                                                    src={album.cover_path}
                                                    alt={album.title}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            ) : (
                                                album.title.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <h3 className="manager-album-title">{album.title}</h3>
                                        <p className="manager-album-year">{album.year}</p>
                                        {album.genre && (
                                            <p className="manager-album-genre">{album.genre}</p>
                                        )}
                                        {album.is_premium && (
                                            <span className="manager-album-badge">Premium</span>
                                        )}
                                        <div className="manager-album-actions">
                                            <Link 
                                                href={`/manager/choirs/${finalChoirId}/albums/${album.id}/tracks`}
                                                className="manager-album-action-button"
                                            >
                                                {t('manager.view_tracks')}
                                            </Link>
                                            <button 
                                                onClick={() => handleEditAlbum(album)}
                                                className="manager-album-action-button"
                                            >
                                                {t('manager.edit')}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Tracks Section */}
                    <div>
                        <div className="manager-section-header">
                            <h2>{t('manager.recent_tracks')}</h2>
                            <button onClick={handleUploadTrack} className="manager-primary-button">
                                + {t('manager.upload_track')}
                            </button>
                        </div>

                        {loading ? (
                            <div className="manager-empty-state">
                                <p>Loading...</p>
                            </div>
                        ) : tracks.length === 0 ? (
                            <div className="manager-empty-state">
                                <div className="manager-empty-icon">🎵</div>
                                <h3 className="manager-empty-title">{t('manager.no_tracks_yet')}</h3>
                                <p className="manager-empty-description">
                                    {t('manager.upload_first_track')}
                                </p>
                                <button onClick={handleUploadTrack} className="manager-primary-button">
                                    {t('manager.upload_first_track_btn')}
                                </button>
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

                {/* Dialogs */}
                {isMobile ? (
                    <CreateAlbumDraggableBox
                        isOpen={isCreateAlbumDialogOpen}
                        onClose={() => setIsCreateAlbumDialogOpen(false)}
                        onSave={handleSaveAlbum}
                    />
                ) : (
                    <CreateAlbumDialog
                        isOpen={isCreateAlbumDialogOpen}
                        onClose={() => setIsCreateAlbumDialogOpen(false)}
                        onSave={handleSaveAlbum}
                    />
                )}

                {isMobile ? (
                    <UploadTrackDraggableBox
                        isOpen={isUploadTrackDialogOpen}
                        onClose={() => setIsUploadTrackDialogOpen(false)}
                        onSave={handleSaveTrack}
                        albums={albums}
                        tracks={tracks}
                    />
                ) : (
                    <UploadTrackDialog
                        isOpen={isUploadTrackDialogOpen}
                        onClose={() => setIsUploadTrackDialogOpen(false)}
                        onSave={handleSaveTrack}
                        albums={albums}
                        tracks={tracks}
                    />
                )}
                {isMobile ? (
                    <EditAlbumDraggableBox
                        isOpen={isEditAlbumDialogOpen}
                        onClose={handleCloseEditAlbumDialog}
                        onSave={handleUpdateAlbum}
                        album={selectedAlbum}
                    />
                ) : (
                    <EditAlbumDialog
                        isOpen={isEditAlbumDialogOpen}
                        onClose={handleCloseEditAlbumDialog}
                        onSave={handleUpdateAlbum}
                        album={selectedAlbum}
                    />
                )}
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
            </div>
        </MainLayout>
    );
}
