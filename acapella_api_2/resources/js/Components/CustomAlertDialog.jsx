import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../../css/dialog.css';

export default function CustomAlertDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', type = 'danger' }) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    if (!isOpen) return null;

    if (isMobile) {
        return (
            <div className="draggable-box-overlay">
                <div className="draggable-box-container">
                    <div className="draggable-box-header">
                        <h2>{title}</h2>
                        <button onClick={onClose} className="draggable-box-close-button">×</button>
                    </div>
                    <div className="draggable-box-form">
                        <p className="alert-message">{message}</p>
                        <div className="draggable-box-actions">
                            <button onClick={onClose} className="draggable-box-button draggable-box-button-secondary">
                                {cancelText}
                            </button>
                            <button onClick={handleConfirm} className={`draggable-box-button draggable-box-button-${type}`}>
                                {confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="dialog-overlay">
            <div className="dialog-container">
                <div className="dialog-header">
                    <h2>{title}</h2>
                    <button onClick={onClose} className="dialog-close-button">×</button>
                </div>
                <div className="dialog-form">
                    <p className="alert-message">{message}</p>
                    <div className="dialog-actions">
                        <button onClick={onClose} className="dialog-button dialog-button-secondary">
                            {cancelText}
                        </button>
                        <button onClick={handleConfirm} className={`dialog-button dialog-button-${type}`}>
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

CustomAlertDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    confirmText: PropTypes.string,
    cancelText: PropTypes.string,
    type: PropTypes.string,
};
