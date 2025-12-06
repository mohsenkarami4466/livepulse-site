import React, { useState, useEffect } from 'react'
import { useApp } from '../../contexts/AppContext'
import CardContainer from '../../components/Cards/CardContainer'
import FinancialGlobeModal from '../../components/Globes/FinancialGlobeModal'
import ResourcesGlobeModal from '../../components/Globes/ResourcesGlobeModal'
import PriceModal from '../../components/Modals/PriceModal'
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
  const { currentCategory, setCategory, incrementModals } = useApp()
  const [cards, setCards] = useState(mainItems)
  const [isFinancialGlobeOpen, setIsFinancialGlobeOpen] = useState(false)
  const [isResourcesGlobeOpen, setIsResourcesGlobeOpen] = useState(false)
  const [selectedPriceItem, setSelectedPriceItem] = useState(null)
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false)

  // فیلتر کردن کارت‌ها بر اساس category
  useEffect(() => {
    // هماهنگی با appState
    if (typeof window !== 'undefined' && window.appState) {
      window.appState.currentCategory = currentCategory
    }
    
    // دریافت داده‌ها بر اساس category
    let categoryCards = mainItems // پیش‌فرض
    
    if (typeof window !== 'undefined' && window.sampleData) {
      // استفاده از داده‌های sampleData اگر موجود باشد
      const categoryData = window.sampleData[currentCategory]
      if (categoryData && categoryData.length > 0) {
        // تبدیل به فرمت مورد نیاز
        categoryCards = categoryData.map(item => ({
          name: item.name,
          symbol: item.symbol,
          price: item.price,
          change: item.change,
          chart: item.chart || (item.change >= 0 ? 'up' : 'down')
        }))
      } else if (currentCategory === 'home') {
        // برای home، از mainItems استفاده کن
        categoryCards = mainItems
      } else {
        // برای category های دیگر که داده ندارند، از mainItems استفاده کن
        categoryCards = mainItems
      }
    }
    
    setCards(categoryCards)
  }, [currentCategory])

  useEffect(() => {
    // می‌توانیم بعداً از API داده بگیریم
    // فعلاً از داده‌های static استفاده می‌کنیم
    
    // Listen for globe open events from vanilla JS
    const handleFinancialGlobeOpen = () => setIsFinancialGlobeOpen(true)
    const handleResourcesGlobeOpen = () => setIsResourcesGlobeOpen(true)
    
    if (typeof window !== 'undefined') {
      window.addEventListener('financialGlobeOpen', handleFinancialGlobeOpen)
      window.addEventListener('resourcesGlobeOpen', handleResourcesGlobeOpen)
      
      // هماهنگی با appState
      if (window.appState) {
        window.appState.currentCategory = currentCategory
      }
    }
    
    // Initialize Gold Map
    if (typeof window !== 'undefined' && window.initGoldMap) {
      setTimeout(() => {
        window.initGoldMap()
      }, 500) // Delay to ensure DOM is ready
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('financialGlobeOpen', handleFinancialGlobeOpen)
        window.removeEventListener('resourcesGlobeOpen', handleResourcesGlobeOpen)
      }
    }
  }, [currentCategory])

  const handleCardClick = (item) => {
    // Check login and open detail modal
    if (typeof window !== 'undefined' && window.checkLoginRequired && window.checkLoginRequired()) {
      setSelectedPriceItem(item)
      setIsPriceModalOpen(true)
      // هماهنگی با کد vanilla JS
      if (window.openPriceDetail) {
        window.openPriceDetail(item)
      }
    }
  }

  return (
    <div id="homeView" className="view active-view" style={{ display: 'block' }}>
      {/* Globe Modals */}
      <FinancialGlobeModal 
        isOpen={isFinancialGlobeOpen} 
        onClose={() => setIsFinancialGlobeOpen(false)} 
      />
      <ResourcesGlobeModal 
        isOpen={isResourcesGlobeOpen} 
        onClose={() => setIsResourcesGlobeOpen(false)} 
      />
      
      {/* Price Modal */}
      <PriceModal
        isOpen={isPriceModalOpen}
        onClose={() => {
          setIsPriceModalOpen(false)
          setSelectedPriceItem(null)
        }}
        item={selectedPriceItem}
      />
      
      {/* Highlights Section */}
      <section className="highlights-section home-highlights">
        <div className="highlights-container">
          <div 
            className={`highlight-circle ${currentCategory === 'home' ? 'active' : ''}`} 
            data-category="home"
            onClick={() => setCategory('home')}
          >
            <span>خانه</span>
          </div>
          <div 
            className={`highlight-circle ${currentCategory === 'crypto' ? 'active' : ''}`} 
            data-category="crypto"
            onClick={() => setCategory('crypto')}
          >
            <span>رمزارز</span>
          </div>
          <div 
            className={`highlight-circle ${currentCategory === 'currency' ? 'active' : ''}`} 
            data-category="currency"
            onClick={() => setCategory('currency')}
          >
            <span>ارز</span>
          </div>
          <div 
            className={`highlight-circle ${currentCategory === 'gold' ? 'active' : ''}`} 
            data-category="gold"
            onClick={() => setCategory('gold')}
          >
            <span>طلا</span>
          </div>
          <div 
            className={`highlight-circle ${currentCategory === 'forex' ? 'active' : ''}`} 
            data-category="forex"
            onClick={() => setCategory('forex')}
          >
            <span>فارکس</span>
          </div>
          <div 
            className={`highlight-circle ${currentCategory === 'stock' ? 'active' : ''}`} 
            data-category="stock"
            onClick={() => setCategory('stock')}
          >
            <span>بورس</span>
          </div>
          <div 
            className={`highlight-circle ${currentCategory === 'oil' ? 'active' : ''}`} 
            data-category="oil"
            onClick={() => setCategory('oil')}
          >
            <span>نفت</span>
          </div>
        </div>
      </section>

      {/* Main Cards Container */}
      <main className="main-content" style={{ padding: '1rem', minHeight: '200px' }}>
        {cards && cards.length > 0 ? (
          <CardContainer 
            items={cards} 
            className="home-cards"
            onCardClick={handleCardClick}
          />
        ) : (
          <div className="loading-placeholder">
            <p>در حال بارگذاری کارت‌ها...</p>
          </div>
        )}
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
              <div id="goldMapGlass" className="gold-map-visual"></div>
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
