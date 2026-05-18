import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../../css/dialog.css';

export default function EditAlbumDraggableBox({ isOpen, onClose, onSave, album }) {
    const [formData, setFormData] = useState({
        title: '',
        year: new Date().getFullYear(),
        is_premium: false,
        genre: '',
        cover_path: null,
    });
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (album) {
            setFormData({
                title: album.title || '',
                year: album.year || new Date().getFullYear(),
                is_premium: album.is_premium || false,
                genre: album.genre || '',
                cover_path: null,
            });
            if (album.cover_path) {
                setImagePreview(album.cover_path);
            } else {
                setImagePreview(null);
            }
        }
    }, [album]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, cover_path: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="draggable-box-overlay" onClick={handleOverlayClick}>
            <div className="draggable-box-container" onClick={(e) => e.stopPropagation()}>
                <div className="draggable-box-header">
                    <h2>Edit Album</h2>
                    <button onClick={onClose} className="draggable-box-close-button">×</button>
                </div>
                <form onSubmit={handleSubmit} className="draggable-box-form">
                    <div className="draggable-box-field">
                        <label>Album Cover</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="draggable-box-input"
                        />
                        {imagePreview && (
                            <div className="image-preview" style={{ marginTop: '10px' }}>
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }}
                                />
                            </div>
                        )}
                    </div>
                    <div className="draggable-box-field">
                        <label>Album Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="draggable-box-input"
                            required
                            placeholder="Enter album title"
                        />
                    </div>
                    <div className="draggable-box-field">
                        <label>Genre</label>
                        <input
                            type="text"
                            value={formData.genre}
                            onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                            className="draggable-box-input"
                            placeholder="Enter genre (e.g., Gospel, Worship)"
                        />
                    </div>
                    <div className="draggable-box-field">
                        <label>Year</label>
                        <input
                            type="number"
                            value={formData.year}
                            onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                            className="draggable-box-input"
                            required
                            min="1900"
                            max="2100"
                        />
                    </div>
                    {/*
                    <div className="draggable-box-field">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                                type="checkbox"
                                checked={formData.is_premium}
                                onChange={(e) => setFormData({ ...formData, is_premium: e.target.checked })}
                                style={{ width: 'auto' }}
                            />
                            Premium Album
                        </label>
                    </div>
                    */}
                    <div className="draggable-box-actions">
                        <button type="button" onClick={onClose} className="draggable-box-button draggable-box-button-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="draggable-box-button draggable-box-button-primary">
                            Update Album
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

EditAlbumDraggableBox.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    album: PropTypes.object.isRequired,
};
