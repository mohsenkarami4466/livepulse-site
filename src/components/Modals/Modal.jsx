import React, { useEffect } from 'react'
import './Modal.css'

function Modal({ isOpen, onClose, children, id, className = '' }) {
  useEffect(() => {
    if (isOpen) {
      // جلوگیری از اسکرول body
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.height = '100%'
    } else {
      // بازگشت اسکرول
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.height = ''
    }

    return () => {
      // Cleanup
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.height = ''
    }
  }, [isOpen])

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      id={id}
      className={`modal-overlay ${className} ${isOpen ? 'active' : ''}`}
      onClick={handleOverlayClick}
    >
      <div className="modal-content">
        {children}
      </div>
    </div>
  )
}

export default Modal

