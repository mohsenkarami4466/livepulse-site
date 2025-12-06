import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Header.css'

function Header() {
  const navigate = useNavigate()

  useEffect(() => {
    // Setup theme toggle
    const themeToggle = document.getElementById('themeToggle')
    if (themeToggle) {
      const handleThemeToggle = () => {
        const currentTheme = document.body.getAttribute('data-theme') || 'light'
        const newTheme = currentTheme === 'light' ? 'dark' : 'light'
        document.body.setAttribute('data-theme', newTheme)
        
        // ذخیره در localStorage
        if (window.stateManager) {
          window.stateManager.set('currentTheme', newTheme)
        } else if (localStorage) {
          localStorage.setItem('livepulse-theme', newTheme)
        }
      }

      themeToggle.addEventListener('click', handleThemeToggle)
      return () => themeToggle.removeEventListener('click', handleThemeToggle)
    }
  }, [])

  useEffect(() => {
    // Setup fullscreen toggle
    const fullscreenToggle = document.getElementById('fullscreenToggle')
    if (fullscreenToggle) {
      const handleFullscreenToggle = () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(err => {
            console.error('خطا در ورود به حالت تمام صفحه:', err)
          })
        } else {
          document.exitFullscreen()
        }
      }

      fullscreenToggle.addEventListener('click', handleFullscreenToggle)
      return () => fullscreenToggle.removeEventListener('click', handleFullscreenToggle)
    }
  }, [])

  useEffect(() => {
    // Setup login button
    const loginBtn = document.getElementById('loginBtn')
    if (loginBtn) {
      const handleLoginClick = () => {
        // TODO: پیاده‌سازی login modal
        console.log('Login clicked')
      }

      loginBtn.addEventListener('click', handleLoginClick)
      return () => loginBtn.removeEventListener('click', handleLoginClick)
    }
  }, [])

  const handleLogoClick = () => {
    navigate('/')
  }

  return (
    <header className="glass-header">
      <div className="header-container">
        {/* لوگو و نام سایت */}
        <div className="logo-section" id="homeLogo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <div className="logo">LP</div>
          <h1 className="site-name">LivePulse.ir</h1>
        </div>

        {/* منوی کنترلی سمت چپ */}
        <div className="control-menu">
          {/* دکمه‌های کنترلی */}
          <div className="theme-toggle-center">
            <button className="theme-toggle" id="themeToggle">
              <span className="theme-icon">🌙</span>
            </button>
            <button className="fullscreen-toggle" id="fullscreenToggle" title="تمام صفحه">
              <span className="fullscreen-icon">⛶</span>
            </button>
          </div>
          
          {/* دکمه ورود */}
          <button className="login-btn" id="loginBtn">ورود</button>
        </div>
      </div>
    </header>
  )
}

export default Header

