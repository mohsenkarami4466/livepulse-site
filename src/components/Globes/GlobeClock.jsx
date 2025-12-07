/**
 * ============================================
 * 🕐 کامپوننت GlobeClock - GlobeClock.jsx
 * ============================================
 * 
 * این کامپوننت کره کوچک ساعت بازار را نمایش می‌دهد.
 * شامل: کره 3D کوچک، حلقه ساعت UTC، کلیک برای باز کردن modal
 * 
 * وابستگی‌ها:
 * - window.initGlobe: تابع راه‌اندازی کره 3D (از script-globes.js)
 * - window.setupSmallGlobeClick: تابع راه‌اندازی event listener کلیک (از script-globes.js)
 * - window.handleSmallGlobeClick: تابع handler کلیک (از script-globes.js)
 * 
 * عملکرد:
 * - نمایش کره 3D کوچک در گوشه بالا-چپ
 * - نمایش حلقه ساعت UTC
 * - باز کردن modal ساعت بازارها با کلیک
 * 
 * موقعیت:
 * - fixed position: top: 8px, left: 8px
 * - z-index: 999
 * 
 * تاریخ ایجاد: 2025-12-06
 * آخرین بروزرسانی: 2025-12-06
 */

import React, { useEffect, useRef } from 'react'
import './GlobeClock.css'

/**
 * کامپوننت GlobeClock
 * 
 * Refs:
 * - containerRef: reference به المان globeContainer
 * - wrapperRef: reference به المان wrapper
 * 
 * Effects:
 * - راه‌اندازی کره 3D با initGlobe
 * - راه‌اندازی event listener کلیک با setupSmallGlobeClick
 */
function GlobeClock() {
  const containerRef = useRef(null)
  const wrapperRef = useRef(null)

  useEffect(() => {
    const log = window.logger || { info: console.log, warn: console.warn, error: console.error }
    
    // استفاده از کد موجود برای globe clock
    if (typeof window !== 'undefined' && window.initGlobe) {
      // اگر initGlobe وجود دارد، از آن استفاده کن
      const timer = setTimeout(() => {
        if (window.initGlobe) {
          window.initGlobe()
          log.info('GlobeClock: initGlobe called')
        }
      }, 100)
      
      // تنظیم موقعیت Globe Clock - غیرفعال کردن updateGlobePosition
      // چون می‌خواهیم Globe Clock همیشه بالا و سمت چپ باشد (top: 8px, left: 8px)
      // و updateGlobePosition می‌خواهد آن را زیر Indicators قرار دهد
      
      // اگر در آینده بخواهیم از updateGlobePosition استفاده کنیم، می‌توانیم این بخش را فعال کنیم
      // اما فعلاً موقعیت را با inline style در JSX تنظیم می‌کنیم
      
      // راه‌اندازی event listener برای کلیک روی کره کوچک
      if (typeof window.setupSmallGlobeClick === 'function') {
        setTimeout(() => {
          window.setupSmallGlobeClick()
        }, 500)
      }
      
      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <div 
      className="globe-clock-wrapper" 
      id="globeClockWrapper"
      ref={wrapperRef}
      style={{ 
        display: 'block',
        visibility: 'visible',
        opacity: 1,
        position: 'fixed',
        top: '8px',
        left: '8px',
        zIndex: 999,
        pointerEvents: 'auto'
      }}
    >
      <div className="utc-clock-ring" id="utcClockRing">
        {/* ساعت‌های UTC توسط JS ساخته می‌شوند */}
      </div>
      <div 
        id="globeContainer" 
        ref={containerRef}
        title="کلیک کنید برای نقشه جهانی"
        onClick={(e) => {
          // جلوگیری از event propagation
          e.preventDefault()
          e.stopPropagation()
          // استفاده از handler موجود
          if (typeof window !== 'undefined' && window.handleSmallGlobeClick) {
            window.handleSmallGlobeClick(e)
          } else if (typeof window !== 'undefined' && window.openMarketHoursModal) {
            // Fallback: مستقیماً modal را باز کن
            window.openMarketHoursModal()
          }
        }}
        onTouchEnd={(e) => {
          // جلوگیری از event propagation
          e.preventDefault()
          e.stopPropagation()
          // استفاده از handler موجود
          if (typeof window !== 'undefined' && window.handleSmallGlobeClick) {
            window.handleSmallGlobeClick(e)
          } else if (typeof window !== 'undefined' && window.openMarketHoursModal) {
            // Fallback: مستقیماً modal را باز کن
            window.openMarketHoursModal()
          }
        }}
      ></div>
    </div>
  )
}

export default GlobeClock

