/**
 * ============================================
 * 📱 فایل اصلی اپلیکیشن React - App.jsx
 * ============================================
 * 
 * این فایل نقطه ورود اصلی اپلیکیشن React است.
 * 
 * وابستگی‌ها:
 * - BrowserRouter: از react-router-dom برای مسیریابی
 * - AppProvider: Context Provider برای مدیریت state سراسری
 * - AppRouter: کامپوننت مسیریابی که صفحات را مدیریت می‌کند
 * - Layout: کامپوننت Layout که Header, Footer, Navigation را شامل می‌شود
 * 
 * ساختار:
 * BrowserRouter > AppProvider > Layout > AppRouter
 * 
 * تاریخ ایجاد: 2025-12-06
 * آخرین بروزرسانی: 2025-12-06
 */

import React, { useEffect } from 'react'
import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom'
import { AppProvider } from './contexts/AppContext'
import AppRouter from './router/AppRouter'
import Layout from './components/Layout/Layout'
import './App.css'

/**
 * کامپوننت داخلی برای مدیریت رفرش و اسکرول
 */
function AppContent() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // اسکرول به بالای صفحه روی mount و route change
    window.scrollTo(0, 0)
    
    // فعال کردن هایلایت خانه فقط زمانی که در مسیر خانه هستیم
    if (location.pathname === '/' || location.pathname === '/livepulse-site/') {
      // استفاده از requestAnimationFrame برای بهینه‌سازی
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const homeCircle = document.querySelector('.highlight-circle[data-category="home"]')
          if (homeCircle) {
            homeCircle.classList.add('active')
          }
          
          // غیرفعال کردن بقیه highlights
          const otherCircles = document.querySelectorAll('.highlight-circle[data-category]:not([data-category="home"])')
          otherCircles.forEach(circle => {
            circle.classList.remove('active')
          })
        })
      })
    }
  }, [location.pathname]) // اجرا با هر تغییر مسیر

  return (
    <Layout>
      <AppRouter />
    </Layout>
  )
}

/**
 * کامپوننت اصلی App
 * 
 * این کامپوننت تمام ساختار اپلیکیشن را می‌سازد:
 * 1. BrowserRouter: برای مسیریابی SPA
 * 2. AppProvider: برای دسترسی به Context در تمام کامپوننت‌ها
 * 3. Layout: شامل Header, Indicators, GlobeClock, BottomNavigation, AssistiveTouch
 * 4. AppRouter: مدیریت مسیرها و صفحات
 */
function App() {
  return (
    <BrowserRouter
      basename="/livepulse-site"
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <AppProvider>
        <div className="App">
          <AppContent />
        </div>
      </AppProvider>
    </BrowserRouter>
  )
}

export default App

