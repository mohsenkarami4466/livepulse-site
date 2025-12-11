/**
 * 🛡️ سیستم مدیریت خطا - برای مدیریت بهتر خطاها در کل برنامه
 */

class ErrorHandler {
    constructor() {
        this.errorCount = 0;
        this.maxErrors = 10; // حداکثر تعداد خطا قبل از نمایش پیام
        this.errors = [];
    }

    /**
     * مدیریت خطاهای عمومی
     */
    handleError(error, context = '') {
        this.errorCount++;
        
        const errorInfo = {
            message: error.message || 'خطای نامشخص',
            stack: error.stack,
            context: context,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        this.errors.push(errorInfo);

        // لاگ کردن خطا
        if (window.logger) {
            window.logger.error(`خطا در ${context}:`, errorInfo);
        } else {
            console.error(`❌ خطا در ${context}:`, errorInfo);
        }

        // اگر تعداد خطاها زیاد شد، به کاربر اطلاع بده
        if (this.errorCount >= this.maxErrors) {
            this.showErrorNotification();
            this.errorCount = 0; // ریست برای جلوگیری از اسپم
        }

        // در development، خطا را throw کن
        if (window.location.hostname === 'localhost' || 
            window.location.hostname === '127.0.0.1') {
            throw error;
        }
    }

    /**
     * مدیریت خطاهای async
     */
    async handleAsyncError(asyncFn, context = '') {
        try {
            return await asyncFn();
        } catch (error) {
            this.handleError(error, context);
            return null;
        }
    }

    /**
     * مدیریت خطاهای Promise
     */
    handlePromiseError(promise, context = '') {
        return promise.catch(error => {
            this.handleError(error, context);
            return null;
        });
    }

    /**
     * نمایش پیام خطا به کاربر
     */
    showErrorNotification() {
        const existing = document.getElementById('errorNotification');
        if (existing) {
            existing.remove();
        }

        const notification = document.createElement('div');
        notification.id = 'errorNotification';
        notification.className = 'error-notification';
        notification.innerHTML = `
            <div class="error-notification-content">
                <div class="error-icon">⚠️</div>
                <div class="error-text">
                    <strong>خطاهای متعدد رخ داده است</strong>
                    <p>لطفاً صفحه را رفرش کنید. اگر مشکل ادامه داشت، با پشتیبانی تماس بگیرید.</p>
                </div>
                <button class="error-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        document.body.appendChild(notification);

        // حذف خودکار بعد از 10 ثانیه
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 10000);
    }

    /**
     * نمایش خطای خاص به کاربر
     */
    showUserError(message, title = 'خطا') {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'user-error-message';
        errorDiv.innerHTML = `
            <div class="user-error-content">
                <div class="user-error-icon">❌</div>
                <div class="user-error-text">
                    <strong>${title}</strong>
                    <p>${message}</p>
                </div>
                <button class="user-error-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        document.body.appendChild(errorDiv);

        // حذف خودکار بعد از 5 ثانیه
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    /**
     * دریافت گزارش خطاها
     */
    getErrorReport() {
        return {
            count: this.errors.length,
            errors: this.errors,
            summary: this.getErrorSummary()
        };
    }

    /**
     * خلاصه خطاها
     */
    getErrorSummary() {
        const summary = {};
        this.errors.forEach(error => {
            const key = error.context || 'unknown';
            summary[key] = (summary[key] || 0) + 1;
        });
        return summary;
    }

    /**
     * پاک کردن خطاها
     */
    clearErrors() {
        this.errors = [];
        this.errorCount = 0;
    }
}

// ایجاد instance سراسری
const errorHandler = new ErrorHandler();

// در دسترس قرار دادن برای استفاده در فایل‌های دیگر
if (typeof window !== 'undefined') {
    window.errorHandler = errorHandler;
}

// Export برای استفاده در ماژول‌ها
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { errorHandler, ErrorHandler };
}
