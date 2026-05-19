import { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from './ToastContainer';
import '../../css/dialog.css';
import useTranslation from '../hooks/useTranslation';

export default function EditPasswordDialog({ isOpen, onClose, onSave }) {
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
        <div className="dialog-overlay">
            <div className="dialog-container">
                <div className="dialog-header">
                    <h2>{t('dialog.edit_password')}</h2>
                    <button onClick={onClose} className="dialog-close-button">×</button>
                </div>
                <form onSubmit={handleSubmit} className="dialog-form">
                    <div className="dialog-field">
                        <label>{t('dialog.new_password')}</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="dialog-input"
                            placeholder={t('dialog.at_least_8_chars')}
                            required
                        />
                    </div>
                    <div className="dialog-field">
                        <label>{t('dialog.confirm_password')}</label>
                        <input
                            type="password"
                            value={formData.password_confirmation}
                            onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                            className="dialog-input"
                            placeholder={t('dialog.enter_confirm_password')}
                            required
                        />
                    </div>
                    <div className="dialog-actions">
                        <button type="button" onClick={onClose} className="dialog-button dialog-button-secondary">
                            {t('common.cancel')}
                        </button>
                        <button type="submit" className="dialog-button dialog-button-primary">
                            {t('dialog.change_password_btn')}
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
