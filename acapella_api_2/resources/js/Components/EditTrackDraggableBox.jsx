import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../../css/dialog.css';
import CustomAudioPlayer from './CustomAudioPlayer';

export default function EditTrackDraggableBox({ isOpen, onClose, onSave, track }) {
    const [formData, setFormData] = useState({
        title: '',
        track_number: 1,
        audio_file: null,
        cover_file: null,
        duration_sec: 0,
    });
    const [audioPreview, setAudioPreview] = useState(null);
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
            setAudioPreview(null);
            setCoverPreview(track.cover_path || null);
        }
    }, [track]);

    const handleAudioChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, audio_file: file, duration_sec: 0 });
            setAudioPreview(URL.createObjectURL(file));

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

    const handleClose = () => {
        setAudioPreview(null);
        onClose();
    };

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    return (
        <div className="draggable-box-overlay" onClick={handleOverlayClick}>
            <div className="draggable-box-container" onClick={(e) => e.stopPropagation()}>
                <div className="draggable-box-header">
                    <h2>Edit Track</h2>
                    <button onClick={handleClose} className="draggable-box-close-button">×</button>
                </div>
                <form onSubmit={handleSubmit} className="draggable-box-form">
                    <div className="draggable-box-field">
                        <label>Track Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="draggable-box-input"
                            required
                            placeholder="Enter track title"
                        />
                    </div>
                    <div className="draggable-box-field">
                        <label>Track Number</label>
                        <input
                            type="number"
                            value={formData.track_number}
                            onChange={(e) => setFormData({ ...formData, track_number: parseInt(e.target.value) })}
                            className="draggable-box-input"
                            required
                            min="1"
                        />
                    </div>
                    <div className="draggable-box-field">
                        <label>Audio File (Optional)</label>
                        <input
                            type="file"
                            accept="audio/*"
                            onChange={handleAudioChange}
                            className="draggable-box-input"
                        />
                        <small style={{ color: 'var(--text-tertiary)', display: 'block', marginTop: '4px' }}>
                            Leave empty to keep existing audio file
                        </small>
                        {audioPreview && (
                            <CustomAudioPlayer src={audioPreview} />
                        )}
                    </div>
                    <div className="draggable-box-field">
                        <label>Cover Image (Optional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleCoverChange}
                            className="draggable-box-input"
                        />
                        <small style={{ color: 'var(--text-tertiary)', display: 'block', marginTop: '4px' }}>
                            Leave empty to keep existing cover
                        </small>
                        {coverPreview && (
                            <div style={{ marginTop: '10px' }}>
                                <img
                                    src={coverPreview}
                                    alt="Cover preview"
                                    style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '8px' }}
                                />
                            </div>
                        )}
                    </div>
                    <div className="draggable-box-actions">
                        <button type="button" onClick={handleClose} className="draggable-box-button draggable-box-button-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="draggable-box-button draggable-box-button-primary">
                            Update Track
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

EditTrackDraggableBox.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    track: PropTypes.object.isRequired,
};
