// Design 2 — "Shades" (ظِلال): the cool shade a Sidr tree throws in the Omani sun. Cinematic and editorial, built on
// light and shadow: the visitor moves the sun in the hero and the canopy's shade follows across the whole page.
import { useEffect, useMemo, useState } from 'react';
import {
  WhatsappIcon,
  Call02Icon,
  Mail01Icon,
  ShoppingBag01Icon,
  Pdf01Icon,
  BookOpen01Icon,
  InstagramIcon,
  TiktokIcon,
  Menu01Icon,
  Cancel01Icon,
  Plant02Icon,
  Calendar03Icon,
  Globe02Icon,
  Leaf01Icon,
  Sun03Icon,
  CheckmarkCircle02Icon,
  ArrowUp01Icon,
  Location01Icon,
  ArrowUpRight01Icon,
} from '@hugeicons/core-free-icons';
import { useLang } from '@shared/i18n.jsx';
import { LINKS, COUNTRIES, BRAND } from '@shared/content.js';
import { Icon } from '@shared/Icon.jsx';
import { SidrLogo } from '@shared/Logo.jsx';
import { MotionToggle, isMotionReduced } from '@shared/motion.jsx';
import { useSmoothScroll } from '@shared/useSmoothScroll.js';
import { goToId } from './nav.js';
import { revealLines, useGSAP, gsap } from '@shared/gsap.js';
import { Hero } from './Hero.jsx';
import { Journey } from './Journey.jsx';
import { Library } from './Library.jsx';
import { Statements } from './Statements.jsx';
import { Shade, LeafMark } from './Shade.jsx';
import { COPY } from './copy.js';

const ext = { target: '_blank', rel: 'noopener noreferrer' };

function setMotion(level) {
  try {
    localStorage.setItem('thilal-motion', level);
  } catch {
    /* storage unavailable */
  }
  const url = new URL(window.location.href);
  url.searchParams.delete('motion');
  window.location.replace(url.toString());
}

function MotionSwitch({ c, className = '' }) {
  const reduced = isMotionReduced();
  return (
    <button type="button" className={`motion-switch ${className}`} onClick={() => setMotion(reduced ? 'full' : 'reduced')} aria-pressed={reduced}>
      <span className={`motion-switch__dot ${reduced ? '' : 'is-on'}`} aria-hidden="true" />
      <span>{reduced ? c.motionFull : c.motionReduce}</span>
    </button>
  );
}

function Header() {
  const { lang, t, toggle } = useLang();
  const c = COPY[lang];
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => {
    if (!open) return undefined;
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', esc);
    document.documentElement.classList.add('menu-open');
    return () => {
      window.removeEventListener('keydown', esc);
      document.documentElement.classList.remove('menu-open');
    };
  }, [open]);
  const go = (e, id) => {
    e.preventDefault();
    setOpen(false);
    goToId(id);
  };
  return (
    <header className={`hdr ${solid ? 'is-solid' : ''} ${open ? 'is-open' : ''}`}>
      <a className="skip" href="#main">
        {c.skip}
      </a>
      <div className="hdr__bar">
        <a className="hdr__logo" href="#top" onClick={(e) => go(e, 'top')} aria-label={`${BRAND.nameAr} | ${BRAND.nameEn}`}>
          <SidrLogo variant="white" height={40} alt="" />
        </a>
        <nav className="hdr__nav" aria-label={c.menu}>
          {c.nav.map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={(e) => go(e, id)}>
              {label}
            </a>
          ))}
        </nav>
        <div className="hdr__tools">
          <MotionSwitch c={c} className="hdr__motion" />
          <button type="button" className="hdr__lang" onClick={toggle} lang={lang === 'ar' ? 'en' : 'ar'}>
            {t.langSwitch}
          </button>
          <a className="btn btn--sun btn--sm hdr__wa" href={LINKS.whatsapp} {...ext}>
            <Icon icon={WhatsappIcon} size={18} />
            <span>{lang === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
          </a>
          <button type="button" className="hdr__menu" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="v2-menu" aria-label={open ? c.close : c.menu}>
            <Icon icon={open ? Cancel01Icon : Menu01Icon} size={22} />
          </button>
        </div>
      </div>
      <div id="v2-menu" className="menu" hidden={!open}>
        <nav aria-label={c.menu}>
          {c.nav.map(([id, label], i) => (
            <a key={id} href={`#${id}`} onClick={(e) => go(e, id)}>
              <span className="menu__n">{String(i + 1).padStart(2, '0')}</span>
              {label}
            </a>
          ))}
        </nav>
        <div className="menu__foot">
          <a className="btn btn--sun" href={LINKS.whatsapp} {...ext}>
            <Icon icon={WhatsappIcon} size={20} />
            <span>{t.contact.whatsapp}</span>
          </a>
          <MotionSwitch c={c} />
        </div>
      </div>
    </header>
  );
}

function About() {
  const { lang, t } = useLang();
  const c = COPY[lang];
  const icons = [Sun03Icon, Leaf01Icon, Plant02Icon, ShoppingBag01Icon];
  return (
    <section id="about" className="about" aria-labelledby="about-title">
      <div className="about__photo">
        <img
          src="/img/pdf-p02-43-sm.webp"
          srcSet="/img/pdf-p02-43-sm.webp 1280w, /img/pdf-p02-43.webp 2400w"
          sizes="(max-width: 700px) 100vw, 44vw"
          width="2400"
          height="1792"
          alt={c.about.photo}
          loading="lazy"
          decoding="async"
        />
        <Shade className="shade--photo" seed={5} density={0.8} />
      </div>
      <div className="about__text">
        <p className="eyebrow">{c.about.eyebrow}</p>
        <h2 id="about-title" className="h2 reveal">
          {c.about.title}
        </h2>
        <p className="about__body">{t.about}</p>
        <ul className="pillars">
          {t.pillars.map((p, i) => (
            <li key={p}>
              <Icon icon={icons[i]} size={22} />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Founder() {
  const { lang, t } = useLang();
  const c = COPY[lang];
  return (
    <section id="founder" className="founder" aria-labelledby="founder-title">
      <Shade className="shade--soft" seed={41} density={0.7} />
      <figure className="founder__photo">
        <img
          src="/img/pdf-p11-02.webp"
          srcSet="/img/pdf-p11-02-sm.webp 1280w, /img/pdf-p11-02.webp 1458w"
          sizes="(max-width: 700px) 100vw, 46vw"
          width="1458"
          height="1022"
          alt={c.founder.photo}
          loading="lazy"
          decoding="async"
        />
      </figure>
      <div className="founder__text">
        <p className="eyebrow eyebrow--light">{c.founder.eyebrow}</p>
        <h2 id="founder-title" className="founder__name display">
          {t.founder.name}
        </h2>
        <p className="founder__role">
          {t.founder.role} · {BRAND.company}
        </p>
        <p className="founder__since">{t.founder.text}</p>
        <blockquote className="founder__quote">
          <p className="founder__words">{c.founder.words}</p>
          <p className="founder__q">{t.quote}</p>
          <footer>— {t.founder.name}</footer>
        </blockquote>
        <a className="btn btn--glass" href={LINKS.instagram} {...ext}>
          <Icon icon={InstagramIcon} size={20} />
          <span>{c.founder.follow}</span>
        </a>
      </div>
    </section>
  );
}

function Why() {
  const { lang, t } = useLang();
  const c = COPY[lang];
  const icons = [Plant02Icon, Calendar03Icon, Globe02Icon, Leaf01Icon, Sun03Icon, CheckmarkCircle02Icon];
  return (
    <section id="why" className="why" aria-labelledby="why-title">
      <Shade className="shade--light" seed={3} density={0.8} />
      <div className="why__head">
        <p className="eyebrow">{t.identity.title}</p>
        <p className="why__identity display">{t.identity.text}</p>
      </div>
      <div className="why__body">
        <h2 id="why-title" className="h2">
          {t.why.title}
        </h2>
        <ol className="why__list">
          {t.why.points.map((p, i) => (
            <li key={p} className="why__pt" tabIndex={-1}>
              <span className="why__ic">
                <Icon icon={icons[i]} size={24} />
              </span>
              <span className="why__n" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="why__tx">{p}</span>
            </li>
          ))}
        </ol>
        <p className="why__line">
          <LeafMark lit />
          <span>{t.why.line}</span>
        </p>
      </div>
    </section>
  );
}

function Contact() {
  const { lang, t } = useLang();
  const c = COPY[lang];
  const [svc, setSvc] = useState(0);
  const [country, setCountry] = useState(0);
  const [note, setNote] = useState('');
  const msg = useMemo(() => {
    const s = t.services[svc].title;
    const k = COUNTRIES[lang][country];
    return `${c.contact.hello}: ${s} — ${c.contact.in} ${k}.${note.trim() ? `\n${note.trim()}` : ''}`;
  }, [t, svc, country, note, lang, c]);
  const href = `${LINKS.whatsapp}?text=${encodeURIComponent(msg)}`;
  const channels = [
    { icon: WhatsappIcon, label: t.contact.whatsapp, value: LINKS.phoneText, href: LINKS.whatsapp, ext: true, ltr: true },
    { icon: Call02Icon, label: c.contact.call, value: LINKS.phoneText, href: LINKS.phone, ltr: true },
    { icon: Mail01Icon, label: t.contact.email, value: LINKS.emailText, href: LINKS.email, ltr: true },
    { icon: ShoppingBag01Icon, label: t.contact.store, value: 'sedraom.com', href: LINKS.store, ext: true, ltr: true },
    { icon: Pdf01Icon, label: t.contact.profile, value: c.contact.pdf, href: LINKS.profile, ext: true },
    { icon: BookOpen01Icon, label: t.contact.catalogue, value: c.contact.pdf, href: LINKS.catalogue, ext: true },
    { icon: InstagramIcon, label: t.follow.instagram, value: BRAND.handle, href: LINKS.instagram, ext: true, ltr: true },
    { icon: TiktokIcon, label: t.follow.tiktok, value: BRAND.handle, href: LINKS.tiktok, ext: true, ltr: true },
  ];
  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <Shade className="shade--soft" seed={17} density={0.7} />
      <div className="contact__grid">
        <div className="composer">
          <p className="eyebrow eyebrow--light">{c.contact.eyebrow}</p>
          <h2 id="contact-title" className="h2 h2--light">
            {t.contact.title}
          </h2>
          <p className="composer__lead">{c.contact.composer}</p>
          <div className="composer__fields">
            <label className="field">
              <span>{c.contact.service}</span>
              <select value={svc} onChange={(e) => setSvc(+e.target.value)}>
                {t.services.map((s, i) => (
                  <option key={s.key} value={i}>
                    {s.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>{c.contact.country}</span>
              <select value={country} onChange={(e) => setCountry(+e.target.value)}>
                {COUNTRIES[lang].map((k, i) => (
                  <option key={k} value={i}>
                    {k}
                  </option>
                ))}
              </select>
            </label>
            <label className="field field--wide">
              <span>{c.contact.note}</span>
              <input type="text" value={note} maxLength={240} placeholder={c.contact.notePh} onChange={(e) => setNote(e.target.value)} />
            </label>
          </div>
          <div className="composer__out">
            <p className="composer__preview" aria-live="polite">
              <span className="sr-only">{c.contact.preview}: </span>
              {msg}
            </p>
            <a className="btn btn--sun composer__send" href={href} {...ext}>
              <Icon icon={WhatsappIcon} size={20} />
              <span>{c.contact.send}</span>
            </a>
          </div>
        </div>
        <div className="channels">
          <h3 className="channels__title">{c.contact.channels}</h3>
          <ul>
            {channels.map((ch) => (
              <li key={ch.label}>
                <a href={ch.href} {...(ch.ext ? ext : {})}>
                  <Icon icon={ch.icon} size={22} />
                  <span className="channels__label">{ch.label}</span>
                  <span className="channels__value" dir={ch.ltr ? 'ltr' : undefined}>
                    {ch.value}
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <p className="channels__place">
            <Icon icon={Location01Icon} size={18} />
            {t.contact.place}
          </p>
        </div>
      </div>
    </section>
  );
}

// the closing line, as on the last page of their profile: the grafted branch in the sun
function Closing() {
  const { lang, t } = useLang();
  return (
    <section id="closing" className="closing" aria-labelledby="closing-line">
      <img
        className="closing__img"
        src="/img/pdf-p12-04-sm.webp"
        srcSet="/img/pdf-p12-04-sm.webp 1280w, /img/pdf-p12-04.webp 2400w"
        sizes="100vw"
        width="2400"
        height="1792"
        alt={lang === 'ar' ? 'غصن سدر مطعّم مربوط بالخيط، والشمس تتسلل بين الأوراق' : 'A grafted Sidr branch tied with twine, the sun shining through the leaves'}
        loading="lazy"
        decoding="async"
      />
      <Shade className="shade--photo" seed={29} density={0.8} />
      <div className="closing__in">
        <SidrLogo variant="white" height={110} className="closing__logo" />
        <p id="closing-line" className="closing__line display">
          {t.taglineEnd}
        </p>
      </div>
    </section>
  );
}

function Footer() {
  const { lang, t } = useLang();
  const c = COPY[lang];
  return (
    <footer className="ftr">
      <div className="ftr__brand">
        <SidrLogo variant="white" height={54} />
        <p>{t.brandBy}</p>
      </div>
      <p className="ftr__rights">
        © 2026 {lang === 'ar' ? BRAND.nameAr : BRAND.nameEn}. {t.footer.rights}
      </p>
      <div className="ftr__tools">
        <MotionSwitch c={c} />
        <a
          className="ftr__top"
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            goToId('top');
          }}
        >
          <Icon icon={ArrowUp01Icon} size={18} />
          <span>{c.footer.top}</span>
        </a>
      </div>
      <a className="ftr__ig" href={LINKS.linktree} {...ext}>
        <span>linktr.ee/thilal_alsidr</span>
        <Icon icon={ArrowUpRight01Icon} size={16} />
      </a>
    </footer>
  );
}

export default function App() {
  const { lang } = useLang();
  useSmoothScroll({ lerp: 0.1 });

  // headings rise out of a mask as they arrive (full motion only)
  useGSAP(
    () => {
      if (isMotionReduced()) return;
      document.querySelectorAll('.h2, .why__identity, .closing__line').forEach((el) => revealLines(el, { start: 'top 88%' }));
      gsap.utils.toArray('.pillars li, .why__pt, .channels li').forEach((el, i) => {
        gsap.from(el, { autoAlpha: 0, y: 18, duration: 0.8, delay: (i % 6) * 0.06, scrollTrigger: { trigger: el, start: 'top 94%', once: true } });
      });
    },
    { dependencies: [lang], revertOnUpdate: true }
  );

  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <About />
        <Journey />
        <Library />
        <Founder />
        <Statements />
        <Why />
        <Contact />
        <Closing />
      </main>
      <Footer />
      <MotionToggle />
    </>
  );
}
