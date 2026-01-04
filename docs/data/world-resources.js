// ============================================
// 🏭 منابع و صنایع جهان - داده‌های کامل
// ============================================
//
// 📡 ساختار API برای بک‌اند:
// GET /api/resources/{type}        → لیست منابع از یک نوع
// GET /api/resources/country/{code} → همه منابع یک کشور
// GET /api/facilities/{type}       → تاسیسات (پالایشگاه، کارخانه)
//
// ============================================

// انواع منابع و آیکون‌هایشان
const RESOURCE_TYPES = {
    oil_field: { name: 'میدان نفتی', icon: '🛢️', color: 0x1f2937 },
    oil_platform: { name: 'سکوی نفتی (دریایی)', icon: '🏗️', color: 0x374151 },
    gas_field: { name: 'میدان گازی', icon: '💨', color: 0x8b5cf6 },
    refinery: { name: 'پالایشگاه', icon: '🏭', color: 0xef4444 },
    gold_mine: { name: 'معدن طلا', icon: '🥇', color: 0xfbbf24 },
    iron_mine: { name: 'معدن آهن', icon: '⚫', color: 0x6b7280 },
    copper_mine: { name: 'معدن مس', icon: '🟤', color: 0xb45309 },
    coal_mine: { name: 'معدن زغال', icon: '⬛', color: 0x1f2937 },
    diamond_mine: { name: 'معدن الماس', icon: '💎', color: 0x60a5fa },
    uranium_mine: { name: 'معدن اورانیوم', icon: '☢️', color: 0x22c55e },
    factory_auto: { name: 'کارخانه خودرو', icon: '🚗', color: 0x3b82f6 },
    factory_tech: { name: 'کارخانه تکنولوژی', icon: '💻', color: 0x06b6d4 },
    factory_steel: { name: 'کارخانه فولاد', icon: '🏗️', color: 0x78716c },
    port: { name: 'بندر تجاری', icon: '⚓', color: 0x0ea5e9 }
};

// داده‌های منابع جهان
const worldResources = {
    // ===== ایران =====
    IR: {
        oil_fields: [
            { name: 'میدان نفتی اهواز', lat: 31.3183, lng: 48.6706, capacity: '1.2M bpd', rank: 1 },
            { name: 'میدان نفتی مارون', lat: 31.8, lng: 49.2, capacity: '520K bpd', rank: 2 },
            { name: 'میدان نفتی گچساران', lat: 30.35, lng: 50.8, capacity: '560K bpd', rank: 3 },
            { name: 'میدان نفتی آغاجاری', lat: 30.75, lng: 49.83, capacity: '200K bpd', rank: 4 },
            { name: 'میدان نفتی بی‌بی حکیمه', lat: 31.1, lng: 49.5, capacity: '140K bpd', rank: 5 }
        ],
        oil_platforms: [
            { name: 'میدان سروش', lat: 29.0, lng: 50.5, capacity: '190K bpd', offshore: true },
            { name: 'میدان نوروز', lat: 29.2, lng: 50.2, capacity: '100K bpd', offshore: true },
            { name: 'میدان فروزان', lat: 28.5, lng: 51.5, capacity: '60K bpd', offshore: true }
        ],
        gas_fields: [
            { name: 'پارس جنوبی', lat: 27.5, lng: 52.0, capacity: '750 mcm/d', rank: 1, shared: 'QA' },
            { name: 'کنگان', lat: 27.8, lng: 52.5, capacity: '50 mcm/d', rank: 2 },
            { name: 'نارگان', lat: 28.2, lng: 52.3, capacity: '35 mcm/d', rank: 3 }
        ],
        refineries: [
            { name: 'پالایشگاه آبادان', lat: 30.3392, lng: 48.3043, capacity: '450K bpd' },
            { name: 'پالایشگاه اصفهان', lat: 32.6539, lng: 51.6660, capacity: '375K bpd' },
            { name: 'پالایشگاه تهران', lat: 35.5669, lng: 51.3497, capacity: '250K bpd' },
            { name: 'پالایشگاه بندرعباس', lat: 27.1865, lng: 56.2808, capacity: '320K bpd' },
            { name: 'ستاره خلیج فارس', lat: 27.2, lng: 56.0, capacity: '480K bpd' }
        ],
        copper_mines: [
            { name: 'معدن مس سرچشمه', lat: 29.98, lng: 55.87, production: '250K tons/y' },
            { name: 'معدن مس سونگون', lat: 38.72, lng: 46.72, production: '150K tons/y' }
        ],
        iron_mines: [
            { name: 'معدن آهن گل‌گهر', lat: 29.2, lng: 55.3, production: '10M tons/y' },
            { name: 'معدن آهن چادرملو', lat: 32.3, lng: 55.3, production: '8M tons/y' }
        ],
        factories: [
            { name: 'ایران‌خودرو', lat: 35.75, lng: 51.30, type: 'factory_auto', products: 'خودرو' },
            { name: 'سایپا', lat: 35.68, lng: 51.18, type: 'factory_auto', products: 'خودرو' },
            { name: 'فولاد مبارکه', lat: 32.35, lng: 51.5, type: 'factory_steel', products: 'فولاد' }
        ]
    },

    // ===== عربستان =====
    SA: {
        oil_fields: [
            { name: 'میدان غوار', lat: 25.4, lng: 49.5, capacity: '5M bpd', rank: 1, note: 'بزرگترین میدان نفت جهان' },
            { name: 'میدان سفانیه', lat: 28.0, lng: 48.8, capacity: '1.5M bpd', rank: 2, offshore: true },
            { name: 'میدان منیفه', lat: 27.8, lng: 49.0, capacity: '900K bpd', rank: 3 },
            { name: 'میدان شیبه', lat: 22.5, lng: 54.0, capacity: '1M bpd', rank: 4 },
            { name: 'میدان خریص', lat: 25.2, lng: 49.3, capacity: '1.2M bpd', rank: 5 }
        ],
        gas_fields: [
            { name: 'میدان گازی فریده', lat: 26.5, lng: 50.0, capacity: '200 mcm/d' }
        ],
        refineries: [
            { name: 'رأس تنوره', lat: 26.6, lng: 50.15, capacity: '550K bpd' },
            { name: 'ینبع', lat: 24.1, lng: 38.05, capacity: '400K bpd' },
            { name: 'جیزان', lat: 16.9, lng: 42.55, capacity: '400K bpd' }
        ]
    },

    // ===== روسیه =====
    RU: {
        oil_fields: [
            { name: 'سامُتلُر', lat: 61.1, lng: 76.7, capacity: '1.8M bpd', rank: 1 },
            { name: 'رومشکین', lat: 54.3, lng: 52.3, capacity: '300K bpd', rank: 2 },
            { name: 'پریوبسکوی', lat: 60.8, lng: 76.5, capacity: '700K bpd', rank: 3 }
        ],
        gas_fields: [
            { name: 'اورنگوی', lat: 66.0, lng: 78.0, capacity: '400 bcm/y', rank: 1 },
            { name: 'یامبورگ', lat: 67.9, lng: 75.1, capacity: '200 bcm/y', rank: 2 },
            { name: 'بووانینکوو', lat: 70.4, lng: 68.5, capacity: '150 bcm/y', rank: 3 }
        ],
        gold_mines: [
            { name: 'معدن اولیمپیادا', lat: 58.8, lng: 93.5, production: '43 tons/y', rank: 1 },
            { name: 'معدن کوپول', lat: 65.8, lng: 153.0, production: '25 tons/y', rank: 2 }
        ],
        diamond_mines: [
            { name: 'معدن میر', lat: 62.5, lng: 114.0, production: '2M carats/y', note: 'بزرگترین معدن الماس' },
            { name: 'معدن یوبیلئی', lat: 66.0, lng: 112.0, production: '5M carats/y' }
        ],
        factories: [
            { name: 'آوتوواز (لادا)', lat: 53.5, lng: 49.3, type: 'factory_auto', products: 'خودرو' }
        ]
    },

    // ===== آمریکا =====
    US: {
        oil_fields: [
            { name: 'حوضه پرمین', lat: 31.8, lng: -102.4, capacity: '5M bpd', rank: 1 },
            { name: 'ایگل فورد', lat: 28.5, lng: -99.0, capacity: '1.2M bpd', rank: 2 },
            { name: 'باکن', lat: 47.5, lng: -102.8, capacity: '1.1M bpd', rank: 3 }
        ],
        oil_platforms: [
            { name: 'خلیج مکزیک - تاندر هورس', lat: 28.2, lng: -88.5, capacity: '250K bpd', offshore: true },
            { name: 'خلیج مکزیک - مارس', lat: 28.0, lng: -89.2, capacity: '200K bpd', offshore: true }
        ],
        gas_fields: [
            { name: 'مارسلوس شیل', lat: 41.0, lng: -77.0, capacity: '30 bcf/d', rank: 1 },
            { name: 'هاینزویل', lat: 32.5, lng: -94.0, capacity: '12 bcf/d', rank: 2 }
        ],
        refineries: [
            { name: 'پالایشگاه پورت آرتور', lat: 29.9, lng: -93.9, capacity: '630K bpd' },
            { name: 'پالایشگاه گالوستون', lat: 29.3, lng: -94.8, capacity: '585K bpd' }
        ],
        gold_mines: [
            { name: 'معدن نوادا', lat: 40.8, lng: -117.2, production: '170 tons/y' }
        ],
        factories: [
            { name: 'تسلا گیگافکتوری', lat: 39.5, lng: -119.4, type: 'factory_auto', products: 'خودرو برقی' },
            { name: 'اینتل فب', lat: 45.5, lng: -122.9, type: 'factory_tech', products: 'تراشه' },
            { name: 'TSMC آریزونا', lat: 33.6, lng: -112.1, type: 'factory_tech', products: 'تراشه' }
        ]
    },

    // ===== چین =====
    CN: {
        oil_fields: [
            { name: 'داچینگ', lat: 46.6, lng: 125.0, capacity: '800K bpd', rank: 1 },
            { name: 'شنگلی', lat: 37.5, lng: 118.5, capacity: '500K bpd', rank: 2 }
        ],
        coal_mines: [
            { name: 'معادن شانشی', lat: 37.9, lng: 112.5, production: '1B tons/y', rank: 1 },
            { name: 'معادن مغولستان داخلی', lat: 40.8, lng: 111.7, production: '800M tons/y', rank: 2 }
        ],
        iron_mines: [
            { name: 'آنشان', lat: 41.1, lng: 123.0, production: '50M tons/y' }
        ],
        gold_mines: [
            { name: 'معادن شاندونگ', lat: 36.7, lng: 119.0, production: '50 tons/y' }
        ],
        factories: [
            { name: 'BYD شنزن', lat: 22.5, lng: 114.1, type: 'factory_auto', products: 'خودرو برقی' },
            { name: 'فاکسکان', lat: 22.7, lng: 114.3, type: 'factory_tech', products: 'الکترونیک' },
            { name: 'SMIC شانگهای', lat: 31.2, lng: 121.5, type: 'factory_tech', products: 'تراشه' }
        ]
    },

    // ===== آلمان =====
    DE: {
        coal_mines: [
            { name: 'معادن روهر', lat: 51.5, lng: 7.5, production: '50M tons/y', note: 'در حال بسته شدن' }
        ],
        factories: [
            { name: 'مرسدس بنز اشتوتگارت', lat: 48.78, lng: 9.18, type: 'factory_auto', products: 'خودرو لوکس' },
            { name: 'BMW مونیخ', lat: 48.18, lng: 11.56, type: 'factory_auto', products: 'خودرو لوکس' },
            { name: 'فولکس‌واگن ولفسبورگ', lat: 52.42, lng: 10.78, type: 'factory_auto', products: 'خودرو' },
            { name: 'آئودی اینگولشتات', lat: 48.76, lng: 11.42, type: 'factory_auto', products: 'خودرو لوکس' },
            { name: 'پورشه اشتوتگارت', lat: 48.83, lng: 9.15, type: 'factory_auto', products: 'خودرو اسپرت' },
            { name: 'زیمنس مونیخ', lat: 48.15, lng: 11.58, type: 'factory_tech', products: 'تجهیزات صنعتی' },
            { name: 'BASF لودویگسهافن', lat: 49.48, lng: 8.44, type: 'factory_steel', products: 'شیمیایی' }
        ]
    },

    // ===== ژاپن =====
    JP: {
        factories: [
            { name: 'تویوتا سیتی', lat: 35.1, lng: 137.15, type: 'factory_auto', products: 'خودرو' },
            { name: 'هوندا توچیگی', lat: 36.5, lng: 139.9, type: 'factory_auto', products: 'خودرو' },
            { name: 'نیسان یوکوهاما', lat: 35.45, lng: 139.6, type: 'factory_auto', products: 'خودرو' },
            { name: 'سونی توکیو', lat: 35.65, lng: 139.74, type: 'factory_tech', products: 'الکترونیک' },
            { name: 'پاناسونیک اوساکا', lat: 34.7, lng: 135.5, type: 'factory_tech', products: 'الکترونیک' }
        ]
    },

    // ===== امارات =====
    AE: {
        oil_fields: [
            { name: 'زاکوم بالایی', lat: 24.8, lng: 53.4, capacity: '750K bpd', offshore: true },
            { name: 'زاکوم پایینی', lat: 24.5, lng: 53.2, capacity: '400K bpd', offshore: true },
            { name: 'ام‌شیف', lat: 25.0, lng: 53.8, capacity: '180K bpd', offshore: true }
        ],
        gas_fields: [
            { name: 'شاه', lat: 24.2, lng: 53.5, capacity: '1 bcf/d' }
        ],
        refineries: [
            { name: 'پالایشگاه رووایس', lat: 24.1, lng: 52.7, capacity: '940K bpd' }
        ]
    },

    // ===== عراق =====
    IQ: {
        oil_fields: [
            { name: 'رمیله', lat: 30.5, lng: 47.3, capacity: '1.5M bpd', rank: 1 },
            { name: 'مجنون', lat: 31.1, lng: 47.6, capacity: '500K bpd', rank: 2 },
            { name: 'وست قرنه', lat: 30.9, lng: 47.3, capacity: '450K bpd', rank: 3 },
            { name: 'حلفایه', lat: 31.5, lng: 47.5, capacity: '400K bpd', rank: 4 },
            { name: 'کرکوک', lat: 35.5, lng: 44.4, capacity: '300K bpd', rank: 5 }
        ],
        refineries: [
            { name: 'پالایشگاه بیجی', lat: 34.9, lng: 43.5, capacity: '310K bpd' },
            { name: 'پالایشگاه بصره', lat: 30.5, lng: 47.8, capacity: '210K bpd' }
        ]
    },

    // ===== کویت =====
    KW: {
        oil_fields: [
            { name: 'برقان', lat: 29.1, lng: 47.9, capacity: '1.7M bpd', rank: 1, note: 'دومین میدان بزرگ جهان' }
        ],
        refineries: [
            { name: 'الاحمدی', lat: 29.1, lng: 48.1, capacity: '466K bpd' }
        ]
    },

    // ===== قطر =====
    QA: {
        gas_fields: [
            { name: 'گنبد شمالی', lat: 26.0, lng: 52.0, capacity: '2 bcf/d', rank: 1, note: 'بزرگترین میدان گاز جهان', shared: 'IR' }
        ],
        oil_fields: [
            { name: 'دوخان', lat: 25.4, lng: 50.8, capacity: '335K bpd' }
        ]
    },

    // ===== استرالیا =====
    AU: {
        iron_mines: [
            { name: 'پیلبارا', lat: -22.3, lng: 118.6, production: '800M tons/y', rank: 1 }
        ],
        gold_mines: [
            { name: 'سوپر پیت', lat: -30.8, lng: 121.5, production: '25 tons/y' },
            { name: 'بودینگتون', lat: -32.75, lng: 116.4, production: '22 tons/y' }
        ],
        coal_mines: [
            { name: 'هانتر ولی', lat: -32.5, lng: 151.0, production: '170M tons/y' }
        ],
        gas_fields: [
            { name: 'گورگون', lat: -20.5, lng: 116.1, capacity: '15.6 mtpa LNG', offshore: true },
            { name: 'وتستون', lat: -20.5, lng: 116.5, capacity: '8.9 mtpa LNG', offshore: true }
        ]
    },

    // ===== برزیل =====
    BR: {
        oil_platforms: [
            { name: 'حوضه سانتوس', lat: -25.0, lng: -44.0, capacity: '2.5M bpd', offshore: true },
            { name: 'حوضه کامپوس', lat: -22.5, lng: -40.0, capacity: '1.5M bpd', offshore: true }
        ],
        iron_mines: [
            { name: 'کاراژاس', lat: -6.1, lng: -50.3, production: '300M tons/y', rank: 1 }
        ],
        gold_mines: [
            { name: 'پاراکاتو', lat: -17.2, lng: -46.9, production: '15 tons/y' }
        ]
    },

    // ===== آفریقای جنوبی =====
    ZA: {
        gold_mines: [
            { name: 'ویتواترسراند', lat: -26.2, lng: 28.0, production: '100 tons/y', note: 'تاریخی' },
            { name: 'مپونِنگ', lat: -26.4, lng: 27.4, production: '8 tons/y', note: 'عمیق‌ترین معدن جهان' }
        ],
        diamond_mines: [
            { name: 'کیمبرلی', lat: -28.7, lng: 24.8, production: '2M carats/y' },
            { name: 'کالینان', lat: -25.7, lng: 28.5, production: '1M carats/y' }
        ],
        coal_mines: [
            { name: 'معادن مپومالانگا', lat: -26.0, lng: 29.5, production: '250M tons/y' }
        ]
    },

    // ===== کانادا =====
    CA: {
        oil_fields: [
            { name: 'شن‌های نفتی آلبرتا', lat: 56.7, lng: -111.4, capacity: '3M bpd', rank: 1 }
        ],
        gold_mines: [
            { name: 'معادن انتاریو', lat: 48.5, lng: -81.0, production: '100 tons/y' }
        ],
        uranium_mines: [
            { name: 'مک‌آرتور ریور', lat: 57.8, lng: -105.1, production: '7000 tons/y', rank: 1 }
        ]
    },

    // ===== کره جنوبی =====
    KR: {
        factories: [
            { name: 'هیوندای اولسان', lat: 35.55, lng: 129.3, type: 'factory_auto', products: 'خودرو' },
            { name: 'کیا گوانگژو', lat: 35.15, lng: 126.85, type: 'factory_auto', products: 'خودرو' },
            { name: 'سامسونگ سئول', lat: 37.45, lng: 127.05, type: 'factory_tech', products: 'تراشه و موبایل' },
            { name: 'SK هاینیکس', lat: 37.3, lng: 127.1, type: 'factory_tech', products: 'تراشه' },
            { name: 'LG سئول', lat: 37.52, lng: 127.03, type: 'factory_tech', products: 'الکترونیک' }
        ],
        refineries: [
            { name: 'SK انرژی اولسان', lat: 35.5, lng: 129.4, capacity: '840K bpd' }
        ]
    }
};

// تابع گرفتن منابع یک کشور
function getCountryResources(countryCode) {
    return worldResources[countryCode] || null;
}

// تابع گرفتن همه منابع از یک نوع
function getAllResourcesByType(type) {
    const results = [];
    Object.entries(worldResources).forEach(([code, data]) => {
        if (data[type]) {
            data[type].forEach(item => {
                results.push({
                    ...item,
                    countryCode: code,
                    type: type
                });
            });
        }
    });
    return results;
}

// تابع گرفتن همه کارخانه‌ها از یک نوع
function getFactoriesByType(factoryType) {
    const results = [];
    Object.entries(worldResources).forEach(([code, data]) => {
        if (data.factories) {
            data.factories.forEach(factory => {
                if (!factoryType || factory.type === factoryType) {
                    results.push({
                        ...factory,
                        countryCode: code
                    });
                }
            });
        }
    });
    return results;
}

// Export
if (typeof window !== 'undefined') {
    window.RESOURCE_TYPES = RESOURCE_TYPES;
    window.worldResources = worldResources;
    window.getCountryResources = getCountryResources;
    window.getAllResourcesByType = getAllResourcesByType;
    window.getFactoriesByType = getFactoriesByType;
}

