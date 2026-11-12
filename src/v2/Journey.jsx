// "The journey of the Sidr": a pinned horizontal scroll of chapters, from grafting an old tree to the workshop
// (all eight services). Full motion: vertical scroll drives the row; a twig with seven leaves shows the way and jumps.
// Reduced motion: the same row is a native swipe/scroll row with previous / next buttons, nothing moves on its own.
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft01Icon, ArrowRight01Icon, ShoppingBag01Icon, WhatsappIcon, Location01Icon, PlayIcon, PauseIcon } from '@hugeicons/core-free-icons';
import { useLang } from '@shared/i18n.jsx';
import { LINKS, COUNTRIES, FACTS } from '@shared/content.js';
import { Icon } from '@shared/Icon.jsx';
import { gsap, ScrollTrigger, useGSAP } from '@shared/gsap.js';
import { isMotionReduced } from '@shared/motion.jsx';
import { getLenis } from '@shared/useSmoothScroll.js';
import { LeafMark } from './Shade.jsx';
import { COPY } from './copy.js';

const CHAPTERS = [
  { keys: ['grafting'], img: { src: 'pdf-p01-01', w: 2400, h: 1792, alt: 'grafting', pos: '50% 45%' } },
  { keys: ['seedlings'], img: { src: 'pdf-p06-56', w: 899, h: 899, alt: 'seedlings', pos: '50% 60%' }, badge: true },
  { keys: ['afforestation'], img: { src: 'pdf-p07-66', w: 842, h: 628, alt: 'afforestation' }, inset: { src: 'pdf-p07-68', w: 830, h: 620, alt: 'afforestation2' } },
  { keys: ['farms'], reel: { id: 'DfKiwSPB854', alt: 'farms' }, inset: { src: 'pdf-p08-118', w: 1228, h: 1228, alt: 'farms2' }, countries: true },
  { keys: ['fruit'], reel: { id: 'DdCEmV9NwQR', alt: 'fruit' }, store: true },
  { keys: ['care', 'food'], img: { src: 'v2-products', w: 1340, h: 836, sm: 800, alt: 'products', pos: '30% 50%' }, store: true },
  { keys: ['workshops'], img: { src: 'pdf-p09-43', w: 1448, h: 1086, alt: 'workshops' }, ask: true },
];

function Picture({ src, w, h, sm, alt, pos, className }) {
  const big = w > 1280 || sm;
  return (
    <img
      className={className}
      src={`/img/${src}${big ? '-sm' : ''}.webp`}
      srcSet={big ? `/img/${src}-sm.webp ${sm || 1280}w, /img/${src}.webp ${w}w` : undefined}
      sizes={big ? '(max-width: 700px) 92vw, 46vw' : undefined}
      width={w}
      height={h}
      alt={alt}
      loading="lazy"
      decoding="async"
      style={pos ? { objectPosition: pos } : undefined}
    />
  );
}

// a reel that plays while its chapter is in front (full motion), or on tap (reduced)
function ChapterReel({ id, alt, active, reduced, c }) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (!reduced && active) {
      if (!v.src) v.src = `/media/v2-reel-${id}.mp4`;
      v.play().then(() => setPlaying(true)).catch(() => {});
    } else if (!active) {
      v.pause();
      setPlaying(false);
    }
  }, [active, reduced, id]);
  const toggle = () => {
    const v = ref.current;
    if (!v.src) v.src = `/media/v2-reel-${id}.mp4`;
    if (v.paused) v.play().then(() => setPlaying(true)).catch(() => {});
    else {
      v.pause();
      setPlaying(false);
    }
  };
  return (
    <div className="ch__reel">
      <img className="ch__reel-poster" src={`/img/v2-reel-${id}.webp`} width="540" height="960" alt={alt} loading="lazy" decoding="async" />
      <video ref={ref} className={`ch__reel-video ${playing ? 'is-on' : ''}`} muted loop playsInline preload="none" aria-hidden="true" />
      <button type="button" className="ch__play" onClick={toggle} aria-label={playing ? c.journey.pause : c.journey.play} aria-pressed={playing}>
        <Icon icon={playing ? PauseIcon : PlayIcon} size={18} />
      </button>
    </div>
  );
}

export function Journey() {
  const { lang, t, isRTL } = useLang();
  const c = COPY[lang];
  const reduced = isMotionReduced();
  const secRef = useRef(null);
  const viewRef = useRef(null);
  const trackRef = useRef(null);
  const stRef = useRef(null);
  const geo = useRef({ dist: 1, hold: 0 });
  const [active, setActive] = useState(0);
  const services = Object.fromEntries(t.services.map((s) => [s.key, s]));

  const hdr = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hdr')) || 64;
  const panels = () => [...trackRef.current.querySelectorAll('.jpanel')];
  const nearest = () => {
    const vw = viewRef.current.getBoundingClientRect();
    const mid = vw.left + vw.width / 2;
    let best = 0;
    let dmin = Infinity;
    panels().forEach((p, i) => {
      const r = p.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - mid);
      if (d < dmin) {
        dmin = d;
        best = i;
      }
    });
    return best;
  };

  // full motion: pin the section and let the vertical scroll carry the row. The scene rests for a moment at both ends
  // (holdPx of scroll), so the first panel is still whole when the visitor lands a little inside the pin (an anchor jump,
  // a flick of the wheel) and the last panel is whole before the page moves on.
  useGSAP(
    () => {
      if (reduced) return undefined;
      const track = trackRef.current;
      const view = viewRef.current;
      const dist = () => Math.max(0, track.scrollWidth - view.clientWidth);
      const holdPx = () => Math.round(Math.min(220, Math.max(120, window.innerHeight * 0.2)));
      geo.current = { dist: dist(), hold: holdPx() };
      const ease = (p) => {
        const { dist: d, hold: k } = geo.current;
        const a = k / (d + 2 * k || 1);
        return Math.min(1, Math.max(0, (p - a) / (1 - 2 * a)));
      };
      const tween = gsap.fromTo(
        track,
        { x: 0 },
        {
          x: () => (isRTL ? 1 : -1) * dist(),
          ease,
          // the scrubbed tween renders while it catches up with the scroll, so the active chapter follows the row itself
          onUpdate: () => setActive(nearest()),
          scrollTrigger: {
            trigger: secRef.current,
            start: () => `top ${hdr()}px`,
            end: () => `+=${dist() + 2 * holdPx()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onRefreshInit: () => {
              geo.current = { dist: dist(), hold: holdPx() };
            },
          },
        }
      );
      stRef.current = tween.scrollTrigger;
      return () => {
        stRef.current = null;
      };
    },
    { dependencies: [isRTL, reduced, lang], scope: secRef, revertOnUpdate: true }
  );

  // reduced motion: a native row; watch which panel is in front
  useEffect(() => {
    if (!reduced) return undefined;
    const view = viewRef.current;
    const onScroll = () => setActive(nearest());
    view.addEventListener('scroll', onScroll, { passive: true });
    return () => view.removeEventListener('scroll', onScroll);
  }, [reduced]);

  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => clearTimeout(id);
  }, [lang]);

  const go = (i) => {
    const list = panels();
    const n = Math.max(0, Math.min(list.length - 1, i));
    const panel = list[n];
    if (reduced || !stRef.current) {
      const view = viewRef.current;
      const r = panel.getBoundingClientRect();
      const vr = view.getBoundingClientRect();
      view.scrollBy({ left: r.left + r.width / 2 - (vr.left + vr.width / 2), behavior: reduced ? 'auto' : 'smooth' });
      setActive(n);
      return;
    }
    const st = stRef.current;
    const track = trackRef.current;
    const view = viewRef.current;
    const dist = Math.max(1, track.scrollWidth - view.clientWidth);
    // panel centre measured from the row's start edge (right in Arabic, left in English), before any movement
    const start = isRTL ? track.offsetWidth - (panel.offsetLeft + panel.offsetWidth) : panel.offsetLeft;
    const off = Math.max(0, Math.min(dist, start + panel.offsetWidth / 2 - view.clientWidth / 2));
    // the row moves 1px per 1px of scroll between the two rests
    const hold = geo.current.hold;
    const y = n === 0 ? st.start : st.start + hold + (off / dist) * (st.end - st.start - 2 * hold);
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y, behavior: 'auto' });
  };

  const Prev = isRTL ? ArrowRight01Icon : ArrowLeft01Icon;
  const Next = isRTL ? ArrowLeft01Icon : ArrowRight01Icon;

  return (
    <section id="journey" className={`journey ${reduced ? 'is-native' : 'is-pinned'}`} ref={secRef} aria-labelledby="journey-title">
      <div className="journey__view" ref={viewRef} tabIndex={reduced ? 0 : undefined} aria-label={reduced ? c.journey.title : undefined}>
        <div className="journey__track" ref={trackRef}>
          <div className="jpanel jpanel--intro">
            <p className="eyebrow">{c.journey.eyebrow}</p>
            <h2 id="journey-title" className="journey__title display">
              {c.journey.title}
            </h2>
            <p className="journey__intro">{c.journey.intro}</p>
            <p className="journey__hint">
              <span>{c.journey.hint}</span>
              <Icon icon={Next} size={18} />
            </p>
          </div>

          {CHAPTERS.map((ch, i) => {
            const isActive = active === i + 1;
            return (
              <article key={ch.keys[0]} className={`jpanel ch ${ch.reel ? 'ch--reel' : ''} ${isActive ? 'is-active' : ''}`} aria-labelledby={`ch-${ch.keys[0]}`}>
                <div className="ch__media">
                  {ch.img && <Picture className="ch__img" {...ch.img} alt={c.journey.alts[ch.img.alt]} />}
                  {ch.reel && <ChapterReel id={ch.reel.id} alt={c.journey.alts[ch.reel.alt]} active={isActive} reduced={reduced} c={c} />}
                  {ch.inset && <Picture className="ch__inset" {...ch.inset} alt={c.journey.alts[ch.inset.alt]} />}
                  {ch.badge && (
                    <p className="ch__badge">
                      <strong>+{FACTS[0].value}</strong>
                      <span>{c.journey.seventy}</span>
                    </p>
                  )}
                </div>
                <div className="ch__text">
                  <p className="ch__num" aria-hidden="true">
                    <span>{String(i + 1).padStart(2, '0')}</span>
                    <LeafMark lit={isActive} />
                  </p>
                  <p className="ch__label">
                    {c.journey.chapterOf} {i + 1} · {c.journey.labels[i]}
                  </p>
                  {ch.keys.map((k, j) => (
                    <div className="ch__svc" key={k}>
                      <h3 id={j === 0 ? `ch-${ch.keys[0]}` : undefined} className="ch__title">
                        {services[k].title}
                      </h3>
                      <p className="ch__body">{services[k].text}</p>
                    </div>
                  ))}
                  {ch.countries && (
                    <ul className="ch__where">
                      {COUNTRIES[lang].map((n) => (
                        <li key={n}>
                          <Icon icon={Location01Icon} size={16} />
                          {n}
                        </li>
                      ))}
                    </ul>
                  )}
                  {(ch.store || ch.ask) && (
                    <p className="ch__actions">
                      {ch.store && (
                        <a className="btn btn--leaf btn--sm" href={LINKS.store} target="_blank" rel="noopener noreferrer">
                          <Icon icon={ShoppingBag01Icon} size={18} />
                          <span>{c.journey.store}</span>
                        </a>
                      )}
                      {ch.ask && (
                        <a className="btn btn--leaf btn--sm" href={`${LINKS.whatsapp}?text=${encodeURIComponent(c.journey.askMsg)}`} target="_blank" rel="noopener noreferrer">
                          <Icon icon={WhatsappIcon} size={18} />
                          <span>{c.journey.ask}</span>
                        </a>
                      )}
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <nav className="jprog" aria-label={c.journey.eyebrow}>
        <button type="button" className="jprog__arrow" onClick={() => go(active - 1)} aria-label={c.journey.prev} disabled={active <= 0}>
          <Icon icon={Prev} size={20} />
        </button>
        <ol className="jprog__list">
          {c.journey.labels.map((label, i) => (
            <li key={label}>
              <button type="button" className={`jprog__step ${active === i + 1 ? 'is-current' : ''} ${active > i ? 'is-done' : ''}`} onClick={() => go(i + 1)} aria-current={active === i + 1 ? 'step' : undefined}>
                <LeafMark lit={active >= i + 1} />
                <span className="jprog__label">{label}</span>
              </button>
            </li>
          ))}
        </ol>
        <button type="button" className="jprog__arrow" onClick={() => go(active + 1)} aria-label={c.journey.next} disabled={active >= CHAPTERS.length}>
          <Icon icon={Next} size={20} />
        </button>
        <span className="jprog__twig" aria-hidden="true">
          <span style={{ transform: `scaleX(${active / CHAPTERS.length})` }} />
        </span>
      </nav>
    </section>
  );
}
