/**
 * فیکس قوی برای نمایش هایلایت‌ها
 * این فایل مطمئن می‌شود که هایلایت‌ها همیشه نمایش داده می‌شوند
 */

export function forceShowHighlights() {
  // پیدا کردن view فعال
  const activeView = document.querySelector('.view, #homeView, #newsView, #toolsView, #tutorialView, #relaxView, #globeView')
  
  if (!activeView) {
    console.warn('⚠️ هیچ view فعالی پیدا نشد!')
    return
  }
  
  // پیدا کردن همه highlights-section ها با selector های مختلف
  const selectors = [
    '.highlights-section',
    '.home-highlights',
    '.news-highlights',
    '.tools-highlights',
    '.education-highlights',
    '.relax-highlights',
    '.globe-highlights',
    'section.highlights-section',
    '#homeView .highlights-section',
    '#newsView .highlights-section',
    '#toolsView .highlights-section',
    '#tutorialView .highlights-section',
    '#relaxView .highlights-section',
    '#globeView .highlights-section'
  ]
  
  let allSections = []
  selectors.forEach(selector => {
    const sections = document.querySelectorAll(selector)
    allSections.push(...Array.from(sections))
  })
  
  // حذف duplicates
  const uniqueSections = [...new Set(allSections)]
  
  // اگر highlights-section پیدا نشد، بررسی کن که آیا در view وجود دارد
  if (uniqueSections.length === 0) {
    console.warn('⚠️ هیچ highlights-section پیدا نشد! بررسی view...')
    const viewChildren = Array.from(activeView.children)
    console.log('Children of active view:', viewChildren.map(c => ({
      tagName: c.tagName,
      className: c.className,
      id: c.id
    })))
    
    // اگر highlights-section در view وجود ندارد اما باید وجود داشته باشد، warning بده
    const hasHighlights = viewChildren.some(child => 
      child.classList.contains('highlights-section') || 
      child.classList.contains('home-highlights') ||
      child.classList.contains('news-highlights') ||
      child.classList.contains('tools-highlights')
    )
    
    if (!hasHighlights) {
      console.error('❌ highlights-section در view وجود ندارد! این یک مشکل جدی است.')
      console.error('View ID:', activeView.id)
      console.error('View classes:', activeView.className)
    }
  }
  
  uniqueSections.forEach(section => {
    if (!section) return
    
    // اعمال استایل‌های اجباری با !important از طریق setProperty
    section.style.setProperty('display', 'flex', 'important')
    section.style.setProperty('visibility', 'visible', 'important')
    section.style.setProperty('opacity', '1', 'important')
    section.style.setProperty('position', 'relative', 'important')
    section.style.setProperty('z-index', '999', 'important')
    section.style.setProperty('width', 'calc(100% - 16px)', 'important')
    section.style.setProperty('min-width', 'calc(100% - 16px)', 'important')
    section.style.setProperty('max-width', 'calc(100% - 16px)', 'important')
    section.style.setProperty('height', '80px', 'important')
    section.style.setProperty('min-height', '80px', 'important')
    section.style.setProperty('margin-top', '25px', 'important')
    section.style.setProperty('margin-left', '8px', 'important')
    section.style.setProperty('margin-right', '8px', 'important')
    section.style.setProperty('margin-bottom', '20px', 'important')
    section.style.setProperty('padding', '0', 'important')
    section.style.setProperty('box-sizing', 'border-box', 'important')
    section.style.setProperty('overflow', 'visible', 'important')
    section.style.setProperty('clip', 'auto', 'important')
    section.style.setProperty('clip-path', 'none', 'important')
    section.style.setProperty('transform', 'none', 'important')
    
    // پیدا کردن highlights-container
    const container = section.querySelector('.highlights-container')
    if (container) {
      container.style.display = 'flex'
      container.style.flexDirection = 'row'
      container.style.justifyContent = 'flex-start'
      container.style.alignItems = 'center'
      container.style.visibility = 'visible'
      container.style.opacity = '1'
      container.style.width = '100%'
      container.style.minWidth = '100%'
      container.style.maxWidth = '100%'
      container.style.height = '80px'
      container.style.minHeight = '80px'
      container.style.padding = '0'
      container.style.margin = '0'
      container.style.gap = '10px'
      container.style.flexWrap = 'nowrap'
      container.style.boxSizing = 'border-box'
      container.style.overflow = 'visible'
    }
    
    // پیدا کردن همه highlight-circle ها
    const circles = section.querySelectorAll('.highlight-circle')
    circles.forEach(circle => {
      circle.style.display = 'flex'
      circle.style.visibility = 'visible'
      circle.style.opacity = '1'
      circle.style.width = 'auto' // عرض خودکار برای متن
      circle.style.minWidth = '70px'
      circle.style.maxWidth = '140px'
      circle.style.height = '60px'
      circle.style.minHeight = '60px'
      circle.style.flex = '0 0 auto' // عرض خودکار
      circle.style.flexShrink = '0'
      circle.style.flexGrow = '0'
      circle.style.alignItems = 'center'
      circle.style.justifyContent = 'center'
      circle.style.boxSizing = 'border-box'
      circle.style.position = 'relative'
      circle.style.margin = '0' // حذف margin - gap فاصله را ایجاد می‌کند
      circle.style.setProperty('border-radius', '12px', 'important')
      circle.style.setProperty('padding', '8px 16px', 'important')
      circle.style.setProperty('font-size', 'clamp(0.7rem, 1.1vw, 0.85rem)', 'important')
      circle.style.setProperty('line-height', '1.3', 'important')
      circle.style.setProperty('white-space', 'nowrap', 'important')
      circle.style.setProperty('text-align', 'center', 'important')
      circle.style.overflow = 'visible'
    })
  })
  
  console.log('✅ Highlights force-fixed:', uniqueSections.length, 'sections found')
  
  // اگر هیچ highlights پیدا نشد، warning بده
  if (uniqueSections.length === 0) {
    console.warn('⚠️ هیچ highlights-section در DOM پیدا نشد!')
    console.warn('🔍 بررسی DOM structure...')
    const views = document.querySelectorAll('.view, #homeView, #newsView, #toolsView')
    console.log('Views found:', views.length)
    views.forEach((view, index) => {
      console.log(`View ${index}:`, {
        id: view.id,
        className: view.className,
        children: view.children.length,
        innerHTML: view.innerHTML.substring(0, 200)
      })
    })
  }
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

