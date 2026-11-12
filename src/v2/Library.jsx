// The varieties library: nine real nabq reels on a calm shelf. Hover, focus or tap a "book" to open it; its muted loop
// plays (full motion) or waits for a tap (reduced). Real captions and dates, a link to each reel. The four facts count
// up when the visitor reaches them.
import { useEffect, useRef, useState } from 'react';
import { InstagramIcon, PlayIcon, PauseIcon } from '@hugeicons/core-free-icons';
import { useLang } from '@shared/i18n.jsx';
import { REELS, FACTS } from '@shared/content.js';
import { Icon } from '@shared/Icon.jsx';
import { gsap } from '@shared/gsap.js';
import { isMotionReduced } from '@shared/motion.jsx';
import { COPY, LIBRARY } from './copy.js';

const byId = Object.fromEntries(REELS.map((r) => [r.id, r]));
const fmtDate = (d, lang) =>
  new Intl.DateTimeFormat(lang === 'ar' ? 'ar-u-nu-latn' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${d}T12:00:00`));

function Facts({ c }) {
  const ref = useRef(null);
  const reduced = isMotionReduced();
  const [vals, setVals] = useState(() => FACTS.map((f) => (reduced ? f.value : f.value === 2020 ? 1990 : 0)));
  useEffect(() => {
    if (reduced) return undefined;
    const el = ref.current;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const o = { p: 0 };
        gsap.to(o, {
          p: 1,
          duration: 1.8,
          ease: 'power3.out',
          onUpdate: () => setVals(FACTS.map((f) => (f.value === 2020 ? Math.round(1990 + 30 * o.p) : Math.round(f.value * o.p)))),
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);
  return (
    <ul className="facts" ref={ref}>
      {FACTS.map((f, i) => (
        <li key={f.value} className="fact" title={f[c.lang]}>
          <strong className="fact__num">
            {f.value === 2020 && <small>{c.library.since} </small>}
            {vals[i]}
            {f.plus && <span className="fact__plus">+</span>}
          </strong>
          <span className="fact__label">{c.library.facts[i]}</span>
          <span className="sr-only">{f[c.lang]}</span>
        </li>
      ))}
    </ul>
  );
}

function Book({ id, i, open, onOpen, c, lang, reduced }) {
  const r = byId[id];
  const words = c.reels[id];
  const vRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const start = () => {
    const v = vRef.current;
    if (!v.src) v.src = `/media/v2-reel-${id}.mp4`;
    v.play().then(() => setPlaying(true)).catch(() => {});
  };
  const stop = () => {
    vRef.current?.pause();
    setPlaying(false);
  };
  // full motion: the open book plays by itself; any other book rests
  useEffect(() => {
    if (!open) stop();
    else if (!reduced && open === 'hover') start();
  }, [open, reduced]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <li
      className={`book ${open ? 'is-open' : ''} ${playing ? 'is-playing' : ''}`}
      // open on a real pointer move only: books growing under a still mouse must not open one another
      onPointerMove={(e) => {
        if (e.pointerType === 'mouse' && (e.movementX || e.movementY) && !open) onOpen(i, 'hover');
      }}
      onFocus={(e) => {
        if (e.target.classList.contains('book__media')) onOpen(i, reduced ? 'tap' : 'hover');
      }}
    >
      <button
        type="button"
        className="book__media"
        aria-pressed={playing}
        aria-label={`${words.name}: ${playing ? c.library.pause : c.library.play}`}
        onClick={() => {
          onOpen(i, 'tap');
          if (playing) stop();
          else start();
        }}
      >
        <img src={`/img/v2-reel-${id}.webp`} width="540" height="960" alt={`${c.library.poster}: ${words.name}`} loading="lazy" decoding="async" />
        <video ref={vRef} muted loop playsInline preload="none" aria-hidden="true" />
        <span className="book__idx" aria-hidden="true">
          {String(i + 1).padStart(2, '0')}
        </span>
        <span className="book__play" aria-hidden="true">
          <Icon icon={playing ? PauseIcon : PlayIcon} size={18} />
        </span>
      </button>
      <div className="book__info">
        <h3 className="book__name">{words.name}</h3>
        <p className="book__cap" lang="ar" dir="rtl">
          «{c.reels[id] && COPY.ar.reels[id].caption}»
        </p>
        {lang === 'en' && <p className="book__tr">{words.caption}</p>}
        <p className="book__date">
          <time dateTime={r.date}>{fmtDate(r.date, lang)}</time>
        </p>
        <a className="book__watch" href={r.url} target="_blank" rel="noopener noreferrer">
          <Icon icon={InstagramIcon} size={18} />
          <span>{c.library.watch}</span>
        </a>
      </div>
    </li>
  );
}

export function Library() {
  const { lang } = useLang();
  const c = { ...COPY[lang], lang };
  const reduced = isMotionReduced();
  const [open, setOpen] = useState({ i: 0, how: 'rest' });
  const onOpen = (i, how) => setOpen((o) => (o.i === i && how === 'hover' && o.how === 'tap' ? o : { i, how }));
  return (
    <section id="varieties" className="lib" aria-labelledby="lib-title">
      <div className="lib__head">
        <div className="lib__intro">
          <p className="eyebrow">{c.library.eyebrow}</p>
          <h2 id="lib-title" className="h2">
            {c.library.title}
          </h2>
          <p className="lib__lead">{c.library.lead}</p>
        </div>
        <Facts c={c} />
      </div>
      <ul className="shelf" onMouseLeave={() => setOpen((o) => (o.how === 'hover' ? { i: o.i, how: 'rest' } : o))}>
        {LIBRARY.map((id, i) => (
          <Book key={id} id={id} i={i} c={c} lang={lang} reduced={reduced} open={open.i === i ? open.how : false} onOpen={onOpen} />
        ))}
      </ul>
    </section>
  );
}
