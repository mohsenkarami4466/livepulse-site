import React, { useState } from 'react'
import Modal from './Modal'
import './SubscriptionModal.css'

function SubscriptionModal({ isOpen, onClose }) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)

  const handleSubscribe = async (plan) => {
    setSelectedPlan(plan)
    setIsLoading(true)
    
    const log = window.logger || { debug: () => {}, error: () => {} }
    
    try {
      // TODO: اتصال به API واقعی برای پرداخت
      // فعلاً فقط شبیه‌سازی
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // ذخیره اشتراک (در حالت واقعی باید از API بیاید)
      localStorage.setItem('user-subscription', plan)
      localStorage.setItem('subscription-date', new Date().toISOString())
      
      log.debug('Subscription successful:', plan)
      
      // نمایش پیام موفقیت
      alert(`✅ اشتراک ${plan === 'free' ? 'پایه' : 'پیشرفته'} با موفقیت فعال شد!`)
      
    if (onClose) onClose()
      
      // رفرش صفحه برای اعمال تغییرات
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (err) {
      log.error('Subscription error:', err)
      alert('❌ خطا در فعال‌سازی اشتراک. لطفاً دوباره تلاش کنید.')
    } finally {
      setIsLoading(false)
      setSelectedPlan(null)
    }
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
              <button 
                className="btn-secondary" 
                onClick={() => handleSubscribe('free')}
                disabled={isLoading}
              >
                {isLoading && selectedPlan === 'free' ? 'در حال فعال‌سازی...' : 'انتخاب'}
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
              <button 
                className="btn-primary" 
                onClick={() => handleSubscribe('premium')}
                disabled={isLoading}
              >
                {isLoading && selectedPlan === 'premium' ? 'در حال فعال‌سازی...' : 'انتخاب'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default SubscriptionModal

