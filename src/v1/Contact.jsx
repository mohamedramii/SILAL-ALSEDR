// Contact: a WhatsApp composer (service + country + note -> wa.me with the message), and direct phone and email.
import { useId, useMemo, useState } from 'react';
import { useLang } from '@shared/i18n.jsx';
import { LINKS, COUNTRIES } from '@shared/content.js';
import { Icon } from '@shared/Icon.jsx';
import { Call02Icon, Mail01Icon } from '@hugeicons/core-free-icons';
import { COPY, wa } from './copy.js';
import { Ext, WaIcon } from './bits.jsx';

export default function Contact() {
  const { lang, t } = useLang();
  const c = COPY[lang].contact;
  const id = useId();
  const [svc, setSvc] = useState('grafting');
  const [country, setCountry] = useState(0);
  const [note, setNote] = useState('');
  const services = t.services;
  const svcTitle = svc === 'general' ? c.general : services.find((s) => s.key === svc)?.title;
  const msg = useMemo(() => {
    const lines = [c.hello];
    lines.push(`${c.want}: ${svcTitle}`);
    lines.push(`${c.from}: ${COUNTRIES[lang][country]}`);
    if (note.trim()) lines.push(`${c.noteLabel}: ${note.trim()}`);
    return lines.join('\n');
  }, [c, lang, svcTitle, country, note]);

  return (
    <section className="contact" id="contact" data-fit aria-labelledby="contact-title">
      <header className="contact__head">
        <p className="eyebrow">{c.eyebrow}</p>
        <h2 className="h2" id="contact-title">{c.title}</h2>
        <div className="direct">
          <a className="direct__a" href={LINKS.phone}>
            <Icon icon={Call02Icon} size={20} />
            <span className="sr-only">{c.call}: </span>
            <span dir="ltr">{LINKS.phoneText}</span>
          </a>
          <a className="direct__a" href={LINKS.email}>
            <Icon icon={Mail01Icon} size={20} />
            <span className="sr-only">{c.email}: </span>
            <span dir="ltr">{LINKS.emailText}</span>
          </a>
        </div>
      </header>

      <form className="composer" onSubmit={(e) => e.preventDefault()} aria-labelledby="contact-title">
        <div className="composer__fields">
          <label className="field" htmlFor={`${id}-svc`}>
            <span className="field__l">{c.service}</span>
            <select id={`${id}-svc`} value={svc} onChange={(e) => setSvc(e.target.value)}>
              {services.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.title}
                </option>
              ))}
              <option value="general">{c.general}</option>
            </select>
          </label>
          <fieldset className="field field--chips">
            <legend className="field__l">{c.country}</legend>
            <div className="chips">
              {COUNTRIES[lang].map((k, i) => (
                <label key={k} className={`chip chip--radio ${country === i ? 'is-on' : ''}`}>
                  <input type="radio" name={`${id}-country`} value={i} checked={country === i} onChange={() => setCountry(i)} />
                  {k}
                </label>
              ))}
            </div>
          </fieldset>
          <label className="field" htmlFor={`${id}-note`}>
            <span className="field__l">{c.note}</span>
            <textarea id={`${id}-note`} rows={2} maxLength={400} value={note} placeholder={c.notePh} onChange={(e) => setNote(e.target.value)} />
          </label>
        </div>

        <div className="composer__out">
          <p className="field__l" id={`${id}-pv`}>{c.preview}</p>
          <div className="bubble" aria-labelledby={`${id}-pv`} aria-live="polite">
            {msg.split('\n').map((l, i) => (
              <p key={i}>{l}</p>
            ))}
          </div>
          <Ext className="btn btn--wa btn--block" href={wa(msg)} newTab={COPY[lang].newTab}>
            <WaIcon /> {c.send}
          </Ext>
        </div>
      </form>
    </section>
  );
}
