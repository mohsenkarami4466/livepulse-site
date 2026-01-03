/**
 * ============================================
 * 🕐 Globe Clock - Small Globe with Market Clock
 * ============================================
 * 
 * این فایل شامل کره کوچک و ساعت بازار است.
 * This file contains the small globe and market clock functionality.
 * 
 * وابستگی‌ها / Dependencies:
 * - THREE.js (THREE.Scene, THREE.PerspectiveCamera, THREE.WebGLRenderer, etc.)
 * - globe-helpers.js (addEventListenerOnce)
 * - window.CONFIG (برای UPDATE_MS)
 * - window.logger (optional)
 * - window.errorHandler (optional)
 * - window.openFinancialGlobe (برای باز کردن کره بزرگ)
 * 
 * استفاده / Usage:
 * این فایل باید بعد از globe-helpers.js و قبل از globe-modals.js لود شود.
 * This file should be loaded after globe-helpers.js and before globe-modals.js.
 * 
 * توابع اصلی / Main Functions:
 * - initGlobe(): ساخت و راه‌اندازی کره کوچک
 * - animate(): انیمیشن کره
 * - addMarketPoints(): اضافه کردن نقاط بازار روی کره
 * - createUTCClockRing(): ساخت حلقه ساعت UTC
 * - updateUTCClock(): به‌روزرسانی ساعت UTC
 * - updateGlobePosition(): تنظیم موقعیت کره کوچک
 * - updateHighlightsPosition(): تنظیم موقعیت هایلایت‌ها
 * - handleSmallGlobeClick(): مدیریت کلیک روی کره کوچک
 * - setupSmallGlobeClick(): راه‌اندازی event listener برای کره کوچک
 * 
 * متغیرهای سراسری / Global Variables:
 * - marketData: آرایه داده‌های بازارها
 * - scene, camera, renderer, globe: اشیاء THREE.js
 * - dayMat, nightMat: متریال‌های روز و شب
 * - sun: نور خورشید
 * - sunAngle: زاویه خورشید
 * 
 * ============================================
 */

/* ========== داده‌های بازار / Market Data ========== */
/**
 * آرایه داده‌های بازارهای جهانی
 * Array of global market data
 * 
 * ساختار هر بازار / Structure of each market:
 * - name: نام بازار / Market name
 * - open: ساعت باز شدن (UTC) / Opening time (UTC)
 * - close: ساعت بسته شدن (UTC) / Closing time (UTC)
 * - utcOffset: افست UTC / UTC offset
 * - coords: [lat, lng] مختصات جغرافیایی / Geographic coordinates
 * - major: (optional) آیا بازار اصلی است / Whether market is major
 * 
 * استفاده / Usage:
 * این داده‌ها برای نمایش نقاط روی کره و تعیین وضعیت (باز/بسته) استفاده می‌شوند.
 * This data is used to display points on the globe and determine status (open/closed).
 */
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
/**
 * آرایه ساعات UTC (00:00 تا 23:00)
 * Array of UTC hours (00:00 to 23:00)
 */
const _utcHours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

/* ========== متغیرهای سراسری THREE.js / Global THREE.js Variables ========== */
/**
 * متغیرهای سراسری برای کره کوچک
 * Global variables for small globe
 * 
 * - scene: صحنه THREE.js / THREE.js scene
 * - camera: دوربین THREE.js / THREE.js camera
 * - renderer: رندرر THREE.js / THREE.js renderer
 * - globe: مش کره / Globe mesh
 * - dayMat: متریال روز / Day material
 * - nightMat: متریال شب / Night material
 * - sun: نور خورشید / Sun light
 * - sunAngle: زاویه خورشید / Sun angle
 */
let scene, camera, renderer, globe, dayMat, _nightMat, sun;
let sunAngle = 0;
let globeInitialized = false; // جلوگیری از initialization چندباره

// استفاده از CONFIG برای UPDATE_MS
/**
 * استفاده از CONFIG برای به‌روزرسانی
 * Using CONFIG for update interval
 */
const cfg = window.CONFIG || CONFIG;
const _UPDATE_MS = cfg.TIME.UPDATE_INTERVAL; // ۳۰ ثانیه

/* ========== توابع موقعیت / Position Functions ========== */

/**
 * تنظیم موقعیت کره کوچک زیر شاخص‌ها
 * Set small globe position below indicators
 * 
 * وابستگی‌ها / Dependencies:
 * - .indicators-unified-container (container شاخص‌ها)
 * - #globeClockWrapper (wrapper کره کوچک)
 * - window.CONFIG (برای breakpoint و gap)
 * 
 * استفاده / Usage:
 * این تابع موقعیت کره کوچک را بر اساس موقعیت شاخص‌ها تنظیم می‌کند.
 * This function sets the small globe position based on indicators position.
 */
function _updateGlobePosition() {
  const indicatorsContainer = document.querySelector('.indicators-unified-container');
  const globeWrapper = document.getElementById('globeClockWrapper');
  
  if (!indicatorsContainer || !globeWrapper) {
    const log = window.logger || { debug: console.log }; 
    log.debug('indicatorsContainer یا globeWrapper پیدا نشد - ممکن است در React مدیریت شود');
    return;
  }
  
  // بررسی اینکه آیا در React mode هستیم
  // Check if in React mode
  const inlineTop = globeWrapper.style.top;
  const hasReactStyle = inlineTop === '8px' || globeWrapper.getAttribute('data-react-mode') === 'true';
  
  if (hasReactStyle) {
    // در React mode، موقعیت توسط React component مدیریت می‌شود
    // In React mode, position is managed by React component
    return;
  }
  
  // محاسبه ارتفاع شاخص‌ها
  // Calculate indicators height
  const indicatorsHeight = indicatorsContainer.offsetHeight;
  const indicatorsTop = indicatorsContainer.offsetTop || 60; // fallback به 60px
  
  // بررسی اندازه صفحه برای تنظیم فاصله
  // Check screen size for gap setting
  const cfg = window.CONFIG || CONFIG;
  const isMobile = window.innerWidth <= cfg.UI.MOBILE_BREAKPOINT;
  const gap = isMobile ? cfg.UI.GAP.MOBILE : cfg.UI.GAP.DESKTOP;
  
  // تنظیم top کره کوچک
  // Set small globe top
  const globeTop = indicatorsTop + indicatorsHeight + gap;
  
  // اطمینان از نمایش کره کوچک قبل از تنظیم موقعیت
  // Ensure small globe is visible before setting position
  globeWrapper.style.setProperty('display', 'block', 'important');
  globeWrapper.style.setProperty('visibility', 'visible', 'important');
  globeWrapper.style.setProperty('opacity', '1', 'important');
  globeWrapper.style.setProperty('top', `${globeTop}px`, 'important');
  
  // بررسی اینکه آیا کره کوچک از viewport خارج می‌شود
  // Check if small globe goes out of viewport
  const globeHeight = globeWrapper.offsetHeight || 100;
  const viewportHeight = window.innerHeight;
  
  if (globeTop + globeHeight > viewportHeight) {
    // اگر از viewport خارج شد، آن را بالاتر ببر
    // If out of viewport, move it higher
    const adjustedTop = Math.max(60, viewportHeight - globeHeight - 10);
    globeWrapper.style.setProperty('top', `${adjustedTop}px`, 'important');
  }
  
  // تنظیم موقعیت هایلایت‌ها - فقط اگر DOM آماده است
  // Set highlights position - only if DOM is ready
  // این فراخوانی اولیه حذف شد - باید از React فراخوانی شود
  // updateHighlightsPosition(); // حذف شد - باید از React فراخوانی شود
}

/**
 * بررسی اینکه آیا stylesheet‌ها لود شده‌اند
 * Check if stylesheets are loaded
 */
function areStylesheetsLoaded() {
  // بررسی اینکه آیا document.readyState 'complete' است
  if (document.readyState !== 'complete') {
    return false;
  }
  
  // بررسی اینکه آیا همه stylesheet‌ها لود شده‌اند
  const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
  for (const sheet of stylesheets) {
    if (sheet.sheet === null) {
      // اگر sheet هنوز لود نشده، false برگردان
      return false;
    }
  }
  
  return true;
}

/**
 * انتظار برای لود شدن stylesheet‌ها
 * Wait for stylesheets to load
 */
function waitForStylesheets(callback, maxWait = 3000) {
  const startTime = Date.now();
  
  function check() {
    if (areStylesheetsLoaded()) {
      callback();
    } else if (Date.now() - startTime < maxWait) {
      // اگر هنوز لود نشده و زمان تمام نشده، دوباره چک کن
      requestAnimationFrame(check);
    } else {
      // اگر زمان تمام شد، callback را اجرا کن (fallback)
      callback();
    }
  }
  
  // اگر document هنوز لود نشده، منتظر بمان
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      requestAnimationFrame(check);
    });
  } else {
    requestAnimationFrame(check);
  }
}

/**
 * تنظیم موقعیت هایلایت‌ها - محاسبه بر اساس موقعیت کارت portfolio
 * Set highlights position - calculate based on portfolio card position
 * 
 * وابستگی‌ها / Dependencies:
 * - .view.active-view (view فعال)
 * - .highlights-section, .home-highlights, etc. (بخش‌های هایلایت)
 * - .portfolio-summary-card (کارت portfolio)
 * - header (هدر)
 * 
 * استفاده / Usage:
 * این تابع موقعیت بخش‌های هایلایت را بر اساس موقعیت کارت portfolio تنظیم می‌کند.
 * This function sets highlights sections position based on portfolio card position.
 */
function updateHighlightsPosition() {
  // پیدا کردن view فعال - در React Router همه viewها render می‌شوند
  // Find active view - in React Router all views are rendered
  // اول سعی می‌کنیم view فعال را پیدا کنیم (برای vanilla JS)
  let activeView = document.querySelector('.view.active-view');
  
  // اگر view فعال پیدا نشد، همه viewها را بررسی می‌کنیم (برای React Router)
  // If active view not found, check all views (for React Router)
  if (!activeView) {
    // در React Router، view فعال view ای است که در layout-main است و display: block دارد
    const allViews = document.querySelectorAll('.layout-main > .view, .view');
    for (const view of allViews) {
      const computedStyle = window.getComputedStyle(view);
      if (computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden') {
        activeView = view;
        break;
      }
    }
  }
  
  // در React Router، activeView اختیاری است - highlights در .layout-main هستند
  // In React Router, activeView is optional - highlights are in .layout-main
  // فقط در development log کن - در React Router activeView ممکن است پیدا نشود
  // Only log in development - in React Router activeView might not be found
  
  // پیدا کردن highlights - در React Router highlights در .layout-main است (نه در .view)
  // Find highlights - in React Router highlights are in .layout-main (not in .view)
  let highlightsSections = [];
  
  // اول در .layout-main جستجو کن (جایی که highlights واقعاً هستند)
  const layoutMain = document.querySelector('.layout-main');
  if (layoutMain) {
    highlightsSections = layoutMain.querySelectorAll('.highlights-section, .home-highlights, .news-highlights, .tools-highlights, .education-highlights, .relax-highlights, .globe-highlights');
  }
  
  // اگر پیدا نشد، در کل document جستجو کن (fallback)
  if (highlightsSections.length === 0) {
    highlightsSections = document.querySelectorAll('.highlights-section, .home-highlights, .news-highlights, .tools-highlights, .education-highlights, .relax-highlights, .globe-highlights');
  }
  
  if (highlightsSections.length === 0) {
    // اگر highlights پیدا نشد، خروج کن - بدون log (normal در React Router)
    return;
  }
  
  // پیدا کردن المان‌های مورد نیاز برای محاسبه
  // Find elements needed for calculation
  const header = document.querySelector('.glass-header, .header-container')?.parentElement || document.querySelector('header');
  const headerHeight = header ? header.offsetHeight : 60;
  const portfolioCard = document.querySelector('.portfolio-summary-card');
  const _indicatorsCard = document.querySelector('.indicators-glass-card');
  const _globeWrapper = document.getElementById('globeClockWrapper');
  
  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
  const isDesktop = window.innerWidth >= 1024;
  
  let marginTop;
  
  if (isDesktop) {
    // در دسکتاپ: محاسبه بر اساس موقعیت واقعی کارت portfolio
    // Desktop: calculate based on actual portfolio card position
    if (portfolioCard) {
      // استفاده از getBoundingClientRect برای محاسبه موقعیت viewport
      // portfolioCard با position: fixed است، پس باید از getBoundingClientRect استفاده کنیم
      const portfolioRect = portfolioCard.getBoundingClientRect();
      const portfolioBottom = portfolioRect.bottom;
      
      // پیدا کردن موقعیت بالای layout-main در viewport (یا activeView اگر موجود باشد)
      const layoutMain = document.querySelector('.layout-main');
      const referenceElement = activeView || layoutMain || document.body;
      const referenceRect = referenceElement.getBoundingClientRect();
      const referenceTop = referenceRect.top;
      
      // محاسبه فاصله از بالای reference element تا پایین کارت portfolio + 15px gap
      // چون هر دو در viewport هستند، می‌توانیم مستقیماً تفریق کنیم
      const calculatedMargin = portfolioBottom - referenceTop + 15;
      marginTop = `${Math.max(calculatedMargin, 15)}px`; // حداقل 15px
      
      // فقط در development log کن
      // Check if we're in development mode (works in both browser and Node.js)
      const isDev = (typeof window !== 'undefined' && window.location && window.location.hostname === 'localhost') || 
                    (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development');
      if (isDev) {
        console.log('🔍 Desktop margin calculation (viewport):', {
          portfolioBottom,
          referenceTop: referenceTop,
          calculatedMargin,
          finalMargin: marginTop
        });
      }
    } else {
      // fallback: محاسبه بر اساس ارتفاع‌های ثابت
      marginTop = `calc(var(--header-height, ${headerHeight}px) + 8px + clamp(60px, 6vw, 80px) + 12px + clamp(55px, 6.5vw, 70px) + 15px)`;
      // فقط در development log کن
      const isDev = (typeof window !== 'undefined' && window.location && window.location.hostname === 'localhost') || 
                    (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development');
      if (isDev) {
        console.warn('⚠️ Portfolio card not found, using fallback margin');
      }
    }
  } else if (isTablet) {
    // در تبلت: پایین کارت portfolio + 20px gap
    // Tablet: below portfolio card + 20px gap
    if (portfolioCard) {
      // استفاده از getBoundingClientRect برای محاسبه موقعیت viewport
      const portfolioRect = portfolioCard.getBoundingClientRect();
      const portfolioBottom = portfolioRect.bottom;
      
      const layoutMain = document.querySelector('.layout-main');
      const referenceElement = activeView || layoutMain || document.body;
      const referenceRect = referenceElement.getBoundingClientRect();
      const referenceTop = referenceRect.top;
      
      const calculatedMargin = portfolioBottom - referenceTop + 20;
      marginTop = `${Math.max(calculatedMargin, 20)}px`; // حداقل 20px
    } else {
      marginTop = `calc(var(--header-height, ${headerHeight}px) + 8px + clamp(50px, 6vw, 80px) + 8px + clamp(40px, 4vw, 60px) + 15px)`;
    }
  } else if (isMobile) {
    // در موبایل: محاسبه بر اساس موقعیت واقعی کارت portfolio
    // Mobile: calculate based on actual portfolio card position
    if (portfolioCard) {
      // استفاده از getBoundingClientRect برای محاسبه موقعیت viewport
      const portfolioRect = portfolioCard.getBoundingClientRect();
      const portfolioBottom = portfolioRect.bottom;
      
      const layoutMain = document.querySelector('.layout-main');
      const referenceElement = activeView || layoutMain || document.body;
      const referenceRect = referenceElement.getBoundingClientRect();
      const referenceTop = referenceRect.top;
      
      const calculatedMargin = portfolioBottom - referenceTop + 20;
      marginTop = `${Math.max(calculatedMargin, 20)}px`; // حداقل 20px
    } else {
      marginTop = `calc(var(--header-height, ${headerHeight}px) + 8px + clamp(60px, 8vw, 90px) + 8px + clamp(45px, 5.5vw, 60px) + 15px)`;
    }
  } else {
    // fallback برای سایر حالت‌ها
    // fallback for other cases
      marginTop = `calc(var(--header-height, ${headerHeight}px) + 8px + clamp(50px, 6vw, 70px) + 12px + clamp(55px, 6.5vw, 70px) + 15px)`;
  }
  
  highlightsSections.forEach(section => {
    if (section) {
      // تنظیم margin-top - به حالت قبل از تغییرات agent
      // دسکتاپ: 120px، تبلت: 60px، موبایل: 30px
      const isDesktop = window.innerWidth >= 1024;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      const marginTop = isDesktop ? '120px' : (isTablet ? '60px' : '30px');
      
      // استفاده از waitForStylesheets برای جلوگیری از Layout warning
      // Wait for stylesheets before setting styles to prevent Layout warning
      waitForStylesheets(() => {
        // استفاده از requestAnimationFrame برای جلوگیری از force layout
        requestAnimationFrame(() => {
          section.style.setProperty('margin-top', marginTop, 'important');
          section.style.setProperty('padding-top', '0', 'important');
          section.style.setProperty('display', 'flex', 'important'); // تغییر از block به flex - برای highlights-container
          section.style.setProperty('flex-direction', 'column', 'important'); // برای highlights-container
          section.style.setProperty('visibility', 'visible', 'important');
          section.style.setProperty('opacity', '1', 'important');
          section.style.setProperty('position', 'relative', 'important');
          section.style.setProperty('z-index', '10', 'important'); // بالاتر از view ها (1) اما پایین‌تر از fixed elements
          // عرض کامل با 5px margin از هر طرف - استفاده از 100vw برای اطمینان از عرض کامل
          // عرض با CSS تنظیم می‌شود - اینجا فقط margin-top را تنظیم می‌کنیم
          // Width is set by CSS - we only set margin-top here
          section.style.setProperty('padding-left', '0', 'important'); // padding حذف شد - margin استفاده می‌شود
          section.style.setProperty('padding-right', '0', 'important');
          section.style.setProperty('height', '80px', 'important'); // ارتفاع ثابت
          section.style.setProperty('min-height', '80px', 'important');
          
          // اطمینان از نمایش highlights-container - فقط استایل‌های ضروری (نه width)
          const container = section.querySelector('.highlights-container');
          if (container) {
            container.style.setProperty('display', 'flex', 'important');
            // عرض و اندازه‌ها با CSS تنظیم می‌شوند - اینجا تغییر نمی‌دهیم
            // Width and sizes are set by CSS - we don't change them here
            container.style.setProperty('visibility', 'visible', 'important');
            container.style.setProperty('opacity', '1', 'important');
            container.style.setProperty('justify-content', 'flex-start', 'important');
            container.style.setProperty('align-items', 'center', 'important');
            container.style.setProperty('flex-wrap', 'nowrap', 'important');
            container.style.setProperty('overflow-x', 'auto', 'important');
            container.style.setProperty('overflow-y', 'hidden', 'important');
            container.style.setProperty('gap', '5px', 'important'); // gap ثابت 5px بین هایلایت‌ها
          }
          
          // اطمینان از نمایش highlight-circle ها - فقط استایل‌های ضروری (نه width یا اندازه)
          const circles = section.querySelectorAll('.highlight-circle');
          
          circles.forEach(circle => {
            circle.style.setProperty('display', 'flex', 'important');
            circle.style.setProperty('visibility', 'visible', 'important');
            circle.style.setProperty('opacity', '1', 'important');
            // عرض، flex، و اندازه‌ها با CSS تنظیم می‌شوند - اینجا تغییر نمی‌دهیم
            // Width, flex, and sizes are set by CSS - we don't change them here
          });
          
          // Debug logging - فقط در development
          if (typeof window !== 'undefined' && window.location && window.location.hostname === 'localhost') {
            console.log('🔍 Highlights position updated:', {
              section: section.className,
              marginTop: marginTop,
              isMobile: isMobile,
              isTablet: isTablet,
              isDesktop: isDesktop,
              portfolioCard: portfolioCard ? 'found' : 'not found',
              activeView: activeView ? activeView.id || activeView.className : 'not found',
              highlightsCount: highlightsSections.length
            });
          }
        });
      });
    }
  });
  
  // اگر highlights پیدا نشد، خروج کن - بدون log (normal در React Router)
  if (highlightsSections.length === 0) {
    return;
  }
}

// تابع wrapper برای انتظار stylesheet‌ها قبل از اجرا
// Wrapper function to wait for stylesheets before execution
function updateHighlightsPositionSafe() {
  waitForStylesheets(() => {
    // تاخیر اضافی برای اطمینان از render شدن
    setTimeout(() => {
      updateHighlightsPosition();
    }, 100);
  });
}

// در دسترس قرار دادن تابع برای استفاده در جاهای دیگر
// Export function for use elsewhere
if (typeof window !== 'undefined') {
  window.updateHighlightsPosition = updateHighlightsPositionSafe;
}

/* ========== توابع ساعت UTC / UTC Clock Functions ========== */

/**
 * ساخت ساعت UTC دور کره کوچک
 * Create UTC clock ring around small globe
 * 
 * وابستگی‌ها / Dependencies:
 * - #utcClockRing (element حلقه ساعت)
 * 
 * استفاده / Usage:
 * این تابع حلقه ساعت UTC را دور کره کوچک می‌سازد.
 * This function creates UTC clock ring around small globe.
 */
function createUTCClockRing() {
  const ring = document.getElementById('utcClockRing');
  if (!ring) {
    const log = window.logger || { warn: console.warn };
    log.warn('⚠️ createUTCClockRing: utcClockRing element پیدا نشد');
    return;
  }
  
  ring.innerHTML = '';
  
  // ۱۲ موقعیت برای نمایش ساعت (هر ۳۰ درجه)
  // 12 positions for hour display (every 30 degrees)
  const positions = 12;
  
  for (let i = 0; i < positions; i++) {
    const hourEl = document.createElement('span');
    hourEl.className = 'utc-hour';
    hourEl.dataset.position = i;
    
    // محاسبه موقعیت روی دایره
    // Calculate position on circle
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
    // Add blinking dot between each pair of numbers (indicating half hour)
    if (i < positions - 1) {
      const dotEl = document.createElement('span');
      dotEl.className = 'half-hour-dot';
      dotEl.dataset.position = i;
      
      // موقعیت نقطه در وسط دو عدد (15 درجه بعد از هر عدد)
      // Dot position in middle of two numbers (15 degrees after each number)
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

/**
 * آپدیت ساعت UTC - نمایش ساعت فعلی در موقعیت صحیح
 * Update UTC clock - display current hour in correct position
 * 
 * وابستگی‌ها / Dependencies:
 * - .utc-hour (element‌های ساعت)
 * - .half-hour-dot (نقطه‌های نیم ساعت)
 * 
 * استفاده / Usage:
 * این تابع ساعت UTC فعلی را به‌روزرسانی می‌کند.
 * This function updates current UTC time.
 */
function updateUTCClock() {
  const now = new Date();
  const currentHour = now.getUTCHours();
  const currentMinutes = now.getUTCMinutes();
  const isHalfHour = currentMinutes >= 30;
  
  // آپدیت اعداد - هر موقعیت ساعت متناظر خودش را نشان می‌دهد
  // Update numbers - each position shows its corresponding hour
  document.querySelectorAll('.utc-hour').forEach((el, index) => {
    const displayHour = (index * 2) % 24;
    el.textContent = displayHour.toString().padStart(2, '0');
    el.dataset.hour = displayHour;
    
    // هایلایت ساعت فعلی
    // Highlight current hour
    const hourRange = [displayHour, (displayHour + 1) % 24];
    if (hourRange.includes(currentHour)) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });
  
  // آپدیت نقطه‌های چشمک‌زن - نشان‌دهنده نیم ساعت
  // Update blinking dots - indicating half hour
  document.querySelectorAll('.half-hour-dot').forEach((el, index) => {
    const hour1 = (index * 2) % 24;
    const hour2 = ((index * 2) + 1) % 24;
    
    if (isHalfHour && (currentHour === hour1 || currentHour === hour2)) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });
}

/* ========== توابع کره کوچک / Small Globe Functions ========== */

/**
 * ساخت صحنه کره کوچک
 * Initialize small globe scene
 * 
 * وابستگی‌ها / Dependencies:
 * - THREE.js (THREE.Scene, THREE.PerspectiveCamera, THREE.WebGLRenderer, etc.)
 * - #globeContainer (container کره)
 * - earth-day.jpg (تکسچر زمین)
 * - window.logger (optional)
 * - window.errorHandler (optional)
 * 
 * استفاده / Usage:
 * این تابع صحنه THREE.js را برای کره کوچک راه‌اندازی می‌کند.
 * This function initializes THREE.js scene for small globe.
 */
function initGlobe() {
  // جلوگیری از initialization چندباره
  if (globeInitialized && globe && renderer && scene && camera) {
    const log = window.logger || { info: console.log };
    log.info('ℹ️ کره کوچک قبلاً راه‌اندازی شده است');
    return;
  }
  
  const log = window.logger || { error: console.error, warn: console.warn, success: console.log };
  const errorHandler = window.errorHandler;
  
  // ساعت اصلی همیشه اولویت دارد - React mode را نادیده بگیر
  const globeWrapper = document.getElementById('globeClockWrapper');
  const isReactMode = globeWrapper && globeWrapper.getAttribute('data-react-mode') === 'true';
  
  // ساعت اصلی همیشه فعال شود - این اولویت اصلی است
  if (isReactMode) {
    log.info('ℹ️ React mode تشخیص داده شد اما ساعت اصلی اولویت دارد - ادامه اجرا...');
    // ادامه اجرا - ساعت اصلی همیشه فعال شود
  }
  
  const container = document.getElementById('globeContainer');
  if (!container) {
    const error = new Error('globeContainer پیدا نشد');
    if (errorHandler) {
      errorHandler.handleError(error, 'initGlobe');
    } else {
      log.error('globeContainer پیدا نشد!');
    }
    return;
  }
  
  // اگر قبلاً renderer ساخته شده، آن را پاک کن
  if (renderer && container.contains(renderer.domElement)) {
    container.removeChild(renderer.domElement);
    renderer.dispose();
    renderer = null;
  }
  
  // اگر قبلاً scene ساخته شده، آن را پاک کن
  if (scene) {
    while(scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }
    scene = null;
  }
  
  try {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 3.2);
    
    // بررسی پشتیبانی WebGL
    // Check WebGL support
    const testCanvas = document.createElement('canvas');
    const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
    if (!gl) {
      const error = new Error('WebGL پشتیبانی نمی‌شود');
      if (errorHandler) {
        errorHandler.showUserError('مرورگر شما از WebGL پشتیبانی نمی‌کند. لطفاً مرورگر خود را به‌روزرسانی کنید.', 'خطای WebGL');
      } else {
        log.error('WebGL پشتیبانی نمی‌شود!');
      }
      container.innerHTML = '<p style="color: #ff6b6b; padding: 20px;">مرورگر شما از WebGL پشتیبانی نمی‌کند. لطفاً مرورگر خود را به‌روزرسانی کنید.</p>';
      return;
    }
    
    renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance",
      failIfMajorPerformanceCaveat: false
    });
    
    if (!renderer) {
      const error = new Error('Renderer ساخته نشد');
      if (errorHandler) {
        errorHandler.handleError(error, 'initGlobe');
      } else {
        log.error('Renderer ساخته نشد!');
      }
      return;
    }
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
    const canvas = renderer.domElement;
    canvas.style.pointerEvents = 'none'; // کلیک‌ها از canvas رد بشن به container
    
    // مدیریت خطاهای WebGL
    // Handle WebGL errors
    canvas.addEventListener('webglcontextlost', (event) => {
      event.preventDefault();
      log.warn('WebGL context از دست رفت');
    });
    
    canvas.addEventListener('webglcontextrestored', () => {
      log.success('WebGL context بازگردانده شد');
      initGlobe();
    });
    
    container.appendChild(canvas);
    log.success('کره کوچک ساخته شد');
  } catch (error) {
    if (window.errorHandler) {
      window.errorHandler.handleError(error, 'initGlobe');
    } else {
      log.error('خطا در ساخت کره کوچک:', error);
    }
    container.innerHTML = `<p style="color: #ff6b6b; padding: 20px;">خطا در ساخت کره: ${error.message}</p>`;
    return;
  }

  // نور بیشتر برای دید بهتر کره کوچک
  // More light for better visibility
  const ambient = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambient);
  sun = new THREE.DirectionalLight(0xffffff, 0.8);
  sun.name = 'sun';
  scene.add(sun);

  const geometry = new THREE.SphereGeometry(1, 64, 64);
  const loader = new THREE.TextureLoader();
  
  // بارگذاری عکس روز - با fallback به CDN
  // Load day texture - with CDN fallback
  let dayTextureLoaded = false;
  const tryLoadDayTexture = (index) => {
    // تشخیص محیط: development یا production
    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    // تشخیص basePath از window.location.pathname
    const pathname = window.location.pathname;
    const basePath = pathname.startsWith('/livepulse-site') ? '/livepulse-site' : (isDev ? '' : '/livepulse-site');
    
    const texturePaths = [
      // اول از production paths (اولویت با basePath)
      `${basePath}/assets/images/earth-day.jpg`,
      `${basePath}/earth-day.jpg`,
      // سپس فایل‌های محلی در development
      '/assets/images/earth-day.jpg',
      './assets/images/earth-day.jpg',
      'assets/images/earth-day.jpg',
      // سپس فایل‌های محلی دیگر
      './earth-day.jpg',
      'earth-day.jpg',
      '/earth-day.jpg',
      // سپس CDN fallback (با crossOrigin)
      'https://unpkg.com/three-globe@2.27.3/example/img/earth-blue-marble.jpg',
      'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',
      'https://raw.githubusercontent.com/dataarts/webgl-globe/master/globe/diffuse.jpg',
      'https://cdn.jsdelivr.net/gh/dataarts/webgl-globe@master/globe/diffuse.jpg'
    ];
    
    if (index >= texturePaths.length) {
      const log = window.logger || { warn: console.warn }; 
      log.warn('⚠️ هیچ تکسچر روزی بارگذاری نشد، استفاده از رنگ پیش‌فرض');
      dayMat = new THREE.MeshPhongMaterial({ color: 0x2563eb });
      if (globe) {
        globe.material = dayMat;
      }
      return;
    }
    
    try {
      const texturePath = texturePaths[index];
      const isCDN = texturePath.startsWith('http://') || texturePath.startsWith('https://');
      
      // تنظیم crossOrigin برای CDN
      if (isCDN) {
        loader.crossOrigin = 'anonymous';
      }
      
      loader.load(
        texturePath,
        (texture) => {
          // تنظیمات texture برای کیفیت بهتر
          texture.wrapS = THREE.ClampToEdgeWrapping;
          texture.wrapT = THREE.ClampToEdgeWrapping;
          texture.minFilter = THREE.LinearMipmapLinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.generateMipmaps = true;
          
          dayMat = new THREE.MeshPhongMaterial({ map: texture });
          if (globe) {
            globe.material = dayMat;
            globe.material.needsUpdate = true;
          }
          dayTextureLoaded = true;
          const log = window.logger || { info: console.log }; 
          log.info('✅ تکسچر روز زمین بارگذاری شد:', texturePath);
          
          // اگر کره هنوز ساخته نشده، بعد از ساخت texture را اعمال کن
          if (!globe && scene) {
            // صبر کن تا کره ساخته شود
            const checkGlobe = setInterval(() => {
              if (globe) {
                globe.material = dayMat;
                globe.material.needsUpdate = true;
                clearInterval(checkGlobe);
              }
            }, 50);
            
            // تایم‌اوت بعد از 2 ثانیه
            setTimeout(() => clearInterval(checkGlobe), 2000);
          }
        },
        undefined,
        (error) => {
          const log = window.logger || { warn: console.warn }; 
          log.warn(`⚠️ تکسچر ${texturePath} بارگذاری نشد، تلاش بعدی...`, error);
          tryLoadDayTexture(index + 1);
        }
      );
    } catch (e) {
      const log = window.logger || { warn: console.warn }; 
      log.warn('⚠️ خطا در لود تکسچر روز:', e);
      tryLoadDayTexture(index + 1);
    }
  };
  
  // ساخت کره با material اولیه (رنگ آبی) - texture بعداً اعمال می‌شود
  if (!dayMat) {
    dayMat = new THREE.MeshPhongMaterial({ color: 0x2563eb });
  }
  
  if (dayMat) {
    nightMat = dayMat.clone();
  } else {
    nightMat = new THREE.MeshPhongMaterial({ color: 0x1e3a8a });
  }
  
  // ساخت کره بلافاصله
  globe = new THREE.Mesh(geometry, dayMat);
  scene.add(globe);
  
  // شروع لود texture - بعد از ساخت کره
  tryLoadDayTexture(0);

  addMarketPoints();
  
  // اطمینان از اینکه animate() همیشه اجرا می‌شود
  // Ensure animate() always runs
  if (window.smallGlobeAnimationId) {
    cancelAnimationFrame(window.smallGlobeAnimationId);
    window.smallGlobeAnimationId = null;
  }
  
  if (globe && renderer && scene && camera) {
    globeInitialized = true;
    animate();
    log.success('✅ انیمیشن کره کوچک شروع شد');
  } else {
    log.warn('⚠️ کره کوچک آماده نیست برای انیمیشن - تلاش مجدد...');
    setTimeout(() => {
      if (globe && renderer && scene && camera) {
        globeInitialized = true;
        animate();
        log.success('✅ انیمیشن کره کوچک شروع شد (retry)');
      } else {
        log.error('❌ کره کوچک آماده نیست برای انیمیشن بعد از retry');
        globeInitialized = false; // اجازه retry بعدی
      }
    }, 200);
  }
}

/**
 * نقاط بازار - چشمک‌زن
 * Market points - blinking
 * 
 * وابستگی‌ها / Dependencies:
 * - marketData (آرایه داده‌های بازار)
 * - globe (مش کره)
 * - THREE.js (THREE.Mesh, THREE.SphereGeometry, THREE.MeshBasicMaterial)
 * 
 * استفاده / Usage:
 * این تابع نقاط بازار را روی کره اضافه می‌کند و آن‌ها را چشمک‌زن می‌کند.
 * This function adds market points to globe and makes them blink.
 */
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

/**
 * رنگ وضعیت بازار
 * Market status color
 * 
 * @param {Object} market - داده بازار / Market data
 * @returns {number} رنگ HEX / HEX color
 * 
 * استفاده / Usage:
 * این تابع رنگ بازار را بر اساس وضعیت (باز/بسته/نزدیک به باز/نزدیک به بسته) برمی‌گرداند.
 * This function returns market color based on status (open/closed/near open/near close).
 */
function statusColor(market) {
  const now = utcMinutes();
  const open = timeToMinutes(market.open);
  const close = timeToMinutes(market.close);
  if (now >= open && now < close) return 0x00ff00;        // سبز / Green
  if (Math.abs(now - open)  <= 15) return 0xffff00;     // زرد / Yellow
  if (Math.abs(now - close) <= 15) return 0xff8800;     // نارنجی / Orange
  return 0xff0000; // قرمز / Red
}

/**
 * تبدیل زمان به دقیقه
 * Convert time to minutes
 * 
 * @param {string} t - زمان به فرمت "HH:MM" / Time in "HH:MM" format
 * @returns {number} تعداد دقیقه / Number of minutes
 */
function timeToMinutes(t) { 
  const [h, m] = t.split(':').map(Number); 
  return h * 60 + m; 
}

/**
 * دریافت دقیقه UTC فعلی
 * Get current UTC minutes
 * 
 * @returns {number} تعداد دقیقه از شروع روز UTC / Minutes from UTC day start
 */
function utcMinutes() {
  const d = new Date();
  return d.getUTCHours() * 60 + d.getUTCMinutes();
}

/**
 * تبدیل مختصات جغرافیایی به Vector3
 * Convert geographic coordinates to Vector3
 * 
 * @param {number} lat - عرض جغرافیایی / Latitude
 * @param {number} lng - طول جغرافیایی / Longitude
 * @returns {THREE.Vector3} موقعیت 3D / 3D position
 */
function latLngToVector3(lat, lng) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(Math.sin(phi) * Math.cos(theta));
  const z = Math.sin(phi) * Math.sin(theta);
  const y = Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

/**
 * خط واقعی شب/روز - آرام‌آرام طبق UTC
 * Real day/night line - gradually according to UTC
 * 
 * وابستگی‌ها / Dependencies:
 * - globe (مش کره)
 * - dayMat (متریال روز)
 * - sun (نور خورشید)
 * 
 * استفاده / Usage:
 * این تابع موقعیت خورشید را بر اساس ساعت UTC به‌روزرسانی می‌کند.
 * This function updates sun position based on UTC time.
 */
function updateSunAndMarkets() {
  const now = new Date();
  const utcHour = now.getUTCHours() + now.getUTCMinutes() / 60 + now.getUTCSeconds() / 3600;
  // همیشه از تکسچر روز استفاده کن
  // Always use day texture
  globe.material = dayMat;
  
  // خورشید فقط برای افکت نوری
  // Sun only for lighting effect
  sunAngle = (utcHour / 24) * 2 * Math.PI;
  const sunX = Math.cos(sunAngle) * 6;
  const sunZ = Math.sin(sunAngle) * 6;
  sun.position.set(sunX, 2, sunZ);
}

/**
 * انیمیشن کره کوچک
 * Small globe animation
 * 
 * وابستگی‌ها / Dependencies:
 * - globe (مش کره)
 * - renderer (رندرر)
 * - scene (صحنه)
 * - camera (دوربین)
 * 
 * استفاده / Usage:
 * این تابع انیمیشن چرخش کره را اجرا می‌کند.
 * This function runs globe rotation animation.
 */
function animate() {
  window.smallGlobeAnimationId = requestAnimationFrame(animate);
  if (globe && renderer && scene && camera) {
    globe.rotation.y += 0.0008;
    renderer.render(scene, camera);
  }
}

/* ========== توابع کلیک / Click Functions ========== */

// متغیر برای جلوگیری از کلیک‌های مکرر
// Variable to prevent multiple clicks
// توجه: globeOpening در globe-modals.js تعریف شده است
// Note: globeOpening is defined in globe-modals.js
// استفاده از window.globeOpening که در globe-modals.js export شده
// Use window.globeOpening which is exported from globe-modals.js

/**
 * تابع handler کلیک روی کره کوچک
 * Handler function for small globe click
 * 
 * @param {Event} e - رویداد کلیک / Click event
 * 
 * وابستگی‌ها / Dependencies:
 * - window.openFinancialGlobe (تابع باز کردن کره بزرگ)
 * - isUserLoggedIn (تابع بررسی لاگین)
 * - showLoginPrompt (تابع نمایش پیام لاگین)
 * 
 * استفاده / Usage:
 * این تابع کلیک روی کره کوچک را مدیریت می‌کند و کره بزرگ را باز می‌کند.
 * This function handles small globe click and opens large globe.
 */
function handleSmallGlobeClick(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (!e.currentTarget) {
        const log = window.logger || { warn: console.warn }; 
        log.warn('⚠️ currentTarget پیدا نشد');
        return;
    }
    
    const log = window.logger || { info: console.log, error: console.error, warn: console.warn };
    log.info('🖱️ کلیک روی کره کوچک:', e.type);
    
    // جلوگیری از double trigger در touch devices
    // Prevent double trigger on touch devices
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
    // Check login
    if (typeof isUserLoggedIn === 'function' && !isUserLoggedIn()) {
        if (typeof showLoginPrompt === 'function') {
            showLoginPrompt();
        }
        return;
    }
    
    // جلوگیری از کلیک‌های مکرر
    // Prevent multiple clicks
    // استفاده از window.globeOpening از globe-modals.js
    // Use window.globeOpening from globe-modals.js
    if (window.globeOpening) {
        log.info('⏳ کره در حال باز شدن است...');
        return;
    }
    
    if (window.globeOpening !== undefined) {
        window.globeOpening = true;
    }
    log.info('🚀 در حال باز کردن کره بزرگ...');
    
    // باز کردن کره مالی (کره بزرگ 3D با تمام ساعت‌های بازار)
    // Open financial globe (large 3D globe with all market hours)
    if (typeof openFinancialGlobe === 'function') {
        openFinancialGlobe();
    } else if (typeof window.openFinancialGlobe === 'function') {
        window.openFinancialGlobe();
    } else {
        log.error('❌ تابع openFinancialGlobe یافت نشد!');
    }
    
    // بعد از 1 ثانیه دوباره فعال کن
    // Re-enable after 1 second
    setTimeout(() => {
        // استفاده از window.globeOpening از globe-modals.js
        // Use window.globeOpening from globe-modals.js
        if (window.globeOpening !== undefined) {
            window.globeOpening = false;
        }
    }, 1000);
}

/**
 * Event listener برای کره کوچک
 * Event listener for small globe
 * 
 * وابستگی‌ها / Dependencies:
 * - #globeClockWrapper (wrapper کره)
 * - #globeContainer (container کره)
 * - handleSmallGlobeClick (تابع handler)
 * 
 * استفاده / Usage:
 * این تابع event listener را برای کره کوچک راه‌اندازی می‌کند.
 * This function sets up event listener for small globe.
 */
function setupSmallGlobeClick() {
    const wrapper = document.getElementById('globeClockWrapper');
    const container = document.getElementById('globeContainer');
    const target = wrapper || container;
    
    if (!target) {
        const log = window.logger || { warn: console.warn }; 
        log.warn('⚠️ کره کوچک پیدا نشد، تلاش مجدد...');
        setTimeout(setupSmallGlobeClick, 500);
        return;
    }
    
    // حذف event listener قبلی
    // Remove previous event listener
    target.removeEventListener('click', handleSmallGlobeClick);
    target.removeEventListener('touchend', handleSmallGlobeClick);
    
    // اضافه کردن event listener
    // Add event listener
    target.addEventListener('click', handleSmallGlobeClick, { passive: false });
    target.addEventListener('touchend', handleSmallGlobeClick, { passive: false });
    
    // استایل
    // Style
    target.style.cursor = 'pointer';
    target.style.webkitTapHighlightColor = 'transparent';
    
    const log = window.logger || { info: console.log }; 
    log.info('✅ Event listener کره کوچک فعال شد روی:', target.id);
}

// تابع بررسی لاگین
// Login check function
function isUserLoggedIn() {
  return true; // ✅ برای تست
}

// تابع نمایش پیام لاگین
// Login prompt function
function showLoginPrompt() {
  alert('🔐 برای دسترسی به این قابلیت، لطفاً وارد حساب کاربری خود شوید.\n\nاین قسمت فقط برای کاربران دارای اشتراک فعال می‌باشد.');
}

/* ========== Export توابع به window / Export Functions to window ========== */
/**
 * Export توابع به window برای استفاده در React و جاهای دیگر
 * Export functions to window for use in React and elsewhere
 */
if (typeof window !== 'undefined') {
    window.initGlobe = initGlobe;
    window.animate = animate;
    window.handleSmallGlobeClick = handleSmallGlobeClick;
    window.setupSmallGlobeClick = setupSmallGlobeClick;
    window.updateSunAndMarkets = updateSunAndMarkets;
    window.addMarketPoints = addMarketPoints;
    window.createUTCClockRing = createUTCClockRing;
    window.updateUTCClock = updateUTCClock;
    window.marketData = marketData; // Export marketData for use in other files
}

