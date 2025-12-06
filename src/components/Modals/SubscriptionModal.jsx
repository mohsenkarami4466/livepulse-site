import React from 'react'
import Modal from './Modal'
import './SubscriptionModal.css'

function SubscriptionModal({ isOpen, onClose }) {
  const handleSubscribe = (plan) => {
    // TODO: Implement subscription logic
    console.log('Subscribe to plan:', plan)
    if (onClose) onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      id="subscriptionModal"
      className="subscription-modal"
    >
      <div className="modal-layout">
        <button className="close-modal" id="closeSubscriptionModal" onClick={onClose}>
          ×
        </button>
        <div className="modal-sidebar">
          <h2>اشتراک ویژه</h2>
          <p>دسترسی به تمام امکانات</p>
        </div>
        <div className="modal-main-content">
          <div className="subscription-plans">
            <div className="plan-card">
              <h3>پایه</h3>
              <div className="plan-price">رایگان</div>
              <ul className="plan-features">
                <li>✅ دسترسی به قیمت‌ها</li>
                <li>✅ نمودارهای پایه</li>
              </ul>
              <button className="btn-secondary" onClick={() => handleSubscribe('free')}>
                انتخاب
              </button>
            </div>
            <div className="plan-card featured">
              <h3>پیشرفته</h3>
              <div className="plan-price">۹۹,۰۰۰ تومان/ماه</div>
              <ul className="plan-features">
                <li>✅ تمام امکانات پایه</li>
                <li>✅ نمودارهای پیشرفته</li>
                <li>✅ هشدارهای لحظه‌ای</li>
              </ul>
              <button className="btn-primary" onClick={() => handleSubscribe('premium')}>
                انتخاب
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default SubscriptionModal

