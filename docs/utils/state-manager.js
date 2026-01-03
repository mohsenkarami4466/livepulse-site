// ==================== //
// 🎛️ State Manager
// ==================== //
// مدیریت متمرکز state برنامه

/**
 * State Manager ساده برای مدیریت state برنامه
 */
class StateManager {
    constructor() {
        this.state = {
            // UI State
            currentTheme: 'light',
            currentView: 'home',
            currentCategory: 'crypto',
            currentTool: 'goldTool',
            openModals: 0,
            maxModals: { home: 4, category: 2 },
            
            // User State
            userUsage: { chat: 0, tools: 0 },
            previousViewBeforeGlobe: null,
            
            // Globe State
            globe: {
                financial: {
                    selectedCountry: null,
                    showBorders: true,
                    showMarkers: true
                },
                resources: {
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
                }
            }
        };
        
        this.storageKey = 'livepulseState';
        this.listeners = new Map();
    }
    
    /**
     * مقداردهی اولیه state از localStorage
     */
    init() {
        const log = window.logger || { info: console.log, warn: console.warn };
        const errorHandler = window.errorHandler;
        
        try {
            const savedState = localStorage.getItem(this.storageKey);
            if (savedState) {
                const parsed = JSON.parse(savedState);
                // Merge با state پیش‌فرض
                this.state = { ...this.state, ...parsed };
                log.info('✅ State از localStorage بارگذاری شد');
            }
        } catch (e) {
            log.warn('⚠️ خطا در بارگذاری state:', e);
            if (errorHandler) {
                errorHandler.handleError(e, 'StateManager.init');
            }
        }
    }
    
    /**
     * دریافت state
     * @param {string} path - مسیر state (مثل 'currentTheme' یا 'globe.resources.selectedCountry')
     * @returns {*} مقدار state
     */
    get(path) {
        if (!path) return this.state;
        
        const keys = path.split('.');
        let value = this.state;
        
        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                return undefined;
            }
        }
        
        return value;
    }
    
    /**
     * تنظیم state
     * @param {string} path - مسیر state
     * @param {*} value - مقدار جدید
     * @param {boolean} save - آیا در localStorage ذخیره شود (پیش‌فرض: true)
     */
    set(path, value, save = true) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        let target = this.state;
        
        // ایجاد مسیر اگر وجود نداشته باشد
        for (const key of keys) {
            if (!target[key] || typeof target[key] !== 'object') {
                target[key] = {};
            }
            target = target[key];
        }
        
        // تنظیم مقدار
        target[lastKey] = value;
        
        // ذخیره در localStorage
        if (save) {
            this.save();
        }
        
        // اطلاع‌رسانی به listeners
        this.notify(path, value);
    }
    
    /**
     * به‌روزرسانی چند مقدار به صورت همزمان
     * @param {Object} updates - object با path: value
     * @param {boolean} save - آیا در localStorage ذخیره شود
     */
    update(updates, save = true) {
        Object.entries(updates).forEach(([path, value]) => {
            this.set(path, value, false);
        });
        
        if (save) {
            this.save();
        }
    }
    
    /**
     * ذخیره state در localStorage
     */
    save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.state));
        } catch (e) {
            const log = window.logger || { error: console.error };
            log.error('❌ خطا در ذخیره state:', e);
        }
    }
    
    /**
     * اضافه کردن listener برای تغییرات state
     * @param {string} path - مسیر state
     * @param {Function} callback - تابع callback
     * @returns {Function} تابع unsubscribe
     */
    subscribe(path, callback) {
        if (!this.listeners.has(path)) {
            this.listeners.set(path, []);
        }
        
        this.listeners.get(path).push(callback);
        
        // برگرداندن تابع unsubscribe
        return () => {
            const callbacks = this.listeners.get(path);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        };
    }
    
    /**
     * اطلاع‌رسانی به listeners
     * @param {string} path - مسیر state
     * @param {*} value - مقدار جدید
     */
    notify(path, value) {
        const callbacks = this.listeners.get(path);
        if (callbacks) {
            callbacks.forEach(callback => {
                try {
                    callback(value, path);
                } catch (e) {
                    const log = window.logger || { error: console.error };
                    log.error('❌ خطا در callback listener:', e);
                }
            });
        }
    }
    
    /**
     * Reset state به حالت پیش‌فرض
     */
    reset() {
        this.state = {
            currentTheme: 'light',
            currentView: 'home',
            currentCategory: 'crypto',
            currentTool: 'goldTool',
            openModals: 0,
            maxModals: { home: 4, category: 2 },
            userUsage: { chat: 0, tools: 0 },
            previousViewBeforeGlobe: null,
            globe: {
                financial: {
                    selectedCountry: null,
                    showBorders: true,
                    showMarkers: true
                },
                resources: {
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
                }
            }
        };
        this.save();
    }
}

// ایجاد instance سراسری
const stateManager = new StateManager();

// مقداردهی اولیه
if (typeof window !== 'undefined') {
    // استفاده از appState موجود اگر وجود داشته باشد
    if (typeof appState !== 'undefined') {
        stateManager.state = { ...stateManager.state, ...appState };
    }
    
    stateManager.init();
    
    // Export
    window.stateManager = stateManager;
    
    // همچنین برای backward compatibility
    window.appState = new Proxy(stateManager.state, {
        get(target, prop) {
            return stateManager.get(prop);
        },
        set(target, prop, value) {
            stateManager.set(prop, value);
            return true;
        }
    });
}

// Export برای استفاده در modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StateManager, stateManager };
}

