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
                  const modalContent = document.querySelector('#resourcesGlobeModal .globe-modal-content')
                  
                  if (assistive && glassMenu && modalContent && typeof window.GlobeAssistiveTouch !== 'undefined') {
                    // حذف instance قبلی اگر وجود داشت
                    if (window.resourcesGlobeAssistive) {
                      try {
                        const oldInstance = window.resourcesGlobeAssistive
                        if (oldInstance.touchButton) {
                          const newBtn = oldInstance.touchButton.cloneNode(true)
                          oldInstance.touchButton.parentNode.replaceChild(newBtn, oldInstance.touchButton)
                        }
                        // حذف event listeners
                        if (oldInstance.glassMenu) {
                          const newMenu = oldInstance.glassMenu.cloneNode(true)
                          oldInstance.glassMenu.parentNode.replaceChild(newMenu, oldInstance.glassMenu)
                        }
                      } catch (e) {
                        log.warn('خطا در پاک کردن instance قبلی:', e)
                      }
                    }
                    
                    // ایجاد instance جدید
                    try {
                      window.resourcesGlobeAssistive = new window.GlobeAssistiveTouch('resourcesGlobeAssistive', 'resourcesGlobeMenu', 'resources')
                      log.info('✅ دکمه سیار کره منابع راه‌اندازی شد')
                      
                      // اطمینان از setup شدن menu listeners
                      setTimeout(() => {
                        if (window.resourcesGlobeAssistive) {
                          if (typeof window.resourcesGlobeAssistive.setupMenuListeners === 'function') {
                            window.resourcesGlobeAssistive.setupMenuListeners()
                            log.info('✅ Menu listeners برای کره منابع setup شدند')
                          }
                          
                          // اطمینان از snapToEdge - اگر موقعیت ذخیره شده وجود ندارد، snap به لبه انجام شود
                          if (typeof window.resourcesGlobeAssistive.snapToEdge === 'function') {
                            setTimeout(() => {
                              if (window.resourcesGlobeAssistive && typeof window.resourcesGlobeAssistive.snapToEdge === 'function') {
                                window.resourcesGlobeAssistive.snapToEdge()
                                log.info('✅ دکمه سیار کره منابع به لبه snap شد')
                              }
                            }, 300)
                          }
                        }
                      }, 200)
                    } catch (error) {
                      log.error('❌ خطا در راه‌اندازی دکمه سیار کره منابع:', error)
                    }
                  } else {
                    log.warn('⚠️ المان‌های دکمه سیار کره منابع پیدا نشدند', {
                      assistive: !!assistive,
                      glassMenu: !!glassMenu,
                      modalContent: !!modalContent,
                      GlobeAssistiveTouch: typeof window.GlobeAssistiveTouch
                    })
                    // Retry بعد از تاخیر بیشتر
                    setTimeout(() => {
                      const retryAssistive = document.getElementById('resourcesGlobeAssistive')
                      const retryGlassMenu = document.getElementById('resourcesGlobeMenu')
                      const retryModalContent = document.querySelector('#resourcesGlobeModal .globe-modal-content')
                      
                      if (retryAssistive && retryGlassMenu && retryModalContent && typeof window.GlobeAssistiveTouch !== 'undefined') {
                        try {
                          window.resourcesGlobeAssistive = new window.GlobeAssistiveTouch('resourcesGlobeAssistive', 'resourcesGlobeMenu', 'resources')
                          log.info('✅ دکمه سیار کره منابع راه‌اندازی شد (retry)')
                        } catch (error) {
                          log.error('❌ خطا در راه‌اندازی دکمه سیار کره منابع (retry):', error)
                        }
                      }
                    }, 2000)
                  }
                }, 1000) // افزایش delay برای اطمینان از لود شدن کامل کره
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
      <div className="globe-modal-content" id="resourcesGlobeModalContent">
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
