// Vision, mission and future vision as large calligraphic statements that wait in the shade; as the visitor scrolls,
// a band of sunlight passes over the words (right to left in Arabic, left to right in English) and leaves them lit.
// Full motion: the section is pinned and the scroll drives the light. Reduced: three tabs, all words already lit.
import { useRef, useState } from 'react';
import { useLang } from '@shared/i18n.jsx';
import { gsap, useGSAP } from '@shared/gsap.js';
import { isMotionReduced } from '@shared/motion.jsx';
import { getLenis } from '@shared/useSmoothScroll.js';
import { Shade, LeafMark } from './Shade.jsx';
import { COPY } from './copy.js';

export function Statements() {
  const { lang, t, isRTL } = useLang();
  const c = COPY[lang];
  const reduced = isMotionReduced();
  const secRef = useRef(null);
  const stRef = useRef(null);
  const [idx, setIdx] = useState(0);
  const items = [t.vision, t.mission, t.future];

  useGSAP(
    () => {
      if (reduced) return;
      const els = gsap.utils.toArray('.stm__item', secRef.current);
      const hdr = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hdr')) || 64;
      gsap.set(els, { autoAlpha: 0 });
      gsap.set(els[0], { autoAlpha: 1 });
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: secRef.current,
          start: () => `top ${hdr}px`,
          end: () => `+=${window.innerHeight * 2.4}`,
          pin: true,
          scrub: 0.7,
          invalidateOnRefresh: true,
          onUpdate: (self) => setIdx(Math.min(2, Math.floor(self.progress * 3 * 0.999))),
        },
      });
      els.forEach((el, i) => {
        const lit = el.querySelectorAll('.lit');
        if (i > 0) tl.fromTo(el, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.25 }, '>');
        tl.fromTo(lit, { '--lit': 0 }, { '--lit': 1, duration: 1, stagger: 0.15 }, i > 0 ? '<0.1' : 0);
        if (i < els.length - 1) tl.to(el, { autoAlpha: 0, y: -30, duration: 0.25 }, '>0.15');
      });
      stRef.current = tl.scrollTrigger;
    },
    { dependencies: [reduced, lang], scope: secRef, revertOnUpdate: true }
  );

  const jump = (i) => {
    if (reduced || !stRef.current) {
      setIdx(i);
      return;
    }
    const st = stRef.current;
    const y = st.start + ((i + 0.62) / 3) * (st.end - st.start);
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y });
  };

  return (
    <section id="vision" className={`stm ${reduced ? 'is-tabs' : 'is-pinned'} ${isRTL ? 'is-rtl' : ''}`} ref={secRef} aria-labelledby="stm-title">
      <Shade className="shade--soft" seed={23} density={0.9} />
      <div className="stm__inner">
        <div className="stm__top">
          <h2 id="stm-title" className="eyebrow eyebrow--light">
            {c.statements.eyebrow}
          </h2>
          <div className="stm__tabs" role={reduced ? 'tablist' : undefined} aria-label={c.statements.eyebrow}>
            {items.map((it, i) => (
              <button
                key={it.title}
                type="button"
                className={`stm__tab ${idx === i ? 'is-on' : ''}`}
                role={reduced ? 'tab' : undefined}
                aria-selected={reduced ? idx === i : undefined}
                aria-current={!reduced && idx === i ? 'true' : undefined}
                onClick={() => jump(i)}
              >
                <LeafMark lit={idx === i} />
                <span>{it.title}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="stm__stack">
          {items.map((it, i) => (
            <article key={it.title} className={`stm__item ${reduced && idx !== i ? 'is-hidden' : ''}`} role={reduced ? 'tabpanel' : undefined} aria-hidden={reduced && idx !== i ? true : undefined}>
              <h3 className="stm__kicker">{it.title}</h3>
              <p className="stm__big display lit">{c.statements.big[i]}</p>
              <p className="stm__text lit">{it.text}</p>
            </article>
          ))}
        </div>
        {!reduced && <p className="stm__hint">{c.statements.hint}</p>}
      </div>
    </section>
  );
}
