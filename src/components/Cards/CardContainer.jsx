import React from 'react'
import PriceCard from './PriceCard'
import './CardContainer.css'

function CardContainer({ items = [], className = '', onCardClick }) {
  if (!items || items.length === 0) {
    return (
      <div className={`main-cards-container ${className}`} id="homeMainCards">
        <div className="loading-placeholder">
          <p>در حال بارگذاری کارت‌ها...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`main-cards-container ${className}`} id="homeMainCards">
      {items.map((item, index) => (
        <PriceCard 
          key={item.symbol || index} 
          item={item} 
          onClick={onCardClick}
        />
      ))}
    </div>
  )
}

export default CardContainer

