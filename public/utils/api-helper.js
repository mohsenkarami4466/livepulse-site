/**
 * 🌐 Helper برای اتصال به API و مدیریت داده‌ها
 * در صورت عدم دسترسی به API، از mock data استفاده می‌کند
 */

class APIHelper {
    constructor() {
        this.baseURL = 'https://api.livepulse.ir'; // آدرس API واقعی
        this.useMockData = true; // در حال حاضر از mock data استفاده می‌کنیم
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 دقیقه
    }

    /**
     * دریافت داده‌های کشورها
     */
    async fetchCountriesData() {
        const cacheKey = 'countries';
        const cached = this.getCached(cacheKey);
        if (cached) return cached;

        if (this.useMockData || typeof countriesData !== 'undefined') {
            // استفاده از mock data
            const data = typeof countriesData !== 'undefined' ? countriesData : {};
            this.setCached(cacheKey, data);
            return data;
        }

        try {
            const response = await fetch(`${this.baseURL}/api/countries`);
            if (!response.ok) throw new Error('خطا در دریافت داده‌ها');
            const data = await response.json();
            this.setCached(cacheKey, data);
            return data;
        } catch (error) {
            if (window.errorHandler) {
                window.errorHandler.handleError(error, 'fetchCountriesData');
            }
            // در صورت خطا، از mock data استفاده کن
            if (typeof countriesData !== 'undefined') {
                return countriesData;
            }
            return {};
        }
    }

    /**
     * دریافت اطلاعات یک کشور خاص
     */
    async fetchCountryData(countryCode) {
        const cacheKey = `country-${countryCode}`;
        const cached = this.getCached(cacheKey);
        if (cached) return cached;

        if (this.useMockData || typeof countriesData !== 'undefined') {
            const data = typeof countriesData !== 'undefined' && countriesData[countryCode] 
                ? countriesData[countryCode] 
                : null;
            if (data) this.setCached(cacheKey, data);
            return data;
        }

        try {
            const response = await fetch(`${this.baseURL}/api/countries/${countryCode}`);
            if (!response.ok) throw new Error('خطا در دریافت داده‌ها');
            const data = await response.json();
            this.setCached(cacheKey, data);
            return data;
        } catch (error) {
            if (window.errorHandler) {
                window.errorHandler.handleError(error, 'fetchCountryData');
            }
            // در صورت خطا، از mock data استفاده کن
            if (typeof countriesData !== 'undefined' && countriesData[countryCode]) {
                return countriesData[countryCode];
            }
            return null;
        }
    }

    /**
     * دریافت داده‌های بازارهای مالی
     */
    async fetchFinancialData() {
        const cacheKey = 'financial';
        const cached = this.getCached(cacheKey);
        if (cached) return cached;

        if (this.useMockData || typeof mockFinancialData !== 'undefined') {
            const data = typeof mockFinancialData !== 'undefined' ? mockFinancialData : [];
            this.setCached(cacheKey, data);
            return data;
        }

        try {
            const response = await fetch(`${this.baseURL}/api/markets`);
            if (!response.ok) throw new Error('خطا در دریافت داده‌ها');
            const data = await response.json();
            this.setCached(cacheKey, data);
            return data;
        } catch (error) {
            if (window.errorHandler) {
                window.errorHandler.handleError(error, 'fetchFinancialData');
            }
            // در صورت خطا، از mock data استفاده کن
            if (typeof mockFinancialData !== 'undefined') {
                return mockFinancialData;
            }
            return [];
        }
    }

    /**
     * دریافت داده‌های منابع طبیعی
     */
    async fetchResourcesData() {
        const cacheKey = 'resources';
        const cached = this.getCached(cacheKey);
        if (cached) return cached;

        if (this.useMockData || typeof mockResourcesData !== 'undefined') {
            const data = typeof mockResourcesData !== 'undefined' ? mockResourcesData : [];
            this.setCached(cacheKey, data);
            return data;
        }

        try {
            const response = await fetch(`${this.baseURL}/api/resources`);
            if (!response.ok) throw new Error('خطا در دریافت داده‌ها');
            const data = await response.json();
            this.setCached(cacheKey, data);
            return data;
        } catch (error) {
            if (window.errorHandler) {
                window.errorHandler.handleError(error, 'fetchResourcesData');
            }
            // در صورت خطا، از mock data استفاده کن
            if (typeof mockResourcesData !== 'undefined') {
                return mockResourcesData;
            }
            return [];
        }
    }

    /**
     * دریافت قیمت‌های لحظه‌ای (ارز، طلا، رمزارز)
     */
    async fetchPrices() {
        const cacheKey = 'prices';
        const cached = this.getCached(cacheKey);
        if (cached) return cached;

        if (this.useMockData || typeof sampleData !== 'undefined') {
            const data = typeof sampleData !== 'undefined' ? sampleData : {};
            // کش کوتاه‌مدت برای قیمت‌ها (30 ثانیه)
            this.setCached(cacheKey, data, 30000);
            return data;
        }

        try {
            const response = await fetch(`${this.baseURL}/api/prices`);
            if (!response.ok) throw new Error('خطا در دریافت قیمت‌ها');
            const data = await response.json();
            // کش کوتاه‌مدت برای قیمت‌ها (30 ثانیه)
            this.setCached(cacheKey, data, 30000);
            return data;
        } catch (error) {
            if (window.errorHandler) {
                window.errorHandler.handleError(error, 'fetchPrices');
            }
            // در صورت خطا، از mock data استفاده کن
            if (typeof sampleData !== 'undefined') {
                return sampleData;
            }
            return {};
        }
    }

    /**
     * دریافت داده‌های آب و هوا
     */
    async fetchWeatherData() {
        const cacheKey = 'weather';
        const cached = this.getCached(cacheKey);
        if (cached) return cached;

        // استفاده از داده‌های موجود در script.js
        if (typeof weatherData !== 'undefined') {
            this.setCached(cacheKey, weatherData, 60 * 60 * 1000); // 1 ساعت
            return weatherData;
        }

        try {
            const response = await fetch(`${this.baseURL}/api/weather`);
            if (!response.ok) throw new Error('خطا در دریافت داده‌های آب و هوا');
            const data = await response.json();
            this.setCached(cacheKey, data, 60 * 60 * 1000); // 1 ساعت
            return data;
        } catch (error) {
            if (window.errorHandler) {
                window.errorHandler.handleError(error, 'fetchWeatherData');
            }
            return {};
        }
    }

    /**
     * مدیریت کش
     */
    getCached(key) {
        const item = this.cache.get(key);
        if (!item) return null;
        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            return null;
        }
        return item.data;
    }

    setCached(key, data, timeout = null) {
        const expiry = Date.now() + (timeout || this.cacheTimeout);
        this.cache.set(key, { data, expiry });
    }

    clearCache() {
        this.cache.clear();
    }

    /**
     * فعال/غیرفعال کردن mock data
     */
    setUseMockData(useMock) {
        this.useMockData = useMock;
        if (!useMock) {
            this.clearCache(); // پاک کردن کش هنگام استفاده از API واقعی
        }
    }
}

// ایجاد instance سراسری
const apiHelper = new APIHelper();

// در دسترس قرار دادن برای استفاده در فایل‌های دیگر
if (typeof window !== 'undefined') {
    window.apiHelper = apiHelper;
}

// Export برای استفاده در ماژول‌ها
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { apiHelper, APIHelper };
}
