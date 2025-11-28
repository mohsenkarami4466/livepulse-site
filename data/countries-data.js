// ============================================
// 🌍 داده‌های کامل کشورهای جهان
// ============================================
//
// ⚠️ نکته مهم: این داده‌ها فعلاً MOCK هستن و باید از بک‌اند بارگذاری بشن
//
// 📡 ساختار API پیشنهادی برای بک‌اند:
// 
// GET /api/countries
//   → لیست همه کشورها با اطلاعات پایه
//
// GET /api/countries/{code}
//   → اطلاعات کامل یک کشور
//
// GET /api/countries/{code}/trade
//   → صادرات و واردات کشور
//
// GET /api/countries/{code}/relations
//   → روابط با سایر کشورها
//
// GET /api/conflicts
//   → لیست درگیری‌های فعال
//
// GET /api/resources/{type}
//   → لیست کشورها بر اساس نوع منبع (oil, gas, gold, etc.)
//
// 📊 منابع داده واقعی:
// - World Bank API: https://data.worldbank.org/
// - UN Trade Data: https://comtrade.un.org/
// - IMF Data: https://www.imf.org/en/Data
// - CIA World Factbook: https://www.cia.gov/the-world-factbook/
// - Trading Economics: https://tradingeconomics.com/
//
// 🔄 برای جایگزینی با API واقعی:
// 1. تابع async fetchCountriesData() بنویس
// 2. داده‌های countriesData رو از API پر کن
// 3. کش کن تا هر بار fetch نشه
//
// ============================================

const countriesData = {
  // ===== ایران =====
  "IR": {
    name: "ایران",
    nameEn: "Iran",
    capital: { name: "تهران", coords: [35.6892, 51.3890] },
    continent: "asia",
    // اقتصادی
    gdp: 388, // میلیارد دلار
    gdpRank: 39,
    gdpPerCapita: 4500,
    inflation: 42.5,
    unemployment: 9.2,
    currency: "IRR",
    currencyName: "ریال",
    // جمعیتی
    population: 87000000,
    populationDensity: 52,
    populationGrowth: 0.7,
    // منابع طبیعی
    resources: {
      oil: { reserves: 157800, production: 2546, unit: "mbbl", rank: 4 },
      gas: { reserves: 34020, production: 256, unit: "bcm", rank: 2 },
      gold: { reserves: 320, production: 6.5, unit: "tons", rank: 45 },
      copper: { reserves: 30000, production: 250, unit: "kt", rank: 12 },
      iron: { reserves: 2700, production: 45, unit: "mt", rank: 10 }
    },
    // تجارت (میلیارد دلار)
    exports: {
      total: 58.7,
      partners: [
        { country: "CN", amount: 25.2, percent: 43 },
        { country: "TR", amount: 5.8, percent: 10 },
        { country: "AE", amount: 4.7, percent: 8 },
        { country: "IQ", amount: 4.1, percent: 7 },
        { country: "AF", amount: 2.3, percent: 4 }
      ],
      mainProducts: ["نفت", "پتروشیمی", "فولاد", "مس"]
    },
    imports: {
      total: 52.3,
      partners: [
        { country: "CN", amount: 18.5, percent: 35 },
        { country: "AE", amount: 8.9, percent: 17 },
        { country: "TR", amount: 5.2, percent: 10 },
        { country: "DE", amount: 2.6, percent: 5 },
        { country: "IN", amount: 2.1, percent: 4 }
      ],
      mainProducts: ["ماشین‌آلات", "غلات", "خودرو", "دارو"]
    },
    // ریسک سرمایه‌گذاری (1-100، بالاتر = ریسک بیشتر)
    investmentRisk: 75,
    riskFactors: ["تحریم‌های بین‌المللی", "نوسانات ارزی", "ریسک سیاسی"],
    // روابط با سایر کشورها (green/white/gray/yellow/orange/red)
    relations: {
      "AF": "green", "IQ": "green", "OM": "green", "QA": "white",
      "TR": "white", "RU": "green", "CN": "green", "PK": "green",
      "SA": "orange", "IL": "red", "US": "red", "UK": "gray"
    },
    // جنگ‌ها و درگیری‌ها
    conflicts: [] // فعلاً درگیری مستقیم نظامی نداره
  },

  // ===== روسیه =====
  "RU": {
    name: "روسیه",
    nameEn: "Russia",
    capital: { name: "مسکو", coords: [55.7558, 37.6173] },
    continent: "europe",
    gdp: 1862,
    gdpRank: 11,
    gdpPerCapita: 12800,
    inflation: 7.4,
    unemployment: 3.2,
    currency: "RUB",
    currencyName: "روبل",
    population: 144000000,
    populationDensity: 9,
    populationGrowth: -0.2,
    resources: {
      oil: { reserves: 107800, production: 10500, unit: "mbbl", rank: 2 },
      gas: { reserves: 48938, production: 701, unit: "bcm", rank: 1 },
      gold: { reserves: 5500, production: 330, unit: "tons", rank: 2 },
      iron: { reserves: 25000, production: 100, unit: "mt", rank: 5 },
      diamonds: { reserves: 650, production: 19, unit: "mct", rank: 2 }
    },
    exports: {
      total: 424,
      partners: [
        { country: "CN", amount: 114, percent: 27 },
        { country: "NL", amount: 42, percent: 10 },
        { country: "TR", amount: 34, percent: 8 },
        { country: "DE", amount: 25, percent: 6 },
        { country: "IN", amount: 21, percent: 5 }
      ],
      mainProducts: ["نفت", "گاز", "فلزات", "غلات"]
    },
    imports: {
      total: 276,
      partners: [
        { country: "CN", amount: 110, percent: 40 },
        { country: "DE", amount: 22, percent: 8 },
        { country: "BY", amount: 14, percent: 5 },
        { country: "KR", amount: 11, percent: 4 },
        { country: "TR", amount: 11, percent: 4 }
      ],
      mainProducts: ["ماشین‌آلات", "خودرو", "الکترونیک", "دارو"]
    },
    investmentRisk: 70,
    riskFactors: ["تحریم‌های غربی", "جنگ اوکراین", "ریسک ارزی"],
    relations: {
      "UA": "red", "US": "red", "UK": "red", "DE": "orange",
      "CN": "green", "IR": "green", "BY": "green", "IN": "white",
      "TR": "white", "KZ": "green"
    },
    conflicts: [
      { opponent: "UA", intensity: "war", since: 2022, description: "جنگ اوکراین" }
    ]
  },

  // ===== اوکراین =====
  "UA": {
    name: "اوکراین",
    nameEn: "Ukraine",
    capital: { name: "کی‌یف", coords: [50.4501, 30.5234] },
    continent: "europe",
    gdp: 160,
    gdpRank: 56,
    gdpPerCapita: 4500,
    inflation: 26.6,
    unemployment: 24.5,
    currency: "UAH",
    currencyName: "هریونیا",
    population: 37000000,
    populationDensity: 69,
    populationGrowth: -6.5,
    resources: {
      iron: { reserves: 6500, production: 42, unit: "mt", rank: 7 },
      coal: { reserves: 34000, production: 25, unit: "mt", rank: 15 },
      gas: { reserves: 349, production: 18, unit: "bcm", rank: 30 }
    },
    exports: {
      total: 44,
      partners: [
        { country: "PL", amount: 8.8, percent: 20 },
        { country: "RO", amount: 5.7, percent: 13 },
        { country: "CN", amount: 4.4, percent: 10 },
        { country: "DE", amount: 3.5, percent: 8 },
        { country: "TR", amount: 3.1, percent: 7 }
      ],
      mainProducts: ["غلات", "آهن", "فولاد", "روغن آفتابگردان"]
    },
    imports: {
      total: 55,
      partners: [
        { country: "CN", amount: 9.9, percent: 18 },
        { country: "PL", amount: 8.2, percent: 15 },
        { country: "DE", amount: 6.6, percent: 12 },
        { country: "US", amount: 4.4, percent: 8 },
        { country: "TR", amount: 3.3, percent: 6 }
      ],
      mainProducts: ["سوخت", "ماشین‌آلات", "خودرو", "دارو"]
    },
    investmentRisk: 95,
    riskFactors: ["جنگ فعال", "زیرساخت آسیب‌دیده", "عدم اطمینان"],
    relations: {
      "RU": "red", "BY": "red",
      "US": "green", "UK": "green", "DE": "green", "PL": "green",
      "FR": "green", "EU": "green"
    },
    conflicts: [
      { opponent: "RU", intensity: "war", since: 2022, description: "تهاجم روسیه" }
    ]
  },

  // ===== آمریکا =====
  "US": {
    name: "آمریکا",
    nameEn: "United States",
    capital: { name: "واشنگتن", coords: [38.9072, -77.0369] },
    continent: "north_america",
    gdp: 25462,
    gdpRank: 1,
    gdpPerCapita: 76000,
    inflation: 3.4,
    unemployment: 3.7,
    currency: "USD",
    currencyName: "دلار",
    population: 335000000,
    populationDensity: 36,
    populationGrowth: 0.4,
    resources: {
      oil: { reserves: 68800, production: 12900, unit: "mbbl", rank: 1 },
      gas: { reserves: 13180, production: 978, unit: "bcm", rank: 1 },
      gold: { reserves: 3000, production: 170, unit: "tons", rank: 5 },
      coal: { reserves: 249000, production: 535, unit: "mt", rank: 3 }
    },
    exports: {
      total: 2065,
      partners: [
        { country: "CA", amount: 372, percent: 18 },
        { country: "MX", amount: 324, percent: 16 },
        { country: "CN", amount: 154, percent: 7 },
        { country: "JP", amount: 80, percent: 4 },
        { country: "UK", amount: 76, percent: 4 }
      ],
      mainProducts: ["ماشین‌آلات", "الکترونیک", "هواپیما", "نفت"]
    },
    imports: {
      total: 3277,
      partners: [
        { country: "CN", amount: 536, percent: 16 },
        { country: "MX", amount: 455, percent: 14 },
        { country: "CA", amount: 426, percent: 13 },
        { country: "JP", amount: 147, percent: 4 },
        { country: "DE", amount: 147, percent: 4 }
      ],
      mainProducts: ["الکترونیک", "ماشین‌آلات", "خودرو", "نفت"]
    },
    investmentRisk: 15,
    riskFactors: ["بدهی ملی بالا", "تنش‌های تجاری"],
    relations: {
      "CA": "green", "MX": "green", "UK": "green", "JP": "green",
      "DE": "green", "FR": "green", "AU": "green", "KR": "green",
      "CN": "orange", "RU": "red", "IR": "red", "KP": "red"
    },
    conflicts: []
  },

  // ===== چین =====
  "CN": {
    name: "چین",
    nameEn: "China",
    capital: { name: "پکن", coords: [39.9042, 116.4074] },
    continent: "asia",
    gdp: 17963,
    gdpRank: 2,
    gdpPerCapita: 12700,
    inflation: 0.2,
    unemployment: 5.2,
    currency: "CNY",
    currencyName: "یوان",
    population: 1412000000,
    populationDensity: 153,
    populationGrowth: -0.1,
    resources: {
      coal: { reserves: 143000, production: 4500, unit: "mt", rank: 1 },
      gold: { reserves: 2800, production: 370, unit: "tons", rank: 1 },
      iron: { reserves: 21000, production: 340, unit: "mt", rank: 1 },
      rareEarth: { reserves: 44000, production: 210, unit: "kt", rank: 1 }
    },
    exports: {
      total: 3593,
      partners: [
        { country: "US", amount: 536, percent: 15 },
        { country: "HK", amount: 287, percent: 8 },
        { country: "JP", amount: 179, percent: 5 },
        { country: "KR", amount: 162, percent: 4.5 },
        { country: "VN", amount: 143, percent: 4 }
      ],
      mainProducts: ["الکترونیک", "ماشین‌آلات", "منسوجات", "فلزات"]
    },
    imports: {
      total: 2716,
      partners: [
        { country: "KR", amount: 217, percent: 8 },
        { country: "JP", amount: 190, percent: 7 },
        { country: "US", amount: 163, percent: 6 },
        { country: "AU", amount: 163, percent: 6 },
        { country: "TW", amount: 155, percent: 5.7 }
      ],
      mainProducts: ["نفت", "مدارهای مجتمع", "سنگ آهن", "گاز"]
    },
    investmentRisk: 35,
    riskFactors: ["تنش با تایوان", "مقررات سختگیرانه", "ریسک ژئوپلیتیک"],
    relations: {
      "RU": "green", "IR": "green", "PK": "green", "KP": "green",
      "US": "orange", "JP": "orange", "TW": "red", "IN": "orange",
      "AU": "orange", "KR": "white"
    },
    conflicts: []
  },

  // ===== عربستان =====
  "SA": {
    name: "عربستان سعودی",
    nameEn: "Saudi Arabia",
    capital: { name: "ریاض", coords: [24.7136, 46.6753] },
    continent: "asia",
    gdp: 1069,
    gdpRank: 18,
    gdpPerCapita: 30000,
    inflation: 2.3,
    unemployment: 4.8,
    currency: "SAR",
    currencyName: "ریال",
    population: 36000000,
    populationDensity: 16,
    populationGrowth: 1.5,
    resources: {
      oil: { reserves: 297500, production: 10200, unit: "mbbl", rank: 2 },
      gas: { reserves: 9423, production: 117, unit: "bcm", rank: 6 },
      gold: { reserves: 430, production: 12, unit: "tons", rank: 35 }
    },
    exports: {
      total: 410,
      partners: [
        { country: "CN", amount: 74, percent: 18 },
        { country: "JP", amount: 45, percent: 11 },
        { country: "IN", amount: 41, percent: 10 },
        { country: "KR", amount: 37, percent: 9 },
        { country: "US", amount: 33, percent: 8 }
      ],
      mainProducts: ["نفت خام", "محصولات پتروشیمی", "پلاستیک"]
    },
    imports: {
      total: 185,
      partners: [
        { country: "CN", amount: 37, percent: 20 },
        { country: "US", amount: 22, percent: 12 },
        { country: "AE", amount: 15, percent: 8 },
        { country: "DE", amount: 11, percent: 6 },
        { country: "IN", amount: 9, percent: 5 }
      ],
      mainProducts: ["ماشین‌آلات", "خودرو", "تجهیزات الکترونیکی", "غذا"]
    },
    investmentRisk: 30,
    riskFactors: ["وابستگی به نفت", "تنش‌های منطقه‌ای"],
    relations: {
      "AE": "green", "EG": "green", "US": "green", "UK": "green",
      "IR": "orange", "QA": "white", "TR": "white", "IL": "white",
      "YE": "red"
    },
    conflicts: [
      { opponent: "YE", intensity: "tension", since: 2015, description: "درگیری یمن" }
    ]
  },

  // ===== امارات =====
  "AE": {
    name: "امارات متحده عربی",
    nameEn: "United Arab Emirates",
    capital: { name: "ابوظبی", coords: [24.4539, 54.3773] },
    continent: "asia",
    gdp: 507,
    gdpRank: 31,
    gdpPerCapita: 50000,
    inflation: 3.1,
    unemployment: 2.9,
    currency: "AED",
    currencyName: "درهم",
    population: 10000000,
    populationDensity: 120,
    populationGrowth: 0.8,
    resources: {
      oil: { reserves: 97800, production: 2900, unit: "mbbl", rank: 7 },
      gas: { reserves: 6091, production: 59, unit: "bcm", rank: 15 }
    },
    exports: {
      total: 424,
      partners: [
        { country: "IN", amount: 55, percent: 13 },
        { country: "JP", amount: 42, percent: 10 },
        { country: "CN", amount: 38, percent: 9 },
        { country: "SA", amount: 30, percent: 7 },
        { country: "KR", amount: 25, percent: 6 }
      ],
      mainProducts: ["نفت", "طلا", "الماس", "آلومینیوم"]
    },
    imports: {
      total: 365,
      partners: [
        { country: "CN", amount: 66, percent: 18 },
        { country: "IN", amount: 40, percent: 11 },
        { country: "US", amount: 33, percent: 9 },
        { country: "UK", amount: 18, percent: 5 },
        { country: "JP", amount: 15, percent: 4 }
      ],
      mainProducts: ["طلا", "ماشین‌آلات", "الکترونیک", "خودرو"]
    },
    investmentRisk: 20,
    riskFactors: ["رقابت منطقه‌ای"],
    relations: {
      "SA": "green", "US": "green", "UK": "green", "IN": "green",
      "IR": "white", "QA": "white", "IL": "green"
    },
    conflicts: []
  },

  // ===== ترکیه =====
  "TR": {
    name: "ترکیه",
    nameEn: "Turkey",
    capital: { name: "آنکارا", coords: [39.9334, 32.8597] },
    continent: "asia",
    gdp: 905,
    gdpRank: 19,
    gdpPerCapita: 10700,
    inflation: 65,
    unemployment: 9.4,
    currency: "TRY",
    currencyName: "لیر",
    population: 85000000,
    populationDensity: 110,
    populationGrowth: 0.5,
    resources: {
      coal: { reserves: 19000, production: 90, unit: "mt", rank: 15 },
      chromium: { reserves: 100, production: 10, unit: "mt", rank: 4 },
      boron: { reserves: 950, production: 2.5, unit: "mt", rank: 1 }
    },
    exports: {
      total: 254,
      partners: [
        { country: "DE", amount: 38, percent: 15 },
        { country: "US", amount: 23, percent: 9 },
        { country: "UK", amount: 18, percent: 7 },
        { country: "IQ", amount: 15, percent: 6 },
        { country: "IT", amount: 13, percent: 5 }
      ],
      mainProducts: ["خودرو", "ماشین‌آلات", "منسوجات", "طلا"]
    },
    imports: {
      total: 361,
      partners: [
        { country: "RU", amount: 54, percent: 15 },
        { country: "CN", amount: 47, percent: 13 },
        { country: "DE", amount: 36, percent: 10 },
        { country: "US", amount: 22, percent: 6 },
        { country: "IT", amount: 14, percent: 4 }
      ],
      mainProducts: ["نفت", "گاز", "ماشین‌آلات", "الکترونیک"]
    },
    investmentRisk: 55,
    riskFactors: ["تورم بالا", "نوسانات ارزی", "ریسک سیاسی"],
    relations: {
      "AZ": "green", "GE": "green", "QA": "green",
      "RU": "white", "US": "white", "IR": "white",
      "GR": "orange", "CY": "orange", "SY": "orange"
    },
    conflicts: [
      { opponent: "SY", intensity: "tension", since: 2016, description: "مداخله در سوریه" }
    ]
  },

  // ===== آلمان =====
  "DE": {
    name: "آلمان",
    nameEn: "Germany",
    capital: { name: "برلین", coords: [52.5200, 13.4050] },
    continent: "europe",
    gdp: 4259,
    gdpRank: 4,
    gdpPerCapita: 51000,
    inflation: 5.9,
    unemployment: 3.1,
    currency: "EUR",
    currencyName: "یورو",
    population: 84000000,
    populationDensity: 240,
    populationGrowth: 0.1,
    resources: {
      coal: { reserves: 35900, production: 107, unit: "mt", rank: 8 },
      potash: { reserves: 150, production: 2.8, unit: "mt", rank: 5 }
    },
    exports: {
      total: 1655,
      partners: [
        { country: "US", amount: 165, percent: 10 },
        { country: "FR", amount: 132, percent: 8 },
        { country: "CN", amount: 116, percent: 7 },
        { country: "NL", amount: 116, percent: 7 },
        { country: "AT", amount: 83, percent: 5 }
      ],
      mainProducts: ["خودرو", "ماشین‌آلات", "شیمیایی", "الکترونیک"]
    },
    imports: {
      total: 1462,
      partners: [
        { country: "CN", amount: 190, percent: 13 },
        { country: "NL", amount: 146, percent: 10 },
        { country: "US", amount: 102, percent: 7 },
        { country: "PL", amount: 88, percent: 6 },
        { country: "IT", amount: 73, percent: 5 }
      ],
      mainProducts: ["ماشین‌آلات", "الکترونیک", "نفت", "خودرو"]
    },
    investmentRisk: 12,
    riskFactors: ["وابستگی انرژی", "کمبود نیروی کار"],
    relations: {
      "FR": "green", "US": "green", "UK": "green", "PL": "green",
      "IT": "green", "NL": "green", "AT": "green",
      "RU": "orange", "CN": "white", "TR": "white"
    },
    conflicts: []
  },

  // ===== انگلیس =====
  "UK": {
    name: "بریتانیا",
    nameEn: "United Kingdom",
    capital: { name: "لندن", coords: [51.5074, -0.1278] },
    continent: "europe",
    gdp: 3158,
    gdpRank: 6,
    gdpPerCapita: 46500,
    inflation: 4.0,
    unemployment: 4.2,
    currency: "GBP",
    currencyName: "پوند",
    population: 68000000,
    populationDensity: 281,
    populationGrowth: 0.3,
    resources: {
      oil: { reserves: 2500, production: 770, unit: "mbbl", rank: 21 },
      gas: { reserves: 180, production: 32, unit: "bcm", rank: 23 }
    },
    exports: {
      total: 505,
      partners: [
        { country: "US", amount: 75, percent: 15 },
        { country: "DE", amount: 45, percent: 9 },
        { country: "NL", amount: 40, percent: 8 },
        { country: "FR", amount: 35, percent: 7 },
        { country: "IE", amount: 30, percent: 6 }
      ],
      mainProducts: ["ماشین‌آلات", "خودرو", "طلا", "دارو"]
    },
    imports: {
      total: 692,
      partners: [
        { country: "CN", amount: 97, percent: 14 },
        { country: "DE", amount: 76, percent: 11 },
        { country: "US", amount: 62, percent: 9 },
        { country: "NL", amount: 48, percent: 7 },
        { country: "FR", amount: 41, percent: 6 }
      ],
      mainProducts: ["ماشین‌آلات", "خودرو", "الکترونیک", "طلا"]
    },
    investmentRisk: 18,
    riskFactors: ["تاثیرات برکسیت", "تورم"],
    relations: {
      "US": "green", "FR": "green", "DE": "green", "AU": "green",
      "CA": "green", "JP": "green", "UA": "green",
      "RU": "red", "IR": "gray", "CN": "orange"
    },
    conflicts: []
  },

  // ===== فرانسه =====
  "FR": {
    name: "فرانسه",
    nameEn: "France",
    capital: { name: "پاریس", coords: [48.8566, 2.3522] },
    continent: "europe",
    gdp: 2923,
    gdpRank: 7,
    gdpPerCapita: 43500,
    inflation: 4.9,
    unemployment: 7.1,
    currency: "EUR",
    currencyName: "یورو",
    population: 68000000,
    populationDensity: 119,
    populationGrowth: 0.2,
    resources: {
      uranium: { reserves: 10, production: 0, unit: "kt", rank: 20 }
    },
    exports: {
      total: 617,
      partners: [
        { country: "DE", amount: 86, percent: 14 },
        { country: "IT", amount: 49, percent: 8 },
        { country: "US", amount: 49, percent: 8 },
        { country: "ES", amount: 43, percent: 7 },
        { country: "UK", amount: 43, percent: 7 }
      ],
      mainProducts: ["هواپیما", "خودرو", "دارو", "شراب"]
    },
    imports: {
      total: 714,
      partners: [
        { country: "DE", amount: 114, percent: 16 },
        { country: "CN", amount: 79, percent: 11 },
        { country: "IT", amount: 57, percent: 8 },
        { country: "BE", amount: 50, percent: 7 },
        { country: "NL", amount: 43, percent: 6 }
      ],
      mainProducts: ["ماشین‌آلات", "خودرو", "نفت", "الکترونیک"]
    },
    investmentRisk: 15,
    riskFactors: ["بدهی عمومی", "اعتصابات"],
    relations: {
      "DE": "green", "US": "green", "UK": "green", "IT": "green",
      "ES": "green", "UA": "green",
      "RU": "orange", "CN": "white"
    },
    conflicts: []
  },

  // ===== ژاپن =====
  "JP": {
    name: "ژاپن",
    nameEn: "Japan",
    capital: { name: "توکیو", coords: [35.6762, 139.6503] },
    continent: "asia",
    gdp: 4231,
    gdpRank: 5,
    gdpPerCapita: 34000,
    inflation: 3.3,
    unemployment: 2.6,
    currency: "JPY",
    currencyName: "ین",
    population: 125000000,
    populationDensity: 347,
    populationGrowth: -0.5,
    resources: {
      gold: { reserves: 200, production: 6.5, unit: "tons", rank: 50 }
    },
    exports: {
      total: 756,
      partners: [
        { country: "CN", amount: 151, percent: 20 },
        { country: "US", amount: 143, percent: 19 },
        { country: "KR", amount: 53, percent: 7 },
        { country: "TW", amount: 53, percent: 7 },
        { country: "HK", amount: 38, percent: 5 }
      ],
      mainProducts: ["خودرو", "ماشین‌آلات", "الکترونیک", "فولاد"]
    },
    imports: {
      total: 897,
      partners: [
        { country: "CN", amount: 197, percent: 22 },
        { country: "AU", amount: 99, percent: 11 },
        { country: "US", amount: 90, percent: 10 },
        { country: "AE", amount: 63, percent: 7 },
        { country: "SA", amount: 54, percent: 6 }
      ],
      mainProducts: ["نفت", "گاز", "ماشین‌آلات", "الکترونیک"]
    },
    investmentRisk: 12,
    riskFactors: ["جمعیت پیر", "بدهی بالا"],
    relations: {
      "US": "green", "AU": "green", "IN": "green", "UK": "green",
      "KR": "white", "CN": "orange", "RU": "orange", "KP": "red"
    },
    conflicts: []
  },

  // ===== هند =====
  "IN": {
    name: "هند",
    nameEn: "India",
    capital: { name: "دهلی نو", coords: [28.6139, 77.2090] },
    continent: "asia",
    gdp: 3535,
    gdpRank: 5,
    gdpPerCapita: 2500,
    inflation: 5.1,
    unemployment: 7.8,
    currency: "INR",
    currencyName: "روپیه",
    population: 1428000000,
    populationDensity: 464,
    populationGrowth: 0.8,
    resources: {
      coal: { reserves: 111000, production: 893, unit: "mt", rank: 2 },
      iron: { reserves: 5500, production: 240, unit: "mt", rank: 4 },
      mica: { reserves: 4000, production: 15, unit: "kt", rank: 1 }
    },
    exports: {
      total: 453,
      partners: [
        { country: "US", amount: 86, percent: 19 },
        { country: "AE", amount: 32, percent: 7 },
        { country: "NL", amount: 23, percent: 5 },
        { country: "CN", amount: 23, percent: 5 },
        { country: "UK", amount: 18, percent: 4 }
      ],
      mainProducts: ["نفت پالایش‌شده", "الماس", "دارو", "نرم‌افزار"]
    },
    imports: {
      total: 714,
      partners: [
        { country: "CN", amount: 107, percent: 15 },
        { country: "AE", amount: 50, percent: 7 },
        { country: "US", amount: 50, percent: 7 },
        { country: "SA", amount: 43, percent: 6 },
        { country: "RU", amount: 36, percent: 5 }
      ],
      mainProducts: ["نفت خام", "طلا", "الماس", "الکترونیک"]
    },
    investmentRisk: 35,
    riskFactors: ["بوروکراسی", "تنش مرزی با چین"],
    relations: {
      "US": "green", "JP": "green", "AU": "green", "UK": "green",
      "AE": "green", "IR": "white", "RU": "green",
      "CN": "orange", "PK": "red"
    },
    conflicts: [
      { opponent: "PK", intensity: "tension", since: 1947, description: "اختلاف کشمیر" }
    ]
  },

  // ===== پاکستان =====
  "PK": {
    name: "پاکستان",
    nameEn: "Pakistan",
    capital: { name: "اسلام‌آباد", coords: [33.6844, 73.0479] },
    continent: "asia",
    gdp: 376,
    gdpRank: 43,
    gdpPerCapita: 1650,
    inflation: 29.2,
    unemployment: 6.2,
    currency: "PKR",
    currencyName: "روپیه",
    population: 230000000,
    populationDensity: 287,
    populationGrowth: 1.9,
    resources: {
      coal: { reserves: 7800, production: 4, unit: "mt", rank: 35 },
      copper: { reserves: 5900, production: 15, unit: "kt", rank: 25 }
    },
    exports: {
      total: 31,
      partners: [
        { country: "US", amount: 5.6, percent: 18 },
        { country: "DE", amount: 2.8, percent: 9 },
        { country: "UK", amount: 2.5, percent: 8 },
        { country: "CN", amount: 2.2, percent: 7 },
        { country: "AE", amount: 1.9, percent: 6 }
      ],
      mainProducts: ["منسوجات", "برنج", "پوشاک", "چرم"]
    },
    imports: {
      total: 60,
      partners: [
        { country: "CN", amount: 18, percent: 30 },
        { country: "AE", amount: 7.8, percent: 13 },
        { country: "SA", amount: 5.4, percent: 9 },
        { country: "ID", amount: 3, percent: 5 },
        { country: "KW", amount: 2.4, percent: 4 }
      ],
      mainProducts: ["نفت", "ماشین‌آلات", "الکترونیک", "غذا"]
    },
    investmentRisk: 70,
    riskFactors: ["بی‌ثباتی سیاسی", "بحران ارزی", "تروریسم"],
    relations: {
      "CN": "green", "SA": "green", "TR": "green", "AE": "white",
      "AF": "orange", "IN": "red", "US": "white"
    },
    conflicts: [
      { opponent: "IN", intensity: "tension", since: 1947, description: "اختلاف کشمیر" }
    ]
  },

  // ===== استرالیا =====
  "AU": {
    name: "استرالیا",
    nameEn: "Australia",
    capital: { name: "کانبرا", coords: [-35.2809, 149.1300] },
    continent: "oceania",
    gdp: 1675,
    gdpRank: 13,
    gdpPerCapita: 65000,
    inflation: 4.1,
    unemployment: 3.5,
    currency: "AUD",
    currencyName: "دلار",
    population: 26000000,
    populationDensity: 3,
    populationGrowth: 1.1,
    resources: {
      iron: { reserves: 50000, production: 900, unit: "mt", rank: 1 },
      gold: { reserves: 11000, production: 320, unit: "tons", rank: 2 },
      coal: { reserves: 150000, production: 473, unit: "mt", rank: 4 },
      uranium: { reserves: 1684, production: 4.5, unit: "kt", rank: 3 }
    },
    exports: {
      total: 464,
      partners: [
        { country: "CN", amount: 149, percent: 32 },
        { country: "JP", amount: 65, percent: 14 },
        { country: "KR", amount: 37, percent: 8 },
        { country: "IN", amount: 28, percent: 6 },
        { country: "US", amount: 23, percent: 5 }
      ],
      mainProducts: ["سنگ آهن", "زغال‌سنگ", "گاز", "طلا"]
    },
    imports: {
      total: 298,
      partners: [
        { country: "CN", amount: 89, percent: 30 },
        { country: "US", amount: 30, percent: 10 },
        { country: "JP", amount: 21, percent: 7 },
        { country: "KR", amount: 18, percent: 6 },
        { country: "TH", amount: 15, percent: 5 }
      ],
      mainProducts: ["ماشین‌آلات", "خودرو", "الکترونیک", "نفت"]
    },
    investmentRisk: 10,
    riskFactors: ["وابستگی به چین", "آب و هوای شدید"],
    relations: {
      "US": "green", "UK": "green", "JP": "green", "NZ": "green",
      "IN": "green", "KR": "green",
      "CN": "orange"
    },
    conflicts: []
  },

  // ===== برزیل =====
  "BR": {
    name: "برزیل",
    nameEn: "Brazil",
    capital: { name: "برازیلیا", coords: [-15.7975, -47.8919] },
    continent: "south_america",
    gdp: 2081,
    gdpRank: 9,
    gdpPerCapita: 9700,
    inflation: 4.6,
    unemployment: 7.8,
    currency: "BRL",
    currencyName: "رئال",
    population: 215000000,
    populationDensity: 25,
    populationGrowth: 0.5,
    resources: {
      iron: { reserves: 29000, production: 410, unit: "mt", rank: 2 },
      gold: { reserves: 2400, production: 100, unit: "tons", rank: 10 },
      oil: { reserves: 12714, production: 3000, unit: "mbbl", rank: 9 },
      niobium: { reserves: 8500, production: 71, unit: "kt", rank: 1 }
    },
    exports: {
      total: 334,
      partners: [
        { country: "CN", amount: 87, percent: 26 },
        { country: "US", amount: 40, percent: 12 },
        { country: "AR", amount: 17, percent: 5 },
        { country: "NL", amount: 13, percent: 4 },
        { country: "ES", amount: 10, percent: 3 }
      ],
      mainProducts: ["سویا", "سنگ آهن", "نفت", "گوشت"]
    },
    imports: {
      total: 272,
      partners: [
        { country: "CN", amount: 60, percent: 22 },
        { country: "US", amount: 49, percent: 18 },
        { country: "DE", amount: 16, percent: 6 },
        { country: "AR", amount: 14, percent: 5 },
        { country: "IN", amount: 11, percent: 4 }
      ],
      mainProducts: ["ماشین‌آلات", "الکترونیک", "شیمیایی", "نفت"]
    },
    investmentRisk: 40,
    riskFactors: ["بی‌ثباتی سیاسی", "فساد"],
    relations: {
      "AR": "green", "US": "white", "CN": "green",
      "EU": "white"
    },
    conflicts: []
  },

  // ===== کانادا =====
  "CA": {
    name: "کانادا",
    nameEn: "Canada",
    capital: { name: "اتاوا", coords: [45.4215, -75.6972] },
    continent: "north_america",
    gdp: 2139,
    gdpRank: 8,
    gdpPerCapita: 55000,
    inflation: 3.4,
    unemployment: 5.4,
    currency: "CAD",
    currencyName: "دلار",
    population: 39000000,
    populationDensity: 4,
    populationGrowth: 0.9,
    resources: {
      oil: { reserves: 168100, production: 5050, unit: "mbbl", rank: 3 },
      gas: { reserves: 2056, production: 185, unit: "bcm", rank: 5 },
      gold: { reserves: 2200, production: 200, unit: "tons", rank: 4 },
      potash: { reserves: 1000, production: 14, unit: "mt", rank: 1 }
    },
    exports: {
      total: 598,
      partners: [
        { country: "US", amount: 449, percent: 75 },
        { country: "CN", amount: 24, percent: 4 },
        { country: "UK", amount: 18, percent: 3 },
        { country: "JP", amount: 12, percent: 2 },
        { country: "MX", amount: 6, percent: 1 }
      ],
      mainProducts: ["نفت", "خودرو", "طلا", "گاز"]
    },
    imports: {
      total: 566,
      partners: [
        { country: "US", amount: 283, percent: 50 },
        { country: "CN", amount: 79, percent: 14 },
        { country: "MX", amount: 34, percent: 6 },
        { country: "DE", amount: 23, percent: 4 },
        { country: "JP", amount: 17, percent: 3 }
      ],
      mainProducts: ["خودرو", "ماشین‌آلات", "الکترونیک", "نفت"]
    },
    investmentRisk: 10,
    riskFactors: [],
    relations: {
      "US": "green", "UK": "green", "FR": "green", "AU": "green",
      "JP": "green", "MX": "green",
      "CN": "orange", "RU": "orange"
    },
    conflicts: []
  },

  // ===== اسرائیل =====
  "IL": {
    name: "اسرائیل",
    nameEn: "Israel",
    capital: { name: "تل‌آویو", coords: [32.0853, 34.7818] },
    continent: "asia",
    gdp: 525,
    gdpRank: 28,
    gdpPerCapita: 55000,
    inflation: 4.3,
    unemployment: 3.8,
    currency: "ILS",
    currencyName: "شکل",
    population: 9500000,
    populationDensity: 432,
    populationGrowth: 1.8,
    resources: {
      gas: { reserves: 535, production: 22, unit: "bcm", rank: 28 },
      potash: { reserves: 580, production: 2.2, unit: "mt", rank: 6 }
    },
    exports: {
      total: 166,
      partners: [
        { country: "US", amount: 43, percent: 26 },
        { country: "CN", amount: 13, percent: 8 },
        { country: "UK", amount: 10, percent: 6 },
        { country: "HK", amount: 8, percent: 5 },
        { country: "IN", amount: 7, percent: 4 }
      ],
      mainProducts: ["الماس", "تجهیزات پزشکی", "الکترونیک", "دارو"]
    },
    imports: {
      total: 118,
      partners: [
        { country: "CN", amount: 19, percent: 16 },
        { country: "US", amount: 14, percent: 12 },
        { country: "DE", amount: 8, percent: 7 },
        { country: "TR", amount: 7, percent: 6 },
        { country: "CH", amount: 6, percent: 5 }
      ],
      mainProducts: ["نفت", "ماشین‌آلات", "الماس", "خودرو"]
    },
    investmentRisk: 40,
    riskFactors: ["تنش با فلسطین", "ریسک امنیتی"],
    relations: {
      "US": "green", "UK": "green", "DE": "green", "AE": "green",
      "EG": "white", "JO": "white",
      "IR": "red", "SY": "red", "LB": "red", "PS": "red"
    },
    conflicts: [
      { opponent: "PS", intensity: "war", since: 2023, description: "جنگ غزه" }
    ]
  },

  // ===== افغانستان =====
  "AF": {
    name: "افغانستان",
    nameEn: "Afghanistan",
    capital: { name: "کابل", coords: [34.5553, 69.2075] },
    continent: "asia",
    gdp: 14,
    gdpRank: 145,
    gdpPerCapita: 350,
    inflation: 10,
    unemployment: 25,
    currency: "AFN",
    currencyName: "افغانی",
    population: 42000000,
    populationDensity: 64,
    populationGrowth: 2.3,
    resources: {
      copper: { reserves: 30000, production: 0, unit: "kt", rank: 8 },
      iron: { reserves: 2200, production: 0, unit: "mt", rank: 15 },
      lithium: { reserves: 1000, production: 0, unit: "kt", rank: 5 }
    },
    exports: {
      total: 1.8,
      partners: [
        { country: "PK", amount: 0.9, percent: 50 },
        { country: "IN", amount: 0.27, percent: 15 },
        { country: "IR", amount: 0.18, percent: 10 },
        { country: "CN", amount: 0.09, percent: 5 }
      ],
      mainProducts: ["میوه خشک", "فرش", "زعفران", "سنگ"]
    },
    imports: {
      total: 7.5,
      partners: [
        { country: "IR", amount: 2.25, percent: 30 },
        { country: "PK", amount: 1.5, percent: 20 },
        { country: "CN", amount: 0.75, percent: 10 },
        { country: "KZ", amount: 0.6, percent: 8 }
      ],
      mainProducts: ["سوخت", "غذا", "پوشاک", "مصالح ساختمانی"]
    },
    investmentRisk: 95,
    riskFactors: ["طالبان", "بی‌ثباتی", "تحریم"],
    relations: {
      "IR": "green", "PK": "orange", "CN": "white",
      "US": "red", "UK": "gray", "IN": "white"
    },
    conflicts: []
  },

  // ===== عراق =====
  "IQ": {
    name: "عراق",
    nameEn: "Iraq",
    capital: { name: "بغداد", coords: [33.3152, 44.3661] },
    continent: "asia",
    gdp: 267,
    gdpRank: 48,
    gdpPerCapita: 6300,
    inflation: 4.4,
    unemployment: 14,
    currency: "IQD",
    currencyName: "دینار",
    population: 43000000,
    populationDensity: 99,
    populationGrowth: 2.3,
    resources: {
      oil: { reserves: 145019, production: 4100, unit: "mbbl", rank: 5 },
      gas: { reserves: 3158, production: 9.4, unit: "bcm", rank: 12 }
    },
    exports: {
      total: 115,
      partners: [
        { country: "CN", amount: 34.5, percent: 30 },
        { country: "IN", amount: 25.3, percent: 22 },
        { country: "KR", amount: 13.8, percent: 12 },
        { country: "US", amount: 9.2, percent: 8 },
        { country: "IT", amount: 5.75, percent: 5 }
      ],
      mainProducts: ["نفت خام"]
    },
    imports: {
      total: 55,
      partners: [
        { country: "TR", amount: 13.75, percent: 25 },
        { country: "CN", amount: 13.2, percent: 24 },
        { country: "IR", amount: 5.5, percent: 10 },
        { country: "AE", amount: 4.4, percent: 8 },
        { country: "KR", amount: 2.75, percent: 5 }
      ],
      mainProducts: ["غذا", "ماشین‌آلات", "لوازم خانگی", "دارو"]
    },
    investmentRisk: 65,
    riskFactors: ["فساد", "بی‌ثباتی سیاسی", "داعش"],
    relations: {
      "IR": "green", "TR": "white", "US": "white",
      "SA": "white", "KW": "white"
    },
    conflicts: []
  },

  // ===== کره جنوبی =====
  "KR": {
    name: "کره جنوبی",
    nameEn: "South Korea",
    capital: { name: "سئول", coords: [37.5665, 126.9780] },
    continent: "asia",
    gdp: 1665,
    gdpRank: 14,
    gdpPerCapita: 32000,
    inflation: 3.6,
    unemployment: 2.7,
    currency: "KRW",
    currencyName: "وون",
    population: 52000000,
    populationDensity: 527,
    populationGrowth: -0.2,
    resources: {},
    exports: {
      total: 683,
      partners: [
        { country: "CN", amount: 164, percent: 24 },
        { country: "US", amount: 123, percent: 18 },
        { country: "VN", amount: 62, percent: 9 },
        { country: "JP", amount: 34, percent: 5 },
        { country: "HK", amount: 27, percent: 4 }
      ],
      mainProducts: ["نیمه‌هادی", "خودرو", "کشتی", "الکترونیک"]
    },
    imports: {
      total: 683,
      partners: [
        { country: "CN", amount: 171, percent: 25 },
        { country: "US", amount: 82, percent: 12 },
        { country: "JP", amount: 61, percent: 9 },
        { country: "AU", amount: 48, percent: 7 },
        { country: "SA", amount: 41, percent: 6 }
      ],
      mainProducts: ["نفت", "نیمه‌هادی", "گاز", "فولاد"]
    },
    investmentRisk: 15,
    riskFactors: ["تهدید کره شمالی"],
    relations: {
      "US": "green", "JP": "white", "AU": "green",
      "CN": "orange", "KP": "red"
    },
    conflicts: [
      { opponent: "KP", intensity: "tension", since: 1950, description: "تنش با کره شمالی" }
    ]
  },

  // ===== کره شمالی =====
  "KP": {
    name: "کره شمالی",
    nameEn: "North Korea",
    capital: { name: "پیونگ‌یانگ", coords: [39.0392, 125.7625] },
    continent: "asia",
    gdp: 18,
    gdpRank: 140,
    gdpPerCapita: 700,
    inflation: 0,
    unemployment: 3,
    currency: "KPW",
    currencyName: "وون",
    population: 26000000,
    populationDensity: 214,
    populationGrowth: 0.4,
    resources: {
      coal: { reserves: 600, production: 16, unit: "mt", rank: 30 },
      iron: { reserves: 3000, production: 2.9, unit: "mt", rank: 25 }
    },
    exports: {
      total: 0.14,
      partners: [
        { country: "CN", amount: 0.13, percent: 95 }
      ],
      mainProducts: ["زغال", "منسوجات", "غذای دریایی"]
    },
    imports: {
      total: 2.4,
      partners: [
        { country: "CN", amount: 2.3, percent: 95 },
        { country: "RU", amount: 0.05, percent: 2 }
      ],
      mainProducts: ["نفت", "ماشین‌آلات", "غذا"]
    },
    investmentRisk: 100,
    riskFactors: ["تحریم کامل", "رژیم بسته", "ریسک جنگ"],
    relations: {
      "CN": "green", "RU": "green",
      "KR": "red", "US": "red", "JP": "red"
    },
    conflicts: [
      { opponent: "KR", intensity: "tension", since: 1950, description: "تقسیم شبه‌جزیره" }
    ]
  },

  // ===== مصر =====
  "EG": {
    name: "مصر",
    nameEn: "Egypt",
    capital: { name: "قاهره", coords: [30.0444, 31.2357] },
    continent: "africa",
    gdp: 476,
    gdpRank: 33,
    gdpPerCapita: 4500,
    inflation: 33.9,
    unemployment: 7.1,
    currency: "EGP",
    currencyName: "پوند",
    population: 105000000,
    populationDensity: 103,
    populationGrowth: 1.7,
    resources: {
      gas: { reserves: 2186, production: 67, unit: "bcm", rank: 14 },
      oil: { reserves: 3300, production: 550, unit: "mbbl", rank: 27 }
    },
    exports: {
      total: 52,
      partners: [
        { country: "IT", amount: 6.2, percent: 12 },
        { country: "TR", amount: 5.7, percent: 11 },
        { country: "US", amount: 4.7, percent: 9 },
        { country: "SA", amount: 4.2, percent: 8 },
        { country: "AE", amount: 3.6, percent: 7 }
      ],
      mainProducts: ["نفت", "گاز", "پنبه", "سبزیجات"]
    },
    imports: {
      total: 94,
      partners: [
        { country: "CN", amount: 18.8, percent: 20 },
        { country: "SA", amount: 9.4, percent: 10 },
        { country: "US", amount: 8.5, percent: 9 },
        { country: "DE", amount: 6.6, percent: 7 },
        { country: "TR", amount: 5.6, percent: 6 }
      ],
      mainProducts: ["ماشین‌آلات", "غلات", "فولاد", "خودرو"]
    },
    investmentRisk: 55,
    riskFactors: ["بحران ارزی", "بدهی بالا"],
    relations: {
      "SA": "green", "AE": "green", "US": "green",
      "IL": "white", "TR": "orange"
    },
    conflicts: []
  },

  // ===== آفریقای جنوبی =====
  "ZA": {
    name: "آفریقای جنوبی",
    nameEn: "South Africa",
    capital: { name: "پرتوریا", coords: [-25.7479, 28.2293] },
    continent: "africa",
    gdp: 405,
    gdpRank: 37,
    gdpPerCapita: 6700,
    inflation: 5.9,
    unemployment: 32.1,
    currency: "ZAR",
    currencyName: "راند",
    population: 60000000,
    populationDensity: 49,
    populationGrowth: 0.9,
    resources: {
      gold: { reserves: 6000, production: 100, unit: "tons", rank: 9 },
      platinum: { reserves: 63000, production: 130, unit: "tons", rank: 1 },
      chromium: { reserves: 200, production: 18, unit: "mt", rank: 1 },
      manganese: { reserves: 200, production: 19, unit: "mt", rank: 1 }
    },
    exports: {
      total: 123,
      partners: [
        { country: "CN", amount: 18.5, percent: 15 },
        { country: "US", amount: 9.8, percent: 8 },
        { country: "DE", amount: 8.6, percent: 7 },
        { country: "JP", amount: 7.4, percent: 6 },
        { country: "IN", amount: 6.2, percent: 5 }
      ],
      mainProducts: ["پلاتین", "طلا", "زغال", "آهن"]
    },
    imports: {
      total: 110,
      partners: [
        { country: "CN", amount: 22, percent: 20 },
        { country: "DE", amount: 11, percent: 10 },
        { country: "US", amount: 8.8, percent: 8 },
        { country: "IN", amount: 6.6, percent: 6 },
        { country: "SA", amount: 5.5, percent: 5 }
      ],
      mainProducts: ["ماشین‌آلات", "نفت", "الکترونیک", "خودرو"]
    },
    investmentRisk: 50,
    riskFactors: ["بیکاری بالا", "قطع برق", "جرم"],
    relations: {
      "RU": "green", "CN": "green", "IN": "green",
      "US": "white", "UK": "white"
    },
    conflicts: []
  },

  // ===== سوریه =====
  "SY": {
    name: "سوریه",
    nameEn: "Syria",
    capital: { name: "دمشق", coords: [33.5138, 36.2765] },
    continent: "asia",
    gdp: 9,
    gdpRank: 160,
    gdpPerCapita: 500,
    inflation: 139,
    unemployment: 50,
    currency: "SYP",
    currencyName: "لیر",
    population: 22000000,
    populationDensity: 118,
    populationGrowth: -1.5,
    resources: {
      oil: { reserves: 2500, production: 40, unit: "mbbl", rank: 35 }
    },
    exports: {
      total: 0.8,
      partners: [
        { country: "LB", amount: 0.24, percent: 30 },
        { country: "IQ", amount: 0.16, percent: 20 },
        { country: "AE", amount: 0.08, percent: 10 }
      ],
      mainProducts: ["نفت", "سبزیجات", "پنبه"]
    },
    imports: {
      total: 5,
      partners: [
        { country: "TR", amount: 1.5, percent: 30 },
        { country: "CN", amount: 0.75, percent: 15 },
        { country: "IR", amount: 0.5, percent: 10 }
      ],
      mainProducts: ["غذا", "سوخت", "دارو"]
    },
    investmentRisk: 98,
    riskFactors: ["جنگ داخلی", "تحریم", "ویرانی زیرساخت"],
    relations: {
      "IR": "green", "RU": "green",
      "US": "red", "IL": "red", "TR": "orange", "SA": "red"
    },
    conflicts: [
      { opponent: "TR", intensity: "tension", since: 2016, description: "مناطق شمالی" }
    ]
  },

  // ===== یمن =====
  "YE": {
    name: "یمن",
    nameEn: "Yemen",
    capital: { name: "صنعا", coords: [15.3694, 44.1910] },
    continent: "asia",
    gdp: 21,
    gdpRank: 130,
    gdpPerCapita: 650,
    inflation: 45,
    unemployment: 35,
    currency: "YER",
    currencyName: "ریال",
    population: 33000000,
    populationDensity: 63,
    populationGrowth: 2.3,
    resources: {
      oil: { reserves: 3000, production: 50, unit: "mbbl", rank: 33 }
    },
    exports: {
      total: 1.5,
      partners: [
        { country: "CN", amount: 0.45, percent: 30 },
        { country: "TH", amount: 0.23, percent: 15 },
        { country: "IN", amount: 0.15, percent: 10 }
      ],
      mainProducts: ["نفت", "قهوه", "ماهی"]
    },
    imports: {
      total: 9,
      partners: [
        { country: "CN", amount: 2.7, percent: 30 },
        { country: "AE", amount: 1.35, percent: 15 },
        { country: "IN", amount: 0.9, percent: 10 }
      ],
      mainProducts: ["غذا", "سوخت", "ماشین‌آلات"]
    },
    investmentRisk: 100,
    riskFactors: ["جنگ داخلی", "بحران انسانی", "قحطی"],
    relations: {
      "IR": "green",
      "SA": "red", "AE": "red", "US": "red"
    },
    conflicts: [
      { opponent: "SA", intensity: "war", since: 2015, description: "جنگ یمن" }
    ]
  }
};

// ===== لیست قاره‌ها =====
const continents = {
  "asia": { name: "آسیا", nameEn: "Asia" },
  "europe": { name: "اروپا", nameEn: "Europe" },
  "africa": { name: "آفریقا", nameEn: "Africa" },
  "north_america": { name: "آمریکای شمالی", nameEn: "North America" },
  "south_america": { name: "آمریکای جنوبی", nameEn: "South America" },
  "oceania": { name: "اقیانوسیه", nameEn: "Oceania" }
};

// ===== کدهای کشوری =====
const countryCodeToName = {};
Object.keys(countriesData).forEach(code => {
  countryCodeToName[code] = countriesData[code].name;
});

// ===== تبدیل رنگ رابطه به هگز =====
function getRelationColor(relation) {
  const colors = {
    "green": 0x00ff00,   // روابط عالی
    "white": 0xffffff,   // روابط عادی
    "gray": 0x888888,    // بدون رابطه
    "yellow": 0xffff00,  // تنش کم
    "orange": 0xff8800,  // تنش متوسط
    "red": 0xff0000      // جنگ/دشمنی
  };
  return colors[relation] || colors.gray;
}

// ===== تبدیل شدت درگیری به رنگ =====
function getConflictColor(intensity) {
  const colors = {
    "war": 0xff0000,      // قرمز - جنگ
    "tension": 0xff8800,  // نارنجی - تنش
    "minor": 0xffff00     // زرد - درگیری کم
  };
  return colors[intensity] || 0x888888;
}

// Export for use in other files
if (typeof window !== 'undefined') {
  window.countriesData = countriesData;
  window.continents = continents;
  window.countryCodeToName = countryCodeToName;
  window.getRelationColor = getRelationColor;
  window.getConflictColor = getConflictColor;
}

