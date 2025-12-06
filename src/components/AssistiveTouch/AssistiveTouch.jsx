import React, { useEffect, useRef } from 'react'
import './AssistiveTouch.css'

function AssistiveTouch() {
  const initializedRef = useRef(false)

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

        // ایجاد instance جدید
        window.assistiveTouch = new window.AssistiveTouch()
        log.info('🎮 دکمه شناور راه‌اندازی شد')
        
        // اطمینان از نمایش
        if (window.assistiveTouch && typeof window.assistiveTouch.ensureVisibility === 'function') {
          window.assistiveTouch.ensureVisibility()
          // یک بار دیگر بعد از تاخیر برای اطمینان
          setTimeout(() => {
            if (window.assistiveTouch && typeof window.assistiveTouch.ensureVisibility === 'function') {
              window.assistiveTouch.ensureVisibility()
            }
          }, 500)
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
      
      {/* منوی شیشه‌ای */}
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

