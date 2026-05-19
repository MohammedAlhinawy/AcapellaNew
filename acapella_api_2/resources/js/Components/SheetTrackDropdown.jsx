import { HiDotsVertical } from "react-icons/hi";
import { FaPlus, FaHeart, FaHeartBroken, FaDownload, FaListUl, FaMinusCircle, FaTrashAlt, FaLock, FaShareAlt } from "react-icons/fa";
import PropTypes from 'prop-types';
import trackService from '../Services/trackService';
import playlistService from '../Services/playlistService';
import { toast } from './ToastContainer';
import { router } from '@inertiajs/react';
import { createPortal } from 'react-dom';
import { useRef, useEffect, useState } from 'react';
import { db, STORAGE_KEYS } from '../Utils/indexedDB';
import useTranslation from '../hooks/useTranslation';

// Module-level cache so we don't read IndexedDB once per row
let cachedIsPremium = null;
const loadIsPremium = async () => {
    if (cachedIsPremium !== null) return cachedIsPremium;
    try {
        await db.init();
        const userData = await db.get('auth', STORAGE_KEYS.USER_DATA);
        cachedIsPremium = !!(userData && userData.is_premium);
    } catch {
        cachedIsPremium = false;
    }
    return cachedIsPremium;
};

export default function SheetTrackDropdown({ track, activeMenu, setActiveMenu, queue, onUnlikeSuccess }) {
    const { t } = useTranslation();
    const buttonRef = useRef(null);
    const dropdownRef = useRef(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
    const [playlistMode, setPlaylistMode] = useState(null); // 'save' | 'remove' | null
    const [playlists, setPlaylists] = useState([]);
    const [loadingPlaylists, setLoadingPlaylists] = useState(false);
    const [isPremium, setIsPremium] = useState(cachedIsPremium ?? false);

    useEffect(() => {
        let mounted = true;
        loadIsPremium().then((val) => { if (mounted) setIsPremium(val); });
        return () => { mounted = false; };
    }, []);

    useEffect(() => {
        if (activeMenu === track.id && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            // Estimated dropdown height (≈7 items × 44px + padding)
            const estimatedHeight = 320;
            const spaceBelow = window.innerHeight - rect.bottom;
            
            // Calculate top position and add window.scrollY so it scrolls with the page
            const top = spaceBelow < estimatedHeight && rect.top > estimatedHeight
                ? rect.top + window.scrollY - estimatedHeight - 4   // flip up
                : rect.bottom + window.scrollY + 8;                  // default: below
                
            setDropdownPosition({
                top,
                right: document.documentElement.clientWidth - rect.right
            });
        }
    }, [activeMenu, track.id]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (activeMenu === track.id) {
                const isOutsideButton = buttonRef.current && !buttonRef.current.contains(event.target);
                const isOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(event.target);
                
                if (isOutsideButton && isOutsideDropdown) {
                    setActiveMenu(null);
                }
            }
        };

        if (activeMenu === track.id) {
            document.addEventListener('click', handleClickOutside);
            return () => {
                document.removeEventListener('click', handleClickOutside);
            };
        }
    }, [activeMenu, track.id, setActiveMenu]);

    // Reset playlist submenu when dropdown closes
    useEffect(() => {
        if (activeMenu !== track.id) {
            setPlaylistMode(null);
        }
    }, [activeMenu, track.id]);

    const loadPlaylists = async () => {
        setLoadingPlaylists(true);
        try {
            const response = await playlistService.getPlaylists();
            const data = response.data || response || [];
            setPlaylists(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error loading playlists:', error);
            toast.error(t('track_dropdown.failed_load_playlists'));
            setPlaylists([]);
        } finally {
            setLoadingPlaylists(false);
        }
    };

    const handleSaveToPlaylist = async (playlistId) => {
        try {
            await playlistService.addTrackToPlaylist(playlistId, track.id);
            toast.success(t('track_dropdown.added_to_playlist'));
            setActiveMenu(null);
        } catch (error) {
            console.error('Error adding to playlist:', error);
            toast.error(t('track_dropdown.failed_add_playlist'));
        }
    };

    const handleCreatePlaylist = async () => {
        const name = window.prompt(t('track_dropdown.enter_playlist_name'));
        if (!name || !name.trim()) return;
        try {
            const response = await playlistService.createPlaylist({ name: name.trim() });
            const newPlaylist = response.data || response;
            toast.success(t('track_dropdown.playlist_created'));
            // Add current track to the newly created playlist
            if (newPlaylist?.id) {
                await playlistService.addTrackToPlaylist(newPlaylist.id, track.id);
                toast.success(t('track_dropdown.added_to_playlist'));
            }
            setActiveMenu(null);
        } catch (error) {
            console.error('Error creating playlist:', error);
            toast.error(t('track_dropdown.failed_create_playlist'));
        }
    };

    const handleRemoveFromPlaylist = async (playlistId) => {
        try {
            await playlistService.removeTrackFromPlaylist(playlistId, track.id);
            toast.success(t('track_dropdown.removed_from_playlist'));
            setActiveMenu(null);
        } catch (error) {
            console.error('Error removing from playlist:', error);
            toast.error(t('track_dropdown.failed_remove_playlist'));
        }
    };

    const handleAddToQueue = async (track) => {
        try {
            // Enforce 5-track queue limit for free users
            if (!isPremium) {
                let currentQueue = queue;
                if (!currentQueue || currentQueue.length === 0) {
                    try {
                        const resp = await trackService.getQueue();
                        currentQueue = resp.data || resp || [];
                    } catch {
                        currentQueue = [];
                    }
                }
                if (currentQueue.length >= 5) {
                    toast.error(t('track_dropdown.queue_limit'));
                    router.visit('/payments?plan=monthly');
                    return;
                }
            }
            await trackService.addToQueue(track.id);
            toast.success(t('track_dropdown.added_to_queue'));
        } catch {
            toast.error(t('track_dropdown.failed_add_queue'));
        }
    };

    const handleRemoveFromQueue = async (queueItem) => {
        try {
            await trackService.removeFromQueue(queueItem.id);
            toast.success(t('track_dropdown.removed_from_queue'));
        } catch {
            toast.error(t('track_dropdown.failed_remove_queue'));
        }
    };

    const handleRemoveFromLiked = async (track) => {
        console.log('Removing from liked - track:', track);
        try {
            const response = await trackService.unlikeTrack(track.id);
            console.log('Unlike response:', response);
            toast.success(t('track_dropdown.removed_from_liked'));
            if (onUnlikeSuccess) {
                onUnlikeSuccess();
            }
        } catch (_error) {
            console.error('Error removing from liked:', _error);
            toast.error(t('track_dropdown.failed_remove_liked'));
        }
    };

    const handleDownload = async (trackData) => {
        if (!trackData?.file_path) {
            toast.error(t('track_dropdown.file_not_available'));
            return;
        }

        try {
            toast.info(t('track_dropdown.starting_download'));
            const response = await fetch(trackData.file_path);
            if (!response.ok) throw new Error('Failed to fetch file');

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            // Derive a safe filename from track title + original extension
            const ext = (trackData.file_path.split('.').pop() || 'mp3').split(/[?#]/)[0];
            const safeTitle = (trackData.title || 'track').replace(/[^a-z0-9_\-\s]/gi, '').trim() || 'track';
            const filename = `${safeTitle}.${ext}`;

            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Cleanup blob URL after a short delay
            setTimeout(() => URL.revokeObjectURL(url), 1000);

            toast.success(t('track_dropdown.download_started'));
        } catch (error) {
            console.error('Download error:', error);
            toast.error(t('track_dropdown.failed_download'));
        }
    };

    const handleShare = async (trackData) => {
        const shareUrl = `${window.location.origin}/play-track/${trackData.id}`;
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: trackData.title,
                    text: t('track_dropdown.share_text', { title: trackData.title }),
                    url: shareUrl,
                });
            } catch (err) {
                console.error("Share failed", err);
            }
        } else {
            // Fallback
            navigator.clipboard.writeText(shareUrl);
            toast.success(t('track_dropdown.link_copied'));
        }
    };

    const handleMenuOption = async (option, trackData) => {
        // Gate premium-only features
        const premiumOptions = ['download', 'save_to_playlist', 'remove_from_playlist', 'add_to_liked', 'remove_from_liked'];
        if (premiumOptions.includes(option) && !isPremium) {
            setActiveMenu(null);
            toast.error(t('track_dropdown.premium_feature'));
            router.visit('/payments?plan=monthly');
            return;
        }

        // Don't close dropdown for playlist options - show submenu instead
        if (option === 'save_to_playlist' || option === 'remove_from_playlist') {
            setPlaylistMode(option === 'save_to_playlist' ? 'save' : 'remove');
            await loadPlaylists();
            return;
        }

        setActiveMenu(null);
        
        switch (option) {
            case 'add_to_queue':
                await handleAddToQueue(trackData);
                break;
            case 'add_to_liked':
                console.log('Adding to liked - track:', trackData);
                try {
                    const response = await trackService.likeTrack(trackData.id);
                    console.log('Like response:', response);
                    toast.success(t('track_dropdown.added_to_liked'));
                } catch (error) {
                    console.error('Error adding to liked:', error);
                    toast.error(t('track_dropdown.failed_add_liked'));
                }
                break;
            case 'download':
                await handleDownload(trackData);
                break;
            case 'remove_from_queue':
                {
                    const queueItem = queue.find(q => q.track.id === trackData.id);
                    if (queueItem) {
                        await handleRemoveFromQueue(queueItem);
                    }
                }
                break;
            case 'remove_from_liked':
                await handleRemoveFromLiked(trackData);
                break;
            case 'share':
                await handleShare(trackData);
                break;
            default:
                break;
        }
    };

    return (
        <div className="track-menu" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '59px', height: '100%' }}>
            <button 
                ref={buttonRef}
                onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === track.id ? null : track.id); }} 
                style={{ border: 'none', backgroundColor: 'transparent', color: '#ffffff', padding: '8px' }}
            >
                <HiDotsVertical size={18} />
            </button>
            {activeMenu === track.id && createPortal(
                <div 
                    ref={dropdownRef}
                    className="sheet-track-dropdown"
                    style={{ position: 'absolute', top: `${dropdownPosition.top}px`, right: `${dropdownPosition.right}px`, minWidth: '218px' }}
                >
                    {playlistMode ? (
                        <>
                            <div
                                className="dropdown-item"
                                style={{ fontWeight: 'bold', borderBottom: '1px solid #333' }}
                                onClick={(e) => { e.stopPropagation(); setPlaylistMode(null); }}
                            >
                                ← {playlistMode === 'save' ? t('track_dropdown.save_to_playlist') : t('track_dropdown.remove_from_playlist')}
                            </div>
                            {loadingPlaylists ? (
                                <div className="dropdown-item" style={{ opacity: 0.6 }}>{t('track_dropdown.loading')}</div>
                            ) : (
                                <>
                                    {playlistMode === 'save' && (
                                        <div
                                            className="dropdown-item"
                                            style={{ color: '#B8860B', fontWeight: 'bold' }}
                                            onClick={(e) => { e.stopPropagation(); handleCreatePlaylist(); }}
                                        >
                                            + {t('track_dropdown.create_new_playlist')}
                                        </div>
                                    )}
                                    {playlists.length === 0 ? (
                                        <div className="dropdown-item" style={{ opacity: 0.6 }}>{t('track_dropdown.no_playlists')}</div>
                                    ) : (
                                        playlists.map((pl) => (
                                            <div
                                                key={pl.id}
                                                className="dropdown-item"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (playlistMode === 'save') {
                                                        handleSaveToPlaylist(pl.id);
                                                    } else {
                                                        handleRemoveFromPlaylist(pl.id);
                                                    }
                                                }}
                                            >
                                                {pl.name || pl.title || t('track_dropdown.playlist_number', { id: pl.id })}
                                            </div>
                                        ))
                                    )}
                                </>
                            )}
                        </>
                    ) : (
                    <>
                    <div 
                        className="dropdown-item"
                        onClick={(e) => { e.stopPropagation(); handleMenuOption('add_to_queue', track); }}
                    >
                        <FaPlus style={{ marginRight: 10 }} /> {t('track_dropdown.add_to_queue')}
                    </div>
                    <div 
                        className="dropdown-item"
                        onClick={(e) => { e.stopPropagation(); handleMenuOption('add_to_liked', track); }}
                        style={!isPremium ? { opacity: 0.7 } : undefined}
                    >
                        <FaHeart style={{ marginRight: 10, color: '#e74c3c' }} /> {t('track_dropdown.add_to_liked')}
                        {!isPremium && <FaLock style={{ marginLeft: 'auto', fontSize: 12, opacity: 0.6 }} />}
                    </div>
                    <div 
                        className="dropdown-item"
                        onClick={(e) => { e.stopPropagation(); handleMenuOption('download', track); }}
                        style={!isPremium ? { opacity: 0.7 } : undefined}
                    >
                        <FaDownload style={{ marginRight: 10 }} /> {t('track_dropdown.download')}
                        {!isPremium && <FaLock style={{ marginLeft: 'auto', fontSize: 12, opacity: 0.6 }} />}
                    </div>
                    <div 
                        className="dropdown-item"
                        onClick={(e) => { e.stopPropagation(); handleMenuOption('save_to_playlist', track); }}
                        style={!isPremium ? { opacity: 0.7 } : undefined}
                    >
                        <FaListUl style={{ marginRight: 10 }} /> {t('track_dropdown.save_to_playlist')}
                        {!isPremium && <FaLock style={{ marginLeft: 'auto', fontSize: 12, opacity: 0.6 }} />}
                    </div>
                    <div 
                        className="dropdown-item"
                        onClick={(e) => { e.stopPropagation(); handleMenuOption('remove_from_playlist', track); }}
                        style={!isPremium ? { opacity: 0.7 } : undefined}
                    >
                        <FaMinusCircle style={{ marginRight: 10 }} /> {t('track_dropdown.remove_from_playlist')}
                        {!isPremium && <FaLock style={{ marginLeft: 'auto', fontSize: 12, opacity: 0.6 }} />}
                    </div>
                    <div 
                        className="dropdown-item"
                        onClick={(e) => { e.stopPropagation(); handleMenuOption('remove_from_queue', track); }}
                    >
                        <FaTrashAlt style={{ marginRight: 10 }} /> {t('track_dropdown.remove_from_queue')}
                    </div>
                    <div 
                        className="dropdown-item"
                        onClick={(e) => { e.stopPropagation(); handleMenuOption('remove_from_liked', track); }}
                        style={!isPremium ? { opacity: 0.7 } : undefined}
                    >
                        <FaHeartBroken style={{ marginRight: 10 }} /> {t('track_dropdown.remove_from_liked')}
                        {!isPremium && <FaLock style={{ marginLeft: 'auto', fontSize: 12, opacity: 0.6 }} />}
                    </div>
                    <div 
                        className="dropdown-item"
                        onClick={(e) => { e.stopPropagation(); handleMenuOption('share', track); }}
                    >
                        <FaShareAlt style={{ marginRight: 10 }} /> {t('track_dropdown.share')}
                    </div>
                    </>
                    )}
                </div>,
                document.body
            )}
        </div>
    );
}

SheetTrackDropdown.propTypes = {
    track: PropTypes.object.isRequired,
    activeMenu: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    setActiveMenu: PropTypes.func.isRequired,
    queue: PropTypes.array,
    onUnlikeSuccess: PropTypes.func,
};
