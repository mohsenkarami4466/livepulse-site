/**
 * ============================================
 * 📊 کامپوننت IndicatorsContainer - IndicatorsContainer.jsx
 * ============================================
 * 
 * این کامپوننت شاخص‌های لحظه‌ای را نمایش می‌دهد.
 * شامل: طلا، دلار، یورو، بیت‌کوین، نفت، نزدک (ردیف اول)
 * و جفت ارزها: EUR/USD, USD/JPY, GBP/USD, USD/CHF, AUD/USD, USD/CAD (ردیف دوم)
 * 
 * وابستگی‌ها:
 * - هیچ وابستگی خاصی ندارد (static data)
 * 
 * عملکرد:
 * - نمایش شاخص‌های مالی در دو ردیف
 * - نمایش تغییرات (up/down) با رنگ‌بندی
 * - نمایش آیکون و نام هر شاخص
 * 
 * نکته: این شاخص‌ها در همه صفحات نمایش داده می‌شوند.
 * 
 * تاریخ ایجاد: 2025-12-06
 * آخرین بروزرسانی: 2025-12-06
 */

import React from 'react'
import './IndicatorsContainer.css'

/**
 * کامپوننت IndicatorsContainer
 * 
 * این کامپوننت شاخص‌های لحظه‌ای را در دو ردیف نمایش می‌دهد:
 * - ردیف اول: شاخص‌های اصلی (طلا، دلار، یورو، بیت‌کوین، نفت، نزدک)
 * - ردیف دوم: جفت ارزها (EUR/USD, USD/JPY, GBP/USD, USD/CHF, AUD/USD, USD/CAD)
 */
function IndicatorsContainer() {
  const containerRef = React.useRef(null);
  
  // محاسبه موقعیت و ارتفاع کارت بر اساس header و کره کوچک
  React.useEffect(() => {
    const updatePosition = () => {
      const header = document.querySelector('.glass-header, .header-container')?.parentElement || document.querySelector('header');
      const headerHeight = header ? header.offsetHeight : 60;
      const globeWrapper = document.getElementById('globeClockWrapper');
      
      if (globeWrapper && containerRef.current) {
        const globeWidth = globeWrapper.offsetWidth;
        const globeHeight = globeWrapper.offsetHeight;
        const globeLeft = globeWrapper.offsetLeft || 8; // فاصله کره از چپ (8px)
        const gap = 16; // فاصله ثابت بین کره و کارت
        
        // موقعیت کارت: همردیف با کره کوچک
        // فاصله از کره = فاصله از راست
        const cardLeft = globeLeft + globeWidth + gap;
        const cardRight = globeLeft; // فاصله از راست = فاصله کره از چپ
        
        containerRef.current.style.top = `${headerHeight + 8}px`;
        containerRef.current.style.left = `${cardLeft}px`;
        containerRef.current.style.right = `${cardRight}px`;
        containerRef.current.style.height = `${globeHeight}px`;
        containerRef.current.style.maxHeight = `${globeHeight}px`; // محدود کردن ارتفاع
      }
    };
    
    updatePosition();
    window.addEventListener('resize', updatePosition);
    
    // بررسی بعد از render
    setTimeout(updatePosition, 100);
    setTimeout(updatePosition, 500);
    setTimeout(updatePosition, 1000);
    
    return () => window.removeEventListener('resize', updatePosition);
  }, []);

  return (
    <div className="indicators-glass-card" ref={containerRef}>
      <div className="indicators-unified-container">
        {/* ردیف اول - 6 شاخص */}
        <div className="indicator-item up">
          <span className="indicator-icon">🥇</span>
          <span className="indicator-name">طلا</span>
          <span className="indicator-value" id="goldIndicator">۲,۸۵۰,۰۰۰</span>
          <span className="indicator-change">+۰.۵%</span>
        </div>
        <div className="indicator-item up">
          <span className="indicator-icon">💵</span>
          <span className="indicator-name">دلار</span>
          <span className="indicator-value" id="usdIndicator">۵۸,۰۰۰</span>
          <span className="indicator-change">+۰.۳%</span>
        </div>
        <div className="indicator-item down">
          <span className="indicator-icon">💶</span>
          <span className="indicator-name">یورو</span>
          <span className="indicator-value" id="eurIndicator">۶۲,۰۰۰</span>
          <span className="indicator-change">-۰.۲%</span>
        </div>
        <div className="indicator-item up">
          <span className="indicator-icon">₿</span>
          <span className="indicator-name">بیت‌کوین</span>
          <span className="indicator-value" id="btcIndicator">$۴۵,۲۳۰</span>
          <span className="indicator-change">+۲.۵%</span>
        </div>
        <div className="indicator-item down">
          <span className="indicator-icon">🛢️</span>
          <span className="indicator-name">نفت</span>
          <span className="indicator-value" id="oilIndicator">$۸۲.۵</span>
          <span className="indicator-change">-۱.۲%</span>
        </div>
        <div className="indicator-item up">
          <span className="indicator-icon">📈</span>
          <span className="indicator-name">نزدک</span>
          <span className="indicator-value" id="nasdaqIndicator">۱۵,۲۸۵</span>
          <span className="indicator-change">+۰.۹٪</span>
        </div>
        
        {/* ردیف دوم - 6 شاخص */}
        <div className="pair-item up">
          <span className="pair-name">EUR/USD</span>
          <span className="pair-value">1.0856</span>
          <span className="pair-change">+0.12%</span>
        </div>
        <div className="pair-item down">
          <span className="pair-name">USD/JPY</span>
          <span className="pair-value">149.82</span>
          <span className="pair-change">-0.08%</span>
        </div>
        <div className="pair-item up">
          <span className="pair-name">GBP/USD</span>
          <span className="pair-value">1.2715</span>
          <span className="pair-change">+0.15%</span>
        </div>
        <div className="pair-item down">
          <span className="pair-name">USD/CHF</span>
          <span className="pair-value">0.8842</span>
          <span className="pair-change">-0.05%</span>
        </div>
        <div className="pair-item up">
          <span className="pair-name">AUD/USD</span>
          <span className="pair-value">0.6548</span>
          <span className="pair-change">+0.22%</span>
        </div>
        <div className="pair-item down">
          <span className="pair-name">USD/CAD</span>
          <span className="pair-value">1.3625</span>
          <span className="pair-change">-0.10%</span>
        </div>
      </div>
    </div>
  )
}

export default IndicatorsContainer


