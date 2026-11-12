import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { existsSync, readdirSync, rmSync } from 'node:fs';

const root = import.meta.dirname;
const page = (p) => resolve(root, p);
const designs = ['v1', 'v2'];

// The live site is ONE design: Design 1 "The Graft", served at "/" (index.html).
// The design picker (/designs/) and the designs' own pages (/v1/, /v2/) are kept for local work only:
// `npm run dev` serves them, `npm run build` leaves them out, `npm run build:all` builds everything.
export default defineConfig(({ mode }) => {
  const all = mode === 'all';

  // The live site only uses Design 1's own pictures and clips (public/img/v1-*, public/media/v1-*, plus the one
  // profile photo its founder section shows) and the logo (public/brand): Design 2's and the picker's pictures are
  // dropped from the build so they are not published.
  const siteOnlyAssets = {
    name: 'site-only-assets',
    apply: 'build',
    closeBundle() {
      if (all) return;
      const mine = (f) => (f.startsWith('v1-') && !f.startsWith('v1-card')) || f === 'pdf-p03-68.webp';
      for (const dir of ['img', 'media']) {
        const d = resolve(root, 'dist', dir);
        if (!existsSync(d)) continue;
        for (const f of readdirSync(d)) if (!mine(f)) rmSync(resolve(d, f), { force: true });
      }
    },
  };

  return {
    plugins: [react(), siteOnlyAssets],
    resolve: {
      alias: { '@shared': resolve(root, 'src/shared') },
    },
    server: { port: 5176, host: true },
    optimizeDeps: { entries: ['index.html', 'designs/index.html', 'v*/index.html'] },
    build: {
      chunkSizeWarningLimit: 800,
      rollupOptions: {
        input: all
          ? { main: page('index.html'), designs: page('designs/index.html'), ...Object.fromEntries(designs.map((d) => [d, page(`${d}/index.html`)])) }
          : { main: page('index.html') },
      },
    },
  };
});
