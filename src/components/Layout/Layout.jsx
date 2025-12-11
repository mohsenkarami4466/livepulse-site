/**
 * ============================================
 * 🏗️ کامپوننت Layout - Layout.jsx
 * ============================================
 * 
 * این کامپوننت ساختار اصلی Layout اپلیکیشن را می‌سازد.
 * شامل: Header, Indicators, GlobeClock, Main Content, BottomNavigation, AssistiveTouch, Globe Modals
 * 
 * وابستگی‌ها:
 * - useNavigate: از react-router-dom برای ناوبری
 * - Header: کامپوننت هدر
 * - BottomNavigation: نوار ناوبری پایین
 * - GlobeClock: کره کوچک ساعت بازار
 * - IndicatorsContainer: شاخص‌های لحظه‌ای
 * - FinancialGlobeModal: مودال کره مالی
 * - ResourcesGlobeModal: مودال کره منابع
 * - AssistiveTouch: دکمه سیار
 * 
 * عملکرد:
 * - مدیریت state برای Globe Modals
 * - هماهنگی با vanilla JS برای باز کردن Globe Modals
 * - در معرض قرار دادن window.navigate برای vanilla JS
 * 
 * تاریخ ایجاد: 2025-12-06
 * آخرین بروزرسانی: 2025-12-06
 */

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { addEventListener, removeEventListener, events, getLogger, ensureReactOnWindow } from '../../utils/dom-bridge'
import Header from '../Header/Header'
import BottomNavigation from '../BottomNavigation/BottomNavigation'
import GlobeClock from '../Globes/GlobeClock'
import IndicatorsContainer from '../Indicators/IndicatorsContainer'
import PortfolioSummary from '../Portfolio/PortfolioSummary'
import FinancialGlobeModal from '../Globes/FinancialGlobeModal'
import ResourcesGlobeModal from '../Globes/ResourcesGlobeModal'
import Globe3DModal from '../Globes/Globe3DModal'
import FloatingDock from '../FloatingDock/FloatingDock'
import Footer from '../Footer/Footer'
import MarketHoursModal from '../Modals/MarketHoursModal'
import GlobalSections from '../Shared/GlobalSections'
import './Layout.css'

/**
 * کامپوننت Layout
 * 
 * Props:
 * - children: محتوای صفحات که از AppRouter می‌آید
 * 
 * State:
 * - isFinancialGlobeOpen: وضعیت باز/بسته بودن مودال کره مالی
 * - isResourcesGlobeOpen: وضعیت باز/بسته بودن مودال کره منابع
 * 
 * Effects:
 * - تنظیم window.navigate برای استفاده vanilla JS
 * - گوش دادن به event های باز شدن Globe Modals
 */
function Layout({ children }) {
  // Hook های React
  const navigate = useNavigate() // برای ناوبری بین صفحات
  
  // State برای مدیریت Globe Modals در سطح Layout
  const [isFinancialGlobeOpen, setIsFinancialGlobeOpen] = React.useState(false)
  const [isResourcesGlobeOpen, setIsResourcesGlobeOpen] = React.useState(false)
  
  // State برای کره‌های 3D
  const [open3DGlobeType, setOpen3DGlobeType] = React.useState(null)
  
  // State برای Market Hours Modal (gcModal)
  const [isMarketHoursModalOpen, setIsMarketHoursModalOpen] = React.useState(false)
  const dockMenuItems = React.useMemo(() => ([
    { id: 'home', label: 'خانه', icon: '🏠', onClick: () => navigate('/') },
    { id: 'news', label: 'اخبار', icon: '📰', onClick: () => navigate('/news') },
    { id: 'globe', label: 'کره‌ها', icon: '🌍', onClick: () => navigate('/globe') },
    { id: 'tutorial', label: 'آموزش', icon: '📚', onClick: () => navigate('/tutorial') },
    { id: 'relax', label: 'آرامش', icon: '🧘', onClick: () => navigate('/relax') },
    { id: 'tools', label: 'ابزارها', icon: '🛠️', onClick: () => navigate('/tools') }
  ]), [navigate])

  /**
   * Effect: هماهنگی با vanilla JS
   * 
   * این effect:
   * 1. window.navigate را در معرض قرار می‌دهد تا vanilla JS بتواند از React Router استفاده کند
   * 2. به event های باز شدن Globe Modals گوش می‌دهد
   * 3. هنگام unmount، event listener ها و window.navigate را پاک می‌کند
   * 
   * نکته مهم:
   * - window.navigate باید قبل از لود شدن vanilla JS تنظیم شود
   * - این برای backward compatibility با کدهای vanilla JS است
   */
  React.useEffect(() => {
    // Handler های باز شدن Globe Modals
    const handleFinancialGlobeOpen = () => setIsFinancialGlobeOpen(true)
    const handleResourcesGlobeOpen = () => setIsResourcesGlobeOpen(true)
    const handleMarketHoursOpen = () => setIsMarketHoursModalOpen(true)
    
    // در معرض قرار دادن window.navigate برای vanilla JS
    // این برای backward compatibility با کدهای vanilla JS است
    if (typeof window !== 'undefined') {
      // تنظیم window.navigate - باید قبل از لود شدن vanilla JS باشد
      window.navigate = (path) => {
        const log = getLogger()
        log.debug('🔍 window.navigate called with path:', path)
        navigate(path)
      }
      
      // اطمینان از اینکه window.React موجود است (برای تشخیص React Router)
      ensureReactOnWindow(React)
      
      // گوش دادن به event های باز شدن Globe Modals از vanilla JS
      addEventListener(events.financialGlobeOpen, handleFinancialGlobeOpen)
      addEventListener(events.resourcesGlobeOpen, handleResourcesGlobeOpen)
      addEventListener(events.marketHoursOpen, handleMarketHoursOpen)
      
      // Override توابع vanilla JS برای استفاده از React state
      // این برای سازگاری با script-globes.js است
      const log = getLogger()
      window.openFinancialGlobe = () => {
        log.debug('🔍 window.openFinancialGlobe called - opening via React')
        // بررسی checkLoginRequired اگر موجود باشد
        if (typeof window.checkLoginRequired === 'function') {
          if (!window.checkLoginRequired()) {
            log.warn('⚠️ کاربر لاگین نیست - کره مالی باز نشد')
            return
          }
        }
        setIsFinancialGlobeOpen(true)
        // Dispatch event هم برای backward compatibility
        window.dispatchEvent(new Event('financialGlobeOpen'))
      }
      
      window.openResourcesGlobe = () => {
        log.debug('🔍 window.openResourcesGlobe called - opening via React')
        setIsResourcesGlobeOpen(true)
        // Dispatch event هم برای backward compatibility
        window.dispatchEvent(new Event('resourcesGlobeOpen'))
      }
      
      // همچنین می‌توانیم مستقیماً window.openMarketHoursModal را تنظیم کنیم
      // این برای استفاده از handleSmallGlobeClick در script-globes.js است
      window.openMarketHoursModal = () => setIsMarketHoursModalOpen(true)
      
      // Override open3DGlobe برای استفاده از React state
      window.open3DGlobe = (type) => {
        log.debug(`🔍 window.open3DGlobe called with type: ${type}`)
        setOpen3DGlobeType(type)
      }
      
      log.debug('✅ window.navigate تنظیم شد')
    }
    
    // Cleanup: پاک کردن event listener ها و window.navigate هنگام unmount
    return () => {
      if (typeof window !== 'undefined') {
        delete window.navigate
        removeEventListener(events.financialGlobeOpen, handleFinancialGlobeOpen)
        removeEventListener(events.resourcesGlobeOpen, handleResourcesGlobeOpen)
        removeEventListener(events.marketHoursOpen, handleMarketHoursOpen)
        delete window.openMarketHoursModal
      }
    }
  }, [navigate])

  /**
   * Render: ساختار Layout
   * 
   * ترتیب المان‌ها:
   * 1. Header: هدر اصلی
   * 2. IndicatorsContainer: شاخص‌های لحظه‌ای (طلا، دلار، یورو، بیت‌کوین، نفت، نزدک)
   * 3. GlobeClock: کره کوچک ساعت بازار (fixed position - top left)
   * 4. Main Content: محتوای صفحات (children از AppRouter)
   * 5. BottomNavigation: نوار ناوبری پایین
   * 6. AssistiveTouch: دکمه سیار (fixed position)
   * 7. Globe Modals: مودال‌های کره‌های بزرگ (conditionally rendered)
   */
  return (
    <div className="layout">
      {/* هدر اصلی */}
      <Header />
      
      {/* شاخص‌های لحظه‌ای (جفت ارزها) - نمایش داده می‌شود در همه صفحات */}
      <IndicatorsContainer />
      
      {/* کارت مجموع دارایی‌ها - فقط برای کاربران با اشتراک */}
      <PortfolioSummary />
      
      {/* کره کوچک ساعت بازار - نمایش داده می‌شود در همه صفحات */}
      <GlobeClock />
      
      {/* محتوای اصلی صفحات */}
      <main className="layout-main">
        {children}
      </main>
      
      {/* نوار ناوبری پایین */}
      <BottomNavigation />
      
      {/* بخش‌های مشترک (تحلیل AI، اخبار، چت) */}
      <GlobalSections />
      
      {/* دکمه سیار - نمایش داده می‌شود در همه صفحات */}
      <FloatingDock
        mode="page"
        storageKey="floatingDockPos-page"
        menuItems={dockMenuItems}
      />
      
      {/* مودال‌های کره‌های بزرگ - همیشه render می‌شوند اما hidden هستند تا vanilla JS بتواند آن‌ها را پیدا کند */}
        {isFinancialGlobeOpen && (
        <FinancialGlobeModal 
          isOpen={isFinancialGlobeOpen} 
          onClose={() => setIsFinancialGlobeOpen(false)} 
        />
        )}
        {isResourcesGlobeOpen && (
        <ResourcesGlobeModal 
          isOpen={isResourcesGlobeOpen} 
          onClose={() => setIsResourcesGlobeOpen(false)} 
        />
        )}
      
      {/* مودال‌های کره‌های 3D - همیشه render می‌شوند اما hidden هستند */}
      {open3DGlobeType && (
      <Globe3DModal 
          type={open3DGlobeType} 
          isOpen={Boolean(open3DGlobeType)} 
        onClose={() => setOpen3DGlobeType(null)} 
      />
      )}
      
      {/* Market Hours Modal (gcModal) - باز می‌شود با کلیک روی کره کوچک */}
      {isMarketHoursModalOpen && (
      <MarketHoursModal
        isOpen={isMarketHoursModalOpen}
        onClose={() => setIsMarketHoursModalOpen(false)}
      />
      )}
      
      {/* Footer - نمایش داده می‌شود در همه صفحات */}
      <Footer />
    </div>
  )
}

export default Layout

