/**
 * ============================================
 * 🌍 کامپوننت Globe3DModal - Globe3DModal.jsx
 * ============================================
 * 
 * این کامپوننت مودال‌های کره‌های 3D را نمایش می‌دهد.
 * شامل: weather, military, universities, historical, earthquake, natural-resources
 * 
 * وابستگی‌ها:
 * - window.buildSimpleGlobe: تابع ساخت کره 3D (از script-globes.js)
 * - window.GlobeAssistiveTouch: کلاس دکمه سیار کره‌ها (از script-ui.js)
 * 
 * Props:
 * - type: نوع کره (weather, military, universities, historical, earthquake, natural-resources)
 * - isOpen: وضعیت باز/بسته بودن مودال
 * - onClose: تابع بستن مودال
 * 
 * عملکرد:
 * - نمایش کره 3D مربوطه
 * - راه‌اندازی دکمه سیار کره
 * - نمایش منوی شیشه‌ای کره
 * 
 * تاریخ ایجاد: 2025-12-06
 * آخرین بروزرسانی: 2025-12-06
 */

import React, { useEffect, useRef } from 'react'
import './GlobeModal.css'

/**
 * Map کردن type به modalId و containerId
 */
const typeToIds = {
  'weather': {
    modalId: 'weatherGlobeModal',
    containerId: 'weatherGlobeContainer',
    assistiveId: 'weatherGlobeAssistive',
    menuId: 'weatherGlobeMenu',
    title: '🌤️ کره آب و هوا'
  },
  'military': {
    modalId: 'militaryGlobeModal',
    containerId: 'militaryGlobeContainer',
    assistiveId: 'militaryGlobeAssistive',
    menuId: 'militaryGlobeMenu',
    title: '⚔️ کره نظامی'
  },
  'universities': {
    modalId: 'universitiesGlobeModal',
    containerId: 'universitiesGlobeContainer',
    assistiveId: 'universitiesGlobeAssistive',
    menuId: 'universitiesGlobeMenu',
    title: '🎓 کره دانشگاه‌ها'
  },
  'historical': {
    modalId: 'historicalGlobeModal',
    containerId: 'historicalGlobeContainer',
    assistiveId: 'historicalGlobeAssistive',
    menuId: 'historicalGlobeMenu',
    title: '🏛️ کره تاریخی'
  },
  'earthquake': {
    modalId: 'earthquakeGlobeModal',
    containerId: 'earthquakeGlobeContainer',
    assistiveId: 'earthquakeGlobeAssistive',
    menuId: 'earthquakeGlobeMenu',
    title: '🌍 کره زلزله'
  },
  'natural-resources': {
    modalId: 'naturalResourcesGlobeModal',
    containerId: 'naturalResourcesGlobeContainer',
    assistiveId: 'naturalResourcesGlobeAssistive',
    menuId: 'naturalResourcesGlobeMenu',
    title: '💎 کره منابع طبیعی'
  }
}

/**
 * کامپوننت Globe3DModal
 * 
 * Refs:
 * - modalRef: reference به المان مودال
 * - containerRef: reference به المان کانتینر کره
 * 
 * Effects:
 * - راه‌اندازی کره 3D با buildSimpleGlobe
 * - راه‌اندازی دکمه سیار کره با GlobeAssistiveTouch
 */
function Globe3DModal({ type, isOpen, onClose }) {
  const modalRef = useRef(null)
  const containerRef = useRef(null)
  
  const ids = typeToIds[type]
  if (!ids) {
    console.error(`❌ نوع کره نامعتبر: ${type}`)
    return null
  }

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const log = window.logger || { info: console.log, error: console.error }
      
      // استفاده از buildSimpleGlobe برای ساخت کره 3D
      if (typeof window !== 'undefined' && typeof window.buildSimpleGlobe === 'function') {
        log.info(`🌍 در حال ساخت کره ${type}...`)
        
        // تاخیر برای اطمینان از نمایش modal
        setTimeout(() => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              try {
                window.buildSimpleGlobe(ids.containerId, type)
                log.info(`✅ کره ${type} ساخته شد`)
                
                // راه‌اندازی دکمه سیار کره - با تاخیر بیشتر برای اطمینان از لود شدن کره
                setTimeout(() => {
                  // تبدیل نام assistive برای کره‌های خاص
                  let assistiveId = ids.assistiveId
                  let menuId = ids.menuId
                  
                  const assistive = document.getElementById(assistiveId)
                  const glassMenu = document.getElementById(menuId)
                  
                  if (assistive && glassMenu && typeof window.GlobeAssistiveTouch !== 'undefined') {
                    const instanceName = `${type}GlobeAssistive`
                    // حذف instance قبلی اگر وجود داشت
                    if (window[instanceName]) {
                      try {
                        // پاک کردن event listeners قبلی
                        const oldInstance = window[instanceName]
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
                      window[instanceName] = new window.GlobeAssistiveTouch(assistiveId, menuId, type)
                      log.info(`✅ دکمه سیار کره ${type} راه‌اندازی شد`)
                      
                      // اطمینان از setup شدن menu listeners
                      setTimeout(() => {
                        if (window[instanceName] && typeof window[instanceName].setupMenuListeners === 'function') {
                          window[instanceName].setupMenuListeners()
                          log.info(`✅ Menu listeners برای کره ${type} setup شدند`)
                        }
                      }, 200)
                    } catch (error) {
                      log.error(`❌ خطا در راه‌اندازی دکمه سیار کره ${type}:`, error)
                    }
                  } else {
                    log.warn(`⚠️ المان‌های دکمه سیار کره ${type} پیدا نشدند`, {
                      assistive: !!assistive,
                      glassMenu: !!glassMenu,
                      assistiveId,
                      menuId
                    })
                  }
                }, 800)
              } catch (error) {
                log.error(`❌ خطا در ساخت کره ${type}:`, error)
              }
            })
          })
        }, 100)
      } else {
        log.error('❌ تابع buildSimpleGlobe یافت نشد!')
      }
    }
  }, [isOpen, type, ids])

  // همیشه render می‌شود اما hidden است تا vanilla JS بتواند آن را پیدا کند
  return (
    <div 
      className={`globe-modal ${isOpen ? 'active' : ''}`}
      id={ids.modalId}
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
          id={ids.containerId} 
          ref={containerRef}
          className="globe-container"
        ></div>
        
        {/* 🎮 دکمه سیار کره */}
        <div className="globe-assistive-touch" id={ids.assistiveId}>
          <button className="globe-touch-button">
            <span className="globe-touch-icon">⚙️</span>
          </button>
        </div>
        
        {/* منوی شیشه‌ای کره */}
        <div className="globe-glass-menu" id={ids.menuId}>
          <div className="globe-menu-content">
            <h4 className="globe-menu-title">{ids.title}</h4>
            <div className="globe-menu-items">
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

export default Globe3DModal

