// ==================== //
// 🎯 فایل script.js - کامل و تست شده
// ==================== //
// 📍 داده‌های تستی برای شروع کار
// 🔗 بعداً با API واقعی جایگزین می‌شوند
const sampleData = {
    crypto: [
        { id: 'bitcoin', name: 'بیت‌کوین', symbol: 'BTC', price: 45230, change: 2.5, chart: 'up' },
        { id: 'ethereum', name: 'اتریوم', symbol: 'ETH', price: 2850, change: 1.2, chart: 'up' },
        { id: 'tether', name: 'تتر', symbol: 'USDT', price: 1.00, change: 0.1, chart: 'stable' },
        { id: 'bnb', name: 'بی‌ان‌بی', symbol: 'BNB', price: 320, change: -0.5, chart: 'down' },
        { id: 'solana', name: 'سولانا', symbol: 'SOL', price: 105, change: 3.2, chart: 'up' }
    ],
    currency: [
        { id: 'usd', name: 'دلار آمریکا', symbol: 'USD', price: 58000, change: 0.5, chart: 'up' },
        { id: 'eur', name: 'یورو', symbol: 'EUR', price: 62000, change: -0.2, chart: 'down' },
        { id: 'gbp', name: 'پوند', symbol: 'GBP', price: 73000, change: 0.3, chart: 'up' },
        { id: 'aed', name: 'درهم امارات', symbol: 'AED', price: 15800, change: 0.1, chart: 'stable' },
        { id: 'try', name: 'لیر ترکیه', symbol: 'TRY', price: 1800, change: -1.2, chart: 'down' }
    ],
    gold: [
        { id: 'sekee-emami', name: 'سکه امامی', symbol: 'SEKEE', price: 32000000, change: 1.2, chart: 'up' },
        { id: 'sekee-bahar', name: 'سکه بهار', symbol: 'BAHAR', price: 31000000, change: 0.8, chart: 'up' },
        { id: 'gerami18', name: 'طلای 18 عیار', symbol: 'GOLD18', price: 2850000, change: 0.5, chart: 'up' },
        { id: 'gerami24', name: 'طلای 24 عیار', symbol: 'GOLD24', price: 3750000, change: 0.6, chart: 'up' },
        { id: 'nesfe-sekee', name: 'نیم سکه', symbol: 'NESFE', price: 16500000, change: 1.1, chart: 'up' }
    ],
    oil: [
        { id: 'brent', name: 'نفت برنت', symbol: 'BRENT', price: 82.5, change: -1.2, chart: 'down' },
        { id: 'wti', name: 'نفت وست تگزاس', symbol: 'WTI', price: 78.3, change: -0.8, chart: 'down' }
    ],
    exchangeRates: {
        USD: 58000, EUR: 62000, GBP: 73000, IRR: 1, TRY: 1800,
        AED: 15800, CAD: 42000, AUD: 38000, CNY: 8000, JPY: 380, CHF: 65000
    }
};

// 🎯 وضعیت کلی برنامه
const appState = {
    currentTheme: localStorage.getItem('livepulse-theme') || 'light',
    currentView: 'home',
    currentCategory: 'crypto',
    currentTool: 'goldTool',
    openModals: 0,
    maxModals: { home: 4, category: 2 },
    userUsage: JSON.parse(localStorage.getItem('livepulse-usage')) || { chat: 0, tools: 0 }
};

// Flag برای جلوگیری از فراخوانی چندباره showView
let isChangingView = false;
let currentActiveView = null;

// 📍 المنت‌های DOM
const elements = {
    // هدر و ناوبری
    themeToggle: document.getElementById('themeToggle'),
    viewToggle: document.getElementById('viewToggle'),
    loginBtn: document.getElementById('loginBtn'),
    homeLogo: document.getElementById('homeLogo'),
    
    // 🆕 بخش‌های نمایش (VIEWهای جدید اضافه شد)
    homeView: document.getElementById('homeView'),
    cryptoView: document.getElementById('cryptoView'),
    currencyView: document.getElementById('currencyView'),
    goldView: document.getElementById('goldView'),
    forexView: document.getElementById('forexView'),
    stockView: document.getElementById('stockView'),
    oilView: document.getElementById('oilView'),
    toolsView: document.getElementById('toolsView'),
    
    // هایلایت‌ها
    highlightCircles: document.querySelectorAll('.highlight-circle'),
    toolCircles: document.querySelectorAll('[data-tool]'),
    
    // کانتینر کارت‌ها
    homeCardsContainer: document.getElementById('homeMainCards'),
    
    // مودالها
    loginModal: document.getElementById('loginModal'),
    subscriptionModal: document.getElementById('subscriptionModal'),
    priceModal: document.getElementById('priceModal'),
    closeLoginModal: document.getElementById('closeLoginModal'),
    closeSubscriptionModal: document.getElementById('closeSubscriptionModal'),
    closePriceModal: document.getElementById('closePriceModal'),
    
    // چت
    chatInput: document.getElementById('chatInput'),
    sendMessage: document.getElementById('sendMessage'),
    chatMessages: document.getElementById('chatMessages'),
    chatUsage: document.getElementById('chatUsage'),
    
    // ابزارها
    calculateGold: document.getElementById('calculateGold'),
    goldResult: document.getElementById('goldResult'),
    analyzeDiamond: document.getElementById('analyzeDiamond'),
    diamondResult: document.getElementById('diamondResult'),
    convertCurrency: document.getElementById('convertCurrency'),
    conversionResult: document.getElementById('conversionResult'),
    analyzeCoin: document.getElementById('analyzeCoin'),
    coinResult: document.getElementById('coinResult')
};

// ==================== //
// 🎛️ مدیریت وضعیت برنامه
// ==================== //

/**
 * 📖 مقداردهی اولیه برنامه
 */
function initializeApp() {
    console.log('🚀 برنامه LivePulse در حال راه‌اندازی...');
    
    // تنظیم تم اولیه
    setTheme(appState.currentTheme);
    
    // تنظیم ایونت‌لیستنرها - باید قبل از showView باشد
    setupEventListeners();
    
    // نمایش نمای اولیه - همیشه در ابتدا
    showView(appState.currentView);
    
    // تولید کارت‌های اولیه - برای home در ابتدا
    if (appState.currentView === 'home') {
        // تاخیر کوتاه برای اطمینان از اینکه DOM آماده است
        setTimeout(() => {
            const container = document.getElementById('homeMainCards');
            if (container && container.children.length === 0) {
                generateHomeCards();
            }
        }, 200);
    }
    
    // آپدیت نمایش استفاده
    updateUsageDisplay();
    
    console.log('✅ برنامه آماده است!');
}

/**
 * 💾 ذخیره وضعیت کاربر در localStorage
 */
function saveUserState() {
    if (typeof appState !== 'undefined') {
        localStorage.setItem('livepulseState', JSON.stringify(appState));
    }
}

// ==================== //
// 🎨 مدیریت تم (تاریک/روشن)
// ==================== //

/**
 * 🌙 تغییر تم بین تاریک و روشن
 */
function toggleTheme() {
    const newTheme = appState.currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

/**
 * 🎨 اعمال تم مشخص
 */
function setTheme(theme) {
    appState.currentTheme = theme;
    document.body.setAttribute('data-theme', theme);
    
    // آپدیت آیکون دکمه تم
    const themeIcon = elements.themeToggle.querySelector('.theme-icon');
    themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
    
    saveUserState();
    console.log(`🎨 تم تغییر کرد به: ${theme}`);
}

// ==================== //
// 🔄 مدیریت نمایش صفحات
// ==================== //

/**
 * 📱 نمایش صفحه مشخص + مدیریت منو
 */
function showView(view) {
    // جلوگیری از فراخوانی همزمان - فقط اگر در حال تغییر است
    if (isChangingView && currentActiveView !== view) {
        console.log('⏳ در حال تغییر صفحه...');
        return;
    }
    
    // اگر view تغییر نکرده و صفحه در حال نمایش است
    if (currentActiveView === view && document.querySelector(`.view.active-view`)) {
        // اما اگر کارت‌ها وجود ندارند، باید تولید شوند
        if (view === 'home') {
            setTimeout(() => {
                const container = document.getElementById('homeMainCards');
                if (container && container.children.length === 0) {
                    generateHomeCards();
                }
            }, 100);
        }
        return;
    }
    
    isChangingView = true;
    currentActiveView = view;
    
    // مخفی کردن همه صفحات
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active-view'));

    // نمایش صفحه انتخاب شده
    const viewElements = {
        'home': elements.homeView,
        'tools': elements.toolsView || document.getElementById('toolsView'),
        'news': document.getElementById('newsView'),
        'globe': document.getElementById('globeView'), // 🌍 کره‌ها
        'crypto': elements.cryptoView,
        'currency': elements.currencyView,
        'gold': elements.goldView,
        'forex': elements.forexView,
        'stock': elements.stockView,
        'oil': elements.oilView,
        'tutorial': document.getElementById('tutorialView'), // 📚 آموزش
        'relax': document.getElementById('relaxView')        // 🧘‍♂️ آرامش
    };

    if (viewElements[view]) {
        console.log(`✅ صفحه ${view} پیدا شد:`, viewElements[view]);
        // مخفی کردن همه صفحات با transition
        document.querySelectorAll('.view').forEach(v => {
            if (v !== viewElements[view]) {
                v.classList.remove('active-view');
            }
        });
        
        // نمایش صفحه جدید با transition
        viewElements[view].classList.add('active-view');
        appState.currentView = view;

        // ریست اسکرول به بالای صفحه - با smooth scroll
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // آپدیت هایلایت فعال بر اساس view - با transition نرم
        // ابتدا اضافه کردن، سپس حذف کردن برای transition نرم
        requestAnimationFrame(() => {
            const allCircles = document.querySelectorAll('.highlight-circle[data-category]');
            let targetCircle = null;
            
            if (view === 'home') {
                // اگر در صفحه home هستیم، هایلایت "خانه" را active کن
                allCircles.forEach(c => {
                    if (c.getAttribute('data-category') === 'home') {
                        targetCircle = c;
                    }
                });
            } else if (['crypto', 'currency', 'gold', 'forex', 'stock', 'oil'].includes(view)) {
                // برای صفحات دیگر، هایلایت مربوطه را active کن
                allCircles.forEach(c => {
                    if (c.getAttribute('data-category') === view) {
                        targetCircle = c;
                    }
                });
            }
            
            // ابتدا کلاس active را به target اضافه کن
            if (targetCircle) {
                targetCircle.classList.add('active');
            }
            
            // سپس از بقیه حذف کن - با تاخیر کوتاه برای transition نرم
            requestAnimationFrame(() => {
                allCircles.forEach(c => {
                    if (c && c !== targetCircle) {
                        c.classList.remove('active');
                    }
                });
            });
        });

        // انتقال هایلایت‌های اصلی فقط به صفحات اصلی - با insertBefore برای قرارگیری در ابتدا
        // صفحاتی که هایلایت‌های مخصوص خودشان را دارند نباید هایلایت‌های اصلی را بگیرند
        if (!['tools', 'news', 'tutorial', 'relax', 'globe'].includes(view)) {
            const mainHighlights = document.querySelector('.highlights-section:not(.tools-highlights):not(.news-highlights):not(.education-highlights):not(.relax-highlights):not(.globe-highlights)');
            if (mainHighlights && viewElements[view] && !viewElements[view].contains(mainHighlights)) {
                // استفاده از insertBefore برای قرارگیری هایلایت‌ها در ابتدای view
                // اضافه کردن transition برای جلوگیری از پرش
                mainHighlights.style.transition = 'opacity 0.2s ease';
                
                requestAnimationFrame(() => {
                    // قرار دادن هایلایت‌ها در ابتدای view (قبل از اولین child)
                    const firstChild = viewElements[view].firstChild;
                    if (firstChild) {
                        viewElements[view].insertBefore(mainHighlights, firstChild);
                    } else {
                        viewElements[view].appendChild(mainHighlights);
                    }
                });
            }
            // اگر هایلایت‌ها قبلاً در view هستند، مطمئن شو که در ابتدا هستند
            else if (mainHighlights && viewElements[view] && viewElements[view].contains(mainHighlights)) {
                const firstChild = viewElements[view].firstChild;
                if (firstChild && firstChild !== mainHighlights) {
                    // اگر هایلایت‌ها در ابتدا نیستند، آنها را به ابتدا منتقل کن
                    requestAnimationFrame(() => {
                        viewElements[view].insertBefore(mainHighlights, firstChild);
                    });
                }
            }
        } else {
            // برای صفحاتی که هایلایت‌های مخصوص خودشان را دارند، مطمئن شو که هایلایت‌های اصلی منتقل نشوند
            const mainHighlights = document.querySelector('.highlights-section:not(.tools-highlights):not(.news-highlights):not(.education-highlights):not(.relax-highlights):not(.globe-highlights)');
            if (mainHighlights && viewElements[view] && viewElements[view].contains(mainHighlights)) {
                // اگر هایلایت‌های اصلی در این صفحه هستند، آنها را به صفحه home برگردان
                const homeView = document.getElementById('homeView');
                if (homeView && !homeView.contains(mainHighlights)) {
                    requestAnimationFrame(() => {
                        const firstChild = homeView.firstChild;
                        if (firstChild) {
                            homeView.insertBefore(mainHighlights, firstChild);
                        } else {
                            homeView.appendChild(mainHighlights);
                        }
                    });
                }
            }
        }

        // تنظیم ایونت‌لیستنر برای کارت‌های این صفحه - با تاخیر برای transition
        setTimeout(() => {
            setupAllCardListeners();
            
            // اگر home بود کارت‌ها رو آپدیت کن - فقط اگر کارت‌ها وجود ندارند
            if (view === 'home') {
                const container = document.getElementById('homeMainCards');
                if (container) {
                    if (container.children.length === 0) {
                        generateHomeCards();
                    } else {
                        // اگر کارت‌ها وجود دارند اما مخفی هستند، نمایش بده
                        if (container.style.opacity === '0' || container.style.opacity === '') {
                            container.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                            container.style.opacity = '1';
                            container.style.transform = 'translateY(0)';
                        }
                    }
                }
            }
            
            // آزاد کردن flag بعد از اتمام transition
            setTimeout(() => {
                isChangingView = false;
            }, 350);
        }, 150);
    } else {
        // اگر view پیدا نشد، flag را آزاد کن
        console.warn(`⚠️ صفحه ${view} پیدا نشد!`, viewElements);
        isChangingView = false;
    }

    console.log(`📱 صفحه تغییر کرد به: ${view}`);
    
    // 📱 آپدیت نوار ناوبری پایین - قبل از تغییرات DOM
    if (typeof updateBottomNavigation === 'function') {
        updateBottomNavigation(view);
    }
    
    // 🎯 اطمینان از نمایش بخش‌های مشترک در تمام صفحات - با تاخیر برای جلوگیری از تداخل با event handling
    setTimeout(() => {
        const commonSections = [
            '.global-section',
            '.analysis-section-compact',
            '.ai-chat-section',
            '.gold-map-section',
            '.ads-slider-section',
            '.main-footer'
        ];
        
        commonSections.forEach(selector => {
            const sections = document.querySelectorAll(selector);
            sections.forEach(section => {
                if (section) {
                    // فقط اگر مخفی است، نمایش بده - برای جلوگیری از تداخل با event handling
                    if (section.style.display === 'none' || 
                        section.style.visibility === 'hidden' || 
                        section.style.opacity === '0') {
                        section.style.display = 'block';
                        section.style.visibility = 'visible';
                        section.style.opacity = '1';
                    }
                }
            });
        });
    }, 100);
}

/**
 * 📱 تنظیم نوار ناوبری پایین
 */
function setupBottomNavigation() {
    const bottomNavBar = document.getElementById('bottomNavBar');
    if (!bottomNavBar) {
        console.warn('⚠️ نوار ناوبری پایین پیدا نشد');
        return;
    }
    
    // جلوگیری از اضافه کردن event listener های تکراری
    if (bottomNavBar.hasAttribute('data-navigation-setup')) {
        console.log('⚠️ نوار ناوبری پایین قبلاً راه‌اندازی شده است');
        return;
    }
    bottomNavBar.setAttribute('data-navigation-setup', 'true');
    
    // متغیر برای track کردن nav-item که touch شده
    let touchedNavItem = null;
    let touchStartTime = 0;
    
    // تابع برای پیدا کردن nav-item از target
    const findNavItem = (target) => {
        if (!target) return null;
        
        // ابتدا سعی کن nav-item را پیدا کنی
        let navItem = target.closest('.nav-item');
        if (navItem) return navItem;
        
        // اگر پیدا نشد، ببین آیا روی icon یا text کلیک شده
        const icon = target.closest('.nav-icon');
        const text = target.closest('.nav-text');
        if (icon || text) {
            navItem = (icon || text).closest('.nav-item');
            if (navItem) return navItem;
        }
        
        return null;
    };
    
    // تابع برای navigate کردن به صفحه
    const navigateToPage = (page) => {
        if (!page) return;
        
        console.log(`📱 رفتن به صفحه: ${page}`);
        
        // بررسی وجود view قبل از فراخوانی
        const viewElements = {
            'home': elements.homeView || document.getElementById('homeView'),
            'tools': elements.toolsView || document.getElementById('toolsView'),
            'news': document.getElementById('newsView'),
            'globe': document.getElementById('globeView'),
            'tutorial': document.getElementById('tutorialView'),
            'relax': document.getElementById('relaxView')
        };
        
        const targetView = viewElements[page];
        if (targetView && typeof showView === 'function') {
            console.log(`✅ نمایش صفحه: ${page}`, targetView);
            showView(page);
        } else {
            console.warn(`⚠️ صفحه ${page} پیدا نشد`, { targetView, showView: typeof showView, viewElements });
        }
    };
    
    // Event listener برای کلیک (دسکتاپ)
    bottomNavBar.addEventListener('click', (e) => {
        // بررسی اینکه آیا کلیک روی دکمه سیار بوده یا نه
        if (e.target.closest('.assistive-touch') || e.target.closest('.touch-button')) {
            return;
        }
        
        // بررسی اینکه آیا در حال drag دکمه سیار هستیم یا نه
        const assistiveTouch = document.getElementById('assistiveTouch');
        if (assistiveTouch && assistiveTouch.classList.contains('dragging')) {
            return;
        }
        
        const navItem = findNavItem(e.target);
        if (!navItem) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const page = navItem.getAttribute('data-page');
        navigateToPage(page);
    });
    
    // Event listener برای touchstart (موبایل/تبلت) - فقط برای track کردن
    bottomNavBar.addEventListener('touchstart', (e) => {
        const touch = e.touches && e.touches[0];
        if (!touch) return;
        
        // بررسی اینکه آیا touch روی دکمه سیار بوده یا نه - باید قبل از هر چیز دیگری چک کنیم
        const elementAtPoint = document.elementFromPoint(touch.clientX, touch.clientY);
        if (elementAtPoint && (elementAtPoint.closest('.assistive-touch') || elementAtPoint.closest('.touch-button'))) {
            touchedNavItem = null;
            return; // اگر روی دکمه سیار بود، هیچ کاری نکن
        }
        
        // بررسی اینکه آیا در حال drag دکمه سیار هستیم یا نه
        const assistiveTouch = document.getElementById('assistiveTouch');
        if (assistiveTouch && assistiveTouch.classList.contains('dragging')) {
            touchedNavItem = null;
            return;
        }
        
        const navItem = findNavItem(e.target) || (elementAtPoint ? findNavItem(elementAtPoint) : null);
        if (navItem) {
            touchedNavItem = navItem;
            touchStartTime = Date.now();
            console.log(`📱 touchstart روی: ${navItem.getAttribute('data-page')}`);
        } else {
            touchedNavItem = null;
        }
    }, { passive: true });
    
    // Event listener برای touchend (موبایل/تبلت) - برای اجرای action
    bottomNavBar.addEventListener('touchend', (e) => {
        console.log('📱 touchend روی نوار پایین', { touchedNavItem: !!touchedNavItem });
        
        // استفاده از changedTouches برای گرفتن touch در touchend
        const touch = e.changedTouches && e.changedTouches[0];
        
        // بررسی اینکه آیا touch روی دکمه سیار بوده یا نه - باید قبل از هر چیز دیگری چک کنیم
        if (touch) {
            const elementAtPoint = document.elementFromPoint(touch.clientX, touch.clientY);
            if (elementAtPoint && (elementAtPoint.closest('.assistive-touch') || elementAtPoint.closest('.touch-button'))) {
                console.log('⚠️ touch روی دکمه سیار - نادیده گرفته شد');
                touchedNavItem = null;
                return; // اگر روی دکمه سیار بود، هیچ کاری نکن
            }
        }
        
        // بررسی اینکه آیا در حال drag دکمه سیار هستیم یا نه
        const assistiveTouch = document.getElementById('assistiveTouch');
        if (assistiveTouch && assistiveTouch.classList.contains('dragging')) {
            console.log('⚠️ در حال drag دکمه سیار - نادیده گرفته شد');
            touchedNavItem = null;
            return;
        }
        
        if (touch) {
            // اگر touchedNavItem null است، سعی کن از elementAtPoint پیدا کنی
            if (!touchedNavItem) {
                const elementAtPoint = document.elementFromPoint(touch.clientX, touch.clientY);
                if (elementAtPoint) {
                    const navItem = findNavItem(elementAtPoint);
                    if (navItem) {
                        touchedNavItem = navItem;
                        touchStartTime = Date.now();
                    }
                }
            }
        }
        
        // بررسی اینکه آیا touch خیلی طولانی بوده (scroll) یا نه
        const touchDuration = Date.now() - touchStartTime;
        if (touchDuration > 300) {
            console.log('⚠️ touch خیلی طولانی بود - احتمالاً scroll');
            touchedNavItem = null;
            return;
        }
        
        if (!touchedNavItem) {
            console.log('⚠️ touchedNavItem null است - تلاش برای پیدا کردن از target');
            // آخرین تلاش: از target پیدا کن
            const navItem = findNavItem(e.target);
            if (navItem) {
                const page = navItem.getAttribute('data-page');
                console.log(`✅ پیدا شد از target: ${page}`);
                e.preventDefault();
                e.stopPropagation();
                navigateToPage(page);
            }
            return;
        }
        
        const navItem = touchedNavItem;
        const page = navItem.getAttribute('data-page');
        touchedNavItem = null;
        
        console.log(`✅ اجرای navigate به صفحه: ${page}`);
        
        e.preventDefault();
        e.stopPropagation();
        
        navigateToPage(page);
    }, { passive: false });
    
    // آپدیت اولیه active state
    if (typeof updateBottomNavigation === 'function') {
        updateBottomNavigation(appState.currentView || 'home');
    }
    
    console.log('✅ نوار ناوبری پایین راه‌اندازی شد');
}

/**
 * 📱 آپدیت active state نوار ناوبری پایین
 */
function updateBottomNavigation(currentView) {
    const bottomNavBar = document.getElementById('bottomNavBar');
    if (!bottomNavBar) return;
    
    // حذف active از همه
    bottomNavBar.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // اضافه کردن active به دکمه مربوطه
    const activeItem = bottomNavBar.querySelector(`.nav-item[data-page="${currentView}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }
}


// ==================== //
// 🕒 سیستم کامل ساعت بازارهای جهانی
// ==================== //

/* ========== Globe Clock - JS کامل و نهایی ========== */
let marketData = [
  // ===== ایران =====
  { name: "بورس تهران (TSE)", open: "05:00", close: "09:00", utcOffset: "+03:30", coords: [35.6892, 51.3890] },
  { name: "فرابورس ایران", open: "05:00", close: "09:00", utcOffset: "+03:30", coords: [35.7219, 51.3347] },
  { name: "بورس کالا ایران", open: "06:30", close: "10:30", utcOffset: "+03:30", coords: [35.6997, 51.4015] },

  // ===== فارکس (ساعات UTC) =====
  { name: "Forex سیدنی", open: "22:00", close: "07:00", utcOffset: "+00:00", coords: [-33.8688, 151.2093], major: true },
  { name: "Forex توکیو", open: "00:00", close: "09:00", utcOffset: "+00:00", coords: [35.6762, 139.6503], major: true },
  { name: "Forex لندن", open: "08:00", close: "17:00", utcOffset: "+00:00", coords: [51.5074, -0.1278], major: true },
  { name: "Forex نیویورک", open: "13:00", close: "22:00", utcOffset: "+00:00", coords: [40.7128, -74.0060], major: true },

  // ===== اروپا =====
  { name: "بورس لندن (LSE)", open: "08:00", close: "16:30", utcOffset: "+00:00", coords: [51.5155, -0.0922], major: true },
  { name: "بورس فرانکفورت (XETRA)", open: "07:00", close: "15:30", utcOffset: "+00:00", coords: [50.1109, 8.6821], major: true },
  { name: "یورونکست پاریس", open: "07:00", close: "15:30", utcOffset: "+00:00", coords: [48.8698, 2.3405] },
  { name: "بورس آمستردام", open: "07:00", close: "15:30", utcOffset: "+00:00", coords: [52.3676, 4.9041] },
  { name: "بورس مادرید", open: "07:00", close: "15:30", utcOffset: "+00:00", coords: [40.4168, -3.7038] },
  { name: "بورس میلان", open: "07:00", close: "15:30", utcOffset: "+00:00", coords: [45.4654, 9.1859] },
  { name: "بورس زوریخ (SIX)", open: "07:00", close: "15:30", utcOffset: "+00:00", coords: [47.3769, 8.5417] },
  { name: "بورس بروکسل", open: "07:00", close: "15:30", utcOffset: "+00:00", coords: [50.8503, 4.3517] },
  { name: "بورس استکهلم", open: "07:00", close: "15:30", utcOffset: "+00:00", coords: [59.3293, 18.0686] },
  { name: "بورس کپنهاگ", open: "07:00", close: "15:00", utcOffset: "+00:00", coords: [55.6761, 12.5683] },
  { name: "بورس اسلو", open: "07:00", close: "14:20", utcOffset: "+00:00", coords: [59.9139, 10.7522] },
  { name: "بورس هلسینکی", open: "08:00", close: "16:30", utcOffset: "+00:00", coords: [60.1699, 24.9384] },
  { name: "بورس وین", open: "07:00", close: "15:30", utcOffset: "+00:00", coords: [48.2082, 16.3738] },
  { name: "بورس ورشو", open: "07:00", close: "15:00", utcOffset: "+00:00", coords: [52.2297, 21.0122] },
  { name: "بورس مسکو (MOEX)", open: "07:00", close: "15:50", utcOffset: "+00:00", coords: [55.7558, 37.6173], major: true },

  // ===== آمریکای شمالی =====
  { name: "بورس نیویورک (NYSE)", open: "14:30", close: "21:00", utcOffset: "+00:00", coords: [40.7069, -74.0089], major: true },
  { name: "نزدک (NASDAQ)", open: "14:30", close: "21:00", utcOffset: "+00:00", coords: [40.7562, -73.9860], major: true },
  { name: "بورس شیکاگو (CME)", open: "14:30", close: "21:00", utcOffset: "+00:00", coords: [41.8819, -87.6278] },
  { name: "بورس تورنتو (TSX)", open: "14:30", close: "21:00", utcOffset: "+00:00", coords: [43.6477, -79.3818] },

  // ===== آسیا و اقیانوسیه =====
  { name: "بورس توکیو (TSE)", open: "00:00", close: "06:00", utcOffset: "+00:00", coords: [35.6804, 139.7690], major: true },
  { name: "بورس هنگ‌کنگ (HKEX)", open: "01:30", close: "08:00", utcOffset: "+00:00", coords: [22.2846, 114.1580], major: true },
  { name: "بورس شانگهای (SSE)", open: "01:30", close: "07:00", utcOffset: "+00:00", coords: [31.2336, 121.5057], major: true },
  { name: "بورس شنزن (SZSE)", open: "01:30", close: "07:00", utcOffset: "+00:00", coords: [22.5431, 114.0579] },
  { name: "بورس سئول (KRX)", open: "00:00", close: "06:30", utcOffset: "+00:00", coords: [37.5326, 126.9265] },
  { name: "بورس تایوان (TWSE)", open: "01:00", close: "05:30", utcOffset: "+00:00", coords: [25.0330, 121.5654] },
  { name: "بورس سنگاپور (SGX)", open: "01:00", close: "09:00", utcOffset: "+00:00", coords: [1.2840, 103.8517] },
  { name: "بورس سیدنی (ASX)", open: "00:00", close: "06:00", utcOffset: "+00:00", coords: [-33.8678, 151.2073], major: true },
  { name: "بورس ولینگتون (NZX)", open: "21:00", close: "05:45", utcOffset: "+00:00", coords: [-41.2865, 174.7762] },
  { name: "بورس جاکارتا (IDX)", open: "02:30", close: "09:00", utcOffset: "+00:00", coords: [-6.2088, 106.8456] },
  { name: "بورس بانکوک (SET)", open: "02:30", close: "09:30", utcOffset: "+00:00", coords: [13.7563, 100.5018] },
  { name: "بورس مانیل (PSE)", open: "01:30", close: "06:30", utcOffset: "+00:00", coords: [14.5995, 120.9842] },
  { name: "بورس کوالالامپور (Bursa)", open: "01:00", close: "09:00", utcOffset: "+00:00", coords: [3.1466, 101.6958] },

  // ===== هند =====
  { name: "بورس بمبئی (BSE)", open: "03:45", close: "10:00", utcOffset: "+00:00", coords: [18.9309, 72.8332] },
  { name: "بورس ملی هند (NSE)", open: "03:45", close: "10:00", utcOffset: "+00:00", coords: [19.0607, 72.8747] },

  // ===== خاورمیانه =====
  { name: "بورس دبی (DFM)", open: "06:00", close: "10:00", utcOffset: "+00:00", coords: [25.2242, 55.2748] },
  { name: "بورس ابوظبی (ADX)", open: "06:00", close: "10:00", utcOffset: "+00:00", coords: [24.4539, 54.3773] },
  { name: "بورس عربستان (Tadawul)", open: "07:00", close: "12:00", utcOffset: "+00:00", coords: [24.7136, 46.6753] },
  { name: "بورس قطر (QSE)", open: "06:30", close: "10:30", utcOffset: "+00:00", coords: [25.2854, 51.5310] },
  { name: "بورس کویت (Boursa)", open: "06:00", close: "10:00", utcOffset: "+00:00", coords: [29.3759, 47.9774] },
  { name: "بورس بحرین (BHB)", open: "06:00", close: "10:30", utcOffset: "+00:00", coords: [26.2285, 50.5860] },
  { name: "بورس عمان (MSM)", open: "06:00", close: "10:00", utcOffset: "+00:00", coords: [23.5880, 58.3829] },
  { name: "بورس اردن (ASE)", open: "07:00", close: "10:30", utcOffset: "+00:00", coords: [31.9454, 35.9284] },
  { name: "بورس مصر (EGX)", open: "08:30", close: "12:30", utcOffset: "+00:00", coords: [30.0444, 31.2357] },
  { name: "بورس تل‌آویو (TASE)", open: "07:00", close: "15:24", utcOffset: "+00:00", coords: [32.0853, 34.7818] },

  // ===== ترکیه =====
  { name: "بورس استانبول (BIST)", open: "07:00", close: "15:00", utcOffset: "+00:00", coords: [41.0082, 28.9784] },

  // ===== آفریقا =====
  { name: "بورس ژوهانسبورگ (JSE)", open: "07:00", close: "15:00", utcOffset: "+00:00", coords: [-26.2041, 28.0473] },
  { name: "بورس نایروبی (NSE)", open: "07:00", close: "12:00", utcOffset: "+00:00", coords: [-1.2921, 36.8219] },
  { name: "بورس کازابلانکا", open: "08:30", close: "14:30", utcOffset: "+00:00", coords: [33.5731, -7.5898] },
  { name: "بورس لاگوس (NGX)", open: "09:30", close: "13:30", utcOffset: "+00:00", coords: [6.5244, 3.3792] },

  // ===== آمریکای جنوبی =====
  { name: "بورس سائوپائولو (B3)", open: "13:00", close: "20:00", utcOffset: "+00:00", coords: [-23.5505, -46.6333] },
  { name: "بورس بوینس‌آیرس (BYMA)", open: "14:00", close: "20:00", utcOffset: "+00:00", coords: [-34.6037, -58.3816] },
  { name: "بورس سانتیاگو (BCS)", open: "13:30", close: "21:00", utcOffset: "+00:00", coords: [-33.4489, -70.6693] },
  { name: "بورس مکزیکو (BMV)", open: "14:30", close: "21:00", utcOffset: "+00:00", coords: [19.4326, -99.1332] },
  { name: "بورس لیما (BVL)", open: "14:00", close: "21:00", utcOffset: "+00:00", coords: [-12.0464, -77.0428] },
  { name: "بورس کلمبیا (BVC)", open: "14:30", close: "20:00", utcOffset: "+00:00", coords: [4.7110, -74.0721] },

  // ===== کامودیتی و فلزات =====
  { name: "طلا COMEX", open: "13:20", close: "18:30", utcOffset: "+00:00", coords: [40.7580, -73.9855] },
  { name: "LME لندن (فلزات)", open: "08:00", close: "17:00", utcOffset: "+00:00", coords: [51.5131, -0.0898] },
  { name: "NYMEX نفت", open: "13:00", close: "18:30", utcOffset: "+00:00", coords: [40.7580, -73.9855] },
  { name: "ICE برنت", open: "01:00", close: "23:00", utcOffset: "+00:00", coords: [51.5167, -0.0820] },

  // ===== کریپتو (24 ساعته) =====
  { name: "Binance", open: "00:00", close: "23:59", utcOffset: "+00:00", coords: [1.3521, 103.8198] },
  { name: "Coinbase", open: "00:00", close: "23:59", utcOffset: "+00:00", coords: [37.7749, -122.4194] },

  // روسیه
  { name: "بورس مسکو", open: "09:30", close: "18:45", utcOffset: "+03:00", coords: [55.7558, 37.6173] },

  // رمزارز ۲۴h
  { name: "رمزارز - ۲۴h", open: "00:00", close: "23:59", utcOffset: "+00:00", coords: [0, 0] }
];

/* ساعت ۲۴ تایی UTC - فقط اعداد */
const utcHours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

/* ========== سه‌بعدی سازی ========== */
let scene, camera, renderer, globe, dayMat, nightMat, sun;
let sunAngle = 0;
const UPDATE_MS = 30_000; // ۳۰ ثانیه

/* fetch داده‌ها (در این نسخه داده‌ها داخلی هستند) */
// این بخش در DOMContentLoaded یکپارچه در انتهای فایل اجرا می‌شود

/* راه‌اندازی اسلایدر پیوسته (Infinite Scroll) */
function setupAdsSlider() {
  const track = document.getElementById('adsSliderTrack');
  const prevBtn = document.getElementById('adsPrevBtn');
  const nextBtn = document.getElementById('adsNextBtn');
  const dotsContainer = document.getElementById('adsDots');
  
  if (!track) {
    console.log('⚠️ اسلایدر تبلیغات پیدا نشد');
    return;
  }
  
  const originalSlides = Array.from(track.querySelectorAll('.ad-slide'));
  const slideCount = originalSlides.length;
  
  if (slideCount === 0) {
    console.log('⚠️ اسلایدی پیدا نشد');
    return;
  }
  
  // کپی کردن اسلایدها برای حلقه بی‌نهایت
  originalSlides.forEach(slide => {
    const clone = slide.cloneNode(true);
    track.appendChild(clone);
  });
  
  // محاسبه عرض کل برای انیمیشن CSS
  let slideWidth = originalSlides[0].offsetWidth || 300;
  slideWidth += 20; // gap
  const totalWidth = slideWidth * slideCount;
  
  // تنظیم CSS variable برای انیمیشن
  track.style.setProperty('--slide-width', totalWidth + 'px');
  
  // مخفی کردن dots چون حالا پیوسته است
  if (dotsContainer) {
    dotsContainer.style.display = 'none';
  }
  
  // دکمه‌ها برای کنترل دستی
  let isPaused = false;
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      track.style.animationPlayState = 'paused';
      isPaused = true;
      const currentTransform = getComputedStyle(track).transform;
      const matrix = new DOMMatrix(currentTransform);
      const currentX = matrix.m41;
      track.style.animation = 'none';
      track.style.transform = `translateX(${currentX + slideWidth}px)`;
      
      setTimeout(() => {
        if (!isPaused) {
          track.style.animation = '';
        }
      }, 3000);
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      track.style.animationPlayState = 'paused';
      isPaused = true;
      const currentTransform = getComputedStyle(track).transform;
      const matrix = new DOMMatrix(currentTransform);
      const currentX = matrix.m41;
      track.style.animation = 'none';
      track.style.transform = `translateX(${currentX - slideWidth}px)`;
      
      setTimeout(() => {
        if (!isPaused) {
          track.style.animation = '';
        }
      }, 3000);
    });
  }
  
  // توقف انیمیشن با hover
  track.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });
  
  track.addEventListener('mouseleave', () => {
    if (!isPaused) {
      track.style.animationPlayState = 'running';
    }
  });
  
  // کلیک روی اسلایدها
  track.querySelectorAll('.ad-slide').forEach(slide => {
    slide.addEventListener('click', () => {
      console.log('🖱️ کلیک روی تبلیغ');
    });
  });
  
  // پشتیبانی از تاچ (swipe) برای موبایل
  let touchStartX = 0;
  
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    track.style.animationPlayState = 'paused';
  }, { passive: true });
  
  track.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > 50) {
      const currentTransform = getComputedStyle(track).transform;
      const matrix = new DOMMatrix(currentTransform);
      const currentX = matrix.m41;
      track.style.animation = 'none';
      track.style.transform = `translateX(${currentX - (diff > 0 ? slideWidth : -slideWidth)}px)`;
    }
    
    setTimeout(() => {
      track.style.animationPlayState = 'running';
    }, 2000);
  }, { passive: true });
  
  console.log('✅ اسلایدر پیوسته راه‌اندازی شد - ' + (slideCount * 2) + ' اسلاید');
}

/* تنظیم موقعیت کره کوچک زیر شاخص‌ها */
function updateGlobePosition() {
  const indicatorsContainer = document.querySelector('.indicators-unified-container');
  const globeWrapper = document.getElementById('globeClockWrapper');
  
  if (!indicatorsContainer || !globeWrapper) {
    console.warn('⚠️ indicatorsContainer یا globeWrapper پیدا نشد');
    return;
  }
  
  // محاسبه ارتفاع شاخص‌ها
  const indicatorsHeight = indicatorsContainer.offsetHeight;
  const indicatorsTop = indicatorsContainer.offsetTop || 60; // fallback به 60px
  
  // بررسی اندازه صفحه برای تنظیم فاصله
  const isMobile = window.innerWidth <= 768;
  const gap = isMobile ? 4 : 2; // در دسکتاپ فاصله کمتر (2px)، در موبایل 4px
  
  // تنظیم top کره کوچک
  const globeTop = indicatorsTop + indicatorsHeight + gap;
  
  // اطمینان از نمایش کره کوچک قبل از تنظیم موقعیت
  globeWrapper.style.setProperty('display', 'block', 'important');
  globeWrapper.style.setProperty('visibility', 'visible', 'important');
  globeWrapper.style.setProperty('opacity', '1', 'important');
  globeWrapper.style.setProperty('top', `${globeTop}px`, 'important');
  
  // بررسی اینکه آیا کره کوچک از viewport خارج می‌شود
  const globeHeight = globeWrapper.offsetHeight || 100;
  const viewportHeight = window.innerHeight;
  
  if (globeTop + globeHeight > viewportHeight) {
    console.warn('⚠️ کره کوچک از viewport خارج می‌شود، تنظیم مجدد...');
    // اگر از viewport خارج شد، آن را بالاتر ببر
    const adjustedTop = Math.max(60, viewportHeight - globeHeight - 10);
    globeWrapper.style.setProperty('top', `${adjustedTop}px`, 'important');
  }
  
  console.log('✅ موقعیت کره کوچک تنظیم شد:', {
    indicatorsTop,
    indicatorsHeight,
    globeTop,
    isMobile,
    viewportHeight
  });
}

/* ساخت ساعت UTC دور کره کوچک */
function createUTCClockRing() {
  const ring = document.getElementById('utcClockRing');
  if (!ring) return;
  
  ring.innerHTML = '';
  
  // ۱۲ موقعیت برای نمایش ساعت (هر ۳۰ درجه)
  const positions = 12;
  
  for (let i = 0; i < positions; i++) {
    const hourEl = document.createElement('span');
    hourEl.className = 'utc-hour';
    hourEl.dataset.position = i;
    
    // محاسبه موقعیت روی دایره
    const angle = (i * 30) - 90; // هر موقعیت 30 درجه
    const radian = angle * (Math.PI / 180);
    const radius = 44;
    
    const x = 50 + radius * Math.cos(radian);
    const y = 50 + radius * Math.sin(radian);
    
    hourEl.style.left = `${x}%`;
    hourEl.style.top = `${y}%`;
    hourEl.style.transform = 'translate(-50%, -50%)';
    
    ring.appendChild(hourEl);
    
    // اضافه کردن نقطه چشمک‌زن بین هر جفت عدد (نشان‌دهنده نیم ساعت)
    if (i < positions - 1) {
      const dotEl = document.createElement('span');
      dotEl.className = 'half-hour-dot';
      dotEl.dataset.position = i;
      
      // موقعیت نقطه در وسط دو عدد (15 درجه بعد از هر عدد)
      const dotAngle = ((i * 30) + 15) - 90;
      const dotRadian = dotAngle * (Math.PI / 180);
      const dotRadius = 44;
      
      const dotX = 50 + dotRadius * Math.cos(dotRadian);
      const dotY = 50 + dotRadius * Math.sin(dotRadian);
      
      dotEl.style.left = `${dotX}%`;
      dotEl.style.top = `${dotY}%`;
      dotEl.style.transform = 'translate(-50%, -50%)';
      
      ring.appendChild(dotEl);
    }
  }
  
  updateUTCClock();
}

/* آپدیت ساعت UTC - نمایش ساعت فعلی در موقعیت صحیح */
function updateUTCClock() {
  const now = new Date();
  const currentHour = now.getUTCHours();
  const currentMinutes = now.getUTCMinutes();
  const isHalfHour = currentMinutes >= 30;
  
  // آپدیت اعداد - هر موقعیت ساعت متناظر خودش را نشان می‌دهد
  document.querySelectorAll('.utc-hour').forEach((el, index) => {
    // محاسبه ساعتی که در این موقعیت باید نمایش داده شود
    // موقعیت 0 = بالا (ساعت 0)، موقعیت 3 = راست (ساعت 6)، ...
    const displayHour = (index * 2) % 24;
    
    // نمایش ساعت
    el.textContent = displayHour.toString().padStart(2, '0');
    el.dataset.hour = displayHour;
    
    // هایلایت ساعت فعلی
    const hourRange = [displayHour, (displayHour + 1) % 24];
    if (hourRange.includes(currentHour)) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });
  
  // آپدیت نقطه‌های چشمک‌زن - نشان‌دهنده نیم ساعت
  document.querySelectorAll('.half-hour-dot').forEach((el, index) => {
    // محاسبه ساعتی که این نقطه بین آن‌هاست
    const hour1 = (index * 2) % 24;
    const hour2 = ((index * 2) + 1) % 24;
    
    // اگر ساعت فعلی بین این دو ساعت است و دقیقه >= 30، نقطه را فعال کن
    if (isHalfHour && (currentHour === hour1 || currentHour === hour2)) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });
}

/* ساخت صحنه */
function initGlobe() {
  const container = document.getElementById('globeContainer');
  if (!container) {
    console.error('❌ globeContainer پیدا نشد!');
    return;
  }
  
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 3.2);
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  
  // اضافه کردن canvas به container
  const canvas = renderer.domElement;
  canvas.style.pointerEvents = 'none'; // کلیک‌ها از canvas رد بشن به container
  container.appendChild(canvas);
  
  console.log('✅ کره کوچک ساخته شد');

  // نور بیشتر برای دید بهتر کره کوچک
  const ambient = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambient);
  sun = new THREE.DirectionalLight(0xffffff, 0.8);
  sun.name = 'sun';
  scene.add(sun);

  const geometry = new THREE.SphereGeometry(1, 64, 64);
  const loader = new THREE.TextureLoader();
  
  // استفاده از URL خارجی برای جلوگیری از خطای 404
  let nightTextureVar = null;
  
  // بارگذاری عکس روز
  try {
    const dayTexture = loader.load(
      'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
      (texture) => {
        dayMat = new THREE.MeshPhongMaterial({ map: texture });
        if (globe) {
          globe.material = dayMat;
        }
      },
      undefined,
      () => {
        console.warn('⚠️ عکس روز زمین لود نشد، استفاده از رنگ پیش‌فرض');
        dayMat = new THREE.MeshPhongMaterial({ color: 0x2563eb });
      }
    );
  } catch (e) {
    console.warn('⚠️ خطا در لود عکس روز:', e);
    dayMat = new THREE.MeshPhongMaterial({ color: 0x2563eb });
  }
  
  // اگر dayMat هنوز تعریف نشده، از رنگ پیش‌فرض استفاده کن
  if (!dayMat) {
    dayMat = new THREE.MeshPhongMaterial({ color: 0x2563eb });
  }
  
  // بارگذاری عکس شب
  try {
    nightTextureVar = loader.load(
      'https://unpkg.com/three-globe/example/img/earth-night.jpg',
      (texture) => {
        console.log('✅ عکس شب زمین بارگذاری شد');
        nightMat = new THREE.MeshPhongMaterial({ map: texture });
      },
      undefined,
      () => {
        console.warn('⚠️ عکس شب زمین پیدا نشد، از عکس روز استفاده میشه');
        // استفاده از عکس روز به جای شب
        loader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg', (texture) => {
          nightMat = new THREE.MeshPhongMaterial({ map: texture });
        });
      }
    );
  } catch (e) {
    console.warn('⚠️ خطا در لود عکس شب:', e);
    // استفاده از عکس روز به جای شب
    loader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg', (texture) => {
      nightMat = new THREE.MeshPhongMaterial({ map: texture });
    });
  }
  
  // اگر nightMat هنوز تعریف نشده، از dayMat استفاده کن
  if (!nightMat) {
    nightMat = dayMat.clone();
  }
  globe = new THREE.Mesh(geometry, dayMat);
  scene.add(globe);

  addMarketPoints();
  animate();
}

/* نقاط بازار - چشمک‌زن */
function addMarketPoints() {
  marketData.forEach(m => {
    const pos = latLngToVector3(m.coords[0], m.coords[1]);
    const color = statusColor(m);
    const point = new THREE.Mesh(
      new THREE.SphereGeometry(0.028, 16, 16),
      new THREE.MeshBasicMaterial({ color })
    );
    point.position.copy(pos);
    globe.add(point);
    let visible = true;
    setInterval(() => {
      visible = !visible;
      point.visible = visible;
    }, 500);
  });
}

/* رنگ وضعیت بازار */
function statusColor(market) {
  const now = utcMinutes();
  const open = timeToMinutes(market.open);
  const close = timeToMinutes(market.close);
  if (now >= open && now < close) return 0x00ff00;        // سبز
  if (Math.abs(now - open)  <= 15) return 0xffff00;     // زرد
  if (Math.abs(now - close) <= 15) return 0xff8800;     // نارنجی
  return 0xff0000; // قرمز
}
function timeToMinutes(t) { const [h, m] = t.split(':').map(Number); return h * 60 + m; }
function utcMinutes() {
  const d = new Date();
  return d.getUTCHours() * 60 + d.getUTCMinutes();
}
function latLngToVector3(lat, lng) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(Math.sin(phi) * Math.cos(theta));
  const z = Math.sin(phi) * Math.sin(theta);
  const y = Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

/* خط واقعی شب/روز - آرام‌آرام طبق UTC */
function updateSunAndMarkets() {
  const now = new Date();
  const utcHour = now.getUTCHours() + now.getUTCMinutes() / 60 + now.getUTCSeconds() / 3600;
  // همیشه از تکسچر روز استفاده کن (حالت شب خیلی تاریکه)
  globe.material = dayMat;
  
  // خورشید فقط برای افکت نوری
  sunAngle = (utcHour / 24) * 2 * Math.PI;
  const sunX = Math.cos(sunAngle) * 6;
  const sunZ = Math.sin(sunAngle) * 6;
  sun.position.set(sunX, 2, sunZ);
}

function animate() {
  requestAnimationFrame(animate);
  globe.rotation.y += 0.0008;
  renderer.render(scene, camera);
}

/* باز/بسته مودال */
//document.getElementById('globeContainer').addEventListener('click', () => {
  //openFinancialGlobe(); // این تابع رو خودمون قبلاً ساختیم
//});

// متغیر برای جلوگیری از کلیک‌های مکرر
let globeOpening = false;

// تابع handler کلیک روی کره کوچک
function handleSmallGlobeClick(e) {
    e.preventDefault();
    e.stopPropagation();
    
    // بررسی وجود currentTarget
    if (!e.currentTarget) {
        console.warn('⚠️ currentTarget پیدا نشد');
        return;
    }
    
    console.log('🖱️ کلیک روی کره کوچک:', e.type);
    
    // جلوگیری از double trigger در touch devices
    if (e.type === 'touchend' && e.currentTarget) {
        e.currentTarget.classList.add('touched');
        setTimeout(() => {
            if (e.currentTarget) {
                e.currentTarget.classList.remove('touched');
            }
        }, 300);
    }
    if (e.type === 'click' && e.currentTarget && e.currentTarget.classList.contains('touched')) {
        return;
    }
    
    // چک لاگین
    if (typeof isUserLoggedIn === 'function' && !isUserLoggedIn()) {
        if (typeof showLoginPrompt === 'function') {
            showLoginPrompt();
        }
        return;
    }
    
    // جلوگیری از کلیک‌های مکرر
    if (globeOpening) {
        console.log('⏳ کره در حال باز شدن است...');
        return;
    }
    
    globeOpening = true;
    console.log('🚀 در حال باز کردن کره بزرگ...');
    
    // باز کردن کره مالی
    if (typeof openFinancialGlobe === 'function') {
        openFinancialGlobe();
    } else {
        console.error('❌ تابع openFinancialGlobe یافت نشد!');
    }
    
    // بعد از 1 ثانیه دوباره فعال کن
    setTimeout(() => {
        globeOpening = false;
    }, 1000);
}

// Event listener برای کره کوچک
function setupSmallGlobeClick() {
    // امتحان با wrapper یا container
    const wrapper = document.getElementById('globeClockWrapper');
    const container = document.getElementById('globeContainer');
    const target = wrapper || container;
    
    if (!target) {
        console.warn('⚠️ کره کوچک پیدا نشد، تلاش مجدد...');
        setTimeout(setupSmallGlobeClick, 500);
        return;
    }
    
    // حذف event listener قبلی
    target.removeEventListener('click', handleSmallGlobeClick);
    target.removeEventListener('touchend', handleSmallGlobeClick);
    
    // اضافه کردن event listener
    target.addEventListener('click', handleSmallGlobeClick, { passive: false });
    target.addEventListener('touchend', handleSmallGlobeClick, { passive: false });
    
    // استایل
    target.style.cursor = 'pointer';
    target.style.webkitTapHighlightColor = 'transparent';
    
    console.log('✅ Event listener کره کوچک فعال شد روی:', target.id);
}

// تابع بررسی لاگین
function isUserLoggedIn() {
  return true; // ✅ برای تست
}

// تابع نمایش پیام لاگین
function showLoginPrompt() {
  alert('🔐 برای دسترسی به این قابلیت، لطفاً وارد حساب کاربری خود شوید.\n\nاین قسمت فقط برای کاربران دارای اشتراک فعال می‌باشد.');
}

// تنظیم کلیک روی کره کوچک در DOMContentLoaded انجام میشه

// تنظیم gc-close با بررسی وجود المان
const gcCloseBtn = document.querySelector('.gc-close');
if (gcCloseBtn) {
    gcCloseBtn.onclick = () => {
        const gcModal = document.getElementById('gcModal');
        if (gcModal) gcModal.style.display = 'none';
    };
}



// ==================== //
// سیستم کامل کره‌های سه بعدی
// ==================== //

const EARTH_DAY_TEXTURE = 'earth-day.jpg';
let activeScenes = {
    financial: null,
    resources: null
};

// تابع برای اضافه کردن markers به صحنه
function addMarkersToScene(scene, type, globe) {
    let markers = [];
    
    if (type === 'financial') {
        // استفاده از داده‌های mockFinancialData اگر موجود باشد
        if (typeof mockFinancialData !== 'undefined') {
            markers = mockFinancialData.map(point => ({
                lat: point.lat,
                lng: point.lng,
                color: point.status === 'open' ? 0x00ff00 : 0xff0000,
                name: point.name,
                country: point.country,
                hours: point.hours,
                status: point.status,
                indicators: point.indicators
            }));
        } else {
            // داده‌های پیش‌فرض
            markers = [
                { lat: 40.7128, lng: -74.0060, color: 0x00ff00, name: "NYSE", country: "آمریکا" },
                { lat: 51.5074, lng: -0.1278, color: 0xff0000, name: "LSE", country: "انگلیس" },
                { lat: 35.6895, lng: 139.6917, color: 0xff0000, name: "TSE", country: "ژاپن" },
                { lat: 22.3193, lng: 114.1694, color: 0xffff00, name: "HKEX", country: "هنگ‌کنگ" }
            ];
        }
    } else if (type === 'resources') {
        // استفاده از داده‌های mockResourcesData اگر موجود باشد
        if (typeof mockResourcesData !== 'undefined') {
            markers = mockResourcesData.map(point => {
                // تبدیل رنگ hex به عدد
                let colorNum = 0xffa500; // پیش‌فرض
                if (point.color) {
                    if (point.color.startsWith('#')) {
                        colorNum = parseInt(point.color.replace('#', ''), 16);
                    } else if (typeof point.color === 'string') {
                        // تبدیل نام رنگ به عدد
                        const colorMap = {
                            '#f59e0b': 0xf59e0b,
                            '#000000': 0x000000,
                            '#3b82f6': 0x3b82f6
                        };
                        colorNum = colorMap[point.color] || 0xffa500;
                    }
                }
                
                return {
                    lat: point.lat,
                    lng: point.lng,
                    color: colorNum,
                    name: point.name,
                    country: point.country,
                    resource: point.resource,
                    reserves: point.reserves,
                    production: point.production
                };
            });
        } else {
            // داده‌های پیش‌فرض
            markers = [
                { lat: -26.2041, lng: 28.0473, color: 0xffd700, name: "طلای آفریقای جنوبی", country: "آفریقای جنوبی" },
                { lat: 24.7136, lng: 46.6753, color: 0x000000, name: "نفت عربستان", country: "عربستان" },
                { lat: 65.0000, lng: 153.0000, color: 0x0000ff, name: "گاز روسیه", country: "روسیه" },
                { lat: 35.6892, lng: 51.3890, color: 0xffa500, name: "معادن ایران", country: "ایران" }
            ];
        }
    }
    
    markers.forEach(marker => {
        const phi = (90 - marker.lat) * (Math.PI / 180);
        const theta = (marker.lng + 180) * (Math.PI / 180);
        
        const x = -(2.2 * Math.sin(phi) * Math.cos(theta));
        const y = (2.2 * Math.cos(phi));
        const z = (2.2 * Math.sin(phi) * Math.sin(theta));
        
        // ساخت marker حرفه‌ای - هرم (pyramid) برای نمایش دقیق‌تر
        const markerGroup = new THREE.Group();
        
        // بدنه اصلی - هرم کوچک
        const pyramidGeometry = new THREE.ConeGeometry(0.06, 0.12, 4);
        const markerMaterial = new THREE.MeshPhongMaterial({ 
            color: marker.color,
            emissive: marker.color,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.95,
            shininess: 100
        });
        const pyramid = new THREE.Mesh(pyramidGeometry, markerMaterial);
        pyramid.rotation.z = Math.PI / 4; // چرخش 45 درجه
        markerGroup.add(pyramid);
        
        // حلقه در پایه هرم برای تأکید بیشتر
        const ringGeometry = new THREE.TorusGeometry(0.08, 0.01, 8, 16);
        const ringMaterial = new THREE.MeshBasicMaterial({ 
            color: marker.color,
            transparent: true,
            opacity: 0.8
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = -0.06;
        markerGroup.add(ring);
        
        // نقطه درخشان در بالای marker
        const glowGeometry = new THREE.SphereGeometry(0.03, 8, 8);
        const glowMaterial = new THREE.MeshBasicMaterial({ 
            color: marker.color,
            transparent: true,
            opacity: 1
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.y = 0.08;
        markerGroup.add(glow);
        
        // تنظیم موقعیت
        markerGroup.position.set(x, y, z);
        
        // چرخش marker به سمت مرکز کره (normal vector)
        const normal = new THREE.Vector3(x, y, z).normalize();
        markerGroup.lookAt(normal.multiplyScalar(10));
        markerGroup.rotateX(Math.PI / 2); // چرخش 90 درجه
        
        // ذخیره اطلاعات marker
        markerGroup.userData = marker;
        markerGroup.userData.markerInfo = {
            name: marker.name,
            country: marker.country || '',
            type: type,
            lat: marker.lat,
            lng: marker.lng
        };
        
        // اضافه کردن خط نازک به سطح کره (نه به مرکز)
        const lineLength = 0.3;
        const lineEnd = new THREE.Vector3(x, y, z).normalize().multiplyScalar(2.2 - lineLength);
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(x, y, z),
            lineEnd
        ]);
        const lineMaterial = new THREE.LineBasicMaterial({ 
            color: marker.color,
            transparent: true,
            opacity: 0.2,
            linewidth: 1
        });
        const line = new THREE.Line(lineGeometry, lineMaterial);
        
        scene.add(markerGroup);
        scene.add(line);
    });
    
    console.log(`✅ ${markers.length} marker اضافه شد برای نوع: ${type}`);
}

// تابع اصلی برای ساخت کره
function createAdvancedGlobe(containerId, type) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('المان پیدا نشد:', containerId);
        return null;
    }

    // پاک کردن محتوای قبلی
    container.innerHTML = '';
    
    // اطمینان از اینکه container اندازه دارد
    let retryCount = 0;
    const maxRetries = 20; // حداکثر 20 بار تلاش (2 ثانیه)
    
    const ensureSize = () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        console.log(`🔍 بررسی اندازه container (تلاش ${retryCount + 1}/${maxRetries}):`, {
            width,
            height,
            display: window.getComputedStyle(container).display,
            visibility: window.getComputedStyle(container).visibility
        });
        
        if (width === 0 || height === 0) {
            retryCount++;
            if (retryCount >= maxRetries) {
                console.error('❌ Container بعد از 20 تلاش هنوز اندازه ندارد!');
                container.innerHTML = `
                    <div style="color: white; text-align: center; padding: 50px; font-family: Arial; background: rgba(255,0,0,0.2); border-radius: 10px;">
                        <div style="font-size: 64px; margin-bottom: 20px;">⚠️</div>
                        <h3 style="color: #ff6b6b;">خطا در نمایش کره</h3>
                        <p style="color: #94a3b8; margin-top: 10px;">
                            Container اندازه ندارد. لطفاً صفحه را رفرش کنید.
                        </p>
                    </div>
                `;
                return;
            }
            // اگر اندازه ندارد، منتظر بمان
            setTimeout(ensureSize, 100);
            return;
        }
        
        console.log('✅ Container اندازه دارد، شروع ساخت کره...');
        createGlobe();
    };
    
    const createGlobe = () => {
        try {
            const width = container.clientWidth || window.innerWidth;
            const height = container.clientHeight || window.innerHeight;
            
            if (width === 0 || height === 0) {
                console.warn('Container هنوز اندازه ندارد، دوباره تلاش می‌کنم...');
                setTimeout(ensureSize, 100);
                return;
            }
            
            console.log(`🌍 ساخت کره ${type} با اندازه: ${width}x${height}`);
            
            // بررسی وجود Three.js
            if (typeof THREE === 'undefined') {
                throw new Error('Three.js لود نشده است!');
            }
            
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0x000000);
            
            const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
            camera.position.set(0, 0, 5);
            camera.lookAt(0, 0, 0);
            
            const renderer = new THREE.WebGLRenderer({ 
                antialias: true, 
                alpha: false,
                powerPreference: "high-performance"
            });
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3)); // افزایش pixel ratio برای کیفیت بالاتر
            renderer.shadowMap.enabled = false; // غیرفعال برای performance بهتر
            renderer.antialias = true;
            
            // پاک کردن container و اضافه کردن renderer
            container.innerHTML = '';
            container.appendChild(renderer.domElement);
            
            console.log('✅ Renderer ساخته شد و به DOM اضافه شد');

            // نورپردازی یکنواخت بدون سایه
            const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
            scene.add(ambientLight);
            
            // نور اصلی - کاهش شدت
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(5, 3, 5);
            directionalLight.castShadow = false; // غیرفعال کردن shadow برای performance بهتر
            scene.add(directionalLight);
            
            // نور اضافی برای روشنایی یکنواخت (کاهش شدت)
            const pointLight = new THREE.PointLight(0xffffff, 0.4);
            pointLight.position.set(-5, -3, -5);
            scene.add(pointLight);
            
            // نور از طرف دیگر برای روشنایی بهتر
            const pointLight2 = new THREE.PointLight(0xffffff, 0.3);
            pointLight2.position.set(0, 5, 0);
            scene.add(pointLight2);

            // کره زمین - با کیفیت بالا (128 segments برای smoothness بیشتر)
            const geometry = new THREE.SphereGeometry(2, 128, 128);
            
            // ساخت material طبیعی‌تر با بازتابش کمتر
            const material = new THREE.MeshPhongMaterial({ 
                color: type === 'financial' ? 0x1e3a8a : 0x0f766e,
                emissive: type === 'financial' ? 0x0a1a3a : 0x042f2e,
                shininess: 10, // کاهش shininess برای بازتابش کمتر
                specular: new THREE.Color(0x111111), // کاهش specular
                flatShading: false, // smooth shading
                transparent: false
            });
            
            const globe = new THREE.Mesh(geometry, material);
            globe.castShadow = false; // غیرفعال برای performance
            globe.receiveShadow = false;
            globe.rotation.x = 0; // تنظیم rotation اولیه
            globe.rotation.y = 0;
            globe.rotation.z = 0;
            scene.add(globe);
            
            // اضافه کردن atmosphere effect (اختیاری - برای ظاهر طبیعی‌تر)
            const atmosphereGeometry = new THREE.SphereGeometry(2.05, 64, 64);
            const atmosphereMaterial = new THREE.MeshBasicMaterial({
                color: type === 'financial' ? 0x1e3a8a : 0x0f766e,
                transparent: true,
                opacity: 0.1,
                side: THREE.BackSide
            });
            const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
            scene.add(atmosphere);
            
            console.log('✅ کره با رنگ ساده ساخته شد');
            
            // تلاش برای لود texture - با مدیریت خطا بهتر
            const textureLoader = new THREE.TextureLoader();
            
            // ابتدا صحنه را راه‌اندازی کن
            setupScene(scene, camera, renderer, globe, type, container);
            
            // سپس texture را لود کن (اختیاری)
            try {
                textureLoader.load(
                    EARTH_DAY_TEXTURE, 
                    (texture) => {
                        console.log('✅ Texture لود شد');
                        try {
                            // تنظیمات texture
                            texture.wrapS = THREE.ClampToEdgeWrapping;
                            texture.wrapT = THREE.ClampToEdgeWrapping;
                            texture.minFilter = THREE.LinearFilter;
                            texture.magFilter = THREE.LinearFilter;
                            
                            // آپدیت material با texture
                            material.map = texture;
                            material.color.setHex(0xffffff); // رنگ سفید تا texture دیده شود
                            material.needsUpdate = true;
                            
                            console.log('✅ Texture به کره اعمال شد');
                        } catch (texError) {
                            console.warn('⚠️ خطا در اعمال texture:', texError);
                        }
                    },
                    (progress) => {
                        console.log('📥 لود texture:', Math.round((progress.loaded / progress.total) * 100) + '%');
                    },
                    (error) => {
                        console.warn('⚠️ Texture لود نشد:', error);
                    }
                );
            } catch (loadError) {
                console.warn('⚠️ خطا در شروع لود texture:', loadError);
            }
            
            // ادامه بدون انتظار برای texture
            return;
            
            // راه‌اندازی صحنه
            setupScene(scene, camera, renderer, globe, type, container);

        } catch (error) {
            console.error('❌ خطا در ساخت کره:', error);
            container.innerHTML = `
                <div style="color: white; text-align: center; padding: 50px; font-family: Arial; background: rgba(0,0,0,0.8); border-radius: 10px;">
                    <div style="font-size: 64px; margin-bottom: 20px;">🌍</div>
                    <h3 style="margin-bottom: 10px;">کره زمین سه بعدی</h3>
                    <p style="color: #ff6b6b; margin-bottom: 20px;">خطا: ${error.message}</p>
                    <p style="font-size: 14px; color: #94a3b8; margin-bottom: 20px;">
                        لطفاً Console مرورگر را بررسی کنید (F12)
                    </p>
                    <button onclick="location.reload()" style="margin-top: 20px; padding: 12px 24px; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">
                        🔄 رفرش صفحه
                    </button>
                </div>
            `;
            return null;
        }
    };
    
    // تست Three.js قبل از شروع
    if (typeof THREE === 'undefined') {
        container.innerHTML = `
            <div style="color: white; text-align: center; padding: 50px; font-family: Arial; background: rgba(255,0,0,0.2); border-radius: 10px;">
                <div style="font-size: 64px; margin-bottom: 20px;">⚠️</div>
                <h3 style="color: #ff6b6b;">Three.js لود نشده است!</h3>
                <p style="color: #94a3b8; margin-top: 10px;">
                    لطفاً صفحه را رفرش کنید یا بررسی کنید که Three.js درست لود شده باشد.
                </p>
            </div>
        `;
        console.error('❌ Three.js لود نشده است!');
        return null;
    }
    
    console.log('✅ Three.js موجود است:', {
        version: THREE.REVISION,
        WebGLRenderer: typeof THREE.WebGLRenderer !== 'undefined',
        Scene: typeof THREE.Scene !== 'undefined',
        PerspectiveCamera: typeof THREE.PerspectiveCamera !== 'undefined'
    });
    
    // شروع ساخت
    ensureSize();
    
    return activeScenes[type];
}

// تابع کمکی برای setup
function setupScene(scene, camera, renderer, globe, type, container) {
    console.log('🔧 راه‌اندازی صحنه...');
    
    // کنترل‌ها
    let controls = null;
    try {
        if (typeof THREE !== 'undefined' && typeof THREE.OrbitControls !== 'undefined') {
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.minDistance = 2.5;
            controls.maxDistance = 50; // افزایش maxDistance برای زوم بیشتر
            controls.enablePan = true;
            controls.enableZoom = true;
            controls.enableRotate = true; // چرخش با ماوس فعال است
            controls.autoRotate = false; // پیش‌فرض: چرخش اتوماتیک خاموش
            controls.autoRotateSpeed = 0; // سرعت چرخش اتوماتیک صفر
            
            // غیرفعال کردن چرخش با اسکرول (wheel)
            controls.mouseButtons = {
                LEFT: THREE.MOUSE.ROTATE,
                MIDDLE: THREE.MOUSE.DOLLY,
                RIGHT: THREE.MOUSE.PAN
            };
            
            // جلوگیری از چرخش با wheel event
            const originalWheelHandler = controls.handleMouseWheel;
            controls.handleMouseWheel = function(event) {
                // فقط zoom، نه rotate
                if (event.deltaY !== 0) {
                    const zoom = event.deltaY > 0 ? 1.1 : 0.9;
                    this.dolly(zoom);
                    this.update();
                }
            };
            
            // تنظیم سرعت چرخش اولیه
            controls.rotateSpeed = 0.5;
            
            // تنظیم سرعت چرخش بر اساس زوم
            controls.addEventListener('change', () => {
                const distance = camera.position.length();
                const minDist = controls.minDistance;
                const maxDist = controls.maxDistance;
                
                // نرمالایز فاصله (0 = نزدیک‌ترین، 1 = دورترین)
                const normalizedDistance = Math.min(1, Math.max(0, (distance - minDist) / (maxDist - minDist)));
                
                // سرعت چرخش: هرچه نزدیک‌تر، کندتر (0.08 تا 0.5)
                controls.rotateSpeed = 0.08 + (normalizedDistance * 0.42);
            });
            
            console.log('✅ OrbitControls ساخته شد');
        } else {
            console.warn('⚠️ OrbitControls لود نشده است. کنترل‌ها غیرفعال هستند.');
        }
    } catch (error) {
        console.error('❌ خطا در ساخت OrbitControls:', error);
    }

    // تنظیم موقعیت camera - به سمت ایران
    const iranLat = 32.4279;
    const iranLng = 53.6880;
    const phi = (90 - iranLat) * (Math.PI / 180);
    const theta = (iranLng + 180) * (Math.PI / 180);
    const distance = 5;
    const x = -distance * Math.sin(phi) * Math.cos(theta);
    const y = distance * Math.cos(phi);
    const z = distance * Math.sin(phi) * Math.sin(theta);
    camera.position.set(x, y, z);
    camera.lookAt(0, 0, 0);

    // اضافه کردن markers
    console.log('📍 اضافه کردن markers...');
    addMarkersToScene(scene, type, globe);

    // انیمیشن - ذخیره در متغیر برای توقف بعدی
    let animationId = null;
    let isAnimating = false;
    
    function animate() {
        if (!isAnimating) return;
        
        animationId = requestAnimationFrame(animate);
        
        // چرخش کره - فقط اگر autoRotate فعال باشد
        if (globe && globe.rotation && controls && controls.autoRotate) {
            // چرخش کره فقط وقتی autoRotate فعال است
            globe.rotation.y += 0.0005;
        }
        
        // آپدیت کنترل‌ها
        if (controls && controls.update) {
            controls.update();
        }
        
        // رندر صحنه
        try {
            renderer.render(scene, camera);
        } catch (error) {
            console.error('خطا در رندر:', error);
            isAnimating = false;
        }
    }
    
    // شروع انیمیشن
    isAnimating = true;
    animate();
    console.log('✅ انیمیشن شروع شد');

    // مدیریت ریزپانسیو
    function handleResize() {
        const width = container.clientWidth || window.innerWidth;
        const height = container.clientHeight || window.innerHeight;
        
        if (width > 0 && height > 0) {
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
            console.log(`📐 ریزایز: ${width}x${height}`);
        }
    }

    const resizeHandler = handleResize;
    window.addEventListener('resize', resizeHandler);

    // ذخیره صحنه
    activeScenes[type] = { 
        scene, 
        camera, 
        renderer, 
        controls, 
        globe,
        animate: () => {
            if (!isAnimating) {
                isAnimating = true;
                animate();
            }
        },
        stop: () => {
            isAnimating = false;
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        },
        handleResize: resizeHandler,
        reset: function() {
            if (controls && controls.reset) {
                controls.reset();
            }
            camera.position.set(0, 0, 5);
            camera.lookAt(0, 0, 0);
            if (globe) {
                globe.rotation.set(0, 0, 0);
            }
        }
    };

    console.log(`✅ کره ${type} کاملاً راه‌اندازی شد و آماده نمایش است!`);
    
    // تست رندر اولیه
    setTimeout(() => {
        try {
            renderer.render(scene, camera);
            console.log('✅ تست رندر اولیه موفق بود');
        } catch (error) {
            console.error('❌ خطا در تست رندر:', error);
        }
    }, 100);
}

// ==================== //
// 🌍 ساخت ساده کره - بدون کلاس
// ==================== //

let simpleGlobeScenes = {
    financial: null,
    resources: null,
    weather: null,
    military: null,
    universities: null,
    historical: null,
    earthquake: null,
    'natural-resources': null
};

function buildSimpleGlobe(containerId, type) {
    console.log(`🌍 buildSimpleGlobe شروع: ${type}`);
    
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('❌ Container پیدا نشد:', containerId);
        return;
    }
    
    container.innerHTML = '';
    
    if (typeof THREE === 'undefined') {
        console.error('❌ THREE.js لود نشده!');
        return;
    }
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    try {
        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000510);
        
        // Camera - موقعیت اولیه به سمت ایران
        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        // مختصات ایران: 32.4279, 53.6880
        const iranLat = 32.4279;
        const iranLng = 53.6880;
        const phi = (90 - iranLat) * (Math.PI / 180);
        const theta = (iranLng + 180) * (Math.PI / 180);
        const distance = 2.5;
        const x = -distance * Math.sin(phi) * Math.cos(theta);
        const y = distance * Math.cos(phi);
        const z = distance * Math.sin(phi) * Math.sin(theta);
        camera.position.set(x, y, z);
        camera.lookAt(0, 0, 0);
        
        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);
        
        // Controls
        let controls = null;
        if (typeof THREE.OrbitControls !== 'undefined') {
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.minDistance = 1.2;
            controls.maxDistance = 8;
            controls.enablePan = false;
            controls.enableRotate = true; // چرخش با ماوس فعال است
            controls.autoRotate = false; // پیش‌فرض: چرخش اتوماتیک خاموش
            controls.autoRotateSpeed = 0;
            
            // جلوگیری از چرخش با wheel event
            const originalWheelHandler = controls.handleMouseWheel;
            controls.handleMouseWheel = function(event) {
                // فقط zoom، نه rotate
                if (event.deltaY !== 0) {
                    const zoom = event.deltaY > 0 ? 1.1 : 0.9;
                    this.dolly(zoom);
                    this.update();
                }
            };
            
            controls.rotateSpeed = 0.5;
            
            // تنظیم سرعت چرخش بر اساس زوم
            controls.addEventListener('change', () => {
                const distance = camera.position.length();
                const minDist = controls.minDistance;
                const maxDist = controls.maxDistance;
                const normalizedDistance = Math.min(1, Math.max(0, (distance - minDist) / (maxDist - minDist)));
                controls.rotateSpeed = 0.08 + (normalizedDistance * 0.42);
            });
        }
        
        // نورپردازی یکنواخت
        scene.add(new THREE.AmbientLight(0xffffff, 1.0));
        const sun = new THREE.DirectionalLight(0xffffff, 0.4);
        sun.position.set(5, 3, 5);
        scene.add(sun);
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-5, -3, -5);
        scene.add(fillLight);
        
        // کره زمین
        const earthGeo = new THREE.SphereGeometry(1, 64, 64);
        const earthMat = new THREE.MeshPhongMaterial({ color: 0x2563eb, shininess: 25 });
        const earth = new THREE.Mesh(earthGeo, earthMat);
        scene.add(earth);
        
        // اولین render
        renderer.render(scene, camera);
        
        // بارگذاری تکسچر
        const loader = new THREE.TextureLoader();
        loader.crossOrigin = 'anonymous';
        loader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg', (texture) => {
            earth.material.map = texture;
            earth.material.needsUpdate = true;
        });
        
        // هاله
        const atmosGeo = new THREE.SphereGeometry(1.03, 64, 64);
        const atmosMat = new THREE.MeshBasicMaterial({
            color: type === 'financial' ? 0x3b82f6 : 0xfbbf24,
            transparent: true,
            opacity: 0.12,
            side: THREE.BackSide
        });
        scene.add(new THREE.Mesh(atmosGeo, atmosMat));
        
        // ذخیره مارکرها برای انیمیشن و کلیک
        const markers = [];
        const markerGroup = new THREE.Group();
        earth.add(markerGroup);
        
        // === کره مالی ===
        if (type === 'financial' && typeof marketData !== 'undefined') {
            console.log(`📍 تعداد بازارها: ${marketData.length}`);
            
            marketData.forEach((market, index) => {
                const lat = market.coords[0];
                const lng = market.coords[1];
                const phi = (90 - lat) * (Math.PI / 180);
                const theta = (lng + 180) * (Math.PI / 180);
                
                // چسبیده به سطح کره
                const radius = 1.005;
                const x = -radius * Math.sin(phi) * Math.cos(theta);
                const y = radius * Math.cos(phi);
                const z = radius * Math.sin(phi) * Math.sin(theta);
                
                // رنگ بر اساس وضعیت بازار
                const statusInfo = getMarketStatusInfo(market);
                const isMajor = market.major === true;
                
                let core, glow, rays = [];
                
                if (isMajor) {
                    // ⭐ بازار اصلی - ستاره‌ای و بزرگتر
                    
                    // مرکز ستاره
                    const coreGeo = new THREE.SphereGeometry(0.018, 12, 12);
                    const coreMat = new THREE.MeshBasicMaterial({ 
                        color: statusInfo.coreColor
                    });
                    core = new THREE.Mesh(coreGeo, coreMat);
                    core.position.set(x, y, z);
                    core.userData = { market, index, type: 'market', major: true };
                    markerGroup.add(core);
                    
                    // هاله بزرگتر
                    const glowGeo = new THREE.SphereGeometry(0.028, 12, 12);
                    const glowMat = new THREE.MeshBasicMaterial({ 
                        color: statusInfo.glowColor,
                        transparent: true,
                        opacity: 0.6
                    });
                    glow = new THREE.Mesh(glowGeo, glowMat);
                    glow.position.set(x, y, z);
                    glow.userData = { market, index, type: 'market', major: true };
                    markerGroup.add(glow);
                    
                    // پرتوهای ستاره (4 پرتو)
                    const rayLength = 0.04;
                    const rayWidth = 0.004;
                    for (let i = 0; i < 4; i++) {
                        const rayGeo = new THREE.BoxGeometry(rayWidth, rayLength, rayWidth);
                        const rayMat = new THREE.MeshBasicMaterial({ 
                            color: statusInfo.coreColor,
                            transparent: true,
                            opacity: 0.9
                        });
                        const ray = new THREE.Mesh(rayGeo, rayMat);
                        
                        // موقعیت پرتو
                        ray.position.set(x, y, z);
                        
                        // چرخش پرتوها به سمت خارج
                        const normal = new THREE.Vector3(x, y, z).normalize();
                        ray.lookAt(normal.multiplyScalar(2).add(ray.position));
                        ray.rotateZ(i * Math.PI / 4); // 45 درجه بین پرتوها
                        
                        ray.userData = { market, index, type: 'market', major: true, isRay: true };
                        markerGroup.add(ray);
                        rays.push(ray);
                    }
                    
                    // حلقه دور ستاره
                    const ringGeo = new THREE.RingGeometry(0.03, 0.035, 32);
                    const ringMat = new THREE.MeshBasicMaterial({ 
                        color: statusInfo.coreColor,
                        transparent: true,
                        opacity: 0.4,
                        side: THREE.DoubleSide
                    });
                    const ring = new THREE.Mesh(ringGeo, ringMat);
                    ring.position.set(x, y, z);
                    
                    // حلقه رو به سمت دوربین (بیرون کره)
                    const normalVec = new THREE.Vector3(x, y, z).normalize();
                    ring.lookAt(normalVec.multiplyScalar(10).add(ring.position));
                    
                    ring.userData = { market, index, type: 'market', major: true, isRing: true };
                    markerGroup.add(ring);
                    rays.push(ring);
                    
                } else {
                    // ● بازار معمولی - نقطه کوچک
                    
                    const coreGeo = new THREE.SphereGeometry(0.010, 8, 8);
                    const coreMat = new THREE.MeshBasicMaterial({ 
                        color: statusInfo.coreColor
                    });
                    core = new THREE.Mesh(coreGeo, coreMat);
                    core.position.set(x, y, z);
                    core.userData = { market, index, type: 'market' };
                    markerGroup.add(core);
                    
                    // هاله نور کوچک
                    const glowGeo = new THREE.SphereGeometry(0.015, 8, 8);
                    const glowMat = new THREE.MeshBasicMaterial({ 
                        color: statusInfo.glowColor,
                        transparent: true,
                        opacity: 0.4
                    });
                    glow = new THREE.Mesh(glowGeo, glowMat);
                    glow.position.set(x, y, z);
                    glow.userData = { market, index, type: 'market' };
                    markerGroup.add(glow);
                }
                
                markers.push({ 
                    core, glow, rays, market, 
                    statusInfo,
                    isMajor,
                    position: { x, y, z }
                });
            });
        }
        
        // === کره منابع ===
        // نکته: آیکون‌های منابع از طریق سیستم worldResources اضافه میشن
        // نه از mockResourcesData - حذف شد
        if (type === 'resources') {
            console.log('📍 کره منابع - آیکون‌ها از طریق فیلتر اضافه میشن');
        }
        
        // Raycaster برای تشخیص کلیک
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        let selectedMarker = null;
        
        // انیمیشن چراغ‌های بازار
        let animTime = 0;
        const blinkInterval = setInterval(() => {
            if (type === 'financial') {
                animTime += 0.1;
                markers.forEach(m => {
                    if (!m.core || !m.glow) return;
                    
                    // آپدیت وضعیت بازار
                    const newStatus = getMarketStatusInfo(m.market);
                    m.core.material.color.setHex(newStatus.coreColor);
                    m.glow.material.color.setHex(newStatus.glowColor);
                    
                    if (m.isMajor) {
                        // انیمیشن ستاره - درخشش قوی‌تر و چرخش
                        const breathe = 0.5 + Math.sin(animTime * 4) * 0.3;
                        m.glow.material.opacity = breathe;
                        
                        // چرخش پرتوها
                        if (m.rays && m.rays.length > 0) {
                            m.rays.forEach((ray, i) => {
                                if (ray.userData.isRay) {
                                    ray.rotation.z += 0.02;
                                    ray.material.color.setHex(newStatus.coreColor);
                                }
                                if (ray.userData.isRing) {
                                    ray.rotation.z += 0.01;
                                    ray.material.color.setHex(newStatus.coreColor);
                                    ray.material.opacity = 0.3 + Math.sin(animTime * 2) * 0.2;
                                }
                            });
                        }
                    } else {
                        // بازار معمولی - افکت تنفس ساده
                        const breathe = 0.4 + Math.sin(animTime * 3) * 0.2;
                        m.glow.material.opacity = breathe;
                    }
                });
            }
        }, 50);
        
        // چرخش اتوماتیک - پیش‌فرض: غیرفعال
        let autoRotate = false;
        let frameId;
        
        const animate = () => {
            frameId = requestAnimationFrame(animate);
            // چرخش کره فقط اگر autoRotate فعال باشد
            if (autoRotate && earth) {
                earth.rotation.y += 0.001;
            }
            
            // چرخش حلقه‌های المان‌های facility
            if (type === 'resources' && facilityMarkersGroup) {
                facilityMarkersGroup.children.forEach(marker => {
                    if (marker.userData && marker.userData.rotateRings && marker.userData.rings) {
                        marker.userData.rings.forEach(ring => {
                            if (ring.userData.rotate) {
                                ring.rotation.z += ring.userData.rotationSpeed || 0.02;
                            }
                        });
                    }
                });
            }
            
            if (controls) controls.update();
            renderer.render(scene, camera);
        };
        animate();
        
        // ریسایز
        const onResize = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener('resize', onResize);
        
        // تابع مشترک برای کلیک و تاچ روی مارکر
        const handleMarkerInteraction = (clientX, clientY) => {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
            
            raycaster.setFromCamera(mouse, camera);
            
            // بررسی برخورد با مارکرها
            const allMarkerObjects = [];
            markers.forEach(m => {
                if (m.core) allMarkerObjects.push(m.core);
                if (m.glow) allMarkerObjects.push(m.glow);
            });
            
            // اضافه کردن المان‌های facility (گمرک، معادن و...)
            if ((type === 'resources' || type === 'military' || type === 'universities' || type === 'historical') && facilityMarkersGroup) {
                facilityMarkersGroup.traverse((child) => {
                    if (child instanceof THREE.Mesh || child instanceof THREE.Group) {
                        allMarkerObjects.push(child);
                    }
                });
            }
            
            // اضافه کردن المان‌های نظامی
            if ((type === 'military' || type === 'resources') && militaryMarkersGroup) {
                militaryMarkersGroup.traverse((child) => {
                    if (child instanceof THREE.Mesh || child instanceof THREE.Group) {
                        allMarkerObjects.push(child);
                    }
                });
            }
            
            // اضافه کردن المان‌های conflicts
            if ((type === 'military' || type === 'resources') && resourcesGlobeData && resourcesGlobeData.conflictsGroup) {
                resourcesGlobeData.conflictsGroup.traverse((child) => {
                    if (child instanceof THREE.Mesh || child instanceof THREE.Group) {
                        allMarkerObjects.push(child);
                    }
                });
            }
            
            // اضافه کردن المان‌های دانشگاه، تاریخی، آب و هوا، زلزله و منابع طبیعی از scene
            if (type === 'universities' || type === 'historical' || type === 'weather' || type === 'earthquake' || type === 'natural-resources') {
                scene.scene.traverse((obj) => {
                    if (obj.name === 'universities' || obj.name === 'historical' || obj.name === 'weather' || 
                        obj.name === 'earthquakes' || obj.name === 'naturalResources') {
                        obj.traverse((child) => {
                            if (child instanceof THREE.Mesh || child instanceof THREE.Group || child instanceof THREE.Line) {
                                allMarkerObjects.push(child);
                            }
                        });
                    }
                });
            }
            
            const intersects = raycaster.intersectObjects(allMarkerObjects, true);
            
            if (intersects.length > 0) {
                const clicked = intersects[0].object;
                
                // کلیک روی بازار (کره مالی)
                if (clicked.userData && clicked.userData.market) {
                    console.log('📍 کلیک روی بازار:', clicked.userData.market.name);
                    autoRotate = false;
                    zoomToMarker(clicked.userData.market, camera, controls, earth);
                    showMarketPopup(clicked.userData.market, container);
                    return true;
                }
                
                // کلیک روی المان facility (کره منابع) - اولویت بالا
                if (clicked.userData && clicked.userData.type) {
                    const facilityData = clicked.userData;
                    console.log('📍 کلیک روی المان:', facilityData.type, facilityData.name);
                    autoRotate = false;
                    
                    // نمایش popup روی کره - جلوگیری از انتخاب کشور
                    event?.stopPropagation?.();
                    showFacilityPopup(facilityData, intersects[0].point, container, camera);
                    return true;
                }
                
                // اگر روی المان کلیک شد، دیگر کشور را انتخاب نکن
                return true;
            }
            
            // در کره منابع: تشخیص کلیک روی کشور (روی خود کره) - فقط اگر روی المان کلیک نشد
            if (type === 'resources') {
                // فقط mesh اصلی کره، نه فرزندان (مرزها/آیکون‌ها)
                const earthIntersects = raycaster.intersectObject(earth, false);
                if (earthIntersects.length > 0) {
                    // چک کن که آیا روی المان کلیک شده یا نه
                    const facilityIntersects = facilityMarkersGroup ? 
                        raycaster.intersectObjects(facilityMarkersGroup.children, true) : [];
                    
                    // اگر روی المان کلیک نشد، کشور را انتخاب کن
                    if (facilityIntersects.length === 0) {
                        const worldPoint = earthIntersects[0].point;
                        
                        // تبدیل نقطه از سیستم جهانی به سیستم محلی کره
                        const localPoint = earth.worldToLocal(worldPoint.clone());
                        
                        // تبدیل موقعیت 3D به lat/lng
                        const latLng = vector3ToLatLng(localPoint);
                        
                        // پیدا کردن کشور بر اساس مختصات
                        const countryCode = findCountryByLatLng(latLng.lat, latLng.lng);
                        if (countryCode) {
                            console.log('🗺️ کشور:', countryCode);
                            selectCountry(countryCode);
                            return true;
                        }
                    }
                }
            }
            
            return false;
        };
        
        // تبدیل Vector3 به lat/lng - معکوس latLngToVector3Globe
        // فرمول اصلی latLngToVector3Globe:
        // phi = (90 - lat) * π/180
        // theta = (lng + 180) * π/180
        // x = -r * sin(phi) * cos(theta)
        // y = r * cos(phi)
        // z = r * sin(phi) * sin(theta)
        const vector3ToLatLng = (vec) => {
            const r = Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z);
            if (r === 0) return { lat: 0, lng: 0 };
            
            // از y → lat
            // y = r * cos(phi) → phi = acos(y/r)
            // lat = 90 - phi * 180/π
            const phi = Math.acos(Math.max(-1, Math.min(1, vec.y / r)));
            const lat = 90 - (phi * 180 / Math.PI);
            
            // از x,z → lng
            // x = -r * sin(phi) * cos(theta)
            // z = r * sin(phi) * sin(theta)
            // tan(theta) = z / (-x) = -z/x
            // theta = atan2(z, -x)
            // theta = (lng + 180) * π/180
            // lng = theta * 180/π - 180
            const theta = Math.atan2(vec.z, -vec.x);
            let lng = (theta * 180 / Math.PI) - 180;
            
            // نرمال‌سازی به [-180, 180]
            while (lng < -180) lng += 360;
            while (lng > 180) lng -= 360;
            
            return { lat, lng };
        };
        
        // پیدا کردن کشور بر اساس مختصات - روش پیشرفته با فاصله از مرکز
        const findCountryByLatLng = (lat, lng) => {
            if (typeof countriesData === 'undefined') return null;
            
            // استفاده از مختصات پایتخت‌ها و محاسبه نزدیک‌ترین کشور
            // این روش دقیق‌تر از bounding box است
            
            let closestCountry = null;
            let minDistance = Infinity;
            
            // محاسبه فاصله تقریبی (Haversine ساده شده)
            const getDistance = (lat1, lng1, lat2, lng2) => {
                const dLat = (lat2 - lat1) * Math.PI / 180;
                const dLng = (lng2 - lng1) * Math.PI / 180;
                const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                    Math.sin(dLng / 2) * Math.sin(dLng / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                return c * 6371; // فاصله به کیلومتر
            };
            
            // اول از countriesData استفاده کن (دقیق‌تر)
            if (countriesData) {
                for (const [code, data] of Object.entries(countriesData)) {
                    if (data.capital && data.capital.coords) {
                        const [capLat, capLng] = data.capital.coords;
                        const dist = getDistance(lat, lng, capLat, capLng);
                        // برای کشورهای کوچک، شعاع کوچکتر
                        const radius = data.populationDensity > 200 ? 200 : 
                                     data.populationDensity > 50 ? 500 : 1000; // کیلومتر
                        
                        if (dist < radius && dist < minDistance) {
                            minDistance = dist;
                            closestCountry = code;
                        }
                    }
                }
                
                // اگر کشور پیدا شد و فاصله معقول است، برگردان
                if (closestCountry && minDistance < 1500) {
                    console.log('✅ کشور از countriesData پیدا شد:', closestCountry, 'فاصله:', minDistance.toFixed(1), 'km');
                    return closestCountry;
                }
            }
            
            // محدوده تقریبی هر کشور - برخی کشورهای بزرگ چند منطقه دارن
            const countryZones = [
                // === کشورهای کوچک - اولویت بالا ===
                { code: 'IL', center: [31.5, 35], radius: 1.5 },      // اسرائیل
                { code: 'AE', center: [24, 54], radius: 2.5 },        // امارات
                { code: 'KR', center: [36, 128], radius: 3 },         // کره جنوبی
                { code: 'KP', center: [40, 127], radius: 2.5 },       // کره شمالی
                { code: 'SY', center: [35, 38], radius: 3 },          // سوریه
                { code: 'YE', center: [16, 47], radius: 4 },          // یمن
                
                // === کشورهای متوسط ===
                { code: 'IQ', center: [33, 44], radius: 4 },          // عراق
                { code: 'AF', center: [34, 66], radius: 5 },          // افغانستان
                { code: 'UK', center: [54, -2], radius: 5 },          // بریتانیا
                { code: 'DE', center: [51, 10], radius: 4 },          // آلمان
                { code: 'FR', center: [46, 2], radius: 5 },           // فرانسه
                { code: 'JP', center: [36, 138], radius: 6 },         // ژاپن
                { code: 'EG', center: [27, 30], radius: 5 },          // مصر
                { code: 'UA', center: [49, 32], radius: 5 },          // اوکراین
                { code: 'PK', center: [30, 69], radius: 6 },          // پاکستان
                { code: 'TR', center: [39, 35], radius: 6 },          // ترکیه
                { code: 'IR', center: [32, 53], radius: 8 },          // ایران
                
                // === کشورهای بزرگ ===
                { code: 'SA', center: [24, 45], radius: 8 },          // عربستان
                { code: 'IN', center: [22, 80], radius: 12 },         // هند
                { code: 'ZA', center: [-29, 25], radius: 8 },         // آفریقای جنوبی
                { code: 'AU', center: [-25, 134], radius: 18 },       // استرالیا
                
                // === کشورهای خیلی بزرگ - چند منطقه ===
                // چین
                { code: 'CN', center: [35, 105], radius: 12 },        // چین شرقی
                { code: 'CN', center: [40, 85], radius: 10 },         // چین غربی (سین‌کیانگ)
                
                // آمریکا
                { code: 'US', center: [39, -98], radius: 15 },        // مرکز آمریکا
                { code: 'US', center: [34, -118], radius: 8 },        // کالیفرنیا
                { code: 'US', center: [40, -74], radius: 6 },         // نیویورک
                { code: 'US', center: [25, -80], radius: 5 },         // فلوریدا
                
                // کانادا
                { code: 'CA', center: [56, -106], radius: 20 },       // کانادا مرکزی
                { code: 'CA', center: [49, -123], radius: 8 },        // ونکوور
                { code: 'CA', center: [45, -75], radius: 6 },         // اتاوا/مونترال
                
                // برزیل
                { code: 'BR', center: [-14, -51], radius: 15 },       // برزیل
                { code: 'BR', center: [-23, -46], radius: 6 },        // سائوپائولو
                
                // === آمریکای جنوبی ===
                { code: 'AR', center: [-34, -64], radius: 12 },       // آرژانتین
                { code: 'CL', center: [-35, -71], radius: 8 },       // شیلی
                { code: 'CO', center: [4, -74], radius: 6 },          // کلمبیا
                { code: 'PE', center: [-9, -75], radius: 6 },         // پرو
                { code: 'VE', center: [8, -66], radius: 6 },           // ونزوئلا
                { code: 'EC', center: [-1, -78], radius: 4 },        // اکوادور
                { code: 'BO', center: [-16, -64], radius: 6 },        // بولیوی
                { code: 'PY', center: [-23, -58], radius: 4 },        // پاراگوئه
                { code: 'UY', center: [-33, -56], radius: 3 },        // اروگوئه
                { code: 'GY', center: [5, -59], radius: 4 },          // گویان
                { code: 'SR', center: [4, -56], radius: 3 },          // سورینام
                { code: 'GF', center: [4, -53], radius: 3 },          // گویان فرانسه
                
                // === آمریکای مرکزی ===
                { code: 'MX', center: [23, -102], radius: 10 },       // مکزیک
                { code: 'GT', center: [15, -90], radius: 3 },         // گواتمالا
                { code: 'CR', center: [10, -84], radius: 2 },         // کاستاریکا
                { code: 'PA', center: [9, -80], radius: 2 },          // پاناما
                { code: 'HN', center: [15, -86], radius: 3 },        // هندوراس
                { code: 'NI', center: [13, -85], radius: 3 },         // نیکاراگوئه
                { code: 'SV', center: [14, -89], radius: 1.5 },       // السالوادور
                { code: 'BZ', center: [17, -88], radius: 2 },          // بلیز
                { code: 'CU', center: [22, -80], radius: 3 },          // کوبا
                { code: 'JM', center: [18, -77], radius: 1.5 },       // جامائیکا
                { code: 'HT', center: [19, -72], radius: 1.5 },       // هائیتی
                { code: 'DO', center: [19, -70], radius: 2 },         // جمهوری دومینیکن
                
                // === آفریقا ===
                { code: 'DZ', center: [28, 3], radius: 8 },           // الجزایر
                { code: 'LY', center: [27, 17], radius: 6 },           // لیبی
                { code: 'TN', center: [34, 9], radius: 3 },           // تونس
                { code: 'MA', center: [32, -6], radius: 4 },          // مراکش
                { code: 'SD', center: [15, 30], radius: 8 },          // سودان
                { code: 'ET', center: [9, 38], radius: 6 },            // اتیوپی
                { code: 'KE', center: [0, 38], radius: 4 },           // کنیا
                { code: 'TZ', center: [-6, 35], radius: 6 },          // تانزانیا
                { code: 'UG', center: [1, 32], radius: 3 },           // اوگاندا
                { code: 'GH', center: [8, -1], radius: 4 },           // غنا
                { code: 'SN', center: [14, -14], radius: 3 },         // سنگال
                { code: 'CI', center: [8, -5], radius: 4 },           // ساحل عاج
                { code: 'CM', center: [7, 12], radius: 4 },           // کامرون
                { code: 'AO', center: [-12, 17], radius: 6 },         // آنگولا
                { code: 'MZ', center: [-18, 35], radius: 5 },          // موزامبیک
                { code: 'ZM', center: [-13, 28], radius: 5 },          // زامبیا
                { code: 'ZW', center: [-19, 30], radius: 4 },          // زیمبابوه
                { code: 'MG', center: [-19, 47], radius: 5 },          // ماداگاسکار
                
                // === آسیا (بیشتر) ===
                { code: 'BD', center: [24, 90], radius: 4 },           // بنگلادش
                { code: 'MM', center: [22, 96], radius: 6 },           // میانمار
                { code: 'LK', center: [7, 81], radius: 2 },           // سری‌لانکا
                { code: 'NP', center: [28, 84], radius: 3 },          // نپال
                { code: 'BT', center: [27, 90], radius: 2 },           // بوتان
                { code: 'MN', center: [46, 105], radius: 8 },         // مغولستان
                { code: 'KZ', center: [48, 66], radius: 12 },          // قزاقستان
                { code: 'UZ', center: [41, 64], radius: 4 },          // ازبکستان
                { code: 'TM', center: [39, 59], radius: 4 },           // ترکمنستان
                { code: 'TJ', center: [39, 71], radius: 3 },           // تاجیکستان
                { code: 'KG', center: [41, 75], radius: 3 },           // قرقیزستان
                { code: 'AM', center: [40, 45], radius: 2 },          // ارمنستان
                { code: 'AZ', center: [40, 47], radius: 3 },          // آذربایجان
                { code: 'GE', center: [42, 43], radius: 2 },          // گرجستان
                { code: 'LB', center: [34, 36], radius: 2 },           // لبنان
                { code: 'JO', center: [31, 36], radius: 2 },          // اردن
                { code: 'KW', center: [29, 48], radius: 1.5 },       // کویت
                { code: 'QA', center: [25, 51], radius: 1.5 },         // قطر
                { code: 'BH', center: [26, 50], radius: 1 },          // بحرین
                { code: 'OM', center: [21, 57], radius: 4 },           // عمان
                
                // === اروپا (بیشتر) ===
                { code: 'IT', center: [42, 12], radius: 6 },          // ایتالیا
                { code: 'ES', center: [40, -3], radius: 5 },         // اسپانیا
                { code: 'PL', center: [52, 20], radius: 4 },          // لهستان
                { code: 'RO', center: [46, 25], radius: 4 },          // رومانی
                { code: 'NL', center: [52, 5], radius: 2 },           // هلند
                { code: 'BE', center: [51, 4], radius: 1.5 },         // بلژیک
                { code: 'GR', center: [39, 22], radius: 4 },          // یونان
                { code: 'PT', center: [40, -8], radius: 3 },         // پرتغال
                { code: 'CZ', center: [50, 15], radius: 3 },         // جمهوری چک
                { code: 'HU', center: [47, 20], radius: 3 },          // مجارستان
                { code: 'SE', center: [60, 18], radius: 5 },           // سوئد
                { code: 'NO', center: [60, 8], radius: 6 },           // نروژ
                { code: 'FI', center: [61, 26], radius: 5 },         // فنلاند
                { code: 'DK', center: [56, 10], radius: 2 },          // دانمارک
                { code: 'AT', center: [47, 14], radius: 3 },         // اتریش
                { code: 'CH', center: [47, 8], radius: 2 },           // سوئیس
                { code: 'IE', center: [53, -8], radius: 2 },          // ایرلند
                
                // === اقیانوسیه ===
                { code: 'NZ', center: [-41, 174], radius: 5 },        // نیوزیلند
                { code: 'FJ', center: [-18, 178], radius: 2 },        // فیجی
                { code: 'PG', center: [-6, 147], radius: 5 },         // پاپوآ گینه نو
                
                // روسیه - چند منطقه مهم
                { code: 'RU', center: [55, 37], radius: 8 },          // مسکو و اروپایی
                { code: 'RU', center: [55, 60], radius: 10 },         // اورال
                { code: 'RU', center: [55, 83], radius: 12 },         // سیبری غربی
                { code: 'RU', center: [55, 105], radius: 12 },        // سیبری شرقی
                { code: 'RU', center: [55, 130], radius: 12 },        // خاور دور
                { code: 'RU', center: [65, 90], radius: 15 },         // شمال سیبری
                { code: 'RU', center: [45, 45], radius: 8 },          // قفقاز
            ];
            
            // استفاده از countryZones به عنوان fallback (تبدیل radius از درجه به کیلومتر)
            const candidates = [];
            
            for (const zone of countryZones) {
                const dist = getDistance(lat, lng, zone.center[0], zone.center[1]); // کیلومتر
                const radiusKm = zone.radius * 111; // تبدیل درجه به کیلومتر (تقریبی)
                const ratio = dist / radiusKm;
                if (ratio <= 1.5) { // حداکثر 50% خارج از شعاع
                    candidates.push({ 
                        code: zone.code, 
                        dist, 
                        radius: radiusKm,
                        ratio,
                        withinRadius: ratio <= 1.0 
                    });
                }
            }
            
            // اگر کاندیدایی از countryZones پیدا شد، از آن استفاده کن
            if (candidates.length > 0) {
                // حذف کشورهای تکراری - نگه داشتن بهترین منطقه هر کشور
                const bestByCountry = {};
                for (const c of candidates) {
                    if (!bestByCountry[c.code] || c.ratio < bestByCountry[c.code].ratio) {
                        bestByCountry[c.code] = c;
                    }
                }
                const uniqueCandidates = Object.values(bestByCountry);
                
                // مرتب‌سازی هوشمند:
                uniqueCandidates.sort((a, b) => {
                    // اگر یکی داخل شعاع و دیگری خارج، داخلی برنده
                    if (a.withinRadius && !b.withinRadius) return -1;
                    if (!a.withinRadius && b.withinRadius) return 1;
                    // هر دو داخل یا هر دو خارج - کمترین ratio
                    return a.ratio - b.ratio;
                });
                
                console.log('🎯 کاندیدا از countryZones:', uniqueCandidates.map(c => `${c.code}(${c.ratio.toFixed(2)})`).join(', '));
                return uniqueCandidates[0].code;
            }
            
            // اگر هیچ کاندیدایی پیدا نشد، نزدیک‌ترین کشور از countryZones
            for (const zone of countryZones) {
                const dist = getDistance(lat, lng, zone.center[0], zone.center[1]);
                if (dist < minDistance) {
                    minDistance = dist;
                    closestCountry = zone.code;
                }
            }
            
            if (closestCountry && minDistance < 2000) { // حداکثر 2000 کیلومتر
                console.log('⚠️ کشور نزدیک از countryZones:', closestCountry, 'فاصله:', minDistance.toFixed(1), 'km');
                return closestCountry;
            }
            
            return null;
            
            // حذف کشورهای تکراری - نگه داشتن بهترین منطقه هر کشور
            const bestByCountry = {};
            for (const c of candidates) {
                if (!bestByCountry[c.code] || c.ratio < bestByCountry[c.code].ratio) {
                    bestByCountry[c.code] = c;
                }
            }
            const uniqueCandidates = Object.values(bestByCountry);
            
            // مرتب‌سازی هوشمند:
            uniqueCandidates.sort((a, b) => {
                // اگر یکی داخل شعاع و دیگری خارج، داخلی برنده
                if (a.withinRadius && !b.withinRadius) return -1;
                if (!a.withinRadius && b.withinRadius) return 1;
                // هر دو داخل یا هر دو خارج - کمترین ratio
                return a.ratio - b.ratio;
            });
            
            console.log('🎯 کاندیداها:', uniqueCandidates.map(c => `${c.code}(${c.ratio.toFixed(2)})`).join(', '));
            return uniqueCandidates[0].code;
        };
        
        // متغیرهای مشترک برای تشخیص کلیک vs درگ
        let pointerStartX = 0;
        let pointerStartY = 0;
        let pointerStartTime = 0;
        
        // Pointer events - کار می‌کنه هم با موس و هم با تاچ
        const onPointerDown = (event) => {
            pointerStartTime = Date.now();
            pointerStartX = event.clientX;
            pointerStartY = event.clientY;
        };
        
        const onPointerUp = (event) => {
            const duration = Date.now() - pointerStartTime;
            const moveX = Math.abs(event.clientX - pointerStartX);
            const moveY = Math.abs(event.clientY - pointerStartY);
            const totalMove = Math.sqrt(moveX * moveX + moveY * moveY);
            
            // فقط اگر کلیک کوتاه بود و حرکت کمتر از 15 پیکسل
            if (duration < 400 && totalMove < 15) {
                console.log('✅ کلیک/تپ تشخیص داده شد (حرکت:', totalMove.toFixed(1), 'px)');
                handleMarkerInteraction(event.clientX, event.clientY);
            }
        };
        
        // استفاده از Pointer Events - یکپارچه برای موس و تاچ
        renderer.domElement.addEventListener('pointerdown', onPointerDown);
        renderer.domElement.addEventListener('pointerup', onPointerUp);
        
        // ذخیره برای پاکسازی
        const globeData = {
            scene, camera, renderer, controls, frameId, earth, markers, markerGroup,
            autoRotate: false, // پیش‌فرض: چرخش اتوماتیک خاموش
            setAutoRotate: (value) => { autoRotate = value; },
            getAutoRotate: () => autoRotate,
            destroy: function() {
                console.log(`🗑️ پاکسازی کره ${type}...`);
                try {
                    clearInterval(blinkInterval);
                    cancelAnimationFrame(frameId);
                    window.removeEventListener('resize', onResize);
                    renderer.domElement.removeEventListener('pointerdown', onPointerDown);
                    renderer.domElement.removeEventListener('pointerup', onPointerUp);
                    if (controls) controls.dispose();
                    scene.traverse((obj) => {
                        if (obj.geometry) obj.geometry.dispose();
                        if (obj.material) {
                            if (Array.isArray(obj.material)) {
                                obj.material.forEach(m => { if (m.map) m.map.dispose(); m.dispose(); });
                            } else {
                                if (obj.material.map) obj.material.map.dispose();
                                obj.material.dispose();
                            }
                        }
                    });
                    scene.clear();
                    renderer.dispose();
                    renderer.forceContextLoss();
                    if (renderer.domElement.parentNode) {
                        renderer.domElement.parentNode.removeChild(renderer.domElement);
                    }
                    // حذف popup اگر باز بود
                    const popup = container.querySelector('.market-3d-popup');
                    if (popup) popup.remove();
                } catch (err) {
                    console.error('خطا در پاکسازی:', err);
                }
            }
        };
        
        // ذخیره در simpleGlobeScenes
        simpleGlobeScenes[type] = globeData;
        
        // ذخیره در window برای دسترسی از توابع دیگر
        if (type === 'financial') {
            window.financialGlobeObjects = globeData;
        } else if (type === 'resources') {
            window.resourcesGlobeObjects = globeData;
        }
        
        console.log(`✅ کره ${type} آماده!`, {
            hasScene: !!globeData.scene,
            hasEarth: !!globeData.earth,
            hasCamera: !!globeData.camera,
            hasRenderer: !!globeData.renderer
        });
        
        // برگرداندن globeData
        return globeData;
        
    } catch (error) {
        console.error('❌ خطا در buildSimpleGlobe:', error);
        return null;
    }
}

// اطلاعات وضعیت بازار با رنگ‌های پررنگ
function getMarketStatusInfo(market) {
    const now = new Date();
    const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
    
    const [openH, openM] = market.open.split(':').map(Number);
    const [closeH, closeM] = market.close.split(':').map(Number);
    const openMin = openH * 60 + openM;
    const closeMin = closeH * 60 + closeM;
    
    // در حال باز شدن (1 ساعت قبل از باز شدن)
    if (utcMinutes >= openMin - 60 && utcMinutes < openMin) {
        return {
            status: 'opening',
            isOpen: false,
            coreColor: 0xffdd00,    // زرد پررنگ
            glowColor: 0xffdd00,
            label: 'در حال باز شدن'
        };
    }
    // در حال بسته شدن (1 ساعت قبل از بسته شدن)
    if (utcMinutes >= closeMin - 60 && utcMinutes < closeMin) {
        return {
            status: 'closing',
            isOpen: true,
            coreColor: 0xff8800,    // نارنجی پررنگ
            glowColor: 0xff8800,
            label: 'در حال بسته شدن'
        };
    }
    // باز
    if (utcMinutes >= openMin && utcMinutes < closeMin) {
        return {
            status: 'open',
            isOpen: true,
            coreColor: 0x00ff00,    // سبز پررنگ
            glowColor: 0x00ff00,
            label: 'باز'
        };
    }
    // بسته
    return {
        status: 'closed',
        isOpen: false,
        coreColor: 0xff0000,    // قرمز پررنگ
        glowColor: 0xff0000,
        label: 'بسته'
    };
}

// نسخه ساده برای سازگاری
function getMarketStatusColor(market) {
    return getMarketStatusInfo(market).coreColor;
}

// زوم به مارکر انتخاب شده
function zoomToMarker(market, camera, controls, earth) {
    if (!market || !camera) return;
    
    console.log(`🎯 زوم به: ${market.name} (${market.coords[0]}, ${market.coords[1]})`);
    
    const lat = market.coords[0];
    const lng = market.coords[1];
    
    // تبدیل lat/lng به موقعیت روی کره
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    
    // موقعیت نقطه روی کره
    const targetX = -Math.sin(phi) * Math.cos(theta);
    const targetY = Math.cos(phi);
    const targetZ = Math.sin(phi) * Math.sin(theta);
    
    // ابتدا کره رو ریست کن به چرخش صفر
    earth.rotation.y = 0;
    
    // موقعیت نهایی دوربین (کمی دورتر از نقطه هدف)
    const distance = 2.0;
    const targetCamPos = new THREE.Vector3(
        targetX * distance,
        targetY * distance,
        targetZ * distance
    );
    
    // انیمیشن
    const startCamPos = camera.position.clone();
    const duration = 1200;
    const startTime = Date.now();
    
    const animateCamera = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        
        // حرکت دوربین
        camera.position.lerpVectors(startCamPos, targetCamPos, ease);
        camera.lookAt(0, 0, 0);
        
        if (controls) {
            controls.update();
        }
        
        if (progress < 1) {
            requestAnimationFrame(animateCamera);
        }
    };
    animateCamera();
}

// نمایش پنجره اطلاعات بازار - استایل شیشه‌ای
function showMarketPopup(market, container) {
    // حذف popup قبلی
    const oldPopup = container.querySelector('.market-3d-popup');
    if (oldPopup) oldPopup.remove();
    
    // محاسبات زمان
    const now = new Date();
    const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
    const [openH, openM] = market.open.split(':').map(Number);
    const [closeH, closeM] = market.close.split(':').map(Number);
    const openMin = openH * 60 + openM;
    const closeMin = closeH * 60 + closeM;
    
    // بررسی وضعیت بازار
    let isOpen = false;
    if (closeMin > openMin) {
        isOpen = utcMinutes >= openMin && utcMinutes < closeMin;
    } else {
        // بازار شبانه (مثلا 22:00 - 07:00)
        isOpen = utcMinutes >= openMin || utcMinutes < closeMin;
    }
    
    // محاسبه زمان محلی کاربر
    const userTimezone = getUserTimezone();
    const userOffset = userTimezone.offset;
    const localOpenTime = convertUTCtoLocal(market.open, userOffset);
    const localCloseTime = convertUTCtoLocal(market.close, userOffset);
    
    // محاسبه زمان باقیمانده
    let timeRemaining = '';
    if (isOpen) {
        const minutesLeft = closeMin > utcMinutes ? closeMin - utcMinutes : (1440 - utcMinutes + closeMin);
        const hoursLeft = Math.floor(minutesLeft / 60);
        const minsLeft = minutesLeft % 60;
        timeRemaining = `⏱️ ${hoursLeft} ساعت و ${minsLeft} دقیقه تا بسته شدن`;
    } else {
        let minutesToOpen = openMin > utcMinutes ? openMin - utcMinutes : (1440 - utcMinutes + openMin);
        const hoursToOpen = Math.floor(minutesToOpen / 60);
        const minsToOpen = minutesToOpen % 60;
        timeRemaining = `⏱️ ${hoursToOpen} ساعت و ${minsToOpen} دقیقه تا باز شدن`;
    }
    
    // بارگذاری تنظیمات ناتیفیکیشن قبلی
    const savedNotifications = JSON.parse(localStorage.getItem('marketNotifications') || '{}');
    const savedSetting = savedNotifications[market.name] || {};
    const isNotifyEnabled = savedSetting.enabled || false;
    const notifyMinutes = savedSetting.minutesBefore || 15;
    
    const popup = document.createElement('div');
    popup.className = 'market-3d-popup glass-popup';
    popup.innerHTML = `
        <div class="glass-popup-header">
            <div class="popup-status-badge ${isOpen ? 'open' : 'closed'}">
                ${isOpen ? '🟢 باز' : '🔴 بسته'}
            </div>
            <button class="glass-popup-close" onclick="this.closest('.market-3d-popup').remove()">×</button>
        </div>
        
        <h3 class="glass-popup-title">${market.name}</h3>
        <p class="popup-time-remaining">${timeRemaining}</p>
        
        <div class="glass-popup-section">
            <h4>🕐 ساعات کاری (UTC)</h4>
            <div class="time-grid">
                <div class="time-item">
                    <span class="time-label">باز شدن</span>
                    <span class="time-value">${market.open}</span>
                </div>
                <div class="time-item">
                    <span class="time-label">بسته شدن</span>
                    <span class="time-value">${market.close}</span>
                </div>
            </div>
        </div>
        
        <div class="glass-popup-section">
            <h4>📍 ساعت محلی شما (${userTimezone.name})</h4>
            <div class="time-grid">
                <div class="time-item local">
                    <span class="time-label">باز شدن</span>
                    <span class="time-value">${localOpenTime}</span>
                </div>
                <div class="time-item local">
                    <span class="time-label">بسته شدن</span>
                    <span class="time-value">${localCloseTime}</span>
                </div>
            </div>
        </div>
        
        <div class="glass-popup-section notification-section">
            <h4>🔔 اعلان‌ها</h4>
            <p class="notification-info">اعلان‌ها طبق ساعت محلی شما (${userTimezone.name}) ارسال می‌شوند</p>
            <div class="notification-row">
                <label class="toggle-switch">
                    <input type="checkbox" id="notify-${market.name.replace(/\s/g, '')}" ${isNotifyEnabled ? 'checked' : ''}>
                    <span class="toggle-slider"></span>
                </label>
                <span>اعلان قبل از باز شدن</span>
            </div>
            <select class="notify-time-select" ${!isNotifyEnabled ? 'disabled' : ''}>
                <option value="5" ${notifyMinutes === 5 ? 'selected' : ''}>5 دقیقه قبل</option>
                <option value="15" ${notifyMinutes === 15 ? 'selected' : ''}>15 دقیقه قبل</option>
                <option value="30" ${notifyMinutes === 30 ? 'selected' : ''}>30 دقیقه قبل</option>
                <option value="60" ${notifyMinutes === 60 ? 'selected' : ''}>1 ساعت قبل</option>
            </select>
        </div>
        
        <button class="glass-popup-save" onclick="saveMarketNotification('${market.name}', this)">
            💾 ذخیره و فعال‌سازی اعلان
        </button>
    `;
    
    container.appendChild(popup);
    
    // رویداد تغییر checkbox
    const checkbox = popup.querySelector('input[type="checkbox"]');
    const select = popup.querySelector('.notify-time-select');
    if (checkbox && select) {
        checkbox.addEventListener('change', () => {
            select.disabled = !checkbox.checked;
        });
    }
    
    // انیمیشن ورود
    setTimeout(() => popup.classList.add('visible'), 10);
}

// دریافت منطقه زمانی کاربر
function getUserTimezone() {
    // اول چک کن آیا کاربر دستی تنظیم کرده
    const savedTimezone = localStorage.getItem('userTimezone');
    if (savedTimezone) {
        try {
            return JSON.parse(savedTimezone);
        } catch (e) {}
    }
    
    // تشخیص خودکار
    const offset = -new Date().getTimezoneOffset();
    const hours = Math.floor(Math.abs(offset) / 60);
    const mins = Math.abs(offset) % 60;
    const sign = offset >= 0 ? '+' : '-';
    const offsetStr = `${sign}${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    
    // تلاش برای دریافت نام منطقه زمانی
    let timezoneName = 'محلی';
    try {
        timezoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;
        // تبدیل به نام فارسی‌تر
        if (timezoneName.includes('Tehran')) timezoneName = 'تهران';
        else if (timezoneName.includes('Dubai')) timezoneName = 'دبی';
        else if (timezoneName.includes('London')) timezoneName = 'لندن';
        else if (timezoneName.includes('New_York')) timezoneName = 'نیویورک';
        else if (timezoneName.includes('Tokyo')) timezoneName = 'توکیو';
        else timezoneName = `UTC${offsetStr}`;
    } catch (e) {
        timezoneName = `UTC${offsetStr}`;
    }
    
    return {
        offset: offset,
        name: timezoneName,
        offsetStr: offsetStr
    };
}

// تبدیل زمان UTC به زمان محلی
function convertUTCtoLocal(utcTime, offsetMinutes) {
    const [hours, mins] = utcTime.split(':').map(Number);
    let totalMins = hours * 60 + mins + offsetMinutes;
    
    // نرمالایز به 24 ساعت
    while (totalMins < 0) totalMins += 1440;
    while (totalMins >= 1440) totalMins -= 1440;
    
    const localHours = Math.floor(totalMins / 60);
    const localMins = totalMins % 60;
    
    return `${localHours.toString().padStart(2, '0')}:${localMins.toString().padStart(2, '0')}`;
}

// درخواست مجوز لوکیشن - با suppress کردن خطای Google Maps API
function requestLocationPermission() {
    // این خطا از مرورگر می‌آید و نمی‌توان آن را کاملاً suppress کرد
    // اما می‌توانیم geolocation را optional کنیم
    if ('geolocation' in navigator) {
        try {
            // استفاده از watchPosition به جای getCurrentPosition برای suppress کردن خطا
            const options = { 
                enableHighAccuracy: false, 
                timeout: 5000, // کاهش timeout
                maximumAge: 300000 // 5 دقیقه cache
            };
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log('📍 لوکیشن دریافت شد:', position.coords);
                    // ذخیره لوکیشن برای استفاده بعدی
                    localStorage.setItem('userLocation', JSON.stringify({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        timestamp: Date.now()
                    }));
                },
                (error) => {
                    // خطای Google Maps API را ignore کن
                    if (error.message && (
                        error.message.includes('googleapis') || 
                        error.message.includes('Network location provider') ||
                        error.message.includes('403')
                    )) {
                        // خطای Google Maps API را ignore کن - این خطا از مرورگر می‌آید
                        return;
                    }
                    // فقط خطاهای غیر از permission denied را نمایش بده
                    if (error.code !== 1 && error.code !== error.PERMISSION_DENIED) {
                        console.warn('⚠️ خطا در دریافت لوکیشن:', error.message);
                    }
                },
                options
            );
        } catch (error) {
            // خطای Google Maps API را ignore کن
            if (error.message && (
                error.message.includes('googleapis') || 
                error.message.includes('Network location provider') ||
                error.message.includes('403')
            )) {
                // خطا را ignore کن
                return;
            } else {
                console.warn('⚠️ خطا در geolocation:', error.message);
            }
        }
    }
}

// تنظیم دستی منطقه زمانی
function setManualTimezone(offsetHours, name) {
    const offsetMinutes = offsetHours * 60;
    localStorage.setItem('userTimezone', JSON.stringify({
        offset: offsetMinutes,
        name: name,
        offsetStr: (offsetHours >= 0 ? '+' : '') + offsetHours + ':00',
        manual: true
    }));
    console.log('✅ منطقه زمانی تنظیم شد:', name);
}

// ذخیره تنظیمات ناتیفیکیشن
window.saveMarketNotification = function(marketName, btn) {
    const popup = btn.closest('.market-3d-popup');
    const checkbox = popup.querySelector('input[type="checkbox"]');
    const select = popup.querySelector('.notify-time-select');
    
    // درخواست مجوز نوتیفیکیشن
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
    
    const settings = JSON.parse(localStorage.getItem('marketNotifications') || '{}');
    
    if (checkbox && checkbox.checked) {
        settings[marketName] = {
            enabled: true,
            minutesBefore: parseInt(select?.value || 15)
        };
        localStorage.setItem('marketNotifications', JSON.stringify(settings));
        
        // شروع چک کردن زمان‌ها
        startMarketNotificationChecker();
        
        btn.textContent = '✅ اعلان فعال شد!';
        btn.style.background = 'linear-gradient(135deg, rgba(34, 197, 94, 0.5), rgba(34, 197, 94, 0.3))';
        setTimeout(() => {
            btn.textContent = '💾 ذخیره و فعال‌سازی اعلان';
            btn.style.background = '';
        }, 2000);
    } else {
        // غیرفعال کردن اعلان
        if (settings[marketName]) {
            settings[marketName].enabled = false;
        }
        localStorage.setItem('marketNotifications', JSON.stringify(settings));
        
        btn.textContent = '❌ اعلان غیرفعال شد';
        btn.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(239, 68, 68, 0.2))';
        setTimeout(() => {
            btn.textContent = '💾 ذخیره و فعال‌سازی اعلان';
            btn.style.background = '';
        }, 2000);
    }
};

// چک کننده زمان بازارها برای ارسال نوتیفیکیشن
let notificationCheckerInterval = null;

function startMarketNotificationChecker() {
    if (notificationCheckerInterval) return; // از قبل فعال است
    
    notificationCheckerInterval = setInterval(() => {
        checkMarketNotifications();
    }, 60000); // هر دقیقه چک کن
    
    console.log('🔔 سیستم اعلان بازارها فعال شد');
}

function checkMarketNotifications() {
    const settings = JSON.parse(localStorage.getItem('marketNotifications') || '{}');
    const now = new Date();
    const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
    
    if (typeof marketData === 'undefined') return;
    
    marketData.forEach(market => {
        const marketSetting = settings[market.name];
        if (!marketSetting || !marketSetting.enabled) return;
        
        const [openH, openM] = market.open.split(':').map(Number);
        const openMin = openH * 60 + openM;
        const minutesUntilOpen = openMin - utcMinutes;
        
        // اگر زمان اعلان رسیده
        if (minutesUntilOpen > 0 && minutesUntilOpen <= marketSetting.minutesBefore) {
            // چک کن که قبلاً اعلان نداده باشیم
            const lastNotified = localStorage.getItem(`notified_${market.name}`);
            const today = now.toDateString();
            
            if (lastNotified !== today) {
                sendMarketNotification(market, minutesUntilOpen);
                localStorage.setItem(`notified_${market.name}`, today);
            }
        }
    });
}

function sendMarketNotification(market, minutesUntilOpen) {
    const userTimezone = getUserTimezone();
    const localOpenTime = convertUTCtoLocal(market.open, userTimezone.offset);
    
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`🔔 ${market.name}`, {
            body: `بازار ${minutesUntilOpen} دقیقه دیگر باز می‌شود (ساعت ${localOpenTime} محلی)`,
            icon: '/favicon.ico',
            tag: market.name
        });
    }
    
    console.log(`🔔 اعلان: ${market.name} - ${minutesUntilOpen} دقیقه تا باز شدن`);
}

// توابع مدیریت modal با افکت حرفه‌ای
function openFinancialGlobe() {
    // 🔐 چک لاگین
    if (!checkLoginRequired()) {
        console.log('⚠️ کاربر لاگین نیست - کره مالی باز نشد');
        return;
    }
    
    console.log('📈 ========== باز کردن کره مالی ==========');
    
    const modal = document.getElementById('financialGlobeModal');
    console.log('🔍 Modal element:', modal);
    
    if (!modal) {
        console.error('❌ Modal کره مالی پیدا نشد!');
        alert('Modal پیدا نشد!');
        return;
    }
    
    // چک وضعیت قبل از تغییر
    console.log('📊 Modal classes قبل:', modal.className);
    console.log('📊 Modal style قبل:', window.getComputedStyle(modal).display, window.getComputedStyle(modal).visibility);
    
    // جلوگیری از اسکرول body
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    
    // پنهان کردن همه چیز و اضافه کردن کلاس
    document.body.classList.add('globe-modal-open');
    
    // نمایش modal
    modal.classList.add('active');
    modal.style.display = 'block';
    modal.style.visibility = 'visible';
    modal.style.opacity = '1';
    
    // چک وضعیت بعد از تغییر
    console.log('📊 Modal classes بعد:', modal.className);
    console.log('📊 Modal visible:', modal.offsetWidth > 0 && modal.offsetHeight > 0);
    
    console.log('✅ Modal مالی فعال شد');
    
    // ساخت کره بلافاصله
    console.log('🔄 شروع ساخت کره مالی...');
    
    // یک تاخیر کوتاه برای اطمینان از نمایش modal
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            buildSimpleGlobe('financialGlobeContainer', 'financial');
            
            // راه‌اندازی پنل‌ها و دکمه انتخاب بازار
            populateMarketList();
            setupMarketSelector();
            
            // راه‌اندازی دکمه سیار
            setTimeout(() => {
                const assistive = document.getElementById('financialGlobeAssistive');
                if (assistive && !financialGlobeAssistive) {
                    financialGlobeAssistive = new GlobeAssistiveTouch('financial');
                }
            }, 500);
            
            // بارگذاری مرزها برای کره مالی هم (async)
            setTimeout(async () => {
                if (window.financialGlobeObjects && window.financialGlobeObjects.earth) {
                    const earth = window.financialGlobeObjects.earth;
                    
                    console.log('🗺️ اضافه کردن مرزها به کره مالی...');
                    if (typeof createWorldBorders === 'function') {
                        await createWorldBorders(earth, {
                            defaultColor: 0x3366aa,  // آبی کمتر - برای تمایز از مارکرها
                            defaultOpacity: 0.25     // کمرنگ‌تر
                        });
                    }
                }
            }, 1000);
        });
    });
}

function openResourcesGlobe() {
    // 🔐 چک لاگین
    if (!checkLoginRequired()) {
        console.log('⚠️ کاربر لاگین نیست - کره منابع باز نشد');
        return;
    }
    
    console.log('🌍 ========== باز کردن کره منابع ==========');
    
    const modal = document.getElementById('resourcesGlobeModal');
    console.log('🔍 Modal element:', modal);
    
    if (!modal) {
        console.error('❌ Modal کره منابع پیدا نشد!');
        alert('Modal پیدا نشد!');
        return;
    }
    
    // جلوگیری از اسکرول body
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    
    // پنهان کردن همه چیز و اضافه کردن کلاس
    document.body.classList.add('globe-modal-open');
    
    // نمایش modal
    modal.classList.add('active');
    modal.style.display = 'block';
    modal.style.visibility = 'visible';
    modal.style.opacity = '1';
    
    console.log('✅ Modal منابع فعال شد');
    
    // ساخت کره بلافاصله
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            buildSimpleGlobe('resourcesGlobeContainer', 'resources');
            
            // پر کردن لیست کشورها
            if (typeof populateCountryList === 'function') {
                populateCountryList();
            }
            
            // راه‌اندازی پنل‌ها
            if (typeof setupResourcesGlobePanels === 'function') {
                setupResourcesGlobePanels();
            }
            
            // بارگذاری مرزها و درگیری‌ها و برچسب‌ها (async)
            setTimeout(async () => {
                if (window.resourcesGlobeObjects && window.resourcesGlobeObjects.earth) {
                    const earth = window.resourcesGlobeObjects.earth;
                    const camera = window.resourcesGlobeObjects.camera;
                    
                    // بارگذاری مرزها - اضافه شدن به earth
                    console.log('🗺️ بارگذاری مرزهای کشورها...');
                    if (typeof createWorldBorders === 'function') {
                        resourcesGlobeData.bordersGroup = await createWorldBorders(earth, {
                            defaultColor: 0x4488ff,
                            defaultOpacity: 0.4
                        });
                    }
                    
                    // ایجاد خطوط درگیری
                    console.log('⚔️ ایجاد خطوط درگیری...');
                    if (typeof createAllConflicts === 'function') {
                        resourcesGlobeData.conflictsGroup = createAllConflicts(earth);
                    }
                    
                    // ایجاد برچسب‌های کشورها
                    console.log('🏷️ ایجاد برچسب‌های کشورها...');
                    if (typeof createCountryLabels === 'function') {
                        resourcesGlobeData.labelsGroup = createCountryLabels(earth, camera);
                    }
                }
            }, 1000);
            
            // راه‌اندازی دکمه سیار
            setTimeout(() => {
                const assistive = document.getElementById('resourcesGlobeAssistive');
                if (assistive && !resourcesGlobeAssistive) {
                    resourcesGlobeAssistive = new GlobeAssistiveTouch('resources');
                }
            }, 500);
        });
    });
}

function closeGlobeModal(modalId) {
    console.log('🔒 شروع بستن modal:', modalId);
    
    const modal = document.getElementById(modalId);
    if (!modal) {
        console.warn('Modal پیدا نشد:', modalId);
        return;
    }
    
    // ریست کردن flag باز شدن کره
    globeOpening = false;
    globe3DOpening = false;
    
    // تعیین نوع کره
    let type = 'resources';
    if (modalId.includes('financial')) type = 'financial';
    else if (modalId.includes('weather')) type = 'weather';
    else if (modalId.includes('military')) type = 'military';
    else if (modalId.includes('universities')) type = 'universities';
    else if (modalId.includes('historical')) type = 'historical';
    else if (modalId.includes('earthquake')) type = 'earthquake';
    else if (modalId.includes('naturalResources')) type = 'natural-resources';
    
    // پاک کردن instance دکمه سیار
    if (window[`${type}GlobeAssistive`]) {
        try {
            delete window[`${type}GlobeAssistive`];
        } catch (e) {
            console.warn('خطا در پاک کردن instance دکمه سیار:', e);
        }
    }
    
    // اول modal رو مخفی کن
    modal.classList.remove('active');
    modal.style.display = 'none';
    modal.style.visibility = 'hidden';
    modal.style.opacity = '0';
    
    // بازگرداندن body
    document.body.classList.remove('globe-modal-open');
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.height = '';
    
    // پاکسازی کره با تاخیر کوتاه (برای جلوگیری از هنگ)
    setTimeout(() => {
        if (simpleGlobeScenes[type] && typeof simpleGlobeScenes[type].destroy === 'function') {
            try {
                simpleGlobeScenes[type].destroy();
            } catch (e) {
                console.warn('خطا در destroy کردن کره:', e);
            }
            simpleGlobeScenes[type] = null;
        }
        
        // پاک کردن محتوای container
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
        const containerId = containerIdMap[type] || 'resourcesGlobeContainer';
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '';
        }
        
        console.log('✅ Modal و کره پاکسازی شدند');
    }, 100);
}

// باز کردن کره‌های 3D جدید (آب و هوا، نظامی، دانشگاه، تاریخی)
// جلوگیری از باز شدن همزمان چند کره
let globe3DOpening = false;

function open3DGlobe(type) {
    // جلوگیری از باز شدن همزمان
    if (globe3DOpening) {
        console.log('⏳ کره 3D در حال باز شدن است...');
        return;
    }
    
    // 🔐 چک لاگین
    if (!checkLoginRequired()) {
        console.log('⚠️ کاربر لاگین نیست - کره 3D باز نشد');
        return;
    }
    
    globe3DOpening = true;
    console.log(`🌍 ========== باز کردن کره 3D: ${type} ==========`);
    
    const modalMap = {
        'weather': 'weatherGlobeModal',
        'military': 'militaryGlobeModal',
        'universities': 'universitiesGlobeModal',
        'historical': 'historicalGlobeModal',
        'earthquake': 'earthquakeGlobeModal',
        'natural-resources': 'naturalResourcesGlobeModal'
    };
    
    const containerMap = {
        'weather': 'weatherGlobeContainer',
        'military': 'militaryGlobeContainer',
        'universities': 'universitiesGlobeContainer',
        'historical': 'historicalGlobeContainer',
        'earthquake': 'earthquakeGlobeContainer',
        'natural-resources': 'naturalResourcesGlobeContainer'
    };
    
    const modalId = modalMap[type];
    const containerId = containerMap[type];
    
    if (!modalId || !containerId) {
        console.error('❌ نوع کره نامعتبر:', type);
        globe3DOpening = false;
        return;
    }
    
    const modal = document.getElementById(modalId);
    const container = document.getElementById(containerId);
    
    if (!modal || !container) {
        console.error('❌ Modal یا Container پیدا نشد!');
        globe3DOpening = false;
        return;
    }
    
    // جلوگیری از اسکرول body
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    document.body.classList.add('globe-modal-open');
    
    // نمایش modal
    modal.classList.add('active');
    modal.style.display = 'block';
    modal.style.visibility = 'visible';
    modal.style.opacity = '1';
    
    // ساخت کره 3D
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            // پاک کردن کره قبلی اگر وجود داشت
            if (simpleGlobeScenes[type] && typeof simpleGlobeScenes[type].destroy === 'function') {
                try {
                    simpleGlobeScenes[type].destroy();
                } catch (e) {
                    console.warn('خطا در پاک کردن کره قبلی:', e);
                }
            }
            
            // ساخت کره جدید
            simpleGlobeScenes[type] = buildSimpleGlobe(containerId, type);
            
            // راه‌اندازی دکمه سیار - با تاخیر بیشتر برای اطمینان از لود شدن کره
            setTimeout(() => {
                // تبدیل نام assistive برای کره‌های خاص
                let assistiveId = `${type}GlobeAssistive`;
                if (type === 'natural-resources') {
                    assistiveId = 'naturalResourcesGlobeAssistive';
                }
                const assistive = document.getElementById(assistiveId);
                if (assistive) {
                    // حذف instance قبلی اگر وجود داشت
                    if (window[`${type}GlobeAssistive`]) {
                        try {
                            // پاک کردن event listeners قبلی
                            const oldInstance = window[`${type}GlobeAssistive`];
                            if (oldInstance.touchButton) {
                                const newBtn = oldInstance.touchButton.cloneNode(true);
                                oldInstance.touchButton.parentNode.replaceChild(newBtn, oldInstance.touchButton);
                            }
                        } catch (e) {
                            console.warn('خطا در پاک کردن instance قبلی:', e);
                        }
                    }
                    
                    // تبدیل نام menu برای کره‌های خاص
                    let menuId = `${type}GlobeMenu`;
                    if (type === 'natural-resources') {
                        menuId = 'naturalResourcesGlobeMenu';
                    }
                    window[`${type}GlobeAssistive`] = new GlobeAssistiveTouch(assistiveId, menuId, type);
                    console.log(`✅ دکمه سیار کره ${type} راه‌اندازی شد`);
                } else {
                    console.warn(`⚠️ دکمه سیار کره ${type} پیدا نشد:`, assistiveId);
                }
            }, 800);
            
            // راه‌اندازی فیلترها برای کره‌های جدید
            if (type === 'earthquake') {
                setTimeout(() => {
                    if (typeof setupEarthquakeFilters === 'function') {
                        setupEarthquakeFilters();
                    }
                }, 500);
            } else if (type === 'natural-resources') {
                setTimeout(() => {
                    if (typeof setupNaturalResourcesFilters === 'function') {
                        setupNaturalResourcesFilters();
                    }
                }, 500);
            }
            
            // بارگذاری مرزها برای همه کره‌های جدید - با تاخیر بیشتر و retry
            const loadBorders = async (retryCount = 0) => {
                const maxRetries = 3;
                const scene = simpleGlobeScenes[type];
                
                if (!scene) {
                    if (retryCount < maxRetries) {
                        console.log(`🔄 تلاش مجدد برای بارگذاری مرزها (${retryCount + 1}/${maxRetries})...`);
                        setTimeout(() => loadBorders(retryCount + 1), 1000);
                    } else {
                        console.warn(`⚠️ کره ${type} پیدا نشد بعد از ${maxRetries} تلاش`);
                    }
                    return;
                }
                
                if (!scene.earth) {
                    if (retryCount < maxRetries) {
                        console.log(`🔄 earth پیدا نشد، تلاش مجدد (${retryCount + 1}/${maxRetries})...`);
                        setTimeout(() => loadBorders(retryCount + 1), 1000);
                    } else {
                        console.warn(`⚠️ earth کره ${type} پیدا نشد بعد از ${maxRetries} تلاش`);
                    }
                    return;
                }
                
                const earth = scene.earth;
                console.log(`🗺️ اضافه کردن مرزها به کره ${type}...`);
                
                try {
                    if (typeof createWorldBorders === 'function') {
                        const bordersGroup = await createWorldBorders(earth, {
                            defaultColor: 0x4488ff,
                            defaultOpacity: 0.4
                        });
                        if (bordersGroup) {
                            console.log(`✅ مرزها به کره ${type} اضافه شدند`);
                            // ذخیره bordersGroup در scene برای دسترسی بعدی
                            scene.bordersGroup = bordersGroup;
                        } else {
                            console.warn(`⚠️ مرزها برای کره ${type} لود نشدند`);
                        }
                    } else {
                        console.warn('⚠️ تابع createWorldBorders پیدا نشد');
                    }
                } catch (error) {
                    console.error(`❌ خطا در بارگذاری مرزها برای کره ${type}:`, error);
                    if (retryCount < maxRetries) {
                        console.log(`🔄 تلاش مجدد بعد از خطا (${retryCount + 1}/${maxRetries})...`);
                        setTimeout(() => loadBorders(retryCount + 1), 2000);
                    }
                }
            };
            
            // شروع بارگذاری با تاخیر
            setTimeout(() => loadBorders(), 2000);
            
            // بارگذاری داده‌های مربوطه - با retry برای اطمینان از آماده بودن scene
            const loadDataWithRetry = (retryCount = 0) => {
                const maxRetries = 5;
                const scene = simpleGlobeScenes[type];
                
                if (!scene) {
                    if (retryCount < maxRetries) {
                        console.log(`🔄 تلاش مجدد برای بارگذاری داده‌ها (${retryCount + 1}/${maxRetries})...`);
                        setTimeout(() => loadDataWithRetry(retryCount + 1), 500);
                    } else {
                        console.warn(`⚠️ کره ${type} پیدا نشد بعد از ${maxRetries} تلاش`);
                    }
                    return;
                }
                
                if (!scene.scene) {
                    if (retryCount < maxRetries) {
                        console.log(`🔄 scene پیدا نشد، تلاش مجدد (${retryCount + 1}/${maxRetries})...`);
                        setTimeout(() => loadDataWithRetry(retryCount + 1), 500);
                    } else {
                        console.warn(`⚠️ scene کره ${type} پیدا نشد بعد از ${maxRetries} تلاش`);
                    }
                    return;
                }
                
                if (!scene.earth) {
                    if (retryCount < maxRetries) {
                        console.log(`🔄 earth پیدا نشد، تلاش مجدد (${retryCount + 1}/${maxRetries})...`);
                        setTimeout(() => loadDataWithRetry(retryCount + 1), 500);
                    } else {
                        console.warn(`⚠️ earth کره ${type} پیدا نشد بعد از ${maxRetries} تلاش`);
                    }
                    return;
                }
                
                console.log(`📊 بارگذاری داده‌های کره ${type}...`);
                if (typeof load3DGlobeData === 'function') {
                    try {
                        load3DGlobeData(type, container);
                        console.log(`✅ داده‌های کره ${type} بارگذاری شدند`);
                    } catch (error) {
                        console.error(`❌ خطا در بارگذاری داده‌های کره ${type}:`, error);
                    }
                } else {
                    console.warn('⚠️ تابع load3DGlobeData پیدا نشد');
                }
            };
            
            // شروع بارگذاری با تاخیر
            setTimeout(() => loadDataWithRetry(), 1500);
            
            globe3DOpening = false;
        });
    });
}

// راه‌اندازی فیلترهای کره زلزله
function setupEarthquakeFilters() {
    const yearFilter = document.getElementById('earthquakeYearFilter');
    if (yearFilter) {
        yearFilter.addEventListener('change', (e) => {
            const year = e.target.value;
            filterEarthquakesByYear(year);
        });
    }
    
    document.querySelectorAll('#earthquakeFilterPanel [data-magnitude]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#earthquakeFilterPanel [data-magnitude]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const magnitude = btn.dataset.magnitude;
            filterEarthquakesByMagnitude(magnitude);
        });
    });
    
    // راه‌اندازی انتخاب شهر
    setupEarthquakeCitySelection();
}

// راه‌اندازی انتخاب شهر برای اعلان زلزله
function setupEarthquakeCitySelection() {
    const provinceSelect = document.getElementById('earthquakeProvinceSelect');
    const cityList = document.getElementById('earthquakeCityList');
    
    if (!provinceSelect || !cityList || typeof iranProvinces === 'undefined') return;
    
    // پر کردن لیست استان‌ها
    Object.keys(iranProvinces).forEach(provinceName => {
        const option = document.createElement('option');
        option.value = provinceName;
        option.textContent = iranProvinces[provinceName].name;
        provinceSelect.appendChild(option);
    });
    
    // تغییر استان - نمایش شهرهای آن استان
    provinceSelect.addEventListener('change', (e) => {
        const selectedProvince = e.target.value;
        cityList.innerHTML = '';
        
        if (selectedProvince === 'all') {
            // نمایش همه شهرها
            Object.values(iranProvinces).forEach(province => {
                province.cities.forEach(city => {
                    const cityItem = document.createElement('div');
                    cityItem.className = 'city-item';
                    cityItem.dataset.city = city.name;
                    cityItem.dataset.coords = city.coords.join(',');
                    cityItem.innerHTML = `
                        <span>📍 ${city.name}</span>
                        <span>${province.name}</span>
                    `;
                    cityItem.addEventListener('click', () => {
                        document.querySelectorAll('.city-item').forEach(item => item.classList.remove('selected'));
                        cityItem.classList.add('selected');
                        // ذخیره انتخاب
                        localStorage.setItem('earthquakeSelectedCity', JSON.stringify({
                            name: city.name,
                            province: province.name,
                            coords: city.coords
                        }));
                    });
                    cityList.appendChild(cityItem);
                });
            });
        } else if (iranProvinces[selectedProvince]) {
            // نمایش شهرهای استان انتخاب شده
            iranProvinces[selectedProvince].cities.forEach(city => {
                const cityItem = document.createElement('div');
                cityItem.className = 'city-item';
                cityItem.dataset.city = city.name;
                cityItem.dataset.coords = city.coords.join(',');
                cityItem.innerHTML = `
                    <span>📍 ${city.name}</span>
                    <span>${iranProvinces[selectedProvince].name}</span>
                `;
                cityItem.addEventListener('click', () => {
                    document.querySelectorAll('.city-item').forEach(item => item.classList.remove('selected'));
                    cityItem.classList.add('selected');
                    // ذخیره انتخاب
                    localStorage.setItem('earthquakeSelectedCity', JSON.stringify({
                        name: city.name,
                        province: iranProvinces[selectedProvince].name,
                        coords: city.coords
                    }));
                });
                cityList.appendChild(cityItem);
            });
        }
    });
    
    // بارگذاری انتخاب قبلی
    const savedCity = localStorage.getItem('earthquakeSelectedCity');
    if (savedCity) {
        try {
            const cityData = JSON.parse(savedCity);
            provinceSelect.value = cityData.province;
            provinceSelect.dispatchEvent(new Event('change'));
            setTimeout(() => {
                const cityItem = Array.from(cityList.children).find(item => 
                    item.dataset.city === cityData.name
                );
                if (cityItem) {
                    cityItem.classList.add('selected');
                }
            }, 100);
        } catch (e) {
            console.warn('⚠️ خطا در بارگذاری شهر انتخاب شده:', e);
        }
    }
}

// ذخیره تنظیمات اعلان زلزله
function saveEarthquakeNotificationSettings() {
    const enabled = document.getElementById('earthquakeNotificationEnabled')?.checked || false;
    const minMagnitude = document.getElementById('earthquakeMinMagnitude')?.value || '5';
    const selectedCity = localStorage.getItem('earthquakeSelectedCity');
    
    const settings = {
        enabled,
        minMagnitude: parseFloat(minMagnitude),
        city: selectedCity ? JSON.parse(selectedCity) : null
    };
    
    localStorage.setItem('earthquakeNotificationSettings', JSON.stringify(settings));
    console.log('✅ تنظیمات اعلان زلزله ذخیره شد:', settings);
    
    // نمایش پیام موفقیت
    alert('✅ تنظیمات با موفقیت ذخیره شد!');
}

// بررسی اعلان‌های زلزله (فراخوانی دوره‌ای)
function checkEarthquakeNotifications() {
    const settingsStr = localStorage.getItem('earthquakeNotificationSettings');
    if (!settingsStr) return;
    
    try {
        const settings = JSON.parse(settingsStr);
        if (!settings.enabled || !settings.city) return;
        
        // در آینده: بررسی زلزله‌های جدید از API
        // برای الان فقط یک نمونه
        console.log('🔔 بررسی اعلان‌های زلزله...');
    } catch (e) {
        console.warn('⚠️ خطا در بررسی اعلان‌ها:', e);
    }
}

// در دسترس قرار دادن توابع
window.saveEarthquakeNotificationSettings = saveEarthquakeNotificationSettings;

// فیلتر زلزله‌ها بر اساس سال
function filterEarthquakesByYear(year) {
    const scene = simpleGlobeScenes['earthquake'];
    if (!scene || !scene.scene) return;
    
    scene.scene.traverse((obj) => {
        if (obj.name === 'earthquakes') {
            obj.children.forEach(marker => {
                if (marker.userData && marker.userData.type === 'earthquake') {
                    const eqYear = marker.userData.date ? parseInt(marker.userData.date.split('-')[0]) : null;
                    let visible = true;
                    
                    if (year === 'all') {
                        visible = true;
                    } else if (year === 'before-1980') {
                        visible = eqYear && eqYear < 1980;
                    } else if (year === '1980-1989') {
                        visible = eqYear && eqYear >= 1980 && eqYear < 1990;
                    } else if (year === '1990-1999') {
                        visible = eqYear && eqYear >= 1990 && eqYear < 2000;
                    } else if (year === '2000-2009') {
                        visible = eqYear && eqYear >= 2000 && eqYear < 2010;
                    } else if (year === '2010-2014') {
                        visible = eqYear && eqYear >= 2010 && eqYear < 2015;
                    } else {
                        const filterYear = parseInt(year);
                        visible = eqYear === filterYear;
                    }
                    
                    marker.visible = visible;
                }
            });
        }
    });
}

// فیلتر زلزله‌ها بر اساس بزرگی
function filterEarthquakesByMagnitude(magnitude) {
    const scene = simpleGlobeScenes['earthquake'];
    if (!scene || !scene.scene) return;
    
    scene.scene.traverse((obj) => {
        if (obj.name === 'earthquakes') {
            obj.children.forEach(marker => {
                if (marker.userData && marker.userData.type === 'earthquake') {
                    const mag = marker.userData.magnitude || 0;
                    let visible = true;
                    
                    if (magnitude === 'all') {
                        visible = true;
                    } else if (magnitude === '8+') {
                        visible = mag >= 8.0;
                    } else if (magnitude === '7-8') {
                        visible = mag >= 7.0 && mag < 8.0;
                    } else if (magnitude === '6-7') {
                        visible = mag >= 6.0 && mag < 7.0;
                    } else if (magnitude === '5-6') {
                        visible = mag >= 5.0 && mag < 6.0;
                    }
                    
                    marker.visible = visible;
                }
            });
        }
    });
}

// راه‌اندازی فیلترهای کره منابع طبیعی
function setupNaturalResourcesFilters() {
    document.querySelectorAll('#naturalResourcesFilterPanel [data-resource]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#naturalResourcesFilterPanel [data-resource]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const resource = btn.dataset.resource;
            filterNaturalResources(resource);
        });
    });
}

// فیلتر منابع طبیعی
function filterNaturalResources(resource) {
    const scene = simpleGlobeScenes['natural-resources'];
    if (!scene || !scene.scene) return;
    
    scene.scene.traverse((obj) => {
        if (obj.name === 'naturalResources') {
            obj.children.forEach(item => {
                if (item.userData && item.userData.type) {
                    if (resource === 'all') {
                        item.visible = true;
                    } else {
                        item.visible = item.userData.type === resource;
                    }
                }
            });
        }
    });
}

// بارگذاری داده‌های کره 3D بر اساس نوع
function load3DGlobeData(type, container) {
    const scene = simpleGlobeScenes[type];
    if (!scene || !scene.scene) return;
    
    switch(type) {
        case 'weather':
            loadWeatherData(scene);
            break;
        case 'military':
            loadMilitaryData(scene);
            break;
        case 'universities':
            loadUniversitiesData(scene);
            break;
        case 'historical':
            loadHistoricalData(scene);
            break;
        case 'earthquake':
            loadEarthquakeData(scene);
            break;
        case 'natural-resources':
            loadNaturalResourcesData(scene);
            break;
    }
}

// داده‌های آب و هوای شهرهای مهم
const weatherData = {
    'US': [
        { name: 'نیویورک', coords: [40.7128, -74.0060], temp: 15, condition: 'آفتابی', humidity: 65 },
        { name: 'لس آنجلس', coords: [34.0522, -118.2437], temp: 22, condition: 'آفتابی', humidity: 55 },
        { name: 'شیکاگو', coords: [41.8781, -87.6298], temp: 8, condition: 'ابری', humidity: 70 }
    ],
    'UK': [
        { name: 'لندن', coords: [51.5074, -0.1278], temp: 12, condition: 'بارانی', humidity: 80 }
    ],
    'FR': [
        { name: 'پاریس', coords: [48.8566, 2.3522], temp: 14, condition: 'ابری', humidity: 75 }
    ],
    'DE': [
        { name: 'برلین', coords: [52.5200, 13.4050], temp: 10, condition: 'ابری', humidity: 72 }
    ],
    'JP': [
        { name: 'توکیو', coords: [35.6762, 139.6503], temp: 18, condition: 'آفتابی', humidity: 60 }
    ],
    'CN': [
        { name: 'پکن', coords: [39.9042, 116.4074], temp: 16, condition: 'مه', humidity: 45 }
    ],
    'IR': [
        { name: 'تهران', coords: [35.6892, 51.3890], temp: 20, condition: 'آفتابی', humidity: 40 },
        { name: 'اصفهان', coords: [32.6546, 51.6680], temp: 18, condition: 'آفتابی', humidity: 35 }
    ],
    'RU': [
        { name: 'مسکو', coords: [55.7558, 37.6173], temp: 5, condition: 'برفی', humidity: 85 }
    ],
    'IN': [
        { name: 'دهلی', coords: [28.6139, 77.2090], temp: 28, condition: 'آفتابی', humidity: 55 }
    ],
    'BR': [
        { name: 'سائوپائولو', coords: [-23.5505, -46.6333], temp: 24, condition: 'ابری', humidity: 78 }
    ],
    'AU': [
        { name: 'سیدنی', coords: [-33.8688, 151.2093], temp: 22, condition: 'آفتابی', humidity: 65 }
    ],
    'CA': [
        { name: 'تورنتو', coords: [43.6532, -79.3832], temp: 6, condition: 'ابری', humidity: 70 }
    ],
    'SA': [
        { name: 'ریاض', coords: [24.7136, 46.6753], temp: 32, condition: 'آفتابی', humidity: 25 }
    ],
    'TR': [
        { name: 'استانبول', coords: [41.0082, 28.9784], temp: 16, condition: 'ابری', humidity: 68 }
    ],
    'EG': [
        { name: 'قاهره', coords: [30.0444, 31.2357], temp: 26, condition: 'آفتابی', humidity: 50 }
    ]
};

// بارگذاری داده‌های آب و هوا
function loadWeatherData(scene) {
    console.log('🌤️ بارگذاری داده‌های آب و هوا...');
    
    if (!scene || !scene.scene || !scene.earth) {
        console.warn('⚠️ scene یا earth پیدا نشد در loadWeatherData', {
            hasScene: !!scene,
            hasSceneScene: !!(scene && scene.scene),
            hasEarth: !!(scene && scene.earth)
        });
        return;
    }
    
    if (typeof createNeonMarker === 'undefined') {
        console.error('❌ تابع createNeonMarker پیدا نشد!');
        return;
    }
    
    const weatherGroup = new THREE.Group();
    weatherGroup.name = 'weather';
    
    let markerCount = 0;
    
    try {
        Object.entries(weatherData).forEach(([countryCode, cities]) => {
            cities.forEach(city => {
                if (city.coords && city.coords.length === 2) {
                    try {
                        const [lat, lng] = city.coords;
                        
                        // رنگ بر اساس دما
                        let color = 0x4facfe; // آبی (سرد)
                        if (city.temp > 25) color = 0xff6b6b; // قرمز (گرم)
                        else if (city.temp > 15) color = 0xffd93d; // زرد (معتدل)
                        
                        // ایجاد مارکر آب و هوا - استفاده از type پیش‌فرض اگر weather تعریف نشده
                        let marker;
                        try {
                            marker = createNeonMarker(color, 0.008, 'weather');
                        } catch (e) {
                            console.warn('⚠️ خطا در createNeonMarker با type weather، استفاده از پیش‌فرض:', e);
                            marker = createNeonMarker(color, 0.008, 'customs'); // fallback
                        }
                        
                        if (!marker) {
                            console.warn('⚠️ marker ایجاد نشد برای:', city.name);
                            return;
                        }
                        
                        // تبدیل به مختصات 3D
                        const phi = (90 - lat) * (Math.PI / 180);
                        const theta = (lng + 180) * (Math.PI / 180);
                        const radius = 1.005;
                        
                        const x = -radius * Math.sin(phi) * Math.cos(theta);
                        const y = radius * Math.cos(phi);
                        const z = radius * Math.sin(phi) * Math.sin(theta);
                        
                        marker.position.set(x, y, z);
                        
                        // چرخاندن به سمت بالا
                        const normal = new THREE.Vector3(x, y, z).normalize();
                        marker.lookAt(normal.multiplyScalar(2).add(marker.position));
                        marker.rotateX(Math.PI / 2);
                        
                        // ذخیره اطلاعات
                        marker.userData = {
                            type: 'weather',
                            country: countryCode,
                            name: city.name,
                            temp: city.temp,
                            condition: city.condition,
                            humidity: city.humidity,
                            coords: [lat, lng]
                        };
                        
                        weatherGroup.add(marker);
                        markerCount++;
                    } catch (e) {
                        console.error('❌ خطا در ایجاد marker برای شهر:', city.name, e);
                    }
                }
            });
        });
        
        // اضافه کردن به earth برای چرخش با کره
        if (scene.earth) {
            scene.earth.add(weatherGroup);
        } else {
            scene.scene.add(weatherGroup);
        }
        console.log(`✅ ${markerCount} مارکر آب و هوا اضافه شد`);
    } catch (error) {
        console.error('❌ خطا در loadWeatherData:', error);
    }
}

// بارگذاری داده‌های نظامی
function loadMilitaryData(scene) {
    console.log('⚔️ بارگذاری داده‌های نظامی...');
    
    if (!scene || !scene.scene || !scene.earth) {
        console.warn('⚠️ scene یا earth پیدا نشد در loadMilitaryData');
        return;
    }
    
    try {
        // استفاده از داده‌های conflicts و military موجود
        if (typeof createAllConflicts === 'function') {
            const conflictsGroup = createAllConflicts(scene.earth);
            if (conflictsGroup) {
                // conflictsGroup قبلاً به earth اضافه شده در createAllConflicts
                // فقط اگر نیاز به اضافه کردن به scene باشد
                if (!scene.earth.children.includes(conflictsGroup)) {
                    scene.earth.add(conflictsGroup);
                }
                console.log('✅ درگیری‌های نظامی اضافه شدند');
            }
        } else {
            console.warn('⚠️ تابع createAllConflicts پیدا نشد');
        }
        
        // نمایش قدرت نظامی
        if (typeof showAirForceOnGlobe === 'function') {
            showAirForceOnGlobe();
        }
        if (typeof showGroundForceOnGlobe === 'function') {
            showGroundForceOnGlobe();
        }
        if (typeof showNavyOnGlobe === 'function') {
            showNavyOnGlobe();
        }
    } catch (error) {
        console.error('❌ خطا در loadMilitaryData:', error);
    }
}

// داده‌های دانشگاه‌های مهم جهان
const universitiesData = {
    'US': [
        { name: 'دانشگاه هاروارد', coords: [42.3770, -71.1167], rank: 1, students: 23000, description: 'قدیمی‌ترین دانشگاه آمریکا' },
        { name: 'دانشگاه MIT', coords: [42.3601, -71.0942], rank: 2, students: 11500, description: 'موسسه فناوری ماساچوست' },
        { name: 'دانشگاه استنفورد', coords: [37.4275, -122.1697], rank: 3, students: 17000, description: 'دانشگاه سیلیکون ولی' },
        { name: 'دانشگاه ییل', coords: [41.3163, -72.9223], rank: 4, students: 12000, description: 'دانشگاه آیوی لیگ' }
    ],
    'UK': [
        { name: 'دانشگاه آکسفورد', coords: [51.7548, -1.2544], rank: 1, students: 24000, description: 'قدیمی‌ترین دانشگاه انگلیسی‌زبان' },
        { name: 'دانشگاه کمبریج', coords: [52.2053, 0.1218], rank: 2, students: 23000, description: 'دانشگاه معتبر بریتانیا' }
    ],
    'CN': [
        { name: 'دانشگاه پکن', coords: [39.9896, 116.3168], rank: 1, students: 35000, description: 'بهترین دانشگاه چین' },
        { name: 'دانشگاه چینگ‌هوا', coords: [40.0011, 116.3264], rank: 2, students: 36000, description: 'دانشگاه فنی پکن' }
    ],
    'IR': [
        { name: 'دانشگاه تهران', coords: [35.7036, 51.3515], rank: 1, students: 50000, description: 'بزرگترین دانشگاه ایران' },
        { name: 'دانشگاه شریف', coords: [35.7036, 51.3515], rank: 2, students: 12000, description: 'دانشگاه فنی تهران' },
        { name: 'دانشگاه امیرکبیر', coords: [35.7036, 51.3515], rank: 3, students: 15000, description: 'دانشگاه پلی‌تکنیک' }
    ],
    'DE': [
        { name: 'دانشگاه مونیخ', coords: [48.1500, 11.5800], rank: 1, students: 52000, description: 'بزرگترین دانشگاه آلمان' },
        { name: 'دانشگاه هایدلبرگ', coords: [49.4100, 8.7100], rank: 2, students: 30000, description: 'قدیمی‌ترین دانشگاه آلمان' }
    ],
    'FR': [
        { name: 'دانشگاه سوربن', coords: [48.8496, 2.3440], rank: 1, students: 55000, description: 'دانشگاه معتبر پاریس' }
    ],
    'JP': [
        { name: 'دانشگاه توکیو', coords: [35.7127, 139.7620], rank: 1, students: 28000, description: 'بهترین دانشگاه ژاپن' }
    ],
    'RU': [
        { name: 'دانشگاه دولتی مسکو', coords: [55.7036, 37.5286], rank: 1, students: 47000, description: 'بزرگترین دانشگاه روسیه' }
    ],
    'IN': [
        { name: 'موسسه فناوری هند', coords: [19.1334, 72.9137], rank: 1, students: 10000, description: 'IIT بمبئی' }
    ],
    'CA': [
        { name: 'دانشگاه تورنتو', coords: [43.6532, -79.3832], rank: 1, students: 90000, description: 'بزرگترین دانشگاه کانادا' }
    ],
    'AU': [
        { name: 'دانشگاه ملی استرالیا', coords: [-35.2809, 149.1300], rank: 1, students: 20000, description: 'بهترین دانشگاه استرالیا' }
    ]
};

// داده‌های مکان‌های تاریخی مهم جهان
const historicalSitesData = {
    'EG': [
        { name: 'اهرام جیزه', coords: [29.9792, 31.1342], year: -2580, description: 'یکی از عجایب هفتگانه' },
        { name: 'ابوالهول', coords: [29.9753, 31.1376], year: -2500, description: 'مجسمه اسرارآمیز' }
    ],
    'GR': [
        { name: 'آکروپولیس', coords: [37.9715, 23.7267], year: -447, description: 'معبد آتنا' },
        { name: 'پارتنون', coords: [37.9715, 23.7267], year: -432, description: 'معبد یونان باستان' }
    ],
    'IT': [
        { name: 'کولوسئوم', coords: [41.8902, 12.4922], year: 80, description: 'آمفی‌تئاتر روم' },
        { name: 'برج کج پیزا', coords: [43.7230, 10.3966], year: 1173, description: 'برج معروف' }
    ],
    'CN': [
        { name: 'دیوار چین', coords: [40.4319, 116.5704], year: -700, description: 'دیوار بزرگ چین' },
        { name: 'شهر ممنوعه', coords: [39.9163, 116.3972], year: 1420, description: 'کاخ امپراتوری' }
    ],
    'IN': [
        { name: 'تاج محل', coords: [27.1751, 78.0421], year: 1632, description: 'مقبره عاشقانه' }
    ],
    'IR': [
        { name: 'تخت جمشید', coords: [29.9352, 52.8914], year: -518, description: 'پایتخت هخامنشیان' },
        { name: 'چغازنبیل', coords: [32.0081, 48.5203], year: -1250, description: 'زیگورات ایلامی' },
        { name: 'میدان نقش جهان', coords: [32.6546, 51.6680], year: 1598, description: 'میدان تاریخی اصفهان' }
    ],
    'TR': [
        { name: 'ایاصوفیه', coords: [41.0086, 28.9802], year: 537, description: 'کلیسا و مسجد' }
    ],
    'PE': [
        { name: 'ماچو پیچو', coords: [-13.1631, -72.5450], year: 1450, description: 'شهر اینکا' }
    ],
    'MX': [
        { name: 'چیچن ایتزا', coords: [20.6843, -88.5678], year: 600, description: 'معبد مایا' }
    ],
    'GB': [
        { name: 'استون‌هنج', coords: [51.1789, -1.8262], year: -3000, description: 'سنگ‌چین باستانی' }
    ],
    'FR': [
        { name: 'برج ایفل', coords: [48.8584, 2.2945], year: 1889, description: 'نماد پاریس' },
        { name: 'کلیسای نوتردام', coords: [48.8530, 2.3499], year: 1345, description: 'کلیسای گوتیک' }
    ],
    'US': [
        { name: 'مجسمه آزادی', coords: [40.6892, -74.0445], year: 1886, description: 'نماد آزادی' }
    ],
    'SA': [
        { name: 'کعبه', coords: [21.4225, 39.8262], year: -2000, description: 'قبله مسلمانان' }
    ],
    'JO': [
        { name: 'پترا', coords: [30.3285, 35.4444], year: -312, description: 'شهر صورتی' }
    ],
    'RU': [
        { name: 'کرملین', coords: [55.7520, 37.6173], year: 1156, description: 'قلعه مسکو' }
    ]
};

// بارگذاری داده‌های دانشگاه‌ها
function loadUniversitiesData(scene) {
    console.log('🎓 بارگذاری داده‌های دانشگاه‌ها...');
    
    if (!scene || !scene.scene || !scene.earth) {
        console.warn('⚠️ scene یا earth پیدا نشد در loadUniversitiesData');
        return;
    }
    
    if (typeof createNeonMarker === 'undefined') {
        console.error('❌ تابع createNeonMarker پیدا نشد!');
        return;
    }
    
    const universitiesGroup = new THREE.Group();
    universitiesGroup.name = 'universities';
    
    let markerCount = 0;
    
    try {
        Object.entries(universitiesData).forEach(([countryCode, universities]) => {
            universities.forEach(uni => {
                if (uni.coords && uni.coords.length === 2) {
                    try {
                        const [lat, lng] = uni.coords;
                        
                        // ایجاد مارکر دانشگاه (کتاب)
                        const marker = createNeonMarker(0x4facfe, 0.008, 'university');
                        
                        if (!marker) {
                            console.warn('⚠️ marker ایجاد نشد برای:', uni.name);
                            return;
                        }
                        
                        // تبدیل به مختصات 3D
                        const phi = (90 - lat) * (Math.PI / 180);
                        const theta = (lng + 180) * (Math.PI / 180);
                        const radius = 1.005;
                        
                        const x = -radius * Math.sin(phi) * Math.cos(theta);
                        const y = radius * Math.cos(phi);
                        const z = radius * Math.sin(phi) * Math.sin(theta);
                        
                        marker.position.set(x, y, z);
                        
                        // چرخاندن به سمت بالا
                        const normal = new THREE.Vector3(x, y, z).normalize();
                        marker.lookAt(normal.multiplyScalar(2).add(marker.position));
                        marker.rotateX(Math.PI / 2);
                        
                        // ذخیره اطلاعات
                        marker.userData = {
                            type: 'university',
                            country: countryCode,
                            name: uni.name,
                            rank: uni.rank,
                            students: uni.students,
                            description: uni.description,
                            coords: [lat, lng]
                        };
                        
                        universitiesGroup.add(marker);
                        markerCount++;
                    } catch (e) {
                        console.error('❌ خطا در ایجاد marker برای دانشگاه:', uni.name, e);
                    }
                }
            });
        });
        
        // اضافه کردن به earth برای چرخش با کره
        if (scene.earth) {
            scene.earth.add(universitiesGroup);
        } else {
            scene.scene.add(universitiesGroup);
        }
        console.log(`✅ ${markerCount} مارکر دانشگاه اضافه شد`);
    } catch (error) {
        console.error('❌ خطا در loadUniversitiesData:', error);
    }
}

// بارگذاری داده‌های تاریخی
function loadHistoricalData(scene) {
    console.log('🏛️ بارگذاری داده‌های مکان‌های تاریخی...');
    
    if (!scene || !scene.scene || !scene.earth) {
        console.warn('⚠️ scene یا earth پیدا نشد در loadHistoricalData');
        return;
    }
    
    if (typeof createNeonMarker === 'undefined') {
        console.error('❌ تابع createNeonMarker پیدا نشد!');
        return;
    }
    
    const historicalGroup = new THREE.Group();
    historicalGroup.name = 'historical';
    
    let markerCount = 0;
    
    try {
        Object.entries(historicalSitesData).forEach(([countryCode, sites]) => {
            sites.forEach(site => {
                if (site.coords && site.coords.length === 2) {
                    try {
                        const [lat, lng] = site.coords;
                        
                        // ایجاد مارکر تاریخی (ستون)
                        const marker = createNeonMarker(0xfa709a, 0.01, 'historical');
                        
                        if (!marker) {
                            console.warn('⚠️ marker ایجاد نشد برای:', site.name);
                            return;
                        }
                        
                        // تبدیل به مختصات 3D
                        const phi = (90 - lat) * (Math.PI / 180);
                        const theta = (lng + 180) * (Math.PI / 180);
                        const radius = 1.005;
                        
                        const x = -radius * Math.sin(phi) * Math.cos(theta);
                        const y = radius * Math.cos(phi);
                        const z = radius * Math.sin(phi) * Math.sin(theta);
                        
                        marker.position.set(x, y, z);
                        
                        // چرخاندن به سمت بالا
                        const normal = new THREE.Vector3(x, y, z).normalize();
                        marker.lookAt(normal.multiplyScalar(2).add(marker.position));
                        marker.rotateX(Math.PI / 2);
                        
                        // ذخیره اطلاعات
                        marker.userData = {
                            type: 'historical',
                            country: countryCode,
                            name: site.name,
                            year: site.year,
                            description: site.description,
                            coords: [lat, lng]
                        };
                        
                        historicalGroup.add(marker);
                        markerCount++;
                    } catch (e) {
                        console.error('❌ خطا در ایجاد marker برای مکان تاریخی:', site.name, e);
                    }
                }
            });
        });
        
        // اضافه کردن به earth برای چرخش با کره
        if (scene.earth) {
            scene.earth.add(historicalGroup);
        } else {
            scene.scene.add(historicalGroup);
        }
        console.log(`✅ ${markerCount} مارکر تاریخی اضافه شد`);
    } catch (error) {
        console.error('❌ خطا در loadHistoricalData:', error);
    }
}

// داده‌های زلزله‌های مهم جهان (به‌روز)
const earthquakeData = {
    'JP': [
        { name: 'زلزله توکیو', coords: [35.6762, 139.6503], magnitude: 7.2, date: '2024-01-15', depth: 10, description: 'زلزله بزرگ توکیو' },
        { name: 'زلزله فوکوشیما', coords: [37.4500, 141.0333], magnitude: 9.0, date: '2011-03-11', depth: 30, description: 'زلزله و سونامی 2011' }
    ],
    'US': [
        { name: 'زلزله سانفرانسیسکو', coords: [37.7749, -122.4194], magnitude: 6.9, date: '1989-10-17', depth: 18, description: 'زلزله لوماپریتا' },
        { name: 'زلزله لس آنجلس', coords: [34.0522, -118.2437], magnitude: 6.7, date: '1994-01-17', depth: 18, description: 'زلزله نورثریج' },
        { name: 'زلزله آلاسکا', coords: [61.2181, -149.9003], magnitude: 9.2, date: '1964-03-27', depth: 25, description: 'بزرگترین زلزله آمریکا' }
    ],
    'CN': [
        { name: 'زلزله سیچوان', coords: [30.5728, 104.0668], magnitude: 8.0, date: '2008-05-12', depth: 19, description: 'زلزله بزرگ سیچوان' },
        { name: 'زلزله تانگشان', coords: [39.6333, 118.1833], magnitude: 7.8, date: '1976-07-28', depth: 12, description: 'مرگبارترین زلزله چین' }
    ],
    'IR': [
        { name: 'زلزله بم', coords: [29.1060, 58.3570], magnitude: 6.6, date: '2003-12-26', depth: 10, description: 'زلزله بم' },
        { name: 'زلزله رودبار', coords: [36.8100, 49.4100], magnitude: 7.3, date: '1990-06-20', depth: 18, description: 'زلزله رودبار و منجیل' },
        { name: 'زلزله کرمانشاه', coords: [34.3142, 47.0650], magnitude: 7.3, date: '2017-11-12', depth: 19, description: 'زلزله کرمانشاه' }
    ],
    'TR': [
        { name: 'زلزله ازمیت', coords: [40.7667, 29.9167], magnitude: 7.6, date: '1999-08-17', depth: 17, description: 'زلزله ازمیت' },
        { name: 'زلزله استانبول', coords: [41.0082, 28.9784], magnitude: 7.4, date: '1999-08-17', depth: 15, description: 'زلزله استانبول' }
    ],
    'IT': [
        { name: 'زلزله ل\'آکویلا', coords: [42.3500, 13.4000], magnitude: 6.3, date: '2009-04-06', depth: 8, description: 'زلزله ل\'آکویلا' }
    ],
    'CL': [
        { name: 'زلزله والپارایسو', coords: [-33.0472, -71.6127], magnitude: 8.8, date: '2010-02-27', depth: 35, description: 'بزرگترین زلزله شیلی' }
    ],
    'ID': [
        { name: 'زلزله سوماترا', coords: [3.2950, 95.9826], magnitude: 9.1, date: '2004-12-26', depth: 30, description: 'زلزله و سونامی اقیانوس هند' }
    ],
    'NZ': [
        { name: 'زلزله کریست‌چرچ', coords: [-43.5321, 172.6362], magnitude: 6.3, date: '2011-02-22', depth: 5, description: 'زلزله کریست‌چرچ' }
    ],
    'PK': [
        { name: 'زلزله کشمیر', coords: [34.5000, 73.5000], magnitude: 7.6, date: '2005-10-08', depth: 26, description: 'زلزله کشمیر' }
    ],
    'HT': [
        { name: 'زلزله پورت-او-پرنس', coords: [18.5944, -72.3074], magnitude: 7.0, date: '2010-01-12', depth: 13, description: 'زلزله هائیتی' }
    ],
    'NP': [
        { name: 'زلزله کاتماندو', coords: [27.7172, 85.3240], magnitude: 7.8, date: '2015-04-25', depth: 15, description: 'زلزله نپال' }
    ]
};

// بارگذاری داده‌های زلزله
function loadEarthquakeData(scene) {
    console.log('🌋 بارگذاری داده‌های زلزله...');
    
    if (!scene || !scene.scene || !scene.earth) {
        console.warn('⚠️ scene یا earth پیدا نشد در loadEarthquakeData');
        return;
    }
    
    if (typeof createNeonMarker === 'undefined') {
        console.error('❌ تابع createNeonMarker پیدا نشد!');
        return;
    }
    
    const earthquakeGroup = new THREE.Group();
    earthquakeGroup.name = 'earthquakes';
    
    let markerCount = 0;
    
    try {
        Object.entries(earthquakeData).forEach(([countryCode, earthquakes]) => {
            earthquakes.forEach(eq => {
                if (eq.coords && eq.coords.length === 2) {
                    try {
                        const [lat, lng] = eq.coords;
                        
                        // رنگ بر اساس بزرگی
                        let color = 0x22c55e; // سبز (کوچک)
                        let size = 0.008;
                        if (eq.magnitude >= 8.0) {
                            color = 0xdc2626; // قرمز تیره (خیلی بزرگ)
                            size = 0.015;
                        } else if (eq.magnitude >= 7.0) {
                            color = 0xf59e0b; // نارنجی (بزرگ)
                            size = 0.012;
                        } else if (eq.magnitude >= 6.0) {
                            color = 0xfbbf24; // زرد (متوسط)
                            size = 0.010;
                        }
                        
                        // ایجاد مارکر زلزله (دایره با موج)
                        const marker = createNeonMarker(color, size, 'earthquake');
                        
                        if (!marker) {
                            console.warn('⚠️ marker ایجاد نشد برای:', eq.name);
                            return;
                        }
                        
                        // تبدیل به مختصات 3D
                        const phi = (90 - lat) * (Math.PI / 180);
                        const theta = (lng + 180) * (Math.PI / 180);
                        const radius = 1.005;
                        
                        const x = -radius * Math.sin(phi) * Math.cos(theta);
                        const y = radius * Math.cos(phi);
                        const z = radius * Math.sin(phi) * Math.sin(theta);
                        
                        marker.position.set(x, y, z);
                        
                        // چرخاندن به سمت بالا
                        const normal = new THREE.Vector3(x, y, z).normalize();
                        marker.lookAt(normal.multiplyScalar(2).add(marker.position));
                        marker.rotateX(Math.PI / 2);
                        
                        // ذخیره اطلاعات
                        marker.userData = {
                            type: 'earthquake',
                            country: countryCode,
                            name: eq.name,
                            magnitude: eq.magnitude,
                            date: eq.date,
                            depth: eq.depth,
                            description: eq.description,
                            coords: [lat, lng]
                        };
                        
                        earthquakeGroup.add(marker);
                        markerCount++;
                    } catch (e) {
                        console.error('❌ خطا در ایجاد marker برای زلزله:', eq.name, e);
                    }
                }
            });
        });
        
        // اضافه کردن به earth برای چرخش با کره
        if (scene.earth) {
            scene.earth.add(earthquakeGroup);
        } else {
            scene.scene.add(earthquakeGroup);
        }
        console.log(`✅ ${markerCount} مارکر زلزله اضافه شد`);
        
        // حذف شده: بارگذاری مرزهای استانی و شهری ایران
        // این مرزها ربطی به زلزله ندارند و باید جداگانه اضافه شوند
    } catch (error) {
        console.error('❌ خطا در loadEarthquakeData:', error);
    }
}

// بارگذاری مرزهای استانی و شهری ایران
function loadIranProvincialBorders(scene) {
    console.log('🗺️ بارگذاری مرزهای استانی و شهری ایران...');
    
    if (!scene || !scene.scene || !scene.earth) return;
    if (typeof iranProvinces === 'undefined') {
        console.warn('⚠️ داده‌های استان‌های ایران پیدا نشد');
        return;
    }
    
    const iranBordersGroup = new THREE.Group();
    iranBordersGroup.name = 'iranProvincialBorders';
    
    // ایجاد خطوط مرزی بین استان‌ها (خطوط مستقیم بین مراکز استان‌ها)
    const provinces = Object.values(iranProvinces);
    const iranCenter = [32.4279, 53.6880]; // مرکز تقریبی ایران
    
    // ایجاد خطوط مرزی بین استان‌های مجاور
    provinces.forEach((province, index) => {
        const [lat, lng] = province.center;
        
        // نقطه مرکز استان (کوچک و سبز)
        const provinceCenter = createProvinceBorder(province.center, 0x00ff00, 0.8);
        provinceCenter.userData = {
            type: 'province',
            name: province.name,
            center: province.center
        };
        iranBordersGroup.add(provinceCenter);
        
        // خطوط مرزی بین استان‌های مجاور (خطوط مستقیم)
        provinces.forEach((neighbor, neighborIndex) => {
            if (index !== neighborIndex) {
                const [neighborLat, neighborLng] = neighbor.center;
                
                // محاسبه فاصله بین دو استان
                const distance = Math.sqrt(
                    Math.pow(lat - neighborLat, 2) + Math.pow(lng - neighborLng, 2)
                );
                
                // فقط استان‌های نزدیک (فاصله کمتر از 5 درجه)
                if (distance < 5) {
                    const points = [];
                    const steps = 20;
                    for (let i = 0; i <= steps; i++) {
                        const t = i / steps;
                        const midLat = lat + (neighborLat - lat) * t;
                        const midLng = lng + (neighborLng - lng) * t;
                        
                        const phi = (90 - midLat) * (Math.PI / 180);
                        const theta = (midLng + 180) * (Math.PI / 180);
                        const radius = 1.001;
                        
                        const x = -radius * Math.sin(phi) * Math.cos(theta);
                        const y = radius * Math.cos(phi);
                        const z = radius * Math.sin(phi) * Math.sin(theta);
                        
                        points.push(new THREE.Vector3(x, y, z));
                    }
                    
                    const geometry = new THREE.BufferGeometry().setFromPoints(points);
                    const material = new THREE.LineBasicMaterial({
                        color: 0x00ff00,
                        transparent: true,
                        opacity: 0.4,
                        linewidth: 1
                    });
                    const line = new THREE.Line(geometry, material);
                    line.userData = {
                        type: 'provinceBorder',
                        from: province.name,
                        to: neighbor.name
                    };
                    iranBordersGroup.add(line);
                }
            }
        });
        
        // خطوط شهری (نقاط برای شهرها)
        province.cities.forEach(city => {
            if (city.coords && city.coords.length === 2) {
                const cityMarker = createCityMarker(city.coords, 0x4488ff, 0.6);
                cityMarker.userData = {
                    type: 'city',
                    name: city.name,
                    province: province.name,
                    coords: city.coords,
                    population: city.population
                };
                iranBordersGroup.add(cityMarker);
            }
        });
    });
    
    // اضافه کردن به earth
    scene.earth.add(iranBordersGroup);
    scene.iranBordersGroup = iranBordersGroup;
    
    console.log(`✅ مرزهای ${provinces.length} استان ایران اضافه شدند`);
}

// ایجاد مرز استان (خطوط واقعی مرزی - حذف دایره‌های سفید)
function createProvinceBorder(center, color = 0x00ff00, opacity = 0.6) {
    const [lat, lng] = center;
    const group = new THREE.Group();
    
    // تبدیل به مختصات 3D
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const radius = 1.001;
    
    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    
    // حذف دایره - فقط یک نقطه کوچک برای نشان دادن مرکز استان
    const pointGeometry = new THREE.SphereGeometry(0.003, 8, 8);
    const pointMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: opacity
    });
    const point = new THREE.Mesh(pointGeometry, pointMaterial);
    point.position.set(x, y, z);
    group.add(point);
    
    return group;
}

// ایجاد مارکر شهر
function createCityMarker(coords, color = 0x4488ff, opacity = 0.4) {
    const [lat, lng] = coords;
    
    // تبدیل به مختصات 3D
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const radius = 1.002;
    
    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    
    // نقطه کوچک برای شهر
    const geometry = new THREE.SphereGeometry(0.003, 8, 8);
    const material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: opacity
    });
    const marker = new THREE.Mesh(geometry, material);
    marker.position.set(x, y, z);
    
    return marker;
}

// داده‌های منابع طبیعی (آب، چوب، دام، طیور، حیوانات، جنگل، رودخانه، بیابان)
const naturalResourcesData = {
    // جنگل‌ها
    forests: {
        'BR': [
            { name: 'جنگل آمازون', coords: [-3.4653, -62.2159], area: 5500000, age: 55, type: 'استوایی', description: 'بزرگترین جنگل بارانی جهان' }
        ],
        'RU': [
            { name: 'جنگل تایگا', coords: [60.0, 100.0], area: 12000000, age: 10000, type: 'بورئال', description: 'بزرگترین جنگل جهان' }
        ],
        'CA': [
            { name: 'جنگل بریتیش کلمبیا', coords: [54.0, -125.0], area: 600000, age: 500, type: 'معتدل', description: 'جنگل معتدل کانادا' }
        ],
        'ID': [
            { name: 'جنگل بارانی بورنئو', coords: [-0.7893, 113.9213], area: 400000, age: 130, type: 'استوایی', description: 'جنگل بارانی بورنئو' }
        ],
        'IR': [
            { name: 'جنگل هیرکانی', coords: [36.5, 51.0], area: 20000, age: 40, type: 'معتدل', description: 'جنگل هیرکانی شمال ایران' }
        ],
        'US': [
            { name: 'جنگل ملی یوسمیتی', coords: [37.8651, -119.5383], area: 3000, age: 200, type: 'معتدل', description: 'جنگل ملی یوسمیتی' },
            { name: 'جنگل ملی یلوستون', coords: [44.4280, -110.5885], area: 9000, age: 150, type: 'معتدل', description: 'جنگل ملی یلوستون' }
        ],
        'IN': [
            { name: 'جنگل سونداربانس', coords: [21.9497, 89.1833], area: 10000, age: 4000, type: 'مانگرو', description: 'بزرگترین جنگل مانگرو جهان' }
        ],
        'MY': [
            { name: 'جنگل بارانی مالزی', coords: [4.2105, 101.9758], area: 200000, age: 130, type: 'استوایی', description: 'جنگل بارانی مالزی' }
        ],
        'CD': [
            { name: 'جنگل کنگو', coords: [-0.2280, 15.8277], area: 2000000, age: 60, type: 'استوایی', description: 'دومین جنگل بارانی بزرگ جهان' }
        ],
        'CA': [
            { name: 'جنگل ملی بانف', coords: [51.1784, -115.5708], area: 6641, age: 100, type: 'بورئال', description: 'جنگل ملی بانف' }
        ],
        'NO': [
            { name: 'جنگل نروژ', coords: [60.4720, 8.4689], area: 120000, age: 10000, type: 'بورئال', description: 'جنگل بورئال نروژ' }
        ],
        'SE': [
            { name: 'جنگل سوئد', coords: [59.3293, 18.0686], area: 280000, age: 10000, type: 'بورئال', description: 'جنگل بورئال سوئد' }
        ],
        'FI': [
            { name: 'جنگل فنلاند', coords: [61.9241, 25.7482], area: 230000, age: 10000, type: 'بورئال', description: 'جنگل بورئال فنلاند' }
        ]
    },
    // رودخانه‌ها
    rivers: {
        'EG': [
            { name: 'نیل', start: [0.0, 32.9], end: [31.0, 30.0], length: 6650, description: 'طولانی‌ترین رودخانه جهان' }
        ],
        'BR': [
            { name: 'آمازون', start: [-5.0, -70.0], end: [-0.0, -50.0], length: 6400, description: 'بزرگترین رودخانه جهان' }
        ],
        'CN': [
            { name: 'یانگتسه', start: [33.0, 91.0], end: [31.0, 121.0], length: 6300, description: 'طولانی‌ترین رودخانه چین' }
        ],
        'US': [
            { name: 'میسیسیپی', start: [47.0, -95.0], end: [29.0, -89.0], length: 3734, description: 'رودخانه میسیسیپی' }
        ],
        'IR': [
            { name: 'کارون', start: [32.0, 50.0], end: [30.0, 48.0], length: 950, description: 'طولانی‌ترین رودخانه ایران' },
            { name: 'زاینده‌رود', start: [33.0, 50.0], end: [32.0, 51.0], length: 405, description: 'رودخانه اصفهان' },
            { name: 'سفیدرود', start: [36.0, 49.0], end: [37.0, 49.0], length: 670, description: 'رودخانه سفیدرود' }
        ],
        'RU': [
            { name: 'ولگا', start: [57.0, 32.0], end: [45.0, 47.0], length: 3692, description: 'طولانی‌ترین رودخانه اروپا' },
            { name: 'ینیسئی', start: [52.0, 93.0], end: [69.0, 86.0], length: 3487, description: 'رودخانه سیبری' }
        ],
        'IN': [
            { name: 'گانگس', start: [30.0, 79.0], end: [22.0, 88.0], length: 2525, description: 'رودخانه مقدس هند' },
            { name: 'براهماپوترا', start: [30.0, 91.0], end: [24.0, 90.0], length: 2900, description: 'رودخانه براهماپوترا' }
        ],
        'AR': [
            { name: 'پارانا', start: [-20.0, -52.0], end: [-34.0, -58.0], length: 4880, description: 'رودخانه پارانا' }
        ],
        'AU': [
            { name: 'موری', start: [-36.0, 148.0], end: [-35.0, 139.0], length: 2508, description: 'طولانی‌ترین رودخانه استرالیا' }
        ],
        'AF': [
            { name: 'هیرمند', start: [33.0, 66.0], end: [31.0, 61.0], length: 1150, description: 'رودخانه هیرمند' }
        ],
        'PK': [
            { name: 'سند', start: [35.0, 74.0], end: [24.0, 68.0], length: 3200, description: 'رودخانه سند' }
        ],
        'BD': [
            { name: 'پادما', start: [24.0, 89.0], end: [22.0, 90.0], length: 120, description: 'شاخه‌ای از گانگس' }
        ],
        'TH': [
            { name: 'چائو فرایا', start: [15.0, 100.0], end: [13.0, 100.0], length: 372, description: 'رودخانه اصلی تایلند' }
        ],
        'VN': [
            { name: 'مکونگ', start: [22.0, 103.0], end: [10.0, 106.0], length: 4350, description: 'رودخانه مکونگ' }
        ],
        'MM': [
            { name: 'ایروادی', start: [25.0, 97.0], end: [16.0, 96.0], length: 2170, description: 'رودخانه اصلی میانمار' }
        ],
        'LA': [
            { name: 'مکونگ', start: [20.0, 102.0], end: [14.0, 105.0], length: 800, description: 'بخشی از رودخانه مکونگ' }
        ],
        'KH': [
            { name: 'مکونگ', start: [14.0, 105.0], end: [11.0, 105.0], length: 500, description: 'بخشی از رودخانه مکونگ' }
        ],
        'TR': [
            { name: 'فرات', start: [39.0, 40.0], end: [36.0, 38.0], length: 2800, description: 'رودخانه فرات' },
            { name: 'دجله', start: [38.0, 40.0], end: [33.0, 44.0], length: 1850, description: 'رودخانه دجله' }
        ],
        'IQ': [
            { name: 'فرات', start: [36.0, 38.0], end: [31.0, 47.0], length: 1200, description: 'بخشی از رودخانه فرات' },
            { name: 'دجله', start: [33.0, 44.0], end: [30.0, 48.0], length: 1400, description: 'بخشی از رودخانه دجله' }
        ],
        'SY': [
            { name: 'فرات', start: [36.0, 38.0], end: [35.0, 40.0], length: 600, description: 'بخشی از رودخانه فرات' }
        ],
        'NG': [
            { name: 'نیجر', start: [9.0, 7.0], end: [5.0, 6.0], length: 4180, description: 'رودخانه نیجر' }
        ],
        'EG': [
            { name: 'نیل', start: [0.0, 32.9], end: [31.0, 30.0], length: 6650, description: 'طولانی‌ترین رودخانه جهان' }
        ],
        'SD': [
            { name: 'نیل', start: [4.0, 32.0], end: [15.0, 32.0], length: 1500, description: 'بخشی از رودخانه نیل' }
        ],
        'ET': [
            { name: 'نیل آبی', start: [12.0, 37.0], end: [15.0, 32.0], length: 1450, description: 'شاخه‌ای از نیل' }
        ],
        'UG': [
            { name: 'نیل سفید', start: [0.0, 32.0], end: [4.0, 32.0], length: 3700, description: 'شاخه‌ای از نیل' }
        ],
        'ZA': [
            { name: 'اورنج', start: [-29.0, 29.0], end: [-33.0, 18.0], length: 2200, description: 'رودخانه اورنج' }
        ],
        'ZM': [
            { name: 'زامبزی', start: [-11.0, 24.0], end: [-18.0, 36.0], length: 2574, description: 'رودخانه زامبزی' }
        ],
        'TZ': [
            { name: 'روزیزی', start: [-3.0, 29.0], end: [-8.0, 31.0], length: 300, description: 'رودخانه روزیزی' }
        ]
    },
    // بیابان‌ها
    deserts: {
        'SA': [
            { name: 'ربع الخالی', coords: [20.0, 50.0], area: 650000, temp: 50, description: 'بزرگترین بیابان شنی جهان' }
        ],
        'CN': [
            { name: 'گبی', coords: [42.0, 105.0], area: 1300000, temp: 40, description: 'بیابان گبی' }
        ],
        'AU': [
            { name: 'ویکتوریا', coords: [-29.0, 129.0], area: 348750, temp: 45, description: 'بزرگترین بیابان استرالیا' }
        ],
        'IR': [
            { name: 'دشت لوت', coords: [30.0, 58.0], area: 51800, temp: 70, description: 'گرم‌ترین نقطه زمین' },
            { name: 'کویر مرکزی', coords: [33.0, 54.0], area: 77000, temp: 50, description: 'کویر مرکزی ایران' }
        ],
        'US': [
            { name: 'موهاوی', coords: [35.0, -115.0], area: 124000, temp: 50, description: 'بیابان موهاوی' },
            { name: 'سونورا', coords: [32.0, -112.0], area: 260000, temp: 45, description: 'بیابان سونورا' }
        ],
        'MX': [
            { name: 'چیهواهوا', coords: [28.0, -105.0], area: 362600, temp: 40, description: 'بزرگترین بیابان آمریکای شمالی' }
        ],
        'AR': [
            { name: 'پاتاگونیا', coords: [-40.0, -70.0], area: 673000, temp: 10, description: 'بیابان سرد پاتاگونیا' }
        ],
        'CL': [
            { name: 'آتاکاما', coords: [-24.0, -69.0], area: 105000, temp: 25, description: 'خشک‌ترین بیابان جهان' }
        ],
        'NA': [
            { name: 'صحرای بزرگ آفریقا', coords: [23.0, 10.0], area: 9000000, temp: 50, description: 'بزرگترین بیابان گرم جهان' }
        ],
        'MN': [
            { name: 'گبی', coords: [42.0, 105.0], area: 1300000, temp: 40, description: 'بیابان گبی' }
        ],
        'KZ': [
            { name: 'قره‌قوم', coords: [40.0, 60.0], area: 350000, temp: 45, description: 'بیابان قره‌قوم' }
        ],
        'UZ': [
            { name: 'قیزیل‌قوم', coords: [42.0, 64.0], area: 300000, temp: 45, description: 'بیابان قیزیل‌قوم' }
        ],
        'IN': [
            { name: 'تار', coords: [27.0, 71.0], area: 200000, temp: 50, description: 'بیابان تار' }
        ],
        'PK': [
            { name: 'چولستان', coords: [29.0, 72.0], area: 26000, temp: 50, description: 'بیابان چولستان' }
        ],
        'AF': [
            { name: 'دشت مارگو', coords: [31.0, 64.0], area: 150000, temp: 45, description: 'بیابان دشت مارگو' }
        ],
        'OM': [
            { name: 'ربع الخالی', coords: [20.0, 55.0], area: 650000, temp: 50, description: 'بخشی از ربع الخالی' }
        ],
        'AE': [
            { name: 'ربع الخالی', coords: [23.0, 55.0], area: 650000, temp: 50, description: 'بخشی از ربع الخالی' }
        ],
        'YE': [
            { name: 'ربع الخالی', coords: [18.0, 50.0], area: 650000, temp: 50, description: 'بخشی از ربع الخالی' }
        ],
        'JO': [
            { name: 'وادی روم', coords: [29.5, 35.4], area: 720, temp: 40, description: 'بیابان وادی روم' }
        ],
        'IL': [
            { name: 'نگب', coords: [30.5, 34.8], area: 12000, temp: 40, description: 'بیابان نگب' }
        ],
        'EG': [
            { name: 'صحرای شرقی', coords: [26.0, 33.0], area: 223000, temp: 45, description: 'صحرای شرقی مصر' },
            { name: 'صحرای غربی', coords: [25.0, 27.0], area: 680000, temp: 45, description: 'صحرای غربی مصر' }
        ],
        'LY': [
            { name: 'صحرای لیبی', coords: [25.0, 18.0], area: 1100000, temp: 50, description: 'بخشی از صحرای بزرگ آفریقا' }
        ],
        'DZ': [
            { name: 'صحرای الجزایر', coords: [26.0, 3.0], area: 900000, temp: 50, description: 'بخشی از صحرای بزرگ آفریقا' }
        ],
        'MA': [
            { name: 'صحرای مراکش', coords: [25.0, -5.0], area: 252000, temp: 50, description: 'بخشی از صحرای بزرگ آفریقا' }
        ],
        'TD': [
            { name: 'صحرای چاد', coords: [17.0, 19.0], area: 1200000, temp: 50, description: 'بخشی از صحرای بزرگ آفریقا' }
        ],
        'NE': [
            { name: 'صحرای نیجر', coords: [17.0, 8.0], area: 1200000, temp: 50, description: 'بخشی از صحرای بزرگ آفریقا' }
        ],
        'ML': [
            { name: 'صحرای مالی', coords: [20.0, -3.0], area: 1200000, temp: 50, description: 'بخشی از صحرای بزرگ آفریقا' }
        ],
        'MR': [
            { name: 'صحرای موریتانی', coords: [20.0, -10.0], area: 1030000, temp: 50, description: 'بخشی از صحرای بزرگ آفریقا' }
        ],
        'BW': [
            { name: 'کالاهاری', coords: [-23.0, 21.0], area: 900000, temp: 40, description: 'بیابان کالاهاری' }
        ],
        'ZA': [
            { name: 'نامیب', coords: [-24.0, 15.0], area: 81000, temp: 35, description: 'بیابان نامیب' }
        ],
        'AU': [
            { name: 'ویکتوریا', coords: [-29.0, 129.0], area: 348750, temp: 45, description: 'بزرگترین بیابان استرالیا' },
            { name: 'گریت سندی', coords: [-20.0, 125.0], area: 284993, temp: 45, description: 'بیابان گریت سندی' },
            { name: 'سیمپسون', coords: [-25.0, 137.0], area: 176500, temp: 45, description: 'بیابان سیمپسون' },
            { name: 'گریت ویکتوریا', coords: [-29.0, 129.0], area: 348750, temp: 45, description: 'بیابان گریت ویکتوریا' }
        ]
    },
    // منابع آب زیرزمینی
    groundwater: {
        'US': [
            { name: 'آبخوان اوگالالا', coords: [39.0, -100.0], volume: 3000, depth: 30, description: 'بزرگترین آبخوان آمریکا' }
        ],
        'AU': [
            { name: 'آبخوان بزرگ آرتزین', coords: [-25.0, 140.0], volume: 65000, depth: 2000, description: 'بزرگترین آبخوان جهان' }
        ],
        'IR': [
            { name: 'آبخوان تهران', coords: [35.7, 51.4], volume: 500, depth: 100, description: 'آبخوان تهران' }
        ]
    },
    // دام و طیور
    livestock: {
        'CN': [
            { name: 'گاو', count: 100000000, coords: [35.0, 105.0], description: 'بزرگترین گله گاو جهان' },
            { name: 'خوک', count: 450000000, coords: [35.0, 105.0], description: 'بزرگترین گله خوک جهان' }
        ],
        'IN': [
            { name: 'گاو', count: 300000000, coords: [20.0, 77.0], description: 'گله بزرگ گاو هند' },
            { name: 'بز', count: 150000000, coords: [20.0, 77.0], description: 'گله بزرگ بز' }
        ],
        'BR': [
            { name: 'گاو', count: 215000000, coords: [-15.0, -47.0], description: 'گله بزرگ گاو برزیل' }
        ],
        'IR': [
            { name: 'گوسفند', count: 50000000, coords: [35.0, 51.0], description: 'گله گوسفند ایران' },
            { name: 'بز', count: 25000000, coords: [35.0, 51.0], description: 'گله بز ایران' }
        ]
    },
    // حیوانات وحشی
    wildlife: {
        'KE': [
            { name: 'شیر', count: 25000, coords: [-1.0, 36.0], description: 'جمعیت شیر کنیا' },
            { name: 'فیل', count: 35000, coords: [-1.0, 36.0], description: 'جمعیت فیل کنیا' }
        ],
        'ZA': [
            { name: 'کرگدن', count: 20000, coords: [-25.0, 28.0], description: 'جمعیت کرگدن آفریقای جنوبی' }
        ],
        'IN': [
            { name: 'ببر', count: 3000, coords: [20.0, 77.0], description: 'جمعیت ببر هند' },
            { name: 'فیل', count: 27000, coords: [20.0, 77.0], description: 'جمعیت فیل هند' }
        ],
        'RU': [
            { name: 'خرس قهوه‌ای', count: 120000, coords: [55.0, 37.0], description: 'جمعیت خرس روسیه' }
        ],
        'CN': [
            { name: 'پاندا', count: 1800, coords: [30.0, 105.0], description: 'جمعیت پاندا چین' }
        ]
    },
    // حیوانات دریایی
    marineLife: {
        'AU': [
            { name: 'کوسه سفید', count: 5000, coords: [-25.0, 153.0], description: 'کوسه سفید استرالیا' },
            { name: 'وال', count: 30000, coords: [-25.0, 153.0], description: 'وال استرالیا' }
        ],
        'US': [
            { name: 'فک', count: 150000, coords: [37.0, -122.0], description: 'فک کالیفرنیا' }
        ],
        'IS': [
            { name: 'وال', count: 20000, coords: [64.0, -21.0], description: 'وال ایسلند' }
        ],
        'JP': [
            { name: 'وال', count: 25000, coords: [35.0, 139.0], description: 'وال ژاپن' }
        ]
    }
};

// بارگذاری داده‌های منابع طبیعی
function loadNaturalResourcesData(scene) {
    console.log('🌿 بارگذاری داده‌های منابع طبیعی...');
    
    if (!scene || !scene.scene || !scene.earth) {
        console.warn('⚠️ scene یا earth پیدا نشد در loadNaturalResourcesData');
        return;
    }
    
    if (typeof createNeonMarker === 'undefined') {
        console.error('❌ تابع createNeonMarker پیدا نشد!');
        return;
    }
    
    const resourcesGroup = new THREE.Group();
    resourcesGroup.name = 'naturalResources';
    
    let markerCount = 0;
    
    try {
        // جنگل‌ها
        Object.entries(naturalResourcesData.forests).forEach(([countryCode, forests]) => {
            forests.forEach(forest => {
                if (forest.coords && forest.coords.length === 2) {
                    try {
                        const [lat, lng] = forest.coords;
                        const marker = createNeonMarker(0x22c55e, 0.012, 'forest');
                        
                        if (!marker) {
                            console.warn('⚠️ marker ایجاد نشد برای جنگل:', forest.name);
                            return;
                        }
                        
                        const phi = (90 - lat) * (Math.PI / 180);
                        const theta = (lng + 180) * (Math.PI / 180);
                        const radius = 1.005;
                        
                        const x = -radius * Math.sin(phi) * Math.cos(theta);
                        const y = radius * Math.cos(phi);
                        const z = radius * Math.sin(phi) * Math.sin(theta);
                        
                        marker.position.set(x, y, z);
                        const normal = new THREE.Vector3(x, y, z).normalize();
                        marker.lookAt(normal.multiplyScalar(2).add(marker.position));
                        marker.rotateX(Math.PI / 2);
                        
                        marker.userData = {
                            type: 'forest',
                            country: countryCode,
                            name: forest.name,
                            area: forest.area,
                            age: forest.age,
                            forestType: forest.type,
                            description: forest.description,
                            coords: [lat, lng]
                        };
                        
                        resourcesGroup.add(marker);
                        markerCount++;
                    } catch (e) {
                        console.error('❌ خطا در ایجاد marker برای جنگل:', forest.name, e);
                    }
                }
            });
        });
    
    // رودخانه‌ها - خطوط آبی
    Object.entries(naturalResourcesData.rivers).forEach(([countryCode, rivers]) => {
        rivers.forEach(river => {
            if (river.start && river.end) {
                const [startLat, startLng] = river.start;
                const [endLat, endLng] = river.end;
                
                // ایجاد خط رودخانه
                const points = [];
                const steps = 50;
                for (let i = 0; i <= steps; i++) {
                    const t = i / steps;
                    const lat = startLat + (endLat - startLat) * t;
                    const lng = startLng + (endLng - startLng) * t;
                    
                    const phi = (90 - lat) * (Math.PI / 180);
                    const theta = (lng + 180) * (Math.PI / 180);
                    const radius = 1.002;
                    
                    const x = -radius * Math.sin(phi) * Math.cos(theta);
                    const y = radius * Math.cos(phi);
                    const z = radius * Math.sin(phi) * Math.sin(theta);
                    
                    points.push(new THREE.Vector3(x, y, z));
                }
                
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const material = new THREE.LineBasicMaterial({
                    color: 0x3b82f6,
                    linewidth: 2,
                    transparent: true,
                    opacity: 0.8
                });
                const line = new THREE.Line(geometry, material);
                line.userData = {
                    type: 'river',
                    country: countryCode,
                    name: river.name,
                    length: river.length,
                    description: river.description
                };
                resourcesGroup.add(line);
            }
        });
    });
    
        // بیابان‌ها
        Object.entries(naturalResourcesData.deserts).forEach(([countryCode, deserts]) => {
            deserts.forEach(desert => {
                if (desert.coords && desert.coords.length === 2) {
                    try {
                        const [lat, lng] = desert.coords;
                        const marker = createNeonMarker(0xf59e0b, 0.010, 'desert');
                        
                        if (!marker) {
                            console.warn('⚠️ marker ایجاد نشد برای بیابان:', desert.name);
                            return;
                        }
                        
                        const phi = (90 - lat) * (Math.PI / 180);
                        const theta = (lng + 180) * (Math.PI / 180);
                        const radius = 1.005;
                        
                        const x = -radius * Math.sin(phi) * Math.cos(theta);
                        const y = radius * Math.cos(phi);
                        const z = radius * Math.sin(phi) * Math.sin(theta);
                        
                        marker.position.set(x, y, z);
                        const normal = new THREE.Vector3(x, y, z).normalize();
                        marker.lookAt(normal.multiplyScalar(2).add(marker.position));
                        marker.rotateX(Math.PI / 2);
                        
                        marker.userData = {
                            type: 'desert',
                            country: countryCode,
                            name: desert.name,
                            area: desert.area,
                            temperature: desert.temp,
                            description: desert.description,
                            coords: [lat, lng]
                        };
                        
                        resourcesGroup.add(marker);
                        markerCount++;
                    } catch (e) {
                        console.error('❌ خطا در ایجاد marker برای بیابان:', desert.name, e);
                    }
                }
            });
        });
        
        // منابع آب زیرزمینی
        Object.entries(naturalResourcesData.groundwater).forEach(([countryCode, aquifers]) => {
            aquifers.forEach(aquifer => {
                if (aquifer.coords && aquifer.coords.length === 2) {
                    try {
                        const [lat, lng] = aquifer.coords;
                        const marker = createNeonMarker(0x0ea5e9, 0.009, 'groundwater');
                        
                        if (!marker) {
                            console.warn('⚠️ marker ایجاد نشد برای آب زیرزمینی:', aquifer.name);
                            return;
                        }
                        
                        const phi = (90 - lat) * (Math.PI / 180);
                        const theta = (lng + 180) * (Math.PI / 180);
                        const radius = 1.005;
                        
                        const x = -radius * Math.sin(phi) * Math.cos(theta);
                        const y = radius * Math.cos(phi);
                        const z = radius * Math.sin(phi) * Math.sin(theta);
                        
                        marker.position.set(x, y, z);
                        const normal = new THREE.Vector3(x, y, z).normalize();
                        marker.lookAt(normal.multiplyScalar(2).add(marker.position));
                        marker.rotateX(Math.PI / 2);
                        
                        marker.userData = {
                            type: 'groundwater',
                            country: countryCode,
                            name: aquifer.name,
                            volume: aquifer.volume,
                            depth: aquifer.depth,
                            description: aquifer.description,
                            coords: [lat, lng]
                        };
                        
                        resourcesGroup.add(marker);
                        markerCount++;
                    } catch (e) {
                        console.error('❌ خطا در ایجاد marker برای آب زیرزمینی:', aquifer.name, e);
                    }
                }
            });
        });
        
        // دام و طیور
        Object.entries(naturalResourcesData.livestock).forEach(([countryCode, animals]) => {
            animals.forEach(animal => {
                if (animal.coords && animal.coords.length === 2) {
                    try {
                        const [lat, lng] = animal.coords;
                        const marker = createNeonMarker(0x8b5cf6, 0.008, 'livestock');
                        
                        if (!marker) {
                            console.warn('⚠️ marker ایجاد نشد برای دام:', animal.name);
                            return;
                        }
                        
                        const phi = (90 - lat) * (Math.PI / 180);
                        const theta = (lng + 180) * (Math.PI / 180);
                        const radius = 1.005;
                        
                        const x = -radius * Math.sin(phi) * Math.cos(theta);
                        const y = radius * Math.cos(phi);
                        const z = radius * Math.sin(phi) * Math.sin(theta);
                        
                        marker.position.set(x, y, z);
                        const normal = new THREE.Vector3(x, y, z).normalize();
                        marker.lookAt(normal.multiplyScalar(2).add(marker.position));
                        marker.rotateX(Math.PI / 2);
                        
                        marker.userData = {
                            type: 'livestock',
                            country: countryCode,
                            name: animal.name,
                            count: animal.count,
                            description: animal.description,
                            coords: [lat, lng]
                        };
                        
                        resourcesGroup.add(marker);
                        markerCount++;
                    } catch (e) {
                        console.error('❌ خطا در ایجاد marker برای دام:', animal.name, e);
                    }
                }
            });
        });
        
        // حیوانات وحشی
        Object.entries(naturalResourcesData.wildlife).forEach(([countryCode, animals]) => {
            animals.forEach(animal => {
                if (animal.coords && animal.coords.length === 2) {
                    try {
                        const [lat, lng] = animal.coords;
                        const marker = createNeonMarker(0xec4899, 0.008, 'wildlife');
                        
                        if (!marker) {
                            console.warn('⚠️ marker ایجاد نشد برای حیوان وحشی:', animal.name);
                            return;
                        }
                        
                        const phi = (90 - lat) * (Math.PI / 180);
                        const theta = (lng + 180) * (Math.PI / 180);
                        const radius = 1.005;
                        
                        const x = -radius * Math.sin(phi) * Math.cos(theta);
                        const y = radius * Math.cos(phi);
                        const z = radius * Math.sin(phi) * Math.sin(theta);
                        
                        marker.position.set(x, y, z);
                        const normal = new THREE.Vector3(x, y, z).normalize();
                        marker.lookAt(normal.multiplyScalar(2).add(marker.position));
                        marker.rotateX(Math.PI / 2);
                        
                        marker.userData = {
                            type: 'wildlife',
                            country: countryCode,
                            name: animal.name,
                            count: animal.count,
                            description: animal.description,
                            coords: [lat, lng]
                        };
                        
                        resourcesGroup.add(marker);
                        markerCount++;
                    } catch (e) {
                        console.error('❌ خطا در ایجاد marker برای حیوان وحشی:', animal.name, e);
                    }
                }
            });
        });
        
        // حیوانات دریایی
        Object.entries(naturalResourcesData.marineLife).forEach(([countryCode, animals]) => {
            animals.forEach(animal => {
                if (animal.coords && animal.coords.length === 2) {
                    try {
                        const [lat, lng] = animal.coords;
                        const marker = createNeonMarker(0x06b6d4, 0.008, 'marine');
                        
                        if (!marker) {
                            console.warn('⚠️ marker ایجاد نشد برای حیوان دریایی:', animal.name);
                            return;
                        }
                        
                        const phi = (90 - lat) * (Math.PI / 180);
                        const theta = (lng + 180) * (Math.PI / 180);
                        const radius = 1.005;
                        
                        const x = -radius * Math.sin(phi) * Math.cos(theta);
                        const y = radius * Math.cos(phi);
                        const z = radius * Math.sin(phi) * Math.sin(theta);
                        
                        marker.position.set(x, y, z);
                        const normal = new THREE.Vector3(x, y, z).normalize();
                        marker.lookAt(normal.multiplyScalar(2).add(marker.position));
                        marker.rotateX(Math.PI / 2);
                        
                        marker.userData = {
                            type: 'marine',
                            country: countryCode,
                            name: animal.name,
                            count: animal.count,
                            description: animal.description,
                            coords: [lat, lng]
                        };
                        
                        resourcesGroup.add(marker);
                        markerCount++;
                    } catch (e) {
                        console.error('❌ خطا در ایجاد marker برای حیوان دریایی:', animal.name, e);
                    }
                }
            });
        });
    
        // اضافه کردن به earth برای چرخش با کره
        if (scene.earth) {
            scene.earth.add(resourcesGroup);
        } else {
            scene.scene.add(resourcesGroup);
        }
        console.log(`✅ ${markerCount} مارکر منابع طبیعی اضافه شد`);
    } catch (error) {
        console.error('❌ خطا در loadNaturalResourcesData:', error);
    }
}

// در دسترس قرار دادن توابع در scope global
window.openFinancialGlobe = openFinancialGlobe;
window.openResourcesGlobe = openResourcesGlobe;
window.open3DGlobe = open3DGlobe;
window.closeGlobeModal = closeGlobeModal;
window.resetGlobeView = resetGlobeView;

// ==================== //
// 🌍 کره منابع - اطلاعات کشورها
// ==================== //

// متغیرهای سراسری برای کره منابع
let resourcesGlobeData = {
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
};

// ایجاد گروه جنگ‌ها و درگیری‌ها با تانک
function createAllConflicts(earth) {
    const conflictsGroup = new THREE.Group();
    conflictsGroup.name = 'conflicts';
    
    if (!countriesData) return conflictsGroup;
    
    // بررسی همه کشورها برای جنگ‌ها
    Object.entries(countriesData).forEach(([countryCode, countryData]) => {
        if (countryData.conflicts && Array.isArray(countryData.conflicts) && countryData.conflicts.length > 0) {
            countryData.conflicts.forEach(conflict => {
                // استفاده از مختصات جنگ یا پایتخت کشور مقابل
                let coords = conflict.coords;
                if (!coords && conflict.opponent && countriesData[conflict.opponent]) {
                    const opponentData = countriesData[conflict.opponent];
                    if (opponentData.capital && opponentData.capital.coords) {
                        coords = opponentData.capital.coords;
                    }
                }
                
                if (coords && coords.length === 2) {
                    const [lat, lng] = coords;
                    
                    // ایجاد تانک برای نمایش جنگ
                    const tank = createTankMarker(0xdc2626, 0.012); // قرمز تیره
                    
                    // تبدیل به مختصات 3D
                    const phi = (90 - lat) * (Math.PI / 180);
                    const theta = (lng + 180) * (Math.PI / 180);
                    const radius = 1.006;
                    
                    const x = -radius * Math.sin(phi) * Math.cos(theta);
                    const y = radius * Math.cos(phi);
                    const z = radius * Math.sin(phi) * Math.sin(theta);
                    
                    tank.position.set(x, y, z);
                    
                    // چرخاندن تانک به سمت بالا
                    const normal = new THREE.Vector3(x, y, z).normalize();
                    tank.lookAt(normal.multiplyScalar(2).add(tank.position));
                    tank.rotateX(Math.PI / 2);
                    
                    // ذخیره اطلاعات
                    tank.userData = {
                        type: 'conflict',
                        country: countryCode,
                        countryName: countryData.name,
                        opponent: conflict.opponent,
                        opponentName: countriesData[conflict.opponent]?.name || conflict.opponent,
                        intensity: conflict.intensity || 'conflict',
                        since: conflict.since || 'unknown',
                        description: conflict.description || 'درگیری',
                        coords: [lat, lng]
                    };
                    
                    conflictsGroup.add(tank);
                }
            });
        }
    });
    
    if (earth && earth.scene) {
        earth.scene.add(conflictsGroup);
    }
    
    return conflictsGroup;
}

// نمایش قدرت نظامی - نیروی هوایی
function showAirForceOnGlobe() {
    if (!window.resourcesGlobeObjects || !window.resourcesGlobeObjects.earth) return;
    
    if (!militaryMarkersGroup) {
        militaryMarkersGroup = new THREE.Group();
        militaryMarkersGroup.name = 'militaryMarkers';
        window.resourcesGlobeObjects.earth.scene.add(militaryMarkersGroup);
    }
    
    Object.entries(countriesData).forEach(([code, data]) => {
        if (data.military && data.military.airForce) {
            const airForce = data.military.airForce;
            const capital = data.capital;
            
            if (capital && capital.coords) {
                const [lat, lng] = capital.coords;
                
                // ایجاد هواپیمای جنگی
                const aircraft = createAircraftMarker(0xef4444, 0.01);
                
                // تبدیل به مختصات 3D
                const phi = (90 - lat) * (Math.PI / 180);
                const theta = (lng + 180) * (Math.PI / 180);
                const radius = 1.005;
                
                const x = -radius * Math.sin(phi) * Math.cos(theta);
                const y = radius * Math.cos(phi);
                const z = radius * Math.sin(phi) * Math.sin(theta);
                
                aircraft.position.set(x, y, z);
                
                // چرخاندن به سمت بالا
                const normal = new THREE.Vector3(x, y, z).normalize();
                aircraft.lookAt(normal.multiplyScalar(2).add(aircraft.position));
                aircraft.rotateX(Math.PI / 2);
                
                // ذخیره اطلاعات
                aircraft.userData = {
                    type: 'military-air',
                    country: code,
                    countryName: data.name,
                    rank: airForce.rank,
                    aircraft: airForce.aircraft,
                    description: airForce.description
                };
                
                militaryMarkersGroup.add(aircraft);
            }
        }
    });
}

// نمایش قدرت نظامی - نیروی زمینی (تانک و سرباز)
function showGroundForceOnGlobe() {
    if (!window.resourcesGlobeObjects || !window.resourcesGlobeObjects.earth) return;
    
    if (!militaryMarkersGroup) {
        militaryMarkersGroup = new THREE.Group();
        militaryMarkersGroup.name = 'militaryMarkers';
        window.resourcesGlobeObjects.earth.scene.add(militaryMarkersGroup);
    }
    
    Object.entries(countriesData).forEach(([code, data]) => {
        if (data.military && data.military.groundForce) {
            const groundForce = data.military.groundForce;
            const capital = data.capital;
            
            if (capital && capital.coords) {
                const [lat, lng] = capital.coords;
                
                // ایجاد تانک
                const tank = createTankMarker(0x64748b, 0.012);
                
                // تبدیل به مختصات 3D
                const phi = (90 - lat) * (Math.PI / 180);
                const theta = (lng + 180) * (Math.PI / 180);
                const radius = 1.005;
                
                const x = -radius * Math.sin(phi) * Math.cos(theta);
                const y = radius * Math.cos(phi);
                const z = radius * Math.sin(phi) * Math.sin(theta);
                
                tank.position.set(x, y, z);
                
                // چرخاندن به سمت بالا
                const normal = new THREE.Vector3(x, y, z).normalize();
                tank.lookAt(normal.multiplyScalar(2).add(tank.position));
                tank.rotateX(Math.PI / 2);
                
                // ذخیره اطلاعات
                tank.userData = {
                    type: 'military-ground',
                    country: code,
                    countryName: data.name,
                    rank: groundForce.rank,
                    tanks: groundForce.tanks,
                    soldiers: groundForce.soldiers,
                    description: groundForce.description
                };
                
                militaryMarkersGroup.add(tank);
                
                // اضافه کردن سربازان (چند ردیف کوچک)
                const soldierCount = Math.min(5, Math.floor(groundForce.soldiers / 100000));
                for (let i = 0; i < soldierCount; i++) {
                    const offset = (i - soldierCount / 2) * 0.02;
                    const soldier = createSoldierMarker(0x64748b, 0.005);
                    
                    const offsetPhi = (90 - (lat + offset)) * (Math.PI / 180);
                    const offsetTheta = ((lng + offset) + 180) * (Math.PI / 180);
                    
                    const sx = -radius * Math.sin(offsetPhi) * Math.cos(offsetTheta);
                    const sy = radius * Math.cos(offsetPhi);
                    const sz = radius * Math.sin(offsetPhi) * Math.sin(offsetTheta);
                    
                    soldier.position.set(sx, sy, sz);
                    
                    const sNormal = new THREE.Vector3(sx, sy, sz).normalize();
                    soldier.lookAt(sNormal.multiplyScalar(2).add(soldier.position));
                    soldier.rotateX(Math.PI / 2);
                    
                    soldier.userData = {
                        type: 'soldier',
                        country: code,
                        countryName: data.name
                    };
                    
                    militaryMarkersGroup.add(soldier);
                }
            }
        }
    });
}

// نمایش قدرت نظامی - نیروی دریایی
function showNavyOnGlobe() {
    if (!window.resourcesGlobeObjects || !window.resourcesGlobeObjects.earth) return;
    
    if (!militaryMarkersGroup) {
        militaryMarkersGroup = new THREE.Group();
        militaryMarkersGroup.name = 'militaryMarkers';
        window.resourcesGlobeObjects.earth.scene.add(militaryMarkersGroup);
    }
    
    Object.entries(countriesData).forEach(([code, data]) => {
        if (data.military && data.military.navy) {
            const navy = data.military.navy;
            // استفاده از بندر یا پایتخت ساحلی
            let coords = null;
            if (data.ports && data.ports.length > 0) {
                coords = data.ports[0].coords;
            } else if (data.capital && data.capital.coords) {
                coords = data.capital.coords;
            }
            
            if (coords && coords.length === 2) {
                const [lat, lng] = coords;
                
                // ایجاد کشتی جنگی
                const ship = createShipMarker(0x0ea5e9, 0.012);
                
                // تبدیل به مختصات 3D
                const phi = (90 - lat) * (Math.PI / 180);
                const theta = (lng + 180) * (Math.PI / 180);
                const radius = 1.005;
                
                const x = -radius * Math.sin(phi) * Math.cos(theta);
                const y = radius * Math.cos(phi);
                const z = radius * Math.sin(phi) * Math.sin(theta);
                
                ship.position.set(x, y, z);
                
                // چرخاندن به سمت بالا
                const normal = new THREE.Vector3(x, y, z).normalize();
                ship.lookAt(normal.multiplyScalar(2).add(ship.position));
                ship.rotateX(Math.PI / 2);
                
                // ذخیره اطلاعات
                ship.userData = {
                    type: 'military-navy',
                    country: code,
                    countryName: data.name,
                    rank: navy.rank,
                    ships: navy.ships,
                    submarines: navy.submarines,
                    description: navy.description
                };
                
                militaryMarkersGroup.add(ship);
            }
        }
    });
}

// متغیر گروه المان‌های نظامی
let militaryMarkersGroup = null;

// پاک کردن المان‌های نظامی
function hideMilitaryMarkers() {
    if (militaryMarkersGroup && window.resourcesGlobeObjects && window.resourcesGlobeObjects.earth) {
        window.resourcesGlobeObjects.earth.scene.remove(militaryMarkersGroup);
        militaryMarkersGroup.traverse((obj) => {
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) obj.material.dispose();
            if (obj instanceof THREE.Light) obj.dispose();
        });
        militaryMarkersGroup = null;
    }
}

// پر کردن لیست کشورها
function populateCountryList() {
    const listContainer = document.getElementById('countryList');
    if (!listContainer || typeof countriesData === 'undefined') return;
    
    listContainer.innerHTML = '';
    
    // گرفتن پرچم کشور از کد کشور
    const getFlag = (code) => {
        const flags = {
            'IR': '🇮🇷', 'US': '🇺🇸', 'RU': '🇷🇺', 'CN': '🇨🇳', 'UK': '🇬🇧',
            'DE': '🇩🇪', 'FR': '🇫🇷', 'JP': '🇯🇵', 'IN': '🇮🇳', 'BR': '🇧🇷',
            'SA': '🇸🇦', 'AE': '🇦🇪', 'TR': '🇹🇷', 'IL': '🇮🇱', 'EG': '🇪🇬',
            'AU': '🇦🇺', 'CA': '🇨🇦', 'KR': '🇰🇷', 'KP': '🇰🇵', 'PK': '🇵🇰',
            'AF': '🇦🇫', 'IQ': '🇮🇶', 'SY': '🇸🇾', 'YE': '🇾🇪', 'UA': '🇺🇦',
            'ZA': '🇿🇦'
        };
        return flags[code] || '🏳️';
    };
    
    // مرتب‌سازی بر اساس GDP
    const sortedCountries = Object.entries(countriesData)
        .sort((a, b) => (b[1].gdp || 0) - (a[1].gdp || 0));
    
    sortedCountries.forEach(([code, data]) => {
        const item = document.createElement('div');
        item.className = 'country-item';
        item.dataset.code = code;
        
        // تعیین سطح ریسک
        let riskClass = 'low';
        if (data.investmentRisk >= 60) riskClass = 'high';
        else if (data.investmentRisk >= 35) riskClass = 'medium';
        
        item.innerHTML = `
            <span class="flag">${getFlag(code)}</span>
            <span class="name">${data.name}</span>
            <span class="risk ${riskClass}">${data.investmentRisk || 0}%</span>
        `;
        
        item.addEventListener('click', () => selectCountry(code));
        listContainer.appendChild(item);
    });
}

// ایجاد داده پیش‌فرض برای کشورهایی که در countriesData نیستند
function createDefaultCountryData(code, countryName = null) {
    // استفاده از countryCodeToName اگر موجود باشد
    const name = countryName || (window.countryCodeToName && window.countryCodeToName[code]) || code;
    
    return {
        name: name,
        nameEn: name,
        capital: { name: name, coords: [0, 0] },
        continent: "asia",
        gdp: 50,
        gdpRank: 150,
        gdpPerCapita: 2000,
        inflation: 5,
        unemployment: 5,
        currency: "USD",
        currencyName: "دلار",
        population: 10000000,
        populationDensity: 50,
        populationGrowth: 1,
        resources: {},
        exports: {
            total: 10,
            partners: [
                { country: "CN", amount: 3, percent: 30 },
                { country: "US", amount: 2, percent: 20 },
                { country: "DE", amount: 1, percent: 10 }
            ],
            mainProducts: ["محصولات"]
        },
        imports: {
            total: 12,
            partners: [
                { country: "CN", amount: 4, percent: 33 },
                { country: "US", amount: 2, percent: 17 },
                { country: "DE", amount: 1, percent: 8 }
            ],
            mainProducts: ["ماشین‌آلات", "الکترونیک"]
        },
        investmentRisk: 50,
        riskFactors: [],
        relations: {}
    };
}

// انتخاب کشور
function selectCountry(code) {
    console.log('🏳️ انتخاب کشور:', code);
    
    resourcesGlobeData.selectedCountry = code;
    let countryData = countriesData[code];
    
    // اگر کشور در countriesData نیست، داده پیش‌فرض ایجاد کن
    if (!countryData) {
        console.warn('⚠️ کشور در countriesData پیدا نشد، ایجاد داده پیش‌فرض:', code);
        countryData = createDefaultCountryData(code);
        // اضافه کردن به countriesData برای استفاده بعدی
        countriesData[code] = countryData;
    }
    
    // بستن پنل لیست کشورها بعد از انتخاب
    const countrySelectPanel = document.getElementById('countrySelectPanel');
    if (countrySelectPanel) {
        countrySelectPanel.classList.remove('active');
    }
    
    // به‌روزرسانی UI لیست
    document.querySelectorAll('.country-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.code === code) {
            item.classList.add('active');
        }
    });
    
    // نمایش پنل اطلاعات کشور
    showCountryInfo(code, countryData);
    
    // به‌روزرسانی مرزها بر اساس روابط
    if (resourcesGlobeData.bordersGroup) {
        updateBordersForCountry(resourcesGlobeData.bordersGroup, code);
    }
    
    // نمایش راهنمای رنگ‌ها (کوچک در گوشه)
    // document.getElementById('relationsLegend')?.classList.add('active');
    
    // نمایش المان‌های این کشور (گمرک، پالایشگاه، معادن و...)
    if (window.resourcesGlobeObjects && window.resourcesGlobeObjects.earth) {
        const earth = window.resourcesGlobeObjects.earth;
        
        // ایجاد گروه المان‌های کشور اگر وجود نداشته باشد
        if (!facilityMarkersGroup) {
            facilityMarkersGroup = new THREE.Group();
            facilityMarkersGroup.name = 'facilityMarkers';
            earth.add(facilityMarkersGroup);
        }
        
        // نمایش همه المان‌های کشور انتخاب شده
        const countryData = countriesData[code] || {};
        showCountryFacilities(code, countryData);
    }
    
    // زوم به کشور
    zoomToCountry(code);
}

// تولید المان‌های پیش‌فرض برای کشورهایی که المان ندارند - بهبود یافته
function generateDefaultFacilities(countryCode, countryData) {
    const facilities = {
        customs: [],
        refineries: [],
        mines: [],
        ports: [],
        oilRigs: []
    };
    
    if (!countryData.capital || !countryData.capital.coords) return facilities;
    
    const [capLat, capLng] = countryData.capital.coords;
    const resources = countryData.resources || {};
    const gdp = countryData.gdp || 10;
    const population = countryData.population || 1000000;
    
    // گمرکات - حداقل 1 تا 3 گمرک بر اساس اندازه کشور
    const customsCount = Math.min(3, Math.max(1, Math.floor(population / 10000000) + 1));
    for (let i = 0; i < customsCount; i++) {
        const offset = i * 0.3;
        facilities.customs.push({
            name: i === 0 ? `گمرک ${countryData.capital.name}` : `گمرک مرزی ${i}`,
            coords: [capLat + (i % 2 === 0 ? offset : -offset), capLng + (i % 3 === 0 ? offset : -offset)],
            workingHours: "دوشنبه تا جمعه: 9:00-17:00",
            description: i === 0 ? "گمرک اصلی" : "گمرک مرزی"
        });
    }
    
    // پالایشگاه‌ها - بر اساس نفت و گاز
    if (resources.oil || resources.gas) {
        const oilProduction = resources.oil?.production || 0;
        const gasProduction = resources.gas?.production || 0;
        const totalProduction = oilProduction + gasProduction;
        
        // تعداد پالایشگاه بر اساس تولید
        const refineryCount = Math.min(5, Math.max(1, Math.floor(totalProduction / 200) + 1));
        for (let i = 0; i < refineryCount; i++) {
            const offset = (i + 1) * 0.4;
            facilities.refineries.push({
                name: `پالایشگاه ${countryData.capital.name} ${i + 1}`,
                coords: [capLat + offset, capLng + (i % 2 === 0 ? offset : -offset)],
                capacity: `${Math.floor(totalProduction / refineryCount / 1000)}k bbl/day`,
                description: `پالایشگاه ${i + 1}`
            });
        }
    }
    
    // سکوهای نفتی - فقط برای کشورهای ساحلی با نفت
    if ((resources.oil || resources.gas) && (countryData.ports || Math.abs(capLat) < 60)) {
        const oilProduction = resources.oil?.production || 0;
        const rigCount = Math.min(3, Math.max(1, Math.floor(oilProduction / 100)));
        for (let i = 0; i < rigCount; i++) {
            const offset = (i + 1) * 0.6;
            facilities.oilRigs.push({
                name: `سکوی نفتی ${countryData.name} ${i + 1}`,
                coords: [capLat + offset, capLng + offset],
                capacity: `${Math.floor(oilProduction / rigCount / 1000)}k bbl/day`,
                description: "سکوی دریایی"
            });
        }
    }
    
    // معادن - بر اساس منابع معدنی
    const mineTypes = [];
    if (resources.gold) mineTypes.push({ type: 'طلا', name: 'طلا' });
    if (resources.silver) mineTypes.push({ type: 'نقره', name: 'نقره' });
    if (resources.copper) mineTypes.push({ type: 'مس', name: 'مس' });
    if (resources.iron) mineTypes.push({ type: 'آهن', name: 'آهن' });
    if (resources.diamonds) mineTypes.push({ type: 'الماس', name: 'الماس' });
    if (resources.coal) mineTypes.push({ type: 'زغال', name: 'زغال سنگ' });
    if (resources.uranium) mineTypes.push({ type: 'اورانیوم', name: 'اورانیوم' });
    if (resources.bauxite) mineTypes.push({ type: 'باکسیت', name: 'باکسیت' });
    
    mineTypes.forEach((mineType, i) => {
        const offset = (i + 1) * 0.5;
        facilities.mines.push({
            name: `معدن ${mineType.name} ${countryData.name}`,
            coords: [capLat - offset, capLng - (i % 2 === 0 ? offset : -offset)],
            capacity: "متغیر",
            description: `معدن ${mineType.name}`
        });
    });
    
    // بنادر - برای کشورهای ساحلی
    if (!countryData.ports || countryData.ports.length === 0) {
        if (Math.abs(capLat) < 60) { // کشورهای ساحلی
            const portCount = Math.min(3, Math.max(1, Math.floor(gdp / 50) + 1));
            for (let i = 0; i < portCount; i++) {
                const offset = i * 0.4;
                facilities.ports.push({
                    name: i === 0 ? `بندر ${countryData.capital.name}` : `بندر ${i + 1}`,
                    coords: [capLat + (i % 2 === 0 ? offset : -offset), capLng + offset],
                    workingHours: "24/7",
                    description: i === 0 ? "بندر اصلی" : "بندر تجاری"
                });
            }
        }
    }
    
    return facilities;
}

// نمایش المان‌های یک کشور خاص
function showCountryFacilities(countryCode, countryData) {
    if (!facilityMarkersGroup) return;
    
    // حذف المان‌های قبلی این کشور (اگر وجود داشته باشد)
    const existingMarkers = facilityMarkersGroup.children.filter(child => 
        child.userData && child.userData.country === countryCode
    );
    existingMarkers.forEach(marker => {
        facilityMarkersGroup.remove(marker);
        marker.traverse((obj) => {
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) obj.material.dispose();
            if (obj instanceof THREE.Light) obj.dispose();
        });
    });
    
    // استفاده از المان‌های موجود یا تولید پیش‌فرض
    const defaultFacilities = generateDefaultFacilities(countryCode, countryData);
    
    // اضافه کردن گمرکات
    const customs = countryData.customs || defaultFacilities.customs;
    if (Array.isArray(customs) && customs.length > 0) {
        customs.forEach(customs => {
            if (customs.coords && customs.coords.length === 2) {
                addFacilityMarker(customs, countryCode, countryData.name, 'customs', getFacilityColor('customs'));
            }
        });
    }
    
    // اضافه کردن پالایشگاه‌ها
    const refineries = countryData.refineries || defaultFacilities.refineries;
    if (Array.isArray(refineries) && refineries.length > 0) {
        refineries.forEach(refinery => {
            if (refinery.coords && refinery.coords.length === 2) {
                addFacilityMarker(refinery, countryCode, countryData.name, 'refinery', getFacilityColor('refinery'));
            }
        });
    }
    
    // اضافه کردن کارخانه‌ها
    if (countryData.factories && Array.isArray(countryData.factories)) {
        countryData.factories.forEach(factory => {
            if (factory.coords && factory.coords.length === 2) {
                addFacilityMarker(factory, countryCode, countryData.name, 'factory', getFacilityColor('factory'));
            }
        });
    }
    
    // اضافه کردن معادن
    const mines = countryData.mines || defaultFacilities.mines;
    if (Array.isArray(mines) && mines.length > 0) {
        mines.forEach(mine => {
            if (mine.coords && mine.coords.length === 2) {
                addFacilityMarker(mine, countryCode, countryData.name, 'mine', getFacilityColor('mine'));
            }
        });
    }
    
    // اضافه کردن بنادر
    const ports = countryData.ports || defaultFacilities.ports;
    if (Array.isArray(ports) && ports.length > 0) {
        ports.forEach(port => {
            if (port.coords && port.coords.length === 2) {
                addFacilityMarker(port, countryCode, countryData.name, 'port', getFacilityColor('port'));
            }
        });
    }
    
    // اضافه کردن سکوهای نفتی
    const oilRigs = countryData.oilRigs || defaultFacilities.oilRigs;
    if (Array.isArray(oilRigs) && oilRigs.length > 0) {
        oilRigs.forEach(rig => {
            if (rig.coords && rig.coords.length === 2) {
                addFacilityMarker(rig, countryCode, countryData.name, 'oil-rig', getFacilityColor('oil-rig'));
            }
        });
    }
}

// تکمیل داده‌های صادرات/واردات برای کشورهایی که ندارند
function ensureTradeData(countryCode, countryData) {
    // اگر صادرات/واردات دارد، برگردان
    if (countryData.exports && countryData.imports) {
        return countryData;
    }
    
    // تولید داده‌های پیش‌فرض بر اساس GDP و موقعیت جغرافیایی
    const gdp = countryData.gdp || 100;
    const continent = countryData.continent || 'asia';
    
    // شرکای تجاری پیش‌فرض بر اساس قاره
    const defaultPartners = {
        'asia': ['CN', 'JP', 'IN', 'KR', 'SG'],
        'europe': ['DE', 'FR', 'UK', 'IT', 'NL'],
        'africa': ['CN', 'US', 'FR', 'IN', 'DE'],
        'north_america': ['US', 'CA', 'MX', 'CN', 'JP'],
        'south_america': ['US', 'CN', 'BR', 'AR', 'CL'],
        'oceania': ['CN', 'US', 'JP', 'KR', 'AU']
    };
    
    const partners = defaultPartners[continent] || ['CN', 'US', 'DE', 'JP', 'FR'];
    
    // تولید صادرات/واردات بر اساس GDP
    const exportTotal = gdp * 0.15; // 15% GDP
    const importTotal = gdp * 0.18; // 18% GDP
    
    if (!countryData.exports) {
        countryData.exports = {
            total: exportTotal,
            partners: partners.slice(0, 5).map((p, i) => ({
                country: p,
                amount: exportTotal * (0.3 - i * 0.05),
                percent: Math.round((0.3 - i * 0.05) * 100)
            })),
            mainProducts: ["محصولات", "کالا", "خدمات"]
        };
    }
    
    if (!countryData.imports) {
        countryData.imports = {
            total: importTotal,
            partners: partners.slice(0, 5).map((p, i) => ({
                country: p,
                amount: importTotal * (0.3 - i * 0.05),
                percent: Math.round((0.3 - i * 0.05) * 100)
            })),
            mainProducts: ["ماشین‌آلات", "الکترونیک", "نفت"]
        };
    }
    
    return countryData;
}

// نمایش اطلاعات کشور
function showCountryInfo(code, data) {
    const panel = document.getElementById('countryInfoPanel');
    const nameEl = document.getElementById('selectedCountryName');
    const contentEl = document.getElementById('countryInfoContent');
    
    if (!panel || !contentEl) return;
    
    // تکمیل داده‌های تجاری
    const completeData = ensureTradeData(code, data);
    
    nameEl.textContent = `${completeData.name} (${completeData.nameEn})`;
    
    // فرمت‌کردن اعداد
    const formatNumber = (num) => {
        if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num?.toLocaleString() || '-';
    };
    
    const formatMoney = (num) => {
        return '$' + formatNumber(num);
    };
    
    // ساخت HTML اطلاعات
    contentEl.innerHTML = `
        <!-- اقتصادی -->
        <div class="info-section">
            <h5>📊 اقتصادی</h5>
            <div class="info-grid">
                <div class="info-item">
                    <div class="label">GDP</div>
                    <div class="value">${formatMoney(completeData.gdp)}B</div>
                </div>
                <div class="info-item">
                    <div class="label">رتبه جهانی</div>
                    <div class="value">#${completeData.gdpRank || '-'}</div>
                </div>
                <div class="info-item">
                    <div class="label">درآمد سرانه</div>
                    <div class="value">${formatMoney(completeData.gdpPerCapita)}</div>
                </div>
                <div class="info-item">
                    <div class="label">تورم</div>
                    <div class="value ${completeData.inflation > 10 ? 'negative' : ''}">${completeData.inflation || 0}%</div>
                </div>
                <div class="info-item">
                    <div class="label">بیکاری</div>
                    <div class="value ${completeData.unemployment > 15 ? 'negative' : ''}">${completeData.unemployment || 0}%</div>
                </div>
                <div class="info-item">
                    <div class="label">ارز</div>
                    <div class="value">${completeData.currencyName || '-'}</div>
                </div>
            </div>
        </div>
        
        <!-- جمعیتی -->
        <div class="info-section">
            <h5>👥 جمعیتی</h5>
            <div class="info-grid">
                <div class="info-item">
                    <div class="label">جمعیت</div>
                    <div class="value">${formatNumber(completeData.population)}</div>
                </div>
                <div class="info-item">
                    <div class="label">تراکم</div>
                    <div class="value">${completeData.populationDensity || 0}/km²</div>
                </div>
                <div class="info-item">
                    <div class="label">نرخ رشد</div>
                    <div class="value ${completeData.populationGrowth > 0 ? 'positive' : 'negative'}">${completeData.populationGrowth || 0}%</div>
                </div>
            </div>
        </div>
        
        <!-- منابع طبیعی -->
        ${completeData.resources && Object.keys(completeData.resources).length > 0 ? `
        <div class="info-section">
            <h5>⛏️ منابع طبیعی</h5>
            ${Object.entries(completeData.resources).map(([key, res]) => `
                <div class="resource-bar">
                    <div class="header">
                        <span>${getResourceName(key)}</span>
                        <span>رتبه ${res.rank || '-'}</span>
                    </div>
                    <div class="bar">
                        <div class="fill ${key}" style="width: ${Math.min(100, 100 - (res.rank || 50) * 2)}%"></div>
                    </div>
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        <!-- صادرات -->
        ${completeData.exports ? `
        <div class="info-section">
            <h5>📤 صادرات (${formatMoney(completeData.exports.total)}B)</h5>
            <div class="trade-partners">
                ${completeData.exports.partners?.slice(0, 10).map(p => `
                    <div class="trade-partner" onclick="showTradeLine('${code}', '${p.country}', 'exports')">
                        <span class="flag">${getCountryFlag(p.country)}</span>
                        <span class="country">${getCountryName(p.country)}</span>
                        <span class="amount">${formatMoney(p.amount)}B</span>
                        <span class="percent">${p.percent}%</span>
                    </div>
                `).join('')}
            </div>
            <button class="filter-btn" style="margin-top:10px;width:100%" onclick="showAllTradeLines('${code}', 'exports')">
                📤 نمایش همه صادرات روی نقشه
            </button>
        </div>
        ` : ''}
        
        <!-- واردات -->
        ${completeData.imports ? `
        <div class="info-section">
            <h5>📥 واردات (${formatMoney(completeData.imports.total)}B)</h5>
            <div class="trade-partners">
                ${completeData.imports.partners?.slice(0, 10).map(p => `
                    <div class="trade-partner" onclick="showTradeLine('${code}', '${p.country}', 'imports')">
                        <span class="flag">${getCountryFlag(p.country)}</span>
                        <span class="country">${getCountryName(p.country)}</span>
                        <span class="amount">${formatMoney(p.amount)}B</span>
                        <span class="percent">${p.percent}%</span>
                    </div>
                `).join('')}
            </div>
            <button class="filter-btn" style="margin-top:10px;width:100%" onclick="showAllTradeLines('${code}', 'imports')">
                📥 نمایش همه واردات روی نقشه
            </button>
        </div>
        ` : ''}
        
        <!-- ریسک سرمایه‌گذاری -->
        <div class="info-section">
            <h5>⚠️ ریسک سرمایه‌گذاری</h5>
            <div class="risk-indicator">
                <div class="meter">
                    <div class="needle" style="left: ${data.investmentRisk || 0}%"></div>
                </div>
                <div class="value" style="color: ${data.investmentRisk >= 60 ? '#ef4444' : data.investmentRisk >= 35 ? '#f59e0b' : '#22c55e'}">
                    ${data.investmentRisk || 0}%
                </div>
            </div>
            ${data.riskFactors?.length > 0 ? `
            <div style="font-size:0.8rem;color:rgba(255,255,255,0.6);margin-top:8px">
                ⚡ ${data.riskFactors.join(' • ')}
            </div>
            ` : ''}
        </div>
        
        <!-- درگیری‌ها -->
        ${data.conflicts?.length > 0 ? `
        <div class="info-section">
            <h5>⚔️ درگیری‌ها</h5>
            ${data.conflicts.map(c => `
                <div style="background:rgba(239,68,68,0.2);padding:10px;border-radius:8px;margin-bottom:8px">
                    <div style="font-weight:bold;color:#ef4444">
                        ${c.intensity === 'war' ? '🔴 جنگ' : c.intensity === 'tension' ? '🟠 تنش' : '🟡 درگیری'}
                        با ${getCountryName(c.opponent)}
                    </div>
                    <div style="font-size:0.8rem;color:rgba(255,255,255,0.7);margin-top:4px">
                        ${c.description} (از ${c.since})
                    </div>
                </div>
            `).join('')}
        </div>
        ` : ''}
    `;
    
    panel.classList.add('active');
}

// بستن پنل اطلاعات کشور
function closeCountryInfo() {
    const panel = document.getElementById('countryInfoPanel');
    if (panel) panel.classList.remove('active');
    
    document.getElementById('relationsLegend')?.classList.remove('active');
    resourcesGlobeData.selectedCountry = null;
    
    // ریست رنگ مرزها
    if (resourcesGlobeData.bordersGroup) {
        resourcesGlobeData.bordersGroup.children.forEach(group => {
            group.children.forEach(line => {
                if (line.material) {
                    line.material.color.setHex(0x4488ff);
                    line.material.opacity = 0.4;
                }
            });
        });
    }
}

// گرفتن نام منبع
function getResourceName(key) {
    const names = {
        'oil': '🛢️ نفت',
        'gas': '💨 گاز طبیعی',
        'gold': '🥇 طلا',
        'iron': '⚫ آهن',
        'copper': '🟤 مس',
        'coal': '⬛ زغال‌سنگ',
        'uranium': '☢️ اورانیوم',
        'diamonds': '💎 الماس',
        'platinum': '⚪ پلاتین',
        'chromium': '🔘 کروم',
        'rareEarth': '🌍 خاک‌های کمیاب',
        'potash': '🧂 پتاس',
        'manganese': '⚙️ منگنز',
        'niobium': '🔷 نیوبیم',
        'lithium': '🔋 لیتیم',
        'boron': '💠 بور',
        'mica': '✨ میکا'
    };
    return names[key] || key;
}

// گرفتن پرچم کشور
function getCountryFlag(code) {
    const flags = {
        'IR': '🇮🇷', 'US': '🇺🇸', 'RU': '🇷🇺', 'CN': '🇨🇳', 'UK': '🇬🇧',
        'DE': '🇩🇪', 'FR': '🇫🇷', 'JP': '🇯🇵', 'IN': '🇮🇳', 'BR': '🇧🇷',
        'SA': '🇸🇦', 'AE': '🇦🇪', 'TR': '🇹🇷', 'IL': '🇮🇱', 'EG': '🇪🇬',
        'AU': '🇦🇺', 'CA': '🇨🇦', 'KR': '🇰🇷', 'KP': '🇰🇵', 'PK': '🇵🇰',
        'AF': '🇦🇫', 'IQ': '🇮🇶', 'SY': '🇸🇾', 'YE': '🇾🇪', 'UA': '🇺🇦',
        'ZA': '🇿🇦', 'NL': '🇳🇱', 'IT': '🇮🇹', 'ES': '🇪🇸', 'MX': '🇲🇽',
        'AR': '🇦🇷', 'VN': '🇻🇳', 'TW': '🇹🇼', 'HK': '🇭🇰', 'TH': '🇹🇭',
        'ID': '🇮🇩', 'MY': '🇲🇾', 'PH': '🇵🇭', 'SG': '🇸🇬', 'NZ': '🇳🇿',
        'CH': '🇨🇭', 'AT': '🇦🇹', 'BE': '🇧🇪', 'PL': '🇵🇱', 'SE': '🇸🇪',
        'NO': '🇳🇴', 'DK': '🇩🇰', 'FI': '🇫🇮', 'IE': '🇮🇪', 'PT': '🇵🇹',
        'GR': '🇬🇷', 'CZ': '🇨🇿', 'HU': '🇭🇺', 'RO': '🇷🇴', 'BY': '🇧🇾',
        'KZ': '🇰🇿', 'UZ': '🇺🇿', 'AZ': '🇦🇿', 'GE': '🇬🇪', 'AM': '🇦🇲',
        'QA': '🇶🇦', 'KW': '🇰🇼', 'BH': '🇧🇭', 'OM': '🇴🇲', 'JO': '🇯🇴',
        'LB': '🇱🇧', 'PS': '🇵🇸', 'NG': '🇳🇬', 'KE': '🇰🇪', 'ET': '🇪🇹',
        'MA': '🇲🇦', 'DZ': '🇩🇿', 'TN': '🇹🇳', 'LY': '🇱🇾', 'SD': '🇸🇩'
    };
    return flags[code] || '🏳️';
}

// گرفتن نام کشور
function getCountryName(code) {
    if (countriesData[code]) return countriesData[code].name;
    return countryCodeToName[code] || code;
}

// زوم به کشور
function zoomToCountry(code) {
    const data = countriesData[code];
    if (!data || !data.capital) return;
    
    const [lat, lng] = data.capital.coords;
    console.log(`🎯 زوم به ${data.name}: lat=${lat}, lng=${lng}`);
    
    // استفاده از تابع موجود برای زوم
    if (window.resourcesGlobeObjects) {
        const { camera, controls, earth, stopRotate } = window.resourcesGlobeObjects;
        if (camera && earth) {
            // توقف چرخش اتوماتیک
            if (stopRotate) stopRotate();
            
            // ریست چرخش کره برای هماهنگی با مختصات
            earth.rotation.y = 0;
            
            // محاسبه موقعیت دوربین
            // توجه: باید از همون فرمول مرزها استفاده کنیم
            const phi = (90 - lat) * (Math.PI / 180);
            const theta = (lng + 180) * (Math.PI / 180);
            
            const distance = 2.2; // نزدیکتر برای دید بهتر
            const x = -distance * Math.sin(phi) * Math.cos(theta);
            const y = distance * Math.cos(phi);
            const z = distance * Math.sin(phi) * Math.sin(theta);
            
            // انیمیشن دوربین
            const startPos = camera.position.clone();
            const endPos = new THREE.Vector3(x, y, z);
            const duration = 1200;
            const startTime = Date.now();
            
            const animateZoom = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
                
                camera.position.lerpVectors(startPos, endPos, eased);
                camera.lookAt(0, 0, 0);
                
                if (controls) controls.update();
                
                if (progress < 1) {
                    requestAnimationFrame(animateZoom);
                }
            };
            animateZoom();
        }
    }
}

// نمایش خط تجارت به یک کشور
function showTradeLine(fromCode, toCode, type) {
    console.log(`📊 نمایش خط ${type} از ${fromCode} به ${toCode}`);
    
    if (!window.resourcesGlobeObjects) return;
    const { earth } = window.resourcesGlobeObjects;
    
    // پاک کردن خطوط قبلی
    clearTradeLines(earth);
    
    const fromData = countriesData[fromCode];
    const toData = countriesData[toCode];
    
    if (!fromData || !toData) return;
    
    const fromCoords = fromData.capital.coords;
    const toCoords = toData.capital.coords;
    
    const color = type === 'exports' ? 0x22c55e : 0x3b82f6;
    
    const arc = createArcLine(fromCoords, toCoords, color, 0.3);
    
    const tradeGroup = new THREE.Group();
    tradeGroup.name = 'tradeLines';
    tradeGroup.add(arc);
    
    // اضافه کردن به earth نه scene
    earth.add(tradeGroup);
    resourcesGlobeData.tradeLinesGroup = tradeGroup;
}

// نمایش همه خطوط تجارت
function showAllTradeLines(countryCode, type) {
    console.log(`📊 نمایش همه ${type} برای ${countryCode}`);
    
    if (!window.resourcesGlobeObjects) return;
    const { earth } = window.resourcesGlobeObjects;
    
    // پاک کردن خطوط قبلی
    clearTradeLines(earth);
    
    // ایجاد خطوط جدید - اضافه کردن به earth نه scene
    const tradeGroup = createTradeLines(countryCode, type, earth);
    resourcesGlobeData.tradeLinesGroup = tradeGroup;
}

// راه‌اندازی پنل‌های کره منابع
function setupResourcesGlobePanels() {
    // دکمه نمایش/مخفی فیلترها
    const toggleFiltersBtn = document.getElementById('toggleFiltersBtn');
    if (toggleFiltersBtn) {
        toggleFiltersBtn.addEventListener('click', () => {
            const panel = document.getElementById('resourcesFilterPanel');
            if (panel) panel.classList.toggle('active');
        });
    }
    
    // دکمه نمایش/مخفی لیست کشورها
    const toggleCountriesBtn = document.getElementById('toggleCountriesBtn');
    if (toggleCountriesBtn) {
        toggleCountriesBtn.addEventListener('click', () => {
            const panel = document.getElementById('countrySelectPanel');
            if (panel) panel.classList.toggle('active');
        });
    }
    
    // جستجوی کشور
    const searchInput = document.getElementById('countrySearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            document.querySelectorAll('.country-item').forEach(item => {
                const name = item.querySelector('.name')?.textContent.toLowerCase() || '';
                item.style.display = name.includes(query) ? 'flex' : 'none';
            });
        });
    }
    
    // فیلتر منابع (نفت، گاز، طلا و...)
    document.querySelectorAll('#resourceFilters .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // فقط یکی فعال باشه
            document.querySelectorAll('#resourceFilters .filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            filterCountriesByResource(filter);
        });
    });
    
    // فیلترهای نمایش (مرزها، صادرات، واردات، درگیری)
    document.querySelectorAll('#viewFilters .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            const view = btn.dataset.view;
            
            switch(view) {
                case 'borders':
                    resourcesGlobeData.showBorders = btn.classList.contains('active');
                    if (resourcesGlobeData.bordersGroup) {
                        resourcesGlobeData.bordersGroup.visible = resourcesGlobeData.showBorders;
                    }
                    break;
                case 'labels':
                    resourcesGlobeData.showLabels = btn.classList.contains('active');
                    if (resourcesGlobeData.labelsGroup) {
                        resourcesGlobeData.labelsGroup.visible = resourcesGlobeData.showLabels;
                    }
                    break;
                case 'conflicts':
                    resourcesGlobeData.showConflicts = btn.classList.contains('active');
                    if (resourcesGlobeData.conflictsGroup) {
                        resourcesGlobeData.conflictsGroup.visible = resourcesGlobeData.showConflicts;
                    }
                    break;
                case 'exports':
                case 'imports':
                    if (btn.classList.contains('active')) {
                        if (resourcesGlobeData.selectedCountry) {
                            showAllTradeLines(resourcesGlobeData.selectedCountry, view);
                        } else {
                            alert('🌍 ابتدا یک کشور انتخاب کنید');
                            btn.classList.remove('active');
                        }
                    } else {
                        // پاک کردن خطوط تجارت
                        if (window.resourcesGlobeObjects && window.resourcesGlobeObjects.earth) {
                            clearTradeLines(window.resourcesGlobeObjects.earth);
                        }
                    }
                    break;
            }
        });
    });
    
    // فیلتر قدرت نظامی
    document.querySelectorAll('#militaryFilters .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // فقط یک فیلتر می‌تونه فعال باشه
            document.querySelectorAll('#militaryFilters .filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const militaryType = btn.dataset.military;
            
            // پاک کردن المان‌های قبلی
            hideMilitaryMarkers();
            
            if (militaryType === 'all') {
                // نمایش همه
                showAirForceOnGlobe();
                showGroundForceOnGlobe();
                showNavyOnGlobe();
            } else if (militaryType === 'air') {
                showAirForceOnGlobe();
            } else if (militaryType === 'ground') {
                showGroundForceOnGlobe();
            } else if (militaryType === 'navy') {
                showNavyOnGlobe();
            } else if (militaryType === 'rank') {
                // نمایش بر اساس رتبه (فقط 10 کشور برتر)
                const topCountries = Object.entries(countriesData)
                    .filter(([code, data]) => data.military && data.military.rank)
                    .sort((a, b) => (a[1].military.rank || 999) - (b[1].military.rank || 999))
                    .slice(0, 10);
                
                topCountries.forEach(([code, data]) => {
                    if (data.military) {
                        if (data.military.airForce) showAirForceOnGlobe();
                        if (data.military.groundForce) showGroundForceOnGlobe();
                        if (data.military.navy) showNavyOnGlobe();
                    }
                });
            }
        });
    });
    
    // فیلتر قاره
    document.querySelectorAll('#continentFilters .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#continentFilters .filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const continent = btn.dataset.continent;
            filterCountriesByContinent(continent);
        });
    });
    
    // فیلتر تاسیسات (پالایشگاه، کارخانه، گمرک) - پشتیبانی از چند فیلتر همزمان
    document.querySelectorAll('#facilityFilters .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            updateAllFacilities(); // به‌روزرسانی همه المان‌ها بر اساس فیلترهای فعال
        });
    });
    
    // تابع به‌روزرسانی همه المان‌ها بر اساس فیلترهای فعال
    window.updateAllFacilities = function() {
        if (!window.resourcesGlobeObjects || !window.resourcesGlobeObjects.earth) return;
        
        // پاک کردن همه المان‌ها
        hideAllFacilities();
        
        // گرفتن فیلترهای فعال
        const activeFilters = Array.from(document.querySelectorAll('#facilityFilters .filter-btn.active'))
            .map(btn => btn.dataset.filter);
        
        // نمایش المان‌های مربوط به فیلترهای فعال
        activeFilters.forEach(filter => {
            if (filter === 'customs') {
                showCustomsOnGlobe();
            } else if (filter === 'refinery') {
                showRefineriesOnGlobe();
            } else if (filter === 'factory') {
                showFactoriesOnGlobe();
            } else if (filter === 'mine') {
                showMinesOnGlobe();
            } else if (filter === 'port') {
                showPortsOnGlobe();
            } else if (filter === 'oil-rig') {
                showOilRigsOnGlobe();
            }
        });
    };
    
    // فیلتر سال
    const yearFilter = document.getElementById('yearFilter');
    if (yearFilter) {
        yearFilter.addEventListener('change', (e) => {
            const selectedYear = e.target.value;
            console.log(`📅 تغییر سال به: ${selectedYear}`);
            resourcesGlobeData.selectedYear = selectedYear;
            
            // در آینده: بارگذاری داده‌های سال از API
            // برای الان فقط یک پیام نمایش می‌دهیم
            if (selectedYear !== '2024') {
                showYearChangeMessage(selectedYear);
            }
            
            // به‌روزرسانی اطلاعات کشور انتخابی
            if (resourcesGlobeData.selectedCountry) {
                const countryData = countriesData[resourcesGlobeData.selectedCountry];
                if (countryData) {
                    showCountryInfo(resourcesGlobeData.selectedCountry, countryData);
                }
            }
        });
    }
}

// نمایش پیام تغییر سال
function showYearChangeMessage(year) {
    // اگر قبلاً پیام موجود است، حذفش کن
    const existingMsg = document.querySelector('.year-change-message');
    if (existingMsg) existingMsg.remove();
    
    const msg = document.createElement('div');
    msg.className = 'year-change-message';
    msg.innerHTML = `
        <div class="year-msg-content">
            <span>📅</span>
            <span>داده‌های سال ${year} از طریق API بارگذاری خواهد شد</span>
        </div>
    `;
    msg.style.cssText = `
        position: fixed;
        bottom: 150px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(59, 130, 246, 0.9);
        color: white;
        padding: 12px 24px;
        border-radius: 12px;
        backdrop-filter: blur(10px);
        z-index: 99999;
        animation: slideUp 0.3s ease;
    `;
    
    document.body.appendChild(msg);
    
    setTimeout(() => {
        msg.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => msg.remove(), 300);
    }, 3000);
}

// فیلتر کشورها بر اساس منبع طبیعی و نمایش آیکون‌ها روی نقشه
function filterCountriesByResource(resourceType) {
    // فیلتر لیست کشورها
    document.querySelectorAll('.country-item').forEach(item => {
        const code = item.dataset.code;
        const data = countriesData[code];
        
        if (resourceType === 'all') {
            item.style.display = 'flex';
        } else if (data && data.resources && data.resources[resourceType]) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
    
    // نمایش آیکون‌های منابع روی نقشه
    if (window.resourcesGlobeObjects && window.resourcesGlobeObjects.earth) {
        const earth = window.resourcesGlobeObjects.earth;
        
        if (typeof showResourcesByType === 'function') {
            showResourcesByType(earth, resourceType);
        }
    }
}

// فیلتر کشورها بر اساس قاره
function filterCountriesByContinent(continent) {
    document.querySelectorAll('.country-item').forEach(item => {
        const code = item.dataset.code;
        const data = countriesData[code];
        
        if (continent === 'all' || (data && data.continent === continent)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// نمایش المان‌های روی کره (گمرک، معادن، پالایشگاه و...)
let facilityMarkersGroup = null;
let globePopup = null;

// رنگ‌های بهینه شده برای هر نوع المان (با درخشش بیشتر و زیباتر)
const FACILITY_COLORS = {
    'customs': 0xffd700,      // طلایی درخشان - گمرک
    'refinery': 0x3b82f6,     // آبی روشن - پالایشگاه
    'factory': 0x6366f1,      // بنفش-آبی - کارخانه
    'mine': 0x22c55e,         // سبز زمردی - معدن
    'port': 0x8b5cf6,         // بنفش روشن - بندر
    'oil-rig': 0xf59e0b,      // نارنجی طلایی - سکوی نفتی
    'military-air': 0xef4444, // قرمز روشن - نیروی هوایی
    'military-ground': 0x64748b, // خاکستری فولادی - نیروی زمینی
    'military-navy': 0x0ea5e9,  // آبی دریایی - نیروی دریایی
    'tank': 0xdc2626,         // قرمز تیره - تانک
    'soldier': 0x64748b,      // خاکستری - سرباز
    'aircraft': 0xef4444,     // قرمز - هواپیمای جنگی
    'ship': 0x0ea5e9          // آبی - کشتی جنگی
};

// تابع کمکی برای گرفتن رنگ المان
function getFacilityColor(type) {
    return FACILITY_COLORS[type] || 0xffffff;
}

// ایجاد چراغ نئونی زیبا - قابل مشاهده از بالا با چرخش و افکت‌های بهتر
function createNeonMarker(color, size = 0.008, type = 'customs') {
    const group = new THREE.Group();
    
    // شکل بر اساس نوع المان - کوچک و کم‌نور برای نمایش بهتر
    let shapeGeometry;
    let shapeSize = size;
    let baseSize = size * 0.4; // کاهش اندازه پایه به 0.4 برابر (قبلاً 1.2 بود)
    
    if (type === 'customs') {
        // گمرک: مثلث طلایی با پایه بزرگتر و نوک تیز
        shapeGeometry = new THREE.ConeGeometry(baseSize * 1.8, baseSize * 3.5, 3);
        shapeSize = baseSize * 1.6;
    } else if (type === 'refinery') {
        // پالایشگاه: استوانه آبی با قطر بیشتر و برج بلند
        shapeGeometry = new THREE.CylinderGeometry(baseSize * 1.6, baseSize * 1.8, baseSize * 3.2, 12);
        shapeSize = baseSize * 1.4;
    } else if (type === 'factory') {
        // کارخانه: مکعب با لبه‌های گرد
        shapeGeometry = new THREE.BoxGeometry(baseSize * 2.2, baseSize * 2.8, baseSize * 2.2);
        shapeSize = baseSize * 1.4;
    } else if (type === 'mine') {
        // معدن: الماس سبز بزرگتر با برش‌های بیشتر
        shapeGeometry = new THREE.OctahedronGeometry(baseSize * 2.2);
        shapeSize = baseSize * 1.7;
    } else if (type === 'port') {
        // بندر: استوانه بنفش بلندتر با قطر بیشتر
        shapeGeometry = new THREE.CylinderGeometry(baseSize * 1.4, baseSize * 1.6, baseSize * 3.5, 10);
        shapeSize = baseSize * 1.5;
    } else if (type === 'oil-rig') {
        // سکوی نفتی: هرم نارنجی بزرگتر با پایه چهارگوش
        shapeGeometry = new THREE.ConeGeometry(baseSize * 2.0, baseSize * 4.0, 4);
        shapeSize = baseSize * 1.8;
    } else if (type === 'military-air') {
        // نیروی هوایی: هواپیمای جنگی (مثلث با بال)
        shapeGeometry = new THREE.ConeGeometry(baseSize * 1.5, baseSize * 3.0, 3);
        shapeSize = baseSize * 1.5;
    } else if (type === 'military-ground' || type === 'tank') {
        // نیروی زمینی/تانک: مکعب مستطیل با لوله
        shapeGeometry = new THREE.BoxGeometry(baseSize * 2.5, baseSize * 1.5, baseSize * 2.0);
        shapeSize = baseSize * 1.4;
    } else if (type === 'military-navy') {
        // نیروی دریایی: کشتی (استوانه کشیده)
        shapeGeometry = new THREE.CylinderGeometry(baseSize * 1.2, baseSize * 1.4, baseSize * 3.5, 8);
        shapeSize = baseSize * 1.5;
    } else if (type === 'soldier') {
        // سرباز: استوانه کوچک
        shapeGeometry = new THREE.CylinderGeometry(baseSize * 0.8, baseSize * 0.8, baseSize * 2.0, 8);
        shapeSize = baseSize * 1.0;
    } else if (type === 'university') {
        // دانشگاه: مکعب با لبه‌های گرد (کتاب)
        shapeGeometry = new THREE.BoxGeometry(baseSize * 2.0, baseSize * 2.8, baseSize * 1.5);
        shapeSize = baseSize * 1.4;
    } else if (type === 'historical') {
        // تاریخی: استوانه بلند (ستون)
        shapeGeometry = new THREE.CylinderGeometry(baseSize * 1.2, baseSize * 1.4, baseSize * 4.0, 12);
        shapeSize = baseSize * 1.6;
    } else if (type === 'weather') {
        // آب و هوا: کره کوچک
        shapeGeometry = new THREE.SphereGeometry(baseSize * 1.5, 16, 16);
        shapeSize = baseSize * 1.3;
    } else if (type === 'earthquake') {
        // زلزله: دایره با موج (ring)
        shapeGeometry = new THREE.RingGeometry(baseSize * 0.8, baseSize * 1.5, 32);
        shapeSize = baseSize * 1.2;
    } else if (type === 'forest') {
        // جنگل: درخت (مخروط)
        shapeGeometry = new THREE.ConeGeometry(baseSize * 1.5, baseSize * 3.0, 8);
        shapeSize = baseSize * 1.5;
    } else if (type === 'desert') {
        // بیابان: هرم مسطح
        shapeGeometry = new THREE.ConeGeometry(baseSize * 2.0, baseSize * 1.5, 6);
        shapeSize = baseSize * 1.3;
    } else if (type === 'groundwater') {
        // آب زیرزمینی: استوانه
        shapeGeometry = new THREE.CylinderGeometry(baseSize * 1.2, baseSize * 1.2, baseSize * 2.0, 12);
        shapeSize = baseSize * 1.3;
    } else if (type === 'livestock') {
        // دام: مکعب کوچک
        shapeGeometry = new THREE.BoxGeometry(baseSize * 1.5, baseSize * 1.5, baseSize * 1.5);
        shapeSize = baseSize * 1.2;
    } else if (type === 'wildlife') {
        // حیوانات وحشی: کره
        shapeGeometry = new THREE.SphereGeometry(baseSize * 1.3, 12, 12);
        shapeSize = baseSize * 1.2;
    } else if (type === 'marine') {
        // حیوانات دریایی: استوانه کوچک
        shapeGeometry = new THREE.CylinderGeometry(baseSize * 1.0, baseSize * 1.0, baseSize * 1.8, 10);
        shapeSize = baseSize * 1.2;
    } else {
        // پیش‌فرض: کره
        shapeGeometry = new THREE.SphereGeometry(baseSize * 1.8, 12, 12);
        shapeSize = baseSize * 1.3;
    }
    
    // المان اصلی با درخشش کم
    const lightMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.8,
        emissive: color,
        emissiveIntensity: 0.3, // کاهش از 1.0 به 0.3
        side: THREE.DoubleSide
    });
    const light = new THREE.Mesh(shapeGeometry, lightMaterial);
    group.add(light);
    
    // لایه درونی با درخشش کم
    const innerGlowGeometry = shapeGeometry.clone();
    innerGlowGeometry.scale(0.65, 0.65, 0.65);
    const innerGlowMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.4, // کاهش از 0.7 به 0.4
        emissive: color,
        emissiveIntensity: 0.4, // کاهش از 1.5 به 0.4
        side: THREE.DoubleSide
    });
    const innerGlow = new THREE.Mesh(innerGlowGeometry, innerGlowMaterial);
    group.add(innerGlow);
    
    // لایه میانی حذف شد - برای کاهش نور
    
    // حلقه چرخان بیرونی - کوچک و کم‌نور
    const ringGeometry = new THREE.RingGeometry(shapeSize * 1.3, shapeSize * 1.6, 24);
    const ringMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.3, // کاهش از 0.8 به 0.3
        side: THREE.DoubleSide,
        emissive: color,
        emissiveIntensity: 0.15 // کاهش از 0.4 به 0.15
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = -Math.PI / 2;
    ring.userData.rotate = true;
    ring.userData.rotationSpeed = 0.025;
    group.add(ring);
    
    // هاله نور کوچک - فقط یک هاله کوچک
    const glowGeometry = new THREE.CircleGeometry(size * 2.0, 32); // کاهش از 5.5 به 2.0
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.2, // کاهش از 0.5 به 0.2
        side: THREE.DoubleSide,
        emissive: color,
        emissiveIntensity: 0.1 // کاهش از 0.3 به 0.1
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.rotation.x = -Math.PI / 2;
    group.add(glow);
    
    // نور نقطه‌ای کوچک و کم‌نور - فقط یک نور
    const pointLight = new THREE.PointLight(color, 0.2, 0.15); // کاهش از 1.5 به 0.2
    pointLight.position.set(0, 0, 0);
    pointLight.decay = 2;
    group.add(pointLight);
    
    // ذخیره اطلاعات چرخش
    group.userData.rotateRings = true;
    group.userData.rings = [ring];
    
    return group;
}

// ایجاد تانک جنگی (برای نمایش درگیری‌ها)
function createTankMarker(color = 0xef4444, size = 0.01) {
    const group = new THREE.Group();
    
    // بدنه تانک (مکعب)
    const bodyGeometry = new THREE.BoxGeometry(size * 2.5, size * 1.2, size * 2.0);
    const bodyMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.95,
        emissive: color,
        emissiveIntensity: 0.7
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = size * 0.6;
    group.add(body);
    
    // برجک تانک (استوانه)
    const turretGeometry = new THREE.CylinderGeometry(size * 0.8, size * 0.8, size * 0.8, 8);
    const turretMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.9,
        emissive: color,
        emissiveIntensity: 0.8
    });
    const turret = new THREE.Mesh(turretGeometry, turretMaterial);
    turret.position.set(0, size * 1.4, 0);
    group.add(turret);
    
    // لوله تانک
    const barrelGeometry = new THREE.CylinderGeometry(size * 0.15, size * 0.15, size * 1.5, 6);
    const barrelMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.9,
        emissive: color,
        emissiveIntensity: 0.9
    });
    const barrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
    barrel.rotation.z = Math.PI / 2;
    barrel.position.set(size * 0.75, size * 1.4, 0);
    group.add(barrel);
    
    // حلقه چرخان
    const ringGeometry = new THREE.RingGeometry(size * 1.8, size * 2.4, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
        emissive: color,
        emissiveIntensity: 0.3
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = -Math.PI / 2;
    ring.userData.rotate = true;
    ring.userData.rotationSpeed = 0.02;
    group.add(ring);
    
    // هاله نور
    const glowGeometry = new THREE.CircleGeometry(size * 4, 64);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
        emissive: color,
        emissiveIntensity: 0.2
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.rotation.x = -Math.PI / 2;
    group.add(glow);
    
    // نور نقطه‌ای
    const pointLight = new THREE.PointLight(color, 1.0, 0.25);
    pointLight.position.set(0, size * 1.0, 0);
    group.add(pointLight);
    
    group.userData.rotateRings = true;
    group.userData.rings = [ring];
    
    return group;
}

// ایجاد هواپیمای جنگی (برای نیروی هوایی)
function createAircraftMarker(color = 0xef4444, size = 0.008) {
    const group = new THREE.Group();
    
    // بدنه هواپیما (مثلث)
    const bodyGeometry = new THREE.ConeGeometry(size * 1.2, size * 2.5, 3);
    const bodyMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.95,
        emissive: color,
        emissiveIntensity: 0.8
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.rotation.z = Math.PI / 2;
    group.add(body);
    
    // بال‌ها (مستطیل)
    const wingGeometry = new THREE.BoxGeometry(size * 3.0, size * 0.3, size * 1.0);
    const wingMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.9,
        emissive: color,
        emissiveIntensity: 0.7
    });
    const wing = new THREE.Mesh(wingGeometry, wingMaterial);
    wing.position.y = size * 0.5;
    group.add(wing);
    
    // حلقه چرخان
    const ringGeometry = new THREE.RingGeometry(size * 1.5, size * 2.0, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
        emissive: color,
        emissiveIntensity: 0.4
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = -Math.PI / 2;
    ring.userData.rotate = true;
    ring.userData.rotationSpeed = 0.03;
    group.add(ring);
    
    // هاله نور
    const glowGeometry = new THREE.CircleGeometry(size * 4, 64);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
        emissive: color,
        emissiveIntensity: 0.2
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.rotation.x = -Math.PI / 2;
    group.add(glow);
    
    // نور نقطه‌ای
    const pointLight = new THREE.PointLight(color, 1.0, 0.25);
    group.add(pointLight);
    
    group.userData.rotateRings = true;
    group.userData.rings = [ring];
    
    return group;
}

// ایجاد کشتی جنگی (برای نیروی دریایی)
function createShipMarker(color = 0x0ea5e9, size = 0.01) {
    const group = new THREE.Group();
    
    // بدنه کشتی (استوانه کشیده)
    const hullGeometry = new THREE.CylinderGeometry(size * 1.0, size * 1.2, size * 3.5, 8);
    const hullMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.95,
        emissive: color,
        emissiveIntensity: 0.7
    });
    const hull = new THREE.Mesh(hullGeometry, hullMaterial);
    hull.rotation.z = Math.PI / 2;
    group.add(hull);
    
    // عرشه (مستطیل)
    const deckGeometry = new THREE.BoxGeometry(size * 2.5, size * 0.2, size * 3.5);
    const deckMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.9,
        emissive: color,
        emissiveIntensity: 0.6
    });
    const deck = new THREE.Mesh(deckGeometry, deckMaterial);
    deck.position.y = size * 0.6;
    group.add(deck);
    
    // حلقه چرخان
    const ringGeometry = new THREE.RingGeometry(size * 1.8, size * 2.4, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
        emissive: color,
        emissiveIntensity: 0.3
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = -Math.PI / 2;
    ring.userData.rotate = true;
    ring.userData.rotationSpeed = 0.02;
    group.add(ring);
    
    // هاله نور
    const glowGeometry = new THREE.CircleGeometry(size * 5, 64);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
        emissive: color,
        emissiveIntensity: 0.2
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.rotation.x = -Math.PI / 2;
    group.add(glow);
    
    // نور نقطه‌ای
    const pointLight = new THREE.PointLight(color, 1.0, 0.3);
    group.add(pointLight);
    
    group.userData.rotateRings = true;
    group.userData.rings = [ring];
    
    return group;
}

// ایجاد سرباز (برای نیروی زمینی)
function createSoldierMarker(color = 0x64748b, size = 0.006) {
    const group = new THREE.Group();
    
    // بدن سرباز (استوانه)
    const bodyGeometry = new THREE.CylinderGeometry(size * 0.6, size * 0.6, size * 1.5, 8);
    const bodyMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.95,
        emissive: color,
        emissiveIntensity: 0.6
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = size * 0.75;
    group.add(body);
    
    // سر (کره)
    const headGeometry = new THREE.SphereGeometry(size * 0.5, 8, 8);
    const headMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.9,
        emissive: color,
        emissiveIntensity: 0.7
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = size * 1.75;
    group.add(head);
    
    // حلقه چرخان
    const ringGeometry = new THREE.RingGeometry(size * 1.2, size * 1.6, 24);
    const ringMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
        emissive: color,
        emissiveIntensity: 0.3
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = -Math.PI / 2;
    ring.userData.rotate = true;
    ring.userData.rotationSpeed = 0.025;
    group.add(ring);
    
    // هاله نور
    const glowGeometry = new THREE.CircleGeometry(size * 3, 64);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide,
        emissive: color,
        emissiveIntensity: 0.15
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.rotation.x = -Math.PI / 2;
    group.add(glow);
    
    // نور نقطه‌ای
    const pointLight = new THREE.PointLight(color, 0.8, 0.2);
    pointLight.position.set(0, size * 1.0, 0);
    group.add(pointLight);
    
    group.userData.rotateRings = true;
    group.userData.rings = [ring];
    
    return group;
}

// نمایش گمرکات روی کره
function showCustomsOnGlobe() {
    if (!window.resourcesGlobeObjects || !window.resourcesGlobeObjects.earth) return;
    
    const { earth } = window.resourcesGlobeObjects;
    
    // پاک کردن مارکرهای قبلی
    hideAllFacilities();
    
    if (!facilityMarkersGroup) {
        facilityMarkersGroup = new THREE.Group();
        facilityMarkersGroup.name = 'facilityMarkers';
        earth.add(facilityMarkersGroup);
    }
    
    // اضافه کردن گمرکات همه کشورها
    Object.entries(countriesData).forEach(([code, data]) => {
        if (data.customs && Array.isArray(data.customs)) {
            data.customs.forEach(customs => {
                if (customs.coords && customs.coords.length === 2) {
                    const [lat, lng] = customs.coords;
                    const marker = createNeonMarker(getFacilityColor('customs'), 0.008, 'customs'); // طلایی
                    
                    // تبدیل به مختصات 3D
                    const phi = (90 - lat) * (Math.PI / 180);
                    const theta = (lng + 180) * (Math.PI / 180);
                    const radius = 1.005;
                    
                    const x = -radius * Math.sin(phi) * Math.cos(theta);
                    const y = radius * Math.cos(phi);
                    const z = radius * Math.sin(phi) * Math.sin(theta);
                    
                    marker.position.set(x, y, z);
                    
                    // چرخاندن المان به سمت بالا (عمود بر سطح کره)
                    const normal = new THREE.Vector3(x, y, z).normalize();
                    marker.lookAt(normal.multiplyScalar(2).add(marker.position));
                    marker.rotateX(Math.PI / 2); // 90 درجه برای دیده شدن از بالا
                    
                    // ذخیره اطلاعات
                    marker.userData = {
                        type: 'customs',
                        country: code,
                        countryName: data.name,
                        name: customs.name || 'گمرک',
                        coords: [lat, lng],
                        workingHours: customs.workingHours || '24/7',
                        description: customs.description || ''
                    };
                    
                    // اضافه کردن event listener
                    marker.children[0].userData = marker.userData;
                    marker.children[0].raycast = function(raycaster, intersects) {
                        const geometry = this.geometry;
                        const material = this.material;
                        const matrixWorld = this.matrixWorld;
                        const sphere = new THREE.Sphere(this.position, 0.01);
                        if (raycaster.ray.intersectSphere(sphere, new THREE.Vector3())) {
                            intersects.push({
                                distance: raycaster.ray.origin.distanceTo(this.position),
                                point: raycaster.ray.origin.clone(),
                                object: this
                            });
                        }
                    };
                    
                    facilityMarkersGroup.add(marker);
                }
            });
        }
    });
    
    console.log('🛃 گمرکات روی نقشه نمایش داده شدند');
}

function hideCustomsOnGlobe() {
    if (facilityMarkersGroup) {
        const customsMarkers = facilityMarkersGroup.children.filter(child => 
            child.userData && child.userData.type === 'customs'
        );
        customsMarkers.forEach(marker => {
            facilityMarkersGroup.remove(marker);
            marker.traverse((child) => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) child.material.dispose();
                if (child instanceof THREE.Light) child.dispose();
            });
        });
    }
}

function hideAllFacilities() {
    if (facilityMarkersGroup) {
        // فقط المان‌های خاص را پاک کن، نه همه
        const toRemove = [];
        facilityMarkersGroup.children.forEach(child => {
            if (child.userData && child.userData.type) {
                toRemove.push(child);
            }
        });
        toRemove.forEach(child => {
            facilityMarkersGroup.remove(child);
            child.traverse((obj) => {
                if (obj.geometry) obj.geometry.dispose();
                if (obj.material) obj.material.dispose();
                if (obj instanceof THREE.Light) obj.dispose();
            });
        });
    }
}

// نمایش پالایشگاه‌ها
function showRefineriesOnGlobe() {
    if (!window.resourcesGlobeObjects || !window.resourcesGlobeObjects.earth) return;
    
    if (!facilityMarkersGroup) {
        facilityMarkersGroup = new THREE.Group();
        facilityMarkersGroup.name = 'facilityMarkers';
        window.resourcesGlobeObjects.earth.add(facilityMarkersGroup);
    }
    
    Object.entries(countriesData).forEach(([code, data]) => {
        if (data.refineries && Array.isArray(data.refineries)) {
            data.refineries.forEach(refinery => {
                if (refinery.coords && refinery.coords.length === 2) {
                    addFacilityMarker(refinery, code, data.name, 'refinery', getFacilityColor('refinery'));
                }
            });
        }
    });
}

// نمایش کارخانه‌ها
function showFactoriesOnGlobe() {
    if (!window.resourcesGlobeObjects || !window.resourcesGlobeObjects.earth) return;
    
    if (!facilityMarkersGroup) {
        facilityMarkersGroup = new THREE.Group();
        facilityMarkersGroup.name = 'facilityMarkers';
        window.resourcesGlobeObjects.earth.add(facilityMarkersGroup);
    }
    
    Object.entries(countriesData).forEach(([code, data]) => {
        if (data.factories && Array.isArray(data.factories)) {
            data.factories.forEach(factory => {
                if (factory.coords && factory.coords.length === 2) {
                    addFacilityMarker(factory, code, data.name, 'factory', getFacilityColor('factory'));
                }
            });
        }
    });
}

// نمایش معادن
function showMinesOnGlobe() {
    if (!window.resourcesGlobeObjects || !window.resourcesGlobeObjects.earth) return;
    
    if (!facilityMarkersGroup) {
        facilityMarkersGroup = new THREE.Group();
        facilityMarkersGroup.name = 'facilityMarkers';
        window.resourcesGlobeObjects.earth.add(facilityMarkersGroup);
    }
    
    Object.entries(countriesData).forEach(([code, data]) => {
        if (data.mines && Array.isArray(data.mines)) {
            data.mines.forEach(mine => {
                if (mine.coords && mine.coords.length === 2) {
                    addFacilityMarker(mine, code, data.name, 'mine', getFacilityColor('mine'));
                }
            });
        }
    });
}

// نمایش بنادر
function showPortsOnGlobe() {
    if (!window.resourcesGlobeObjects || !window.resourcesGlobeObjects.earth) return;
    
    if (!facilityMarkersGroup) {
        facilityMarkersGroup = new THREE.Group();
        facilityMarkersGroup.name = 'facilityMarkers';
        window.resourcesGlobeObjects.earth.add(facilityMarkersGroup);
    }
    
    Object.entries(countriesData).forEach(([code, data]) => {
        if (data.ports && Array.isArray(data.ports)) {
            data.ports.forEach(port => {
                if (port.coords && port.coords.length === 2) {
                    addFacilityMarker(port, code, data.name, 'port', getFacilityColor('port'));
                }
            });
        }
    });
}

// نمایش سکوهای نفتی
function showOilRigsOnGlobe() {
    if (!window.resourcesGlobeObjects || !window.resourcesGlobeObjects.earth) return;
    
    if (!facilityMarkersGroup) {
        facilityMarkersGroup = new THREE.Group();
        facilityMarkersGroup.name = 'facilityMarkers';
        window.resourcesGlobeObjects.earth.add(facilityMarkersGroup);
    }
    
    Object.entries(countriesData).forEach(([code, data]) => {
        if (data.oilRigs && Array.isArray(data.oilRigs)) {
            data.oilRigs.forEach(rig => {
                if (rig.coords && rig.coords.length === 2) {
                    addFacilityMarker(rig, code, data.name, 'oil-rig', getFacilityColor('oil-rig'));
                }
            });
        }
    });
}

// تابع مشترک برای اضافه کردن المان
function addFacilityMarker(facility, countryCode, countryName, type, color) {
    const [lat, lng] = facility.coords;
    const marker = createNeonMarker(color, 0.008, type);
    
    // تبدیل به مختصات 3D
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const radius = 1.005;
    
    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    
    marker.position.set(x, y, z);
    
    // چرخاندن المان به سمت بالا
    const normal = new THREE.Vector3(x, y, z).normalize();
    marker.lookAt(normal.multiplyScalar(2).add(marker.position));
    marker.rotateX(Math.PI / 2);
    
    // ذخیره اطلاعات
    marker.userData = {
        type: type,
        country: countryCode,
        countryName: countryName,
        name: facility.name || type,
        coords: [lat, lng],
        workingHours: facility.workingHours || '24/7',
        description: facility.description || '',
        capacity: facility.capacity || '',
        phone: facility.phone || ''
    };
    
    facilityMarkersGroup.add(marker);
}

// نمایش popup روی کره برای المان‌ها - با اطلاعات کامل
function showFacilityPopup(facilityData, worldPoint, container, camera) {
    // حذف popup قبلی
    if (globePopup) {
        globePopup.remove();
        globePopup = null;
    }
    
    // ایجاد popup جدید
    globePopup = document.createElement('div');
    globePopup.className = 'globe-facility-popup';
    
    // محتوای popup بر اساس نوع المان
    const iconMap = {
        'customs': '🛃',
        'refinery': '🏭',
        'factory': '🏭',
        'mine': '⛏️',
        'oil-rig': '🛢️',
        'port': '⚓',
        'conflict': '⚔️',
        'tank': '🚛',
        'military-air': '✈️',
        'military-ground': '🚛',
        'military-navy': '🚢',
        'soldier': '👤',
        'aircraft': '✈️',
        'ship': '🚢',
        'university': '🎓',
        'historical': '🏛️',
        'weather': '🌤️',
        'earthquake': '🌋',
        'forest': '🌲',
        'river': '🌊',
        'desert': '🏜️',
        'groundwater': '💧',
        'livestock': '🐄',
        'wildlife': '🦁',
        'marine': '🐋'
    };
    const icon = iconMap[facilityData.type] || '📍';
    
    const typeNames = {
        'customs': 'گمرک',
        'refinery': 'پالایشگاه',
        'factory': 'کارخانه',
        'mine': 'معدن',
        'oil-rig': 'سکوی نفتی',
        'port': 'بندر',
        'conflict': 'درگیری',
        'tank': 'تانک',
        'military-air': 'نیروی هوایی',
        'military-ground': 'نیروی زمینی',
        'military-navy': 'نیروی دریایی',
        'soldier': 'سرباز',
        'aircraft': 'هواپیمای جنگی',
        'ship': 'کشتی جنگی',
        'university': 'دانشگاه',
        'historical': 'مکان تاریخی',
        'weather': 'آب و هوا',
        'earthquake': 'زلزله',
        'forest': 'جنگل',
        'river': 'رودخانه',
        'desert': 'بیابان',
        'groundwater': 'آب زیرزمینی',
        'livestock': 'دام و طیور',
        'wildlife': 'حیوانات وحشی',
        'marine': 'حیوانات دریایی'
    };
    const typeName = typeNames[facilityData.type] || facilityData.type;
    
    let content = `
        <div class="popup-header">
            <span class="popup-icon">${icon}</span>
            <div class="popup-title-group">
                <h4>${facilityData.name}</h4>
                <span class="popup-type">${typeName}</span>
            </div>
            <button class="popup-close" onclick="closeGlobeFacilityPopup()">×</button>
        </div>
        <div class="popup-body">
            <div class="popup-info-row">
                <span class="label">🌍 کشور:</span>
                <span class="value">${facilityData.countryName || facilityData.country}</span>
            </div>
            ${facilityData.workingHours ? `
            <div class="popup-info-row">
                <span class="label">🕐 ساعات کاری:</span>
                <span class="value">${facilityData.workingHours}</span>
            </div>
            ` : ''}
            ${facilityData.capacity ? `
            <div class="popup-info-row">
                <span class="label">📊 ظرفیت:</span>
                <span class="value">${facilityData.capacity}</span>
            </div>
            ` : ''}
            ${facilityData.description ? `
            <div class="popup-info-row popup-description">
                <span class="label">📝 توضیحات:</span>
                <span class="value">${facilityData.description}</span>
            </div>
            ` : ''}
            ${facilityData.phone ? `
            <div class="popup-info-row">
                <span class="label">📞 تماس:</span>
                <span class="value">${facilityData.phone}</span>
            </div>
            ` : ''}
            ${facilityData.rank ? `
            <div class="popup-info-row">
                <span class="label">🏆 رتبه:</span>
                <span class="value">#${facilityData.rank}</span>
            </div>
            ` : ''}
            ${facilityData.students ? `
            <div class="popup-info-row">
                <span class="label">👥 دانشجویان:</span>
                <span class="value">${facilityData.students.toLocaleString()}</span>
            </div>
            ` : ''}
            ${facilityData.year ? `
            <div class="popup-info-row">
                <span class="label">📅 سال:</span>
                <span class="value">${facilityData.year > 0 ? facilityData.year + ' میلادی' : Math.abs(facilityData.year) + ' قبل از میلاد'}</span>
            </div>
            ` : ''}
            ${facilityData.intensity ? `
            <div class="popup-info-row">
                <span class="label">⚔️ شدت:</span>
                <span class="value">${facilityData.intensity === 'war' ? 'جنگ' : facilityData.intensity === 'tension' ? 'تنش' : 'درگیری'}</span>
            </div>
            ` : ''}
            ${facilityData.opponentName ? `
            <div class="popup-info-row">
                <span class="label">🎯 مقابل:</span>
                <span class="value">${facilityData.opponentName}</span>
            </div>
            ` : ''}
            ${facilityData.since ? `
            <div class="popup-info-row">
                <span class="label">📅 از سال:</span>
                <span class="value">${facilityData.since}</span>
            </div>
            ` : ''}
            ${facilityData.aircraft ? `
            <div class="popup-info-row">
                <span class="label">✈️ هواپیما:</span>
                <span class="value">${facilityData.aircraft.toLocaleString()}</span>
            </div>
            ` : ''}
            ${facilityData.tanks ? `
            <div class="popup-info-row">
                <span class="label">🚛 تانک:</span>
                <span class="value">${facilityData.tanks.toLocaleString()}</span>
            </div>
            ` : ''}
            ${facilityData.soldiers ? `
            <div class="popup-info-row">
                <span class="label">👤 سرباز:</span>
                <span class="value">${facilityData.soldiers.toLocaleString()}</span>
            </div>
            ` : ''}
            ${facilityData.ships ? `
            <div class="popup-info-row">
                <span class="label">🚢 کشتی:</span>
                <span class="value">${facilityData.ships.toLocaleString()}</span>
            </div>
            ` : ''}
            ${facilityData.submarines ? `
            <div class="popup-info-row">
                <span class="label">🌊 زیردریایی:</span>
                <span class="value">${facilityData.submarines.toLocaleString()}</span>
            </div>
            ` : ''}
            ${facilityData.temp !== undefined ? `
            <div class="popup-info-row">
                <span class="label">🌡️ دما:</span>
                <span class="value">${facilityData.temp}°C</span>
            </div>
            ` : ''}
            ${facilityData.condition ? `
            <div class="popup-info-row">
                <span class="label">☁️ وضعیت:</span>
                <span class="value">${facilityData.condition}</span>
            </div>
            ` : ''}
            ${facilityData.humidity !== undefined ? `
            <div class="popup-info-row">
                <span class="label">💧 رطوبت:</span>
                <span class="value">${facilityData.humidity}%</span>
            </div>
            ` : ''}
            ${facilityData.magnitude !== undefined ? `
            <div class="popup-info-row">
                <span class="label">📊 بزرگی:</span>
                <span class="value">${facilityData.magnitude} ریشتر</span>
            </div>
            ` : ''}
            ${facilityData.date ? `
            <div class="popup-info-row">
                <span class="label">📅 تاریخ:</span>
                <span class="value">${facilityData.date}</span>
            </div>
            ` : ''}
            ${facilityData.depth !== undefined ? `
            <div class="popup-info-row">
                <span class="label">⬇️ عمق:</span>
                <span class="value">${facilityData.depth} کیلومتر</span>
            </div>
            ` : ''}
            ${facilityData.area !== undefined ? `
            <div class="popup-info-row">
                <span class="label">📐 مساحت:</span>
                <span class="value">${facilityData.area.toLocaleString()} کیلومتر مربع</span>
            </div>
            ` : ''}
            ${facilityData.age !== undefined ? `
            <div class="popup-info-row">
                <span class="label">⏳ قدمت:</span>
                <span class="value">${facilityData.age} ${facilityData.age > 1000 ? 'سال' : 'میلیون سال'}</span>
            </div>
            ` : ''}
            ${facilityData.forestType ? `
            <div class="popup-info-row">
                <span class="label">🌳 نوع:</span>
                <span class="value">${facilityData.forestType}</span>
            </div>
            ` : ''}
            ${facilityData.length !== undefined ? `
            <div class="popup-info-row">
                <span class="label">📏 طول:</span>
                <span class="value">${facilityData.length.toLocaleString()} کیلومتر</span>
            </div>
            ` : ''}
            ${facilityData.temperature !== undefined ? `
            <div class="popup-info-row">
                <span class="label">🌡️ دما:</span>
                <span class="value">${facilityData.temperature}°C</span>
            </div>
            ` : ''}
            ${facilityData.volume !== undefined ? `
            <div class="popup-info-row">
                <span class="label">💧 حجم:</span>
                <span class="value">${facilityData.volume.toLocaleString()} کیلومتر مکعب</span>
            </div>
            ` : ''}
            ${facilityData.depth !== undefined && facilityData.type === 'groundwater' ? `
            <div class="popup-info-row">
                <span class="label">⬇️ عمق:</span>
                <span class="value">${facilityData.depth} متر</span>
            </div>
            ` : ''}
            ${facilityData.count !== undefined ? `
            <div class="popup-info-row">
                <span class="label">🔢 تعداد:</span>
                <span class="value">${facilityData.count.toLocaleString()}</span>
            </div>
            ` : ''}
            <div class="popup-info-row">
                <span class="label">📍 مختصات:</span>
                <span class="value">${facilityData.coords && facilityData.coords.length >= 2 ? `${facilityData.coords[0].toFixed(4)}, ${facilityData.coords[1].toFixed(4)}` : 'نامشخص'}</span>
            </div>
        </div>
    `;
    
    globePopup.innerHTML = content;
    container.appendChild(globePopup);
    
    // موقعیت popup بر اساس موقعیت 3D
    const updatePopupPosition = () => {
        if (!globePopup || !camera) return;
        
        // تبدیل نقطه 3D به موقعیت صفحه
        const vector = worldPoint.clone();
        vector.project(camera);
        
        const x = (vector.x * 0.5 + 0.5) * container.clientWidth;
        const y = (-vector.y * 0.5 + 0.5) * container.clientHeight;
        
        // تنظیم موقعیت با offset برای نمایش کنار المان
        const offsetX = 15;
        const offsetY = -10;
        
        globePopup.style.left = (x + offsetX) + 'px';
        globePopup.style.top = (y + offsetY) + 'px';
        
        // اگر popup خارج از صفحه است، مخفی کن
        if (x < -50 || x > container.clientWidth + 50 || y < -50 || y > container.clientHeight + 50) {
            globePopup.style.opacity = '0';
            globePopup.style.pointerEvents = 'none';
        } else {
            globePopup.style.opacity = '1';
            globePopup.style.pointerEvents = 'auto';
        }
    };
    
    updatePopupPosition();
    
    // آپدیت موقعیت در هر فریم
    const updateLoop = () => {
        if (globePopup && globePopup.parentNode) {
            updatePopupPosition();
            requestAnimationFrame(updateLoop);
        }
    };
    updateLoop();
}

// بستن popup
window.closeGlobeFacilityPopup = function() {
    if (globePopup) {
        globePopup.remove();
        globePopup = null;
    }
};

// نمایش/مخفی کردن راهنما
window.toggleLegend = function() {
    const legend = document.getElementById('globeLegend');
    const items = document.getElementById('legendItems');
    const toggle = legend?.querySelector('.legend-toggle');
    
    if (!legend || !items) return;
    
    if (items.style.display === 'none') {
        items.style.display = 'flex';
        if (toggle) toggle.textContent = '−';
    } else {
        items.style.display = 'none';
        if (toggle) toggle.textContent = '+';
    }
};

// Export توابع
window.populateCountryList = populateCountryList;
window.selectCountry = selectCountry;
window.closeCountryInfo = closeCountryInfo;
window.showTradeLine = showTradeLine;
window.showAllTradeLines = showAllTradeLines;
window.setupResourcesGlobePanels = setupResourcesGlobePanels;

// تابع برای زوم روی یک نقطه روی کره
window.zoomToLocation = function(lat, lng) {
    console.log(`🎯 زوم به: ${lat}, ${lng}`);
    // این تابع بعداً برای زوم به نقطه خاص پیاده‌سازی می‌شود
};

// راه‌اندازی پنل‌های کره بزرگ
function setupGlobePanels() {
    populateMarketList();
    setupMarketSelector();
    setupGlobeFabMenus();
}

// پر کردن لیست بازارها در پنل انتخاب
function populateMarketList() {
    const listContainer = document.getElementById('marketSelectList');
    if (!listContainer || typeof marketData === 'undefined') return;
    
    listContainer.innerHTML = '';
    
    marketData.forEach((market, index) => {
        const statusColor = getMarketStatusColor(market);
        let statusClass = 'closed';
        if (statusColor === 0x22c55e) statusClass = 'open';
        else if (statusColor === 0xfbbf24) statusClass = 'opening';
        else if (statusColor === 0xf97316) statusClass = 'closing';
        
        const item = document.createElement('div');
        item.className = 'market-select-item';
        item.innerHTML = `
            <span class="market-name">${market.name}</span>
            <span class="market-status-dot ${statusClass}"></span>
        `;
        item.addEventListener('click', () => {
            selectMarketFromList(market, index);
        });
        listContainer.appendChild(item);
    });
}

// انتخاب بازار از لیست
function selectMarketFromList(market, index) {
    console.log('📍 انتخاب بازار:', market.name);
    
    // بستن پنل لیست بازارها (هر دو کلاس)
    const panel = document.getElementById('marketSelectPanel');
    if (panel) {
        panel.classList.remove('visible');
        panel.classList.remove('active');
    }
    
    // دسترسی به scene کره مالی
    const globeScene = simpleGlobeScenes['financial'];
    if (!globeScene) return;
    
    // توقف چرخش اتوماتیک
    if (globeScene.stopRotate) globeScene.stopRotate();
    
    // زوم به بازار
    zoomToMarker(market, globeScene.camera, globeScene.controls, globeScene.earth);
    
    // نمایش popup بازار با استایل جدید
    const container = document.getElementById('financialGlobeContainer');
    if (container) {
        showMarketPopup(market, container);
    }
}

// راه‌اندازی دکمه انتخاب بازار
function setupMarketSelector() {
    const btn = document.getElementById('marketSelectorBtn');
    const panel = document.getElementById('marketSelectPanel');
    const searchInput = document.getElementById('marketSearchInput');
    
    if (btn && panel) {
        btn.addEventListener('click', () => {
            panel.classList.toggle('visible');
            populateMarketList(); // آپدیت وضعیت‌ها
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const items = document.querySelectorAll('.market-select-item');
            items.forEach(item => {
                const name = item.querySelector('.market-name').textContent.toLowerCase();
                item.style.display = name.includes(query) ? 'flex' : 'none';
            });
        });
    }
    
    // بستن پنل با کلیک خارج
    document.addEventListener('click', (e) => {
        if (panel && !panel.contains(e.target) && btn && !btn.contains(e.target)) {
            panel.classList.remove('visible');
        }
    });
}

// راه‌اندازی منوهای fab کره‌ها
function setupGlobeFabMenus() {
    // منوی کره مالی
    const financialFab = document.getElementById('financialGlobeFab');
    if (financialFab) {
        const fabBtn = financialFab.querySelector('.globe-fab-btn');
        if (fabBtn) {
            fabBtn.addEventListener('click', () => {
                financialFab.classList.toggle('active');
            });
        }
        
        financialFab.querySelectorAll('.fab-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                handleFinancialFabAction(action);
            });
        });
    }
    
    // منوی کره منابع
    const resourcesFab = document.getElementById('resourcesGlobeFab');
    if (resourcesFab) {
        const fabBtn = resourcesFab.querySelector('.globe-fab-btn');
        if (fabBtn) {
            fabBtn.addEventListener('click', () => {
                resourcesFab.classList.toggle('active');
            });
        }
        
        resourcesFab.querySelectorAll('.fab-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                const action = btn.dataset.action;
                
                if (filter) {
                    handleResourcesFilter(filter, btn);
                } else if (action) {
                    handleResourcesFabAction(action);
                }
            });
        });
    }
}

// پردازش عملیات fab کره مالی
function handleFinancialFabAction(action) {
    switch(action) {
        case 'timezone':
            showTimezoneSettings();
            break;
        case 'filter':
            showMarketFilter();
            break;
        case 'notify':
            showNotificationSettings();
            break;
        case 'reset':
            resetGlobeView('financial');
            break;
    }
}

// پردازش فیلتر منابع
function handleResourcesFilter(filter, btn) {
    // حذف کلاس active از همه
    btn.closest('.globe-fab-options').querySelectorAll('.fab-option').forEach(b => {
        b.classList.remove('active');
    });
    btn.classList.add('active');
    
    console.log(`🔍 فیلتر منابع: ${filter}`);
    // اینجا می‌توان مارکرهای روی کره را فیلتر کرد
}

// پردازش عملیات fab کره منابع
function handleResourcesFabAction(action) {
    if (action === 'reset') {
        resetGlobeView('resources');
    }
}

// نمایش تنظیمات منطقه زمانی
function showTimezoneSettings() {
    alert('تنظیمات منطقه زمانی - در نسخه‌های بعدی');
}

// نمایش فیلتر بازارها
function showMarketFilter() {
    alert('فیلتر بازارها - در نسخه‌های بعدی');
}

// نمایش تنظیمات اعلان
function showNotificationSettings() {
    alert('تنظیمات اعلان‌ها - در نسخه‌های بعدی');
}

function resetGlobeView(type) {
    console.log(`🔄 بازیابی دید کره ${type}`);
    
    // برای کره‌های بزرگ
    if (type === 'financial' && window.financialGlobe) {
        window.financialGlobe.resetView();
        return;
    } else if (type === 'resources' && window.resourcesGlobe) {
        window.resourcesGlobe.resetView();
        return;
    }
    
    const globeScene = simpleGlobeScenes[type];
    if (!globeScene) return;
    
    // برگرداندن دوربین به موقعیت ایران
    if (globeScene.camera) {
        const iranLat = 32.4279;
        const iranLng = 53.6880;
        const phi = (90 - iranLat) * (Math.PI / 180);
        const theta = (iranLng + 180) * (Math.PI / 180);
        const distance = 2.5;
        const x = -distance * Math.sin(phi) * Math.cos(theta);
        const y = distance * Math.cos(phi);
        const z = distance * Math.sin(phi) * Math.sin(theta);
        
        const startPos = globeScene.camera.position.clone();
        const targetPos = new THREE.Vector3(x, y, z);
        const duration = 800;
        const startTime = Date.now();
        
        const animateReset = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            globeScene.camera.position.lerpVectors(startPos, targetPos, easeProgress);
            
            if (progress < 1) {
                requestAnimationFrame(animateReset);
            }
        };
        animateReset();
    }
    
    // ریست چرخش کره
    if (globeScene.earth) {
        globeScene.earth.rotation.y = 0;
    }
    
    // حذف popup باز
    const containerId = type === 'financial' ? 'financialGlobeContainer' : 'resourcesGlobeContainer';
    const container = document.getElementById(containerId);
    if (container) {
        const popup = container.querySelector('.market-3d-popup');
        if (popup) popup.remove();
    }
    
    // مخفی کردن پنل انتخاب بازار
    const panel = document.getElementById('marketSelectPanel');
    if (panel) panel.classList.remove('visible');
}

// توابع isUserLoggedIn و showLoginPrompt قبلاً در بالا تعریف شدند


// ==================== //
// 🏠 بخش خانه - کارت‌های قیمت
// ==================== //

// Flag برای جلوگیری از فراخوانی چندباره
let isGeneratingHomeCards = false;
let lastGeneratedView = null;

/**
 * 🏠 تولید ۴ کارت اصلی صفحه خانه
 */
function generateHomeCards() {
    // جلوگیری از فراخوانی همزمان
    if (isGeneratingHomeCards) {
        console.log('⏳ در حال تولید کارت‌ها...');
        return;
    }
    
    const container = document.getElementById('homeMainCards');
    if (!container) return;
    
    // اگر کارت‌ها قبلاً تولید شده‌اند، نیازی به تولید مجدد نیست
    if (container.children.length > 0) {
        console.log('✅ کارت‌ها قبلاً تولید شده‌اند');
        // اما opacity را بررسی کن - اگر مخفی است، نمایش بده
        if (container.style.opacity === '0' || container.style.opacity === '') {
            container.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
        }
        return;
    }
    
    isGeneratingHomeCards = true;
    lastGeneratedView = 'home';
    
    // ۴ کارت اصلی
    const mainItems = [
        {
            name: 'دلار آمریکا',
            symbol: 'USD',
            price: 58000,
            change: 0.3,
            chart: 'up'
        },
        {
            name: 'طلای ۱۸ عیار',
            symbol: 'GOLD',
            price: 2450000,
            change: -0.8,
            chart: 'down'
        },
        {
            name: 'بیت‌کوین',
            symbol: 'BTC',
            price: 42000,
            change: 2.1,
            chart: 'up'
        },
        {
            name: 'شاخص بورس',
            symbol: 'TEDPIX',
            price: 2150000,
            change: 0.7,
            chart: 'up'
        }
    ];
    
    // استفاده از transition نرم برای کارت‌ها
    container.style.opacity = '0';
    container.style.transform = 'translateY(10px)';
    
    container.innerHTML = '';
    
    mainItems.forEach((item, index) => {
        const card = createPriceCard(item);
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px)';
        container.appendChild(card);
        
        // نمایش تدریجی کارت‌ها
        setTimeout(() => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 50);
    });
    
    // نمایش container
    requestAnimationFrame(() => {
        container.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
        
        // آزاد کردن flag بعد از اتمام transition
        setTimeout(() => {
            isGeneratingHomeCards = false;
            console.log('🎴 ۴ کارت اصلی ایجاد شدند');
        }, 400);
    });
}

/**
 * 🎴 ایجاد یک کارت قیمت - طراحی جدید با نمودار SVG
 */
function createPriceCard(item) {
    const card = document.createElement('div');
    card.className = `price-card glass-card`;
    card.setAttribute('data-symbol', item.symbol);
    
    const changeClass = item.change >= 0 ? 'positive' : 'negative';
    const isUp = item.change >= 0;
    
    // تولید نمودار SVG مینی
    const miniChartSVG = generateMiniChartSVG(item.symbol, isUp);
    
    // تایم آخرین آپدیت
    const lastUpdate = getLastUpdateTime();
    
    card.innerHTML = `
        <div class="card-header">
            <h3>${item.name}</h3>
            <span class="price-change ${changeClass}">
                ${item.change >= 0 ? '+' : ''}${item.change.toFixed(1)}%
            </span>
        </div>
        <div class="card-content">
            <p class="current-price">${formatPrice(item.price, item.symbol)}</p>
            <div class="mini-chart ${item.chart}">${miniChartSVG}</div>
        </div>
        <div class="card-update-time">
            <span class="update-dot"></span>
            <span class="update-text">${lastUpdate}</span>
        </div>
    `;
    
    // اضافه کردن ایونت‌لیستنر برای کلیک - با چک لاگین
    card.addEventListener('click', () => {
        if (checkLoginRequired()) {
            openPriceDetail(item);
        }
    });
    
    return card;
}

/**
 * ⏱️ دریافت زمان آخرین آپدیت
 */
function getLastUpdateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

/**
 * 📊 تولید نمودار SVG مینی برای کارت - سبک کندل‌استیک حرفه‌ای
 */
function generateMiniChartSVG(symbol, isUp) {
    const seed = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const candleCount = 12; // تعداد کندل‌ها
    const candles = [];
    
    // تولید داده‌های کندل
    let basePrice = 50;
    
    for (let i = 0; i < candleCount; i++) {
        const noise = Math.sin(seed * 0.1 + i * 0.8) * 15 + Math.cos(seed * 0.2 + i * 0.5) * 10;
        const trend = isUp ? i * 1.5 : -i * 1.5;
        
        const open = basePrice + noise * 0.3;
        const close = open + (Math.random() - 0.5) * 8 + (isUp ? 2 : -2);
        const high = Math.max(open, close) + Math.random() * 4 + 1;
        const low = Math.min(open, close) - Math.random() * 4 - 1;
        
        candles.push({
            open: Math.max(10, Math.min(90, open + trend)),
            close: Math.max(10, Math.min(90, close + trend)),
            high: Math.max(10, Math.min(95, high + trend)),
            low: Math.max(5, Math.min(90, low + trend)),
            isGreen: close > open
        });
        
        basePrice = close;
    }
    
    // نرمال‌سازی
    const allValues = candles.flatMap(c => [c.open, c.close, c.high, c.low]);
    const minVal = Math.min(...allValues);
    const maxVal = Math.max(...allValues);
    const range = maxVal - minVal || 1;
    
    const normalize = (val) => 5 + ((val - minVal) / range) * 90;
    
    // ساخت SVG
    const width = 100;
    const height = 100;
    const candleWidth = width / candleCount * 0.6;
    const gap = width / candleCount * 0.4;
    
    let svgContent = '';
    
    candles.forEach((candle, i) => {
        const x = i * (candleWidth + gap) + gap / 2;
        const openY = height - normalize(candle.open);
        const closeY = height - normalize(candle.close);
        const highY = height - normalize(candle.high);
        const lowY = height - normalize(candle.low);
        
        const bodyTop = Math.min(openY, closeY);
        const bodyHeight = Math.abs(closeY - openY) || 1;
        const color = candle.isGreen ? '#22c55e' : '#ef4444';
        
        // فیتیله بالا و پایین
        svgContent += `<line x1="${x + candleWidth/2}" y1="${highY}" x2="${x + candleWidth/2}" y2="${bodyTop}" stroke="${color}" stroke-width="0.8" />`;
        svgContent += `<line x1="${x + candleWidth/2}" y1="${bodyTop + bodyHeight}" x2="${x + candleWidth/2}" y2="${lowY}" stroke="${color}" stroke-width="0.8" />`;
        
        // بدنه کندل
        svgContent += `<rect x="${x}" y="${bodyTop}" width="${candleWidth}" height="${bodyHeight}" fill="${candle.isGreen ? color : color}" rx="0.5" />`;
    });
    
    // اضافه کردن خط روند
    const trendPoints = candles.map((c, i) => {
        const x = i * (candleWidth + gap) + gap / 2 + candleWidth / 2;
        const y = height - normalize((c.open + c.close) / 2);
        return `${x},${y}`;
    });
    
    const uniqueId = `trend-${symbol}-${Date.now()}`;
    const trendColor = isUp ? '#22c55e' : '#ef4444';
    
    return `
        <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" style="width:100%;height:100%;">
            <defs>
                <linearGradient id="${uniqueId}" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="${isUp ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}" />
                    <stop offset="100%" stop-color="transparent" />
                </linearGradient>
            </defs>
            <!-- ناحیه پس‌زمینه -->
            <polygon points="0,${height} ${trendPoints.join(' ')} ${width},${height}" fill="url(#${uniqueId})" />
            <!-- کندل‌ها -->
            ${svgContent}
            <!-- خط روند -->
            <polyline points="${trendPoints.join(' ')}" fill="none" stroke="${trendColor}" stroke-width="1" stroke-opacity="0.5" stroke-dasharray="2,2" />
        </svg>
    `;
}

/**
 * 🔐 چک کردن نیاز به لاگین
 * ⚠️ فعلاً غیرفعال - برای تست سریع
 */
function checkLoginRequired() {
    // TODO: بعداً فعال کنید
    // const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    // if (!isLoggedIn) {
    //     showLoginPrompt();
    //     return false;
    // }
    return true; // فعلاً همیشه true برمیگردونه
}

/**
 * 🔑 نمایش پیام نیاز به لاگین
 */
function showLoginPrompt() {
    // ایجاد مودال لاگین
    const existingPrompt = document.getElementById('loginPromptModal');
    if (existingPrompt) {
        existingPrompt.classList.add('active');
        return;
    }
    
    const promptModal = document.createElement('div');
    promptModal.id = 'loginPromptModal';
    promptModal.className = 'login-prompt-modal';
    promptModal.innerHTML = `
        <div class="login-prompt-content">
            <div class="login-prompt-icon">🔐</div>
            <h3>نیاز به ورود</h3>
            <p>برای مشاهده جزئیات و نمودارها لطفاً وارد حساب کاربری خود شوید.</p>
            <div class="login-prompt-buttons">
                <button class="btn-login-prompt" onclick="openLoginModal()">ورود / ثبت‌نام</button>
                <button class="btn-close-prompt" onclick="closeLoginPrompt()">بستن</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(promptModal);
    setTimeout(() => promptModal.classList.add('active'), 10);
}

/**
 * بستن مودال لاگین
 */
function closeLoginPrompt() {
    const prompt = document.getElementById('loginPromptModal');
    if (prompt) {
        prompt.classList.remove('active');
        setTimeout(() => prompt.remove(), 300);
    }
}

/**
 * باز کردن مودال لاگین اصلی
 */
function openLoginModal() {
    closeLoginPrompt();
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.classList.add('active');
    }
}

/**
 * 🎯 مدیریت تب‌های هایلایت در صفحات مختلف
 */
function setupHighlightPanels(triggerSelector, triggerAttr, panelSelector, panelAttr) {
    const triggers = document.querySelectorAll(triggerSelector);
    const panels = document.querySelectorAll(panelSelector);
    
    if (!triggers.length || !panels.length) return;
    
    const activate = (value) => {
        triggers.forEach(trigger => {
            trigger.classList.toggle('active', trigger.getAttribute(triggerAttr) === value);
        });
        
        panels.forEach(panel => {
            panel.classList.toggle('active', panel.getAttribute(panelAttr) === value);
        });
    };
    
    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const value = trigger.getAttribute(triggerAttr);
            activate(value);
        });
    });
    
    // فعال‌سازی اولیه
    const initialValue = triggers[0].getAttribute(triggerAttr);
    activate(initialValue);
}

/**
 * 🔍 باز کردن مودال جزئیات قیمت - نسخه حرفه‌ای
 */
function openPriceDetail(item) {
    console.log('🎯 مودال جدید فراخوانی شد برای:', item.name);
    
    const modalContent = document.getElementById('modalContent');
    const changeClass = item.change >= 0 ? 'positive' : 'negative';
    
    modalContent.innerHTML = `
        <div class="detail-header">
            <h2>${item.name} (${item.symbol})</h2>
            <div class="detail-price">
                <span class="price-large">${formatPrice(item.price, item.symbol)}</span>
                <span class="price-change ${changeClass}">${item.change >= 0 ? '+' : ''}${item.change}%</span>
            </div>
        </div>
        
        <div class="chart-controls">
            <select id="timeframeSelect">
                <option value="1m">۱ دقیقه</option>
                <option value="5m">۵ دقیقه</option>
                <option value="1h">۱ ساعت</option>
                <option value="4h">۴ ساعت</option>
                <option value="1d">۱ روز</option>
                <option value="1w">۱ هفته</option>
            </select>
            
            <button class="chart-type-btn active" data-type="candle">کندل</button>
            <button class="chart-type-btn" data-type="line">خطی</button>
            <button class="chart-type-btn" data-type="area">ناحیه‌ای</button>
        </div>
        
        <div class="interactive-chart" id="interactiveChart">
            <div class="chart-placeholder">
                📊 نمودار تعاملی ${item.name}
                <div class="chart-tooltip" style="display: none;"></div>
            </div>
        </div>
        
        <div class="ai-analysis-live">
            <div class="analysis-header">
                <h4>🤖 تحلیل لحظه‌ای هوش مصنوعی</h4>
                <span class="live-indicator">● LIVE</span>
            </div>
            <div class="analysis-content" id="aiAnalysisContent">
                🔄 در حال دریافت تحلیل برای ${item.name}...
            </div>
            <div class="update-timer">
                🔄 آپدیت بعدی: <span id="updateCountdown">60</span> ثانیه
            </div>
        </div>
    `;
    
    // لود بنر تبلیغاتی
    loadModalAdBanner(item.symbol);
    
    // راه‌اندازی نمودار تعاملی
    setupInteractiveChart(item);
    
    // شروع تحلیل هوش مصنوعی
    startAIAnalysis(item);
    
    elements.priceModal.classList.add('active');
    
    console.log('✅ مودال با موفقیت باز شد');
}
/**
 * 🎴 لود بنر تبلیغاتی در مودال
 */
function loadModalAdBanner(symbol) {
    const adBanner = document.getElementById('modalAdBanner');
    
    const banners = [
        '<div class="ad-real" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; height: 100%; display: flex; align-items: center; justify-content: center; font-weight: bold;">🎯 تبلیغات ویژه</div>',
        '<div class="ad-real" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; height: 100%; display: flex; align-items: center; justify-content: center; font-weight: bold;">💎 پیشنهاد اختصاصی</div>'
    ];
    
    const randomBanner = banners[Math.floor(Math.random() * banners.length)];
    adBanner.innerHTML = randomBanner;
}

/**
 * 📊 راه‌اندازی نمودار تعاملی
 */
function setupInteractiveChart(item) {
    const chartElement = document.getElementById('interactiveChart');
    const tooltip = chartElement.querySelector('.chart-tooltip');
    
    // شبیه‌سازی حرکت موس روی نمودار
    chartElement.addEventListener('mousemove', (e) => {
        const rect = chartElement.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // محاسبه قیمت فرضی based on position
        const simulatedPrice = item.price * (0.95 + (y / rect.height) * 0.1);
        
        tooltip.style.display = 'block';
        tooltip.style.left = (x + 10) + 'px';
        tooltip.style.top = (y - 30) + 'px';
        tooltip.innerHTML = `💰 ${formatPrice(simulatedPrice, item.symbol)}`;
    });
    
    chartElement.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
    });
    
    // کنترل‌های نمودار
    setupChartControls();
}

/**
 * ⚙️ راه‌اندازی کنترل‌های نمودار
 */
function setupChartControls() {
    // تغییر تایم‌فریم
    document.getElementById('timeframeSelect').addEventListener('change', function() {
        console.log('تایم‌فریم تغییر کرد به:', this.value);
        // بعداً با API واقعی پر می‌شود
    });
    
    // تغییر نوع نمودار
    document.querySelectorAll('.chart-type-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.chart-type-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            console.log('نوع نمودار تغییر کرد به:', this.dataset.type);
        });
    });
}

/**
 * 🤖 شروع تحلیل هوش مصنوعی
 */
function startAIAnalysis(item) {
    const analysisContent = document.getElementById('aiAnalysisContent');
    const countdownElement = document.getElementById('updateCountdown');
    
    // تحلیل اولیه
    generateAIAnalysis(item);
    
    // تایمر آپدیت
    startAnalysisTimer(item, countdownElement);
}

/**
 * 🧠 تولید تحلیل هوش مصنوعی
 */
function generateAIAnalysis(item) {
    const analysisContent = document.getElementById('aiAnalysisContent');
    
    const analyses = {
        positive: [
            `📈 <strong>تحلیل فنی:</strong> ${item.name} روند صعودی قدرتمندی دارد.`,
            `💰 <strong>پیشنهاد:</strong> خرید در پولبک‌های کوچک توصیه می‌شود.`,
            `🎯 <strong>هدف قیمتی:</strong> مقاومت بعدی در ${formatPrice(item.price * 1.05, item.symbol)}`
        ],
        negative: [
            `📉 <strong>تحلیل فنی:</strong> ${item.name} تحت فشار فروش قرار دارد.`,
            `⚠️ <strong>پیشنهاد:</strong> انتظار برای سیگنال بهتر منطقی است.`,
            `🛡️ <strong>حمایت:</strong> سطح ${formatPrice(item.price * 0.95, item.symbol)} کلیدی است`
        ]
    };
    
    const analysisType = item.change >= 0 ? 'positive' : 'negative';
    const selectedAnalysis = analyses[analysisType];
    
    analysisContent.innerHTML = selectedAnalysis.map(item => 
        `<div class="analysis-item">${item}</div>`
    ).join('') + `
        <div class="analysis-source">
            <small>🔗 منبع: هوش مصنوعی LivePulse - آپدیت: ${new Date().toLocaleTimeString('fa-IR')}</small>
        </div>
    `;
}

/**
 * ⏱️ شروع تایمر تحلیل
 */
function startAnalysisTimer(item, countdownElement) {
    let timeLeft = 60;
    
    const timer = setInterval(() => {
        timeLeft--;
        countdownElement.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            generateAIAnalysis(item);
            timeLeft = 60;
        }
        
        // اگر مودال بسته شد، تایمر رو متوقف کن
        if (!elements.priceModal.classList.contains('active')) {
            clearInterval(timer);
        }
    }, 1000);
}

// ==================== //
// 🛠️ بخش ابزارها
// ==================== //

/**
 * 🛠️ فعال‌سازی ابزار مشخص
 */
function activateTool(toolId) {
    // مخفی کردن همه ابزارها
    document.querySelectorAll('.tool-section').forEach(tool => {
        tool.classList.remove('active-tool');
    });
    
    // 🆕 مطمئن شو محتوای ابزار نمایش داده بشه
    const toolsContent = document.querySelector('.tools-content');
    if (toolsContent) {
        toolsContent.style.display = 'block';
    }
    
    // فعال‌سازی ابزار انتخاب شده
    const targetTool = document.getElementById(toolId + 'Section');
    if (targetTool) {
        targetTool.classList.add('active-tool');
        appState.currentTool = toolId;
    }
    
    // آپدیت هایلایت‌های ابزار
    document.querySelectorAll('[data-tool]').forEach(circle => {
        circle.classList.remove('active');
    });
    document.querySelector(`[data-tool="${toolId}"]`).classList.add('active');
    
    // 🆕 اگر صندوق شخصی انتخاب شد، دارایی‌ها رو آپدیت کن
    if (toolId === 'personalFund') {
        updateAssetsDisplay();
    }
}

/**
 * 📊 آپدیت نمایش مجموع دارایی‌ها
 */
function updateAssetsDisplay() {
    document.getElementById('totalAssets').textContent = '۰ ریال';
    document.getElementById('goldAmount').textContent = '۰ گرم';
    document.getElementById('usdAmount').textContent = '۰ دلار';
    document.getElementById('btcAmount').textContent = '۰ BTC';
}

/**
 * 🥇 محاسبه قیمت طلا
 */
function calculateGoldPrice() {
    if (!checkUsageLimit('tools')) return;
    
    const weight = parseFloat(document.getElementById('goldWeight').value) || 0;
    const carat = parseInt(document.getElementById('goldCarat').value) || 24;
    const wage = parseFloat(document.getElementById('goldWage').value) || 0;
    
    if (weight <= 0) {
        elements.goldResult.innerHTML = '<div class="error">⚠️ لطفا وزن را وارد کنید</div>';
        return;
    }
    
    // قیمت پایه طلای ۲۴ عیار (تومان)
    const basePrice24 = 3750000;
    const caratRatio = carat / 24;
    const basePrice = basePrice24 * caratRatio * weight;
    const wageAmount = basePrice * (wage / 100);
    const finalPrice = basePrice + wageAmount;
    
    elements.goldResult.innerHTML = `
        <div class="success">
            <h4>💰 نتیجه محاسبه:</h4>
            <p>قیمت طلای ${carat} عیار: ${formatPrice(finalPrice, 'IRR')}</p>
            <p>وزن: ${weight} گرم</p>
            <p>اجرت: ${wage}%</p>
            <small>🕒 قیمت لحظه‌ای: ${formatPrice(basePrice24, 'IRR')} برای طلای ۲۴ عیار</small>
        </div>
    `;
    
    incrementUsage('tools');
}

/**
 * 💎 آنالیز الماس از روی عکس
 */
function analyzeDiamond() {
    if (!checkUsageLimit('tools')) return;
    
    const fileInput = document.getElementById('diamondImage');
    
    if (!fileInput.files.length) {
        elements.diamondResult.innerHTML = '<div class="error">⚠️ لطفا عکس الماس را انتخاب کنید</div>';
        return;
    }
    
    elements.diamondResult.innerHTML = `
        <div class="loading">
            🔍 در حال آنالیز تصویر...
        </div>
    `;
    
    // شبیه‌سازی پردازش تصویر
    setTimeout(() => {
        const results = {
            quality: 'عالی',
            carat: 1.2,
            color: 'D',
            clarity: 'IF',
            estimatedPrice: 85000000
        };
        
        elements.diamondResult.innerHTML = `
            <div class="success">
                <h4>💎 نتیجه آنالیز الماس:</h4>
                <p>کیفیت: ${results.quality}</p>
                <p>قیراط: ${results.carat}</p>
                <p>رنگ: ${results.color}</p>
                <p>شفافیت: ${results.clarity}</p>
                <p>💰 قیمت تخمینی: ${formatPrice(results.estimatedPrice, 'IRR')}</p>
                <small>📍 این تحلیل نمونه است. در نسخه نهایی از هوش مصنوعی استفاده می‌شود</small>
            </div>
        `;
        
        incrementUsage('tools');
    }, 2000);
}

/**
 * 🔄 تبدیل ارز
 */
function convertCurrency() {
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    const amount = parseFloat(document.getElementById('amount').value) || 0;
    
    if (amount <= 0) {
        elements.conversionResult.textContent = '⚠️ مبلغ را وارد کنید';
        return;
    }
    
    const fromRate = sampleData.exchangeRates[fromCurrency];
    const toRate = sampleData.exchangeRates[toCurrency];
    
    if (fromCurrency === 'IRR') {
        // تبدیل از ریال به ارز دیگر
        const result = amount / toRate;
        elements.conversionResult.textContent = `${result.toFixed(4)} ${toCurrency}`;
    } else if (toCurrency === 'IRR') {
        // تبدیل از ارز دیگر به ریال
        const result = amount * fromRate;
        elements.conversionResult.textContent = `${formatPrice(result, 'IRR')}`;
    } else {
        // تبدیل بین دو ارز خارجی
        const result = (amount * fromRate) / toRate;
        elements.conversionResult.textContent = `${result.toFixed(4)} ${toCurrency}`;
    }
}

/**
 * 🪙 آنالیز سکه قدیمی
 */
function analyzeCoin() {
    if (!checkUsageLimit('tools')) return;
    
    const fileInput = document.getElementById('coinImage');
    
    if (!fileInput.files.length) {
        elements.coinResult.innerHTML = '<div class="error">⚠️ لطفا عکس سکه را انتخاب کنید</div>';
        return;
    }
    
    elements.coinResult.innerHTML = `
        <div class="loading">
            🔍 در حال آنالیز سکه...
        </div>
    `;
    
    // شبیه‌سازی پردازش تصویر
    setTimeout(() => {
        const results = {
            type: 'سکه پهلوی',
            year: '۱۳۰۵',
            material: 'نقره',
            condition: 'خوب',
            estimatedPrice: 2500000
        };
        
        elements.coinResult.innerHTML = `
            <div class="success">
                <h4>🪙 نتیجه آنالیز سکه:</h4>
                <p>نوع: ${results.type}</p>
                <p>سال: ${results.year}</p>
                <p>جنس: ${results.material}</p>
                <p>وضعیت: ${results.condition}</p>
                <p>💰 قیمت تخمینی: ${formatPrice(results.estimatedPrice, 'IRR')}</p>
                <small>📍 این تحلیل نمونه است. در نسخه نهایی از هوش مصنوعی استفاده می‌شود</small>
            </div>
        `;
        
        incrementUsage('tools');
    }, 2000);
}

// ==================== //
// 📰 مدیریت سیستم اخبار //
// ==================== //

/**
 * 📡 لود اخبار بر اساس دسته‌بندی
 */
function loadNews(category = 'all') {
    const newsFeed = document.getElementById('newsFeed');
    
    if (!newsFeed) {
        console.warn('⚠️ newsFeed element پیدا نشد!');
        return;
    }
    
    // چک مجدد قبل از set innerHTML
    if (!newsFeed || !newsFeed.innerHTML) {
        console.warn('⚠️ newsFeed element معتبر نیست!');
        return;
    }
    
    // نمایش حالت لودینگ
    try {
        if (newsFeed) {
            newsFeed.innerHTML = `
            <div class="news-placeholder">
                <div class="loading-news">
                    <div class="spinner"></div>
                    <p>📡 در حال دریافت اخبار ${getCategoryName(category)}...</p>
                </div>
            </div>
        `;
        }
        
        // شبیه‌سازی دریافت اخبار
        setTimeout(() => {
            displayNews(generateSampleNews(category));
        }, 1500);
    } catch (error) {
        console.error('❌ خطا در loadNews:', error);
    }
}

/**
 * 🎴 نمایش اخبار در صفحه
 */
function displayNews(news) {
    const newsFeed = document.getElementById('newsFeed');
    
    if (!newsFeed) {
        console.warn('⚠️ newsFeed element پیدا نشد در displayNews!');
        return;
    }
    
    if (news.length === 0) {
        try {
            newsFeed.innerHTML = `
                <div class="news-placeholder">
                    <p>📭 خبری در این دسته‌بندی یافت نشد</p>
                </div>
            `;
        } catch (error) {
            console.error('❌ خطا در displayNews (خالی):', error);
        }
        return;
    }
    
    try {
        if (!newsFeed) {
            console.warn('⚠️ newsFeed element پیدا نشد!');
            return;
        }
        newsFeed.innerHTML = news.map(item => `
        <div class="news-card" data-category="${item.category}">
            <span class="news-category ${item.category}">${getCategoryName(item.category)}</span>
            <h3 class="news-title">${item.title}</h3>
            <p class="news-summary">${item.summary}</p>
            <div class="news-meta">
                <span class="news-source">${item.source}</span>
                <span class="news-time">${item.time}</span>
            </div>
        </div>
    `).join('');
    } catch (error) {
        console.error('❌ خطا در displayNews:', error);
    }
}

/**
 * 📋 تولید اخبار نمونه
 */
function generateSampleNews(category) {
    const sampleNews = {
        all: [
            {
                category: 'forex',
                title: 'بانک مرکزی اروپا سیاست پولی خود را تغییر داد',
                summary: 'نرخ بهره اصلی بدون تغییر باقی ماند اما سیگنال‌هایی از کاهش در آینده نزدیک مشاهده می‌شود.',
                source: 'ForexLive',
                time: '۲ ساعت پیش'
            },
            {
                category: 'crypto',
                title: 'بیت‌کوین به مرز ۴۵,۰۰۰ دلار نزدیک شد',
                summary: 'رشد ۵ درصدی در ۲۴ ساعت گذشته همراه با افزایش حجم معاملات.',
                source: 'CoinDesk',
                time: '۱ ساعت پیش'
            }
        ],
        forex: [
            {
                category: 'forex',
                title: 'دلار آمریکا در برابر یورو تقویت شد',
                summary: 'شاخص دلار ۰.۳ درصد رشد کرد در حالی که EUR/USD به ۱.۰۸۵۰ رسید.',
                source: 'Bloomberg',
                time: '۳۰ دقیقه پیش'
            }
        ],
        crypto: [
            {
                category: 'crypto',
                title: 'اتریوم رشد ۸ درصدی را تجربه کرد',
                summary: 'ارتقای شبکه و افزایش فعالیت‌های DeFi محرک اصلی رشد قیمت بوده است.',
                source: 'CryptoSlate',
                time: '۴۵ دقیقه پیش'
            }
        ]
    };
    
    return category === 'all' ? sampleNews.all : (sampleNews[category] || []);
}

/**
 * 🏷️ دریافت نام فارسی دسته‌بندی
 */
function getCategoryName(category) {
    const names = {
        'all': 'همه',
        'forex': 'فارکس',
        'crypto': 'رمزارز',
        'iran-stock': 'بورس ایران',
        'global-stock': 'بورس جهانی',
        'commodities': 'کالاها',
        'macro': 'اقتصاد کلان'
    };
    
    return names[category] || category;
}

/**
 * ⚙️ راه‌اندازی سیستم اخبار
 */
function setupNewsSystem() {
    // لود اخبار اولیه
    loadNews('all');
    
    // ایونت‌لیستنر برای فیلترها
    document.querySelectorAll('.news-filter').forEach(filter => {
        filter.addEventListener('click', function() {
            // آپدیت فیلتر فعال
            document.querySelectorAll('.news-filter').forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            // لود اخبار دسته‌بندی انتخاب شده
            const category = this.getAttribute('data-category');
            loadNews(category);
        });
    });
}

// راه‌اندازی سیستم اخبار هنگام لود صفحه
// این listener قبلاً در initializeLivePulse اجرا می‌شود
// برای جلوگیری از duplicate، این را comment می‌کنیم
// document.addEventListener('DOMContentLoaded', function() {
//     if (document.getElementById('newsView')) {
//         setupNewsSystem();
//     }
// });

// ==================== //
// 💬 بخش چت هوش مصنوعی
// ==================== //

/**
 * 💬 ارسال پیام به چت
 */
function sendChatMessage() {
    if (!checkUsageLimit('chat')) return;
    
    const message = elements.chatInput.value.trim();
    if (!message) return;
    
    // اضافه کردن پیام کاربر
    addChatMessage(message, 'user');
    elements.chatInput.value = '';
    
    // شبیه‌سازی پاسخ هوش مصنوعی
    simulateAIResponse(message);
    
    incrementUsage('chat');
    updateUsageDisplay();
}

/**
 * 🤖 شبیه‌سازی پاسخ هوش مصنوعی
 */
function simulateAIResponse(userMessage) {
    // نمایش وضعیت در حال پردازش
    const thinkingMessage = addChatMessage('🤔 در حال تحلیل سوال شما...', 'ai');
    
    setTimeout(() => {
        // حذف پیام "در حال پردازش"
        thinkingMessage.remove();
        
        // تولید پاسخ نمونه
        const responses = [
            `بر اساس تحلیل من از بازار، شرایط فعلی مناسب به نظر می‌رسد.`,
            `پیشنهاد می‌کنم در تصمیم‌گیری‌های مالی احتیاط کنید.`,
            `تحلیل تکنیکال نشان‌دهنده روند صعودی در کوتاه‌مدت است.`,
            `با توجه به اخبار اخیر، ممکن است نوساناتی در بازار ایجاد شود.`
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const fullResponse = `سوال شما: "${userMessage}"\n\n${randomResponse}\n\n📍 این پاسخ نمونه است و از n8n دریافت خواهد شد.`;
        
        addChatMessage(fullResponse, 'ai');
    }, 1500);
}

/**
 * 💬 اضافه کردن پیام به چت
 */
function addChatMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `${sender}-message`;
    messageDiv.innerHTML = `<p>${text}</p>`;
    
    elements.chatMessages.appendChild(messageDiv);
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
    
    return messageDiv;
}

// ==================== //
// ⚙️ ابزارهای کمکی
// ==================== //

/**
 * 💰 فرمت‌دهی قیمت
 */
function formatPrice(price, symbol) {
    if (symbol === 'IRR' || price > 1000) {
        return new Intl.NumberFormat('fa-IR').format(Math.round(price)) + ' تومان';
    } else if (price < 1) {
        return '$' + price.toFixed(4);
    } else {
        return '$' + new Intl.NumberFormat('en-US').format(price.toFixed(2));
    }
}

/**
 * ✅ بررسی محدودیت استفاده
 */
function checkUsageLimit(type) {
    if (appState.userUsage[type] >= 4) {
        alert(`⚠️ شما از ${type === 'chat' ? 'چت' : 'ابزار'} رایگان خود استفاده کرده‌اید. لطفا اشتراک خریداری کنید.`);
        return false;
    }
    return true;
}

/**
 * 📈 افزایش شمارنده استفاده
 */
function incrementUsage(type) {
    appState.userUsage[type]++;
    saveUserState();
}

/**
 * 🔢 آپدیت نمایش استفاده
 */
function updateUsageDisplay() {
    elements.chatUsage.textContent = appState.userUsage.chat;
}

// ==================== //
// 🎛️ تنظیم ایونت‌لیستنرها
// ==================== //

/**
 * 🎯 تنظیم همه ایونت‌لیستنرها
 */
function setupEventListeners() {
    // دکمه تغییر تم
    elements.themeToggle.addEventListener('click', toggleTheme);
    
    // دکمه ورود
    elements.loginBtn.addEventListener('click', () => {
        elements.loginModal.classList.add('active');
    });
    
    // 🆕 لوگو برای بازگشت به خانه
    elements.homeLogo.addEventListener('click', () => {
        showView('home');
    });
    
    // 📱 نوار ناوبری پایین
    setupBottomNavigation();
    
    // بستن مودال‌ها
    elements.closeLoginModal.addEventListener('click', () => {
        elements.loginModal.classList.remove('active');
    });
    
    elements.closeSubscriptionModal.addEventListener('click', () => {
        elements.subscriptionModal.classList.remove('active');
    });
    
    elements.closePriceModal.addEventListener('click', () => {
        elements.priceModal.classList.remove('active');
        appState.openModals = Math.max(0, appState.openModals - 1);
    });
    
    // بستن مودال با کلیک خارج
    elements.loginModal.addEventListener('click', (e) => {
        if (e.target === elements.loginModal || e.target.classList.contains('modal-overlay')) {
            elements.loginModal.classList.remove('active');
        }
    });

    elements.subscriptionModal.addEventListener('click', (e) => {
        if (e.target === elements.subscriptionModal || e.target.classList.contains('modal-overlay')) {
            elements.subscriptionModal.classList.remove('active');
        }
    });

    elements.priceModal.addEventListener('click', (e) => {
        if (e.target === elements.priceModal || e.target.classList.contains('modal-overlay')) {
            elements.priceModal.classList.remove('active');
            appState.openModals = Math.max(0, appState.openModals - 1);
        }
    });
    
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
            console.log(`🎯 دسته انتخاب شد: ${category}`);
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
        console.log(`🌍 کلیک روی دکمه: ${action}`);
        
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
                console.error('❌ تابع openResourcesGlobe پیدا نشد!');
                alert('سیستم کره‌ها در حال بارگذاری است...');
            }
        } else if (globeType) {
            // باز کردن سایر کره‌ها
            if (typeof open3DGlobe === 'function') {
                open3DGlobe(globeType);
            } else if (typeof window.open3DGlobe === 'function') {
                window.open3DGlobe(globeType);
            } else {
                console.error('❌ تابع open3DGlobe پیدا نشد!');
                alert('سیستم کره‌ها در حال بارگذاری است...');
            }
        }
    });
    
    // Handler برای دکمه‌های 3D در قسمت آرامش
    // جلوگیری از راه‌اندازی چندباره دکمه‌ها
    let buttons3DSetup = false;
    
    function setup3DGlobeButtons() {
        // پیدا کردن دکمه‌ها با استفاده از querySelector در پنل 3D
        const panel3d = document.querySelector('.relax-panel[data-relax-panel="3d"]');
        if (!panel3d) {
            console.warn('⚠️ پنل 3D پیدا نشد');
            return;
        }
        
        // پیدا کردن دکمه‌ها در پنل 3D
        const buttons = panel3d.querySelectorAll('button[data-globe]');
        console.log(`🔘 پیدا کردن ${buttons.length} دکمه 3D در پنل`);
        
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
                console.warn('⚠️ دکمه بدون data-globe:', btn);
                return;
            }
            
            console.log(`🌍 راه‌اندازی دکمه: ${globeType}`);
            
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
                
                console.log(`🌍 کلیک روی دکمه 3D: ${globeType}`);
                
                setTimeout(() => {
                    btn.disabled = false;
                }, 1000);
                
                if (globeType) {
                    if (typeof open3DGlobe === 'function') {
                        open3DGlobe(globeType);
                    } else if (typeof window.open3DGlobe === 'function') {
                        window.open3DGlobe(globeType);
                    } else {
                        console.error('❌ تابع open3DGlobe پیدا نشد!');
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
    
    // راه‌اندازی اولیه
    setTimeout(setup3DGlobeButtons, 1000);
    
    // راه‌اندازی مجدد وقتی پنل 3D فعال میشه
    const relaxView = document.getElementById('relaxView');
    if (relaxView) {
        // راه‌اندازی با MutationObserver
        const observer = new MutationObserver(() => {
            const panel3d = document.querySelector('.relax-panel[data-relax-panel="3d"]');
            if (panel3d && panel3d.classList.contains('active')) {
                console.log('🔄 پنل 3D فعال شد، راه‌اندازی مجدد دکمه‌ها...');
                setTimeout(setup3DGlobeButtons, 300);
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
                    console.log('🔄 کلیک روی هایلایت 3D، راه‌اندازی مجدد دکمه‌ها...');
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
                console.warn('خطا در پیدا کردن دکمه 3D:', err);
            }
        }
        
        if (btn) {
            e.preventDefault();
            e.stopPropagation();
            const globeType = btn.getAttribute('data-globe');
            console.log(`🌍 کلیک روی دکمه 3D (delegation): ${globeType}`, btn);
            
            if (globeType) {
                if (typeof open3DGlobe === 'function') {
                    open3DGlobe(globeType);
                } else if (typeof window.open3DGlobe === 'function') {
                    window.open3DGlobe(globeType);
                }
            }
        }
    }, true);
    
    // چت
    elements.sendMessage.addEventListener('click', sendChatMessage);
    elements.chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
    
    // فرم ورود
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        
        // شبیه‌سازی ورود موفق
        if (username && password) {
            alert('✅ ورود موفقیت‌آمیز بود!');
            elements.loginModal.classList.remove('active');
        } else {
            alert('⚠️ لطفا اطلاعات را کامل وارد کنید.');
        }
    });
    
    // دکمه خرید اشتراک
    document.getElementById('goToSubscription').addEventListener('click', () => {
        elements.loginModal.classList.remove('active');
        elements.subscriptionModal.classList.add('active');
    });
    
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
    
    // ارسال نظر
    document.getElementById('submitFeedback').addEventListener('click', () => {
        const feedback = document.getElementById('feedbackText').value;
        if (feedback.trim()) {
            alert('✅ نظر شما با موفقیت ثبت شد. با تشکر!');
            document.getElementById('feedbackText').value = '';
        } else {
            alert('⚠️ لطفا نظر خود را بنویسید.');
        }
    });
    
    // ابزارها
    elements.calculateGold.addEventListener('click', calculateGoldPrice);
    elements.analyzeDiamond.addEventListener('click', analyzeDiamond);
    elements.convertCurrency.addEventListener('click', convertCurrency);
    elements.analyzeCoin.addEventListener('click', analyzeCoin);
    
    // رویدادهای کره‌ها از طریق دکمه سیار مدیریت می‌شوند
    // (کدهای قبلی حذف شدند - دکمه‌های X جایشان را به منوی شیشه‌ای دادند)
    
    // بستن modal با کلیک روی overlay
    const financialModal = document.getElementById('financialGlobeModal');
    const resourcesModal = document.getElementById('resourcesGlobeModal');
    
    if (financialModal) {
        financialModal.addEventListener('click', (e) => {
            if (e.target === financialModal) {
                closeGlobeModal('financialGlobeModal');
            }
        });
    }
    
    if (resourcesModal) {
        resourcesModal.addEventListener('click', (e) => {
            if (e.target === resourcesModal) {
                closeGlobeModal('resourcesGlobeModal');
            }
        });
    }
    
    // آپلود عکس
    document.getElementById('diamondUploadArea').addEventListener('click', () => {
        document.getElementById('diamondImage').click();
    });
    
    document.getElementById('coinUploadArea').addEventListener('click', () => {
        document.getElementById('coinImage').click();
    });
    
    // نمایش نام فایل آپلود شده
    document.getElementById('diamondImage').addEventListener('change', function(e) {
        if (this.files.length > 0) {
            document.getElementById('diamondUploadArea').innerHTML = 
                `📁 ${this.files[0].name}`;
        }
    });
    
    document.getElementById('coinImage').addEventListener('change', function(e) {
        if (this.files.length > 0) {
            document.getElementById('coinUploadArea').innerHTML = 
                `📁 ${this.files[0].name}`;
        }
    });
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
    
    console.log(`🎯 ایونت‌لیستنر برای ${allPriceCards.length} کارت تنظیم شد`);
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


// ==================== //
// 🎠 اسلایدر سه‌بعدی حلقه‌ای - Carousel
// ==================== //

class Circular3DSlider {
    constructor() {
        this.slides = Array.from(document.querySelectorAll('.slide-item'));
        this.dots = Array.from(document.querySelectorAll('.dot'));
        this.prevBtn = document.getElementById('sliderPrevBtn');
        this.nextBtn = document.getElementById('sliderNextBtn');
        
        this.currentIndex = 0;
        this.totalSlides = this.slides.length;
        this.isAnimating = false;
        this.autoPlayInterval = null;
        this.radius = 600;
        this.angleStep = 360 / this.totalSlides;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateSlider();
        this.autoPlay();
    }
    
    setupEventListeners() {
        // حذف تمام event listenerهای قبلی
        this.prevBtn.replaceWith(this.prevBtn.cloneNode(true));
        this.nextBtn.replaceWith(this.nextBtn.cloneNode(true));
        
        // تعریف مجدد
        this.prevBtn = document.getElementById('sliderPrevBtn');
        this.nextBtn = document.getElementById('sliderNextBtn');
        
        // اضافه کردن event listenerهای جدید
        this.prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            console.log('Prev clicked');
            this.prevSlide();
        }, true); // useCapture: true
        
        this.nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            console.log('Next clicked');
            this.nextSlide();
        }, true);
        
        this.dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const index = parseInt(e.target.getAttribute('data-index'));
                this.goToSlide(index);
            });
        });
        
        this.setupTouchEvents();
    }
    
    
    setupTouchEvents() {
        let startX = 0;
        let endX = 0;
        const track = document.querySelector('.slider-track');
        
        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        track.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe(startX, endX);
        });
    }
    
    handleSwipe(startX, endX) {
        const diff = startX - endX;
        const minSwipe = 50;
        
        if (Math.abs(diff) > minSwipe) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }
    
    prevSlide() {
        if (this.isAnimating) return;
        
        this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
        this.updateSlider();
    }
    
    nextSlide() {
        if (this.isAnimating) return;
        
        this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
        this.updateSlider();
    }
    
    goToSlide(index) {
        if (this.isAnimating) return;
        
        this.currentIndex = index;
        this.updateSlider();
    }
    
    updateSlider() {
        this.isAnimating = true;
        
        // حذف کلاس active از همه
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.dots.forEach(dot => dot.classList.remove('active'));
        
        // اضافه کردن کلاس active به اسلاید جاری
        this.slides[this.currentIndex].classList.add('active');
        this.dots[this.currentIndex].classList.add('active');
        
        // محاسبه موقعیت‌های حلقه‌ای برای همه اسلایدها
        this.slides.forEach((slide, index) => {
            const positions = this.calculateCircularPosition(index, this.currentIndex);
            
            gsap.to(slide, {
                x: positions.x,
                y: positions.y,
                z: positions.z,
                rotationY: positions.rotationY,
                scale: positions.scale,
                opacity: positions.opacity,
                zIndex: positions.zIndex,
                duration: 1.2,
                ease: "power2.out",
                onComplete: () => {
                    if (index === this.currentIndex) {
                        this.isAnimating = false;
                    }
                }
            });
        });
    }
    
    calculateCircularPosition(slideIndex, currentIndex) {
        // محاسبه موقعیت روی دایره
        const effectiveIndex = (slideIndex - currentIndex + this.totalSlides) % this.totalSlides;
        const angle = effectiveIndex * this.angleStep;
        const radian = (angle * Math.PI) / 180;
        
        // موقعیت در فضای سه‌بعدی
        const x = Math.sin(radian) * this.radius;
        const z = Math.cos(radian) * this.radius - this.radius; // تنظیم موقعیت Z
        const y = 0; // موقعیت عمودی
        
        // تنظیمات بر اساس موقعیت روی دایره
        let scale, opacity, rotationY, zIndex;
        
        // اسلایدهای نزدیک به مرکز (دید مستقیم)
        if (effectiveIndex === 0) {
            // اسلاید فعال - مرکز
            scale = 1.1;
            opacity = 1;
            rotationY = 0;
            zIndex = 20;
        } 
        // اسلایدهای کناری
        else if (effectiveIndex === 1 || effectiveIndex === this.totalSlides - 1) {
            scale = 0.9;
            opacity = 0.8;
            rotationY = effectiveIndex === 1 ? 15 : -15;
            zIndex = 15;
        }
        // اسلایدهای دورتر
        else if (effectiveIndex === 2 || effectiveIndex === this.totalSlides - 2) {
            scale = 0.8;
            opacity = 0.6;
            rotationY = effectiveIndex === 2 ? 25 : -25;
            zIndex = 10;
        }
        // اسلایدهای پشت
        else if (effectiveIndex === 3 || effectiveIndex === this.totalSlides - 3) {
            scale = 0.7;
            opacity = 0.4;
            rotationY = effectiveIndex === 3 ? 35 : -35;
            zIndex = 5;
        }
        // اسلایدهای خیلی دور (پشت سر)
        else {
            scale = 0.6;
            opacity = 0.2;
            rotationY = effectiveIndex < this.totalSlides / 2 ? 45 : -45;
            zIndex = 1;
        }
        
        return {
            x: x,
            y: y,
            z: z,
            rotationY: rotationY,
            scale: scale,
            opacity: opacity,
            zIndex: zIndex
        };
    }
    
    autoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 3500);
    }
    
    destroy() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }
}

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
        this.setupEventListeners();
        this.setupGlassMenu();
        this.loadPosition();
        this.ensureVisibility(); // اطمینان از نمایش
        
        // یک بار دیگر بعد از تاخیر برای اطمینان از نمایش در همه مرورگرها (مخصوص اپرا)
        setTimeout(() => {
            this.ensureVisibility();
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
            if (window.innerWidth <= 768) {
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
    
    handleTap(e) {
        e.stopPropagation();
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
        
        setTimeout(() => {
            this.touchElement.style.setProperty('transition', '', 'important');
        }, 300);
    }
    
    setupGlassMenu() {
        document.getElementById('closeGlassMenu').addEventListener('click', () => {
            this.closeGlassMenu();
        });
        
        this.glassMenu.addEventListener('click', (e) => {
            if (e.target === this.glassMenu) {
                this.closeGlassMenu();
            }
        });
        
        document.querySelectorAll('.glass-menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const page = e.currentTarget.getAttribute('data-page');
                this.navigateToPage(page);
                this.closeGlassMenu();
            });
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.glassMenu.classList.contains('active')) {
                this.closeGlassMenu();
            }
        });
    }
    
    openGlassMenu() {
        this.glassMenu.classList.add('active');
        document.body.style.overflow = 'hidden'; // جلوگیری از اسکرول پس‌زمینه
    }
    
    closeGlassMenu() {
        this.glassMenu.classList.remove('active');
        document.body.style.overflow = ''; // بازگشت اسکرول
    }
    
    navigateToPage(page) {
        console.log(`🎮 رفتن به صفحه: ${page}`);
        if (typeof showView !== 'undefined') {
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
                console.warn('خطا در بارگذاری موقعیت دکمه');
            }
        } else {
            // اگر موقعیت ذخیره نشده، در موبایل موقعیت اولیه را تنظیم کن
            if (window.innerWidth <= 768) {
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
        console.error('❌ خطا در ensureVisibility:', error);
    }
});

// همچنین برای اطمینان از کارکرد در resize (مخصوص اپرا)
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        try {
            if (window.assistiveTouch && typeof window.assistiveTouch.ensureVisibility === 'function') {
                window.assistiveTouch.ensureVisibility();
            }
        } catch (error) {
            console.error('❌ خطا در ensureVisibility در resize:', error);
        }
    }, 250);
});


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
        this.modalContent = this.modal?.querySelector('.globe-modal-content');
        
        if (!this.touchElement || !this.glassMenu) {
            console.warn(`⚠️ عناصر کره ${this.globeType} پیدا نشد`, {
                touchElement: !!this.touchElement,
                glassMenu: !!this.glassMenu,
                assistiveId,
                menuId,
                globeType
            });
            return;
        }
        
        console.log(`✅ دکمه سیار کره ${this.globeType} راه‌اندازی شد`);
        
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
        
        // رویدادهای آیتم‌های منو
        this.glassMenu.querySelectorAll('.globe-menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const action = e.currentTarget.getAttribute('data-action');
                this.handleAction(action);
                this.closeMenu();
            });
        });
        
        // بستن با Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.glassMenu.classList.contains('active')) {
                this.closeMenu();
            }
        });
    }
    
    handleAction(action) {
        console.log(`🎯 عملیات کره ${this.globeType}:`, action);
        
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
                
            case 'selectCountry':
                this.togglePanel('countrySelectPanel');
                break;
                
            case 'toggleFilters':
                // تشخیص نوع پنل فیلتر بر اساس نوع کره
                let filterPanelId = 'resourcesFilterPanel';
                if (this.globeType === 'earthquake') {
                    filterPanelId = 'earthquakeFilterPanel';
                } else if (this.globeType === 'natural-resources') {
                    filterPanelId = 'naturalResourcesFilterPanel';
                }
                this.togglePanel(filterPanelId);
                break;
                
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
            console.log(`🗺️ مرزهای ایران: ${!isVisible ? 'نمایش' : 'مخفی'}`);
        } else {
            // اگر مرزها وجود ندارند، آنها را بارگذاری کن (فقط برای کره زلزله)
            if (sceneKey === 'earthquake' && typeof loadIranProvincialBorders === 'function') {
                loadIranProvincialBorders(scene);
            } else {
                console.warn('⚠️ مرزهای ایران فقط برای کره زلزله قابل استفاده است');
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
                console.warn(`⚠️ صحنه برای ${sceneKey} پیدا نشد`);
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
        
        console.log(`🔄 چرخش کره ${sceneKey}: ${isActive ? 'فعال' : 'غیرفعال'}`);
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
        console.log(`♻️ ریست کامل کره ${sceneKey}`);
        
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
                setTimeout(() => toast.remove(), 2000);
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
    console.log('✅ دکمه‌های سیار کره‌ها راه‌اندازی شدند');
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
            console.warn('⚠️ خطا در بارگذاری state:', e);
        }
    }
}

/**
 * 💾 ذخیره state کاربر
 */
function saveUserState() {
    if (typeof appState !== 'undefined') {
        localStorage.setItem('livepulseState', JSON.stringify(appState));
    }
}

/**
 * 🎯 راه‌اندازی کامل و یکپارچه برنامه
 */
function initializeLivePulse() {
    console.log('🚀 راه‌اندازی یکپارچه LivePulse...');
    
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

        // 2.5 ایونت‌لیستنرهای اصلی
        if (typeof setupEventListeners === 'function') {
            setupEventListeners();
            console.log('✅ ایونت‌لیستنرهای اصلی راه‌اندازی شدند');
        }
        
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
        
        // 4. اسلایدر سه‌بعدی
        if (document.querySelector('.advanced-3d-slider') && typeof gsap !== 'undefined') {
            setTimeout(() => {
                window.advancedSlider = new Circular3DSlider();
                console.log('✅ اسلایدر سه‌بعدی راه‌اندازی شد');
            }, 500);
        }
        
        // 5. دکمه شناور
        if (document.getElementById('assistiveTouch')) {
            setTimeout(() => {
                try {
                    window.assistiveTouch = new AssistiveTouch();
                    console.log('🎮 دکمه شناور راه‌اندازی شد');
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
                } catch (error) {
                    console.error('❌ خطا در راه‌اندازی دکمه شناور:', error);
                }
            }, 800);
        }
        
        // 5.5. دکمه‌های سیار کره‌های بزرگ
        setTimeout(() => {
            if (typeof initGlobeAssistiveTouches === 'function') {
                initGlobeAssistiveTouches();
            }
        }, 1200);
        
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
            
            console.log('✅ هایلایت‌های ابزار راه‌اندازی شدند');
        }, 1000);
        
        console.log('🎉 برنامه با موفقیت راه‌اندازی شد');
        
    } catch (error) {
        console.error('❌ خطا در راه‌اندازی:', error);
    }
}

// راه‌اندازی نهایی - یکپارچه
let isInitialized = false;
document.addEventListener('DOMContentLoaded', function() {
    if (isInitialized) {
        console.warn('⚠️ DOMContentLoaded قبلاً اجرا شده است');
        return;
    }
    isInitialized = true;
    
    try {
        // 1. بررسی وجود THREE.js و راه‌اندازی کره
        if (typeof THREE === 'undefined') {
            console.error('❌ THREE.js لود نشده! منتظر می‌مانیم...');
            setTimeout(() => {
                if (typeof THREE !== 'undefined') {
                    try {
                        if (typeof initGlobe === 'function') {
                            initGlobe();
                        }
                    } catch (error) {
                        console.error('❌ خطا در initGlobe:', error);
                    }
                } else {
                    console.error('❌ THREE.js هنوز لود نشده است!');
                }
            }, 500);
        } else {
            try {
                if (typeof initGlobe === 'function') {
                    initGlobe();
                }
            } catch (error) {
                console.error('❌ خطا در initGlobe:', error);
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
                
                if (typeof setupAdsSlider === 'function') {
                    setupAdsSlider();
                }
            } catch (error) {
                console.error('❌ خطا در تنظیمات اولیه:', error);
            }
        }, 100);
        
        // 3. راه‌اندازی برنامه اصلی
        setTimeout(() => {
            try {
                if (typeof initializeLivePulse === 'function') {
                    initializeLivePulse();
                } else {
                    console.warn('⚠️ تابع initializeLivePulse پیدا نشد');
                }
            } catch (error) {
                console.error('❌ خطا در initializeLivePulse:', error);
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
                console.error('❌ خطا در requestLocationPermission:', error);
            }
        }, 2000);
        */
    } catch (error) {
        console.error('❌ خطا در DOMContentLoaded:', error);
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
    
    console.log('💬 راه‌اندازی چت AI...', { 
        bar: !!aiChatBar, 
        fab: !!aiChatFab 
    });
    
    if (aiChatBar && aiChatFab) {
        // رویداد کلیک روی هدر برای باز/بسته کردن
        aiChatFab.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('💬 کلیک روی هدر چت');
            aiChatBar.classList.toggle('expanded');
            
            // تشخیص صفحه فعلی برای پیام مناسب - از appState استفاده می‌کنیم
            const currentPage = (typeof appState !== 'undefined' && appState.currentView) ? appState.currentView : 'home';
            console.log('💬 صفحه فعلی:', currentPage);
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
        
        console.log('✅ چت AI راه‌اندازی شد');
    } else {
        console.warn('⚠️ المان‌های چت AI پیدا نشدند');
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
// برای جلوگیری از duplicate، این را comment می‌کنیم
// document.addEventListener('DOMContentLoaded', function() {
//     // راه‌اندازی چت AI با تاخیر کوتاه
//     setTimeout(setupAiChat, 300);
//     
//     // مودال نظرات
//     const footerFeedback = document.getElementById('footerFeedback');
//     const feedbackModal = document.getElementById('feedbackModal');
//     const closeFeedbackModal = document.getElementById('closeFeedbackModal');
//     
//     if (footerFeedback && feedbackModal) {
//         footerFeedback.addEventListener('click', (e) => {
//             e.preventDefault();
//             feedbackModal.classList.add('active');
//         });
//         
//         if (closeFeedbackModal) {
//             closeFeedbackModal.addEventListener('click', () => {
//                 feedbackModal.classList.remove('active');
//             });
//         }
//     }
//     
//     // پنل مقایسه نقشه
//     const compareToggle = document.getElementById('compareToggle');
//     const comparePanel = document.getElementById('comparePanel');
//     const closeCompare = document.getElementById('closeCompare');
//     
//     if (compareToggle && comparePanel) {
//         compareToggle.addEventListener('click', () => {
//             comparePanel.classList.toggle('hidden');
//         });
//         
//         if (closeCompare) {
//             closeCompare.addEventListener('click', () => {
//                 comparePanel.classList.add('hidden');
//             });
//         }
//     }
//     
//     // فیلتر نقشه
//     const mapFilter = document.getElementById('mapFilter');
//     const currentFilterBadge = document.getElementById('currentFilterBadge');
//     
//     if (mapFilter && currentFilterBadge) {
//         mapFilter.addEventListener('change', () => {
//             currentFilterBadge.textContent = mapFilter.options[mapFilter.selectedIndex].text;
//         });
//     }
//     
//     // جلوگیری از اسکرول body وقتی مودال باز است
//     const observer = new MutationObserver((mutations) => {
//         mutations.forEach((mutation) => {
//             if (mutation.target.classList.contains('active')) {
//                 document.body.classList.add('modal-open');
//             } else {
//                 // بررسی که آیا مودال دیگری باز نیست
//                 const activeModals = document.querySelectorAll('.modal-overlay.active');
//                 if (activeModals.length === 0) {
//                     document.body.classList.remove('modal-open');
//                 }
//             }
//         });
//     });
//     
//     document.querySelectorAll('.modal-overlay').forEach((modal) => {
//         observer.observe(modal, { attributes: true, attributeFilter: ['class'] });
//     });
// });

console.log('📄 فایل JavaScript لود شد - آماده راه‌اندازی...');
