/**
 * ⚙️ فایل تنظیمات مرکزی - Central Configuration File
 * تمام مقادیر ثابت و تنظیمات در این فایل قرار دارند
 */

const CONFIG = {
    // 🌍 تنظیمات کره‌ها (Globe Settings)
    GLOBE: {
        // فاصله و موقعیت
        MIN_DISTANCE: 3.5,
        DISTANCE_RATIO: 200,
        DEFAULT_DISTANCE: 3,
        DISTANCE_MULTIPLIER: {
            MIN: 0.8,
            MAX: 2.5
        },
        
        // موقعیت ایران (برای نمایش اولیه)
        IRAN: {
            LAT: 32.4279,
            LNG: 53.6880
        },
        
        // تنظیمات Camera
        CAMERA: {
            FOV: 60,
            NEAR: 0.1,
            FAR: 1000
        },
        
        // تنظیمات Controls
        CONTROLS: {
            ENABLE_DAMPING: true,
            DAMPING_FACTOR: 0.05,
            ENABLE_PAN: false,
            ENABLE_ROTATE: true,
            AUTO_ROTATE: false,
            AUTO_ROTATE_SPEED: 0.5
        },
        
        // تنظیمات Renderer
        RENDERER: {
            ANTIALIAS: true,
            ALPHA: false,
            MAX_PIXEL_RATIO: 3
        },
        
        // تنظیمات Geometry
        GEOMETRY: {
            SPHERE_SEGMENTS: 256,
            MARKER_SEGMENTS: 16,
            MARKER_SIZE: 0.025,
            RESOURCES_MARKER_SIZE: 0.03,
            ATMOSPHERE_RADIUS: 1.02
        },
        
        // تنظیمات Animation
        ANIMATION: {
            ROTATION_SPEED: 0.001,
            RESOURCES_ROTATION_SPEED: 0.0008,
            UPDATE_INTERVAL: 30000 // 30 ثانیه
        },
        
        // تنظیمات Lights
        LIGHTS: {
            AMBIENT_INTENSITY: 0.5,
            DIRECTIONAL_INTENSITY: 1,
            POINT_INTENSITY: 0.5,
            GOLD_LIGHT_INTENSITY: 0.5
        },
        
        // تنظیمات Material
        MATERIAL: {
            FINANCIAL_COLOR: 0x1d4ed8,
            FINANCIAL_SHININESS: 25,
            FINANCIAL_EMISSIVE: 0x0f172a,
            FINANCIAL_EMISSIVE_INTENSITY: 0.08,
            RESOURCES_COLOR: 0x14532d,
            RESOURCES_SHININESS: 30,
            RESOURCES_EMISSIVE: 0x052e16,
            RESOURCES_EMISSIVE_INTENSITY: 0.1
        },
        
        // رنگ‌های Marker
        MARKER_COLORS: {
            MARKET_OPEN: 0x10b981,
            MARKET_CLOSED: 0xef4444,
            GOLD: 0xffd700,
            OIL: 0x333333,
            GAS: 0xa855f7,
            DEFAULT: 0xffa500
        }
    },
    
    // 💰 تنظیمات قیمت‌ها (Price Settings)
    PRICES: {
        // قیمت پایه طلا
        GOLD: {
            BASE_PRICE_24: 3750000, // تومان
            DEFAULT_CARAT: 24
        },
        
        // نرخ‌های ارز (نمونه - باید از API دریافت شود)
        EXCHANGE_RATES: {
            USD: 58000,
            EUR: 62000,
            GBP: 73000,
            IRR: 1,
            TRY: 1800,
            AED: 15800,
            CAD: 42000,
            AUD: 38000,
            CNY: 8000,
            JPY: 380,
            CHF: 65000
        }
    },
    
    // 📱 تنظیمات UI (UI Settings)
    UI: {
        // اندازه‌های Responsive
        MOBILE_BREAKPOINT: 768,
        MOBILE_MIN_WIDTH: 180,
        DESKTOP_MIN_WIDTH: 200,
        
        // فاصله‌ها
        GAP: {
            MOBILE: 4,
            DESKTOP: 2
        },
        
        // تنظیمات Modal
        MODAL: {
            MAX_MODALS_HOME: 4,
            MAX_MODALS_CATEGORY: 2
        },
        
        // تنظیمات Animation
        ANIMATION: {
            TRANSITION_DURATION: 300,
            FADE_DURATION: 200,
            BUTTON_DISABLE_DURATION: 1000,
            TOAST_DURATION: 2000,
            SETUP_DELAY: 1000,
            RETRY_DELAY: 300
        }
    },
    
    // 🛠️ تنظیمات ابزارها (Tools Settings)
    TOOLS: {
        // محدودیت استفاده
        USAGE_LIMIT: {
            CHAT: 4,
            TOOLS: 4
        },
        
        // تنظیمات طلا
        GOLD: {
            DEFAULT_CARAT: 24,
            DEFAULT_WAGE: 0
        }
    },
    
    // 🌐 تنظیمات API (API Settings)
    API: {
        BASE_URL: 'https://api.livepulse.ir',
        USE_MOCK_DATA: true,
        CACHE_TIMEOUT: 5 * 60 * 1000, // 5 دقیقه
        PRICES_CACHE_TIMEOUT: 30000 // 30 ثانیه
    },
    
    // 🎨 تنظیمات تم (Theme Settings)
    THEME: {
        DEFAULT: 'light',
        STORAGE_KEY: 'livepulse-theme'
    },
    
    // 💾 تنظیمات Storage (Storage Settings)
    STORAGE: {
        STATE_KEY: 'livepulseState',
        USAGE_KEY: 'livepulse-usage',
        THEME_KEY: 'livepulse-theme',
        TOUCH_POS_KEY: 'assistiveTouchPos'
    },
    
    // ⏱️ تنظیمات زمان (Time Settings)
    TIME: {
        UPDATE_INTERVAL: 30000, // 30 ثانیه
        CLOCK_UPDATE_INTERVAL: 1000, // 1 ثانیه
        GLOBE_POSITION_UPDATE_INTERVAL: 2000 // 2 ثانیه
    },
    
    // 🎯 تنظیمات کلیک (Click Settings)
    CLICK: {
        DRAG_THRESHOLD: 5,
        DEBOUNCE_DELAY: 300,
        GLOBE_OPENING_DELAY: 1000
    },
    
    // 📊 تنظیمات نمودار (Chart Settings)
    CHART: {
        CANDLE_COUNT: 12,
        MIN_VALUE: 10,
        MAX_VALUE: 90
    }
};

// در دسترس قرار دادن برای استفاده در فایل‌های دیگر
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}

// Export برای استفاده در ماژول‌ها
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG };
}

