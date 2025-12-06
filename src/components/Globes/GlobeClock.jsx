import React, { useEffect, useRef } from 'react'
import './GlobeClock.css'

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
          // استفاده از handler موجود
          if (typeof window !== 'undefined' && window.handleSmallGlobeClick) {
            window.handleSmallGlobeClick(e)
          }
        }}
        onTouchEnd={(e) => {
          // استفاده از handler موجود
          if (typeof window !== 'undefined' && window.handleSmallGlobeClick) {
            window.handleSmallGlobeClick(e)
          }
        }}
      ></div>
    </div>
  )
}

export default GlobeClock

