/**
 * ============================================
 * 🎯 فایل script-main.js - داده‌ها، state و initialization
 * ============================================
 * 
 * این فایل شامل:
 * - داده‌های نمونه (sampleData) برای نمایش کارت‌های قیمت
 * - توابع راه‌اندازی state برنامه
 * - Export توابع و داده‌ها به window برای استفاده در React
 * 
 * وابستگی‌ها:
 * - window.logger: برای لاگ کردن
 * - window.errorHandler: برای مدیریت خطاها
 * - localStorage: برای ذخیره state
 * 
 * Export ها:
 * - window.sampleData: داده‌های نمونه
 * - window.initializeAppState: تابع راه‌اندازی state
 * - window.saveUserState: تابع ذخیره state
 * 
 * تاریخ ایجاد: 2025-12-06
 * آخرین بروزرسانی: 2025-12-06
 */

// ==================== //
// 📍 داده‌های تستی برای شروع کار
// ==================== //
// 🔗 بعداً با API واقعی جایگزین می‌شوند
// 
// این داده‌ها شامل:
// - crypto: رمزارزها (بیت‌کوین، اتریوم، ...)
// - currency: ارزها (دلار، یورو، ...)
// - gold: طلا و سکه (سکه امامی، طلای 18 عیار, ...)
// - oil: نفت (برنت، WTI, ...)
// - forex: جفت ارزها (EUR/USD, GBP/USD, ...)
// - stock: سهام (نزدک، S&P 500, ...)
// - home: دسته‌بندی خانه (ترکیبی از همه)
const sampleData = {
    crypto: [
        { id: 'bitcoin', name: 'بیت‌کوین', symbol: 'BTC', price: 45230, change: 2.5, chart: 'up' },
        { id: 'ethereum', name: 'اتریوم', symbol: 'ETH', price: 2850, change: 1.2, chart: 'up' },
        { id: 'tether', name: 'تتر', symbol: 'USDT', price: 1.00, change: 0.1, chart: 'stable' },
        { id: 'bnb', name: 'بی‌ان‌بی', symbol: 'BNB', price: 320, change: -0.5, chart: 'down' },
        { id: 'solana', name: 'سولانا', symbol: 'SOL', price: 105, change: 3.2, chart: 'up' },
        { id: 'xrp', name: 'ریپل', symbol: 'XRP', price: 0.62, change: 1.8, chart: 'up' },
        { id: 'cardano', name: 'کاردانو', symbol: 'ADA', price: 0.48, change: 2.1, chart: 'up' },
        { id: 'dogecoin', name: 'دوج‌کوین', symbol: 'DOGE', price: 0.085, change: 3.5, chart: 'up' },
        { id: 'polkadot', name: 'پولکادات', symbol: 'DOT', price: 7.25, change: 1.5, chart: 'up' },
        { id: 'matic', name: 'پلی‌گان', symbol: 'MATIC', price: 0.92, change: 2.8, chart: 'up' }
    ],
    currency: [
        { id: 'usd', name: 'دلار آمریکا', symbol: 'USD', price: 58000, change: 0.5, chart: 'up' },
        { id: 'eur', name: 'یورو', symbol: 'EUR', price: 62000, change: -0.2, chart: 'down' },
        { id: 'gbp', name: 'پوند', symbol: 'GBP', price: 73000, change: 0.3, chart: 'up' },
        { id: 'aed', name: 'درهم امارات', symbol: 'AED', price: 15800, change: 0.1, chart: 'stable' },
        { id: 'try', name: 'لیر ترکیه', symbol: 'TRY', price: 1800, change: -1.2, chart: 'down' },
        { id: 'cad', name: 'دلار کانادا', symbol: 'CAD', price: 42000, change: 0.2, chart: 'up' },
        { id: 'aud', name: 'دلار استرالیا', symbol: 'AUD', price: 38000, change: 0.4, chart: 'up' },
        { id: 'cny', name: 'یوان چین', symbol: 'CNY', price: 8000, change: -0.1, chart: 'down' },
        { id: 'jpy', name: 'ین ژاپن', symbol: 'JPY', price: 380, change: 0.05, chart: 'up' },
        { id: 'chf', name: 'فرانک سوئیس', symbol: 'CHF', price: 65000, change: -0.3, chart: 'down' }
    ],
    gold: [
        { id: 'sekee-emami', name: 'سکه امامی', symbol: 'SEKEE', price: 32000000, change: 1.2, chart: 'up' },
        { id: 'sekee-bahar', name: 'سکه بهار', symbol: 'BAHAR', price: 31000000, change: 0.8, chart: 'up' },
        { id: 'gerami18', name: 'طلای 18 عیار', symbol: 'GOLD18', price: 2850000, change: 0.5, chart: 'up' },
        { id: 'gerami24', name: 'طلای 24 عیار', symbol: 'GOLD24', price: 3750000, change: 0.6, chart: 'up' },
        { id: 'nesfe-sekee', name: 'نیم سکه', symbol: 'NESFE', price: 16500000, change: 1.1, chart: 'up' },
        { id: 'rob-sekee', name: 'ربع سکه', symbol: 'ROB', price: 8500000, change: 1.0, chart: 'up' },
        { id: 'gerami17', name: 'طلای 17 عیار', symbol: 'GOLD17', price: 2700000, change: 0.4, chart: 'up' },
        { id: 'gerami21', name: 'طلای 21 عیار', symbol: 'GOLD21', price: 3300000, change: 0.7, chart: 'up' },
        { id: 'ons', name: 'انس طلا', symbol: 'ONS', price: 2650, change: 0.8, chart: 'up' },
        { id: 'mesghal', name: 'مثقال طلا', symbol: 'MESGHAL', price: 285000, change: 0.6, chart: 'up' }
    ],
    oil: [
        { id: 'brent', name: 'نفت برنت', symbol: 'BRENT', price: 82.5, change: -1.2, chart: 'down' },
        { id: 'wti', name: 'نفت وست تگزاس', symbol: 'WTI', price: 78.3, change: -0.8, chart: 'down' },
        { id: 'opec', name: 'سبد نفتی اوپک', symbol: 'OPEC', price: 80.2, change: -0.9, chart: 'down' },
        { id: 'dubai', name: 'نفت دبی', symbol: 'DUBAI', price: 81.1, change: -1.0, chart: 'down' },
        { id: 'urals', name: 'نفت اورال', symbol: 'URALS', price: 75.8, change: -1.5, chart: 'down' },
        { id: 'bonny', name: 'نفت بونی', symbol: 'BONNY', price: 83.4, change: -0.7, chart: 'down' },
        { id: 'espo', name: 'نفت اسپو', symbol: 'ESPO', price: 76.5, change: -1.3, chart: 'down' },
        { id: 'saharan', name: 'نفت صحرا', symbol: 'SAHARAN', price: 84.2, change: -0.6, chart: 'down' },
        { id: 'basra', name: 'نفت بصره', symbol: 'BASRA', price: 79.8, change: -1.1, chart: 'down' },
        { id: 'light', name: 'نفت سبک', symbol: 'LIGHT', price: 82.9, change: -0.8, chart: 'down' }
    ],
    forex: [
        { id: 'eurusd', name: 'یورو/دلار', symbol: 'EUR/USD', price: 1.0856, change: 0.12, chart: 'up' },
        { id: 'gbpusd', name: 'پوند/دلار', symbol: 'GBP/USD', price: 1.2715, change: 0.15, chart: 'up' },
        { id: 'usdjpy', name: 'دلار/ین', symbol: 'USD/JPY', price: 149.82, change: -0.08, chart: 'down' },
        { id: 'usdchf', name: 'دلار/فرانک', symbol: 'USD/CHF', price: 0.8842, change: -0.05, chart: 'down' },
        { id: 'audusd', name: 'دلار استرالیا/دلار', symbol: 'AUD/USD', price: 0.6548, change: 0.22, chart: 'up' },
        { id: 'usdcad', name: 'دلار/دلار کانادا', symbol: 'USD/CAD', price: 1.3625, change: -0.10, chart: 'down' },
        { id: 'nzdusd', name: 'دلار نیوزیلند/دلار', symbol: 'NZD/USD', price: 0.6012, change: 0.18, chart: 'up' },
        { id: 'usdsek', name: 'دلار/کرون سوئد', symbol: 'USD/SEK', price: 10.4523, change: -0.25, chart: 'down' },
        { id: 'usdnok', name: 'دلار/کرون نروژ', symbol: 'USD/NOK', price: 10.8234, change: -0.15, chart: 'down' },
        { id: 'usdzar', name: 'دلار/راند', symbol: 'USD/ZAR', price: 18.6542, change: 0.32, chart: 'up' }
    ],
    stock: [
        { id: 'tedpix', name: 'شاخص کل بورس', symbol: 'TEDPIX', price: 2150000, change: 0.7, chart: 'up' },
        { id: 'tedpix50', name: 'شاخص 50 شرکت', symbol: 'TEDPIX50', price: 1850000, change: 0.5, chart: 'up' },
        { id: 'total', name: 'شاخص کل هم وزن', symbol: 'TOTAL', price: 420000, change: 0.3, chart: 'up' },
        { id: 'nasdaq', name: 'نزدک', symbol: 'NASDAQ', price: 15285, change: 0.9, chart: 'up' },
        { id: 'sp500', name: 'S&P 500', symbol: 'SP500', price: 4850, change: 0.6, chart: 'up' },
        { id: 'dow', name: 'داوجونز', symbol: 'DOW', price: 38250, change: 0.4, chart: 'up' },
        { id: 'nikkei', name: 'نیکه‌ای', symbol: 'NIKKEI', price: 33500, change: 0.8, chart: 'up' },
        { id: 'dax', name: 'DAX', symbol: 'DAX', price: 16850, change: 0.5, chart: 'up' },
        { id: 'ftse', name: 'FTSE', symbol: 'FTSE', price: 7650, change: 0.3, chart: 'up' },
        { id: 'cac', name: 'CAC 40', symbol: 'CAC', price: 7250, change: 0.4, chart: 'up' }
    ],
    exchangeRates: {
        USD: 58000, EUR: 62000, GBP: 73000, IRR: 1, TRY: 1800,
        AED: 15800, CAD: 42000, AUD: 38000, CNY: 8000, JPY: 380, CHF: 65000
    }
};

// Export sampleData to window for global access
if (typeof window !== 'undefined') {
    window.sampleData = sampleData;
}

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
    const logInit = window.logger || { info: console.log, success: console.log };
    logInit.info('برنامه LivePulse در حال راه‌اندازی...');
    
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
    
        logInit.success('برنامه آماده است!');
    } catch (error) {
        if (window.errorHandler) {
            window.errorHandler.handleError(error, 'initializeApp');
        } else {
            logInit.error('❌ خطا در راه‌اندازی برنامه:', error);
        }
    }
}

/**
 * 💾 ذخیره وضعیت کاربر در localStorage
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

