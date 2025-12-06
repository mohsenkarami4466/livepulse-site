import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../Header/Header'
import BottomNavigation from '../BottomNavigation/BottomNavigation'
import GlobeClock from '../Globes/GlobeClock'
import IndicatorsContainer from '../Indicators/IndicatorsContainer'
import FinancialGlobeModal from '../Globes/FinancialGlobeModal'
import ResourcesGlobeModal from '../Globes/ResourcesGlobeModal'
import AssistiveTouch from '../AssistiveTouch/AssistiveTouch'
import './Layout.css'

function Layout({ children }) {
  const navigate = useNavigate()
  
  // State for globe modals, managed at a higher level (Layout)
  const [isFinancialGlobeOpen, setIsFinancialGlobeOpen] = React.useState(false)
  const [isResourcesGlobeOpen, setIsResourcesGlobeOpen] = React.useState(false)

  React.useEffect(() => {
    // Listen for globe open events from vanilla JS
    const handleFinancialGlobeOpen = () => setIsFinancialGlobeOpen(true)
    const handleResourcesGlobeOpen = () => setIsResourcesGlobeOpen(true)
    
    // Expose navigate function to window for vanilla JS compatibility
    if (typeof window !== 'undefined') {
      window.navigate = (path) => {
        navigate(path)
      }
      
      window.addEventListener('financialGlobeOpen', handleFinancialGlobeOpen)
      window.addEventListener('resourcesGlobeOpen', handleResourcesGlobeOpen)
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        delete window.navigate
        window.removeEventListener('financialGlobeOpen', handleFinancialGlobeOpen)
        window.removeEventListener('resourcesGlobeOpen', handleResourcesGlobeOpen)
      }
    }
  }, [navigate])

  return (
    <div className="layout">
      <Header />
      {/* Indicators - شاخص‌های لحظه‌ای */}
      <IndicatorsContainer />
      {/* Globe Clock - در همه صفحات نمایش داده می‌شود */}
      <GlobeClock />
      <main className="layout-main">
        {children}
      </main>
      <BottomNavigation />
      {/* Assistive Touch - دکمه سیار */}
      <AssistiveTouch />
      {/* Globe Modals are now part of the Layout and conditionally rendered */}
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
    </div>
  )
}

export default Layout

