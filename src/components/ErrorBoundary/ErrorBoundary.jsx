/**
 * ============================================
 * 🚨 کامپوننت ErrorBoundary - مدیریت خطاها
 * ============================================
 *
 * این کامپوننت خطاهای JavaScript در کامپوننت‌های فرزند را catch می‌کند
 * و یک UI fallback نمایش می‌دهد.
 *
 * استفاده:
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 *
 * تاریخ ایجاد: 2025-12-23
 */

import React from 'react'
import './ErrorBoundary.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    // به‌روزرسانی state برای نمایش UI fallback
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // لاگ کردن خطا
    const logger = window.logger || console
    logger.error('❌ خطا در ErrorBoundary:', error)
    logger.error('📋 جزئیات خطا:', errorInfo)

    this.setState({
      error: error,
      errorInfo: errorInfo
    })

    // ارسال خطا به سیستم error handling اگر موجود باشد
    if (window.errorHandler && typeof window.errorHandler.handleError === 'function') {
      window.errorHandler.handleError(error, 'ErrorBoundary', {
        componentStack: errorInfo.componentStack,
        errorBoundary: true
      })
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      // UI fallback برای نمایش خطا
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <div className="error-icon">⚠️</div>
            <h2 className="error-title">خطایی رخ داده</h2>
            <p className="error-message">
              متاسفانه خطایی در نمایش این بخش رخ داده است.
            </p>

            <div className="error-actions">
              <button
                className="retry-button"
                onClick={this.handleRetry}
              >
                🔄 تلاش مجدد
              </button>
              <button
                className="reload-button"
                onClick={() => window.location.reload()}
              >
                🔄 بارگذاری مجدد صفحه
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-details">
                <summary>جزئیات خطا (فقط در حالت توسعه)</summary>
                <pre className="error-stack">
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    // اگر خطایی رخ نداده، کامپوننت‌های فرزند را رندر کن
    return this.props.children
  }
}

export default ErrorBoundary
