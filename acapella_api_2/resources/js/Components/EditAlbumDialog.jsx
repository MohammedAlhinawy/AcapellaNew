import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../../css/dialog.css';
import useTranslation from '../hooks/useTranslation';

export default function EditAlbumDialog({ isOpen, onClose, onSave, album }) {
    const { t } = useTranslation();
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
        <div className="dialog-overlay" onClick={handleOverlayClick}>
            <div className="dialog-container" onClick={(e) => e.stopPropagation()}>
                <div className="dialog-header">
                    <h2>{t('dialog.edit_album')}</h2>
                    <button onClick={onClose} className="dialog-close-button">×</button>
                </div>
                <form onSubmit={handleSubmit} className="dialog-form">
                    <div className="dialog-field">
                        <label>{t('dialog.album_cover')}</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="dialog-input"
                        />
                        {imagePreview && (
                            <div className="image-preview" style={{ marginTop: '10px' }}>
                                <img
                                    src={imagePreview}
                                    alt={t('dialog.preview')}
                                    style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }}
                                />
                            </div>
                        )}
                    </div>
                    <div className="dialog-field">
                        <label>{t('dialog.album_title')}</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="dialog-input"
                            required
                            placeholder={t('dialog.enter_album_title')}
                        />
                    </div>
                    <div className="dialog-field">
                        <label>{t('dialog.genre')}</label>
                        <input
                            type="text"
                            value={formData.genre}
                            onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                            className="dialog-input"
                            placeholder={t('dialog.enter_genre')}
                        />
                    </div>
                    <div className="dialog-field">
                        <label>{t('dialog.year')}</label>
                        <input
                            type="number"
                            value={formData.year}
                            onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                            className="dialog-input"
                            required
                            min="1900"
                            max="2100"
                        />
                    </div>
                    {/*
                    <div className="dialog-field">
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
                    <div className="dialog-actions">
                        <button type="button" onClick={onClose} className="dialog-button dialog-button-secondary">
                            {t('common.cancel')}
                        </button>
                        <button type="submit" className="dialog-button dialog-button-primary">
                            {t('dialog.update_album')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

EditAlbumDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    album: PropTypes.object.isRequired,
};
