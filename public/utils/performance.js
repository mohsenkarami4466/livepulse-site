// ==================== //
// ⚡ Performance Utilities
// ==================== //
// توابع کمکی برای بهینه‌سازی Performance

/**
 * Debounce function - اجرای تابع را به تاخیر می‌اندازد تا زمانی که دیگر فراخوانی نشود
 * @param {Function} func - تابعی که باید debounce شود
 * @param {number} wait - زمان انتظار به میلی‌ثانیه
 * @param {boolean} immediate - اگر true باشد، تابع بلافاصله اجرا می‌شود و سپس debounce می‌شود
 * @returns {Function} تابع debounced
 */
function debounce(func, wait = 250, immediate = false) {
    let timeout;
    
    return function executedFunction(...args) {
        const context = this;
        
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        
        const callNow = immediate && !timeout;
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        
        if (callNow) func.apply(context, args);
    };
}

/**
 * Throttle function - اجرای تابع را محدود می‌کند به یک بار در هر بازه زمانی
 * @param {Function} func - تابعی که باید throttle شود
 * @param {number} limit - زمان حداقل بین اجراها به میلی‌ثانیه
 * @returns {Function} تابع throttled
 */
function throttle(func, limit = 250) {
    let inThrottle;
    
    return function(...args) {
        const context = this;
        
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * RequestAnimationFrame wrapper با cleanup
 * @param {Function} callback - تابع callback
 * @returns {number} animation frame ID
 */
function requestAnimationFrameSafe(callback) {
    if (typeof requestAnimationFrame !== 'undefined') {
        return requestAnimationFrame(callback);
    } else {
        // Fallback برای مرورگرهای قدیمی
        return setTimeout(callback, 16);
    }
}

/**
 * CancelAnimationFrame wrapper با cleanup
 * @param {number} id - animation frame ID
 */
function cancelAnimationFrameSafe(id) {
    if (typeof cancelAnimationFrame !== 'undefined') {
        cancelAnimationFrame(id);
    } else {
        clearTimeout(id);
    }
}

/**
 * Debounced resize handler creator
 * @param {Function} handler - تابع handler
 * @param {number} wait - زمان انتظار (پیش‌فرض: 250ms)
 * @returns {Function} debounced resize handler
 */
function createDebouncedResizeHandler(handler, wait = 250) {
    return debounce(handler, wait);
}

// Export functions
if (typeof window !== 'undefined') {
    window.PerformanceUtils = {
        debounce,
        throttle,
        requestAnimationFrameSafe,
        cancelAnimationFrameSafe,
        createDebouncedResizeHandler
    };
    
    // همچنین به صورت global برای راحتی
    window.debounce = debounce;
    window.throttle = throttle;
}

