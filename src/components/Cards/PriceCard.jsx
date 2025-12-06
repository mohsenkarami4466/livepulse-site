import React, { useMemo } from 'react'
import { generateMiniChartSVG, formatPrice, getLastUpdateTime } from '../../utils/card-helpers'
import './PriceCard.css'

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

