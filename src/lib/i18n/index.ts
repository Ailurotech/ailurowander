import { browser } from '$app/environment';
import { derived, writable } from 'svelte/store';

// Define supported languages
export const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ja', name: '日本語' },
  { code: 'es', name: 'Español' },
];

// Define default language (Chinese)
export const defaultLanguage = 'zh';

// Check if the initial locale is supported, if not use default
const checkLocale = (locale: string) => {
  const supportedCodes = supportedLanguages.map(lang => lang.code);
  return supportedCodes.includes(locale) ? locale : defaultLanguage;
};

// Get browser language or use default
const getInitialLocale = () => {
  if (!browser) return defaultLanguage;

  const savedLocale = localStorage.getItem('preferred-language');
  if (savedLocale) return checkLocale(savedLocale);

  const browserLang = window.navigator.language.split('-')[0];
  return checkLocale(browserLang);
};

// Import translation files
import en from './translations/en.json';
import zh from './translations/zh.json';
import de from './translations/de.json';
import ja from './translations/ja.json';
import es from './translations/es.json';

// Store current locale
export const locale = writable<string>(browser ? getInitialLocale() : defaultLanguage);

// Translation dictionary
const translations: Record<string, any> = {
  en,
  zh,
  de,
  ja,
  es,
};

// Derived store for current translation
export const t = derived(locale, $locale => {
  // Get the translations for the locale or use default
  const translation = translations[$locale] || translations[defaultLanguage];

  // Return a function that can be used to get a specific key
  return (key: string) => {
    // Split the key by dots to access nested properties
    return key.split('.').reduce((obj, part) => obj && obj[part], translation as any) || key;
  };
});

// Function to load translations for the current locale
export const loadTranslations = async (newLocale: string = defaultLanguage) => {
  const checkedLocale = checkLocale(newLocale);

  if (browser) {
    localStorage.setItem('preferred-language', checkedLocale);
  }

  locale.set(checkedLocale);

  return checkedLocale;
};

// Function to set locale with persistence
export const setLocale = (newLocale: string) => {
  const checkedLocale = checkLocale(newLocale);

  if (browser) {
    localStorage.setItem('preferred-language', checkedLocale);
  }

  locale.set(checkedLocale);

  return checkedLocale;
};

// Get the locale from URL path
export const getLocaleFromPath = (path: string): string | null => {
  const pathSegments = path.split('/').filter(Boolean);
  const firstSegment = pathSegments[0];

  if (firstSegment && supportedLanguages.some(lang => lang.code === firstSegment)) {
    return firstSegment;
  }

  return null;
};

// Get the path with locale
export const getPathWithLocale = (path: string, newLocale: string): string => {
  const currentLocale = getLocaleFromPath(path);

  if (currentLocale) {
    return path.replace(`/${currentLocale}`, `/${newLocale}`);
  }

  const pathWithoutLeadingSlash = path.startsWith('/') ? path.substring(1) : path;
  return `/${newLocale}/${pathWithoutLeadingSlash}`;
};
