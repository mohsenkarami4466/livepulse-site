import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
    open: true
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

