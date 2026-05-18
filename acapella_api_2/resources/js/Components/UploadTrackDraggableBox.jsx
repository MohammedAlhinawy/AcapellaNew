import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../../css/dialog.css';
import CustomAudioPlayer from './CustomAudioPlayer';
import AlbumComboBox from './AlbumComboBox';

export default function UploadTrackDraggableBox({ isOpen, onClose, onSave, albums, tracks = [] }) {
    const [formData, setFormData] = useState({
        title: '',
        track_number: 1,
        album_id: '',
        audio_file: null,
        cover_file: null,
        duration_sec: 0,
    });
    const [audioPreview, setAudioPreview] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);

    // Calculate next track number when dialog opens
    useEffect(() => {
        if (isOpen && tracks.length > 0) {
            const maxTrackNumber = tracks.reduce((max, track) => {
                return track.track_number > max ? track.track_number : max;
            }, 0);
            setFormData(prev => ({ ...prev, track_number: maxTrackNumber + 1 }));
        } else if (isOpen) {
            setFormData(prev => ({ ...prev, track_number: 1 }));
        }
    }, [isOpen, tracks]);

    const resetForm = () => {
        const nextTrackNumber = tracks.length > 0
            ? tracks.reduce((max, track) => track.track_number > max ? track.track_number : max, 0) + 1
            : 1;
        setFormData({
            title: '',
            track_number: nextTrackNumber,
            album_id: '',
            audio_file: null,
            cover_file: null,
            duration_sec: 0,
        });
        setAudioPreview(null);
        setCoverPreview(null);
    };

    const handleAudioChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, audio_file: file, duration_sec: 0 });
            setAudioPreview(URL.createObjectURL(file));

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
        resetForm();
    };

    const handleClose = () => {
        resetForm();
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
                    <h2>Upload Track</h2>
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
                        <label>Album (Optional)</label>
                        <AlbumComboBox
                            albums={albums}
                            value={formData.album_id}
                            onChange={(value) => setFormData({ ...formData, album_id: value })}
                            placeholder="Select an album or leave empty"
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
                        <label>Audio File</label>
                        <input
                            type="file"
                            accept="audio/*"
                            onChange={handleAudioChange}
                            className="draggable-box-input"
                            required
                        />
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
                            Upload Track
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

UploadTrackDraggableBox.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    albums: PropTypes.array.isRequired,
    tracks: PropTypes.array,
};
