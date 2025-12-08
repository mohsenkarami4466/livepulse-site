/**
 * ============================================
 * 🎮 کامپوننت AssistiveTouch - AssistiveTouch.jsx
 * ============================================
 * 
 * این کامپوننت دکمه سیار (Floating Action Button) را نمایش می‌دهد.
 * دکمه سیار یک دکمه شناور است که می‌توان آن را drag & drop کرد و منوی شیشه‌ای را باز می‌کند.
 * 
 * وابستگی‌ها:
 * - AssistiveTouch class: از script-ui.js (vanilla JS)
 * - Glass Menu: منوی شیشه‌ای برای ناوبری
 * 
 * عملکرد:
 * - نمایش دکمه سیار در موقعیت ذخیره شده یا پیش‌فرض
 * - Drag & Drop: امکان جابجایی دکمه
 * - باز کردن منوی شیشه‌ای با کلیک/تاچ
 * - ناوبری به صفحات از طریق منوی شیشه‌ای
 * - ذخیره موقعیت در localStorage
 * 
 * تاریخ ایجاد: 2025-12-06
 * آخرین بروزرسانی: 2025-12-06
 */

import React, { useEffect, useRef } from 'react'
import './AssistiveTouch.css'

function AssistiveTouch() {
  const initializedRef = useRef(false)

  useEffect(() => {
    // جلوگیری از initialization چندباره
    if (initializedRef.current) {
      return
    }

    const log = window.logger || { info: console.log, error: console.error, warn: console.warn }
    
    const checkAndInitialize = () => {
      try {
        // بررسی element
        const touchElement = document.getElementById('assistiveTouch')
        if (!touchElement) {
          return false
        }

        // بررسی class
        if (typeof window.AssistiveTouch === 'undefined') {
          return false
        }

        // بررسی اینکه آیا قبلاً initialize شده
        if (window.assistiveTouch) {
          log.info('✅ دکمه شناور قبلاً راه‌اندازی شده است')
          initializedRef.current = true
          return true
        }

        // بررسی وجود touchButton و glassMenu
        const touchButton = touchElement.querySelector('.touch-button')
        const glassMenu = document.getElementById('glassMenu')
        
        if (!touchButton || !glassMenu) {
          return false
        }
        
        // ایجاد instance
        try {
          window.assistiveTouch = new window.AssistiveTouch()
          log.info('🎮 دکمه شناور راه‌اندازی شد')
          
          // Override navigateToPage برای React Router
          if (window.assistiveTouch.navigateToPage) {
            const originalNavigate = window.assistiveTouch.navigateToPage.bind(window.assistiveTouch)
            window.assistiveTouch.navigateToPage = (page) => {
              if (window.navigate && typeof window.navigate === 'function') {
                const pageMap = {
                  'home': '/',
                  'tools': '/tools',
                  'news': '/news',
                  'globe': '/globe',
                  'tutorial': '/tutorial',
                  'relax': '/relax'
                }
                const path = pageMap[page] || '/'
                window.navigate(path)
                log.info(`🎮 Navigate to page via React Router: ${path}`)
              } else {
                originalNavigate(page)
              }
            }
          }
          
          // اطمینان از visibility
          if (typeof window.assistiveTouch.ensureVisibility === 'function') {
            window.assistiveTouch.ensureVisibility()
            setTimeout(() => {
              if (window.assistiveTouch && typeof window.assistiveTouch.ensureVisibility === 'function') {
                window.assistiveTouch.ensureVisibility()
              }
            }, 500)
          }
          
          // snapToEdge اگر موقعیت ذخیره نشده
          setTimeout(() => {
            if (window.assistiveTouch && typeof window.assistiveTouch.snapToEdge === 'function') {
              const savedPos = localStorage.getItem('assistiveTouchPos')
              if (!savedPos) {
                window.assistiveTouch.snapToEdge()
                log.info('✅ دکمه سیار به لبه snap شد')
              }
            }
          }, 800)
          
          initializedRef.current = true
          return true
        } catch (error) {
          log.error('❌ خطا در ایجاد instance دکمه شناور:', error)
          return false
        }
      } catch (error) {
        log.error('❌ خطا در checkAndInitialize:', error)
        return false
      }
    }

    // تلاش اولیه
    const timer = setTimeout(() => {
      if (!checkAndInitialize()) {
        // Retry با interval
        const checkInterval = setInterval(() => {
          if (checkAndInitialize()) {
            clearInterval(checkInterval)
          }
        }, 200)
        
        setTimeout(() => {
          clearInterval(checkInterval)
        }, 10000)
      }
    }, 800)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  return (
    <>
      <div className="assistive-touch" id="assistiveTouch">
        <div className="touch-button">
          <div className="touch-icon">☰</div>
        </div>
      </div>
      
      <div className="glass-menu-overlay" id="glassMenu">
        <div className="glass-menu">
          <button className="glass-close-btn" id="closeGlassMenu">✕</button>
          <div className="glass-menu-content">
            <button className="glass-menu-item" data-page="home">
              <span className="glass-icon">🏠</span>
              <span className="glass-text">خانه</span>
            </button>
            <button className="glass-menu-item" data-page="tools">
              <span className="glass-icon">🛠️</span>
              <span className="glass-text">ابزار</span>
            </button>
            <button className="glass-menu-item" data-page="news">
              <span className="glass-icon">📰</span>
              <span className="glass-text">اخبار</span>
            </button>
            <button className="glass-menu-item" data-page="globe">
              <span className="glass-icon">🌍</span>
              <span className="glass-text">کره‌ها</span>
            </button>
            <button className="glass-menu-item" data-page="tutorial">
              <span className="glass-icon">📚</span>
              <span className="glass-text">آموزش</span>
            </button>
            <button className="glass-menu-item" data-page="relax">
              <span className="glass-icon">🧘‍♂️</span>
              <span className="glass-text">آرامش</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default AssistiveTouch
