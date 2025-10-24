// app.js
/**
 * سامانه مالی هوشمند - اسکریپت اصلی
 * مدیریت حالت‌های مختلف، تعاملات کاربر و اتصال به API
 */

class FinancialApp {
    constructor() {
        this.currentMode = 'market'; // 'market' or 'tools'
        this.currentSection = 'crypto-section';
        this.marketData = {};
        this.userPreferences = {};
        this.chatHistories = {};
        
        this.init();
    }

    /**
     * مقداردهی اولیه برنامه
     */
    init() {
        this.loadUserPreferences();
        this.setupEventListeners();
        this.loadMarketData();
        this.setupServiceWorker();
        this.initializeChats();
        
        console.log('💰 سامانه مالی هوشمند راه‌اندازی شد');
    }

    /**
     * بارگذاری تنظیمات کاربر از localStorage
     */
    loadUserPreferences() {
        const savedTheme = localStorage.getItem('financialApp_theme') || 'light';
        const savedMode = localStorage.getItem('financialApp_mode') || 'market';
        
        this.userPreferences = {
            theme: savedTheme,
            mode: savedMode,
            fontSize: localStorage.getItem('financialApp_fontSize') || 'normal'
        };

        this.applyUserPreferences();
    }

    /**
     * اعمال تنظیمات کاربر روی صفحه
     */
    applyUserPreferences() {
        // اعمال تم
        document.body.setAttribute('data-theme', this.userPreferences.theme);
        
        // اعمال حالت اولیه
        if (this.userPreferences.mode === 'tools') {
            this.switchToToolsMode();
        } else {
            this.switchToMarketMode();
        }

        // اعمال سایز فونت
        document.documentElement.style.fontSize = this.getFontSizeValue(this.userPreferences.fontSize);
    }

    /**
     * تنظیم شنونده‌های رویداد
     */
    setupEventListeners() {
        this.setupThemeToggle();
        this.setupModeToggle();
        this.setupHighlightInteractions();
        this.setupDataCardInteractions();
        this.setupChatSystems();
        this.setupLoginSystem();
        this.setupSliderControls();
        this.setupResponsiveHandlers();
    }

    /**
     * مدیریت تغییر تم
     */
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        
        themeToggle.addEventListener('click', (e) => {
            if (e.target.classList.contains('theme-btn')) {
                const theme = e.target.getAttribute('data-theme');
                this.switchTheme(theme);
            }
        });

        // پشتیبانی از تغییر تم سیستم
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            if (!localStorage.getItem('financialApp_theme')) {
                this.switchTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    /**
     * تغییر تم
     */
    switchTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        this.userPreferences.theme = theme;
        localStorage.setItem('financialApp_theme', theme);
        
        this.showNotification(`تم ${theme === 'dark' ? 'تاریک' : 'روشن'} فعال شد`, 'success');
    }

    /**
     * مدیریت تغییر حالت بین بازار و ابزار
     */
    setupModeToggle() {
        const modeToggleBtn = document.getElementById('modeToggleBtn');
        const logoBtn = document.getElementById('logoBtn');

        modeToggleBtn.addEventListener('click', () => this.toggleMode());
        logoBtn.addEventListener('click', () => this.handleLogoClick());
    }

    /**
     * تغییر حالت بین بازار و ابزار
     */
    toggleMode() {
        if (this.currentMode === 'market') {
            this.switchToToolsMode();
        } else {
            this.switchToMarketMode();
        }
    }

    /**
     * تغییر به حالت ابزار
     */
    switchToToolsMode() {
        this.currentMode = 'tools';
        document.getElementById('modeToggleBtn').textContent = 'خانه';
        
        // نمایش هایلایت‌های ابزار
        document.getElementById('marketHighlights').classList.add('hidden');
        document.getElementById('toolHighlights').classList.remove('hidden');
        
        // فعال‌سازی اولین ابزار
        this.switchSection('gold-tool-section');
        
        this.userPreferences.mode = 'tools';
        localStorage.setItem('financialApp_mode', 'tools');
        
        this.showNotification('حالت ابزارهای محاسباتی فعال شد', 'info');
    }

    /**
     * تغییر به حالت بازار
     */
    switchToMarketMode() {
        this.currentMode = 'market';
        document.getElementById('modeToggleBtn').textContent = 'ابزارها';
        
        // نمایش هایلایت‌های بازار
        document.getElementById('toolHighlights').classList.add('hidden');
        document.getElementById('marketHighlights').classList.remove('hidden');
        
        // فعال‌سازی اولین بخش بازار
        this.switchSection('crypto-section');
        
        this.userPreferences.mode = 'market';
        localStorage.setItem('financialApp_mode', 'market');
        
        this.showNotification('حالت تحلیل بازار فعال شد', 'info');
    }

    /**
     * مدیریت کلیک روی لوگو
     */
    handleLogoClick() {
        if (this.currentMode === 'tools') {
            this.switchToMarketMode();
        } else {
            this.switchSection('crypto-section');
        }
    }

    /**
     * مدیریت تعاملات هایلایت‌ها
     */
    setupHighlightInteractions() {
        const highlights = document.querySelectorAll('.highlight-item');
        
        highlights.forEach(highlight => {
            highlight.addEventListener('click', (e) => {
                const sectionId = highlight.getAttribute('data-section');
                this.handleHighlightClick(highlight, sectionId);
            });

            // افکت hover پیشرفته
            highlight.addEventListener('mouseenter', (e) => {
                this.createRippleEffect(e);
            });
        });
    }

    /**
     * مدیریت کلیک روی هایلایت
     */
    handleHighlightClick(highlight, sectionId) {
        // حذف حالت فعال از همه هایلایت‌های مرتبط
        const relatedHighlights = this.currentMode === 'market' ? 
            document.querySelectorAll('.highlight-item.market') : 
            document.querySelectorAll('.highlight-item.tool');
        
        relatedHighlights.forEach(h => h.classList.remove('active'));
        
        // فعال کردن هایلایت انتخاب شده
        highlight.classList.add('active');
        
        // تغییر بخش
        this.switchSection(sectionId);
        
        // ثبت تحلیل کاربر
        this.trackUserBehavior('highlight_click', {
            mode: this.currentMode,
            section: sectionId
        });
    }

    /**
     * تغییر بخش فعال
     */
    switchSection(sectionId) {
        // مخفی کردن همه بخش‌ها
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // نمایش بخش انتخاب شده
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionId;
            
            // بارگذاری داده‌های مربوطه
            this.loadSectionData(sectionId);
        }
    }

    /**
     * بارگذاری داده‌های بخش
     */
    async loadSectionData(sectionId) {
        try {
            // نمایش حالت بارگذاری
            this.showLoadingState(sectionId, true);
            
            let data;
            
            if (sectionId.includes('-tool-')) {
                // بارگذاری داده‌های ابزار
                data = await this.loadToolData(sectionId);
            } else {
                // بارگذاری داده‌های بازار
                data = await this.loadMarketSectionData(sectionId);
            }
            
            // به‌روزرسانی رابط کاربری
            this.updateSectionUI(sectionId, data);
            
        } catch (error) {
            console.error('خطا در بارگذاری داده‌ها:', error);
            this.showError(sectionId, 'خطا در بارگذاری داده‌ها');
        } finally {
            this.showLoadingState(sectionId, false);
        }
    }

    /**
     * مدیریت تعاملات کارت‌های داده
     */
    setupDataCardInteractions() {
        const dataCards = document.querySelectorAll('.data-card, .window-card');
        
        dataCards.forEach(card => {
            let hoverTimeout;
            
            // هاور برای اطلاعات تکمیلی
            card.addEventListener('mouseenter', (e) => {
                hoverTimeout = setTimeout(() => {
                    this.showCardTooltip(card, e);
                }, 800);
            });
            
            card.addEventListener('mouseleave', () => {
                clearTimeout(hoverTimeout);
                this.hideCardTooltip();
            });
            
            // کلیک برای اطلاعات کامل
            card.addEventListener('click', (e) => {
                this.showCardDetailPopup(card);
            });
            
            // لمس برای موبایل
            card.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.showCardDetailPopup(card);
            }, { passive: false });
        });
    }

    /**
     * نمایش تولتیپ کارت
     */
    showCardTooltip(card, event) {
        // پیاده‌سازی تولتیپ پیشرفته
        const tooltip = this.createTooltip(card, event);
        document.body.appendChild(tooltip);
    }

    /**
     * ایجاد تولتیپ
     */
    createTooltip(card, event) {
        const tooltip = document.createElement('div');
        tooltip.className = 'advanced-tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-content">
                <h4>اطلاعات تکمیلی</h4>
                <p>برای مشاهده جزئیات کامل کلیک کنید</p>
            </div>
        `;
        
        const rect = card.getBoundingClientRect();
        tooltip.style.position = 'fixed';
        tooltip.style.top = `${rect.top - 10}px`;
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.transform = 'translateX(-50%) translateY(-100%)';
        
        return tooltip;
    }

    /**
     * نمایش پاپ‌آپ جزئیات کارت
     */
    showCardDetailPopup(card) {
        const assetName = card.querySelector('.card-title')?.textContent || 'دارایی';
        const price = card.querySelector('.card-price')?.textContent || '---';
        const change = card.querySelector('.card-change')?.textContent || '---';
        
        const popupContent = `
            <div class="popup-detail">
                <div class="detail-header">
                    <h3>${assetName}</h3>
                    <div class="price-display">${price}</div>
                    <div class="change-display ${change.includes('+') ? 'positive' : 'negative'}">${change}</div>
                </div>
                
                <div class="detail-content">
                    <div class="chart-placeholder">
                        <p>📊 نمودار قیمت - به زودی</p>
                        <small>این بخش با اتصال به API کامل خواهد شد</small>
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
                
                <div class="detail-actions">
                    <button class="btn-secondary" onclick="app.addToWatchlist('${assetName}')">
                        💾 افزودن به دیده‌بان
                    </button>
                    <button class="btn-primary" onclick="app.shareAsset('${assetName}')">
                        🔗 اشتراک‌گذاری
                    </button>
                </div>
            </div>
        `;
        
        this.showPopup('جزئیات دارایی', popupContent);
    }

    /**
     * مدیریت سیستم چت
     */
    setupChatSystems() {
        this.initializeAllChats();
        this.setupChatInputs();
    }

    /**
     * مقداردهی اولیه همه چت‌ها
     */
    initializeAllChats() {
        const chatSections = [
            'crypto', 'currency', 'gold', 'oil',
            'gold-tool', 'diamond-tool', 'silver-tool', 
            'pearl-tool', 'gem-tool', 'currency-tool'
        ];
        
        chatSections.forEach(section => {
            this.chatHistories[section] = JSON.parse(
                localStorage.getItem(`chat_${section}`) || '[]'
            );
            
            // بارگذاری تاریخچه چت
            this.loadChatHistory(section);
        });
    }

    /**
     * تنظیم ورودی‌های چت
     */
    setupChatInputs() {
        document.querySelectorAll('.chat-input-container').forEach(container => {
            const input = container.querySelector('.chat-input');
            const sendBtn = container.querySelector('.chat-send');
            const chatContainer = container.previousElementSibling;
            
            const section = this.getChatSectionFromContainer(container);
            
            sendBtn.addEventListener('click', () => {
                this.handleChatSend(section, input, chatContainer);
            });
            
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.handleChatSend(section, input, chatContainer);
                }
            });
        });
    }

    /**
     * مدیریت ارسال پیام چت
     */
    async handleChatSend(section, input, chatContainer) {
        const message = input.value.trim();
        if (!message) return;
        
        // افزودن پیام کاربر
        this.addChatMessage(section, 'user', message, chatContainer);
        input.value = '';
        
        // شبیه‌سازی پاسخ هوش مصنوعی
        setTimeout(async () => {
            const response = await this.generateAIResponse(section, message);
            this.addChatMessage(section, 'ai', response, chatContainer);
        }, 1000 + Math.random() * 2000);
    }

    /**
     * تولید پاسخ هوش مصنوعی
     */
    async generateAIResponse(section, userMessage) {
        // در نسخه واقعی به API هوش مصنوعی متصل می‌شود
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
            'default': [
                "سوال خوبی پرسیدید! برای پاسخ دقیق‌تر به داده‌های بیشتری نیاز دارم.",
                "این موضوع نیاز به تحلیل تخصصی دارد.",
                "لطفاً سوال خود را با جزئیات بیشتری مطرح کنید."
            ]
        };
        
        const sectionKey = section.includes('-tool') ? 'tools' : section.split('-')[0];
        const availableResponses = responses[sectionKey] || responses.default;
        
        return availableResponses[Math.floor(Math.random() * availableResponses.length)];
    }

    /**
     * افزودن پیام به چت
     */
    addChatMessage(section, sender, message, container) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;
        messageDiv.innerHTML = `<strong>${sender === 'ai' ? 'هوش مصنوعی' : 'شما'}:</strong> ${message}`;
        
        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;
        
        // ذخیره در تاریخچه
        this.chatHistories[section].push({ sender, message, timestamp: new Date().toISOString() });
        localStorage.setItem(`chat_${section}`, JSON.stringify(this.chatHistories[section]));
    }

    /**
     * مدیریت سیستم ورود
     */
    setupLoginSystem() {
        const loginBtn = document.getElementById('loginBtn');
        const loginPopup = document.getElementById('loginPopup');
        const loginClose = document.getElementById('loginClose');
        const loginForm = document.querySelector('.login-form');
        
        loginBtn.addEventListener('click', () => this.showLoginPopup());
        loginClose.addEventListener('click', () => this.hideLoginPopup());
        
        loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        
        // بستن پاپ‌آپ با کلیک خارج
        loginPopup.addEventListener('click', (e) => {
            if (e.target === loginPopup) this.hideLoginPopup();
        });
    }

    /**
     * نمایش پاپ‌آپ ورود
     */
    showLoginPopup() {
        document.getElementById('loginPopup').style.display = 'flex';
    }

    /**
     * مدیریت فرم ورود
     */
    async handleLogin(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const username = formData.get('username');
        const password = formData.get('password');
        
        try {
            // شبیه‌سازی احراز هویت
            await this.authenticateUser(username, password);
            this.showNotification('ورود موفقیت‌آمیز بود!', 'success');
            this.hideLoginPopup();
            
        } catch (error) {
            this.showNotification('خطا در ورود. لطفاً مجدداً تلاش کنید.', 'error');
        }
    }

    /**
     * مدیریت اسلایدرها
     */
    setupSliderControls() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const windowsTrack = document.getElementById('windowsTrack');
        
        if (prevBtn && nextBtn && windowsTrack) {
            let currentPosition = 0;
            
            nextBtn.addEventListener('click', () => {
                const cardWidth = document.querySelector('.window-card').offsetWidth + 16;
                currentPosition = Math.max(currentPosition - cardWidth, 
                    -(windowsTrack.scrollWidth - windowsTrack.parentElement.offsetWidth));
                windowsTrack.style.transform = `translateX(${currentPosition}px)`;
            });
            
            prevBtn.addEventListener('click', () => {
                const cardWidth = document.querySelector('.window-card').offsetWidth + 16;
                currentPosition = Math.min(currentPosition + cardWidth, 0);
                windowsTrack.style.transform = `translateX(${currentPosition}px)`;
            });
        }
    }

    /**
     * مدیریت ریسپانسیو
     */
    setupResponsiveHandlers() {
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));
        
        // تشخیص دستگاه تچ
        this.setupTouchHandlers();
    }

    /**
     * بارگذاری داده‌های بازار
     */
    async loadMarketData() {
        try {
            // شبیه‌سازی بارگذاری داده‌های واقعی
            this.marketData = {
                crypto: await this.fetchCryptoData(),
                currency: await this.fetchCurrencyData(),
                gold: await this.fetchGoldData(),
                oil: await this.fetchOilData()
            };
            
            this.updateAllMarketDisplays();
            
        } catch (error) {
            console.error('خطا در بارگذاری داده‌های بازار:', error);
        }
    }

    /**
     * شبیه‌سازی داده‌های رمزارز
     */
    async fetchCryptoData() {
        return {
            bitcoin: { price: 45280, change: 2.45 },
            ethereum: { price: 2450, change: 3.21 },
            tether: { price: 1.00, change: 0.01 }
        };
    }

    /**
     * شبیه‌سازی داده‌های ارز
     */
    async fetchCurrencyData() {
        return {
            usd: { price: 58420, change: -0.85 },
            eur: { price: 62180, change: 0.92 },
            aed: { price: 15900, change: -0.45 }
        };
    }

    /**
     * utility functions
     */
    
    /**
     * نمایش نوتیفیکیشن
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // خودکار پاک شود
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    /**
     * نمایش پاپ‌آپ
     */
    showPopup(title, content) {
        const popup = document.createElement('div');
        popup.className = 'popup-overlay';
        popup.innerHTML = `
            <div class="popup-content">
                <div class="popup-header">
                    <h3 class="popup-title">${title}</h3>
                    <button class="popup-close" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
                </div>
                <div class="popup-body">
                    ${content}
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // بستن با ESC
        const closeHandler = (e) => {
            if (e.key === 'Escape') {
                popup.remove();
                document.removeEventListener('keydown', closeHandler);
            }
        };
        document.addEventListener('keydown', closeHandler);
    }

    /**
     * ایجاد افکت ریپل
     */
    createRippleEffect(event) {
        const button = event.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
        circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
        circle.classList.add('ripple');
        
        const ripple = button.getElementsByClassName('ripple')[0];
        if (ripple) {
            ripple.remove();
        }
        
        button.appendChild(circle);
    }

    /**
     * تابع کمکی debounce
     */
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

    /**
     * فرمت اعداد
     */
    formatNumber(num) {
        return new Intl.NumberFormat('fa-IR').format(num);
    }

    /**
     * تولید قیمت تصادفی
     */
    generateRandomPrice(basePrice, higher = true) {
        const base = parseFloat(basePrice.replace(/[^\d.]/g, ''));
        const variation = higher ? 
            base * (1 + Math.random() * 0.1) : 
            base * (1 - Math.random() * 0.1);
        
        return this.formatNumber(Math.round(variation));
    }

    /**
     * راه‌اندازی Service Worker
     */
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker ثبت شد:', registration);
                })
                .catch(error => {
                    console.log('خطا در ثبت Service Worker:', error);
                });
        }
    }

    /**
     * ردیابی رفتار کاربر
     */
    trackUserBehavior(action, data) {
        // در نسخه واقعی به analytics متصل می‌شود
        console.log('User Behavior:', { action, data, timestamp: new Date().toISOString() });
    }

    /**
     * دریافت سایز فونت
     */
    getFontSizeValue(size) {
        const sizes = {
            'small': '14px',
            'normal': '16px',
            'large': '18px',
            'x-large': '20px'
        };
        return sizes[size] || sizes.normal;
    }

    /**
     * دریافت آیکون نوتیفیکیشن
     */
    getNotificationIcon(type) {
        const icons = {
            'success': '✅',
            'error': '❌',
            'warning': '⚠️',
            'info': 'ℹ️'
        };
        return icons[type] || icons.info;
    }

    /**
     * دریافت بخش چت از container
     */
    getChatSectionFromContainer(container) {
        const chatSection = container.closest('.ai-chat');
        return chatSection ? chatSection.id.replace('ChatContainer', '') : 'general';
    }
}

// راه‌اندازی برنامه وقتی DOM آماده است
document.addEventListener('DOMContentLoaded', () => {
    window.app = new FinancialApp();
});

// مدیریت خطاهای全局
window.addEventListener('error', (event) => {
    console.error('خطای全局:', event.error);
});

// مدیریت rejection promise
window.addEventListener('unhandledrejection', (event) => {
    console.error('Promise rejection:', event.reason);
});
