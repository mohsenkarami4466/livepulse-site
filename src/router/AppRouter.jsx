/**
 * ============================================
 * 🗺️ کامپوننت AppRouter - AppRouter.jsx
 * ============================================
 * 
 * این کامپوننت مسیریابی (Routing) اپلیکیشن را مدیریت می‌کند.
 * از React Router برای SPA (Single Page Application) استفاده می‌کند.
 * 
 * وابستگی‌ها:
 * - Routes, Route: از react-router-dom برای تعریف مسیرها
 * - Pages: تمام صفحات اپلیکیشن (Home, News, Globe, Tutorial, Relax, Tools)
 * 
 * مسیرها:
 * - / → Home (صفحه خانه)
 * - /news → News (صفحه اخبار)
 * - /globe → Globe (صفحه کره‌ها)
 * - /tutorial → Tutorial (صفحه آموزش)
 * - /relax → Relax (صفحه آرامش)
 * - /tools → Tools (صفحه ابزارها)
 * 
 * تاریخ ایجاد: 2025-12-06
 * آخرین بروزرسانی: 2025-12-06
 */

import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ScrollToTop from '../components/ScrollToTop'

// Import صفحات
import Home from '../pages/Home/Home'
import News from '../pages/News/News'
import Globe from '../pages/Globe/Globe'
import Tutorial from '../pages/Tutorial/Tutorial'
import Relax from '../pages/Relax/Relax'
import Tools from '../pages/Tools/Tools'

/**
 * کامپوننت AppRouter
 * 
 * این کامپوننت تمام مسیرهای اپلیکیشن را تعریف می‌کند.
 * هر Route یک path و element (کامپوننت صفحه) دارد.
 */
function AppRouter() {
  /**
   * Render: تعریف مسیرها
   * 
   * هر Route یک path و element دارد.
   * React Router بر اساس URL فعلی، کامپوننت مناسب را رندر می‌کند.
   */
  return (
    <>
      {/* کامپوننت ScrollToTop برای اسکرول به بالای صفحه با هر تغییر مسیر */}
      <ScrollToTop />
      
    <Routes>
      {/* صفحه خانه - مسیر اصلی */}
      <Route path="/" element={<Home />} />
      
      {/* صفحه اخبار */}
      <Route path="/news" element={<News />} />
      
      {/* صفحه کره‌ها */}
      <Route path="/globe" element={<Globe />} />
      
      {/* صفحه آموزش */}
      <Route path="/tutorial" element={<Tutorial />} />
      
      {/* صفحه آرامش */}
      <Route path="/relax" element={<Relax />} />
      
      {/* صفحه ابزارها */}
      <Route path="/tools" element={<Tools />} />
    </Routes>
    </>
  )
}

export default AppRouter

