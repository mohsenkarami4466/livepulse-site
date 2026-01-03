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
import CardContainer from '../../components/Cards/CardContainer'
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
        
      }, 100)
    }
  }, []) // فقط یک بار هنگام mount

  /**
   * تولید 10 کارت placeholder برای هر دسته‌بندی
   * استفاده از useMemo برای جلوگیری از re-render غیرضروری
   */
  const cards = React.useMemo(() => {
    return Array.from({ length: 10 }, (_, index) => ({
      name: `محتوا ${index + 1}`,
      symbol: `${activeCategory}-${index + 1}`,
      price: 0,
      change: 0,
      chart: 'up',
      isPlaceholder: true,
      placeholderText: 'در حال توسعه'
    }))
  }, [activeCategory])

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
      
    }
  }

  return (
    <div id="newsView" className="view">
      {/* Highlights در Layout.jsx قرار دارد - حذف شد */}

      {/* News Cards Container */}
      <div className="main-content" style={{ padding: '1rem', minHeight: '200px' }}>
        <CardContainer 
          items={cards} 
          className={`news-cards`}
        />
      </div>
    </div>
  )
}

export default News
