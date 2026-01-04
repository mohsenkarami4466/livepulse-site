/**
 * فیکس قوی برای نمایش هایلایت‌ها
 * این فایل مطمئن می‌شود که هایلایت‌ها همیشه نمایش داده می‌شوند
 */

export function forceShowHighlights() {
  console.log('🔍 forceShowHighlights called - simple positioning fix')

  // استفاده از positioning ساده CSS به جای fixed positioning پیچیده
  const highlightsSections = document.querySelectorAll('.highlights-section, .home-highlights, .news-highlights, .tools-highlights, .education-highlights, .relax-highlights, .globe-highlights')

  highlightsSections.forEach(section => {
    if (section) {
      // پاکسازی فقط استایل‌های مشکل‌ساز (نه همه)
      section.style.removeProperty('top')
      section.style.removeProperty('left')
      section.style.removeProperty('right')
      section.style.removeProperty('clip')
      section.style.removeProperty('clip-path')
      section.style.removeProperty('transform')

      // تنظیم استایل‌های پایه برای نمایش صحیح - حفظ استایل‌های جدید
      section.style.setProperty('display', 'flex', 'important')
      section.style.setProperty('visibility', 'visible', 'important')
      section.style.setProperty('opacity', '1', 'important')
      section.style.setProperty('overflow', 'visible', 'important')
      section.style.setProperty('position', 'relative', 'important')
      section.style.setProperty('z-index', '10', 'important') // بالاتر از view ها (1) اما پایین‌تر از fixed elements
      
      // عرض و margin با CSS و updateHighlightsPosition تنظیم می‌شوند - اینجا تغییر نمی‌دهیم
      // فقط استایل‌های مشکل‌ساز را پاک می‌کنیم
    }
  })

  // تنظیم highlights-container - فقط استایل‌های ضروری (نه width)
  const highlightsContainers = document.querySelectorAll('.highlights-container')
  highlightsContainers.forEach(container => {
    if (container) {
      container.style.setProperty('display', 'flex', 'important')
      container.style.setProperty('flex-direction', 'row', 'important')
      container.style.setProperty('justify-content', 'flex-start', 'important')
      container.style.setProperty('align-items', 'center', 'important')
      container.style.setProperty('visibility', 'visible', 'important')
      container.style.setProperty('opacity', '1', 'important')
      // عرض و اندازه‌ها با CSS تنظیم می‌شوند - اینجا تغییر نمی‌دهیم
      // Width and sizes are set by CSS - we don't change them here
      container.style.setProperty('gap', '5px', 'important') // gap ثابت 5px بین هایلایت‌ها
      container.style.setProperty('flex-wrap', 'nowrap', 'important')
      container.style.setProperty('overflow-x', 'auto', 'important') // برای scroll در صورت نیاز
      container.style.setProperty('overflow-y', 'hidden', 'important')
      container.style.setProperty('box-sizing', 'border-box', 'important')
      container.style.setProperty('padding', '0', 'important')
      // margin-top با updateHighlightsPosition تنظیم می‌شود - اینجا تغییر نمی‌دهیم
      // margin-top is set by updateHighlightsPosition - we don't change it here
      container.style.setProperty('margin-left', '0', 'important')
      container.style.setProperty('margin-right', '0', 'important')
      container.style.setProperty('margin-bottom', '0', 'important')
    }
  })

  // تنظیم highlight-circle ها - حفظ استایل‌های ریسپانسیو جدید
  const circles = document.querySelectorAll('.highlight-circle')
  const isMobile = window.innerWidth < 768
  const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024
  
  circles.forEach(circle => {
    if (circle) {
      circle.style.setProperty('display', 'flex', 'important')
      circle.style.setProperty('visibility', 'visible', 'important')
      circle.style.setProperty('opacity', '1', 'important')
      // عرض و flex با CSS تنظیم می‌شود - اینجا تغییر نمی‌دهیم
      // circle.style.setProperty('width', 'auto', 'important')
      // circle.style.setProperty('flex', '0 0 auto', 'important')
      // circle.style.setProperty('flex-shrink', '0', 'important')
      // circle.style.setProperty('flex-grow', '0', 'important')
      circle.style.setProperty('align-items', 'center', 'important')
      circle.style.setProperty('justify-content', 'center', 'important')
      circle.style.setProperty('border-radius', '12px', 'important')
      circle.style.setProperty('line-height', '1.3', 'important')
      circle.style.setProperty('white-space', 'nowrap', 'important')
      circle.style.setProperty('text-align', 'center', 'important')
      circle.style.setProperty('overflow', 'visible', 'important')
      circle.style.setProperty('box-sizing', 'border-box', 'important')
      circle.style.setProperty('margin', '0', 'important')
      
      // اندازه‌های ریسپانسیو با CSS تنظیم می‌شوند - اینجا تغییر نمی‌دهیم
      // فقط استایل‌های پایه را تنظیم می‌کنیم
    }
  })

  console.log(`✅ Highlights fixed - ${highlightsSections.length} sections, ${highlightsContainers.length} containers, ${circles.length} circles`)
}

  // اجرای خودکار بعد از load شدن صفحه
if (typeof window !== 'undefined') {
  // اجرای فوری و مکرر
  const runFix = () => {
    forceShowHighlights()
  }

  // اجرای فوری - فقط یکبار و با تاخیر محدود
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      runFix()
      setTimeout(runFix, 500) // فقط یکبار بعد از تاخیر
    })
  } else {
    runFix()
    setTimeout(runFix, 500) // فقط یکبار بعد از تاخیر
  }

  // حذف MutationObserver - باعث rebuild مداوم می‌شد
  // اجرا فقط یکبار بعد از load
  // حذف resize event - باعث تغییر width می‌شد
  // resize event removed - was causing width changes
  // let resizeTimeout = null
  // window.addEventListener('resize', () => {
  //   if (resizeTimeout) clearTimeout(resizeTimeout)
  //   resizeTimeout = setTimeout(() => {
  //     runFix() // فقط forceShowHighlights
  //     // updateHighlightsPosition در PortfolioSummary.jsx با resize فراخوانی می‌شود
  //   }, 300) // debounce
  // })

  // حذف setInterval - دیگر نیازی نیست
  // const interval = setInterval(runFix, 2000) // حذف شد

  // اضافه کردن به window برای دسترسی از جاهای دیگر
  window.forceShowHighlights = forceShowHighlights

  // Cleanup
  window.addEventListener('beforeunload', () => {
    if (resizeTimeout) clearTimeout(resizeTimeout)
  })
}

