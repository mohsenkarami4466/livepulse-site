/**
 * ============================================
 * 🖨️ کامپوننت PrintModal - PrintModal.jsx
 * ============================================
 * 
 * این کامپوننت مودال انتخاب نوع خروجی برای پورتفولیو را نمایش می‌دهد.
 * 
 * Props:
 * - onClose: تابع بستن مودال
 * - portfolioTotal: مجموع دارایی‌ها
 * - portfolioChange: تغییر دارایی‌ها
 * - onSelectFormat: تابع انتخاب فرمت خروجی
 * 
 * تاریخ ایجاد: 2025-12-10
 * آخرین بروزرسانی: 2025-12-10
 */

import React, { useEffect, useRef } from 'react'

/**
 * کامپوننت PrintModal
 * 
 * این کامپوننت مودال انتخاب نوع خروجی را نمایش می‌دهد.
 * کاربر می‌تواند از بین فرمت‌های مختلف (اینستاگرام، توییتر، لینکدین، نرمال، ریز) انتخاب کند.
 */
function PrintModal({ onClose, portfolioTotal, portfolioChange, onSelectFormat }) {
  const modalRef = useRef(null)
  
  useEffect(() => {
    // جلوگیری از اسکرول صفحه وقتی مودال باز است
    document.body.classList.add('modal-open')
    
    // ذخیره موقعیت اسکرول فعلی
    const scrollY = window.scrollY
    
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose()
      }
    }
    
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    
    return () => {
      // بازگرداندن اسکرول صفحه
      document.body.classList.remove('modal-open')
      window.scrollTo(0, scrollY)
      
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])
  
  /**
   * ============================================
   * 📋 لیست فرمت‌های خروجی
   * ============================================
   * این آرایه شامل تمام فرمت‌های خروجی است که کاربر می‌تواند انتخاب کند
   * 
   * TODO: می‌توانید برای هر فرمت جداگانه کار کنید:
   * - اینستاگرام: format.id === 'instagram'
   * - توییتر: format.id === 'twitter'
   * - لینکدین: format.id === 'linkedin'
   * - سایز نرمال: format.id === 'normal'
   * - خروجی ریز: format.id === 'detailed'
   * 
   * می‌توانید width، height، maxSize و ... را برای هر کدام تغییر دهید
   */
  const formats = [
    // 📷 پست اینستاگرام - سایز مربعی 1080x1080
    // TODO: می‌توانید این بخش را برای اینستاگرام سفارشی کنید
    { id: 'instagram', name: '📷 پست اینستاگرام', width: 1080, height: 1080, maxSize: 8 * 1024 * 1024 }, // 8MB
    
    // 🐦 پست توییتر - سایز افقی 1200x675
    // TODO: می‌توانید این بخش را برای توییتر سفارشی کنید
    { id: 'twitter', name: '🐦 پست توییتر', width: 1200, height: 675, maxSize: 5 * 1024 * 1024 }, // 5MB
    
    // 💼 پست لینکدین - سایز افقی 1200x627
    // TODO: می‌توانید این بخش را برای لینکدین سفارشی کنید
    { id: 'linkedin', name: '💼 پست لینکدین', width: 1200, height: 627, maxSize: 10 * 1024 * 1024 }, // 10MB
    
    // 📄 سایز نرمال - سایز استاندارد 1920x1080
    // TODO: می‌توانید این بخش را برای سایز نرمال سفارشی کنید
    { id: 'normal', name: '📄 سایز نرمال', width: 1920, height: 1080, maxSize: 10 * 1024 * 1024 }, // 10MB
    
    // 📊 خروجی ریز (اکسل) - سایز استاندارد با جدول جزئیات
    // TODO: می‌توانید این بخش را برای خروجی ریز سفارشی کنید
    { id: 'detailed', name: '📊 خروجی ریز (اکسل)', width: 1920, height: 1080, detailed: true, maxSize: 10 * 1024 * 1024 } // 10MB
  ]
  
  return (
    <div className="print-modal-overlay" onClick={onClose}>
      <div className="print-modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <button className="print-modal-close" onClick={onClose} aria-label="بستن">
          ✕
        </button>
        <div className="print-modal-header">
          <h3>🖨️ انتخاب نوع خروجی</h3>
          <p>نوع خروجی مورد نظر خود را انتخاب کنید</p>
        </div>
        <div className="print-modal-options">
          {formats.map(format => (
            <button
              key={format.id}
              className="print-format-btn"
              onClick={() => onSelectFormat(format)}
            >
              {format.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PrintModal

