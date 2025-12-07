/**
 * ============================================
 * 💰 کامپوننت PriceModal - PriceModal.jsx
 * ============================================
 * 
 * این کامپوننت مودال جزئیات قیمت را نمایش می‌دهد.
 * 
 * وابستگی‌ها:
 * - Modal: کامپوننت پایه مودال
 * 
 * Props:
 * - isOpen: وضعیت باز/بسته بودن مودال
 * - onClose: تابع بستن مودال
 * - item: آیتم قیمت شامل name, symbol, price, change
 * 
 * عملکرد:
 * - نمایش نام و نماد قیمت
 * - نمایش قیمت فعلی
 * - نمایش تغییرات 24 ساعته
 * - نمایش نمودار قیمت (TODO: پیاده‌سازی)
 * 
 * تاریخ ایجاد: 2025-12-06
 * آخرین بروزرسانی: 2025-12-06
 */

import React from 'react'
import Modal from './Modal'
import './PriceModal.css'

/**
 * کامپوننت PriceModal
 * 
 * @param {boolean} isOpen - وضعیت باز/بسته بودن مودال
 * @param {Function} onClose - تابع بستن مودال
 * @param {object} item - آیتم قیمت
 */
function PriceModal({ isOpen, onClose, item }) {
  if (!item) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      id="priceModal"
      className="price-modal"
    >
      <div className="modal-layout">
        <button className="close-modal" id="closePriceModal" onClick={onClose}>
          ×
        </button>
        <div className="modal-sidebar">
          <h2>{item.name}</h2>
          <p className="price-symbol">{item.symbol}</p>
        </div>
        <div className="modal-main-content">
          <div className="price-details">
            <div className="price-main">
              <span className="price-label">قیمت فعلی</span>
              <span className="price-value">{item.price?.toLocaleString('fa-IR')}</span>
            </div>
            <div className="price-change">
              <span className={`change-value ${item.change >= 0 ? 'positive' : 'negative'}`}>
                {item.change >= 0 ? '+' : ''}{item.change?.toFixed(2)}%
              </span>
              <span className="change-label">تغییر 24 ساعته</span>
            </div>
            <div className="price-chart">
              {/* TODO: Add chart component */}
              <p>نمودار قیمت در اینجا نمایش داده می‌شود</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default PriceModal

