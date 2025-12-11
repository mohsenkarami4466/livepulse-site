/**
 * ============================================
 * 🗂️ Context اصلی اپلیکیشن - AppContext.jsx
 * ============================================
 * 
 * این فایل Context اصلی اپلیکیشن را تعریف می‌کند.
 * برای مدیریت state سراسری در تمام کامپوننت‌ها استفاده می‌شود.
 * 
 * وابستگی‌ها:
 * - React: createContext, useContext, useState, useEffect, useCallback
 * 
 * State مدیریت شده:
 * - currentTheme: تم فعلی (light/dark)
 * - currentView: صفحه فعلی
 * - currentCategory: دسته‌بندی فعلی (home, crypto, currency, gold, ...)
 * - currentTool: ابزار فعلی (personalFund, goldTool, ...)
 * - openModals: تعداد مودال‌های باز
 * - userUsage: استفاده کاربر (chat, tools)
 * - globe: state مربوط به کره‌ها (financial, resources)
 * 
 * عملکرد:
 * - ذخیره state در localStorage
 * - بارگذاری state از localStorage
 * - هماهنگی با window.appState برای backward compatibility
 * - ایجاد stateManager برای استفاده vanilla JS
 * 
 * تاریخ ایجاد: 2025-12-06
 * آخرین بروزرسانی: 2025-12-06
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

/**
 * ایجاد Context اصلی
 * 
 * این Context برای دسترسی به state سراسری در تمام کامپوننت‌ها استفاده می‌شود.
 */
const AppContext = createContext()

/**
 * Hook برای استفاده از Context
 * 
 * این hook برای دسترسی به state و functions از Context استفاده می‌شود.
 * باید داخل AppProvider استفاده شود.
 * 
 * @returns {object} Context value شامل state و functions
 * @throws {Error} اگر خارج از AppProvider استفاده شود
 */
export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

/**
 * Provider Component
 * 
 * این کامپوننت تمام state و functions را در Context قرار می‌دهد.
 * باید در سطح بالا (App.jsx) استفاده شود.
 * 
 * @param {React.ReactNode} children - کامپوننت‌های فرزند
 */
export function AppProvider({ children }) {
  /**
   * State اصلی اپلیکیشن
   * 
   * این state شامل تمام اطلاعات سراسری اپلیکیشن است:
   * - UI State: theme, view, category, tool, modals
   * - User State: usage statistics, previous view
   * - Globe State: تنظیمات کره‌های مالی و منابع
   */
  const [state, setState] = useState({
    // UI State - وضعیت رابط کاربری
    currentTheme: 'dark', // تم پیش‌فرض: dark (می‌تواند light یا dark باشد)
    currentView: 'home', // صفحه فعلی (home, news, globe, tutorial, relax, tools)
    currentCategory: 'home', // دسته‌بندی فعلی (home, crypto, currency, gold, forex, stock, oil)
    currentTool: 'personalFund', // ابزار فعلی (personalFund, goldTool, silverTool, ...)
    openModals: 0, // تعداد مودال‌های باز
    maxModals: { home: 4, category: 2 }, // حداکثر تعداد مودال‌های مجاز
    
    // User State - وضعیت کاربر
    userUsage: { chat: 0, tools: 0 }, // آمار استفاده کاربر
    previousViewBeforeGlobe: null, // صفحه قبلی قبل از باز کردن کره (برای بازگشت)
    
    // Globe State - وضعیت کره‌ها
    globe: {
      // کره مالی - ساعت بازارها
      financial: {
        selectedCountry: null, // کشور انتخاب شده
        showBorders: true, // نمایش مرزها
        showMarkers: true // نمایش نشانگرها
      },
      // کره منابع - اطلاعات کشورها
      resources: {
        selectedCountry: null, // کشور انتخاب شده
        bordersGroup: null, // گروه مرزها (Three.js)
        conflictsGroup: null, // گروه درگیری‌ها (Three.js)
        tradeLinesGroup: null, // گروه خطوط تجاری (Three.js)
        labelsGroup: null, // گروه برچسب‌ها (Three.js)
        showBorders: true, // نمایش مرزها
        showConflicts: true, // نمایش درگیری‌ها
        showTradeLines: false, // نمایش خطوط تجاری
        showLabels: true, // نمایش برچسب‌ها
        tradeType: 'exports' // نوع تجارت (exports/imports)
      }
    }
  })

  // مقداردهی اولیه از localStorage و اعمال تم به body
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('livepulseState')
      let initialTheme = 'light' // تم پیش‌فرض: light (مطابق با index.html)
      
      if (savedState) {
        const parsed = JSON.parse(savedState)
        if (parsed.currentTheme) {
          initialTheme = parsed.currentTheme
        }
        setState(prev => ({ ...prev, ...parsed }))
      } else {
        // اگر state ذخیره شده‌ای وجود ندارد، تم پیش‌فرض را light قرار بده
        setState(prev => ({ ...prev, currentTheme: initialTheme }))
      }
      
      // اعمال تم به body بلافاصله
      if (typeof document !== 'undefined') {
        document.body.setAttribute('data-theme', initialTheme)
        document.documentElement.setAttribute('data-theme', initialTheme)
      }
    } catch (error) {
      const log = window.logger || { error: console.error }
      log.error('Error loading state from localStorage:', error)
      // در صورت خطا، تم پیش‌فرض را light قرار بده
      setState(prev => ({ ...prev, currentTheme: 'light' }))
      if (typeof document !== 'undefined') {
        document.body.setAttribute('data-theme', 'light')
        document.documentElement.setAttribute('data-theme', 'light')
      }
    }
  }, [])

  // ذخیره state در localStorage
  useEffect(() => {
    try {
      localStorage.setItem('livepulseState', JSON.stringify(state))
    } catch (error) {
      const log = window.logger || { error: console.error }
      log.error('Error saving state to localStorage:', error)
    }
  }, [state])

  // اعمال تم به body هر بار که theme تغییر کند
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.setAttribute('data-theme', state.currentTheme)
      document.documentElement.setAttribute('data-theme', state.currentTheme)
    }
  }, [state.currentTheme])

  // هماهنگی با window.appState برای backward compatibility
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.appState = state
      
      // ایجاد stateManager برای backward compatibility
      if (!window.stateManager) {
        window.stateManager = {
          get: (path) => {
            const keys = path.split('.')
            let value = state
            for (const key of keys) {
              value = value?.[key]
            }
            return value
          },
          set: (path, value) => {
            const keys = path.split('.')
            setState(prev => {
              const newState = { ...prev }
              let current = newState
              for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) {
                  current[keys[i]] = {}
                }
                current = current[keys[i]]
              }
              current[keys[keys.length - 1]] = value
              return newState
            })
          },
          subscribe: (callback) => {
            // Simple subscription - در صورت نیاز می‌توان بهبود داد
            return () => {}
          }
        }
      }
    }
  }, [state])

  // Helper functions
  const updateState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }))
  }, [])

  const setNestedState = useCallback((path, value) => {
    const keys = path.split('.')
    setState(prev => {
      const newState = { ...prev }
      let current = newState
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {}
        }
        current = current[keys[i]]
      }
      current[keys[keys.length - 1]] = value
      return newState
    })
  }, [])

  const value = {
    state,
    updateState,
    setNestedState,
    // Convenience getters
    currentTheme: state.currentTheme,
    currentView: state.currentView,
    currentCategory: state.currentCategory,
    currentTool: state.currentTool,
    openModals: state.openModals,
    userUsage: state.userUsage,
    globe: state.globe,
    // Convenience setters
    setTheme: (theme) => updateState({ currentTheme: theme }),
    setView: (view) => updateState({ currentView: view }),
    setCategory: (category) => updateState({ currentCategory: category }),
    setTool: (tool) => updateState({ currentTool: tool }),
    incrementModals: () => updateState({ openModals: state.openModals + 1 }),
    decrementModals: () => updateState({ openModals: Math.max(0, state.openModals - 1) }),
    incrementUsage: (type) => {
      const newUsage = { ...state.userUsage }
      newUsage[type] = (newUsage[type] || 0) + 1
      updateState({ userUsage: newUsage })
    }
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContext

