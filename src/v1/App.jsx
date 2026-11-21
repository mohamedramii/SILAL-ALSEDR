// Design 1 — "The Graft" (الطُعم). The logo's two leaves read as the old Sidr tree and its graft: the visitor grafts,
// grows and picks along the page.
import { useEffect } from 'react';
import { useLang } from '@shared/i18n.jsx';
import { MotionToggle } from '@shared/motion.jsx';
import { ScrollTrigger } from '@shared/gsap.js';
import { useSmoothScroll } from '@shared/useSmoothScroll.js';
import { Header, Footer } from './Chrome.jsx';
import Hero from './Hero.jsx';
import Services from './Services.jsx';
import Varieties from './Varieties.jsx';
import Where from './Where.jsx';
import Vision from './Vision.jsx';
import Why from './Why.jsx';
import Contact from './Contact.jsx';
import { About, Founder, Products, Workshops } from './Sections.jsx';
import { FruitDefs } from './bits.jsx';

export default function App() {
  const { lang } = useLang();
  useSmoothScroll();
  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 200);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => clearTimeout(id);
  }, [lang]);
  return (
    <>
      <FruitDefs />
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero />
        <About />
        <Services />
        <Varieties />
        <Where />
        <Founder />
        <Vision />
        <Why />
        <Products />
        <Workshops />
        <Contact />
      </main>
      <Footer />
      <MotionToggle />
    </>
  );
}
