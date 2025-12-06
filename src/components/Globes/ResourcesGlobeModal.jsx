import React, { useEffect, useRef } from 'react'
import './GlobeModal.css'

function ResourcesGlobeModal({ isOpen, onClose }) {
  const modalRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (isOpen && containerRef.current) {
      // استفاده از کلاس ResourcesGlobe موجود
      if (typeof window !== 'undefined' && window.ResourcesGlobe) {
        const resourcesGlobe = new window.ResourcesGlobe()
        resourcesGlobe.init('naturalResourcesGlobeContainer')
        
        // ذخیره instance برای cleanup
        return () => {
          if (resourcesGlobe && resourcesGlobe.destroy) {
            resourcesGlobe.destroy()
          }
        }
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div 
      className="globe-modal active" 
      id="naturalResourcesGlobeModal"
      ref={modalRef}
      onClick={(e) => {
        if (e.target === modalRef.current) {
          onClose()
        }
      }}
    >
      <div className="globe-modal-content">
        <div className="globe-modal-header">
          <h2>💎 کره منابع - طلا، نفت، گاز</h2>
          <button className="globe-modal-close" onClick={onClose}>×</button>
        </div>
        <div 
          id="naturalResourcesGlobeContainer" 
          ref={containerRef}
          className="globe-container"
        ></div>
      </div>
    </div>
  )
}

export default ResourcesGlobeModal

