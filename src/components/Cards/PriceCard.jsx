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
      const log = window.logger || { error: console.error }
      log.error('Error generating chart:', error)
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

  // اگر دکمه کره 3D است
  if (item.isGlobeButton) {
    const globeIcon = item.globeId === 'resources' ? '🌍' : 
                     item.globeId === 'weather' ? '🌤️' :
                     item.globeId === 'military' ? '⚔️' :
                     item.globeId === 'universities' ? '🎓' :
                     item.globeId === 'historical' ? '🏛️' :
                     item.globeId === 'earthquake' ? '🌋' :
                     item.globeId === 'natural-resources' ? '🌿' : '🌐'
    
    return (
      <div 
        className={`price-card glass-card globe-button-card`}
        data-symbol={item.symbol}
        onClick={handleClick}
        style={{ 
          cursor: 'pointer',
          position: 'relative',
          top: 0,
          left: 0,
          transform: 'translateZ(0) translateY(0)',
          animation: 'none'
        }}
      >
        <div className="card-header">
          <h3>{globeIcon} {item.name}</h3>
        </div>
        <div className="card-content">
          <p className="globe-button-text">باز کردن کره 3D</p>
          <div className="globe-button-icon">🌐</div>
        </div>
      </div>
    )
  }

  // اگر placeholder است، نمایش ساده
  if (item.isPlaceholder) {
    return (
      <div 
        className={`price-card glass-card placeholder-card`}
        data-symbol={item.symbol}
        onClick={handleClick}
        style={{
          position: 'relative',
          top: 0,
          left: 0,
          transform: 'translateZ(0) translateY(0)',
          animation: 'none'
        }}
      >
        <div className="card-header">
          <h3>{item.placeholderText || 'در حال توسعه'}</h3>
        </div>
        <div className="card-content">
          <p className="placeholder-text">{item.placeholderText || 'در حال توسعه'}</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`price-card glass-card`}
      data-symbol={item.symbol}
      onClick={handleClick}
      style={{
        // جلوگیری از پرش - موقعیت ثابت
        position: 'relative',
        top: 0,
        left: 0,
        transform: 'translateZ(0) translateY(0)',
        // حذف animation
        animation: 'none'
      }}
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

