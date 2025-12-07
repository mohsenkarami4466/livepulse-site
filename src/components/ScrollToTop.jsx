/**
 * ============================================
 * ⬆️ کامپوننت ScrollToTop - ScrollToTop.jsx
 * ============================================
 * 
 * این کامپوننت با تغییر مسیر (route)، صفحه را به بالای صفحه اسکرول می‌کند.
 * 
 * وابستگی‌ها:
 * - useLocation: از react-router-dom برای تشخیص تغییر مسیر
 * - useEffect: برای اسکرول هنگام تغییر مسیر
 * 
 * عملکرد:
 * - گوش دادن به تغییرات location
 * - اسکرول به بالای صفحه هنگام تغییر مسیر
 * 
 * تاریخ ایجاد: 2025-12-06
 * آخرین بروزرسانی: 2025-12-06
 */

import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * کامپوننت ScrollToTop
 * 
 * این کامپوننت با هر تغییر مسیر، صفحه را به بالای صفحه اسکرول می‌کند.
 * 
 * Effects:
 * - اسکرول به بالای صفحه هنگام تغییر location.pathname
 */
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // اسکرول به بالای صفحه با هر تغییر مسیر - بدون انیمیشن برای سرعت بیشتر
    window.scrollTo(0, 0)
    
    // همچنین scrollTop را برای body و html تنظیم کن
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [pathname])

  return null // این کامپوننت چیزی render نمی‌کند
}

export default ScrollToTop

