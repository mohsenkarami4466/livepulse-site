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
import CardContainer from '../../components/Cards/CardContainer'
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
      
    }
    }, 50)
  }

  return (
    <div id="relaxView" className="view">
      {/* Highlights در Layout.jsx قرار دارد - حذف شد */}

      {/* Relax Cards Container */}
      <div className="main-content" style={{ padding: '1rem', minHeight: '200px' }}>
        <CardContainer 
          items={cards} 
          className={`relax-cards`}
        />
      </div>
    </div>
  )
}

export default Relax
