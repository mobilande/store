import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        workbox: {
          runtimeCaching: [
            {
              urlPattern: /.*\/data\/.*\.json/,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'data-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 7 // 1 week
                }
              }
            }
          ]
        },
        manifest: {
          name: 'موبی لند',
          short_name: 'MobiLand',
          description: 'فروشگاه اینترنتی لپ تاپ و کالای دیجیتال',
          theme_color: '#000000',
          background_color: '#000000',
          display: 'standalone',
          dir: 'rtl',
          lang: 'fa'
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
