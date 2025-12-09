/**
 * ============================================
 * 📚 صفحه آموزش - Tutorial.jsx
 * ============================================
 * 
 * این کامپوننت صفحه آموزش را نمایش می‌دهد.
 * شامل: Highlights (دسته‌بندی‌های آموزش), پنل‌های آموزشی
 * 
 * وابستگی‌ها:
 * - window.setupHighlightPanels: تابع راه‌اندازی Highlights (از script-ui.js)
 * 
 * عملکرد:
 * - نمایش Highlights (دسته‌بندی‌های آموزش: مبانی، تکنیکال، فاندامنتال، کریپتو، فارکس، ریسک، استراتژی)
 * - نمایش پنل‌های آموزشی بر اساس دسته‌بندی انتخاب شده
 * - راه‌اندازی Highlights با vanilla JS
 * 
 * تاریخ ایجاد: 2025-12-06
 * آخرین بروزرسانی: 2025-12-06
 */

import React, { useState, useEffect } from 'react'
import CardContainer from '../../components/Cards/CardContainer'
import './Tutorial.css'

/**
 * لیست دسته‌بندی‌های آموزش
 * 
 * هر دسته‌بندی شامل:
 * - id: شناسه دسته‌بندی
 * - name: نام فارسی
 * - icon: آیکون emoji
 */
const educationCategories = [
  { id: 'basics', name: 'مبانی', icon: '📚' },
  { id: 'technical', name: 'تکنیکال', icon: '📈' },
  { id: 'fundamental', name: 'فاندامنتال', icon: '📊' },
  { id: 'crypto', name: 'کریپتو', icon: '₿' },
  { id: 'forex', name: 'فارکس', icon: '💱' },
  { id: 'risk', name: 'ریسک', icon: '⚠️' },
  { id: 'strategy', name: 'استراتژی', icon: '🎯' }
]

/**
 * کامپوننت Tutorial
 * 
 * State:
 * - activeCategory: دسته‌بندی فعال (basics, technical, fundamental, ...)
 * 
 * Effects:
 * - راه‌اندازی Highlights با vanilla JS
 */
function Tutorial() {
  // State محلی - اولین هایلایت (basics) به صورت پیش‌فرض فعال
  const [activeCategory, setActiveCategory] = useState('basics') // دسته‌بندی فعال

  /**
   * Effect: تنظیم اولین هایلایت به صورت پیش‌فرض
   */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        const firstCircle = document.querySelector('.highlight-circle[data-tutorial="basics"]')
        if (firstCircle) {
          firstCircle.classList.add('active')
        }
      }, 100)
    }
  }, [])

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
      const circles = document.querySelectorAll('.highlight-circle[data-edu]')
      circles.forEach(circle => {
        if (circle.getAttribute('data-edu') === categoryId) {
          circle.classList.add('active')
        } else {
          circle.classList.remove('active')
        }
      })
      
    }
  }

  return (
    <div id="tutorialView" className="view">
      {/* Highlights Section */}
      <section className="highlights-section education-highlights">
        <div className="highlights-container">
          {educationCategories.map((category) => (
            <div
              key={category.id}
              className={`highlight-circle ${activeCategory === category.id ? 'active' : ''}`}
              data-edu={category.id}
              onClick={() => handleCategoryClick(category.id)}
            >
              <span>{category.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Tutorial Cards Container */}
      <main className="main-content" style={{ padding: '1rem', minHeight: '200px' }}>
        <CardContainer 
          items={cards} 
          className={`tutorial-cards`}
        />
      </main>
    </div>
  )
}

export default Tutorial
