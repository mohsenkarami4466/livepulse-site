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
 * نکته مهم:
 * - این کامپوننت از vanilla JS class استفاده می‌کند
 * - باید منتظر بماند تا vanilla JS class لود شود
 * - از retry mechanism برای اطمینان از initialization استفاده می‌کند
 * 
 * تاریخ ایجاد: 2025-12-06
 * آخرین بروزرسانی: 2025-12-06
 */

import React, { useEffect, useRef } from 'react'
import './AssistiveTouch.css'

/**
 * کامپوننت AssistiveTouch
 * 
 * این کامپوننت دکمه سیار و منوی شیشه‌ای را رندر می‌کند.
 * از vanilla JS class AssistiveTouch برای مدیریت عملکرد استفاده می‌کند.
 * 
 * State:
 * - initializedRef: برای جلوگیری از initialization چندباره
 */
function AssistiveTouch() {
  const initializedRef = useRef(false) // Flag برای جلوگیری از initialization چندباره

  /**
   * Effect: راه‌اندازی دکمه سیار
   * 
   * این effect:
   * 1. منتظر می‌ماند تا vanilla JS class AssistiveTouch لود شود
   * 2. منتظر می‌ماند تا DOM elements آماده شوند
   * 3. یک instance از AssistiveTouch class ایجاد می‌کند
   * 4. event listeners را اضافه می‌کند
   * 
   * Retry Mechanism:
   * - اگر initialization موفق نشد، هر 100ms دوباره تلاش می‌کند
   * - حداکثر 5 ثانیه تلاش می‌کند
   */
  useEffect(() => {
    // استفاده از کد موجود برای assistive touch
    // کد vanilla JS در script-ui.js این را مدیریت می‌کند
    
    // اطمینان از اینکه فقط یک بار initialize شود
    if (initializedRef.current) {
      return
    }

    const log = window.logger || { info: console.log, error: console.error }
    
    // بررسی اینکه آیا AssistiveTouch class موجود است (از window)
    // AssistiveTouch class در script-ui.js تعریف شده است
    const checkAndInitialize = () => {
      try {
        // بررسی اینکه آیا element موجود است
        const touchElement = document.getElementById('assistiveTouch')
        if (!touchElement) {
          // اگر element موجود نیست، صبر کن
          return false
        }

        // بررسی اینکه آیا AssistiveTouch class موجود است
        if (typeof window.AssistiveTouch === 'undefined') {
          // اگر class هنوز لود نشده، صبر کن
          return false
        }

        // بررسی اینکه آیا قبلاً initialize شده
        if (window.assistiveTouch) {
          log.info('✅ دکمه شناور قبلاً راه‌اندازی شده است')
          initializedRef.current = true
          return true
        }

        // بررسی وجود touchButton قبل از ایجاد instance
        const touchButton = touchElement.querySelector('.touch-button')
        if (!touchButton) {
          log.warn('⚠️ touch-button پیدا نشد - صبر می‌کنیم...')
          return false
        }
        
        // بررسی وجود glassMenu
        const glassMenu = document.getElementById('glassMenu')
        if (!glassMenu) {
          log.warn('⚠️ glassMenu پیدا نشد - صبر می‌کنیم...')
          return false
        }
        
        // حذف instance قبلی اگر وجود داشت
        if (window.assistiveTouch) {
          try {
            // حذف event listeners قبلی
            if (window.assistiveTouch.touchButton) {
              const newBtn = window.assistiveTouch.touchButton.cloneNode(true)
              window.assistiveTouch.touchButton.parentNode.replaceChild(newBtn, window.assistiveTouch.touchButton)
            }
            // حذف event listeners از glass menu
            if (window.assistiveTouch.glassMenu) {
              const newMenu = window.assistiveTouch.glassMenu.cloneNode(true)
              window.assistiveTouch.glassMenu.parentNode.replaceChild(newMenu, window.assistiveTouch.glassMenu)
            }
          } catch (e) {
            log.warn('⚠️ خطا در پاک کردن instance قبلی:', e)
          }
        }
        
        // ایجاد instance جدید
        try {
          window.assistiveTouch = new window.AssistiveTouch()
          log.info('🎮 دکمه شناور راه‌اندازی شد')
        } catch (error) {
          log.error('❌ خطا در ایجاد instance دکمه شناور:', error)
          return false
        }
        
        // اطمینان از نمایش و کارکرد
        if (window.assistiveTouch) {
          // اطمینان از visibility
          if (typeof window.assistiveTouch.ensureVisibility === 'function') {
            window.assistiveTouch.ensureVisibility()
            // یک بار دیگر بعد از تاخیر برای اطمینان
            setTimeout(() => {
              if (window.assistiveTouch && typeof window.assistiveTouch.ensureVisibility === 'function') {
                window.assistiveTouch.ensureVisibility()
              }
            }, 500)
          }
          
          // بررسی و به‌روزرسانی touchButton reference و setup مجدد event listeners
          // طبق یادداشت مرجع: باید بعد از initialization، setupGlassMenu فراخوانی شود
          setTimeout(() => {
            const currentTouchButton = document.querySelector('#assistiveTouch .touch-button')
            if (currentTouchButton && window.assistiveTouch) {
              // اگر touchButton تغییر کرده یا null است، به‌روزرسانی کن
              if (!window.assistiveTouch.touchButton || window.assistiveTouch.touchButton !== currentTouchButton) {
                window.assistiveTouch.touchButton = currentTouchButton
                // اگر setupEventListeners موجود است، دوباره فراخوانی کن
                if (typeof window.assistiveTouch.setupEventListeners === 'function') {
                  window.assistiveTouch.setupEventListeners()
                  log.info('✅ Event listeners برای دکمه سیار اضافه شدند (retry)')
                }
              }
            }
            
            // اطمینان از setup شدن glass menu - طبق یادداشت مرجع
            if (window.assistiveTouch && typeof window.assistiveTouch.setupGlassMenu === 'function') {
              window.assistiveTouch.setupGlassMenu()
              log.info('✅ Glass menu برای دکمه سیار setup شد (retry)')
            }
          }, 500) // طبق یادداشت مرجع: تاخیر 200ms برای اپرا، ما 500ms می‌گذاریم
        }
        
        initializedRef.current = true
        return true
      } catch (error) {
        log.error('❌ خطا در راه‌اندازی دکمه شناور:', error)
        if (window.errorHandler) {
          window.errorHandler.handleError(error, 'AssistiveTouch - React Component')
        }
        return false
      }
    }

    // تلاش اولیه
    if (!checkAndInitialize()) {
      // اگر موفق نشد، با interval چک کن
      const checkInterval = setInterval(() => {
        if (checkAndInitialize()) {
          clearInterval(checkInterval)
        }
      }, 100)
      
      // تایم‌اوت برای جلوگیری از infinite loop
      setTimeout(() => {
        clearInterval(checkInterval)
      }, 5000)
      
      return () => clearInterval(checkInterval)
    }
  }, [])

  return (
    <>
      <div className="assistive-touch" id="assistiveTouch">
        <div className="touch-button">
          <div className="touch-icon">☰</div>
        </div>
      </div>
      
      {/* منوی شیشه‌ای - این overlay برای نمایش منو استفاده می‌شود */}
      {/* id="glassMenu" برای استفاده vanilla JS class AssistiveTouch */}
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

