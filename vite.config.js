import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // ================= اصلاح مهم اینجاست =================
  // تشخیص می‌دهیم آیا در محیط Vercel در حال Build هستیم یا نه
  const isVercel = process.env.VERCEL === '1'
  
  // اگر در Vercel هستیم، base را './' می‌گذاریم، در غیر این صورت برای GitHub Pages
  const base = isVercel ? './' : (command === 'serve' ? '/' : '/livepulse-site/')
  // ====================================================
  
  return {
    plugins: [
      react(),
      // پلاگین transform را فقط زمانی فعال می‌کنیم که در Vercel نباشیم (یعنی برای GitHub Pages)
      ...(isVercel ? [] : [{
        name: 'transform-static-paths',
        transformIndexHtml(html, ctx) {
          if (command === 'build') {
            const buildBase = '/livepulse-site/'
            // ... کد تبدیل مسیرهای شما (همان کد قبلی) ...
            let transformed = html.replace(
              /(src|href)="\.\/([^"]+)"/g,
              (match, attr, path) => {
                if (path.startsWith('http://') || path.startsWith('https://')) {
                  return match
                }
                return `${attr}="${buildBase}${path}"`
              }
            )
            // ... کد اضافه کردن لینک‌های CSS ...
            return transformed
          }
          return html
        }
      }])
    ],
    base: base, // حالا در Vercel: './'، در GitHub Pages: '/livepulse-site/'
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
      strictPort: true,
      open: false,
      host: 'localhost',
      hmr: {
        overlay: false
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: true
    },
    publicDir: 'public',
    optimizeDeps: {
      include: ['three', 'd3', 'gsap']
    }
  }
})
