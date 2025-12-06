import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

// ایجاد Context
const AppContext = createContext()

// Hook برای استفاده از Context
export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

// Provider Component
export function AppProvider({ children }) {
  // State اصلی
  const [state, setState] = useState({
    // UI State
    currentTheme: 'light',
    currentView: 'home',
    currentCategory: 'crypto',
    currentTool: 'goldTool',
    openModals: 0,
    maxModals: { home: 4, category: 2 },
    
    // User State
    userUsage: { chat: 0, tools: 0 },
    previousViewBeforeGlobe: null,
    
    // Globe State
    globe: {
      financial: {
        selectedCountry: null,
        showBorders: true,
        showMarkers: true
      },
      resources: {
        selectedCountry: null,
        bordersGroup: null,
        conflictsGroup: null,
        tradeLinesGroup: null,
        labelsGroup: null,
        showBorders: true,
        showConflicts: true,
        showTradeLines: false,
        showLabels: true,
        tradeType: 'exports'
      }
    }
  })

  // مقداردهی اولیه از localStorage
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('livepulseState')
      if (savedState) {
        const parsed = JSON.parse(savedState)
        setState(prev => ({ ...prev, ...parsed }))
      }
    } catch (error) {
      console.error('Error loading state from localStorage:', error)
    }
  }, [])

  // ذخیره state در localStorage
  useEffect(() => {
    try {
      localStorage.setItem('livepulseState', JSON.stringify(state))
    } catch (error) {
      console.error('Error saving state to localStorage:', error)
    }
  }, [state])

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

