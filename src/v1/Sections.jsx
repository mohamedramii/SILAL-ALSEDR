// About, Founder, Products and Workshops.
import { useLayoutEffect, useRef } from 'react';
import { useLang } from '@shared/i18n.jsx';
import { LINKS, FACTS } from '@shared/content.js';
import { Icon } from '@shared/Icon.jsx';
import { Leaf01Icon, JarIcon, Apple01Icon, Store01Icon, BookOpen01Icon, InstagramIcon } from '@hugeicons/core-free-icons';
import { gsap } from '@shared/gsap.js';
import { COPY, wa } from './copy.js';
import { Ext, Arrow, WaIcon, Leaf, isReduced, DoubleOval, leafPath, ribPath } from './bits.jsx';

const PILLAR_LEAVES = ['light', 'dark', 'light', 'dark'];

export function About() {
  const { lang } = useLang();
  const c = COPY[lang].about;
  const facts = FACTS.slice(0, 3);
  return (
    <section className="about" id="about" data-fit aria-labelledby="about-title">
      <figure className="about__ph">
        <img src="/img/v1-identity-sm.webp" srcSet="/img/v1-identity-sm.webp 720w, /img/v1-identity.webp 1200w" sizes="(min-width: 900px) 40vw, 100vw" width="1200" height="841" alt={c.photo} loading="lazy" decoding="async" />
      </figure>
      <div className="about__body">
        <p className="eyebrow">{c.eyebrow}</p>
        <h2 className="h2 about__title" id="about-title">{c.title}</h2>
        <p className="about__text">{c.text}</p>
        <ul className="about__pillars" aria-label={c.pillarsLabel}>
          {c.pillars.map((p, i) => (
            <li key={p}>
              <svg viewBox="-2 -14 34 28" aria-hidden="true" focusable="false">
                <Leaf L={28} tone={PILLAR_LEAVES[i]} />
              </svg>
              {p}
            </li>
          ))}
        </ul>
        <dl className="about__facts">
          {facts.map((f) => (
            <div key={f.en}>
              <dt>
                {f.value === 2020 ? (lang === 'ar' ? 'منذ ' : 'since ') : '+'}
                <b>{f.value}</b>
              </dt>
              <dd>{f.value === 2020 ? (lang === 'ar' ? 'خبرة ميدانية موثقة' : 'documented field experience') : f[lang]}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function Founder() {
  const { lang } = useLang();
  const c = COPY[lang].founder;
  const q = useRef(null);
  useLayoutEffect(() => {
    if (isReduced()) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        q.current.querySelectorAll('.w'),
        { opacity: 0.16 },
        { opacity: 1, stagger: 0.08, ease: 'none', scrollTrigger: { trigger: q.current, start: 'top 82%', end: 'bottom 52%', scrub: true } }
      );
    }, q);
    return () => ctx.revert();
  }, [lang]);
  const words = c.quote.split(' ');
  return (
    <section className="founder" id="founder" data-fit aria-labelledby="founder-title">
      <figure className="founder__ph">
        <img src="/img/pdf-p03-68.webp" width="1024" height="919" alt={c.photo} loading="lazy" decoding="async" />
      </figure>
      <div className="founder__body">
        <p className="eyebrow eyebrow--on-dark">{c.eyebrow}</p>
        <h2 className="founder__name" id="founder-title">{c.name}</h2>
        <p className="founder__role">{c.role}</p>
        <p className="founder__text">{c.text}</p>
        <blockquote className="founder__quote" ref={q}>
          <p>
            <span className="founder__mark" aria-hidden="true">“</span>
            {words.map((w, i) => (
              <span className="w" key={i}>
                {w}{' '}
              </span>
            ))}
          </p>
        </blockquote>
        <Ext className="btn btn--line" href={LINKS.instagram} newTab={COPY[lang].newTab}>
          <Icon icon={InstagramIcon} size={20} /> {c.follow}
        </Ext>
      </div>
    </section>
  );
}

const PRODUCT_ICONS = { care: Leaf01Icon, food: JarIcon, fruit: Apple01Icon };

export function Products() {
  const { lang, t } = useLang();
  const c = COPY[lang].products;
  const list = c.keys.map((k) => t.services.find((s) => s.key === k));
  return (
    <section className="prod" id="products" data-fit aria-labelledby="prod-title">
      <header className="prod__head">
        <p className="eyebrow">{c.eyebrow}</p>
        <h2 className="h2" id="prod-title">{c.title}</h2>
        <p className="prod__lead">{c.lead}</p>
      </header>
      <ul className="prod__list">
        {list.map((s, i) => (
          <li className="label" key={s.key} style={{ '--i': i }}>
            <DoubleOval className="label__oval" w={420} h={250} />
            <svg className="label__leaves" viewBox="-40 -46 80 50" aria-hidden="true" focusable="false">
              <g transform="translate(-4 2) rotate(-112)">
                <path d={leafPath(44)} fill="var(--leaf-dark)" />
                <path d={ribPath(44)} fill="none" stroke="var(--white)" strokeWidth="2.2" strokeLinecap="round" />
              </g>
              <g transform="translate(6 2) rotate(-58)">
                <path d={leafPath(30)} fill="var(--leaf-light)" />
                <path d={ribPath(30)} fill="none" stroke="var(--white)" strokeWidth="1.8" strokeLinecap="round" />
              </g>
            </svg>
            <span className="label__icon">
              <Icon icon={PRODUCT_ICONS[s.key]} size={26} />
            </span>
            <h3 className="label__t">{s.title}</h3>
            <p className="label__tag">{c.tags[i]}</p>
            <p className="label__x">{s.text}</p>
          </li>
        ))}
      </ul>
      <div className="prod__actions">
        <Ext className="btn btn--solid" href={LINKS.store} newTab={COPY[lang].newTab}>
          <Icon icon={Store01Icon} size={20} /> {c.store}
        </Ext>
        <Ext className="btn btn--ghost" href={LINKS.catalogue} newTab={COPY[lang].newTab}>
          <Icon icon={BookOpen01Icon} size={20} /> {c.catalogue}
        </Ext>
      </div>
    </section>
  );
}

export function Workshops() {
  const { lang, t } = useLang();
  const c = COPY[lang].workshops;
  const s = t.services.find((x) => x.key === 'workshops');
  return (
    <section className="ws" id="workshops" data-fit aria-labelledby="ws-title">
      <figure className="ws__ph">
        <img src="/img/v1-workshop-sm.webp" srcSet="/img/v1-workshop-sm.webp 640w, /img/v1-workshop.webp 1000w" sizes="(min-width: 900px) 36vw, 100vw" width="1000" height="1071" alt={c.photo} loading="lazy" decoding="async" />
      </figure>
      <div className="ws__body">
        <p className="eyebrow">{c.eyebrow}</p>
        <h2 className="h2" id="ws-title">{s.title}</h2>
        <p className="ws__text">{c.text}</p>
        <ol className="ws__points">
          {c.points.map((p, i) => (
            <li key={p}>
              <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              {p}
            </li>
          ))}
        </ol>
        <Ext className="btn btn--wa" href={wa(c.ctaMsg)} newTab={COPY[lang].newTab}>
          <WaIcon /> {c.cta} <Arrow />
        </Ext>
      </div>
    </section>
  );
}
