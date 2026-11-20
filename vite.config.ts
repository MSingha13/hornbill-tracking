import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

function googleSheetProxyPlugin(): Plugin {
  return {
    name: 'google-sheet-proxy',
    configureServer(server) {
      server.middlewares.use('/api/sheet-data', async (req, res) => {
        try {
          const endpoint = 'https://script.google.com/macros/s/AKfycbwv_0GdImwmDwDHsxPlrOTo7iGjMMkYHutax33GwC3ml1Dw1wwbKwg1UdHdlSPa11LcNg/exec';
          const query = req.url ? req.url.replace(/^\/?\??/, '') : '';
          const targetUrl = query ? `${endpoint}?${query}` : endpoint;
          const upstreamRes = await fetch(targetUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
          });
          const text = await upstreamRes.text();
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end(text);
        } catch (err: unknown) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: String(err) }));
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    base: './',
    plugins: [react(), tailwindcss(), googleSheetProxyPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname || process.cwd(), '.'),
      },
      extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
    },
    worker: {
      format: 'es' as const,
    },
    build: {
      target: 'es2022',
      chunkSizeWarningLimit: 1500,
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
