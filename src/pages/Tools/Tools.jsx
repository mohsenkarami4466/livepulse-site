import React, { useState } from 'react'
import { useApp } from '../../contexts/AppContext'
import './Tools.css'

const tools = [
  { id: 'personalFund', name: 'صندوق', icon: '💰' },
  { id: 'goldTool', name: 'طلا', icon: '🥇' },
  { id: 'silverTool', name: 'نقره', icon: '🥈' },
  { id: 'diamondTool', name: 'الماس', icon: '💎' },
  { id: 'gemTool', name: 'سنگ', icon: '💠' },
  { id: 'coinTool', name: 'سکه', icon: '🪙' },
  { id: 'currencyTool', name: 'تبدیل ارز', icon: '💱' }
]

function Tools() {
  const { currentTool, setTool } = useApp()
  const [activeTool, setActiveTool] = useState(currentTool || 'personalFund')

  const handleToolClick = (toolId) => {
    setActiveTool(toolId)
    setTool(toolId)
    
    // استفاده از تابع موجود برای هماهنگی
    if (typeof window !== 'undefined' && window.activateTool) {
      window.activateTool(toolId)
    }
  }

  return (
    <div id="toolsView" className="view active-view" style={{ display: 'block' }}>
      {/* Highlights Section */}
      <section className="highlights-section tools-highlights">
        <div className="highlights-container">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className={`highlight-circle ${activeTool === tool.id ? 'active' : ''}`}
              data-tool={tool.id}
              onClick={() => handleToolClick(tool.id)}
            >
              <span>{tool.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Tools Content */}
      <main className="tools-content">
        {/* Personal Fund Section */}
        <div className={`tool-section ${activeTool === 'personalFund' ? 'active-tool' : ''}`} id="personalFundSection">
          <div className="personal-fund-container">
            <div className="fund-header">
              <h2>💰 صندوق سرمایه شخصی</h2>
              <p>مدیریت و نظارت بر تمام دارایی‌های مالی شما در یک نگاه</p>
            </div>
            
            <div className="fund-content">
              <div className="fund-total-card glass-card">
                <div className="total-header">
                  <span className="total-label">💎 ارزش کل سرمایه</span>
                  <span className="live-badge">🔴 لحظه‌ای</span>
                </div>
                <div className="total-value" id="totalPortfolioValue">۰</div>
                <div className="total-currency">تومان</div>
                <div className="total-change positive" id="portfolioChange">
                  <span>+۰٪</span>
                  <small>نسبت به دیروز</small>
                </div>
              </div>

              <div className="assets-list glass-card">
                <h3>📋 دارایی‌های من</h3>
                <div className="assets-grid" id="assetsGrid">
                  <div className="empty-assets">
                    <span>📦</span>
                    <p>هنوز دارایی ثبت نکردی</p>
                    <small>از فرم پایین دارایی اضافه کن</small>
                  </div>
                </div>
              </div>
              
              <div className="add-asset-form glass-card">
                <h3>➕ افزودن دارایی</h3>
                <form className="asset-form" id="portfolioAssetForm">
                  <div className="form-row">
                    <div className="form-group">
                      <label>نوع بازار</label>
                      <select id="marketType" className="form-select">
                        <option value="">انتخاب کنید...</option>
                        <optgroup label="ارزهای دیجیتال">
                          <option value="BTC">بیت‌کوین (BTC)</option>
                          <option value="ETH">اتریوم (ETH)</option>
                          <option value="USDT">تتر (USDT)</option>
                        </optgroup>
                        <optgroup label="طلا و فلزات">
                          <option value="GOLD18">طلای ۱۸ عیار</option>
                          <option value="GOLD24">طلای ۲۴ عیار</option>
                          <option value="COIN">سکه امامی</option>
                        </optgroup>
                        <optgroup label="ارز">
                          <option value="USD">دلار آمریکا</option>
                          <option value="EUR">یورو</option>
                          <option value="GBP">پوند انگلیس</option>
                        </optgroup>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>مقدار</label>
                      <input type="number" id="assetAmount" className="form-input" placeholder="مقدار" />
                    </div>
                  </div>
                  <button type="button" className="btn-primary" onClick={() => {
                    if (typeof window !== 'undefined' && window.addAssetToPortfolio) {
                      window.addAssetToPortfolio()
                    }
                  }}>
                    ➕ افزودن دارایی
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Gold Tool Section */}
        <div className={`tool-section ${activeTool === 'goldTool' ? 'active-tool' : ''}`} id="goldToolSection">
          <div className="tool-card glass-card">
            <h3>🥇 محاسبه قیمت طلا</h3>
            <div className="tool-form">
              <div className="form-group">
                <label>وزن (گرم)</label>
                <input type="number" id="goldWeight" className="form-input" placeholder="مثلاً 10" />
              </div>
              <div className="form-group">
                <label>عیار</label>
                <select id="goldCarat" className="form-select">
                  <option value="24">۲۴ عیار</option>
                  <option value="18">۱۸ عیار</option>
                  <option value="14">۱۴ عیار</option>
                </select>
              </div>
              <div className="form-group">
                <label>اجرت (%)</label>
                <input type="number" id="goldWage" className="form-input" placeholder="مثلاً 5" defaultValue="0" />
              </div>
              <button 
                type="button" 
                className="btn-primary" 
                onClick={() => {
                  if (typeof window !== 'undefined' && window.calculateGoldPrice) {
                    window.calculateGoldPrice()
                  }
                }}
              >
                🧮 محاسبه
              </button>
              <div id="goldResult" className="tool-result"></div>
            </div>
          </div>
        </div>

        {/* Currency Converter Section */}
        <div className={`tool-section ${activeTool === 'currencyTool' ? 'active-tool' : ''}`} id="currencyToolSection">
          <div className="tool-card glass-card">
            <h3>💱 تبدیل ارز</h3>
            <div className="tool-form">
              <div className="form-row">
                <div className="form-group">
                  <label>از</label>
                  <select id="fromCurrency" className="form-select">
                    <option value="IRR">ریال ایران</option>
                    <option value="USD">دلار آمریکا</option>
                    <option value="EUR">یورو</option>
                    <option value="GBP">پوند</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>به</label>
                  <select id="toCurrency" className="form-select">
                    <option value="USD">دلار آمریکا</option>
                    <option value="EUR">یورو</option>
                    <option value="GBP">پوند</option>
                    <option value="IRR">ریال ایران</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>مبلغ</label>
                <input type="number" id="amount" className="form-input" placeholder="مبلغ را وارد کنید" />
              </div>
              <button 
                type="button" 
                className="btn-primary" 
                onClick={() => {
                  if (typeof window !== 'undefined' && window.convertCurrency) {
                    window.convertCurrency()
                  }
                }}
              >
                🔄 تبدیل
              </button>
              <div id="conversionResult" className="tool-result"></div>
            </div>
          </div>
        </div>

        {/* Other Tools - Placeholder */}
        <div className={`tool-section ${activeTool === 'silverTool' ? 'active-tool' : ''}`} id="silverToolSection">
          <div className="tool-card glass-card">
            <h3>🥈 محاسبه قیمت نقره</h3>
            <p>در حال توسعه...</p>
          </div>
        </div>

        <div className={`tool-section ${activeTool === 'diamondTool' ? 'active-tool' : ''}`} id="diamondToolSection">
          <div className="tool-card glass-card">
            <h3>💎 آنالیز الماس</h3>
            <div className="tool-form">
              <div className="form-group">
                <label>عکس الماس</label>
                <input type="file" id="diamondImage" accept="image/*" className="form-input" />
              </div>
              <button 
                type="button" 
                className="btn-primary" 
                onClick={() => {
                  if (typeof window !== 'undefined' && window.analyzeDiamond) {
                    window.analyzeDiamond()
                  }
                }}
              >
                🔍 آنالیز
              </button>
              <div id="diamondResult" className="tool-result"></div>
            </div>
          </div>
        </div>

        <div className={`tool-section ${activeTool === 'gemTool' ? 'active-tool' : ''}`} id="gemToolSection">
          <div className="tool-card glass-card">
            <h3>💠 آنالیز سنگ قیمتی</h3>
            <p>در حال توسعه...</p>
          </div>
        </div>

        <div className={`tool-section ${activeTool === 'coinTool' ? 'active-tool' : ''}`} id="coinToolSection">
          <div className="tool-card glass-card">
            <h3>🪙 محاسبه قیمت سکه</h3>
            <p>در حال توسعه...</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Tools
