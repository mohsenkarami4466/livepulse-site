/**
 * ============================================
 * 💎 کامپوننت ResourcesGlobeModal - ResourcesGlobeModal.jsx
 * ============================================
 * 
 * این کامپوننت مودال کره منابع (طلا، نفت، گاز) را نمایش می‌دهد.
 * 
 * وابستگی‌ها:
 * - window.ResourcesGlobe: کلاس کره منابع (از script-globes.js)
 * - window.GlobeAssistiveTouch: کلاس دکمه سیار کره‌ها (از script-ui.js)
 * - window.initGlobeAssistiveTouches: تابع راه‌اندازی دکمه‌های سیار (از script-ui.js)
 * 
 * Props:
 * - isOpen: وضعیت باز/بسته بودن مودال
 * - onClose: تابع بستن مودال
 * 
 * عملکرد:
 * - نمایش کره 3D منابع (اطلاعات منابع طبیعی کشورها)
 * - راه‌اندازی دکمه سیار کره منابع
 * - نمایش منوی شیشه‌ای کره منابع
 * 
 * تاریخ ایجاد: 2025-12-06
 * آخرین بروزرسانی: 2025-12-06
 */

import React, { useEffect, useRef } from 'react'
import './GlobeModal.css'

/**
 * کامپوننت ResourcesGlobeModal
 * 
 * Refs:
 * - modalRef: reference به المان مودال
 * - containerRef: reference به المان کانتینر کره
 * 
 * Effects:
 * - راه‌اندازی کره 3D منابع با ResourcesGlobe
 * - راه‌اندازی دکمه سیار کره منابع با GlobeAssistiveTouch
 */
function ResourcesGlobeModal({ isOpen, onClose }) {
  const modalRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const log = window.logger || { info: console.log, error: console.error }
      
      // استفاده از buildSimpleGlobe برای ساخت کره 3D
      // این تابع در script-globes.js تعریف شده است
      if (typeof window !== 'undefined' && typeof window.buildSimpleGlobe === 'function') {
        log.info('🌍 در حال ساخت کره منابع...')
        
        // تاخیر برای اطمینان از نمایش modal
        setTimeout(() => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              try {
                window.buildSimpleGlobe('resourcesGlobeContainer', 'resources')
                log.info('✅ کره منابع ساخته شد')
                
                // راه‌اندازی دکمه سیار کره منابع - با تاخیر بیشتر برای اطمینان از لود شدن کره
                setTimeout(() => {
                  const assistive = document.getElementById('resourcesGlobeAssistive')
                  const glassMenu = document.getElementById('resourcesGlobeMenu')
                  
                  if (assistive && glassMenu && typeof window.GlobeAssistiveTouch !== 'undefined') {
                    // حذف instance قبلی اگر وجود داشت
                    if (window.resourcesGlobeAssistive) {
                      try {
                        const oldInstance = window.resourcesGlobeAssistive
                        if (oldInstance.touchButton) {
                          const newBtn = oldInstance.touchButton.cloneNode(true)
                          oldInstance.touchButton.parentNode.replaceChild(newBtn, oldInstance.touchButton)
            }
                      } catch (e) {
                        log.warn('خطا در پاک کردن instance قبلی:', e)
                      }
                    }
                    
                    // ایجاد instance جدید
                    try {
                      window.resourcesGlobeAssistive = new window.GlobeAssistiveTouch('resourcesGlobeAssistive', 'resourcesGlobeMenu', 'resources')
                      log.info('✅ دکمه سیار کره منابع راه‌اندازی شد')
                    } catch (error) {
                      log.error('❌ خطا در راه‌اندازی دکمه سیار کره منابع:', error)
                    }
                  } else {
                    log.warn('⚠️ المان‌های دکمه سیار کره منابع پیدا نشدند', {
                      assistive: !!assistive,
                      glassMenu: !!glassMenu
                    })
                  }
                }, 800)
              } catch (error) {
                log.error('❌ خطا در ساخت کره منابع:', error)
          }
            })
          })
        }, 100)
      } else {
        log.error('❌ تابع buildSimpleGlobe یافت نشد!')
      }
    }
  }, [isOpen])

  // همیشه render می‌شود اما hidden است تا vanilla JS بتواند آن را پیدا کند
  return (
    <div 
      className={`globe-modal ${isOpen ? 'active' : ''}`}
      id="resourcesGlobeModal"
      ref={modalRef}
      style={{ 
        display: isOpen ? 'block' : 'none',
        visibility: isOpen ? 'visible' : 'hidden',
        opacity: isOpen ? '1' : '0'
      }}
      onClick={(e) => {
        if (e.target === modalRef.current) {
          onClose()
        }
      }}
    >
      <div className="globe-modal-content">
        <div 
          id="resourcesGlobeContainer" 
          ref={containerRef}
          className="globe-container"
        ></div>
        
        {/* 🎮 دکمه سیار کره منابع */}
        <div className="globe-assistive-touch" id="resourcesGlobeAssistive">
          <button className="globe-touch-button">
            <span className="globe-touch-icon">⚙️</span>
          </button>
        </div>
        
        {/* منوی شیشه‌ای کره منابع */}
        <div className="globe-glass-menu" id="resourcesGlobeMenu">
          <div className="globe-menu-content">
            <h4 className="globe-menu-title">🌍 کره منابع جهان</h4>
            <div className="globe-menu-items">
              <button className="globe-menu-item" data-action="selectCountry">
                <span className="item-icon">🏳️</span>
                <span className="item-text">انتخاب کشور</span>
              </button>
              <button className="globe-menu-item" data-action="countryInfo">
                <span className="item-icon">📊</span>
                <span className="item-text">اطلاعات کشور</span>
              </button>
              <button className="globe-menu-item" data-action="toggleFilters">
                <span className="item-icon">⚙️</span>
                <span className="item-text">فیلترها</span>
              </button>
              <button className="globe-menu-item" data-action="resetView">
                <span className="item-icon">🔄</span>
                <span className="item-text">بازیابی دید</span>
              </button>
              <button className="globe-menu-item" data-action="toggleRotation">
                <span className="item-icon">🌐</span>
                <span className="item-text">چرخش زمین</span>
              </button>
              <button className="globe-menu-item" data-action="resetAll">
                <span className="item-icon">♻️</span>
                <span className="item-text">ریست کامل</span>
              </button>
              <button className="globe-menu-item exit-item" data-action="exit">
                <span className="item-icon">🚪</span>
                <span className="item-text">خروج</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResourcesGlobeModal
