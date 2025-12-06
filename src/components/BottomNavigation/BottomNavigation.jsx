import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './BottomNavigation.css'

const navItems = [
  { page: 'home', icon: '🏠', text: 'خانه', path: '/' },
  { page: 'news', icon: '📰', text: 'اخبار', path: '/news' },
  { page: 'globe', icon: '🌍', text: 'کره‌ها', path: '/globe' },
  { page: 'tutorial', icon: '📚', text: 'آموزش', path: '/tutorial' },
  { page: 'relax', icon: '🧘', text: 'آرامش', path: '/relax' },
  { page: 'tools', icon: '🛠️', text: 'ابزارها', path: '/tools' }
]

function BottomNavigation() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleNavClick = (path, page) => {
    // جلوگیری از navigate اگر در همان صفحه هستیم
    if (location.pathname === path) {
      return
    }
    
    navigate(path)
  }

  // تشخیص active page از pathname
  const getActivePage = () => {
    const path = location.pathname
    if (path === '/') return 'home'
    return path.slice(1) // حذف '/' اول
  }

  const activePage = getActivePage()

  return (
    <nav className="bottom-nav-bar" id="bottomNavBar">
      {navItems.map((item) => (
        <button
          key={item.page}
          className={`nav-item ${activePage === item.page ? 'active' : ''}`}
          data-page={item.page}
          title={item.text}
          onClick={() => handleNavClick(item.path, item.page)}
          onTouchStart={(e) => {
            // بهبود UX برای touch
            e.currentTarget.style.opacity = '0.7'
          }}
          onTouchEnd={(e) => {
            e.currentTarget.style.opacity = '1'
          }}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-text">{item.text}</span>
        </button>
      ))}
    </nav>
  )
}

export default BottomNavigation

