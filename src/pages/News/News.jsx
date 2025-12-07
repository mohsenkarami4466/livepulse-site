/**
 * ============================================
 * 📰 صفحه اخبار - News.jsx
 * ============================================
 * 
 * این کامپوننت صفحه اخبار را نمایش می‌دهد.
 * شامل: Highlights (دسته‌بندی‌های اخبار), پنل‌های اخبار
 * 
 * وابستگی‌ها:
 * - window.setupHighlightPanels: تابع راه‌اندازی Highlights (از script-ui.js)
 * 
 * عملکرد:
 * - نمایش Highlights (دسته‌بندی‌های اخبار: همه، فارکس، رمزارز، بورس ایران، جهانی، کالاها، اقتصاد)
 * - نمایش پنل‌های اخبار بر اساس دسته‌بندی انتخاب شده
 * - راه‌اندازی Highlights با vanilla JS
 * 
 * تاریخ ایجاد: 2025-12-06
 * آخرین بروزرسانی: 2025-12-06
 */

import React, { useState, useEffect } from 'react'
import './News.css'

/**
 * لیست دسته‌بندی‌های اخبار
 * 
 * هر دسته‌بندی شامل:
 * - id: شناسه دسته‌بندی
 * - name: نام فارسی
 * - icon: آیکون emoji
 */
const newsCategories = [
  { id: 'all', name: 'همه', icon: '📰' },
  { id: 'forex', name: 'فارکس', icon: '💱' },
  { id: 'crypto', name: 'رمزارز', icon: '₿' },
  { id: 'iran-stock', name: 'بورس ایران', icon: '🇮🇷' },
  { id: 'global-stock', name: 'جهانی', icon: '🌍' },
  { id: 'commodities', name: 'کالاها', icon: '🛢️' },
  { id: 'macro', name: 'اقتصاد', icon: '📊' }
]

/**
 * کامپوننت News
 * 
 * State:
 * - activeCategory: دسته‌بندی فعال (all, forex, crypto, ...)
 * 
 * Effects:
 * - راه‌اندازی Highlights با vanilla JS
 */
function News() {
  // State محلی - اولین هایلایت (all) به صورت پیش‌فرض فعال
  const [activeCategory, setActiveCategory] = useState('all') // دسته‌بندی فعال

  /**
   * Effect: تنظیم اولین هایلایت به صورت پیش‌فرض
   * 
   * این effect:
   * 1. هنگام mount شدن صفحه، اولین هایلایت (all) را فعال می‌کند
   */
  useEffect(() => {
    // هماهنگی با vanilla JS
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        // فعال کردن highlight circle اول
        const firstCircle = document.querySelector('.highlight-circle[data-news="all"]')
        if (firstCircle) {
          firstCircle.classList.add('active')
        }
        
        // فعال کردن panel اول
        const firstPanel = document.querySelector('.news-panel[data-news-panel="all"]')
        if (firstPanel) {
          firstPanel.classList.add('active')
        }
      }, 100)
    }
  }, []) // فقط یک بار هنگام mount

  /**
   * Effect: راه‌اندازی Highlights
   * 
   * این effect:
   * 1. منتظر می‌ماند تا DOM render شود
   * 2. تابع setupHighlightPanels از vanilla JS را فراخوانی می‌کند
   * 3. Highlights را با پنل‌های اخبار هماهنگ می‌کند
   */
  useEffect(() => {
    // راه‌اندازی highlight panels برای هماهنگی با vanilla JS
    if (typeof window !== 'undefined' && window.setupHighlightPanels) {
      // تاخیر برای اطمینان از render شدن DOM
      setTimeout(() => {
        try {
          // استفاده از تابع موجود در script-ui.js
          // این تابع event listener ها را برای Highlights اضافه می‌کند
          const setupHighlightPanels = window.setupHighlightPanels
          if (typeof setupHighlightPanels === 'function') {
            setupHighlightPanels('.highlight-circle[data-news]', 'data-news', '.news-panel', 'data-news-panel')
          }
        } catch (error) {
          const log = window.logger || { error: console.error }
          log.error('❌ خطا در راه‌اندازی highlight panels:', error)
        }
      }, 100)
    }
  }, [])

  /**
   * Handler: کلیک روی دسته‌بندی
   * 
   * این تابع:
   * 1. activeCategory را به‌روزرسانی می‌کند
   * 2. Highlights را با vanilla JS هماهنگ می‌کند
   * 3. پنل مربوطه را فعال می‌کند
   * 
   * @param {string} categoryId - شناسه دسته‌بندی
   */
  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId)
    
    // هماهنگی با vanilla JS
    if (typeof window !== 'undefined') {
      // فعال کردن highlight circle
      const circles = document.querySelectorAll('.highlight-circle[data-news]')
      circles.forEach(circle => {
        if (circle.getAttribute('data-news') === categoryId) {
          circle.classList.add('active')
        } else {
          circle.classList.remove('active')
        }
      })
      
      // فعال کردن panel
      const panels = document.querySelectorAll('.news-panel')
      panels.forEach(panel => {
        if (panel.getAttribute('data-news-panel') === categoryId) {
          panel.classList.add('active')
        } else {
          panel.classList.remove('active')
        }
      })
    }
  }

  return (
    <div id="newsView" className="view">
      {/* Highlights Section */}
      <section className="highlights-section news-highlights">
        <div className="highlights-container">
          {newsCategories.map((category) => (
            <div
              key={category.id}
              className={`highlight-circle ${activeCategory === category.id ? 'active' : ''}`}
              data-news={category.id}
              onClick={() => handleCategoryClick(category.id)}
            >
              <span>{category.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* News Container */}
      <div className="news-container">
        <div className="news-highlight-panels">
          <div className={`news-panel ${activeCategory === 'all' ? 'active' : ''}`} data-news-panel="all">
            <h4>📰 همه اخبار</h4>
            <p className="panel-placeholder">در حال توسعه</p>
          </div>
          <div className={`news-panel ${activeCategory === 'forex' ? 'active' : ''}`} data-news-panel="forex">
            <h4>💱 اخبار فارکس</h4>
            <p className="panel-placeholder">در حال توسعه</p>
          </div>
          <div className={`news-panel ${activeCategory === 'crypto' ? 'active' : ''}`} data-news-panel="crypto">
            <h4>₿ اخبار رمزارز</h4>
            <p className="panel-placeholder">در حال توسعه</p>
          </div>
          <div className={`news-panel ${activeCategory === 'iran-stock' ? 'active' : ''}`} data-news-panel="iran-stock">
            <h4>🇮🇷 اخبار بورس ایران</h4>
            <p className="panel-placeholder">در حال توسعه</p>
          </div>
          <div className={`news-panel ${activeCategory === 'global-stock' ? 'active' : ''}`} data-news-panel="global-stock">
            <h4>🌍 بازارهای جهانی</h4>
            <p className="panel-placeholder">در حال توسعه</p>
          </div>
          <div className={`news-panel ${activeCategory === 'commodities' ? 'active' : ''}`} data-news-panel="commodities">
            <h4>🛢️ اخبار کالاها</h4>
            <p className="panel-placeholder">در حال توسعه</p>
          </div>
          <div className={`news-panel ${activeCategory === 'macro' ? 'active' : ''}`} data-news-panel="macro">
            <h4>📊 اقتصاد کلان</h4>
            <p className="panel-placeholder">در حال توسعه</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default News
