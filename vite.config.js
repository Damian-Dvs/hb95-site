import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'HB95 Racing',
        short_name: 'HB95',
        description: 'Follow Harley Bebb #95 on the track!',
        theme_color: '#0f766e',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/HB95.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/HB95.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/HB95.png',
            sizes: '1024x1024',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
});
