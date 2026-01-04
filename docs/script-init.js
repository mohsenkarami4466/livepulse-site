// راه‌اندازی نهایی - یکپارچه
let isInitialized = false;

// تابع برای بررسی React mode - بررسی وجود element های React
function checkReactMode() {
    // بررسی وجود root element
    const root = document.getElementById('root');
    if (!root) return false;
    
    // بررسی اینکه آیا React render شده (root باید محتوا داشته باشد)
    // یا اینکه element های React وجود دارند
    const hasReactContent = root.children.length > 0;
    const hasGlobeContainer = document.getElementById('globeContainer') !== null;
    const hasAssistiveTouch = document.getElementById('assistiveTouch') !== null;
    
    // اگر root محتوا دارد یا element های React وجود دارند، یعنی React mode است
    return hasReactContent || (hasGlobeContainer && hasAssistiveTouch);
}

document.addEventListener('DOMContentLoaded', function() {
    const log = window.logger || { warn: console.warn, error: console.error, info: console.log };
    if (isInitialized) {
        log.warn('DOMContentLoaded قبلاً اجرا شده است');
        return;
    }
    isInitialized = true;
    
    // بررسی React mode با تاخیر - React ممکن است هنوز render نشده باشد
    // صبر می‌کنیم تا React render شود
    const checkReactAndInit = () => {
        // بررسی با تاخیر بیشتر برای اطمینان از render شدن React
        setTimeout(() => {
            const isReactMode = checkReactMode();
            
            if (isReactMode) {
                log.info('✅ React mode تشخیص داده شد - کره کوچک و دکمه سیار توسط React components مدیریت می‌شوند');
                // در React mode، فقط updateSunAndMarkets و سایر توابع utility را راه‌اندازی می‌کنیم
                setTimeout(() => {
                    try {
                        if (typeof window.updateSunAndMarkets === 'function') {
                            const UPDATE_MS = (window.CONFIG && window.CONFIG.TIME && window.CONFIG.TIME.UPDATE_INTERVAL) || 30000;
                            setInterval(window.updateSunAndMarkets, UPDATE_MS);
                        }
                        if (typeof window.createUTCClockRing === 'function') {
                            window.createUTCClockRing();
                        }
                        if (typeof window.updateUTCClock === 'function') {
                            setInterval(window.updateUTCClock, 1000);
                        }
                    } catch (error) {
                        log.error('❌ خطا در راه‌اندازی utility functions:', error);
                    }
                }, 100);
                return;
            }
            
            // اگر React mode نیست، vanilla JS initialization را انجام بده
            log.info('⚠️ Vanilla JS mode - انجام initialization...');
            try {
                // 1. بررسی وجود THREE.js و راه‌اندازی کره
                if (typeof THREE === 'undefined') {
                    log.error('THREE.js لود نشده! منتظر می‌مانیم...');
                    setTimeout(() => {
                        if (typeof THREE !== 'undefined') {
                            try {
                                if (typeof initGlobe === 'function') {
                                    initGlobe();
                                }
                            } catch (error) {
                                if (window.errorHandler) {
                                    window.errorHandler.handleError(error, 'initGlobe');
                                } else {
                                    log.error('خطا در initGlobe:', error);
                                }
                            }
                        } else {
                            log.error('THREE.js هنوز لود نشده است!');
                        }
                    }, 500);
                } else {
                    try {
                        if (typeof initGlobe === 'function') {
                            initGlobe();
                        }
                    } catch (error) {
                        if (window.errorHandler) {
                            window.errorHandler.handleError(error, 'initGlobe');
                        } else {
                            log.error('خطا در initGlobe:', error);
                        }
                    }
                }
                
                // 2. سایر تنظیمات با تاخیر
                setTimeout(() => {
                    try {
                        if (typeof window.updateSunAndMarkets === 'function') {
                            const UPDATE_MS = (window.CONFIG && window.CONFIG.TIME && window.CONFIG.TIME.UPDATE_INTERVAL) || 30000;
                            setInterval(window.updateSunAndMarkets, UPDATE_MS);
                        }
                        
                        if (typeof window.setupSmallGlobeClick === 'function') {
                            window.setupSmallGlobeClick();
                        }
                        
                        if (typeof window.createUTCClockRing === 'function') {
                            window.createUTCClockRing();
                        }
                        if (typeof window.updateUTCClock === 'function') {
                            setInterval(window.updateUTCClock, 1000);
                        }
                        // تنظیم موقعیت کره کوچک زیر شاخص‌ها
                        if (typeof updateGlobePosition === 'function') {
                            // با تاخیر برای اطمینان از render شدن شاخص‌ها
                            setTimeout(() => {
                                updateGlobePosition();
                                // در صورت تغییر اندازه صفحه
                                let resizeTimeout;
                                const handleResize = () => {
                                    clearTimeout(resizeTimeout);
                                    resizeTimeout = setTimeout(() => {
                                        updateGlobePosition();
                                    }, 100);
                                };
                                window.addEventListener('resize', handleResize);
                                // همچنین بعد از تغییر محتوا - هر 2 ثانیه
                                setInterval(() => {
                                    updateGlobePosition();
                                }, 2000);
                                // همچنین بعد از لود کامل صفحه
                                window.addEventListener('load', () => {
                                    setTimeout(updateGlobePosition, 500);
                                });
                            }, 500); // افزایش تاخیر برای اطمینان از render شدن
                        }
                        
                        // راه‌اندازی اسلایدر یکپارچه - ساده و تمیز
                        // کدهای اسلایدر حذف شد
                    } catch (error) {
                        const errorHandler = window.errorHandler;
                        log.error('❌ خطا در تنظیمات اولیه:', error);
                        if (errorHandler) {
                            errorHandler.handleError(error, 'DOMContentLoaded - initialSetup');
                        }
                    }
                }, 100);
                
                // 3. راه‌اندازی برنامه اصلی
                setTimeout(() => {
                    try {
                        if (typeof initializeLivePulse === 'function') {
                            initializeLivePulse();
                        } else {
                            log.warn('⚠️ تابع initializeLivePulse پیدا نشد');
                        }
                    } catch (error) {
                        const errorHandler = window.errorHandler;
                        log.error('❌ خطا در initializeLivePulse:', error);
                        if (errorHandler) {
                            errorHandler.handleError(error, 'DOMContentLoaded - initializeLivePulse');
                        }
                    }
                }, 200);
            } catch (error) {
                const errorHandler = window.errorHandler;
                log.error('❌ خطا در DOMContentLoaded:', error);
                if (errorHandler) {
                    errorHandler.handleError(error, 'DOMContentLoaded');
                }
            }
        }, 1000); // تاخیر 1 ثانیه برای اطمینان از render شدن React
    };
    
    // بررسی اولیه - اگر React هنوز render نشده، منتظر بمان
    if (checkReactMode()) {
        checkReactAndInit();
    } else {
        // React هنوز render نشده - منتظر بمان و دوباره چک کن
        let retryCount = 0;
        const maxRetries = 30; // 3 ثانیه (30 * 100ms)
        const checkInterval = setInterval(() => {
            retryCount++;
            if (checkReactMode() || retryCount >= maxRetries) {
                clearInterval(checkInterval);
                checkReactAndInit();
            }
        }, 100);
    }
});

// سیستم بستن مودال‌ها
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
