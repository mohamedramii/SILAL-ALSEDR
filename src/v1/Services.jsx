// Services as a growing tree: a pinned scene; scrolling grows a real Sidr tree branch by branch, each branch one of
// the eight services. The tree is one photograph cut into layers (research/tools/v1-tree-cut.py): the trunk rises
// first, then each branch grows out of its joint (clip reveal + a small settle), its nabq appear and its number
// lights up. Tapping a number (or the arrows, or the arrow keys) jumps to that branch. Reduce: the whole tree, taps.
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLang } from '@shared/i18n.jsx';
import { ScrollTrigger } from '@shared/gsap.js';
import { COPY, SERVICE_MEDIA, wa } from './copy.js';
import { Arrow, Ext, WaIcon, isReduced, usePinnedSteps, useMedia } from './bits.jsx';
import { TREE } from './tree-layers.js';
import { LAYERS, boxStyle } from './tree-style.js';

const { W, H } = TREE;

export default function Services() {
  const { lang, t } = useLang();
  const c = COPY[lang].services;
  const items = t.services;
  const n = items.length;
  const wide = useMedia('(min-width: 900px)');
  const reduced = isReduced();
  const [active, setActive] = useState(0);
  const stage = useRef(null);
  const tree = useRef(null);
  const pRef = useRef(0); // pinned progress 0..1
  const eRef = useRef(reduced ? 1 : 0); // entrance 0..1 (trunk, then the first branch)
  const sm = wide ? '' : '-sm';

  // trunk height and each branch's growth from the entrance and the pinned progress
  const redraw = useCallback(() => {
    const el = tree.current;
    if (!el) return;
    const s = pRef.current * (n - 1);
    const e = eRef.current;
    el.style.setProperty('--t', reduced ? '1' : String(Math.min(1, e / 0.55)));
    el.querySelectorAll('.ptree__b').forEach((b) => {
      const i = +b.dataset.i;
      const f = reduced ? 1 : i === 0 ? (s > 0.001 ? 1 : Math.max(0, Math.min(1, (e - 0.5) / 0.5))) : Math.max(0, Math.min(1, s - i + 1));
      const eased = 1 - (1 - f) * (1 - f);
      b.style.setProperty('--f', eased.toFixed(4));
      // the number lights up as the branch comes out, the nabq appear once it is grown
      const nOn = f > 0.45 ? '1' : '0';
      const fOn = f > 0.85 ? '1' : '0';
      const key = nOn + fOn;
      if (b.dataset.on !== key) {
        b.dataset.on = key;
        el.querySelectorAll(`[data-fi="${i}"]`).forEach((x) => (x.dataset.on = fOn));
        el.querySelectorAll(`[data-ni="${i}"]`).forEach((x) => (x.dataset.on = nOn));
      }
    });
  }, [n, reduced]);

  const onProgress = useCallback(
    (p) => {
      pRef.current = p;
      const idx = Math.min(n - 1, Math.round(p * (n - 1)));
      setActive((a) => (a === idx ? a : idx));
      redraw();
    },
    [n, redraw]
  );

  const goTo = usePinnedSteps(stage, n, onProgress, { enabled: !reduced, per: wide ? 0.5 : 0.42, deps: [wide, lang] });

  // the trunk rises and the first branch grows as the scene comes in
  useLayoutEffect(() => {
    if (reduced) {
      redraw();
      return undefined;
    }
    const st = ScrollTrigger.create({
      trigger: stage.current,
      start: 'top 92%',
      end: 'top 18%',
      onUpdate: (self) => {
        eRef.current = self.progress;
        redraw();
      },
    });
    eRef.current = st.progress;
    redraw();
    return () => st.kill();
  }, [reduced, redraw, wide, lang]);

  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => clearTimeout(id);
  }, [lang, wide]);

  // keep the classes React does not manage in step after a re-render
  useEffect(() => {
    redraw();
  });

  const pick = (i) => {
    const k = Math.max(0, Math.min(n - 1, i));
    if (!goTo(k)) setActive(k);
  };

  const onListKey = (e) => {
    const fwd = ['ArrowUp', lang === 'ar' ? 'ArrowLeft' : 'ArrowRight'];
    const back = ['ArrowDown', lang === 'ar' ? 'ArrowRight' : 'ArrowLeft'];
    let k = null;
    if (fwd.includes(e.key)) k = active + 1;
    else if (back.includes(e.key)) k = active - 1;
    else if (e.key === 'Home') k = 0;
    else if (e.key === 'End') k = n - 1;
    if (k === null) return;
    e.preventDefault();
    k = Math.max(0, Math.min(n - 1, k));
    pick(k);
    requestAnimationFrame(() => stage.current.querySelectorAll('.svc-node')[k]?.focus({ preventScroll: true }));
  };

  const s = items[active];
  const m = SERVICE_MEDIA[s.key];
  const num = (i) => String(i + 1).padStart(2, '0');

  return (
    <section className="svc" id="services" aria-labelledby="svc-title">
      <div className={`svc__stage ${reduced ? 'is-static' : ''}`} ref={stage} data-fit>
        <header className="svc__head">
          <p className="eyebrow">{c.eyebrow}</p>
          <h2 className="h2" id="svc-title">{c.title}</h2>
          <p className="svc__hint">{reduced ? c.hintReduced : c.hint}</p>
        </header>

        <div className="svc__tree" role="group" aria-label={c.list} onKeyDown={onListKey}>
          <div className="ptree" ref={tree} style={{ aspectRatio: `${W} / ${H}` }}>
            <span className="ptree__shade" aria-hidden="true" />
            <img className="ptree__l ptree__trunk" src={`/img/v1-tree-trunk${sm}.webp`} style={boxStyle(TREE.trunk.box)} alt="" decoding="async" loading="lazy" draggable="false" />
            {LAYERS.map((L, i) => (
              <img
                key={`b${i}`}
                className={`ptree__l ptree__b ${i === active ? 'is-active' : ''}`}
                data-i={i}
                src={`/img/v1-tree-b${i + 1}${sm}.webp`}
                style={L.style}
                alt=""
                decoding="async"
                loading="lazy"
                draggable="false"
              />
            ))}
            {LAYERS.map((L, i) =>
              L.fruit ? (
                <img
                  key={`f${i}`}
                  className="ptree__l ptree__f"
                  data-fi={i}
                  src={`/img/v1-tree-f${i + 1}${sm}.webp`}
                  style={{ ...L.fruit, transitionDelay: `${(i % 2) * 40}ms` }}
                  alt=""
                  decoding="async"
                  loading="lazy"
                  draggable="false"
                />
              ) : null
            )}
            <span className="sr-only">{c.list}</span>
            {items.map((it, i) => (
              <div key={it.key} className={`svc-pt is-${LAYERS[i].side === 'L' ? 'left' : 'right'} ${i === active ? 'is-active' : ''}`} data-ni={i} style={LAYERS[i].tip}>
                <button
                  type="button"
                  className="svc-node"
                  aria-current={i === active ? 'true' : undefined}
                  aria-label={wide ? undefined : `${num(i)} ${it.title}`}
                  tabIndex={i === active ? 0 : -1}
                  onClick={() => pick(i)}
                >
                  <span className="svc-node__n" aria-hidden="true">
                    {num(i)}
                  </span>
                  {wide ? <span className="svc-node__t">{it.title}</span> : null}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* phones: the eight texts, unseen, in the panel's place: the row is as tall as the longest, so the tree above
            keeps one size from branch to branch */}
        {!wide ? (
          <div className="svc-sizer" aria-hidden="true">
            {items.map((it) => (
              <div className="svc-panel__body" key={it.key}>
                <p className="svc-panel__n">
                  <span>00</span> / 00
                </p>
                <h3 className="svc-panel__t">{it.title}</h3>
                {it.where ? <p className="svc-panel__where">{it.where}</p> : null}
                <p className="svc-panel__x">{it.text}</p>
                <div className="svc-panel__row">
                  <span className="btn btn--wa btn--sm">
                    <WaIcon size={18} /> {c.ask}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <article className="svc-panel" aria-live="polite" key={`${lang}-${active}`}>
          <figure className="svc-panel__ph">
            <img src={`/img/${m.img}.webp`} alt={m[lang]} width="960" height="720" loading="lazy" decoding="async" />
          </figure>
          <div className="svc-panel__body">
            <p className="svc-panel__n">
              <span>{num(active)}</span> / {num(n - 1)}
            </p>
            <h3 className="svc-panel__t">{s.title}</h3>
            {s.where ? <p className="svc-panel__where">{s.where}</p> : null}
            <p className="svc-panel__x">{s.text}</p>
            <div className="svc-panel__row">
              <Ext className="btn btn--wa btn--sm" href={wa(c.askMsg(s.title))} newTab={COPY[lang].newTab}>
                <WaIcon size={18} /> {c.ask}
              </Ext>
              <div className="svc-panel__nav">
                <button type="button" className="icon-btn" aria-label={c.prev} onClick={() => pick(active - 1)} disabled={active === 0}>
                  <Arrow dir="prev" />
                </button>
                <button type="button" className="icon-btn" aria-label={c.next} onClick={() => pick(active + 1)} disabled={active === n - 1}>
                  <Arrow dir="next" />
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
