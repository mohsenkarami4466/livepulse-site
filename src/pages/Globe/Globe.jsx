/**
 * ============================================
 * 🌍 صفحه کره‌ها - Globe.jsx
 * ============================================
 * 
 * این کامپوننت صفحه کره‌ها را نمایش می‌دهد.
 * شامل: Highlights (دسته‌بندی‌های کره‌ها), پنل‌های کره‌ها, نقشه‌های 2D, دکمه‌های 3D
 * 
 * وابستگی‌ها:
 * - window.setupHighlightPanels: تابع راه‌اندازی Highlights (از script-ui.js)
 * - window.setupGlobe2DMaps: تابع راه‌اندازی نقشه‌های 2D (از globe-2d-maps.js)
 * - window.open3DGlobe: تابع باز کردن کره‌های 3D (از script-globes.js)
 * 
 * عملکرد:
 * - نمایش Highlights (دسته‌بندی‌های کره‌ها: منابع، آب و هوا، نظامی، دانشگاه‌ها، تاریخی، زلزله، منابع طبیعی)
 * - نمایش پنل‌های کره‌ها بر اساس دسته‌بندی انتخاب شده
 * - راه‌اندازی نقشه‌های 2D در هر پنل
 * - باز کردن کره‌های 3D با کلیک روی دکمه‌ها
 * 
 * تاریخ ایجاد: 2025-12-06
 * آخرین بروزرسانی: 2025-12-06
 */

import React, { useState, useEffect } from 'react'
import CardContainer from '../../components/Cards/CardContainer'
import './Globe.css'

/**
 * لیست دسته‌بندی‌های کره‌ها
 * 
 * هر دسته‌بندی شامل:
 * - id: شناسه دسته‌بندی
 * - name: نام فارسی
 * - icon: آیکون emoji
 */
const globeCategories = [
  { id: 'resources', name: 'منابع کشورها', icon: '🌍' },
  { id: 'weather', name: 'آب و هوا', icon: '🌤️' },
  { id: 'military', name: 'نظامی', icon: '⚔️' },
  { id: 'universities', name: 'دانشگاه‌ها', icon: '🎓' },
  { id: 'historical', name: 'تاریخی', icon: '🏛️' },
  { id: 'earthquake', name: 'زلزله', icon: '🌋' },
  { id: 'natural-resources', name: 'منابع طبیعی', icon: '🌿' }
]

/**
 * کامپوننت Globe
 * 
 * State:
 * - activeGlobe: کره فعال (resources, weather, military, ...)
 * 
 * Effects:
 * - راه‌اندازی Highlights با vanilla JS
 * - راه‌اندازی نقشه‌های 2D
 */
function Globe() {
  // State محلی - اولین هایلایت (resources) به صورت پیش‌فرض فعال
  const [activeGlobe, setActiveGlobe] = useState('resources') // کره فعال

  /**
   * Effect: تنظیم اولین هایلایت به صورت پیش‌فرض
   * 
   * این effect:
   * 1. هنگام mount شدن صفحه، اولین هایلایت (resources) را فعال می‌کند
   */
  useEffect(() => {
    // هماهنگی با vanilla JS
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        // فعال کردن highlight circle اول
        const firstCircle = document.querySelector('.highlight-circle[data-globe="resources"]')
        if (firstCircle) {
          firstCircle.classList.add('active')
        }
        
      }, 100)
    }
  }, []) // فقط یک بار هنگام mount

  /**
   * تولید 10 کارت برای هر دسته‌بندی کره
   * کارت اول: دکمه باز کردن کره 3D
   * کارت‌های 2-10: placeholder
   * استفاده از useMemo برای جلوگیری از re-render غیرضروری
   */
  const cards = React.useMemo(() => {
    const cards = []
    
    // کارت اول: دکمه باز کردن کره 3D
    const firstCardAction = activeGlobe === 'resources' ? 'open-resources' : `open-${activeGlobe}`
    cards.push({
      name: globeCategories.find(c => c.id === activeGlobe)?.name || 'کره',
      symbol: `${activeGlobe}-globe`,
      price: 0,
      change: 0,
      chart: 'up',
      isGlobeButton: true,
      globeAction: firstCardAction,
      globeId: activeGlobe
    })
    
    // کارت‌های 2-10: placeholder
    for (let i = 2; i <= 10; i++) {
      cards.push({
        name: `محتوا ${i - 1}`,
        symbol: `${activeGlobe}-${i}`,
        price: 0,
        change: 0,
        chart: 'up',
        isPlaceholder: true,
        placeholderText: 'در حال توسعه'
      })
    }
    
    return cards
  }, [activeGlobe])

  /**
   * Handler: کلیک روی دسته‌بندی کره
   * 
   * این تابع:
   * 1. activeGlobe را به‌روزرسانی می‌کند
   * 2. Highlights را با vanilla JS هماهنگ می‌کند
   * 3. پنل مربوطه را فعال می‌کند
   * 
   * @param {string} globeId - شناسه کره
   */
  const handleGlobeClick = (globeId) => {
    setActiveGlobe(globeId)
    
    // هماهنگی با vanilla JS
    if (typeof window !== 'undefined') {
      // فعال کردن highlight circle
      const circles = document.querySelectorAll('.highlight-circle[data-globe]')
      circles.forEach(circle => {
        if (circle.getAttribute('data-globe') === globeId) {
          circle.classList.add('active')
        } else {
          circle.classList.remove('active')
        }
      })
      
    }
  }

  /**
   * Handler: کلیک روی کارت کره
   */
  const handleCardClick = (item) => {
    if (item.isGlobeButton && item.globeAction) {
      // باز کردن کره 3D
      const action = item.globeAction
      
      if (typeof window !== 'undefined') {
        // کره منابع از تابع جداگانه استفاده می‌کند
        if (action === 'open-resources') {
          if (typeof window.openResourcesGlobe === 'function') {
            window.openResourcesGlobe()
          }
          return
        }
        
        // سایر کره‌ها از open3DGlobe استفاده می‌کنند
        const actionToType = {
          'open-weather': 'weather',
          'open-military': 'military',
          'open-universities': 'universities',
          'open-historical': 'historical',
          'open-earthquake': 'earthquake',
          'open-natural-resources': 'natural-resources'
        }
        
        const globeType = actionToType[action]
        if (globeType && typeof window.open3DGlobe === 'function') {
          window.open3DGlobe(globeType)
        }
      }
    }
  }

  return (
    <div id="globeView" className="view">
      {/* Highlights Section */}
      <section className="highlights-section globe-highlights">
        <div className="highlights-container">
          {globeCategories.map((category) => (
            <div
              key={category.id}
              className={`highlight-circle ${activeGlobe === category.id ? 'active' : ''}`}
              data-globe={category.id}
              onClick={() => handleGlobeClick(category.id)}
            >
              <span>{category.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Globe Cards Container */}
      <main className="main-content" style={{ padding: '1rem', minHeight: '200px' }}>
        <CardContainer 
          items={cards} 
          className={`globe-cards`}
          onCardClick={handleCardClick}
        />
      </main>
    </div>
  )
}

export default Globe
