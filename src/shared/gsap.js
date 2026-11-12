import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useGSAP } from '@gsap/react';
import { isMotionReduced } from './motion.jsx';

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, MotionPathPlugin, useGSAP);
gsap.defaults({ ease: 'power3.out', duration: 1 });

export const prefersReducedMotion = isMotionReduced;

// Masked line reveal for headings. Splits by lines/words only, so Arabic letters stay joined.
export function revealLines(target, { trigger, delay = 0, stagger = 0.09, start = 'top 82%', scroll = true } = {}) {
  return SplitText.create(target, {
    type: 'lines',
    mask: 'lines',
    linesClass: 'split-line',
    autoSplit: true,
    onSplit(self) {
      return gsap.from(self.lines, {
        yPercent: 110,
        duration: 1.15,
        ease: 'expo.out',
        stagger,
        delay,
        scrollTrigger: scroll ? { trigger: trigger || target, start, once: true } : undefined,
      });
    },
  });
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
