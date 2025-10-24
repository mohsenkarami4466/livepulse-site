// app.js - LivePulse Financial System - COMPLETE WORKING VERSION
class LivePulseApp {
    constructor() {
        this.currentMode = 'market';
        this.currentSection = 'home-section';
        this.marketData = {};
        this.userPreferences = {};
        this.chatHistories = {};
        this.adRotationIntervals = new Map();
        this.hoverTimeouts = new Map();
        this.charts = new Map();
        
        this.cryptoAssets = [
            'بیت‌کوین', 'اتریوم', 'تتر', 'بایننس کوین', 'کاردانو',
            'سولانا', 'ریپل', 'پولکادات', 'دوج کوین', 'شیبا اینو'
        ];
        
        this.currencyAssets = [
            'دلار آمریکا', 'یورو', 'پوند', 'ین ژاپن', 'فرانک سوئیس',
            'دلار کانادا', 'دلار استرالیا', 'یوان چین', 'روبل روسیه', 'لیر ترکیه'
        ];
        
        this.goldAssets = [
            'طلای ۱۸ عیار', 'سکه امامی', 'سکه بهار آزادی', 'نیم‌سکه', 'ربع‌سکه',
            'سکه گرمی', 'طلای جهانی', 'مثقال طلا', 'طلای دست دوم', 'طلای آب‌شده'
        ];
        
        this.oilAssets = [
            'نفت برنت', 'نفت وست تگزاس', 'بنزین آزاد', 'بنزین سهمیه‌ای', 'گازوئیل',
            'نفت اوپک', 'نفت ایران', 'نفت خام', 'نفت سنگین', 'نفت پالایشگاه'
        ];

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
        this.populateMarketSections();
        
        console.log('✅ LivePulse سامانه مالی کاملاً راه‌اندازی شد');
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
        } else {
            this.switchToMarketMode();
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
        
        console.log('✅ همه event listeners تنظیم شدند');
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
        
        // Tools menu items
        document.querySelectorAll('.tools-list a').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const tool = e.target.getAttribute('data-tool');
                this.switchToToolsMode();
                this.switchSection(`${tool}-tool-section`);
            });
        });
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
        
        // Simulate market changes for highlights
        setInterval(() => {
            this.simulateMarketChanges();
        }, 5000);
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
        // Use event delegation for better performance
        document.addEventListener('mouseenter', (e) => {
            const card = e.target.closest('.data-card, .window-card');
            if (card && !this.hoverTimeouts.has(card)) {
                const timeoutId = setTimeout(() => {
                    this.showCardDetailPopup(card);
                }, 500);
                this.hoverTimeouts.set(card, timeoutId);
            }
        }, true);

        document.addEventListener('mouseleave', (e) => {
            const card = e.target.closest('.data-card, .window-card');
            if (card && this.hoverTimeouts.has(card)) {
                clearTimeout(this.hoverTimeouts.get(card));
                this.hoverTimeouts.delete(card);
            }
        }, true);

        document.addEventListener('click', (e) => {
            const card = e.target.closest('.data-card, .window-card');
            if (card) {
                // Clear hover timeout if exists
                if (this.hoverTimeouts.has(card)) {
                    clearTimeout(this.hoverTimeouts.get(card));
                    this.hoverTimeouts.delete(card);
                }
                this.showCardDetailPopup(card);
            }
        });

        // Touch support
        document.addEventListener('touchstart', (e) => {
            const card = e.target.closest('.data-card, .window-card');
            if (card) {
                e.preventDefault();
                this.showCardDetailPopup(card);
            }
        }, { passive: false });
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
                    <button class="chart-btn active" data-type="candlestick">کندل</button>
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
                        <div class="stat-item">
                            <span>تغییرات ۲۴h:</span>
                            <strong class="${isPositive ? 'positive' : 'negative'}">${change}</strong>
                        </div>
                    </div>
                </div>
                
                <div class="ai-analysis-popup">
                    <h4>تحلیل هوش مصنوعی:</h4>
                    <p>${this.generateAIAnalysis(assetName, isPositive)}</p>
                </div>
            </div>
        `;
        
        this.showPopup(`جزئیات ${assetName}`, popupContent, () => {
            this.initializeDetailChart('detailChart', assetName);
            this.setupChartControls();
            this.startAdRotation('popupAd');
        });
    }

    initializeCharts() {
        // Home page line charts
        this.createLineChart('bitcoinChart', '#10b981');
        this.createLineChart('usdChart', '#ef4444');
        this.createLineChart('goldChart', '#f59e0b');
        this.createLineChart('oilChart', '#3b82f6');
    }

    createLineChart(canvasId, color) {
        const ctx = document.getElementById(canvasId)?.getContext('2d');
        if (!ctx) return;

        const isPositive = Math.random() > 0.5;
        const data = this.generateChartData(20, isPositive);
        
        const chart = new Chart(ctx, {
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

        this.charts.set(canvasId, chart);
    }

    createCandleChart(canvasId, assetName) {
        const ctx = document.getElementById(canvasId)?.getContext('2d');
        if (!ctx) return;

        const data = this.generateCandleData(20);
        
        const chart = new Chart(ctx, {
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

        this.charts.set(canvasId, chart);
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

    populateMarketSections() {
        this.populateSection('crypto-section', this.cryptoAssets);
        this.populateSection('currency-section', this.currencyAssets);
        this.populateSection('gold-section', this.goldAssets);
        this.populateSection('oil-section', this.oilAssets);
    }

    populateSection(sectionId, assets) {
        const section = document.getElementById(sectionId);
        if (!section) return;

        const grid = section.querySelector('.live-grid');
        if (!grid) return;

        grid.innerHTML = '';
        
        assets.forEach((asset, index) => {
            const isPositive = Math.random() > 0.5;
            const change = (Math.random() * 5).toFixed(2);
            const price = this.generateAssetPrice(asset);
            
            const card = document.createElement('div');
            card.className = 'data-card';
            card.setAttribute('data-asset', asset);
            card.setAttribute('data-chart-type', 'candlestick');
            card.innerHTML = `
                <div class="card-ad-corner">تبلیغات</div>
                <div class="card-header">
                    <div class="card-title">${asset}</div>
                </div>
                <div class="card-price">${price}</div>
                <div class="card-change ${isPositive ? 'positive' : 'negative'}">
                    ${isPositive ? '+' : ''}${change}%
                </div>
                <div class="chart-container">
                    <canvas id="${this.sanitizeId(asset)}Chart"></canvas>
                </div>
            `;
            grid.appendChild(card);
        });

        // Initialize charts after a short delay
        setTimeout(() => {
            assets.forEach(asset => {
                this.createCandleChart(`${this.sanitizeId(asset)}Chart`, asset);
            });
        }, 100);
    }

    initializeSlidingWindows() {
        this.initializeWindowTrack('windowsTrackTop', this.cryptoAssets.slice(0, 6));
        this.initializeWindowTrack('windowsTrackBottom', this.currencyAssets.slice(0, 6));
    }

    initializeWindowTrack(trackId, assets) {
        const track = document.getElementById(trackId);
        if (!track) return;

        track.innerHTML = '';
        
        assets.forEach(asset => {
            const isPositive = Math.random() > 0.5;
            const change = (Math.random() * 5).toFixed(2);
            const price = this.generateAssetPrice(asset);
            
            const card = document.createElement('div');
            card.className = 'window-card';
            card.innerHTML = `
                <div class="card-ad-corner">تبلیغات</div>
                <div class="card-header">
                    <div class="card-title">${asset}</div>
                </div>
                <div class="card-price">${price}</div>
                <div class="card-change ${isPositive ? 'positive' : 'negative'}">
                    ${isPositive ? '+' : ''}${change}%
                </div>
                <div class="chart-container">
                    <canvas id="sliding${this.sanitizeId(asset)}Chart"></canvas>
                </div>
            `;
            track.appendChild(card);
        });

        // Initialize charts
        setTimeout(() => {
            assets.forEach(asset => {
                this.createCandleChart(`sliding${this.sanitizeId(asset)}Chart`, asset);
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
            'تبلیغات - صندوق‌های سرمایه‌گذاری',
            'تبلیغات - بیمه‌های عمر',
            'تبلیغات - مشاوره مالیاتی'
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
        const setupChat = (section) => {
            const input = document.getElementById(`${section}ChatInput`);
            const sendBtn = document.getElementById(`${section}ChatSend`);
            const container = document.getElementById(`${section}ChatContainer`);

            if (input && sendBtn && container) {
                const sendMessage = () => {
                    const message = input.value.trim();
                    if (!message) return;

                    this.addChatMessage(section, 'user', message, container);
                    input.value = '';

                    setTimeout(() => {
                        const response = this.generateAIResponse(section, message);
                        this.addChatMessage(section, 'ai', response, container);
                    }, 1000 + Math.random() * 2000);
                };

                sendBtn.addEventListener('click', sendMessage);
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                    }
                });
            }
        };

        ['home', 'crypto', 'currency', 'gold', 'oil'].forEach(setupChat);
    }

    addChatMessage(section, sender, message, container) {
        if (!container) {
            container = document.getElementById(`${section}ChatContainer`);
            if (!container) return;
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;
        messageDiv.innerHTML = `<strong>${sender === 'ai' ? 'هوش مصنوعی' : 'شما'}:</strong> ${message}`;
        
        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;

        this.chatHistories[section].push({ sender, message, timestamp: new Date().toISOString() });
        localStorage.setItem(`chat_${section}`, JSON.stringify(this.chatHistories[section]));
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

    setupLoginSystem() {
        const loginBtn = document.getElementById('loginBtn');
        
        loginBtn.addEventListener('click', () => {
            this.showPopup('ورود به سیستم', `
                <form class="login-form" id="loginForm">
                    <div class="form-group">
                        <label class="form-label">نام کاربری یا ایمیل</label>
                        <input type="text" class="form-input" placeholder="username@example.com" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">رمز عبور</label>
                        <input type="password" class="form-input" placeholder="••••••••" required>
                    </div>
                    <button type="submit" class="form-submit">ورود</button>
                    <div class="subscription-link">
                        <a href="#">خرید اشتراک</a>
                    </div>
                </form>
            `, () => {
                document.getElementById('loginForm').addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.showNotification('ورود موفقیت‌آمیز بود!', 'success');
                    this.closePopup();
                });
            });
        });
    }

    setupResponsiveHandlers() {
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));
    }

    handleResize() {
        // Update chart sizes on resize
        this.charts.forEach(chart => {
            chart.resize();
        });
        if (this.detailChart) {
            this.detailChart.resize();
        }
    }

    showPopup(title, content, onOpen = null) {
        const popupOverlay = document.getElementById('popupOverlay');
        const popupContent = document.getElementById('popupContent');
        
        if (!popupOverlay || !popupContent) return;

        popupContent.innerHTML = `
            <div class="popup-header">
                <h3 class="popup-title">${title}</h3>
                <button class="popup-close" id="popupClose">×</button>
            </div>
            <div class="popup-body">
                ${content}
            </div>
        `;

        popupOverlay.style.display = 'flex';

        // Setup close button
        document.getElementById('popupClose').addEventListener('click', () => {
            this.closePopup();
        });

        // Close on background click
        popupOverlay.addEventListener('click', (e) => {
            if (e.target === popupOverlay) {
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
        const popupOverlay = document.getElementById('popupOverlay');
        if (popupOverlay) {
            popupOverlay.style.display = 'none';
            
            // Clear detail chart
            if (this.detailChart) {
                this.detailChart.destroy();
                this.detailChart = null;
            }
        }
    }

    // Utility methods
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 4000);
    }

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

    generateAssetPrice(asset) {
        const prices = {
            'بیت‌کوین': '$' + this.formatNumber(45000 + Math.random() * 10000),
            'اتریوم': '$' + this.formatNumber(2000 + Math.random() * 1000),
            'دلار آمریکا': this.formatNumber(50000 + Math.random() * 10000) + ' تومان',
            'طلای جهانی': '$' + this.formatNumber(1800 + Math.random() * 200),
            'نفت برنت': '$' + (80 + Math.random() * 10).toFixed(2)
        };
        
        return prices[asset] || '$' + this.formatNumber(100 + Math.random() * 100);
    }

    sanitizeId(str) {
        return str.replace(/\s+/g, '').replace(/[^\w]/g, '');
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
            'gold': [
                "طلای جهانی تحت تأثیر تورم جهانی در حال رشد است.",
                "پیش‌بینی می‌شود طلا به ۲,۰۲۰ دلار برسد.",
                "سکه امامی ممکن است نوسانات فصلی را تجربه کند."
            ],
            'oil': [
                "قیمت نفت تحت تأثیر تحولات خاورمیانه در نوسان است.",
                "پیش‌بینی می‌شود نفت در محدوده ۸۰-۸۵ دلار تثبیت شود.",
                "تولید اوپک بر قیمت نفت تأثیر مستقیم دارد."
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

    generateAIAnalysis(assetName, isPositive) {
        const analyses = {
            'بیت‌کوین': 'بیت‌کوین در مسیر صعودی قرار دارد و انتظار می‌رود به ۵۰,۰۰۰ دلار برسد.',
            'دلار آمریکا': 'نرخ دلار تحت تأثیر سیاست‌های بانک مرکزی در نوسان است.',
            'طلای جهانی': 'طلای جهانی به عنوان پناهگاه امن در شرایط تورمی جذاب است.',
            'نفت برنت': 'قیمت نفت تحت تأثیر تولید اوپک و تقاضای جهانی است.'
        };
        
        return analyses[assetName] || 
               `این دارایی در مسیر ${isPositive ? 'صعودی' : 'نزولی'} قرار دارد و ${isPositive ? 'انتظار رشد' : 'نیاز به احتیاط'} دارد.`;
    }

    simulateMarketChanges() {
        const marketHighlights = document.querySelectorAll('.highlight-item.market');
        marketHighlights.forEach(highlight => {
            const isPositive = Math.random() > 0.5;
            highlight.classList.toggle('positive', isPositive);
            highlight.classList.toggle('negative', !isPositive);
        });
    }

    loadSectionData(sectionId) {
        console.log(`📊 Loading data for section: ${sectionId}`);
    }

    loadMarketData() {
        setTimeout(() => {
            this.showNotification('داده‌های بازار به‌روز شد', 'success');
        }, 2000);
    }
}

// Initialize the application when DOM is ready
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
