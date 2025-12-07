/**
 * ============================================
 * 🕐 کامپوننت MarketHoursModal - MarketHoursModal.jsx
 * ============================================
 * 
 * این کامپوننت مودال ساعت بازارها را نمایش می‌دهد.
 * این مودال با کلیک روی کره کوچک (Globe Clock) باز می‌شود.
 * 
 * وابستگی‌ها:
 * - window.initMarketHoursClock: تابع راه‌اندازی ساعت بازارها (از script-globes.js)
 * 
 * Props:
 * - isOpen: وضعیت باز/بسته بودن مودال
 * - onClose: تابع بستن مودال
 * 
 * عملکرد:
 * - نمایش ساعت بازارهای مختلف جهان
 * - راه‌اندازی ساعت ساده (gcClockSimple)
 * 
 * تاریخ ایجاد: 2025-12-06
 * آخرین بروزرسانی: 2025-12-06
 */

import React, { useEffect, useRef } from 'react'
import './MarketHoursModal.css'

/**
 * کامپوننت MarketHoursModal
 * 
 * Refs:
 * - modalRef: reference به المان مودال
 * - clockContainerRef: reference به المان کانتینر ساعت
 * 
 * Effects:
 * - راه‌اندازی ساعت بازارها با initMarketHoursClock
 */
function MarketHoursModal({ isOpen, onClose }) {
  const modalRef = useRef(null)
  const clockContainerRef = useRef(null)

  /**
   * Effect: راه‌اندازی ساعت بازارها
   * 
   * این effect:
   * 1. منتظر می‌ماند تا مودال باز شود
   * 2. ساعت بازارها را راه‌اندازی می‌کند
   */
  useEffect(() => {
    if (isOpen && clockContainerRef.current) {
      // راه‌اندازی ساعت بازارها
      if (typeof window !== 'undefined') {
        // اگر تابع initMarketHoursClock موجود است، از آن استفاده کن
        if (typeof window.initMarketHoursClock === 'function') {
          setTimeout(() => {
            window.initMarketHoursClock('gcClockSimple')
          }, 100)
        } else {
          // Fallback: بررسی اینکه آیا ساعت قبلاً راه‌اندازی شده
          const clockElement = document.getElementById('gcClockSimple')
          if (clockElement && clockElement.children.length === 0) {
            // اگر ساعت راه‌اندازی نشده، یک پیام نمایش بده
            const log = window.logger || { warn: console.warn }
            log.warn('⚠️ initMarketHoursClock function not found')
          }
        }
      }
    }
  }, [isOpen])

  /**
   * Handler: کلیک روی overlay
   * 
   * این تابع مودال را می‌بندد اگر روی overlay کلیک شود.
   */
  const handleOverlayClick = (e) => {
    if (e.target === modalRef.current) {
      onClose()
    }
  }

  // همیشه render می‌شود اما hidden است تا vanilla JS بتواند آن را پیدا کند
  /**
   * Render: ساختار مودال ساعت بازارها
   * 
   * شامل:
   * - دکمه بستن (×)
   * - عنوان "ساعت بازارها"
   * - کانتینر ساعت (gcClockSimple)
   */
  return (
    <div 
      className={`gc-modal-overlay ${isOpen ? 'active' : ''}`}
      id="gcModal"
      ref={modalRef}
      style={{ 
        display: isOpen ? 'flex' : 'none',
        visibility: isOpen ? 'visible' : 'hidden',
        opacity: isOpen ? '1' : '0'
      }}
      onClick={handleOverlayClick}
    >
      <div className="gc-modal-content">
        <span className="gc-close" onClick={onClose}>&times;</span>
        <h3>ساعت بازارها</h3>
        <div id="gcClockSimple" ref={clockContainerRef}></div>
      </div>
    </div>
  )
}

export default MarketHoursModal

