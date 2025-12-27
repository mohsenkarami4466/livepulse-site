import React, { useEffect, useRef, useState } from 'react'
import './FloatingDock.css'

/**
 * FloatingDock: دکمه سیار واحد برای صفحات و کره‌ها
 *
 * Props:
 * - mode: 'page' | 'globe'
 * - menuItems: [{ id, label, icon, onClick }]
 * - storageKey: کلید ذخیره موقعیت در localStorage
 * - containerRef: ref اختیاری برای محدود کردن درگ در container (مثلاً داخل مودال کره)
 * - icon: آیکن دکمه اصلی (پیش‌فرض: ☰ برای pages، ⚙️ برای globe)
 */
function FloatingDock({
  mode = 'page',
  menuItems = [],
  storageKey = 'floatingDockPos',
  containerRef = null,
  icon
}) {
  const btnRef = useRef(null)
  const menuRef = useRef(null)
  const containerRectRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [pos, setPos] = useState({ left: 20, top: 200 })
  const dragState = useRef({
    dragging: false,
    startX: 0,
    startY: 0,
    initialLeft: 0,
    initialTop: 0,
    moved: false
  })

  const resolveContainerRect = () => {
    if (containerRef && containerRef.current) {
      return containerRef.current.getBoundingClientRect()
    }
    return {
      left: 0,
      top: 0,
      width: window.innerWidth,
      height: window.innerHeight
    }
  }

  // Load position from storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (typeof parsed.left === 'number' && typeof parsed.top === 'number') {
          setPos(parsed)
        }
      }
    } catch (e) {
      // ignore
    }
  }, [storageKey])

  // Update style when pos changes
  useEffect(() => {
    const el = btnRef.current
    if (!el) return
    
    // بررسی اینکه آیا containerRef موجود است و modal باز است
    const container = containerRef && containerRef.current
    let isVisible = true
    
    if (container) {
      // بررسی style های container برای تشخیص باز بودن modal
      const parentModal = container.closest('.globe-modal')
      if (parentModal) {
        const modalStyle = window.getComputedStyle(parentModal)
        isVisible = modalStyle.display !== 'none' && 
                   modalStyle.visibility !== 'hidden' && 
                   modalStyle.opacity !== '0' &&
                   parseInt(modalStyle.zIndex) > 0
      }
    }
    
    el.style.left = `${pos.left}px`
    el.style.top = `${pos.top}px`
    el.style.right = 'auto'
    el.style.bottom = 'auto'
    el.style.display = isVisible ? 'block' : 'none'
    el.style.visibility = isVisible ? 'visible' : 'hidden'
    el.style.opacity = isVisible ? '1' : '0'
    el.style.pointerEvents = isVisible ? 'auto' : 'none'
    // z-index را همیشه بالا نگه دار حتی اگر modal بسته است
    el.style.zIndex = '10050'
  }, [pos, containerRef])

  // Ensure container rect cached
  useEffect(() => {
    // Update container rect when containerRef changes or on mount
    containerRectRef.current = resolveContainerRect()
    const handleResize = () => {
      containerRectRef.current = resolveContainerRect()
      const clamped = clampPos(pos.left, pos.top)
      if (clamped.left !== pos.left || clamped.top !== pos.top) {
        setPos(clamped)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [containerRef]) // فقط containerRef - pos را حذف کردیم تا از loop جلوگیری شود

  const clampPos = (left, top) => {
    const rect = containerRectRef.current || resolveContainerRect()
    const el = btnRef.current
    if (!el) return { left, top }
    const w = el.offsetWidth || 60
    const h = el.offsetHeight || 60
    const maxLeft = rect.width - w - 10
    const maxTop = rect.height - h - 10
    return {
      left: Math.max(10, Math.min(left, maxLeft)),
      top: Math.max(10, Math.min(top, maxTop))
    }
  }

  const snapToEdge = (left, top) => {
    const rect = containerRectRef.current || resolveContainerRect()
    const el = btnRef.current
    const w = el ? el.offsetWidth || 60 : 60
    const centerX = left + w / 2
    const snapLeft = centerX < rect.width / 2
    return {
      left: snapLeft ? 15 : rect.width - w - 15,
      top
    }
  }

  const applySnapTransition = () => {
    const el = btnRef.current
    if (el) {
      el.style.transition = 'all 0.28s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      setTimeout(() => {
        if (el) el.style.transition = ''
      }, 320)
    }
  }

  const savePos = (p) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(p))
    } catch (e) {
      // ignore
    }
  }

  const startDrag = (clientX, clientY) => {
    const el = btnRef.current
    if (!el) return
    
    // بررسی visibility قبل از شروع drag
    const container = containerRef && containerRef.current
    if (container) {
      const parentModal = container.closest('.globe-modal')
      if (parentModal) {
        const modalStyle = window.getComputedStyle(parentModal)
        const isVisible = modalStyle.display !== 'none' && 
                         modalStyle.visibility !== 'hidden' && 
                         modalStyle.opacity !== '0' &&
                         parseInt(modalStyle.zIndex) > 0
        if (!isVisible) {
          console.warn('FloatingDock: modal بسته است - drag لغو شد')
          return
        }
      }
    }
    
    containerRectRef.current = resolveContainerRect()
    const rect = el.getBoundingClientRect()
    dragState.current = {
      dragging: true,
      startX: clientX,
      startY: clientY,
      initialLeft: rect.left - (containerRectRef.current?.left || 0),
      initialTop: rect.top - (containerRectRef.current?.top || 0),
      moved: false
    }
    el.classList.add('floating-dock-dragging')
    setIsOpen(false)
  }

  const moveDrag = (clientX, clientY) => {
    if (!dragState.current.dragging) return
    const deltaX = clientX - dragState.current.startX
    const deltaY = clientY - dragState.current.startY
    if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
      dragState.current.moved = true
    }
    const next = clampPos(
      dragState.current.initialLeft + deltaX,
      dragState.current.initialTop + deltaY
    )
    setPos(next)
  }

  const endDrag = () => {
    if (!dragState.current.dragging) return
    dragState.current.dragging = false
    const el = btnRef.current
    if (el) el.classList.remove('floating-dock-dragging')
    const currentRect = el?.getBoundingClientRect()
    const currentLeft = currentRect ? currentRect.left - (containerRectRef.current?.left || 0) : pos.left
    const currentTop = currentRect ? currentRect.top - (containerRectRef.current?.top || 0) : pos.top
    const snapped = snapToEdge(currentLeft, currentTop)
    const clamped = clampPos(snapped.left, snapped.top)
    applySnapTransition()
    setPos(clamped)
    savePos(clamped)
  }

  const handleMouseDown = (e) => {
    e.preventDefault()
    startDrag(e.clientX, e.clientY)
    const handleMove = (ev) => moveDrag(ev.clientX, ev.clientY)
    const handleUp = () => {
      endDrag()
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleUp)
    }
    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleUp)
  }

  const handleTouchStart = (e) => {
    const t = e.touches[0]
    if (!t) return
    e.preventDefault()
    e.stopPropagation()
    startDrag(t.clientX, t.clientY)
    const handleMove = (ev) => {
      const touch = ev.touches[0]
      if (touch) moveDrag(touch.clientX, touch.clientY)
    }
    const handleEnd = () => {
      const moved = dragState.current.moved
      endDrag()
      document.removeEventListener('touchmove', handleMove, { passive: false })
      document.removeEventListener('touchend', handleEnd, { passive: false })
      if (!moved) {
        handleTap()
      }
    }
    document.addEventListener('touchmove', handleMove, { passive: false })
    document.addEventListener('touchend', handleEnd, { passive: false })
  }

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.stopImmediatePropagation && typeof e.stopImmediatePropagation === 'function') {
      e.stopImmediatePropagation()
    }
    
    // بررسی visibility قبل از click
    const container = containerRef && containerRef.current
    if (container) {
      const parentModal = container.closest('.globe-modal')
      if (parentModal) {
        const modalStyle = window.getComputedStyle(parentModal)
        const isVisible = modalStyle.display !== 'none' && 
                         modalStyle.visibility !== 'hidden' && 
                         modalStyle.opacity !== '0' &&
                         parseInt(modalStyle.zIndex) > 0
        if (!isVisible) {
          console.warn('FloatingDock: modal بسته است - click لغو شد')
          return
        }
      }
    }
    
    if (!dragState.current.moved) {
      setIsOpen((v) => !v)
    }
  }

  const handleTap = () => {
    if (!dragState.current.moved) {
      setIsOpen((v) => !v)
    }
  }

  // بستن منو با Escape key
  useEffect(() => {
    if (!isOpen) return
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  // Clamp position after load/mount to avoid off-screen (mobile/tablet)
  // همچنین update container rect وقتی containerRef تغییر می‌کند
  useEffect(() => {
    containerRectRef.current = resolveContainerRect()
    const clamped = clampPos(pos.left, pos.top)
    if (clamped.left !== pos.left || clamped.top !== pos.top) {
      setPos(clamped)
    }
  }, [pos.left, pos.top, containerRef])

  const mainIcon = icon || (mode === 'globe' ? '⚙️' : '☰')

  // Debug: بررسی menuItems (فقط در development)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const log = window.logger || { info: console.log }
      log.info('FloatingDock: menuItems:', menuItems)
      log.info('FloatingDock: تعداد آیتم‌ها:', menuItems.length)
      log.info('FloatingDock: containerRef:', containerRef?.current ? 'موجود است' : 'موجود نیست')
    }
  }, [menuItems, containerRef])

  const menuStyle = {
    position: 'fixed',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 10060
  }

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10059,
    background: 'transparent'
  }

  // تنظیم event listener برای touchstart با passive: false
  useEffect(() => {
    const btn = btnRef.current
    if (!btn) return
    
    const handleTouchStartDirect = (e) => {
      handleTouchStart(e)
    }
    
    btn.addEventListener('touchstart', handleTouchStartDirect, { passive: false })
    
    return () => {
      btn.removeEventListener('touchstart', handleTouchStartDirect, { passive: false })
    }
  }, [])

  // تنظیم event listener برای overlay و منو در موبایل
  useEffect(() => {
    if (!isOpen) return
    
    const overlay = document.querySelector('.floating-dock-overlay')
    const menu = menuRef.current
    
    const handleOverlayTouch = (e) => {
      e.preventDefault()
      e.stopPropagation()
      setIsOpen(false)
    }
    
    const handleMenuTouch = (e) => {
      e.stopPropagation()
    }
    
    // Event listener برای دکمه‌های منو
    const handleItemTouch = (e) => {
      const button = e.target.closest('.floating-dock-item')
      if (button) {
        e.preventDefault()
        e.stopPropagation()
        // شبیه‌سازی کلیک
        button.click()
      }
    }
    
    if (overlay) {
      overlay.addEventListener('touchstart', handleOverlayTouch, { passive: false })
      overlay.addEventListener('touchend', handleOverlayTouch, { passive: false })
    }
    
    if (menu) {
      menu.addEventListener('touchstart', handleMenuTouch, { passive: false })
      menu.addEventListener('touchend', handleItemTouch, { passive: false })
    }
    
    return () => {
      if (overlay) {
        overlay.removeEventListener('touchstart', handleOverlayTouch, { passive: false })
        overlay.removeEventListener('touchend', handleOverlayTouch, { passive: false })
      }
      if (menu) {
        menu.removeEventListener('touchstart', handleMenuTouch, { passive: false })
        menu.removeEventListener('touchend', handleItemTouch, { passive: false })
      }
    }
  }, [isOpen])

  return (
    <>
      <div
        ref={btnRef}
        className={`floating-dock ${isOpen ? 'open' : ''}`}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
      >
        <div className="floating-dock-btn">
          <span className="floating-dock-icon">{mainIcon}</span>
        </div>
      </div>
      {isOpen && (
        <>
          {/* Overlay برای جلوگیری از کلیک روی المان‌های زیرین */}
          <div
            className="floating-dock-overlay"
            style={overlayStyle}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsOpen(false)
            }}
          />
          {/* منو */}
          <div
            ref={menuRef}
            className="floating-dock-menu"
            style={menuStyle}
            onClick={(e) => {
              // جلوگیری از بسته شدن منو با کلیک روی خود منو
              e.stopPropagation()
            }}
          >
            {menuItems.map((item) => {
              const handleItemClick = (e) => {
                e.preventDefault()
                e.stopPropagation()
                if (e.stopImmediatePropagation && typeof e.stopImmediatePropagation === 'function') {
                  e.stopImmediatePropagation()
                }
                
                console.log('FloatingDock: دکمه کلیک شد:', item.id, item.label)
                
                // جلوگیری از بسته شدن منو توسط event listener
                const menu = menuRef.current
                if (menu) {
                  menu.setAttribute('data-clicking', 'true')
                }
                
                // اول onClick رو اجرا کن (navigate)
                if (item.onClick) {
                  console.log('FloatingDock: اجرای onClick برای:', item.id)
                  try {
                    // اجرای navigate
                    item.onClick()
                    console.log('FloatingDock: onClick (navigate) اجرا شد')
                  } catch (error) {
                    console.error('FloatingDock: خطا در onClick:', error)
                  }
                } else {
                  console.warn('FloatingDock: onClick تعریف نشده برای:', item.id)
                }
                
                // بستن منو بلافاصله بعد از navigate
                setIsOpen(false)
                
                // حذف attribute بعد از تاخیر کوتاه
                setTimeout(() => {
                  if (menu) {
                    menu.removeAttribute('data-clicking')
                  }
                }, 100)
              }
              
              return (
                <button
                  key={item.id}
                  className="floating-dock-item"
                  type="button"
                  onClick={handleItemClick}
                >
                  <span className="floating-dock-item-icon">{item.icon || '•'}</span>
                  <span className="floating-dock-item-label">{item.label}</span>
                </button>
              )
            })}
          </div>
        </>
      )}
    </>
  )
}

export default FloatingDock

