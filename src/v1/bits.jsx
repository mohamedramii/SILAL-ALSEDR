// Design 1 "The Graft": small shared pieces (leaf and nabq shapes from the logo, hooks, links).
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ScrollTrigger } from '@shared/gsap.js';
import { getLenis } from '@shared/useSmoothScroll.js';
import { isMotionReduced } from '@shared/motion.jsx';

// read lazily: main.jsx sets the page default (full motion) before the first render
let motionCache = null;
export const isReduced = () => (motionCache ??= isMotionReduced());

// the logo's leaf: base at 0,0, tip at L,0, with the curved light cut of the midrib
export const leafPath = (L) =>
  `M0 0 C ${L * 0.2} ${-L * 0.34}, ${L * 0.66} ${-L * 0.4}, ${L} ${-L * 0.02} C ${L * 0.7} ${L * 0.3}, ${L * 0.26} ${L * 0.3}, 0 0 Z`;
export const ribPath = (L) => `M${L * 0.08} ${L * 0.02} C ${L * 0.36} ${-L * 0.02}, ${L * 0.62} ${-L * 0.1}, ${L * 0.9} ${-L * 0.05}`;

export function Leaf({ L = 30, tone = 'light', className }) {
  return (
    <g className={className}>
      <path d={leafPath(L)} fill={tone === 'light' ? 'var(--leaf-light)' : 'var(--leaf-dark)'} />
      <path d={ribPath(L)} fill="none" stroke="var(--paper)" strokeWidth={Math.max(1.2, L * 0.05)} strokeLinecap="round" opacity="0.85" />
    </g>
  );
}

// a nabq fruit hanging from 0,0
export function Fruit({ r = 9, tone = 'gold', className }) {
  return (
    <g className={className}>
      <path d={`M0 0 Q ${r * 0.3} ${r * 0.4} 0 ${r * 0.75}`} stroke="var(--bark-2)" strokeWidth="1.6" fill="none" />
      <ellipse cx="0" cy={r * 0.75 + r * 1.05} rx={r * 0.92} ry={r * 1.08} fill={`url(#v1-fruit-${tone})`} />
      <ellipse cx={-r * 0.3} cy={r * 0.75 + r * 0.7} rx={r * 0.22} ry={r * 0.32} fill="#fff" opacity="0.45" />
    </g>
  );
}

export function FruitDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }} focusable="false">
      <defs>
        <radialGradient id="v1-fruit-gold" cx="38%" cy="32%" r="78%">
          <stop offset="0" stopColor="#F7E2A0" />
          <stop offset="0.5" stopColor="#DDAA45" />
          <stop offset="1" stopColor="#A86E22" />
        </radialGradient>
        <radialGradient id="v1-fruit-green" cx="38%" cy="32%" r="78%">
          <stop offset="0" stopColor="#E8F0B0" />
          <stop offset="0.55" stopColor="#B3C95C" />
          <stop offset="1" stopColor="#6E8E38" />
        </radialGradient>
        <radialGradient id="v1-fruit-red" cx="38%" cy="32%" r="78%">
          <stop offset="0" stopColor="#F4C58E" />
          <stop offset="0.55" stopColor="#D0782F" />
          <stop offset="1" stopColor="#97461C" />
        </radialGradient>
        <linearGradient id="v1-bark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7A6848" />
          <stop offset="0.45" stopColor="#544631" />
          <stop offset="1" stopColor="#3A3022" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// the logo's double oval, drawn
export function DoubleOval({ className, w = 400, h = 240 }) {
  return (
    <svg className={className} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" focusable="false">
      <ellipse cx={w / 2} cy={h / 2} rx={w / 2 - 4} ry={h / 2 - 4} fill="none" stroke="var(--leaf-dark)" strokeWidth="4" />
      <ellipse cx={w / 2} cy={h / 2} rx={w / 2 - 16} ry={h / 2 - 14} fill="none" stroke="var(--leaf-light)" strokeWidth="2.5" />
    </svg>
  );
}

export function useMedia(query) {
  const [match, setMatch] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const m = window.matchMedia(query);
    const on = () => setMatch(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, [query]);
  return match;
}

export const headerH = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hh')) || 64;

// A pinned scene that moves through `count` steps as the page scrolls (full motion only).
// onProgress(p) gets 0..1; goTo(i) scrolls to step i. Returns null goTo when not pinned.
export function usePinnedSteps(stageRef, count, onProgress, { enabled = true, per = 0.55, deps = [] } = {}) {
  const st = useRef(null);
  const cb = useRef(onProgress);
  cb.current = onProgress;
  useLayoutEffect(() => {
    if (!enabled || !stageRef.current) return undefined;
    const trigger = ScrollTrigger.create({
      trigger: stageRef.current,
      start: () => `top top+=${headerH()}`,
      end: () => `+=${Math.round((count - 1) * per * window.innerHeight)}`,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => cb.current(self.progress),
    });
    st.current = trigger;
    cb.current(trigger.progress);
    return () => {
      trigger.kill();
      st.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, count, per, ...deps]);
  const goTo = (i) => {
    const t = st.current;
    if (!t) return false;
    const y = t.start + (i / (count - 1)) * (t.end - t.start) + (i === 0 ? 2 : 0);
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y, behavior: isReduced() ? 'auto' : 'smooth' });
    return true;
  };
  return goTo;
}

export function Ext({ href, children, className, label, newTab, ...rest }) {
  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} {...rest}>
      {children}
      {newTab ? <span className="sr-only"> {newTab}</span> : null}
    </a>
  );
}

// a simple arrow that points to the reading direction's "next"
export function Arrow({ dir = 'next', size = 20 }) {
  return (
    <svg className={`arrow arrow--${dir}`} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function WaIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12 2a9.9 9.9 0 0 0-8.5 15l-1.4 5 5.1-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"
      />
    </svg>
  );
}
