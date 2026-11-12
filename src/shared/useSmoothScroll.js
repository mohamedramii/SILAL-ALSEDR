import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isMotionReduced } from './motion.jsx';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance = null;
export const getLenis = () => lenisInstance;

// Lenis smooth scrolling driven by GSAP's ticker so ScrollTrigger stays in sync.
export function useSmoothScroll({ lerp = 0.09 } = {}) {
  useEffect(() => {
    if (isMotionReduced()) return undefined;
    // Lenis only runs when the site's motion setting is full; respectReducedMotion: false stops it from also
    // obeying the OS query, which made every programmatic scroll jump when a visitor had opted into full motion.
    const lenis = new Lenis({ lerp, smoothWheel: true, wheelMultiplier: 1, respectReducedMotion: false });
    lenisInstance = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, [lerp]);
}

export function scrollToId(id, offset = -80) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenisInstance) lenisInstance.scrollTo(el, { offset, duration: 1.4 });
  else el.scrollIntoView({ behavior: 'smooth' });
}
