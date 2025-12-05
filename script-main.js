// ==================== //
// 🎯 فایل script-main.js - داده‌ها، state و initialization
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
    userUsage: JSON.parse(localStorage.getItem('livepulse-usage')) || { chat: 0, tools: 0 },
    previousViewBeforeGlobe: null // برای ذخیره صفحه قبل از باز کردن کره
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
    const log = window.logger || { info: console.log, success: console.log };
    log.info('برنامه LivePulse در حال راه‌اندازی...');
    
    try {
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
    
        log.success('برنامه آماده است!');
    } catch (error) {
        if (window.errorHandler) {
            window.errorHandler.handleError(error, 'initializeApp');
        } else {
            const log = window.logger || { error: console.error }; log.error('❌ خطا در راه‌اندازی برنامه:', error);
        }
    }
}

/**
 * 💾 ذخیره وضعیت کاربر در localStorage
 */
function saveUserState() {
    if (typeof appState !== 'undefined') {
        localStorage.setItem('livepulseState', JSON.stringify(appState));
    }
}

