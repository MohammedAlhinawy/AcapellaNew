import { useState } from 'react';
import PropTypes from 'prop-types';
import '../../css/dialog.css';
import useTranslation from '../hooks/useTranslation';

export default function CreateChoirDraggableBox({ isOpen, onClose, onSave }) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        bio: '',
        image: null,
    });
    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="draggable-box-overlay">
            <div className="draggable-box-container">
                <div className="draggable-box-header">
                    <h2>{t('dialog.create_choir')}</h2>
                    <button onClick={onClose} className="draggable-box-close-button">×</button>
                </div>
                <form onSubmit={handleSubmit} className="draggable-box-form">
                    <div className="draggable-box-field">
                        <label>{t('dialog.choir_image')}</label>
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
                                    alt={t('dialog.preview')}
                                    style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }}
                                />
                            </div>
                        )}
                    </div>
                    <div className="draggable-box-field">
                        <label>{t('dialog.choir_name')}</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="draggable-box-input"
                            required
                            placeholder={t('dialog.enter_choir_name')}
                        />
                    </div>
                    <div className="draggable-box-field">
                        <label>{t('dialog.location')}</label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="draggable-box-input"
                            required
                            placeholder={t('dialog.enter_location')}
                        />
                    </div>
                    <div className="draggable-box-field">
                        <label>{t('dialog.choir_description')}</label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            className="draggable-box-input"
                            rows={4}
                            placeholder={t('dialog.enter_choir_description')}
                        />
                    </div>
                    <div className="draggable-box-actions">
                        <button type="button" onClick={onClose} className="draggable-box-button draggable-box-button-secondary">
                            {t('common.cancel')}
                        </button>
                        <button type="submit" className="draggable-box-button draggable-box-button-primary">
                            {t('dialog.create_choir_btn')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

CreateChoirDraggableBox.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
};
