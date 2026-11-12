// Hero: an Omani Sidr orchard at sunset (their profile photo). The visitor moves the sun along its arc (drag the disc,
// tap the sky, or use the keyboard); the canopy shade slides and stretches with it and the light warms or cools with
// the sun's height. The sun writes CSS variables on <html>, so every shade layer on the page follows the same sun.
import { useEffect, useRef } from 'react';
import { WhatsappIcon, ArrowDown01Icon } from '@hugeicons/core-free-icons';
import { useLang } from '@shared/i18n.jsx';
import { LINKS, BRAND } from '@shared/content.js';
import { Icon } from '@shared/Icon.jsx';
import { gsap } from '@shared/gsap.js';
import { isMotionReduced } from '@shared/motion.jsx';
import { goToId } from './nav.js';
import { Shade } from './Shade.jsx';
import { COPY } from './copy.js';

const IMG = { w: 2560, h: 1429, sunU: 0.588, sunV: 0.338 }; // where the sun sets in pdf-p04-258
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

function geometry(box, img) {
  const W = box.clientWidth;
  const H = box.clientHeight;
  const pos = (getComputedStyle(img).objectPosition || '50% 50%').split(' ').map((p) => parseFloat(p) / 100);
  const sc = Math.max(W / IMG.w, H / IMG.h);
  const dw = IMG.w * sc;
  const dh = IMG.h * sc;
  const x1 = clamp((W - dw) * (pos[0] ?? 0.5) + IMG.sunU * dw, W * 0.5, W * 0.9);
  const phone = W < 700;
  const y1 = clamp((H - dh) * (pos[1] ?? 0.5) + IMG.sunV * dh, H * 0.2, H * (phone ? 0.32 : 0.48));
  return { W, H, x0: W * (phone ? 0.1 : 0.07), y0: y1 + H * (phone ? 0.03 : 0.06), x1, y1, top: Math.max(H * (phone ? 0.08 : 0.1), 44) };
}

function pointAt(g, t) {
  const bx = g.x0 + (g.x1 - g.x0) * t;
  const by = g.y0 + (g.y1 - g.y0) * t;
  return [bx, by - Math.sin(Math.PI * t) * (by - g.top)];
}

function timeIndex(t) {
  if (t < 0.12) return 0;
  if (t < 0.38) return 1;
  if (t < 0.62) return 2;
  if (t < 0.88) return 3;
  return 4;
}

export function Hero() {
  const { lang, t: tx } = useLang();
  const c = COPY[lang];
  const boxRef = useRef(null);
  const imgRef = useRef(null);
  const sunRef = useRef(null);
  const pathRef = useRef(null);
  const timeRef = useRef(null);
  const hintRef = useRef(null);
  const state = useRef({ t: 0.95, g: null, touched: false });
  const timesRef = useRef(c.hero.times);
  timesRef.current = c.hero.times;

  useEffect(() => {
    const box = boxRef.current;
    const img = imgRef.current;
    const sun = sunRef.current;
    const root = document.documentElement;
    const reduced = isMotionReduced();
    let raf = 0;

    const apply = () => {
      raf = 0;
      const s = state.current;
      if (!s.g) return;
      const t = s.t;
      const h = Math.sin(Math.PI * t);
      const low = 1 - h;
      const [x, y] = pointAt(s.g, t);
      const dx = 0.5 - x / s.g.W; // > 0: the sun is on the left, so the shade falls to the right
      sun.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      root.style.setProperty('--sun-x', `${x.toFixed(1)}px`);
      root.style.setProperty('--sun-y', `${y.toFixed(1)}px`);
      root.style.setProperty('--sh-x', `${(dx * (240 + 560 * low)).toFixed(1)}px`);
      root.style.setProperty('--sh-y', `${(low * 46 - 10).toFixed(1)}px`);
      root.style.setProperty('--sh-skew', `${(dx * low * 52).toFixed(2)}deg`);
      root.style.setProperty('--sh-sx', (1 + low * 0.55).toFixed(3));
      root.style.setProperty('--sh-op', (0.42 + h * 0.24).toFixed(3));
      root.style.setProperty('--warm', low.toFixed(3));
      root.style.setProperty('--cool', h.toFixed(3));
      const i = timeIndex(t);
      const label = timesRef.current[i];
      sun.setAttribute('aria-valuenow', String(Math.round(t * 100)));
      sun.setAttribute('aria-valuetext', label);
      if (timeRef.current) timeRef.current.textContent = label;
      box.dataset.time = String(i);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const layout = () => {
      const g = geometry(box, img);
      state.current.g = g;
      if (pathRef.current) {
        const pts = [];
        for (let k = 0; k <= 40; k++) pts.push(pointAt(g, k / 40).map((v) => v.toFixed(1)).join(' '));
        pathRef.current.setAttribute('d', `M${pts.join('L')}`);
        pathRef.current.parentNode.setAttribute('viewBox', `0 0 ${g.W} ${g.H}`);
      }
      apply();
    };
    const setT = (t, animate) => {
      const s = state.current;
      gsap.killTweensOf(s);
      if (animate && !reduced) gsap.to(s, { t: clamp(t, 0, 1), duration: 0.9, ease: 'power3.out', onUpdate: schedule });
      else {
        s.t = clamp(t, 0, 1);
        schedule();
      }
    };
    const touched = () => {
      if (!state.current.touched) {
        state.current.touched = true;
        box.classList.add('is-touched');
      }
    };
    const tFromX = (clientX) => {
      const g = state.current.g;
      const r = box.getBoundingClientRect();
      return clamp((clientX - r.left - g.x0) / (g.x1 - g.x0), 0, 1);
    };

    // drag the disc
    let dragging = false;
    const down = (e) => {
      dragging = true;
      sun.setPointerCapture?.(e.pointerId);
      box.classList.add('is-dragging');
      touched();
      e.preventDefault();
    };
    const move = (e) => {
      if (!dragging) return;
      gsap.killTweensOf(state.current);
      state.current.t = tFromX(e.clientX);
      schedule();
    };
    const up = () => {
      dragging = false;
      box.classList.remove('is-dragging');
    };
    sun.addEventListener('pointerdown', down);
    sun.addEventListener('pointermove', move);
    sun.addEventListener('pointerup', up);
    sun.addEventListener('pointercancel', up);

    // tap (or drag across) the sky
    const sky = box.querySelector('.hero__sky');
    let skyDrag = null;
    const skyDown = (e) => {
      if (e.target === sun || sun.contains(e.target)) return;
      skyDrag = { x: e.clientX, id: e.pointerId };
      touched();
      setT(tFromX(e.clientX), true);
    };
    const skyMove = (e) => {
      if (!skyDrag || e.pointerId !== skyDrag.id) return;
      if (Math.abs(e.clientX - skyDrag.x) > 6) {
        gsap.killTweensOf(state.current);
        state.current.t = tFromX(e.clientX);
        schedule();
      }
    };
    const skyUp = () => {
      skyDrag = null;
    };
    sky.addEventListener('pointerdown', skyDown);
    sky.addEventListener('pointermove', skyMove);
    sky.addEventListener('pointerup', skyUp);
    sky.addEventListener('pointercancel', skyUp);
    sky.addEventListener('pointerleave', skyUp);

    const key = (e) => {
      const step = { ArrowRight: 0.04, ArrowUp: 0.04, ArrowLeft: -0.04, ArrowDown: -0.04, PageUp: 0.15, PageDown: -0.15 }[e.key];
      let t = state.current.t;
      if (step !== undefined) t += step;
      else if (e.key === 'Home') t = 0;
      else if (e.key === 'End') t = 1;
      else return;
      e.preventDefault();
      touched();
      setT(t, false);
    };
    sun.addEventListener('keydown', key);

    const ro = new ResizeObserver(layout);
    ro.observe(box);
    layout();

    // full motion: the afternoon sun settles into sunset on arrival, so the shade is seen stretching once
    if (!reduced) {
      state.current.t = 0.6;
      apply();
      gsap.to(state.current, { t: 0.95, duration: 2.8, delay: 0.5, ease: 'power2.inOut', onUpdate: schedule });
    }

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      gsap.killTweensOf(state.current);
      sun.removeEventListener('pointerdown', down);
      sun.removeEventListener('pointermove', move);
      sun.removeEventListener('pointerup', up);
      sun.removeEventListener('pointercancel', up);
      sun.removeEventListener('keydown', key);
      sky.removeEventListener('pointerdown', skyDown);
      sky.removeEventListener('pointermove', skyMove);
      sky.removeEventListener('pointerup', skyUp);
      sky.removeEventListener('pointercancel', skyUp);
      sky.removeEventListener('pointerleave', skyUp);
    };
  }, []);

  // keep the readout in the visitor's language
  useEffect(() => {
    const sun = sunRef.current;
    const i = timeIndex(state.current.t);
    sun.setAttribute('aria-valuetext', c.hero.times[i]);
    if (timeRef.current) timeRef.current.textContent = c.hero.times[i];
  }, [c]);

  return (
    <section id="top" className="hero" ref={boxRef} aria-labelledby="hero-title" data-time="4">
      <div className="hero__media">
        <img
          ref={imgRef}
          className="hero__img"
          src="/img/pdf-p04-258.webp"
          srcSet="/img/pdf-p04-258-sm.webp 1280w, /img/v2-hero-1920.webp 1920w, /img/pdf-p04-258.webp 2560w"
          sizes="100vw"
          width="2560"
          height="1429"
          alt={c.hero.photo}
          fetchPriority="high"
          decoding="async"
        />
        <div className="hero__wash" />
        <div className="hero__warm" />
        <div className="hero__dusk" />
        <div className="hero__glow" />
        <div className="hero__scrim" />
      </div>

      <div className="hero__sky">
        <svg className="hero__arc" aria-hidden="true" preserveAspectRatio="none">
          <path ref={pathRef} d="" />
        </svg>
      </div>

      <div
          ref={sunRef}
          className="sun"
          role="slider"
          tabIndex={0}
          aria-label={c.hero.sun}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={95}
          aria-valuetext={c.hero.times[4]}
          aria-orientation="horizontal"
        >
          <span className="sun__halo" />
          <span className="sun__ring sun__ring--outer" />
          <span className="sun__ring sun__ring--inner" />
          <span className="sun__core" />
          <span className="sun__time" ref={timeRef} aria-hidden="true">
            {c.hero.times[4]}
          </span>
        </div>

      <div className="hero__content">
        <p className="eyebrow eyebrow--light">
          <span>{tx.linktree}</span>
        </p>
        <h1 id="hero-title" className="hero__title display">
          {tx.tagline}
        </h1>
        <p className="hero__lead">{c.hero.lead}</p>
        <div className="hero__ctas">
          <a
            className="btn btn--sun"
            href="#journey"
            onClick={(e) => {
              e.preventDefault();
              goToId('journey');
            }}
          >
            {c.hero.cta}
          </a>
          <a className="btn btn--glass" href={`${LINKS.whatsapp}`} target="_blank" rel="noopener noreferrer">
            <Icon icon={WhatsappIcon} size={20} />
            <span>{c.hero.wa}</span>
          </a>
        </div>
      </div>

      <p className="hero__hint" ref={hintRef} aria-hidden="true">
        <span className="hero__hint-dot" />
        {c.hero.hint}
      </p>
      <p className="hero__brand" aria-hidden="true">
        {BRAND.nameAr} · {BRAND.nameEn}
      </p>
      <span className="hero__scroll" aria-hidden="true">
        <Icon icon={ArrowDown01Icon} size={18} />
      </span>

      <Shade className="shade--hero" seed={11} density={1.1} />
    </section>
  );
}
