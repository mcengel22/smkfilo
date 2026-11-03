import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en/translation.json';
import trTranslation from './locales/tr/translation.json';

const resources = {
    en: {
        translation: enTranslation
    },
    tr: {
        translation: trTranslation
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: localStorage.getItem('preferredLanguage') || "tr", // localStorage'dan dil tercihini al
        fallbackLng: "tr", // Çeviri bulunamazsa varsayılan dil
        supportedLngs: ["tr", "en"], // Desteklenen diller
        interpolation: {
            escapeValue: false
        },
        react: {
            useSuspense: false // Opsiyonel: Suspense kullanımını devre dışı bırakır
        },
        detection: {
            order: ['localStorage', 'navigator'],
        }
    });

// Dil değişimini dinle
i18n.on('languageChanged', (lng) => {
    document.documentElement.lang = lng;
    localStorage.setItem('preferredLanguage', lng);
});

export default i18n;
