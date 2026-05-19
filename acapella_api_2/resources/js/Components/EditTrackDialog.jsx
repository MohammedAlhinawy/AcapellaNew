import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../../css/dialog.css';
import useTranslation from '../hooks/useTranslation';

export default function EditTrackDialog({ isOpen, onClose, onSave, track }) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        title: '',
        track_number: 1,
        audio_file: null,
        cover_file: null,
        duration_sec: 0,
    });
    const [coverPreview, setCoverPreview] = useState(null);

    useEffect(() => {
        if (track) {
            setFormData({
                title: track.title || '',
                track_number: track.track_number || 1,
                audio_file: null,
                cover_file: null,
                duration_sec: track.duration_sec || 0,
            });
            setCoverPreview(track.cover_path || null);
        }
    }, [track]);

    const handleAudioChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, audio_file: file, duration_sec: 0 });
            
            // Extract duration from audio file
            const audio = new Audio();
            audio.src = URL.createObjectURL(file);
            audio.addEventListener('loadedmetadata', () => {
                const duration = Math.floor(audio.duration);
                setFormData(prev => ({ ...prev, duration_sec: duration }));
            });
        }
    };

    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, cover_file: file });
            setCoverPreview(URL.createObjectURL(file));
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
                    <h2>{t('dialog.edit_track')}</h2>
                    <button onClick={onClose} className="dialog-close-button">×</button>
                </div>
                <form onSubmit={handleSubmit} className="dialog-form">
                    <div className="dialog-field">
                        <label>{t('dialog.track_title')}</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="dialog-input"
                            required
                            placeholder={t('dialog.enter_track_title')}
                        />
                    </div>
                    <div className="dialog-field">
                        <label>{t('dialog.track_number')}</label>
                        <input
                            type="number"
                            value={formData.track_number}
                            onChange={(e) => setFormData({ ...formData, track_number: parseInt(e.target.value) })}
                            className="dialog-input"
                            required
                            min="1"
                        />
                    </div>
                    <div className="dialog-field">
                        <label>{t('dialog.audio_file_optional')}</label>
                        <input
                            type="file"
                            accept="audio/*"
                            onChange={handleAudioChange}
                            className="dialog-input"
                        />
                        <small style={{ color: 'var(--text-tertiary)' }}>
                            {t('dialog.keep_existing_audio')}
                        </small>
                    </div>
                    <div className="dialog-field">
                        <label>{t('dialog.cover_image')}</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleCoverChange}
                            className="dialog-input"
                        />
                        <small style={{ color: 'var(--text-tertiary)', display: 'block', marginTop: '4px' }}>
                            {t('dialog.keep_existing_cover')}
                        </small>
                        {coverPreview && (
                            <div style={{ marginTop: '10px' }}>
                                <img
                                    src={coverPreview}
                                    alt={t('dialog.cover_preview')}
                                    style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '8px' }}
                                />
                            </div>
                        )}
                    </div>
                    <div className="dialog-actions">
                        <button type="button" onClick={onClose} className="dialog-button dialog-button-secondary">
                            {t('common.cancel')}
                        </button>
                        <button type="submit" className="dialog-button dialog-button-primary">
                            {t('dialog.update_track')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

EditTrackDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    track: PropTypes.object.isRequired,
};
