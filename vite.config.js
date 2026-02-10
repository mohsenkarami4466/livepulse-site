import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // ==============================================
  // منطق هوشمند و ساده برای تشخیص محیط
  // ==============================================
  const getBase = () => {
    // 1. اولویت اول: متغیر محیطی (در Vercel تنظیم می‌کنید)
    if (process.env.VITE_PUBLIC_BASE) {
      return process.env.VITE_PUBLIC_BASE
    }
    // 2. اگر در Vercel هستیم (روش جایگزین تشخیص)
    if (process.env.VERCEL) {
      return '/'
    }
    // 3. محیط توسعه محلی
    if (command === 'serve') {
      return '/'
    }
    // 4. پیش‌فرض: GitHub Pages
    return '/livepulse-site/'
  }

  return {
    plugins: [react()], // فقط پلاگین react، نه بیشتر!

    base: getBase(), // قلب تپنده راه‌حل

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
      host: 'localhost'
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