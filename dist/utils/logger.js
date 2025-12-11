/**
 * 🛠️ سیستم مدیریت لاگ - برای production و development
 * استفاده: import { logger } from './utils/logger.js';
 */

const LOG_LEVELS = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3
};

class Logger {
    constructor() {
        // در production، فقط ERROR و WARN نمایش داده می‌شوند
        // در development، همه لاگ‌ها نمایش داده می‌شوند
        this.isDevelopment = window.location.hostname === 'localhost' || 
                             window.location.hostname === '127.0.0.1' ||
                             window.location.hostname.includes('dev') ||
                             localStorage.getItem('debugMode') === 'true';
        
        this.currentLevel = this.isDevelopment ? LOG_LEVELS.DEBUG : LOG_LEVELS.WARN;
    }

    error(message, ...args) {
        if (this.currentLevel >= LOG_LEVELS.ERROR) {
            console.error(`❌ ${message}`, ...args);
        }
    }

    warn(message, ...args) {
        if (this.currentLevel >= LOG_LEVELS.WARN) {
            console.warn(`⚠️ ${message}`, ...args);
        }
    }

    info(message, ...args) {
        if (this.currentLevel >= LOG_LEVELS.INFO) {
            console.log(`ℹ️ ${message}`, ...args);
        }
    }

    debug(message, ...args) {
        if (this.currentLevel >= LOG_LEVELS.DEBUG) {
            console.log(`🔍 ${message}`, ...args);
        }
    }

    success(message, ...args) {
        if (this.currentLevel >= LOG_LEVELS.INFO) {
            console.log(`✅ ${message}`, ...args);
        }
    }

    // برای لاگ‌های خاص (مثل شروع/پایان عملیات)
    log(message, ...args) {
        if (this.currentLevel >= LOG_LEVELS.INFO) {
            console.log(message, ...args);
        }
    }
}

// ایجاد instance سراسری
const logger = new Logger();

// در دسترس قرار دادن برای استفاده در فایل‌های دیگر
if (typeof window !== 'undefined') {
    window.logger = logger;
}

// Export برای استفاده در ماژول‌ها
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { logger, Logger, LOG_LEVELS };
}
