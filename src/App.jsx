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
import { forceShowHighlights } from './utils/highlights-fix'
import './App.css'
import './styles/highlights-force.css'

/**
 * کامپوننت داخلی برای مدیریت رفرش و اسکرول
 */
function AppContent() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // اسکرول به بالای صفحه روی mount و route change
    window.scrollTo(0, 0)
    
    // فیکس قوی برای نمایش هایلایت‌ها
    const fixHighlights = () => {
      forceShowHighlights()
      
      // فعال کردن هایلایت خانه فقط زمانی که در مسیر خانه هستیم
      if (location.pathname === '/' || location.pathname === '/livepulse-site/') {
        const homeCircle = document.querySelector('.highlight-circle[data-category="home"]')
        if (homeCircle) {
          homeCircle.classList.add('active')
        }
        
        // غیرفعال کردن بقیه highlights
        const otherCircles = document.querySelectorAll('.highlight-circle[data-category]:not([data-category="home"])')
        otherCircles.forEach(circle => {
          circle.classList.remove('active')
        })
      }
      
      // به‌روزرسانی موقعیت هایلایت‌ها
      if (typeof window.updateHighlightsPosition === 'function') {
        window.updateHighlightsPosition()
      }
    }
    
    // اجرای فوری و چند بار با تاخیر
    fixHighlights()
    setTimeout(fixHighlights, 50)
    setTimeout(fixHighlights, 100)
    setTimeout(fixHighlights, 300)
    setTimeout(fixHighlights, 500)
    setTimeout(fixHighlights, 1000)
    setTimeout(fixHighlights, 2000)
    
    // اجرا بعد از هر render
    const interval = setInterval(fixHighlights, 2000)
    
    return () => clearInterval(interval)
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
  // تعیین basename بر اساس محیط: development از /، production از /livepulse-site/
  const basename = import.meta.env.DEV ? '/' : '/livepulse-site/'
  
  return (
    <BrowserRouter
      basename={basename}
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

