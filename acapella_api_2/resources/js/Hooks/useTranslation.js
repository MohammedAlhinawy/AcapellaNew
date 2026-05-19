import { usePage } from '@inertiajs/react';

export default function useTranslation() {
    const { props } = usePage();
    const { translations, locale, availableLocales } = props;

    // Resolve nested key path (e.g., 'nav.home' -> translations.nav.home)
    const resolvePath = (obj, path) => {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : null;
        }, obj);
    };

    // Apply parameter replacements (e.g., { year: 2024 } replaces :year in string)
    const applyReplacements = (str, replacements) => {
        if (!replacements || typeof replacements !== 'object') {
            return str;
        }
        return str.replace(/:(\w+)/g, (match, key) => {
            return replacements[key] !== undefined ? replacements[key] : match;
        });
    };

    // Translation function
    const t = (key, replacements = {}) => {
        const value = resolvePath(translations, key);
        if (value === null) {
            return key; // Return key if translation not found
        }
        return applyReplacements(value, replacements);
    };

    // Switch locale function — POSTs to /locale endpoint
    const switchLocale = async (newLocale) => {
        try {
            const csrfMeta = document.querySelector('meta[name="csrf-token"]');
            const csrfToken = csrfMeta ? csrfMeta.getAttribute('content') : '';

            const formData = new FormData();
            formData.append('locale', newLocale);
            formData.append('_token', csrfToken);

            const response = await fetch('/locale', {
                method: 'POST',
                body: formData,
                credentials: 'same-origin',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'text/html',
                },
            });

            if (response.redirected) {
                window.location.href = response.url;
            } else {
                window.location.reload();
            }
        } catch (error) {
            console.error('Failed to switch locale:', error);
        }
    };

    return {
        t,
        locale,
        availableLocales,
        translations,
        switchLocale,
    };
}
