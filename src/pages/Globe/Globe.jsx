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
        
        // فعال کردن panel اول
        const firstPanel = document.querySelector('.globe-panel[data-globe-panel="resources"]')
        if (firstPanel) {
          firstPanel.classList.add('active')
        }
      }, 100)
    }
  }, []) // فقط یک بار هنگام mount

  /**
   * Effect: راه‌اندازی Highlights و نقشه‌های 2D
   * 
   * این effect:
   * 1. Highlights را با vanilla JS راه‌اندازی می‌کند
   * 2. نقشه‌های 2D را راه‌اندازی می‌کند
   * 3. event listener ها برای دکمه‌های کره‌ها را تنظیم می‌کند
   */
  useEffect(() => {
    // راه‌اندازی highlight panels برای هماهنگی با vanilla JS
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        try {
          // استفاده از تابع موجود در script-ui.js
          // این تابع event listener ها را برای Highlights اضافه می‌کند
          if (typeof window.setupHighlightPanels === 'function') {
            window.setupHighlightPanels('.highlight-circle[data-globe]', 'data-globe', '.globe-panel', 'data-globe-panel')
          }
          
          /**
           * راه‌اندازی نقشه‌های 2D
           * 
           * این تابع نقشه‌های 2D را در هر پنل راه‌اندازی می‌کند.
           * از D3.js برای رندر کردن نقشه‌ها استفاده می‌کند.
           */
          if (typeof window.setupGlobe2DMaps === 'function') {
            window.setupGlobe2DMaps()
          }
          
          // راه‌اندازی event listeners برای دکمه‌های کره‌ها
          // این در script-ui.js انجام می‌شود با event delegation
        } catch (error) {
          const log = window.logger || { error: console.error }
          log.error('❌ خطا در راه‌اندازی Globe page:', error)
        }
      }, 100)
    }
  }, [])

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
      
      // فعال کردن panel
      const panels = document.querySelectorAll('.globe-panel')
      panels.forEach(panel => {
        if (panel.getAttribute('data-globe-panel') === globeId) {
          panel.classList.add('active')
        } else {
          panel.classList.remove('active')
        }
      })
    }
  }

  /**
   * Handler: کلیک روی دکمه باز کردن کره 3D
   * 
   * این تابع:
   * 1. action را به globeType تبدیل می‌کند
   * 2. تابع open3DGlobe از vanilla JS را فراخوانی می‌کند
   * 3. کره 3D مربوطه را باز می‌کند
   * 
   * @param {string} action - شناسه action (open-resources, open-weather, ...)
   */
  const handleGlobeAction = (action) => {
    // هماهنگی با vanilla JS برای باز کردن کره‌ها
    if (typeof window !== 'undefined') {
      // کره منابع و مالی از توابع جداگانه استفاده می‌کنند
      if (action === 'open-resources') {
        // باز کردن کره منابع با openResourcesGlobe
        if (typeof window.openResourcesGlobe === 'function') {
          window.openResourcesGlobe()
        } else {
          const log = window.logger || { error: console.error }
          log.error('❌ تابع openResourcesGlobe پیدا نشد!')
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
        // باز کردن کره 3D مربوطه
        window.open3DGlobe(globeType)
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

      {/* Globe Container */}
      <div className="globe-container-view">
        <div className="globe-highlight-panels">
          {/* Resources Globe Panel */}
          <article className={`globe-panel ${activeGlobe === 'resources' ? 'active' : ''}`} data-globe-panel="resources">
            <h4>🌍 کره منابع کشورها</h4>
            <p className="panel-description">نمایش اطلاعات منابع طبیعی کشورهای جهان شامل طلا، نفت، گاز و سایر منابع</p>
            <button 
              className="globe-open-btn" 
              data-globe-action="open-resources"
              onClick={() => handleGlobeAction('open-resources')}
            >
              <span className="btn-icon">🌐</span>
              <span className="btn-text">باز کردن کره منابع</span>
            </button>
            {/* نقشه 2D برای این هایلایت */}
            <div className="globe-panel-2d-map" data-globe-type="resources">
              <div className="map-2d-controls">
                <button className="map-fullscreen-btn" data-map-id="resources-map" title="تمام صفحه">
                  <span>⛶</span>
                </button>
                <button className="map-to-3d-btn" data-globe-type="resources" title="باز کردن کره 3D">
                  <span>🌐</span>
                </button>
              </div>
              <div id="resourcesMap2D" className="globe-2d-map-container"></div>
            </div>
          </article>

          {/* Weather Globe Panel */}
          <article className={`globe-panel ${activeGlobe === 'weather' ? 'active' : ''}`} data-globe-panel="weather">
            <h4>🌤️ کره آب و هوا</h4>
            <p className="panel-description">نمایش اطلاعات آب و هوای شهرهای مختلف جهان</p>
            <button 
              className="globe-open-btn" 
              data-globe-action="open-weather"
              onClick={() => handleGlobeAction('open-weather')}
            >
              <span className="btn-icon">🌤️</span>
              <span className="btn-text">باز کردن کره آب و هوا</span>
            </button>
            <div className="globe-panel-2d-map" data-globe-type="weather">
              <div className="map-2d-controls">
                <button className="map-fullscreen-btn" data-map-id="weather-map" title="تمام صفحه">
                  <span>⛶</span>
                </button>
                <button className="map-to-3d-btn" data-globe-type="weather" title="باز کردن کره 3D">
                  <span>🌐</span>
                </button>
              </div>
              <div id="weatherMap2D" className="globe-2d-map-container"></div>
            </div>
          </article>

          {/* Military Globe Panel */}
          <article className={`globe-panel ${activeGlobe === 'military' ? 'active' : ''}`} data-globe-panel="military">
            <h4>⚔️ کره نظامی و جنگ‌ها</h4>
            <p className="panel-description">نمایش اطلاعات نظامی و مناطق جنگی جهان</p>
            <button 
              className="globe-open-btn" 
              data-globe-action="open-military"
              onClick={() => handleGlobeAction('open-military')}
            >
              <span className="btn-icon">⚔️</span>
              <span className="btn-text">باز کردن کره نظامی</span>
            </button>
            <div className="globe-panel-2d-map" data-globe-type="military">
              <div className="map-2d-controls">
                <button className="map-fullscreen-btn" data-map-id="military-map" title="تمام صفحه">
                  <span>⛶</span>
                </button>
                <button className="map-to-3d-btn" data-globe-type="military" title="باز کردن کره 3D">
                  <span>🌐</span>
                </button>
              </div>
              <div id="militaryMap2D" className="globe-2d-map-container"></div>
            </div>
          </article>

          {/* Universities Globe Panel */}
          <article className={`globe-panel ${activeGlobe === 'universities' ? 'active' : ''}`} data-globe-panel="universities">
            <h4>🎓 کره دانشگاه‌ها</h4>
            <p className="panel-description">نمایش موقعیت دانشگاه‌های معتبر جهان</p>
            <button 
              className="globe-open-btn" 
              data-globe-action="open-universities"
              onClick={() => handleGlobeAction('open-universities')}
            >
              <span className="btn-icon">🎓</span>
              <span className="btn-text">باز کردن کره دانشگاه‌ها</span>
            </button>
            <div className="globe-panel-2d-map" data-globe-type="universities">
              <div className="map-2d-controls">
                <button className="map-fullscreen-btn" data-map-id="universities-map" title="تمام صفحه">
                  <span>⛶</span>
                </button>
                <button className="map-to-3d-btn" data-globe-type="universities" title="باز کردن کره 3D">
                  <span>🌐</span>
                </button>
              </div>
              <div id="universitiesMap2D" className="globe-2d-map-container"></div>
            </div>
          </article>

          {/* Historical Globe Panel */}
          <article className={`globe-panel ${activeGlobe === 'historical' ? 'active' : ''}`} data-globe-panel="historical">
            <h4>🏛️ کره مکان‌های تاریخی</h4>
            <p className="panel-description">نمایش مکان‌های تاریخی و میراث فرهنگی جهان</p>
            <button 
              className="globe-open-btn" 
              data-globe-action="open-historical"
              onClick={() => handleGlobeAction('open-historical')}
            >
              <span className="btn-icon">🏛️</span>
              <span className="btn-text">باز کردن کره تاریخی</span>
            </button>
            <div className="globe-panel-2d-map" data-globe-type="historical">
              <div className="map-2d-controls">
                <button className="map-fullscreen-btn" data-map-id="historical-map" title="تمام صفحه">
                  <span>⛶</span>
                </button>
                <button className="map-to-3d-btn" data-globe-type="historical" title="باز کردن کره 3D">
                  <span>🌐</span>
                </button>
              </div>
              <div id="historicalMap2D" className="globe-2d-map-container"></div>
            </div>
          </article>

          {/* Earthquake Globe Panel */}
          <article className={`globe-panel ${activeGlobe === 'earthquake' ? 'active' : ''}`} data-globe-panel="earthquake">
            <h4>🌋 کره زلزله‌های دنیا</h4>
            <p className="panel-description">نمایش اطلاعات زلزله‌های ثبت شده در جهان</p>
            <button 
              className="globe-open-btn" 
              data-globe-action="open-earthquake"
              onClick={() => handleGlobeAction('open-earthquake')}
            >
              <span className="btn-icon">🌋</span>
              <span className="btn-text">باز کردن کره زلزله</span>
            </button>
            <div className="globe-panel-2d-map" data-globe-type="earthquake">
              <div className="map-2d-controls">
                <button className="map-fullscreen-btn" data-map-id="earthquake-map" title="تمام صفحه">
                  <span>⛶</span>
                </button>
                <button className="map-to-3d-btn" data-globe-type="earthquake" title="باز کردن کره 3D">
                  <span>🌐</span>
                </button>
              </div>
              <div id="earthquakeMap2D" className="globe-2d-map-container"></div>
            </div>
          </article>

          {/* Natural Resources Globe Panel */}
          <article className={`globe-panel ${activeGlobe === 'natural-resources' ? 'active' : ''}`} data-globe-panel="natural-resources">
            <h4>🌿 کره منابع طبیعی</h4>
            <p className="panel-description">نمایش منابع طبیعی و معادن جهان</p>
            <button 
              className="globe-open-btn" 
              data-globe-action="open-natural-resources"
              onClick={() => handleGlobeAction('open-natural-resources')}
            >
              <span className="btn-icon">🌿</span>
              <span className="btn-text">باز کردن کره منابع طبیعی</span>
            </button>
            <div className="globe-panel-2d-map" data-globe-type="natural-resources">
              <div className="map-2d-controls">
                <button className="map-fullscreen-btn" data-map-id="natural-resources-map" title="تمام صفحه">
                  <span>⛶</span>
                </button>
                <button className="map-to-3d-btn" data-globe-type="natural-resources" title="باز کردن کره 3D">
                  <span>🌐</span>
                </button>
              </div>
              <div id="naturalResourcesMap2D" className="globe-2d-map-container"></div>
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}

export default Globe
