// ==================== //
// 🔄 مدیریت نمایش صفحات
// ==================== //
// ==================== //
// 🔄 مدیریت نمایش صفحات
// ==================== //

/**
 * 📱 نمایش صفحه مشخص + مدیریت منو
 */
function showView(view) {
    // جلوگیری از فراخوانی همزمان - فقط اگر در حال تغییر است
    if (isChangingView && currentActiveView !== view) {
        const log = window.logger || { debug: console.log };
        log.debug('در حال تغییر صفحه...');
        return;
    }
    
    // اگر view تغییر نکرده و صفحه در حال نمایش است
    if (currentActiveView === view && document.querySelector(`.view.active-view`)) {
        // اما اگر کارت‌ها وجود ندارند، باید تولید شوند
        if (view === 'home') {
            setTimeout(() => {
                const container = document.getElementById('homeMainCards');
                if (container && container.children.length === 0) {
                    generateHomeCards();
                }
            }, 100);
        }
        return;
    }
    
    isChangingView = true;
    currentActiveView = view;
    
    // مخفی کردن همه صفحات
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active-view'));

    // نمایش صفحه انتخاب شده
    const viewElements = {
        'home': elements.homeView,
        'tools': elements.toolsView || document.getElementById('toolsView'),
        'news': document.getElementById('newsView'),
        'globe': document.getElementById('globeView'), // 🌍 کره‌ها
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
        const log = window.logger || { debug: console.log };
        log.debug(`صفحه ${view} پیدا شد`);
        // مخفی کردن همه صفحات با transition
        document.querySelectorAll('.view').forEach(v => {
            if (v !== viewElements[view]) {
                v.classList.remove('active-view');
            }
        });
        
        // نمایش صفحه جدید با transition
        viewElements[view].classList.add('active-view');
        appState.currentView = view;
        
        // تنظیم موقعیت هایلایت‌ها بعد از تغییر صفحه - یکسان کردن فاصله
        setTimeout(() => {
            if (typeof updateHighlightsPosition === 'function') {
                updateHighlightsPosition();
            }
        }, 150);

        // ریست اسکرول به بالای صفحه - با smooth scroll
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // اگر صفحه کره‌ها است، اطمینان از نمایش هایلایت اول (resources)
        if (view === 'globe') {
            setTimeout(() => {
                // اطمینان از فعال بودن هایلایت resources
                const resourcesCircle = document.querySelector('.highlight-circle[data-globe="resources"]');
                const resourcesPanel = document.querySelector('.globe-panel[data-globe-panel="resources"]');
                if (resourcesCircle && !resourcesCircle.classList.contains('active')) {
                    resourcesCircle.classList.add('active');
                }
                if (resourcesPanel && !resourcesPanel.classList.contains('active')) {
                    resourcesPanel.classList.add('active');
                }
                // راه‌اندازی نقشه‌های 2D
                if (typeof setupGlobe2DMaps === 'function') {
                    setupGlobe2DMaps();
                }
            }, 100);
        }

        // آپدیت هایلایت فعال بر اساس view - با transition نرم
        // ابتدا اضافه کردن، سپس حذف کردن برای transition نرم
        requestAnimationFrame(() => {
            const allCircles = document.querySelectorAll('.highlight-circle[data-category]');
            let targetCircle = null;
            
            if (view === 'home') {
                // اگر در صفحه home هستیم، هایلایت "خانه" را active کن
                allCircles.forEach(c => {
                    if (c.getAttribute('data-category') === 'home') {
                        targetCircle = c;
                    }
                });
            } else if (['crypto', 'currency', 'gold', 'forex', 'stock', 'oil'].includes(view)) {
                // برای صفحات دیگر، هایلایت مربوطه را active کن
                allCircles.forEach(c => {
                    if (c.getAttribute('data-category') === view) {
                        targetCircle = c;
                    }
                });
            }
            
            // ابتدا کلاس active را به target اضافه کن
            if (targetCircle) {
                targetCircle.classList.add('active');
            }
            
            // سپس از بقیه حذف کن - با تاخیر کوتاه برای transition نرم
            requestAnimationFrame(() => {
                allCircles.forEach(c => {
                    if (c && c !== targetCircle) {
                        c.classList.remove('active');
                    }
                });
            });
        });

        // انتقال هایلایت‌های اصلی فقط به صفحات اصلی - با insertBefore برای قرارگیری در ابتدا
        // صفحاتی که هایلایت‌های مخصوص خودشان را دارند نباید هایلایت‌های اصلی را بگیرند
        if (!['tools', 'news', 'tutorial', 'relax', 'globe'].includes(view)) {
            const mainHighlights = document.querySelector('.highlights-section:not(.tools-highlights):not(.news-highlights):not(.education-highlights):not(.relax-highlights):not(.globe-highlights)');
            if (mainHighlights && viewElements[view] && !viewElements[view].contains(mainHighlights)) {
                // استفاده از insertBefore برای قرارگیری هایلایت‌ها در ابتدای view
                // اضافه کردن transition برای جلوگیری از پرش
                mainHighlights.style.transition = 'opacity 0.2s ease';
                
                requestAnimationFrame(() => {
                    // قرار دادن هایلایت‌ها در ابتدای view (قبل از اولین child)
                    const firstChild = viewElements[view].firstChild;
                    if (firstChild) {
                        viewElements[view].insertBefore(mainHighlights, firstChild);
                    } else {
                        viewElements[view].appendChild(mainHighlights);
                    }
                });
            }
            // اگر هایلایت‌ها قبلاً در view هستند، مطمئن شو که در ابتدا هستند
            else if (mainHighlights && viewElements[view] && viewElements[view].contains(mainHighlights)) {
                const firstChild = viewElements[view].firstChild;
                if (firstChild && firstChild !== mainHighlights) {
                    // اگر هایلایت‌ها در ابتدا نیستند، آنها را به ابتدا منتقل کن
                    requestAnimationFrame(() => {
                        viewElements[view].insertBefore(mainHighlights, firstChild);
                    });
                }
            }
        } else {
            // برای صفحاتی که هایلایت‌های مخصوص خودشان را دارند، مطمئن شو که هایلایت‌های اصلی منتقل نشوند
            const mainHighlights = document.querySelector('.highlights-section:not(.tools-highlights):not(.news-highlights):not(.education-highlights):not(.relax-highlights):not(.globe-highlights)');
            if (mainHighlights && viewElements[view] && viewElements[view].contains(mainHighlights)) {
                // اگر هایلایت‌های اصلی در این صفحه هستند، آنها را به صفحه home برگردان
                const homeView = document.getElementById('homeView');
                if (homeView && !homeView.contains(mainHighlights)) {
                    requestAnimationFrame(() => {
                        const firstChild = homeView.firstChild;
                        if (firstChild) {
                            homeView.insertBefore(mainHighlights, firstChild);
                        } else {
                            homeView.appendChild(mainHighlights);
                        }
                    });
                }
            }
        }

        // تنظیم ایونت‌لیستنر برای کارت‌های این صفحه - با تاخیر برای transition
        setTimeout(() => {
            setupAllCardListeners();
            
            // اگر home بود کارت‌ها رو آپدیت کن - فقط اگر کارت‌ها وجود ندارند
            if (view === 'home') {
                const container = document.getElementById('homeMainCards');
                if (container) {
                    if (container.children.length === 0) {
                        generateHomeCards();
                    } else {
                        // اگر کارت‌ها وجود دارند اما مخفی هستند، نمایش بده
                        if (container.style.opacity === '0' || container.style.opacity === '') {
                            container.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                            container.style.opacity = '1';
                            container.style.transform = 'translateY(0)';
                        }
                    }
                }
            }
            
            // آزاد کردن flag بعد از اتمام transition
            setTimeout(() => {
                isChangingView = false;
            }, 350);
        }, 150);
    } else {
        // اگر view پیدا نشد، flag را آزاد کن
        const log = window.logger || { warn: console.warn }; log.warn(`⚠️ صفحه ${view} پیدا نشد!`, viewElements);
        isChangingView = false;
    }

    const log = window.logger || { info: console.log }; log.info(`📱 صفحه تغییر کرد به: ${view}`);
    
    // راه‌اندازی نقشه‌های 2D اگر صفحه کره‌ها فعال شد
    if (view === 'globe' && typeof setupGlobe2DMaps === 'function') {
        setTimeout(() => {
            setupGlobe2DMaps();
        }, 500);
    }
    
    // 📱 آپدیت نوار ناوبری پایین - قبل از تغییرات DOM
    if (typeof updateBottomNavigation === 'function') {
        updateBottomNavigation(view);
    }
    
    // 🎯 اطمینان از نمایش بخش‌های مشترک در تمام صفحات - با تاخیر برای جلوگیری از تداخل با event handling
    setTimeout(() => {
        const commonSections = [
            '.global-section',
            '.analysis-section-compact',
            '.ai-chat-section',
            '.main-footer'
        ];
        
        // نقشه 2D حالا داخل homeView است و به صورت خودکار فقط در صفحه خانه نمایش داده می‌شود
        // نیازی به مدیریت دستی نیست چون داخل view قرار دارد
        
        commonSections.forEach(selector => {
            const sections = document.querySelectorAll(selector);
            sections.forEach(section => {
                if (section) {
                    // فقط اگر مخفی است، نمایش بده - برای جلوگیری از تداخل با event handling
                    if (section.style.display === 'none' || 
                        section.style.visibility === 'hidden' || 
                        section.style.opacity === '0') {
                        section.style.display = 'block';
                        section.style.visibility = 'visible';
                        section.style.opacity = '1';
                    }
                }
            });
        });
    }, 100);
}

/**
 * 📱 تنظیم نوار ناوبری پایین
 */
function setupBottomNavigation() {
    const log = window.logger || { warn: console.warn, info: console.log };
    const bottomNavBar = document.getElementById('bottomNavBar');
    if (!bottomNavBar) {
        log.warn('نوار ناوبری پایین پیدا نشد');
        return;
    }
    
    // جلوگیری از اضافه کردن event listener های تکراری
    if (bottomNavBar.hasAttribute('data-navigation-setup')) {
        log.debug('نوار ناوبری پایین قبلاً راه‌اندازی شده است');
        return;
    }
    bottomNavBar.setAttribute('data-navigation-setup', 'true');
    
    // متغیر برای track کردن nav-item که touch شده
    let touchedNavItem = null;
    let touchStartTime = 0;
    
    // تابع برای پیدا کردن nav-item از target
    const findNavItem = (target) => {
        if (!target) return null;
        
        // ابتدا سعی کن nav-item را پیدا کنی
        let navItem = target.closest('.nav-item');
        if (navItem) return navItem;
        
        // اگر پیدا نشد، ببین آیا روی icon یا text کلیک شده
        const icon = target.closest('.nav-icon');
        const text = target.closest('.nav-text');
        if (icon || text) {
            navItem = (icon || text).closest('.nav-item');
            if (navItem) return navItem;
        }
        
        return null;
    };
    
    // تابع برای navigate کردن به صفحه
    const navigateToPage = (page) => {
        if (!page) return;
        
        log.debug(`رفتن به صفحه: ${page}`);
        
        // بررسی وجود view قبل از فراخوانی
        const viewElements = {
            'home': elements.homeView || document.getElementById('homeView'),
            'tools': elements.toolsView || document.getElementById('toolsView'),
            'news': document.getElementById('newsView'),
            'globe': document.getElementById('globeView'),
            'tutorial': document.getElementById('tutorialView'),
            'relax': document.getElementById('relaxView')
        };
        
        const targetView = viewElements[page];
        if (targetView && typeof showView === 'function') {
            log.debug(`نمایش صفحه: ${page}`);
            showView(page);
        } else {
            log.warn(`صفحه ${page} پیدا نشد`);
        }
    };
    
    // Event listener برای کلیک (دسکتاپ)
    bottomNavBar.addEventListener('click', (e) => {
        // بررسی اینکه آیا کلیک روی دکمه سیار بوده یا نه
        if (e.target.closest('.assistive-touch') || e.target.closest('.touch-button')) {
            return;
        }
        
        // بررسی اینکه آیا در حال drag دکمه سیار هستیم یا نه
        const assistiveTouch = document.getElementById('assistiveTouch');
        if (assistiveTouch && assistiveTouch.classList.contains('dragging')) {
            return;
        }
        
        const navItem = findNavItem(e.target);
        if (!navItem) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const page = navItem.getAttribute('data-page');
        navigateToPage(page);
    });
    
    // Event listener برای touchstart (موبایل/تبلت) - فقط برای track کردن
    bottomNavBar.addEventListener('touchstart', (e) => {
        const touch = e.touches && e.touches[0];
        if (!touch) return;
        
        // بررسی اینکه آیا touch روی دکمه سیار بوده یا نه - باید قبل از هر چیز دیگری چک کنیم
        const elementAtPoint = document.elementFromPoint(touch.clientX, touch.clientY);
        if (elementAtPoint && (elementAtPoint.closest('.assistive-touch') || elementAtPoint.closest('.touch-button'))) {
            touchedNavItem = null;
            return; // اگر روی دکمه سیار بود، هیچ کاری نکن
        }
        
        // بررسی اینکه آیا در حال drag دکمه سیار هستیم یا نه
        const assistiveTouch = document.getElementById('assistiveTouch');
        if (assistiveTouch && assistiveTouch.classList.contains('dragging')) {
            touchedNavItem = null;
            return;
        }
        
        const navItem = findNavItem(e.target) || (elementAtPoint ? findNavItem(elementAtPoint) : null);
        if (navItem) {
            touchedNavItem = navItem;
            touchStartTime = Date.now();
            log.debug(`touchstart روی: ${navItem.getAttribute('data-page')}`);
        } else {
            touchedNavItem = null;
        }
    }, { passive: true });
    
    // Event listener برای touchend (موبایل/تبلت) - برای اجرای action
    bottomNavBar.addEventListener('touchend', (e) => {
        log.debug('touchend روی نوار پایین');
        
        // استفاده از changedTouches برای گرفتن touch در touchend
        const touch = e.changedTouches && e.changedTouches[0];
        
        // بررسی اینکه آیا touch روی دکمه سیار بوده یا نه - باید قبل از هر چیز دیگری چک کنیم
        if (touch) {
            const elementAtPoint = document.elementFromPoint(touch.clientX, touch.clientY);
            if (elementAtPoint && (elementAtPoint.closest('.assistive-touch') || elementAtPoint.closest('.touch-button'))) {
                log.debug('touch روی دکمه سیار - نادیده گرفته شد');
                touchedNavItem = null;
                return; // اگر روی دکمه سیار بود، هیچ کاری نکن
            }
        }
        
        // بررسی اینکه آیا در حال drag دکمه سیار هستیم یا نه
        const assistiveTouch = document.getElementById('assistiveTouch');
        if (assistiveTouch && assistiveTouch.classList.contains('dragging')) {
            log.debug('در حال drag دکمه سیار - نادیده گرفته شد');
                touchedNavItem = null;
                return;
            }
            
        if (touch) {
            // اگر touchedNavItem null است، سعی کن از elementAtPoint پیدا کنی
            if (!touchedNavItem) {
                const elementAtPoint = document.elementFromPoint(touch.clientX, touch.clientY);
                if (elementAtPoint) {
                const navItem = findNavItem(elementAtPoint);
                if (navItem) {
                    touchedNavItem = navItem;
                    touchStartTime = Date.now();
                    }
                }
            }
        }
        
        // بررسی اینکه آیا touch خیلی طولانی بوده (scroll) یا نه
        const touchDuration = Date.now() - touchStartTime;
        if (touchDuration > 300) {
            log.debug('touch خیلی طولانی بود - احتمالاً scroll');
            touchedNavItem = null;
            return;
        }
        
        if (!touchedNavItem) {
            log.debug('touchedNavItem null است - تلاش برای پیدا کردن از target');
            // آخرین تلاش: از target پیدا کن
            const navItem = findNavItem(e.target);
            if (navItem) {
                const page = navItem.getAttribute('data-page');
                log.debug(`پیدا شد از target: ${page}`);
                e.preventDefault();
                e.stopPropagation();
                navigateToPage(page);
            }
            return;
        }
        
        const navItem = touchedNavItem;
        const page = navItem.getAttribute('data-page');
        touchedNavItem = null;
        
        log.debug(`اجرای navigate به صفحه: ${page}`);
        
        e.preventDefault();
        e.stopPropagation();
        
        navigateToPage(page);
    }, { passive: false });
    
    // آپدیت اولیه active state
    if (typeof updateBottomNavigation === 'function') {
        updateBottomNavigation(appState.currentView || 'home');
    }
    
    log.success('نوار ناوبری پایین راه‌اندازی شد');
}

/**
 * 📱 آپدیت active state نوار ناوبری پایین
 */
function updateBottomNavigation(currentView) {
    const bottomNavBar = document.getElementById('bottomNavBar');
    if (!bottomNavBar) return;
    
    // حذف active از همه
    bottomNavBar.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // اضافه کردن active به دکمه مربوطه
    const activeItem = bottomNavBar.querySelector(`.nav-item[data-page="${currentView}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }
}


