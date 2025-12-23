// راه‌اندازی نهایی - یکپارچه
let isInitialized = false;

// تابع برای بررسی React mode - بررسی وجود element های React
function checkReactMode() {
    // بررسی وجود root element
    const root = document.getElementById('root');
    if (!root) return false;
    
    // بررسی اینکه آیا React render شده (root باید محتوا داشته باشد)
    const hasReactContent = root.children.length > 0;
    
    // بررسی وجود data-react-mode attribute که توسط React components تنظیم می‌شود
    const hasReactModeAttribute = document.querySelector('[data-react-mode="true"]') !== null;
    
    // بررسی وجود کامپوننت‌های React (مثل globeClockWrapper با data-react-mode)
    const globeWrapper = document.getElementById('globeClockWrapper');
    const hasReactGlobeWrapper = globeWrapper && globeWrapper.getAttribute('data-react-mode') === 'true';
    
    // اگر root محتوا دارد یا attribute های React وجود دارند، یعنی React mode است
    return hasReactContent || hasReactModeAttribute || hasReactGlobeWrapper;
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
            // بررسی چندباره React mode برای اطمینان
            let isReactMode = false;
            for (let i = 0; i < 5; i++) {
                isReactMode = checkReactMode();
                if (isReactMode) break;
                // صبر کوتاه و دوباره چک کن
                if (i < 4) {
                    const checkElement = document.getElementById('root');
                    if (checkElement && checkElement.children.length > 0) {
                        // React render شده، یک بار دیگر چک کن
                        isReactMode = checkReactMode();
                        if (isReactMode) break;
                    }
                }
            }
            
            if (isReactMode) {
                log.info('✅ React mode تشخیص داده شد - کره کوچک و دکمه سیار توسط React components مدیریت می‌شوند');
                // در React mode، فقط updateSunAndMarkets و سایر توابع utility را راه‌اندازی می‌کنیم
                setTimeout(() => {
                    try {
                        if (typeof updateSunAndMarkets === 'function') {
                            setInterval(updateSunAndMarkets, UPDATE_MS);
                        }
                        if (typeof createUTCClockRing === 'function') {
                            createUTCClockRing();
                        }
                        if (typeof updateUTCClock === 'function') {
                            setInterval(updateUTCClock, 1000);
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
                // ساعت اصلی همیشه اولویت دارد - React mode را نادیده بگیر
                const finalCheckReactMode = checkReactMode();
                if (finalCheckReactMode) {
                    log.info('ℹ️ React mode تشخیص داده شد اما ساعت اصلی اولویت دارد - ادامه اجرا...');
                    // ادامه اجرا - ساعت اصلی همیشه فعال شود
                }
                    // بررسی وجود globeContainer قبل از initGlobe
                    const container = document.getElementById('globeContainer');
                    if (!container) {
                        log.warn('⚠️ globeContainer پیدا نشد - ممکن است React mode باشد. منتظر می‌مانیم...');
                        // صبر می‌کنیم تا React render شود
                        setTimeout(() => {
                            // بررسی نهایی React mode
                            const finalCheck = checkReactMode();
                            if (finalCheck) {
                                log.info('✅ React mode بعد از انتظار برای globeContainer تشخیص داده شد');
                                return;
                            }
                            // اگر هنوز React mode نیست و container پیدا شد، initGlobe را فراخوانی کن
                            const retryContainer = document.getElementById('globeContainer');
                            if (retryContainer && typeof initGlobe === 'function') {
                                // بررسی نهایی React mode قبل از initGlobe
                                const lastReactCheck = checkReactMode();
                                if (!lastReactCheck) {
                                    try {
                                        initGlobe();
                                    } catch (error) {
                                        if (window.errorHandler) {
                                            window.errorHandler.handleError(error, 'initGlobe');
                                        } else {
                                            log.error('خطا در initGlobe:', error);
                                        }
                                    }
                                } else {
                                    log.info('✅ React mode در retry تشخیص داده شد - از initGlobe صرف نظر می‌کنیم');
                                }
                            }
                        }, 1000);
                        return;
                    }
                    
                // 1. بررسی وجود THREE.js و راه‌اندازی کره
                if (typeof THREE === 'undefined') {
                    log.error('THREE.js لود نشده! منتظر می‌مانیم...');
                    setTimeout(() => {
                            // بررسی دوباره React mode
                            if (checkReactMode()) {
                                log.info('✅ React mode بعد از انتظار برای THREE.js تشخیص داده شد');
                                return;
                            }
                            // بررسی دوباره React mode و container
                            if (checkReactMode()) {
                                log.info('✅ React mode بعد از انتظار برای THREE.js تشخیص داده شد');
                                return;
                            }
                            // بررسی وجود container قبل از initGlobe
                            const containerAfterWait = document.getElementById('globeContainer');
                            if (!containerAfterWait) {
                                log.warn('⚠️ globeContainer پیدا نشد - احتمالاً React mode است. از initGlobe صرف نظر می‌کنیم');
                                return;
                            }
                            // بررسی نهایی React mode قبل از initGlobe
                            const lastReactCheckForThree = checkReactMode();
                            if (lastReactCheckForThree) {
                                log.info('✅ React mode بعد از بررسی container تشخیص داده شد');
                                return;
                            }
                        if (typeof THREE !== 'undefined') {
                                // بررسی نهایی container قبل از initGlobe
                                const finalContainerCheck = document.getElementById('globeContainer');
                                if (!finalContainerCheck) {
                                    log.warn('⚠️ globeContainer پیدا نشد - احتمالاً React mode است. از initGlobe صرف نظر می‌کنیم');
                                    return;
                                }
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
                        // بررسی نهایی React mode و وجود container قبل از initGlobe
                        const lastCheckReactMode = checkReactMode();
                        if (lastCheckReactMode) {
                            log.info('✅ React mode در last check تشخیص داده شد - از initGlobe صرف نظر می‌کنیم');
                        } else {
                            // بررسی وجود container قبل از initGlobe
                            const finalContainer = document.getElementById('globeContainer');
                            if (!finalContainer) {
                                log.warn('⚠️ globeContainer پیدا نشد - احتمالاً React mode است. از initGlobe صرف نظر می‌کنیم');
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
                        }
                    }
                }
                
                // 2. سایر تنظیمات با تاخیر
                setTimeout(() => {
                    try {
                        if (typeof updateSunAndMarkets === 'function') {
                            setInterval(updateSunAndMarkets, UPDATE_MS);
                        }
                        
                        if (typeof setupSmallGlobeClick === 'function') {
                            setupSmallGlobeClick();
                        }
                        
                        if (typeof createUTCClockRing === 'function') {
                            createUTCClockRing();
                        }
                        if (typeof updateUTCClock === 'function') {
                            setInterval(updateUTCClock, 1000);
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
        }, 2000); // تاخیر 2 ثانیه برای اطمینان از render شدن React
    };
    
    // بررسی اولیه - اگر React هنوز render نشده، منتظر بمان
    if (checkReactMode()) {
        checkReactAndInit();
    } else {
        // React هنوز render نشده - منتظر بمان و دوباره چک کن
        let retryCount = 0;
        const maxRetries = 50; // 5 ثانیه (50 * 100ms) - افزایش برای اطمینان از render شدن React
        const checkInterval = setInterval(() => {
            retryCount++;
            if (checkReactMode() || retryCount >= maxRetries) {
                clearInterval(checkInterval);
                checkReactAndInit();
            }
        }, 100);
    }
});

// ساعت اصلی را همیشه فعال کن - این اولویت اصلی است
function forceActivateOriginalClock() {
    console.log('🔧 فعال‌سازی ساعت اصلی بازار...');
    console.log('📊 وضعیت initGlobe:', typeof initGlobe);
    console.log('📊 وضعیت window.initGlobe:', typeof window.initGlobe);

    // بررسی وجود container
    let container = document.getElementById('globeContainer');
    if (!container) {
        console.log('📦 ایجاد globeContainer...');
        container = document.createElement('div');
        container.id = 'globeContainer';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            width: 200px;
            height: 200px;
            z-index: 1000;
            pointer-events: auto;
            cursor: pointer;
            background: transparent;
        `;
        document.body.appendChild(container);
    }

    // بررسی وجود wrapper
    let wrapper = document.getElementById('globeClockWrapper');
    if (!wrapper) {
        console.log('📦 ایجاد globeClockWrapper...');
        wrapper = document.createElement('div');
        wrapper.id = 'globeClockWrapper';
        wrapper.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1000;
            pointer-events: auto;
        `;
        document.body.appendChild(wrapper);
    }

    // فعال کردن ساعت اصلی
    if (typeof initGlobe === 'function') {
        try {
            console.log('🕐 اجرای initGlobe...');
            initGlobe();
            console.log('✅ ساعت اصلی با کره زمین فعال شد!');
        } catch (error) {
            console.error('❌ خطا در فعال‌سازی ساعت اصلی:', error);
        }
    } else {
        console.error('❌ تابع initGlobe پیدا نشد');
    }
}

// فعال‌سازی در زمان‌های مختلف
setTimeout(forceActivateOriginalClock, 500);
setTimeout(forceActivateOriginalClock, 1500);
setTimeout(forceActivateOriginalClock, 3000);

// فعال‌سازی در window load
window.addEventListener('load', () => {
    setTimeout(forceActivateOriginalClock, 1000);
});

// فعال‌سازی در DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(forceActivateOriginalClock, 2000);
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
