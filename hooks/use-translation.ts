'use client';

import { useEffect, useState } from 'react';
import { getSettings } from '@/lib/storage';
import { dictionaries, Dictionary } from '@/lib/dictionaries';

export function useTranslation() {
    const [lang, setLang] = useState<'en' | 'es'>('en');

    useEffect(() => {
        // Poll for language changes since we're using localStorage without a context provider for now
        // Ideally we'd use a Context, but storage polling works for this simple requirement
        const loadLang = () => {
            const settings = getSettings();
            if (settings.appLanguage === 'es' || settings.appLanguage === 'en') {
                setLang(settings.appLanguage);
            }
        };

        loadLang();

        // Listen for storage events (cross-tab) or custom events if we dispatch them
        window.addEventListener('storage', loadLang);

        // Also a simple interval check to catch same-tab changes if we don't have a sophisticated event bus
        const interval = setInterval(loadLang, 1000);

        return () => {
            window.removeEventListener('storage', loadLang);
            clearInterval(interval);
        };
    }, []);

    return { t: dictionaries[lang], lang };
}
