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

import React, { useEffect, useRef, useMemo } from 'react'
import './GlobeModal.css'
import FloatingDock from '../FloatingDock/FloatingDock'

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
 */
function Globe3DModal({ type, isOpen, onClose, actions = {} }) {
  const modalRef = useRef(null)
  const containerRef = useRef(null)
  const modalContentRef = useRef(null) // ref برای globe-modal-content
  
  const ids = typeToIds[type]

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
    if (isOpen && containerRef.current) {
      const log = window.logger || { info: console.log, error: console.error }
      if (typeof window !== 'undefined' && typeof window.buildSimpleGlobe === 'function') {
        log.info(`🌍 در حال ساخت کره ${type}...`)
        setTimeout(() => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              try {
                window.buildSimpleGlobe(ids.containerId, type)
                log.info(`✅ کره ${type} ساخته شد`)
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

  const dockMenuItems = useMemo(() => {
    if (!ids) return []
    return [
      { id: 'close', label: 'بستن', icon: '✕', onClick: onClose },
      { id: 'reset', label: 'ریست دید', icon: '⟲', onClick: actions.resetView },
      { id: 'rotation', label: 'چرخش', icon: '🔄', onClick: actions.toggleRotation },
      { id: 'filters', label: 'فیلترها', icon: '🧭', onClick: actions.toggleFilters },
      { id: 'country', label: 'کشورها', icon: '🌐', onClick: actions.openCountryPanel }
    ].filter(item => typeof item.onClick === 'function')
  }, [ids, onClose, actions])

  if (!ids) {
    const log = window.logger || { error: console.error }
    log.error(`❌ نوع کره نامعتبر: ${type}`)
    return null
  }

  const renderContent = () => {
    return dockMenuItems
  }

  // Debug logging
  useEffect(() => {
    const log = window.logger || { info: console.log }
    log.info(`🌍 Globe3DModal render: type=${type}, isOpen=${isOpen}`)
  }, [type, isOpen])

  // همیشه render می‌شود اما hidden است تا vanilla JS بتواند آن را پیدا کند
  return (
    <div 
      className={`globe-modal ${isOpen ? 'active' : ''}`}
      id={ids.modalId}
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
        ref={modalContentRef}
      >
        <div 
          id={ids.containerId} 
          ref={containerRef}
          className="globe-container"
        ></div>
        <FloatingDock
          mode="globe"
          storageKey={`floatingDockPos-${type}`}
          menuItems={dockMenuItems}
          containerRef={modalContentRef}
          icon="⚙️"
        />
      </div>
    </div>
  )
}

export default Globe3DModal

