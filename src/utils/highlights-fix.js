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
      // پاکسازی همه استایل‌های قبلی که ممکن است تداخل ایجاد کنند
      section.style.removeProperty('position')
      section.style.removeProperty('top')
      section.style.removeProperty('left')
      section.style.removeProperty('right')
      section.style.removeProperty('width')
      section.style.removeProperty('z-index')
      section.style.removeProperty('margin')
      section.style.removeProperty('padding-left')
      section.style.removeProperty('padding-right')
      section.style.removeProperty('padding-top')
      section.style.removeProperty('padding-bottom')
      section.style.removeProperty('box-sizing')

      // تنظیم استایل‌های پایه برای نمایش صحیح
      section.style.display = 'flex'
      section.style.visibility = 'visible'
      section.style.opacity = '1'
      section.style.overflow = 'visible'
      section.style.clip = 'auto'
      section.style.clipPath = 'none'
      section.style.transform = 'none'
    }
  })

  console.log(`✅ Highlights simplified positioning applied to ${highlightsSections.length} sections`)
  return

  // تنظیم highlights-container
  const highlightsContainers = document.querySelectorAll('.highlights-container')
  highlightsContainers.forEach(container => {
    if (container) {
      container.style.display = 'flex'
      container.style.flexDirection = 'row'
      container.style.justifyContent = 'flex-start'
      container.style.alignItems = 'center'
      container.style.visibility = 'visible'
      container.style.opacity = '1'
      container.style.width = '100%'
      container.style.gap = '10px'
      container.style.flexWrap = 'nowrap'
      container.style.overflow = 'visible'
    }
  })

  // تنظیم highlight-circle ها
  const circles = document.querySelectorAll('.highlight-circle')
  circles.forEach(circle => {
    if (circle) {
      circle.style.display = 'flex'
      circle.style.visibility = 'visible'
      circle.style.opacity = '1'
      circle.style.width = 'auto'
      circle.style.minWidth = '70px'
      circle.style.maxWidth = '140px'
      circle.style.height = '60px'
      circle.style.alignItems = 'center'
      circle.style.justifyContent = 'center'
      circle.style.flex = '0 0 auto'
      circle.style.flexShrink = '0'
      circle.style.flexGrow = '0'
      circle.style.borderRadius = '12px'
      circle.style.padding = '8px 16px'
      circle.style.fontSize = 'clamp(0.7rem, 1.1vw, 0.85rem)'
      circle.style.lineHeight = '1.3'
      circle.style.whiteSpace = 'nowrap'
      circle.style.textAlign = 'center'
      circle.style.overflow = 'visible'
      circle.style.boxSizing = 'border-box'
    }
  })

  console.log('✅ Highlights simplified - containers and circles fixed')
}

  // اجرای خودکار بعد از load شدن صفحه
if (typeof window !== 'undefined') {
  // اجرای فوری و مکرر
  const runFix = () => {
    forceShowHighlights()
  }

  // اجرای فوری
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      runFix()
      setTimeout(runFix, 50)
      setTimeout(runFix, 100)
      setTimeout(runFix, 200)
      setTimeout(runFix, 500)
      setTimeout(runFix, 1000)
      setTimeout(runFix, 2000)
    })
  } else {
    runFix()
    setTimeout(runFix, 50)
    setTimeout(runFix, 100)
    setTimeout(runFix, 200)
    setTimeout(runFix, 500)
    setTimeout(runFix, 1000)
    setTimeout(runFix, 2000)
  }

  // اجرا بعد از هر تغییر route
  let lastPathname = window.location.pathname
  const observer = new MutationObserver(() => {
    if (window.location.pathname !== lastPathname) {
      lastPathname = window.location.pathname
      runFix()
      setTimeout(runFix, 100)
      setTimeout(runFix, 500)
      setTimeout(runFix, 1000)
    }
    runFix()
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class']
  })

  // اجرا بعد از تغییر اندازه صفحه
  window.addEventListener('resize', () => {
    setTimeout(runFix, 100)
  })

  // اجرای مداوم هر 2 ثانیه
  const interval = setInterval(runFix, 2000)

  // اضافه کردن به window برای دسترسی از جاهای دیگر
  window.forceShowHighlights = forceShowHighlights

  // Cleanup
  window.addEventListener('beforeunload', () => {
    clearInterval(interval)
    observer.disconnect()
  })
}

