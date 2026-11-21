// Header (logo, sections, language, store; a sheet on phones) and footer (closing photo, links, motion choice).
import { useEffect, useState } from 'react';
import { useLang } from '@shared/i18n.jsx';
import { LINKS } from '@shared/content.js';
import { SidrLogo } from '@shared/Logo.jsx';
import { Icon } from '@shared/Icon.jsx';
import { scrollToId } from '@shared/useSmoothScroll.js';
import { Menu01Icon, Cancel01Icon, Store01Icon, InstagramIcon, TiktokIcon, Pdf01Icon, BookOpen01Icon, ArrowUp01Icon, Location01Icon } from '@hugeicons/core-free-icons';
import { COPY, wa } from './copy.js';
import { Ext, WaIcon, isReduced } from './bits.jsx';

// no offset here: the header's height comes off through the page's scroll-padding-top (styles.css), which the smooth
// scroller and the browser both apply; an offset on top of it stopped every menu link short of its section
const go = (e, id) => {
  e.preventDefault();
  scrollToId(id, 0);
  history.replaceState(null, '', `#${id}`);
};

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

export function MotionSwitch({ className = '' }) {
  const { lang } = useLang();
  const c = COPY[lang].motion;
  const reduced = isReduced();
  return (
    <button type="button" className={`motion-switch ${className}`} onClick={() => setMotion(reduced ? 'full' : 'reduced')} aria-label={reduced ? c.toFull : c.toReduced}>
      <span className={`motion-switch__dot ${reduced ? '' : 'is-on'}`} aria-hidden="true" />
      {c.label}: {reduced ? c.reduced : c.full}
    </button>
  );
}

export function Header() {
  const { lang, toggle, t } = useLang();
  const c = COPY[lang];
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
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
  return (
    <header className={`hdr ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <a className="skip" href="#main">
        {c.skip}
      </a>
      <div className="hdr__in">
        <a className="hdr__logo" href="#top" onClick={(e) => go(e, 'top')} aria-label={c.home}>
          <SidrLogo height={44} alt="" />
          <span className="hdr__name">
            <b>{t === null ? '' : lang === 'ar' ? 'ظلال السدر' : 'Thilal Al Sidr'}</b>
            <small>{lang === 'ar' ? 'Thilal Al Sidr' : 'ظلال السدر'}</small>
          </span>
        </a>
        <nav className="hdr__nav" aria-label={c.menu}>
          <ul>
            {c.nav.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`} onClick={(e) => go(e, id)}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="hdr__end">
          <button type="button" className="hdr__lang" onClick={toggle} lang={lang === 'ar' ? 'en' : 'ar'}>
            {t.langSwitch}
          </button>
          <Ext className="btn btn--solid btn--sm hdr__store" href={LINKS.store} newTab={c.newTab}>
            <Icon icon={Store01Icon} size={18} /> {c.store}
          </Ext>
          <button type="button" className="hdr__menu" aria-expanded={open} aria-controls="v1-sheet" aria-label={open ? c.close : c.menu} onClick={() => setOpen((o) => !o)}>
            <Icon icon={open ? Cancel01Icon : Menu01Icon} size={24} />
          </button>
        </div>
      </div>
      <div className="sheet" id="v1-sheet" hidden={!open}>
        <ul>
          {c.nav.map(([id, label]) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(e) => {
                  setOpen(false);
                  go(e, id);
                }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
        <div className="sheet__end">
          <Ext className="btn btn--wa" href={wa(c.hero.ctaWaMsg)} newTab={c.newTab}>
            <WaIcon /> {t.contact.whatsapp}
          </Ext>
          <Ext className="btn btn--ghost" href={LINKS.store} newTab={c.newTab}>
            <Icon icon={Store01Icon} size={18} /> {t.contact.store}
          </Ext>
          <MotionSwitch />
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  const { lang, toggle, t } = useLang();
  const c = COPY[lang].footer;
  const nt = COPY[lang].newTab;
  return (
    <footer className="ftr" data-fit>
      <img className="ftr__bg" src="/img/v1-closing-sm.webp" srcSet="/img/v1-closing-sm.webp 800w, /img/v1-closing.webp 1600w" sizes="100vw" width="1600" height="1195" alt={c.photo} loading="lazy" decoding="async" />
      <div className="ftr__in">
        <div className="ftr__brand">
          <SidrLogo variant="white" height={120} alt={lang === 'ar' ? 'شعار ظلال السدر' : 'Thilal Al Sidr logo'} />
          <p className="ftr__end">«{c.end}»</p>
          <p className="ftr__place">
            <Icon icon={Location01Icon} size={18} /> {c.place} · <span dir="ltr">{LINKS.phoneText}</span> · <span dir="ltr">{LINKS.emailText}</span>
          </p>
        </div>
        <nav className="ftr__links" aria-label={c.links}>
          <Ext href={LINKS.store} newTab={nt}>
            <Icon icon={Store01Icon} size={20} /> {c.store}
          </Ext>
          <Ext href={LINKS.profile} newTab={nt}>
            <Icon icon={Pdf01Icon} size={20} /> {c.profile}
          </Ext>
          <Ext href={LINKS.catalogue} newTab={nt}>
            <Icon icon={BookOpen01Icon} size={20} /> {c.catalogue}
          </Ext>
          <Ext href={LINKS.instagram} newTab={nt}>
            <Icon icon={InstagramIcon} size={20} /> {c.instagram} <span dir="ltr" className="ftr__h">@thilal_alsidr</span>
          </Ext>
          <Ext href={LINKS.tiktok} newTab={nt}>
            <Icon icon={TiktokIcon} size={20} /> {c.tiktok} <span dir="ltr" className="ftr__h">@thilal_alsidr</span>
          </Ext>
          <Ext href={LINKS.whatsapp} newTab={nt}>
            <WaIcon /> {t.contact.whatsapp}
          </Ext>
        </nav>
        <div className="ftr__base">
          <p>{c.rights}</p>
          <div className="ftr__tools">
            <MotionSwitch className="motion-switch--dark" />
            <button type="button" className="ftr__btn" onClick={toggle}>
              {t.langSwitch}
            </button>
            <a className="ftr__btn" href="#top" onClick={(e) => go(e, 'top')}>
              <Icon icon={ArrowUp01Icon} size={18} /> {c.top}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
