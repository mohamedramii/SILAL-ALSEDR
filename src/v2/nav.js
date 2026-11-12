// Scroll to a section, just under the sticky header. A numeric target is used on purpose: Lenis would also subtract the
// section's scroll-margin (kept for the native, reduced-motion path) and double the offset. Pinned sections are measured
// at their pin-spacer, which holds their place in the page while they are fixed.
import { getLenis } from '@shared/useSmoothScroll.js';

export const hdrPx = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hdr')) || 64;

export function goToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const anchor = el.parentElement?.classList.contains('pin-spacer') ? el.parentElement : el;
  const y = Math.max(0, anchor.getBoundingClientRect().top + window.scrollY - (id === 'top' ? 9999 : hdrPx()));
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(y, { duration: 1.4 });
  else window.scrollTo({ top: y, behavior: 'auto' });
}
