// Varieties: their real reels of nabq as fruit cards. Poster first; a short muted loop plays on hover or focus
// (full motion) or on tap (always). Real captions and the reel link ("Watch on Instagram").
import { useEffect, useRef, useState } from 'react';
import { useLang } from '@shared/i18n.jsx';
import { LINKS } from '@shared/content.js';
import { COPY, VARIETY_REELS } from './copy.js';
import { Ext, Arrow, isReduced, useMedia } from './bits.jsx';

export default function Varieties() {
  const { lang } = useLang();
  const c = COPY[lang].varieties;
  const reduced = isReduced();
  const fine = useMedia('(hover: hover) and (pointer: fine)');
  const [playing, setPlaying] = useState(-1);
  const vids = useRef([]);
  const rail = useRef(null);
  const drag = useRef({ on: false, moved: false });
  const focusPlay = useRef(-1);
  const hoverPlay = useRef(-1);

  useEffect(() => {
    vids.current.forEach((v, i) => {
      if (!v) return;
      if (i === playing) {
        if (!v.getAttribute('src')) v.setAttribute('src', `/media/v1-reel-${VARIETY_REELS[i].id}.mp4`);
        const p = v.play();
        if (p && p.catch) p.catch(() => {});
      } else if (!v.paused) v.pause();
    });
  }, [playing]);

  const step = (dir) => {
    const el = rail.current;
    const card = el.querySelector('.fruit');
    const w = card ? card.getBoundingClientRect().width + 20 : 240;
    const sign = (lang === 'ar' ? -1 : 1) * (dir === 'next' ? 1 : -1);
    el.scrollBy({ left: sign * w * 2, behavior: reduced ? 'auto' : 'smooth' });
  };

  // drag the rail with a mouse (touch scrolls natively)
  const onDown = (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    const el = rail.current;
    const x0 = e.clientX;
    const s0 = el.scrollLeft;
    drag.current = { on: true, moved: false };
    const move = (ev) => {
      const dx = ev.clientX - x0;
      if (Math.abs(dx) > 6) {
        drag.current.moved = true;
        el.classList.add('is-dragging');
      }
      if (drag.current.moved) el.scrollLeft = s0 - dx;
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      el.classList.remove('is-dragging');
      setTimeout(() => (drag.current.on = false), 0);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  const onClickCapture = (e) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  return (
    <section className="var" id="varieties" data-fit aria-labelledby="var-title">
      <header className="var__head">
        <p className="eyebrow">{c.eyebrow}</p>
        <h2 className="var__title" id="var-title">
          <span className="var__big">
            <b>70+</b>
            <span>{c.big}</span>
          </span>
          <span className="var__small">
            <b>50+</b>
            <span>{c.small}</span>
          </span>
        </h2>
        <p className="var__lead">{c.lead}</p>
        <div className="var__ctrl">
          <button type="button" className="icon-btn" aria-label={c.prev} onClick={() => step('prev')}>
            <Arrow dir="prev" />
          </button>
          <button type="button" className="icon-btn" aria-label={c.next} onClick={() => step('next')}>
            <Arrow dir="next" />
          </button>
          <Ext className="btn btn--text var__cat" href={LINKS.catalogue} newTab={COPY[lang].newTab}>
            {c.catalogue} <Arrow />
          </Ext>
        </div>
      </header>

      <ul className="var__rail" ref={rail} aria-label={c.rail} onPointerDown={onDown} onClickCapture={onClickCapture}>
        {VARIETY_REELS.map((r, i) => {
          const v = r[lang];
          const on = playing === i;
          return (
            <li className={`fruit ${on ? 'is-playing' : ''}`} key={r.id}>
              <button
                type="button"
                className="fruit__media"
                aria-pressed={on}
                aria-label={on ? c.pause(v.name) : c.play(v.name)}
                onClick={() => {
                  // a click right after hover or keyboard focus started the reel must not stop it again
                  if (focusPlay.current === i || hoverPlay.current === i) {
                    focusPlay.current = -1;
                    hoverPlay.current = -1;
                    setPlaying(i);
                    return;
                  }
                  setPlaying((p) => (p === i ? -1 : i));
                }}
                onMouseEnter={() => {
                  if (!fine || reduced) return;
                  hoverPlay.current = i;
                  setPlaying(i);
                }}
                onMouseLeave={() => {
                  if (!fine || reduced) return;
                  hoverPlay.current = -1;
                  setPlaying((p) => (p === i ? -1 : p));
                }}
                onFocus={(e) => {
                  if (reduced || !e.currentTarget.matches(':focus-visible')) return;
                  focusPlay.current = i;
                  setTimeout(() => (focusPlay.current = focusPlay.current === i ? -1 : focusPlay.current), 450);
                  setPlaying(i);
                }}
                onBlur={() => setPlaying((p) => (p === i ? -1 : p))}
              >
                <img src={`/img/v1-reel-${r.id}.webp`} alt="" width="450" height="800" loading="lazy" decoding="async" draggable="false" />
                <video ref={(el) => (vids.current[i] = el)} muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1} />
                <span className="fruit__stem" aria-hidden="true">
                  <svg viewBox="-4 -20 44 34" focusable="false">
                    <path d="M0 0 C 8 -12, 26 -16, 38 -1 C 26 9, 9 9, 0 0 Z" fill="var(--leaf-light)" />
                  </svg>
                </span>
                <span className="fruit__play" aria-hidden="true">
                  {on ? (
                    <svg viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
                  ) : (
                    <svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" /></svg>
                  )}
                </span>
              </button>
              <div className="fruit__cap">
                <h3 className="fruit__name">{v.name}</h3>
                <p className="fruit__hook">«{v.hook}»</p>
                <Ext className="fruit__watch" href={r.url} newTab={COPY[lang].newTab}>
                  {c.watch} <span aria-hidden="true">↗</span>
                </Ext>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
