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
  const initializedRef = useRef(false) // جلوگیری از initialization چندباره

  useEffect(() => {
    // جلوگیری از initialization چندباره
    if (initializedRef.current) {
      return
    }

    const log = window.logger || { info: console.log, warn: console.warn, error: console.error }
    
    // تابع initialize که فقط یک بار اجرا می‌شود
    const initializeGlobeClock = () => {
      // بررسی وجود container
      if (!containerRef.current || !document.getElementById('globeContainer')) {
        log.warn('⚠️ GlobeClock: container پیدا نشد')
        return false
      }

      // بررسی وجود initGlobe
      if (typeof window.initGlobe !== 'function') {
        log.warn('⚠️ GlobeClock: window.initGlobe پیدا نشد')
        return false
      }

      try {
        // ساخت حلقه ساعت UTC - اول این را بساز (نیازی به کره ندارد)
        // باید بعد از render شدن element فراخوانی شود
        const ringElement = document.getElementById('utcClockRing')
        if (ringElement && typeof window.createUTCClockRing === 'function') {
          try {
            // تاخیر کوتاه برای اطمینان از render شدن کامل
            setTimeout(() => {
              window.createUTCClockRing()
              log.info('✅ GlobeClock: createUTCClockRing called')
              
              // بررسی که آیا اعداد ساخته شدند
              setTimeout(() => {
                const hours = ringElement.querySelectorAll('.utc-hour')
                if (hours.length > 0) {
                  log.info(`✅ GlobeClock: ${hours.length} عدد ساعت UTC ساخته شد`)
                } else {
                  log.warn('⚠️ GlobeClock: هیچ عددی ساخته نشد، retry...')
                  window.createUTCClockRing()
                }
              }, 200)
              
              // راه‌اندازی به‌روزرسانی ساعت UTC هر 1 ثانیه
              if (typeof window.updateUTCClock === 'function') {
                setInterval(window.updateUTCClock, 1000)
                log.info('✅ GlobeClock: updateUTCClock interval started')
              }
            }, 100)
          } catch (error) {
            log.error('❌ خطا در createUTCClockRing:', error)
          }
        } else {
          if (!ringElement) {
            log.warn('⚠️ GlobeClock: utcClockRing element هنوز render نشده')
          }
          if (typeof window.createUTCClockRing !== 'function') {
            log.warn('⚠️ GlobeClock: window.createUTCClockRing پیدا نشد')
          }
        }
        
        // Initialize کره - بعد از ساخت حلقه ساعت
        if (typeof window.initGlobe === 'function') {
          window.initGlobe()
          log.info('✅ GlobeClock: initGlobe called')
        } else {
          log.warn('⚠️ GlobeClock: window.initGlobe پیدا نشد')
        }
        
        // بررسی اجرای animate بعد از تاخیر کوتاه
        setTimeout(() => {
          if (window.smallGlobeAnimationId) {
            log.info('✅ GlobeClock: Animation در حال اجرا است')
          } else {
            log.warn('⚠️ GlobeClock: Animation شروع نشد')
          }
        }, 300)

        // راه‌اندازی event listener برای کلیک
        if (typeof window.setupSmallGlobeClick === 'function') {
          setTimeout(() => {
            try {
              window.setupSmallGlobeClick()
              log.info('✅ GlobeClock: setupSmallGlobeClick called')
            } catch (error) {
              log.error('❌ خطا در setupSmallGlobeClick:', error)
            }
          }, 500)
        }

        initializedRef.current = true
        return true
      } catch (error) {
        log.error('❌ خطا در initializeGlobeClock:', error)
        return false
      }
    }

    // تلاش اولیه بعد از تاخیر برای اطمینان از آماده بودن DOM
    // تاخیر بیشتر برای اطمینان از render شدن React
    const timer = setTimeout(() => {
      if (initializeGlobeClock()) {
        // موفق بود - اما اگر حلقه ساعت ساخته نشد، دوباره تلاش کن
        setTimeout(() => {
          const ringElement = document.getElementById('utcClockRing')
          if (ringElement && ringElement.children.length === 0 && typeof window.createUTCClockRing === 'function') {
            log.info('🔄 GlobeClock: retry createUTCClockRing')
            window.createUTCClockRing()
          }
        }, 500)
      } else {
        // اگر موفق نشد، retry با interval
        const retryInterval = setInterval(() => {
          if (initializeGlobeClock()) {
            clearInterval(retryInterval)
            // بعد از موفقیت، دوباره چک کن که حلقه ساعت ساخته شده
            setTimeout(() => {
              const ringElement = document.getElementById('utcClockRing')
              if (ringElement && ringElement.children.length === 0 && typeof window.createUTCClockRing === 'function') {
                log.info('🔄 GlobeClock: retry createUTCClockRing after init')
                window.createUTCClockRing()
              }
            }, 500)
          }
        }, 300)
        
        // تایم‌اوت
        setTimeout(() => {
          clearInterval(retryInterval)
        }, 10000)
      }
    }, 800) // تاخیر بیشتر برای اطمینان از render شدن React

    return () => {
      clearTimeout(timer)
    }
  }, [])

  // محاسبه top بر اساس ارتفاع header
  React.useEffect(() => {
    const updatePosition = () => {
      const header = document.querySelector('.glass-header, .header-container')?.parentElement || document.querySelector('header');
      const headerHeight = header ? header.offsetHeight : 60;
      
      if (wrapperRef.current) {
        wrapperRef.current.style.top = `${headerHeight + 8}px`;
      }
    };
    
    updatePosition();
    window.addEventListener('resize', updatePosition);
    
    // بررسی بعد از render
    setTimeout(updatePosition, 100);
    setTimeout(updatePosition, 500);
    
    return () => window.removeEventListener('resize', updatePosition);
  }, []);

  return (
    <div 
      className="globe-clock-wrapper" 
      id="globeClockWrapper"
      ref={wrapperRef}
      data-react-mode="true"
      style={{ 
        display: 'block',
        visibility: 'visible',
        opacity: 1,
        position: 'fixed',
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
      ></div>
    </div>
  )
}

export default GlobeClock
