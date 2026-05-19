import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import useTranslation from '../hooks/useTranslation';

export default function AlbumComboBox({ albums, value, onChange, placeholder }) {
    const { t } = useTranslation();
    const finalPlaceholder = placeholder || t('common.search_albums');
    const [searchTerm, setSearchTerm] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsFocused(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedAlbum = albums?.find(a => a.id === value);

    const filteredAlbums = albums?.filter(album =>
        album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (album.genre && album.genre.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (album.year && album.year.toString().includes(searchTerm))
    ) || [];

    const handleSelect = (album) => {
        onChange(album.id);
        setSearchTerm(album.title);
        setIsFocused(false);
    };

    const handleClear = () => {
        onChange('');
        setSearchTerm('');
    };

    const handleFocus = () => {
        setIsFocused(true);
        if (selectedAlbum && !searchTerm) {
            setSearchTerm(selectedAlbum.title);
        }
    };

    const handleBlur = () => {
        if (!selectedAlbum) {
            setSearchTerm('');
        } else {
            setSearchTerm(selectedAlbum.title);
        }
    };

    return (
        <div ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
            {/* Search Input */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
            }}>
                <input
                    type="text"
                    placeholder={finalPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    style={{
                        width: '100%',
                        padding: '12px 40px 12px 16px',
                        background: 'rgba(30, 30, 40, 0.8)',
                        border: '1px solid rgba(255, 215, 0, 0.3)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '14px',
                        outline: 'none',
                    }}
                />
                {/* Search Icon */}
                {/* <span style={{
                    position: 'absolute',
                    right: '12px',
                    color: 'rgba(255, 215, 0, 0.6)',
                    fontSize: '16px',
                    pointerEvents: 'none',
                }}>
                    🔍
                </span> */}
                {/* Clear Button */}
                {searchTerm && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClear();
                        }}
                        style={{
                            position: 'absolute',
                            right: '6px',
                            background: 'none',
                            border: 'none',
                            color: 'rgba(255, 255, 255, 0.6)',
                            cursor: 'pointer',
                            fontSize: '16px',
                            padding: '4px',
                        }}
                    >
                        ×
                    </button>
                )}
            </div>

            {/* Selected Album Badge */}
            {selectedAlbum && !isFocused && (
                <div style={{
                    marginTop: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    background: 'rgba(255, 215, 0, 0.1)',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                    borderRadius: '6px',
                }}>
                    <div
                        style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            background: selectedAlbum.cover_path 
                                ? `url(${selectedAlbum.cover_path}) center/cover`
                                : 'linear-gradient(135deg, #B8860B, #FFD700)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            color: '#000',
                        }}
                    >
                        {!selectedAlbum.cover_path && selectedAlbum.title.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: '#FFD700', fontSize: '13px', fontWeight: '500' }}>
                            {selectedAlbum.title}
                        </div>
                    </div>
                </div>
            )}

            {/* Dropdown Results */}
            {(isFocused || searchTerm) && !value && filteredAlbums.length > 0 && (
                <div
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        marginTop: '8px',
                        background: 'rgba(30, 30, 40, 0.95)',
                        border: '1px solid rgba(255, 215, 0, 0.3)',
                        borderRadius: '8px',
                        maxHeight: '250px',
                        overflow: 'auto',
                        zIndex: 1000,
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                    }}
                >
                    {filteredAlbums.map((album) => (
                        <div
                            key={album.id}
                            onClick={() => handleSelect(album)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 16px',
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                                background: value === album.id ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
                            }}
                            onMouseEnter={(e) => {
                                if (value !== album.id) {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (value !== album.id) {
                                    e.currentTarget.style.background = 'transparent';
                                }
                            }}
                        >
                            <div
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '8px',
                                    background: album.cover_path 
                                        ? `url(${album.cover_path}) center/cover`
                                        : 'linear-gradient(135deg, #B8860B, #FFD700)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    color: '#000',
                                    flexShrink: 0,
                                }}
                            >
                                {!album.cover_path && album.title.charAt(0).toUpperCase()}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ color: '#fff', fontSize: '14px', fontWeight: '500' }}>
                                    {album.title}
                                </div>
                                <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}>
                                    {album.year} {album.genre && `• ${album.genre}`}
                                </div>
                            </div>
                            {album.is_premium && (
                                <span style={{
                                    background: 'linear-gradient(135deg, #FFD700, #B8860B)',
                                    color: '#000',
                                    fontSize: '10px',
                                    fontWeight: 'bold',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                }}>
                                    {t('common.premium')}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* No Results */}
            {(isFocused || searchTerm) && filteredAlbums.length === 0 && searchTerm && (
                <div
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        marginTop: '8px',
                        padding: '20px',
                        background: 'rgba(30, 30, 40, 0.95)',
                        border: '1px solid rgba(255, 215, 0, 0.3)',
                        borderRadius: '8px',
                        textAlign: 'center',
                        color: 'rgba(255, 255, 255, 0.6)',
                        zIndex: 1000,
                    }}
                >
                    {t('common.no_albums_found')}
                </div>
            )}
        </div>
    );
}

AlbumComboBox.propTypes = {
    albums: PropTypes.array.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
};
