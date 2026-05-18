import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../../css/dialog.css';

export default function EditProfileDraggableBox({ isOpen, onClose, user, onSave }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
            });
        }
    }, [user]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="draggable-box-overlay">
            <div className="draggable-box-container">
                <div className="draggable-box-header">
                    <h2>Edit Profile</h2>
                    <button onClick={onClose} className="draggable-box-close-button">×</button>
                </div>
                <form onSubmit={handleSubmit} className="draggable-box-form">
                    <div className="draggable-box-field">
                        <label>Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="draggable-box-input"
                            required
                        />
                    </div>
                    <div className="draggable-box-field">
                        <label>Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="draggable-box-input"
                            required
                        />
                    </div>
                    <div className="draggable-box-actions">
                        <button type="button" onClick={onClose} className="draggable-box-button draggable-box-button-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="draggable-box-button draggable-box-button-primary">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

EditProfileDraggableBox.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    onSave: PropTypes.func.isRequired,
};
