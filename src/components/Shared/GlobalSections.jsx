/**
 * ============================================
 * 🌐 کامپوننت GlobalSections - GlobalSections.jsx
 * ============================================
 * 
 * این کامپوننت بخش‌های مشترک همه صفحات را نمایش می‌دهد.
 * شامل: تحلیل AI، اخبار، چت با هوش مصنوعی
 * 
 * وابستگی‌ها:
 * - window.updateAIAnalysis: تابع به‌روزرسانی تحلیل AI (از script-main.js)
 * - window.updateNewsList: تابع به‌روزرسانی لیست اخبار (از script-main.js)
 * - window.setupAIChat: تابع راه‌اندازی چت AI (از script-main.js)
 * 
 * عملکرد:
 * - نمایش تحلیل AI
 * - نمایش لیست اخبار
 * - نمایش چت با هوش مصنوعی
 * 
 * تاریخ ایجاد: 2025-12-06
 * آخرین بروزرسانی: 2025-12-06
 */

import React, { useEffect } from 'react'
import './GlobalSections.css'

/**
 * کامپوننت GlobalSections
 * 
 * Effects:
 * - راه‌اندازی تحلیل AI
 * - راه‌اندازی لیست اخبار
 * - راه‌اندازی چت AI
 */
function GlobalSections() {
  useEffect(() => {
    // راه‌اندازی بخش‌های مشترک با vanilla JS
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        // به‌روزرسانی تحلیل AI
        if (typeof window.updateAIAnalysis === 'function') {
          window.updateAIAnalysis()
        }
        
        // به‌روزرسانی لیست اخبار
        if (typeof window.updateNewsList === 'function') {
          window.updateNewsList()
        }
        
        // راه‌اندازی چت AI
        if (typeof window.setupAIChat === 'function') {
          window.setupAIChat()
        }
      }, 500)
    }
  }, [])

  return (
    <>
      {/* 📰 بخش تحلیل و اخبار - کوچک‌تر */}
      <section className="global-section analysis-section-compact">
        <div className="analysis-container-compact">
          <div className="ai-analysis-mini glass-card">
            <h4>🤖 تحلیل AI</h4>
            <p id="aiAnalysisText">بازار امروز با نوسانات ملایم همراه است.</p>
          </div>
          <div className="news-mini glass-card">
            <h4>📰 اخبار</h4>
            <div className="news-list-mini" id="newsList">
              <span>• نفت ↑</span>
              <span>• طلا →</span>
              <span>• بورس ↑</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* 💬 بخش چت هوشمند - نوار باریک */}
      <section className="global-section ai-chat-section">
        <div className="ai-chat-bar glass-card" id="aiChatBar">
          <div className="chat-bar-header" id="aiChatFab">
            <span className="chat-bar-icon">💬</span>
            <span className="chat-bar-title">دستیار هوشمند</span>
            <span className="chat-bar-status">آنلاین</span>
            <span className="chat-bar-toggle">▼</span>
          </div>
          <div className="chat-bar-content" id="chatBarContent">
            <div className="chat-messages-compact" id="chatMessages">
              <div className="ai-message">
                <p>سلام! من دستیار هوشمند LivePulse هستم. چطور می‌تونم کمکتون کنم؟</p>
              </div>
            </div>
            <div className="chat-input-compact">
              <input type="text" id="chatInput" placeholder="سوال خود را بپرسید..." />
              <button id="sendMessage">↑</button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default GlobalSections

