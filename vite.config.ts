import path from 'path';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync, writeFileSync } from 'fs';

/**
 * Vite plugin: Injects a unique build version into sw.js
 * so the Service Worker cache is busted on every deployment.
 *
 * The SW filename stays "sw.js" (no hash) so the browser can
 * always find it at the same URL — the SW spec requires this.
 * Instead, the *contents* change (via __SW_VERSION__) which
 * triggers the browser's SW update algorithm automatically.
 */
const buildVersion = `${Date.now()}`;

function injectSwVersion(): Plugin {
  return {
    name: 'inject-sw-version',
    // Run after build output is written
    closeBundle() {
      try {
        const swPath = path.resolve(__dirname, 'dist', 'sw.js');
        let content = readFileSync(swPath, 'utf8');
        content = content.replace(/__SW_VERSION__/g, buildVersion);
        writeFileSync(swPath, content, 'utf8');
        console.log(`✅ SW version injected: ${buildVersion}`);

        const versionPath = path.resolve(__dirname, 'dist', 'version.json');
        writeFileSync(
          versionPath,
          JSON.stringify({ version: buildVersion }),
          'utf8'
        );
        console.log(`✅ Version JSON generated: ${buildVersion}`);
      } catch (e) {
        console.warn(
          '⚠️  Could not inject SW version or generate version.json:',
          e
        );
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    server: {
      host: '0.0.0.0',
      proxy: {
        '/supabase_api': {
          target: 'https://yvvalbuxdgulauupuwuk.supabase.co',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/supabase_api/, ''),
        },
        '/api': {
          target: 'https://geominingec.com',
          changeOrigin: true,
        },
      },
    },

    plugins: [react(), injectSwVersion()],

    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      __APP_VERSION__: JSON.stringify(buildVersion),
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },

    build: {
      // Generate source maps for easier debugging (remove if unwanted)
      sourcemap: false,

      rollupOptions: {
        output: {
          // ----------------------------------------------------------------
          // Asset naming: content-hash ONLY (no timestamp).
          //
          // Why: A content-hash like [hash] changes ONLY when file content
          // changes. Adding a timestamp would change ALL filenames on every
          // build — even for unchanged files — breaking long-term caching
          // benefits. The .htaccess sets immutable on /assets/* so browsers
          // hold these for 1 year without revalidating.
          // ----------------------------------------------------------------
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',

          manualChunks(id) {
            const normalizedId = id.replace(/\\/g, '/');
            if (normalizedId.includes('/node_modules/')) {
              if (
                normalizedId.includes('/react/') ||
                normalizedId.includes('/react-dom/') ||
                normalizedId.includes('/react-router-dom/')
              ) {
                return 'vendor';
              }
              if (normalizedId.includes('/lucide-react/')) {
                return 'icons';
              }
              if (normalizedId.includes('/@supabase/')) {
                return 'supabase';
              }
              if (normalizedId.includes('/recharts/') || normalizedId.includes('/d3-')) {
                return 'charts';
              }
              if (normalizedId.includes('/leaflet/') || normalizedId.includes('/react-leaflet/')) {
                return 'maps';
              }
            }
            if (normalizedId.includes('/pages/')) {
              const match = normalizedId.match(/\/pages\/([^/.]+)/);
              if (match && match[1]) {
                return `page-${match[1].toLowerCase()}`;
              }
            }
          },
        },
      },

      chunkSizeWarningLimit: 1000,
    },
  };
});
