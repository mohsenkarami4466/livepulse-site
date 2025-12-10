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
import { createPortal } from 'react-dom'
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
  const [isCardVisible, setIsCardVisible] = useState(true) // نمایش/پنهان کارت
  const [portfolioTotal, setPortfolioTotal] = useState('۰ تومان') // مقدار پیش‌فرض
  const [portfolioChange, setPortfolioChange] = useState({ value: 0, percent: 0, isUp: true }) // تغییر نسبت به گذشته
  const [hasSubscription, setHasSubscription] = useState(false) // بررسی اشتراک
  const [showPrintModal, setShowPrintModal] = useState(false) // نمایش/پنهان مودال پرینت
  const containerRef = useRef(null)
  const printModalRef = useRef(null)
  const navigate = useNavigate() // برای navigate کردن به صفحه Tools
  const { setTool } = useApp() // برای تنظیم tool در Context

  // بارگذاری وضعیت نمایش عدد و کارت از localStorage
  useEffect(() => {
    const savedVisibility = localStorage.getItem('portfolio-value-visible')
    if (savedVisibility !== null) {
      setIsValueVisible(savedVisibility === 'true')
    } else {
      // پیش‌فرض: عدد نمایش داده می‌شود
      setIsValueVisible(true)
    }

    const savedCardVisibility = localStorage.getItem('portfolio-card-visible')
    if (savedCardVisibility !== null) {
      setIsCardVisible(savedCardVisibility === 'true')
    } else {
      // پیش‌فرض: کارت نمایش داده می‌شود
      setIsCardVisible(true)
    }

    // بررسی اشتراک کاربر (باید از API یا context بیاید)
    // فعلاً برای تست true می‌گذاریم
    const userSubscription = localStorage.getItem('user-subscription') || 'premium'
    setHasSubscription(userSubscription === 'premium' || userSubscription === 'paid')
    
    // محاسبه اولیه ارزش کل
    updatePortfolioValue()
    
    // تنظیم تابع global برای به‌روزرسانی از script-tools.js
    if (typeof window !== 'undefined') {
      window.updatePortfolioSummaryValue = (value, change) => {
        setPortfolioTotal(value)
        if (change) {
          setPortfolioChange(change)
        }
      }
      
      // اضافه کردن تابع generateMiniChartSVG به window اگر وجود ندارد
      if (!window.generateMiniChartSVG) {
        // Import از card-helpers
        import('../../utils/card-helpers').then(module => {
          window.generateMiniChartSVG = module.generateMiniChartSVG
        }).catch(() => {
          // Fallback: تابع ساده
          window.generateMiniChartSVG = (symbol, isUp) => {
            const points = isUp 
              ? '10,80 20,70 30,60 40,50 50,45 60,40 70,35 80,30 90,25'
              : '10,20 20,30 30,40 40,50 50,55 60,60 70,65 80,70 90,75'
            const color = isUp ? '#22c55e' : '#ef4444'
            return `
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" style="width:100%;height:100%;">
                <defs>
                  <linearGradient id="portfolioGrad-${Date.now()}" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="${isUp ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}" />
                    <stop offset="100%" stop-color="transparent" />
                  </linearGradient>
                </defs>
                <polygon points="0,100 ${points} 100,100" fill="url(#portfolioGrad-${Date.now()})" />
                <polyline points="${points}" fill="none" stroke="${color}" stroke-width="1.5" />
              </svg>
            `
          }
        })
      }
    }
  }, [])
  
  // تابع محاسبه ارزش کل
  const updatePortfolioValue = () => {
    try {
      const portfolio = JSON.parse(localStorage.getItem('userPortfolio') || '[]')
      if (portfolio.length === 0) {
        setPortfolioTotal('۰ تومان')
        setPortfolioChange({ value: 0, percent: 0, isUp: true })
        return
      }
      
      // محاسبه ارزش کل (از script-tools.js)
      if (typeof window !== 'undefined' && window.getAssetPrice && window.formatPrice) {
        let totalValue = 0
        portfolio.forEach(asset => {
          const price = window.getAssetPrice(asset.marketType)
          const value = asset.amount * price
          totalValue += value
        })
        
        const formattedValue = window.formatPrice(totalValue, 'IRR')
        setPortfolioTotal(formattedValue)
        
        // محاسبه تغییر نسبت به گذشته (از localStorage)
        const previousValue = parseFloat(localStorage.getItem('portfolio-previous-value') || '0')
        if (previousValue > 0) {
          const changeValue = totalValue - previousValue
          const changePercent = ((changeValue / previousValue) * 100).toFixed(2)
          setPortfolioChange({
            value: changeValue,
            percent: Math.abs(changePercent),
            isUp: changeValue >= 0
          })
        } else {
          // ذخیره مقدار فعلی برای دفعه بعد
          localStorage.setItem('portfolio-previous-value', totalValue.toString())
        }
      }
    } catch (error) {
      console.error('خطا در محاسبه ارزش کل:', error)
    }
  }
  
  // گوش دادن به تغییرات portfolio در localStorage
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'userPortfolio') {
        updatePortfolioValue()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // بررسی هر 2 ثانیه برای به‌روزرسانی لحظه‌ای
    const interval = setInterval(() => {
      updatePortfolioValue()
    }, 2000)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
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
  
  // تابع toggle نمایش/پنهان کارت
  const toggleCardVisibility = () => {
    const newVisibility = !isCardVisible
    setIsCardVisible(newVisibility)
    localStorage.setItem('portfolio-card-visible', newVisibility.toString())
  }
  
  /**
   * ============================================
   * 🖨️ تابع handlePrint - مدیریت کلیک روی گزینه خروجی
   * ============================================
   * این تابع زمانی فراخوانی می‌شود که کاربر یکی از گزینه‌های خروجی را انتخاب می‌کند
   * (مثلاً: اینستاگرام، توییتر، لینکدین، سایز نرمال، یا خروجی ریز)
   */
  const handlePrint = (format) => {
    setShowPrintModal(false)
    generatePortfolioImage(format)
  }
  
  /**
   * ============================================
   * 🖼️ تابع generatePortfolioImage - شروع فرآیند تولید عکس
   * ============================================
   * این تابع بررسی می‌کند که آیا کتابخانه html2canvas لود شده است یا نه
   * اگر لود نشده باشد، آن را از CDN لود می‌کند و سپس تابع createImage را فراخوانی می‌کند
   * 
   * @param {Object} format - اطلاعات فرمت خروجی (id, width, height, detailed, maxSize)
   */
  const generatePortfolioImage = (format) => {
    // لود کردن html2canvas به صورت dynamic
    if (typeof window !== 'undefined') {
      // بررسی وجود html2canvas
      if (!window.html2canvas) {
        // لود کردن html2canvas از CDN
        const script = document.createElement('script')
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
        script.onload = () => {
          createImage(format)
        }
        document.head.appendChild(script)
      } else {
        createImage(format)
      }
    }
  }
  
  /**
   * ============================================
   * 🌍 تابع createGlobeBackground - ایجاد بک‌گراند کره زمین
   * ============================================
   * این تابع یک کره زمین زیبا با گرادیان آبی و ستاره‌ها در بک‌گراند ایجاد می‌کند
   * که در تمام خروجی‌ها (اینستاگرام، توییتر، لینکدین و ...) استفاده می‌شود
   * 
   * @param {number} width - عرض تصویر
   * @param {number} height - ارتفاع تصویر
   * @returns {string} - Data URL تصویر کره زمین به فرمت JPEG
   * 
   * TODO: می‌توانید این تابع را برای هر خروجی جداگانه سفارشی کنید
   * مثلاً برای اینستاگرام یک کره زمین، برای توییتر یک کره دیگر
   */
  const createGlobeBackground = (width, height) => {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    
    // گرادیان آبی برای فضا
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, '#0a0e27')
    gradient.addColorStop(0.5, '#1a1f3a')
    gradient.addColorStop(1, '#0f1419')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
    
    // کشیدن کره زمین ساده
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) * 0.4
    
    // کره زمین با گرادیان
    const globeGradient = ctx.createRadialGradient(centerX - radius * 0.3, centerY - radius * 0.3, 0, centerX, centerY, radius)
    globeGradient.addColorStop(0, '#1e40af')
    globeGradient.addColorStop(0.3, '#2563eb')
    globeGradient.addColorStop(0.6, '#3b82f6')
    globeGradient.addColorStop(1, '#1e3a8a')
    
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.fillStyle = globeGradient
    ctx.fill()
    
    // اضافه کردن جزئیات قاره‌ها (خطوط ساده)
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.3)'
    ctx.lineWidth = 2
    ctx.beginPath()
    // خطوط ساده برای نشان دادن قاره‌ها
    ctx.moveTo(centerX - radius * 0.5, centerY - radius * 0.2)
    ctx.lineTo(centerX - radius * 0.2, centerY - radius * 0.3)
    ctx.lineTo(centerX + radius * 0.1, centerY - radius * 0.1)
    ctx.stroke()
    
    ctx.beginPath()
    ctx.moveTo(centerX - radius * 0.3, centerY + radius * 0.1)
    ctx.lineTo(centerX + radius * 0.2, centerY + radius * 0.2)
    ctx.lineTo(centerX + radius * 0.4, centerY)
    ctx.stroke()
    
    // اضافه کردن ستاره‌ها
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const dist = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2))
      if (dist > radius + 20) {
        ctx.beginPath()
        ctx.arc(x, y, Math.random() * 1.5 + 0.5, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    
    return canvas.toDataURL('image/jpeg', 0.8)
  }
  
  /**
   * ============================================
   * 🎨 تابع createImage - ایجاد و تولید نهایی عکس
   * ============================================
   * این تابع اصلی تولید عکس است که:
   * 1. یک div موقت ایجاد می‌کند
   * 2. بک‌گراند کره زمین را اضافه می‌کند
   * 3. محتوای عکس (هدر، محتوای اصلی، فوتر) را می‌سازد
   * 4. از html2canvas برای تبدیل HTML به تصویر استفاده می‌کند
   * 5. تصویر را به فرمت JPEG تبدیل و دانلود می‌کند
   * 
   * @param {Object} format - اطلاعات فرمت خروجی:
   *   - id: شناسه فرمت ('instagram', 'twitter', 'linkedin', 'normal', 'detailed')
   *   - width: عرض تصویر
   *   - height: ارتفاع تصویر
   *   - detailed: آیا خروجی ریز (با جدول جزئیات) باشد یا نه
   *   - maxSize: حداکثر حجم فایل به بایت
   * 
   * TODO: برای سفارشی کردن هر خروجی:
   * - می‌توانید برای format.id === 'instagram' یک طراحی خاص اضافه کنید
   * - می‌توانید برای format.id === 'twitter' یک طراحی دیگر اضافه کنید
   * - می‌توانید محتوای هدر، بدنه و فوتر را برای هر فرمت جداگانه تنظیم کنید
   */
  const createImage = (format) => {
    // ایجاد یک div موقت برای رندر کردن محتوا
    const tempDiv = document.createElement('div')
    tempDiv.style.position = 'fixed'
    tempDiv.style.top = '0'
    tempDiv.style.left = '0'
    tempDiv.style.width = `${format.width}px`
    tempDiv.style.height = `${format.height}px`
    
    // ایجاد بک‌گراند کره زمین
    const globeBg = createGlobeBackground(format.width, format.height)
    tempDiv.style.backgroundImage = `url(${globeBg})`
    tempDiv.style.backgroundSize = 'cover'
    tempDiv.style.backgroundPosition = 'center'
    
    // لایه شیشه‌ای مات روی بک‌گراند
    tempDiv.style.backgroundColor = 'rgba(18, 18, 18, 0.75)'
    tempDiv.style.backdropFilter = 'blur(30px) saturate(150%)'
    tempDiv.style.webkitBackdropFilter = 'blur(30px) saturate(150%)'
    tempDiv.style.borderRadius = '0'
    tempDiv.style.padding = format.detailed ? '60px' : '80px'
    tempDiv.style.fontFamily = 'Vazirmatn, Inter, sans-serif'
    tempDiv.style.color = '#ffffff'
    tempDiv.style.direction = 'rtl'
    tempDiv.style.zIndex = '99999'
    tempDiv.style.boxSizing = 'border-box'
    tempDiv.style.overflow = 'hidden'
    
    // ============================================
    // 📊 آماده‌سازی داده‌ها و محاسبات
    // ============================================
    // دریافت اطلاعات پورتفولیو از localStorage
    const portfolio = JSON.parse(localStorage.getItem('userPortfolio') || '[]')
    
    // دریافت تاریخ و زمان فعلی
    const now = new Date()
    const persianDate = getPersianDate(now)
    const gregorianDate = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    const time = now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    
    // ============================================
    // 📐 محاسبه اندازه فونت‌ها بر اساس سایز عکس
    // ============================================
    // scale: نسبت سایز عکس به سایز استاندارد (1920px)
    // این باعث می‌شود که فونت‌ها در تمام سایزها متناسب باشند
    const scale = format.width / 1920
    const titleSize = Math.round(36 * scale)
    const valueSize = Math.round(64 * scale)
    const changeSize = Math.round(24 * scale)
    const headerSize = Math.round(14 * scale)
    const logoSize = Math.round(32 * scale)
    const siteNameSize = Math.round(24 * scale)
    
    // ============================================
    // 🎨 ساخت محتوای HTML عکس
    // ============================================
    // TODO: می‌توانید برای هر format.id یک طراحی خاص اضافه کنید
    // مثلاً: if (format.id === 'instagram') { ... }
    // یا: if (format.id === 'twitter') { ... }
    
    let content = `
      <div style="position: relative; z-index: 1; display: flex; flex-direction: column; height: 100%; justify-content: space-between; box-sizing: border-box;">
        <!-- ============================================ -->
        <!-- 📋 هدر عکس - بخش بالایی -->
        <!-- ============================================ -->
        <!-- TODO: می‌توانید این بخش را برای هر خروجی جداگانه سفارشی کنید -->
        <!-- مثلاً برای اینستاگرام یک هدر، برای توییتر هدر دیگری -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: ${30 * scale}px; padding: ${16 * scale}px ${20 * scale}px; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border-radius: ${12 * scale}px; border: 1px solid rgba(255, 255, 255, 0.1);">
          <div style="display: flex; align-items: center; gap: ${12 * scale}px;">
            <div style="width: ${logoSize * 1.2}px; height: ${logoSize * 1.2}px; border-radius: 50%; background: linear-gradient(135deg, #ea580c, #fb923c); display: flex; align-items: center; justify-content: center; box-shadow: 0 ${4 * scale}px ${12 * scale}px rgba(234, 88, 12, 0.3);">
              <div style="font-size: ${logoSize}px; font-weight: 700; color: #ffffff;">LP</div>
            </div>
            <div>
              <div style="font-size: ${siteNameSize}px; font-weight: 700; color: #ffffff; letter-spacing: ${0.5 * scale}px;">LivePulse.ir</div>
              <div style="font-size: ${Math.round(headerSize * 0.7)}px; color: rgba(255, 255, 255, 0.6); margin-top: ${2 * scale}px;">💰 قیمت لحظه‌ای بازار</div>
            </div>
          </div>
          <div style="text-align: left; padding: ${8 * scale}px ${12 * scale}px; background: rgba(255, 255, 255, 0.08); border-radius: ${8 * scale}px; border-right: 3px solid #ea580c;">
            <div style="font-size: ${Math.round(headerSize * 0.9)}px; color: rgba(255, 255, 255, 0.9); font-weight: 600; margin-bottom: ${2 * scale}px;">📅 ${persianDate}</div>
            <div style="font-size: ${Math.round(headerSize * 0.75)}px; color: rgba(255, 255, 255, 0.7);">${gregorianDate}</div>
            <div style="font-size: ${Math.round(headerSize * 0.75)}px; color: #ea580c; font-weight: 600; margin-top: ${2 * scale}px;">🕐 ${time}</div>
          </div>
        </div>
        
        <!-- ============================================ -->
        <!-- 💰 محتوای اصلی عکس - بخش میانی -->
        <!-- ============================================ -->
        <!-- TODO: می‌توانید این بخش را برای هر خروجی جداگانه سفارشی کنید -->
        <!-- مثلاً برای اینستاگرام یک طراحی، برای توییتر طراحی دیگری -->
        <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: ${20 * scale}px; padding: ${20 * scale}px; background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(15px); border-radius: ${16 * scale}px; border: 1px solid rgba(255, 255, 255, 0.1);">
          <div style="display: flex; align-items: center; gap: ${8 * scale}px; margin-bottom: ${10 * scale}px;">
            <div style="font-size: ${Math.round(titleSize * 0.8)}px;">💼</div>
            <h2 style="font-size: ${titleSize}px; margin: 0; color: #ffffff; font-weight: 700; letter-spacing: ${1 * scale}px;">مجموع دارایی‌ها</h2>
          </div>
          <div style="font-size: ${valueSize}px; font-weight: 800; background: linear-gradient(135deg, #ea580c, #fb923c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin: ${20 * scale}px 0; text-align: center; text-shadow: 0 0 ${20 * scale}px rgba(234, 88, 12, 0.3);">
            ${portfolioTotal}
          </div>
          ${portfolioChange.percent > 0 ? `
            <div style="display: inline-flex; align-items: center; gap: ${6 * scale}px; font-size: ${changeSize}px; color: ${portfolioChange.isUp ? '#22c55e' : '#ef4444'}; font-weight: 700; padding: ${10 * scale}px ${20 * scale}px; background: ${portfolioChange.isUp ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)'}; border-radius: ${12 * scale}px; border: 2px solid ${portfolioChange.isUp ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}; box-shadow: 0 ${4 * scale}px ${12 * scale}px ${portfolioChange.isUp ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'};">
              <span style="font-size: ${Math.round(changeSize * 1.2)}px;">${portfolioChange.isUp ? '📈' : '📉'}</span>
              <span>${portfolioChange.isUp ? '↑' : '↓'} ${portfolioChange.percent}%</span>
            </div>
          ` : ''}
        </div>
    `
    
    // ============================================
    // 📊 بخش جزئیات دارایی‌ها (فقط برای خروجی ریز)
    // ============================================
    // این بخش فقط زمانی نمایش داده می‌شود که format.detailed === true باشد
    // TODO: می‌توانید این جدول را برای هر خروجی جداگانه سفارشی کنید
    // مثلاً برای اینستاگرام یک جدول، برای توییتر جدول دیگری
    if (format.detailed && portfolio.length > 0) {
      const tableHeaderSize = Math.round(18 * scale)
      const tableCellSize = Math.round(14 * scale)
      const tablePadding = Math.round(12 * scale)
      
      content += `
        <div style="margin-top: ${40 * scale}px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: ${30 * scale}px;">
          <h3 style="font-size: ${Math.round(24 * scale)}px; margin-bottom: ${20 * scale}px; color: #ffffff; font-weight: 600;">جزئیات دارایی‌ها</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                <th style="padding: ${tablePadding}px; text-align: right; font-size: ${tableHeaderSize}px; color: rgba(255,255,255,0.9); font-weight: 600;">نوع دارایی</th>
                <th style="padding: ${tablePadding}px; text-align: right; font-size: ${tableHeaderSize}px; color: rgba(255,255,255,0.9); font-weight: 600;">مقدار</th>
                <th style="padding: ${tablePadding}px; text-align: right; font-size: ${tableHeaderSize}px; color: rgba(255,255,255,0.9); font-weight: 600;">قیمت واحد</th>
                <th style="padding: ${tablePadding}px; text-align: right; font-size: ${tableHeaderSize}px; color: rgba(255,255,255,0.9); font-weight: 600;">ارزش کل</th>
              </tr>
            </thead>
            <tbody>
      `
      
      portfolio.forEach(asset => {
        const price = window.getAssetPrice ? window.getAssetPrice(asset.marketType) : 0
        const value = asset.amount * price
        const formattedValue = window.formatPrice ? window.formatPrice(value, 'IRR') : value.toLocaleString('fa-IR') + ' تومان'
        const assetName = window.getAssetName ? window.getAssetName(asset.marketType) : asset.marketType
        const unit = window.getAssetUnit ? window.getAssetUnit(asset.marketType) : ''
        const formattedPrice = window.formatPrice ? window.formatPrice(price, 'IRR') : price.toLocaleString('fa-IR') + ' تومان'
        
        content += `
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
            <td style="padding: ${tablePadding}px; font-size: ${tableCellSize}px; color: #ffffff;">${assetName}</td>
            <td style="padding: ${tablePadding}px; font-size: ${tableCellSize}px; color: #ffffff;">${asset.amount} ${unit}</td>
            <td style="padding: ${tablePadding}px; font-size: ${tableCellSize}px; color: rgba(255,255,255,0.8);">${formattedPrice}</td>
            <td style="padding: ${tablePadding}px; font-size: ${tableCellSize}px; font-weight: 600; color: #ea580c;">${formattedValue}</td>
          </tr>
        `
      })
      
      content += `
            </tbody>
          </table>
        </div>
      `
    }
    
    // ============================================
    // 📌 فوتر عکس - بخش پایینی
    // ============================================
    // TODO: می‌توانید این بخش را برای هر خروجی جداگانه سفارشی کنید
    // مثلاً برای اینستاگرام یک فوتر، برای توییتر فوتر دیگری
    const footerSize = Math.round(14 * scale)
    content += `
        <!-- ============================================ -->
        <!-- 📌 فوتر عکس - بخش پایینی -->
        <!-- ============================================ -->
        <div style="margin-top: ${30 * scale}px; padding: ${16 * scale}px ${20 * scale}px; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border-radius: ${12 * scale}px; border: 1px solid rgba(255, 255, 255, 0.1); display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: ${8 * scale}px;">
            <div style="width: ${Math.round(logoSize * 0.6)}px; height: ${Math.round(logoSize * 0.6)}px; border-radius: 50%; background: linear-gradient(135deg, #ea580c, #fb923c); display: flex; align-items: center; justify-content: center;">
              <span style="font-size: ${Math.round(logoSize * 0.4)}px; color: #ffffff; font-weight: 700;">LP</span>
            </div>
            <div>
              <div style="font-size: ${Math.round(footerSize * 1.1)}px; font-weight: 700; color: #ffffff; letter-spacing: ${0.5 * scale}px;">LivePulse.ir</div>
              <div style="font-size: ${Math.round(footerSize * 0.85)}px; color: rgba(255, 255, 255, 0.6); margin-top: ${2 * scale}px;">${window.location.origin}</div>
            </div>
          </div>
          <div style="text-align: left; padding: ${6 * scale}px ${12 * scale}px; background: rgba(234, 88, 12, 0.15); border-radius: ${8 * scale}px; border-right: 2px solid #ea580c;">
            <div style="font-size: ${Math.round(footerSize * 0.9)}px; color: #ea580c; font-weight: 600;">🌐 قیمت‌های لحظه‌ای</div>
          </div>
        </div>
      </div>
    `
    
    // ============================================
    // 🖼️ اضافه کردن محتوا به DOM و آماده‌سازی برای تبدیل به عکس
    // ============================================
    tempDiv.innerHTML = content
    document.body.appendChild(tempDiv)
    
    // ============================================
    // 📸 تبدیل HTML به تصویر با استفاده از html2canvas
    // ============================================
    // TODO: می‌توانید تنظیمات html2canvas را برای هر خروجی جداگانه تغییر دهید
    // مثلاً scale، quality و ... را برای اینستاگرام، توییتر و ... متفاوت کنید
    window.html2canvas(tempDiv, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
      logging: false,
      allowTaint: true, // برای استفاده از تصویر بک‌گراند
      width: format.width,
      height: format.height,
      windowWidth: format.width,
      windowHeight: format.height
    }).then(canvas => {
      // ============================================
      // 💾 تبدیل Canvas به JPEG و مدیریت حجم فایل
      // ============================================
      // TODO: می‌توانید کیفیت JPEG را برای هر خروجی جداگانه تنظیم کنید
      // مثلاً برای اینستاگرام quality = 0.9، برای توییتر quality = 0.85
      const quality = 0.85 // کیفیت JPEG (0.0 تا 1.0)
      
      canvas.toBlob((blob) => {
        // بررسی حجم فایل - اگر از حد مجاز بیشتر باشد، کیفیت را کاهش می‌دهیم
        if (blob.size > (format.maxSize || 10 * 1024 * 1024)) {
          // اگر حجم زیاد است، کیفیت را کاهش می‌دهیم
          let currentQuality = quality
          const reduceQuality = () => {
            currentQuality -= 0.1
            canvas.toBlob((newBlob) => {
              if (newBlob.size > (format.maxSize || 10 * 1024 * 1024) && currentQuality > 0.5) {
                reduceQuality()
              } else {
                downloadImage(newBlob, format)
              }
            }, 'image/jpeg', currentQuality)
          }
          reduceQuality()
        } else {
          downloadImage(blob, format)
        }
      }, 'image/jpeg', quality)
      
      // حذف div موقت بعد از یک تاخیر کوتاه
      setTimeout(() => {
        if (tempDiv.parentNode) {
          document.body.removeChild(tempDiv)
        }
      }, 1000)
    }).catch(error => {
      console.error('خطا در تولید عکس:', error)
      if (tempDiv.parentNode) {
        document.body.removeChild(tempDiv)
      }
    })
  }
  
  /**
   * ============================================
   * 💾 تابع downloadImage - دانلود تصویر نهایی
   * ============================================
   * این تابع تصویر تولید شده را دانلود می‌کند
   * 
   * @param {Blob} blob - فایل تصویر به صورت Blob
   * @param {Object} format - اطلاعات فرمت خروجی
   * 
   * TODO: می‌توانید نام فایل را برای هر خروجی جداگانه تنظیم کنید
   * مثلاً برای اینستاگرام: `instagram-portfolio-${Date.now()}.jpg`
   * برای توییتر: `twitter-portfolio-${Date.now()}.jpg`
   */
  const downloadImage = (blob, format) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = `portfolio-${format.id}-${Date.now()}.jpg`
    link.href = url
    link.click()
    URL.revokeObjectURL(url)
  }
  
  // تابع تبدیل تاریخ به شمسی
  const getPersianDate = (date) => {
    // تبدیل ساده - در نسخه نهایی باید از کتابخانه استفاده شود
    const persianMonths = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند']
    // این یک تبدیل ساده است - برای دقت بیشتر باید از کتابخانه استفاده شود
    return `${date.getDate()} ${persianMonths[date.getMonth()]} ${date.getFullYear()}`
  }
  
  // تولید نمودار کوچک
  const generateMiniChart = () => {
    if (typeof window !== 'undefined' && window.generateMiniChartSVG) {
      return window.generateMiniChartSVG('PORTFOLIO', portfolioChange.isUp)
    }
    // Fallback: نمودار ساده SVG
    const isUp = portfolioChange.isUp
    const uniqueId = `portfolioGrad-${Date.now()}-${Math.random()}`
    const points = isUp 
      ? '10,80 20,70 30,60 40,50 50,45 60,40 70,35 80,30 90,25'
      : '10,20 20,30 30,40 40,50 50,55 60,60 70,65 80,70 90,75'
    const color = isUp ? '#22c55e' : '#ef4444'
    return `
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style="width:100%;height:100%;">
        <defs>
          <linearGradient id="${uniqueId}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="${isUp ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}" />
            <stop offset="100%" stop-color="transparent" />
          </linearGradient>
        </defs>
        <polygon points="0,100 ${points} 100,100" fill="url(#${uniqueId})" />
        <polyline points="${points}" fill="none" stroke="${color}" stroke-width="1.5" />
      </svg>
    `
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
  
  // اگر کارت مخفی است، دکمه کوچک برای نمایش
  if (!isCardVisible) {
    return (
      <button 
        className="portfolio-show-btn"
        onClick={toggleCardVisibility}
        title="نمایش مجموع دارایی‌ها"
        aria-label="نمایش مجموع دارایی‌ها"
      >
        💼
      </button>
    )
  }

  // کارت همیشه باز است - فقط عدد hide/show می‌شود
  return (
    <div className="portfolio-summary-card" ref={containerRef}>
      <div className="portfolio-summary-content">
        {/* همه چیز در یک خط: عنوان + عدد + نمودار + چرخدنده + چشم + بستن */}
        <div className="portfolio-header">
          <h3 className="portfolio-title">مجموع دارایی‌ها</h3>
          <div className={`portfolio-value-wrapper ${isValueVisible ? 'visible' : 'hidden'}`}>
            <span className="portfolio-value">{portfolioTotal}</span>
            {portfolioChange.percent > 0 && (
              <span className={`portfolio-change ${portfolioChange.isUp ? 'positive' : 'negative'}`}>
                {portfolioChange.isUp ? '↑' : '↓'} {portfolioChange.percent}%
              </span>
            )}
          </div>
          <div className="portfolio-chart-wrapper">
            <div 
              className="portfolio-mini-chart"
              dangerouslySetInnerHTML={{ __html: generateMiniChart() }}
            />
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
            <button 
              className="portfolio-print-btn"
              onClick={() => setShowPrintModal(true)}
              aria-label="چاپ و ذخیره عکس"
              title="چاپ و ذخیره عکس"
            >
              <span className="print-icon">🖨️</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* مودال انتخاب نوع خروجی - استفاده از Portal برای رندر در body */}
      {showPrintModal && typeof document !== 'undefined' && createPortal(
        <PrintModal
          onClose={() => setShowPrintModal(false)}
          portfolioTotal={portfolioTotal}
          portfolioChange={portfolioChange}
          onSelectFormat={handlePrint}
        />,
        document.body
      )}
    </div>
  )
}

// کامپوننت مودال انتخاب نوع خروجی
function PrintModal({ onClose, portfolioTotal, portfolioChange, onSelectFormat }) {
  const modalRef = useRef(null)
  
  useEffect(() => {
    // جلوگیری از اسکرول صفحه وقتی مودال باز است
    document.body.classList.add('modal-open')
    
    // ذخیره موقعیت اسکرول فعلی
    const scrollY = window.scrollY
    
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose()
      }
    }
    
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    
    return () => {
      // بازگرداندن اسکرول صفحه
      document.body.classList.remove('modal-open')
      window.scrollTo(0, scrollY)
      
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])
  
  /**
   * ============================================
   * 📋 لیست فرمت‌های خروجی
   * ============================================
   * این آرایه شامل تمام فرمت‌های خروجی است که کاربر می‌تواند انتخاب کند
   * 
   * TODO: می‌توانید برای هر فرمت جداگانه کار کنید:
   * - اینستاگرام: format.id === 'instagram'
   * - توییتر: format.id === 'twitter'
   * - لینکدین: format.id === 'linkedin'
   * - سایز نرمال: format.id === 'normal'
   * - خروجی ریز: format.id === 'detailed'
   * 
   * می‌توانید width، height، maxSize و ... را برای هر کدام تغییر دهید
   */
  const formats = [
    // 📷 پست اینستاگرام - سایز مربعی 1080x1080
    // TODO: می‌توانید این بخش را برای اینستاگرام سفارشی کنید
    { id: 'instagram', name: '📷 پست اینستاگرام', width: 1080, height: 1080, maxSize: 8 * 1024 * 1024 }, // 8MB
    
    // 🐦 پست توییتر - سایز افقی 1200x675
    // TODO: می‌توانید این بخش را برای توییتر سفارشی کنید
    { id: 'twitter', name: '🐦 پست توییتر', width: 1200, height: 675, maxSize: 5 * 1024 * 1024 }, // 5MB
    
    // 💼 پست لینکدین - سایز افقی 1200x627
    // TODO: می‌توانید این بخش را برای لینکدین سفارشی کنید
    { id: 'linkedin', name: '💼 پست لینکدین', width: 1200, height: 627, maxSize: 10 * 1024 * 1024 }, // 10MB
    
    // 📄 سایز نرمال - سایز استاندارد 1920x1080
    // TODO: می‌توانید این بخش را برای سایز نرمال سفارشی کنید
    { id: 'normal', name: '📄 سایز نرمال', width: 1920, height: 1080, maxSize: 10 * 1024 * 1024 }, // 10MB
    
    // 📊 خروجی ریز (اکسل) - سایز استاندارد با جدول جزئیات
    // TODO: می‌توانید این بخش را برای خروجی ریز سفارشی کنید
    { id: 'detailed', name: '📊 خروجی ریز (اکسل)', width: 1920, height: 1080, detailed: true, maxSize: 10 * 1024 * 1024 } // 10MB
  ]
  
  return (
    <div className="print-modal-overlay" onClick={onClose}>
      <div className="print-modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <button className="print-modal-close" onClick={onClose} aria-label="بستن">
          ✕
        </button>
        <div className="print-modal-header">
          <h3>🖨️ انتخاب نوع خروجی</h3>
          <p>نوع خروجی مورد نظر خود را انتخاب کنید</p>
        </div>
        <div className="print-modal-options">
          {formats.map(format => (
            <button
              key={format.id}
              className="print-format-btn"
              onClick={() => onSelectFormat(format)}
            >
              {format.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PortfolioSummary

