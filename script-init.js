// ==================== //
// 🚀 راه‌اندازی نهایی یکپارچه
// ==================== //

/**
 * 🏗️ راه‌اندازی state برنامه
 */
function initializeAppState() {
    // مطمئن شو appState وجود داره
    if (typeof appState === 'undefined') {
        window.appState = {
            currentTheme: 'light',
            currentView: 'home',
            currentCategory: 'crypto',
            currentTool: 'goldCalc',
            userUsage: { chat: 0, tools: 0 },
            openModals: 0
        };
    }
    
    // بارگذاری state از localStorage
    const savedState = localStorage.getItem('livepulseState');
    if (savedState) {
        try {
            const parsed = JSON.parse(savedState);
            Object.assign(appState, parsed);
        } catch (e) {
            const logInit = window.logger || { warn: console.warn };
            const errorHandler = window.errorHandler;
            logInit.warn('⚠️ خطا در بارگذاری state:', e);
            if (errorHandler) {
                errorHandler.handleError(e, 'initializeAppState - loadState');
            }
        }
    }
}

/**
 * 💾 ذخیره state کاربر
 * @deprecated استفاده از stateManager.save() به جای این تابع
 */
function saveUserState() {
    // استفاده از stateManager اگر موجود باشد
    if (typeof stateManager !== 'undefined') {
        stateManager.save();
    } else if (typeof appState !== 'undefined') {
        localStorage.setItem('livepulseState', JSON.stringify(appState));
    }
}

/**
 * 🎯 راه‌اندازی کامل و یکپارچه برنامه
 */
function initializeLivePulse() {
    const logInit = window.logger || { info: console.log }; logInit.info('🚀 راه‌اندازی یکپارچه LivePulse...');
    
    try {
        // 1. سیستم state
        initializeAppState();
        
        // 2. سیستم تم
        if (elements.themeToggle) {
            // اعمال تم ذخیره شده
            const savedTheme = appState.currentTheme || 'light';
            document.body.setAttribute('data-theme', savedTheme);
            
            const themeIcon = elements.themeToggle.querySelector('.theme-icon');
            if (themeIcon) {
                themeIcon.textContent = savedTheme === 'light' ? '🌙' : '☀️';
            }
            
            elements.themeToggle.addEventListener('click', toggleTheme);
        }

        // 2.5 ایونت‌لیستنرهای اصلی (شامل دکمه فول اسکرین)
        if (typeof setupEventListeners === 'function') {
            setupEventListeners();
            logInit.info('✅ ایونت‌لیستنرهای اصلی راه‌اندازی شدند');
        }
        
        // راه‌اندازی event listener برای تغییر حالت تمام صفحه (برای به‌روزرسانی آیکون)
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);
        
        // 2.7 راه‌اندازی نوار ناوبری پایین - در setupEventListeners انجام می‌شود
        
        // 2.6 راه‌اندازی چت AI و مودال نظرات
        setTimeout(() => {
            if (typeof setupAiChat === 'function') {
                setupAiChat();
            }
            if (typeof setupFeedbackModal === 'function') {
                setupFeedbackModal();
            }
        }, 300);
        
        // 3. نمایش صفحه اصلی - همیشه
        if (typeof showView === 'function') {
            showView('home');
            // تنظیم هایلایت "خانه" به عنوان active - در showView انجام می‌شود
        }
        
        // 4. اسلایدر سه‌بعدی - حذف شد (استفاده نمی‌شود)
        
        // 5. دکمه شناور
        if (document.getElementById('assistiveTouch')) {
            setTimeout(() => {
                try {
                    // فقط اگر قبلاً ایجاد نشده باشد
                    if (!window.assistiveTouch) {
                        window.assistiveTouch = new AssistiveTouch();
                        logInit.info('🎮 دکمه شناور راه‌اندازی شد');
                        // اطمینان از نمایش در موبایل و همه مرورگرها
                        if (window.assistiveTouch && typeof window.assistiveTouch.ensureVisibility === 'function') {
                            window.assistiveTouch.ensureVisibility();
                            // یک بار دیگر بعد از تاخیر کوتاه برای اطمینان (مخصوص اپرا)
                            setTimeout(() => {
                                if (window.assistiveTouch && typeof window.assistiveTouch.ensureVisibility === 'function') {
                                    window.assistiveTouch.ensureVisibility();
                                }
                            }, 500);
                        }
                    } else {
                        logInit.info('✅ دکمه شناور قبلاً راه‌اندازی شده است');
                    }
                } catch (error) {
                    const errorHandler = window.errorHandler;
                    logInit.error('❌ خطا در راه‌اندازی دکمه شناور:', error);
                    if (errorHandler) {
                        errorHandler.handleError(error, 'initializeLivePulse - AssistiveTouch');
                    }
                }
            }, 800);
        }
        
        // 5.5. دکمه‌های سیار کره‌های بزرگ
        setTimeout(() => {
            if (typeof initGlobeAssistiveTouches === 'function') {
                try {
                    initGlobeAssistiveTouches();
                } catch (error) {
                    logInit.debug('خطا در initGlobeAssistiveTouches - ممکن است در React مدیریت شود:', error);
                }
            }
        }, 1200);
        
        // 5.6. راه‌اندازی نقشه‌های 2D در هایلایت‌های کره‌ها
        setTimeout(() => {
            if (typeof setupGlobe2DMaps === 'function') {
                try {
                    setupGlobe2DMaps();
                } catch (error) {
                    logInit.debug('خطا در setupGlobe2DMaps - ممکن است در React مدیریت شود:', error);
                }
            }
            if (typeof initGlobe2DMapsOnViewChange === 'function') {
                try {
                    initGlobe2DMapsOnViewChange();
                } catch (error) {
                    logInit.debug('خطا در initGlobe2DMapsOnViewChange - ممکن است در React مدیریت شود:', error);
                }
            }
        }, 1500);
        
        // 6. هایلایت‌های ابزار (highlight-circle در setupEventListeners تنظیم می‌شود)
        setTimeout(() => {
            // هایلایت‌های ابزار
            document.querySelectorAll('[data-tool]').forEach(circle => {
                // حذف event listener قبلی برای جلوگیری از duplicate
                const newCircle = circle.cloneNode(true);
                circle.parentNode.replaceChild(newCircle, circle);
                
                newCircle.addEventListener('click', (e) => {
                    const toolId = e.currentTarget.getAttribute('data-tool');
                    if (typeof activateTool === 'function') {
                        activateTool(toolId);
                    }
                });
            });
            
            logInit.success('هایلایت‌های ابزار راه‌اندازی شدند');
        }, 1000);
        
        logInit.success('برنامه با موفقیت راه‌اندازی شد');
        
    } catch (error) {
        if (window.errorHandler) {
            window.errorHandler.handleError(error, 'initializeLivePulse');
        } else {
            logInit.error('خطا در راه‌اندازی:', error);
        }
    }
}

// ==================== //
// 🎠 اسلایدر یکپارچه - تولید کارت‌ها
// ==================== //

// تمام کدهای اسلایدر حذف شد

// راه‌اندازی نهایی - یکپارچه
let isInitialized = false;
document.addEventListener('DOMContentLoaded', function() {
    const log = window.logger || { warn: console.warn, error: console.error };
    if (isInitialized) {
        log.warn('DOMContentLoaded قبلاً اجرا شده است');
        return;
    }
    isInitialized = true;
    
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
        
        // 4. درخواست مجوز لوکیشن برای ساعت‌های محلی - غیرفعال شده برای جلوگیری از خطای Google Maps API
        // این خطا از مرورگر می‌آید و نمی‌توان آن را suppress کرد
        // اگر نیاز به geolocation دارید، می‌توانید این بخش را فعال کنید
        /*
        setTimeout(() => {
            try {
                if (typeof requestLocationPermission === 'function') {
                    requestLocationPermission();
                }
            } catch (error) {
                const log = window.logger || { error: console.error }; log.error('❌ خطا در requestLocationPermission:', error);
            }
        }, 2000);
        */
    } catch (error) {
        const errorHandler = window.errorHandler;
        log.error('❌ خطا در DOMContentLoaded:', error);
        if (errorHandler) {
            errorHandler.handleError(error, 'DOMContentLoaded');
        }
    }
});

// سیستم بستن مودال‌ها
document.addEventListener('click', function(e) {
    // بستن با کلیک روی overlay
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('active');
        if (appState) {
            appState.openModals = Math.max(0, appState.openModals - 1);
        }
    }
    
    // بستن با کلیک روی دکمه ضربدر
    if (e.target.classList.contains('close-modal')) {
        const modal = e.target.closest('.modal-overlay');
        if (modal) {
            modal.classList.remove('active');
            if (appState) {
                appState.openModals = Math.max(0, appState.openModals - 1);
            }
        }
    }
});

// بستن با کلید Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(modal => {
            modal.classList.remove('active');
        });
        // بستن چت AI
        const aiChatModal = document.getElementById('aiChatModal');
        if (aiChatModal) aiChatModal.classList.remove('active');
        
        if (appState) {
            appState.openModals = 0;
        }
    }
});

// ==================== //
// 💬 سیستم چت AI - نوار باریک
// ==================== //

function setupAiChat() {
    const aiChatBar = document.getElementById('aiChatBar');
    const aiChatFab = document.getElementById('aiChatFab');
    const chatInput = document.getElementById('chatInput');
    const sendMessage = document.getElementById('sendMessage');
    const chatMessages = document.getElementById('chatMessages');
    
    const log = window.logger || { info: console.log, warn: console.warn }; 
    log.info('💬 راه‌اندازی چت AI...', { 
        bar: !!aiChatBar, 
        fab: !!aiChatFab 
    });
    
    if (aiChatBar && aiChatFab) {
        // رویداد کلیک روی هدر برای باز/بسته کردن
        aiChatFab.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            log.info('💬 کلیک روی هدر چت');
            aiChatBar.classList.toggle('expanded');
            
            // تشخیص صفحه فعلی برای پیام مناسب - از appState استفاده می‌کنیم
            const currentPage = (typeof appState !== 'undefined' && appState.currentView) ? appState.currentView : 'home';
            log.info('💬 صفحه فعلی:', currentPage);
            updateChatContext(currentPage);
            
            // فوکوس روی input وقتی باز میشه
            if (aiChatBar.classList.contains('expanded') && chatInput) {
                setTimeout(() => chatInput.focus(), 300);
            }
        };
        
        // ارسال پیام
        if (sendMessage && chatInput && chatMessages) {
            sendMessage.onclick = function() {
                const msg = chatInput.value.trim();
                if (msg) {
                    // نمایش پیام کاربر
                    const userMsgEl = document.createElement('div');
                    userMsgEl.className = 'user-message';
                    userMsgEl.innerHTML = `<p>${msg}</p>`;
                    chatMessages.appendChild(userMsgEl);
                    
                    // پاک کردن input
                    chatInput.value = '';
                    
                    // اسکرول به پایین
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                    
                    // پاسخ هوش مصنوعی (فعلا ساختگی)
                    setTimeout(() => {
                        const aiMsgEl = document.createElement('div');
                        aiMsgEl.className = 'ai-message';
                        aiMsgEl.innerHTML = `<p>ممنون از پیامت! این یک پاسخ نمونه است. سیستم هوش مصنوعی بعداً متصل می‌شود.</p>`;
                        chatMessages.appendChild(aiMsgEl);
                        chatMessages.scrollTop = chatMessages.scrollHeight;
                    }, 500);
                }
            };
            
            // ارسال با Enter
            chatInput.onkeypress = function(e) {
                if (e.key === 'Enter') {
                    sendMessage.click();
                }
            };
        }
        
        log.info('✅ چت AI راه‌اندازی شد');
    } else {
        log.warn('⚠️ المان‌های چت AI پیدا نشدند');
    }
}

// آپدیت context چت بر اساس صفحه
function updateChatContext(pageName) {
    const chatMessages = document.getElementById('chatMessages');
    const chatHeader = document.querySelector('.chat-header h3');
    if (!chatMessages) return;
    
    const contexts = {
        'home': {
            title: '🏠 دستیار خانه',
            message: 'سلام! در صفحه اصلی هستید. درباره قیمت‌ها، ارزها، طلا یا رمزارز سوال دارید؟'
        },
        'tools': {
            title: '🛠️ دستیار ابزار',
            message: 'در صفحه ابزار هستید. درباره تبدیل ارز، محاسبه سود، صندوق شخصی یا نقشه طلا سوال دارید؟'
        },
        'news': {
            title: '📰 دستیار اخبار',
            message: 'در صفحه اخبار هستید. می‌تونم اخبار رو برای شما خلاصه کنم یا تحلیل کنم.'
        },
        'tutorial': {
            title: '📚 دستیار آموزش',
            message: 'در صفحه آموزش هستید. درباره تحلیل تکنیکال، فاندامنتال، مدیریت ریسک یا استراتژی سوال دارید؟'
        },
        'relax': {
            title: '🧘 دستیار آرامش',
            message: 'در صفحه آرامش هستید. می‌تونم برای تمرکز، مدیریت استرس یا بهبود عملکرد کمکتون کنم.'
        }
    };
    
    const context = contexts[pageName] || contexts['home'];
    
    // آپدیت عنوان
    if (chatHeader) {
        chatHeader.textContent = context.title;
    }
    
    // آپدیت پیام اول
    const firstMsg = chatMessages.querySelector('.ai-message p');
    if (firstMsg) {
        firstMsg.textContent = context.message;
    }
}

// این listener قبلاً در initializeLivePulse اجرا می‌شود
// کدهای duplicate حذف شدند - همه چیز در initializeLivePulse مدیریت می‌شود

(function() {
    const log = window.logger || { info: console.log };
    log.info('📄 فایل JavaScript لود شد - آماده راه‌اندازی...');
})();