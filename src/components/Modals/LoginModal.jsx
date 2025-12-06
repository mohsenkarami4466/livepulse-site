import React from 'react'
import Modal from './Modal'
import './LoginModal.css'

function LoginModal({ isOpen, onClose }) {
  const handleLogin = (e) => {
    e.preventDefault()
    // TODO: Implement login logic
    console.log('Login clicked')
    if (onClose) onClose()
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
            <div className="form-group">
              <label>ایمیل یا شماره موبایل</label>
              <input type="text" placeholder="ایمیل یا شماره موبایل" required />
            </div>
            <div className="form-group">
              <label>رمز عبور</label>
              <input type="password" placeholder="رمز عبور" required />
            </div>
            <button type="submit" className="btn-primary">
              ورود
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

