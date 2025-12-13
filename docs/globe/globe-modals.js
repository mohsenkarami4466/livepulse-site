/**
 * ============================================
 * 🪟 Globe Modals - Modal Management Functions
 * ============================================
 * 
 * این فایل شامل تمام توابع مربوط به مدیریت مودال‌های کره است.
 * This file contains all functions related to globe modal management.
 * 
 * وابستگی‌ها / Dependencies:
 * - globe-helpers.js (addEventListenerOnce)
 * - globe-markets.js (populateMarketList, setupMarketSelector)
 * - window.buildSimpleGlobe (تابع ساخت کره - در globe-simple.js)
 * - window.checkLoginRequired (چک لاگین)
 * - window.appState (state برنامه)
 * - window.showView (تابع نمایش view)
 * - window.simpleGlobeScenes (scene های کره‌ها)
 * - window.logger (optional)
 * - window.errorHandler (optional)
 * 
 * استفاده / Usage:
 * این فایل باید بعد از globe-helpers.js, globe-clock.js, globe-markets.js لود شود.
 * This file should be loaded after globe-helpers.js, globe-clock.js, globe-markets.js.
 * 
 * توابع اصلی / Main Functions:
 * - openFinancialGlobe: باز کردن کره مالی
 * - openResourcesGlobe: باز کردن کره منابع
 * - open3DGlobe: باز کردن کره‌های 3D (آب و هوا، نظامی، دانشگاه، تاریخی، زلزله، منابع طبیعی)
 * - closeGlobeModal: بستن مودال کره
 * - resetGlobeView: ریست کردن دید کره به حالت اولیه
 * 
 * متغیرهای Global / Global Variables:
 * - globeOpening: جلوگیری از باز شدن همزمان کره‌های اصلی
 * - globe3DOpening: جلوگیری از باز شدن همزمان کره‌های 3D
 * 
 * Export ها / Exports:
 * تمام توابع به window export می‌شوند برای استفاده در سایر فایل‌ها.
 * All functions are exported to window for use in other files.
 * 
 * ============================================
 */

/**
 * 🔒 Flag برای جلوگیری از باز شدن همزمان کره‌های اصلی
 * Flag to prevent simultaneous opening of main globes
 */
let globeOpening = false;

/**
 * 🔒 Flag برای جلوگیری از باز شدن همزمان کره‌های 3D
 * Flag to prevent simultaneous opening of 3D globes
 */
let globe3DOpening = false;

/**
 * 💹 باز کردن کره مالی
 * Open financial globe
 * 
 * این تابع کره مالی را باز می‌کند و تمام تنظیمات لازم را انجام می‌دهد.
 * This function opens the financial globe and performs all necessary setup.
 * 
 * ویژگی‌ها / Features:
 * - چک لاگین قبل از باز کردن
 * - ذخیره صفحه فعلی برای بازگشت
 * - ساخت کره با buildSimpleGlobe
 * - راه‌اندازی پنل انتخاب بازار
 * - بارگذاری مرزهای کشورها
 * 
 * وابستگی‌ها / Dependencies:
 * - window.checkLoginRequired
 * - window.buildSimpleGlobe
 * - window.populateMarketList
 * - window.setupMarketSelector
 * - window.createWorldBorders
 */
function openFinancialGlobe() {
    const log = window.logger || { info: console.log, error: console.error, success: console.log, debug: console.log, warn: console.warn };
    
    // 🔐 چک لاگین / Check login
    if (typeof checkLoginRequired === 'function' && !checkLoginRequired()) {
        log.warn('کاربر لاگین نیست - کره مالی باز نشد');
        return;
    }
    
    // ذخیره صفحه فعلی قبل از باز کردن کره
    // Save current view before opening globe
    if (window.appState) {
        window.appState.previousViewBeforeGlobe = window.appState.currentView || 'home';
    }
    
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
    
    // جلوگیری از اسکرول body / Prevent body scroll
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    
    // پنهان کردن همه چیز و اضافه کردن کلاس
    // Hide everything and add class
    document.body.classList.add('globe-modal-open');
    
    // نمایش modal / Show modal
    modal.classList.add('active');
    modal.style.display = 'block';
    modal.style.visibility = 'visible';
    modal.style.opacity = '1';
    
    log.debug('Modal مالی فعال شد');
    
    // ساخت کره بلافاصله / Build globe immediately
    log.debug('شروع ساخت کره مالی...');
    
    // یک تاخیر کوتاه برای اطمینان از نمایش modal
    // Short delay to ensure modal is displayed
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            if (typeof buildSimpleGlobe === 'function') {
                buildSimpleGlobe('financialGlobeContainer', 'financial');
            }
            
            // راه‌اندازی پنل‌ها و دکمه انتخاب بازار
            // Setup panels and market selector button
            if (typeof window.populateMarketList === 'function') {
                window.populateMarketList();
            }
            if (typeof window.setupMarketSelector === 'function') {
                window.setupMarketSelector();
            }
            
            // راه‌اندازی دکمه سیار / Setup assistive touch button
            setTimeout(() => {
                const assistive = document.getElementById('financialGlobeAssistive');
                if (assistive && !window.financialGlobeAssistive) {
                    // در React environment، این توسط FloatingDock مدیریت می‌شود
                    // In React environment, this is managed by FloatingDock
                    if (typeof GlobeAssistiveTouch !== 'undefined') {
                        window.financialGlobeAssistive = new GlobeAssistiveTouch('financial');
                    }
                }
            }, 500);
            
            // بارگذاری مرزها برای کره مالی هم (async)
            // Load borders for financial globe (async)
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

/**
 * 🌍 باز کردن کره منابع
 * Open resources globe
 * 
 * این تابع کره منابع را باز می‌کند و تمام تنظیمات لازم را انجام می‌دهد.
 * This function opens the resources globe and performs all necessary setup.
 * 
 * ویژگی‌ها / Features:
 * - چک لاگین قبل از باز کردن
 * - ساخت کره با buildSimpleGlobe
 * - راه‌اندازی پنل‌های منابع
 * - بارگذاری مرزها، درگیری‌ها و برچسب‌های کشورها
 * 
 * وابستگی‌ها / Dependencies:
 * - window.checkLoginRequired
 * - window.buildSimpleGlobe
 * - window.populateCountryList
 * - window.setupResourcesGlobePanels
 * - window.setupDraggablePanels
 * - window.createWorldBorders
 * - window.createAllConflicts
 * - window.createCountryLabels
 */
function openResourcesGlobe() {
    const log = window.logger || { info: console.log, error: console.error, success: console.log, warn: console.warn, debug: console.log };
    
    // 🔐 چک لاگین / Check login
    if (typeof checkLoginRequired === 'function' && !checkLoginRequired()) {
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
    
    // جلوگیری از اسکرول body / Prevent body scroll
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    
    // پنهان کردن همه چیز و اضافه کردن کلاس
    // Hide everything and add class
    document.body.classList.add('globe-modal-open');
    
    // نمایش modal / Show modal
    modal.classList.add('active');
    modal.style.display = 'block';
    modal.style.visibility = 'visible';
    modal.style.opacity = '1';
    
    log.debug('Modal منابع فعال شد');
    
    // ساخت کره بلافاصله / Build globe immediately
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            if (typeof buildSimpleGlobe === 'function') {
                buildSimpleGlobe('resourcesGlobeContainer', 'resources');
            }
            
            // پر کردن لیست کشورها / Populate country list
            if (typeof populateCountryList === 'function') {
                populateCountryList();
            }
            
            // راه‌اندازی پنل‌ها / Setup panels
            if (typeof setupResourcesGlobePanels === 'function') {
                setupResourcesGlobePanels();
            }
            
            // راه‌اندازی drag/resize برای پنجره‌ها
            // Setup drag/resize for windows
            if (typeof setupDraggablePanels === 'function') {
                setTimeout(() => {
                    setupDraggablePanels();
                }, 500);
            }
            
            // نمایش خودکار پنجره انتخاب کشور در لحظه اول
            // Auto show country selection panel at first
            setTimeout(() => {
                const countryPanel = document.getElementById('countrySelectPanel');
                if (countryPanel) {
                    countryPanel.classList.add('active');
                }
            }, 800);
            
            // بارگذاری مرزها و درگیری‌ها و برچسب‌ها (async)
            // Load borders, conflicts and labels (async)
            setTimeout(async () => {
                try {
                    if (window.resourcesGlobeObjects && window.resourcesGlobeObjects.earth) {
                        const earth = window.resourcesGlobeObjects.earth;
                        const camera = window.resourcesGlobeObjects.camera;
                        
                        // بارگذاری مرزها - اضافه شدن به earth
                        // Load borders - add to earth
                        log.debug('بارگذاری مرزهای کشورها...');
                        if (typeof createWorldBorders === 'function') {
                            if (window.resourcesGlobeData) {
                                window.resourcesGlobeData.bordersGroup = await createWorldBorders(earth, {
                                    defaultColor: 0x4488ff,
                                    defaultOpacity: 0.4
                                });
                            }
                        }
                        
                        // ایجاد خطوط درگیری
                        // Create conflict lines
                        log.debug('ایجاد خطوط درگیری...');
                        if (typeof createAllConflicts === 'function') {
                            if (window.resourcesGlobeData) {
                                window.resourcesGlobeData.conflictsGroup = createAllConflicts(earth);
                            }
                        }
                        
                        // ایجاد برچسب‌های کشورها
                        // Create country labels
                        log.debug('ایجاد برچسب‌های کشورها...');
                        if (typeof createCountryLabels === 'function') {
                            if (window.resourcesGlobeData) {
                                window.resourcesGlobeData.labelsGroup = createCountryLabels(earth, camera);
                            }
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
            
            // راه‌اندازی دکمه سیار / Setup assistive touch button
            setTimeout(() => {
                const assistive = document.getElementById('resourcesGlobeAssistive');
                if (assistive && !window.resourcesGlobeAssistive) {
                    // در React environment، این توسط FloatingDock مدیریت می‌شود
                    // In React environment, this is managed by FloatingDock
                    if (typeof GlobeAssistiveTouch !== 'undefined') {
                        window.resourcesGlobeAssistive = new GlobeAssistiveTouch('resources');
                    }
                }
            }, 500);
        });
    });
}

/**
 * 🪟 بستن مودال کره
 * Close globe modal
 * 
 * این تابع مودال کره را می‌بندد و تمام منابع را پاکسازی می‌کند.
 * This function closes the globe modal and cleans up all resources.
 * 
 * @param {string} modalId - ID مودال برای بستن
 * 
 * ویژگی‌ها / Features:
 * - پاکسازی scene کره
 * - بازگشت به صفحه قبلی
 * - پاک کردن instance دکمه سیار
 * - ریست کردن body styles
 * 
 * وابستگی‌ها / Dependencies:
 * - window.simpleGlobeScenes
 * - window.showView
 * - window.appState
 */
function closeGlobeModal(modalId) {
    const log = window.logger || { info: console.log, warn: console.warn, debug: console.log };
    log.debug(`شروع بستن modal: ${modalId}`);
    
    const modal = document.getElementById(modalId);
    if (!modal) {
        log.warn(`Modal پیدا نشد: ${modalId}`);
        return;
    }
    
    // ریست کردن flag باز شدن کره
    // Reset globe opening flags
    globeOpening = false;
    globe3DOpening = false;
    
    // تعیین نوع کره / Determine globe type
    let type = 'resources';
    if (modalId.includes('financial')) type = 'financial';
    else if (modalId.includes('weather')) type = 'weather';
    else if (modalId.includes('military')) type = 'military';
    else if (modalId.includes('universities')) type = 'universities';
    else if (modalId.includes('historical')) type = 'historical';
    else if (modalId.includes('earthquake')) type = 'earthquake';
    else if (modalId.includes('naturalResources')) type = 'natural-resources';
    
    // ذخیره نوع کره فعال برای بازگرداندن state
    // Save active globe type for restoring state
    const activeGlobeType = type;
    
    // ذخیره صفحه فعلی قبل از باز کردن کره (اگر وجود داشته باشد)
    // Save current view before opening globe (if exists)
    const previousView = (window.appState && window.appState.currentView) || 'home';
    
    // پاک کردن instance دکمه سیار
    // Clean up assistive touch instance
    if (window[`${type}GlobeAssistive`]) {
        try {
            delete window[`${type}GlobeAssistive`];
        } catch (e) {
            log.warn('خطا در پاک کردن instance دکمه سیار:', e);
        }
    }
    
    // اول modal رو مخفی کن
    // Hide modal first
    modal.classList.remove('active');
    modal.style.display = 'none';
    modal.style.visibility = 'hidden';
    modal.style.opacity = '0';
    
    // بازگرداندن body
    // Restore body
    document.body.classList.remove('globe-modal-open');
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.height = '';
    
    // برگشت به صفحه قبلی (قبل از باز کردن کره)
    // Return to previous view (before opening globe)
    if (typeof showView === 'function') {
        // استفاده از previousViewBeforeGlobe اگر وجود داشته باشد، در غیر این صورت از previousView
        // Use previousViewBeforeGlobe if exists, otherwise use previousView
        const viewToReturn = (window.appState && window.appState.previousViewBeforeGlobe) || previousView || 'home';
        
        // فقط اگر از صفحه globe اومده بودیم، به صفحه globe برگرد و هایلایت رو فعال کن
        // Only if we came from globe page, return to globe page and activate highlight
        if (viewToReturn === 'globe') {
            showView('globe');
            
            // بعد از بازگشت به صفحه globe، هایلایت مربوطه را فعال کن
            // After returning to globe page, activate corresponding highlight
            setTimeout(() => {
                const globeCircle = document.querySelector(`.highlight-circle[data-globe="${activeGlobeType}"]`);
                const globePanel = document.querySelector(`.globe-panel[data-globe-panel="${activeGlobeType}"]`);
                
                if (globeCircle) {
                    // حذف active از همه
                    // Remove active from all
                    document.querySelectorAll('.highlight-circle[data-globe]').forEach(c => c.classList.remove('active'));
                    // اضافه کردن active به هایلایت مربوطه
                    // Add active to corresponding highlight
                    globeCircle.classList.add('active');
                }
                
                if (globePanel) {
                    // حذف active از همه
                    // Remove active from all
                    document.querySelectorAll('.globe-panel[data-globe-panel]').forEach(p => p.classList.remove('active'));
                    // اضافه کردن active به پنل مربوطه
                    // Add active to corresponding panel
                    globePanel.classList.add('active');
                }
            }, 150);
        } else {
            // اگر از صفحه دیگه‌ای اومده بود، به همون صفحه برگرد (نه globe)
            // If we came from another page, return to that page (not globe)
            showView(viewToReturn);
        }
        
        // پاک کردن previousViewBeforeGlobe بعد از استفاده
        // Clear previousViewBeforeGlobe after use
        if (window.appState) {
            window.appState.previousViewBeforeGlobe = null;
        }
    }
    
    // پاکسازی کره با تاخیر کوتاه (برای جلوگیری از هنگ)
    // Clean up globe with short delay (to prevent hang)
    setTimeout(() => {
        const simpleGlobeScenes = window.simpleGlobeScenes;
        if (simpleGlobeScenes && simpleGlobeScenes[type] && typeof simpleGlobeScenes[type].destroy === 'function') {
            try {
                simpleGlobeScenes[type].destroy();
            } catch (e) {
                const log = window.logger || { warn: console.warn };
                log.warn('خطا در destroy کردن کره:', e);
            }
            simpleGlobeScenes[type] = null;
        }
        
        // پاک کردن محتوای container
        // Clear container content
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

/**
 * 🌐 باز کردن کره‌های 3D جدید
 * Open 3D globes
 * 
 * این تابع کره‌های 3D (آب و هوا، نظامی، دانشگاه، تاریخی، زلزله، منابع طبیعی) را باز می‌کند.
 * This function opens 3D globes (weather, military, universities, historical, earthquake, natural resources).
 * 
 * @param {string} type - نوع کره: 'weather', 'military', 'universities', 'historical', 'earthquake', 'natural-resources'
 * 
 * ویژگی‌ها / Features:
 * - جلوگیری از باز شدن همزمان چند کره
 * - چک لاگین قبل از باز کردن
 * - ساخت کره با buildSimpleGlobe
 * - بارگذاری داده‌های مربوطه
 * - بارگذاری مرزهای کشورها
 * 
 * وابستگی‌ها / Dependencies:
 * - window.checkLoginRequired
 * - window.buildSimpleGlobe
 * - window.load3DGlobeData
 * - window.createWorldBorders
 * - window.setupEarthquakeFilters
 * - window.setupNaturalResourcesFilters
 */
function open3DGlobe(type) {
    const log = window.logger || { info: console.log, error: console.error, warn: console.warn, debug: console.log };
    
    // جلوگیری از باز شدن همزمان
    // Prevent simultaneous opening
    if (globe3DOpening) {
        log.debug('کره 3D در حال باز شدن است...');
        return;
    }
    
    // 🔐 چک لاگین / Check login
    if (typeof checkLoginRequired === 'function' && !checkLoginRequired()) {
        log.warn('کاربر لاگین نیست - کره 3D باز نشد');
        return;
    }
    
    // ذخیره صفحه فعلی قبل از باز کردن کره
    // Save current view before opening globe
    if (window.appState) {
        window.appState.previousViewBeforeGlobe = window.appState.currentView || 'home';
    }
    
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
        // اگر modal یا container پیدا نشد، صبر کن و دوباره تلاش کن
        // If modal or container not found, wait and retry
        log.warn(`⚠️ Modal یا Container پیدا نشد - تلاش مجدد... (${modalId}, ${containerId})`);
        
        // اگر window.open3DGlobe override شده (React environment)، از آن استفاده کن
        // If window.open3DGlobe is overridden (React environment), use it
        if (typeof window.open3DGlobe === 'function' && window.React) {
            // در React environment، window.open3DGlobe توسط Layout.jsx override شده
            // In React environment, window.open3DGlobe is overridden by Layout.jsx
            // فقط state را set کن، modal خودش render می‌شود
            // Just set state, modal will render itself
            log.info(`✅ استفاده از React state برای باز کردن کره ${type}`);
            globe3DOpening = false;
            return; // React state را set کرده‌ایم، ادامه نمی‌دهیم
        }
        
        // اگر در vanilla JS environment هستیم و modal پیدا نشد، خطا بده
        // If in vanilla JS environment and modal not found, show error
        if (!window.React) {
            log.error('Modal یا Container پیدا نشد!');
            if (window.errorHandler) {
                window.errorHandler.showUserError(`خطا در باز کردن کره ${type}. لطفاً صفحه را رفرش کنید.`, 'خطا');
            }
            globe3DOpening = false;
            return;
        }
        
        // در React environment، کمی صبر کن و دوباره تلاش کن
        // In React environment, wait a bit and retry
        setTimeout(() => {
            const retryModal = document.getElementById(modalId);
            const retryContainer = document.getElementById(containerId);
            if (!retryModal || !retryContainer) {
                log.error('Modal یا Container پیدا نشد (بعد از retry)!');
                globe3DOpening = false;
            } else {
                // اگر پیدا شد، ادامه بده
                // If found, continue
                log.info('✅ Modal و Container پیدا شدند (بعد از retry)');
            }
        }, 500);
        
        globe3DOpening = false;
        return;
    }
    
    // جلوگیری از اسکرول body
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    document.body.classList.add('globe-modal-open');
    
    // نمایش modal / Show modal
    modal.classList.add('active');
    modal.style.display = 'block';
    modal.style.visibility = 'visible';
    modal.style.opacity = '1';
    
    // ساخت کره 3D
    // Build 3D globe
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            const simpleGlobeScenes = window.simpleGlobeScenes;
            
            // پاک کردن کره قبلی اگر وجود داشت
            // Clear previous globe if exists
            if (simpleGlobeScenes && simpleGlobeScenes[type] && typeof simpleGlobeScenes[type].destroy === 'function') {
                try {
                    simpleGlobeScenes[type].destroy();
                } catch (e) {
                    const log = window.logger || { warn: console.warn }; 
                    log.warn('خطا در پاک کردن کره قبلی:', e);
                }
            }
            
            // ساخت کره جدید
            // Build new globe
            if (typeof buildSimpleGlobe === 'function') {
                if (!simpleGlobeScenes) {
                    window.simpleGlobeScenes = {};
                }
                window.simpleGlobeScenes[type] = buildSimpleGlobe(containerId, type);
            }
            
            // راه‌اندازی دکمه سیار - با تاخیر بیشتر برای اطمینان از لود شدن کره
            // Setup assistive touch button - with longer delay to ensure globe is loaded
            setTimeout(() => {
                // تبدیل نام assistive برای کره‌های خاص
                // Convert assistive name for specific globes
                let assistiveId = `${type}GlobeAssistive`;
                if (type === 'natural-resources') {
                    assistiveId = 'naturalResourcesGlobeAssistive';
                }
                const assistive = document.getElementById(assistiveId);
                if (assistive) {
                    // حذف instance قبلی اگر وجود داشت
                    // Remove previous instance if exists
                    if (window[`${type}GlobeAssistive`]) {
                        try {
                            // پاک کردن event listeners قبلی
                            // Clear previous event listeners
                            const oldInstance = window[`${type}GlobeAssistive`];
                            if (oldInstance.touchButton) {
                                const newBtn = oldInstance.touchButton.cloneNode(true);
                                oldInstance.touchButton.parentNode.replaceChild(newBtn, oldInstance.touchButton);
                            }
                        } catch (e) {
                            const log = window.logger || { warn: console.warn }; 
                            log.warn('خطا در پاک کردن instance قبلی:', e);
                        }
                    }
                    
                    // تبدیل نام menu برای کره‌های خاص
                    // Convert menu name for specific globes
                    let menuId = `${type}GlobeMenu`;
                    if (type === 'natural-resources') {
                        menuId = 'naturalResourcesGlobeMenu';
                    }
                    
                    // در React environment، این توسط FloatingDock مدیریت می‌شود
                    // In React environment, this is managed by FloatingDock
                    if (typeof GlobeAssistiveTouch !== 'undefined') {
                        window[`${type}GlobeAssistive`] = new GlobeAssistiveTouch(assistiveId, menuId, type);
                        const log = window.logger || { info: console.log }; 
                        log.info(`✅ دکمه سیار کره ${type} راه‌اندازی شد`);
                    }
                } else {
                    const log = window.logger || { warn: console.warn }; 
                    log.warn(`⚠️ دکمه سیار کره ${type} پیدا نشد:`, assistiveId);
                }
            }, 800);
            
            // راه‌اندازی فیلترها برای کره‌های جدید
            // Setup filters for new globes
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
            // Load borders for all new globes - with longer delay and retry
            const loadBorders = async (retryCount = 0) => {
                const maxRetries = 3;
                const simpleGlobeScenes = window.simpleGlobeScenes;
                const scene = simpleGlobeScenes && simpleGlobeScenes[type];
                
                if (!scene) {
                    if (retryCount < maxRetries) {
                        const log = window.logger || { info: console.log }; 
                        log.info(`🔄 تلاش مجدد برای بارگذاری مرزها (${retryCount + 1}/${maxRetries})...`);
                        setTimeout(() => loadBorders(retryCount + 1), 1000);
                    } else {
                        const log = window.logger || { warn: console.warn }; 
                        log.warn(`⚠️ کره ${type} پیدا نشد بعد از ${maxRetries} تلاش`);
                    }
                    return;
                }
                
                if (!scene.earth) {
                    if (retryCount < maxRetries) {
                        const log = window.logger || { info: console.log }; 
                        log.info(`🔄 earth پیدا نشد، تلاش مجدد (${retryCount + 1}/${maxRetries})...`);
                        setTimeout(() => loadBorders(retryCount + 1), 1000);
                    } else {
                        const log = window.logger || { warn: console.warn }; 
                        log.warn(`⚠️ earth کره ${type} پیدا نشد بعد از ${maxRetries} تلاش`);
                    }
                    return;
                }
                
                const earth = scene.earth;
                const log = window.logger || { info: console.log }; 
                log.info(`🗺️ اضافه کردن مرزها به کره ${type}...`);
                
                try {
                    if (typeof createWorldBorders === 'function') {
                        const bordersGroup = await createWorldBorders(earth, {
                            defaultColor: 0x4488ff,
                            defaultOpacity: 0.4
                        });
                        if (bordersGroup) {
                            const log = window.logger || { info: console.log }; 
                            log.info(`✅ مرزها به کره ${type} اضافه شدند`);
                            // ذخیره bordersGroup در scene برای دسترسی بعدی
                            // Save bordersGroup in scene for later access
                            scene.bordersGroup = bordersGroup;
                        } else {
                            const log = window.logger || { warn: console.warn }; 
                            log.warn(`⚠️ مرزها برای کره ${type} لود نشدند`);
                        }
                    } else {
                        const log = window.logger || { warn: console.warn }; 
                        log.warn('⚠️ تابع createWorldBorders پیدا نشد');
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
            // Start loading with delay
            setTimeout(() => loadBorders(), 2000);
            
            // بارگذاری داده‌های مربوطه - با retry برای اطمینان از آماده بودن scene
            // Load related data - with retry to ensure scene is ready
            const loadDataWithRetry = (retryCount = 0) => {
                const maxRetries = 5;
                const simpleGlobeScenes = window.simpleGlobeScenes;
                const scene = simpleGlobeScenes && simpleGlobeScenes[type];
                
                if (!scene) {
                    if (retryCount < maxRetries) {
                        const log = window.logger || { info: console.log }; 
                        log.info(`🔄 تلاش مجدد برای بارگذاری داده‌ها (${retryCount + 1}/${maxRetries})...`);
                        setTimeout(() => loadDataWithRetry(retryCount + 1), 500);
                    } else {
                        const log = window.logger || { warn: console.warn }; 
                        log.warn(`⚠️ کره ${type} پیدا نشد بعد از ${maxRetries} تلاش`);
                    }
                    return;
                }
                
                if (!scene.scene) {
                    if (retryCount < maxRetries) {
                        const log = window.logger || { info: console.log }; 
                        log.info(`🔄 scene پیدا نشد، تلاش مجدد (${retryCount + 1}/${maxRetries})...`);
                        setTimeout(() => loadDataWithRetry(retryCount + 1), 500);
                    } else {
                        const log = window.logger || { warn: console.warn }; 
                        log.warn(`⚠️ scene کره ${type} پیدا نشد بعد از ${maxRetries} تلاش`);
                    }
                    return;
                }
                
                if (!scene.earth) {
                    if (retryCount < maxRetries) {
                        const log = window.logger || { info: console.log }; 
                        log.info(`🔄 earth پیدا نشد، تلاش مجدد (${retryCount + 1}/${maxRetries})...`);
                        setTimeout(() => loadDataWithRetry(retryCount + 1), 500);
                    } else {
                        const log = window.logger || { warn: console.warn }; 
                        log.warn(`⚠️ earth کره ${type} پیدا نشد بعد از ${maxRetries} تلاش`);
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
            // Start loading with delay
            setTimeout(() => loadDataWithRetry(), 1500);
            
            globe3DOpening = false;
        });
    });
}

/**
 * 🔄 ریست کردن دید کره به حالت اولیه
 * Reset globe view to initial state
 * 
 * این تابع دوربین کره را به موقعیت اولیه (رو به ایران) برمی‌گرداند.
 * This function returns the globe camera to initial position (facing Iran).
 * 
 * @param {string} type - نوع کره: 'financial', 'resources', 'weather', 'military', 'universities', 'historical', 'earthquake', 'natural-resources'
 * 
 * ویژگی‌ها / Features:
 * - برگرداندن دوربین به موقعیت ایران
 * - ریست چرخش کره
 * - حذف popup باز
 * - مخفی کردن پنل انتخاب بازار
 * 
 * وابستگی‌ها / Dependencies:
 * - window.simpleGlobeScenes
 * - window.CONFIG
 * - THREE.js (THREE.Vector3)
 */
function resetGlobeView(type) {
    const log = window.logger || { info: console.log }; 
    log.info(`🔄 بازیابی دید کره ${type}`);
    
    // برای کره‌های بزرگ
    // For large globes
    if (type === 'financial' && window.financialGlobe) {
        if (typeof window.financialGlobe.resetView === 'function') {
            window.financialGlobe.resetView();
        }
        return;
    } else if (type === 'resources' && window.resourcesGlobe) {
        if (typeof window.resourcesGlobe.resetView === 'function') {
            window.resourcesGlobe.resetView();
        }
        return;
    }
    
    const simpleGlobeScenes = window.simpleGlobeScenes;
    const globeScene = simpleGlobeScenes && simpleGlobeScenes[type];
    if (!globeScene) return;
    
    // برگرداندن دوربین به موقعیت ایران
    // Return camera to Iran position
    if (globeScene.camera) {
        const cfg = window.CONFIG || (typeof CONFIG !== 'undefined' ? CONFIG : null);
        if (!cfg) {
            log.warn('⚠️ CONFIG پیدا نشد');
            return;
        }
        
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
    // Reset globe rotation
    if (globeScene.earth) {
        globeScene.earth.rotation.y = 0;
    }
    
    // حذف popup باز
    // Remove open popup
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
        const popup = container.querySelector('.market-3d-popup');
        if (popup) popup.remove();
    }
    
    // مخفی کردن پنل انتخاب بازار
    // Hide market selection panel
    const panel = document.getElementById('marketSelectPanel');
    if (panel) panel.classList.remove('visible');
}

// ============================================
// Export توابع به window
// Export functions to window
// ============================================

window.openFinancialGlobe = openFinancialGlobe;
window.openResourcesGlobe = openResourcesGlobe;
window.open3DGlobe = open3DGlobe;
window.closeGlobeModal = closeGlobeModal;
window.resetGlobeView = resetGlobeView;

// Export متغیرهای global برای دسترسی از سایر فایل‌ها
// Export global variables for access from other files
window.globeOpening = globeOpening;
window.globe3DOpening = globe3DOpening;

