// Hero: the tagline, their golden grafting photo and the graft itself, in real photographs (two studio pictures cut
// into layers by research/tools/v1-graft-cut.py). The visitor drags the young scion onto the cleft of the old branch
// (keyboard: Enter; touch: tap the scion, then the cleft): it snaps in, the jute wraps the joint, the branch becomes the
// grafted one, its new shoot opens and the nabq appear. Then the line, the sub line and two actions.
import { useLayoutEffect, useRef, useState } from 'react';
import { useLang } from '@shared/i18n.jsx';
import { LINKS } from '@shared/content.js';
import { gsap } from '@shared/gsap.js';
import { COPY, wa } from './copy.js';
import { Ext, WaIcon, Arrow, isReduced, useMedia } from './bits.jsx';
import { Icon } from '@shared/Icon.jsx';
import { HandGrabIcon, Tap01Icon } from '@hugeicons/core-free-icons';
import { GRAFT } from './graft-layers.js';

const { a: A, b: B } = GRAFT;
const s = A.scale;
// the scion waits to the right of the cleft (stage = picture B pixels); its wedge goes into the cleft
const NOTCH = [A.notch[0] - 24, A.notch[1] + 2];
const HOME = [NOTCH[0] + 250, NOTCH[1] - 150];
const SCION = { w: A.scion[2] * s, h: A.scion[3] * s, wx: (A.wedge[0] - A.scion[0]) * s, wy: (A.wedge[1] - A.scion[1]) * s };
const scionBox = [HOME[0] - SCION.wx, HOME[1] - SCION.wy, SCION.w, SCION.h];
const twineBox = [HOME[0] + 20, HOME[1] + 210, A.twine[2] * s * 0.72, A.twine[3] * s * 0.72];
// the stage frame: everything that is ever shown, plus a little room
const boxes = [B.base, B.twine, B.shoot, B.fruit, scionBox, twineBox];
const X0 = Math.min(...boxes.map((b) => b[0])) - 6;
const Y0 = Math.min(...boxes.map((b) => b[1])) - 10;
const X1 = Math.max(...boxes.map((b) => b[0] + b[2])) + 10;
const Y1 = Math.max(...boxes.map((b) => b[1] + b[3])) + 16;
const SW = X1 - X0;
const SH = Y1 - Y0;
const pc = (v, t) => `${((v / t) * 100).toFixed(3)}%`;
const place = ([x, y, w, h]) => ({ left: pc(x - X0, SW), top: pc(y - Y0, SH), width: pc(w, SW), height: pc(h, SH) });
// picture A's frame inside the stage, turned and scaled so A's sawn end and cleft sit on B's
const aFrame = {
  left: pc(-X0, SW),
  top: pc(-Y0, SH),
  width: pc(A.W, SW),
  height: pc(A.H, SH),
  transformOrigin: `${pc(A.end[0], A.W)} ${pc(A.end[1], A.H)}`,
  transform: `translate(${pc(A.endB[0] - A.end[0], A.W)}, ${pc(A.endB[1] - A.end[1], A.H)}) rotate(${A.rot}deg) scale(${s})`,
};
// the call to action: a dotted path from the scion's wedge into the cleft, and a label beside the scion
const PATH = `M${HOME[0] - 8} ${HOME[1] + 6} C ${HOME[0] - 90} ${HOME[1] + 20}, ${NOTCH[0] + 150} ${NOTCH[1] - 110}, ${NOTCH[0] + 40} ${NOTCH[1] - 22}`;
const CUE_WIDE = { left: pc(HOME[0] - 250 - X0, SW), top: pc(HOME[1] - 120 - Y0, SH) };
const CUE_NARROW = { left: pc(HOME[0] - 420 - X0, SW), top: pc(HOME[1] - 150 - Y0, SH) };
const inA = ([x, y, w, h]) => ({ left: pc(x, A.W), top: pc(y, A.H), width: pc(w, A.W), height: pc(h, A.H) });
const shootStyle = {
  ...place(B.shoot),
  '--jx': pc(B.joint[0] - B.shoot[0], B.shoot[2]),
  '--jy': pc(B.joint[1] - B.shoot[1], B.shoot[3]),
  '--r': `${((B.reach + 20) / (Math.sqrt(B.shoot[2] ** 2 + B.shoot[3] ** 2) / Math.SQRT2)) * 100}%`,
};

export default function Hero() {
  const { lang } = useLang();
  const c = COPY[lang].hero;
  const wide = useMedia('(min-width: 1024px)');
  const sm = wide ? '' : '-sm';
  const [state, setState] = useState('idle'); // idle | armed | grafted
  const [cue, setCue] = useState(true); // the "drag or tap" call to action, until the first touch
  const [carrying, setCarrying] = useState(false);
  const fine = useMedia('(hover: hover) and (pointer: fine)');
  const root = useRef(null);
  const stage = useRef(null);
  const scion = useRef(null);
  const target = useRef(null);
  const tl = useRef(null);
  const busy = useRef(false);
  const flip = lang === 'ar' ? 1 : -1; // the stage is mirrored for English (the branch then comes from the right)

  // the growth timeline, made once; reduced motion jumps to its end
  useLayoutEffect(() => {
    const q = gsap.utils.selector(root);
    const ctx = gsap.context(() => {
      gsap.set(q('.gp-b'), { autoAlpha: 0 });
      gsap.set(q('.gp-shoot'), { '--f': 0 });
      gsap.set(q('.gp-twineb'), { clipPath: 'inset(0% 100% 0% 0%)' });
      gsap.set(q('.gp-side'), { scale: 0 });
      gsap.set(q('.gp-fruit'), { scale: 0.2, transformOrigin: '60% 0%' });
      const t = gsap.timeline({ paused: true });
      t.to(q('.gp-twinea'), { autoAlpha: 0, scale: 0.4, x: '-30%', y: '-60%', duration: 0.45, ease: 'power2.in' })
        .set(q('.gp-twineb'), { autoAlpha: 1 }, '<0.1')
        .to(q('.gp-twineb'), { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.75, ease: 'power1.inOut' }, '<')
        .set(q('.gp-twineb'), { clipPath: 'none' })
        .to(q('.graft-target'), { autoAlpha: 0, duration: 0.25 }, '<')
        .to(q('.gp-base'), { autoAlpha: 1, duration: 0.5 }, '-=0.15')
        .to(q('.gp-abranch, .scion'), { autoAlpha: 0, duration: 0.5 }, '<')
        .set(q('.gp-shoot'), { autoAlpha: 1 }, '<')
        .to(q('.gp-shoot'), { '--f': 1, duration: 1.15, ease: 'power2.out' }, '<0.1')
        .to(q('.gp-side'), { autoAlpha: 1, scale: 1, duration: 0.7, stagger: 0.1, ease: 'back.out(2)' }, '<0.25')
        .to(q('.gp-fruit'), { autoAlpha: 1, scale: 1, duration: 0.9, ease: 'elastic.out(1, 0.5)' }, '-=0.45');
      tl.current = t;
    }, root);
    return () => ctx.revert();
  }, []);

  const unitPx = () => stage.current.getBoundingClientRect().width / SW;

  const graft = () => {
    if (busy.current || state === 'grafted') return;
    busy.current = true;
    setCue(false);
    setCarrying(false);
    const el = scion.current;
    const u = unitPx();
    const to = { x: (NOTCH[0] - HOME[0]) * u, y: (NOTCH[1] - HOME[1]) * u };
    setState('grafted');
    if (isReduced()) {
      gsap.set(el, { ...to, rotation: A.rot });
      tl.current.progress(1);
      busy.current = false;
      return;
    }
    gsap.to(el, {
      ...to,
      rotation: A.rot,
      duration: 0.5,
      ease: 'power3.inOut',
      onComplete: () => {
        busy.current = false;
        tl.current.play(0);
      },
    });
  };

  const reset = () => {
    tl.current.pause(0);
    gsap.set(scion.current, { x: 0, y: 0, rotation: 0, autoAlpha: 1 });
    gsap.set(root.current.querySelector('.gp-abranch'), { autoAlpha: 1 });
    setState('idle');
    setCue(true);
    setCarrying(false);
    busy.current = false;
    requestAnimationFrame(() => scion.current?.focus());
  };

  // drag with a pointer (mouse, pen, touch); a short press without moving is a tap (arms the scion)
  const onPointerDown = (e) => {
    if (state === 'grafted' || busy.current || e.button > 0) return;
    const el = scion.current;
    el.setPointerCapture(e.pointerId);
    setCue(false);
    const x0 = e.clientX;
    const y0 = e.clientY;
    let moved = false;
    const near = (ev) => {
      const b = target.current.getBoundingClientRect();
      return Math.hypot(ev.clientX - (b.left + b.width / 2), ev.clientY - (b.top + b.height / 2)) < Math.max(80, b.width * 1.1);
    };
    const move = (ev) => {
      const dx = ev.clientX - x0;
      const dy = ev.clientY - y0;
      if (!moved && Math.hypot(dx, dy) > 6) {
        moved = true;
        el.classList.add('is-dragging');
        setCarrying(true);
      }
      if (!moved) return;
      gsap.set(el, { x: dx * flip, y: dy, rotation: Math.max(-14, Math.min(14, (dx * flip) / 12)) });
      target.current.classList.toggle('is-near', near(ev));
    };
    const up = (ev) => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
      el.classList.remove('is-dragging');
      target.current.classList.remove('is-near');
      setCarrying(false);
      if (!moved) {
        setState((st) => (st === 'armed' ? 'idle' : 'armed'));
        return;
      }
      if (ev.type === 'pointerup' && near(ev)) graft();
      else gsap.to(el, { x: 0, y: 0, rotation: 0, duration: isReduced() ? 0 : 0.6, ease: 'elastic.out(1, 0.6)' });
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
  };

  const onKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      graft();
    }
  };

  const grafted = state === 'grafted';

  return (
    <section className={`hero is-${state} ${cue && state !== 'grafted' ? 'is-cue' : ''} ${carrying || state === 'armed' ? 'is-carrying' : ''}`} id="top" ref={root} data-fit aria-labelledby="hero-title">
      <div className="hero__head">
        <p className="eyebrow eyebrow--light-on-photo">{c.eyebrow}</p>
        <h1 className="hero__title" id="hero-title">
          <span>{c.tagline[0]}</span> <span className="hero__title-2">{c.tagline[1]}</span>
        </h1>
      </div>

      <figure className="hero__photo">
        <img
          src="/img/v1-hero-sm.webp"
          srcSet="/img/v1-hero-sm.webp 640w, /img/v1-hero.webp 1100w"
          sizes="(min-width: 1024px) 34vw, 100vw"
          width="1100"
          height="1376"
          alt={c.photo}
          fetchPriority="high"
          decoding="async"
        />
      </figure>

      <div className="hero__stage" style={{ '--ratio': (SW / SH).toFixed(4) }}>
        <div className="gstage" ref={stage} style={{ aspectRatio: `${SW} / ${SH}` }}>
          {/* after: the grafted branch (picture B) */}
          <img className="gp gp-b gp-base" src={`/img/v1-graft-b-base${sm}.webp`} style={place(B.base)} alt="" draggable="false" />
          {B.sides.map((sd, i) => (
            <img
              key={i}
              className="gp gp-b gp-side"
              src={`/img/v1-graft-b-side${i + 1}${sm}.webp`}
              style={{ ...place(sd.box), transformOrigin: `${pc(sd.foot[0] - sd.box[0], sd.box[2])} ${pc(sd.foot[1] - sd.box[1], sd.box[3])}` }}
              alt=""
              draggable="false"
            />
          ))}
          <img className="gp gp-b gp-shoot" src={`/img/v1-graft-b-shoot${sm}.webp`} style={shootStyle} alt="" draggable="false" />
          <img className="gp gp-b gp-fruit" src={`/img/v1-graft-b-fruit${sm}.webp`} style={place(B.fruit)} alt="" draggable="false" />
          {/* before: the old branch with its empty cleft (picture A, turned onto B) */}
          <div className="gp-aframe" style={aFrame}>
            <img className="gp gp-abranch" src={`/img/v1-graft-a-branch${sm}.webp`} style={inA(A.branch)} alt="" draggable="false" />
          </div>
          <img className="gp gp-b gp-twineb" src={`/img/v1-graft-b-twine${sm}.webp`} style={place(B.twine)} alt="" draggable="false" />
          <img className="gp gp-twinea" src={`/img/v1-graft-a-twine${sm}.webp`} style={place(twineBox)} alt="" draggable="false" />

          <svg className="graft-path" viewBox={`${X0} ${Y0} ${SW} ${SH}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <defs>
              <marker id="v1-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M0 0 L10 5 L0 10 z" fill="var(--gold)" />
              </marker>
            </defs>
            <path d={PATH} markerEnd="url(#v1-arrow)" />
          </svg>
          <button
            type="button"
            ref={target}
            className="graft-target"
            style={{ left: pc(NOTCH[0] - X0, SW), top: pc(NOTCH[1] - Y0, SH) }}
            aria-label={c.target}
            disabled={grafted}
            onClick={() => graft()}
          >
            <svg className="g-target-ring" viewBox="0 0 80 64" aria-hidden="true" focusable="false">
              <ellipse cx="40" cy="32" rx="36" ry="28" />
              <ellipse cx="40" cy="32" rx="28" ry="21" />
            </svg>
          </button>

          <button
            type="button"
            ref={scion}
            className="scion"
            style={{ ...place(scionBox), transformOrigin: `${pc(SCION.wx, SCION.w)} ${pc(SCION.wy, SCION.h)}` }}
            aria-label={c.scion}
            aria-pressed={state === 'armed'}
            aria-describedby="graft-hint"
            onPointerDown={onPointerDown}
            onKeyDown={onKey}
            onClick={(e) => e.preventDefault()}
            tabIndex={grafted ? -1 : 0}
          >
            <img src={`/img/v1-graft-a-scion${sm}.webp`} alt="" draggable="false" />
            <span className="scion__ring" aria-hidden="true" />
          </button>
          <span className="graft-cue" style={wide ? CUE_WIDE : CUE_NARROW} aria-hidden="true">
            <span className="graft-cue__in">
              <Icon icon={fine ? HandGrabIcon : Tap01Icon} size={20} />
              {fine ? c.cueDrag : c.cueTap}
            </span>
          </span>
        </div>
      </div>

      <div className="hero__after">
        <div className="hero__hint" id="graft-hint" aria-hidden={grafted}>
          <p className="hero__lead">{c.lead}</p>
          <p className="hero__hint-main">
            <span className="hero__hint-dot" aria-hidden="true" />
            {state === 'armed' ? c.hintArmed : c.hint}
          </p>
          <p className="hero__hint-sub">{c.hintKeys}</p>
        </div>
        <div className="hero__done" aria-hidden={!grafted}>
          <p className="hero__line">{c.line}</p>
          <p className="hero__sub">{c.sub}</p>
          <div className="hero__actions">
            <Ext className="btn btn--wa" href={wa(c.ctaWaMsg)} newTab={COPY[lang].newTab} tabIndex={grafted ? 0 : -1}>
              <WaIcon /> {c.ctaWa}
            </Ext>
            <Ext className="btn btn--ghost hero__store" href={LINKS.store} newTab={COPY[lang].newTab} tabIndex={grafted ? 0 : -1}>
              {c.ctaStore} <Arrow />
            </Ext>
            <button type="button" className="btn btn--text" onClick={reset} tabIndex={grafted ? 0 : -1}>
              ↺ {c.again}
            </button>
          </div>
        </div>
        <p className="sr-only" aria-live="polite">
          {grafted ? c.done : ''}
        </p>
      </div>
    </section>
  );
}
