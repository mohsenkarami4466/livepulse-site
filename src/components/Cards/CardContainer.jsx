/**
 * ============================================
 * 📦 کامپوننت CardContainer - CardContainer.jsx
 * ============================================
 * 
 * این کامپوننت کانتینر کارت‌های قیمت را نمایش می‌دهد.
 * کارت‌ها را در یک grid layout نمایش می‌دهد.
 * 
 * وابستگی‌ها:
 * - PriceCard: کامپوننت کارت قیمت
 * 
 * Props:
 * - items: آرایه آیتم‌های قیمت
 * - className: کلاس CSS اضافی
 * - onCardClick: تابع handler برای کلیک روی کارت
 * 
 * عملکرد:
 * - نمایش کارت‌ها در grid layout (5 ستون در دسکتاپ)
 * - نمایش placeholder اگر کارتی وجود نداشته باشد
 * 
 * تاریخ ایجاد: 2025-12-06
 * آخرین بروزرسانی: 2025-12-06
 */

import React, { useMemo } from 'react'
import PriceCard from './PriceCard'
import './CardContainer.css'

/**
 * کامپوننت CardContainer
 * 
 * @param {Array} items - لیست آیتم‌های قیمت
 * @param {string} className - کلاس CSS اضافی
 * @param {Function} onCardClick - تابع handler برای کلیک روی کارت
 */
function CardContainer({ items = [], className = '', onCardClick }) {
  // استفاده از useMemo برای جلوگیری از re-render غیرضروری
  const cards = useMemo(() => {
    if (!items || items.length === 0) {
      return []
    }
    return items
  }, [items])

  if (!cards || cards.length === 0) {
    return (
      <div className={`main-cards-container ${className}`} id="homeMainCards">
        <div className="loading-placeholder">
          <p>در حال بارگذاری کارت‌ها...</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`main-cards-container ${className}`} 
      id="homeMainCards" 
      style={{ 
        display: 'grid'
      }}
    >
      {cards.map((item, index) => (
        <PriceCard 
          key={`${item.symbol || item.name || 'card'}-${index}-${item.isPlaceholder ? 'placeholder' : ''}-${item.isGlobeButton ? 'globe' : ''}`} 
          item={item} 
          onClick={onCardClick}
        />
      ))}
    </div>
  )
}

export default CardContainer

