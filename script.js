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

    // 🆕 این خط رو اضافه کن:
    setTimeout(() => setupSliders(), 1000);
    
    // آپدیت نمایش استفاده
    updateUsageDisplay();
    
    console.log('✅ برنامه آماده است!');
}

/**
 * 💾 ذخیره وضعیت کاربر در localStorage
 */
function saveUserState() {
    localStorage.setItem('livepulse-theme', appState.currentTheme);
    localStorage.setItem('livepulse-usage', JSON.stringify(appState.userUsage));
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
// 🔄 مدیریت نمایش (خانه/ابزار)
// ==================== //

/**
 * 🏠 تغییر بین نمای خانه و ابزار
 */
function toggleView() {
    const newView = appState.currentView === 'home' ? 'tools' : 'home';
    showView(newView);
}

/**
 * 📱 نمایش نمای مشخص + ریست اسکرول
 */
function showView(view) {
    // مخفی کردن همه نماها
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active-view'));
    
    // نمایش نمای انتخاب شده
    const viewElements = {
        'home': elements.homeView,
        'tools': elements.toolsView,
        'news': document.getElementById('newsView'), // 🆕 اضافه شد
        'crypto': elements.cryptoView,
        'currency': elements.currencyView,
        'gold': elements.goldView,
        'forex': elements.forexView,
        'stock': elements.stockView,
        'oil': elements.oilView
    };
    
    if (viewElements[view]) {
        viewElements[view].classList.add('active-view');
        appState.currentView = view;
        
        // 🆕 ریست اسکرول به بالای صفحه
        window.scrollTo(0, 0);
        
        // 🆕 آپدیت وضعیت دکمه‌های ناوبری
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = document.querySelector(`[data-page="${view}"]`);
        if (activeBtn) activeBtn.classList.add('active');
        
        // 🆕 انتقال هایلایت‌های اصلی فقط به صفحات اصلی
        if (view !== 'tools' && view !== 'news') {
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
    
    console.log(`📱 نمایش تغییر کرد به: ${view}`);
}

// ==================== //
// 🌍 مدیریت نوار وضعیت بازار
// ==================== //

/**
 * 🕒 آپدیت زمان و وضعیت بازارها
 */
function updateMarketStatus() {
    const now = new Date();
    const utcHours = now.getUTCHours();
    
    // آپدیت زمان جاری
    document.getElementById('currentTime').textContent = 
        now.toLocaleTimeString('fa-IR');
    
    // آپدیت وضعیت بازارها (محاسبه ساده)
    updateMarketStatusDisplay(utcHours);
}

/**
 * 📊 آپدیت نمایش وضعیت بازارها
 */
function updateMarketStatusDisplay(utcHours) {
    const markets = {
        'shanghai': { open: 1, close: 9 },   // 01:00 - 09:00 UTC
        'moscow': { open: 7, close: 16 },    // 07:00 - 16:00 UTC  
        'tehran': { open: 4, close: 9 },     // 04:30 - 09:00 UTC
        'sydney': { open: 22, close: 7 },    // 22:00 - 07:00 UTC
        'tokyo': { open: 0, close: 9 },      // 00:00 - 09:00 UTC
        'london': { open: 8, close: 17 },    // 08:00 - 17:00 UTC
        'newyork': { open: 13, close: 22 }   // 13:00 - 22:00 UTC
    };
    
    Object.keys(markets).forEach(market => {
        const { open, close } = markets[market];
        const isOpen = utcHours >= open && utcHours < close;
        const hoursUntilOpen = open > utcHours ? open - utcHours : 24 - utcHours + open;
        
        const element = document.querySelector(`[data-market="${market}"]`);
        if (element) {
            const statusElement = element.querySelector('.market-status');
            const timeElement = element.querySelector('.time-remaining');
            
            if (isOpen) {
                statusElement.textContent = '🟢';
                statusElement.className = 'market-status open';
                timeElement.textContent = 'باز';
            } else if (hoursUntilOpen <= 2) {
                statusElement.textContent = '🟡';
                statusElement.className = 'market-status soon';
                timeElement.textContent = `${hoursUntilOpen}h`;
            } else {
                statusElement.textContent = '🔴';
                statusElement.className = 'market-status closed';
                timeElement.textContent = 'بسته';
            }
        }
    });
}

// شروع آپدیت زمان
setInterval(updateMarketStatus, 1000);
updateMarketStatus();

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
<!-- 📰 مدیریت سیستم اخبار -->
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
    
    // 🆕 دکمه‌های ناوبری اصلی
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetPage = this.getAttribute('data-page');
            showView(targetPage);
        });
    });

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
        if (e.target === elements.loginModal) {
            elements.loginModal.classList.remove('active');
        }
    });
    
    elements.subscriptionModal.addEventListener('click', (e) => {
        if (e.target === elements.subscriptionModal) {
            elements.subscriptionModal.classList.remove('active');
        }
    });
    
    elements.priceModal.addEventListener('click', (e) => {
        if (e.target === elements.priceModal) {
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
        
        // 🆕 انتقال به صفحه مربوطه
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
// 🎠 کنترل اسلایدرها
// ==================== //

function setupSliders() {
    console.log('🎠 راه‌اندازی اسلایدرها...');
    
    try {
        const sliders = document.querySelectorAll('.slider-container');
        console.log('تعداد اسلایدرها:', sliders.length);
        
        if (sliders.length === 0) {
            console.log('⚠️ هیچ اسلایدری پیدا نشد');
            return;
        }
        
        sliders.forEach((slider, index) => {
            console.log(`🎯 راه‌اندازی اسلایدر ${index + 1}`);
            
            // فقط برای اسلایدرهایی که slider-group دارند ادامه بده
            const sliderGroups = slider.querySelectorAll('.slider-group');
            if (sliders.length === 0) {
                console.log(`⚠️ اسلایدر ${index + 1} slider-group ندارد`);
                return;
            }
            
            console.log(`✅ اسلایدر ${index + 1} راه‌اندازی شد`);
        });
        
        console.log('🎯 اسلایدرها راه‌اندازی شدند');
    } catch (error) {
        console.log('⚠️ خطا در راه‌اندازی اسلایدرها:', error);
    }
}

// ==================== //
// 🚀 راه‌اندازی برنامه
// ==================== //

// 📖 وقتی DOM کاملاً لود شد
document.addEventListener('DOMContentLoaded', initializeApp);

// 🔧 هندلر خطاهای全局
window.addEventListener('error', (e) => {
    console.error('❌ خطا در برنامه:', e.error);
});

console.log('📄 فایل JavaScript لود شد - آماده راه‌اندازی...');
