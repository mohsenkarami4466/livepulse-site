/**
 * ============================================
 * 🔐 کامپوننت LoginModal - LoginModal.jsx
 * ============================================
 * 
 * این کامپوننت مودال ورود به حساب کاربری را نمایش می‌دهد.
 * 
 * وابستگی‌ها:
 * - Modal: کامپوننت پایه مودال
 * 
 * Props:
 * - isOpen: وضعیت باز/بسته بودن مودال
 * - onClose: تابع بستن مودال
 * 
 * عملکرد:
 * - نمایش فرم ورود (ایمیل/موبایل و رمز عبور)
 * - ارسال فرم ورود (پیاده‌سازی شده - آماده برای اتصال به API)
 * - لینک‌های فراموشی رمز و ثبت‌نام
 * 
 * تاریخ ایجاد: 2025-12-06
 * آخرین بروزرسانی: 2025-12-06
 */

import React, { useState } from 'react'
import Modal from './Modal'
import './LoginModal.css'

/**
 * کامپوننت LoginModal
 * 
 * @param {boolean} isOpen - وضعیت باز/بسته بودن مودال
 * @param {Function} onClose - تابع بستن مودال
 */
function LoginModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    const log = window.logger || { debug: () => {}, error: () => {} }
    
    try {
      // TODO: اتصال به API واقعی
      // فعلاً فقط validation و شبیه‌سازی
      if (!email || !password) {
        setError('لطفاً تمام فیلدها را پر کنید')
        setIsLoading(false)
        return
      }
      
      // شبیه‌سازی درخواست API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // ذخیره وضعیت ورود (در حالت واقعی باید از API بیاید)
      localStorage.setItem('user-logged-in', 'true')
      localStorage.setItem('user-email', email)
      
      log.debug('Login successful:', email)
      
      // بستن مودال و رفرش صفحه
    if (onClose) onClose()
      window.location.reload()
    } catch (err) {
      log.error('Login error:', err)
      setError('خطا در ورود. لطفاً دوباره تلاش کنید.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      id="loginModal"
      className="login-modal"
    >
      <div className="modal-layout">
        <button className="close-modal" id="closeLoginModal" onClick={onClose}>
          ×
        </button>
        <div className="modal-sidebar">
          <h2>ورود به حساب کاربری</h2>
          <p>برای دسترسی به تمام امکانات وارد شوید</p>
        </div>
        <div className="modal-main-content">
          <form className="login-form" onSubmit={handleLogin}>
            {error && (
              <div className="form-error" style={{ 
                color: 'var(--accent-red)', 
                padding: '12px', 
                background: 'rgba(220, 38, 38, 0.1)', 
                borderRadius: '8px', 
                marginBottom: '16px' 
              }}>
                {error}
              </div>
            )}
            <div className="form-group">
              <label>ایمیل یا شماره موبایل</label>
              <input 
                type="text" 
                placeholder="ایمیل یا شماره موبایل" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <label>رمز عبور</label>
              <input 
                type="password" 
                placeholder="رمز عبور" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                disabled={isLoading}
              />
            </div>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'در حال ورود...' : 'ورود'}
            </button>
            <div className="form-footer">
              <a href="#" className="link">رمز عبور را فراموش کرده‌اید؟</a>
              <a href="#" className="link">ثبت‌نام کنید</a>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  )
}

export default LoginModal

