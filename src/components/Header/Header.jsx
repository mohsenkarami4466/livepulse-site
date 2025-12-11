/**
 * ============================================
 * 📋 کامپوننت Header - Header.jsx
 * ============================================
 * 
 * این کامپوننت هدر اصلی سایت را نمایش می‌دهد.
 * شامل: لوگو، نام سایت، دکمه تغییر تم، دکمه تمام صفحه، دکمه ورود
 * 
 * وابستگی‌ها:
 * - useNavigate: از react-router-dom برای ناوبری
 * - useApp: Context برای دسترسی به theme و state
 * - LoginModal: مودال ورود به حساب کاربری
 * 
 * عملکرد:
 * - تغییر تم (light/dark)
 * - ورود به حالت تمام صفحه
 * - باز کردن مودال ورود
 * - ناوبری به صفحه خانه با کلیک روی لوگو
 * 
 * تاریخ ایجاد: 2025-12-06
 * آخرین بروزرسانی: 2025-12-06
 */

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../contexts/AppContext'
import LoginModal from '../Modals/LoginModal'
import { getLogger } from '../../utils/dom-bridge'
import './Header.css'

/**
 * کامپوننت Header
 * 
 * State:
 * - isLoginModalOpen: وضعیت باز/بسته بودن مودال ورود
 * 
 * Effects:
 * - اعمال theme به body هنگام تغییر theme
 * - تنظیم event listener برای دکمه تغییر تم
 * - تنظیم event listener برای دکمه تمام صفحه
 */
function Header() {
  // Hook های React
  const navigate = useNavigate() // برای ناوبری بین صفحات
  const { currentTheme, setTheme } = useApp() // دسترسی به theme از Context
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false) // وضعیت مودال ورود

  /**
   * Effect: اعمال theme به body و html
   * 
   * هر بار که theme تغییر کند، attribute data-theme در body و html به‌روزرسانی می‌شود.
   * این برای CSS theme switching استفاده می‌شود.
   */
  // Theme handling is centralized in AppContext; no direct DOM writes here
  const handleThemeToggle = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  /**
   * Effect: تنظیم event listener برای دکمه تمام صفحه
   * 
   * دکمه fullscreenToggle را پیدا می‌کند و event listener اضافه می‌کند.
   * با کلیک روی دکمه، صفحه به حالت تمام صفحه می‌رود یا از آن خارج می‌شود.
   */
  useEffect(() => {
    const fullscreenToggle = document.getElementById('fullscreenToggle')
    if (fullscreenToggle) {
      const handleFullscreenToggle = () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(err => {
            const log = getLogger()
            log.error('خطا در ورود به حالت تمام صفحه:', err)
          })
        } else {
          document.exitFullscreen()
        }
      }

      fullscreenToggle.addEventListener('click', handleFullscreenToggle)
      return () => fullscreenToggle.removeEventListener('click', handleFullscreenToggle)
    }
  }, [])

  /**
   * Handler: کلیک روی دکمه ورود
   * 
   * مودال ورود را باز می‌کند و با کد vanilla JS هماهنگ می‌کند.
   */
  const handleLoginClick = () => {
    setIsLoginModalOpen(true)
    // هماهنگی با کد vanilla JS (برای backward compatibility)
    if (typeof window !== 'undefined' && window.openLoginModal) {
      window.openLoginModal()
    }
  }

  /**
   * Handler: کلیک روی لوگو
   * 
   * کاربر را به صفحه خانه هدایت می‌کند و هایلایت خانه را فعال می‌کند.
   */
  const handleLogoClick = () => {
    // ناوبری به صفحه خانه
    navigate('/')
    
    // اسکرول به بالای صفحه
    window.scrollTo({ top: 0, behavior: 'smooth' })
    
    // فعال کردن هایلایت خانه و به‌روزرسانی کارت‌ها
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        // تنظیم category به home
        if (window.appState) {
          window.appState.currentCategory = 'home'
        }
        
        // فعال کردن highlight circle خانه
        const homeCircle = document.querySelector('.highlight-circle[data-category="home"]')
        if (homeCircle) {
          homeCircle.classList.add('active')
        }
        
        // غیرفعال کردن بقیه highlights
        const otherCircles = document.querySelectorAll('.highlight-circle[data-category]:not([data-category="home"])')
        otherCircles.forEach(circle => {
          circle.classList.remove('active')
        })
        
        // به‌روزرسانی کارت‌ها - dispatch event برای Home component
        window.dispatchEvent(new CustomEvent('categoryChanged', { detail: { category: 'home' } }))
      }
    }, 200) // افزایش delay برای اطمینان از render شدن
  }

  /**
   * Render: ساختار HTML هدر
   * 
   * شامل:
   * - لوگو و نام سایت (قابل کلیک برای رفتن به خانه)
   * - دکمه تغییر تم (🌙)
   * - دکمه تمام صفحه (⛶)
   * - دکمه ورود
   * - مودال ورود (conditionally rendered)
   */
  return (
    <header className="glass-header">
      <div className="header-container">
        {/* لوگو و نام سایت - قابل کلیک برای رفتن به صفحه خانه */}
        <div className="logo-section" id="homeLogo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <div className="logo">LP</div>
          <h1 className="site-name">LivePulse.ir</h1>
        </div>

        {/* منوی کنترلی سمت چپ */}
        <div className="control-menu">
          {/* دکمه‌های کنترلی: تغییر تم و تمام صفحه */}
          <div className="theme-toggle-center">
            <button className="theme-toggle" id="themeToggle" onClick={handleThemeToggle}>
              <span className="theme-icon">🌙</span>
            </button>
            <button className="fullscreen-toggle" id="fullscreenToggle" title="تمام صفحه">
              <span className="fullscreen-icon">⛶</span>
            </button>
          </div>
          
          {/* دکمه ورود به حساب کاربری */}
          <button className="login-btn" id="loginBtn" onClick={handleLoginClick}>ورود</button>
        </div>
      </div>
      
      {/* مودال ورود - فقط زمانی نمایش داده می‌شود که isLoginModalOpen true باشد */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </header>
  )
}

export default Header

