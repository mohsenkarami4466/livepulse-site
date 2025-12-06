import React, { useEffect, useRef } from 'react'
import './GlobeModal.css'

function FinancialGlobeModal({ isOpen, onClose }) {
  const modalRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (isOpen && containerRef.current) {
      // استفاده از کلاس FinancialGlobe موجود
      if (typeof window !== 'undefined' && window.FinancialGlobe) {
        const financialGlobe = new window.FinancialGlobe()
        financialGlobe.init('financialGlobeContainer')
        
        // ذخیره instance برای cleanup
        return () => {
          if (financialGlobe && financialGlobe.destroy) {
            financialGlobe.destroy()
          }
        }
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div 
      className="globe-modal active" 
      id="financialGlobeModal"
      ref={modalRef}
      onClick={(e) => {
        if (e.target === modalRef.current) {
          onClose()
        }
      }}
    >
      <div className="globe-modal-content">
        <div className="globe-modal-header">
          <h2>🌍 کره مالی - ساعت بازارها</h2>
          <button className="globe-modal-close" onClick={onClose}>×</button>
        </div>
        <div 
          id="financialGlobeContainer" 
          ref={containerRef}
          className="globe-container"
        ></div>
      </div>
    </div>
  )
}

export default FinancialGlobeModal

