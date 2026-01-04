// ============================================
// 🗺️ داده‌های استان‌ها و شهرهای ایران
// ============================================

// داده‌های استان‌های ایران با مراکز و مختصات
const iranProvinces = {
    'تهران': {
        name: 'تهران',
        nameEn: 'Tehran',
        center: [35.6892, 51.3890],
        cities: [
            { name: 'تهران', coords: [35.6892, 51.3890], population: 8693706 },
            { name: 'اسلامشهر', coords: [35.5446, 51.2302], population: 448129 },
            { name: 'کرج', coords: [35.8327, 50.9916], population: 1592492 },
            { name: 'ورامین', coords: [35.3252, 51.6470], population: 225628 },
            { name: 'شهریار', coords: [35.6597, 51.0590], population: 189120 }
        ]
    },
    'اصفهان': {
        name: 'اصفهان',
        nameEn: 'Isfahan',
        center: [32.6546, 51.6680],
        cities: [
            { name: 'اصفهان', coords: [32.6546, 51.6680], population: 1961260 },
            { name: 'کاشان', coords: [33.9850, 51.4100], population: 304487 },
            { name: 'نجف‌آباد', coords: [32.6333, 51.3667], population: 206114 },
            { name: 'خمینی‌شهر', coords: [32.7000, 51.5167], population: 247128 }
        ]
    },
    'فارس': {
        name: 'فارس',
        nameEn: 'Fars',
        center: [29.5918, 52.5837],
        cities: [
            { name: 'شیراز', coords: [29.5918, 52.5837], population: 1565572 },
            { name: 'مرودشت', coords: [29.8742, 52.8025], population: 148858 },
            { name: 'کازرون', coords: [29.6194, 51.6542], population: 144226 }
        ]
    },
    'خراسان رضوی': {
        name: 'خراسان رضوی',
        nameEn: 'Razavi Khorasan',
        center: [36.2605, 59.6168],
        cities: [
            { name: 'مشهد', coords: [36.2605, 59.6168], population: 3001184 },
            { name: 'نیشابور', coords: [36.2140, 58.7967], population: 239185 },
            { name: 'سبزوار', coords: [36.2142, 57.6798], population: 243700 }
        ]
    },
    'خوزستان': {
        name: 'خوزستان',
        nameEn: 'Khuzestan',
        center: [31.3183, 48.6706],
        cities: [
            { name: 'اهواز', coords: [31.3183, 48.6706], population: 1184788 },
            { name: 'آبادان', coords: [30.3392, 48.3043], population: 231476 },
            { name: 'خرمشهر', coords: [30.4397, 48.1664], population: 170976 },
            { name: 'دزفول', coords: [32.3833, 48.4058], population: 443971 }
        ]
    },
    'آذربایجان شرقی': {
        name: 'آذربایجان شرقی',
        nameEn: 'East Azerbaijan',
        center: [38.0962, 46.2738],
        cities: [
            { name: 'تبریز', coords: [38.0962, 46.2738], population: 1558693 },
            { name: 'مراغه', coords: [37.3891, 46.2375], population: 175255 },
            { name: 'میانه', coords: [37.4211, 47.7150], population: 98003 }
        ]
    },
    'آذربایجان غربی': {
        name: 'آذربایجان غربی',
        nameEn: 'West Azerbaijan',
        center: [37.5527, 45.0759],
        cities: [
            { name: 'ارومیه', coords: [37.5527, 45.0759], population: 736224 },
            { name: 'خوی', coords: [38.5503, 44.9521], population: 200985 }
        ]
    },
    'کرمان': {
        name: 'کرمان',
        nameEn: 'Kerman',
        center: [30.2839, 57.0834],
        cities: [
            { name: 'کرمان', coords: [30.2839, 57.0834], population: 537718 },
            { name: 'رفسنجان', coords: [30.4067, 55.9939], population: 161909 }
        ]
    },
    'گیلان': {
        name: 'گیلان',
        nameEn: 'Gilan',
        center: [37.2774, 49.5890],
        cities: [
            { name: 'رشت', coords: [37.2774, 49.5890], population: 679995 },
            { name: 'انزلی', coords: [37.4727, 49.4627], population: 118564 }
        ]
    },
    'مازندران': {
        name: 'مازندران',
        nameEn: 'Mazandaran',
        center: [36.5656, 53.0588],
        cities: [
            { name: 'ساری', coords: [36.5656, 53.0588], population: 347402 },
            { name: 'بابل', coords: [36.5440, 52.6789], population: 250217 },
            { name: 'آمل', coords: [36.4697, 52.3507], population: 237528 }
        ]
    },
    'کرمانشاه': {
        name: 'کرمانشاه',
        nameEn: 'Kermanshah',
        center: [34.3142, 47.0650],
        cities: [
            { name: 'کرمانشاه', coords: [34.3142, 47.0650], population: 946651 },
            { name: 'اسلام‌آباد غرب', coords: [34.1094, 46.5278], population: 89091 }
        ]
    },
    'یزد': {
        name: 'یزد',
        nameEn: 'Yazd',
        center: [31.8974, 54.3569],
        cities: [
            { name: 'یزد', coords: [31.8974, 54.3569], population: 529673 },
            { name: 'اردکان', coords: [32.3100, 54.0167], population: 75623 }
        ]
    },
    'همدان': {
        name: 'همدان',
        nameEn: 'Hamedan',
        center: [34.7983, 48.5146],
        cities: [
            { name: 'همدان', coords: [34.7983, 48.5146], population: 554406 },
            { name: 'ملایر', coords: [34.2969, 48.8236], population: 170237 }
        ]
    },
    'قم': {
        name: 'قم',
        nameEn: 'Qom',
        center: [34.6416, 50.8746],
        cities: [
            { name: 'قم', coords: [34.6416, 50.8746], population: 1201158 }
        ]
    },
    'البرز': {
        name: 'البرز',
        nameEn: 'Alborz',
        center: [35.8327, 50.9916],
        cities: [
            { name: 'کرج', coords: [35.8327, 50.9916], population: 1592492 },
            { name: 'فردیس', coords: [35.7167, 50.9833], population: 181174 }
        ]
    }
};

// لیست همه شهرهای ایران برای انتخاب
const iranCities = [];
Object.values(iranProvinces).forEach(province => {
    province.cities.forEach(city => {
        iranCities.push({
            name: city.name,
            province: province.name,
            coords: city.coords,
            population: city.population
        });
    });
});

// صادر کردن برای استفاده در سایر فایل‌ها
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { iranProvinces, iranCities };
}

