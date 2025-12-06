// ==================== //
// 🌍 مدیریت کره‌ها
// ==================== //
// ==================== //
// 🕒 سیستم کامل ساعت بازارهای جهانی
// ==================== //

/**
 * 🔧 Helper function برای جلوگیری از duplicate event listeners
 * @param {HTMLElement|Window} element - المان یا window
 * @param {string} event - نوع event
 * @param {Function} handler - تابع handler
 * @param {string} uniqueId - شناسه یکتا برای این listener
 * @param {Object} options - گزینه‌های addEventListener
 */
function addEventListenerOnce(element, event, handler, uniqueId, options = {}) {
    if (!element) return;
    
    const flagKey = `data-listener-${uniqueId}`;
    
    // بررسی اینکه آیا listener قبلاً اضافه شده
    if (element.hasAttribute && element.hasAttribute(flagKey)) {
        // حذف listener قبلی و اضافه کردن دوباره (برای اطمینان از به‌روز بودن)
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
// استفاده از CONFIG برای UPDATE_MS
const cfg = window.CONFIG || CONFIG;
const UPDATE_MS = cfg.TIME.UPDATE_INTERVAL; // ۳۰ ثانیه

/* fetch داده‌ها (در این نسخه داده‌ها داخلی هستند) */
// این بخش در DOMContentLoaded یکپارچه در انتهای فایل اجرا می‌شود

/* راه‌اندازی اسلایدر پیوسته (Infinite Scroll) */
// اسلایدر قدیمی تبلیغات - غیرفعال شده (استفاده نمی‌شود)
// setupAdsSlider حذف شد - اسلایدر قدیمی دیگر استفاده نمی‌شود

/* تنظیم موقعیت کره کوچک زیر شاخص‌ها */
function updateGlobePosition() {
  const indicatorsContainer = document.querySelector('.indicators-unified-container');
  const globeWrapper = document.getElementById('globeClockWrapper');
  
  if (!indicatorsContainer || !globeWrapper) {
    const log = window.logger || { debug: console.log }; log.debug('indicatorsContainer یا globeWrapper پیدا نشد - ممکن است در React مدیریت شود');
    return;
  }
  
  // محاسبه ارتفاع شاخص‌ها
  const indicatorsHeight = indicatorsContainer.offsetHeight;
  const indicatorsTop = indicatorsContainer.offsetTop || 60; // fallback به 60px
  
  // بررسی اندازه صفحه برای تنظیم فاصله
  const cfg = window.CONFIG || CONFIG;
  const isMobile = window.innerWidth <= cfg.UI.MOBILE_BREAKPOINT;
  const gap = isMobile ? cfg.UI.GAP.MOBILE : cfg.UI.GAP.DESKTOP;
  
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
    // اگر از viewport خارج شد، آن را بالاتر ببر (بدون هشدار)
    const adjustedTop = Math.max(60, viewportHeight - globeHeight - 10);
    globeWrapper.style.setProperty('top', `${adjustedTop}px`, 'important');
  }
  
  // تنظیم موقعیت هایلایت‌ها - فقط برای یکسان کردن فاصله در همه صفحات
  updateHighlightsPosition();
}

/* تنظیم موقعیت هایلایت‌ها - یکسان کردن فاصله در همه صفحات */
function updateHighlightsPosition() {
  // پیدا کردن view فعال
  const activeView = document.querySelector('.view.active-view');
  if (!activeView) return;
  
  // پیدا کردن همه هایلایت‌ها (فقط آنهایی که در view فعال هستند)
  const highlightsSections = activeView.querySelectorAll('.highlights-section, .home-highlights, .news-highlights, .tools-highlights, .education-highlights, .relax-highlights, .globe-highlights');
  
  // تابع کمکی برای clamp (مثل CSS clamp)
  const clampValue = (min, vw, max) => {
    const viewportWidth = window.innerWidth;
    const vwValue = (viewportWidth * vw) / 100;
    return Math.max(min, Math.min(max, vwValue));
  };
  
  // محاسبه padding-top یکسان برای همه صفحات
  // استفاده از همان مقادیر CSS برای یکسان بودن
  const cfg = window.CONFIG || CONFIG;
  const isMobile = window.innerWidth <= cfg.UI.MOBILE_BREAKPOINT;
  let finalPadding;
  
  if (window.innerWidth <= 320) {
    finalPadding = clampValue(115, 12, 135);
  } else if (window.innerWidth <= 390) {
    finalPadding = clampValue(110, 12, 130);
  } else if (window.innerWidth <= 480) {
    finalPadding = clampValue(115, 13, 135);
  } else if (window.innerWidth <= (window.CONFIG || CONFIG).UI.MOBILE_BREAKPOINT) {
    finalPadding = clampValue(120, 14, 140);
  } else if (window.innerWidth <= 1024) {
    finalPadding = clampValue(125, 15, 145);
  } else {
    finalPadding = clampValue(120, 16, 140);
  }
  
  highlightsSections.forEach(section => {
    if (section) {
      // تنظیم padding-top یکسان برای همه صفحات
      section.style.setProperty('padding-top', `${finalPadding}px`, 'important');
      section.style.setProperty('display', 'block', 'important');
      section.style.setProperty('visibility', 'visible', 'important');
      section.style.setProperty('opacity', '1', 'important');
    }
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
  const log = window.logger || { error: console.error, warn: console.warn, success: console.log };
  const errorHandler = window.errorHandler;
  
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
  
  try {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 3.2);
    
    // بررسی پشتیبانی WebGL
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
    
    // بررسی خطاهای renderer
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
  
  // اضافه کردن canvas به container
  const canvas = renderer.domElement;
  canvas.style.pointerEvents = 'none'; // کلیک‌ها از canvas رد بشن به container
    
    // مدیریت خطاهای WebGL
    canvas.addEventListener('webglcontextlost', (event) => {
      event.preventDefault();
      log.warn('WebGL context از دست رفت');
    });
    
    canvas.addEventListener('webglcontextrestored', () => {
      log.success('WebGL context بازگردانده شد');
      // بازسازی کره
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
  const ambient = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambient);
  sun = new THREE.DirectionalLight(0xffffff, 0.8);
  sun.name = 'sun';
  scene.add(sun);

  const geometry = new THREE.SphereGeometry(1, 64, 64);
  const loader = new THREE.TextureLoader();
  
  // بارگذاری عکس روز - با fallback به CDN
  // استفاده از EARTH_TEXTURE_PATHS که در بالا تعریف شده
  let dayTextureLoaded = false;
  const tryLoadDayTexture = (index) => {
    // اگر EARTH_TEXTURE_PATHS تعریف نشده، از مسیرهای پیش‌فرض استفاده کن
    const texturePaths = (typeof EARTH_TEXTURE_PATHS !== 'undefined' && EARTH_TEXTURE_PATHS.day) 
      ? EARTH_TEXTURE_PATHS.day 
      : [
          // اول از فایل‌های محلی استفاده کن
          './earth-day.jpg', 
          'earth-day.jpg', 
          '/earth-day.jpg',
          // سپس CDN به عنوان fallback
          'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
          'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',
          'https://raw.githubusercontent.com/dataarts/webgl-globe/master/globe/diffuse.jpg'
        ];
    
    if (index >= texturePaths.length) {
      const log = window.logger || { warn: console.warn }; log.warn('⚠️ هیچ تکسچر روزی بارگذاری نشد، استفاده از رنگ پیش‌فرض');
      dayMat = new THREE.MeshPhongMaterial({ color: 0x2563eb });
      if (globe) {
        globe.material = dayMat;
      }
      return;
    }
    
    try {
      loader.load(
        texturePaths[index],
      (texture) => {
        dayMat = new THREE.MeshPhongMaterial({ map: texture });
        if (globe) {
          globe.material = dayMat;
        }
          dayTextureLoaded = true;
          const log = window.logger || { info: console.log }; log.info('✅ تکسچر روز زمین بارگذاری شد:', texturePaths[index]);
      },
      undefined,
      () => {
          const log = window.logger || { warn: console.warn }; log.warn(`⚠️ تکسچر ${texturePaths[index]} بارگذاری نشد، تلاش بعدی...`);
          tryLoadDayTexture(index + 1);
      }
    );
  } catch (e) {
      const log = window.logger || { warn: console.warn }; log.warn('⚠️ خطا در لود تکسچر روز:', e);
      tryLoadDayTexture(index + 1);
  }
  };
  
  tryLoadDayTexture(0);
  
  // اگر dayMat هنوز تعریف نشده، از رنگ پیش‌فرض استفاده کن
  if (!dayMat) {
    dayMat = new THREE.MeshPhongMaterial({ color: 0x2563eb });
  }
  
  // استفاده از همان تکسچر روز برای شب (حذف عکس شب)
  if (dayMat) {
    nightMat = dayMat.clone();
  } else {
    nightMat = new THREE.MeshPhongMaterial({ color: 0x1e3a8a });
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
        const log = window.logger || { warn: console.warn }; log.warn('⚠️ currentTarget پیدا نشد');
        return;
    }
    
    const log = window.logger || { info: console.log, error: console.error, warn: console.warn };
    log.info('🖱️ کلیک روی کره کوچک:', e.type);
    
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
        log.info('⏳ کره در حال باز شدن است...');
        return;
    }
    
    globeOpening = true;
    log.info('🚀 در حال باز کردن کره بزرگ...');
    
    // باز کردن کره مالی
    if (typeof openFinancialGlobe === 'function') {
        openFinancialGlobe();
    } else {
        log.error('❌ تابع openFinancialGlobe یافت نشد!');
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
        const log = window.logger || { warn: console.warn }; log.warn('⚠️ کره کوچک پیدا نشد، تلاش مجدد...');
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
    
    const log = window.logger || { info: console.log }; log.info('✅ Event listener کره کوچک فعال شد روی:', target.id);
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

// تکسچر زمین - با fallback به CDN (فقط روز)
const EARTH_TEXTURE_PATHS = {
    day: [
        './earth-day.jpg',
        'earth-day.jpg',
        '/earth-day.jpg',
        'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg'
    ]
};

// برای سازگاری با کدهای قدیمی
const EARTH_DAY_TEXTURE = EARTH_TEXTURE_PATHS.day[0];
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
    
    const log = window.logger || { info: console.log }; log.info(`✅ ${markers.length} marker اضافه شد برای نوع: ${type}`);
}

// تابع اصلی برای ساخت کره
function createAdvancedGlobe(containerId, type) {
    const container = document.getElementById(containerId);
    if (!container) {
        const log = window.logger || { error: console.error }; log.error('المان پیدا نشد:', containerId);
        return null;
    }

    // پاک کردن محتوای قبلی
    container.innerHTML = '';
    
    // اطمینان از اینکه container اندازه دارد
    let retryCount = 0;
    const maxRetries = 20; // حداکثر 20 بار تلاش (2 ثانیه)
    
    const ensureSize = () => {
        const log = window.logger || { info: console.log, error: console.error };
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        log.info(`🔍 بررسی اندازه container (تلاش ${retryCount + 1}/${maxRetries}):`, {
            width,
            height,
            display: window.getComputedStyle(container).display,
            visibility: window.getComputedStyle(container).visibility
        });
        
        if (width === 0 || height === 0) {
            retryCount++;
            if (retryCount >= maxRetries) {
                log.error('❌ Container بعد از 20 تلاش هنوز اندازه ندارد!');
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
        
        log.info('✅ Container اندازه دارد، شروع ساخت کره...');
        createGlobe();
    };
    
    const createGlobe = () => {
        const log = window.logger || { info: console.log, warn: console.warn };
        try {
            const width = container.clientWidth || window.innerWidth;
            const height = container.clientHeight || window.innerHeight;
            
            if (width === 0 || height === 0) {
                log.warn('Container هنوز اندازه ندارد، دوباره تلاش می‌کنم...');
                setTimeout(ensureSize, 100);
                return;
            }
            
            log.info(`🌍 ساخت کره ${type} با اندازه: ${width}x${height}`);
            
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
            
            log.info('✅ Renderer ساخته شد و به DOM اضافه شد');

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
            
            log.info('✅ کره با رنگ ساده ساخته شد');
            
            // تلاش برای لود texture - با مدیریت خطا بهتر
            const textureLoader = new THREE.TextureLoader();
            
            // ابتدا صحنه را راه‌اندازی کن
            setupScene(scene, camera, renderer, globe, type, container);
            
            // سپس texture را لود کن با fallback به CDN
            const tryLoadEarthTexture = (index) => {
                if (index >= EARTH_TEXTURE_PATHS.day.length) {
                    log.warn('⚠️ هیچ تکسچری بارگذاری نشد، استفاده از رنگ پیش‌فرض');
                    return;
                }
                
                textureLoader.load(
                    EARTH_TEXTURE_PATHS.day[index],
                    (texture) => {
                        log.info('✅ Texture لود شد:', EARTH_TEXTURE_PATHS.day[index]);
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
                            
                            log.info('✅ Texture به کره اعمال شد');
                        } catch (texError) {
                            log.warn('⚠️ خطا در اعمال texture:', texError);
                        }
                    },
                    (progress) => {
                        if (progress && progress.total) {
                        log.info('📥 لود texture:', Math.round((progress.loaded / progress.total) * 100) + '%');
                        }
                    },
                    (error) => {
                        log.warn(`⚠️ Texture ${EARTH_TEXTURE_PATHS.day[index]} لود نشد، تلاش بعدی...`);
                        tryLoadEarthTexture(index + 1);
                    }
                );
            };
            
            tryLoadEarthTexture(0);
            
            // راه‌اندازی صحنه (بعد از لود texture)
            setupScene(scene, camera, renderer, globe, type, container);

        } catch (error) {
            log.error('❌ خطا در ساخت کره:', error);
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
        const log = window.logger || { error: console.error }; log.error('❌ Three.js لود نشده است!');
        return null;
    }
    
    const log = window.logger || { info: console.log }; log.info('✅ Three.js موجود است:', {
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
    const log = window.logger || { info: console.log, warn: console.warn, error: console.error };
    log.info('🔧 راه‌اندازی صحنه...');
    
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
            
            log.info('✅ OrbitControls ساخته شد');
        } else {
            log.warn('⚠️ OrbitControls لود نشده است. کنترل‌ها غیرفعال هستند.');
        }
    } catch (error) {
        log.error('❌ خطا در ساخت OrbitControls:', error);
    }

    // تنظیم موقعیت camera - به سمت ایران
    const cfg = window.CONFIG || CONFIG;
    const iranLat = cfg.GLOBE.IRAN.LAT;
    const iranLng = cfg.GLOBE.IRAN.LNG;
    const phi = (90 - iranLat) * (Math.PI / 180);
    const theta = (iranLng + 180) * (Math.PI / 180);
    const distance = 5;
    const x = -distance * Math.sin(phi) * Math.cos(theta);
    const y = distance * Math.cos(phi);
    const z = distance * Math.sin(phi) * Math.sin(theta);
    camera.position.set(x, y, z);
    camera.lookAt(0, 0, 0);

    // اضافه کردن markers
    log.info('📍 اضافه کردن markers...');
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
            const log = window.logger || { error: console.error }; log.error('خطا در رندر:', error);
            isAnimating = false;
        }
    }
    
    // شروع انیمیشن
    isAnimating = true;
    animate();
    log.info('✅ انیمیشن شروع شد');

    // مدیریت ریزپانسیو
    function handleResize() {
        const width = container.clientWidth || window.innerWidth;
        const height = container.clientHeight || window.innerHeight;
        
        if (width > 0 && height > 0) {
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
            log.info(`📐 ریزایز: ${width}x${height}`);
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

    log.info(`✅ کره ${type} کاملاً راه‌اندازی شد و آماده نمایش است!`);
    
    // تست رندر اولیه
    setTimeout(() => {
        try {
            renderer.render(scene, camera);
            log.info('✅ تست رندر اولیه موفق بود');
        } catch (error) {
            log.error('❌ خطا در تست رندر:', error);
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
    const log = window.logger || { info: console.log }; log.info(`🌍 buildSimpleGlobe شروع: ${type}`);
    
    const container = document.getElementById(containerId);
    if (!container) {
        const log = window.logger || { error: console.error }; log.error('❌ Container پیدا نشد:', containerId);
        return;
    }
    
    container.innerHTML = '';
    
    if (typeof THREE === 'undefined') {
        const log = window.logger || { error: console.error }; log.error('❌ THREE.js لود نشده!');
        container.innerHTML = '<p style="color: #ff6b6b; padding: 20px;">Three.js لود نشده است!</p>';
        return;
    }
    
    // بررسی پشتیبانی WebGL
    try {
        const testCanvas = document.createElement('canvas');
        const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
        if (!gl) {
            throw new Error('WebGL پشتیبانی نمی‌شود');
        }
    } catch (error) {
            if (window.errorHandler) {
                window.errorHandler.showUserError('مرورگر شما از WebGL پشتیبانی نمی‌کند. لطفاً مرورگر خود را به‌روزرسانی کنید.', 'خطای WebGL');
            } else {
                const log = window.logger || { error: console.error }; log.error('WebGL پشتیبانی نمی‌شود:', error);
            }
        container.innerHTML = '<p style="color: #ff6b6b; padding: 20px;">مرورگر شما از WebGL پشتیبانی نمی‌کند.</p>';
        return;
    }
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    try {
        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000510);
        
        // Camera - موقعیت اولیه به سمت ایران با فاصله مناسب برای نمایش کامل کره
        const cfg = window.CONFIG || CONFIG;
        const camera = new THREE.PerspectiveCamera(50, width / height, cfg.GLOBE.CAMERA.NEAR, cfg.GLOBE.CAMERA.FAR);
        // مختصات ایران از CONFIG
        const iranLat = cfg.GLOBE.IRAN.LAT;
        const iranLng = cfg.GLOBE.IRAN.LNG;
        const phi = (90 - iranLat) * (Math.PI / 180);
        const theta = (iranLng + 180) * (Math.PI / 180);
        // فاصله بیشتر برای نمایش کامل کره در همه ریسپانسیوها
        const distance = Math.max(cfg.GLOBE.MIN_DISTANCE, Math.min(width, height) / cfg.GLOBE.DISTANCE_RATIO);
        const x = -distance * Math.sin(phi) * Math.cos(theta);
        const y = distance * Math.cos(phi);
        const z = distance * Math.sin(phi) * Math.sin(theta);
        camera.position.set(x, y, z);
        camera.lookAt(0, 0, 0);
        
        // Renderer با کیفیت بسیار بالا
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3)); // کیفیت بالاتر
        
        // تنظیم حداکثر anisotropy برای کیفیت بالاتر تکسچرها
        if (renderer.capabilities && renderer.capabilities.getMaxAnisotropy) {
            const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
            // این مقدار بعداً برای تکسچرها استفاده می‌شود
        }
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
        
        // کره زمین با کیفیت بسیار بالا
        const earthGeo = new THREE.SphereGeometry(1, 256, 256); // افزایش کیفیت به 256
        const earthMat = new THREE.MeshPhongMaterial({ color: 0x2563eb, shininess: 25 });
        const earth = new THREE.Mesh(earthGeo, earthMat);
        scene.add(earth);
        
        // اولین render
        renderer.render(scene, camera);
        
        // بارگذاری تکسچر
        const loader = new THREE.TextureLoader();
        loader.crossOrigin = 'anonymous';
        
        // بارگذاری تکسچر - اولویت با فایل‌های محلی
        const texturePaths = [
            // اول از فایل‌های محلی استفاده کن
            './earth-day.jpg',
            'earth-day.jpg',
            '/earth-day.jpg',
            // سپس CDN به عنوان fallback
            'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
            'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',
            'https://raw.githubusercontent.com/dataarts/webgl-globe/master/globe/diffuse.jpg'
        ];
        
        const tryLoadTexture = (index) => {
            if (index >= texturePaths.length) {
                const log = window.logger || { warn: console.warn }; log.warn('⚠️ هیچ تکسچری بارگذاری نشد، استفاده از رنگ پیش‌فرض');
                return;
            }
            
            loader.load(
                texturePaths[index],
                (texture) => {
                    texture.wrapS = THREE.ClampToEdgeWrapping;
                    texture.wrapT = THREE.ClampToEdgeWrapping;
                    // بهبود کیفیت تکسچر - استفاده از فیلترهای با کیفیت بالا
                    texture.minFilter = THREE.LinearMipmapLinearFilter;
                    texture.magFilter = THREE.LinearFilter;
                    texture.generateMipmaps = true;
                    texture.anisotropy = renderer.capabilities.getMaxAnisotropy(); // حداکثر کیفیت
            earth.material.map = texture;
            earth.material.needsUpdate = true;
                    const log = window.logger || { info: console.log }; log.info('✅ تکسچر کره با کیفیت بالا بارگذاری شد:', texturePaths[index]);
                },
                undefined,
                () => {
                    const log = window.logger || { warn: console.warn }; log.warn(`⚠️ تکسچر ${texturePaths[index]} بارگذاری نشد، تلاش بعدی...`);
                    tryLoadTexture(index + 1);
                }
            );
        };
        
        tryLoadTexture(0);
        
        // هاله با کیفیت بالاتر
        const atmosGeo = new THREE.SphereGeometry(1.03, 128, 128);
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
            const log = window.logger || { info: console.log }; log.info(`📍 تعداد بازارها: ${marketData.length}`);
            
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
            const log = window.logger || { info: console.log }; log.info('📍 کره منابع - آیکون‌ها از طریق فیلتر اضافه میشن');
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
            
            // تنظیم مجدد فاصله دوربین برای نمایش کامل کره در همه ریسپانسیوها
            const cfg = window.CONFIG || CONFIG;
            const baseDistance = Math.max(cfg.GLOBE.MIN_DISTANCE, Math.min(w, h) / cfg.GLOBE.DISTANCE_RATIO);
            const iranLat = cfg.GLOBE.IRAN.LAT;
            const iranLng = cfg.GLOBE.IRAN.LNG;
            const phi = (90 - iranLat) * (Math.PI / 180);
            const theta = (iranLng + 180) * (Math.PI / 180);
            const x = -baseDistance * Math.sin(phi) * Math.cos(theta);
            const y = baseDistance * Math.cos(phi);
            const z = baseDistance * Math.sin(phi) * Math.sin(theta);
            camera.position.set(x, y, z);
            camera.lookAt(0, 0, 0);
            
            // تنظیم controls
            if (controls) {
                controls.minDistance = baseDistance * 0.8;
                controls.maxDistance = baseDistance * 2.5;
                controls.target.set(0, 0, 0);
                controls.update();
            }
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
                    const log = window.logger || { info: console.log }; log.info('📍 کلیک روی بازار:', clicked.userData.market.name);
                    autoRotate = false;
                    zoomToMarker(clicked.userData.market, camera, controls, earth);
                    showMarketPopup(clicked.userData.market, container);
                    return true;
                }
                
                // کلیک روی المان facility (کره منابع) - اولویت بالا
                if (clicked.userData && clicked.userData.type) {
                    const facilityData = clicked.userData;
                    const log = window.logger || { info: console.log }; log.info('📍 کلیک روی المان:', facilityData.type, facilityData.name);
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
                            const log = window.logger || { info: console.log }; log.info('🗺️ کشور:', countryCode);
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
                    const log = window.logger || { info: console.log }; log.info('✅ کشور از countriesData پیدا شد:', closestCountry, 'فاصله:', minDistance.toFixed(1), 'km');
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
                
                const log = window.logger || { info: console.log }; log.info('🎯 کاندیدا از countryZones:', uniqueCandidates.map(c => `${c.code}(${c.ratio.toFixed(2)})`).join(', '));
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
                const log = window.logger || { info: console.log }; log.info('⚠️ کشور نزدیک از countryZones:', closestCountry, 'فاصله:', minDistance.toFixed(1), 'km');
                return closestCountry;
            }
            
            // اگر هیچ کاندیدایی پیدا نشد
            return null;
        };
        
        // متغیرهای مشترک برای تشخیص کلیک vs درگ
        let pointerStartX = 0;
        let pointerStartY = 0;
        let pointerStartTime = 0;
        
        // Pointer events - برای تشخیص دوبار کلیک/ضربه
        let clickCount = 0;
        let clickTimer = null;
        let lastClickTime = 0;
        let lastClickX = 0;
        let lastClickY = 0;
        
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
                const currentTime = Date.now();
                const timeSinceLastClick = currentTime - lastClickTime;
                const distanceFromLastClick = Math.sqrt(
                    Math.pow(event.clientX - lastClickX, 2) + 
                    Math.pow(event.clientY - lastClickY, 2)
                );
                
                // چک کردن دوبار کلیک/ضربه (در عرض 500ms و فاصله کمتر از 30px)
                if (timeSinceLastClick < 500 && distanceFromLastClick < 30) {
                    clickCount++;
                    if (clickCount === 2) {
                        const log = window.logger || { info: console.log }; log.info('✅ دوبار کلیک/ضربه تشخیص داده شد');
                handleMarkerInteraction(event.clientX, event.clientY);
                        clickCount = 0;
                        lastClickTime = 0;
                        if (clickTimer) {
                            clearTimeout(clickTimer);
                            clickTimer = null;
                        }
                    }
                } else {
                    clickCount = 1;
                    lastClickTime = currentTime;
                    lastClickX = event.clientX;
                    lastClickY = event.clientY;
                    
                    // ریست کردن بعد از 500ms
                    if (clickTimer) clearTimeout(clickTimer);
                    clickTimer = setTimeout(() => {
                        clickCount = 0;
                        lastClickTime = 0;
                    }, 500);
                }
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
                const log = window.logger || { info: console.log }; log.info(`🗑️ پاکسازی کره ${type}...`);
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
                    const log = window.logger || { error: console.error }; log.error('خطا در پاکسازی:', err);
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
        
        const log = window.logger || { info: console.log }; log.info(`✅ کره ${type} آماده!`, {
            hasScene: !!globeData.scene,
            hasEarth: !!globeData.earth,
            hasCamera: !!globeData.camera,
            hasRenderer: !!globeData.renderer
        });
        
        // برگرداندن globeData
        return globeData;
        
    } catch (error) {
        const log = window.logger || { error: console.error }; log.error('❌ خطا در buildSimpleGlobe:', error);
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `<div style="color: #ff6b6b; padding: 20px; text-align: center;">
                <p>❌ خطا در ساخت کره</p>
                <p style="font-size: 0.9em; margin-top: 10px;">${error.message}</p>
            </div>`;
        }
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
    
    const log = window.logger || { info: console.log }; log.info(`🎯 زوم به: ${market.name} (${market.coords[0]}, ${market.coords[1]})`);
    
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
                    const log = window.logger || { info: console.log }; log.info('📍 لوکیشن دریافت شد:', position.coords);
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
                        const log = window.logger || { warn: console.warn }; log.warn('⚠️ خطا در دریافت لوکیشن:', error.message);
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
                const log = window.logger || { warn: console.warn }; log.warn('⚠️ خطا در geolocation:', error.message);
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
    const log = window.logger || { info: console.log }; log.info('✅ منطقه زمانی تنظیم شد:', name);
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
    
    const log = window.logger || { info: console.log }; log.info('🔔 سیستم اعلان بازارها فعال شد');
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
    
    const log = window.logger || { info: console.log }; log.info(`🔔 اعلان: ${market.name} - ${minutesUntilOpen} دقیقه تا باز شدن`);
}

// توابع مدیریت modal با افکت حرفه‌ای
function openFinancialGlobe() {
    const log = window.logger || { info: console.log, error: console.error, success: console.log, debug: console.log, warn: console.warn };
    
    // 🔐 چک لاگین
    if (!checkLoginRequired()) {
        log.warn('کاربر لاگین نیست - کره مالی باز نشد');
        return;
    }
    
    // ذخیره صفحه فعلی قبل از باز کردن کره
    appState.previousViewBeforeGlobe = appState.currentView || 'home';
    
    log.info('باز کردن کره مالی');
    
    const modal = document.getElementById('financialGlobeModal');
    
    if (!modal) {
        log.error('Modal کره مالی پیدا نشد!');
        if (window.errorHandler) {
            window.errorHandler.showUserError('خطا در باز کردن کره مالی. لطفاً صفحه را رفرش کنید.', 'خطا');
        } else {
        alert('Modal پیدا نشد!');
        }
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
    
    log.debug('Modal مالی فعال شد');
    
    // ساخت کره بلافاصله
    log.debug('شروع ساخت کره مالی...');
    
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
                try {
                    if (window.financialGlobeObjects && window.financialGlobeObjects.earth) {
                        const earth = window.financialGlobeObjects.earth;
                        
                        log.debug('اضافه کردن مرزها به کره مالی...');
                        if (typeof createWorldBorders === 'function') {
                            await createWorldBorders(earth, {
                                defaultColor: 0x3366aa,  // آبی کمتر - برای تمایز از مارکرها
                                defaultOpacity: 0.25     // کمرنگ‌تر
                            });
                        }
                    }
                } catch (error) {
                    const errorHandler = window.errorHandler;
                    if (errorHandler) {
                        errorHandler.handleError(error, 'openFinancialGlobe - loadBorders');
                    } else {
                        log.error('❌ خطا در بارگذاری مرزهای کره مالی:', error);
                    }
                }
            }, 1000);
        });
    });
}

function openResourcesGlobe() {
    const log = window.logger || { info: console.log, error: console.error, success: console.log, warn: console.warn, debug: console.log };
    
    // 🔐 چک لاگین
    if (!checkLoginRequired()) {
        log.warn('کاربر لاگین نیست - کره منابع باز نشد');
        return;
    }
    
    log.info('باز کردن کره منابع');
    
    const modal = document.getElementById('resourcesGlobeModal');
    
    if (!modal) {
        log.error('Modal کره منابع پیدا نشد!');
        if (window.errorHandler) {
            window.errorHandler.showUserError('خطا در باز کردن کره منابع. لطفاً صفحه را رفرش کنید.', 'خطا');
        } else {
        alert('Modal پیدا نشد!');
        }
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
    
    log.debug('Modal منابع فعال شد');
    
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
            
            // راه‌اندازی drag/resize برای پنجره‌ها
            if (typeof setupDraggablePanels === 'function') {
                setTimeout(() => {
                    setupDraggablePanels();
                }, 500);
            }
            
            // نمایش خودکار پنجره انتخاب کشور در لحظه اول
            setTimeout(() => {
                const countryPanel = document.getElementById('countrySelectPanel');
                if (countryPanel) {
                    countryPanel.classList.add('active');
                }
            }, 800);
            
            // بارگذاری مرزها و درگیری‌ها و برچسب‌ها (async)
            setTimeout(async () => {
                try {
                    if (window.resourcesGlobeObjects && window.resourcesGlobeObjects.earth) {
                        const earth = window.resourcesGlobeObjects.earth;
                        const camera = window.resourcesGlobeObjects.camera;
                        
                        // بارگذاری مرزها - اضافه شدن به earth
                        log.debug('بارگذاری مرزهای کشورها...');
                        if (typeof createWorldBorders === 'function') {
                            resourcesGlobeData.bordersGroup = await createWorldBorders(earth, {
                                defaultColor: 0x4488ff,
                                defaultOpacity: 0.4
                            });
                        }
                        
                        // ایجاد خطوط درگیری
                        log.debug('ایجاد خطوط درگیری...');
                        if (typeof createAllConflicts === 'function') {
                            resourcesGlobeData.conflictsGroup = createAllConflicts(earth);
                        }
                        
                        // ایجاد برچسب‌های کشورها
                        log.debug('ایجاد برچسب‌های کشورها...');
                        if (typeof createCountryLabels === 'function') {
                            resourcesGlobeData.labelsGroup = createCountryLabels(earth, camera);
                        }
                    }
                } catch (error) {
                    const errorHandler = window.errorHandler;
                    if (errorHandler) {
                        errorHandler.handleError(error, 'openResourcesGlobe - loadBordersAndLabels');
                    } else {
                        log.error('❌ خطا در بارگذاری مرزها/درگیری‌ها/برچسب‌های کره منابع:', error);
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
    const log = window.logger || { info: console.log, warn: console.warn, debug: console.log };
    log.debug(`شروع بستن modal: ${modalId}`);
    
    const modal = document.getElementById(modalId);
    if (!modal) {
        log.warn(`Modal پیدا نشد: ${modalId}`);
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
    
    // ذخیره نوع کره فعال برای بازگرداندن state
    const activeGlobeType = type;
    
    // ذخیره صفحه فعلی قبل از باز کردن کره (اگر وجود داشته باشد)
    const previousView = appState.currentView || 'home';
    
    // پاک کردن instance دکمه سیار
    if (window[`${type}GlobeAssistive`]) {
        try {
            delete window[`${type}GlobeAssistive`];
        } catch (e) {
            log.warn('خطا در پاک کردن instance دکمه سیار:', e);
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
    
    // برگشت به صفحه قبلی (قبل از باز کردن کره)
    if (typeof showView === 'function') {
        // استفاده از previousViewBeforeGlobe اگر وجود داشته باشد، در غیر این صورت از previousView
        const viewToReturn = appState.previousViewBeforeGlobe || previousView || 'home';
        
        // فقط اگر از صفحه globe اومده بودیم، به صفحه globe برگرد و هایلایت رو فعال کن
        if (viewToReturn === 'globe') {
            showView('globe');
            
            // بعد از بازگشت به صفحه globe، هایلایت مربوطه را فعال کن
            setTimeout(() => {
                const globeCircle = document.querySelector(`.highlight-circle[data-globe="${activeGlobeType}"]`);
                const globePanel = document.querySelector(`.globe-panel[data-globe-panel="${activeGlobeType}"]`);
                
                if (globeCircle) {
                    // حذف active از همه
                    document.querySelectorAll('.highlight-circle[data-globe]').forEach(c => c.classList.remove('active'));
                    // اضافه کردن active به هایلایت مربوطه
                    globeCircle.classList.add('active');
                }
                
                if (globePanel) {
                    // حذف active از همه
                    document.querySelectorAll('.globe-panel[data-globe-panel]').forEach(p => p.classList.remove('active'));
                    // اضافه کردن active به پنل مربوطه
                    globePanel.classList.add('active');
                }
            }, 150);
        } else {
            // اگر از صفحه دیگه‌ای اومده بود، به همون صفحه برگرد (نه globe)
            showView(viewToReturn);
        }
        
        // پاک کردن previousViewBeforeGlobe بعد از استفاده
        appState.previousViewBeforeGlobe = null;
    }
    
    // پاکسازی کره با تاخیر کوتاه (برای جلوگیری از هنگ)
    setTimeout(() => {
        if (simpleGlobeScenes[type] && typeof simpleGlobeScenes[type].destroy === 'function') {
            try {
                simpleGlobeScenes[type].destroy();
            } catch (e) {
                const log = window.logger || { warn: console.warn };
                log.warn('خطا در destroy کردن کره:', e);
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
        
        const log = window.logger || { success: console.log };
        log.debug('Modal و کره پاکسازی شدند');
    }, 100);
}

// باز کردن کره‌های 3D جدید (آب و هوا، نظامی، دانشگاه، تاریخی)
// جلوگیری از باز شدن همزمان چند کره
let globe3DOpening = false;

function open3DGlobe(type) {
    const log = window.logger || { info: console.log, error: console.error, warn: console.warn, debug: console.log };
    
    // جلوگیری از باز شدن همزمان
    if (globe3DOpening) {
        log.debug('کره 3D در حال باز شدن است...');
        return;
    }
    
    // 🔐 چک لاگین
    if (!checkLoginRequired()) {
        log.warn('کاربر لاگین نیست - کره 3D باز نشد');
        return;
    }
    
    // ذخیره صفحه فعلی قبل از باز کردن کره
    appState.previousViewBeforeGlobe = appState.currentView || 'home';
    
    globe3DOpening = true;
    log.info(`باز کردن کره 3D: ${type}`);
    
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
        log.error(`نوع کره نامعتبر: ${type}`);
        globe3DOpening = false;
        return;
    }
    
    const modal = document.getElementById(modalId);
    const container = document.getElementById(containerId);
    
    if (!modal || !container) {
        log.error('Modal یا Container پیدا نشد!');
        if (window.errorHandler) {
            window.errorHandler.showUserError(`خطا در باز کردن کره ${type}. لطفاً صفحه را رفرش کنید.`, 'خطا');
        }
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
                    const log = window.logger || { warn: console.warn }; log.warn('خطا در پاک کردن کره قبلی:', e);
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
                            const log = window.logger || { warn: console.warn }; log.warn('خطا در پاک کردن instance قبلی:', e);
                        }
                    }
                    
                    // تبدیل نام menu برای کره‌های خاص
                    let menuId = `${type}GlobeMenu`;
                    if (type === 'natural-resources') {
                        menuId = 'naturalResourcesGlobeMenu';
                    }
                    window[`${type}GlobeAssistive`] = new GlobeAssistiveTouch(assistiveId, menuId, type);
                    const log = window.logger || { info: console.log }; log.info(`✅ دکمه سیار کره ${type} راه‌اندازی شد`);
                } else {
                    const log = window.logger || { warn: console.warn }; log.warn(`⚠️ دکمه سیار کره ${type} پیدا نشد:`, assistiveId);
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
                        const log = window.logger || { info: console.log }; log.info(`🔄 تلاش مجدد برای بارگذاری مرزها (${retryCount + 1}/${maxRetries})...`);
                        setTimeout(() => loadBorders(retryCount + 1), 1000);
                    } else {
                        const log = window.logger || { warn: console.warn }; log.warn(`⚠️ کره ${type} پیدا نشد بعد از ${maxRetries} تلاش`);
                    }
                    return;
                }
                
                if (!scene.earth) {
                    if (retryCount < maxRetries) {
                        const log = window.logger || { info: console.log }; log.info(`🔄 earth پیدا نشد، تلاش مجدد (${retryCount + 1}/${maxRetries})...`);
                        setTimeout(() => loadBorders(retryCount + 1), 1000);
                    } else {
                        const log = window.logger || { warn: console.warn }; log.warn(`⚠️ earth کره ${type} پیدا نشد بعد از ${maxRetries} تلاش`);
                    }
                    return;
                }
                
                const earth = scene.earth;
                const log = window.logger || { info: console.log }; log.info(`🗺️ اضافه کردن مرزها به کره ${type}...`);
                
                try {
                    if (typeof createWorldBorders === 'function') {
                        const bordersGroup = await createWorldBorders(earth, {
                            defaultColor: 0x4488ff,
                            defaultOpacity: 0.4
                        });
                        if (bordersGroup) {
                            const log = window.logger || { info: console.log }; log.info(`✅ مرزها به کره ${type} اضافه شدند`);
                            // ذخیره bordersGroup در scene برای دسترسی بعدی
                            scene.bordersGroup = bordersGroup;
                        } else {
                            const log = window.logger || { warn: console.warn }; log.warn(`⚠️ مرزها برای کره ${type} لود نشدند`);
                        }
                    } else {
                        const log = window.logger || { warn: console.warn }; log.warn('⚠️ تابع createWorldBorders پیدا نشد');
                    }
                } catch (error) {
                    const log = window.logger || { error: console.error };
                    const errorHandler = window.errorHandler;
                    
                    log.error(`❌ خطا در بارگذاری مرزها برای کره ${type}:`, error);
                    
                    if (errorHandler) {
                        errorHandler.handleError(error, `open3DGlobe - loadBorders (${type})`);
                    }
                    
                    if (retryCount < maxRetries) {
                        log.info(`🔄 تلاش مجدد بعد از خطا (${retryCount + 1}/${maxRetries})...`);
                        setTimeout(() => loadBorders(retryCount + 1), 2000);
                    } else {
                        log.warn(`⚠️ بارگذاری مرزها برای کره ${type} بعد از ${maxRetries} تلاش ناموفق بود`);
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
                        const log = window.logger || { info: console.log }; log.info(`🔄 تلاش مجدد برای بارگذاری داده‌ها (${retryCount + 1}/${maxRetries})...`);
                        setTimeout(() => loadDataWithRetry(retryCount + 1), 500);
                    } else {
                        const log = window.logger || { warn: console.warn }; log.warn(`⚠️ کره ${type} پیدا نشد بعد از ${maxRetries} تلاش`);
                    }
                    return;
                }
                
                if (!scene.scene) {
                    if (retryCount < maxRetries) {
                        const log = window.logger || { info: console.log }; log.info(`🔄 scene پیدا نشد، تلاش مجدد (${retryCount + 1}/${maxRetries})...`);
                        setTimeout(() => loadDataWithRetry(retryCount + 1), 500);
                    } else {
                        const log = window.logger || { warn: console.warn }; log.warn(`⚠️ scene کره ${type} پیدا نشد بعد از ${maxRetries} تلاش`);
                    }
                    return;
                }
                
                if (!scene.earth) {
                    if (retryCount < maxRetries) {
                        const log = window.logger || { info: console.log }; log.info(`🔄 earth پیدا نشد، تلاش مجدد (${retryCount + 1}/${maxRetries})...`);
                        setTimeout(() => loadDataWithRetry(retryCount + 1), 500);
                    } else {
                        const log = window.logger || { warn: console.warn }; log.warn(`⚠️ earth کره ${type} پیدا نشد بعد از ${maxRetries} تلاش`);
                    }
                    return;
                }
                
                const log = window.logger || { info: console.log };
                log.info(`📊 بارگذاری داده‌های کره ${type}...`);
                if (typeof load3DGlobeData === 'function') {
                    try {
                        load3DGlobeData(type, container);
                        log.info(`✅ داده‌های کره ${type} بارگذاری شدند`);
                    } catch (error) {
                        const errorHandler = window.errorHandler;
                        log.error(`❌ خطا در بارگذاری داده‌های کره ${type}:`, error);
                        if (errorHandler) {
                            errorHandler.handleError(error, `open3DGlobe - loadDataWithRetry (${type})`);
                        }
                    }
                } else {
                    log.warn('⚠️ تابع load3DGlobeData پیدا نشد');
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
        const handler = (e) => {
            const year = e.target.value;
            filterEarthquakesByYear(year);
        };
        // حذف listener قبلی اگر وجود داشت
        yearFilter.removeEventListener('change', handler);
        addEventListenerOnce(yearFilter, 'change', handler, 'earthquake-year-filter');
    }
    
    document.querySelectorAll('#earthquakeFilterPanel [data-magnitude]').forEach((btn, index) => {
        const handler = () => {
            document.querySelectorAll('#earthquakeFilterPanel [data-magnitude]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const magnitude = btn.dataset.magnitude;
            filterEarthquakesByMagnitude(magnitude);
        };
        // حذف listener قبلی اگر وجود داشت
        btn.removeEventListener('click', handler);
        addEventListenerOnce(btn, 'click', handler, `earthquake-magnitude-${index}`);
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
    const provinceChangeHandler = (e) => {
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
                    const cityClickHandler = () => {
                        document.querySelectorAll('.city-item').forEach(item => item.classList.remove('selected'));
                        cityItem.classList.add('selected');
                        // ذخیره انتخاب
                        localStorage.setItem('earthquakeSelectedCity', JSON.stringify({
                            name: city.name,
                            province: province.name,
                            coords: city.coords
                        }));
                    };
                    cityItem.addEventListener('click', cityClickHandler);
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
                const cityClickHandler2 = () => {
                    document.querySelectorAll('.city-item').forEach(item => item.classList.remove('selected'));
                    cityItem.classList.add('selected');
                    // ذخیره انتخاب
                    localStorage.setItem('earthquakeSelectedCity', JSON.stringify({
                        name: city.name,
                        province: iranProvinces[selectedProvince].name,
                        coords: city.coords
                    }));
                };
                cityItem.addEventListener('click', cityClickHandler2);
                cityList.appendChild(cityItem);
            });
        }
    };
    
    // اضافه کردن event listener با محافظت از duplicate
    provinceSelect.removeEventListener('change', provinceChangeHandler);
    addEventListenerOnce(provinceSelect, 'change', provinceChangeHandler, 'earthquake-province-select');
    
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
            const log = window.logger || { warn: console.warn }; log.warn('⚠️ خطا در بارگذاری شهر انتخاب شده:', e);
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
    const log = window.logger || { info: console.log }; log.info('✅ تنظیمات اعلان زلزله ذخیره شد:', settings);
    
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
        const log = window.logger || { info: console.log }; log.info('🔔 بررسی اعلان‌های زلزله...');
    } catch (e) {
        const log = window.logger || { warn: console.warn }; log.warn('⚠️ خطا در بررسی اعلان‌ها:', e);
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
    document.querySelectorAll('#naturalResourcesFilterPanel [data-resource]').forEach((btn, index) => {
        const handler = () => {
            document.querySelectorAll('#naturalResourcesFilterPanel [data-resource]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const resource = btn.dataset.resource;
            filterNaturalResources(resource);
        };
        btn.removeEventListener('click', handler);
        addEventListenerOnce(btn, 'click', handler, `natural-resources-filter-${index}`);
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
    const log = window.logger || { info: console.log }; log.info('🌤️ بارگذاری داده‌های آب و هوا...');
    
    if (!scene || !scene.scene || !scene.earth) {
        const log = window.logger || { warn: console.warn }; log.warn('⚠️ scene یا earth پیدا نشد در loadWeatherData', {
            hasScene: !!scene,
            hasSceneScene: !!(scene && scene.scene),
            hasEarth: !!(scene && scene.earth)
        });
        return;
    }
    
    if (typeof createNeonMarker === 'undefined') {
        const log = window.logger || { error: console.error }; log.error('❌ تابع createNeonMarker پیدا نشد!');
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
                            const log = window.logger || { warn: console.warn }; log.warn('⚠️ خطا در createNeonMarker با type weather، استفاده از پیش‌فرض:', e);
                            marker = createNeonMarker(color, 0.008, 'customs'); // fallback
                        }
                        
                        if (!marker) {
                            const log = window.logger || { warn: console.warn }; log.warn('⚠️ marker ایجاد نشد برای:', city.name);
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
                        const log = window.logger || { error: console.error }; log.error('❌ خطا در ایجاد marker برای شهر:', city.name, e);
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
        const log = window.logger || { info: console.log }; log.info(`✅ ${markerCount} مارکر آب و هوا اضافه شد`);
    } catch (error) {
        const log = window.logger || { error: console.error }; log.error('❌ خطا در loadWeatherData:', error);
    }
}

// بارگذاری داده‌های نظامی
function loadMilitaryData(scene) {
    const log = window.logger || { info: console.log }; log.info('⚔️ بارگذاری داده‌های نظامی...');
    
    if (!scene || !scene.scene || !scene.earth) {
        const log = window.logger || { warn: console.warn }; log.warn('⚠️ scene یا earth پیدا نشد در loadMilitaryData');
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
                const log = window.logger || { info: console.log }; log.info('✅ درگیری‌های نظامی اضافه شدند');
            }
        } else {
            const log = window.logger || { warn: console.warn }; log.warn('⚠️ تابع createAllConflicts پیدا نشد');
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
        const log = window.logger || { error: console.error }; log.error('❌ خطا در loadMilitaryData:', error);
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
    const log = window.logger || { info: console.log }; log.info('🎓 بارگذاری داده‌های دانشگاه‌ها...');
    
    if (!scene || !scene.scene || !scene.earth) {
        const log = window.logger || { warn: console.warn }; log.warn('⚠️ scene یا earth پیدا نشد در loadUniversitiesData');
        return;
    }
    
    if (typeof createNeonMarker === 'undefined') {
        const log = window.logger || { error: console.error }; log.error('❌ تابع createNeonMarker پیدا نشد!');
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
                            const log = window.logger || { warn: console.warn }; log.warn('⚠️ marker ایجاد نشد برای:', uni.name);
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
                        const log = window.logger || { error: console.error }; log.error('❌ خطا در ایجاد marker برای دانشگاه:', uni.name, e);
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
        const log = window.logger || { info: console.log }; log.info(`✅ ${markerCount} مارکر دانشگاه اضافه شد`);
    } catch (error) {
        const log = window.logger || { error: console.error }; log.error('❌ خطا در loadUniversitiesData:', error);
    }
}

// بارگذاری داده‌های تاریخی
function loadHistoricalData(scene) {
    const log = window.logger || { info: console.log }; log.info('🏛️ بارگذاری داده‌های مکان‌های تاریخی...');
    
    if (!scene || !scene.scene || !scene.earth) {
        const log = window.logger || { warn: console.warn }; log.warn('⚠️ scene یا earth پیدا نشد در loadHistoricalData');
        return;
    }
    
    if (typeof createNeonMarker === 'undefined') {
        const log = window.logger || { error: console.error }; log.error('❌ تابع createNeonMarker پیدا نشد!');
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
                            const log = window.logger || { warn: console.warn }; log.warn('⚠️ marker ایجاد نشد برای:', site.name);
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
                        const log = window.logger || { error: console.error }; log.error('❌ خطا در ایجاد marker برای مکان تاریخی:', site.name, e);
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
        const log = window.logger || { info: console.log }; log.info(`✅ ${markerCount} مارکر تاریخی اضافه شد`);
    } catch (error) {
        const log = window.logger || { error: console.error }; log.error('❌ خطا در loadHistoricalData:', error);
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
    const log = window.logger || { info: console.log }; log.info('🌋 بارگذاری داده‌های زلزله...');
    
    if (!scene || !scene.scene || !scene.earth) {
        const log = window.logger || { warn: console.warn }; log.warn('⚠️ scene یا earth پیدا نشد در loadEarthquakeData');
        return;
    }
    
    if (typeof createNeonMarker === 'undefined') {
        const log = window.logger || { error: console.error }; log.error('❌ تابع createNeonMarker پیدا نشد!');
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
                            const log = window.logger || { warn: console.warn }; log.warn('⚠️ marker ایجاد نشد برای:', eq.name);
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
                        const log = window.logger || { error: console.error }; log.error('❌ خطا در ایجاد marker برای زلزله:', eq.name, e);
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
        const log = window.logger || { info: console.log }; log.info(`✅ ${markerCount} مارکر زلزله اضافه شد`);
        
        // حذف شده: بارگذاری مرزهای استانی و شهری ایران
        // این مرزها ربطی به زلزله ندارند و باید جداگانه اضافه شوند
    } catch (error) {
        const log = window.logger || { error: console.error }; log.error('❌ خطا در loadEarthquakeData:', error);
    }
}

// بارگذاری مرزهای استانی و شهری ایران
function loadIranProvincialBorders(scene) {
    const log = window.logger || { info: console.log, warn: console.warn };
    log.info('🗺️ بارگذاری مرزهای استانی و شهری ایران...');
    
    if (!scene || !scene.scene || !scene.earth) return;
    if (typeof iranProvinces === 'undefined') {
        log.warn('⚠️ داده‌های استان‌های ایران پیدا نشد');
        return;
    }
    
    const iranBordersGroup = new THREE.Group();
    iranBordersGroup.name = 'iranProvincialBorders';
    
    // ایجاد خطوط مرزی بین استان‌ها (خطوط مستقیم بین مراکز استان‌ها)
    const provinces = Object.values(iranProvinces);
    const cfg = window.CONFIG || CONFIG;
    const iranCenter = [cfg.GLOBE.IRAN.LAT, cfg.GLOBE.IRAN.LNG]; // مرکز تقریبی ایران
    
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
    
    log.info(`✅ مرزهای ${provinces.length} استان ایران اضافه شدند`);
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
    const log = window.logger || { info: console.log }; log.info('🌿 بارگذاری داده‌های منابع طبیعی...');
    
    if (!scene || !scene.scene || !scene.earth) {
        const log = window.logger || { warn: console.warn }; log.warn('⚠️ scene یا earth پیدا نشد در loadNaturalResourcesData');
        return;
    }
    
    if (typeof createNeonMarker === 'undefined') {
        const log = window.logger || { error: console.error }; log.error('❌ تابع createNeonMarker پیدا نشد!');
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
                            const log = window.logger || { warn: console.warn }; log.warn('⚠️ marker ایجاد نشد برای جنگل:', forest.name);
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
                        const log = window.logger || { error: console.error }; log.error('❌ خطا در ایجاد marker برای جنگل:', forest.name, e);
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
                            const log = window.logger || { warn: console.warn }; log.warn('⚠️ marker ایجاد نشد برای بیابان:', desert.name);
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
                        const log = window.logger || { error: console.error }; log.error('❌ خطا در ایجاد marker برای بیابان:', desert.name, e);
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
                            const log = window.logger || { warn: console.warn }; log.warn('⚠️ marker ایجاد نشد برای آب زیرزمینی:', aquifer.name);
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
                        const log = window.logger || { error: console.error }; log.error('❌ خطا در ایجاد marker برای آب زیرزمینی:', aquifer.name, e);
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
                            const log = window.logger || { warn: console.warn }; log.warn('⚠️ marker ایجاد نشد برای دام:', animal.name);
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
                        const log = window.logger || { error: console.error }; log.error('❌ خطا در ایجاد marker برای دام:', animal.name, e);
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
                            const log = window.logger || { warn: console.warn }; log.warn('⚠️ marker ایجاد نشد برای حیوان وحشی:', animal.name);
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
                        const log = window.logger || { error: console.error }; log.error('❌ خطا در ایجاد marker برای حیوان وحشی:', animal.name, e);
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
                            const log = window.logger || { warn: console.warn }; log.warn('⚠️ marker ایجاد نشد برای حیوان دریایی:', animal.name);
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
                        const log = window.logger || { error: console.error }; log.error('❌ خطا در ایجاد marker برای حیوان دریایی:', animal.name, e);
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
        const log = window.logger || { info: console.log }; log.info(`✅ ${markerCount} مارکر منابع طبیعی اضافه شد`);
    } catch (error) {
        const log = window.logger || { error: console.error }; log.error('❌ خطا در loadNaturalResourcesData:', error);
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
    const log = window.logger || { info: console.log }; log.info('🏳️ انتخاب کشور:', code);
    
    resourcesGlobeData.selectedCountry = code;
    let countryData = countriesData[code];
    
    // اگر کشور در countriesData نیست، داده پیش‌فرض ایجاد کن
    if (!countryData) {
        const log = window.logger || { warn: console.warn }; log.warn('⚠️ کشور در countriesData پیدا نشد، ایجاد داده پیش‌فرض:', code);
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
    const log = window.logger || { info: console.log }; log.info(`🎯 زوم به ${data.name}: lat=${lat}, lng=${lng}`);
    
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
    const log = window.logger || { info: console.log }; log.info(`📊 نمایش خط ${type} از ${fromCode} به ${toCode}`);
    
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
    const log = window.logger || { info: console.log }; log.info(`📊 نمایش همه ${type} برای ${countryCode}`);
    
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
            const log = window.logger || { info: console.log }; log.info(`📅 تغییر سال به: ${selectedYear}`);
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
    
    const log = window.logger || { info: console.log }; log.info('🛃 گمرکات روی نقشه نمایش داده شدند');
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
    const log = window.logger || { info: console.log }; log.info(`🎯 زوم به: ${lat}, ${lng}`);
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
    const log = window.logger || { info: console.log }; log.info('📍 انتخاب بازار:', market.name);
    
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
    
    const log = window.logger || { info: console.log }; log.info(`🔍 فیلتر منابع: ${filter}`);
    // اینجا می‌توان مارکرهای روی کره را فیلتر کرد
}

// پردازش عملیات fab کره منابع
function handleResourcesFabAction(action) {
    if (action === 'reset') {
        resetGlobeView('resources');
    }
}

// نمایش تنظیمات منطقه زمانی
/**
 * ⏰ نمایش تنظیمات منطقه زمانی
 */
function showTimezoneSettings() {
    const currentTimezone = getUserTimezone();
    
    // ایجاد مودال تنظیمات
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <h3>⏰ تنظیمات منطقه زمانی</h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
            </div>
            <div class="modal-body">
                <div style="margin-bottom: 20px;">
                    <p><strong>منطقه زمانی فعلی:</strong> ${currentTimezone.name} (${currentTimezone.offsetStr})</p>
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">این منطقه زمانی به صورت خودکار از مرورگر شما تشخیص داده شده است.</p>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">انتخاب منطقه زمانی دستی:</label>
                    <select id="timezoneSelect" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--glass-border); background: var(--bg-secondary); color: var(--text-primary);">
                        <option value="auto">🔍 تشخیص خودکار (پیشنهادی)</option>
                        <option value="+03:30">🇮🇷 تهران (UTC+3:30)</option>
                        <option value="+04:00">🇦🇪 دبی (UTC+4:00)</option>
                        <option value="+00:00">🇬🇧 لندن (UTC+0:00)</option>
                        <option value="-05:00">🇺🇸 نیویورک (UTC-5:00)</option>
                        <option value="+09:00">🇯🇵 توکیو (UTC+9:00)</option>
                        <option value="+08:00">🇨🇳 پکن (UTC+8:00)</option>
                        <option value="+05:30">🇮🇳 دهلی (UTC+5:30)</option>
                        <option value="+02:00">🇪🇬 قاهره (UTC+2:00)</option>
                    </select>
                </div>
                
                <div style="display: flex; gap: 10px;">
                    <button onclick="saveTimezoneSettings()" style="flex: 1; padding: 12px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                        💾 ذخیره
                    </button>
                    <button onclick="this.closest('.modal-overlay').remove()" style="flex: 1; padding: 12px; background: var(--bg-secondary); color: var(--text-primary); border: 1px solid var(--glass-border); border-radius: 8px; cursor: pointer;">
                        انصراف
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    
    // تنظیم مقدار فعلی
    const select = modal.querySelector('#timezoneSelect');
    if (currentTimezone.offsetStr) {
        const currentOption = Array.from(select.options).find(opt => opt.value === currentTimezone.offsetStr);
        if (currentOption) {
            select.value = currentTimezone.offsetStr;
        } else if (currentTimezone.manual) {
            select.value = currentTimezone.offsetStr;
        }
    }
    
    // بستن با کلیک روی overlay
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

/**
 * 💾 ذخیره تنظیمات منطقه زمانی
 */
function saveTimezoneSettings() {
    const select = document.getElementById('timezoneSelect');
    if (!select) return;
    
    const selectedValue = select.value;
    
    if (selectedValue === 'auto') {
        // حذف تنظیمات دستی و استفاده از تشخیص خودکار
        localStorage.removeItem('userTimezone');
        alert('✅ منطقه زمانی به حالت خودکار تنظیم شد');
    } else {
        // تنظیم دستی
        const [sign, hours, mins] = selectedValue.match(/([+-])(\d{2}):(\d{2})/);
        const offsetHours = parseInt(sign + hours);
        const offsetMinutes = offsetHours * 60;
        
        const timezoneNames = {
            '+03:30': 'تهران',
            '+04:00': 'دبی',
            '+00:00': 'لندن',
            '-05:00': 'نیویورک',
            '+09:00': 'توکیو',
            '+08:00': 'پکن',
            '+05:30': 'دهلی',
            '+02:00': 'قاهره'
        };
        
        setManualTimezone(offsetHours, timezoneNames[selectedValue] || `UTC${selectedValue}`);
        alert(`✅ منطقه زمانی به ${timezoneNames[selectedValue] || selectedValue} تنظیم شد`);
    }
    
    // بستن مودال
    const modal = select.closest('.modal-overlay');
    if (modal) modal.remove();
    
    // رفرش صفحه برای اعمال تغییرات
    setTimeout(() => {
        location.reload();
    }, 1000);
}

/**
 * 🔍 نمایش فیلتر بازارها
 */
function showMarketFilter() {
    // باز کردن کره مالی با فیلتر
    if (typeof openFinancialGlobe === 'function') {
        openFinancialGlobe();
        
        // باز کردن پنل انتخاب بازار
        setTimeout(() => {
            const marketSelectPanel = document.getElementById('marketSelectPanel');
            if (marketSelectPanel) {
                marketSelectPanel.classList.add('active');
            }
        }, 500);
    } else {
        // اگر کره مالی در دسترس نیست، نمایش پیام
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 400px;">
                <div class="modal-header">
                    <h3>🔍 فیلتر بازارها</h3>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                </div>
                <div class="modal-body">
                    <p>برای استفاده از فیلتر بازارها، لطفاً ابتدا کره مالی را باز کنید.</p>
                    <button onclick="this.closest('.modal-overlay').remove(); if(typeof openFinancialGlobe === 'function') openFinancialGlobe();" 
                            style="width: 100%; padding: 12px; margin-top: 15px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                        🌍 باز کردن کره مالی
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.style.display = 'flex';
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }
}

/**
 * 🔔 نمایش تنظیمات اعلان
 */
function showNotificationSettings() {
    const savedNotifications = JSON.parse(localStorage.getItem('marketNotifications') || '{}');
    const enabledMarkets = Object.keys(savedNotifications).filter(key => savedNotifications[key].enabled);
    
    // ایجاد مودال تنظیمات
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px; max-height: 80vh; overflow-y: auto;">
            <div class="modal-header">
                <h3>🔔 تنظیمات اعلان‌ها</h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
            </div>
            <div class="modal-body">
                <div style="margin-bottom: 20px;">
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">
                        می‌توانید برای بازارهای مختلف اعلان تنظیم کنید. اعلان‌ها قبل از باز شدن بازار ارسال می‌شوند.
                    </p>
                </div>
                
                ${typeof marketData !== 'undefined' && marketData.length > 0 ? `
                    <div style="margin-bottom: 15px;">
                        <h4 style="margin-bottom: 10px;">بازارهای فعال:</h4>
                        <div id="notificationMarketsList" style="display: flex; flex-direction: column; gap: 10px;">
                            ${marketData.slice(0, 10).map(market => {
                                const setting = savedNotifications[market.name] || {};
                                const isEnabled = setting.enabled || false;
                                return `
                                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: var(--bg-secondary); border-radius: 8px; border: 1px solid var(--glass-border);">
                                        <div>
                                            <strong>${market.name}</strong>
                                            <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 4px;">
                                                ${market.open} - ${market.close} (UTC)
                                            </div>
                                        </div>
                                        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                            <input type="checkbox" ${isEnabled ? 'checked' : ''} 
                                                   onchange="toggleMarketNotification('${market.name}', this.checked)"
                                                   style="width: 18px; height: 18px; cursor: pointer;">
                                            <span>${isEnabled ? '✅ فعال' : '❌ غیرفعال'}</span>
                                        </label>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                ` : `
                    <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
                        <p>📭 هیچ بازاری برای تنظیم اعلان یافت نشد.</p>
                        <p style="font-size: 0.9rem; margin-top: 10px;">لطفاً کره مالی را باز کنید تا بازارها بارگذاری شوند.</p>
                    </div>
                `}
                
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--glass-border);">
                    <button onclick="this.closest('.modal-overlay').remove()" 
                            style="width: 100%; padding: 12px; background: var(--bg-secondary); color: var(--text-primary); border: 1px solid var(--glass-border); border-radius: 8px; cursor: pointer; font-weight: 600;">
                        بستن
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    
    // بستن با کلیک روی overlay
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
}
    });
}

/**
 * 🔔 فعال/غیرفعال کردن اعلان یک بازار
 */
function toggleMarketNotification(marketName, enabled) {
    const settings = JSON.parse(localStorage.getItem('marketNotifications') || '{}');
    
    if (enabled) {
        settings[marketName] = {
            enabled: true,
            minutesBefore: 15
        };
        // درخواست مجوز نوتیفیکیشن
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    } else {
        if (settings[marketName]) {
            settings[marketName].enabled = false;
        }
    }
    
    localStorage.setItem('marketNotifications', JSON.stringify(settings));
    
    // شروع/توقف چک کننده
    if (enabled) {
        if (typeof startMarketNotificationChecker === 'function') {
            startMarketNotificationChecker();
        }
    }
    
    const log = window.logger || { info: console.log }; log.info(`${enabled ? '✅' : '❌'} اعلان ${marketName} ${enabled ? 'فعال' : 'غیرفعال'} شد`);
}

// در دسترس قرار دادن توابع
window.toggleMarketNotification = toggleMarketNotification;
window.saveTimezoneSettings = saveTimezoneSettings;

function resetGlobeView(type) {
    const log = window.logger || { info: console.log }; log.info(`🔄 بازیابی دید کره ${type}`);
    
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
        const cfg = window.CONFIG || CONFIG;
        const iranLat = cfg.GLOBE.IRAN.LAT;
        const iranLng = cfg.GLOBE.IRAN.LNG;
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


