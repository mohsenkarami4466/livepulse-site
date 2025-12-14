import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Plugin برای transform کردن مسیرهای static در index.html
    {
      name: 'transform-static-paths',
      transformIndexHtml(html, ctx) {
        const base = '/livepulse-site/'
        // تبدیل مسیرهای نسبی به absolute با base path (هم src و هم href)
        let transformed = html.replace(
          /(src|href)="\.\/([^"]+)"/g,
          (match, attr, path) => {
            // اگر path با http یا https شروع می‌شود، تغییر نده
            if (path.startsWith('http://') || path.startsWith('https://')) {
              return match
            }
            return `${attr}="${base}${path}"`
          }
        )
        // اضافه کردن لینک‌های CSS که ممکن است حذف شده باشند (بدون style.css قدیمی)
        const cssLinks = [
          '<link rel="stylesheet" href="/livepulse-site/styles/variables.css?v=2.9">',
          '<link rel="stylesheet" href="/livepulse-site/styles/error-handler.css?v=2.9">',
          '<link rel="stylesheet" href="/livepulse-site/styles/components/globe.css?v=2.9">',
          '<link rel="stylesheet" href="/livepulse-site/styles/components/cards.css?v=2.9">',
          '<link rel="stylesheet" href="/livepulse-site/styles/components/sections.css?v=2.9">',
          '<link rel="stylesheet" href="/livepulse-site/styles/components/modals.css?v=2.9">',
          '<link rel="stylesheet" href="/livepulse-site/styles/components/other.css?v=2.9">',
          '<link rel="stylesheet" href="/livepulse-site/styles/responsive.css?v=2.9">',
          '<link rel="stylesheet" href="/livepulse-site/globe/globe-styles.css?v=2.9">',
          '<link rel="stylesheet" href="/livepulse-site/styles/themes-complete.css?v=2.9">',
          '<link rel="stylesheet" href="/livepulse-site/styles/theme-optimization.css?v=2.9">'
        ]
        // اگر لینک‌های CSS وجود ندارند، آنها را اضافه کن
        if (!transformed.includes('variables.css')) {
          const titleMatch = transformed.match(/<title>.*?<\/title>/)
          if (titleMatch) {
            transformed = transformed.replace(
              titleMatch[0],
              titleMatch[0] + '\n    ' + cssLinks.join('\n    ')
            )
          }
        }
        return transformed
      }
    }
  ],
  base: '/livepulse-site/', // برای GitHub Pages
  root: '.',
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@utils': resolve(__dirname, './utils'),
      '@globe': resolve(__dirname, './globe'),
      '@data': resolve(__dirname, './data')
    }
  },
  server: {
    port: 3000,
    strictPort: true, // اگر پورت اشغال باشد، خطا بدهد به جای استفاده از پورت دیگر
    open: true,
    host: true // دسترسی از شبکه محلی
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  },
  // برای استفاده از فایل‌های static موجود
  publicDir: 'public',
  // برای پشتیبانی از فایل‌های موجود
  optimizeDeps: {
    include: ['three', 'd3', 'gsap']
  }
})

