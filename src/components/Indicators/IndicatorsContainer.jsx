/**
 * ============================================
 * 📊 کامپوننت IndicatorsContainer - IndicatorsContainer.jsx
 * ============================================
 * 
 * این کامپوننت جفت ارزهای لحظه‌ای را نمایش می‌دهد.
 * شامل: EUR/USD, USD/JPY, GBP/USD, USD/CHF, AUD/USD, USD/CAD
 * 
 * وابستگی‌ها:
 * - هیچ وابستگی خاصی ندارد (static data)
 * 
 * عملکرد:
 * - نمایش 6 جفت ارز در یک ردیف (دسکتاپ) یا 2-3 ردیف (موبایل/تبلت)
 * - نمایش تغییرات (up/down) با رنگ‌بندی
 * - Responsive: در موبایل/تبلت به 2-3 ردیف تبدیل می‌شود
 * 
 * نکته: این جفت ارزها در همه صفحات نمایش داده می‌شوند.
 * 
 * تاریخ ایجاد: 2025-12-06
 * آخرین بروزرسانی: 2025-12-06
 */

import React from 'react'
import './IndicatorsContainer.css'

/**
 * کامپوننت IndicatorsContainer
 * 
 * این کامپوننت 6 جفت ارز را نمایش می‌دهد:
 * - دسکتاپ: یک ردیف 6 تایی
 * - تبلت/موبایل: 2-3 ردیف (responsive)
 */
function IndicatorsContainer() {
  const containerRef = React.useRef(null);
  
  // محاسبه موقعیت و ارتفاع کارت بر اساس header و کره کوچک
  React.useEffect(() => {
    const updatePosition = () => {
      const header = document.querySelector('.glass-header, .header-container')?.parentElement || document.querySelector('header');
      const headerHeight = header ? header.offsetHeight : 60;
      const globeWrapper = document.getElementById('globeClockWrapper');
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      
      if (globeWrapper && containerRef.current) {
        const globeWidth = globeWrapper.offsetWidth;
        const globeHeight = globeWrapper.offsetHeight;
        const globeLeft = globeWrapper.offsetLeft || 8;
        const globeTop = globeWrapper.offsetTop || headerHeight + 8;
        const globeRight = globeLeft + globeWidth;
        
        // در موبایل: کارت کنار کره (همردیف از بالا) - 5px فاصله از سمت راست کره
        if (isMobile) {
          const gapFromGlobe = 5; // 5 پیکسل از سمت راست کره
          const gapFromRight = 8; // فاصله از سمت راست نمایشگر
          const cardLeft = globeRight + gapFromGlobe;
          const cardRight = gapFromRight;
          
          containerRef.current.style.top = `${globeTop}px`; // همردیف با کره از بالا
          containerRef.current.style.left = `${cardLeft}px`;
          containerRef.current.style.right = `${cardRight}px`;
          containerRef.current.style.width = 'auto';
          containerRef.current.style.maxWidth = 'none';
        } else if (isTablet) {
          // در تبلت: کارت کنار کره (همردیف از بالا) - سمت راست کره
          const gapFromGlobe = 10; // 10 پیکسل از سمت راست کره
          const gapFromRight = 8; // فاصله از سمت راست نمایشگر
          const cardLeft = globeRight + gapFromGlobe;
          const cardRight = gapFromRight;
          
          containerRef.current.style.top = `${globeTop}px`; // همردیف با کره از بالا
          containerRef.current.style.left = `${cardLeft}px`;
          containerRef.current.style.right = `${cardRight}px`;
          containerRef.current.style.width = 'auto';
          containerRef.current.style.maxWidth = 'none';
          
          // بررسی اینکه آیا 6 ستون در یک ردیف جا می‌شه یا نه
          const container = containerRef.current.querySelector('.indicators-unified-container');
          if (container) {
            // ابتدا یک ردیف 6 تایی رو امتحان می‌کنیم
            container.style.gridTemplateColumns = 'repeat(6, 1fr)';
            container.style.gridTemplateRows = '1fr';
            
            // بررسی بعد از render
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                const containerRect = container.getBoundingClientRect();
                const firstItem = container.querySelector('.pair-item');
                if (firstItem) {
                  const firstItemRect = firstItem.getBoundingClientRect();
                  const itemWidth = firstItemRect.width;
                  const containerWidth = containerRect.width;
                  const gap = parseFloat(getComputedStyle(container).gap) || 4;
                  const padding = parseFloat(getComputedStyle(container).paddingLeft) || 6;
                  
                  // محاسبه: آیا 6 آیتم با gap ها جا می‌شه؟
                  const totalWidthNeeded = (itemWidth * 6) + (gap * 5) + (padding * 2);
                  
                  if (totalWidthNeeded > containerWidth || itemWidth < 50) {
                    // جا نمی‌شه - 2 ردیف 3 تایی
                    container.style.gridTemplateColumns = 'repeat(3, 1fr)';
                    container.style.gridTemplateRows = 'repeat(2, 1fr)';
                  } else {
                    // جا می‌شه - یک ردیف 6 تایی
                    container.style.gridTemplateColumns = 'repeat(6, 1fr)';
                    container.style.gridTemplateRows = '1fr';
                  }
                }
              });
            });
          }
        } else {
          // در دسکتاپ: کارت کنار کره (همردیف)
          const gap = 16;
        const cardLeft = globeLeft + globeWidth + gap;
          const cardRight = globeLeft;
        
        containerRef.current.style.top = `${headerHeight + 8}px`;
        containerRef.current.style.left = `${cardLeft}px`;
        containerRef.current.style.right = `${cardRight}px`;
          containerRef.current.style.width = 'auto';
          containerRef.current.style.maxWidth = 'none';
        }
        
        // ارتفاع بر اساس محتوا
        containerRef.current.style.height = 'auto';
        if (!isMobile && !isTablet) {
          containerRef.current.style.minHeight = `${globeHeight}px`;
        }
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
        {/* فقط 6 جفت ارز */}
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


