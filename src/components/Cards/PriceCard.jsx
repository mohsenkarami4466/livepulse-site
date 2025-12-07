/**
 * ============================================
 * 💳 کامپوننت PriceCard - PriceCard.jsx
 * ============================================
 * 
 * این کامپوننت یک کارت قیمت را نمایش می‌دهد.
 * شامل: نام، قیمت، تغییرات، نمودار کوچک، زمان آخرین بروزرسانی
 * 
 * وابستگی‌ها:
 * - generateMiniChartSVG: تابع تولید نمودار کوچک SVG (از card-helpers.js)
 * - formatPrice: تابع فرمت کردن قیمت (از card-helpers.js)
 * - getLastUpdateTime: تابع دریافت زمان آخرین بروزرسانی (از card-helpers.js)
 * 
 * Props:
 * - item: آیتم قیمت شامل name, symbol, price, change, chart
 * - onClick: تابع handler برای کلیک روی کارت
 * 
 * عملکرد:
 * - نمایش اطلاعات قیمت
 * - نمایش نمودار کوچک (up/down)
 * - نمایش زمان آخرین بروزرسانی
 * - باز کردن مودال جزئیات با کلیک
 * 
 * تاریخ ایجاد: 2025-12-06
 * آخرین بروزرسانی: 2025-12-06
 */

import React, { useMemo } from 'react'
import { generateMiniChartSVG, formatPrice, getLastUpdateTime } from '../../utils/card-helpers'
import './PriceCard.css'

/**
 * کامپوننت PriceCard
 * 
 * @param {object} item - آیتم قیمت
 * @param {Function} onClick - تابع handler برای کلیک روی کارت
 */
function PriceCard({ item, onClick }) {
  const changeClass = item.change >= 0 ? 'positive' : 'negative'
  const isUp = item.change >= 0
  
  // استفاده از useMemo برای جلوگیری از محاسبه مجدد
  const miniChartSVG = useMemo(() => {
    try {
      return generateMiniChartSVG(item.symbol, isUp)
    } catch (error) {
      console.error('Error generating chart:', error)
      return ''
    }
  }, [item.symbol, isUp])
  
  const lastUpdate = useMemo(() => getLastUpdateTime(), [])

  const handleClick = () => {
    if (onClick) {
      onClick(item)
    } else {
      // Default behavior - check login and open detail
      if (typeof window !== 'undefined' && window.checkLoginRequired && window.checkLoginRequired()) {
        if (window.openPriceDetail) {
          window.openPriceDetail(item)
        }
      }
    }
  }

  return (
    <div 
      className={`price-card glass-card`}
      data-symbol={item.symbol}
      onClick={handleClick}
    >
      <div className="card-header">
        <h3>{item.name}</h3>
        <span className={`price-change ${changeClass}`}>
          {item.change >= 0 ? '+' : ''}{item.change.toFixed(1)}%
        </span>
      </div>
      <div className="card-content">
        <p className="current-price">{formatPrice(item.price, item.symbol)}</p>
        <div className={`mini-chart ${item.chart}`} dangerouslySetInnerHTML={{ __html: miniChartSVG }}></div>
      </div>
      <div className="card-update-time">
        <span className="update-dot"></span>
        <span className="update-text">{lastUpdate}</span>
      </div>
    </div>
  )
}

export default PriceCard

