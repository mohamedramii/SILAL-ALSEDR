// Why Thilal Al Sidr: the six points around the logo, like the profile page, always readable. Each point is joined to
// the logo by a real Sidr branch (the photographed tree's branch layers, turned and scaled so its base tucks under the
// centre and its leafy tip reaches the card). As the section scrolls in, the branches grow out of the centre (the same
// circle reveal as the services tree), their nabq appear and each card settles at its branch tip. Hovering a card lifts
// its branch a little. Phones: the logo on top and the cards down the screen on alternating sides, each reached by a
// branch coming in from the other edge. Reduce: everything is simply there.
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { useLang } from '@shared/i18n.jsx';
import { Icon } from '@shared/Icon.jsx';
import { SidrLogo } from '@shared/Logo.jsx';
import { ScrollTrigger } from '@shared/gsap.js';
import { Tree06Icon, Calendar03Icon, Globe02Icon, Leaf01Icon, Sun03Icon, Camera01Icon } from '@hugeicons/core-free-icons';
import { COPY } from './copy.js';
import { isReduced, useMedia } from './bits.jsx';
import { TREE } from './tree-layers.js';

const ICONS = [Tree06Icon, Calendar03Icon, Globe02Icon, Leaf01Icon, Sun03Icon, Camera01Icon];
// branch layers by the side their tip points to (L: tip on the left of the joint), most leafy first
const PICK = { L: [2, 4, 0, 6], R: [1, 5, 3, 7] };
const pc = (v, t) => `${((v / t) * 100).toFixed(3)}%`;

export default function Why() {
  const { lang } = useLang();
  const c = COPY[lang].why;
  const wide = useMedia('(min-width: 900px)');
  const reduced = isReduced();
  const sm = wide ? '' : '-sm';
  const ring = useRef(null);
  const core = useRef(null);
  const [geo, setGeo] = useState([]);
  const [hot, setHot] = useState(-1);
  const prog = useRef(reduced ? 1 : 0);

  // where each branch starts (under the centre, or at the far edge on phones) and where its tip meets the card
  const measure = useCallback(() => {
    const box = ring.current?.getBoundingClientRect();
    const cr = core.current?.getBoundingClientRect();
    if (!box || !cr || !box.width) return;
    const cx = cr.left + cr.width / 2 - box.left;
    const cy = cr.top + cr.height / 2 - box.top;
    const rad = Math.min(cr.width, cr.height) / 2;
    const used = { L: 0, R: 0 };
    const cards = [...ring.current.querySelectorAll('.why-card')];
    setGeo(
      cards.map((el) => {
        // the card's place without its settle offset
        const r = el.getBoundingClientRect();
        const t = new DOMMatrixReadOnly(getComputedStyle(el).transform === 'none' ? undefined : getComputedStyle(el).transform);
        const l = r.left - box.left - t.m41;
        const rr = r.right - box.left - t.m41;
        const my = r.top - box.top - t.m42 + r.height / 2;
        let side;
        let P0;
        let P1;
        if (wide) {
          side = (l + rr) / 2 < cx ? 'L' : 'R';
          P1 = [side === 'L' ? rr - 10 : l + 10, my];
          const dx = P1[0] - cx;
          const dy = P1[1] - cy;
          const d = Math.hypot(dx, dy);
          P0 = [cx + (dx / d) * rad * 0.6, cy + (dy / d) * rad * 0.6];
        } else {
          side = (l + rr) / 2 < box.width / 2 ? 'L' : 'R';
          P1 = [side === 'L' ? rr - 8 : l + 8, my - 4];
          P0 = [side === 'L' ? box.width + 18 : -18, my + 16];
        }
        const k = PICK[side][used[side]++ % 4];
        const b = TREE.branches[k];
        const vx = b.tip[0] - b.joint[0];
        const vy = b.tip[1] - b.joint[1];
        const len = Math.hypot(P1[0] - P0[0], P1[1] - P0[1]);
        const s = len / Math.hypot(vx, vy);
        const rot = ((Math.atan2(P1[1] - P0[1], P1[0] - P0[0]) - Math.atan2(vy, vx)) * 180) / Math.PI;
        // the card settles from a little nearer its branch's base
        return { k, side, x: P0[0], y: P0[1], s, rot, ux: (P0[0] - P1[0]) / len, uy: (P0[1] - P1[1]) / len };
      })
    );
  }, [wide]);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(ring.current);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [measure, lang]);

  // growth: each branch's --f from the section's scroll progress (staggered); reduced: all grown
  const paint = useCallback(() => {
    const el = ring.current;
    if (!el) return;
    const e = prog.current;
    el.querySelectorAll('[data-wi]').forEach((n) => {
      const i = +n.dataset.wi;
      const f = reduced ? 1 : Math.max(0, Math.min(1, (e - i * 0.07) / 0.55));
      n.style.setProperty('--f', (1 - (1 - f) * (1 - f)).toFixed(4));
      const on = f > 0.85 ? '1' : '0';
      if (n.dataset.on !== on) n.dataset.on = on;
    });
  }, [reduced]);

  useLayoutEffect(() => {
    if (reduced) {
      paint();
      return undefined;
    }
    const st = ScrollTrigger.create({
      trigger: ring.current,
      start: wide ? 'top 88%' : 'top 92%',
      end: wide ? 'center 52%' : 'center 55%',
      onUpdate: (self) => {
        prog.current = self.progress;
        paint();
      },
    });
    prog.current = st.progress;
    paint();
    return () => st.kill();
  }, [reduced, paint, wide, lang, geo]);

  return (
    <section className="why" id="why" data-fit aria-labelledby="why-title">
      <div className="why__ring" ref={ring}>
        {geo.map((g, i) => {
          const b = TREE.branches[g.k];
          const [bx, by, bw, bh] = b.box;
          const [jx, jy] = b.joint;
          const norm = Math.sqrt(bw * bw + bh * bh) / Math.SQRT2;
          return (
            <div
              key={i}
              className={`why-br is-${g.side} ${hot === i ? 'is-hot' : ''}`}
              data-wi={i}
              style={{ left: `${g.x}px`, top: `${g.y}px`, transform: `rotate(${g.rot.toFixed(2)}deg) scale(${g.s.toFixed(4)})` }}
              aria-hidden="true"
            >
              <img
                className="why-br__b"
                src={`/img/v1-tree-b${g.k + 1}${sm}.webp`}
                alt=""
                draggable="false"
                decoding="async"
                style={{
                  left: `${bx - jx}px`,
                  top: `${by - jy}px`,
                  width: `${bw}px`,
                  height: `${bh}px`,
                  '--jx': pc(jx - bx, bw),
                  '--jy': pc(jy - by, bh),
                  '--r': `${((b.reach + 14) / norm) * 100}%`,
                }}
              />
              {b.fruit ? (
                <img
                  className="why-br__f"
                  src={`/img/v1-tree-f${g.k + 1}${sm}.webp`}
                  alt=""
                  draggable="false"
                  decoding="async"
                  style={{
                    left: `${b.fruit.box[0] - jx}px`,
                    top: `${b.fruit.box[1] - jy}px`,
                    width: `${b.fruit.box[2]}px`,
                    height: `${b.fruit.box[3]}px`,
                    transformOrigin: `${pc(b.fruit.stem[0] - b.fruit.box[0], b.fruit.box[2])} 0%`,
                  }}
                />
              ) : null}
            </div>
          );
        })}
        <div className="why__core" ref={core}>
          <SidrLogo height={92} className="why__logo" />
          <h2 className="why__title" id="why-title">
            {c.title}
          </h2>
        </div>
        <ul className="why__list">
          {c.points.map((p, i) => (
            <li
              key={p}
              className={`why-card why-card--${i}`}
              data-wi={i}
              style={geo[i] ? { '--ux': geo[i].ux.toFixed(3), '--uy': geo[i].uy.toFixed(3) } : undefined}
              onMouseEnter={() => setHot(i)}
              onMouseLeave={() => setHot(-1)}
            >
              <span className="why-card__icon" aria-hidden="true">
                <Icon icon={ICONS[i]} size={24} />
              </span>
              <span className="why-card__text">
                <span className="why-card__n" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="why-card__p">{p}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <p className="why__line">{c.line}</p>
    </section>
  );
}
