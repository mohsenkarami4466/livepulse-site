/**
 * ============================================
 * 💼 کامپوننت PortfolioSummary - PortfolioSummary.jsx
 * ============================================
 * 
 * این کامپوننت مجموع دارایی‌های کاربر را نمایش می‌دهد.
 * فقط برای کاربران با اشتراک Premium نمایش داده می‌شود.
 * 
 * وابستگی‌ها:
 * - localStorage: برای ذخیره وضعیت نمایش/پنهان عدد
 * 
 * عملکرد:
 * - نمایش کارت "مجموع دارایی‌ها" (همیشه باز)
 * - نمایش/پنهان کردن فقط عدد با دکمه hide/show
 * - قابلیت تنظیم برای نمایش/عدم نمایش عدد در حالت اولیه
 * 
 * موقعیت:
 * - زیر جفت ارزها
 * - زیر کره کوچک نرود
 * - بالای هایلایت‌ها
 * 
 * تاریخ ایجاد: 2025-12-06
 * آخرین بروزرسانی: 2025-12-06
 */

import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../contexts/AppContext'
import './PortfolioSummary.css'

/**
 * کامپوننت PortfolioSummary
 * 
 * State:
 * - isValueVisible: وضعیت نمایش/پنهان عدد (نه کارت)
 * - portfolioTotal: مجموع دارایی‌ها
 * - hasSubscription: آیا کاربر اشتراک دارد
 */
function PortfolioSummary() {
  const [isValueVisible, setIsValueVisible] = useState(true) // فقط عدد hide/show می‌شه
  const [portfolioTotal, setPortfolioTotal] = useState('۰ تومان') // مقدار پیش‌فرض
  const [hasSubscription, setHasSubscription] = useState(false) // بررسی اشتراک
  const containerRef = useRef(null)
  const navigate = useNavigate() // برای navigate کردن به صفحه Tools
  const { setTool } = useApp() // برای تنظیم tool در Context

  // بارگذاری وضعیت نمایش عدد از localStorage
  useEffect(() => {
    const savedVisibility = localStorage.getItem('portfolio-value-visible')
    if (savedVisibility !== null) {
      setIsValueVisible(savedVisibility === 'true')
    } else {
      // پیش‌فرض: عدد نمایش داده می‌شود
      setIsValueVisible(true)
    }

    // بررسی اشتراک کاربر (باید از API یا context بیاید)
    // فعلاً برای تست true می‌گذاریم
    const userSubscription = localStorage.getItem('user-subscription') || 'premium'
    setHasSubscription(userSubscription === 'premium' || userSubscription === 'paid')
  }, [])

  // محاسبه موقعیت کارت بر اساس جفت ارزها و کره کوچک
  useEffect(() => {
    const updatePosition = () => {
      const header = document.querySelector('.glass-header, .header-container')?.parentElement || document.querySelector('header')
      const headerHeight = header ? header.offsetHeight : 60
      const globeWrapper = document.getElementById('globeClockWrapper')
      const indicatorsCard = document.querySelector('.indicators-glass-card')
      const isMobile = window.innerWidth < 768
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024
      
      if (globeWrapper && containerRef.current && indicatorsCard) {
        const globeLeft = globeWrapper.offsetLeft || 8
        const globeWidth = globeWrapper.offsetWidth
        const globeHeight = globeWrapper.offsetHeight
        const globeTop = globeWrapper.offsetTop || headerHeight + 8
        const globeRight = globeLeft + globeWidth
        const globeBottom = globeTop + globeHeight
        
        // در موبایل: کارت کنار کره (همردیف از بالا) - زیر جفت ارزها
        if (isMobile) {
          const indicatorsTop = indicatorsCard.offsetTop || globeTop
          const indicatorsHeight = indicatorsCard.offsetHeight || 100
          const gapFromGlobe = 5; // 5 پیکسل از سمت راست کره
          const gapFromRight = 8; // فاصله از سمت راست نمایشگر
          const gapFromIndicators = 8; // فاصله از جفت ارزها
          const cardTop = indicatorsTop + indicatorsHeight + gapFromIndicators
          const cardLeft = globeRight + gapFromGlobe
          const cardRight = gapFromRight
          
          // عرض برابر با کارت جفت ارزها
          const indicatorsWidth = indicatorsCard.offsetWidth
          
          containerRef.current.style.top = `${cardTop}px`
          containerRef.current.style.left = `${cardLeft}px` // همردیف با جفت ارزها
          containerRef.current.style.right = `${cardRight}px`
          containerRef.current.style.width = `${indicatorsWidth}px` // عرض برابر با کارت جفت ارزها
          containerRef.current.style.maxWidth = `${indicatorsWidth}px`
        } else if (isTablet) {
          // در تبلت: کارت پایین جفت ارزها - سمت راست کره
          const indicatorsTop = indicatorsCard.offsetTop || globeTop
          const indicatorsHeight = indicatorsCard.offsetHeight || 100
          const gapFromGlobe = 10; // 10 پیکسل از سمت راست کره (مثل جفت ارزها)
          const gapFromRight = 8; // فاصله از سمت راست نمایشگر
          const gapFromIndicators = 8; // فاصله از جفت ارزها
          const cardTop = indicatorsTop + indicatorsHeight + gapFromIndicators
          const cardLeft = globeRight + gapFromGlobe // همردیف با جفت ارزها
          const cardRight = gapFromRight
          
          // عرض برابر با کارت جفت ارزها
          const indicatorsWidth = indicatorsCard.offsetWidth
          
          containerRef.current.style.top = `${cardTop}px`
          containerRef.current.style.left = `${cardLeft}px` // همردیف با جفت ارزها
          containerRef.current.style.right = `${cardRight}px`
          containerRef.current.style.width = `${indicatorsWidth}px` // عرض برابر با کارت جفت ارزها
          containerRef.current.style.maxWidth = `${indicatorsWidth}px`
        } else {
          // در دسکتاپ: کارت کنار جفت ارزها (زیر جفت ارزها)
          const gap = 16
          const cardLeft = globeLeft + globeWidth + gap
          const cardRight = globeLeft
          
          // محاسبه top: زیر جفت ارزها
          const indicatorsTop = indicatorsCard.offsetTop || headerHeight + 8
          const indicatorsHeight = indicatorsCard.offsetHeight || 100
          const cardTop = indicatorsTop + indicatorsHeight + 12 // فاصله 12px از جفت ارزها
          
          // محدود کردن ارتفاع: کارت نباید از خط پایین کره پایین‌تر برود
          const maxCardBottom = globeBottom
          const cardHeight = containerRef.current.offsetHeight || 70
          const actualCardBottom = cardTop + cardHeight
          
          // اگر کارت از خط پایین کره پایین‌تر می‌رود، top را تنظیم کن
          let finalTop = cardTop
          if (actualCardBottom > maxCardBottom) {
            finalTop = maxCardBottom - cardHeight - 2 // 2px margin
          }
          
          containerRef.current.style.top = `${finalTop}px`
          containerRef.current.style.left = `${cardLeft}px`
          containerRef.current.style.right = `${cardRight}px`
          
          // عرض برابر با کارت جفت ارزها
          const indicatorsWidth = indicatorsCard.offsetWidth
          containerRef.current.style.width = `${indicatorsWidth}px`
          containerRef.current.style.maxWidth = `${indicatorsWidth}px`
        }
      }
    }
    
    updatePosition()
    window.addEventListener('resize', updatePosition)
    
    // بررسی بعد از render
    setTimeout(updatePosition, 100)
    setTimeout(updatePosition, 500)
    setTimeout(updatePosition, 1000)
    
    // به‌روزرسانی موقعیت هایلایت‌ها بعد از تنظیم موقعیت کارت portfolio
    const updateHighlights = () => {
      // صبر می‌کنیم تا DOM کاملاً render شود
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (typeof window.updateHighlightsPosition === 'function') {
            window.updateHighlightsPosition()
          }
        })
      })
    }
    setTimeout(updateHighlights, 150)
    setTimeout(updateHighlights, 600)
    setTimeout(updateHighlights, 1100)
    // یک بار دیگر بعد از اینکه همه چیز کاملاً render شد
    setTimeout(updateHighlights, 1500)
    
    return () => window.removeEventListener('resize', updatePosition)
  }, [isValueVisible]) // وابسته به isValueVisible برای محاسبه مجدد ارتفاع

  // تابع toggle نمایش/پنهان عدد
  const toggleValueVisibility = () => {
    const newVisibility = !isValueVisible
    setIsValueVisible(newVisibility)
    localStorage.setItem('portfolio-value-visible', newVisibility.toString())
  }

  // تابع navigate به صفحه Tools و فعال کردن صندوق شخصی
  const handleToolsClick = () => {
    // تنظیم tool در Context قبل از navigate
    setTool('personalFund')
    
    // Navigate به صفحه Tools
    navigate('/tools')
    
    // بعد از navigate، صندوق شخصی رو فعال کن
    setTimeout(() => {
      // استفاده از تابع موجود برای فعال کردن صندوق
      if (typeof window !== 'undefined' && window.activateTool) {
        window.activateTool('personalFund')
      }
      
      // فعال کردن highlight circle
      const fundCircle = document.querySelector('.highlight-circle[data-tool="personalFund"]')
      if (fundCircle) {
        // حذف active از همه
        document.querySelectorAll('.highlight-circle').forEach(circle => {
          circle.classList.remove('active')
        })
        // اضافه کردن active به صندوق
        fundCircle.classList.add('active')
      }
      
      // فعال کردن section صندوق
      const fundSection = document.getElementById('personalFundSection')
      if (fundSection) {
        // حذف active-tool از همه
        document.querySelectorAll('.tool-section').forEach(section => {
          section.classList.remove('active-tool')
        })
        // اضافه کردن active-tool به صندوق
        fundSection.classList.add('active-tool')
      }
      
      // به‌روزرسانی نمایش صندوق
      if (typeof window !== 'undefined' && window.updatePortfolioDisplay === 'function') {
        window.updatePortfolioDisplay()
      }
    }, 150)
  }

  // اگر کاربر اشتراک ندارد، کارت را نمایش نده
  if (!hasSubscription) {
    return null
  }

  // کارت همیشه باز است - فقط عدد hide/show می‌شود
  return (
    <div className="portfolio-summary-card" ref={containerRef}>
      <div className="portfolio-summary-content">
        {/* همه چیز در یک خط: عنوان + عدد + چرخدنده + چشم */}
        <div className="portfolio-header">
          <h3 className="portfolio-title">مجموع دارایی‌ها</h3>
          <div className={`portfolio-value-wrapper ${isValueVisible ? 'visible' : 'hidden'}`}>
            <span className="portfolio-value">{portfolioTotal}</span>
          </div>
          <div className="portfolio-actions">
            <button 
              className="portfolio-settings-btn"
              onClick={handleToolsClick}
              aria-label="باز کردن صفحه ابزار و صندوق شخصی"
              title="باز کردن صفحه ابزار"
            >
              <span className="settings-icon">⚙️</span>
            </button>
            <button 
              className="portfolio-toggle-btn"
              onClick={toggleValueVisibility}
              aria-label={isValueVisible ? "پنهان کردن عدد" : "نمایش عدد"}
              title={isValueVisible ? "پنهان کردن" : "نمایش"}
            >
              <span className="eye-icon">{isValueVisible ? '👁️‍🗨️' : '👁️'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PortfolioSummary

