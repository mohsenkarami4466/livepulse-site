// app.js - LivePulse Financial System
class LivePulseApp {
    constructor() {
        this.currentMode = 'market';
        this.currentSection = 'home-section';
        this.marketData = {};
        this.userPreferences = {};
        this.chatHistories = {};
        this.adRotationIntervals = new Map();
        this.hoverTimeouts = new Map();
        
        this.init();
    }

    init() {
        this.loadUserPreferences();
        this.setupEventListeners();
        this.initializeCharts();
        this.loadMarketData();
        this.initializeSlidingWindows();
        this.setupAdSystem();
        this.initializeAllChats();
        
        console.log('LivePulse سامانه مالی راه‌اندازی شد');
    }

    loadUserPreferences() {
        const savedTheme = localStorage.getItem('livepulse_theme') || 'light';
        const savedMode = localStorage.getItem('livepulse_mode') || 'market';
        
        this.userPreferences = {
            theme: savedTheme,
            mode: savedMode
        };

        this.applyUserPreferences();
    }

    applyUserPreferences() {
        document.body.setAttribute('data-theme', this.userPreferences.theme);
        
        if (this.userPreferences.mode === 'tools') {
            this.switchToToolsMode();
        }
    }

    setupEventListeners() {
        this.setupThemeToggle();
        this.setupModeToggle();
        this.setupHighlightInteractions();
        this.setupCardInteractions();
        this.setupChatSystems();
        this.setupLoginSystem();
        this.setupSliderControls();
        this.setupResponsiveHandlers();
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        
        themeToggle.addEventListener('click', (e) => {
            if (e.target.classList.contains('theme-btn')) {
                const theme = e.target.getAttribute('data-theme');
                this.switchTheme(theme);
            }
        });
    }

    switchTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        this.userPreferences.theme = theme;
        localStorage.setItem('livepulse_theme', theme);
        this.showNotification(`تم ${theme === 'dark' ? 'تاریک' : 'روشن'} فعال شد`, 'success');
    }

    setupModeToggle() {
        const modeToggleBtn = document.getElementById('modeToggleBtn');
        const logoBtn = document.getElementById('logoBtn');

        modeToggleBtn.addEventListener('click', () => this.toggleMode());
        logoBtn.addEventListener('click', () => this.handleLogoClick());
    }

    toggleMode() {
        if (this.currentMode === 'market') {
            this.switchToToolsMode();
        } else {
            this.switchToMarketMode();
        }
    }

    switchToToolsMode() {
        this.currentMode = 'tools';
        document.getElementById('modeToggleBtn').textContent = 'خانه';
        document.getElementById('marketHighlights').classList.add('hidden');
        document.getElementById('toolHighlights').classList.remove('hidden');
        this.switchSection('gold-tool-section');
        this.userPreferences.mode = 'tools';
        localStorage.setItem('livepulse_mode', 'tools');
        this.showNotification('حالت ابزارهای محاسباتی فعال شد', 'info');
    }

    switchToMarketMode() {
        this.currentMode = 'market';
        document.getElementById('modeToggleBtn').textContent = 'ابزارها';
        document.getElementById('toolHighlights').classList.add('hidden');
        document.getElementById('marketHighlights').classList.remove('hidden');
        this.switchSection('home-section');
        this.userPreferences.mode = 'market';
        localStorage.setItem('livepulse_mode', 'market');
        this.showNotification('حالت تحلیل بازار فعال شد', 'info');
    }

    handleLogoClick() {
        if (this.currentMode === 'tools') {
            this.switchToMarketMode();
        } else {
            this.switchSection('home-section');
        }
    }

    setupHighlightInteractions() {
        const highlights = document.querySelectorAll('.highlight-item');
        
        highlights.forEach(highlight => {
            highlight.addEventListener('click', (e) => {
                const sectionId = highlight.getAttribute('data-section');
                this.handleHighlightClick(highlight, sectionId);
            });
        });
    }

    handleHighlightClick(highlight, sectionId) {
        const relatedHighlights = this.currentMode === 'market' ? 
            document.querySelectorAll('.highlight-item.market') : 
            document.querySelectorAll('.highlight-item.tool');
        
        relatedHighlights.forEach(h => h.classList.remove('active'));
        highlight.classList.add('active');
        this.switchSection(sectionId);
    }

    switchSection(sectionId) {
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionId;
            this.loadSectionData(sectionId);
        }
    }

    setupCardInteractions() {
        const dataCards = document.querySelectorAll('.data-card, .window-card');
        
        dataCards.forEach(card => {
            // Hover with 0.5 second delay for auto-open
            card.addEventListener('mouseenter', (e) => {
                const timeoutId = setTimeout(() => {
                    this.showCardDetailPopup(card);
                }, 500);
                this.hoverTimeouts.set(card, timeoutId);
            });
            
            card.addEventListener('mouseleave', () => {
                const timeoutId = this.hoverTimeouts.get(card);
                if (timeoutId) {
                    clearTimeout(timeoutId);
                    this.hoverTimeouts.delete(card);
                }
            });
            
            // Click for immediate open
            card.addEventListener('click', (e) => {
                const timeoutId = this.hoverTimeouts.get(card);
                if (timeoutId) {
                    clearTimeout(timeoutId);
                    this.hoverTimeouts.delete(card);
                }
                this.showCardDetailPopup(card);
            });
            
            // Touch for mobile
            card.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.showCardDetailPopup(card);
            }, { passive: false });
        });
    }

    showCardDetailPopup(card) {
        const assetName = card.querySelector('.card-title')?.textContent || 'دارایی';
        const price = card.querySelector('.card-price')?.textContent || '---';
        const change = card.querySelector('.card-change')?.textContent || '---';
        const isPositive = change.includes('+');
        
        const popupContent = `
            <div class="popup-detail">
                <div class="detail-header">
                    <h3>${assetName}</h3>
                    <div class="price-display">${price}</div>
                    <div class="change-display ${isPositive ? 'positive' : 'negative'}">${change}</div>
                </div>
                
                <div class="ad-container">
                    <p>تبلیغات - اینجا بنر تبلیغاتی نمایش داده می‌شود</p>
                </div>
                
                <div class="chart-controls">
                    <button class="chart-btn active" data-type="candle">کندل</button>
                    <button class="chart-btn" data-type="line">خطی</button>
                    <button class="chart-btn" data-type="bar">میله‌ای</button>
                </div>
                
                <div class="detail-content">
                    <div class="chart-container-large">
                        <canvas id="detailChart"></canvas>
                    </div>
                    
                    <div class="detail-stats">
                        <div class="stat-item">
                            <span>بالاترین قیمت:</span>
                            <strong>${this.generateRandomPrice(price)}</strong>
                        </div>
                        <div class="stat-item">
                            <span>پایین‌ترین قیمت:</span>
                            <strong>${this.generateRandomPrice(price, false)}</strong>
                        </div>
                        <div class="stat-item">
                            <span>حجم معاملات:</span>
                            <strong>${this.formatNumber(Math.random() * 1000)}M</strong>
                        </div>
                    </div>
                </div>
                
                <div class="ai-analysis-popup">
                    <h4>تحلیل هوش مصنوعی:</h4>
                    <p>این دارایی در مسیر صعودی قرار دارد و انتظار می‌رود در روزهای آینده رشد بیشتری را تجربه کند.</p>
                </div>
            </div>
        `;
        
        this.showPopup(`جزئیات ${assetName}`, popupContent, () => {
            this.initializeDetailChart('detailChart', assetName);
            this.setupChartControls();
            this.startAdRotation('detailPopup');
        });
    }

    initializeCharts() {
        // Home page line charts
        this.createLineChart('bitcoinChart', '#10b981');
        this.createLineChart('usdChart', '#ef4444');
        this.createLineChart('goldChart', '#f59e0b');
        this.createLineChart('oilChart', '#3b82f6');
        
        // Initialize crypto section with candle charts
        this.initializeSectionCharts('crypto-section');
    }

    createLineChart(canvasId, color) {
        const ctx = document.getElementById(canvasId)?.getContext('2d');
        if (!ctx) return;

        const isPositive = Math.random() > 0.5;
        const data = this.generateChartData(20, isPositive);
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Price',
                    data: data.values,
                    borderColor: color,
                    backgroundColor: color + '20',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { display: false },
                    y: { display: false }
                },
                interaction: { intersect: false }
            }
        });
    }

    createCandleChart(canvasId, assetName) {
        const ctx = document.getElementById(canvasId)?.getContext('2d');
        if (!ctx) return;

        const data = this.generateCandleData(20);
        
        new Chart(ctx, {
            type: 'candlestick',
            data: {
                labels: data.labels,
                datasets: [{
                    label: assetName,
                    data: data.candles
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { display: false },
                    y: { display: false }
                }
            }
        });
    }

    initializeDetailChart(canvasId, assetName) {
        const ctx = document.getElementById(canvasId)?.getContext('2d');
        if (!ctx) return;

        const data = this.generateCandleData(50);
        
        this.detailChart = new Chart(ctx, {
            type: 'candlestick',
            data: {
                labels: data.labels,
                datasets: [{
                    label: assetName,
                    data: data.candles
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const point = context.raw;
                                return `O: ${point.o} H: ${point.h} L: ${point.l} C: ${point.c}`;
                            }
                        }
                    }
                }
            }
        });
    }

    setupChartControls() {
        document.querySelectorAll('.chart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                if (this.detailChart) {
                    const chartType = e.target.getAttribute('data-type');
                    this.detailChart.config.type = chartType;
                    this.detailChart.update();
                }
            });
        });
    }

    generateChartData(count, isPositive) {
        let value = 100;
        const values = [];
        const labels = [];
        
        for (let i = 0; i < count; i++) {
            values.push(value);
            labels.push('');
            const change = (Math.random() - 0.4) * 4;
            value += isPositive ? Math.abs(change) : -Math.abs(change);
        }
        
        return { values, labels };
    }

    generateCandleData(count) {
        const candles = [];
        const labels = [];
        let price = 100;
        
        for (let i = 0; i < count; i++) {
            const open = price;
            const change = (Math.random() - 0.5) * 8;
            const close = price + change;
            const high = Math.max(open, close) + Math.random() * 4;
            const low = Math.min(open, close) - Math.random() * 4;
            
            candles.push({ o: open, h: high, l: low, c: close });
            labels.push('');
            price = close;
        }
        
        return { candles, labels };
    }

    initializeSlidingWindows() {
        this.initializeWindowTrack('windowsTrackTop', 'top');
        this.initializeWindowTrack('windowsTrackBottom', 'bottom');
    }

    initializeWindowTrack(trackId, direction) {
        const track = document.getElementById(trackId);
        if (!track) return;

        const assets = ['بیت‌کوین', 'اتریوم', 'دلار', 'یورو', 'طلای جهانی', 'سکه امامی', 'نفت برنت', 'بنزین'];
        
        assets.forEach(asset => {
            const card = document.createElement('div');
            card.className = 'window-card';
            card.innerHTML = `
                <div class="card-ad-corner">تبلیغات</div>
                <div class="card-header">
                    <div class="card-title">${asset}</div>
                </div>
                <div class="card-price">${this.generateRandomPrice('100')}</div>
                <div class="card-change ${Math.random() > 0.5 ? 'positive' : 'negative'}">
                    ${Math.random() > 0.5 ? '+' : ''}${(Math.random() * 5).toFixed(2)}%
                </div>
                <div class="chart-container">
                    <canvas id="${asset.replace(/\s/g, '')}Chart"></canvas>
                </div>
            `;
            track.appendChild(card);
        });

        // Initialize charts for window cards
        setTimeout(() => {
            assets.forEach(asset => {
                this.createCandleChart(`${asset.replace(/\s/g, '')}Chart`, asset);
            });
        }, 100);
    }

    setupSliderControls() {
        this.setupSingleSlider('windowsTrackTop', 'prevBtnTop', 'nextBtnTop');
        this.setupSingleSlider('windowsTrackBottom', 'prevBtnBottom', 'nextBtnBottom');
    }

    setupSingleSlider(trackId, prevBtnId, nextBtnId) {
        const track = document.getElementById(trackId);
        const prevBtn = document.getElementById(prevBtnId);
        const nextBtn = document.getElementById(nextBtnId);
        
        if (!track || !prevBtn || !nextBtn) return;

        let position = 0;
        const cardWidth = 280 + 16; // width + gap

        nextBtn.addEventListener('click', () => {
            position = Math.max(position - cardWidth, -(track.scrollWidth - track.parentElement.offsetWidth));
            track.style.transform = `translateX(${position}px)`;
        });

        prevBtn.addEventListener('click', () => {
            position = Math.min(position + cardWidth, 0);
            track.style.transform = `translateX(${position}px)`;
        });
    }

    setupAdSystem() {
        // Initialize ad rotation for all ad containers
        document.querySelectorAll('.ad-container, .card-ad-corner').forEach(adContainer => {
            this.startAdRotation(adContainer);
        });
    }

    startAdRotation(container) {
        // Clear existing interval
        if (this.adRotationIntervals.has(container)) {
            clearInterval(this.adRotationIntervals.get(container));
        }

        // Start new rotation every 30 seconds
        const interval = setInterval(() => {
            this.rotateAd(container);
        }, 30000);

        this.adRotationIntervals.set(container, interval);
    }

    rotateAd(container) {
        const ads = [
            'تبلیغات - محصولات مالی',
            'تبلیغات - کارگزاری آنلاین', 
            'تبلیغات - آموزش سرمایه‌گذاری',
            'تبلیغات - صندوق‌های سرمایه‌گذاری'
        ];
        
        const randomAd = ads[Math.floor(Math.random() * ads.length)];
        
        if (container.classList.contains('card-ad-corner')) {
            container.textContent = randomAd;
        } else {
            container.innerHTML = `<p>${randomAd}</p>`;
        }
    }

    setupChatSystems() {
        this.initializeAllChats();
        this.setupChatInputs();
    }

    initializeAllChats() {
        const chatSections = ['home', 'crypto', 'currency', 'gold', 'oil'];
        chatSections.forEach(section => {
            this.chatHistories[section] = JSON.parse(
                localStorage.getItem(`chat_${section}`) || '[]'
            );
            this.loadChatHistory(section);
        });
    }

    setupChatInputs() {
        document.querySelectorAll('.chat-input-container').forEach(container => {
            const input = container.querySelector('.chat-input');
            const sendBtn = container.querySelector('.chat-send');
            
            const section = this.getChatSectionFromContainer(container);
            
            sendBtn.addEventListener('click', () => {
                this.handleChatSend(section, input);
            });
            
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.handleChatSend(section, input);
                }
            });
        });
    }

    handleChatSend(section, input) {
        const message = input.value.trim();
        if (!message) return;

        this.addChatMessage(section, 'user', message);
        input.value = '';

        setTimeout(() => {
            const response = this.generateAIResponse(section, message);
            this.addChatMessage(section, 'ai', response);
        }, 1000 + Math.random() * 2000);
    }

    addChatMessage(section, sender, message) {
        const container = document.getElementById(`${section}ChatContainer`);
        if (!container) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;
        messageDiv.innerHTML = `<strong>${sender === 'ai' ? 'هوش مصنوعی' : 'شما'}:</strong> ${message}`;
        
        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;

        this.chatHistories[section].push({ sender, message, timestamp: new Date().toISOString() });
        localStorage.setItem(`chat_${section}`, JSON.stringify(this.chatHistories[section]));
    }

    generateAIResponse(section, userMessage) {
        const responses = {
            'crypto': [
                "تحلیل فعلی بازار رمزارزها نشان‌دهنده روند صعودی ملایم است.",
                "بیت‌کوین در حال تست مقاومت ۴۵,۰۰۰ دلاری است.",
                "انتظار می‌رود اتریوم در صورت شکست ۲,۵۰۰ دلار رشد کند."
            ],
            'currency': [
                "نرخ ارزها تحت تأثیر اخبار سیاسی در نوسان است.",
                "دلار ممکن است در محدوده ۵۸-۶۰ هزار تومان تثبیت شود.",
                "یورو نسبت به دلار آمریکا در حال تقویت است."
            ],
            'default': [
                "سوال خوبی پرسیدید! برای پاسخ دقیق‌تر به داده‌های بیشتری نیاز دارم.",
                "این موضوع نیاز به تحلیل تخصصی دارد.",
                "لطفاً سوال خود را با جزئیات بیشتری مطرح کنید."
            ]
        };
        
        const sectionKey = responses[section] ? section : 'default';
        const availableResponses = responses[sectionKey];
        
        return availableResponses[Math.floor(Math.random() * availableResponses.length)];
    }

    setupLoginSystem() {
        const loginBtn = document.getElementById('loginBtn');
        const loginPopup = document.getElementById('loginPopup');
        
        loginBtn.addEventListener('click', () => {
            this.showPopup('ورود به سیستم', `
                <form class="login-form">
                    <div class="form-group">
                        <label>نام کاربری یا ایمیل</label>
                        <input type="text" placeholder="username@example.com" required>
                    </div>
                    <div class="form-group">
                        <label>رمز عبور</label>
                        <input type="password" placeholder="••••••••" required>
                    </div>
                    <button type="submit" class="form-submit">ورود</button>
                    <div class="subscription-link">
                        <a href="#">خرید اشتراک</a>
                    </div>
                </form>
            `);
        });
    }

    setupResponsiveHandlers() {
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));
    }

    handleResize() {
        // Update chart sizes on resize
        if (this.detailChart) {
            this.detailChart.resize();
        }
    }

    showPopup(title, content, onOpen = null) {
        const popup = document.getElementById('detailPopup');
        if (!popup) return;

        popup.innerHTML = `
            <div class="popup-content">
                <div class="popup-header">
                    <h3 class="popup-title">${title}</h3>
                    <button class="popup-close" id="popupClose">×</button>
                </div>
                <div class="popup-body">
                    ${content}
                </div>
            </div>
        `;

        popup.style.display = 'flex';

        // Setup close button
        document.getElementById('popupClose').addEventListener('click', () => {
            this.closePopup();
        });

        // Close on background click
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                this.closePopup();
            }
        });

        // Close on ESC key
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                this.closePopup();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        if (onOpen) onOpen();
    }

    closePopup() {
        const popup = document.getElementById('detailPopup');
        if (popup) {
            popup.style.display = 'none';
            
            // Clear ad rotation for popup
            if (this.adRotationIntervals.has('detailPopup')) {
                clearInterval(this.adRotationIntervals.get('detailPopup'));
                this.adRotationIntervals.delete('detailPopup');
            }
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--bg-secondary);
            color: var(--text-primary);
            padding: 1rem;
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            z-index: 3000;
            border-right: 4px solid ${type === 'success' ? 'var(--accent-green)' : 
                                  type === 'error' ? 'var(--accent-red)' : 
                                  'var(--accent-blue)'};
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 4000);
    }

    // Utility functions
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    formatNumber(num) {
        return new Intl.NumberFormat('fa-IR').format(num);
    }

    generateRandomPrice(basePrice, higher = true) {
        const base = parseFloat(basePrice.replace(/[^\d.]/g, ''));
        const variation = higher ? 
            base * (1 + Math.random() * 0.1) : 
            base * (1 - Math.random() * 0.1);
        
        return this.formatNumber(Math.round(variation));
    }

    getChatSectionFromContainer(container) {
        const chatSection = container.closest('.ai-chat');
        return chatSection ? chatSection.id.replace('ChatContainer', '') : 'home';
    }

    loadSectionData(sectionId) {
        // Simulate data loading
        console.log(`Loading data for section: ${sectionId}`);
    }

    loadMarketData() {
        // Simulate market data loading
        setTimeout(() => {
            this.showNotification('داده‌های بازار به‌روز شد', 'success');
        }, 2000);
    }

    initializeSectionCharts(sectionId) {
        // Initialize charts for specific sections
        const section = document.getElementById(sectionId);
        if (section) {
            section.querySelectorAll('.chart-container canvas').forEach((canvas, index) => {
                setTimeout(() => {
                    this.createCandleChart(canvas.id, `Asset ${index + 1}`);
                }, index * 100);
            });
        }
    }

    loadChatHistory(section) {
        const container = document.getElementById(`${section}ChatContainer`);
        if (!container) return;

        this.chatHistories[section].forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `chat-message ${msg.sender}-message`;
            messageDiv.innerHTML = `<strong>${msg.sender === 'ai' ? 'هوش مصنوعی' : 'شما'}:</strong> ${msg.message}`;
            container.appendChild(messageDiv);
        });
        
        container.scrollTop = container.scrollHeight;
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.livePulseApp = new LivePulseApp();
});

// Global error handling
window.addEventListener('error', (event) => {
    console.error('خطای全局:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Promise rejection:', event.reason);
});
