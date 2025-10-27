// ==================== //
// 🎯 فایل script.js - کامل و حرفه‌ای
// ==================== //

// 📍 داده‌های تستی برای شروع کار
// 🔗 بعداً با API واقعی جایگزین می‌شوند

const sampleData = {
    // 💰 داده‌های نمونه برای رمزارزها
    crypto: [
        { id: 'bitcoin', name: 'بیت‌کوین', symbol: 'BTC', price: 45230, change: 2.5, chart: 'up' },
        { id: 'ethereum', name: 'اتریوم', symbol: 'ETH', price: 2850, change: 1.2, chart: 'up' },
        { id: 'tether', name: 'تتر', symbol: 'USDT', price: 1.00, change: 0.1, chart: 'stable' },
        { id: 'bnb', name: 'بی‌ان‌بی', symbol: 'BNB', price: 320, change: -0.5, chart: 'down' },
        { id: 'solana', name: 'سولانا', symbol: 'SOL', price: 105, change: 3.2, chart: 'up' },
        { id: 'cardano', name: 'کاردانو', symbol: 'ADA', price: 0.52, change: -1.8, chart: 'down' },
        { id: 'xrp', name: 'ریپل', symbol: 'XRP', price: 0.58, change: 0.8, chart: 'up' },
        { id: 'dogecoin', name: 'دوج‌کوین', symbol: 'DOGE', price: 0.085, change: 5.2, chart: 'up' },
        { id: 'polkadot', name: 'پولکادات', symbol: 'DOT', price: 7.2, change: -0.3, chart: 'down' },
        { id: 'litecoin', name: 'لایت‌کوین', symbol: 'LTC', price: 72.5, change: 1.1, chart: 'up' }
    ],

    // 💵 داده‌های نمونه برای ارزها
    currency: [
        { id: 'usd', name: 'دلار آمریکا', symbol: 'USD', price: 58000, change: 0.5, chart: 'up' },
        { id: 'eur', name: 'یورو', symbol: 'EUR', price: 62000, change: -0.2, chart: 'down' },
        { id: 'gbp', name: 'پوند', symbol: 'GBP', price: 73000, change: 0.3, chart: 'up' },
        { id: 'aed', name: 'درهم امارات', symbol: 'AED', price: 15800, change: 0.1, chart: 'stable' },
        { id: 'try', name: 'لیر ترکیه', symbol: 'TRY', price: 1800, change: -1.2, chart: 'down' },
        { id: 'cad', name: 'دلار کانادا', symbol: 'CAD', price: 42000, change: 0.4, chart: 'up' },
        { id: 'aud', name: 'دلار استرالیا', symbol: 'AUD', price: 38000, change: -0.6, chart: 'down' },
        { id: 'cny', name: 'یوان چین', symbol: 'CNY', price: 8000, change: 0.2, chart: 'up' },
        { id: 'jpy', name: 'ین ژاپن', symbol: 'JPY', price: 380, change: -0.1, chart: 'down' },
        { id: 'chf', name: 'فرانک سوئیس', symbol: 'CHF', price: 65000, change: 0.7, chart: 'up' }
    ],

    // 🥇 داده‌های نمونه برای طلا
    gold: [
        { id: 'sekee-emami', name: 'سکه امامی', symbol: 'SEKEE', price: 32000000, change: 1.2, chart: 'up' },
        { id: 'sekee-bahar', name: 'سکه بهار', symbol: 'BAHAR', price: 31000000, change: 0.8, chart: 'up' },
        { id: 'gerami18', name: 'طلای 18 عیار', symbol: 'GOLD18', price: 2850000, change: 0.5, chart: 'up' },
        { id: 'gerami24', name: 'طلای 24 عیار', symbol: 'GOLD24', price: 3750000, change: 0.6, chart: 'up' },
        { id: 'nesfe-sekee', name: 'نیم سکه', symbol: 'NESFE', price: 16500000, change: 1.1, chart: 'up' },
        { id: 'rob-sekee', name: 'ربع سکه', symbol: 'ROB', price: 8500000, change: 0.9, chart: 'up' },
        { id: 'gerami17', name: 'طلای 17 عیار', symbol: 'GOLD17', price: 2700000, change: 0.4, chart: 'up' },
        { id: 'gerami21', name: 'طلای 21 عیار', symbol: 'GOLD21', price: 3350000, change: 0.7, chart: 'up' },
        { id: 'sekee-tam', name: 'سکه تمام', symbol: 'TAM', price: 32500000, change: 1.3, chart: 'up' },
        { id: 'mesghal', name: 'مثقال طلا', symbol: 'MESGHAL', price: 18500000, change: 0.8, chart: 'up' }
    ],

    // 📈 داده‌های نمونه برای نفت
    oil: [
        { id: 'brent', name: 'نفت برنت', symbol: 'BRENT', price: 82.5, change: -1.2, chart: 'down' },
        { id: 'wti', name: 'نفت وست تگزاس', symbol: 'WTI', price: 78.3, change: -0.8, chart: 'down' },
        { id: 'opec', name: 'سبد اوپک', symbol: 'OPEC', price: 80.1, change: -1.0, chart: 'down' }
    ],

    // 🔄 نرخ تبدیل ارز برای مبدل
    exchangeRates: {
        USD: 58000,
        EUR: 62000,
        GBP: 73000,
        IRR: 1,
        TRY: 1800,
        AED: 15800,
        CAD: 42000,
        AUD: 38000,
        CNY: 8000,
        JPY: 380,
        CHF: 65000
    }
};

// 🎯 وضعیت کلی برنامه
const appState = {
    currentTheme: 'light',
    currentView: 'home',
    currentCategory: 'crypto',
    currentTool: 'gold-calc',
    openModals: 0,
    maxModals: {
        home: 4,
        category: 2
    },
    userUsage: {
        chat: 0,
        tools: 0
    }
};

// 📍 المنت‌های DOM
const elements = {
    app: document.getElementById('app'),
    themeToggle: document.getElementById('themeToggle'),
    viewToggle: document.getElementById('viewToggle'),
    loginBtn: document.getElementById('loginBtn'),
    homeLogo: document.getElementById('homeLogo'),
    
    // بخش‌های نمایش
    homeView: document.getElementById('homeView'),
    toolsView: document.getElementById('toolsView'),
    
    // هایلایت‌ها
    highlightCircles: document.querySelectorAll('.highlight-circle'),
    toolCircles: document.querySelectorAll('[data-tool]'),
    
    // کانتینر کارت‌ها
    homeCardsContainer: document.getElementById('homeCardsContainer'),
    toolsContainer: document.getElementById('toolsContainer'),
    
    // مودال‌ها
    loginModal: document.getElementById('loginModal'),
    priceModal: document.getElementById('priceModal'),
    closeModal: document.getElementById('closeModal'),
    closePriceModal: document.getElementById('closePriceModal'),
    
    // چت
    chatInput: document.getElementById('chatInput'),
    sendMessage: document.getElementById('sendMessage'),
    chatMessages: document.getElementById('chatMessages'),
    chatUsage: document.getElementById('chatUsage'),
    
    // ابزارها
    goldResult: document.getElementById('goldResult'),
    diamondResult: document.getElementById('diamondResult'),
    conversionResult: document.getElementById('conversionResult')
};

// ==================== //
// 🎛️ مدیریت وضعیت برنامه
// ==================== //

/**
 * 📖 مقداردهی اولیه برنامه
 * 🔧 این تابع وقتی صفحه لود شد اجرا می‌شود
 */
function initializeApp() {
    console.log('🚀 برنامه LivePulse در حال راه‌اندازی...');
    
    // بارگذاری وضعیت از localStorage
    loadUserState();
    
    // تنظیم تم اولیه
    setTheme(appState.currentTheme);
    
    // نمایش نمای اولیه
    showView(appState.currentView);
    
    // تولید کارت‌های اولیه
    generateHomeCards();
    
    // تنظیم ایونت‌لیستنرها
    setupEventListeners();
    
    // شبیه‌سازی به‌روزرسانی قیمت‌ها
    startPriceUpdates();
    
    console.log('✅ برنامه آماده است!');
}

/**
 * 💾 بارگذاری وضعیت کاربر از localStorage
 */
function loadUserState() {
    const savedTheme = localStorage.getItem('livepulse-theme');
    const savedUsage = localStorage.getItem('livepulse-usage');
    
    if (savedTheme) {
        appState.currentTheme = savedTheme;
    }
    
    if (savedUsage) {
        appState.userUsage = JSON.parse(savedUsage);
        updateUsageDisplay();
    }
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
 * @param {string} theme - 'light' یا 'dark'
 */
function setTheme(theme) {
    appState.currentTheme = theme;
    elements.app.setAttribute('data-theme', theme);
    
    // آپدیت آیکون دکمه تم
    const themeIcon = elements.themeToggle.querySelector('.theme-icon');
    themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
    
    // ذخیره در localStorage
    localStorage.setItem('livepulse-theme', theme);
    
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
 * 📱 نمایش نمای مشخص
 * @param {string} view - 'home' یا 'tools'
 */
function showView(view) {
    // مخفی کردن همه نماها
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    
    // نمایش نمای انتخاب شده
    if (view === 'home') {
        elements.homeView.classList.add('active');
        elements.viewToggle.querySelector('.view-text').textContent = 'ابزار';
        appState.currentView = 'home';
        generateHomeCards();
    } else {
        elements.toolsView.classList.add('active');
        elements.viewToggle.querySelector('.view-text').textContent = 'خانه';
        appState.currentView = 'tools';
        activateTool(appState.currentTool);
    }
    
    console.log(`📱 نمایش تغییر کرد به: ${view}`);
}

// ==================== //
// 🏠 بخش خانه - کارت‌های قیمت
// ==================== //

/**
 * 🎴 تولید کارت‌های قیمت برای صفحه خانه
 */
function generateHomeCards() {
    elements.homeCardsContainer.innerHTML = '';
    
    // انتخاب ۶ مورد از مهم‌ترین آیتم‌ها از هر دسته
    const featuredItems = [
        sampleData.crypto[0],    // بیت‌کوین
        sampleData.currency[0],  // دلار
        sampleData.gold[0],      // سکه امامی
        sampleData.oil[0],       // نفت برنت
        sampleData.crypto[1],    // اتریوم
        sampleData.currency[1]   // یورو
    ];
    
    featuredItems.forEach(item => {
        const card = createPriceCard(item);
        elements.homeCardsContainer.appendChild(card);
    });
}

/**
 * 🎴 ایجاد یک کارت قیمت
 * @param {Object} item - آیتم قیمت
 * @returns {HTMLElement} المنت کارت
 */
function createPriceCard(item) {
    const card = document.createElement('div');
    card.className = `price-card glass-card ${item.chart}`;
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
    
    // اضافه کردن ایونت‌لیستنر برای هاور (دسکتاپ)
    card.addEventListener('mouseenter', handleCardHover);
    card.addEventListener('mouseleave', handleCardHover);
    
    return card;
}

/**
 * 🔍 باز کردن مودال جزئیات قیمت
 * @param {Object} item - آیتم قیمت
 */
function openPriceDetail(item) {
    if (appState.openModals >= appState.maxModals[appState.currentView]) {
        alert(`⚠️ شما نمی‌توانید بیشتر از ${appState.maxModals[appState.currentView]} پنجره باز کنید.`);
        return;
    }
    
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
        
        <div class="detail-chart">
            <div class="chart-placeholder">
                📊 نمودار قیمت ${item.name}
                <br>
                <small>📍 بعداً با API واقعی پر می‌شود</small>
            </div>
        </div>
        
        <div class="ai-analysis-section">
            <h4>🤖 تحلیل هوش مصنوعی</h4>
            <p>این تحلیل نمونه برای ${item.name} است. در نسخه نهایی از n8n دریافت می‌شود.</p>
            <div class="ai-suggestion">
                <strong>پیشنهاد:</strong> 
                ${item.change >= 0 ? '📈 شرایط مناسب برای خرید' : '📉 احتیاط در خرید'}
            </div>
        </div>
        
        <div class="ad-space">
            <div class="ad-banner">📍 محل تبلیغات تحلیل ${item.name}</div>
        </div>
    `;
    
    elements.priceModal.classList.add('active');
    appState.openModals++;
}

// ==================== //
// 🛠️ بخش ابزارها
// ==================== //

/**
 * 🛠️ فعال‌سازی ابزار مشخص
 * @param {string} toolId - شناسه ابزار
 */
function activateTool(toolId) {
    // مخفی کردن همه ابزارها
    document.querySelectorAll('.tool-section').forEach(tool => {
        tool.classList.remove('active');
    });
    
    // فعال‌سازی ابزار انتخاب شده
    const targetTool = document.getElementById(toolId + 'Tool');
    if (targetTool) {
        targetTool.classList.add('active');
        appState.currentTool = toolId;
    }
    
    // آپدیت هایلایت‌های ابزار
    document.querySelectorAll('[data-tool]').forEach(circle => {
        circle.classList.remove('active');
    });
    document.querySelector(`[data-tool="${toolId}"]`).classList.add('active');
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
 * @param {string} userMessage - پیام کاربر
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
            `با توجه به اخبار اخیر، ممکن است نوساناتی در بازار ایجاد شود.`,
            `این یک تحلیل نمونه است. در نسخه نهایی از هوش مصنوعی پیشرفته استفاده می‌شود.`
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const fullResponse = `سوال شما: "${userMessage}"\n\n${randomResponse}\n\n📍 این پاسخ نمونه است و از n8n دریافت خواهد شد.`;
        
        addChatMessage(fullResponse, 'ai');
    }, 1500);
}

/**
 * 💬 اضافه کردن پیام به چت
 * @param {string} text - متن پیام
 * @param {string} sender - 'user' یا 'ai'
 * @returns {HTMLElement} المنت پیام
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
 * @param {number} price - قیمت
 * @param {string} symbol - نماد ارز
 * @returns {string} قیمت فرمت‌شده
 */
function formatPrice(price, symbol) {
    if (symbol === 'IRR' || price > 1000) {
        return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
    } else if (price < 1) {
        return '$' + price.toFixed(4);
    } else {
        return '$' + new Intl.NumberFormat('en-US').format(price.toFixed(2));
    }
}

/**
 * ✅ بررسی محدودیت استفاده
 * @param {string} type - نوع استفاده ('chat' یا 'tools')
 * @returns {boolean} آیا می‌تواند استفاده کند
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
 * @param {string} type - نوع استفاده
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

/**
 * 🖱️ مدیریت هاور روی کارت
 */
function handleCardHover(event) {
    if (event.type === 'mouseenter') {
        event.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
    } else {
        event.currentTarget.style.transform = 'translateY(0) scale(1)';
    }
}

// ==================== //
// 🔄 به‌روزرسانی قیمت‌ها
// ==================== //

/**
 * 🔄 شروع به‌روزرسانی قیمت‌ها
 */
function startPriceUpdates() {
    // شبیه‌سازی به‌روزرسانی قیمت هر ۳۰ ثانیه
    setInterval(() => {
        updateAllPrices();
    }, 30000);
}

/**
 * 📊 آپدیت همه قیمت‌ها
 */
function updateAllPrices() {
    // در نسخه واقعی اینجا API فراخوانی می‌شود
    console.log('🔄 در حال به‌روزرسانی قیمت‌ها...');
    
    // شبیه‌سازی تغییرات کوچک قیمت
    Object.keys(sampleData).forEach(category => {
        if (Array.isArray(sampleData[category])) {
            sampleData[category].forEach(item => {
                // تغییر تصادفی بین -0.5% تا +0.5%
                const change = (Math.random() - 0.5) * 0.1;
                item.change += change;
                item.price *= (1 + change);
                
                // به‌روزرسانی نمودار
                item.chart = change >= 0 ? 'up' : 'down';
            });
        }
    });
    
    // اگر در صفحه خانه هستیم، کارت‌ها رو آپدیت کنیم
    if (appState.currentView === 'home') {
        generateHomeCards();
    }
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
    
    // دکمه تغییر نمای خانه/ابزار
    elements.viewToggle.addEventListener('click', toggleView);
    
    // دکمه ورود
    elements.loginBtn.addEventListener('click', () => {
        elements.loginModal.classList.add('active');
    });
    
    // لوگو برای بازگشت به خانه
    elements.homeLogo.addEventListener('click', () => {
        showView('home');
    });
    
    // بستن مودال‌ها
    elements.closeModal.addEventListener('click', () => {
        elements.loginModal.classList.remove('active');
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
    
    elements.priceModal.addEventListener('click', (e) => {
        if (e.target === elements.priceModal) {
            elements.priceModal.classList.remove('active');
            appState.openModals = Math.max(0, appState.openModals - 1);
        }
    });
    
    // هایلایت‌های خانه
    elements.highlightCircles.forEach(circle => {
        circle.addEventListener('click', (e) => {
            const category = e.currentTarget.getAttribute('data-category');
            
            // آپدیت هایلایت فعال
            elements.highlightCircles.forEach(c => c.classList.remove('active'));
            e.currentTarget.classList.add('active');
            
            appState.currentCategory = category;
            console.log(`🎯 دسته انتخاب شد: ${category}`);
            
            // در نسخه کامل اینجا کارت‌های مربوطه نمایش داده می‌شوند
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
        alert('🔐 سیستم ورود در نسخه نهایی پیاده‌سازی می‌شود.');
        elements.loginModal.classList.remove('active');
    });
    
    // دکمه خرید اشتراک
    document.getElementById('goToSubscription').addEventListener('click', () => {
        alert('💳 صفحه خرید اشتراک در نسخه نهایی پیاده‌سازی می‌شود.');
        elements.loginModal.classList.remove('active');
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
