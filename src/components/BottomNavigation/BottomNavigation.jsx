/**
 * ============================================
 * 📱 کامپوننت BottomNavigation - BottomNavigation.jsx
 * ============================================
 * 
 * این کامپوننت نوار ناوبری پایین صفحه را نمایش می‌دهد.
 * شامل 6 دکمه برای ناوبری بین صفحات: خانه، اخبار، کره‌ها، آموزش، آرامش، ابزارها
 * 
 * وابستگی‌ها:
 * - useNavigate: از react-router-dom برای ناوبری
 * - useLocation: از react-router-dom برای تشخیص صفحه فعلی
 * - useApp: Context برای دسترسی به state (اختیاری)
 * 
 * عملکرد:
 * - نمایش دکمه‌های ناوبری
 * - تشخیص صفحه فعال و highlight کردن آن
 * - ناوبری به صفحه مورد نظر با کلیک
 * - جلوگیری از navigate اگر در همان صفحه هستیم
 * 
 * نکته مهم:
 * - این کامپوننت باید با vanilla JS navigation هماهنگ باشد
 * - از preventDefault و stopPropagation برای جلوگیری از تداخل استفاده می‌کند
 * 
 * تاریخ ایجاد: 2025-12-06
 * آخرین بروزرسانی: 2025-12-06
 */

import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../../contexts/AppContext'
import './BottomNavigation.css'

/**
 * لیست آیتم‌های ناوبری
 * 
 * هر آیتم شامل:
 * - page: شناسه صفحه (برای data-page attribute)
 * - icon: آیکون emoji
 * - text: متن فارسی
 * - path: مسیر React Router
 */
const navItems = [
  { page: 'home', icon: '🏠', text: 'خانه', path: '/' },
  { page: 'news', icon: '📰', text: 'اخبار', path: '/news' },
  { page: 'globe', icon: '🌍', text: 'کره‌ها', path: '/globe' },
  { page: 'tutorial', icon: '📚', text: 'آموزش', path: '/tutorial' },
  { page: 'relax', icon: '🧘', text: 'آرامش', path: '/relax' },
  { page: 'tools', icon: '🛠️', text: 'ابزارها', path: '/tools' }
]

/**
 * کامپوننت BottomNavigation
 * 
 * این کامپوننت نوار ناوبری پایین را رندر می‌کند.
 * صفحه فعال را از location.pathname تشخیص می‌دهد و highlight می‌کند.
 */
function BottomNavigation() {
  // Hook های React
  const navigate = useNavigate() // برای ناوبری بین صفحات
  const location = useLocation() // برای تشخیص صفحه فعلی

  /**
   * Handler: کلیک روی دکمه ناوبری
   * 
   * این تابع:
   * 1. بررسی می‌کند که آیا در همان صفحه هستیم یا نه
   * 2. اگر در همان صفحه بود، هیچ کاری نمی‌کند
   * 3. event propagation را متوقف می‌کند تا با vanilla JS تداخل نداشته باشد
   * 4. به صفحه مورد نظر navigate می‌کند
   * 
   * @param {string} path - مسیر React Router
   * @param {string} page - شناسه صفحه
   */
  const handleNavClick = (path, page, event) => {
    // جلوگیری از navigate اگر در همان صفحه هستیم
    if (location.pathname === path) {
      return
    }
    
    // جلوگیری از event propagation برای جلوگیری از تداخل با vanilla JS
    // این برای جلوگیری از تداخل با event listener های vanilla JS است
    if (event) {
      event.preventDefault()
      event.stopPropagation()
      if (event.stopImmediatePropagation && typeof event.stopImmediatePropagation === 'function') {
      event.stopImmediatePropagation()
      }
    }
    
    // هماهنگی با vanilla JS
    if (typeof window !== 'undefined' && window.appState) {
      window.appState.currentView = page
    }
    
    // Dispatch event برای vanilla JS compatibility
    if (typeof window !== 'undefined' && window.showView) {
      window.showView(page)
    }
    
    // ناوبری به صفحه مورد نظر
    navigate(path)
  }

  /**
   * تشخیص صفحه فعال از pathname
   * 
   * این تابع pathname را می‌خواند و شناسه صفحه را برمی‌گرداند.
   * برای highlight کردن دکمه فعال استفاده می‌شود.
   * 
   * @returns {string} شناسه صفحه فعال
   */
  const getActivePage = () => {
    const path = location.pathname
    if (path === '/') return 'home' // صفحه خانه
    return path.slice(1) // حذف '/' اول (مثلاً '/news' → 'news')
  }

  const activePage = getActivePage() // صفحه فعال فعلی

  /**
   * Render: ساختار نوار ناوبری
   * 
   * هر دکمه شامل:
   * - icon: آیکون emoji
   * - text: متن فارسی
   * - className: شامل 'active' اگر صفحه فعال باشد
   * - data-page: شناسه صفحه (برای vanilla JS compatibility)
   * 
   * Event Handlers:
   * - onClick: برای دسکتاپ
   * - onTouchStart/onTouchEnd: برای موبایل/تبلت
   */
  return (
    <nav className="bottom-nav-bar" id="bottomNavBar">
      {navItems.map((item) => (
        <button
          key={item.page}
          className={`nav-item ${activePage === item.page ? 'active' : ''}`}
          data-page={item.page}
          title={item.text}
          onClick={(e) => {
            // ناوبری به صفحه
            handleNavClick(item.path, item.page, e)
          }}
          onTouchStart={(e) => {
            // بهبود UX برای touch - کاهش opacity هنگام لمس
            e.currentTarget.style.opacity = '0.7'
          }}
          onTouchEnd={(e) => {
            // بازگشت opacity به حالت عادی
            e.currentTarget.style.opacity = '1'
            // ناوبری به صفحه
            handleNavClick(item.path, item.page, e)
          }}
        >
          <span className="nav-icon">{item.icon}</span>
        </button>
      ))}
    </nav>
  )
}

export default BottomNavigation

