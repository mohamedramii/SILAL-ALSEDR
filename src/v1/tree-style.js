// Placement and growth variables of the real tree's layers (shared by the services tree and the vision story).
import { TREE } from './tree-layers.js';

const { W, H } = TREE;
export const pc = (v, t) => `${((v / t) * 100).toFixed(3)}%`;
export const boxStyle = ([x, y, w, h]) => ({ left: pc(x, W), top: pc(y, H), width: pc(w, W), height: pc(h, H) });
// per-branch constants for the CSS: joint inside the layer box, reveal radius (circle() % of the box), settle angle
export const LAYERS = TREE.branches.map((b) => {
  const [x, y, w, h] = b.box;
  const norm = Math.sqrt(w * w + h * h) / Math.SQRT2;
  const style = {
    ...boxStyle(b.box),
    '--jx': pc(b.joint[0] - x, w),
    '--jy': pc(b.joint[1] - y, h),
    '--r': `${((b.reach + 14) / norm) * 100}%`,
    '--rot': b.side === 'L' ? '-10deg' : '10deg',
  };
  const fruit = b.fruit
    ? { ...boxStyle(b.fruit.box), '--sx': pc(b.fruit.stem[0] - b.fruit.box[0], b.fruit.box[2]) }
    : null;
  return { side: b.side, style, fruit, tip: { left: pc(b.tip[0], W), top: pc(b.tip[1], H) } };
});

