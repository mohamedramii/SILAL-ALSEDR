import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/ibm-plex-sans-arabic/400.css';
import '@fontsource/ibm-plex-sans-arabic/600.css';
import '@fontsource/el-messiri/700.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/600.css';
import '@shared/tokens.css';
import './chooser.css';
import { LangProvider, useLang } from '@shared/i18n.jsx';
import { SidrLogo } from '@shared/Logo.jsx';
import { LINKS } from '@shared/content.js';

const COPY = {
  ar: {
    eyebrow: 'الموقع الإلكتروني · تصميمان',
    title: 'طريقتان لنحكي حكاية ظلال السدر',
    lead: 'نفس العلامة ونفس المحتوى من ملفكم التعريفي وحسابكم، ونفس أخضر الورقتين في الشعار، بطريقتين مختلفتين. كل تصميم بالعربي والإنجليزي، ومصمم للجوال أولًا.',
    open: 'افتح التصميم',
    current: 'الملف التعريفي',
    insta: '@thilal_alsidr على إنستجرام',
    cards: {
      v1: { name: 'التصميم 1 — الطُعم', text: 'الشجرة حيّة: اسحب الورقة الصغيرة وطعّم بها الغصن القديم ليورق ويثمر النبق، والخدمات الثماني فروع تنمو مع التمرير.' },
      v2: { name: 'التصميم 2 — ظِلال', text: 'ظل السدر في شمس عُمان: حرّك الشمس فيتحرك الظل على الصفحة، ثم رحلة السدر من رمز تراثي إلى منظومة متكاملة.' },
    },
  },
  en: {
    eyebrow: 'Website · two designs',
    title: 'Two ways to tell the story of Thilal Al Sidr',
    lead: 'Same brand, the same content from your company profile and your account, and the same two leaf greens from the logo, told two different ways. Each design works in Arabic and English, phone first.',
    open: 'Open design',
    current: 'Company profile',
    insta: '@thilal_alsidr on Instagram',
    cards: {
      v1: { name: 'Design 1 — The Graft', text: 'A living tree: drag the young leaf to graft the old branch and watch it bud and fruit; the eight services grow as branches as you scroll.' },
      v2: { name: 'Design 2 — Shades', text: 'The Sidr’s shade in the Omani sun: move the sun and the shade moves across the page, then the Sidr’s journey from heritage symbol to an integrated system.' },
    },
  },
};

function Card({ id, n, copy, open, lang }) {
  const [hasImg, setHasImg] = useState(true);
  return (
    <a className="ch-card" href={`/${id}/${lang === 'en' ? '?lang=en' : ''}`}>
      <div className="ch-card__shot">
        {hasImg ? <img src={`/img/${id}-card-sm.webp`} alt="" loading="lazy" onError={() => setHasImg(false)} /> : <span className="ch-card__soon">{n}</span>}
        <span className="ch-card__n">{n}</span>
      </div>
      <div className="ch-card__body">
        <h2>{copy.name}</h2>
        {copy.text && <p>{copy.text}</p>}
        <span className="ch-card__open">
          {open} <span aria-hidden="true" className="flip-x">→</span>
        </span>
      </div>
    </a>
  );
}

function Chooser() {
  const { lang, t, toggle } = useLang();
  const c = COPY[lang];
  return (
    <main className="ch">
      <header className="ch-top">
        <SidrLogo height={64} />
        <button className="ch-lang" onClick={toggle}>{t.langSwitch}</button>
      </header>
      <section className="ch-head">
        <p className="ch-eyebrow">{c.eyebrow}</p>
        <h1>{c.title}</h1>
        <p className="ch-lead">{c.lead}</p>
      </section>
      <section className="ch-grid">
        {['v1', 'v2'].map((id, i) => (
          <Card key={id} id={id} n={i + 1} copy={c.cards[id]} open={c.open} lang={lang} />
        ))}
      </section>
      <footer className="ch-foot">
        <a href={LINKS.profile} target="_blank" rel="noreferrer">{c.current}</a>
        <a href={LINKS.instagram} target="_blank" rel="noreferrer">{c.insta}</a>
      </footer>
    </main>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LangProvider>
      <Chooser />
    </LangProvider>
  </StrictMode>
);
