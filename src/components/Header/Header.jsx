import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../contexts/AppContext'
import LoginModal from '../Modals/LoginModal'
import './Header.css'

function Header() {
  const navigate = useNavigate()
  const { currentTheme, setTheme } = useApp()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  useEffect(() => {
    // اعمال theme به body
    document.body.setAttribute('data-theme', currentTheme)
  }, [currentTheme])

  useEffect(() => {
    // Setup theme toggle
    const themeToggle = document.getElementById('themeToggle')
    if (themeToggle) {
      const handleThemeToggle = () => {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
      }

      themeToggle.addEventListener('click', handleThemeToggle)
      return () => themeToggle.removeEventListener('click', handleThemeToggle)
    }
  }, [currentTheme, setTheme])

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

  const handleLoginClick = () => {
    setIsLoginModalOpen(true)
    // هماهنگی با کد vanilla JS
    if (typeof window !== 'undefined' && window.openLoginModal) {
      window.openLoginModal()
    }
  }

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
          <button className="login-btn" id="loginBtn" onClick={handleLoginClick}>ورود</button>
        </div>
      </div>
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </header>
  )
}

export default Header

