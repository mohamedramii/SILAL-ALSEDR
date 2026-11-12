// Where they work: a drawn map of the Gulf (a UI drawing, simplified coastlines) with Oman, the UAE and Qatar.
// Tap a country (on the map, its pin or the list) to see what Thilal Al Sidr does there.
import { useState } from 'react';
import { useLang } from '@shared/i18n.jsx';
import { COPY, QATAR_REEL } from './copy.js';
import { Ext, Leaf } from './bits.jsx';

const LON0 = 48;
const LAT0 = 29.3;
const KX = 46;
const KY = 49;
const P = ([lon, lat]) => [+((lon - LON0) * KX).toFixed(1), +((LAT0 - lat) * KY).toFixed(1)];
const path = (pts, close = true) => 'M' + pts.map((p) => P(p).join(' ')).join(' L') + (close ? ' Z' : '');
const MW = 575;
const MH = 671;

const GULF_W = [[47.5, 29.6], [48.0, 29.6], [48.0, 29.35], [48.4, 28.55], [48.8, 27.85], [49.3, 27.35], [49.65, 27.0], [50.15, 26.62], [50.22, 26.2], [50.05, 25.9], [50.15, 25.6], [50.45, 25.25], [50.6, 24.95], [50.78, 24.74]];
const QATAR_C = [[50.83, 25.0], [50.8, 25.45], [50.95, 25.75], [51.1, 26.05], [51.25, 26.15], [51.42, 25.95], [51.58, 25.6], [51.52, 25.3], [51.62, 25.05], [51.6, 24.75], [51.45, 24.6], [51.3, 24.55]];
const SA_SHORT = [[51.45, 24.35], [51.6, 24.25]];
const UAE_C = [[51.85, 24.05], [52.3, 24.0], [52.65, 24.2], [53.1, 24.15], [53.6, 24.1], [54.1, 24.25], [54.45, 24.45], [54.7, 24.8], [55.05, 25.0], [55.3, 25.25], [55.5, 25.45], [55.75, 25.62], [55.95, 25.8], [56.08, 26.05]];
const MUSANDAM = [[56.18, 26.22], [56.3, 26.38], [56.42, 26.33], [56.45, 26.12], [56.38, 25.9], [56.3, 25.75]];
const UAE_E = [[56.32, 25.55], [56.33, 25.3], [56.36, 25.1], [56.36, 24.95]];
const OMAN_C = [[56.5, 24.72], [56.78, 24.35], [57.2, 23.95], [57.6, 23.8], [58.05, 23.68], [58.55, 23.62], [58.85, 23.4], [59.2, 22.95], [59.55, 22.6], [59.82, 22.48], [59.75, 22.2], [59.45, 21.75], [59.15, 21.35], [58.85, 21.0], [58.6, 20.6], [58.25, 20.4], [57.85, 20.1], [57.7, 19.7], [57.75, 19.15], [57.4, 18.95], [56.85, 18.75], [56.55, 18.4], [56.3, 17.95], [55.75, 17.85], [55.3, 17.55], [55.0, 17.1], [54.5, 16.98], [54.1, 17.0], [53.6, 16.78], [53.1, 16.65]];
const YEMEN_C = [[52.6, 16.3], [52.2, 15.75], [51.6, 15.35], [51.0, 15.15], [50.2, 14.9], [49.4, 14.65], [48.7, 14.2], [47.5, 13.9]];
const INLAND_UAE_OM = [[56.05, 24.85], [55.95, 24.5], [55.8, 24.2], [55.55, 24.0], [55.45, 23.5], [55.2, 22.7]];

const LAND = path([...GULF_W, ...QATAR_C, ...SA_SHORT, ...UAE_C, ...MUSANDAM, ...UAE_E, ...OMAN_C, ...YEMEN_C, [47.5, 13.0]]);
const IRAN = path([[50.4, 29.6], [50.6, 29.3], [50.84, 28.97], [51.25, 28.3], [51.7, 27.95], [52.06, 27.84], [52.6, 27.47], [53.3, 27.05], [53.9, 26.75], [54.5, 26.6], [54.88, 26.56], [55.4, 26.62], [55.9, 26.95], [56.27, 27.18], [56.8, 27.12], [57.05, 26.75], [57.3, 26.0], [57.77, 25.68], [58.3, 25.6], [59.2, 25.42], [60.8, 25.3], [60.8, 29.6]]);
const SHAPES = {
  qa: path([[50.78, 24.74], ...QATAR_C]),
  ae: path([[51.6, 24.25], ...UAE_C, [56.16, 25.68], ...UAE_E, ...INLAND_UAE_OM, [52.6, 22.95], [51.6, 24.0]]),
  om: `${path([[56.36, 24.95], ...OMAN_C, [52.0, 19.0], [55.0, 22.0], ...INLAND_UAE_OM.slice().reverse()])} ${path([[56.08, 26.05], ...MUSANDAM, [56.16, 25.68]])}`,
};
const PINS = { om: [57.2, 21.6], ae: [54.3, 23.75], qa: [51.2, 25.35] };
const SEAS = {
  ar: [['الخليج العربي', [52.2, 26.75]], ['بحر العرب', [58.6, 18.3]], ['خليج عُمان', [58.6, 24.55]]],
  en: [['Arabian Gulf', [52.2, 26.75]], ['Arabian Sea', [58.6, 18.3]], ['Gulf of Oman', [58.6, 24.55]]],
};

export default function Where() {
  const { lang } = useLang();
  const c = COPY[lang].where;
  const [sel, setSel] = useState('om');
  const country = c.countries.find((k) => k.key === sel);
  const q = QATAR_REEL[lang];
  return (
    <section className="where" id="where" data-fit aria-labelledby="where-title">
      <div className="where__map">
        <svg viewBox={`0 0 ${MW} ${MH}`} role="img" aria-label={c.map}>
          <defs>
            <pattern id="v1-dots" width="9" height="9" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.1" fill="var(--map-dot)" />
            </pattern>
            <filter id="v1-shade" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#1c2b17" floodOpacity="0.28" />
            </filter>
          </defs>
          <rect width={MW} height={MH} fill="var(--sea)" />
          <path d={IRAN} fill="var(--land)" />
          <path d={IRAN} fill="url(#v1-dots)" />
          <path d={LAND} fill="var(--land)" />
          <path d={LAND} fill="url(#v1-dots)" />
          <ellipse cx={P([50.55, 26.05])[0]} cy={P([50.55, 26.05])[1]} rx="4" ry="6" fill="var(--land)" />
          <ellipse cx={P([58.85, 20.45])[0]} cy={P([58.85, 20.45])[1]} rx="5" ry="13" fill="var(--land)" transform={`rotate(20 ${P([58.85, 20.45]).join(' ')})`} />
          {['om', 'ae', 'qa'].map((k) => (
            <path
              key={k}
              d={SHAPES[k]}
              className={`where__c ${sel === k ? 'is-sel' : ''}`}
              filter={sel === k ? 'url(#v1-shade)' : undefined}
              onClick={() => setSel(k)}
            />
          ))}
          {SEAS[lang].map(([t, ll]) => (
            <text key={t} x={P(ll)[0]} y={P(ll)[1]} className="where__sea" textAnchor="middle">
              {t}
            </text>
          ))}
        </svg>
        {c.countries.map((k) => {
          const [x, y] = P(PINS[k.key]);
          return (
            <button
              key={k.key}
              type="button"
              className={`where__pin ${sel === k.key ? 'is-sel' : ''} ${k.key === 'om' ? 'is-flip' : ''}`}
              style={{ left: `${(x / MW) * 100}%`, top: `${(y / MH) * 100}%` }}
              aria-pressed={sel === k.key}
              onClick={() => setSel(k.key)}
            >
              <span className="where__ring" aria-hidden="true" />
              <span className="where__pin-t">{k.name}</span>
            </button>
          );
        })}
      </div>

      <div className="where__body">
        <p className="eyebrow">{c.eyebrow}</p>
        <h2 className="h2" id="where-title">{c.title}</h2>
        <p className="where__lead">{c.lead}</p>
        <div className="where__tabs" role="group" aria-label={c.eyebrow}>
          {c.countries.map((k) => (
            <button key={k.key} type="button" className={`chip ${sel === k.key ? 'is-on' : ''}`} aria-pressed={sel === k.key} onClick={() => setSel(k.key)}>
              {k.name}
            </button>
          ))}
        </div>
        <div className="where__card" aria-live="polite" key={sel}>
          <p className="where__tag">{country.tag}</p>
          <h3 className="where__name">{country.name}</h3>
          <ul className="where__items">
            {country.items.map((it, i) => (
              <li key={it}>
                <svg viewBox="-2 -14 34 28" aria-hidden="true" focusable="false">
                  <Leaf L={26} tone={i % 2 ? 'dark' : 'light'} />
                </svg>
                {it}
              </li>
            ))}
          </ul>
          {sel === 'qa' ? (
            <Ext className="where__reel" href={QATAR_REEL.url} newTab={COPY[lang].newTab}>
              <img src={`/img/v1-reel-${QATAR_REEL.id}.webp`} alt="" width="450" height="800" loading="lazy" decoding="async" />
              <span>
                <small>{c.seen}</small>
                <b>{q.name}</b>
                <em>«{q.hook}»</em>
              </span>
            </Ext>
          ) : null}
        </div>
      </div>
    </section>
  );
}
