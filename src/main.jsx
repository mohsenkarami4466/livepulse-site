/**
 * ============================================
 * 🚀 فایل ورودی اصلی - main.jsx
 * ============================================
 * 
 * این فایل نقطه ورود اصلی اپلیکیشن React است.
 * React DOM را به المان root در index.html متصل می‌کند.
 * 
 * وابستگی‌ها:
 * - React: کتابخانه اصلی React
 * - ReactDOM: برای رندر کردن کامپوننت‌ها در DOM
 * - App: کامپوننت اصلی اپلیکیشن
 * 
 * ساختار:
 * index.html > #root > ReactDOM.createRoot > App
 * 
 * تاریخ ایجاد: 2025-12-06
 * آخرین بروزرسانی: 2025-12-06
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

/**
 * رندر کردن اپلیکیشن در DOM
 * 
 * ReactDOM.createRoot المان root را پیدا می‌کند و App را در آن رندر می‌کند.
 * React.StrictMode برای تشخیص مشکلات احتمالی در development استفاده می‌شود.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

