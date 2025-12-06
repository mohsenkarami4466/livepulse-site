import React, { useState, useEffect } from 'react'
import CardContainer from '../../components/Cards/CardContainer'
import './Home.css'

// داده‌های کارت‌های اصلی
const mainItems = [
  {
    name: 'دلار آمریکا',
    symbol: 'USD',
    price: 58000,
    change: 0.3,
    chart: 'up'
  },
  {
    name: 'طلای ۱۸ عیار',
    symbol: 'GOLD',
    price: 2450000,
    change: -0.8,
    chart: 'down'
  },
  {
    name: 'بیت‌کوین',
    symbol: 'BTC',
    price: 42000,
    change: 2.1,
    chart: 'up'
  },
  {
    name: 'شاخص بورس',
    symbol: 'TEDPIX',
    price: 2150000,
    change: 0.7,
    chart: 'up'
  }
]

function Home() {
  const [cards, setCards] = useState(mainItems)

  useEffect(() => {
    // می‌توانیم بعداً از API داده بگیریم
    // فعلاً از داده‌های static استفاده می‌کنیم
  }, [])

  const handleCardClick = (item) => {
    // Check login and open detail modal
    if (typeof window !== 'undefined' && window.checkLoginRequired && window.checkLoginRequired()) {
      if (window.openPriceDetail) {
        window.openPriceDetail(item)
      }
    }
  }

  return (
    <div id="homeView" className="view active-view">
      {/* Highlights Section */}
      <section className="highlights-section home-highlights">
        <div className="highlights-container">
          <div className="highlight-circle active" data-category="home">
            <span>خانه</span>
          </div>
          <div className="highlight-circle" data-category="crypto">
            <span>رمزارز</span>
          </div>
          <div className="highlight-circle" data-category="currency">
            <span>ارز</span>
          </div>
          <div className="highlight-circle" data-category="gold">
            <span>طلا</span>
          </div>
          <div className="highlight-circle" data-category="forex">
            <span>فارکس</span>
          </div>
          <div className="highlight-circle" data-category="stock">
            <span>بورس</span>
          </div>
          <div className="highlight-circle" data-category="oil">
            <span>نفت</span>
          </div>
        </div>
      </section>

      {/* Main Cards Container */}
      <main className="main-content">
        <CardContainer 
          items={cards} 
          className="home-cards"
          onCardClick={handleCardClick}
        />
      </main>

      {/* Gold Map Section - فقط در صفحه خانه */}
      <section className="gold-map-section" id="goldMapSection">
        <div className="gold-map-container">
          <div className="map-header-bar">
            <h3>🗺️ نقشه جهانی منابع</h3>
            <div className="map-controls-inline">
              <select className="filter-select" id="mapFilter">
                <option value="reserves">💰 ذخایر طلا</option>
                <option value="production">⛏️ برداشت طلا</option>
                <option value="gdp">📈 تولید ناخالص</option>
                <option value="oil">🛢️ تولید نفت</option>
                <option value="gas">🔥 تولید گاز</option>
              </select>
              <select className="year-select" id="yearFilter">
                <option value="2024">۲۰۲۴</option>
                <option value="2023">۲۰۲۳</option>
                <option value="2022">۲۰۲۲</option>
              </select>
            </div>
          </div>
          <div className="map-content-row">
            <div className="map-visualization" id="goldMapVisualization">
              {/* Map will be rendered here */}
            </div>
            <div className="map-ranking" id="goldMapRanking">
              {/* Ranking will be rendered here */}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
