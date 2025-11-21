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
  // ایران
  { name: "بورس تهران", open: "08:30", close: "12:30", utcOffset: "+03:30", coords: [35.6892, 51.3890] },
  { name: "طلا و سکه تهران", open: "10:00", close: "17:00", utcOffset: "+03:30", coords: [35.6892, 51.3890] },

  // اروپا
  { name: "Forex - لندن", open: "08:00", close: "16:00", utcOffset: "+01:00", coords: [51.5074, -0.1278] },
  { name: "بورس فرانکفورت", open: "09:00", close: "17:30", utcOffset: "+02:00", coords: [50.1109, 8.6821] },
  { name: "بورس پاریس", open: "09:00", close: "17:30", utcOffset: "+02:00", coords: [48.8566, 2.3522] },
  { name: "بورس مادرید", open: "09:00", close: "17:30", utcOffset: "+02:00", coords: [40.4168, -3.7038] },
  { name: "بورس میلان", open: "09:00", close: "17:30", utcOffset: "+02:00", coords: [45.4642, 9.1900] },
  { name: "بورس زوریخ", open: "09:00", close: "17:30", utcOffset: "+02:00", coords: [47.3769, 8.5417] },
  { name: "بورس استکهلم", open: "09:00", close: "17:30", utcOffset: "+02:00", coords: [59.3293, 18.0686] },

  // آمریکا
  { name: "Forex - نیویورک", open: "13:00", close: "21:00", utcOffset: "-04:00", coords: [40.7128, -74.0060] },
  { name: "بورس نیویورک", open: "09:30", close: "16:00", utcOffset: "-04:00", coords: [40.7128, -74.0060] },
  { name: "بورس نزدک", open: "09:30", close: "16:00", utcOffset: "-04:00", coords: [40.7128, -74.0060] },
  { name: "بورس شیکاگو", open: "09:30", close: "16:00", utcOffset: "-05:00", coords: [41.8781, -87.6298] },
  { name: "بورس تورنتو", open: "09:30", close: "16:00", utcOffset: "-04:00", coords: [43.6532, -79.3832] },

  // آسیا
  { name: "Forex - توکیو", open: "00:00", close: "08:00", utcOffset: "+09:00", coords: [35.6762, 139.6503] },
  { name: "بورس توکیو", open: "09:00", close: "15:30", utcOffset: "+09:00", coords: [35.6762, 139.6503] },
  { name: "بورس هنگ‌کنگ", open: "09:00", close: "16:00", utcOffset: "+08:00", coords: [22.3193, 114.1694] },
  { name: "بورس شانگهای", open: "09:00", close: "15:00", utcOffset: "+08:00", coords: [31.2304, 121.4737] },
  { name: "بورس سئول", open: "09:00", close: "15:30", utcOffset: "+09:00", coords: [37.5665, 126.9780] },
  { name: "بورس سیدنی", open: "09:00", close: "16:00", utcOffset: "+10:00", coords: [-33.8688, 151.2093] },

  // خاورمیانه
  { name: "بورس دبی", open: "09:00", close: "14:00", utcOffset: "+04:00", coords: [25.2048, 55.2708] },
  { name: "بورس ریاض", open: "09:00", close: "14:00", utcOffset: "+03:00", coords: [24.7136, 46.6753] },
  { name: "بورس قطر", open: "09:00", close: "14:00", utcOffset: "+03:00", coords: [25.2854, 51.5310] },

  // طلا و نفت
  { name: "طلا - لندن (LBMA)", open: "10:30", close: "15:00", utcOffset: "+01:00", coords: [51.5074, -0.1278] },
  { name: "نفت - نیویورک (NYMEX)", open: "09:00", close: "14:30", utcOffset: "-04:00", coords: [40.7128, -74.0060] },
  { name: "نفت - لندن (ICE)", open: "08:00", close: "16:30", utcOffset: "+01:00", coords: [51.5074, -0.1278] },
  { name: "نقره - لندن (LBMA)", open: "10:30", close: "15:00", utcOffset: "+01:00", coords: [51.5074, -0.1278] },
  { name: "مس - لندن (LME)", open: "08:00", close: "16:00", utcOffset: "+01:00", coords: [51.5074, -0.1278] },

  // آفریقا
  { name: "بورس Johannesburg", open: "08:00", close: "16:00", utcOffset: "+02:00", coords: [-26.2041, 28.0473] },

  // آمریکای جنوبی
  { name: "بورس سائوپائولو", open: "09:00", close: "17:00", utcOffset: "-03:00", coords: [-23.5505, -46.6333] },
  { name: "بورس مکزیکو", open: "08:00", close: "15:00", utcOffset: "-05:00", coords: [19.4326, -99.1332] },

  // ترکیه
  { name: "بورس استانبول", open: "09:00", close: "17:30", utcOffset: "+03:00", coords: [41.0082, 28.9784] },

  // هند
  { name: "بورس بمبئی", open: "09:15", close: "15:30", utcOffset: "+05:30", coords: [19.0760, 72.8777] },
  { name: "بورس دهلی", open: "09:15", close: "15:30", utcOffset: "+05:30", coords: [28.7041, 77.1025] },

  // سنگاپور
  { name: "بورس سنگاپور", open: "09:00", close: "17:00", utcOffset: "+08:00", coords: [1.3521, 103.8198] },

  // نیوزیلند
  { name: "بورس ولینگتون", open: "09:00", close: "16:45", utcOffset: "+12:00", coords: [-41.2865, 174.7762] },

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
});

/* ساخت صحنه */
function initGlobe() {
  const container = document.getElementById('globeContainer');
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 3.2);
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambient);
  sun = new THREE.DirectionalLight(0xffffff, 1.3);
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
  sunAngle = (utcHour / 24) * 2 * Math.PI;
  const sunX = Math.cos(sunAngle) * 6;
  const sunZ = Math.sin(sunAngle) * 6;
  sun.position.set(sunX, 2, sunZ);
  const dayWeight = Math.max(0, Math.cos(sunAngle));
  globe.material = dayWeight > 0.1 ? dayMat : nightMat;
}

function animate() {
  requestAnimationFrame(animate);
  globe.rotation.y += 0.0008;
  renderer.render(scene, camera);
}

/* باز/بسته مودال */
document.getElementById('globeContainer').addEventListener('click', () => {
  openFinancialGlobe(); // این تابع رو خودمون قبلاً ساختیم
});

document.getElementById('globeContainer').addEventListener('click', () => {
  if (!isUserLoggedIn()) {
    showLoginPrompt();
    return;
  }
  openFinancialGlobe();
});

// تابع بررسی لاگین
function isUserLoggedIn() {
  return true; // ✅ برای تست
}

// تابع نمایش پیام لاگین
function showLoginPrompt() {
  alert('🔐 برای دسترسی به این قابلیت، لطفاً وارد حساب کاربری خود شوید.\n\nاین قسمت فقط برای کاربران دارای اشتراک فعال می‌باشد.');
  // بعداً می‌تونی یه modal زیبا بسازی
}


document.querySelector('.gc-close').onclick = () => document.getElementById('gcModal').style.display='none';



// ==================== //
//     سیستم کره‌های سه بعدی پایدار
// ==================== //

// آدرس تصاویر NASA با کیفیت بالا
const EARTH_DAY_TEXTURE = 'https://eoimages.gsfc.nasa.gov/images/imagerecords/144000/144898/land_shallow_topo_2048.jpg';

// مدیریت صحنه‌های فعال
let activeScenes = {
    financial: null,
    resources: null
};

// تابع اصلی برای ساخت کره
function createAdvancedGlobe(containerId, type) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('المان پیدا نشد:', containerId);
        return null;
    }

    // پاک کردن محتوای قبلی
    container.innerHTML = '';

    try {
        // ۱. ایجاد صحنه
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        
        // ۲. ایجاد رندرر
        const renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true 
        });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        // ۳. نورپردازی
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 3, 5);
        scene.add(directionalLight);

        // ۴. ساخت کره زمین
        const geometry = new THREE.SphereGeometry(2, 64, 64);
        const textureLoader = new THREE.TextureLoader();
        
        textureLoader.load(EARTH_DAY_TEXTURE, (texture) => {
            const material = new THREE.MeshPhongMaterial({ 
                map: texture,
                specular: new THREE.Color(0x333333),
                shininess: 5
            });
            const globe = new THREE.Mesh(geometry, material);
            scene.add(globe);

            // ۵. اضافه کردن کنترل‌ها
            const controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.minDistance = 2.5;
            controls.maxDistance = 15;
            controls.rotateSpeed = 0.5;

            camera.position.z = 5;

            // ۶. اضافه کردن markers بر اساس نوع
            addMarkersToScene(scene, type);

            // ۷. انیمیشن
            function animate() {
                requestAnimationFrame(animate);
                
                // چرخش آرام کره
                globe.rotation.y += 0.001;
                
                controls.update();
                renderer.render(scene, camera);
            }
            animate();

            // ۸. مدیریت ریزپانسیو
            function handleResize() {
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            }

            window.addEventListener('resize', handleResize);

            // ۹. ذخیره صحنه
            activeScenes[type] = { 
                scene, camera, renderer, controls, animate, handleResize,
                reset: function() {
                    controls.reset();
                    camera.position.z = 5;
                }
            };

            console.log('✅ کره با موفقیت ساخته شد:', type);
        });

        return activeScenes[type];

    } catch (error) {
        console.error('خطا در ساخت کره:', error);
        container.innerHTML = `
            <div style="color: white; text-align: center; padding: 50px; font-family: system-ui;">
                <div style="font-size: 48px; margin-bottom: 20px;">🌍</div>
                <h3>کره زمین سه بعدی</h3>
                <p>این قابلیت به زودی فعال خواهد شد</p>
                <small>${error.message}</small>
            </div>
        `;
        return null;
    }
}

// تابع برای اضافه کردن markers به صحنه
function addMarkersToScene(scene, type) {
    const markers = type === 'financial' ? getFinancialMarkers() : getResourceMarkers();
    
    markers.forEach(marker => {
        const phi = (90 - marker.lat) * (Math.PI / 180);
        const theta = (marker.lng + 180) * (Math.PI / 180);
        
        const x = -(2.2 * Math.sin(phi) * Math.cos(theta));
        const y = (2.2 * Math.cos(phi));
        const z = (2.2 * Math.sin(phi) * Math.sin(theta));
        
        const markerGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const markerMaterial = new THREE.MeshBasicMaterial({ color: marker.color });
        const markerMesh = new THREE.Mesh(markerGeometry, markerMaterial);
        markerMesh.position.set(x, y, z);
        scene.add(markerMesh);
        
        // اضافه کردن نور به marker (اختیاری)
        const pointLight = new THREE.PointLight(marker.color, 1, 0.5);
        pointLight.position.set(x, y, z);
        scene.add(pointLight);
    });
}

// داده‌های markers مالی
function getFinancialMarkers() {
    return [
        { lat: 40.7128, lng: -74.0060, color: 0x00ff00, name: "NYSE" }, // نیویورک - سبز
        { lat: 51.5074, lng: -0.1278, color: 0x00ff00, name: "LSE" },   // لندن - سبز
        { lat: 35.6895, lng: 139.6917, color: 0xff0000, name: "TSE" },  // توکیو - قرمز
        { lat: 22.3193, lng: 114.1694, color: 0xffff00, name: "HKEX" }  // هنگ‌کنگ - زرد
    ];
}

// داده‌های markers منابع
function getResourceMarkers() {
    return [
        { lat: -26.2041, lng: 28.0473, color: 0xffd700, name: "طلای آفریقای جنوبی" }, // طلا
        { lat: 24.7136, lng: 46.6753, color: 0x000000, name: "نفت عربستان" },         // نفت
        { lat: 65.0000, lng: 153.0000, color: 0x0000ff, name: "گاز روسیه" },         // گاز
        { lat: 35.6892, lng: 51.3890, color: 0xffa500, name: "معادن ایران" }         // سایر معادن
    ];
}

// توابع باز کردن کره‌ها
function openFinancialGlobe() {
    console.log('📈 باز کردن کره مالی...');
    const modal = document.getElementById('financialGlobeModal');
    modal.style.display = 'block';
    
    setTimeout(() => {
        if (!activeScenes.financial) {
            createAdvancedGlobe('financialGlobeContainer', 'financial');
        }
    }, 100);
}

function openResourcesGlobe() {
    console.log('🌍 باز کردن کره منابع...');
    const modal = document.getElementById('resourcesGlobeModal');
    modal.style.display = 'block';
    
    setTimeout(() => {
        if (!activeScenes.resources) {
            createAdvancedGlobe('resourcesGlobeContainer', 'resources');
        }
    }, 100);
}

// توابع مدیریت
function closeGlobeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

function resetGlobeView(type) {
    if (activeScenes[type]) {
        activeScenes[type].reset();
    }
}

// تابع بررسی لاگین
function isUserLoggedIn() {
    return true; // ✅ برای تست
}

function showLoginPrompt() {
    alert('🔐 برای دسترسی به این قابلیت، لطفاً وارد حساب کاربری خود شوید.');
}



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
 * 🎴 ایجاد یک کارت قیمت
 */
function createPriceCard(item) {
    const card = document.createElement('div');
    card.className = `price-card glass-card`;
    card.setAttribute('data-symbol', item.symbol);
    
    const changeClass = item.change >= 0 ? 'positive' : 'negative';
    const changeIcon = item.change >= 0 ? '📈' : '📉';
    
    card.innerHTML = `
        <div class="card-header">
            <h3>${item.name}</h3>
            <span class="price-change ${changeClass}">
                ${changeIcon} ${Math.abs(item.change)}%
            </span>
        </div>
        <div class="card-content">
            <p class="current-price">${formatPrice(item.price, item.symbol)}</p>
            <div class="mini-chart ${item.chart}"></div>
        </div>
        <div class="ad-space">
            <div class="ad-banner">📍 محل تبلیغات ${item.name}</div>
        </div>
    `;
    
    // اضافه کردن ایونت‌لیستنر برای کلیک
    card.addEventListener('click', () => openPriceDetail(item));
    
    return card;
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
    
    // دوباره پیدا کردن و اضافه کردن ایونت‌لیستنر
    document.querySelectorAll('.price-card').forEach(card => {
        card.addEventListener('click', function() {
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
        if (appState) {
            appState.openModals = 0;
        }
    }
});

console.log('📄 فایل JavaScript لود شد - آماده راه‌اندازی...');
