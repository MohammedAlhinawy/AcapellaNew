import { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from './ToastContainer';
import '../../css/dialog.css';

export default function EditPasswordDraggableBox({ isOpen, onClose, onSave }) {
    const [formData, setFormData] = useState({
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.password_confirmation) {
            toast.error('Passwords do not match');
            return;
        }

        if (formData.password.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }

        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="draggable-box-overlay">
            <div className="draggable-box-container">
                <div className="draggable-box-header">
                    <h2>Change Password</h2>
                    <button onClick={onClose} className="draggable-box-close-button">×</button>
                </div>
                <form onSubmit={handleSubmit} className="draggable-box-form">
                    <div className="draggable-box-field">
                        <label>New Password</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="draggable-box-input"
                            placeholder="At least 8 characters"
                            required
                        />
                    </div>
                    <div className="draggable-box-field">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            value={formData.password_confirmation}
                            onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                            className="draggable-box-input"
                            placeholder="Confirm new password"
                            required
                        />
                    </div>
                    <div className="draggable-box-actions">
                        <button type="button" onClick={onClose} className="draggable-box-button draggable-box-button-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="draggable-box-button draggable-box-button-primary">
                            Change Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

EditPasswordDraggableBox.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
};
