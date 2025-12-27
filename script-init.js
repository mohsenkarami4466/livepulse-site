/**
 * ============================================
 * 🚀 فایل script-init.js - راه‌اندازی اولیه
 * ============================================
 * 
 * این فایل شامل:
 * - راه‌اندازی توابع utility (updateSunAndMarkets, createUTCClockRing, updateUTCClock)
 * - راه‌اندازی initializeLivePulse (اگر موجود باشد)
 * - سیستم بستن مودال‌ها
 * 
 * نکته مهم:
 * - کره کوچک (GlobeClock) توسط React component مدیریت می‌شود
 * - این فایل فقط توابع utility را راه‌اندازی می‌کند
 * 
 * تاریخ ایجاد: 2025-12-06
 * آخرین بروزرسانی: 2025-01-27 (ساده‌سازی)
 */

let isInitialized = false;

/**
 * بررسی React mode
 * 
 * این تابع بررسی می‌کند که آیا React render شده است یا نه.
 * 
 * @returns {boolean} true اگر React render شده باشد
 */
function checkReactMode() {
    const root = document.getElementById('root');
    if (!root) return false;
    
    // بررسی اینکه آیا React render شده (root باید محتوا داشته باشد)
    const hasReactContent = root.children.length > 0;
    
    // بررسی وجود data-react-mode attribute
    const hasReactModeAttribute = document.querySelector('[data-react-mode="true"]') !== null;
    
    return hasReactContent || hasReactModeAttribute;
}

/**
 * راه‌اندازی توابع utility
 * 
 * این توابع برای به‌روزرسانی اطلاعات بازار و ساعت UTC استفاده می‌شوند.
 */
function initializeUtilityFunctions() {
    const log = window.logger || { info: console.log, warn: console.warn, error: console.error };
    
    try {
        // راه‌اندازی updateSunAndMarkets (به‌روزرسانی موقعیت خورشید و بازارها)
        if (typeof updateSunAndMarkets === 'function') {
            const UPDATE_MS = window.UPDATE_MS || 30000; // 30 ثانیه
            setInterval(updateSunAndMarkets, UPDATE_MS);
            log.info('✅ updateSunAndMarkets راه‌اندازی شد');
        }
        
        // راه‌اندازی createUTCClockRing (ساخت حلقه ساعت UTC)
        if (typeof createUTCClockRing === 'function') {
            createUTCClockRing();
            log.info('✅ createUTCClockRing راه‌اندازی شد');
        }
        
        // راه‌اندازی updateUTCClock (به‌روزرسانی ساعت UTC)
        if (typeof updateUTCClock === 'function') {
            setInterval(updateUTCClock, 1000); // هر 1 ثانیه
            log.info('✅ updateUTCClock راه‌اندازی شد');
        }
    } catch (error) {
        const log = window.logger || { error: console.error };
        log.error('❌ خطا در راه‌اندازی utility functions:', error);
    }
}

/**
 * راه‌اندازی برنامه اصلی
 * 
 * این تابع initializeLivePulse را فراخوانی می‌کند (اگر موجود باشد).
 */
function initializeMainApp() {
    const log = window.logger || { info: console.log, warn: console.warn, error: console.error };
    
    try {
        if (typeof initializeLivePulse === 'function') {
            initializeLivePulse();
            log.info('✅ initializeLivePulse راه‌اندازی شد');
        } else {
            log.warn('⚠️ تابع initializeLivePulse پیدا نشد');
        }
    } catch (error) {
        const log = window.logger || { error: console.error };
        log.error('❌ خطا در initializeLivePulse:', error);
    }
}

/**
 * راه‌اندازی اولیه
 * 
 * این تابع بعد از render شدن React اجرا می‌شود.
 */
function initialize() {
    if (isInitialized) {
        return;
    }
    
    const log = window.logger || { info: console.log };
    log.info('🚀 راه‌اندازی script-init.js...');
    
    isInitialized = true;
    
    // راه‌اندازی توابع utility
    initializeUtilityFunctions();
    
    // راه‌اندازی برنامه اصلی (با تاخیر کوتاه)
    setTimeout(initializeMainApp, 200);
}

// راه‌اندازی بعد از DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // صبر می‌کنیم تا React render شود
    setTimeout(() => {
        // بررسی React mode
        if (checkReactMode()) {
            const log = window.logger || { info: console.log };
            log.info('✅ React mode تشخیص داده شد - راه‌اندازی utility functions');
            initialize();
        } else {
            // اگر React render نشده، دوباره چک می‌کنیم
            let retryCount = 0;
            const maxRetries = 30; // 3 ثانیه (30 * 100ms)
            const checkInterval = setInterval(() => {
                retryCount++;
                if (checkReactMode() || retryCount >= maxRetries) {
                    clearInterval(checkInterval);
                    initialize();
                }
            }, 100);
        }
    }, 1000); // تاخیر 1 ثانیه برای اطمینان از render شدن React
});

// سیستم بستن مودال‌ها با کلیک روی overlay
document.addEventListener('click', function(e) {
    // بستن با کلیک روی overlay
    if (e.target.classList.contains('globe-modal') || e.target.classList.contains('modal-overlay')) {
        const modal = e.target.closest('.globe-modal, .modal-overlay');
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('active');
        }
    }
});
