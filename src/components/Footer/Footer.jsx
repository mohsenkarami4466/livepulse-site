/**
 * ============================================
 * 🔻 کامپوننت Footer - Footer.jsx
 * ============================================
 * 
 * این کامپوننت فوتر اصلی اپلیکیشن را نمایش می‌دهد.
 * شامل: لینک‌های فوتر (نظرات، قوانین، درباره ما، تماس با ما), اطلاعات تماس, کپی‌رایت
 * 
 * وابستگی‌ها:
 * - window.openFeedbackModal: تابع باز کردن مودال نظرات (از script-ui.js)
 * 
 * عملکرد:
 * - نمایش لینک‌های فوتر
 * - باز کردن مودال نظرات با کلیک روی "نظرات"
 * - نمایش اطلاعات تماس و کپی‌رایت
 * 
 * تاریخ ایجاد: 2025-12-06
 * آخرین بروزرسانی: 2025-12-06
 */

import React from 'react'
import './Footer.css'

/**
 * کامپوننت Footer
 * 
 * این کامپوننت فوتر را در پایین تمام صفحات نمایش می‌دهد.
 */
function Footer() {
  /**
   * Handler: کلیک روی لینک نظرات
   * 
   * این تابع مودال نظرات را باز می‌کند.
   */
  const handleFeedbackClick = (e) => {
    e.preventDefault()
    // استفاده از تابع موجود در vanilla JS
    if (typeof window !== 'undefined' && window.openFeedbackModal) {
      window.openFeedbackModal()
    } else {
      // Fallback: پیدا کردن مودال و نمایش آن
      const feedbackModal = document.getElementById('feedbackModal')
      if (feedbackModal) {
        feedbackModal.classList.add('active')
      }
    }
  }

  /**
   * Render: ساختار فوتر
   * 
   * شامل:
   * - لینک‌های فوتر (نظرات، قوانین، درباره ما، تماس با ما)
   * - اطلاعات تماس (ایمیل و تلفن)
   * - کپی‌رایت
   */
  return (
    <footer className="main-footer">
      <div className="footer-content">
        {/* لینک‌های فوتر */}
        <div className="footer-links">
          <a href="#" id="footerFeedback" onClick={handleFeedbackClick}>
            💌 نظرات
          </a>
          <a href="#">قوانین</a>
          <a href="#">درباره ما</a>
          <a href="#">تماس با ما</a>
        </div>
        
        {/* اطلاعات تماس و کپی‌رایت */}
        <div className="footer-info">
          <p>📧 info@livepulse.ir | 📞 +98 912 345 6789</p>
          <p className="copyright">© 2024 LivePulse.ir</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

