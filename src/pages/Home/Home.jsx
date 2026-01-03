/**
 * ============================================
 * 🏠 صفحه خانه - Home.jsx
 * ============================================
 * 
 * این کامپوننت صفحه اصلی (خانه) اپلیکیشن را نمایش می‌دهد.
 * شامل: Highlights (دسته‌بندی‌ها), کارت‌های قیمت, نقشه طلای جهانی
 * 
 * وابستگی‌ها:
 * - useApp: Context برای دسترسی به currentCategory و state
 * - CardContainer: کامپوننت نمایش کارت‌ها
 * - FinancialGlobeModal: مودال کره مالی
 * - ResourcesGlobeModal: مودال کره منابع
 * - PriceModal: مودال جزئیات قیمت
 * - window.sampleData: داده‌های نمونه از vanilla JS
 * - window.initGoldMap: تابع راه‌اندازی نقشه طلا
 * 
 * عملکرد:
 * - نمایش Highlights (دسته‌بندی‌ها: خانه، رمزارز، ارز، طلا، فارکس، بورس، نفت)
 * - فیلتر کردن کارت‌ها بر اساس دسته‌بندی انتخاب شده
 * - نمایش نقشه طلای جهانی (Gold Map)
 * - باز کردن مودال‌های کره‌ها و قیمت
 * 
 * تاریخ ایجاد: 2025-12-06
 * آخرین بروزرسانی: 2025-12-06
 */

import React, { useState, useEffect } from 'react'
import { useApp } from '../../contexts/AppContext'
import { addEventListener, removeEventListener, events } from '../../utils/dom-bridge'
import CardContainer from '../../components/Cards/CardContainer'
// Modal ها در Layout.jsx مدیریت می‌شوند - import حذف شد
// import FinancialGlobeModal from '../../components/Globes/FinancialGlobeModal' // حذف شد
// import ResourcesGlobeModal from '../../components/Globes/ResourcesGlobeModal' // حذف شد
import PriceModal from '../../components/Modals/PriceModal'
import './Home.css'

/**
 * داده‌های کارت‌های اصلی
 * 
 * این داده‌ها به عنوان fallback استفاده می‌شوند اگر window.sampleData موجود نباشد.
 * شامل: دلار آمریکا، طلای ۱۸ عیار، بیت‌کوین، شاخص بورس
 */
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

/**
 * کامپوننت Home
 * 
 * State:
 * - cards: لیست کارت‌های نمایش داده شده
 * - isFinancialGlobeOpen: وضعیت باز/بسته بودن مودال کره مالی
 * - isResourcesGlobeOpen: وضعیت باز/بسته بودن مودال کره منابع
 * - selectedPriceItem: آیتم قیمت انتخاب شده برای نمایش در مودال
 * - isPriceModalOpen: وضعیت باز/بسته بودن مودال قیمت
 * 
 * Effects:
 * - فیلتر کردن کارت‌ها بر اساس currentCategory
 * - هماهنگی با window.appState
 * - راه‌اندازی نقشه طلا (Gold Map)
 * - گوش دادن به event های باز شدن Globe Modals
 */
function Home() {
  // Hook های React
  const { currentCategory, setCategory, incrementModals } = useApp() // دسترسی به Context
  // حذف state های duplicate - این modal ها در Layout.jsx مدیریت می‌شوند
  // const [isFinancialGlobeOpen, setIsFinancialGlobeOpen] = useState(false) // حذف شد - در Layout.jsx است
  // const [isResourcesGlobeOpen, setIsResourcesGlobeOpen] = useState(false) // حذف شد - در Layout.jsx است
  const [selectedPriceItem, setSelectedPriceItem] = useState(null) // آیتم قیمت انتخاب شده
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false) // وضعیت مودال قیمت
  const [showRanking, setShowRanking] = useState(false) // کنترل نمایش رتبه‌بندی نقشه

  /**
   * Effect: تنظیم category خانه به صورت پیش‌فرض و گوش دادن به تغییرات category
   * 
   * Highlights در Layout.jsx مدیریت می‌شوند - این effect فقط category را تنظیم می‌کند
   */
  useEffect(() => {
    // تنظیم category خانه به صورت پیش‌فرض
    setCategory('home')
    
    // گوش دادن به تغییرات category از Header
    const handleCategoryChange = (event) => {
      const newCategory = event.detail?.category || 'home'
      setCategory(newCategory)
    }
    
    addEventListener(events.categoryChanged, handleCategoryChange)
    
    return () => {
      removeEventListener(events.categoryChanged, handleCategoryChange)
    }
  }, []) // فقط یک بار هنگام mount

  /**
   * Effect: هماهنگی با appState
   */
  useEffect(() => {
    // هماهنگی با appState
    if (typeof window !== 'undefined' && window.appState) {
      window.appState.currentCategory = currentCategory
    }
  }, [currentCategory])

  /**
   * تولید کارت‌ها بر اساس دسته‌بندی
   * استفاده از useMemo برای جلوگیری از re-render غیرضروری
   */
  const cards = React.useMemo(() => {
    // دریافت داده‌ها بر اساس category
    let categoryCards = mainItems // پیش‌فرض - همیشه mainItems را نمایش بده
    
    // اگر sampleData موجود است و category داده دارد، از آن استفاده کن
    if (typeof window !== 'undefined' && window.sampleData && window.sampleData[currentCategory]) {
      const categoryData = window.sampleData[currentCategory]
      if (categoryData && Array.isArray(categoryData) && categoryData.length > 0) {
        // تبدیل به فرمت مورد نیاز - نمایش همه 10 کارت
        categoryCards = categoryData.slice(0, 10).map(item => ({
          name: item.name || item.symbol,
          symbol: item.symbol,
          price: item.price,
          change: item.change,
          chart: item.chart || (item.change >= 0 ? 'up' : 'down')
        }))
      }
    }
    
    // همیشه حداقل mainItems را نمایش بده
    if (!categoryCards || categoryCards.length === 0) {
      categoryCards = mainItems
    }
    
    return categoryCards
  }, [currentCategory])

  /**
   * Effect: راه‌اندازی نقشه طلا و هماهنگی با vanilla JS
   * 
   * این effect:
   * 1. به event های باز شدن Globe Modals گوش می‌دهد
   * 2. currentCategory را با window.appState هماهنگ می‌کند
   * 3. نقشه طلا (Gold Map) را راه‌اندازی می‌کند
   * 
   * وابستگی‌ها:
   * - window.initGoldMap: تابع راه‌اندازی نقشه طلا (از gold-map.js)
   * - window.addEventListener: برای گوش دادن به event های vanilla JS
   */
  useEffect(() => {
    // Handler های باز شدن Globe Modals در Layout.jsx مدیریت می‌شوند - حذف شدند
    // const handleFinancialGlobeOpen = () => setIsFinancialGlobeOpen(true) // حذف شد
    // const handleResourcesGlobeOpen = () => setIsResourcesGlobeOpen(true) // حذف شد
    
    if (typeof window !== 'undefined') {
      // Event listener ها در Layout.jsx هستند - حذف شدند
      // window.addEventListener('financialGlobeOpen', handleFinancialGlobeOpen) // حذف شد
      // window.addEventListener('resourcesGlobeOpen', handleResourcesGlobeOpen) // حذف شد
      
      // هماهنگی با appState برای backward compatibility
      if (window.appState) {
        window.appState.currentCategory = currentCategory
      }
    }
    
    /**
     * راه‌اندازی نقشه طلا (Gold Map)
     * 
     * این نقشه در بخش پایین صفحه خانه نمایش داده می‌شود.
     * از D3.js برای رندر کردن نقشه 2D استفاده می‌کند.
     * 
     * Delay: 1000ms برای اطمینان از آماده بودن DOM و render شدن React
     * Retry: اگر container پیدا نشد، دوباره تلاش می‌کند
     */
    if (typeof window !== 'undefined' && window.initGoldMap) {
      let retryCount = 0
      const maxRetries = 20 // افزایش تعداد تلاش‌ها
      const initMap = () => {
        const container = document.getElementById('goldMapGlass')
        if (container && container.offsetWidth > 0 && container.offsetHeight > 0) {
          // بررسی اینکه container واقعاً render شده و اندازه دارد
          try {
            window.initGoldMap()
            const log = window.logger || { info: console.log }
            log.info('✅ Gold Map initialized successfully')
          } catch (error) {
            const log = window.logger || { error: console.error }
            log.error('خطا در initGoldMap:', error)
          }
        } else if (retryCount < maxRetries) {
          // اگر container پیدا نشد یا هنوز render نشده، دوباره تلاش کن
          retryCount++
          setTimeout(initMap, 300) // کاهش تاخیر برای سریع‌تر شدن
        } else {
          const log = window.logger || { warn: console.warn }
          log.warn('⚠️ Container #goldMapGlass بعد از 20 تلاش پیدا نشد')
        }
      }
      setTimeout(initMap, 1500) // افزایش delay اولیه برای اطمینان از render شدن React
    }
    
    // Cleanup: حذف event listener ها هنگام unmount
    return () => {
      if (typeof window !== 'undefined') {
        // Event listener ها در Layout.jsx هستند - حذف شدند
        // window.removeEventListener('financialGlobeOpen', handleFinancialGlobeOpen) // حذف شد
        // window.removeEventListener('resourcesGlobeOpen', handleResourcesGlobeOpen) // حذف شد
      }
    }
  }, [currentCategory])

  /**
   * Handler: کلیک روی کارت قیمت
   * 
   * این تابع:
   * 1. بررسی می‌کند که آیا کاربر لاگین کرده است
   * 2. اگر لاگین کرده باشد، مودال جزئیات قیمت را باز می‌کند
   * 3. با کد vanilla JS هماهنگ می‌کند
   * 
   * @param {object} item - آیتم قیمت انتخاب شده
   */
  const handleCardClick = (item) => {
    // بررسی لاگین و باز کردن مودال جزئیات
    if (typeof window !== 'undefined' && window.checkLoginRequired && window.checkLoginRequired()) {
      setSelectedPriceItem(item)
      setIsPriceModalOpen(true)
      // هماهنگی با کد vanilla JS (برای backward compatibility)
      if (window.openPriceDetail) {
        window.openPriceDetail(item)
      }
    }
  }

  /**
   * Render: ساختار صفحه خانه
   * 
   * شامل:
   * 1. Globe Modals: مودال‌های کره‌های بزرگ (conditionally rendered)
   * 2. Price Modal: مودال جزئیات قیمت (conditionally rendered)
   * 3. Highlights Section: دسته‌بندی‌ها (خانه، رمزارز، ارز، طلا، فارکس، بورس، نفت)
   * 4. Main Cards Container: کارت‌های قیمت
   * 5. Gold Map Section: نقشه طلای جهانی
   */
  return (
    <div id="homeView" className="view">
      {/* مودال‌های کره‌های بزرگ در Layout.jsx مدیریت می‌شوند - حذف شدند از اینجا */}
      {/* <FinancialGlobeModal /> - حذف شد - در Layout.jsx است */}
      {/* <ResourcesGlobeModal /> - حذف شد - در Layout.jsx است */}
      
      {/* مودال جزئیات قیمت - فقط زمانی نمایش داده می‌شود که isPriceModalOpen true باشد */}
      <PriceModal
        isOpen={isPriceModalOpen}
        onClose={() => {
          setIsPriceModalOpen(false)
          setSelectedPriceItem(null)
        }}
        item={selectedPriceItem}
      />
      
      {/* Highlights در Layout.jsx قرار دارد - حذف شد */}
      
      {/* کانتینر اصلی کارت‌ها */}
      <div className="main-content" style={{ padding: '1rem', minHeight: '200px' }}>
        {cards && cards.length > 0 ? (
          <CardContainer 
            items={cards} 
            className={`home-cards ${currentCategory === 'home' ? 'home-category' : 'other-category'}`}
            onCardClick={handleCardClick}
          />
        ) : (
          <div className="loading-placeholder">
            <p>در حال بارگذاری کارت‌ها...</p>
          </div>
        )}
      </div>

      {/* بخش نقشه طلای جهانی - فقط در صفحه خانه نمایش داده می‌شود */}
      {/* این نقشه از D3.js برای رندر کردن نقشه 2D استفاده می‌کند */}
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
                <option value="population">👥 جمعیت</option>
              </select>
              <select className="year-select" id="yearFilter">
                <option value="2024">۲۰۲۴</option>
                <option value="2023">۲۰۲۳</option>
                <option value="2022">۲۰۲۲</option>
              </select>
              <button
                type="button"
                className="ranking-toggle-btn"
                onClick={() => setShowRanking(prev => !prev)}
              >
                {showRanking ? 'بستن رتبه‌بندی' : 'نمایش رتبه‌بندی'}
              </button>
              <button
                type="button"
                className="map-fullscreen-toggle"
                id="mapFullscreenToggle"
                title="تمام صفحه"
              >
                <span className="fullscreen-icon">⛶</span>
              </button>
            </div>
          </div>
          <div className="map-content-row">
            {/* نقشه و دکمه‌های Zoom */}
            <div className="map-visual-area">
            <div className="map-visualization" id="goldMapVisualization">
              <div id="goldMapGlass" className="gold-map-visual"></div>
              </div>
              <div className="map-zoom-btns">
                <button id="zoomIn" title="بزرگنمایی">+</button>
                <button id="zoomOut" title="کوچکنمایی">−</button>
                <button id="resetZoom" title="بازنشانی">⟲</button>
              </div>
            </div>
            
            {/* رتبه‌بندی و مقایسه */}
            {showRanking && (
              <div className="ranking-sidebar">
                <div className="ranking-header">
                  <span>🏆 برترین‌ها</span>
                  <span className="filter-badge" id="currentFilterBadge">ذخایر طلا</span>
                </div>
                <div className="ranking-list" id="topCountriesList">
                  {/* لیست کشورها توسط gold-map.js پر می‌شود */}
                </div>
                <button className="compare-toggle" id="compareToggle">📊 مقایسه</button>
              </div>
            )}
          </div>
          
          {/* پنل مقایسه (پنهان) */}
          <div className="compare-panel hidden" id="comparePanel">
            <div className="compare-header">
              <h4>📊 مقایسه کشورها</h4>
              <button className="close-compare" id="closeCompare">×</button>
            </div>
            <div className="compare-content" id="countryComparison">
              <p className="compare-hint">روی کشورها در نقشه کلیک کنید (حداکثر ۲)</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
