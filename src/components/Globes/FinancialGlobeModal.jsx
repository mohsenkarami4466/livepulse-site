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

import React, { useEffect, useRef, useMemo } from 'react'
import './GlobeModal.css'
import FloatingDock from '../FloatingDock/FloatingDock'

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
  const modalContentRef = useRef(null) // ref برای globe-modal-content
  
  // Menu items برای FloatingDock
  const dockMenuItems = useMemo(() => [
    { 
      id: 'selectMarket', 
      label: 'انتخاب بازار', 
      icon: '📍', 
      onClick: () => {
        const panel = document.getElementById('marketSelectPanel')
        const btn = document.getElementById('marketSelectorBtn')
        if (panel) {
          panel.classList.toggle('visible')
          panel.classList.toggle('active')
        }
        if (btn) {
          btn.classList.toggle('active')
        }
      }
    },
    { 
      id: 'resetView', 
      label: 'بازیابی دید', 
      icon: '🔄', 
      onClick: () => {
        if (typeof window.resetGlobeView === 'function') {
          window.resetGlobeView('financial')
        }
      }
    },
    { 
      id: 'toggleRotation', 
      label: 'چرخش زمین', 
      icon: '🌐', 
      onClick: () => {
        // TODO: implement toggle rotation
        const log = window.logger || { info: console.log }
        log.info('🔄 چرخش زمین')
      }
    },
    { 
      id: 'resetAll', 
      label: 'ریست کامل', 
      icon: '♻️', 
      onClick: () => {
        if (typeof window.resetGlobeView === 'function') {
          window.resetGlobeView('financial')
        }
      }
    },
    { 
      id: 'exit', 
      label: 'خروج', 
      icon: '🚪', 
      onClick: onClose
    }
  ], [onClose])

  useEffect(() => {
    const log = window.logger || { info: console.log, error: console.error, warn: console.warn, debug: console.log }
    
    log.info('🌍 FinancialGlobeModal useEffect - isOpen:', isOpen)
    
    if (!isOpen) {
      log.info('🌍 FinancialGlobeModal بسته است - return')
      return
    }
    
    log.info('🌍 FinancialGlobeModal باز است - شروع initialization')
    
    // تابع جداگانه برای ساخت کره
    const buildGlobe = (container, log) => {
    try {
      log.info('🌍 شروع ساخت کره مالی...')
      log.info('Container:', container ? '✅ پیدا شد' : '❌ پیدا نشد')
      log.info('buildSimpleGlobe:', typeof window.buildSimpleGlobe === 'function' ? '✅ تابع موجود است' : '❌ تابع موجود نیست')
      log.info('THREE:', typeof THREE !== 'undefined' ? '✅ THREE.js موجود است' : '❌ THREE.js موجود نیست')
      
      // بررسی وجود THREE.js
      if (typeof THREE === 'undefined') {
        log.error('❌ THREE.js لود نشده است!')
        container.innerHTML = '<p style="color: #ff6b6b; padding: 20px; text-align: center;">Three.js لود نشده است!</p>'
        return
      }
      
      // بررسی وجود buildSimpleGlobe
      if (typeof window.buildSimpleGlobe !== 'function') {
        log.error('❌ window.buildSimpleGlobe یافت نشد!')
        container.innerHTML = '<p style="color: #ff6b6b; padding: 20px; text-align: center;">خطا در لود کره. لطفاً صفحه را رفرش کنید.</p>'
        return
      }
      
      // پاک کردن container قبل از ساخت کره جدید
      container.innerHTML = ''
      
      log.info('🌍 در حال ساخت کره با buildSimpleGlobe...')
      const result = window.buildSimpleGlobe('financialGlobeContainer', 'financial')
      log.debug('نتیجه buildSimpleGlobe:', result)
      log.info('✅ کره مالی ساخته شد')
                
      // راه‌اندازی پنل‌ها و دکمه انتخاب بازار
      setTimeout(() => {
        if (typeof window.populateMarketList === 'function') {
          window.populateMarketList()
        }
        if (typeof window.setupMarketSelector === 'function') {
          window.setupMarketSelector()
        }
      }, 300)
      
      // دکمه سیار با FloatingDock مدیریت می‌شود - کد GlobeAssistiveTouch حذف شد
    } catch (error) {
      log.error('❌ خطا در ساخت کره مالی:', error)
      if (container) {
        container.innerHTML = '<p style="color: #ff6b6b; padding: 20px; text-align: center;">خطا در ساخت کره. لطفاً صفحه را رفرش کنید.</p>'
      }
    }
  }
    
    // تاخیر برای اطمینان از render شدن DOM
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          try {
            // بررسی وجود container - بدون وابستگی به containerRef
            const container = document.getElementById('financialGlobeContainer')
            if (!container) {
              log.error('❌ Container financialGlobeContainer پیدا نشد!')
              // Retry بعد از تاخیر بیشتر
              setTimeout(() => {
                const retryContainer = document.getElementById('financialGlobeContainer')
                if (!retryContainer) {
                  log.error('❌ Container financialGlobeContainer بعد از retry هم پیدا نشد!')
                  return
                }
                buildGlobe(retryContainer, log)
              }, 500)
              return
            }
            
            buildGlobe(container, log)
          } catch (error) {
            log.error('❌ خطا در useEffect FinancialGlobeModal:', error)
          }
        })
      })
    }, 200) // افزایش delay برای اطمینان از render شدن DOM
    
    return () => {
      clearTimeout(timeoutId)
    }
  }, [isOpen])

  // همیشه render می‌شود اما hidden است تا vanilla JS بتواند آن را پیدا کند
  // مهم: display باید 'none' باشد نه عدم render - تا element در DOM باشد
  return (
    <div 
      className={`globe-modal ${isOpen ? 'active' : ''}`}
      id="financialGlobeModal"
      ref={modalRef}
      style={{ 
        display: isOpen ? 'block' : 'none', // 'none' نه عدم render
        visibility: isOpen ? 'visible' : 'hidden',
        opacity: isOpen ? '1' : '0',
        position: 'fixed', // اطمینان از fixed position
        zIndex: isOpen ? 10000 : -1 // وقتی بسته است z-index منفی
      }}
      onClick={(e) => {
        if (e.target === modalRef.current) {
          onClose()
        }
      }}
    >
      <div 
        className="globe-modal-content" 
        id="financialGlobeModalContent"
        ref={modalContentRef}
      >
        <div 
          id="financialGlobeContainer" 
          ref={containerRef}
          className="globe-container"
        ></div>
        
        {/* پنل انتخاب بازار */}
        <div className="globe-panel market-select-panel" id="marketSelectPanel">
          <div className="globe-panel-header">
            <h4>🌍 بازارهای جهانی</h4>
            <button 
              className="globe-panel-close" 
              onClick={() => {
                const panel = document.getElementById('marketSelectPanel')
                if (panel) {
                  panel.classList.remove('active')
                  panel.classList.remove('visible')
                }
              }}
            >
              ×
            </button>
          </div>
          <div className="globe-panel-body">
            <input 
              type="text" 
              className="globe-panel-search" 
              placeholder="🔍 جستجوی بازار..." 
              id="marketSearchInput"
            />
            <div className="market-select-list" id="marketSelectList">
              {/* لیست بازارها با JS پر می‌شود */}
            </div>
          </div>
        </div>
        
        {/* دکمه انتخاب بازار */}
        <button 
          className="globe-fab-btn" 
          id="marketSelectorBtn"
          title="انتخاب بازار"
        >
          📍
        </button>
        
        {/* 🎮 دکمه سیار کره مالی - استفاده از FloatingDock */}
        <FloatingDock
          mode="globe"
          storageKey="floatingDockPos-financial"
          menuItems={dockMenuItems}
          containerRef={modalContentRef}
          icon="⚙️"
        />
      </div>
    </div>
  )
}

export default FinancialGlobeModal
