import { useState } from 'react';
import { useLang } from './i18n.jsx';

// Motion policy: follow the OS "reduce motion" setting unless the visitor opts in to
// full motion (button below, or ?motion=full). Stored per browser.
const KEY = 'thilal-motion';

function override() {
  const q = new URLSearchParams(window.location.search).get('motion');
  if (q === 'full' || q === 'reduced') {
    try {
      localStorage.setItem(KEY, q);
    } catch {
      /* storage unavailable */
    }
    return q;
  }
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export const osPrefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// A page can choose its own default before applyMotionClass(): setMotionDefault('full') turns full motion on for every
// device and browser (the client's wish for Design 1.1), even when the OS asks for less; the visitor can still choose
// Reduce in the toggle. Without it, the OS setting decides.
let pageDefault = null;
export function setMotionDefault(level) {
  pageDefault = level === 'full' || level === 'reduced' ? level : null;
}

export function isMotionReduced() {
  const o = override();
  if (o === 'full') return false;
  if (o === 'reduced') return true;
  if (pageDefault) return pageDefault === 'reduced';
  return osPrefersReduced();
}

export function applyMotionClass() {
  document.documentElement.classList.toggle('motion-reduced', isMotionReduced());
}

function setMotion(level) {
  try {
    localStorage.setItem(KEY, level);
  } catch {
    /* storage unavailable */
  }
  const url = new URL(window.location.href);
  url.searchParams.delete('motion');
  window.location.replace(url.toString());
}

const COPY = {
  en: { reduced: 'Animations are reduced by your system setting.', enable: 'Turn on full motion', full: 'Full motion is on', reduce: 'Reduce' },
  ar: { reduced: 'الحركة مخففة حسب إعدادات جهازك.', enable: 'تفعيل الحركة الكاملة', full: 'الحركة الكاملة مفعّلة', reduce: 'تخفيف' },
};

export function MotionToggle() {
  const { lang } = useLang();
  const [dismissed, setDismissed] = useState(false);
  // a page that defaults to full motion (setMotionDefault('full')) asked for it on purpose: no notice over its content
  // on a page that defaults to full motion, only a visitor who chose Reduce sees the notice (to turn it back on)
  if (!osPrefersReduced() || dismissed || (pageDefault === 'full' && !isMotionReduced())) return null;
  const c = COPY[lang];
  const reduced = isMotionReduced();
  return (
    <div className={`motion-toggle ${reduced ? '' : 'is-full'}`} role="status">
      <span className="motion-toggle__dot" />
      <span className="motion-toggle__text">{reduced ? c.reduced : c.full}</span>
      <button onClick={() => setMotion(reduced ? 'full' : 'reduced')}>{reduced ? c.enable : c.reduce}</button>
      <button className="motion-toggle__x" onClick={() => setDismissed(true)} aria-label="Dismiss">×</button>
    </div>
  );
}
