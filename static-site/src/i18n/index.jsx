/**
 * Lightweight i18n module for the H5 Games Portal.
 *
 * - Detects browser language on first load.
 * - Lazy-loads locale JSON files.
 * - Falls back to en-US for missing keys.
 * - Provides a React hook `useI18n()` that returns `{ t, locale, setLocale }`.
 * - Supports simple interpolation: t('key', { count: 5 }) → "Page 5"
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// All supported locale codes (must match filenames in ./locales/)
const SUPPORTED_LOCALES = [
  'en-US', 'ar', 'de-DE', 'es-ES', 'fr-FR', 'hi-IN', 'id-ID', 'it-IT',
  'ja-JP', 'ko-KR', 'ms-MY', 'pl-PL', 'pt-PT', 'pt-BR', 'ru-RU', 'th-TH',
  'fil-PH', 'tr-TR', 'uk-UA', 'vi-VN', 'zh-CN', 'zh-TW', 'kk-KZ', 'lo-LA',
  'km-KH', 'ml-IN', 'mr-IN', 'my-MM', 'nl-NL', 'or-IN', 'ne-NP', 'pa-IN',
  'si-LK', 'sw-KE', 'te-IN', 'ta-IN', 'ur-PK', 'uz-UZ', 'gu-IN', 'ha-NG',
  'kn-IN', 'fa-IR', 'bn-BD', 'as-IN'
];

const DEFAULT_LOCALE = 'en-US';
const STORAGE_KEY = 'app_locale';

// Locale data cache (loaded at runtime)
const localeCache = {};

/**
 * Detect the best locale for the current user.
 * Priority: localStorage > navigator.language > default
 */
function detectLocale() {
  // 1. Check localStorage
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_LOCALES.includes(stored)) return stored;
  } catch (e) {
    // localStorage may be unavailable in some WebView contexts
  }

  // 2. Check browser language
  const browserLangs = navigator.languages || [navigator.language];
  for (const lang of browserLangs) {
    // Exact match
    if (SUPPORTED_LOCALES.includes(lang)) return lang;
    // Prefix match (e.g. "zh" → "zh-CN")
    const prefix = lang.split('-')[0];
    const match = SUPPORTED_LOCALES.find(l => l.startsWith(prefix));
    if (match) return match;
  }

  return DEFAULT_LOCALE;
}

/**
 * Dynamically import a locale JSON file.
 */
async function loadLocale(locale) {
  if (localeCache[locale]) return localeCache[locale];

  try {
    // Vite dynamic import with glob pattern
    const modules = import.meta.glob('./locales/*.json');
    const path = `./locales/${locale}.json`;
    if (modules[path]) {
      const mod = await modules[path]();
      localeCache[locale] = mod.default || mod;
      return localeCache[locale];
    }
  } catch (e) {
    console.warn(`[i18n] Failed to load locale: ${locale}`, e);
  }

  return null;
}

/**
 * Simple string interpolation.
 * t('home.pageInfo', { currentPage: 1, totalPages: 5 })
 * Template: "Page {currentPage} / {totalPages}" → "Page 1 / 5"
 */
function interpolate(template, vars) {
  if (!vars || typeof template !== 'string') return template;
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return vars[key] !== undefined ? vars[key] : match;
  });
}

// --- React Context ---

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(DEFAULT_LOCALE);
  const [messages, setMessages] = useState({});
  const [fallback, setFallback] = useState({});
  const [ready, setReady] = useState(false);

  // Load fallback (en-US) on mount
  useEffect(() => {
    loadLocale(DEFAULT_LOCALE).then(data => {
      if (data) setFallback(data);
    });
  }, []);

  // Detect and load locale on mount
  useEffect(() => {
    const detected = detectLocale();
    setLocaleState(detected);

    loadLocale(detected).then(data => {
      if (data) setMessages(data);
      setReady(true);
    });
  }, []);

  // Set locale (callable from UI)
  const setLocale = useCallback(async (newLocale) => {
    if (!SUPPORTED_LOCALES.includes(newLocale)) {
      console.warn(`[i18n] Unsupported locale: ${newLocale}`);
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
    } catch (e) {
      // Ignore
    }

    const data = await loadLocale(newLocale);
    if (data) {
      setMessages(data);
      setLocaleState(newLocale);
    }
  }, []);

  // Translation function
  const t = useCallback((key, vars) => {
    const msg = messages[key] || fallback[key] || key;
    return interpolate(msg, vars);
  }, [messages, fallback]);

  return (
    <I18nContext.Provider value={{ t, locale, setLocale, ready, supportedLocales: SUPPORTED_LOCALES }}>
      {children}
    </I18nContext.Provider>
  );
}

/**
 * Hook to access i18n in components.
 * const { t, locale, setLocale } = useI18n();
 */
export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Fallback for components rendered outside provider (shouldn't happen)
    return {
      t: (key) => key,
      locale: DEFAULT_LOCALE,
      setLocale: () => {},
      ready: false,
      supportedLocales: SUPPORTED_LOCALES
    };
  }
  return ctx;
}

export { SUPPORTED_LOCALES, DEFAULT_LOCALE };
