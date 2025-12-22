// ==================== //
// 🎨 UI Interactions (Event Listeners, Chat, etc.)
// ==================== //

/**
 * 🔧 Helper function برای جلوگیری از duplicate event listeners
 * (استفاده از helper function از script-globes.js اگر موجود باشد)
 */
function addEventListenerOnceUI(element, event, handler, uniqueId, options = {}) {
    // استفاده از helper function از script-globes.js اگر موجود باشد
    if (typeof addEventListenerOnce === 'function') {
        return addEventListenerOnce(element, event, handler, uniqueId, options);
    }
    
    // Fallback: پیاده‌سازی ساده
    if (!element) return;
    
    const flagKey = `data-listener-${uniqueId}`;
    
    // بررسی اینکه آیا listener قبلاً اضافه شده
    if (element.hasAttribute && element.hasAttribute(flagKey)) {
        try {
            element.removeEventListener(event, handler, options);
        } catch (e) {
            // ignore
        }
    }
    
    // اضافه کردن listener
    element.addEventListener(event, handler, options);
    
    // علامت‌گذاری
    if (element.setAttribute) {
        element.setAttribute(flagKey, 'true');
    }
}

// Flag برای جلوگیری از اجرای چندباره setupEventListeners
let eventListenersSetup = false;

// Handler برای دکمه‌های 3D در قسمت آرامش
// جلوگیری از راه‌اندازی چندباره دکمه‌ها
let buttons3DSetup = false;

function setup3DGlobeButtons() {
    // پیدا کردن دکمه‌ها با استفاده از querySelector در پنل 3D
    const panel3d = document.querySelector('.relax-panel[data-relax-panel="3d"]');
    if (!panel3d) {
        const log = window.logger || { warn: console.warn }; log.warn('⚠️ پنل 3D پیدا نشد');
        return;
    }
    
    // پیدا کردن دکمه‌ها در پنل 3D
    const buttons = panel3d.querySelectorAll('button[data-globe]');
    const log = window.logger || { info: console.log }; log.info(`🔘 پیدا کردن ${buttons.length} دکمه 3D در پنل`);
    
    if (buttons.length === 0) {
        return;
    }
    
    buttons.forEach(btn => {
        // حذف listener های قبلی با clone
        if (btn.hasAttribute('data-listener-attached')) {
            return; // قبلا listener اضافه شده
        }
        
        const globeType = btn.getAttribute('data-globe');
        if (!globeType) {
            const log = window.logger || { warn: console.warn }; log.warn('⚠️ دکمه بدون data-globe:', btn);
            return;
        }
        
        const log = window.logger || { info: console.log }; log.info(`🌍 راه‌اندازی دکمه: ${globeType}`);
        
        // بهبود event listener برای راحت‌تر کلیک شدن
        const handleClick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            // جلوگیری از کلیک‌های مکرر
            if (btn.disabled) {
                return;
            }
            btn.disabled = true;
            
            const log = window.logger || { info: console.log }; log.info(`🌍 کلیک روی دکمه 3D: ${globeType}`);
            
            const cfg = window.CONFIG || CONFIG;
            setTimeout(() => {
                btn.disabled = false;
            }, cfg.UI.ANIMATION.BUTTON_DISABLE_DURATION);
            
            if (globeType) {
                if (typeof open3DGlobe === 'function') {
                    open3DGlobe(globeType);
                } else if (typeof window.open3DGlobe === 'function') {
                    window.open3DGlobe(globeType);
                } else {
                    const log = window.logger || { error: console.error }; log.error('❌ تابع open3DGlobe پیدا نشد!');
                    alert('خطا: تابع باز کردن کره پیدا نشد');
                }
            }
        };
        
        // اضافه کردن listener فقط یکبار
        btn.addEventListener('click', handleClick, { passive: false, once: false });
        btn.addEventListener('touchend', handleClick, { passive: false, once: false });
        btn.setAttribute('data-listener-attached', 'true');
        
        // بهبود UX - اضافه کردن cursor pointer
        btn.style.cursor = 'pointer';
        btn.style.userSelect = 'none';
        btn.style.webkitUserSelect = 'none';
        
        // افکت hover
        btn.addEventListener('mouseenter', () => {
            if (!btn.disabled) {
                btn.style.transform = 'scale(1.05)';
                btn.style.transition = 'transform 0.2s ease';
            }
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'scale(1)';
        });
    });
    
    buttons3DSetup = true;
}

/**
 * 🎯 تنظیم همه ایونت‌لیستنرها
 */
function setupEventListeners() {
    // جلوگیری از اجرای چندباره
    if (eventListenersSetup) {
        const log = window.logger || { warn: console.warn };
        log.warn('⚠️ setupEventListeners قبلاً اجرا شده است');
        return;
    }
    eventListenersSetup = true;
    
    // 📱 نوار ناوبری پایین
    if (typeof setupBottomNavigation === 'function') {
        setupBottomNavigation();
    } else if (typeof window.setupBottomNavigation === 'function') {
        window.setupBottomNavigation();
    } else {
        const log = window.logger || { warn: console.warn };
        log.warn('setupBottomNavigation function not found');
    }
    
    // بستن مودال‌ها
    if (elements.closeLoginModal) {
        const closeLoginHandler = () => {
            elements.loginModal.classList.remove('active');
        };
        elements.closeLoginModal.removeEventListener('click', closeLoginHandler);
        addEventListenerOnceUI(elements.closeLoginModal, 'click', closeLoginHandler, 'close-login-modal');
    }
    
    if (elements.closeSubscriptionModal) {
        const closeSubscriptionHandler = () => {
            elements.subscriptionModal.classList.remove('active');
        };
        elements.closeSubscriptionModal.removeEventListener('click', closeSubscriptionHandler);
        addEventListenerOnceUI(elements.closeSubscriptionModal, 'click', closeSubscriptionHandler, 'close-subscription-modal');
    }
    
    if (elements.closePriceModal) {
        const closePriceHandler = () => {
            elements.priceModal.classList.remove('active');
            appState.openModals = Math.max(0, appState.openModals - 1);
        };
        elements.closePriceModal.removeEventListener('click', closePriceHandler);
        addEventListenerOnceUI(elements.closePriceModal, 'click', closePriceHandler, 'close-price-modal');
    }
    
    // بستن مودال با کلیک خارج
    if (elements.loginModal) {
        const loginModalClickHandler = (e) => {
            if (e.target === elements.loginModal || e.target.classList.contains('modal-overlay')) {
                elements.loginModal.classList.remove('active');
            }
        };
        elements.loginModal.removeEventListener('click', loginModalClickHandler);
        addEventListenerOnceUI(elements.loginModal, 'click', loginModalClickHandler, 'login-modal-click');
    }

    if (elements.subscriptionModal) {
        const subscriptionModalClickHandler = (e) => {
            if (e.target === elements.subscriptionModal || e.target.classList.contains('modal-overlay')) {
                elements.subscriptionModal.classList.remove('active');
            }
        };
        elements.subscriptionModal.removeEventListener('click', subscriptionModalClickHandler);
        addEventListenerOnceUI(elements.subscriptionModal, 'click', subscriptionModalClickHandler, 'subscription-modal-click');
    }

    if (elements.priceModal) {
        const priceModalClickHandler = (e) => {
            if (e.target === elements.priceModal || e.target.classList.contains('modal-overlay')) {
                elements.priceModal.classList.remove('active');
                appState.openModals = Math.max(0, appState.openModals - 1);
            }
        };
        elements.priceModal.removeEventListener('click', priceModalClickHandler);
        addEventListenerOnceUI(elements.priceModal, 'click', priceModalClickHandler, 'price-modal-click');
    }
    
    // هایلایت‌های خانه - با جلوگیری از duplicate event listener
    // استفاده از flag برای جلوگیری از duplicate listener به جای cloneNode
    document.querySelectorAll('.highlight-circle[data-category]').forEach(circle => {
        // بررسی اینکه آیا قبلاً listener اضافه شده است
        if (circle.hasAttribute('data-listener-attached')) {
            return; // قبلاً listener اضافه شده
        }
        
        circle.setAttribute('data-listener-attached', 'true');
        
        circle.addEventListener('click', (e) => {
            const target = e.currentTarget;
            if (!target) return;
            
            const category = target.getAttribute('data-category');
            if (!category) return;
            
            // جلوگیری از کلیک روی هایلایت فعال
            if (target.classList.contains('active')) {
                return;
            }
            
            // آپدیت هایلایت فعال - ابتدا اضافه کردن، سپس حذف کردن برای transition نرم
            const allCircles = document.querySelectorAll('.highlight-circle[data-category]');
            
            // ابتدا کلاس active را به target اضافه کن
            target.classList.add('active');
            
            // سپس از بقیه حذف کن - با تاخیر کوتاه برای transition نرم
            requestAnimationFrame(() => {
                allCircles.forEach(c => {
                    if (c && c !== target) {
                        c.classList.remove('active');
                    }
                });
            });
            
            // انتقال به صفحه مربوطه - showView خودش چک می‌کند که آیا نیاز به تغییر است یا نه
            if (category === 'home') {
                showView('home');
            } else {
                showView(category);
            }
            
            appState.currentCategory = category;
            const log = window.logger || { info: console.log }; log.info(`🎯 دسته انتخاب شد: ${category}`);
            
            // نقشه 2D حالا داخل homeView است و به صورت خودکار فقط در صفحه خانه نمایش داده می‌شود
            // نیازی به مدیریت دستی نیست چون داخل view قرار دارد
        });
    });
    
    // هایلایت‌های ابزار
    elements.toolCircles.forEach(circle => {
        circle.addEventListener('click', (e) => {
            const toolId = e.currentTarget.getAttribute('data-tool');
            activateTool(toolId);
        });
    });
    
    // تب‌های هایلایت در صفحات مختلف
    setupHighlightPanels('.highlight-circle[data-news]', 'data-news', '.news-panel', 'data-news-panel');
    setupHighlightPanels('.highlight-circle[data-edu]', 'data-edu', '.edu-panel', 'data-edu-panel');
    setupHighlightPanels('.highlight-circle[data-relax]', 'data-relax', '.relax-panel', 'data-relax-panel');
    setupHighlightPanels('.highlight-circle[data-globe]', 'data-globe', '.globe-panel', 'data-globe-panel');
    
    // Handler برای دکمه‌های باز کردن کره‌ها در صفحه globe - با event delegation
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.globe-open-btn[data-globe-action]');
        if (!btn) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const action = btn.getAttribute('data-globe-action');
        const log = window.logger || { info: console.log }; log.info(`🌍 کلیک روی دکمه: ${action}`);
        
        // نقشه‌برداری action به type کره
        const actionToType = {
            'open-resources': 'resources',
            'open-weather': 'weather',
            'open-military': 'military',
            'open-universities': 'universities',
            'open-historical': 'historical',
            'open-earthquake': 'earthquake',
            'open-natural-resources': 'natural-resources'
        };
        
        const globeType = actionToType[action];
        
        if (globeType === 'resources') {
            // باز کردن کره منابع (همان openResourcesGlobe)
            if (typeof openResourcesGlobe === 'function') {
                openResourcesGlobe();
            } else if (typeof window.openResourcesGlobe === 'function') {
                window.openResourcesGlobe();
            } else {
                const log = window.logger || { error: console.error }; log.error('❌ تابع openResourcesGlobe پیدا نشد!');
                alert('سیستم کره‌ها در حال بارگذاری است...');
            }
        } else if (globeType) {
            // باز کردن سایر کره‌ها
            if (typeof open3DGlobe === 'function') {
                open3DGlobe(globeType);
            } else if (typeof window.open3DGlobe === 'function') {
                window.open3DGlobe(globeType);
            } else {
                const log = window.logger || { error: console.error }; log.error('❌ تابع open3DGlobe پیدا نشد!');
                alert('سیستم کره‌ها در حال بارگذاری است...');
            }
        }
    });
    
    // راه‌اندازی اولیه
    const cfg = window.CONFIG || CONFIG;
    setTimeout(setup3DGlobeButtons, cfg.UI.ANIMATION.SETUP_DELAY);
    
    // راه‌اندازی مجدد وقتی پنل 3D فعال میشه
    const relaxView = document.getElementById('relaxView');
    if (relaxView) {
        // راه‌اندازی با MutationObserver
        const observer = new MutationObserver(() => {
            const panel3d = document.querySelector('.relax-panel[data-relax-panel="3d"]');
            if (panel3d && panel3d.classList.contains('active')) {
                const log = window.logger || { info: console.log }; log.info('🔄 پنل 3D فعال شد، راه‌اندازی مجدد دکمه‌ها...');
                const cfg = window.CONFIG || CONFIG;
                setTimeout(setup3DGlobeButtons, cfg.UI.ANIMATION.RETRY_DELAY);
            }
        });
        observer.observe(relaxView, { 
            attributes: true, 
            attributeFilter: ['class'],
            childList: true,
            subtree: true
        });
        
        // همچنین با event listener برای highlight circle
        document.addEventListener('click', (e) => {
            if (e.target && typeof e.target.closest === 'function') {
                const highlight = e.target.closest('.highlight-circle[data-relax="3d"]');
                if (highlight) {
                    const log = window.logger || { info: console.log }; log.info('🔄 کلیک روی هایلایت 3D، راه‌اندازی مجدد دکمه‌ها...');
                    setTimeout(setup3DGlobeButtons, 500);
                }
            }
        });
    }
    
    // Event delegation برای کلیک روی دکمه‌های 3D (fallback)
    document.addEventListener('click', (e) => {
        if (!e.target || !e.target.closest || typeof e.target.closest !== 'function') return;
        
        // پیدا کردن دکمه 3D با استفاده از attribute selector
        let btn = null;
        
        // چک کن که آیا خود المان دکمه 3D هست
        if (e.target.classList && e.target.classList.contains('3d-globe-btn')) {
            btn = e.target;
        } else if (e.target.hasAttribute && e.target.hasAttribute('data-globe')) {
            // اگر المان داخل دکمه هست، دکمه والد رو پیدا کن
            let parent = e.target.parentElement;
            let depth = 0;
            while (parent && depth < 5) {
                if (parent.classList && parent.classList.contains('3d-globe-btn')) {
                    btn = parent;
                    break;
                }
                parent = parent.parentElement;
                depth++;
            }
        } else {
            // استفاده از closest با attribute selector
            try {
                // پیدا کردن دکمه والد با استفاده از parent traversal
                let parent = e.target.parentElement;
                let depth = 0;
                while (parent && depth < 5) {
                    if (parent.classList && parent.classList.contains('3d-globe-btn') && parent.hasAttribute('data-globe')) {
                        btn = parent;
                        break;
                    }
                    parent = parent.parentElement;
                    depth++;
                }
            } catch (err) {
                const log = window.logger || { warn: console.warn }; log.warn('خطا در پیدا کردن دکمه 3D:', err);
            }
        }
        
        if (btn) {
            e.preventDefault();
            e.stopPropagation();
            const globeType = btn.getAttribute('data-globe');
            const log = window.logger || { info: console.log }; log.info(`🌍 کلیک روی دکمه 3D (delegation): ${globeType}`, btn);
            
            if (globeType) {
                if (typeof open3DGlobe === 'function') {
                    open3DGlobe(globeType);
                } else if (typeof window.open3DGlobe === 'function') {
                    window.open3DGlobe(globeType);
                }
            }
        }
    }, true);
    
    // چت - فقط اگر elements وجود داشته باشند (در React ممکن است وجود نداشته باشند)
    if (elements.sendMessage && elements.chatInput) {
        const sendMessageHandler = () => {
            if (typeof sendChatMessage === 'function') {
                sendChatMessage();
            }
        };
        elements.sendMessage.removeEventListener('click', sendMessageHandler);
        addEventListenerOnceUI(elements.sendMessage, 'click', sendMessageHandler, 'send-message-click');
        
        const chatInputHandler = (e) => {
            if (e.key === 'Enter') {
                if (typeof sendChatMessage === 'function') {
                    sendChatMessage();
                }
            }
        };
        elements.chatInput.removeEventListener('keypress', chatInputHandler);
        addEventListenerOnceUI(elements.chatInput, 'keypress', chatInputHandler, 'chat-input-keypress');
    } else {
        // در React، chat elements ممکن است وجود نداشته باشند
        const log = window.logger || { debug: console.log };
        log.debug('Chat elements در React موجود نیستند - نادیده گرفته شد');
    }
    
    // فرم ورود - فقط اگر وجود داشته باشد (در React ممکن است وجود نداشته باشد)
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        const loginFormHandler = (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername')?.value;
            const password = document.getElementById('loginPassword')?.value;
            
            // شبیه‌سازی ورود موفق
            if (username && password) {
                alert('✅ ورود موفقیت‌آمیز بود!');
                if (elements.loginModal) {
                    elements.loginModal.classList.remove('active');
                }
            } else {
                alert('⚠️ لطفا اطلاعات را کامل وارد کنید.');
            }
        };
        loginForm.removeEventListener('submit', loginFormHandler);
        addEventListenerOnceUI(loginForm, 'submit', loginFormHandler, 'login-form-submit');
    } else {
        // در React، login form ممکن است وجود نداشته باشد
        const log = window.logger || { debug: console.log };
        log.debug('Login form در React موجود نیست - نادیده گرفته شد');
    }
    
    // دکمه خرید اشتراک - فقط اگر وجود داشته باشد
    const goToSubscriptionBtn = document.getElementById('goToSubscription');
    if (goToSubscriptionBtn) {
        const goToSubscriptionHandler = () => {
            if (elements.loginModal) {
                elements.loginModal.classList.remove('active');
            }
            if (elements.subscriptionModal) {
                elements.subscriptionModal.classList.add('active');
            }
        };
        goToSubscriptionBtn.removeEventListener('click', goToSubscriptionHandler);
        addEventListenerOnceUI(goToSubscriptionBtn, 'click', goToSubscriptionHandler, 'go-to-subscription-click');
    }
    
    // دکمه‌های خرید اشتراک
    document.querySelectorAll('.subscribe-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const plan = e.target.getAttribute('data-plan');
            alert(`🎉 اشتراک ${plan === 'monthly' ? 'یک ماهه' : 'سه ماهه'} با موفقیت خریداری شد!`);
            elements.subscriptionModal.classList.remove('active');
            
            // بازنشانی استفاده کاربر
            appState.userUsage = { chat: 0, tools: 0 };
            saveUserState();
            updateUsageDisplay();
        });
    });
    
    // ارسال نظر - فقط اگر element وجود داشته باشد
    const submitFeedback = document.getElementById('submitFeedback');
    if (submitFeedback) {
        addEventListenerOnceUI(submitFeedback, 'click', () => {
            const feedback = document.getElementById('feedbackText');
            if (feedback && feedback.value.trim()) {
                alert('✅ نظر شما با موفقیت ثبت شد. با تشکر!');
                feedback.value = '';
            } else {
                alert('⚠️ لطفا نظر خود را بنویسید.');
            }
        }, 'submit-feedback-click');
    }
    
    // ابزارها - فقط اگر elements وجود داشته باشند
    if (elements.calculateGold) {
        addEventListenerOnceUI(elements.calculateGold, 'click', calculateGoldPrice, 'calculate-gold-click');
    }
    if (elements.analyzeDiamond) {
        addEventListenerOnceUI(elements.analyzeDiamond, 'click', analyzeDiamond, 'analyze-diamond-click');
    }
    if (elements.convertCurrency) {
        addEventListenerOnceUI(elements.convertCurrency, 'click', convertCurrency, 'convert-currency-click');
    }
    if (elements.analyzeCoin) {
        addEventListenerOnceUI(elements.analyzeCoin, 'click', analyzeCoin, 'analyze-coin-click');
    }
    
    // رویدادهای کره‌ها از طریق دکمه سیار مدیریت می‌شوند
    // (کدهای قبلی حذف شدند - دکمه‌های X جایشان را به منوی شیشه‌ای دادند)
    
    // بستن modal با کلیک روی overlay - فقط اگر modals وجود داشته باشند
    const financialModal = document.getElementById('financialGlobeModal');
    const resourcesModal = document.getElementById('resourcesGlobeModal');
    
    if (financialModal) {
        addEventListenerOnceUI(financialModal, 'click', (e) => {
            if (e.target === financialModal) {
                closeGlobeModal('financialGlobeModal');
            }
        }, 'financial-modal-overlay-click');
    }
    
    if (resourcesModal) {
        addEventListenerOnceUI(resourcesModal, 'click', (e) => {
            if (e.target === resourcesModal) {
                closeGlobeModal('resourcesGlobeModal');
            }
        }, 'resources-modal-overlay-click');
    }
    
    // آپلود عکس - فقط اگر elements وجود داشته باشند
    const diamondUploadArea = document.getElementById('diamondUploadArea');
    const diamondImage = document.getElementById('diamondImage');
    if (diamondUploadArea && diamondImage) {
        addEventListenerOnceUI(diamondUploadArea, 'click', () => {
            diamondImage.click();
        }, 'diamond-upload-click');
        
        addEventListenerOnceUI(diamondImage, 'change', function(e) {
            if (this.files.length > 0) {
                diamondUploadArea.innerHTML = `📁 ${this.files[0].name}`;
            }
        }, 'diamond-image-change');
    }
    
    const coinUploadArea = document.getElementById('coinUploadArea');
    const coinImage = document.getElementById('coinImage');
    if (coinUploadArea && coinImage) {
        addEventListenerOnceUI(coinUploadArea, 'click', () => {
            coinImage.click();
        }, 'coin-upload-click');
        
        addEventListenerOnceUI(coinImage, 'change', function(e) {
            if (this.files.length > 0) {
                coinUploadArea.innerHTML = `📁 ${this.files[0].name}`;
            }
        }, 'coin-image-change');
    }
}

// ==================== //
// 🃏 مدیریت کارت‌ها در همه صفحات
// ==================== //

/**
 * 🎯 تنظیم ایونت‌لیستنر برای همه کارت‌های قیمت
 */
function setupAllCardListeners() {
    // پیدا کردن همه کارت‌ها در همه صفحات
    const allPriceCards = document.querySelectorAll('.price-card');
    
    allPriceCards.forEach(card => {
        // حذف ایونت‌لیستنرهای قبلی (اگر هستن)
        card.replaceWith(card.cloneNode(true));
    });
    
    // آپدیت mini-chart ها با SVG و اضافه کردن تایم آپدیت
    document.querySelectorAll('.price-card').forEach(card => {
        const miniChart = card.querySelector('.mini-chart');
        const symbol = card.getAttribute('data-symbol') || 'UNKNOWN';
        const changeEl = card.querySelector('.price-change');
        
        // تشخیص صعودی/نزولی از چند منبع
        let isUp = true;
        
        // 1. اول از کلاس mini-chart چک کن
        if (miniChart) {
            if (miniChart.classList.contains('down')) {
                isUp = false;
            } else if (miniChart.classList.contains('up')) {
                isUp = true;
            }
        }
        
        // 2. اگر کلاس نداره، از price-change چک کن
        if (changeEl) {
            if (changeEl.classList.contains('negative')) {
                isUp = false;
            } else if (changeEl.classList.contains('positive')) {
                isUp = true;
            } else {
                // 3. از متن تغییرات چک کن
                const text = changeEl.textContent.trim();
                if (text.startsWith('-') || text.includes('-')) {
                    isUp = false;
                }
            }
        }
        
        if (miniChart && !miniChart.querySelector('svg')) {
            miniChart.innerHTML = generateMiniChartSVG(symbol, isUp);
        }
        
        // حذف تبلیغات
        const adSpace = card.querySelector('.ad-space');
        if (adSpace) adSpace.style.display = 'none';
        
        // اضافه کردن تایم آپدیت (اگر نداره)
        if (!card.querySelector('.card-update-time')) {
            const updateDiv = document.createElement('div');
            updateDiv.className = 'card-update-time';
            updateDiv.innerHTML = `
                <span class="update-dot"></span>
                <span class="update-text">${getLastUpdateTime()}</span>
            `;
            card.appendChild(updateDiv);
        }
    });
    
    // دوباره پیدا کردن و اضافه کردن ایونت‌لیستنر
    document.querySelectorAll('.price-card').forEach(card => {
        card.addEventListener('click', function() {
            // چک لاگین
            if (!checkLoginRequired()) return;
            
            const symbol = this.getAttribute('data-symbol');
            const cardTitle = this.querySelector('h3').textContent;
            const priceText = this.querySelector('.current-price').textContent;
            const changeElement = this.querySelector('.price-change');
            const changeText = changeElement ? changeElement.textContent : '0%';
            
            // 🆕 ایجاد یک آیتم ساده از اطلاعات کارت
            const simpleItem = {
                name: cardTitle,
                symbol: symbol || cardTitle,
                price: extractPrice(priceText),
                change: extractChange(changeText),
                chart: changeElement && changeElement.classList.contains('positive') ? 'up' : 'down'
            };
            
            openPriceDetail(simpleItem);
        });
    });
    
    const log = window.logger || { info: console.log }; log.info(`🎯 ایونت‌لیستنر برای ${allPriceCards.length} کارت تنظیم شد`);
}

/**
 * 🔢 استخراج قیمت از متن
 */
function extractPrice(priceText) {
    // حذف کاراکترهای غیرعددی و تبدیل به عدد
    const cleanPrice = priceText.replace(/[^\d.]/g, '');
    return parseFloat(cleanPrice) || 0;
}

/**
 * 🔢 استخراج درصد تغییر از متن
 */
function extractChange(changeText) {
    // حذف کاراکترهای غیرعددی و تبدیل به عدد
    const cleanChange = changeText.replace(/[^\d.-]/g, '');
    return parseFloat(cleanChange) || 0;
}


// Circular3DSlider حذف شد - اسلایدر قدیمی دیگر استفاده نمی‌شود

// ====================
// 📚 بخش آموزش (AI)
// ====================

// چت‌بات آموزشی
const eduChatForm = document.getElementById("eduChatForm");
const eduChatWindow = document.getElementById("eduChatWindow");

if (eduChatForm) {
    eduChatForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = document.getElementById("eduChatInput");
        const message = input.value.trim();
        if (!message) return;

        // نمایش پیام کاربر
        const userMsg = document.createElement("div");
        userMsg.className = "chat-msg user";
        userMsg.textContent = message;
        eduChatWindow.appendChild(userMsg);

        // پاک کردن ورودی
        input.value = "";

        // پاسخ هوش مصنوعی (فعلاً Mock)
        const aiMsg = document.createElement("div");
        aiMsg.className = "chat-msg ai";
        aiMsg.textContent = "🔎 در حال پردازش سؤال... (اینجا بعداً به n8n وصل میشه)";
        eduChatWindow.appendChild(aiMsg);

        eduChatWindow.scrollTop = eduChatWindow.scrollHeight;
    });
}

// کوئیز هوشمند
const quizStart = document.getElementById("quizStart");
const quizNext = document.getElementById("quizNext");
const quizBody = document.getElementById("quizBody");
const quizFeedback = document.getElementById("quizFeedback");

let quizIndex = 0;
const quizQuestions = [
    {
        q: "مدیریت سرمایه در ترید یعنی چه؟",
        options: ["کنترل احساسات", "مدیریت حجم معاملات", "پیش‌بینی بازار", "یادگیری تحلیل تکنیکال"],
        answer: 1
    },
    {
        q: "کندل سبز در نمودار چه چیزی نشان می‌دهد؟",
        options: ["افزایش قیمت", "کاهش قیمت", "ثبات بازار", "هیچ‌کدام"],
        answer: 0
    }
];

if (quizStart) {
    quizStart.addEventListener("click", () => {
        quizIndex = 0;
        showQuizQuestion();
        quizNext.disabled = false;
    });
}

if (quizNext) {
    quizNext.addEventListener("click", () => {
        quizIndex++;
        if (quizIndex < quizQuestions.length) {
            showQuizQuestion();
        } else {
            quizBody.innerHTML = "<p>🎉 آزمون تمام شد!</p>";
            quizNext.disabled = true;
        }
    });
}

function showQuizQuestion() {
    const q = quizQuestions[quizIndex];
    quizBody.innerHTML = `<p>${q.q}</p>`;
    q.options.forEach((opt, i) => {
        const btn = document.createElement("button");
        btn.textContent = opt;
        btn.addEventListener("click", () => {
            if (i === q.answer) {
                quizFeedback.textContent = "✅ درست!";
            } else {
                quizFeedback.textContent = "❌ اشتباه!";
            }
        });
        quizBody.appendChild(btn);
    });
}

// تحلیل زنده (Mock)
const refreshLiveData = document.getElementById("refreshLiveData");
const aiExplainText = document.getElementById("aiExplainText");

if (refreshLiveData) {
    refreshLiveData.addEventListener("click", () => {
        aiExplainText.textContent = "📊 داده‌ها به‌روزرسانی شدند. (اینجا بعداً تحلیل AI اضافه میشه)";
    });
}


// ====================
// 🧘‍♂️ بخش آرامش (AI)
// ====================

// انتخاب حالت و پیشنهاد هوشمند
const moodForm = document.getElementById("moodForm");
const moodSuggestion = document.getElementById("moodSuggestion");

if (moodForm) {
    moodForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const mood = document.querySelector("input[name='mood']:checked").value;
        let suggestion = "";
        if (mood === "calm") suggestion = "🎶 موزیک آرامش‌بخش + بازی ساده حافظه";
        if (mood === "focus") suggestion = "🎧 موزیک تمرکز + بازی سرعت واکنش";
        if (mood === "energy") suggestion = "🔥 موزیک انرژی‌زا + بازی کلیک سریع";
        moodSuggestion.textContent = suggestion + " (بعداً AI پیشنهاد شخصی‌سازی میده)";
    });
}

// پلیر موزیک (لیست ساده)
const playlist = document.getElementById("playlist");
const audioPlayer = document.getElementById("audioPlayer");

if (playlist) {
    const tracks = [
        { title: "Calm Track 1", src: "assets/music/calm-01.mp3" },
        { title: "Focus Track 1", src: "assets/music/focus-01.mp3" },
        { title: "Energy Track 1", src: "assets/music/energy-01.mp3" }
    ];

    tracks.forEach(track => {
        const li = document.createElement("li");
        li.textContent = track.title;
        li.addEventListener("click", () => {
            audioPlayer.src = track.src;
            audioPlayer.play();
        });
        playlist.appendChild(li);
    });
}

// بازی حافظه ساده
const gameGrid = document.getElementById("gameGrid");
const gameStart = document.getElementById("gameStart");
const gameStatus = document.getElementById("gameStatus");

if (gameStart) {
    gameStart.addEventListener("click", () => {
        gameGrid.innerHTML = "";
        gameStatus.textContent = "بازی شروع شد!";
        for (let i = 0; i < 8; i++) {
            const card = document.createElement("div");
            card.textContent = "?";
            card.addEventListener("click", () => {
                card.textContent = "✔";
            });
            gameGrid.appendChild(card);
        }
    });
}


// ==================== //
// 🎮 دکمه شناور حرفه‌ای - نسخه نهایی
// ==================== //

class AssistiveTouch {
    constructor() {
        this.touchElement = document.getElementById('assistiveTouch');
        if (!this.touchElement) {
            const log = window.logger || { error: console.error };
            log.error('assistiveTouch element not found');
            return;
        }
        this.touchButton = this.touchElement.querySelector('.touch-button');
        this.glassMenu = document.getElementById('glassMenu');
        
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.initialX = 0;
        this.initialY = 0;
        this.dragThreshold = 5; // حداقل حرکت برای تشخیص درگ
        this.hasMoved = false;
        
        // Bind methods
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        
        this.init();
    }
    
    init() {
        if (!this.touchElement) {
            return; // اگر element وجود ندارد، init را متوقف کن
        }
        
        // بررسی وجود touchButton
        if (!this.touchButton) {
            // تلاش مجدد برای پیدا کردن touchButton
            this.touchButton = this.touchElement.querySelector('.touch-button');
            if (!this.touchButton) {
                const log = window.logger || { warn: console.warn };
                log.warn('⚠️ touch-button پیدا نشد - صبر می‌کنیم...');
                // تلاش مجدد بعد از تاخیر
                setTimeout(() => {
                    this.touchButton = this.touchElement.querySelector('.touch-button');
                    if (this.touchButton) {
                        this.setupEventListeners();
                    }
                }, 200);
                // ادامه با سایر تنظیمات حتی اگر touchButton موجود نباشد
            }
        }
        
        if (this.touchButton) {
            this.setupEventListeners();
        }
        this.setupGlassMenu();
        this.loadPosition();
        this.ensureVisibility(); // اطمینان از نمایش
        
        // یک بار دیگر بعد از تاخیر برای اطمینان از نمایش در همه مرورگرها (مخصوص اپرا)
        // طبق یادداشت مرجع: تاخیر 200ms برای اپرا
        setTimeout(() => {
            this.ensureVisibility();
            // اگر touchButton هنوز موجود نیست، دوباره تلاش کن
            if (!this.touchButton) {
                this.touchButton = this.touchElement.querySelector('.touch-button');
                if (this.touchButton) {
                    this.setupEventListeners();
                }
            }
        }, 200);
    }
    
    ensureVisibility() {
        // مطمئن شو که دکمه نمایش داده می‌شه - با !important برای override کردن هر CSS دیگر
        if (this.touchElement) {
            // تنظیمات پایه برای نمایش
            this.touchElement.style.setProperty('display', 'block', 'important');
            this.touchElement.style.setProperty('visibility', 'visible', 'important');
            this.touchElement.style.setProperty('opacity', '1', 'important');
            this.touchElement.style.setProperty('pointer-events', 'auto', 'important');
            this.touchElement.style.setProperty('touch-action', 'none', 'important');
            
            // بهبود سازگاری با اپرا و سایر مرورگرها
            this.touchElement.style.setProperty('-webkit-transform', 'translateZ(0)', 'important');
            this.touchElement.style.setProperty('-moz-transform', 'translateZ(0)', 'important');
            this.touchElement.style.setProperty('-ms-transform', 'translateZ(0)', 'important');
            this.touchElement.style.setProperty('transform', 'translateZ(0)', 'important');
            
            // اطمینان از اندازه در موبایل
            const cfg = window.CONFIG || CONFIG;
            if (window.innerWidth <= cfg.UI.MOBILE_BREAKPOINT) {
                this.touchElement.style.setProperty('min-width', '55px', 'important');
                this.touchElement.style.setProperty('min-height', '55px', 'important');
                
                const bottomNavBar = document.getElementById('bottomNavBar');
                const bottomNavHeight = bottomNavBar ? bottomNavBar.offsetHeight : 0;
                const rect = this.touchElement.getBoundingClientRect();
                const maxY = window.innerHeight - bottomNavHeight - this.touchElement.offsetHeight - 10;
                
                // اگر موقعیت تنظیم نشده، موقعیت اولیه را تنظیم کن
                const hasPosition = this.touchElement.style.left || this.touchElement.style.top;
                if (!hasPosition || rect.width === 0 || rect.height === 0) {
                    // تنظیم موقعیت اولیه
                    const initialTop = window.innerHeight - bottomNavHeight - 55 - 20;
                    this.touchElement.style.setProperty('left', '20px', 'important');
                    this.touchElement.style.setProperty('top', initialTop + 'px', 'important');
                    this.touchElement.style.setProperty('bottom', 'auto', 'important');
                    this.touchElement.style.setProperty('right', 'auto', 'important');
                } else if (rect.bottom > (window.innerHeight - bottomNavHeight - 10)) {
                    // اگر دکمه زیر نوار پایین است، آن را به بالا منتقل کن
                    const currentTop = parseInt(this.touchElement.style.top) || rect.top;
                    const newTop = Math.min(currentTop, maxY);
                    this.touchElement.style.setProperty('top', newTop + 'px', 'important');
                    this.touchElement.style.setProperty('bottom', 'auto', 'important');
                    this.touchElement.style.setProperty('right', 'auto', 'important');
                }
            }
            
            // Force reflow برای اطمینان از اعمال تغییرات در اپرا
            this.touchElement.offsetHeight;
        }
        
        // اطمینان از نمایش دکمه داخلی
        if (this.touchButton) {
            this.touchButton.style.setProperty('display', 'flex', 'important');
            this.touchButton.style.setProperty('visibility', 'visible', 'important');
            this.touchButton.style.setProperty('opacity', '1', 'important');
        }
    }
    
    setupEventListeners() {
        // بررسی وجود touchButton
        if (!this.touchButton) {
            const log = window.logger || { warn: console.warn };
            log.warn('⚠️ touchButton پیدا نشد - event listeners اضافه نشدند');
            return;
        }
        
        // حذف listeners قبلی (اگر وجود دارند) برای جلوگیری از duplicate
        const newButton = this.touchButton.cloneNode(true);
        this.touchButton.parentNode.replaceChild(newButton, this.touchButton);
        this.touchButton = newButton;
        
        // رویدادهای موس
        this.touchButton.addEventListener('mousedown', this.handleMouseDown.bind(this), { passive: false });
        
        // رویدادهای تاچ
        this.touchButton.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        
        // جلوگیری از رفتارهای پیش‌فرض
        this.touchButton.addEventListener('dragstart', (e) => e.preventDefault());
        this.touchButton.addEventListener('contextmenu', (e) => e.preventDefault());
        
        const log = window.logger || { info: console.log };
        log.info('✅ Event listeners برای دکمه سیار اضافه شدند');
    }
    
    handleMouseDown(e) {
        e.preventDefault();
        e.stopPropagation();
        
        this.startDrag(e.clientX, e.clientY);
        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseup', this.handleMouseUp);
    }
    
    handleTouchStart(e) {
        // فقط اگر روی دکمه سیار خودمان بود
        const target = e.target;
        const isOnButton = target.closest('.assistive-touch') === this.touchElement || 
                          target.closest('.touch-button') === this.touchButton;
        
        if (!isOnButton) {
            return;
        }
        
        const touch = e.touches[0];
        if (!touch) return;
        
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation(); // جلوگیری از رسیدن event به سایر listener ها
        
        // اطمینان از اینکه موقعیت اولیه درست است
        const rect = this.touchElement.getBoundingClientRect();
        this.initialX = rect.left;
        this.initialY = rect.top;
        
        this.startDrag(touch.clientX, touch.clientY);
        document.addEventListener('touchmove', this.handleTouchMove, { passive: false });
        document.addEventListener('touchend', this.handleTouchEnd, { passive: false });
    }
    
    startDrag(clientX, clientY) {
        this.isDragging = true;
        this.hasMoved = false;
        this.startX = clientX;
        this.startY = clientY;
        
        // گرفتن موقعیت فعلی از getBoundingClientRect برای دقت بیشتر
        const rect = this.touchElement.getBoundingClientRect();
        this.initialX = rect.left;
        this.initialY = rect.top;
        
        // غیرفعال کردن transition و اضافه کردن حالت درگ
        this.touchElement.style.setProperty('transition', 'none', 'important');
        this.touchElement.classList.add('dragging');
        
        // اطمینان از اینکه right و bottom تنظیم نشده‌اند
        this.touchElement.style.setProperty('right', 'auto', 'important');
        this.touchElement.style.setProperty('bottom', 'auto', 'important');
    }
    
    handleMouseMove(e) {
        if (!this.isDragging) return;
        
        const deltaX = Math.abs(e.clientX - this.startX);
        const deltaY = Math.abs(e.clientY - this.startY);
        
        // اگر حرکت بیشتر از threshold بود، درگ محسوب می‌شه
        if (deltaX > this.dragThreshold || deltaY > this.dragThreshold) {
            this.hasMoved = true;
        }
        
        // همیشه موقعیت را آپدیت کن - این باعث می‌شود drag در همه جهات (چپ، راست، بالا، پایین) کار کند
        this.updatePosition(e.clientX, e.clientY);
    }
    
    handleTouchMove(e) {
        if (!this.isDragging) return;
        
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation(); // جلوگیری از رسیدن event به سایر listener ها
        
        const touch = e.touches[0];
        if (!touch) return;
        
        // محاسبه delta برای تشخیص drag
        const deltaX = Math.abs(touch.clientX - this.startX);
        const deltaY = Math.abs(touch.clientY - this.startY);
        
        if (deltaX > this.dragThreshold || deltaY > this.dragThreshold) {
            this.hasMoved = true;
        }
        
        // همیشه موقعیت را آپدیت کن - این باعث می‌شود drag در همه جهات (افقی و عمودی) کار کند
        // استفاده از clientX و clientY برای دقت بیشتر
        this.updatePosition(touch.clientX, touch.clientY);
    }
    
    updatePosition(clientX, clientY) {
        const deltaX = clientX - this.startX;
        const deltaY = clientY - this.startY;
        
        let newX = this.initialX + deltaX;
        let newY = this.initialY + deltaY;
        
        // محدودیت‌های صفحه - با در نظر گیری نوار پایین در موبایل
        const bottomNavBar = document.getElementById('bottomNavBar');
        const bottomNavHeight = bottomNavBar ? bottomNavBar.offsetHeight : 0;
        const maxX = window.innerWidth - this.touchElement.offsetWidth;
        const maxY = window.innerHeight - this.touchElement.offsetHeight - bottomNavHeight;
        
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));
        
        // استفاده از left و top برای موقعیت - با !important برای override کردن CSS
        this.touchElement.style.setProperty('left', newX + 'px', 'important');
        this.touchElement.style.setProperty('top', newY + 'px', 'important');
        this.touchElement.style.setProperty('right', 'auto', 'important');
        this.touchElement.style.setProperty('bottom', 'auto', 'important');
        
        // Force reflow برای اطمینان از اعمال تغییرات
        this.touchElement.offsetHeight;
    }
    
    handleMouseUp(e) {
        this.endDragging();
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
        
        // اگر درگ نبوده، کلیک محسوب می‌شه
        if (!this.hasMoved) {
            this.handleTap(e);
        }
    }
    
    handleTouchEnd(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation(); // جلوگیری از رسیدن event به سایر listener ها
        
        this.endDragging();
        document.removeEventListener('touchmove', this.handleTouchMove);
        document.removeEventListener('touchend', this.handleTouchEnd);
        
        if (!this.hasMoved) {
            this.handleTap(e);
        }
    }
    
    /**
     * Handler: تاپ/کلیک روی دکمه (بدون drag)
     * 
     * این متد زمانی فراخوانی می‌شود که:
     * - کاربر روی دکمه کلیک/تاچ کرده است
     * - اما drag نکرده است (hasMoved === false)
     * 
     * عملکرد:
     * - منوی شیشه‌ای را باز می‌کند
     * 
     * @param {Event} e - event object
     */
    handleTap(e) {
        e.stopPropagation();
        const log = window.logger || { info: console.log };
        log.info('🎮 handleTap فراخوانی شد - باز کردن منوی شیشه‌ای');
        this.openGlassMenu();
    }
    
    endDragging() {
        if (this.isDragging) {
            this.isDragging = false;
            this.touchElement.classList.remove('dragging');
            
            if (this.hasMoved) {
                this.snapToEdge();
                this.savePosition();
            }
        }
    }
    
    snapToEdge() {
        const rect = this.touchElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // در نظر گیری نوار پایین در موبایل
        const bottomNavBar = document.getElementById('bottomNavBar');
        const bottomNavHeight = bottomNavBar ? bottomNavBar.offsetHeight : 0;
        const availableHeight = windowHeight - bottomNavHeight;
        
        // فاصله تا لبه‌ها
        const toLeft = centerX;
        const toRight = windowWidth - centerX;
        
        // پیدا کردن نزدیک‌ترین لبه (فقط افقی - نه عمودی)
        let newX = rect.left;
        let newY = rect.top; // ارتفاع فعلی حفظ می‌شود
        
        // Snap افقی - فقط به چپ یا راست
        if (toLeft < toRight) {
            newX = 15;
        } else {
            newX = windowWidth - rect.width - 15;
        }
        
        // ارتفاع فعلی حفظ می‌شود - فقط محدودیت‌های صفحه اعمال می‌شود (با در نظر گیری نوار پایین)
        newY = Math.max(15, Math.min(newY, availableHeight - rect.height - 15));
        
        // انیمیشن Snap - با !important برای override کردن CSS
        this.touchElement.style.setProperty('transition', 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)', 'important');
        this.touchElement.style.setProperty('left', newX + 'px', 'important');
        this.touchElement.style.setProperty('top', newY + 'px', 'important');
        this.touchElement.style.setProperty('right', 'auto', 'important');
        this.touchElement.style.setProperty('bottom', 'auto', 'important');
        
        const cfg = window.CONFIG || CONFIG;
        setTimeout(() => {
            this.touchElement.style.setProperty('transition', '', 'important');
        }, cfg.UI.ANIMATION.TRANSITION_DURATION);
    }
    
    /**
     * راه‌اندازی منوی شیشه‌ای
     * 
     * این متد:
     * 1. دکمه بستن منو را پیدا می‌کند
     * 2. event listener برای بستن منو اضافه می‌کند
     * 3. event listener برای کلیک روی overlay اضافه می‌کند
     * 4. event listener برای آیتم‌های منو اضافه می‌کند
     * 5. event listener برای Escape key اضافه می‌کند
     * 
     * وابستگی‌ها:
     * - document.getElementById('closeGlassMenu'): دکمه بستن منو
     * - this.glassMenu: المان منوی شیشه‌ای
     * - document.querySelectorAll('.glass-menu-item'): آیتم‌های منو
     */
    setupGlassMenu() {
        // بررسی وجود elements
        const closeGlassMenuBtn = document.getElementById('closeGlassMenu');
        if (!closeGlassMenuBtn) {
            const log = window.logger || { warn: console.warn };
            log.warn('⚠️ closeGlassMenu element not found - skipping setup');
            return;
        }
        
        // بررسی وجود glassMenu - اگر در constructor پیدا نشد، دوباره تلاش کن
        if (!this.glassMenu) {
            this.glassMenu = document.getElementById('glassMenu');
            if (!this.glassMenu) {
                const log = window.logger || { warn: console.warn };
                log.warn('⚠️ glassMenu element not found - skipping setup');
                return;
            }
        }
        
        // حذف event listeners قبلی با clone کردن menu برای جلوگیری از duplicate listeners
        const newMenu = this.glassMenu.cloneNode(true);
        this.glassMenu.parentNode.replaceChild(newMenu, this.glassMenu);
        this.glassMenu = newMenu;
        
        // دکمه بستن منو - پیدا کردن دوباره بعد از clone
        const closeBtn = this.glassMenu.querySelector('#closeGlassMenu');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeGlassMenu();
            });
        }
        
        // کلیک روی backdrop
        this.glassMenu.addEventListener('click', (e) => {
            if (e.target === this.glassMenu) {
                this.closeGlassMenu();
            }
        });
        
        // استفاده از event delegation برای آیتم‌های منو - طبق یادداشت مرجع
        const handleGlassMenuClick = (e) => {
            const menuItem = e.target.closest('.glass-menu-item');
            if (!menuItem) return;
            
            e.preventDefault();
            e.stopPropagation();
            
            const page = menuItem.getAttribute('data-page');
            if (page) {
                this.navigateToPage(page);
                this.closeGlassMenu();
            }
        };
        
        // اضافه کردن listener با event delegation
        this.glassMenu.addEventListener('click', handleGlassMenuClick);
        
        // بستن با Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.glassMenu && this.glassMenu.classList.contains('active')) {
                this.closeGlassMenu();
            }
        });
    }
    
    /**
     * باز کردن منوی شیشه‌ای
     * 
     * این متد:
     * 1. کلاس 'active' را به glassMenu اضافه می‌کند
     * 2. overflow body را hidden می‌کند تا از اسکرول پس‌زمینه جلوگیری شود
     * 
     * وابستگی:
     * - this.glassMenu: المان منوی شیشه‌ای (از document.getElementById('glassMenu'))
     */
    openGlassMenu() {
        if (!this.glassMenu) {
            const log = window.logger || { warn: console.warn };
            log.warn('⚠️ glassMenu element پیدا نشد - نمی‌توان منو را باز کرد');
            // تلاش برای پیدا کردن دوباره
            this.glassMenu = document.getElementById('glassMenu');
            if (!this.glassMenu) {
                return;
            }
        }
        
        this.glassMenu.classList.add('active');
        document.body.style.overflow = 'hidden'; // جلوگیری از اسکرول پس‌زمینه
        
        const log = window.logger || { info: console.log };
        log.info('✅ منوی شیشه‌ای باز شد');
    }
    
    /**
     * بستن منوی شیشه‌ای
     * 
     * این متد:
     * 1. کلاس 'active' را از glassMenu حذف می‌کند (برای مخفی کردن)
     * 2. overflow body را به حالت عادی برمی‌گرداند
     */
    closeGlassMenu() {
        // بررسی وجود glassMenu
        if (!this.glassMenu) {
            this.glassMenu = document.getElementById('glassMenu');
            if (!this.glassMenu) {
                const log = window.logger || { error: console.error };
                log.error('❌ glassMenu element not found in closeGlassMenu');
                return;
            }
        }
        
        // حذف کلاس active برای مخفی کردن منو
        this.glassMenu.classList.remove('active');
        
        // بازگشت اسکرول به حالت عادی
        document.body.style.overflow = '';
        
        const log = window.logger || { info: console.log };
        log.info('✅ منوی شیشه‌ای بسته شد');
    }
    
    navigateToPage(page) {
        const log = window.logger || { info: console.log }; log.info(`🎮 رفتن به صفحه: ${page}`);
        
        // اگر در React Router هستیم، از React Router استفاده کن
        if (window.React && document.getElementById('root')) {
            // Map page names to React Router paths
            const pageToPath = {
                'home': '/',
                'news': '/news',
                'globe': '/globe',
                'tutorial': '/tutorial',
                'relax': '/relax',
                'tools': '/tools'
            };
            
            const path = pageToPath[page] || '/';
            
            // استفاده از window.navigate که از React Router می‌آید
            if (typeof window.navigate === 'function') {
                window.navigate(path);
            } else {
                // Fallback: استفاده از window.location
                window.location.href = path;
            }
        } else if (typeof showView !== 'undefined') {
            // در حالت vanilla JS
            showView(page);
        }
    }
    
    savePosition() {
        const position = {
            left: this.touchElement.style.left,
            top: this.touchElement.style.top
        };
        localStorage.setItem('assistiveTouchPos', JSON.stringify(position));
    }
    
    loadPosition() {
        const saved = localStorage.getItem('assistiveTouchPos');
        if (saved) {
            try {
                const position = JSON.parse(saved);
                if (position.left && position.top) {
                    // در موبایل، مطمئن شو که دکمه بالای نوار پایین است
                    const bottomNavBar = document.getElementById('bottomNavBar');
                    const bottomNavHeight = bottomNavBar ? bottomNavBar.offsetHeight : 0;
                    const maxY = window.innerHeight - this.touchElement.offsetHeight - bottomNavHeight - 10;
                    
                    let topValue = parseInt(position.top) || 0;
                    if (topValue > maxY) {
                        topValue = maxY;
                    }
                    
                    // استفاده از setProperty با !important
                    this.touchElement.style.setProperty('left', position.left, 'important');
                    this.touchElement.style.setProperty('top', topValue + 'px', 'important');
                    this.touchElement.style.setProperty('right', 'auto', 'important');
                    this.touchElement.style.setProperty('bottom', 'auto', 'important');
                }
            } catch (e) {
                const log = window.logger || { warn: console.warn }; log.warn('خطا در بارگذاری موقعیت دکمه');
            }
        } else {
            // اگر موقعیت ذخیره نشده، در موبایل موقعیت اولیه را تنظیم کن
            const cfg = window.CONFIG || CONFIG;
            if (window.innerWidth <= cfg.UI.MOBILE_BREAKPOINT) {
                const bottomNavBar = document.getElementById('bottomNavBar');
                const bottomNavHeight = bottomNavBar ? bottomNavBar.offsetHeight : 0;
                const initialTop = window.innerHeight - bottomNavHeight - this.touchElement.offsetHeight - 20;
                
                // استفاده از setProperty با !important
                this.touchElement.style.setProperty('bottom', 'auto', 'important');
                this.touchElement.style.setProperty('left', '20px', 'important');
                this.touchElement.style.setProperty('top', initialTop + 'px', 'important');
                this.touchElement.style.setProperty('right', 'auto', 'important');
            }
        }
    }
}

// مقداردهی وقتی DOM لود شد
// این listener قبلاً در initializeLivePulse اجرا می‌شود
// برای جلوگیری از duplicate، این را comment می‌کنیم
// document.addEventListener('DOMContentLoaded', () => {
//     window.assistiveTouch = new AssistiveTouch();
// });

// همچنین برای اطمینان از کارکرد در موبایل و همه مرورگرها
// محافظت از duplicate listener برای window.load
if (!window.hasAttribute || !window.hasAttribute('data-listener-window-load')) {
    if (window.setAttribute) {
        window.setAttribute('data-listener-window-load', 'true');
    }
    window.addEventListener('load', () => {
    try {
        if (window.assistiveTouch && typeof window.assistiveTouch.ensureVisibility === 'function') {
            window.assistiveTouch.ensureVisibility();
            // یک بار دیگر بعد از تاخیر برای اطمینان (مخصوص اپرا)
            setTimeout(() => {
        if (window.assistiveTouch && typeof window.assistiveTouch.ensureVisibility === 'function') {
            window.assistiveTouch.ensureVisibility();
                }
            }, 300);
        }
    } catch (error) {
        const log = window.logger || { error: console.error }; log.error('❌ خطا در ensureVisibility:', error);
    }
    });
}

// همچنین برای اطمینان از کارکرد در resize (مخصوص اپرا)
let resizeTimeout;
// محافظت از duplicate listener برای window.resize
if (!window.hasAttribute || !window.hasAttribute('data-listener-window-resize')) {
    if (window.setAttribute) {
        window.setAttribute('data-listener-window-resize', 'true');
    }
    const resizeHandler = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            try {
                if (window.assistiveTouch && typeof window.assistiveTouch.ensureVisibility === 'function') {
                    window.assistiveTouch.ensureVisibility();
                }
            } catch (error) {
                const log = window.logger || { error: console.error }; log.error('❌ خطا در ensureVisibility در resize:', error);
            }
        }, 250);
    };
    window.addEventListener('resize', resizeHandler);
}

// Export AssistiveTouch class به window - در انتهای فایل انجام می‌شود

// ==================== //
// 🎮 دکمه سیار داخل کره‌های بزرگ
// ==================== //

class GlobeAssistiveTouch {
    constructor(assistiveId, menuId, globeType) {
        // پشتیبانی از دو روش فراخوانی: فقط globeType یا (assistiveId, menuId, globeType)
        if (arguments.length === 1) {
            // روش قدیمی: فقط globeType
            this.globeType = assistiveId;
            this.touchElement = document.getElementById(`${this.globeType}GlobeAssistive`);
            this.glassMenu = document.getElementById(`${this.globeType}GlobeMenu`);
        } else {
            // روش جدید: (assistiveId, menuId, globeType)
            this.globeType = globeType || assistiveId; // fallback به assistiveId اگر globeType نبود
            this.touchElement = document.getElementById(assistiveId);
            this.glassMenu = document.getElementById(menuId);
        }
        
        this.touchButton = this.touchElement?.querySelector('.globe-touch-button');
        // تبدیل نام modal برای کره‌های خاص
        let modalId = `${this.globeType}GlobeModal`;
        if (this.globeType === 'natural-resources') {
            modalId = 'naturalResourcesGlobeModal';
        }
        this.modal = document.getElementById(modalId);
        
        // تلاش برای پیدا کردن modalContent - اول با ID، سپس با querySelector
        const modalContentId = `${this.globeType}GlobeModalContent`;
        this.modalContent = document.getElementById(modalContentId) || this.modal?.querySelector('.globe-modal-content');
        
        if (!this.touchElement || !this.glassMenu || !this.modalContent) {
            const log = window.logger || { warn: console.warn }; log.warn(`⚠️ عناصر کره ${this.globeType} پیدا نشد`, {
                touchElement: !!this.touchElement,
                glassMenu: !!this.glassMenu,
                modalContent: !!this.modalContent,
                modalContentId,
                modalId,
                assistiveId,
                menuId,
                globeType
            });
            // اگر modalContent پیدا نشد، retry بعد از تاخیر
            if (!this.modalContent && this.modal) {
                setTimeout(() => {
                    this.modalContent = document.getElementById(modalContentId) || this.modal?.querySelector('.globe-modal-content');
                    if (this.modalContent && this.touchElement && this.glassMenu) {
                        const log = window.logger || { info: console.log };
                        log.info(`✅ modalContent برای کره ${this.globeType} پیدا شد (retry) - ادامه initialization`);
                        this.init();
                    }
                }, 500);
            }
            return;
        }
        
        const log = window.logger || { info: console.log }; log.info(`✅ دکمه سیار کره ${this.globeType} راه‌اندازی شد`);
        
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.initialX = 0;
        this.initialY = 0;
        this.dragThreshold = 5;
        this.hasMoved = false;
        
        // Bind methods
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        
        this.init();
    }
    
    init() {
        // ابتدا اطمینان از اینکه modalContent پیدا شده است
        if (!this.modalContent) {
            // تلاش مجدد برای پیدا کردن modalContent
            const modalId = this.globeType === 'natural-resources' ? 'naturalResourcesGlobeModal' : `${this.globeType}GlobeModal`;
            this.modal = document.getElementById(modalId);
            if (this.modal) {
                this.modalContent = this.modal.querySelector('.globe-modal-content');
                const log = window.logger || { info: console.log, warn: console.warn };
                if (this.modalContent) {
                    log.info(`✅ modalContent برای کره ${this.globeType} پیدا شد (retry)`);
                } else {
                    log.warn(`⚠️ modalContent برای کره ${this.globeType} پیدا نشد - modal: ${modalId}`);
                }
            } else {
                const log = window.logger || { warn: console.warn };
                log.warn(`⚠️ Modal برای کره ${this.globeType} پیدا نشد: ${modalId}`);
            }
        }
        
        // اگر modalContent پیدا نشد، نمی‌توانیم ادامه دهیم
        if (!this.modalContent) {
            const log = window.logger || { warn: console.warn };
            log.warn(`⚠️ GlobeAssistiveTouch برای ${this.globeType} نمی‌تواند initialize شود - modalContent پیدا نشد`);
            return;
        }
        
        this.setupEventListeners();
        this.setupMenuListeners();
        this.setInitialPosition();
    }
    
    // تنظیم موقعیت اولیه: بالا سمت چپ
    setInitialPosition() {
        this.touchElement.style.top = '20px';
        this.touchElement.style.left = '20px';
        this.touchElement.style.right = 'auto';
        this.touchElement.style.bottom = 'auto';
    }
    
    setupEventListeners() {
        if (!this.touchButton) return;
        
        // رویدادهای موس
        this.touchButton.addEventListener('mousedown', this.handleMouseDown.bind(this));
        
        // رویدادهای تاچ
        this.touchButton.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        
        // جلوگیری از رفتارهای پیش‌فرض
        this.touchButton.addEventListener('dragstart', (e) => e.preventDefault());
        this.touchButton.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    
    handleMouseDown(e) {
        e.preventDefault();
        e.stopPropagation();
        
        this.startDrag(e.clientX, e.clientY);
        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseup', this.handleMouseUp);
    }
    
    handleTouchStart(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const touch = e.touches[0];
        this.startDrag(touch.clientX, touch.clientY);
        document.addEventListener('touchmove', this.handleTouchMove, { passive: false });
        document.addEventListener('touchend', this.handleTouchEnd);
    }
    
    startDrag(clientX, clientY) {
        this.isDragging = true;
        this.hasMoved = false;
        this.startX = clientX;
        this.startY = clientY;
        
        const rect = this.touchElement.getBoundingClientRect();
        this.initialX = rect.left;
        this.initialY = rect.top;
        
        this.touchElement.style.transition = 'none';
        this.touchElement.classList.add('dragging');
    }
    
    handleMouseMove(e) {
        if (!this.isDragging) return;
        
        const deltaX = Math.abs(e.clientX - this.startX);
        const deltaY = Math.abs(e.clientY - this.startY);
        
        if (deltaX > this.dragThreshold || deltaY > this.dragThreshold) {
            this.hasMoved = true;
            this.updatePosition(e.clientX, e.clientY);
        }
    }
    
    handleTouchMove(e) {
        if (!this.isDragging) return;
        e.preventDefault();
        
        const touch = e.touches[0];
        const deltaX = Math.abs(touch.clientX - this.startX);
        const deltaY = Math.abs(touch.clientY - this.startY);
        
        if (deltaX > this.dragThreshold || deltaY > this.dragThreshold) {
            this.hasMoved = true;
            this.updatePosition(touch.clientX, touch.clientY);
        }
    }
    
    updatePosition(clientX, clientY) {
        if (!this.modalContent) {
            const log = window.logger || { warn: console.warn };
            log.warn('⚠️ modalContent پیدا نشد - snap به لبه انجام نشد');
            return;
        }
        const contentRect = this.modalContent.getBoundingClientRect();
        const deltaX = clientX - this.startX;
        const deltaY = clientY - this.startY;
        
        let newX = this.initialX + deltaX - contentRect.left;
        let newY = this.initialY + deltaY - contentRect.top;
        
        // محدودیت‌های درون modal content
        const maxX = contentRect.width - this.touchElement.offsetWidth - 10;
        const maxY = contentRect.height - this.touchElement.offsetHeight - 10;
        
        newX = Math.max(10, Math.min(newX, maxX));
        newY = Math.max(10, Math.min(newY, maxY));
        
        this.touchElement.style.left = newX + 'px';
        this.touchElement.style.top = newY + 'px';
        this.touchElement.style.right = 'auto';
        this.touchElement.style.bottom = 'auto';
    }
    
    handleMouseUp(e) {
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
        
        if (!this.hasMoved) {
            this.endDragging();
            this.handleTap(e);
        } else {
            this.snapToEdge();
        }
    }
    
    handleTouchEnd(e) {
        document.removeEventListener('touchmove', this.handleTouchMove);
        document.removeEventListener('touchend', this.handleTouchEnd);
        
        if (!this.hasMoved) {
            this.endDragging();
            this.handleTap(e);
        } else {
            this.snapToEdge();
        }
    }
    
    handleTap(e) {
        e.stopPropagation();
        this.openMenu();
    }
    
    endDragging() {
        if (this.isDragging) {
            this.isDragging = false;
            this.touchElement.classList.remove('dragging');
        }
    }
    
    // Snap به نزدیک‌ترین لبه (مثل دکمه سیار اصلی)
    snapToEdge() {
        this.isDragging = false;
        this.touchElement.classList.remove('dragging');
        
        if (!this.modalContent) {
            const log = window.logger || { warn: console.warn };
            log.warn('⚠️ modalContent پیدا نشد - snap به لبه انجام نشد');
            return;
        }
        const contentRect = this.modalContent.getBoundingClientRect();
        const rect = this.touchElement.getBoundingClientRect();
        
        // موقعیت مرکز دکمه نسبت به modal content
        const centerX = rect.left + rect.width / 2 - contentRect.left;
        const centerY = rect.top + rect.height / 2 - contentRect.top;
        
        const contentWidth = contentRect.width;
        const contentHeight = contentRect.height;
        
        // فاصله تا لبه‌ها
        const toLeft = centerX;
        const toRight = contentWidth - centerX;
        const toTop = centerY;
        const toBottom = contentHeight - centerY;
        
        let newX, newY;
        
        // Snap افقی - به نزدیک‌ترین لبه چپ یا راست
        if (toLeft < toRight) {
            newX = 15;
        } else {
            newX = contentWidth - rect.width - 15;
        }
        
        // Snap عمودی - بر اساس موقعیت فعلی
        if (centerY < contentHeight / 3) {
            newY = 15;
        } else if (centerY > (contentHeight * 2) / 3) {
            newY = contentHeight - rect.height - 15;
        } else {
            newY = Math.max(15, Math.min(rect.top - contentRect.top, contentHeight - rect.height - 15));
        }
        
        // انیمیشن Snap
        this.touchElement.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        this.touchElement.style.left = newX + 'px';
        this.touchElement.style.top = newY + 'px';
        
        setTimeout(() => {
            this.touchElement.style.transition = '';
        }, 300);
    }
    
    openMenu() {
        this.glassMenu.classList.add('active');
    }
    
    closeMenu() {
        this.glassMenu.classList.remove('active');
    }
    
    setupMenuListeners() {
        // بستن منو با کلیک روی پس‌زمینه
        this.glassMenu.addEventListener('click', (e) => {
            if (e.target === this.glassMenu) {
                this.closeMenu();
            }
        });
        
        // رویدادهای آیتم‌های منو - با event delegation برای اطمینان از کارکرد
        // استفاده از event delegation برای جلوگیری از مشکلات React re-render
        const handleMenuClick = (e) => {
            const menuItem = e.target.closest('.globe-menu-item');
            if (!menuItem) return;
            
            e.preventDefault();
            e.stopPropagation();
            
            const action = menuItem.getAttribute('data-action');
            const log = window.logger || { info: console.log };
            log.info(`🎯 کلیک روی منوی کره ${this.globeType}:`, action);
            
            if (action) {
                this.handleAction(action);
                this.closeMenu();
            }
        };
        
        // حذف listener های قبلی با clone
        const newMenu = this.glassMenu.cloneNode(true);
        this.glassMenu.parentNode.replaceChild(newMenu, this.glassMenu);
        this.glassMenu = newMenu;
        
        // اضافه کردن listener جدید با event delegation
        this.glassMenu.addEventListener('click', handleMenuClick, { capture: true });
        
        // بستن با Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.glassMenu.classList.contains('active')) {
                this.closeMenu();
            }
        });
    }
    
    handleAction(action) {
        const log = window.logger || { info: console.log }; log.info(`🎯 عملیات کره ${this.globeType}:`, action);
        
        // استفاده از globeType به عنوان sceneKey برای همه کره‌ها
        const sceneKey = this.globeType;
        
        // تبدیل نام modal برای کره‌های خاص
        let modalId = `${this.globeType}GlobeModal`;
        if (this.globeType === 'natural-resources') {
            modalId = 'naturalResourcesGlobeModal';
        }
        
        switch (action) {
            case 'exit':
                closeGlobeModal(modalId);
                break;
                
            case 'resetView':
                if (typeof resetGlobeView === 'function') {
                    resetGlobeView(sceneKey);
                }
                break;
                
            case 'resetAll':
                this.resetAllData(sceneKey);
                break;
                
            case 'selectMarket':
                this.togglePanel('marketSelectPanel');
                break;
                
            case 'selectCountry': {
                const countryPanel = document.getElementById('countrySelectPanel');
                if (countryPanel) {
                    countryPanel.classList.add('active');
                    // راه‌اندازی drag/resize برای این پنجره
                    if (typeof setupDraggablePanels === 'function') {
                        setTimeout(() => setupDraggablePanels(), 100);
                    }
                }
                break;
            }
                
            case 'toggleFilters': {
                // تشخیص نوع پنل فیلتر بر اساس نوع کره
                let filterPanelId = 'resourcesFilterPanel';
                if (this.globeType === 'earthquake') {
                    filterPanelId = 'earthquakeFilterPanel';
                } else if (this.globeType === 'natural-resources') {
                    filterPanelId = 'naturalResourcesFilterPanel';
                }
                this.togglePanel(filterPanelId);
                break;
            }
                
            case 'countryInfo':
                this.togglePanel('countryInfoPanel');
                break;
                
            case 'toggleRotation':
                this.toggleGlobeRotation(sceneKey);
                break;
                
            case 'selectCity':
                if (this.globeType === 'earthquake') {
                    this.togglePanel('earthquakeCitySelectPanel');
                }
                break;
                
            case 'toggleIranBorders':
                this.toggleIranProvincialBorders(sceneKey);
                break;
        }
    }
    
    // نمایش/مخفی کردن مرزهای استانی ایران (فقط برای کره زلزله)
    toggleIranProvincialBorders(sceneKey) {
        const scene = simpleGlobeScenes[sceneKey];
        if (!scene || !scene.earth) return;
        
        if (scene.iranBordersGroup) {
            const isVisible = scene.iranBordersGroup.visible;
            scene.iranBordersGroup.visible = !isVisible;
            const log = window.logger || { info: console.log }; log.info(`🗺️ مرزهای ایران: ${!isVisible ? 'نمایش' : 'مخفی'}`);
        } else {
            // اگر مرزها وجود ندارند، آنها را بارگذاری کن (فقط برای کره زلزله)
            if (sceneKey === 'earthquake' && typeof loadIranProvincialBorders === 'function') {
                loadIranProvincialBorders(scene);
            } else {
                const log = window.logger || { warn: console.warn }; log.warn('⚠️ مرزهای ایران فقط برای کره زلزله قابل استفاده است');
            }
        }
    }
    
    // چرخش/توقف چرخش کره
    toggleGlobeRotation(sceneKey) {
        let isActive = false;
        
        // برای کره‌های بزرگ (financial, resources)
        if (sceneKey === 'financial' && window.financialGlobe) {
            isActive = window.financialGlobe.toggleRotate();
        } else if (sceneKey === 'resources' && window.resourcesGlobe) {
            isActive = window.resourcesGlobe.toggleRotate();
        } else {
            // برای کره‌های کوچک (buildSimpleGlobe)
            const scene = simpleGlobeScenes[sceneKey];
            if (!scene) {
                const log = window.logger || { warn: console.warn }; log.warn(`⚠️ صحنه برای ${sceneKey} پیدا نشد`);
                return;
            }
            
            if (scene.controls) {
                // toggle autoRotate برای OrbitControls
                scene.controls.autoRotate = !scene.controls.autoRotate;
                scene.controls.autoRotateSpeed = scene.controls.autoRotate ? 0.5 : 0;
                isActive = scene.controls.autoRotate;
            } else if (scene.setAutoRotate && scene.getAutoRotate) {
                // برای buildSimpleGlobe که از متغیر autoRotate استفاده می‌کند
                const currentValue = scene.getAutoRotate();
                scene.setAutoRotate(!currentValue);
                isActive = !currentValue;
            }
        }
        
        // آپدیت indicator روی دکمه
        this.updateRotationIndicator(isActive);
        
        const log = window.logger || { info: console.log }; log.info(`🔄 چرخش کره ${sceneKey}: ${isActive ? 'فعال' : 'غیرفعال'}`);
    }
    
    // آپدیت indicator دکمه چرخش
    updateRotationIndicator(isActive) {
        // پیدا کردن دکمه چرخش در منوی این کره
        const rotationBtn = this.glassMenu?.querySelector('[data-action="toggleRotation"]');
        if (rotationBtn) {
            // اضافه/حذف indicator (دایره)
            let indicator = rotationBtn.querySelector('.rotation-indicator');
            if (!indicator) {
                indicator = document.createElement('span');
                indicator.className = 'rotation-indicator';
                rotationBtn.appendChild(indicator);
            }
            
            if (isActive) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        }
    }
    
    // باز/بسته کردن پنل‌ها
    togglePanel(panelId) {
        const panel = document.getElementById(panelId);
        if (panel) {
            const isActive = panel.classList.contains('active');
            // بستن همه پنل‌های دیگر
            document.querySelectorAll('.globe-panel').forEach(p => {
                p.classList.remove('active');
            });
            // toggle پنل مورد نظر
            if (!isActive) {
                panel.classList.add('active');
            }
        }
    }
    
    // ریست کامل همه داده‌ها
    resetAllData(sceneKey) {
        const log = window.logger || { info: console.log }; log.info(`♻️ ریست کامل کره ${sceneKey}`);
        
        // ریست دید
        if (typeof resetGlobeView === 'function') {
            resetGlobeView(sceneKey);
        }
        
        // تعیین container ID بر اساس نوع کره
        const containerIdMap = {
            'financial': 'financialGlobeContainer',
            'resources': 'resourcesGlobeContainer',
            'weather': 'weatherGlobeContainer',
            'military': 'militaryGlobeContainer',
            'universities': 'universitiesGlobeContainer',
            'historical': 'historicalGlobeContainer',
            'earthquake': 'earthquakeGlobeContainer',
            'natural-resources': 'naturalResourcesGlobeContainer'
        };
        const containerId = containerIdMap[sceneKey];
        
        if (sceneKey === 'resources') {
            // ریست داده‌های کره منابع
            if (typeof resourcesGlobeData !== 'undefined') {
                resourcesGlobeData.selectedCountry = null;
                resourcesGlobeData.showBorders = true;
                resourcesGlobeData.showConflicts = false;
                resourcesGlobeData.showTradeLines = false;
                resourcesGlobeData.showLabels = true;
                resourcesGlobeData.tradeType = 'exports';
            }
            
            // حذف مرزها
            const scene = simpleGlobeScenes[sceneKey];
            if (scene && scene.scene) {
                if (resourcesGlobeData.bordersGroup) {
                    scene.scene.remove(resourcesGlobeData.bordersGroup);
                    resourcesGlobeData.bordersGroup = null;
                }
                if (resourcesGlobeData.conflictsGroup) {
                    scene.scene.remove(resourcesGlobeData.conflictsGroup);
                    resourcesGlobeData.conflictsGroup = null;
                }
                if (resourcesGlobeData.tradeLinesGroup) {
                    scene.scene.remove(resourcesGlobeData.tradeLinesGroup);
                    resourcesGlobeData.tradeLinesGroup = null;
                }
                if (resourcesGlobeData.labelsGroup) {
                    scene.scene.remove(resourcesGlobeData.labelsGroup);
                    resourcesGlobeData.labelsGroup = null;
                }
                if (typeof facilityMarkersGroup !== 'undefined' && facilityMarkersGroup) {
                    scene.scene.remove(facilityMarkersGroup);
                    facilityMarkersGroup.clear();
                }
            }
            
            // بستن همه پنل‌ها
            document.querySelectorAll('.globe-panel').forEach(p => {
                p.classList.remove('active');
            });
            
            // حذف popup‌ها
            const container = document.getElementById('resourcesGlobeContainer');
            if (container) {
                container.querySelectorAll('.globe-element-popup, .market-3d-popup').forEach(p => p.remove());
            }
            
            // ریست فیلترها
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // ریست پنل اطلاعات کشور
            const countryInfoPanel = document.getElementById('countryInfoPanel');
            if (countryInfoPanel) {
                countryInfoPanel.innerHTML = '';
            }
        } else if (sceneKey === 'financial') {
            // ریست داده‌های کره مالی
            const container = document.getElementById('financialGlobeContainer');
            if (container) {
                container.querySelectorAll('.market-3d-popup').forEach(p => p.remove());
            }
            
            // بستن همه پنل‌ها
            document.querySelectorAll('.globe-panel').forEach(p => {
                p.classList.remove('active');
            });
        } else {
            // ریست برای کره‌های کوچک (weather, military, universities, historical, earthquake, natural-resources)
            // بستن همه پنل‌ها
            document.querySelectorAll('.globe-panel').forEach(p => {
                p.classList.remove('active');
            });
            
            // حذف popup‌ها
            if (containerId) {
                const container = document.getElementById(containerId);
                if (container) {
                    container.querySelectorAll('.globe-element-popup, .market-3d-popup').forEach(p => p.remove());
                }
            }
            
            // ریست فیلترها
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
        }
        
        // نمایش پیام موفقیت
        if (containerId) {
            const container = document.getElementById(containerId);
            if (container) {
                const toast = document.createElement('div');
                toast.className = 'globe-toast';
                toast.textContent = '✓ همه اطلاعات ریست شد';
                toast.style.cssText = 'position: absolute; top: 20px; right: 20px; background: rgba(0, 200, 0, 0.9); color: white; padding: 12px 20px; border-radius: 8px; z-index: 10000; font-size: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);';
                container.appendChild(toast);
                const cfg = window.CONFIG || CONFIG;
                setTimeout(() => toast.remove(), cfg.UI.ANIMATION.TOAST_DURATION);
            }
        }
    }
}

// مقداردهی دکمه‌های سیار کره
let financialGlobeAssistive = null;
let resourcesGlobeAssistive = null;

function initGlobeAssistiveTouches() {
    financialGlobeAssistive = new GlobeAssistiveTouch('financial');
    resourcesGlobeAssistive = new GlobeAssistiveTouch('resources');
    const log = window.logger || { info: console.log }; log.info('✅ دکمه‌های سیار کره‌ها راه‌اندازی شدند');
}

// Export همه classes و functions به window برای React components
// این export باید بعد از تعریف همه classes انجام شود
if (typeof window !== 'undefined') {
    window.AssistiveTouch = AssistiveTouch;
    window.setup3DGlobeButtons = setup3DGlobeButtons;
    window.GlobeAssistiveTouch = GlobeAssistiveTouch;
    window.initGlobeAssistiveTouches = initGlobeAssistiveTouches;
}

// تنظیم سرعت چرخش کره بر اساس زوم
function adjustRotationSpeedByZoom(controls, baseSpeed = 0.5) {
    if (!controls) return baseSpeed;
    
    const distance = controls.object.position.length();
    const minDist = controls.minDistance || 2;
    const maxDist = controls.maxDistance || 10;
    
    // نرمالایز فاصله (0 = نزدیک‌ترین، 1 = دورترین)
    const normalizedDistance = (distance - minDist) / (maxDist - minDist);
    
    // سرعت چرخش: هرچه نزدیک‌تر، کندتر
    // وقتی زوم کامل: 0.1x سرعت پایه
    // وقتی دور: 1x سرعت پایه
    const speedMultiplier = 0.1 + (normalizedDistance * 0.9);
    
    return baseSpeed * speedMultiplier;
}
