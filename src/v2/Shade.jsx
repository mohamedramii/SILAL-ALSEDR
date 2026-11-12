// The shade of a Sidr canopy: leaves drawn from the logo's two leaves (the big old leaf with its curved vein cut,
// the small young one), fanned along a few twigs that reach in from the edges, rendered as one blurred SVG that is
// multiplied over the page. The canopy is laid out for the layer's real size (px), so it never crops away.
// The sun (Hero.jsx) writes --sh-* variables on <html>; every .shade layer reads them, so all the shade moves together.
import { useEffect, useMemo, useRef, useState } from 'react';

// Leaf pointing up, base at (0,50), tip at (0,-50): the logo's big leaf, tip curling to one side, vein cut out.
export const LEAF_D =
  'M0 50C-26 44-40 22-38-4C-36-26-22-42-4-50C-9-41-6-33 3-27C22-14 38 6 34 26C30 42 16 50 0 50Z' +
  'M4 44C-2 20-7-6-5-36C3-10 9 15 4 44Z';

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// twigs as fractions of the layer: start (outside an edge), control point, end (inside)
const TWIGS = [
  [1.08, -0.08, 0.8, 0.12, 0.5, 0.2],
  [1.08, 0.3, 0.86, 0.42, 0.64, 0.62],
  [0.64, -0.1, 0.56, 0.08, 0.38, 0.13],
  [0.22, -0.1, 0.17, 0.1, -0.02, 0.26],
  [-0.08, 0.04, 0.12, 0.15, 0.3, 0.05],
  [1.08, 0.74, 0.9, 0.78, 0.76, 1.08],
  [-0.08, 0.78, 0.1, 0.74, 0.27, 1.08],
  [0.93, -0.1, 0.8, 0.3, 0.62, 0.42],
  [-0.08, 0.46, 0.08, 0.52, 0.22, 0.68],
  [1.08, 0.56, 0.78, 0.6, 0.5, 0.86],
  [-0.08, 0.6, 0.24, 0.58, 0.46, 0.76],
];

function makeCanopy(seed, density, W, H) {
  const r = rng(seed);
  const twigs = [];
  const leaves = [];
  const unit = Math.max(0.7, Math.min(1.25, Math.min(W, H * 1.6) / 1100)); // leaf size follows the layer a little
  for (const f of TWIGS) {
    const [x0, y0, cx, cy, x1, y1] = [f[0] * W, f[1] * H, f[2] * W, f[3] * H, f[4] * W, f[5] * H];
    twigs.push(`M${x0.toFixed(0)} ${y0.toFixed(0)}Q${cx.toFixed(0)} ${cy.toFixed(0)} ${x1.toFixed(0)} ${y1.toFixed(0)}`);
    const length = Math.hypot(cx - x0, cy - y0) + Math.hypot(x1 - cx, y1 - cy);
    const nodes = Math.max(4, Math.round((length / (46 * unit)) * density));
    for (let i = 0; i < nodes; i++) {
      const t = 0.12 + (i / nodes) * 0.9;
      const x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cx + t * t * x1;
      const y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * cy + t * t * y1;
      const dx = 2 * (1 - t) * (cx - x0) + 2 * t * (x1 - cx);
      const dy = 2 * (1 - t) * (cy - y0) + 2 * t * (y1 - cy);
      const len = Math.hypot(dx, dy) || 1;
      const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
      const fan = 2 + Math.floor(r() * 3);
      for (let k = 0; k < fan; k++) {
        const side = (i + k) % 2 ? 1 : -1;
        const young = r() < 0.3;
        const s = (young ? 0.24 + r() * 0.16 : 0.34 + r() * 0.28) * unit;
        const off = (16 + r() * 34) * unit;
        const along = (r() - 0.5) * 40 * unit;
        const nx = (-dy / len) * off * side + (dx / len) * along;
        const ny = (dx / len) * off * side + (dy / len) * along;
        leaves.push({ x: x + nx, y: y + ny, a: ang + 90 + side * (30 + r() * 50), s, young });
      }
    }
  }
  return { twigs, leaves };
}

export function Shade({ className = '', seed = 7, density = 1 }) {
  const ref = useRef(null);
  const [box, setBox] = useState(null);
  useEffect(() => {
    const el = ref.current;
    const ro = new ResizeObserver(([e]) => {
      const w = Math.max(40, Math.round(e.contentRect.width / 40) * 40);
      const h = Math.max(40, Math.round(e.contentRect.height / 40) * 40);
      setBox((b) => (b && b.w === w && b.h === h ? b : { w, h }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const canopy = useMemo(() => (box ? makeCanopy(seed, density, box.w, box.h) : null), [box, seed, density]);
  const id = `v2leaf-${seed}`;
  return (
    <div className={`shade ${className}`} aria-hidden="true">
      <div className="shade__sun" ref={ref}>
        <div className="shade__sway">
          {canopy && (
            <svg className="shade__svg" viewBox={`0 0 ${box.w} ${box.h}`} preserveAspectRatio="none">
              <defs>
                <path id={id} d={LEAF_D} fillRule="evenodd" />
              </defs>
              <g fill="none" stroke="currentColor" strokeLinecap="round" opacity="0.8">
                {canopy.twigs.map((d, i) => (
                  <path key={i} d={d} strokeWidth={i % 3 ? 3 : 5} />
                ))}
              </g>
              <g fill="currentColor">
                {canopy.leaves.map((l, i) => (
                  <use
                    key={i}
                    href={`#${id}`}
                    opacity={l.young ? 0.62 : 1}
                    transform={`translate(${l.x.toFixed(1)} ${l.y.toFixed(1)}) rotate(${l.a.toFixed(1)}) scale(${l.s.toFixed(2)})`}
                  />
                ))}
              </g>
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}

// The two logo leaves as a small mark (old dark leaf + young light leaf), used for bullets and markers.
export function LeafMark({ className = '', lit = false }) {
  return (
    <svg className={`leafmark ${lit ? 'is-lit' : ''} ${className}`} viewBox="-60 -60 150 120" aria-hidden="true">
      <path d={LEAF_D} fillRule="evenodd" transform="rotate(-28) translate(0 -4)" className="leafmark__old" />
      <path d={LEAF_D} fillRule="evenodd" transform="translate(52 16) rotate(38) scale(0.56)" className="leafmark__young" />
    </svg>
  );
}
