import { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from './ToastContainer';
import '../../css/dialog.css';
import useTranslation from '../hooks/useTranslation';

export default function EditPasswordDraggableBox({ isOpen, onClose, onSave }) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.password_confirmation) {
            toast.error(t('dialog.passwords_mismatch'));
            return;
        }

        if (formData.password.length < 8) {
            toast.error(t('dialog.password_min_length'));
            return;
        }

        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="draggable-box-overlay">
            <div className="draggable-box-container">
                <div className="draggable-box-header">
                    <h2>{t('dialog.edit_password')}</h2>
                    <button onClick={onClose} className="draggable-box-close-button">×</button>
                </div>
                <form onSubmit={handleSubmit} className="draggable-box-form">
                    <div className="draggable-box-field">
                        <label>{t('dialog.new_password')}</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="draggable-box-input"
                            placeholder={t('dialog.at_least_8_chars')}
                            required
                        />
                    </div>
                    <div className="draggable-box-field">
                        <label>{t('dialog.confirm_password')}</label>
                        <input
                            type="password"
                            value={formData.password_confirmation}
                            onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                            className="draggable-box-input"
                            placeholder={t('dialog.enter_confirm_password')}
                            required
                        />
                    </div>
                    <div className="draggable-box-actions">
                        <button type="button" onClick={onClose} className="draggable-box-button draggable-box-button-secondary">
                            {t('common.cancel')}
                        </button>
                        <button type="submit" className="draggable-box-button draggable-box-button-primary">
                            {t('dialog.change_password_btn')}
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
