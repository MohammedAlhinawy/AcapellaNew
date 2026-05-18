import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../../css/dialog.css';

export default function EditChoirDialog({ isOpen, onClose, onSave, choir }) {
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        bio: '',
        image: null,
    });
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (choir) {
            setFormData({
                name: choir.name,
                location: choir.location,
                bio: choir.bio || '',
                image: null,
            });
            if (choir.image_path) {
                setImagePreview(choir.image_path);
            }
        }
    }, [choir]);

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
        <div className="dialog-overlay">
            <div className="dialog-container">
                <div className="dialog-header">
                    <h2>Edit Choir</h2>
                    <button onClick={onClose} className="dialog-close-button">×</button>
                </div>
                <form onSubmit={handleSubmit} className="dialog-form">
                    <div className="dialog-field">
                        <label>Choir Image</label>
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
                                    alt="Preview"
                                    style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }}
                                />
                            </div>
                        )}
                    </div>
                    <div className="dialog-field">
                        <label>Choir Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="dialog-input"
                            required
                            placeholder="Enter choir name"
                        />
                    </div>
                    <div className="dialog-field">
                        <label>Location</label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="dialog-input"
                            required
                            placeholder="Enter location (e.g., Dar es Salaam, Tanzania)"
                        />
                    </div>
                    <div className="dialog-field">
                        <label>Bio</label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            className="dialog-input"
                            rows={4}
                            placeholder="Describe your choir (optional)"
                        />
                    </div>
                    <div className="dialog-actions">
                        <button type="button" onClick={onClose} className="dialog-button dialog-button-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="dialog-button dialog-button-primary">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

EditChoirDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    choir: PropTypes.object.isRequired,
};
