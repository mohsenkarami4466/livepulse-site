/**
 * ============================================
 * 🌍 کامپوننت FinancialGlobeModal - FinancialGlobeModal.jsx
 * ============================================
 * 
 * این کامپوننت مودال کره مالی (ساعت بازارها) را نمایش می‌دهد.
 * 
 * وابستگی‌ها:
 * - window.FinancialGlobe: کلاس کره مالی (از script-globes.js)
 * - window.GlobeAssistiveTouch: کلاس دکمه سیار کره‌ها (از script-ui.js)
 * - window.initGlobeAssistiveTouches: تابع راه‌اندازی دکمه‌های سیار (از script-ui.js)
 * 
 * Props:
 * - isOpen: وضعیت باز/بسته بودن مودال
 * - onClose: تابع بستن مودال
 * 
 * عملکرد:
 * - نمایش کره 3D مالی (ساعت بازارهای جهان)
 * - راه‌اندازی دکمه سیار کره مالی
 * - نمایش منوی شیشه‌ای کره مالی
 * 
 * تاریخ ایجاد: 2025-12-06
 * آخرین بروزرسانی: 2025-12-06
 */

import React, { useEffect, useRef } from 'react'
import './GlobeModal.css'

/**
 * کامپوننت FinancialGlobeModal
 * 
 * Refs:
 * - modalRef: reference به المان مودال
 * - containerRef: reference به المان کانتینر کره
 * 
 * Effects:
 * - راه‌اندازی کره 3D مالی با FinancialGlobe
 * - راه‌اندازی دکمه سیار کره مالی با GlobeAssistiveTouch
 */
function FinancialGlobeModal({ isOpen, onClose }) {
  const modalRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const log = window.logger || { info: console.log, error: console.error, warn: console.warn }
      
      // بررسی وجود container
      const container = document.getElementById('financialGlobeContainer')
      if (!container) {
        log.error('❌ Container کره مالی پیدا نشد!')
        return
      }
      
      // بررسی وجود THREE.js
      if (typeof THREE === 'undefined') {
        log.error('❌ THREE.js لود نشده است!')
        container.innerHTML = '<p style="color: #ff6b6b; padding: 20px; text-align: center;">Three.js لود نشده است!</p>'
        return
      }
      
      // استفاده از buildSimpleGlobe برای ساخت کره 3D
      // این تابع در script-globes.js تعریف شده است
      if (typeof window !== 'undefined' && typeof window.buildSimpleGlobe === 'function') {
        log.info('🌍 در حال ساخت کره مالی...')
        
        // تاخیر برای اطمینان از نمایش modal
        setTimeout(() => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              try {
                // پاک کردن container قبل از ساخت کره جدید
                container.innerHTML = ''
                
                window.buildSimpleGlobe('financialGlobeContainer', 'financial')
                log.info('✅ کره مالی ساخته شد')
                
                // راه‌اندازی پنل‌ها و دکمه انتخاب بازار
                if (typeof window.populateMarketList === 'function') {
                  window.populateMarketList()
                }
                if (typeof window.setupMarketSelector === 'function') {
                  window.setupMarketSelector()
                }
                
                // راه‌اندازی دکمه سیار کره مالی - با تاخیر بیشتر برای اطمینان از لود شدن کره
                setTimeout(() => {
                  const assistive = document.getElementById('financialGlobeAssistive')
                  const glassMenu = document.getElementById('financialGlobeMenu')
                  const modalContent = document.querySelector('#financialGlobeModal .globe-modal-content')
                  
                  if (assistive && glassMenu && modalContent && typeof window.GlobeAssistiveTouch !== 'undefined') {
                    // حذف instance قبلی اگر وجود داشت
                    if (window.financialGlobeAssistive) {
                      try {
                        const oldInstance = window.financialGlobeAssistive
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
                      window.financialGlobeAssistive = new window.GlobeAssistiveTouch('financialGlobeAssistive', 'financialGlobeMenu', 'financial')
                      log.info('✅ دکمه سیار کره مالی راه‌اندازی شد')
                      
                      // اطمینان از setup شدن menu listeners
                      setTimeout(() => {
                        if (window.financialGlobeAssistive) {
                          if (typeof window.financialGlobeAssistive.setupMenuListeners === 'function') {
                            window.financialGlobeAssistive.setupMenuListeners()
                            log.info('✅ Menu listeners برای کره مالی setup شدند')
                          }
                          
                          // اطمینان از snapToEdge - اگر موقعیت ذخیره شده وجود ندارد، snap به لبه انجام شود
                          if (typeof window.financialGlobeAssistive.snapToEdge === 'function') {
                            setTimeout(() => {
                              if (window.financialGlobeAssistive && typeof window.financialGlobeAssistive.snapToEdge === 'function') {
                                window.financialGlobeAssistive.snapToEdge()
                                log.info('✅ دکمه سیار کره مالی به لبه snap شد')
                              }
                            }, 300)
                          }
                        }
                      }, 200)
                    } catch (error) {
                      log.error('❌ خطا در راه‌اندازی دکمه سیار کره مالی:', error)
                    }
                  } else {
                    log.warn('⚠️ المان‌های دکمه سیار کره مالی پیدا نشدند', {
                      assistive: !!assistive,
                      glassMenu: !!glassMenu,
                      modalContent: !!modalContent,
                      GlobeAssistiveTouch: typeof window.GlobeAssistiveTouch
                    })
                    // Retry بعد از تاخیر بیشتر
                    setTimeout(() => {
                      const retryAssistive = document.getElementById('financialGlobeAssistive')
                      const retryGlassMenu = document.getElementById('financialGlobeMenu')
                      const retryModalContent = document.querySelector('#financialGlobeModal .globe-modal-content')
                      
                      if (retryAssistive && retryGlassMenu && retryModalContent && typeof window.GlobeAssistiveTouch !== 'undefined') {
                        try {
                          window.financialGlobeAssistive = new window.GlobeAssistiveTouch('financialGlobeAssistive', 'financialGlobeMenu', 'financial')
                          log.info('✅ دکمه سیار کره مالی راه‌اندازی شد (retry)')
                        } catch (error) {
                          log.error('❌ خطا در راه‌اندازی دکمه سیار کره مالی (retry):', error)
                        }
                      }
                    }, 2000)
                  }
                }, 1000) // افزایش delay برای اطمینان از لود شدن کامل کره
              } catch (error) {
                log.error('❌ خطا در ساخت کره مالی:', error)
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
      id="financialGlobeModal"
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
      <div className="globe-modal-content" id="financialGlobeModalContent">
        <div 
          id="financialGlobeContainer" 
          ref={containerRef}
          className="globe-container"
        ></div>
        
        {/* 🎮 دکمه سیار کره مالی */}
        <div className="globe-assistive-touch" id="financialGlobeAssistive">
          <button className="globe-touch-button">
            <span className="globe-touch-icon">⚙️</span>
          </button>
        </div>
        
        {/* منوی شیشه‌ای کره مالی */}
        <div className="globe-glass-menu" id="financialGlobeMenu">
          <div className="globe-menu-content">
            <h4 className="globe-menu-title">🌍 کره ساعت بازارها</h4>
            <div className="globe-menu-items">
              <button className="globe-menu-item" data-action="selectMarket">
                <span className="item-icon">📍</span>
                <span className="item-text">انتخاب بازار</span>
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

export default FinancialGlobeModal
