import { useState, useEffect } from 'react';
import useTranslation from '../hooks/useTranslation';
import '../css/language-toggle.css';

export default function LanguageToggle() {
    const { locale } = useTranslation();
    const [currentLocale, setCurrentLocale] = useState(locale);

    useEffect(() => {
        setCurrentLocale(locale);
    }, [locale]);

    const handleLanguageChange = async () => {
        const newLanguage = currentLocale === 'en' ? 'sw' : 'en';
        
        localStorage.setItem('language', newLanguage);
        setCurrentLocale(newLanguage);

        // Create a hidden form to submit
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/locale';

        const localeInput = document.createElement('input');
        localeInput.type = 'hidden';
        localeInput.name = 'locale';
        localeInput.value = newLanguage;

        const csrfMeta = document.querySelector('meta[name="csrf-token"]');
        if (csrfMeta) {
            const csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = '_token';
            csrfInput.value = csrfMeta.getAttribute('content');
            form.appendChild(csrfInput);
        }

        form.appendChild(localeInput);
        document.body.appendChild(form);
        form.submit();
    };

    const currentFlag = currentLocale === 'en' ? '/images/flags/tanzania.svg' : '/images/flags/uk.svg' ;
    const currentLabel = currentLocale === 'en' ? 'English' : 'Swahili';

    return (
        <div className="language-toggle-fixed">
            <button
                type="button"
                className="language-toggle-button"
                onClick={handleLanguageChange}
                aria-label={`Switch to ${currentLocale === 'en' ? 'Swahili' : 'English'}`}
                title={currentLabel}
            >
                <img
                    src={currentFlag}
                    alt={currentLabel}
                    className="language-toggle-flag"
                />
            </button>
        </div>
    );
}
