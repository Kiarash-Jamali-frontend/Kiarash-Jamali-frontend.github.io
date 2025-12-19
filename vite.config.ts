import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate', // آپدیت خودکار اپلیکیشن
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'اپلیکیشن آموزشی زیکو',
        short_name: 'زیکو',
        description: 'پلتفرم جامع آموزش و آزمون آنلاین',
        theme_color: '#2b7fff', // رنگ تم اصلی (Primary) اپ شما
        background_color: '#ffffff',
        display: 'standalone', // نمایش به صورت یک اپلیکیشن مستقل (بدون نوار مرورگر)
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})