/**
 * ============================================
 * 🧘 صفحه آرامش - Relax.jsx
 * ============================================
 * 
 * این کامپوننت صفحه آرامش را نمایش می‌دهد.
 * شامل: Highlights (دسته‌بندی‌های آرامش), پنل‌های آرامش, دکمه‌های 3D
 * 
 * وابستگی‌ها:
 * - window.setupHighlightPanels: تابع راه‌اندازی Highlights (از script-ui.js)
 * - window.setup3DGlobeButtons: تابع راه‌اندازی دکمه‌های 3D (از script-ui.js)
 * 
 * عملکرد:
 * - نمایش Highlights (دسته‌بندی‌های آرامش: ADHD, موزیک, بازی, 3D, مدیتیشن, تنفس, روانشناسی)
 * - نمایش پنل‌های آرامش بر اساس دسته‌بندی انتخاب شده
 * - راه‌اندازی دکمه‌های 3D برای باز کردن کره‌های 3D
 * 
 * تاریخ ایجاد: 2025-12-06
 * آخرین بروزرسانی: 2025-12-06
 */

import React, { useState, useEffect } from 'react'
import './Relax.css'

/**
 * لیست دسته‌بندی‌های آرامش
 * 
 * هر دسته‌بندی شامل:
 * - id: شناسه دسته‌بندی
 * - name: نام فارسی
 * - icon: آیکون emoji
 */
const relaxCategories = [
  { id: 'adhd', name: 'ADHD', icon: '🧠' },
  { id: 'music', name: 'موزیک', icon: '🎵' },
  { id: 'game', name: 'بازی', icon: '🎮' },
  { id: '3d', name: '3D', icon: '🌍' },
  { id: 'meditation', name: 'مدیتیشن', icon: '🧘' },
  { id: 'breathing', name: 'تنفس', icon: '💨' },
  { id: 'psychology', name: 'روانشناسی', icon: '🧠' }
]

/**
 * کامپوننت Relax
 * 
 * State:
 * - activeCategory: دسته‌بندی فعال (adhd, music, game, 3d, ...)
 * 
 * Effects:
 * - راه‌اندازی Highlights با vanilla JS
 * - راه‌اندازی دکمه‌های 3D (وقتی پنل 3D فعال می‌شود)
 */
function Relax() {
  // State محلی - اولین هایلایت (adhd) به صورت پیش‌فرض فعال
  const [activeCategory, setActiveCategory] = useState('adhd') // دسته‌بندی فعال

  /**
   * Effect: تنظیم اولین هایلایت به صورت پیش‌فرض
   */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        const firstCircle = document.querySelector('.highlight-circle[data-relax="adhd"]')
        if (firstCircle) {
          firstCircle.classList.add('active')
        }
        const firstPanel = document.querySelector('.relax-panel[data-relax-panel="adhd"]')
        if (firstPanel) {
          firstPanel.classList.add('active')
        }
      }, 100)
    }
  }, [])

  /**
   * Effect: راه‌اندازی Highlights و دکمه‌های 3D - فقط یک بار
   * 
   * این effect:
   * 1. Highlights را با vanilla JS راه‌اندازی می‌کند (فقط یک بار)
   * 2. دکمه‌های 3D را راه‌اندازی می‌کند (اگر پنل 3D فعال باشد)
   */
  useEffect(() => {
    // راه‌اندازی highlight panels برای هماهنگی با vanilla JS - فقط یک بار
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        try {
          // استفاده از تابع موجود در script-ui.js
          // این تابع event listener ها را برای Highlights اضافه می‌کند
          // فقط یک بار فراخوانی می‌شود تا از duplicate listener ها جلوگیری شود
          if (typeof window.setupHighlightPanels === 'function') {
            window.setupHighlightPanels('.highlight-circle[data-relax]', 'data-relax', '.relax-panel', 'data-relax-panel')
          }
        } catch (error) {
          const log = window.logger || { error: console.error }
          log.error('❌ خطا در راه‌اندازی highlight panels:', error)
        }
      }, 100)
    }
  }, []) // فقط یک بار هنگام mount
  
  /**
   * Effect: راه‌اندازی دکمه‌های 3D - فقط وقتی پنل 3D فعال می‌شود
   */
  useEffect(() => {
    if (activeCategory === '3d' && typeof window !== 'undefined') {
      setTimeout(() => {
        if (typeof window.setup3DGlobeButtons === 'function') {
          window.setup3DGlobeButtons()
        }
      }, 300)
    }
  }, [activeCategory])

  /**
   * Handler: کلیک روی دسته‌بندی
   * 
   * این تابع:
   * 1. activeCategory را به‌روزرسانی می‌کند
   * 2. Highlights را با vanilla JS هماهنگ می‌کند
   * 3. پنل مربوطه را فعال می‌کند
   * 4. اگر پنل 3D فعال شد، دکمه‌های 3D را راه‌اندازی می‌کند
   * 
   * @param {string} categoryId - شناسه دسته‌بندی
   */
  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId)
    
    // هماهنگی با vanilla JS - با تاخیر برای اطمینان از render شدن
    setTimeout(() => {
    if (typeof window !== 'undefined') {
      // فعال کردن highlight circle
      const circles = document.querySelectorAll('.highlight-circle[data-relax]')
      circles.forEach(circle => {
          const circleCategory = circle.getAttribute('data-relax')
          if (circleCategory === categoryId) {
          circle.classList.add('active')
        } else {
          circle.classList.remove('active')
        }
      })
      
      // فعال کردن panel - با تاخیر بیشتر برای اطمینان از render شدن
        setTimeout(() => {
          const panels = document.querySelectorAll('.relax-panel[data-relax-panel]')
          panels.forEach(panel => {
            const panelCategory = panel.getAttribute('data-relax-panel')
            if (panelCategory === categoryId) {
              panel.classList.add('active')
            } else {
              panel.classList.remove('active')
            }
          })
        }, 100)
      
      // اگر پنل 3D فعال شد، دکمه‌های 3D را راه‌اندازی کن
      if (categoryId === '3d' && typeof window.setup3DGlobeButtons === 'function') {
        setTimeout(() => {
          window.setup3DGlobeButtons()
        }, 300)
      }
    }
    }, 50)
  }

  return (
    <div id="relaxView" className="view">
      {/* Highlights Section */}
      <section className="highlights-section relax-highlights">
        <div className="highlights-container">
          {relaxCategories.map((category) => (
            <div
              key={category.id}
              className={`highlight-circle ${activeCategory === category.id ? 'active' : ''}`}
              data-relax={category.id}
              onClick={() => handleCategoryClick(category.id)}
            >
              <span>{category.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Relax Container */}
      <div className="relax-container">
        <div className="relax-highlight-panels">
          <article className={`relax-panel ${activeCategory === 'adhd' ? 'active' : ''}`} data-relax-panel="adhd">
            <h4>روتین نظم‌دهی ADHD</h4>
            <p className="panel-placeholder">در حال توسعه</p>
          </article>
          <article className={`relax-panel ${activeCategory === 'music' ? 'active' : ''}`} data-relax-panel="music">
            <h4>پلی‌لیست موزیک آرام</h4>
            <p className="panel-placeholder">در حال توسعه</p>
          </article>
          <article className={`relax-panel ${activeCategory === 'game' ? 'active' : ''}`} data-relax-panel="game">
            <h4>مینى گیم‌های ذهنی</h4>
            <p className="panel-placeholder">در حال توسعه</p>
          </article>
          <article className={`relax-panel ${activeCategory === '3d' ? 'active' : ''}`} data-relax-panel="3d">
            <h4>🌍 تجربه سه‌بعدی جهان</h4>
            <p className="panel-placeholder">در حال توسعه</p>
            {/* دکمه‌های 3D Globe در اینجا قرار می‌گیرند */}
            <div className="3d-globe-buttons-container">
              {/* دکمه‌ها توسط vanilla JS اضافه می‌شوند */}
            </div>
          </article>
          <article className={`relax-panel ${activeCategory === 'meditation' ? 'active' : ''}`} data-relax-panel="meditation">
            <h4>مدیتیشن</h4>
            <p className="panel-placeholder">در حال توسعه</p>
          </article>
          <article className={`relax-panel ${activeCategory === 'breathing' ? 'active' : ''}`} data-relax-panel="breathing">
            <h4>تنفس</h4>
            <p className="panel-placeholder">در حال توسعه</p>
          </article>
          <article className={`relax-panel ${activeCategory === 'psychology' ? 'active' : ''}`} data-relax-panel="psychology">
            <h4>روانشناسی معامله‌گری</h4>
            <p className="panel-placeholder">در حال توسعه</p>
          </article>
        </div>
      </div>
    </div>
  )
}

export default Relax
