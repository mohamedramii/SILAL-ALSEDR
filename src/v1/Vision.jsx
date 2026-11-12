// Vision, mission and future vision as a pinned scroll story told with real photo cut-outs:
// 1) a nabq pit falls onto a mound of dry Omani soil and sinks in -> the MISSION; 2) a Sidr seedling sprouts and hands
// over to the real tree, whose branches grow one after another -> the VISION; 3) the nabq appear on the branches;
// 4) the camera pulls back and the tree settles into their orchard photo -> the FUTURE VISION. Tabs jump to a chapter
// (they scroll the page there). Reduce: no pin, the three chapters as simple steps chosen with the tabs.
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLang } from '@shared/i18n.jsx';
import { ScrollTrigger } from '@shared/gsap.js';
import { getLenis } from '@shared/useSmoothScroll.js';
import { COPY } from './copy.js';
import { isReduced, useMedia, headerH } from './bits.jsx';
import { TREE } from './tree-layers.js';
import { LAYERS, boxStyle } from './tree-style.js';
import { SEED } from './seed-layers.js';

const { W, H } = TREE; // the world = the tree picture's frame (1024 x 1536 units)
const pc = (v, t) => `${((v / t) * 100).toFixed(3)}%`;
const clamp = (v) => Math.max(0, Math.min(1, v));
const seg = (p, a, b) => clamp((p - a) / (b - a));
const easeIn = (t) => t * t;
const easeOut = (t) => 1 - (1 - t) * (1 - t);
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2);

// where things sit in the world (tree units)
const BASE_X = TREE.trunk.box[0] + TREE.trunk.box[2] / 2;
const MOUND = (() => {
  const [, , sw, sh] = SEED.soil;
  const w = 780;
  const h = sh * (w / sw) * 0.42; // the heap was shot from above: squashed, it reads as a mound
  return { x: BASE_X - w / 2, y: H - 130, w, h };
})();
const SOIL_Y = MOUND.y + MOUND.h * 0.26; // the mound's top surface, where the pit lands and the seedling stands
const SPROUT = (() => {
  const [bx, by, bw, bh] = SEED.sprout;
  const k = (0.36 * H) / (SEED.collar[1] - by); // stem + leaves = 36% of the tree's height
  const cx = (SEED.collar[0] - bx) * k;
  const cy = (SEED.collar[1] - by) * k;
  return { x: BASE_X - cx, y: SOIL_Y - cy, w: bw * k, h: bh * k, ox: cx / (bw * k), oy: cy / (bh * k) };
})();
const PIT = (() => {
  const [, , bw, bh] = SEED.pit;
  const k = 120 / bw;
  return { x: BASE_X - (bw * k) / 2, y: SOIL_Y - bh * k * 0.62, w: bw * k, h: bh * k };
})();
// one real tree in the orchard photo (fractions of the photo): canopy left/right/top and trunk base. Wide layouts: the
// big tree left of the road (clear of the text card in both languages); phones: a tree right of the road above the card
const REAL_TREE = {
  wide: { left: 0.39, right: 0.54, top: 0.49, base: [0.448, 0.77] },
  phone: { left: 0.54, right: 0.61, top: 0.46, base: [0.576, 0.572] },
};
const worldBox = (b) => ({ left: pc(b.x, W), top: pc(b.y, H), width: pc(b.w, W), height: pc(b.h, H) });
// the three chapters: the story order is mission, vision, future; where each one rests in the scroll
const ORDER = [1, 0, 2]; // indexes into copy.vision.items ([vision, mission, future])
const AT = [0.2, 0.68, 1];

export default function Vision() {
  const { lang } = useLang();
  const c = COPY[lang].vision;
  const reduced = isReduced();
  const wide = useMedia('(min-width: 900px)');
  const sm = wide ? '' : '-sm';
  const [chap, setChap] = useState(0);
  const stage = useRef(null);
  const st = useRef(null);

  // the whole story as a function of p (0..1)
  const paint = useCallback((p) => {
    const root = stage.current;
    if (!root) return;
    const q = (s) => root.querySelector(s);
    // 1. the pit falls, lands, sinks into the soil
    const fall = easeIn(seg(p, 0.02, 0.12));
    const sink = easeOut(seg(p, 0.13, 0.2));
    const dropUnits = -(SOIL_Y + 1100); // starts well above the scene
    const pit = q('.vs-pit');
    pit.style.transform = `translateY(${(((1 - fall) * dropUnits + sink * 70) / PIT.h) * 100}%) rotate(${(1 - fall) * -24}deg)`;
    pit.style.opacity = String(p < 0.01 ? 0 : 1 - seg(p, 0.17, 0.21));
    // 2. the seedling sprouts, then hands over to the tree, which rises; its branches grow one after another
    const grow = easeOut(seg(p, 0.22, 0.34));
    const hand = seg(p, 0.34, 0.42);
    const sprout = q('.vs-sprout');
    sprout.style.transform = `scale(${(0.04 + 0.96 * grow) * (1 + hand * 0.55)})`;
    sprout.style.opacity = String(grow > 0 ? 1 - easeInOut(hand) : 0);
    const tree = q('.vs-tree');
    tree.style.setProperty('--t', String(easeOut(seg(p, 0.34, 0.46))));
    tree.querySelectorAll('.ptree__b').forEach((b) => {
      const i = +b.dataset.i;
      const f = seg(p, 0.44 + i * 0.026, 0.5 + i * 0.026);
      b.style.setProperty('--f', (1 - (1 - f) * (1 - f)).toFixed(4));
      b.style.visibility = f > 0 ? 'visible' : 'hidden';
    });
    // 3. the nabq appear
    tree.querySelectorAll('.ptree__f').forEach((f) => {
      const i = +f.dataset.fi;
      const on = p > 0.68 + i * 0.008 ? '1' : '0';
      if (f.dataset.on !== on) f.dataset.on = on;
    });
    // 4. the camera pulls back: the soil mound goes and the cut-out tree travels to the exact place and size of one
    // real tree in their orchard photo, fading into it as it arrives; the photo comes to full sharpness and colour.
    // The final frame is only the real photo. (A real tree that is never under the text card, per layout.)
    const back = easeInOut(seg(p, 0.78, 0.97));
    const world = q('.vs-world');
    const scene = q('.vs__scene');
    const wideNow = root.offsetWidth >= 860;
    const sw = root.offsetWidth;
    const sh = root.offsetHeight;
    // the orchard photo is object-fit: cover (1600 x 893); where the chosen real tree stands at the end
    const sImg = Math.max(sw / 1600, sh / 893);
    const rw = 1600 * sImg;
    const rh = 893 * sImg;
    const ox = (sw - rw) / 2;
    const oy = (sh - rh) / 2;
    const T = wideNow ? REAL_TREE.wide : REAL_TREE.phone;
    const tx = ox + T.base[0] * rw;
    const ty = oy + T.base[1] * rh;
    const sEnd = ((T.base[1] - T.top) * rh) / (((SOIL_Y - 15) / H) * world.offsetHeight);
    root.dataset.realTree = [ox + T.left * rw, oy + T.top * rh, ox + T.right * rw, ty].map((v) => Math.round(v)).join(',');
    // the soil point (the transform origin) in stage pixels
    const sx = scene.offsetLeft + world.offsetLeft + (BASE_X / W) * world.offsetWidth;
    const sy = scene.offsetTop + world.offsetTop + (SOIL_Y / H) * world.offsetHeight;
    world.style.transform = `translate(${(back * (tx - sx)).toFixed(1)}px, ${(back * (ty - sy)).toFixed(1)}px) scale(${(1 + back * (sEnd - 1)).toFixed(4)})`;
    world.style.opacity = String(1 - seg(back, 0.62, 0.99));
    const gone = seg(back, 0.05, 0.45);
    const mound = q('.vs-mound');
    mound.style.opacity = String(1 - gone);
    mound.style.transform = `scale(${1 - 0.45 * gone})`;
    tree.style.setProperty('--cut', `${(back > 0.02 ? ((TREE.trunk.box[1] + TREE.trunk.box[3] - SOIL_Y - 4) / TREE.trunk.box[3]) * 100 : 0).toFixed(2)}%`);
    const orch = q('.vs-orchard');
    orch.style.opacity = String(easeOut(seg(p, 0.76, 0.92)));
    orch.style.transform = `scale(${1.28 - 0.28 * back})`;
    orch.style.filter = back < 0.999 ? `blur(${((1 - back) * 5).toFixed(2)}px) saturate(${(0.72 + 0.28 * back).toFixed(3)})` : 'none';
    root.classList.toggle('is-orchard', p > 0.84);
    const k = p < 0.4 ? 0 : p < 0.8 ? 1 : 2;
    setChap((x) => (x === k ? x : k));
  }, []);

  useLayoutEffect(() => {
    if (reduced) {
      paint(AT[0]);
      return undefined;
    }
    const trigger = ScrollTrigger.create({
      trigger: stage.current,
      start: () => `top top+=${headerH()}`,
      end: () => `+=${Math.round(window.innerHeight * 3.2)}`,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => paint(self.progress),
    });
    st.current = trigger;
    paint(trigger.progress);
    return () => {
      trigger.kill();
      st.current = null;
    };
  }, [reduced, paint, wide, lang]);

  useEffect(() => {
    if (reduced) paint(AT[chap]);
  }, [reduced, chap, paint]);

  const pick = (k) => {
    const t = st.current;
    if (!t) {
      setChap(k);
      return;
    }
    const y = t.start + AT[k] * (t.end - t.start) - (k === 2 ? 2 : 0);
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(y, { duration: 1.6 });
    else window.scrollTo({ top: y });
  };

  const onKey = (e) => {
    const fwd = lang === 'ar' ? 'ArrowLeft' : 'ArrowRight';
    const back = lang === 'ar' ? 'ArrowRight' : 'ArrowLeft';
    let k = null;
    if (e.key === fwd) k = Math.min(2, chap + 1);
    else if (e.key === back) k = Math.max(0, chap - 1);
    if (k === null) return;
    e.preventDefault();
    pick(k);
    stage.current.querySelectorAll('.vs-tab')[k]?.focus({ preventScroll: true });
  };

  return (
    <section className="vs" id="vision" aria-labelledby="vs-title">
      <div className={`vs__stage ${reduced ? 'is-static' : ''}`} ref={stage} data-fit>
        <div className="vs-orchard" aria-hidden="true">
          <img src={wide ? '/img/v1-vision.webp' : '/img/v1-vision-sm.webp'} alt="" loading="lazy" decoding="async" />
        </div>

        <div className="vs__scene" aria-hidden="true">
          <div className="vs-world" style={{ aspectRatio: `${W} / ${H}`, transformOrigin: `${pc(BASE_X, W)} ${pc(SOIL_Y, H)}` }}>
            <div className="vs-tree ptree">
              <img className="ptree__l ptree__trunk" src={`/img/v1-tree-trunk${sm}.webp`} style={boxStyle(TREE.trunk.box)} alt="" draggable="false" loading="lazy" decoding="async" />
              {LAYERS.map((L, i) => (
                <img key={`b${i}`} className="ptree__l ptree__b" data-i={i} src={`/img/v1-tree-b${i + 1}${sm}.webp`} style={L.style} alt="" draggable="false" loading="lazy" decoding="async" />
              ))}
              {LAYERS.map((L, i) =>
                L.fruit ? (
                  <img key={`f${i}`} className="ptree__l ptree__f" data-fi={i} src={`/img/v1-tree-f${i + 1}${sm}.webp`} style={L.fruit} alt="" draggable="false" loading="lazy" decoding="async" />
                ) : null
              )}
            </div>
            <img className="vs-pit" src={`/img/v1-seed-pit${sm}.webp`} style={worldBox(PIT)} alt="" draggable="false" loading="lazy" decoding="async" />
            <img
              className="vs-sprout"
              src={`/img/v1-seed-sprout${sm}.webp`}
              style={{ ...worldBox(SPROUT), transformOrigin: `${(SPROUT.ox * 100).toFixed(2)}% ${(SPROUT.oy * 100).toFixed(2)}%` }}
              alt=""
              draggable="false"
              loading="lazy"
              decoding="async"
            />
            <img className="vs-mound" src={`/img/v1-seed-soil${sm}.webp`} style={worldBox(MOUND)} alt="" draggable="false" loading="lazy" decoding="async" />
          </div>
        </div>

        <div className="vs__panel">
          <p className="eyebrow">{c.eyebrow}</p>
          <h2 className="h2 vs__title" id="vs-title">
            {c.title}
          </h2>
          <div className="vs__tabs" role="tablist" aria-label={c.tabs}>
            {ORDER.map((idx, k) => (
              <button
                key={idx}
                type="button"
                role="tab"
                className={`chip vs-tab ${chap === k ? 'is-on' : ''}`}
                aria-selected={chap === k}
                aria-controls="vs-text"
                tabIndex={chap === k ? 0 : -1}
                onClick={() => pick(k)}
                onKeyDown={onKey}
              >
                <span className="vs-tab__n" aria-hidden="true">
                  {k + 1}
                </span>
                {c.short[idx]}
              </button>
            ))}
          </div>
          <div className="vs__text" id="vs-text" role="tabpanel" aria-live="polite">
            {ORDER.map((idx, k) => (
              <div key={idx} className={`vs-chap ${chap === k ? 'is-on' : ''}`} aria-hidden={chap !== k}>
                <h3 className="vs-chap__t">{c.items[idx].title}</h3>
                <p className="vs-chap__x">{c.items[idx].text}</p>
              </div>
            ))}
          </div>
          {!reduced ? <p className="vs__hint">{c.hint}</p> : null}
        </div>
      </div>
    </section>
  );
}
