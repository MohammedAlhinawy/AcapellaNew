import { useState, useEffect, useMemo, useRef } from 'react';
import { router } from '@inertiajs/react';
import { HiBadgeCheck } from 'react-icons/hi';
import { MdClear, MdSearch, MdPlayArrow } from 'react-icons/md';
import MainLayout from '../../Layout/MainLayout';
import trackService from '../../Services/trackService';
import choirService from '../../Services/choirService';
import albumService from '../../Services/albumService';
import { toast } from '../../Components/ToastContainer';
import SheetTrackDropdown from '../../Components/SheetTrackDropdown';
import useDebounce from '../../Hooks/useDebounce';
import '../../../css/listener.css';
import '../../../css/yt-music.css';

export default function Explore() {
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 400);
    
    const [activeFilter, setActiveFilter] = useState('All');
    
    // Default Data
    const [tracks, setTracks] = useState([]);
    const [choirs, setChoirs] = useState([]);
    const [albums, setAlbums] = useState([]);
    
    // Search Results Data
    const [searchTracks, setSearchTracks] = useState([]);
    const [searchChoirs, setSearchChoirs] = useState([]);
    const [searchAlbums, setSearchAlbums] = useState([]);
    
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);

    const filters = ['All', 'Tracks', 'Choirs', 'Albums']; // 'Premium', 'Free' commented out
    const searchInputRef = useRef(null);

    // Load Default Data on Mount
    useEffect(() => {
        const fetchDefaultData = async () => {
            setLoading(true);
            try {
                const [tracksData, choirsData, albumsData] = await Promise.all([
                    trackService.getTracks(),
                    choirService.getChoirs(),
                    albumService.getAlbums()
                ]);
                setTracks(tracksData.data || []);
                setChoirs(choirsData.data || []);
                setAlbums(albumsData.data || []);
            } catch {
                toast.error('Failed to load explore content');
            } finally {
                setLoading(false);
            }
        };

        fetchDefaultData();
    }, []);

    // Handle Debounced Search (Client-side)
    useEffect(() => {
        if (!debouncedSearchQuery.trim()) {
            setSearchTracks([]);
            setSearchChoirs([]);
            setSearchAlbums([]);
            return;
        }

        setSearchLoading(true);
        const lowerQuery = debouncedSearchQuery.toLowerCase();
        
        // Client-side filtering
        const filteredTracks = tracks.filter(track => 
            track.title?.toLowerCase().includes(lowerQuery) || 
            track.album?.title?.toLowerCase().includes(lowerQuery)
        );
        const filteredChoirs = choirs.filter(choir => 
            choir.name?.toLowerCase().includes(lowerQuery)
        );
        const filteredAlbums = albums.filter(album => 
            album.title?.toLowerCase().includes(lowerQuery)
        );

        setSearchTracks(filteredTracks);
        setSearchChoirs(filteredChoirs);
        setSearchAlbums(filteredAlbums);
        setSearchLoading(false);
    }, [debouncedSearchQuery, tracks, choirs, albums]);

    // Helpers
    const handleFilter = (filter) => setActiveFilter(filter);

    const handleCardClick = (item, type) => {
        if (type === 'track') router.visit(`/play-track/${item.id}`);
        else if (type === 'album') router.visit(`/album/${item.id}`);
        else if (type === 'choir') router.visit(`/choir/${item.id}`);
    };

    // Derived Data for Default View
    const newlyAddedTracks = useMemo(() => {
        return [...tracks].sort((a, b) => b.id - a.id).slice(0, 10);
    }, [tracks]);

    const newlyAddedAlbums = useMemo(() => {
        return [...albums].sort((a, b) => b.id - a.id).slice(0, 10);
    }, [albums]);
    
    const trendingChoirs = useMemo(() => {
        return [...choirs].slice(0, 10);
    }, [choirs]);

    const isSearching = debouncedSearchQuery.trim().length > 0;

    // Render Components
    const renderTrackCarousel = (items, title) => {
        if (!items || items.length === 0) return null;
        return (
            <div className="section">
                <h2 className="section-title">{title}</h2>
                <div className="horizontal-carousel">
                    {items.map(item => (
                        <div key={`track-${item.id}`} className="carousel-item" onClick={() => handleCardClick(item, 'track')}>
                            <div className="carousel-cover">
                                {item.cover_path ? (
                                    <img src={item.cover_path} alt={item.title} className="carousel-image" />
                                ) : (
                                    <div className="explore-card-placeholder">🎵</div>
                                )}
                                <div className="play-overlay">
                                    <div className="play-btn-circle"><MdPlayArrow size={24} /></div>
                                </div>
                            </div>
                            <div className="carousel-info">
                                <div className="carousel-title">{item.title}</div>
                                <div className="carousel-subtitle">{item.album?.title || 'Unknown Album'}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderAlbumCarousel = (items, title) => {
        if (!items || items.length === 0) return null;
        return (
            <div className="section">
                <h2 className="section-title">{title}</h2>
                <div className="horizontal-carousel">
                    {items.map(item => (
                        <div key={`album-${item.id}`} className="carousel-item" onClick={() => handleCardClick(item, 'album')}>
                            <div className="carousel-cover">
                                {item.cover_path ? (
                                    <img src={item.cover_path} alt={item.title} className="carousel-image" />
                                ) : (
                                    <div className="explore-card-placeholder album">
                                        <span>{item.title?.charAt(0) || 'A'}</span>
                                    </div>
                                )}
                                <div className="play-overlay">
                                    <div className="play-btn-circle"><MdPlayArrow size={24} /></div>
                                </div>
                            </div>
                            <div className="carousel-info">
                                <div className="carousel-title">{item.title}</div>
                                <div className="carousel-subtitle">{item.year || '2024'} • {item.genre || 'Unknown'}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderChoirCarousel = (items, title) => {
        if (!items || items.length === 0) return null;
        return (
            <div className="section">
                <h2 className="section-title">{title}</h2>
                <div className="horizontal-carousel">
                    {items.map(item => (
                        <div key={`choir-${item.id}`} className="carousel-item" onClick={() => handleCardClick(item, 'choir')}>
                            <div className="carousel-cover circle">
                                {item.image_path ? (
                                    <img src={item.image_path} alt={item.name} className="carousel-image" />
                                ) : (
                                    <div className="explore-card-placeholder choir" style={{ borderRadius: '50%' }}>
                                        <span>{item.name?.charAt(0) || 'C'}</span>
                                    </div>
                                )}
                                <div className="play-overlay">
                                    <div className="play-btn-circle"><MdPlayArrow size={24} /></div>
                                </div>
                            </div>
                            <div className="carousel-info" style={{ textAlign: 'center' }}>
                                <div className="carousel-title">
                                    {item.name} {item.is_verified && <HiBadgeCheck style={{ color: '#60A5FA', verticalAlign: 'middle' }} />}
                                </div>
                                <div className="carousel-subtitle">{item.location || 'Artist'}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderSearchResults = () => {
        if (searchLoading) return <div className="loading-state">Searching...</div>;

        // Top Result heuristic
        let topResult = null;
        let topResultType = null;
        if (searchChoirs.length > 0) { topResult = searchChoirs[0]; topResultType = 'choir'; }
        else if (searchTracks.length > 0) { topResult = searchTracks[0]; topResultType = 'track'; }
        else if (searchAlbums.length > 0) { topResult = searchAlbums[0]; topResultType = 'album'; }

        if (!topResult) return <div className="empty-state">No results found for &ldquo;{searchQuery}&rdquo;</div>;

        return (
            <div className="search-results">
                <div className="search-results-grid">
                    {/* Top Result */}
                    <div className="section">
                        <h2 className="section-title">Top Result</h2>
                        <div className="top-result-card" onClick={() => handleCardClick(topResult, topResultType)}>
                            <div className={`top-result-cover ${topResultType === 'choir' ? '' : 'rect'}`}>
                                {(topResult.image_path || topResult.cover_path) ? (
                                    <img src={topResult.image_path || topResult.cover_path} alt={topResult.name || topResult.title} className="carousel-image" />
                                ) : (
                                    <div className={`explore-card-placeholder ${topResultType}`}>
                                        <span>{(topResult.name || topResult.title)?.charAt(0)}</span>
                                    </div>
                                )}
                            </div>
                            <div className="top-result-title">{topResult.name || topResult.title}</div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <span className="top-result-badge">{topResultType}</span>
                                {topResult.is_verified && <HiBadgeCheck size={20} color="#60A5FA" />}
                                {topResultType === 'track' && <span style={{ color: 'var(--text-secondary)' }}>{topResult.album?.title || 'Unknown'} • {topResult.duration_label}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Songs List */}
                    <div className="section">
                        <h2 className="section-title">Songs</h2>
                        <div className="track-list" style={{ gap: '8px' }}>
                            {searchTracks.slice(0, 4).map(track => (
                                <div key={track.id} className="track-item" onClick={() => handleCardClick(track, 'track')}>
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
                                        <span className="track-name">{track.title}</span>
                                        <span className="track-album">{track.album?.title} • {track.duration_label}</span>
                                    </div>
                                    <SheetTrackDropdown 
                                        track={track}
                                        activeMenu={activeMenu}
                                        setActiveMenu={setActiveMenu}
                                        queue={[]}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Categories */}
                {renderAlbumCarousel(searchAlbums, 'Albums')}
                {renderChoirCarousel(searchChoirs, 'Choirs')}
            </div>
        );
    };

    return (
        <MainLayout>
            <div className="listener-page">
                <div className="listener-header">
                    <h1 className="listener-header h1" style={{ marginBottom: 24 }}>Explore</h1>
                    
                    <div className="search-container">
                        <MdSearch className="search-icon-inside" />
                        <input 
                            ref={searchInputRef}
                            type="text" 
                            placeholder="Search for tracks, choirs, or albums..." 
                            className="search-input-yt"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button className="search-clear-btn" onClick={() => { setSearchQuery(''); searchInputRef.current?.focus(); }}>
                                <MdClear />
                            </button>
                        )}
                    </div>
                </div>

                {!isSearching && (
                    <div className="chips-container">
                        {filters.map((filter) => (
                            <div 
                                key={filter}
                                className={`chip ${activeFilter === filter ? 'active' : ''}`}
                                onClick={() => handleFilter(filter)}
                            >
                                {filter}
                            </div>
                        ))}
                    </div>
                )}

                <div className="content-grid">
                    {isSearching ? (
                        renderSearchResults()
                    ) : loading ? (
                        <div className="loading-state">Loading explore...</div>
                    ) : (
                        <>
                            {(activeFilter === 'All' || activeFilter === 'Tracks') && renderTrackCarousel(newlyAddedTracks, 'Newly Added Tracks')}
                            {(activeFilter === 'All' || activeFilter === 'Albums') && renderAlbumCarousel(newlyAddedAlbums, 'New Releases')}
                            {(activeFilter === 'All' || activeFilter === 'Choirs') && renderChoirCarousel(trendingChoirs, 'Trending Choirs')}
                            
                            {/* Fallback to full list if filtered */}
                            {activeFilter !== 'All' && (
                                <div className="section" style={{ marginTop: 32 }}>
                                    <h2 className="section-title">All {activeFilter}</h2>
                                    <div className="card-grid">
                                        {/* Simplified generic grid fallback for old filtered logic */}
                                        {activeFilter === 'Tracks' && tracks.map(item => (
                                            <div key={`all-t-${item.id}`} className="explore-card" onClick={() => handleCardClick(item, 'track')}>
                                                <div className="explore-card-content">
                                                    <div className="explore-card-cover">
                                                        {item.cover_path ? <img src={item.cover_path} alt={item.title} className="explore-card-image" /> : <div className="explore-card-placeholder">🎵</div>}
                                                    </div>
                                                    <div className="explore-card-info">
                                                        <h3 className="explore-card-title">{item.title}</h3>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {activeFilter === 'Choirs' && choirs.map(item => (
                                            <div key={`all-c-${item.id}`} className="explore-card" onClick={() => handleCardClick(item, 'choir')}>
                                                <div className="explore-card-content">
                                                    <div className="explore-card-cover circle">
                                                        {item.image_path ? <img src={item.image_path} alt={item.name} className="explore-card-image" /> : <div className="explore-card-placeholder choir"><span>{item.name?.charAt(0)}</span></div>}
                                                    </div>
                                                    <div className="explore-card-info" style={{textAlign: 'center'}}>
                                                        <h3 className="explore-card-title">{item.name}</h3>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
