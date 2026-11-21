import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import frTranslation from './locales/fr/translation.json';
import arTranslation from './locales/ar/translation.json';

const initialLang = localStorage.getItem('dz_lang') || 'fr';

const resources = {
  fr: { translation: frTranslation },
  ar: { translation: arTranslation },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLang,
    fallbackLng: 'fr',
    supportedLngs: ['fr', 'ar'],
    interpolation: {
      escapeValue: false,
    },
  });

// Apply document direction whenever language changes
const updateDirection = (lang: string) => {
  const isRtl = lang.startsWith('ar');
  document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  document.documentElement.lang = isRtl ? 'ar' : 'fr';
  localStorage.setItem('dz_lang', lang);
};

i18n.on('languageChanged', (lang) => {
  updateDirection(lang);
});

// Initial direction setting
updateDirection(initialLang);

export default i18n;
