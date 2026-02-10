import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {

  // ================= اصلاح نهایی =================
  // تشخیص محیط: اگر متغیر محیطی VERCEL وجود داشت، یعنی در Vercel هستیم
  const isVercel = process.env.VERCEL === '1'
  // اگر در Vercel هستیم base را './' می‌گذاریم (برای دامنه اصلی)، در غیر این صورت برای GitHub Pages
  const base = isVercel ? './' : (command === 'serve' ? '/' : '/livepulse-site/')
  // ==============================================

  return {
    plugins: [
      react(),
      // پلاگین transform را فقط زمانی فعال می‌کنیم که در Vercel نباشیم (یعنی برای GitHub Pages)
      ...(isVercel ? [] : [{
        name: 'transform-static-paths',
        transformIndexHtml(html, ctx) {

          // این پلاگین فقط برای GitHub Pages اجرا می‌شود
          if (command === 'build') {
            const buildBase = '/livepulse-site/'
            // تبدیل مسیرهای نسبی به مطلق برای GitHub Pages

            let transformed = html.replace(
              /(src|href)="\.\/([^"]+)"/g,
              (match, attr, path) => {
                if (path.startsWith('http://') || path.startsWith('https://')) {
                  return match
                }
                return `${attr}="${buildBase}${path}"`
              }
            )

            // برای GitHub Pages، لینک‌های CSS قدیمی را نگه می‌داریم
            const cssLinks = [
              '<link rel="stylesheet" href="/livepulse-site/styles/variables.css?v=2.9">',
              // ... بقیه لینک‌های CSS شما
            ]
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
          return html
        }
      }])
    ],

    base: base, // هوشمند: در Vercel: './'، در GitHub Pages: '/livepulse-site/'

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

      sourcemap: true,
      // یک تنظیم مهم: به Vite می‌گوید فایل‌های CSS/JS قدیمی را به bundle اضافه نکند
      rollupOptions: {
        external: [], // این آرایه را خالی می‌گذاریم تا همه چیز باندل شود
      }

    },
    publicDir: 'public',
    optimizeDeps: {
      include: ['three', 'd3', 'gsap']
    }
  }

})

