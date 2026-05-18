import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../../css/dialog.css';

export default function CustomInputAlert({ isOpen, onClose, onConfirm, title, message, placeholder = '', confirmText = 'Confirm', cancelText = 'Cancel', type = 'primary' }) {
    const [isMobile, setIsMobile] = useState(false);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setInputValue('');
        }
    }, [isOpen]);

    const handleConfirm = () => {
        if (!inputValue.trim()) return;
        onConfirm(inputValue.trim());
        setInputValue('');
        onClose();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleConfirm();
        }
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
                        <p className="alert-message" style={{ marginBottom: '16px' }}>{message}</p>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholder}
                            className="dialog-input"
                            autoFocus
                        />
                        <div className="draggable-box-actions">
                            <button onClick={onClose} className="draggable-box-button draggable-box-button-secondary">
                                {cancelText}
                            </button>
                            <button 
                                onClick={handleConfirm} 
                                className={`draggable-box-button draggable-box-button-${type}`}
                                disabled={!inputValue.trim()}
                            >
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
                    <p className="alert-message" style={{ marginBottom: '16px' }}>{message}</p>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        className="dialog-input"
                        autoFocus
                    />
                    <div className="dialog-actions">
                        <button onClick={onClose} className="dialog-button dialog-button-secondary">
                            {cancelText}
                        </button>
                        <button 
                            onClick={handleConfirm} 
                            className={`dialog-button dialog-button-${type}`}
                            disabled={!inputValue.trim()}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

CustomInputAlert.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    confirmText: PropTypes.string,
    cancelText: PropTypes.string,
    type: PropTypes.string,
};
