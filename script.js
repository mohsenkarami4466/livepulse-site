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
    
    // نمایش نمای اولیه
    showView(appState.currentView);
    
    // تولید کارت‌های اولیه
    generateHomeCards();
    
    // تنظیم ایونت‌لیستنرها
    setupEventListeners();
    
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
    // مخفی کردن همه صفحات
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active-view'));

    // نمایش صفحه انتخاب شده
    const viewElements = {
        'home': elements.homeView,
        'tools': elements.toolsView,
        'news': document.getElementById('newsView'),
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
        viewElements[view].classList.add('active-view');
        appState.currentView = view;

        // ریست اسکرول به بالای صفحه
        window.scrollTo(0, 0);

        // انتقال هایلایت‌های اصلی فقط به صفحات اصلی
        if (!['tools', 'news', 'tutorial', 'relax'].includes(view)) {
            const mainHighlights = document.querySelector('.highlights-section:not(.tools-highlights)');
            if (mainHighlights && viewElements[view] && !viewElements[view].contains(mainHighlights)) {
                viewElements[view].insertBefore(mainHighlights, viewElements[view].firstChild);
            }
        }

        // تنظیم ایونت‌لیستنر برای کارت‌های این صفحه
        setTimeout(() => setupAllCardListeners(), 100);

        // اگر home بود کارت‌ها رو آپدیت کن
        if (view === 'home') {
            generateHomeCards();
        }
    }

    console.log(`📱 صفحه تغییر کرد به: ${view}`);
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
document.addEventListener('DOMContentLoaded', () => {
  initGlobe();
  setInterval(updateSunAndMarkets, UPDATE_MS);
  
  // تنظیم کلیک روی کره کوچک بعد از ساخته شدن
  setupSmallGlobeClick();
  
  // ساخت ساعت UTC دور کره
  createUTCClockRing();
  setInterval(updateUTCClock, 1000);
  
  // راه‌اندازی اسلایدر تبلیغات GSAP
  setupAdsSlider();
});

/* راه‌اندازی اسلایدر پیوسته (Infinite Loop) */
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
  
  // محاسبه عرض اسلاید - اگر صفر بود از مقدار پیش‌فرض استفاده کن
  let slideWidth = originalSlides[0].offsetWidth;
  if (slideWidth === 0) {
    slideWidth = window.innerWidth <= 768 ? 260 : 320;
  }
  slideWidth += 16; // gap
  
  let currentIndex = 0;
  let isAnimating = false;
  let autoPlayInterval = null;
  
  // تنظیم موقعیت اولیه
  track.style.transform = `translateX(0px)`;
  
  // ساخت نقاط نشانگر
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < slideCount; i++) {
      const dot = document.createElement('div');
      dot.className = `ads-dot ${i === 0 ? 'active' : ''}`;
      dot.dataset.index = i;
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }
  
  // تابع رفتن به اسلاید با انیمیشن
  function goToSlide(index) {
    if (isAnimating) return;
    
    // حلقه پیوسته
    if (index >= slideCount) {
      currentIndex = 0;
    } else if (index < 0) {
      currentIndex = slideCount - 1;
    } else {
      currentIndex = index;
    }
    
    if (typeof gsap !== 'undefined') {
      isAnimating = true;
      gsap.to(track, {
        x: -currentIndex * slideWidth,
        duration: 0.5,
        ease: 'power2.out',
        onComplete: () => {
          isAnimating = false;
        }
      });
    } else {
      track.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
    }
    
    updateDots();
  }
  
  // بروزرسانی نقاط
  function updateDots() {
    if (!dotsContainer) return;
    const dots = dotsContainer.querySelectorAll('.ads-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }
  
  // رفتن به بعدی
  function nextSlide() {
    goToSlide(currentIndex + 1);
  }
  
  // رفتن به قبلی
  function prevSlide() {
    goToSlide(currentIndex - 1);
  }
  
  // دکمه‌ها
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  
  // اتوپلی
  function startAutoPlay() {
    stopAutoPlay();
    autoPlayInterval = setInterval(nextSlide, 3500);
  }
  
  function stopAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
  }
  
  // توقف اتوپلی هنگام hover
  track.addEventListener('mouseenter', stopAutoPlay);
  track.addEventListener('mouseleave', startAutoPlay);
  
  // پشتیبانی از تاچ (swipe)
  let touchStartX = 0;
  let touchEndX = 0;
  
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    stopAutoPlay();
  }, { passive: true });
  
  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    startAutoPlay();
  }, { passive: true });
  
  // ریسایز
  window.addEventListener('resize', () => {
    let newWidth = originalSlides[0].offsetWidth;
    if (newWidth === 0) {
      newWidth = window.innerWidth <= 768 ? 260 : 320;
    }
    slideWidth = newWidth + 16;
    track.style.transition = 'none';
    track.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
    track.offsetHeight;
    track.style.transition = '';
  });
  
  // شروع اتوپلی
  startAutoPlay();
  
  console.log('✅ اسلایدر راه‌اندازی شد - ' + slideCount + ' اسلاید');
}

/* ساخت ساعت UTC دور کره کوچک */
function createUTCClockRing() {
  const ring = document.getElementById('utcClockRing');
  if (!ring) return;
  
  ring.innerHTML = '';
  
  // فقط ساعت‌های اصلی (هر 2 ساعت) برای خوانایی بهتر
  const hours = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];
  
  hours.forEach((i) => {
    const hour = document.createElement('span');
    hour.className = 'utc-hour';
    hour.dataset.hour = i;
    hour.textContent = i.toString().padStart(2, '0');
    
    // محاسبه موقعیت روی دایره - دقیقا روی لبه کره
    const angle = (i * 15) - 90; // هر ساعت 15 درجه (360/24=15)
    const radian = angle * (Math.PI / 180);
    // کره 70% wrapper و clock-ring 80% wrapper هست
    // پس ساعت‌ها باید در 44% clock-ring باشن (70/80 * 50 ≈ 44)
    const radius = 44;
    
    const x = 50 + radius * Math.cos(radian);
    const y = 50 + radius * Math.sin(radian);
    
    hour.style.left = `${x}%`;
    hour.style.top = `${y}%`;
    hour.style.transform = 'translate(-50%, -50%)';
    
    ring.appendChild(hour);
  });
  
  updateUTCClock();
}

/* آپدیت ساعت UTC */
function updateUTCClock() {
  const now = new Date();
  const currentHour = now.getUTCHours();
  
  document.querySelectorAll('.utc-hour').forEach(el => {
    const hour = parseInt(el.dataset.hour);
    if (hour === currentHour) {
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
  dayMat = new THREE.MeshPhongMaterial({ map: loader.load('earth-day.jpg') });
  nightMat = new THREE.MeshPhongMaterial({ map: loader.load('earth-night.jpg') });
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
    
    console.log('🖱️ کلیک روی کره کوچک:', e.type);
    
    // جلوگیری از double trigger در touch devices
    if (e.type === 'touchend') {
        e.currentTarget.classList.add('touched');
        setTimeout(() => e.currentTarget.classList.remove('touched'), 300);
    }
    if (e.type === 'click' && e.currentTarget.classList.contains('touched')) {
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
            controls.autoRotate = false;
            console.log('✅ OrbitControls ساخته شد');
        } else {
            console.warn('⚠️ OrbitControls لود نشده است. کنترل‌ها غیرفعال هستند.');
        }
    } catch (error) {
        console.error('❌ خطا در ساخت OrbitControls:', error);
    }

    // تنظیم موقعیت camera
    camera.position.set(0, 0, 5);
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
        
        // چرخش کره - سرعت آرام
        if (globe && globe.rotation) {
            globe.rotation.y += 0.0005; // کاهش سرعت برای ظاهر طبیعی‌تر
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
    resources: null
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
        
        // Camera
        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        camera.position.set(0, 0, 2.5);
        
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
        
        // چرخش اتوماتیک
        let autoRotate = true;
        let frameId;
        
        const animate = () => {
            frameId = requestAnimationFrame(animate);
            if (autoRotate) {
                earth.rotation.y += 0.001;
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
            
            const intersects = raycaster.intersectObjects(allMarkerObjects, false);
            
            if (intersects.length > 0) {
                const clicked = intersects[0].object;
                if (clicked.userData && clicked.userData.market) {
                    console.log('📍 کلیک روی بازار:', clicked.userData.market.name);
                    autoRotate = false;
                    zoomToMarker(clicked.userData.market, camera, controls, earth);
                    showMarketPopup(clicked.userData.market, container);
                    return true;
                }
            }
            
            // در کره منابع: تشخیص کلیک روی کشور
            if (type === 'resources') {
                // فقط mesh اصلی کره، نه فرزندان (مرزها/آیکون‌ها)
                const earthIntersects = raycaster.intersectObject(earth, false);
                if (earthIntersects.length > 0) {
                    const worldPoint = earthIntersects[0].point;
                    
                    // دیباگ: نمایش چرخش کره
                    console.log('🔄 چرخش کره Y:', (earth.rotation.y * 180 / Math.PI).toFixed(1) + '°');
                    console.log('🌍 نقطه جهانی:', worldPoint.x.toFixed(3), worldPoint.y.toFixed(3), worldPoint.z.toFixed(3));
                    
                    // تبدیل نقطه از سیستم جهانی به سیستم محلی کره
                    const localPoint = earth.worldToLocal(worldPoint.clone());
                    console.log('📌 نقطه محلی:', localPoint.x.toFixed(3), localPoint.y.toFixed(3), localPoint.z.toFixed(3));
                    
                    // تبدیل موقعیت 3D به lat/lng
                    const latLng = vector3ToLatLng(localPoint);
                    console.log('📍 مختصات:', 'lat=' + latLng.lat.toFixed(2), 'lng=' + latLng.lng.toFixed(2));
                    
                    // پیدا کردن کشور بر اساس مختصات
                    const countryCode = findCountryByLatLng(latLng.lat, latLng.lng);
                    if (countryCode) {
                        console.log('🗺️ کشور:', countryCode);
                        selectCountry(countryCode);
                        return true;
                    } else {
                        console.log('❌ کشوری پیدا نشد برای این مختصات');
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
            
            // محاسبه فاصله تقریبی (بدون نیاز به Haversine کامل)
            const getDistance = (lat1, lng1, lat2, lng2) => {
                const dLat = lat2 - lat1;
                const dLng = lng2 - lng1;
                // ضریب تصحیح برای عرض جغرافیایی
                const latFactor = Math.cos((lat1 + lat2) / 2 * Math.PI / 180);
                return Math.sqrt(dLat * dLat + (dLng * latFactor) * (dLng * latFactor));
            };
            
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
                
                // روسیه - چند منطقه مهم
                { code: 'RU', center: [55, 37], radius: 8 },          // مسکو و اروپایی
                { code: 'RU', center: [55, 60], radius: 10 },         // اورال
                { code: 'RU', center: [55, 83], radius: 12 },         // سیبری غربی
                { code: 'RU', center: [55, 105], radius: 12 },        // سیبری شرقی
                { code: 'RU', center: [55, 130], radius: 12 },        // خاور دور
                { code: 'RU', center: [65, 90], radius: 15 },         // شمال سیبری
                { code: 'RU', center: [45, 45], radius: 8 },          // قفقاز
            ];
            
            // ابتدا چک کنیم در محدوده کدوم مناطق هستیم
            const candidates = [];
            
            for (const zone of countryZones) {
                const dist = getDistance(lat, lng, zone.center[0], zone.center[1]);
                const ratio = dist / zone.radius;
                if (ratio <= 1.3) { // حداکثر 30% خارج از شعاع
                    candidates.push({ 
                        code: zone.code, 
                        dist, 
                        radius: zone.radius,
                        ratio,
                        withinRadius: ratio <= 1.0 
                    });
                }
            }
            
            // اگر کاندیدایی نداشتیم، نزدیک‌ترین رو برگردون
            if (candidates.length === 0) {
                for (const zone of countryZones) {
                    const dist = getDistance(lat, lng, zone.center[0], zone.center[1]);
                    if (dist < minDistance) {
                        minDistance = dist;
                        closestCountry = zone.code;
                    }
                }
                console.log('⚠️ کشور نزدیک (خارج محدوده):', closestCountry);
                return closestCountry;
            }
            
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
            autoRotate: () => { autoRotate = true; },
            stopRotate: () => { autoRotate = false; },
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
        
        console.log(`✅ کره ${type} آماده!`);
        
    } catch (error) {
        console.error('❌ خطا:', error);
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

// نمایش پنجره اطلاعات بازار
function showMarketPopup(market, container) {
    // حذف popup قبلی
    const oldPopup = container.querySelector('.market-3d-popup');
    if (oldPopup) oldPopup.remove();
    
    const now = new Date();
    const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
    const [openH, openM] = market.open.split(':').map(Number);
    const [closeH, closeM] = market.close.split(':').map(Number);
    const openMin = openH * 60 + openM;
    const closeMin = closeH * 60 + closeM;
    const isOpen = utcMinutes >= openMin && utcMinutes < closeMin;
    
    const popup = document.createElement('div');
    popup.className = 'market-3d-popup';
    popup.innerHTML = `
        <div class="popup-header">
            <span class="popup-status ${isOpen ? 'open' : 'closed'}">${isOpen ? '🟢 باز' : '🔴 بسته'}</span>
            <button class="popup-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
        <h3 class="popup-title">${market.name}</h3>
        <div class="popup-times">
            <div class="time-row">
                <span>🕐 باز شدن:</span>
                <span>${market.open} UTC</span>
            </div>
            <div class="time-row">
                <span>🕐 بسته شدن:</span>
                <span>${market.close} UTC</span>
            </div>
            <div class="time-row">
                <span>🌍 منطقه زمانی:</span>
                <span>UTC ${market.utcOffset}</span>
            </div>
        </div>
        <div class="popup-notification">
            <label>
                <input type="checkbox" id="notify-${market.name.replace(/\s/g, '')}">
                🔔 اعلان قبل از باز شدن
            </label>
            <select class="notify-time">
                <option value="5">5 دقیقه قبل</option>
                <option value="15" selected>15 دقیقه قبل</option>
                <option value="30">30 دقیقه قبل</option>
                <option value="60">1 ساعت قبل</option>
            </select>
        </div>
        <button class="popup-save-btn" onclick="saveMarketNotification('${market.name}', this)">
            💾 ذخیره تنظیمات
        </button>
    `;
    
    container.appendChild(popup);
    
    // انیمیشن ورود
    setTimeout(() => popup.classList.add('visible'), 10);
}

// ذخیره تنظیمات ناتیفیکیشن
window.saveMarketNotification = function(marketName, btn) {
    const popup = btn.closest('.market-3d-popup');
    const checkbox = popup.querySelector('input[type="checkbox"]');
    const select = popup.querySelector('.notify-time');
    
    if (checkbox.checked) {
        const settings = JSON.parse(localStorage.getItem('marketNotifications') || '{}');
        settings[marketName] = {
            enabled: true,
            minutesBefore: parseInt(select.value)
        };
        localStorage.setItem('marketNotifications', JSON.stringify(settings));
        
        btn.textContent = '✅ ذخیره شد!';
        btn.style.background = '#22c55e';
        setTimeout(() => {
            btn.textContent = '💾 ذخیره تنظیمات';
            btn.style.background = '';
        }, 2000);
    }
};

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
    
    // تعیین نوع کره
    const type = modalId.includes('financial') ? 'financial' : 'resources';
    
    // اول modal رو مخفی کن
    modal.classList.remove('active');
    modal.style.display = 'none';
    
    // بازگرداندن body
    document.body.classList.remove('globe-modal-open');
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.height = '';
    
    // پاکسازی کره با تاخیر کوتاه (برای جلوگیری از هنگ)
    setTimeout(() => {
        if (simpleGlobeScenes[type] && typeof simpleGlobeScenes[type].destroy === 'function') {
            simpleGlobeScenes[type].destroy();
            simpleGlobeScenes[type] = null;
        }
        
        // پاک کردن محتوای container
        const containerId = type === 'financial' ? 'financialGlobeContainer' : 'resourcesGlobeContainer';
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '';
        }
        
        console.log('✅ Modal و کره پاکسازی شدند');
    }, 50);
}

// در دسترس قرار دادن توابع در scope global
window.openFinancialGlobe = openFinancialGlobe;
window.openResourcesGlobe = openResourcesGlobe;
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

// انتخاب کشور
function selectCountry(code) {
    console.log('🏳️ انتخاب کشور:', code);
    
    resourcesGlobeData.selectedCountry = code;
    const countryData = countriesData[code];
    
    if (!countryData) {
        console.error('داده کشور پیدا نشد:', code);
        return;
    }
    
    // به‌روزرسانی UI لیست
    document.querySelectorAll('.country-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.code === code) {
            item.classList.add('active');
        }
    });
    
    // نمایش پنل اطلاعات
    showCountryInfo(code, countryData);
    
    // به‌روزرسانی مرزها بر اساس روابط
    if (resourcesGlobeData.bordersGroup) {
        updateBordersForCountry(resourcesGlobeData.bordersGroup, code);
    }
    
    // نمایش راهنمای رنگ‌ها
    document.getElementById('relationsLegend')?.classList.add('active');
    
    // نمایش آیکون‌های منابع این کشور
    if (window.resourcesGlobeObjects && window.resourcesGlobeObjects.earth) {
        const earth = window.resourcesGlobeObjects.earth;
        
        // پاک کردن آیکون‌های قبلی
        if (typeof clearResourceIcons === 'function') {
            clearResourceIcons(earth);
        }
        
        // نمایش آیکون‌های منابع این کشور
        if (typeof createResourceIcons === 'function') {
            createResourceIcons(earth, code, 'all');
        }
    }
    
    // زوم به کشور
    zoomToCountry(code);
}

// نمایش اطلاعات کشور
function showCountryInfo(code, data) {
    const panel = document.getElementById('countryInfoPanel');
    const nameEl = document.getElementById('selectedCountryName');
    const contentEl = document.getElementById('countryInfoContent');
    
    if (!panel || !contentEl) return;
    
    nameEl.textContent = `${data.name} (${data.nameEn})`;
    
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
                    <div class="value">${formatMoney(data.gdp)}B</div>
                </div>
                <div class="info-item">
                    <div class="label">رتبه جهانی</div>
                    <div class="value">#${data.gdpRank || '-'}</div>
                </div>
                <div class="info-item">
                    <div class="label">درآمد سرانه</div>
                    <div class="value">${formatMoney(data.gdpPerCapita)}</div>
                </div>
                <div class="info-item">
                    <div class="label">تورم</div>
                    <div class="value ${data.inflation > 10 ? 'negative' : ''}">${data.inflation || 0}%</div>
                </div>
                <div class="info-item">
                    <div class="label">بیکاری</div>
                    <div class="value ${data.unemployment > 15 ? 'negative' : ''}">${data.unemployment || 0}%</div>
                </div>
                <div class="info-item">
                    <div class="label">ارز</div>
                    <div class="value">${data.currencyName || '-'}</div>
                </div>
            </div>
        </div>
        
        <!-- جمعیتی -->
        <div class="info-section">
            <h5>👥 جمعیتی</h5>
            <div class="info-grid">
                <div class="info-item">
                    <div class="label">جمعیت</div>
                    <div class="value">${formatNumber(data.population)}</div>
                </div>
                <div class="info-item">
                    <div class="label">تراکم</div>
                    <div class="value">${data.populationDensity || 0}/km²</div>
                </div>
                <div class="info-item">
                    <div class="label">نرخ رشد</div>
                    <div class="value ${data.populationGrowth > 0 ? 'positive' : 'negative'}">${data.populationGrowth || 0}%</div>
                </div>
            </div>
        </div>
        
        <!-- منابع طبیعی -->
        ${data.resources && Object.keys(data.resources).length > 0 ? `
        <div class="info-section">
            <h5>⛏️ منابع طبیعی</h5>
            ${Object.entries(data.resources).map(([key, res]) => `
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
        ${data.exports ? `
        <div class="info-section">
            <h5>📤 صادرات (${formatMoney(data.exports.total)}B)</h5>
            <div class="trade-partners">
                ${data.exports.partners?.slice(0, 5).map(p => `
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
        ${data.imports ? `
        <div class="info-section">
            <h5>📥 واردات (${formatMoney(data.imports.total)}B)</h5>
            <div class="trade-partners">
                ${data.imports.partners?.slice(0, 5).map(p => `
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
    
    // فیلتر قاره
    document.querySelectorAll('#continentFilters .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#continentFilters .filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const continent = btn.dataset.continent;
            filterCountriesByContinent(continent);
        });
    });
    
    // فیلتر تاسیسات (پالایشگاه، کارخانه)
    document.querySelectorAll('#facilityFilters .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // غیرفعال کردن فیلتر منابع
            document.querySelectorAll('#resourceFilters .filter-btn').forEach(b => b.classList.remove('active'));
            
            btn.classList.toggle('active');
            const filter = btn.dataset.filter;
            
            if (btn.classList.contains('active')) {
                filterCountriesByResource(filter);
            } else {
                // اگر هیچ فیلتری فعال نیست، همه رو فعال کن
                document.querySelector('#resourceFilters .filter-btn[data-filter="all"]')?.classList.add('active');
                filterCountriesByResource('all');
            }
        });
    });
    
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
    
    // مخفی کردن پنل
    const panel = document.getElementById('marketSelectPanel');
    if (panel) panel.classList.remove('visible');
    
    // دسترسی به scene کره مالی
    const globeScene = simpleGlobeScenes['financial'];
    if (!globeScene) return;
    
    // توقف چرخش اتوماتیک
    if (globeScene.stopRotate) globeScene.stopRotate();
    
    // زوم به بازار
    zoomToMarker(market, globeScene.camera, globeScene.controls, globeScene.earth);
    
    // نمایش popup
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
    
    const globeScene = simpleGlobeScenes[type];
    if (!globeScene) return;
    
    // شروع مجدد چرخش اتوماتیک
    if (globeScene.autoRotate) {
        globeScene.autoRotate();
    }
    
    // برگرداندن دوربین به حالت اول
    if (globeScene.camera) {
        const startPos = globeScene.camera.position.clone();
        const targetPos = new THREE.Vector3(0, 0, 2.5);
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

/**
 * 🏠 تولید ۴ کارت اصلی صفحه خانه
 */
function generateHomeCards() {
    const container = document.getElementById('homeMainCards');
    if (!container) return;
    
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
    
    container.innerHTML = '';
    
    mainItems.forEach(item => {
        const card = createPriceCard(item);
        container.appendChild(card);
    });
    
    console.log('🎴 ۴ کارت اصلی ایجاد شدند');
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
 * 📊 تولید نمودار SVG مینی برای کارت - مثل سایت‌های مالی واقعی
 */
function generateMiniChartSVG(symbol, isUp) {
    // تولید داده‌های شبیه به نمودار واقعی قیمت
    const seed = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const dataPoints = 24; // 24 نقطه داده
    const points = [];
    
    // شروع از وسط
    let value = 50;
    
    for (let i = 0; i < dataPoints; i++) {
        // نوسانات طبیعی بازار
        const noise1 = Math.sin(seed * 0.1 + i * 0.8) * 8;
        const noise2 = Math.cos(seed * 0.2 + i * 0.5) * 5;
        const noise3 = Math.sin(seed * 0.05 + i * 1.2) * 3;
        
        value += (noise1 + noise2 + noise3) * 0.15;
        
        // روند کلی
        if (isUp) {
            value += 0.6; // روند صعودی
        } else {
            value -= 0.6; // روند نزولی
        }
        
        // محدود کردن به بازه مناسب
        value = Math.max(15, Math.min(85, value));
        
        points.push(value);
    }
    
    // نرمال‌سازی به بازه 10-90
    const minVal = Math.min(...points);
    const maxVal = Math.max(...points);
    const range = maxVal - minVal || 1;
    
    const normalizedPoints = points.map(p => 
        10 + ((p - minVal) / range) * 80
    );
    
    // ساخت path با منحنی نرم (Bezier)
    const width = 100;
    const height = 100;
    let pathD = '';
    
    normalizedPoints.forEach((val, i) => {
        const x = (i / (dataPoints - 1)) * width;
        const y = height - val;
        
        if (i === 0) {
            pathD += `M${x},${y}`;
        } else {
            // منحنی نرم با Quadratic Bezier
            const prevX = ((i - 1) / (dataPoints - 1)) * width;
            const prevY = height - normalizedPoints[i - 1];
            const cpX = (prevX + x) / 2;
            pathD += ` Q${cpX},${prevY} ${x},${y}`;
        }
    });
    
    // ساخت path برای ناحیه پر شده
    const areaPath = pathD + ` L${width},${height} L0,${height} Z`;
    
    // رنگ‌ها
    const uniqueId = `chart-${symbol}-${Date.now()}`;
    const strokeColor = isUp ? '#22c55e' : '#ef4444';
    const fillColorStart = isUp ? 'rgba(34, 197, 94, 0.25)' : 'rgba(239, 68, 68, 0.25)';
    const fillColorEnd = isUp ? 'rgba(34, 197, 94, 0.02)' : 'rgba(239, 68, 68, 0.02)';
    
    return `
        <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" style="width:100%;height:100%;">
            <defs>
                <linearGradient id="${uniqueId}" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="${fillColorStart}" />
                    <stop offset="100%" stop-color="${fillColorEnd}" />
                </linearGradient>
            </defs>
            <path d="${areaPath}" fill="url(#${uniqueId})" />
            <path d="${pathD}" fill="none" stroke="${strokeColor}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
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
    
    // نمایش حالت لودینگ
    newsFeed.innerHTML = `
        <div class="news-placeholder">
            <div class="loading-news">
                <div class="spinner"></div>
                <p>📡 در حال دریافت اخبار ${getCategoryName(category)}...</p>
            </div>
        </div>
    `;
    
    // شبیه‌سازی دریافت اخبار
    setTimeout(() => {
        displayNews(generateSampleNews(category));
    }, 1500);
}

/**
 * 🎴 نمایش اخبار در صفحه
 */
function displayNews(news) {
    const newsFeed = document.getElementById('newsFeed');
    
    if (news.length === 0) {
        newsFeed.innerHTML = `
            <div class="news-placeholder">
                <p>📭 خبری در این دسته‌بندی یافت نشد</p>
            </div>
        `;
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
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('newsView')) {
        setupNewsSystem();
    }
});

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
    
    // هایلایت‌های خانه
    document.querySelectorAll('.highlight-circle[data-category]').forEach(circle => {
        circle.addEventListener('click', (e) => {
            const category = e.currentTarget.getAttribute('data-category');
            
            // آپدیت هایلایت فعال
            document.querySelectorAll('.highlight-circle[data-category]').forEach(c => c.classList.remove('active'));
            e.currentTarget.classList.add('active');
            
            // انتقال به صفحه مربوطه
            showView(category);
            
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
    
    // دکمه‌های بستن و reset کره‌ها
    const closeFinancialGlobe = document.querySelector('#financialGlobeModal .close-globe');
    const closeResourcesGlobe = document.querySelector('#resourcesGlobeModal .close-globe');
    const resetFinancialView = document.getElementById('resetFinancialView');
    const resetResourcesView = document.getElementById('resetResourcesView');
    
    if (closeFinancialGlobe) {
        closeFinancialGlobe.addEventListener('click', () => {
            closeGlobeModal('financialGlobeModal');
        });
    }
    
    if (closeResourcesGlobe) {
        closeResourcesGlobe.addEventListener('click', () => {
            closeGlobeModal('resourcesGlobeModal');
        });
    }
    
    if (resetFinancialView) {
        resetFinancialView.addEventListener('click', () => {
            resetGlobeView('financial');
        });
    }
    
    if (resetResourcesView) {
        resetResourcesView.addEventListener('click', () => {
            resetGlobeView('resources');
        });
    }
    
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
    }
    
    ensureVisibility() {
        // مطمئن شو که دکمه نمایش داده می‌شه
        this.touchElement.style.display = 'block';
        this.touchElement.style.visibility = 'visible';
        this.touchElement.style.opacity = '1';
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
        
        // غیرفعال کردن transition و اضافه کردن حالت درگ
        this.touchElement.style.transition = 'none';
        this.touchElement.classList.add('dragging');
    }
    
    handleMouseMove(e) {
        if (!this.isDragging) return;
        
        const deltaX = Math.abs(e.clientX - this.startX);
        const deltaY = Math.abs(e.clientY - this.startY);
        
        // اگر حرکت بیشتر از threshold بود، درگ محسوب می‌شه
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
        const deltaX = clientX - this.startX;
        const deltaY = clientY - this.startY;
        
        let newX = this.initialX + deltaX;
        let newY = this.initialY + deltaY;
        
        // محدودیت‌های صفحه
        const maxX = window.innerWidth - this.touchElement.offsetWidth;
        const maxY = window.innerHeight - this.touchElement.offsetHeight;
        
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));
        
        this.touchElement.style.left = newX + 'px';
        this.touchElement.style.top = newY + 'px';
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
        
        // فاصله تا لبه‌ها
        const toLeft = centerX;
        const toRight = windowWidth - centerX;
        const toTop = centerY;
        const toBottom = windowHeight - centerY;
        
        // پیدا کردن نزدیک‌ترین لبه (هم افقی و هم عمودی)
        let newX = rect.left;
        let newY = rect.top;
        
        // Snap افقی
        if (toLeft < toRight) {
            newX = 15;
        } else {
            newX = windowWidth - rect.width - 15;
        }
        
        // Snap عمودی - بر اساس موقعیت فعلی
        if (centerY < windowHeight / 3) {
            // اگر در سوم بالایی صفحه هست، به بالا بچسبد
            newY = 15;
        } else if (centerY > (windowHeight * 2) / 3) {
            // اگر در سوم پایینی صفحه هست، به پایین بچسبد
            newY = windowHeight - rect.height - 15;
        } else {
            // اگر در وسط هست، ارتفاع فعلی حفظ شود
            newY = Math.max(15, Math.min(newY, windowHeight - rect.height - 15));
        }
        
        // انیمیشن Snap
        this.touchElement.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        this.touchElement.style.left = newX + 'px';
        this.touchElement.style.top = newY + 'px';
        
        setTimeout(() => {
            this.touchElement.style.transition = '';
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
                    this.touchElement.style.left = position.left;
                    this.touchElement.style.top = position.top;
                }
            } catch (e) {
                console.warn('خطا در بارگذاری موقعیت دکمه');
            }
        }
    }
}

// مقداردهی وقتی DOM لود شد
document.addEventListener('DOMContentLoaded', () => {
    window.assistiveTouch = new AssistiveTouch();
});

// همچنین برای اطمینان از کارکرد در موبایل
window.addEventListener('load', () => {
    if (window.assistiveTouch) {
        window.assistiveTouch.ensureVisibility();
    }
});


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
        
        // 3. نمایش صفحه اصلی
        if (typeof showView === 'function') {
            showView('home');
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
                window.assistiveTouch = new AssistiveTouch();
                console.log('🎮 دکمه شناور راه‌اندازی شد');
            }, 800);
        }
        
        // 6. هایلایت‌ها و ابزارها
        setTimeout(() => {
            // هایلایت‌های خانه
            document.querySelectorAll('.highlight-circle[data-category]').forEach(circle => {
                circle.addEventListener('click', (e) => {
                    const category = e.currentTarget.getAttribute('data-category');
                    
                    document.querySelectorAll('.highlight-circle[data-category]').forEach(c => {
                        c.classList.remove('active');
                    });
                    e.currentTarget.classList.add('active');
                    
                    if (typeof showView === 'function') {
                        showView(category);
                    }
                    
                    if (appState) {
                        appState.currentCategory = category;
                        saveUserState();
                    }
                });
            });
            
            // هایلایت‌های ابزار
            document.querySelectorAll('[data-tool]').forEach(circle => {
                circle.addEventListener('click', (e) => {
                    const toolId = e.currentTarget.getAttribute('data-tool');
                    if (typeof activateTool === 'function') {
                        activateTool(toolId);
                    }
                });
            });
            
            console.log('✅ هایلایت‌ها راه‌اندازی شدند');
        }, 1000);
        
        console.log('🎉 برنامه با موفقیت راه‌اندازی شد');
        
    } catch (error) {
        console.error('❌ خطا در راه‌اندازی:', error);
    }
}

// راه‌اندازی نهایی
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeLivePulse, 100);
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

document.addEventListener('DOMContentLoaded', function() {
    // راه‌اندازی چت AI با تاخیر کوتاه
    setTimeout(setupAiChat, 300);
    
    // مودال نظرات
    const footerFeedback = document.getElementById('footerFeedback');
    const feedbackModal = document.getElementById('feedbackModal');
    const closeFeedbackModal = document.getElementById('closeFeedbackModal');
    
    if (footerFeedback && feedbackModal) {
        footerFeedback.addEventListener('click', (e) => {
            e.preventDefault();
            feedbackModal.classList.add('active');
        });
        
        if (closeFeedbackModal) {
            closeFeedbackModal.addEventListener('click', () => {
                feedbackModal.classList.remove('active');
            });
        }
    }
    
    // پنل مقایسه نقشه
    const compareToggle = document.getElementById('compareToggle');
    const comparePanel = document.getElementById('comparePanel');
    const closeCompare = document.getElementById('closeCompare');
    
    if (compareToggle && comparePanel) {
        compareToggle.addEventListener('click', () => {
            comparePanel.classList.toggle('hidden');
        });
        
        if (closeCompare) {
            closeCompare.addEventListener('click', () => {
                comparePanel.classList.add('hidden');
            });
        }
    }
    
    // فیلتر نقشه
    const mapFilter = document.getElementById('mapFilter');
    const currentFilterBadge = document.getElementById('currentFilterBadge');
    
    if (mapFilter && currentFilterBadge) {
        mapFilter.addEventListener('change', () => {
            currentFilterBadge.textContent = mapFilter.options[mapFilter.selectedIndex].text;
        });
    }
    
    // جلوگیری از اسکرول body وقتی مودال باز است
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.classList.contains('active')) {
                document.body.classList.add('modal-open');
            } else {
                // بررسی که آیا مودال دیگری باز نیست
                const activeModals = document.querySelectorAll('.modal-overlay.active');
                if (activeModals.length === 0) {
                    document.body.classList.remove('modal-open');
                }
            }
        });
    });
    
    document.querySelectorAll('.modal-overlay').forEach((modal) => {
        observer.observe(modal, { attributes: true, attributeFilter: ['class'] });
    });
});

console.log('📄 فایل JavaScript لود شد - آماده راه‌اندازی...');
