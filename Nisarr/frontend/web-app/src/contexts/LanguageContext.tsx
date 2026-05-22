import React, { createContext, useContext, useEffect, useState } from 'react';

type Language = 'en' | 'bn';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    toggleLanguage: () => void;
    t: (key: string, section?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('lifeos-language') as Language;
            return stored || 'en';
        }
        return 'en';
    });

    useEffect(() => {
        localStorage.setItem('lifeos-language', language);
    }, [language]);

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === 'en' ? 'bn' : 'en'));
    };

    // Simple translation helper
    // usage: t('welcome.title') -> looks up translations[language]['welcome']['title']
    const t = (key: string): string => {
        // This will be connected to the actual data in the components or a global store
        // For now, we'll expose the language and let components handle the lookup 
        // or we can import the translations here. 
        // Let's actually keep the data lookup simple in the hook for now.
        return key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
