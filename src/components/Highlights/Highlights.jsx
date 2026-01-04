/**
 * ============================================
 * 🎯 کامپوننت Highlights - Highlights.jsx
 * ============================================
 * 
 * این کامپوننت هایلایت‌های دسته‌بندی را نمایش می‌دهد.
 * بر اساس صفحه فعلی، محتوای هایلایت‌ها تغییر می‌کند.
 * 
 * وابستگی‌ها:
 * - useLocation: از react-router-dom برای تشخیص صفحه فعلی
 * - useApp: Context برای دسترسی به state
 * 
 * عملکرد:
 * - نمایش هایلایت‌های مناسب برای هر صفحه
 * - مدیریت active state
 * - یکبار render می‌شود و فقط محتوا تغییر می‌کند
 * 
 * تاریخ ایجاد: 2025-01-27
 */

import React, { useEffect, useMemo, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { useApp } from '../../contexts/AppContext'
import './Highlights.css'

/**
 * داده‌های هایلایت‌ها برای هر صفحه
 */
const highlightsData = {
  home: [
    { id: 'home', name: 'خانه', dataAttr: 'category' },
    { id: 'crypto', name: 'رمزارز', dataAttr: 'category' },
    { id: 'currency', name: 'ارز', dataAttr: 'category' },
    { id: 'gold', name: 'طلا', dataAttr: 'category' },
    { id: 'forex', name: 'فارکس', dataAttr: 'category' },
    { id: 'stock', name: 'بورس', dataAttr: 'category' },
    { id: 'oil', name: 'نفت', dataAttr: 'category' }
  ],
  news: [
    { id: 'all', name: 'همه', dataAttr: 'news' },
    { id: 'forex', name: 'فارکس', dataAttr: 'news' },
    { id: 'crypto', name: 'رمزارز', dataAttr: 'news' },
    { id: 'iran-stock', name: 'بورس ایران', dataAttr: 'news' },
    { id: 'global-stock', name: 'جهانی', dataAttr: 'news' },
    { id: 'commodities', name: 'کالاها', dataAttr: 'news' },
    { id: 'macro', name: 'اقتصاد', dataAttr: 'news' }
  ],
  tools: [
    { id: 'personalFund', name: 'صندوق', dataAttr: 'tool' },
    { id: 'goldTool', name: 'طلا', dataAttr: 'tool' },
    { id: 'silverTool', name: 'نقره', dataAttr: 'tool' },
    { id: 'diamondTool', name: 'الماس', dataAttr: 'tool' },
    { id: 'gemTool', name: 'سنگ', dataAttr: 'tool' },
    { id: 'coinTool', name: 'سکه', dataAttr: 'tool' },
    { id: 'currencyTool', name: 'تبدیل ارز', dataAttr: 'tool' }
  ],
  globe: [
    { id: 'resources', name: 'منابع', dataAttr: 'globe' },
    { id: 'financial', name: 'مالی', dataAttr: 'globe' },
    { id: 'conflicts', name: 'درگیری‌ها', dataAttr: 'globe' },
    { id: 'trade', name: 'تجارت', dataAttr: 'globe' },
    { id: 'population', name: 'جمعیت', dataAttr: 'globe' },
    { id: 'gdp', name: 'تولید ناخالص', dataAttr: 'globe' },
    { id: 'borders', name: 'مرزها', dataAttr: 'globe' }
  ],
  tutorial: [
    { id: 'basics', name: 'مبانی', dataAttr: 'edu' },
    { id: 'trading', name: 'معاملات', dataAttr: 'edu' },
    { id: 'analysis', name: 'تحلیل', dataAttr: 'edu' },
    { id: 'risk', name: 'ریسک', dataAttr: 'edu' },
    { id: 'portfolio', name: 'پورتفولیو', dataAttr: 'edu' },
    { id: 'advanced', name: 'پیشرفته', dataAttr: 'edu' },
    { id: 'tools', name: 'ابزارها', dataAttr: 'edu' }
  ],
  relax: [
    { id: 'adhd', name: 'ADHD', dataAttr: 'relax' },
    { id: 'music', name: 'موزیک', dataAttr: 'relax' },
    { id: 'game', name: 'بازی', dataAttr: 'relax' },
    { id: '3d', name: '3D', dataAttr: 'relax' },
    { id: 'meditation', name: 'مدیتیشن', dataAttr: 'relax' },
    { id: 'breathing', name: 'تنفس', dataAttr: 'relax' },
    { id: 'psychology', name: 'روانشناسی', dataAttr: 'relax' }
  ]
}

/**
 * کامپوننت Highlights
 */
function Highlights() {
  const location = useLocation()
  const { currentCategory, setCategory, currentTool, setTool } = useApp()
  
  // تشخیص صفحه فعلی - memoize شده
  const currentPage = useMemo(() => {
    const path = location.pathname.replace('/livepulse-site/', '').replace('/', '')
    if (path === '' || path === '/') {
      return 'home'
    } else if (path.startsWith('news')) {
      return 'news'
    } else if (path.startsWith('tools')) {
      return 'tools'
    } else if (path.startsWith('globe')) {
      return 'globe'
    } else if (path.startsWith('tutorial')) {
      return 'tutorial'
    } else if (path.startsWith('relax')) {
      return 'relax'
    }
    return 'home'
  }, [location.pathname])
  
  // دریافت هایلایت‌های مناسب برای صفحه فعلی - memoize شده
  const currentHighlights = useMemo(() => {
    return highlightsData[currentPage] || highlightsData.home
  }, [currentPage])
  
  /**
   * Handler: کلیک روی هایلایت - memoize شده
   * استفاده از state به جای querySelector برای بهبود performance
   */
  const handleHighlightClick = useCallback((highlight) => {
    const { id, dataAttr } = highlight
    
    // به‌روزرسانی state بر اساس نوع صفحه - state باعث re-render و update DOM می‌شود
    if (currentPage === 'home') {
      setCategory(id)
    } else if (currentPage === 'tools') {
      setTool(id)
    }
    
    // هماهنگی با vanilla JS - فقط برای موارد خاص
    if (typeof window !== 'undefined') {
      // برای صفحه tools
      if (currentPage === 'tools' && window.activateTool) {
        window.activateTool(id)
      }
      
      // برای صفحه news
      if (currentPage === 'news') {
        // dispatch event برای news
        window.dispatchEvent(new CustomEvent('newsCategoryChanged', { detail: { category: id } }))
      }
    }
  }, [currentPage, setCategory, setTool])
  
  /**
   * Effect: تنظیم highlight فعال به صورت پیش‌فرض
   * فقط با تغییر صفحه - استفاده از state به جای querySelector
   */
  useEffect(() => {
    const firstHighlight = currentHighlights[0]
    if (firstHighlight) {
      // تنظیم state فقط اگر با state فعلی متفاوت باشد - جلوگیری از infinite loop
      if (currentPage === 'home' && currentCategory !== firstHighlight.id) {
        setCategory(firstHighlight.id)
      } else if (currentPage === 'tools' && currentTool !== firstHighlight.id) {
        setTool(firstHighlight.id)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]) // فقط با تغییر صفحه - setCategory و setTool stable هستند
  
  
  // Debug: بررسی render شدن (فقط در development) - فقط یکبار log می‌کنیم
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('🎯 Highlights rendering:', { 
        currentPage, 
        highlightsCount: currentHighlights.length,
        pathname: location.pathname 
      })
    }
  }, [currentPage, location.pathname]) // فقط با تغییر صفحه log می‌کنیم
  
  return (
    <section className="highlights-section" data-page={currentPage}>
      <div className="highlights-container">
        {currentHighlights.map((highlight) => {
          // بررسی active state - بدون querySelector در render
          let isActive = false
          if (currentPage === 'home') {
            isActive = currentCategory === highlight.id
          } else if (currentPage === 'tools') {
            isActive = currentTool === highlight.id
          }
          // برای صفحات دیگر، active state از DOM خوانده نمی‌شود (باعث re-render می‌شد)
          
          return (
            <div
              key={highlight.id}
              className={`highlight-circle ${isActive ? 'active' : ''}`}
              {...{ [`data-${highlight.dataAttr}`]: highlight.id }}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleHighlightClick(highlight)
              }}
            >
              <span>{highlight.name}</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default Highlights
