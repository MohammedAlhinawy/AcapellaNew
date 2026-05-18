import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { toast } from './ToastContainer';
import '../../css/profile.css';

export default function LanguageSelector() {
    const [language, setLanguage] = useState('en');
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
    const buttonRef = useRef(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language') || 'en';
        setLanguage(savedLanguage);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                buttonRef.current && !buttonRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggle = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + 8,
                left: rect.left,
                width: rect.width
            });
        }
        setIsOpen(!isOpen);
    };

    const handleLanguageChange = (newLanguage) => {
        setLanguage(newLanguage);
        localStorage.setItem('language', newLanguage);
        setIsOpen(false);
        toast.success(`Language changed to ${newLanguage === 'en' ? 'English' : 'Swahili'}`);
    };

    const languages = [
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'sw', name: 'Swahili', flag: '🇹🇿' },
    ];

    const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

    return (
        <div className="luxury-info-item-language">
            <span className="luxury-info-label">Language</span>
            <div className="luxury-selector-container">
                <button 
                    ref={buttonRef}
                    className="luxury-selector-button"
                    onClick={handleToggle}
                >
                    <span className="luxury-selector-value">
                        {currentLanguage.flag} {currentLanguage.name}
                    </span>
                    <span className={`luxury-selector-arrow ${isOpen ? 'open' : ''}`}>▼</span>
                </button>
                
                {isOpen && createPortal(
                    <div 
                        ref={dropdownRef}
                        className="luxury-selector-dropdown"
                        style={{
                            position: 'fixed',
                            top: `${dropdownPosition.top}px`,
                            left: `${dropdownPosition.left}px`,
                            width: `${dropdownPosition.width}px`
                        }}
                    >
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                className={`luxury-selector-option ${language === lang.code ? 'selected' : ''}`}
                                onClick={() => handleLanguageChange(lang.code)}
                            >
                                <span className="luxury-selector-option-flag">{lang.flag}</span>
                                <span className="luxury-selector-option-name">{lang.name}</span>
                                {language === lang.code && <span className="luxury-selector-option-check">✓</span>}
                            </button>
                        ))}
                    </div>,
                    document.body
                )}
            </div>
        </div>
    );
}
