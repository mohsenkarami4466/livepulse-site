/**
 * ============================================
 * 🌍 Globe Helpers - Helper Functions
 * ============================================
 * 
 * این فایل شامل توابع کمکی برای کره‌ها است.
 * Helper functions for globe operations.
 * 
 * وابستگی‌ها / Dependencies:
 * - window.logger (optional)
 * - window.errorHandler (optional)
 * 
 * استفاده / Usage:
 * این فایل باید قبل از سایر فایل‌های globe لود شود.
 * This file should be loaded before other globe files.
 * 
 * توابع / Functions:
 * - addEventListenerOnce: جلوگیری از duplicate event listeners
 * 
 * ============================================
 */

/**
 * 🔧 Helper function برای جلوگیری از duplicate event listeners
 * Helper function to prevent duplicate event listeners
 * 
 * @param {HTMLElement|Window} element - المان یا window / Element or window
 * @param {string} event - نوع event / Event type
 * @param {Function} handler - تابع handler / Handler function
 * @param {string} uniqueId - شناسه یکتا برای این listener / Unique ID for this listener
 * @param {Object} options - گزینه‌های addEventListener / addEventListener options
 * 
 * وابستگی‌ها / Dependencies:
 * - element.setAttribute
 * - element.hasAttribute
 * - element.removeEventListener
 * - element.addEventListener
 * 
 * استفاده / Usage:
 * addEventListenerOnce(element, 'click', handler, 'unique-id', { passive: false });
 */
function addEventListenerOnce(element, event, handler, uniqueId, options = {}) {
    if (!element) return;
    
    const flagKey = `data-listener-${uniqueId}`;
    
    // بررسی اینکه آیا listener قبلاً اضافه شده
    // Check if listener was already added
    if (element.hasAttribute && element.hasAttribute(flagKey)) {
        // حذف listener قبلی و اضافه کردن دوباره (برای اطمینان از به‌روز بودن)
        // Remove previous listener and add again (to ensure it's up to date)
        try {
            element.removeEventListener(event, handler, options);
        } catch (e) {
            // ignore
        }
    }
    
    // اضافه کردن listener
    // Add listener
    element.addEventListener(event, handler, options);
    
    // علامت‌گذاری
    // Mark as added
    if (element.setAttribute) {
        element.setAttribute(flagKey, 'true');
    }
}

// Export to window for global access
// در دسترس قرار دادن در window برای دسترسی سراسری
if (typeof window !== 'undefined') {
    window.addEventListenerOnce = addEventListenerOnce;
}

