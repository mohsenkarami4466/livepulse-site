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
        const firstPanel = document.querySelector('.tutorial-panel[data-tutorial-panel="basics"]')
        if (firstPanel) {
          firstPanel.classList.add('active')
        }
      }, 100)
    }
  }, [])

  /**
   * Effect: راه‌اندازی Highlights
   * 
   * این effect:
   * 1. منتظر می‌ماند تا DOM render شود
   * 2. تابع setupHighlightPanels از vanilla JS را فراخوانی می‌کند
   * 3. Highlights را با پنل‌های آموزشی هماهنگ می‌کند
   */
  useEffect(() => {
    // راه‌اندازی highlight panels برای هماهنگی با vanilla JS
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        try {
          // استفاده از تابع موجود در script-ui.js
          // این تابع event listener ها را برای Highlights اضافه می‌کند
          if (typeof window.setupHighlightPanels === 'function') {
            window.setupHighlightPanels('.highlight-circle[data-edu]', 'data-edu', '.edu-panel', 'data-edu-panel')
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
      const circles = document.querySelectorAll('.highlight-circle[data-edu]')
      circles.forEach(circle => {
        if (circle.getAttribute('data-edu') === categoryId) {
          circle.classList.add('active')
        } else {
          circle.classList.remove('active')
        }
      })
      
      // فعال کردن panel
      const panels = document.querySelectorAll('.edu-panel')
      panels.forEach(panel => {
        if (panel.getAttribute('data-edu-panel') === categoryId) {
          panel.classList.add('active')
        } else {
          panel.classList.remove('active')
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

      {/* Tutorial Container */}
      <div className="tutorial-container">
        <div className="edu-highlight-panels">
          <article className={`edu-panel ${activeCategory === 'basics' ? 'active' : ''}`} data-edu-panel="basics">
            <h4>مبانی بازارهای مالی</h4>
            <p className="panel-placeholder">در حال توسعه</p>
          </article>
          <article className={`edu-panel ${activeCategory === 'technical' ? 'active' : ''}`} data-edu-panel="technical">
            <h4>تحلیل تکنیکال</h4>
            <p className="panel-placeholder">در حال توسعه</p>
          </article>
          <article className={`edu-panel ${activeCategory === 'fundamental' ? 'active' : ''}`} data-edu-panel="fundamental">
            <h4>تحلیل فاندامنتال</h4>
            <p className="panel-placeholder">در حال توسعه</p>
          </article>
          <article className={`edu-panel ${activeCategory === 'crypto' ? 'active' : ''}`} data-edu-panel="crypto">
            <h4>آموزش کریپتو</h4>
            <p className="panel-placeholder">در حال توسعه</p>
          </article>
          <article className={`edu-panel ${activeCategory === 'forex' ? 'active' : ''}`} data-edu-panel="forex">
            <h4>دوره فارکس</h4>
            <p className="panel-placeholder">در حال توسعه</p>
          </article>
          <article className={`edu-panel ${activeCategory === 'risk' ? 'active' : ''}`} data-edu-panel="risk">
            <h4>مدیریت ریسک</h4>
            <p className="panel-placeholder">در حال توسعه</p>
          </article>
          <article className={`edu-panel ${activeCategory === 'strategy' ? 'active' : ''}`} data-edu-panel="strategy">
            <h4>استراتژی معاملاتی</h4>
            <p className="panel-placeholder">در حال توسعه</p>
          </article>
        </div>
      </div>
    </div>
  )
}

export default Tutorial
