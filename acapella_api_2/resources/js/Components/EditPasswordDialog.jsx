import { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from './ToastContainer';
import '../../css/dialog.css';

export default function EditPasswordDialog({ isOpen, onClose, onSave }) {
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
        <div className="dialog-overlay">
            <div className="dialog-container">
                <div className="dialog-header">
                    <h2>Change Password</h2>
                    <button onClick={onClose} className="dialog-close-button">×</button>
                </div>
                <form onSubmit={handleSubmit} className="dialog-form">
                    <div className="dialog-field">
                        <label>New Password</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="dialog-input"
                            placeholder="At least 8 characters"
                            required
                        />
                    </div>
                    <div className="dialog-field">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            value={formData.password_confirmation}
                            onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                            className="dialog-input"
                            placeholder="Confirm new password"
                            required
                        />
                    </div>
                    <div className="dialog-actions">
                        <button type="button" onClick={onClose} className="dialog-button dialog-button-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="dialog-button dialog-button-primary">
                            Change Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

EditPasswordDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
};
