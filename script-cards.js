// ==================== //
// 🏠 بخش خانه - کارت‌های قیمت
// ==================== //
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
        const log = window.logger || { info: console.log }; log.info('⏳ در حال تولید کارت‌ها...');
        return;
    }
    
    const container = document.getElementById('homeMainCards');
    if (!container) return;
    
    // اگر کارت‌ها قبلاً تولید شده‌اند، نیازی به تولید مجدد نیست
    if (container.children.length > 0) {
        const log = window.logger || { info: console.log }; log.info('✅ کارت‌ها قبلاً تولید شده‌اند');
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
            const log = window.logger || { info: console.log }; log.info('🎴 ۴ کارت اصلی ایجاد شدند');
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
 * می‌تواند از طریق localStorage فعال/غیرفعال شود
 */
function checkLoginRequired() {
    // بررسی تنظیمات - اگر requireLogin در localStorage false باشد، لاگین لازم نیست
    const requireLogin = localStorage.getItem('requireLogin');
    if (requireLogin === 'false') {
        return true; // لاگین لازم نیست
    }
    
    // اگر requireLogin در localStorage true باشد، چک لاگین کن
    if (requireLogin === 'true') {
        const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
        const userToken = localStorage.getItem('userToken');
        
        if (!isLoggedIn || !userToken) {
            // نمایش پیام نیاز به لاگین (فقط یک بار در هر session)
            const loginPromptShown = sessionStorage.getItem('loginPromptShown');
            if (!loginPromptShown && typeof showLoginPrompt === 'function') {
                showLoginPrompt();
                sessionStorage.setItem('loginPromptShown', 'true');
            }
            return false;
        }
        return true;
    }
    
    // به صورت پیش‌فرض، لاگین لازم نیست (برای تست) - همیشه true برمیگردونه
    return true;
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
    
    // فعال‌سازی اولیه - برای globe highlights، resources را فعال کن
    if (triggerAttr === 'data-globe') {
        const resourcesTrigger = Array.from(triggers).find(t => t.getAttribute(triggerAttr) === 'resources');
        if (resourcesTrigger) {
            activate('resources');
        } else {
            const initialValue = triggers[0].getAttribute(triggerAttr);
            activate(initialValue);
        }
    } else {
        const initialValue = triggers[0].getAttribute(triggerAttr);
        activate(initialValue);
    }
}

/**
 * 🔍 باز کردن مودال جزئیات قیمت - نسخه حرفه‌ای
 */
function openPriceDetail(item) {
    const log = window.logger || { info: console.log };
    log.info('🎯 مودال جدید فراخوانی شد برای:', item.name);
    
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
    
    log.info('✅ مودال با موفقیت باز شد');
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
        const log = window.logger || { info: console.log }; log.info('تایم‌فریم تغییر کرد به:', this.value);
        // بعداً با API واقعی پر می‌شود
    });
    
    // تغییر نوع نمودار
    document.querySelectorAll('.chart-type-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.chart-type-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const log = window.logger || { info: console.log }; log.info('نوع نمودار تغییر کرد به:', this.dataset.type);
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
