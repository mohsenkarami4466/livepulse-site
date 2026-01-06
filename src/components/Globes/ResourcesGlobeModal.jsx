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

import React, { useEffect, useRef, useMemo } from 'react'
import './GlobeModal.css'
import FloatingDock from '../FloatingDock/FloatingDock'

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
  const modalContentRef = useRef(null) // ref برای globe-modal-content
  
  // Menu items برای FloatingDock
  const dockMenuItems = useMemo(() => [
    { 
      id: 'selectCountry', 
      label: 'انتخاب کشور', 
      icon: '🏳️', 
      onClick: () => {
        const log = window.logger || { info: console.log }
        log.info('🏳️ انتخاب کشور')
        // TODO: implement select country
      }
    },
    { 
      id: 'countryInfo', 
      label: 'اطلاعات کشور', 
      icon: '📊', 
      onClick: () => {
        const log = window.logger || { info: console.log }
        log.info('📊 اطلاعات کشور')
        // TODO: implement country info
      }
    },
    { 
      id: 'toggleFilters', 
      label: 'فیلترها', 
      icon: '⚙️', 
      onClick: () => {
        const log = window.logger || { info: console.log }
        log.info('⚙️ فیلترها')
        // TODO: implement toggle filters
      }
    },
    { 
      id: 'resetView', 
      label: 'بازیابی دید', 
      icon: '🔄', 
      onClick: () => {
        if (typeof window.resetGlobeView === 'function') {
          window.resetGlobeView('resources')
        }
      }
    },
    { 
      id: 'toggleRotation', 
      label: 'چرخش زمین', 
      icon: '🌐', 
      onClick: () => {
        const log = window.logger || { info: console.log }
        log.info('🌐 چرخش زمین')
        // TODO: implement toggle rotation
      }
    },
    { 
      id: 'resetAll', 
      label: 'ریست کامل', 
      icon: '♻️', 
      onClick: () => {
        if (typeof window.resetGlobeView === 'function') {
          window.resetGlobeView('resources')
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
    // اضافه/حذف class به body برای جلوگیری از اسکرول
    if (isOpen) {
      document.body.classList.add('globe-modal-open')
    } else {
      document.body.classList.remove('globe-modal-open')
    }
    
    // Cleanup
    return () => {
      document.body.classList.remove('globe-modal-open')
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      return
    }
    
    const log = window.logger || { info: console.log, error: console.error }
    
    // استفاده از buildSimpleGlobe برای ساخت کره 3D
    if (typeof window !== 'undefined' && typeof window.buildSimpleGlobe === 'function') {
      log.info('🌍 در حال ساخت کره منابع...')
      
      // تاخیر برای اطمینان از نمایش modal
      setTimeout(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            try {
              const container = document.getElementById('resourcesGlobeContainer')
              if (!container) {
                log.error('❌ Container resourcesGlobeContainer پیدا نشد!')
                return
              }
              
              // پاک کردن container قبل از ساخت کره جدید
              container.innerHTML = ''
              
              window.buildSimpleGlobe('resourcesGlobeContainer', 'resources')
              log.info('✅ کره منابع ساخته شد')
            } catch (error) {
              log.error('❌ خطا در ساخت کره منابع:', error)
            }
          })
        })
      }, 200)
    } else {
      log.error('❌ تابع buildSimpleGlobe یافت نشد!')
    }
  }, [isOpen])

  // Debug logging
  useEffect(() => {
    const log = window.logger || { info: console.log }
    log.info(`🌍 ResourcesGlobeModal render: isOpen=${isOpen}`)
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
        opacity: isOpen ? '1' : '0',
        zIndex: isOpen ? 9999 : -1,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh'
      }}
      onClick={(e) => {
        if (e.target === modalRef.current) {
          onClose()
        }
      }}
    >
      <div 
        className="globe-modal-content" 
        id="resourcesGlobeModalContent"
        ref={modalContentRef}
      >
        <div 
          id="resourcesGlobeContainer" 
          ref={containerRef}
          className="globe-container"
        ></div>
        
        {/* 🎮 دکمه سیار کره منابع - استفاده از FloatingDock */}
        <FloatingDock
          mode="globe"
          storageKey="floatingDockPos-resources"
          menuItems={dockMenuItems}
          containerRef={modalContentRef}
          icon="⚙️"
        />
      </div>
    </div>
  )
}

export default ResourcesGlobeModal
