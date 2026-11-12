import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { content } from './content.js';

const LangContext = createContext(null);

function initialLang() {
  const fromUrl = new URLSearchParams(window.location.search).get('lang');
  if (fromUrl === 'ar' || fromUrl === 'en') return fromUrl;
  try {
    const saved = localStorage.getItem('thilal-lang');
    if (saved === 'ar' || saved === 'en') return saved;
  } catch {
    /* storage unavailable */
  }
  return 'ar';
}

export function LangProvider({ children }) {
  const [lang, setLang] = useState(initialLang);
  const t = content[lang];

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = t.dir;
    document.title = t.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description);
    try {
      localStorage.setItem('thilal-lang', lang);
    } catch {
      /* storage unavailable */
    }
  }, [lang, t]);

  const toggle = useCallback(() => setLang((l) => (l === 'en' ? 'ar' : 'en')), []);
  const value = useMemo(() => ({ lang, t, isRTL: t.dir === 'rtl', toggle, setLang }), [lang, t, toggle]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
