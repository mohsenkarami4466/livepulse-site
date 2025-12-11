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
    conflicts: [], // فعلاً درگیری مستقیم نظامی نداره
    // قدرت نظامی
    military: {
      rank: 14, // رتبه جهانی قدرت نظامی
      airForce: {
        aircraft: 509,
        rank: 13,
        description: "نیروی هوایی"
      },
      groundForce: {
        tanks: 1634,
        soldiers: 610000,
        rank: 12,
        description: "نیروی زمینی"
      },
      navy: {
        ships: 398,
        submarines: 19,
        rank: 15,
        description: "نیروی دریایی"
      }
    },
    // گمرکات
    customs: [
      { name: "گمرک بندرعباس", coords: [27.1833, 56.2667], workingHours: "شنبه تا پنجشنبه: 8:00-16:00", description: "بزرگترین بندر ایران" },
      { name: "گمرک امام خمینی", coords: [35.6892, 51.3890], workingHours: "شنبه تا پنجشنبه: 8:00-16:00", description: "گمرک زمینی اصلی" },
      { name: "گمرک بندر شهید رجایی", coords: [27.1833, 56.2667], workingHours: "24/7", description: "بندر کانتینری" },
      { name: "گمرک مشهد", coords: [36.2605, 59.6168], workingHours: "شنبه تا پنجشنبه: 8:00-16:00", description: "گمرک مرزی شرق" },
      { name: "گمرک بازرگان", coords: [39.3917, 44.3750], workingHours: "شنبه تا پنجشنبه: 8:00-16:00", description: "گمرک مرزی ترکیه" },
      { name: "گمرک میلک", coords: [25.0667, 61.5000], workingHours: "شنبه تا پنجشنبه: 8:00-16:00", description: "گمرک مرزی پاکستان" },
      { name: "گمرک خسروی", coords: [33.4333, 46.1667], workingHours: "شنبه تا پنجشنبه: 8:00-16:00", description: "گمرک مرزی عراق" },
      { name: "گمرک رازی", coords: [37.9333, 44.3833], workingHours: "شنبه تا پنجشنبه: 8:00-16:00", description: "گمرک مرزی ترکیه" }
    ],
    // پالایشگاه‌ها
    refineries: [
      { name: "پالایشگاه آبادان", coords: [30.3392, 48.3042], capacity: "400,000 bbl/day", description: "قدیمی‌ترین پالایشگاه ایران" },
      { name: "پالایشگاه تهران", coords: [35.6892, 51.3890], capacity: "250,000 bbl/day", description: "پالایشگاه پایتخت" },
      { name: "پالایشگاه اصفهان", coords: [32.6546, 51.6680], capacity: "375,000 bbl/day", description: "بزرگترین پالایشگاه" },
      { name: "پالایشگاه بندرعباس", coords: [27.1833, 56.2667], capacity: "300,000 bbl/day", description: "پالایشگاه جنوب" },
      { name: "پالایشگاه شیراز", coords: [29.5918, 52.5837], capacity: "200,000 bbl/day", description: "پالایشگاه فارس" },
      { name: "پالایشگاه تبریز", coords: [38.0962, 46.2738], capacity: "150,000 bbl/day", description: "پالایشگاه آذربایجان" },
      { name: "پالایشگاه کرمانشاه", coords: [34.3142, 47.0650], capacity: "100,000 bbl/day", description: "پالایشگاه غرب" }
    ],
    // معادن
    mines: [
      { name: "معدن مس سرچشمه", coords: [30.0833, 55.8333], capacity: "200,000 tons/year", description: "بزرگترین معدن مس ایران" },
      { name: "معدن طلای زرشوران", coords: [36.5, 47.5], capacity: "3 tons/year", description: "معدن طلا" },
      { name: "معدن آهن چادرملو", coords: [32.5, 55.5], capacity: "15 million tons/year", description: "معدن آهن" },
      { name: "معدن آهن گل گهر", coords: [30.2, 55.1], capacity: "12 million tons/year", description: "معدن آهن" },
      { name: "معدن مس میدوک", coords: [30.5, 55.8], capacity: "150,000 tons/year", description: "معدن مس" },
      { name: "معدن طلای آق دره", coords: [36.3, 47.2], capacity: "2 tons/year", description: "معدن طلا" },
      { name: "معدن سرب و روی انگوران", coords: [36.7, 46.8], capacity: "80,000 tons/year", description: "معدن سرب و روی" },
      { name: "معدن زغال سنگ طبس", coords: [33.6, 56.9], capacity: "1.5 million tons/year", description: "معدن زغال سنگ" }
    ],
    // بنادر
    ports: [
      { name: "بندرعباس", coords: [27.1833, 56.2667], workingHours: "24/7", description: "بندر اصلی جنوب" },
      { name: "بندر امام خمینی", coords: [30.4333, 49.0833], workingHours: "24/7", description: "بندر کانتینری" },
      { name: "بندر چابهار", coords: [25.2833, 60.6333], workingHours: "24/7", description: "بندر اقیانوس هند" },
      { name: "بندر بوشهر", coords: [28.9667, 50.8333], workingHours: "24/7", description: "بندر خلیج فارس" },
      { name: "بندر انزلی", coords: [37.4667, 49.4667], workingHours: "24/7", description: "بندر دریای خزر" }
    ],
    // سکوهای نفتی
    oilRigs: [
      { name: "سکوی نفتی سیری", coords: [27.5, 52.5], capacity: "100,000 bbl/day", description: "سکوی دریایی" },
      { name: "سکوی نفتی سلمان", coords: [27.3, 52.4], capacity: "80,000 bbl/day", description: "سکوی دریایی" },
      { name: "سکوی نفتی نوروز", coords: [28.0, 51.0], capacity: "120,000 bbl/day", description: "سکوی دریایی" },
      { name: "سکوی نفتی درود", coords: [27.8, 52.2], capacity: "90,000 bbl/day", description: "سکوی دریایی" },
      { name: "سکوی نفتی سروش", coords: [28.2, 51.5], capacity: "110,000 bbl/day", description: "سکوی دریایی" }
    ]
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
      { opponent: "UA", intensity: "war", since: 2022, description: "جنگ اوکراین", coords: [50.4501, 30.5234] }
    ],
    // قدرت نظامی
    military: {
      rank: 2, // رتبه جهانی قدرت نظامی
      airForce: {
        aircraft: 4173,
        rank: 2,
        description: "نیروی هوایی"
      },
      groundForce: {
        tanks: 12420,
        soldiers: 830900,
        rank: 1,
        description: "نیروی زمینی"
      },
      navy: {
        ships: 605,
        submarines: 70,
        rank: 3,
        description: "نیروی دریایی"
      }
    },
    customs: [
      { name: "گمرک سن پترزبورگ", coords: [59.9343, 30.3351], workingHours: "دوشنبه تا جمعه: 9:00-18:00", description: "بندر اصلی اروپا" },
      { name: "گمرک مسکو", coords: [55.7558, 37.6173], workingHours: "دوشنبه تا جمعه: 9:00-18:00", description: "گمرک پایتخت" },
      { name: "گمرک نووسیبیرسک", coords: [55.0084, 82.9357], workingHours: "دوشنبه تا جمعه: 9:00-18:00", description: "گمرک سیبری" },
      { name: "گمرک کالینینگراد", coords: [54.7104, 20.4522], workingHours: "دوشنبه تا جمعه: 9:00-18:00", description: "گمرک بالتیک" },
      { name: "گمرک ولادی‌وستوک", coords: [43.1155, 131.8855], workingHours: "دوشنبه تا جمعه: 9:00-18:00", description: "گمرک شرق" }
    ],
    refineries: [
      { name: "پالایشگاه اومسک", coords: [54.9885, 73.3242], capacity: "600,000 bbl/day", description: "بزرگترین پالایشگاه روسیه" },
      { name: "پالایشگاه کیریشی", coords: [59.4494, 32.0089], capacity: "400,000 bbl/day", description: "پالایشگاه شمال" }
    ],
    mines: [
      { name: "معدن طلای سولوفسکی", coords: [64.5, 30.5], capacity: "50 tons/year", description: "معدن طلا" },
      { name: "معدن الماس میرنی", coords: [62.5, 113.5], capacity: "10 mct/year", description: "معدن الماس" }
    ],
    ports: [
      { name: "بندر سن پترزبورگ", coords: [59.9343, 30.3351], workingHours: "24/7", description: "بندر اصلی" },
      { name: "بندر نووروسیسک", coords: [44.7235, 37.7686], workingHours: "24/7", description: "بندر دریای سیاه" }
    ],
    oilRigs: [
      { name: "سکوی نفتی پریازلومنویه", coords: [69.2, 57.3], capacity: "150,000 bbl/day", description: "سکوی دریای بارنتس" }
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
  },

  // ===== کشورهای بیشتر آسیا =====
  "KR": {
    name: "کره جنوبی", nameEn: "South Korea",
    capital: { name: "سئول", coords: [37.5665, 126.9780] },
    continent: "asia",
    gdp: 1665, gdpRank: 13, gdpPerCapita: 32000,
    inflation: 3.5, unemployment: 2.8, currency: "KRW", currencyName: "وون",
    population: 51700000, populationDensity: 527, populationGrowth: 0.1,
    resources: { iron: { reserves: 200, production: 1, unit: "mt", rank: 40 } },
    exports: { total: 644, partners: [{ country: "CN", amount: 162, percent: 25 }, { country: "US", amount: 90, percent: 14 }, { country: "VN", amount: 50, percent: 8 }, { country: "HK", amount: 45, percent: 7 }, { country: "JP", amount: 40, percent: 6 }, { country: "IN", amount: 35, percent: 5 }, { country: "SG", amount: 30, percent: 5 }, { country: "MX", amount: 25, percent: 4 }, { country: "DE", amount: 22, percent: 3 }, { country: "TH", amount: 20, percent: 3 }], mainProducts: ["الکترونیک", "خودرو", "ماشین‌آلات"] },
    imports: { total: 615, partners: [{ country: "CN", amount: 123, percent: 20 }, { country: "US", amount: 68, percent: 11 }, { country: "JP", amount: 55, percent: 9 }, { country: "SA", amount: 45, percent: 7 }, { country: "AU", amount: 35, percent: 6 }, { country: "DE", amount: 30, percent: 5 }, { country: "VN", amount: 28, percent: 5 }, { country: "QA", amount: 25, percent: 4 }, { country: "RU", amount: 22, percent: 4 }, { country: "IN", amount: 20, percent: 3 }], mainProducts: ["نفت", "گاز", "الکترونیک"] },
    investmentRisk: 15, relations: { "US": "green", "JP": "white", "CN": "white", "KP": "red" },
    customs: [{ name: "بندر بوسان", coords: [35.1796, 129.0756] }, { name: "اینچئون", coords: [37.4563, 126.7052] }]
  },
  "TH": {
    name: "تایلند", nameEn: "Thailand",
    capital: { name: "بانکوک", coords: [13.7563, 100.5018] },
    continent: "asia",
    gdp: 506, gdpRank: 26, gdpPerCapita: 7200,
    inflation: 1.2, unemployment: 1.0, currency: "THB", currencyName: "بات",
    population: 70000000, populationDensity: 137, populationGrowth: 0.2,
    resources: { gas: { reserves: 200, production: 35, unit: "bcm", rank: 25 } },
    exports: { total: 287, partners: [{ country: "US", amount: 40, percent: 14 }, { country: "CN", amount: 34, percent: 12 }, { country: "JP", amount: 28, percent: 10 }, { country: "VN", amount: 22, percent: 8 }, { country: "MY", amount: 20, percent: 7 }, { country: "HK", amount: 18, percent: 6 }, { country: "SG", amount: 16, percent: 6 }, { country: "IN", amount: 14, percent: 5 }, { country: "AU", amount: 12, percent: 4 }, { country: "DE", amount: 10, percent: 3 }], mainProducts: ["الکترونیک", "خودرو", "غذا"] },
    imports: { total: 249, partners: [{ country: "CN", amount: 50, percent: 20 }, { country: "JP", amount: 35, percent: 14 }, { country: "US", amount: 22, percent: 9 }, { country: "MY", amount: 18, percent: 7 }, { country: "SG", amount: 16, percent: 6 }, { country: "KR", amount: 14, percent: 6 }, { country: "AE", amount: 12, percent: 5 }, { country: "SA", amount: 10, percent: 4 }, { country: "IN", amount: 9, percent: 4 }, { country: "DE", amount: 8, percent: 3 }], mainProducts: ["نفت", "الکترونیک", "ماشین‌آلات"] },
    investmentRisk: 30, relations: { "US": "green", "CN": "green", "JP": "green" },
    customs: [{ name: "بندر لائم چابانگ", coords: [13.0827, 100.8851] }]
  },
  "VN": {
    name: "ویتنام", nameEn: "Vietnam",
    capital: { name: "هانوی", coords: [21.0285, 105.8542] },
    continent: "asia",
    gdp: 409, gdpRank: 35, gdpPerCapita: 4100,
    inflation: 3.2, unemployment: 2.3, currency: "VND", currencyName: "دونگ",
    population: 100000000, populationDensity: 314, populationGrowth: 0.9,
    resources: { oil: { reserves: 4400, production: 200, unit: "mbbl", rank: 28 }, coal: { reserves: 3000, production: 45, unit: "mt", rank: 15 } },
    exports: { total: 336, partners: [{ country: "US", amount: 77, percent: 23 }, { country: "CN", amount: 57, percent: 17 }], mainProducts: ["الکترونیک", "پوشاک", "کفش"] },
    imports: { total: 332, partners: [{ country: "CN", amount: 110, percent: 33 }, { country: "KR", amount: 60, percent: 18 }], mainProducts: ["الکترونیک", "ماشین‌آلات", "پارچه"] },
    investmentRisk: 35, relations: { "US": "green", "CN": "white", "RU": "green" },
    customs: [{ name: "بندر هوشی‌مینه", coords: [10.7769, 106.7009] }, { name: "بندر هایفونگ", coords: [20.8449, 106.6881] }]
  },
  "MY": {
    name: "مالزی", nameEn: "Malaysia",
    capital: { name: "کوالالامپور", coords: [3.1390, 101.6869] },
    continent: "asia",
    gdp: 407, gdpRank: 36, gdpPerCapita: 12300,
    inflation: 2.5, unemployment: 3.5, currency: "MYR", currencyName: "رینگیت",
    population: 33000000, populationDensity: 100, populationGrowth: 1.1,
    resources: { oil: { reserves: 3600, production: 580, unit: "mbbl", rank: 26 }, gas: { reserves: 1100, production: 75, unit: "bcm", rank: 15 } },
    exports: { total: 299, partners: [{ country: "SG", amount: 42, percent: 14 }, { country: "CN", amount: 39, percent: 13 }], mainProducts: ["الکترونیک", "نفت", "روغن پالم"] },
    imports: { total: 238, partners: [{ country: "CN", amount: 52, percent: 22 }, { country: "SG", amount: 26, percent: 11 }], mainProducts: ["الکترونیک", "ماشین‌آلات", "نفت"] },
    investmentRisk: 25, relations: { "SG": "green", "CN": "green", "US": "green" },
    customs: [{ name: "بندر کلانگ", coords: [3.0319, 101.3685] }, { name: "بندر تنجونگ پلپاس", coords: [1.3621, 103.5463] }]
  },
  "ID": {
    name: "اندونزی", nameEn: "Indonesia",
    capital: { name: "جاکارتا", coords: [-6.2088, 106.8456] },
    continent: "asia",
    gdp: 1319, gdpRank: 16, gdpPerCapita: 4800,
    inflation: 4.0, unemployment: 5.5, currency: "IDR", currencyName: "روپیه",
    population: 277000000, populationDensity: 151, populationGrowth: 0.9,
    resources: { oil: { reserves: 3200, production: 640, unit: "mbbl", rank: 23 }, gas: { reserves: 2800, production: 67, unit: "bcm", rank: 12 }, coal: { reserves: 37000, production: 600, unit: "mt", rank: 3 }, gold: { reserves: 2600, production: 100, unit: "tons", rank: 8 } },
    exports: { total: 292, partners: [{ country: "CN", amount: 67, percent: 23 }, { country: "US", amount: 29, percent: 10 }], mainProducts: ["زغال", "روغن پالم", "گاز"] },
    imports: { total: 237, partners: [{ country: "CN", amount: 62, percent: 26 }, { country: "SG", amount: 24, percent: 10 }], mainProducts: ["نفت", "ماشین‌آلات", "الکترونیک"] },
    investmentRisk: 35, relations: { "AU": "green", "SG": "green", "CN": "green", "US": "green" },
    customs: [{ name: "تانجونگ پریوک", coords: [-6.1058, 106.8809] }, { name: "بندر سورابایا", coords: [-7.2504, 112.7688] }]
  },
  "PH": {
    name: "فیلیپین", nameEn: "Philippines",
    capital: { name: "مانیل", coords: [14.5995, 120.9842] },
    continent: "asia",
    gdp: 404, gdpRank: 37, gdpPerCapita: 3600,
    inflation: 5.8, unemployment: 4.5, currency: "PHP", currencyName: "پزو",
    population: 114000000, populationDensity: 381, populationGrowth: 1.4,
    resources: { gold: { reserves: 900, production: 35, unit: "tons", rank: 18 }, copper: { reserves: 7000, production: 60, unit: "kt", rank: 20 } },
    exports: { total: 74, partners: [{ country: "US", amount: 11, percent: 15 }, { country: "JP", amount: 10, percent: 14 }], mainProducts: ["الکترونیک", "میوه", "نارگیل"] },
    imports: { total: 134, partners: [{ country: "CN", amount: 27, percent: 20 }, { country: "JP", amount: 12, percent: 9 }], mainProducts: ["الکترونیک", "نفت", "ماشین‌آلات"] },
    investmentRisk: 40, relations: { "US": "green", "JP": "green", "CN": "orange" },
    customs: [{ name: "بندر مانیل", coords: [14.5833, 120.9667] }]
  },
  "SG": {
    name: "سنگاپور", nameEn: "Singapore",
    capital: { name: "سنگاپور", coords: [1.3521, 103.8198] },
    continent: "asia",
    gdp: 424, gdpRank: 33, gdpPerCapita: 72800,
    inflation: 4.8, unemployment: 2.1, currency: "SGD", currencyName: "دلار سنگاپور",
    population: 5850000, populationDensity: 8358, populationGrowth: 0.8,
    resources: {},
    exports: { total: 516, partners: [{ country: "CN", amount: 77, percent: 15 }, { country: "MY", amount: 52, percent: 10 }], mainProducts: ["ماشین‌آلات", "الکترونیک", "نفت"] },
    imports: { total: 492, partners: [{ country: "CN", amount: 69, percent: 14 }, { country: "MY", amount: 54, percent: 11 }], mainProducts: ["ماشین‌آلات", "نفت", "الکترونیک"] },
    investmentRisk: 10, relations: { "US": "green", "CN": "green", "MY": "green" },
    customs: [{ name: "بندر سنگاپور", coords: [1.2644, 103.8200] }]
  },

  // ===== کشورهای بیشتر اروپا =====
  "IT": {
    name: "ایتالیا", nameEn: "Italy",
    capital: { name: "رم", coords: [41.9028, 12.4964] },
    continent: "europe",
    gdp: 2169, gdpRank: 8, gdpPerCapita: 36700,
    inflation: 5.7, unemployment: 7.8, currency: "EUR", currencyName: "یورو",
    population: 59000000, populationDensity: 206, populationGrowth: -0.2,
    resources: {},
    exports: { total: 660, partners: [{ country: "DE", amount: 79, percent: 12 }, { country: "FR", amount: 66, percent: 10 }], mainProducts: ["ماشین‌آلات", "خودرو", "پوشاک"] },
    imports: { total: 616, partners: [{ country: "DE", amount: 99, percent: 16 }, { country: "FR", amount: 55, percent: 9 }], mainProducts: ["نفت", "گاز", "ماشین‌آلات"] },
    investmentRisk: 25, relations: { "DE": "green", "FR": "green", "US": "green" },
    customs: [{ name: "بندر جنوا", coords: [44.4056, 8.9463] }, { name: "بندر ونیز", coords: [45.4408, 12.3155] }]
  },
  "ES": {
    name: "اسپانیا", nameEn: "Spain",
    capital: { name: "مادرید", coords: [40.4168, -3.7038] },
    continent: "europe",
    gdp: 1492, gdpRank: 14, gdpPerCapita: 31600,
    inflation: 3.5, unemployment: 12.9, currency: "EUR", currencyName: "یورو",
    population: 47400000, populationDensity: 94, populationGrowth: 0.1,
    resources: {},
    exports: { total: 418, partners: [{ country: "FR", amount: 67, percent: 16 }, { country: "DE", amount: 46, percent: 11 }], mainProducts: ["خودرو", "ماشین‌آلات", "غذا"] },
    imports: { total: 449, partners: [{ country: "DE", amount: 54, percent: 12 }, { country: "FR", amount: 49, percent: 11 }], mainProducts: ["نفت", "خودرو", "ماشین‌آلات"] },
    investmentRisk: 25, relations: { "FR": "green", "DE": "green", "PT": "green" },
    customs: [{ name: "بندر بارسلونا", coords: [41.3851, 2.1734] }, { name: "بندر والنسیا", coords: [39.4699, -0.3763] }]
  },
  "NL": {
    name: "هلند", nameEn: "Netherlands",
    capital: { name: "آمستردام", coords: [52.3676, 4.9041] },
    continent: "europe",
    gdp: 1009, gdpRank: 17, gdpPerCapita: 57700,
    inflation: 4.1, unemployment: 3.5, currency: "EUR", currencyName: "یورو",
    population: 17500000, populationDensity: 521, populationGrowth: 0.3,
    resources: { gas: { reserves: 150, production: 20, unit: "bcm", rank: 30 } },
    exports: { total: 836, partners: [{ country: "DE", amount: 200, percent: 24 }, { country: "BE", amount: 100, percent: 12 }], mainProducts: ["ماشین‌آلات", "شیمیایی", "غذا"] },
    imports: { total: 757, partners: [{ country: "DE", amount: 136, percent: 18 }, { country: "CN", amount: 91, percent: 12 }], mainProducts: ["ماشین‌آلات", "نفت", "الکترونیک"] },
    investmentRisk: 10, relations: { "DE": "green", "BE": "green", "UK": "green" },
    customs: [{ name: "بندر روتردام", coords: [51.9244, 4.4777] }]
  },
  "PL": {
    name: "لهستان", nameEn: "Poland",
    capital: { name: "ورشو", coords: [52.2297, 21.0122] },
    continent: "europe",
    gdp: 716, gdpRank: 21, gdpPerCapita: 18700,
    inflation: 11.4, unemployment: 2.9, currency: "PLN", currencyName: "زلوتی",
    population: 38000000, populationDensity: 124, populationGrowth: -0.1,
    resources: { coal: { reserves: 26000, production: 110, unit: "mt", rank: 8 }, copper: { reserves: 30000, production: 400, unit: "kt", rank: 10 } },
    exports: { total: 350, partners: [{ country: "DE", amount: 98, percent: 28 }, { country: "CZ", amount: 21, percent: 6 }], mainProducts: ["ماشین‌آلات", "خودرو", "مبلمان"] },
    imports: { total: 354, partners: [{ country: "DE", amount: 78, percent: 22 }, { country: "CN", amount: 46, percent: 13 }], mainProducts: ["ماشین‌آلات", "نفت", "خودرو"] },
    investmentRisk: 25, relations: { "DE": "green", "US": "green", "RU": "orange", "UA": "green" },
    customs: [{ name: "بندر گدانسک", coords: [54.3520, 18.6466] }]
  },
  "SE": {
    name: "سوئد", nameEn: "Sweden",
    capital: { name: "استکهلم", coords: [59.3293, 18.0686] },
    continent: "europe",
    gdp: 586, gdpRank: 23, gdpPerCapita: 56000,
    inflation: 8.5, unemployment: 7.5, currency: "SEK", currencyName: "کرون",
    population: 10500000, populationDensity: 25, populationGrowth: 0.6,
    resources: { iron: { reserves: 3500, production: 35, unit: "mt", rank: 12 } },
    exports: { total: 191, partners: [{ country: "DE", amount: 19, percent: 10 }, { country: "NO", amount: 17, percent: 9 }], mainProducts: ["ماشین‌آلات", "خودرو", "کاغذ"] },
    imports: { total: 190, partners: [{ country: "DE", amount: 32, percent: 17 }, { country: "NL", amount: 17, percent: 9 }], mainProducts: ["ماشین‌آلات", "نفت", "خودرو"] },
    investmentRisk: 10, relations: { "NO": "green", "FI": "green", "DE": "green" },
    customs: [{ name: "بندر گوتنبرگ", coords: [57.7089, 11.9746] }]
  },
  "CH": {
    name: "سوئیس", nameEn: "Switzerland",
    capital: { name: "برن", coords: [46.9480, 7.4474] },
    continent: "europe",
    gdp: 812, gdpRank: 20, gdpPerCapita: 93000,
    inflation: 2.8, unemployment: 2.0, currency: "CHF", currencyName: "فرانک",
    population: 8700000, populationDensity: 220, populationGrowth: 0.7,
    resources: {},
    exports: { total: 380, partners: [{ country: "DE", amount: 57, percent: 15 }, { country: "US", amount: 49, percent: 13 }], mainProducts: ["دارو", "ساعت", "ماشین‌آلات"] },
    imports: { total: 320, partners: [{ country: "DE", amount: 64, percent: 20 }, { country: "IT", amount: 26, percent: 8 }], mainProducts: ["ماشین‌آلات", "شیمیایی", "خودرو"] },
    investmentRisk: 5, relations: { "DE": "green", "FR": "green", "IT": "green" },
    customs: [{ name: "بازل", coords: [47.5596, 7.5886], workingHours: "دوشنبه تا جمعه: 8:00-17:00" }]
  },
  "RO": {
    name: "رومانی", nameEn: "Romania",
    capital: { name: "بخارست", coords: [44.4268, 26.1025] },
    continent: "europe",
    gdp: 301, gdpRank: 45, gdpPerCapita: 15700,
    inflation: 7.0, unemployment: 5.6, currency: "RON", currencyName: "لئو",
    population: 19000000, populationDensity: 84, populationGrowth: -0.6,
    resources: { oil: { reserves: 600, production: 80, unit: "mbbl", rank: 50 }, gas: { reserves: 100, production: 10, unit: "bcm", rank: 40 } },
    exports: { total: 95, partners: [{ country: "DE", amount: 25, percent: 26 }, { country: "IT", amount: 12, percent: 13 }, { country: "FR", amount: 8, percent: 8 }, { country: "HU", amount: 6, percent: 6 }, { country: "UK", amount: 5, percent: 5 }], mainProducts: ["ماشین‌آلات", "خودرو", "الکترونیک"] },
    imports: { total: 110, partners: [{ country: "DE", amount: 28, percent: 25 }, { country: "IT", amount: 13, percent: 12 }, { country: "HU", amount: 8, percent: 7 }, { country: "PL", amount: 7, percent: 6 }, { country: "CN", amount: 6, percent: 5 }], mainProducts: ["ماشین‌آلات", "نفت", "الکترونیک"] },
    investmentRisk: 30, relations: { "DE": "green", "IT": "green", "FR": "green" },
    customs: [{ name: "گمرک بخارست", coords: [44.4268, 26.1025], workingHours: "دوشنبه تا جمعه: 8:00-17:00" }]
  },
  "GR": {
    name: "یونان", nameEn: "Greece",
    capital: { name: "آتن", coords: [37.9838, 23.7275] },
    continent: "europe",
    gdp: 239, gdpRank: 53, gdpPerCapita: 22300,
    inflation: 3.5, unemployment: 10.8, currency: "EUR", currencyName: "یورو",
    population: 10700000, populationDensity: 82, populationGrowth: -0.5,
    resources: {},
    exports: { total: 45, partners: [{ country: "IT", amount: 5, percent: 11 }, { country: "TR", amount: 4, percent: 9 }, { country: "DE", amount: 4, percent: 9 }, { country: "CY", amount: 3, percent: 7 }, { country: "US", amount: 2.5, percent: 6 }], mainProducts: ["نفت", "دارو", "زیتون"] },
    imports: { total: 75, partners: [{ country: "DE", amount: 12, percent: 16 }, { country: "IT", amount: 8, percent: 11 }, { country: "CN", amount: 7, percent: 9 }, { country: "NL", amount: 5, percent: 7 }, { country: "RU", amount: 4, percent: 5 }], mainProducts: ["نفت", "ماشین‌آلات", "الکترونیک"] },
    investmentRisk: 35, relations: { "TR": "orange", "CY": "green", "IT": "green" },
    customs: [{ name: "بندر پیرائوس", coords: [37.9430, 23.6468], workingHours: "24/7" }]
  },
  "PT": {
    name: "پرتغال", nameEn: "Portugal",
    capital: { name: "لیسبون", coords: [38.7223, -9.1393] },
    continent: "europe",
    gdp: 255, gdpRank: 48, gdpPerCapita: 24700,
    inflation: 5.3, unemployment: 6.0, currency: "EUR", currencyName: "یورو",
    population: 10300000, populationDensity: 112, populationGrowth: -0.2,
    resources: {},
    exports: { total: 75, partners: [{ country: "ES", amount: 15, percent: 20 }, { country: "FR", amount: 12, percent: 16 }, { country: "DE", amount: 11, percent: 15 }, { country: "UK", amount: 5, percent: 7 }, { country: "US", amount: 4, percent: 5 }], mainProducts: ["خودرو", "پوشاک", "کفش"] },
    imports: { total: 90, partners: [{ country: "ES", amount: 20, percent: 22 }, { country: "DE", amount: 15, percent: 17 }, { country: "FR", amount: 10, percent: 11 }, { country: "IT", amount: 6, percent: 7 }, { country: "NL", amount: 5, percent: 6 }], mainProducts: ["نفت", "ماشین‌آلات", "الکترونیک"] },
    investmentRisk: 20, relations: { "ES": "green", "FR": "green", "BR": "green" },
    customs: [{ name: "بندر لیسبون", coords: [38.7223, -9.1393], workingHours: "24/7" }]
  },
  "CZ": {
    name: "جمهوری چک", nameEn: "Czech Republic",
    capital: { name: "پراگ", coords: [50.0755, 14.4378] },
    continent: "europe",
    gdp: 330, gdpRank: 42, gdpPerCapita: 31200,
    inflation: 10.7, unemployment: 2.3, currency: "CZK", currencyName: "کرونا",
    population: 10500000, populationDensity: 134, populationGrowth: 0.2,
    resources: {},
    exports: { total: 230, partners: [{ country: "DE", amount: 75, percent: 33 }, { country: "SK", amount: 18, percent: 8 }, { country: "PL", amount: 15, percent: 7 }, { country: "FR", amount: 12, percent: 5 }, { country: "UK", amount: 10, percent: 4 }], mainProducts: ["ماشین‌آلات", "خودرو", "الکترونیک"] },
    imports: { total: 215, partners: [{ country: "DE", amount: 70, percent: 33 }, { country: "CN", amount: 20, percent: 9 }, { country: "PL", amount: 15, percent: 7 }, { country: "SK", amount: 12, percent: 6 }, { country: "IT", amount: 10, percent: 5 }], mainProducts: ["ماشین‌آلات", "نفت", "الکترونیک"] },
    investmentRisk: 15, relations: { "DE": "green", "SK": "green", "PL": "green" },
    customs: [{ name: "گمرک پراگ", coords: [50.0755, 14.4378], workingHours: "دوشنبه تا جمعه: 8:00-17:00" }]
  },
  "HU": {
    name: "مجارستان", nameEn: "Hungary",
    capital: { name: "بوداپست", coords: [47.4979, 19.0402] },
    continent: "europe",
    gdp: 201, gdpRank: 58, gdpPerCapita: 20700,
    inflation: 17.0, unemployment: 3.6, currency: "HUF", currencyName: "فورینت",
    population: 9700000, populationDensity: 106, populationGrowth: -0.3,
    resources: {},
    exports: { total: 130, partners: [{ country: "DE", amount: 45, percent: 35 }, { country: "RO", amount: 8, percent: 6 }, { country: "SK", amount: 7, percent: 5 }, { country: "IT", amount: 6, percent: 5 }, { country: "FR", amount: 5, percent: 4 }], mainProducts: ["ماشین‌آلات", "خودرو", "الکترونیک"] },
    imports: { total: 125, partners: [{ country: "DE", amount: 40, percent: 32 }, { country: "CN", amount: 12, percent: 10 }, { country: "PL", amount: 8, percent: 6 }, { country: "IT", amount: 7, percent: 6 }, { country: "SK", amount: 6, percent: 5 }], mainProducts: ["ماشین‌آلات", "نفت", "الکترونیک"] },
    investmentRisk: 25, relations: { "DE": "green", "RO": "green", "SK": "green" },
    customs: [{ name: "گمرک بوداپست", coords: [47.4979, 19.0402], workingHours: "دوشنبه تا جمعه: 8:00-17:00" }]
  },
  "NO": {
    name: "نروژ", nameEn: "Norway",
    capital: { name: "اسلو", coords: [59.9139, 10.7522] },
    continent: "europe",
    gdp: 482, gdpRank: 28, gdpPerCapita: 89000,
    inflation: 5.5, unemployment: 3.2, currency: "NOK", currencyName: "کرون",
    population: 5400000, populationDensity: 15, populationGrowth: 0.7,
    resources: { oil: { reserves: 8000, production: 1800, unit: "mbbl", rank: 15 }, gas: { reserves: 1800, production: 120, unit: "bcm", rank: 7 } },
    exports: { total: 185, partners: [{ country: "UK", amount: 35, percent: 19 }, { country: "DE", amount: 30, percent: 16 }, { country: "NL", amount: 20, percent: 11 }, { country: "SE", amount: 15, percent: 8 }, { country: "FR", amount: 12, percent: 6 }], mainProducts: ["نفت", "گاز", "ماهی"] },
    imports: { total: 95, partners: [{ country: "SE", amount: 18, percent: 19 }, { country: "DE", amount: 15, percent: 16 }, { country: "CN", amount: 12, percent: 13 }, { country: "DK", amount: 6, percent: 6 }, { country: "US", amount: 5, percent: 5 }], mainProducts: ["ماشین‌آلات", "خودرو", "الکترونیک"] },
    investmentRisk: 5, relations: { "SE": "green", "DK": "green", "UK": "green" },
    customs: [{ name: "بندر اسلو", coords: [59.9139, 10.7522], workingHours: "24/7" }]
  },
  "FI": {
    name: "فنلاند", nameEn: "Finland",
    capital: { name: "هلسینکی", coords: [60.1699, 24.9384] },
    continent: "europe",
    gdp: 282, gdpRank: 44, gdpPerCapita: 51000,
    inflation: 4.3, unemployment: 6.8, currency: "EUR", currencyName: "یورو",
    population: 5500000, populationDensity: 18, populationGrowth: 0.1,
    resources: {},
    exports: { total: 87, partners: [{ country: "DE", amount: 15, percent: 17 }, { country: "SE", amount: 12, percent: 14 }, { country: "US", amount: 10, percent: 11 }, { country: "NL", amount: 6, percent: 7 }, { country: "CN", amount: 5, percent: 6 }], mainProducts: ["ماشین‌آلات", "کاغذ", "الکترونیک"] },
    imports: { total: 88, partners: [{ country: "DE", amount: 18, percent: 20 }, { country: "SE", amount: 12, percent: 14 }, { country: "RU", amount: 8, percent: 9 }, { country: "CN", amount: 7, percent: 8 }, { country: "NL", amount: 5, percent: 6 }], mainProducts: ["نفت", "ماشین‌آلات", "الکترونیک"] },
    investmentRisk: 10, relations: { "SE": "green", "RU": "white", "EE": "green" },
    customs: [{ name: "بندر هلسینکی", coords: [60.1699, 24.9384], workingHours: "24/7" }]
  },
  "DK": {
    name: "دانمارک", nameEn: "Denmark",
    capital: { name: "کپنهاگ", coords: [55.6761, 12.5683] },
    continent: "europe",
    gdp: 406, gdpRank: 38, gdpPerCapita: 70000,
    inflation: 3.4, unemployment: 2.7, currency: "DKK", currencyName: "کرون",
    population: 5800000, populationDensity: 137, populationGrowth: 0.4,
    resources: { oil: { reserves: 800, production: 150, unit: "mbbl", rank: 40 }, gas: { reserves: 50, production: 3, unit: "bcm", rank: 50 } },
    exports: { total: 120, partners: [{ country: "DE", amount: 20, percent: 17 }, { country: "SE", amount: 15, percent: 13 }, { country: "UK", amount: 12, percent: 10 }, { country: "US", amount: 10, percent: 8 }, { country: "NL", amount: 8, percent: 7 }], mainProducts: ["دارو", "ماشین‌آلات", "گوشت"] },
    imports: { total: 110, partners: [{ country: "DE", amount: 22, percent: 20 }, { country: "SE", amount: 12, percent: 11 }, { country: "CN", amount: 10, percent: 9 }, { country: "NL", amount: 8, percent: 7 }, { country: "PL", amount: 6, percent: 5 }], mainProducts: ["ماشین‌آلات", "نفت", "الکترونیک"] },
    investmentRisk: 5, relations: { "SE": "green", "DE": "green", "NO": "green" },
    customs: [{ name: "بندر کپنهاگ", coords: [55.6761, 12.5683], workingHours: "24/7" }]
  },
  "AT": {
    name: "اتریش", nameEn: "Austria",
    capital: { name: "وین", coords: [48.2082, 16.3738] },
    continent: "europe",
    gdp: 481, gdpRank: 29, gdpPerCapita: 54000,
    inflation: 7.8, unemployment: 4.8, currency: "EUR", currencyName: "یورو",
    population: 9000000, populationDensity: 109, populationGrowth: 0.3,
    resources: {},
    exports: { total: 200, partners: [{ country: "DE", amount: 60, percent: 30 }, { country: "US", amount: 20, percent: 10 }, { country: "IT", amount: 15, percent: 8 }, { country: "CH", amount: 12, percent: 6 }, { country: "FR", amount: 10, percent: 5 }], mainProducts: ["ماشین‌آلات", "خودرو", "الکترونیک"] },
    imports: { total: 195, partners: [{ country: "DE", amount: 55, percent: 28 }, { country: "IT", amount: 18, percent: 9 }, { country: "CN", amount: 15, percent: 8 }, { country: "CZ", amount: 12, percent: 6 }, { country: "PL", amount: 10, percent: 5 }], mainProducts: ["ماشین‌آلات", "نفت", "الکترونیک"] },
    investmentRisk: 10, relations: { "DE": "green", "IT": "green", "CH": "green" },
    customs: [{ name: "گمرک وین", coords: [48.2082, 16.3738], workingHours: "دوشنبه تا جمعه: 8:00-17:00" }]
  },
  "IE": {
    name: "ایرلند", nameEn: "Ireland",
    capital: { name: "دوبلین", coords: [53.3498, -6.2603] },
    continent: "europe",
    gdp: 533, gdpRank: 25, gdpPerCapita: 102000,
    inflation: 5.2, unemployment: 4.1, currency: "EUR", currencyName: "یورو",
    population: 5000000, populationDensity: 72, populationGrowth: 1.0,
    resources: {},
    exports: { total: 220, partners: [{ country: "US", amount: 60, percent: 27 }, { country: "BE", amount: 25, percent: 11 }, { country: "DE", amount: 20, percent: 9 }, { country: "CH", amount: 15, percent: 7 }, { country: "UK", amount: 12, percent: 5 }], mainProducts: ["دارو", "ماشین‌آلات", "الکترونیک"] },
    imports: { total: 140, partners: [{ country: "UK", amount: 25, percent: 18 }, { country: "US", amount: 20, percent: 14 }, { country: "FR", amount: 15, percent: 11 }, { country: "DE", amount: 12, percent: 9 }, { country: "CN", amount: 10, percent: 7 }], mainProducts: ["ماشین‌آلات", "نفت", "الکترونیک"] },
    investmentRisk: 10, relations: { "UK": "green", "US": "green", "DE": "green" },
    customs: [{ name: "بندر دوبلین", coords: [53.3498, -6.2603], workingHours: "24/7" }]
  },
  "BE": {
    name: "بلژیک", nameEn: "Belgium",
    capital: { name: "بروکسل", coords: [50.8503, 4.3517] },
    continent: "europe",
    gdp: 578, gdpRank: 24, gdpPerCapita: 50000,
    inflation: 2.3, unemployment: 5.5, currency: "EUR", currencyName: "یورو",
    population: 11600000, populationDensity: 383, populationGrowth: 0.4,
    resources: {},
    exports: { total: 500, partners: [{ country: "DE", amount: 100, percent: 20 }, { country: "FR", amount: 80, percent: 16 }, { country: "NL", amount: 70, percent: 14 }, { country: "UK", amount: 40, percent: 8 }, { country: "US", amount: 35, percent: 7 }], mainProducts: ["ماشین‌آلات", "شیمیایی", "الماس"] },
    imports: { total: 480, partners: [{ country: "NL", amount: 90, percent: 19 }, { country: "DE", amount: 85, percent: 18 }, { country: "FR", amount: 60, percent: 13 }, { country: "CN", amount: 40, percent: 8 }, { country: "US", amount: 30, percent: 6 }], mainProducts: ["ماشین‌آلات", "نفت", "الکترونیک"] },
    investmentRisk: 10, relations: { "NL": "green", "DE": "green", "FR": "green" },
    customs: [{ name: "بندر آنتورپ", coords: [51.2194, 4.4025], workingHours: "24/7" }]
  },
  "SK": {
    name: "اسلواکی", nameEn: "Slovakia",
    capital: { name: "براتیسلاوا", coords: [48.1486, 17.1077] },
    continent: "europe",
    gdp: 127, gdpRank: 60, gdpPerCapita: 23300,
    inflation: 10.7, unemployment: 5.8, currency: "EUR", currencyName: "یورو",
    population: 5500000, populationDensity: 114, populationGrowth: 0.0,
    resources: {},
    exports: { total: 105, partners: [{ country: "DE", amount: 35, percent: 33 }, { country: "CZ", amount: 12, percent: 11 }, { country: "PL", amount: 8, percent: 8 }, { country: "FR", amount: 7, percent: 7 }, { country: "IT", amount: 6, percent: 6 }], mainProducts: ["خودرو", "ماشین‌آلات", "الکترونیک"] },
    imports: { total: 100, partners: [{ country: "DE", amount: 30, percent: 30 }, { country: "CZ", amount: 12, percent: 12 }, { country: "CN", amount: 8, percent: 8 }, { country: "PL", amount: 7, percent: 7 }, { country: "IT", amount: 6, percent: 6 }], mainProducts: ["ماشین‌آلات", "نفت", "الکترونیک"] },
    investmentRisk: 20, relations: { "CZ": "green", "PL": "green", "HU": "green" },
    customs: [{ name: "گمرک براتیسلاوا", coords: [48.1486, 17.1077], workingHours: "دوشنبه تا جمعه: 8:00-17:00" }]
  },
  "BG": {
    name: "بلغارستان", nameEn: "Bulgaria",
    capital: { name: "صوفیه", coords: [42.6977, 23.3219] },
    continent: "europe",
    gdp: 90, gdpRank: 67, gdpPerCapita: 13000,
    inflation: 3.0, unemployment: 4.2, currency: "BGN", currencyName: "لف",
    population: 6900000, populationDensity: 64, populationGrowth: -0.7,
    resources: {},
    exports: { total: 42, partners: [{ country: "DE", amount: 8, percent: 19 }, { country: "IT", amount: 5, percent: 12 }, { country: "RO", amount: 4, percent: 10 }, { country: "TR", amount: 3.5, percent: 8 }, { country: "GR", amount: 3, percent: 7 }], mainProducts: ["ماشین‌آلات", "دارو", "غذا"] },
    imports: { total: 50, partners: [{ country: "DE", amount: 10, percent: 20 }, { country: "IT", amount: 6, percent: 12 }, { country: "CN", amount: 5, percent: 10 }, { country: "RO", amount: 4, percent: 8 }, { country: "RU", amount: 3.5, percent: 7 }], mainProducts: ["ماشین‌آلات", "نفت", "الکترونیک"] },
    investmentRisk: 30, relations: { "RO": "green", "GR": "green", "TR": "white" },
    customs: [{ name: "گمرک صوفیه", coords: [42.6977, 23.3219], workingHours: "دوشنبه تا جمعه: 8:00-17:00" }]
  },
  "RS": {
    name: "صربستان", nameEn: "Serbia",
    capital: { name: "بلگراد", coords: [44.7866, 20.4489] },
    continent: "europe",
    gdp: 63, gdpRank: 76, gdpPerCapita: 9200,
    inflation: 12.0, unemployment: 9.1, currency: "RSD", currencyName: "دینار",
    population: 8700000, populationDensity: 100, populationGrowth: -0.5,
    resources: {},
    exports: { total: 28, partners: [{ country: "DE", amount: 5, percent: 18 }, { country: "IT", amount: 4, percent: 14 }, { country: "BA", amount: 2.5, percent: 9 }, { country: "RU", amount: 2, percent: 7 }, { country: "CN", amount: 1.8, percent: 6 }], mainProducts: ["خودرو", "ماشین‌آلات", "غذا"] },
    imports: { total: 35, partners: [{ country: "DE", amount: 6, percent: 17 }, { country: "CN", amount: 5, percent: 14 }, { country: "IT", amount: 4.5, percent: 13 }, { country: "RU", amount: 3, percent: 9 }, { country: "HU", amount: 2, percent: 6 }], mainProducts: ["ماشین‌آلات", "نفت", "الکترونیک"] },
    investmentRisk: 40, relations: { "RU": "green", "CN": "green", "BA": "white" },
    customs: [{ name: "گمرک بلگراد", coords: [44.7866, 20.4489], workingHours: "دوشنبه تا جمعه: 8:00-17:00" }]
  },
  "HR": {
    name: "کرواسی", nameEn: "Croatia",
    capital: { name: "زاگرب", coords: [45.8150, 15.9819] },
    continent: "europe",
    gdp: 71, gdpRank: 79, gdpPerCapita: 17500,
    inflation: 8.4, unemployment: 6.5, currency: "EUR", currencyName: "یورو",
    population: 3900000, populationDensity: 73, populationGrowth: -0.6,
    resources: {},
    exports: { total: 25, partners: [{ country: "IT", amount: 4, percent: 16 }, { country: "DE", amount: 3.5, percent: 14 }, { country: "SI", amount: 2.5, percent: 10 }, { country: "HU", amount: 2, percent: 8 }, { country: "BA", amount: 1.5, percent: 6 }], mainProducts: ["ماشین‌آلات", "دارو", "غذا"] },
    imports: { total: 30, partners: [{ country: "IT", amount: 5, percent: 17 }, { country: "DE", amount: 4.5, percent: 15 }, { country: "CN", amount: 3, percent: 10 }, { country: "SI", amount: 2, percent: 7 }, { country: "HU", amount: 1.5, percent: 5 }], mainProducts: ["ماشین‌آلات", "نفت", "الکترونیک"] },
    investmentRisk: 25, relations: { "IT": "green", "SI": "green", "HU": "green" },
    customs: [{ name: "بندر رییکا", coords: [45.3271, 14.4422], workingHours: "24/7" }]
  },
  "SI": {
    name: "اسلوونی", nameEn: "Slovenia",
    capital: { name: "لیوبلیانا", coords: [46.0569, 14.5058] },
    continent: "europe",
    gdp: 62, gdpRank: 80, gdpPerCapita: 29800,
    inflation: 7.1, unemployment: 3.8, currency: "EUR", currencyName: "یورو",
    population: 2100000, populationDensity: 104, populationGrowth: 0.1,
    resources: {},
    exports: { total: 55, partners: [{ country: "DE", amount: 15, percent: 27 }, { country: "IT", amount: 8, percent: 15 }, { country: "HR", amount: 4, percent: 7 }, { country: "FR", amount: 3.5, percent: 6 }, { country: "AT", amount: 3, percent: 5 }], mainProducts: ["ماشین‌آلات", "دارو", "خودرو"] },
    imports: { total: 52, partners: [{ country: "DE", amount: 14, percent: 27 }, { country: "IT", amount: 7, percent: 13 }, { country: "CN", amount: 4, percent: 8 }, { country: "AT", amount: 3.5, percent: 7 }, { country: "HR", amount: 3, percent: 6 }], mainProducts: ["ماشین‌آلات", "نفت", "الکترونیک"] },
    investmentRisk: 15, relations: { "IT": "green", "AT": "green", "HR": "green" },
    customs: [{ name: "گمرک لیوبلیانا", coords: [46.0569, 14.5058], workingHours: "دوشنبه تا جمعه: 8:00-17:00" }]
  },
  "LT": {
    name: "لیتوانی", nameEn: "Lithuania",
    capital: { name: "ویلنیوس", coords: [54.6872, 25.2797] },
    continent: "europe",
    gdp: 76, gdpRank: 72, gdpPerCapita: 27000,
    inflation: 1.1, unemployment: 6.0, currency: "EUR", currencyName: "یورو",
    population: 2800000, populationDensity: 45, populationGrowth: -0.4,
    resources: {},
    exports: { total: 45, partners: [{ country: "LV", amount: 8, percent: 18 }, { country: "PL", amount: 7, percent: 16 }, { country: "DE", amount: 6, percent: 13 }, { country: "RU", amount: 4, percent: 9 }, { country: "EE", amount: 3.5, percent: 8 }], mainProducts: ["ماشین‌آلات", "دارو", "غذا"] },
    imports: { total: 50, partners: [{ country: "PL", amount: 9, percent: 18 }, { country: "DE", amount: 8, percent: 16 }, { country: "RU", amount: 5, percent: 10 }, { country: "LV", amount: 4, percent: 8 }, { country: "CN", amount: 3.5, percent: 7 }], mainProducts: ["ماشین‌آلات", "نفت", "الکترونیک"] },
    investmentRisk: 20, relations: { "LV": "green", "PL": "green", "EE": "green" },
    customs: [{ name: "بندر کلایپدا", coords: [55.7033, 21.1443], workingHours: "24/7" }]
  },
  "LV": {
    name: "لتونی", nameEn: "Latvia",
    capital: { name: "ریگا", coords: [56.9496, 24.1052] },
    continent: "europe",
    gdp: 42, gdpRank: 97, gdpPerCapita: 22000,
    inflation: 1.1, unemployment: 6.8, currency: "EUR", currencyName: "یورو",
    population: 1900000, populationDensity: 30, populationGrowth: -0.6,
    resources: {},
    exports: { total: 20, partners: [{ country: "LT", amount: 4, percent: 20 }, { country: "EE", amount: 3, percent: 15 }, { country: "DE", amount: 2.5, percent: 13 }, { country: "PL", amount: 2, percent: 10 }, { country: "RU", amount: 1.5, percent: 8 }], mainProducts: ["ماشین‌آلات", "دارو", "غذا"] },
    imports: { total: 25, partners: [{ country: "LT", amount: 5, percent: 20 }, { country: "DE", amount: 4, percent: 16 }, { country: "PL", amount: 3, percent: 12 }, { country: "RU", amount: 2.5, percent: 10 }, { country: "CN", amount: 2, percent: 8 }], mainProducts: ["ماشین‌آلات", "نفت", "الکترونیک"] },
    investmentRisk: 20, relations: { "LT": "green", "EE": "green", "PL": "green" },
    customs: [{ name: "بندر ریگا", coords: [56.9496, 24.1052], workingHours: "24/7" }]
  },
  "EE": {
    name: "استونی", nameEn: "Estonia",
    capital: { name: "تالین", coords: [59.4370, 24.7536] },
    continent: "europe",
    gdp: 38, gdpRank: 99, gdpPerCapita: 27000,
    inflation: 3.7, unemployment: 5.6, currency: "EUR", currencyName: "یورو",
    population: 1300000, populationDensity: 31, populationGrowth: 0.2,
    resources: {},
    exports: { total: 20, partners: [{ country: "FI", amount: 4, percent: 20 }, { country: "LV", amount: 3, percent: 15 }, { country: "LT", amount: 2.5, percent: 13 }, { country: "SE", amount: 2, percent: 10 }, { country: "DE", amount: 1.8, percent: 9 }], mainProducts: ["ماشین‌آلات", "الکترونیک", "غذا"] },
    imports: { total: 22, partners: [{ country: "FI", amount: 4.5, percent: 20 }, { country: "DE", amount: 3.5, percent: 16 }, { country: "LT", amount: 2.5, percent: 11 }, { country: "LV", amount: 2, percent: 9 }, { country: "CN", amount: 1.8, percent: 8 }], mainProducts: ["ماشین‌آلات", "نفت", "الکترونیک"] },
    investmentRisk: 15, relations: { "FI": "green", "LV": "green", "LT": "green" },
    customs: [{ name: "بندر تالین", coords: [59.4370, 24.7536], workingHours: "24/7" }]
  },

  // ===== کشورهای بیشتر آفریقا =====
  "NG": {
    name: "نیجریه", nameEn: "Nigeria",
    capital: { name: "آبوجا", coords: [9.0765, 7.3986] },
    continent: "africa",
    gdp: 477, gdpRank: 27, gdpPerCapita: 2200,
    inflation: 18.8, unemployment: 33.3, currency: "NGN", currencyName: "نایرا",
    population: 218000000, populationDensity: 240, populationGrowth: 2.5,
    resources: { oil: { reserves: 37000, production: 1800, unit: "mbbl", rank: 11 }, gas: { reserves: 5600, production: 45, unit: "bcm", rank: 9 } },
    exports: { total: 47, partners: [{ country: "IN", amount: 8, percent: 17 }, { country: "ES", amount: 6, percent: 13 }], mainProducts: ["نفت", "گاز", "کاکائو"] },
    imports: { total: 52, partners: [{ country: "CN", amount: 13, percent: 25 }, { country: "NL", amount: 5, percent: 10 }], mainProducts: ["ماشین‌آلات", "شیمیایی", "غذا"] },
    investmentRisk: 65, relations: { "US": "green", "UK": "green", "CN": "green" },
    customs: [{ name: "بندر لاگوس", coords: [6.4541, 3.3947] }]
  },
  "ZA": {
    name: "آفریقای جنوبی", nameEn: "South Africa",
    capital: { name: "پرتوریا", coords: [-25.7479, 28.2293] },
    continent: "africa",
    gdp: 405, gdpRank: 34, gdpPerCapita: 6700,
    inflation: 6.9, unemployment: 32.9, currency: "ZAR", currencyName: "رند",
    population: 60000000, populationDensity: 49, populationGrowth: 1.0,
    resources: { gold: { reserves: 6000, production: 100, unit: "tons", rank: 9 }, diamond: { reserves: 130, production: 8, unit: "mct", rank: 5 }, coal: { reserves: 10000, production: 250, unit: "mt", rank: 6 } },
    exports: { total: 123, partners: [{ country: "CN", amount: 12, percent: 10 }, { country: "US", amount: 10, percent: 8 }], mainProducts: ["طلا", "الماس", "زغال"] },
    imports: { total: 113, partners: [{ country: "CN", amount: 23, percent: 20 }, { country: "DE", amount: 11, percent: 10 }], mainProducts: ["ماشین‌آلات", "نفت", "الکترونیک"] },
    investmentRisk: 45, relations: { "US": "green", "CN": "green", "UK": "green" },
    customs: [{ name: "بندر دوربان", coords: [-29.8587, 31.0218] }, { name: "بندر کیپ‌تاون", coords: [-33.9249, 18.4241] }]
  },
  "EG": {
    name: "مصر", nameEn: "Egypt",
    capital: { name: "قاهره", coords: [30.0444, 31.2357] },
    continent: "africa",
    gdp: 477, gdpRank: 28, gdpPerCapita: 4500,
    inflation: 13.9, unemployment: 7.2, currency: "EGP", currencyName: "پوند",
    population: 104000000, populationDensity: 103, populationGrowth: 1.9,
    resources: { oil: { reserves: 4400, production: 600, unit: "mbbl", rank: 25 }, gas: { reserves: 2100, production: 67, unit: "bcm", rank: 13 } },
    exports: { total: 52, partners: [{ country: "IT", amount: 5, percent: 10 }, { country: "TR", amount: 5, percent: 10 }], mainProducts: ["نفت", "گاز", "پنبه"] },
    imports: { total: 89, partners: [{ country: "CN", amount: 18, percent: 20 }, { country: "SA", amount: 9, percent: 10 }], mainProducts: ["ماشین‌آلات", "غذا", "شیمیایی"] },
    investmentRisk: 50, relations: { "SA": "green", "AE": "green", "US": "green", "IL": "white" },
    customs: [{ name: "بندر اسکندریه", coords: [31.2001, 29.9187] }, { name: "بندر سعید", coords: [31.2653, 32.3019] }]
  },
  "KE": {
    name: "کنیا", nameEn: "Kenya",
    capital: { name: "نایروبی", coords: [-1.2921, 36.8219] },
    continent: "africa",
    gdp: 113, gdpRank: 62, gdpPerCapita: 2100,
    inflation: 7.9, unemployment: 5.7, currency: "KES", currencyName: "شیلینگ",
    population: 54000000, populationDensity: 94, populationGrowth: 2.2,
    resources: {},
    exports: { total: 7, partners: [{ country: "UG", amount: 0.8, percent: 11 }, { country: "US", amount: 0.7, percent: 10 }], mainProducts: ["چای", "قهوه", "گل"] },
    imports: { total: 20, partners: [{ country: "CN", amount: 4, percent: 20 }, { country: "IN", amount: 2, percent: 10 }], mainProducts: ["ماشین‌آلات", "نفت", "پلاستیک"] },
    investmentRisk: 50, relations: { "US": "green", "CN": "green", "UK": "green" },
    customs: [{ name: "بندر مومباسا", coords: [-4.0435, 39.6682] }]
  },
  "MA": {
    name: "مراکش", nameEn: "Morocco",
    capital: { name: "رباط", coords: [34.0209, -6.8416] },
    continent: "africa",
    gdp: 134, gdpRank: 57, gdpPerCapita: 3600,
    inflation: 6.6, unemployment: 11.8, currency: "MAD", currencyName: "درهم",
    population: 37000000, populationDensity: 83, populationGrowth: 1.0,
    resources: { phosphate: { reserves: 50000, production: 40, unit: "mt", rank: 1 } },
    exports: { total: 50, partners: [{ country: "ES", amount: 12, percent: 24 }, { country: "FR", amount: 11, percent: 22 }], mainProducts: ["فسفات", "پوشاک", "غذا"] },
    imports: { total: 65, partners: [{ country: "ES", amount: 10, percent: 15 }, { country: "FR", amount: 9, percent: 14 }], mainProducts: ["نفت", "ماشین‌آلات", "غذا"] },
    investmentRisk: 40, relations: { "FR": "green", "ES": "green", "US": "green", "DZ": "orange" },
    customs: [{ name: "بندر طنجه", coords: [35.7595, -5.8340], workingHours: "24/7" }, { name: "بندر کازابلانکا", coords: [33.5731, -7.5898], workingHours: "24/7" }]
  },
  "DZ": {
    name: "الجزایر", nameEn: "Algeria",
    capital: { name: "الجزیره", coords: [36.7538, 3.0588] },
    continent: "africa",
    gdp: 195, gdpRank: 59, gdpPerCapita: 4400,
    inflation: 9.3, unemployment: 11.4, currency: "DZD", currencyName: "دینار",
    population: 45000000, populationDensity: 19, populationGrowth: 1.4,
    resources: { oil: { reserves: 12200, production: 1000, unit: "mbbl", rank: 16 }, gas: { reserves: 4500, production: 100, unit: "bcm", rank: 10 } },
    exports: { total: 50, partners: [{ country: "IT", amount: 12, percent: 24 }, { country: "ES", amount: 8, percent: 16 }, { country: "FR", amount: 7, percent: 14 }, { country: "US", amount: 5, percent: 10 }, { country: "NL", amount: 4, percent: 8 }], mainProducts: ["نفت", "گاز", "فسفات"] },
    imports: { total: 55, partners: [{ country: "CN", amount: 12, percent: 22 }, { country: "FR", amount: 10, percent: 18 }, { country: "IT", amount: 6, percent: 11 }, { country: "ES", amount: 5, percent: 9 }, { country: "DE", amount: 4, percent: 7 }], mainProducts: ["ماشین‌آلات", "خودرو", "غذا"] },
    investmentRisk: 55, relations: { "FR": "white", "MA": "orange", "TN": "green" },
    customs: [{ name: "بندر الجزیره", coords: [36.7538, 3.0588], workingHours: "شنبه تا پنجشنبه: 8:00-17:00" }]
  },
  "LY": {
    name: "لیبی", nameEn: "Libya",
    capital: { name: "طرابلس", coords: [32.8872, 13.1913] },
    continent: "africa",
    gdp: 45, gdpRank: 93, gdpPerCapita: 6800,
    inflation: 2.8, unemployment: 19.0, currency: "LYD", currencyName: "دینار",
    population: 7000000, populationDensity: 4, populationGrowth: 1.4,
    resources: { oil: { reserves: 48000, production: 1200, unit: "mbbl", rank: 9 }, gas: { reserves: 1500, production: 12, unit: "bcm", rank: 24 } },
    exports: { total: 20, partners: [{ country: "IT", amount: 6, percent: 30 }, { country: "ES", amount: 3, percent: 15 }, { country: "DE", amount: 2.5, percent: 13 }, { country: "CN", amount: 2, percent: 10 }, { country: "FR", amount: 1.5, percent: 8 }], mainProducts: ["نفت", "گاز"] },
    imports: { total: 15, partners: [{ country: "CN", amount: 4, percent: 27 }, { country: "IT", amount: 3, percent: 20 }, { country: "TR", amount: 2, percent: 13 }, { country: "DE", amount: 1.5, percent: 10 }, { country: "ES", amount: 1, percent: 7 }], mainProducts: ["ماشین‌آلات", "غذا", "دارو"] },
    investmentRisk: 80, relations: { "IT": "green", "EG": "white", "TN": "white" },
    customs: [{ name: "بندر طرابلس", coords: [32.8872, 13.1913], workingHours: "شنبه تا پنجشنبه: 8:00-17:00" }]
  },
  "TN": {
    name: "تونس", nameEn: "Tunisia",
    capital: { name: "تونس", coords: [36.8065, 10.1815] },
    continent: "africa",
    gdp: 46, gdpRank: 92, gdpPerCapita: 3900,
    inflation: 7.3, unemployment: 16.2, currency: "TND", currencyName: "دینار",
    population: 12000000, populationDensity: 76, populationGrowth: 0.9,
    resources: { phosphate: { reserves: 100, production: 4, unit: "mt", rank: 15 } },
    exports: { total: 18, partners: [{ country: "FR", amount: 5, percent: 28 }, { country: "IT", amount: 3, percent: 17 }, { country: "DE", amount: 2, percent: 11 }, { country: "ES", amount: 1.5, percent: 8 }, { country: "LY", amount: 1, percent: 6 }], mainProducts: ["پوشاک", "فسفات", "زیتون"] },
    imports: { total: 24, partners: [{ country: "IT", amount: 4, percent: 17 }, { country: "FR", amount: 3.5, percent: 15 }, { country: "CN", amount: 3, percent: 13 }, { country: "DE", amount: 2.5, percent: 10 }, { country: "ES", amount: 2, percent: 8 }], mainProducts: ["نفت", "ماشین‌آلات", "غذا"] },
    investmentRisk: 45, relations: { "FR": "green", "IT": "green", "LY": "white" },
    customs: [{ name: "بندر تونس", coords: [36.8065, 10.1815], workingHours: "24/7" }]
  },
  "SD": {
    name: "سودان", nameEn: "Sudan",
    capital: { name: "خرطوم", coords: [15.5007, 32.5599] },
    continent: "africa",
    gdp: 34, gdpRank: 103, gdpPerCapita: 750,
    inflation: 163.0, unemployment: 20.0, currency: "SDG", currencyName: "پوند",
    population: 46000000, populationDensity: 24, populationGrowth: 2.4,
    resources: { oil: { reserves: 5000, production: 60, unit: "mbbl", rank: 30 }, gold: { reserves: 1000, production: 50, unit: "tons", rank: 12 } },
    exports: { total: 4, partners: [{ country: "CN", amount: 1.5, percent: 38 }, { country: "AE", amount: 0.8, percent: 20 }, { country: "SA", amount: 0.5, percent: 13 }, { country: "IN", amount: 0.3, percent: 8 }, { country: "EG", amount: 0.2, percent: 5 }], mainProducts: ["طلا", "نفت", "پنبه"] },
    imports: { total: 8, partners: [{ country: "CN", amount: 2.5, percent: 31 }, { country: "AE", amount: 1.5, percent: 19 }, { country: "SA", amount: 1, percent: 13 }, { country: "IN", amount: 0.8, percent: 10 }, { country: "EG", amount: 0.5, percent: 6 }], mainProducts: ["غذا", "ماشین‌آلات", "دارو"] },
    investmentRisk: 95, relations: { "EG": "orange", "ET": "orange", "SS": "red" },
    customs: [{ name: "گمرک خرطوم", coords: [15.5007, 32.5599], workingHours: "یکشنبه تا پنجشنبه: 8:00-16:00" }]
  },
  "ET": {
    name: "اتیوپی", nameEn: "Ethiopia",
    capital: { name: "آدیس‌آبابا", coords: [9.1450, 38.7667] },
    continent: "africa",
    gdp: 127, gdpRank: 60, gdpPerCapita: 1100,
    inflation: 33.0, unemployment: 5.1, currency: "ETB", currencyName: "بیر",
    population: 120000000, populationDensity: 115, populationGrowth: 2.5,
    resources: { gold: { reserves: 500, production: 8, unit: "tons", rank: 35 } },
    exports: { total: 4.5, partners: [{ country: "CN", amount: 1.2, percent: 27 }, { country: "US", amount: 0.8, percent: 18 }, { country: "SA", amount: 0.5, percent: 11 }, { country: "DE", amount: 0.4, percent: 9 }, { country: "DJ", amount: 0.3, percent: 7 }], mainProducts: ["قهوه", "طلا", "حبوبات"] },
    imports: { total: 18, partners: [{ country: "CN", amount: 6, percent: 33 }, { country: "IN", amount: 2, percent: 11 }, { country: "SA", amount: 1.5, percent: 8 }, { country: "US", amount: 1.2, percent: 7 }, { country: "TR", amount: 1, percent: 6 }], mainProducts: ["ماشین‌آلات", "نفت", "غذا"] },
    investmentRisk: 60, relations: { "ER": "orange", "SD": "orange", "KE": "white" },
    customs: [{ name: "گمرک آدیس‌آبابا", coords: [9.1450, 38.7667], workingHours: "دوشنبه تا جمعه: 8:00-17:00" }]
  },
  "TZ": {
    name: "تانزانیا", nameEn: "Tanzania",
    capital: { name: "دودوما", coords: [-6.1630, 35.7516] },
    continent: "africa",
    gdp: 75, gdpRank: 73, gdpPerCapita: 1200,
    inflation: 3.7, unemployment: 2.2, currency: "TZS", currencyName: "شیلینگ",
    population: 63000000, populationDensity: 71, populationGrowth: 3.0,
    resources: { gold: { reserves: 2000, production: 50, unit: "tons", rank: 15 }, tanzanite: { reserves: 100, production: 2, unit: "kt", rank: 1 } },
    exports: { total: 7, partners: [{ country: "IN", amount: 1.5, percent: 21 }, { country: "CN", amount: 1.2, percent: 17 }, { country: "ZA", amount: 0.8, percent: 11 }, { country: "KE", amount: 0.6, percent: 9 }, { country: "JP", amount: 0.5, percent: 7 }], mainProducts: ["طلا", "تانزانیت", "پنبه"] },
    imports: { total: 12, partners: [{ country: "CN", amount: 3.5, percent: 29 }, { country: "IN", amount: 2, percent: 17 }, { country: "ZA", amount: 1.5, percent: 13 }, { country: "AE", amount: 1, percent: 8 }, { country: "KE", amount: 0.8, percent: 7 }], mainProducts: ["ماشین‌آلات", "نفت", "الکترونیک"] },
    investmentRisk: 45, relations: { "KE": "green", "UG": "green", "ZA": "green" },
    customs: [{ name: "بندر دارالسلام", coords: [-6.7924, 39.2083], workingHours: "24/7" }]
  },
  "UG": {
    name: "اوگاندا", nameEn: "Uganda",
    capital: { name: "کامپالا", coords: [0.3476, 32.5825] },
    continent: "africa",
    gdp: 48, gdpRank: 90, gdpPerCapita: 1000,
    inflation: 3.2, unemployment: 2.9, currency: "UGX", currencyName: "شیلینگ",
    population: 48000000, populationDensity: 241, populationGrowth: 3.0,
    resources: { gold: { reserves: 300, production: 5, unit: "tons", rank: 40 } },
    exports: { total: 6, partners: [{ country: "KE", amount: 1.2, percent: 20 }, { country: "RW", amount: 0.8, percent: 13 }, { country: "CN", amount: 0.7, percent: 12 }, { country: "AE", amount: 0.6, percent: 10 }, { country: "IN", amount: 0.5, percent: 8 }], mainProducts: ["قهوه", "طلا", "چای"] },
    imports: { total: 9, partners: [{ country: "CN", amount: 2.5, percent: 28 }, { country: "IN", amount: 1.5, percent: 17 }, { country: "KE", amount: 1, percent: 11 }, { country: "AE", amount: 0.8, percent: 9 }, { country: "JP", amount: 0.6, percent: 7 }], mainProducts: ["ماشین‌آلات", "نفت", "غذا"] },
    investmentRisk: 50, relations: { "KE": "green", "RW": "green", "TZ": "green" },
    customs: [{ name: "گمرک کامپالا", coords: [0.3476, 32.5825], workingHours: "دوشنبه تا جمعه: 8:00-17:00" }]
  },
  "GH": {
    name: "غنا", nameEn: "Ghana",
    capital: { name: "آکرا", coords: [5.6037, -0.1870] },
    continent: "africa",
    gdp: 78, gdpRank: 69, gdpPerCapita: 2400,
    inflation: 23.2, unemployment: 3.6, currency: "GHS", currencyName: "سدی",
    population: 32000000, populationDensity: 137, populationGrowth: 2.1,
    resources: { gold: { reserves: 1000, production: 130, unit: "tons", rank: 11 }, oil: { reserves: 660, production: 200, unit: "mbbl", rank: 50 }, cocoa: { reserves: 0, production: 800, unit: "kt", rank: 2 } },
    exports: { total: 18, partners: [{ country: "CH", amount: 3, percent: 17 }, { country: "IN", amount: 2.5, percent: 14 }, { country: "ZA", amount: 2, percent: 11 }, { country: "CN", amount: 1.8, percent: 10 }, { country: "US", amount: 1.5, percent: 8 }], mainProducts: ["طلا", "نفت", "کاکائو"] },
    imports: { total: 16, partners: [{ country: "CN", amount: 4, percent: 25 }, { country: "IN", amount: 2, percent: 13 }, { country: "NL", amount: 1.5, percent: 9 }, { country: "US", amount: 1.2, percent: 8 }, { country: "ZA", amount: 1, percent: 6 }], mainProducts: ["ماشین‌آلات", "نفت", "غذا"] },
    investmentRisk: 40, relations: { "US": "green", "UK": "green", "CN": "green" },
    customs: [{ name: "بندر تما", coords: [5.6037, -0.1870], workingHours: "24/7" }]
  },
  "SN": {
    name: "سنگال", nameEn: "Senegal",
    capital: { name: "داکار", coords: [14.7167, -17.4677] },
    continent: "africa",
    gdp: 28, gdpRank: 108, gdpPerCapita: 1600,
    inflation: 2.0, unemployment: 3.0, currency: "XOF", currencyName: "فرانک",
    population: 17000000, populationDensity: 87, populationGrowth: 2.6,
    resources: { phosphate: { reserves: 50, production: 1.5, unit: "mt", rank: 12 } },
    exports: { total: 5, partners: [{ country: "ML", amount: 1, percent: 20 }, { country: "FR", amount: 0.8, percent: 16 }, { country: "CH", amount: 0.6, percent: 12 }, { country: "IN", amount: 0.5, percent: 10 }, { country: "CN", amount: 0.4, percent: 8 }], mainProducts: ["فسفات", "ماهی", "بادام زمینی"] },
    imports: { total: 8, partners: [{ country: "CN", amount: 2, percent: 25 }, { country: "FR", amount: 1.5, percent: 19 }, { country: "IN", amount: 0.8, percent: 10 }, { country: "NL", amount: 0.6, percent: 8 }, { country: "TR", amount: 0.5, percent: 6 }], mainProducts: ["نفت", "ماشین‌آلات", "غذا"] },
    investmentRisk: 35, relations: { "FR": "green", "ML": "green", "MR": "white" },
    customs: [{ name: "بندر داکار", coords: [14.7167, -17.4677], workingHours: "24/7" }]
  },
  "CI": {
    name: "ساحل عاج", nameEn: "Ivory Coast",
    capital: { name: "یاموسوکرو", coords: [6.8276, -5.2893] },
    continent: "africa",
    gdp: 70, gdpRank: 75, gdpPerCapita: 2600,
    inflation: 2.5, unemployment: 2.5, currency: "XOF", currencyName: "فرانک",
    population: 28000000, populationDensity: 88, populationGrowth: 2.5,
    resources: { cocoa: { reserves: 0, production: 2200, unit: "kt", rank: 1 }, gold: { reserves: 200, production: 25, unit: "tons", rank: 30 } },
    exports: { total: 15, partners: [{ country: "NL", amount: 3, percent: 20 }, { country: "US", amount: 2.5, percent: 17 }, { country: "FR", amount: 2, percent: 13 }, { country: "BE", amount: 1.5, percent: 10 }, { country: "DE", amount: 1.2, percent: 8 }], mainProducts: ["کاکائو", "طلا", "نفت"] },
    imports: { total: 12, partners: [{ country: "CN", amount: 2.5, percent: 21 }, { country: "FR", amount: 2, percent: 17 }, { country: "NL", amount: 1.5, percent: 13 }, { country: "IN", amount: 1, percent: 8 }, { country: "US", amount: 0.8, percent: 7 }], mainProducts: ["ماشین‌آلات", "نفت", "غذا"] },
    investmentRisk: 40, relations: { "FR": "green", "GH": "white", "ML": "white" },
    customs: [{ name: "بندر آبیدجان", coords: [5.3600, -4.0083], workingHours: "24/7" }]
  },
  "CM": {
    name: "کامرون", nameEn: "Cameroon",
    capital: { name: "یائونده", coords: [3.8480, 11.5021] },
    continent: "africa",
    gdp: 45, gdpRank: 94, gdpPerCapita: 1600,
    inflation: 6.2, unemployment: 3.8, currency: "XAF", currencyName: "فرانک",
    population: 27000000, populationDensity: 58, populationGrowth: 2.6,
    resources: { oil: { reserves: 200, production: 70, unit: "mbbl", rank: 55 }, gas: { reserves: 110, production: 0.2, unit: "bcm", rank: 50 } },
    exports: { total: 6, partners: [{ country: "CN", amount: 1.5, percent: 25 }, { country: "IT", amount: 0.8, percent: 13 }, { country: "FR", amount: 0.7, percent: 12 }, { country: "ES", amount: 0.5, percent: 8 }, { country: "NL", amount: 0.4, percent: 7 }], mainProducts: ["نفت", "کاکائو", "قهوه"] },
    imports: { total: 7, partners: [{ country: "CN", amount: 1.8, percent: 26 }, { country: "FR", amount: 1.2, percent: 17 }, { country: "IN", amount: 0.6, percent: 9 }, { country: "BE", amount: 0.5, percent: 7 }, { country: "IT", amount: 0.4, percent: 6 }], mainProducts: ["ماشین‌آلات", "نفت", "غذا"] },
    investmentRisk: 50, relations: { "FR": "green", "NG": "white", "TD": "white" },
    customs: [{ name: "بندر دوالا", coords: [4.0511, 9.7679], workingHours: "24/7" }]
  },
  "AO": {
    name: "آنگولا", nameEn: "Angola",
    capital: { name: "لواندا", coords: [-8.8383, 13.2344] },
    continent: "africa",
    gdp: 107, gdpRank: 63, gdpPerCapita: 3200,
    inflation: 13.8, unemployment: 30.0, currency: "AOA", currencyName: "کوانزا",
    population: 35000000, populationDensity: 28, populationGrowth: 3.2,
    resources: { oil: { reserves: 9000, production: 1200, unit: "mbbl", rank: 17 }, diamonds: { reserves: 180, production: 9, unit: "mct", rank: 4 } },
    exports: { total: 35, partners: [{ country: "CN", amount: 18, percent: 51 }, { country: "IN", amount: 4, percent: 11 }, { country: "US", amount: 3, percent: 9 }, { country: "ZA", amount: 2, percent: 6 }, { country: "PT", amount: 1.5, percent: 4 }], mainProducts: ["نفت", "الماس", "گاز"] },
    imports: { total: 20, partners: [{ country: "CN", amount: 6, percent: 30 }, { country: "PT", amount: 2.5, percent: 13 }, { country: "US", amount: 2, percent: 10 }, { country: "ZA", amount: 1.5, percent: 8 }, { country: "IN", amount: 1.2, percent: 6 }], mainProducts: ["ماشین‌آلات", "غذا", "دارو"] },
    investmentRisk: 65, relations: { "CN": "green", "PT": "green", "ZA": "green" },
    customs: [{ name: "بندر لواندا", coords: [-8.8383, 13.2344], workingHours: "24/7" }]
  },
  "MZ": {
    name: "موزامبیک", nameEn: "Mozambique",
    capital: { name: "ماپوتو", coords: [-25.9692, 32.5732] },
    continent: "africa",
    gdp: 17, gdpRank: 133, gdpPerCapita: 500,
    inflation: 5.0, unemployment: 3.5, currency: "MZN", currencyName: "متیکال",
    population: 32000000, populationDensity: 41, populationGrowth: 2.8,
    resources: { gas: { reserves: 2800, production: 0, unit: "bcm", rank: 14 }, coal: { reserves: 2000, production: 7, unit: "mt", rank: 20 } },
    exports: { total: 5, partners: [{ country: "IN", amount: 1.2, percent: 24 }, { country: "ZA", amount: 0.8, percent: 16 }, { country: "CN", amount: 0.7, percent: 14 }, { country: "NL", amount: 0.5, percent: 10 }, { country: "ES", amount: 0.4, percent: 8 }], mainProducts: ["زغال", "آلومینیوم", "میگو"] },
    imports: { total: 8, partners: [{ country: "ZA", amount: 2, percent: 25 }, { country: "CN", amount: 1.5, percent: 19 }, { country: "IN", amount: 1, percent: 13 }, { country: "PT", amount: 0.6, percent: 8 }, { country: "AE", amount: 0.5, percent: 6 }], mainProducts: ["ماشین‌آلات", "نفت", "غذا"] },
    investmentRisk: 55, relations: { "ZA": "green", "TZ": "green", "MW": "green" },
    customs: [{ name: "بندر ماپوتو", coords: [-25.9692, 32.5732], workingHours: "24/7" }]
  },
  "ZM": {
    name: "زامبیا", nameEn: "Zambia",
    capital: { name: "لوساکا", coords: [-15.3875, 28.3228] },
    continent: "africa",
    gdp: 29, gdpRank: 107, gdpPerCapita: 1500,
    inflation: 10.2, unemployment: 12.9, currency: "ZMW", currencyName: "کواچا",
    population: 20000000, populationDensity: 27, populationGrowth: 2.9,
    resources: { copper: { reserves: 20000, production: 850, unit: "kt", rank: 7 }, cobalt: { reserves: 340, production: 8, unit: "kt", rank: 2 } },
    exports: { total: 11, partners: [{ country: "CH", amount: 3, percent: 27 }, { country: "CN", amount: 2.5, percent: 23 }, { country: "ZA", amount: 1.5, percent: 14 }, { country: "IN", amount: 1, percent: 9 }, { country: "AE", amount: 0.8, percent: 7 }], mainProducts: ["مس", "کبالت", "طلا"] },
    imports: { total: 9, partners: [{ country: "ZA", amount: 2.5, percent: 28 }, { country: "CN", amount: 2, percent: 22 }, { country: "IN", amount: 1, percent: 11 }, { country: "AE", amount: 0.8, percent: 9 }, { country: "KE", amount: 0.5, percent: 6 }], mainProducts: ["ماشین‌آلات", "نفت", "غذا"] },
    investmentRisk: 50, relations: { "ZA": "green", "TZ": "green", "MW": "green" },
    customs: [{ name: "گمرک لوساکا", coords: [-15.3875, 28.3228], workingHours: "دوشنبه تا جمعه: 8:00-17:00" }]
  },
  "ZW": {
    name: "زیمبابوه", nameEn: "Zimbabwe",
    capital: { name: "هاراره", coords: [-17.8292, 31.0522] },
    continent: "africa",
    gdp: 28, gdpRank: 109, gdpPerCapita: 1800,
    inflation: 87.0, unemployment: 5.2, currency: "ZWL", currencyName: "دلار",
    population: 16000000, populationDensity: 41, populationGrowth: 2.0,
    resources: { platinum: { reserves: 1200, production: 15, unit: "tons", rank: 3 }, gold: { reserves: 200, production: 20, unit: "tons", rank: 30 }, diamonds: { reserves: 50, production: 1, unit: "mct", rank: 10 } },
    exports: { total: 6, partners: [{ country: "ZA", amount: 1.5, percent: 25 }, { country: "CN", amount: 1.2, percent: 20 }, { country: "AE", amount: 0.8, percent: 13 }, { country: "MO", amount: 0.6, percent: 10 }, { country: "IN", amount: 0.5, percent: 8 }], mainProducts: ["پلاتین", "طلا", "الماس"] },
    imports: { total: 7, partners: [{ country: "ZA", amount: 2, percent: 29 }, { country: "CN", amount: 1.5, percent: 21 }, { country: "IN", amount: 0.8, percent: 11 }, { country: "MO", amount: 0.6, percent: 9 }, { country: "AE", amount: 0.5, percent: 7 }], mainProducts: ["ماشین‌آلات", "نفت", "غذا"] },
    investmentRisk: 70, relations: { "ZA": "green", "MO": "green", "BW": "white" },
    customs: [{ name: "گمرک هاراره", coords: [-17.8292, 31.0522], workingHours: "دوشنبه تا جمعه: 8:00-17:00" }]
  },
  "MG": {
    name: "ماداگاسکار", nameEn: "Madagascar",
    capital: { name: "آنتاناناریوو", coords: [-18.8792, 47.5079] },
    continent: "africa",
    gdp: 15, gdpRank: 137, gdpPerCapita: 500,
    inflation: 8.0, unemployment: 1.8, currency: "MGA", currencyName: "آریاری",
    population: 29000000, populationDensity: 50, populationGrowth: 2.7,
    resources: { nickel: { reserves: 120, production: 0.5, unit: "kt", rank: 15 }, graphite: { reserves: 100, production: 0.3, unit: "kt", rank: 2 } },
    exports: { total: 3, partners: [{ country: "FR", amount: 0.8, percent: 27 }, { country: "US", amount: 0.6, percent: 20 }, { country: "CN", amount: 0.5, percent: 17 }, { country: "IN", amount: 0.3, percent: 10 }, { country: "DE", amount: 0.2, percent: 7 }], mainProducts: ["وانیل", "نیکل", "گرافیت"] },
    imports: { total: 4.5, partners: [{ country: "CN", amount: 1.2, percent: 27 }, { country: "FR", amount: 0.8, percent: 18 }, { country: "IN", amount: 0.5, percent: 11 }, { country: "AE", amount: 0.4, percent: 9 }, { country: "ZA", amount: 0.3, percent: 7 }], mainProducts: ["ماشین‌آلات", "نفت", "غذا"] },
    investmentRisk: 50, relations: { "FR": "green", "MU": "green", "MZ": "white" },
    customs: [{ name: "بندر تواماسینا", coords: [-18.1416, 49.3958], workingHours: "24/7" }]
  },
  "RW": {
    name: "روآندا", nameEn: "Rwanda",
    capital: { name: "کیگالی", coords: [-1.9441, 30.0619] },
    continent: "africa",
    gdp: 13, gdpRank: 139, gdpPerCapita: 950,
    inflation: 7.7, unemployment: 13.0, currency: "RWF", currencyName: "فرانک",
    population: 14000000, populationDensity: 571, populationGrowth: 2.3,
    resources: { tin: { reserves: 65, production: 0.3, unit: "kt", rank: 10 }, tungsten: { reserves: 20, production: 0.1, unit: "kt", rank: 8 } },
    exports: { total: 1.2, partners: [{ country: "CH", amount: 0.3, percent: 25 }, { country: "KE", amount: 0.2, percent: 17 }, { country: "CN", amount: 0.18, percent: 15 }, { country: "UG", amount: 0.15, percent: 13 }, { country: "AE", amount: 0.12, percent: 10 }], mainProducts: ["قهوه", "چای", "قلع"] },
    imports: { total: 3, partners: [{ country: "CN", amount: 0.8, percent: 27 }, { country: "KE", amount: 0.5, percent: 17 }, { country: "UG", amount: 0.4, percent: 13 }, { country: "IN", amount: 0.3, percent: 10 }, { country: "AE", amount: 0.25, percent: 8 }], mainProducts: ["ماشین‌آلات", "نفت", "غذا"] },
    investmentRisk: 45, relations: { "UG": "green", "TZ": "green", "KE": "green" },
    customs: [{ name: "گمرک کیگالی", coords: [-1.9441, 30.0619], workingHours: "دوشنبه تا جمعه: 8:00-17:00" }]
  },
  "BW": {
    name: "بوتسوانا", nameEn: "Botswana",
    capital: { name: "گابورون", coords: [-24.6282, 25.9231] },
    continent: "africa",
    gdp: 20, gdpRank: 126, gdpPerCapita: 8500,
    inflation: 2.8, unemployment: 20.7, currency: "BWP", currencyName: "پولا",
    population: 2400000, populationDensity: 4, populationGrowth: 1.4,
    resources: { diamonds: { reserves: 200, production: 20, unit: "mct", rank: 1 }, copper: { reserves: 2000, production: 25, unit: "kt", rank: 25 } },
    exports: { total: 6, partners: [{ country: "BE", amount: 1.5, percent: 25 }, { country: "ZA", amount: 1.2, percent: 20 }, { country: "AE", amount: 0.8, percent: 13 }, { country: "IN", amount: 0.6, percent: 10 }, { country: "CN", amount: 0.5, percent: 8 }], mainProducts: ["الماس", "مس", "نیکل"] },
    imports: { total: 7, partners: [{ country: "ZA", amount: 2.5, percent: 36 }, { country: "CN", amount: 1.2, percent: 17 }, { country: "BW", amount: 0.8, percent: 11 }, { country: "IN", amount: 0.6, percent: 9 }, { country: "AE", amount: 0.5, percent: 7 }], mainProducts: ["ماشین‌آلات", "نفت", "غذا"] },
    investmentRisk: 30, relations: { "ZA": "green", "ZW": "white", "NA": "green" },
    customs: [{ name: "گمرک گابورون", coords: [-24.6282, 25.9231], workingHours: "دوشنبه تا جمعه: 8:00-17:00" }]
  },
  "NA": {
    name: "نامیبیا", nameEn: "Namibia",
    capital: { name: "ویندهوک", coords: [-22.5609, 17.0658] },
    continent: "africa",
    gdp: 13, gdpRank: 138, gdpPerCapita: 5200,
    inflation: 5.3, unemployment: 20.0, currency: "NAD", currencyName: "دلار",
    population: 2600000, populationDensity: 3, populationGrowth: 1.6,
    resources: { diamonds: { reserves: 80, production: 1.5, unit: "mct", rank: 6 }, uranium: { reserves: 470, production: 5.5, unit: "kt", rank: 4 } },
    exports: { total: 5, partners: [{ country: "ZA", amount: 1.5, percent: 30 }, { country: "BE", amount: 0.8, percent: 16 }, { country: "CN", amount: 0.6, percent: 12 }, { country: "BW", amount: 0.5, percent: 10 }, { country: "IN", amount: 0.4, percent: 8 }], mainProducts: ["الماس", "اورانیوم", "ماهی"] },
    imports: { total: 6.5, partners: [{ country: "ZA", amount: 2.5, percent: 38 }, { country: "CN", amount: 1, percent: 15 }, { country: "BW", amount: 0.6, percent: 9 }, { country: "IN", amount: 0.5, percent: 8 }, { country: "DE", amount: 0.4, percent: 6 }], mainProducts: ["ماشین‌آلات", "نفت", "غذا"] },
    investmentRisk: 35, relations: { "ZA": "green", "BW": "green", "AO": "white" },
    customs: [{ name: "بندر والویس بی", coords: [-22.9576, 14.5053], workingHours: "24/7" }]
  },
  "MU": {
    name: "موریس", nameEn: "Mauritius",
    capital: { name: "پورت لوئیس", coords: [-20.1609, 57.5012] },
    continent: "africa",
    gdp: 15, gdpRank: 136, gdpPerCapita: 11000,
    inflation: 7.0, unemployment: 6.7, currency: "MUR", currencyName: "روپیه",
    population: 1300000, populationDensity: 640, populationGrowth: 0.1,
    resources: {},
    exports: { total: 2.8, partners: [{ country: "FR", amount: 0.6, percent: 21 }, { country: "US", amount: 0.5, percent: 18 }, { country: "UK", amount: 0.4, percent: 14 }, { country: "ZA", amount: 0.3, percent: 11 }, { country: "IN", amount: 0.25, percent: 9 }], mainProducts: ["شکر", "پوشاک", "ماهی"] },
    imports: { total: 5.5, partners: [{ country: "IN", amount: 1.2, percent: 22 }, { country: "CN", amount: 1, percent: 18 }, { country: "FR", amount: 0.8, percent: 15 }, { country: "ZA", amount: 0.6, percent: 11 }, { country: "AE", amount: 0.4, percent: 7 }], mainProducts: ["ماشین‌آلات", "نفت", "غذا"] },
    investmentRisk: 25, relations: { "FR": "green", "UK": "green", "IN": "green" },
    customs: [{ name: "بندر پورت لوئیس", coords: [-20.1609, 57.5012], workingHours: "24/7" }]
  },
  "MR": {
    name: "موریتانی", nameEn: "Mauritania",
    capital: { name: "نواکشوت", coords: [18.0735, -15.9582] },
    continent: "africa",
    gdp: 10, gdpRank: 141, gdpPerCapita: 2200,
    inflation: 5.0, unemployment: 10.2, currency: "MRU", currencyName: "اوگویا",
    population: 4800000, populationDensity: 5, populationGrowth: 2.7,
    resources: { iron: { reserves: 1500, production: 12, unit: "mt", rank: 15 }, gold: { reserves: 25, production: 1, unit: "tons", rank: 50 } },
    exports: { total: 2.5, partners: [{ country: "CN", amount: 0.8, percent: 32 }, { country: "CH", amount: 0.5, percent: 20 }, { country: "ES", amount: 0.3, percent: 12 }, { country: "IT", amount: 0.25, percent: 10 }, { country: "SN", amount: 0.2, percent: 8 }], mainProducts: ["آهن", "طلا", "ماهی"] },
    imports: { total: 3.5, partners: [{ country: "CN", amount: 1, percent: 29 }, { country: "FR", amount: 0.6, percent: 17 }, { country: "ES", amount: 0.4, percent: 11 }, { country: "SN", amount: 0.3, percent: 9 }, { country: "AE", amount: 0.25, percent: 7 }], mainProducts: ["ماشین‌آلات", "نفت", "غذا"] },
    investmentRisk: 50, relations: { "SN": "white", "ML": "white", "DZ": "white" },
    customs: [{ name: "بندر نواکشوت", coords: [18.0735, -15.9582], workingHours: "24/7" }]
  },
  "ML": {
    name: "مالی", nameEn: "Mali",
    capital: { name: "باماکو", coords: [12.6392, -8.0029] },
    continent: "africa",
    gdp: 19, gdpRank: 127, gdpPerCapita: 900,
    inflation: 5.0, unemployment: 5.0, currency: "XOF", currencyName: "فرانک",
    population: 22000000, populationDensity: 18, populationGrowth: 3.0,
    resources: { gold: { reserves: 800, production: 60, unit: "tons", rank: 14 } },
    exports: { total: 3.5, partners: [{ country: "CH", amount: 0.9, percent: 26 }, { country: "SN", amount: 0.6, percent: 17 }, { country: "CN", amount: 0.5, percent: 14 }, { country: "IN", amount: 0.4, percent: 11 }, { country: "BF", amount: 0.3, percent: 9 }], mainProducts: ["طلا", "پنبه", "دام"] },
    imports: { total: 4.5, partners: [{ country: "CN", amount: 1.2, percent: 27 }, { country: "SN", amount: 0.8, percent: 18 }, { country: "FR", amount: 0.6, percent: 13 }, { country: "IN", amount: 0.5, percent: 11 }, { country: "BF", amount: 0.4, percent: 9 }], mainProducts: ["ماشین‌آلات", "نفت", "غذا"] },
    investmentRisk: 70, relations: { "SN": "green", "BF": "green", "NE": "white" },
    customs: [{ name: "گمرک باماکو", coords: [12.6392, -8.0029], workingHours: "دوشنبه تا جمعه: 8:00-17:00" }]
  },
  "BF": {
    name: "بورکینافاسو", nameEn: "Burkina Faso",
    capital: { name: "اوآگادوگو", coords: [12.3714, -1.5197] },
    continent: "africa",
    gdp: 20, gdpRank: 124, gdpPerCapita: 900,
    inflation: 0.5, unemployment: 5.0, currency: "XOF", currencyName: "فرانک",
    population: 22000000, populationDensity: 80, populationGrowth: 2.6,
    resources: { gold: { reserves: 200, production: 60, unit: "tons", rank: 13 } },
    exports: { total: 4, partners: [{ country: "CH", amount: 1.2, percent: 30 }, { country: "IN", amount: 0.6, percent: 15 }, { country: "SN", amount: 0.5, percent: 13 }, { country: "CN", amount: 0.4, percent: 10 }, { country: "ML", amount: 0.3, percent: 8 }], mainProducts: ["طلا", "پنبه", "دام"] },
    imports: { total: 4.5, partners: [{ country: "CN", amount: 1.2, percent: 27 }, { country: "FR", amount: 0.7, percent: 16 }, { country: "IN", amount: 0.6, percent: 13 }, { country: "SN", amount: 0.5, percent: 11 }, { country: "ML", amount: 0.4, percent: 9 }], mainProducts: ["ماشین‌آلات", "نفت", "غذا"] },
    investmentRisk: 65, relations: { "ML": "green", "SN": "green", "CI": "white" },
    customs: [{ name: "گمرک اوآگادوگو", coords: [12.3714, -1.5197], workingHours: "دوشنبه تا جمعه: 8:00-17:00" }]
  },
  "NE": {
    name: "نیجر", nameEn: "Niger",
    capital: { name: "نیامی", coords: [13.5127, 2.1128] },
    continent: "africa",
    gdp: 16, gdpRank: 134, gdpPerCapita: 600,
    inflation: 4.2, unemployment: 0.3, currency: "XOF", currencyName: "فرانک",
    population: 26000000, populationDensity: 21, populationGrowth: 3.8,
    resources: { uranium: { reserves: 420, production: 3, unit: "kt", rank: 5 }, gold: { reserves: 50, production: 1, unit: "tons", rank: 50 } },
    exports: { total: 1.5, partners: [{ country: "FR", amount: 0.5, percent: 33 }, { country: "CN", amount: 0.3, percent: 20 }, { country: "ML", amount: 0.2, percent: 13 }, { country: "SN", amount: 0.15, percent: 10 }, { country: "BF", amount: 0.1, percent: 7 }], mainProducts: ["اورانیوم", "طلا", "دام"] },
    imports: { total: 2.5, partners: [{ country: "CN", amount: 0.7, percent: 28 }, { country: "FR", amount: 0.5, percent: 20 }, { country: "ML", amount: 0.3, percent: 12 }, { country: "SN", amount: 0.25, percent: 10 }, { country: "IN", amount: 0.2, percent: 8 }], mainProducts: ["ماشین‌آلات", "نفت", "غذا"] },
    investmentRisk: 75, relations: { "ML": "white", "BF": "white", "TD": "white" },
    customs: [{ name: "گمرک نیامی", coords: [13.5127, 2.1128], workingHours: "دوشنبه تا جمعه: 8:00-17:00" }]
  },
  "TD": {
    name: "چاد", nameEn: "Chad",
    capital: { name: "انجامنا", coords: [12.1348, 15.0557] },
    continent: "africa",
    gdp: 12, gdpRank: 143, gdpPerCapita: 700,
    inflation: 3.0, unemployment: 1.0, currency: "XAF", currencyName: "فرانک",
    population: 17000000, populationDensity: 14, populationGrowth: 3.1,
    resources: { oil: { reserves: 1500, production: 120, unit: "mbbl", rank: 35 } },
    exports: { total: 2, partners: [{ country: "US", amount: 0.8, percent: 40 }, { country: "CN", amount: 0.4, percent: 20 }, { country: "CM", amount: 0.3, percent: 15 }, { country: "FR", amount: 0.2, percent: 10 }, { country: "NG", amount: 0.15, percent: 8 }], mainProducts: ["نفت", "دام", "پنبه"] },
    imports: { total: 3, partners: [{ country: "CN", amount: 0.8, percent: 27 }, { country: "CM", amount: 0.5, percent: 17 }, { country: "FR", amount: 0.4, percent: 13 }, { country: "NG", amount: 0.3, percent: 10 }, { country: "IN", amount: 0.25, percent: 8 }], mainProducts: ["ماشین‌آلات", "نفت", "غذا"] },
    investmentRisk: 80, relations: { "CM": "white", "NG": "white", "SD": "orange" },
    customs: [{ name: "گمرک انجامنا", coords: [12.1348, 15.0557], workingHours: "دوشنبه تا جمعه: 8:00-17:00" }]
  },
  "SS": {
    name: "سودان جنوبی", nameEn: "South Sudan",
    capital: { name: "جوبا", coords: [4.8594, 31.5712] },
    continent: "africa",
    gdp: 6, gdpRank: 154, gdpPerCapita: 400,
    inflation: 34.0, unemployment: 12.0, currency: "SSP", currencyName: "پوند",
    population: 12000000, populationDensity: 20, populationGrowth: 1.2,
    resources: { oil: { reserves: 3500, production: 150, unit: "mbbl", rank: 28 } },
    exports: { total: 1.5, partners: [{ country: "CN", amount: 0.6, percent: 40 }, { country: "IN", amount: 0.3, percent: 20 }, { country: "UG", amount: 0.2, percent: 13 }, { country: "KE", amount: 0.15, percent: 10 }, { country: "ET", amount: 0.1, percent: 7 }], mainProducts: ["نفت", "دام"] },
    imports: { total: 2.5, partners: [{ country: "CN", amount: 0.8, percent: 32 }, { country: "UG", amount: 0.5, percent: 20 }, { country: "KE", amount: 0.4, percent: 16 }, { country: "IN", amount: 0.3, percent: 12 }, { country: "ET", amount: 0.2, percent: 8 }], mainProducts: ["غذا", "نفت", "ماشین‌آلات"] },
    investmentRisk: 95, relations: { "SD": "red", "UG": "white", "KE": "white" },
    customs: [{ name: "گمرک جوبا", coords: [4.8594, 31.5712], workingHours: "دوشنبه تا جمعه: 8:00-17:00" }]
  },
  "ER": {
    name: "اریتره", nameEn: "Eritrea",
    capital: { name: "اسمره", coords: [15.3229, 38.9251] },
    continent: "africa",
    gdp: 2, gdpRank: 167, gdpPerCapita: 600,
    inflation: 20.0, unemployment: 5.8, currency: "ERN", currencyName: "ناکفا",
    population: 3600000, populationDensity: 35, populationGrowth: 1.3,
    resources: { gold: { reserves: 20, production: 0.5, unit: "tons", rank: 50 } },
    exports: { total: 0.5, partners: [{ country: "CN", amount: 0.2, percent: 40 }, { country: "ET", amount: 0.1, percent: 20 }, { country: "SA", amount: 0.08, percent: 16 }, { country: "IN", amount: 0.06, percent: 12 }, { country: "AE", amount: 0.04, percent: 8 }], mainProducts: ["طلا", "مس", "نمک"] },
    imports: { total: 1, partners: [{ country: "CN", amount: 0.3, percent: 30 }, { country: "SA", amount: 0.2, percent: 20 }, { country: "ET", amount: 0.15, percent: 15 }, { country: "IN", amount: 0.12, percent: 12 }, { country: "AE", amount: 0.1, percent: 10 }], mainProducts: ["غذا", "نفت", "ماشین‌آلات"] },
    investmentRisk: 90, relations: { "ET": "orange", "SD": "white", "DJ": "white" },
    customs: [{ name: "بندر مصوع", coords: [15.6094, 39.4750], workingHours: "24/7" }]
  },
  "DJ": {
    name: "جیبوتی", nameEn: "Djibouti",
    capital: { name: "جیبوتی", coords: [11.8251, 42.5903] },
    continent: "africa",
    gdp: 3.5, gdpRank: 160, gdpPerCapita: 3500,
    inflation: 3.0, unemployment: 28.0, currency: "DJF", currencyName: "فرانک",
    population: 1000000, populationDensity: 43, populationGrowth: 1.4,
    resources: {},
    exports: { total: 0.8, partners: [{ country: "ET", amount: 0.3, percent: 38 }, { country: "SA", amount: 0.2, percent: 25 }, { country: "CN", amount: 0.15, percent: 19 }, { country: "YE", amount: 0.08, percent: 10 }, { country: "IN", amount: 0.05, percent: 6 }], mainProducts: ["خدمات بندری", "نمک"] },
    imports: { total: 1.2, partners: [{ country: "CN", amount: 0.4, percent: 33 }, { country: "SA", amount: 0.3, percent: 25 }, { country: "ET", amount: 0.2, percent: 17 }, { country: "IN", amount: 0.15, percent: 13 }, { country: "AE", amount: 0.1, percent: 8 }], mainProducts: ["غذا", "نفت", "ماشین‌آلات"] },
    investmentRisk: 40, relations: { "ET": "green", "SO": "white", "ER": "white" },
    customs: [{ name: "بندر جیبوتی", coords: [11.8251, 42.5903], workingHours: "24/7" }]
  },
  "SO": {
    name: "سومالی", nameEn: "Somalia",
    capital: { name: "موگادیشو", coords: [2.0469, 45.3182] },
    continent: "africa",
    gdp: 8, gdpRank: 147, gdpPerCapita: 500,
    inflation: 5.0, unemployment: 20.0, currency: "SOS", currencyName: "شیلینگ",
    population: 17000000, populationDensity: 27, populationGrowth: 2.9,
    resources: {},
    exports: { total: 0.8, partners: [{ country: "AE", amount: 0.3, percent: 38 }, { country: "OM", amount: 0.2, percent: 25 }, { country: "SA", amount: 0.15, percent: 19 }, { country: "YE", amount: 0.1, percent: 13 }, { country: "IN", amount: 0.05, percent: 6 }], mainProducts: ["دام", "ماهی", "موز"] },
    imports: { total: 2.5, partners: [{ country: "AE", amount: 0.8, percent: 32 }, { country: "CN", amount: 0.5, percent: 20 }, { country: "IN", amount: 0.4, percent: 16 }, { country: "OM", amount: 0.3, percent: 12 }, { country: "TR", amount: 0.2, percent: 8 }], mainProducts: ["غذا", "نفت", "ماشین‌آلات"] },
    investmentRisk: 100, relations: { "ET": "orange", "KE": "white", "DJ": "white" },
    customs: [{ name: "بندر موگادیشو", coords: [2.0469, 45.3182], workingHours: "24/7" }]
  },
  "LR": {
    name: "لیبریا", nameEn: "Liberia",
    capital: { name: "مونروویا", coords: [6.3153, -10.8074] },
    continent: "africa",
    gdp: 4, gdpRank: 158, gdpPerCapita: 700,
    inflation: 7.0, unemployment: 3.0, currency: "LRD", currencyName: "دلار",
    population: 5300000, populationDensity: 55, populationGrowth: 2.4,
    resources: { iron: { reserves: 1000, production: 4, unit: "mt", rank: 20 } },
    exports: { total: 0.8, partners: [{ country: "CH", amount: 0.3, percent: 38 }, { country: "US", amount: 0.2, percent: 25 }, { country: "CN", amount: 0.15, percent: 19 }, { country: "ZA", amount: 0.1, percent: 13 }, { country: "IN", amount: 0.05, percent: 6 }], mainProducts: ["آهن", "کائوچو", "چوب"] },
    imports: { total: 1.5, partners: [{ country: "CN", amount: 0.4, percent: 27 }, { country: "SG", amount: 0.3, percent: 20 }, { country: "US", amount: 0.2, percent: 13 }, { country: "ZA", amount: 0.15, percent: 10 }, { country: "IN", amount: 0.12, percent: 8 }], mainProducts: ["غذا", "نفت", "ماشین‌آلات"] },
    investmentRisk: 70, relations: { "SL": "green", "CI": "white", "GN": "white" },
    customs: [{ name: "بندر مونروویا", coords: [6.3153, -10.8074], workingHours: "24/7" }]
  },
  "SL": {
    name: "سیرالئون", nameEn: "Sierra Leone",
    capital: { name: "فریتاون", coords: [8.4657, -13.2317] },
    continent: "africa",
    gdp: 4, gdpRank: 159, gdpPerCapita: 500,
    inflation: 27.0, unemployment: 3.0, currency: "SLL", currencyName: "لئون",
    population: 8000000, populationDensity: 111, populationGrowth: 2.1,
    resources: { diamonds: { reserves: 20, production: 0.1, unit: "mct", rank: 12 }, iron: { reserves: 500, production: 0, unit: "mt", rank: 25 } },
    exports: { total: 0.6, partners: [{ country: "BE", amount: 0.2, percent: 33 }, { country: "CN", amount: 0.15, percent: 25 }, { country: "US", amount: 0.1, percent: 17 }, { country: "IN", amount: 0.08, percent: 13 }, { country: "ZA", amount: 0.05, percent: 8 }], mainProducts: ["الماس", "آهن", "کاکائو"] },
    imports: { total: 1.2, partners: [{ country: "CN", amount: 0.4, percent: 33 }, { country: "IN", amount: 0.2, percent: 17 }, { country: "US", amount: 0.15, percent: 13 }, { country: "ZA", amount: 0.12, percent: 10 }, { country: "BE", amount: 0.1, percent: 8 }], mainProducts: ["غذا", "نفت", "ماشین‌آلات"] },
    investmentRisk: 75, relations: { "LR": "green", "GN": "white", "GW": "white" },
    customs: [{ name: "بندر فریتاون", coords: [8.4657, -13.2317], workingHours: "24/7" }]
  },
  "GN": {
    name: "گینه", nameEn: "Guinea",
    capital: { name: "کوناکری", coords: [9.6412, -13.5784] },
    continent: "africa",
    gdp: 16, gdpRank: 132, gdpPerCapita: 1200,
    inflation: 10.0, unemployment: 2.8, currency: "GNF", currencyName: "فرانک",
    population: 14000000, populationDensity: 57, populationGrowth: 2.4,
    resources: { bauxite: { reserves: 7400, production: 80, unit: "mt", rank: 1 }, gold: { reserves: 1000, production: 50, unit: "tons", rank: 12 } },
    exports: { total: 5, partners: [{ country: "CH", amount: 1.5, percent: 30 }, { country: "CN", amount: 1, percent: 20 }, { country: "AE", amount: 0.6, percent: 12 }, { country: "IN", amount: 0.5, percent: 10 }, { country: "RU", amount: 0.4, percent: 8 }], mainProducts: ["باکسیت", "طلا", "الماس"] },
    imports: { total: 4, partners: [{ country: "CN", amount: 1.2, percent: 30 }, { country: "NL", amount: 0.6, percent: 15 }, { country: "IN", amount: 0.5, percent: 13 }, { country: "FR", amount: 0.4, percent: 10 }, { country: "BE", amount: 0.3, percent: 8 }], mainProducts: ["ماشین‌آلات", "نفت", "غذا"] },
    investmentRisk: 60, relations: { "SL": "white", "LR": "white", "SN": "white" },
    customs: [{ name: "بندر کوناکری", coords: [9.6412, -13.5784], workingHours: "24/7" }]
  },
  "GW": {
    name: "گینه بیسائو", nameEn: "Guinea-Bissau",
    capital: { name: "بیسائو", coords: [11.8817, -15.6178] },
    continent: "africa",
    gdp: 1.6, gdpRank: 170, gdpPerCapita: 800,
    inflation: 5.0, unemployment: 3.0, currency: "XOF", currencyName: "فرانک",
    population: 2000000, populationDensity: 71, populationGrowth: 2.4,
    resources: {},
    exports: { total: 0.3, partners: [{ country: "IN", amount: 0.1, percent: 33 }, { country: "CN", amount: 0.08, percent: 27 }, { country: "SN", amount: 0.05, percent: 17 }, { country: "PT", amount: 0.04, percent: 13 }, { country: "NG", amount: 0.03, percent: 10 }], mainProducts: ["کاشو", "ماهی", "بادام زمینی"] },
    imports: { total: 0.5, partners: [{ country: "CN", amount: 0.15, percent: 30 }, { country: "PT", amount: 0.1, percent: 20 }, { country: "SN", amount: 0.08, percent: 16 }, { country: "IN", amount: 0.06, percent: 12 }, { country: "NG", amount: 0.05, percent: 10 }], mainProducts: ["غذا", "نفت", "ماشین‌آلات"] },
    investmentRisk: 80, relations: { "SN": "white", "GN": "white", "PT": "green" },
    customs: [{ name: "بندر بیسائو", coords: [11.8817, -15.6178], workingHours: "24/7" }]
  },
  "CV": {
    name: "کیپ ورد", nameEn: "Cape Verde",
    capital: { name: "پریا", coords: [14.9330, -23.5133] },
    continent: "africa",
    gdp: 2.2, gdpRank: 164, gdpPerCapita: 3800,
    inflation: 1.9, unemployment: 10.7, currency: "CVE", currencyName: "اسکودو",
    population: 600000, populationDensity: 149, populationGrowth: 1.0,
    resources: {},
    exports: { total: 0.2, partners: [{ country: "ES", amount: 0.08, percent: 40 }, { country: "PT", amount: 0.05, percent: 25 }, { country: "NL", amount: 0.03, percent: 15 }, { country: "IT", amount: 0.02, percent: 10 }, { country: "FR", amount: 0.015, percent: 8 }], mainProducts: ["ماهی", "پوشاک", "کفش"] },
    imports: { total: 0.8, partners: [{ country: "PT", amount: 0.3, percent: 38 }, { country: "ES", amount: 0.2, percent: 25 }, { country: "CN", amount: 0.15, percent: 19 }, { country: "NL", amount: 0.08, percent: 10 }, { country: "IT", amount: 0.05, percent: 6 }], mainProducts: ["غذا", "نفت", "ماشین‌آلات"] },
    investmentRisk: 30, relations: { "PT": "green", "ES": "green", "SN": "white" },
    customs: [{ name: "بندر پریا", coords: [14.9330, -23.5133], workingHours: "24/7" }]
  },

  // ===== کشورهای آمریکای شمالی =====
  "MX": {
    name: "مکزیک", nameEn: "Mexico",
    capital: { name: "مکزیکوسیتی", coords: [19.4326, -99.1332] },
    continent: "north_america",
    gdp: 1414, gdpRank: 15, gdpPerCapita: 10900,
    inflation: 7.8, unemployment: 3.3, currency: "MXN", currencyName: "پزو",
    population: 130000000, populationDensity: 66, populationGrowth: 1.0,
    resources: { oil: { reserves: 6000, production: 1700, unit: "mbbl", rank: 12 }, silver: { reserves: 37000, production: 6500, unit: "tons", rank: 1 } },
    exports: { total: 578, partners: [{ country: "US", amount: 462, percent: 80 }, { country: "CA", amount: 17, percent: 3 }], mainProducts: ["خودرو", "الکترونیک", "نفت"] },
    imports: { total: 604, partners: [{ country: "US", amount: 266, percent: 44 }, { country: "CN", amount: 109, percent: 18 }], mainProducts: ["الکترونیک", "ماشین‌آلات", "خودرو"] },
    investmentRisk: 35, relations: { "US": "green", "CA": "green", "GT": "green" },
    customs: [{ name: "بندر مانزانیلو", coords: [19.0514, -104.3188], workingHours: "24/7" }, { name: "بندر لازارو کارداناس", coords: [17.9580, -102.1970], workingHours: "24/7" }]
  },
  "GT": {
    name: "گواتمالا", nameEn: "Guatemala",
    capital: { name: "گواتمالاسیتی", coords: [14.6349, -90.5069] },
    continent: "north_america",
    gdp: 86, gdpRank: 66, gdpPerCapita: 4800,
    inflation: 4.2, unemployment: 2.8, currency: "GTQ", currencyName: "کتزال",
    population: 18000000, populationDensity: 166, populationGrowth: 1.6,
    resources: { nickel: { reserves: 180, production: 0, unit: "kt", rank: 12 } },
    exports: { total: 12, partners: [{ country: "US", amount: 4.5, percent: 38 }, { country: "SV", amount: 1.2, percent: 10 }, { country: "HN", amount: 1, percent: 8 }, { country: "MX", amount: 0.9, percent: 8 }, { country: "CN", amount: 0.8, percent: 7 }], mainProducts: ["قهوه", "شکر", "موز"] },
    imports: { total: 20, partners: [{ country: "US", amount: 7, percent: 35 }, { country: "CN", amount: 3.5, percent: 18 }, { country: "MX", amount: 2.5, percent: 13 }, { country: "SV", amount: 1, percent: 5 }, { country: "CR", amount: 0.8, percent: 4 }], mainProducts: ["ماشین‌آلات", "نفت", "الکترونیک"] },
    investmentRisk: 45, relations: { "US": "green", "MX": "green", "BZ": "white" },
    customs: [{ name: "گمرک گواتمالاسیتی", coords: [14.6349, -90.5069], workingHours: "دوشنبه تا جمعه: 8:00-17:00" }]
  },
  "CR": {
    name: "کاستاریکا", nameEn: "Costa Rica",
    capital: { name: "سان‌خوزه", coords: [9.9281, -84.0907] },
    continent: "north_america",
    gdp: 69, gdpRank: 77, gdpPerCapita: 13300,
    inflation: 1.8, unemployment: 11.4, currency: "CRC", currencyName: "کولون",
    population: 5200000, populationDensity: 102, populationGrowth: 0.9,
    resources: {},
    exports: { total: 13, partners: [{ country: "US", amount: 5, percent: 38 }, { country: "NL", amount: 1.5, percent: 12 }, { country: "BE", amount: 1.2, percent: 9 }, { country: "PA", amount: 1, percent: 8 }, { country: "MX", amount: 0.8, percent: 6 }], mainProducts: ["الکترونیک", "قهوه", "موز"] },
    imports: { total: 18, partners: [{ country: "US", amount: 6, percent: 33 }, { country: "CN", amount: 3.5, percent: 19 }, { country: "MX", amount: 2, percent: 11 }, { country: "JP", amount: 1.2, percent: 7 }, { country: "PA", amount: 1, percent: 6 }], mainProducts: ["ماشین‌آلات", "نفت", "الکترونیک"] },
    investmentRisk: 25, relations: { "US": "green", "PA": "green", "NI": "white" },
    customs: [{ name: "بندر لیمون", coords: [10.0020, -83.0330], workingHours: "24/7" }]
  },
  "PA": {
    name: "پاناما", nameEn: "Panama",
    capital: { name: "پاناماسیتی", coords: [8.9824, -79.5199] },
    continent: "north_america",
    gdp: 76, gdpRank: 74, gdpPerCapita: 14000,
    inflation: 1.0, unemployment: 10.0, currency: "PAB", currencyName: "بالبوآ",
    population: 4400000, populationDensity: 59, populationGrowth: 1.3,
    resources: {},
    exports: { total: 15, partners: [{ country: "US", amount: 3, percent: 20 }, { country: "CN", amount: 2.5, percent: 17 }, { country: "EC", amount: 1.5, percent: 10 }, { country: "CO", amount: 1.2, percent: 8 }, { country: "CR", amount: 1, percent: 7 }], mainProducts: ["میوه", "ماهی", "شکر"] },
    imports: { total: 25, partners: [{ country: "US", amount: 8, percent: 32 }, { country: "CN", amount: 5, percent: 20 }, { country: "MX", amount: 2, percent: 8 }, { country: "CO", amount: 1.5, percent: 6 }, { country: "CR", amount: 1.2, percent: 5 }], mainProducts: ["ماشین‌آلات", "نفت", "الکترونیک"] },
    investmentRisk: 30, relations: { "US": "green", "CO": "green", "CR": "green" },
    customs: [{ name: "کانال پاناما", coords: [9.0820, -79.6800], workingHours: "24/7", description: "کانال بین‌المللی" }]
  },
  "HN": {
    name: "هندوراس", nameEn: "Honduras",
    capital: { name: "تگوسیگالپا", coords: [14.0723, -87.1921] },
    continent: "north_america",
    gdp: 31, gdpRank: 105, gdpPerCapita: 2900,
    inflation: 6.0, unemployment: 7.0, currency: "HNL", currencyName: "لمپیرا",
    population: 10000000, populationDensity: 89, populationGrowth: 1.5,
    resources: {},
    exports: { total: 5, partners: [{ country: "US", amount: 2.5, percent: 50 }, { country: "GT", amount: 0.5, percent: 10 }, { country: "SV", amount: 0.4, percent: 8 }, { country: "MX", amount: 0.3, percent: 6 }, { country: "NI", amount: 0.2, percent: 4 }], mainProducts: ["قهوه", "موز", "میوه"] },
    imports: { total: 11, partners: [{ country: "US", amount: 4, percent: 36 }, { country: "CN", amount: 2.5, percent: 23 }, { country: "MX", amount: 1.5, percent: 14 }, { country: "GT", amount: 0.8, percent: 7 }, { country: "SV", amount: 0.6, percent: 5 }], mainProducts: ["ماشین‌آلات", "نفت", "الکترونیک"] },
    investmentRisk: 50, relations: { "US": "green", "GT": "white", "NI": "white" },
    customs: [{ name: "بندر کورتس", coords: [15.5050, -87.9370], workingHours: "24/7" }]
  },
  "NI": {
    name: "نیکاراگوئه", nameEn: "Nicaragua",
    capital: { name: "ماناگوا", coords: [12.1364, -86.2514] },
    continent: "north_america",
    gdp: 16, gdpRank: 135, gdpPerCapita: 2400,
    inflation: 6.0, unemployment: 5.5, currency: "NIO", currencyName: "کوردوبا",
    population: 7000000, populationDensity: 59, populationGrowth: 1.2,
    resources: {},
    exports: { total: 6, partners: [{ country: "US", amount: 2.5, percent: 42 }, { country: "MX", amount: 0.8, percent: 13 }, { country: "SV", amount: 0.5, percent: 8 }, { country: "CR", amount: 0.4, percent: 7 }, { country: "HN", amount: 0.3, percent: 5 }], mainProducts: ["قهوه", "گوشت", "میوه"] },
    imports: { total: 7, partners: [{ country: "US", amount: 2.5, percent: 36 }, { country: "CN", amount: 1.5, percent: 21 }, { country: "MX", amount: 1, percent: 14 }, { country: "CR", amount: 0.5, percent: 7 }, { country: "GT", amount: 0.4, percent: 6 }], mainProducts: ["ماشین‌آلات", "نفت", "غذا"] },
    investmentRisk: 55, relations: { "US": "white", "CR": "white", "HN": "white" },
    customs: [{ name: "گمرک ماناگوا", coords: [12.1364, -86.2514], workingHours: "دوشنبه تا جمعه: 8:00-17:00" }]
  },
  "SV": {
    name: "السالوادور", nameEn: "El Salvador",
    capital: { name: "سان‌سالوادور", coords: [13.6929, -89.2182] },
    continent: "north_america",
    gdp: 32, gdpRank: 104, gdpPerCapita: 5000,
    inflation: 3.8, unemployment: 3.0, currency: "USD", currencyName: "دلار",
    population: 6500000, populationDensity: 313, populationGrowth: 0.5,
    resources: {},
    exports: { total: 6, partners: [{ country: "US", amount: 2.8, percent: 47 }, { country: "GT", amount: 0.6, percent: 10 }, { country: "HN", amount: 0.5, percent: 8 }, { country: "MX", amount: 0.4, percent: 7 }, { country: "NI", amount: 0.3, percent: 5 }], mainProducts: ["قهوه", "شکر", "پوشاک"] },
    imports: { total: 12, partners: [{ country: "US", amount: 4.5, percent: 38 }, { country: "CN", amount: 2.5, percent: 21 }, { country: "MX", amount: 1.5, percent: 13 }, { country: "GT", amount: 0.8, percent: 7 }, { country: "HN", amount: 0.6, percent: 5 }], mainProducts: ["ماشین‌آلات", "نفت", "الکترونیک"] },
    investmentRisk: 45, relations: { "US": "green", "GT": "white", "HN": "white" },
    customs: [{ name: "گمرک سان‌سالوادور", coords: [13.6929, -89.2182], workingHours: "دوشنبه تا جمعه: 8:00-17:00" }]
  },
  "BZ": {
    name: "بلیز", nameEn: "Belize",
    capital: { name: "بلموپان", coords: [17.2510, -88.7590] },
    continent: "north_america",
    gdp: 2.8, gdpRank: 163, gdpPerCapita: 6800,
    inflation: 3.0, unemployment: 3.0, currency: "BZD", currencyName: "دلار",
    population: 410000, populationDensity: 18, populationGrowth: 1.9,
    resources: {},
    exports: { total: 0.6, partners: [{ country: "US", amount: 0.25, percent: 42 }, { country: "UK", amount: 0.1, percent: 17 }, { country: "GT", amount: 0.08, percent: 13 }, { country: "MX", amount: 0.06, percent: 10 }, { country: "CR", amount: 0.04, percent: 7 }], mainProducts: ["شکر", "موز", "ماهی"] },
    imports: { total: 1.2, partners: [{ country: "US", amount: 0.5, percent: 42 }, { country: "MX", amount: 0.2, percent: 17 }, { country: "CN", amount: 0.15, percent: 13 }, { country: "GT", amount: 0.1, percent: 8 }, { country: "CR", amount: 0.08, percent: 7 }], mainProducts: ["ماشین‌آلات", "نفت", "غذا"] },
    investmentRisk: 30, relations: { "US": "green", "UK": "green", "GT": "white" },
    customs: [{ name: "بندر بلیز", coords: [17.4950, -88.2019], workingHours: "24/7" }]
  },
  "CU": {
    name: "کوبا", nameEn: "Cuba",
    capital: { name: "هاوانا", coords: [23.1136, -82.3666] },
    continent: "north_america",
    gdp: 107, gdpRank: 65, gdpPerCapita: 9500,
    inflation: 30.0, unemployment: 1.5, currency: "CUP", currencyName: "پزو",
    population: 11000000, populationDensity: 102, populationGrowth: -0.1,
    resources: { nickel: { reserves: 5500, production: 50, unit: "kt", rank: 4 } },
    exports: { total: 2.5, partners: [{ country: "CN", amount: 0.8, percent: 32 }, { country: "ES", amount: 0.5, percent: 20 }, { country: "NL", amount: 0.3, percent: 12 }, { country: "CA", amount: 0.2, percent: 8 }, { country: "RU", amount: 0.15, percent: 6 }], mainProducts: ["نیکل", "شکر", "سیگار"] },
    imports: { total: 11, partners: [{ country: "CN", amount: 3, percent: 27 }, { country: "ES", amount: 2, percent: 18 }, { country: "RU", amount: 1.5, percent: 14 }, { country: "MX", amount: 1, percent: 9 }, { country: "IT", amount: 0.8, percent: 7 }], mainProducts: ["نفت", "ماشین‌آلات", "غذا"] },
    investmentRisk: 70, relations: { "VE": "green", "RU": "green", "CN": "green", "US": "red" },
    customs: [{ name: "بندر هاوانا", coords: [23.1136, -82.3666], workingHours: "24/7" }]
  },
  "JM": {
    name: "جامائیکا", nameEn: "Jamaica",
    capital: { name: "کینگستون", coords: [18.0179, -76.8099] },
    continent: "north_america",
    gdp: 18, gdpRank: 128, gdpPerCapita: 6000,
    inflation: 5.2, unemployment: 6.2, currency: "JMD", currencyName: "دلار",
    population: 3000000, populationDensity: 273, populationGrowth: 0.1,
    resources: { bauxite: { reserves: 2000, production: 8, unit: "mt", rank: 5 } },
    exports: { total: 2.5, partners: [{ country: "US", amount: 1.2, percent: 48 }, { country: "CA", amount: 0.4, percent: 16 }, { country: "NL", amount: 0.3, percent: 12 }, { country: "UK", amount: 0.2, percent: 8 }, { country: "TR", amount: 0.15, percent: 6 }], mainProducts: ["باکسیت", "شکر", "موز"] },
    imports: { total: 6, partners: [{ country: "US", amount: 2.5, percent: 42 }, { country: "CN", amount: 1, percent: 17 }, { country: "TT", amount: 0.5, percent: 8 }, { country: "MX", amount: 0.4, percent: 7 }, { country: "JP", amount: 0.3, percent: 5 }], mainProducts: ["نفت", "ماشین‌آلات", "غذا"] },
    investmentRisk: 40, relations: { "US": "green", "UK": "green", "CA": "green" },
    customs: [{ name: "بندر کینگستون", coords: [18.0179, -76.8099], workingHours: "24/7" }]
  },
  "HT": {
    name: "هائیتی", nameEn: "Haiti",
    capital: { name: "پورتو پرنس", coords: [18.5944, -72.3074] },
    continent: "north_america",
    gdp: 21, gdpRank: 131, gdpPerCapita: 1800,
    inflation: 22.0, unemployment: 14.5, currency: "HTG", currencyName: "گورد",
    population: 12000000, populationDensity: 432, populationGrowth: 1.2,
    resources: {},
    exports: { total: 1.2, partners: [{ country: "US", amount: 0.7, percent: 58 }, { country: "CA", amount: 0.15, percent: 13 }, { country: "DO", amount: 0.1, percent: 8 }, { country: "MX", amount: 0.08, percent: 7 }, { country: "FR", amount: 0.05, percent: 4 }], mainProducts: ["پوشاک", "قهوه", "میوه"] },
    imports: { total: 4.5, partners: [{ country: "US", amount: 1.8, percent: 40 }, { country: "CN", amount: 1, percent: 22 }, { country: "DO", amount: 0.4, percent: 9 }, { country: "MX", amount: 0.3, percent: 7 }, { country: "IN", amount: 0.25, percent: 6 }], mainProducts: ["غذا", "نفت", "ماشین‌آلات"] },
    investmentRisk: 90, relations: { "US": "green", "DO": "white", "FR": "white" },
    customs: [{ name: "بندر پورتو پرنس", coords: [18.5944, -72.3074], workingHours: "24/7" }]
  },
  "DO": {
    name: "جمهوری دومینیکن", nameEn: "Dominican Republic",
    capital: { name: "سانتو دومینگو", coords: [18.4861, -69.9312] },
    continent: "north_america",
    gdp: 113, gdpRank: 61, gdpPerCapita: 10000,
    inflation: 3.9, unemployment: 5.5, currency: "DOP", currencyName: "پزو",
    population: 11000000, populationDensity: 229, populationGrowth: 0.9,
    resources: {},
    exports: { total: 12, partners: [{ country: "US", amount: 6, percent: 50 }, { country: "CA", amount: 1, percent: 8 }, { country: "HT", amount: 0.8, percent: 7 }, { country: "CN", amount: 0.7, percent: 6 }, { country: "NL", amount: 0.6, percent: 5 }], mainProducts: ["طلا", "نیکل", "شکر"] },
    imports: { total: 22, partners: [{ country: "US", amount: 8, percent: 36 }, { country: "CN", amount: 4, percent: 18 }, { country: "MX", amount: 1.5, percent: 7 }, { country: "CO", amount: 1.2, percent: 5 }, { country: "BR", amount: 1, percent: 5 }], mainProducts: ["نفت", "ماشین‌آلات", "غذا"] },
    investmentRisk: 35, relations: { "US": "green", "HT": "white", "PR": "green" },
    customs: [{ name: "بندر سانتو دومینگو", coords: [18.4861, -69.9312], workingHours: "24/7" }]
  },

  // ===== کشورهای آمریکای جنوبی =====
  "AR": {
    name: "آرژانتین", nameEn: "Argentina",
    capital: { name: "بوئنوس‌آیرس", coords: [-34.6037, -58.3816] },
    continent: "south_america",
    gdp: 641, gdpRank: 22, gdpPerCapita: 13900,
    inflation: 94.8, unemployment: 6.9, currency: "ARS", currencyName: "پزو",
    population: 46000000, populationDensity: 17, populationGrowth: 0.9,
    resources: { oil: { reserves: 2200, production: 550, unit: "mbbl", rank: 30 }, gas: { reserves: 350, production: 45, unit: "bcm", rank: 20 }, lithium: { reserves: 2000, production: 6, unit: "kt", rank: 4 } },
    exports: { total: 88, partners: [{ country: "BR", amount: 13, percent: 15 }, { country: "CN", amount: 8, percent: 9 }], mainProducts: ["سویا", "گوشت", "ذرت"] },
    imports: { total: 73, partners: [{ country: "BR", amount: 15, percent: 21 }, { country: "CN", amount: 14, percent: 19 }], mainProducts: ["ماشین‌آلات", "خودرو", "الکترونیک"] },
    investmentRisk: 70, relations: { "BR": "green", "CL": "green", "US": "white" },
    customs: [{ name: "بندر بوئنوس‌آیرس", coords: [-34.5875, -58.3714] }]
  },
  "CL": {
    name: "شیلی", nameEn: "Chile",
    capital: { name: "سانتیاگو", coords: [-33.4489, -70.6693] },
    continent: "south_america",
    gdp: 301, gdpRank: 42, gdpPerCapita: 15400,
    inflation: 11.6, unemployment: 8.0, currency: "CLP", currencyName: "پزو",
    population: 19500000, populationDensity: 26, populationGrowth: 0.8,
    resources: { copper: { reserves: 200000, production: 5700, unit: "kt", rank: 1 }, lithium: { reserves: 9200, production: 26, unit: "kt", rank: 2 } },
    exports: { total: 97, partners: [{ country: "CN", amount: 38, percent: 39 }, { country: "US", amount: 14, percent: 14 }], mainProducts: ["مس", "میوه", "ماهی"] },
    imports: { total: 86, partners: [{ country: "CN", amount: 22, percent: 26 }, { country: "US", amount: 17, percent: 20 }], mainProducts: ["نفت", "ماشین‌آلات", "خودرو"] },
    investmentRisk: 25, relations: { "AR": "green", "PE": "green", "US": "green" },
    customs: [{ name: "بندر سن آنتونیو", coords: [-33.5929, -71.6214] }, { name: "بندر والپارایسو", coords: [-33.0472, -71.6127] }]
  },
  "CO": {
    name: "کلمبیا", nameEn: "Colombia",
    capital: { name: "بوگوتا", coords: [4.7110, -74.0721] },
    continent: "south_america",
    gdp: 343, gdpRank: 39, gdpPerCapita: 6600,
    inflation: 10.2, unemployment: 11.2, currency: "COP", currencyName: "پزو",
    population: 52000000, populationDensity: 46, populationGrowth: 1.0,
    resources: { oil: { reserves: 2000, production: 750, unit: "mbbl", rank: 20 }, coal: { reserves: 5000, production: 70, unit: "mt", rank: 10 } },
    exports: { total: 57, partners: [{ country: "US", amount: 16, percent: 28 }, { country: "CN", amount: 6, percent: 11 }], mainProducts: ["نفت", "زغال", "قهوه"] },
    imports: { total: 61, partners: [{ country: "US", amount: 15, percent: 25 }, { country: "CN", amount: 13, percent: 21 }], mainProducts: ["ماشین‌آلات", "الکترونیک", "شیمیایی"] },
    investmentRisk: 40, relations: { "US": "green", "EC": "green", "VE": "orange" },
    customs: [{ name: "بندر کارتاخنا", coords: [10.3910, -75.4794] }, { name: "بندر بوئناونتورا", coords: [3.8801, -77.0189] }]
  },
  "PE": {
    name: "پرو", nameEn: "Peru",
    capital: { name: "لیما", coords: [-12.0464, -77.0428] },
    continent: "south_america",
    gdp: 242, gdpRank: 47, gdpPerCapita: 7100,
    inflation: 8.5, unemployment: 7.8, currency: "PEN", currencyName: "سول",
    population: 34000000, populationDensity: 26, populationGrowth: 1.0,
    resources: { copper: { reserves: 77000, production: 2200, unit: "kt", rank: 2 }, gold: { reserves: 2700, production: 120, unit: "tons", rank: 6 }, silver: { reserves: 120000, production: 3400, unit: "tons", rank: 2 } },
    exports: { total: 63, partners: [{ country: "CN", amount: 18, percent: 29 }, { country: "US", amount: 10, percent: 16 }], mainProducts: ["مس", "طلا", "ماهی"] },
    imports: { total: 52, partners: [{ country: "CN", amount: 14, percent: 27 }, { country: "US", amount: 11, percent: 21 }], mainProducts: ["نفت", "ماشین‌آلات", "الکترونیک"] },
    investmentRisk: 40, relations: { "CL": "green", "EC": "green", "US": "green" },
    customs: [{ name: "بندر کایائو", coords: [-12.0464, -77.1185] }]
  },
  "VE": {
    name: "ونزوئلا", nameEn: "Venezuela",
    capital: { name: "کاراکاس", coords: [10.4806, -66.9036] },
    continent: "south_america",
    gdp: 92, gdpRank: 82, gdpPerCapita: 3200,
    inflation: 360, unemployment: 7.0, currency: "VES", currencyName: "بولیوار",
    population: 28000000, populationDensity: 32, populationGrowth: 1.0,
    resources: { oil: { reserves: 303200, production: 600, unit: "mbbl", rank: 1 }, gas: { reserves: 5600, production: 30, unit: "bcm", rank: 8 } },
    exports: { total: 18, partners: [{ country: "CN", amount: 5, percent: 28 }, { country: "IN", amount: 3, percent: 17 }], mainProducts: ["نفت", "گاز", "آلومینیوم"] },
    imports: { total: 12, partners: [{ country: "CN", amount: 4, percent: 33 }, { country: "US", amount: 2, percent: 17 }], mainProducts: ["غذا", "دارو", "ماشین‌آلات"] },
    investmentRisk: 95, relations: { "CU": "green", "RU": "green", "CN": "green", "US": "red" },
    customs: [{ name: "گمرک کاراکاس", coords: [10.4806, -66.9036], workingHours: "دوشنبه تا جمعه: 8:00-17:00" }]
  },
  "EC": {
    name: "اکوادور", nameEn: "Ecuador",
    capital: { name: "کیتو", coords: [-0.1807, -78.4678] },
    continent: "south_america",
    gdp: 106, gdpRank: 64, gdpPerCapita: 5900,
    inflation: 1.2, unemployment: 4.1, currency: "USD", currencyName: "دلار",
    population: 18000000, populationDensity: 71, populationGrowth: 1.2,
    resources: { oil: { reserves: 8000, production: 500, unit: "mbbl", rank: 20 } },
    exports: { total: 23, partners: [{ country: "US", amount: 8, percent: 35 }, { country: "CN", amount: 3, percent: 13 }], mainProducts: ["نفت", "موز", "میگو"] },
    imports: { total: 22, partners: [{ country: "US", amount: 7, percent: 32 }, { country: "CN", amount: 5, percent: 23 }], mainProducts: ["ماشین‌آلات", "نفت", "الکترونیک"] },
    investmentRisk: 45, relations: { "US": "green", "CO": "green", "PE": "green" },
    customs: [{ name: "گمرک گوایاکیل", coords: [-2.1709, -79.9224], workingHours: "دوشنبه تا جمعه: 8:00-17:00" }]
  },
  "BO": {
    name: "بولیوی", nameEn: "Bolivia",
    capital: { name: "لاپاز", coords: [-16.5000, -68.1500] },
    continent: "south_america",
    gdp: 41, gdpRank: 95, gdpPerCapita: 3500,
    inflation: 2.0, unemployment: 4.0, currency: "BOB", currencyName: "بولیویانو",
    population: 12000000, populationDensity: 11, populationGrowth: 1.3,
    resources: { gas: { reserves: 300, production: 15, unit: "bcm", rank: 25 }, lithium: { reserves: 21000, production: 0, unit: "kt", rank: 1 }, silver: { reserves: 22000, production: 1200, unit: "tons", rank: 6 } },
    exports: { total: 9, partners: [{ country: "BR", amount: 2, percent: 22 }, { country: "AR", amount: 1.5, percent: 17 }], mainProducts: ["گاز", "نقره", "روی"] },
    imports: { total: 10, partners: [{ country: "CN", amount: 2.5, percent: 25 }, { country: "BR", amount: 1.8, percent: 18 }], mainProducts: ["ماشین‌آلات", "نفت", "الکترونیک"] },
    investmentRisk: 50, relations: { "BR": "green", "AR": "green", "PE": "green" },
    customs: [{ name: "گمرک لاپاز", coords: [-16.5000, -68.1500], workingHours: "دوشنبه تا جمعه: 8:00-17:00" }]
  },
  "PY": {
    name: "پاراگوئه", nameEn: "Paraguay",
    capital: { name: "آسونسیون", coords: [-25.2637, -57.5759] },
    continent: "south_america",
    gdp: 41, gdpRank: 96, gdpPerCapita: 5500,
    inflation: 3.8, unemployment: 5.5, currency: "PYG", currencyName: "گوارانی",
    population: 7300000, populationDensity: 18, populationGrowth: 1.2,
    resources: {},
    exports: { total: 12, partners: [{ country: "BR", amount: 3, percent: 25 }, { country: "AR", amount: 2, percent: 17 }], mainProducts: ["سویا", "گوشت", "برق"] },
    imports: { total: 13, partners: [{ country: "CN", amount: 3, percent: 23 }, { country: "BR", amount: 2.5, percent: 19 }], mainProducts: ["ماشین‌آلات", "نفت", "الکترونیک"] },
    investmentRisk: 40, relations: { "BR": "green", "AR": "green" },
    customs: [{ name: "گمرک آسونسیون", coords: [-25.2637, -57.5759], workingHours: "دوشنبه تا جمعه: 8:00-17:00" }]
  },
  "UY": {
    name: "اروگوئه", nameEn: "Uruguay",
    capital: { name: "مونته‌ویدئو", coords: [-34.9011, -56.1645] },
    continent: "south_america",
    gdp: 71, gdpRank: 78, gdpPerCapita: 20000,
    inflation: 5.7, unemployment: 7.9, currency: "UYU", currencyName: "پزو",
    population: 3500000, populationDensity: 20, populationGrowth: 0.3,
    resources: {},
    exports: { total: 12, partners: [{ country: "CN", amount: 3, percent: 25 }, { country: "BR", amount: 2, percent: 17 }], mainProducts: ["گوشت", "پشم", "برنج"] },
    imports: { total: 11, partners: [{ country: "CN", amount: 3, percent: 27 }, { country: "BR", amount: 2, percent: 18 }], mainProducts: ["نفت", "ماشین‌آلات", "الکترونیک"] },
    investmentRisk: 25, relations: { "BR": "green", "AR": "green" },
    customs: [{ name: "گمرک مونته‌ویدئو", coords: [-34.9011, -56.1645], workingHours: "دوشنبه تا جمعه: 9:00-17:00" }]
  },
  "GY": {
    name: "گویان", nameEn: "Guyana",
    capital: { name: "جورج‌تاون", coords: [6.8013, -58.1551] },
    continent: "south_america",
    gdp: 15, gdpRank: 142, gdpPerCapita: 18000,
    inflation: 2.0, unemployment: 12.0, currency: "GYD", currencyName: "دلار",
    population: 800000, populationDensity: 4, populationGrowth: 0.5,
    resources: { oil: { reserves: 11000, production: 380, unit: "mbbl", rank: 18 }, gold: { reserves: 100, production: 15, unit: "tons", rank: 35 } },
    exports: { total: 4, partners: [{ country: "CA", amount: 1.2, percent: 30 }, { country: "US", amount: 0.8, percent: 20 }, { country: "TR", amount: 0.5, percent: 13 }, { country: "CN", amount: 0.4, percent: 10 }, { country: "NL", amount: 0.3, percent: 8 }], mainProducts: ["نفت", "طلا", "شکر"] },
    imports: { total: 3, partners: [{ country: "US", amount: 0.8, percent: 27 }, { country: "CN", amount: 0.5, percent: 17 }, { country: "TR", amount: 0.4, percent: 13 }, { country: "CA", amount: 0.3, percent: 10 }, { country: "BR", amount: 0.25, percent: 8 }], mainProducts: ["ماشین‌آلات", "نفت", "غذا"] },
    investmentRisk: 40, relations: { "VE": "orange", "SR": "white", "BR": "white" },
    customs: [{ name: "بندر جورج‌تاون", coords: [6.8013, -58.1551], workingHours: "24/7" }]
  },
  "SR": {
    name: "سورینام", nameEn: "Suriname",
    capital: { name: "پاراماریبو", coords: [5.8520, -55.2038] },
    continent: "south_america",
    gdp: 3, gdpRank: 161, gdpPerCapita: 5500,
    inflation: 55.0, unemployment: 8.7, currency: "SRD", currencyName: "دلار",
    population: 600000, populationDensity: 4, populationGrowth: 0.9,
    resources: { gold: { reserves: 200, production: 30, unit: "tons", rank: 20 }, bauxite: { reserves: 580, production: 3, unit: "mt", rank: 8 } },
    exports: { total: 2.5, partners: [{ country: "CH", amount: 0.8, percent: 32 }, { country: "AE", amount: 0.5, percent: 20 }, { country: "US", amount: 0.4, percent: 16 }, { country: "BE", amount: 0.3, percent: 12 }, { country: "NL", amount: 0.25, percent: 10 }], mainProducts: ["طلا", "باکسیت", "نفت"] },
    imports: { total: 1.8, partners: [{ country: "US", amount: 0.5, percent: 28 }, { country: "NL", amount: 0.4, percent: 22 }, { country: "CN", amount: 0.3, percent: 17 }, { country: "TR", amount: 0.2, percent: 11 }, { country: "BR", amount: 0.15, percent: 8 }], mainProducts: ["ماشین‌آلات", "نفت", "غذا"] },
    investmentRisk: 50, relations: { "NL": "green", "GY": "white", "BR": "white" },
    customs: [{ name: "بندر پاراماریبو", coords: [5.8520, -55.2038], workingHours: "24/7" }]
  },
  "GF": {
    name: "گویان فرانسه", nameEn: "French Guiana",
    capital: { name: "کاین", coords: [4.9224, -52.3135] },
    continent: "south_america",
    gdp: 5, gdpRank: 150, gdpPerCapita: 18000,
    inflation: 2.0, unemployment: 19.0, currency: "EUR", currencyName: "یورو",
    population: 300000, populationDensity: 4, populationGrowth: 2.2,
    resources: { gold: { reserves: 50, production: 2, unit: "tons", rank: 45 } },
    exports: { total: 0.3, partners: [{ country: "FR", amount: 0.15, percent: 50 }, { country: "US", amount: 0.05, percent: 17 }, { country: "SR", amount: 0.03, percent: 10 }, { country: "BR", amount: 0.025, percent: 8 }, { country: "GY", amount: 0.02, percent: 7 }], mainProducts: ["طلا", "میگو", "چوب"] },
    imports: { total: 1.5, partners: [{ country: "FR", amount: 0.6, percent: 40 }, { country: "US", amount: 0.3, percent: 20 }, { country: "SR", amount: 0.15, percent: 10 }, { country: "BR", amount: 0.12, percent: 8 }, { country: "CN", amount: 0.1, percent: 7 }], mainProducts: ["غذا", "نفت", "ماشین‌آلات"] },
    investmentRisk: 30, relations: { "FR": "green", "SR": "white", "BR": "white" },
    customs: [{ name: "بندر کاین", coords: [4.9224, -52.3135], workingHours: "24/7" }]
  },

  // ===== کشورهای اقیانوسیه =====
  "NZ": {
    name: "نیوزیلند", nameEn: "New Zealand",
    capital: { name: "ولینگتون", coords: [-41.2866, 174.7756] },
    continent: "oceania",
    gdp: 247, gdpRank: 46, gdpPerCapita: 48000,
    inflation: 7.2, unemployment: 3.3, currency: "NZD", currencyName: "دلار نیوزیلند",
    population: 5100000, populationDensity: 19, populationGrowth: 0.8,
    resources: { gold: { reserves: 300, production: 10, unit: "tons", rank: 30 } },
    exports: { total: 47, partners: [{ country: "CN", amount: 14, percent: 30 }, { country: "AU", amount: 7, percent: 15 }, { country: "US", amount: 5, percent: 11 }, { country: "JP", amount: 3, percent: 6 }, { country: "KR", amount: 2, percent: 4 }], mainProducts: ["لبنیات", "گوشت", "چوب"] },
    imports: { total: 53, partners: [{ country: "CN", amount: 11, percent: 21 }, { country: "AU", amount: 7, percent: 13 }, { country: "US", amount: 6, percent: 11 }, { country: "JP", amount: 4, percent: 8 }, { country: "DE", amount: 3, percent: 6 }], mainProducts: ["ماشین‌آلات", "خودرو", "نفت"] },
    investmentRisk: 10, relations: { "AU": "green", "US": "green", "UK": "green" },
    customs: [{ name: "بندر اوکلند", coords: [-36.8485, 174.7633], workingHours: "24/7" }]
  },
  "FJ": {
    name: "فیجی", nameEn: "Fiji",
    capital: { name: "سووا", coords: [-18.1248, 178.4501] },
    continent: "oceania",
    gdp: 5, gdpRank: 152, gdpPerCapita: 5500,
    inflation: 3.0, unemployment: 4.5, currency: "FJD", currencyName: "دلار",
    population: 900000, populationDensity: 49, populationGrowth: 0.6,
    resources: {},
    exports: { total: 1.2, partners: [{ country: "US", amount: 0.4, percent: 33 }, { country: "AU", amount: 0.3, percent: 25 }, { country: "NZ", amount: 0.2, percent: 17 }, { country: "JP", amount: 0.1, percent: 8 }, { country: "CN", amount: 0.08, percent: 7 }], mainProducts: ["شکر", "ماهی", "چوب"] },
    imports: { total: 2, partners: [{ country: "AU", amount: 0.5, percent: 25 }, { country: "CN", amount: 0.4, percent: 20 }, { country: "NZ", amount: 0.3, percent: 15 }, { country: "SG", amount: 0.2, percent: 10 }, { country: "US", amount: 0.15, percent: 8 }], mainProducts: ["ماشین‌آلات", "نفت", "غذا"] },
    investmentRisk: 30, relations: { "AU": "green", "NZ": "green", "US": "green" },
    customs: [{ name: "بندر سووا", coords: [-18.1248, 178.4501], workingHours: "24/7" }]
  },
  "PG": {
    name: "پاپوآ گینه نو", nameEn: "Papua New Guinea",
    capital: { name: "پورت مورسبی", coords: [-9.4438, 147.1803] },
    continent: "oceania",
    gdp: 31, gdpRank: 106, gdpPerCapita: 3200,
    inflation: 4.5, unemployment: 2.5, currency: "PGK", currencyName: "کینا",
    population: 10000000, populationDensity: 22, populationGrowth: 2.0,
    resources: { gold: { reserves: 1200, production: 50, unit: "tons", rank: 13 }, copper: { reserves: 10000, production: 200, unit: "kt", rank: 11 }, oil: { reserves: 240, production: 50, unit: "mbbl", rank: 60 } },
    exports: { total: 11, partners: [{ country: "CN", amount: 3.5, percent: 32 }, { country: "AU", amount: 2.5, percent: 23 }, { country: "JP", amount: 1.5, percent: 14 }, { country: "SG", amount: 1, percent: 9 }, { country: "KR", amount: 0.8, percent: 7 }], mainProducts: ["طلا", "مس", "نفت"] },
    imports: { total: 4.5, partners: [{ country: "AU", amount: 1.5, percent: 33 }, { country: "CN", amount: 1, percent: 22 }, { country: "SG", amount: 0.5, percent: 11 }, { country: "MY", amount: 0.4, percent: 9 }, { country: "JP", amount: 0.3, percent: 7 }], mainProducts: ["ماشین‌آلات", "نفت", "غذا"] },
    investmentRisk: 50, relations: { "AU": "green", "ID": "white", "SB": "white" },
    customs: [{ name: "بندر پورت مورسبی", coords: [-9.4438, 147.1803], workingHours: "24/7" }]
  },
  "SB": {
    name: "جزایر سلیمان", nameEn: "Solomon Islands",
    capital: { name: "هونیارا", coords: [-9.4281, 159.9498] },
    continent: "oceania",
    gdp: 1.6, gdpRank: 171, gdpPerCapita: 2200,
    inflation: 1.5, unemployment: 1.0, currency: "SBD", currencyName: "دلار",
    population: 700000, populationDensity: 25, populationGrowth: 2.3,
    resources: { gold: { reserves: 50, production: 1, unit: "tons", rank: 50 } },
    exports: { total: 0.5, partners: [{ country: "CN", amount: 0.2, percent: 40 }, { country: "IT", amount: 0.1, percent: 20 }, { country: "TH", amount: 0.08, percent: 16 }, { country: "JP", amount: 0.06, percent: 12 }, { country: "AU", amount: 0.04, percent: 8 }], mainProducts: ["چوب", "ماهی", "طلا"] },
    imports: { total: 0.6, partners: [{ country: "CN", amount: 0.2, percent: 33 }, { country: "AU", amount: 0.15, percent: 25 }, { country: "SG", amount: 0.1, percent: 17 }, { country: "MY", amount: 0.08, percent: 13 }, { country: "NZ", amount: 0.05, percent: 8 }], mainProducts: ["ماشین‌آلات", "نفت", "غذا"] },
    investmentRisk: 50, relations: { "AU": "green", "NZ": "green", "PG": "white" },
    customs: [{ name: "بندر هونیارا", coords: [-9.4281, 159.9498], workingHours: "24/7" }]
  },
  "VU": {
    name: "وانواتو", nameEn: "Vanuatu",
    capital: { name: "پورت ویلا", coords: [-17.7333, 168.3273] },
    continent: "oceania",
    gdp: 1, gdpRank: 175, gdpPerCapita: 3000,
    inflation: 2.0, unemployment: 5.4, currency: "VUV", currencyName: "واتو",
    population: 320000, populationDensity: 26, populationGrowth: 2.4,
    resources: {},
    exports: { total: 0.1, partners: [{ country: "TH", amount: 0.04, percent: 40 }, { country: "JP", amount: 0.02, percent: 20 }, { country: "AU", amount: 0.015, percent: 15 }, { country: "CN", amount: 0.012, percent: 12 }, { country: "NZ", amount: 0.008, percent: 8 }], mainProducts: ["کاپوک", "ماهی", "گوشت"] },
    imports: { total: 0.4, partners: [{ country: "AU", amount: 0.12, percent: 30 }, { country: "CN", amount: 0.1, percent: 25 }, { country: "NZ", amount: 0.08, percent: 20 }, { country: "SG", amount: 0.05, percent: 13 }, { country: "JP", amount: 0.03, percent: 8 }], mainProducts: ["ماشین‌آلات", "نفت", "غذا"] },
    investmentRisk: 40, relations: { "AU": "green", "NZ": "green", "FJ": "white" },
    customs: [{ name: "بندر پورت ویلا", coords: [-17.7333, 168.3273], workingHours: "24/7" }]
  },
  "NC": {
    name: "کالدونیای جدید", nameEn: "New Caledonia",
    capital: { name: "نومئا", coords: [-22.2558, 166.4505] },
    continent: "oceania",
    gdp: 10, gdpRank: 145, gdpPerCapita: 35000,
    inflation: 2.0, unemployment: 11.0, currency: "XPF", currencyName: "فرانک",
    population: 290000, populationDensity: 16, populationGrowth: 0.9,
    resources: { nickel: { reserves: 7000, production: 200, unit: "kt", rank: 1 } },
    exports: { total: 2, partners: [{ country: "CN", amount: 0.8, percent: 40 }, { country: "JP", amount: 0.4, percent: 20 }, { country: "FR", amount: 0.3, percent: 15 }, { country: "KR", amount: 0.2, percent: 10 }, { country: "AU", amount: 0.15, percent: 8 }], mainProducts: ["نیکل", "ماهی"] },
    imports: { total: 3, partners: [{ country: "FR", amount: 1, percent: 33 }, { country: "CN", amount: 0.6, percent: 20 }, { country: "SG", amount: 0.4, percent: 13 }, { country: "AU", amount: 0.3, percent: 10 }, { country: "JP", amount: 0.25, percent: 8 }], mainProducts: ["ماشین‌آلات", "نفت", "غذا"] },
    investmentRisk: 25, relations: { "FR": "green", "AU": "green", "FJ": "white" },
    customs: [{ name: "بندر نومئا", coords: [-22.2558, 166.4505], workingHours: "24/7" }]
  },
  "PF": {
    name: "پلی‌نزی فرانسه", nameEn: "French Polynesia",
    capital: { name: "پاپیته", coords: [-17.5373, -149.5665] },
    continent: "oceania",
    gdp: 6, gdpRank: 148, gdpPerCapita: 20000,
    inflation: 0.5, unemployment: 11.7, currency: "XPF", currencyName: "فرانک",
    population: 280000, populationDensity: 77, populationGrowth: 0.5,
    resources: {},
    exports: { total: 0.2, partners: [{ country: "FR", amount: 0.08, percent: 40 }, { country: "JP", amount: 0.04, percent: 20 }, { country: "US", amount: 0.03, percent: 15 }, { country: "CN", amount: 0.025, percent: 13 }, { country: "AU", amount: 0.015, percent: 8 }], mainProducts: ["مروارید", "ماهی", "وانیل"] },
    imports: { total: 1.5, partners: [{ country: "FR", amount: 0.5, percent: 33 }, { country: "CN", amount: 0.3, percent: 20 }, { country: "US", amount: 0.2, percent: 13 }, { country: "SG", amount: 0.15, percent: 10 }, { country: "AU", amount: 0.12, percent: 8 }], mainProducts: ["ماشین‌آلات", "نفت", "غذا"] },
    investmentRisk: 20, relations: { "FR": "green", "US": "green", "AU": "green" },
    customs: [{ name: "بندر پاپیته", coords: [-17.5373, -149.5665], workingHours: "24/7" }]
  },

  // ===== کشورهای بیشتر آسیا =====
  "BD": {
    name: "بنگلادش", nameEn: "Bangladesh",
    capital: { name: "داکا", coords: [23.8103, 90.4125] },
    continent: "asia",
    gdp: 460, gdpRank: 35, gdpPerCapita: 2700,
    inflation: 9.5, unemployment: 4.2, currency: "BDT", currencyName: "تاکا",
    population: 169000000, populationDensity: 1265, populationGrowth: 1.0,
    resources: { gas: { reserves: 200, production: 25, unit: "bcm", rank: 28 } },
    exports: { total: 52, partners: [{ country: "US", amount: 9, percent: 17 }, { country: "DE", amount: 7, percent: 13 }, { country: "UK", amount: 5, percent: 10 }, { country: "CN", amount: 4, percent: 8 }, { country: "FR", amount: 3, percent: 6 }], mainProducts: ["پوشاک", "ماهی", "چرم"] },
    imports: { total: 75, partners: [{ country: "CN", amount: 25, percent: 33 }, { country: "IN", amount: 8, percent: 11 }, { country: "SG", amount: 5, percent: 7 }, { country: "MY", amount: 4, percent: 5 }, { country: "JP", amount: 3, percent: 4 }], mainProducts: ["ماشین‌آلات", "نفت", "پنبه"] },
    investmentRisk: 45, relations: { "IN": "white", "CN": "green", "US": "green" },
    customs: [{ name: "گمرک چیتاگونگ", coords: [22.3569, 91.7832], workingHours: "شنبه تا پنجشنبه: 9:00-17:00" }]
  },
  "MM": {
    name: "میانمار", nameEn: "Myanmar",
    capital: { name: "نایپیداو", coords: [19.7633, 96.0785] },
    continent: "asia",
    gdp: 76, gdpRank: 72, gdpPerCapita: 1400,
    inflation: 15.0, unemployment: 4.0, currency: "MMK", currencyName: "کیات",
    population: 54000000, populationDensity: 82, populationGrowth: 0.7,
    resources: { gas: { reserves: 1200, production: 18, unit: "bcm", rank: 20 }, jade: { reserves: 1000, production: 50, unit: "kt", rank: 1 } },
    exports: { total: 16, partners: [{ country: "CN", amount: 5, percent: 31 }, { country: "TH", amount: 3, percent: 19 }, { country: "IN", amount: 2, percent: 13 }, { country: "JP", amount: 1.5, percent: 9 }, { country: "SG", amount: 1, percent: 6 }], mainProducts: ["گاز", "یشم", "برنج"] },
    imports: { total: 18, partners: [{ country: "CN", amount: 8, percent: 44 }, { country: "TH", amount: 2, percent: 11 }, { country: "SG", amount: 1.5, percent: 8 }, { country: "IN", amount: 1, percent: 6 }, { country: "MY", amount: 0.8, percent: 4 }], mainProducts: ["ماشین‌آلات", "نفت", "الکترونیک"] },
    investmentRisk: 85, relations: { "CN": "green", "TH": "white", "IN": "white" },
    customs: [{ name: "گمرک یانگون", coords: [16.8661, 96.1951], workingHours: "دوشنبه تا جمعه: 9:00-17:00" }]
  },
  "LK": {
    name: "سری‌لانکا", nameEn: "Sri Lanka",
    capital: { name: "کلمبو", coords: [6.9271, 79.8612] },
    continent: "asia",
    gdp: 84, gdpRank: 68, gdpPerCapita: 3800,
    inflation: 4.0, unemployment: 4.5, currency: "LKR", currencyName: "روپیه",
    population: 22000000, populationDensity: 341, populationGrowth: 0.4,
    resources: { gemstones: { reserves: 100, production: 5, unit: "kt", rank: 5 } },
    exports: { total: 12, partners: [{ country: "US", amount: 3, percent: 25 }, { country: "UK", amount: 2, percent: 17 }, { country: "IN", amount: 1.5, percent: 13 }, { country: "DE", amount: 1, percent: 8 }, { country: "IT", amount: 0.8, percent: 7 }], mainProducts: ["چای", "پوشاک", "جواهرات"] },
    imports: { total: 20, partners: [{ country: "CN", amount: 5, percent: 25 }, { country: "IN", amount: 3, percent: 15 }, { country: "SG", amount: 2, percent: 10 }, { country: "JP", amount: 1.5, percent: 8 }, { country: "AE", amount: 1, percent: 5 }], mainProducts: ["نفت", "ماشین‌آلات", "الکترونیک"] },
    investmentRisk: 50, relations: { "IN": "green", "CN": "green", "US": "green" },
    customs: [{ name: "بندر کلمبو", coords: [6.9271, 79.8612], workingHours: "24/7" }]
  },
  "NP": {
    name: "نپال", nameEn: "Nepal",
    capital: { name: "کاتماندو", coords: [27.7172, 85.3240] },
    continent: "asia",
    gdp: 36, gdpRank: 100, gdpPerCapita: 1200,
    inflation: 6.0, unemployment: 11.4, currency: "NPR", currencyName: "روپیه",
    population: 30000000, populationDensity: 203, populationGrowth: 1.1,
    resources: {},
    exports: { total: 1.2, partners: [{ country: "IN", amount: 0.6, percent: 50 }, { country: "US", amount: 0.2, percent: 17 }, { country: "CN", amount: 0.15, percent: 13 }, { country: "DE", amount: 0.1, percent: 8 }, { country: "UK", amount: 0.05, percent: 4 }], mainProducts: ["پوشاک", "فرش", "ادویه"] },
    imports: { total: 10, partners: [{ country: "IN", amount: 6, percent: 60 }, { country: "CN", amount: 2, percent: 20 }, { country: "AE", amount: 0.5, percent: 5 }, { country: "TH", amount: 0.3, percent: 3 }, { country: "SG", amount: 0.2, percent: 2 }], mainProducts: ["نفت", "ماشین‌آلات", "الکترونیک"] },
    investmentRisk: 60, relations: { "IN": "green", "CN": "green" },
    customs: [{ name: "گمرک کاتماندو", coords: [27.7172, 85.3240], workingHours: "یکشنبه تا پنجشنبه: 10:00-17:00" }]
  },
  "BT": {
    name: "بوتان", nameEn: "Bhutan",
    capital: { name: "تیمفو", coords: [27.4728, 89.6390] },
    continent: "asia",
    gdp: 2.5, gdpRank: 165, gdpPerCapita: 3200,
    inflation: 5.0, unemployment: 2.4, currency: "BTN", currencyName: "نگولتروم",
    population: 780000, populationDensity: 20, populationGrowth: 1.0,
    resources: { hydro: { reserves: 30000, production: 8000, unit: "MW", rank: 1 } },
    exports: { total: 0.8, partners: [{ country: "IN", amount: 0.6, percent: 75 }, { country: "BD", amount: 0.1, percent: 13 }, { country: "CN", amount: 0.05, percent: 6 }, { country: "TH", amount: 0.03, percent: 4 }, { country: "JP", amount: 0.02, percent: 3 }], mainProducts: ["برق", "سیمان", "میوه"] },
    imports: { total: 1.2, partners: [{ country: "IN", amount: 0.8, percent: 67 }, { country: "CN", amount: 0.2, percent: 17 }, { country: "TH", amount: 0.1, percent: 8 }, { country: "SG", amount: 0.05, percent: 4 }, { country: "JP", amount: 0.05, percent: 4 }], mainProducts: ["نفت", "ماشین‌آلات", "غذا"] },
    investmentRisk: 30, relations: { "IN": "green", "CN": "white" },
    customs: [{ name: "گمرک فونتشولینگ", coords: [26.8167, 89.3833], workingHours: "دوشنبه تا جمعه: 9:00-17:00" }]
  },
  "MN": {
    name: "مغولستان", nameEn: "Mongolia",
    capital: { name: "اولان‌باتور", coords: [47.8864, 106.9057] },
    continent: "asia",
    gdp: 16, gdpRank: 130, gdpPerCapita: 4800,
    inflation: 10.0, unemployment: 6.3, currency: "MNT", currencyName: "توگریک",
    population: 3300000, populationDensity: 2, populationGrowth: 1.4,
    resources: { coal: { reserves: 17000, production: 40, unit: "mt", rank: 15 }, copper: { reserves: 35000, production: 1300, unit: "kt", rank: 8 }, gold: { reserves: 2000, production: 20, unit: "tons", rank: 20 } },
    exports: { total: 7, partners: [{ country: "CN", amount: 5, percent: 71 }, { country: "RU", amount: 1, percent: 14 }, { country: "SG", amount: 0.3, percent: 4 }, { country: "JP", amount: 0.2, percent: 3 }, { country: "KR", amount: 0.2, percent: 3 }], mainProducts: ["زغال", "مس", "طلا"] },
    imports: { total: 6, partners: [{ country: "CN", amount: 3, percent: 50 }, { country: "RU", amount: 1.5, percent: 25 }, { country: "JP", amount: 0.5, percent: 8 }, { country: "KR", amount: 0.3, percent: 5 }, { country: "DE", amount: 0.2, percent: 3 }], mainProducts: ["ماشین‌آلات", "نفت", "غذا"] },
    investmentRisk: 40, relations: { "CN": "green", "RU": "green" },
    customs: [{ name: "گمرک اولان‌باتور", coords: [47.8864, 106.9057], workingHours: "دوشنبه تا جمعه: 9:00-18:00" }]
  },
  "KZ": {
    name: "قزاقستان", nameEn: "Kazakhstan",
    capital: { name: "نورسلطان", coords: [51.1694, 71.4491] },
    continent: "asia",
    gdp: 225, gdpRank: 50, gdpPerCapita: 12000,
    inflation: 14.0, unemployment: 4.9, currency: "KZT", currencyName: "تنگه",
    population: 19000000, populationDensity: 7, populationGrowth: 1.2,
    resources: { oil: { reserves: 30000, production: 1800, unit: "mbbl", rank: 12 }, gas: { reserves: 2700, production: 25, unit: "bcm", rank: 18 }, uranium: { reserves: 900, production: 22, unit: "kt", rank: 2 } },
    exports: { total: 60, partners: [{ country: "CN", amount: 15, percent: 25 }, { country: "RU", amount: 12, percent: 20 }, { country: "IT", amount: 5, percent: 8 }, { country: "NL", amount: 4, percent: 7 }, { country: "FR", amount: 3, percent: 5 }], mainProducts: ["نفت", "گاز", "اورانیوم"] },
    imports: { total: 35, partners: [{ country: "RU", amount: 10, percent: 29 }, { country: "CN", amount: 8, percent: 23 }, { country: "DE", amount: 3, percent: 9 }, { country: "IT", amount: 2, percent: 6 }, { country: "US", amount: 1.5, percent: 4 }], mainProducts: ["ماشین‌آلات", "خودرو", "الکترونیک"] },
    investmentRisk: 35, relations: { "RU": "green", "CN": "green", "US": "white" },
    customs: [{ name: "گمرک آلماتی", coords: [43.2220, 76.8512], workingHours: "دوشنبه تا جمعه: 9:00-18:00" }]
  },
  "UZ": {
    name: "ازبکستان", nameEn: "Uzbekistan",
    capital: { name: "تاشکند", coords: [41.2995, 69.2401] },
    continent: "asia",
    gdp: 80, gdpRank: 70, gdpPerCapita: 2300,
    inflation: 12.0, unemployment: 9.2, currency: "UZS", currencyName: "سوم",
    population: 35000000, populationDensity: 79, populationGrowth: 1.5,
    resources: { gas: { reserves: 1200, production: 55, unit: "bcm", rank: 19 }, gold: { reserves: 1800, production: 100, unit: "tons", rank: 9 }, uranium: { reserves: 130, production: 2.4, unit: "kt", rank: 7 } },
    exports: { total: 15, partners: [{ country: "RU", amount: 4, percent: 27 }, { country: "CN", amount: 3, percent: 20 }, { country: "TR", amount: 2, percent: 13 }, { country: "KZ", amount: 1.5, percent: 10 }, { country: "AF", amount: 1, percent: 7 }], mainProducts: ["گاز", "طلا", "پنبه"] },
    imports: { total: 18, partners: [{ country: "CN", amount: 5, percent: 28 }, { country: "RU", amount: 4, percent: 22 }, { country: "KZ", amount: 2, percent: 11 }, { country: "KR", amount: 1.5, percent: 8 }, { country: "TR", amount: 1, percent: 6 }], mainProducts: ["ماشین‌آلات", "نفت", "الکترونیک"] },
    investmentRisk: 50, relations: { "RU": "green", "CN": "green", "KZ": "green" },
    customs: [{ name: "گمرک تاشکند", coords: [41.2995, 69.2401], workingHours: "دوشنبه تا جمعه: 9:00-18:00" }]
  },
  "TM": {
    name: "ترکمنستان", nameEn: "Turkmenistan",
    capital: { name: "عشق‌آباد", coords: [37.9601, 58.3261] },
    continent: "asia",
    gdp: 63, gdpRank: 76, gdpPerCapita: 10000,
    inflation: 5.0, unemployment: 3.0, currency: "TMT", currencyName: "منات",
    population: 6000000, populationDensity: 13, populationGrowth: 1.3,
    resources: { gas: { reserves: 19500, production: 60, unit: "bcm", rank: 4 }, oil: { reserves: 600, production: 200, unit: "mbbl", rank: 45 } },
    exports: { total: 12, partners: [{ country: "CN", amount: 8, percent: 67 }, { country: "TR", amount: 1.5, percent: 13 }, { country: "IT", amount: 1, percent: 8 }, { country: "AE", amount: 0.5, percent: 4 }, { country: "AF", amount: 0.3, percent: 3 }], mainProducts: ["گاز", "نفت", "پنبه"] },
    imports: { total: 8, partners: [{ country: "CN", amount: 3, percent: 38 }, { country: "TR", amount: 1.5, percent: 19 }, { country: "RU", amount: 1, percent: 13 }, { country: "DE", amount: 0.8, percent: 10 }, { country: "IT", amount: 0.5, percent: 6 }], mainProducts: ["ماشین‌آلات", "الکترونیک", "غذا"] },
    investmentRisk: 60, relations: { "CN": "green", "RU": "white", "TR": "white" },
    customs: [{ name: "گمرک عشق‌آباد", coords: [37.9601, 58.3261], workingHours: "دوشنبه تا جمعه: 9:00-18:00" }]
  },
  "TJ": {
    name: "تاجیکستان", nameEn: "Tajikistan",
    capital: { name: "دوشنبه", coords: [38.5598, 68.7870] },
    continent: "asia",
    gdp: 10, gdpRank: 140, gdpPerCapita: 1000,
    inflation: 8.0, unemployment: 2.2, currency: "TJS", currencyName: "سومونی",
    population: 10000000, populationDensity: 71, populationGrowth: 2.0,
    resources: { hydro: { reserves: 52700, production: 18000, unit: "MW", rank: 8 }, aluminum: { reserves: 0, production: 0.5, unit: "mt", rank: 20 } },
    exports: { total: 1.5, partners: [{ country: "CH", amount: 0.4, percent: 27 }, { country: "TR", amount: 0.3, percent: 20 }, { country: "RU", amount: 0.25, percent: 17 }, { country: "CN", amount: 0.2, percent: 13 }, { country: "KZ", amount: 0.15, percent: 10 }], mainProducts: ["آلومینیوم", "برق", "پنبه"] },
    imports: { total: 3.5, partners: [{ country: "RU", amount: 1, percent: 29 }, { country: "CN", amount: 0.8, percent: 23 }, { country: "KZ", amount: 0.5, percent: 14 }, { country: "TR", amount: 0.3, percent: 9 }, { country: "UZ", amount: 0.2, percent: 6 }], mainProducts: ["نفت", "ماشین‌آلات", "غذا"] },
    investmentRisk: 55, relations: { "RU": "green", "CN": "green", "UZ": "white" },
    customs: [{ name: "گمرک دوشنبه", coords: [38.5598, 68.7870], workingHours: "دوشنبه تا جمعه: 9:00-18:00" }]
  },
  "KG": {
    name: "قرقیزستان", nameEn: "Kyrgyzstan",
    capital: { name: "بیشکک", coords: [42.8746, 74.5698] },
    continent: "asia",
    gdp: 9, gdpRank: 142, gdpPerCapita: 1300,
    inflation: 7.0, unemployment: 3.2, currency: "KGS", currencyName: "سوم",
    population: 7000000, populationDensity: 35, populationGrowth: 1.4,
    resources: { gold: { reserves: 600, production: 20, unit: "tons", rank: 25 }, hydro: { reserves: 14200, production: 3000, unit: "MW", rank: 20 } },
    exports: { total: 2, partners: [{ country: "CH", amount: 0.6, percent: 30 }, { country: "RU", amount: 0.4, percent: 20 }, { country: "KZ", amount: 0.3, percent: 15 }, { country: "UZ", amount: 0.2, percent: 10 }, { country: "TR", amount: 0.15, percent: 8 }], mainProducts: ["طلا", "پنبه", "پشم"] },
    imports: { total: 4.5, partners: [{ country: "RU", amount: 1.5, percent: 33 }, { country: "CN", amount: 1, percent: 22 }, { country: "KZ", amount: 0.6, percent: 13 }, { country: "UZ", amount: 0.4, percent: 9 }, { country: "TR", amount: 0.3, percent: 7 }], mainProducts: ["نفت", "ماشین‌آلات", "غذا"] },
    investmentRisk: 50, relations: { "RU": "green", "CN": "green", "KZ": "white" },
    customs: [{ name: "گمرک بیشکک", coords: [42.8746, 74.5698], workingHours: "دوشنبه تا جمعه: 9:00-18:00" }]
  },
  "AM": {
    name: "ارمنستان", nameEn: "Armenia",
    capital: { name: "ایروان", coords: [40.1811, 44.5136] },
    continent: "asia",
    gdp: 19, gdpRank: 125, gdpPerCapita: 6500,
    inflation: 2.0, unemployment: 15.0, currency: "AMD", currencyName: "درام",
    population: 3000000, populationDensity: 104, populationGrowth: 0.2,
    resources: { copper: { reserves: 6000, production: 180, unit: "kt", rank: 18 }, molybdenum: { reserves: 150, production: 7, unit: "kt", rank: 7 } },
    exports: { total: 3.5, partners: [{ country: "RU", amount: 1.2, percent: 34 }, { country: "CH", amount: 0.5, percent: 14 }, { country: "IR", amount: 0.4, percent: 11 }, { country: "DE", amount: 0.3, percent: 9 }, { country: "GE", amount: 0.2, percent: 6 }], mainProducts: ["مس", "مولیبدن", "الماس"] },
    imports: { total: 5, partners: [{ country: "RU", amount: 1.5, percent: 30 }, { country: "CN", amount: 0.8, percent: 16 }, { country: "IR", amount: 0.5, percent: 10 }, { country: "DE", amount: 0.4, percent: 8 }, { country: "IT", amount: 0.3, percent: 6 }], mainProducts: ["نفت", "ماشین‌آلات", "غذا"] },
    investmentRisk: 45, relations: { "RU": "green", "IR": "green", "GE": "white", "AZ": "red" },
    customs: [{ name: "گمرک ایروان", coords: [40.1811, 44.5136], workingHours: "دوشنبه تا جمعه: 9:00-18:00" }]
  },
  "AZ": {
    name: "آذربایجان", nameEn: "Azerbaijan",
    capital: { name: "باکو", coords: [40.4093, 49.8671] },
    continent: "asia",
    gdp: 78, gdpRank: 71, gdpPerCapita: 7800,
    inflation: 12.0, unemployment: 5.6, currency: "AZN", currencyName: "منات",
    population: 10000000, populationDensity: 121, populationGrowth: 0.9,
    resources: { oil: { reserves: 7000, production: 800, unit: "mbbl", rank: 19 }, gas: { reserves: 1200, production: 20, unit: "bcm", rank: 20 } },
    exports: { total: 25, partners: [{ country: "IT", amount: 8, percent: 32 }, { country: "TR", amount: 4, percent: 16 }, { country: "IL", amount: 2.5, percent: 10 }, { country: "GE", amount: 2, percent: 8 }, { country: "RU", amount: 1.5, percent: 6 }], mainProducts: ["نفت", "گاز", "پنبه"] },
    imports: { total: 12, partners: [{ country: "RU", amount: 3, percent: 25 }, { country: "TR", amount: 2.5, percent: 21 }, { country: "CN", amount: 2, percent: 17 }, { country: "DE", amount: 1, percent: 8 }, { country: "IT", amount: 0.8, percent: 7 }], mainProducts: ["ماشین‌آلات", "خودرو", "الکترونیک"] },
    investmentRisk: 40, relations: { "TR": "green", "GE": "white", "RU": "white", "AM": "red" },
    customs: [{ name: "بندر باکو", coords: [40.4093, 49.8671], workingHours: "24/7" }]
  },
  "GE": {
    name: "گرجستان", nameEn: "Georgia",
    capital: { name: "تفلیس", coords: [41.7151, 44.8271] },
    continent: "asia",
    gdp: 25, gdpRank: 115, gdpPerCapita: 6700,
    inflation: 2.5, unemployment: 11.5, currency: "GEL", currencyName: "لاری",
    population: 3700000, populationDensity: 53, populationGrowth: -0.1,
    resources: {},
    exports: { total: 4.5, partners: [{ country: "RU", amount: 1.2, percent: 27 }, { country: "AZ", amount: 0.8, percent: 18 }, { country: "BG", amount: 0.5, percent: 11 }, { country: "TR", amount: 0.4, percent: 9 }, { country: "AM", amount: 0.3, percent: 7 }], mainProducts: ["شراب", "آهن", "ماشین‌آلات"] },
    imports: { total: 8, partners: [{ country: "TR", amount: 1.8, percent: 23 }, { country: "CN", amount: 1.5, percent: 19 }, { country: "RU", amount: 1.2, percent: 15 }, { country: "AZ", amount: 0.8, percent: 10 }, { country: "DE", amount: 0.5, percent: 6 }], mainProducts: ["نفت", "ماشین‌آلات", "غذا"] },
    investmentRisk: 35, relations: { "TR": "green", "AZ": "white", "RU": "orange" },
    customs: [{ name: "گمرک تفلیس", coords: [41.7151, 44.8271], workingHours: "دوشنبه تا جمعه: 9:00-18:00" }]
  },
  "LB": {
    name: "لبنان", nameEn: "Lebanon",
    capital: { name: "بیروت", coords: [33.8938, 35.5018] },
    continent: "asia",
    gdp: 23, gdpRank: 118, gdpPerCapita: 3800,
    inflation: 200, unemployment: 11.4, currency: "LBP", currencyName: "لیره",
    population: 6800000, populationDensity: 667, populationGrowth: 0.5,
    resources: {},
    exports: { total: 3.8, partners: [{ country: "CH", amount: 0.8, percent: 21 }, { country: "SA", amount: 0.6, percent: 16 }, { country: "AE", amount: 0.5, percent: 13 }, { country: "US", amount: 0.4, percent: 11 }, { country: "TR", amount: 0.3, percent: 8 }], mainProducts: ["جواهرات", "دارو", "میوه"] },
    imports: { total: 18, partners: [{ country: "CN", amount: 4, percent: 22 }, { country: "IT", amount: 2.5, percent: 14 }, { country: "GR", amount: 1.8, percent: 10 }, { country: "DE", amount: 1.5, percent: 8 }, { country: "TR", amount: 1.2, percent: 7 }], mainProducts: ["نفت", "ماشین‌آلات", "غذا"] },
    investmentRisk: 90, relations: { "SY": "orange", "IL": "red", "IR": "green" },
    customs: [{ name: "بندر بیروت", coords: [33.8938, 35.5018], workingHours: "24/7" }]
  },
  "JO": {
    name: "اردن", nameEn: "Jordan",
    capital: { name: "امان", coords: [31.9539, 35.9106] },
    continent: "asia",
    gdp: 47, gdpRank: 88, gdpPerCapita: 4500,
    inflation: 2.1, unemployment: 19.0, currency: "JOD", currencyName: "دینار",
    population: 11000000, populationDensity: 115, populationGrowth: 1.0,
    resources: { phosphate: { reserves: 1000, production: 8, unit: "mt", rank: 5 } },
    exports: { total: 8.5, partners: [{ country: "US", amount: 1.5, percent: 18 }, { country: "SA", amount: 1.2, percent: 14 }, { country: "IQ", amount: 1, percent: 12 }, { country: "IN", amount: 0.8, percent: 9 }, { country: "AE", amount: 0.6, percent: 7 }], mainProducts: ["فسفات", "پوشاک", "دارو"] },
    imports: { total: 18, partners: [{ country: "CN", amount: 4, percent: 22 }, { country: "SA", amount: 3, percent: 17 }, { country: "US", amount: 2, percent: 11 }, { country: "DE", amount: 1.5, percent: 8 }, { country: "IT", amount: 1, percent: 6 }], mainProducts: ["نفت", "ماشین‌آلات", "غذا"] },
    investmentRisk: 40, relations: { "SA": "green", "US": "green", "IL": "white" },
    customs: [{ name: "گمرک امان", coords: [31.9539, 35.9106], workingHours: "یکشنبه تا پنجشنبه: 8:00-16:00" }]
  },
  "KW": {
    name: "کویت", nameEn: "Kuwait",
    capital: { name: "کویت", coords: [29.3759, 47.9774] },
    continent: "asia",
    gdp: 184, gdpRank: 57, gdpPerCapita: 42000,
    inflation: 3.2, unemployment: 2.1, currency: "KWD", currencyName: "دینار",
    population: 4300000, populationDensity: 240, populationGrowth: 1.3,
    resources: { oil: { reserves: 101500, production: 2700, unit: "mbbl", rank: 6 }, gas: { reserves: 1800, production: 18, unit: "bcm", rank: 22 } },
    exports: { total: 68, partners: [{ country: "CN", amount: 12, percent: 18 }, { country: "IN", amount: 10, percent: 15 }, { country: "KR", amount: 8, percent: 12 }, { country: "JP", amount: 7, percent: 10 }, { country: "SG", amount: 5, percent: 7 }], mainProducts: ["نفت", "گاز", "پتروشیمی"] },
    imports: { total: 30, partners: [{ country: "CN", amount: 8, percent: 27 }, { country: "US", amount: 4, percent: 13 }, { country: "AE", amount: 2.5, percent: 8 }, { country: "DE", amount: 2, percent: 7 }, { country: "JP", amount: 1.5, percent: 5 }], mainProducts: ["ماشین‌آلات", "خودرو", "الکترونیک"] },
    investmentRisk: 15, relations: { "SA": "green", "AE": "green", "US": "green" },
    customs: [{ name: "بندر الاحمدی", coords: [29.3759, 47.9774], workingHours: "24/7" }]
  },
  "QA": {
    name: "قطر", nameEn: "Qatar",
    capital: { name: "دوحه", coords: [25.2854, 51.5310] },
    continent: "asia",
    gdp: 237, gdpRank: 54, gdpPerCapita: 85000,
    inflation: 2.5, unemployment: 0.1, currency: "QAR", currencyName: "ریال",
    population: 2900000, populationDensity: 250, populationGrowth: 0.3,
    resources: { gas: { reserves: 24500, production: 177, unit: "bcm", rank: 3 }, oil: { reserves: 25200, production: 1500, unit: "mbbl", rank: 14 } },
    exports: { total: 95, partners: [{ country: "CN", amount: 18, percent: 19 }, { country: "JP", amount: 15, percent: 16 }, { country: "KR", amount: 12, percent: 13 }, { country: "IN", amount: 10, percent: 11 }, { country: "SG", amount: 8, percent: 8 }], mainProducts: ["گاز", "نفت", "پتروشیمی"] },
    imports: { total: 30, partners: [{ country: "CN", amount: 6, percent: 20 }, { country: "US", amount: 4, percent: 13 }, { country: "DE", amount: 2.5, percent: 8 }, { country: "IT", amount: 2, percent: 7 }, { country: "JP", amount: 1.5, percent: 5 }], mainProducts: ["ماشین‌آلات", "خودرو", "الکترونیک"] },
    investmentRisk: 10, relations: { "SA": "white", "AE": "white", "US": "green" },
    customs: [{ name: "بندر دوحه", coords: [25.2854, 51.5310], workingHours: "24/7" }]
  },
  "BH": {
    name: "بحرین", nameEn: "Bahrain",
    capital: { name: "منامه", coords: [26.0667, 50.5577] },
    continent: "asia",
    gdp: 44, gdpRank: 91, gdpPerCapita: 26000,
    inflation: 0.9, unemployment: 1.8, currency: "BHD", currencyName: "دینار",
    population: 1800000, populationDensity: 2236, populationGrowth: 1.5,
    resources: { oil: { reserves: 125, production: 200, unit: "mbbl", rank: 60 }, gas: { reserves: 200, production: 15, unit: "bcm", rank: 35 } },
    exports: { total: 22, partners: [{ country: "SA", amount: 5, percent: 23 }, { country: "AE", amount: 4, percent: 18 }, { country: "US", amount: 3, percent: 14 }, { country: "OM", amount: 2, percent: 9 }, { country: "KW", amount: 1.5, percent: 7 }], mainProducts: ["نفت", "گاز", "آلومینیوم"] },
    imports: { total: 16, partners: [{ country: "CN", amount: 3.5, percent: 22 }, { country: "SA", amount: 2.5, percent: 16 }, { country: "US", amount: 2, percent: 13 }, { country: "AE", amount: 1.5, percent: 9 }, { country: "JP", amount: 1, percent: 6 }], mainProducts: ["ماشین‌آلات", "نفت", "الکترونیک"] },
    investmentRisk: 20, relations: { "SA": "green", "AE": "green", "US": "green" },
    customs: [{ name: "بندر منامه", coords: [26.0667, 50.5577], workingHours: "24/7" }]
  },
  "OM": {
    name: "عمان", nameEn: "Oman",
    capital: { name: "مسقط", coords: [23.5859, 58.4059] },
    continent: "asia",
    gdp: 114, gdpRank: 62, gdpPerCapita: 24000,
    inflation: 1.0, unemployment: 1.5, currency: "OMR", currencyName: "ریال",
    population: 5200000, populationDensity: 17, populationGrowth: 1.8,
    resources: { oil: { reserves: 5300, production: 950, unit: "mbbl", rank: 22 }, gas: { reserves: 700, production: 35, unit: "bcm", rank: 26 } },
    exports: { total: 45, partners: [{ country: "CN", amount: 18, percent: 40 }, { country: "IN", amount: 5, percent: 11 }, { country: "JP", amount: 4, percent: 9 }, { country: "KR", amount: 3, percent: 7 }, { country: "AE", amount: 2.5, percent: 6 }], mainProducts: ["نفت", "گاز", "مس"] },
    imports: { total: 28, partners: [{ country: "CN", amount: 6, percent: 21 }, { country: "AE", amount: 4, percent: 14 }, { country: "IN", amount: 3, percent: 11 }, { country: "US", amount: 2.5, percent: 9 }, { country: "JP", amount: 2, percent: 7 }], mainProducts: ["ماشین‌آلات", "خودرو", "الکترونیک"] },
    investmentRisk: 25, relations: { "AE": "green", "SA": "green", "IR": "white" },
    customs: [{ name: "بندر صلاله", coords: [17.0151, 54.0924], workingHours: "24/7" }]
  },
  "LA": {
    name: "لائوس", nameEn: "Laos",
    capital: { name: "ویانتیان", coords: [17.9757, 102.6331] },
    continent: "asia",
    gdp: 15, gdpRank: 135, gdpPerCapita: 2500,
    inflation: 3.0, unemployment: 0.7, currency: "LAK", currencyName: "کیپ",
    population: 7500000, populationDensity: 32, populationGrowth: 1.4,
    resources: { hydro: { reserves: 26000, production: 5000, unit: "MW", rank: 10 }, copper: { reserves: 5000, production: 100, unit: "kt", rank: 15 } },
    exports: { total: 6, partners: [{ country: "TH", amount: 2, percent: 33 }, { country: "CN", amount: 1.5, percent: 25 }, { country: "VN", amount: 1, percent: 17 }, { country: "MY", amount: 0.5, percent: 8 }, { country: "JP", amount: 0.4, percent: 7 }], mainProducts: ["برق", "مس", "چوب"] },
    imports: { total: 5.5, partners: [{ country: "TH", amount: 2, percent: 36 }, { country: "CN", amount: 1.5, percent: 27 }, { country: "VN", amount: 0.8, percent: 15 }, { country: "MY", amount: 0.5, percent: 9 }, { country: "JP", amount: 0.4, percent: 7 }], mainProducts: ["ماشین‌آلات", "نفت", "غذا"] },
    investmentRisk: 45, relations: { "TH": "green", "VN": "green", "CN": "green" },
    customs: [{ name: "گمرک ویانتیان", coords: [17.9757, 102.6331], workingHours: "دوشنبه تا جمعه: 8:00-17:00" }]
  },
  "KH": {
    name: "کامبوج", nameEn: "Cambodia",
    capital: { name: "پنوم‌پن", coords: [11.5564, 104.9282] },
    continent: "asia",
    gdp: 29, gdpRank: 110, gdpPerCapita: 1700,
    inflation: 2.9, unemployment: 0.3, currency: "KHR", currencyName: "ریل",
    population: 17000000, populationDensity: 96, populationGrowth: 1.3,
    resources: {},
    exports: { total: 19, partners: [{ country: "US", amount: 8, percent: 42 }, { country: "CN", amount: 3, percent: 16 }, { country: "GB", amount: 2, percent: 11 }, { country: "JP", amount: 1.5, percent: 8 }, { country: "VN", amount: 1.2, percent: 6 }], mainProducts: ["پوشاک", "ماهی", "برنج"] },
    imports: { total: 25, partners: [{ country: "CN", amount: 8, percent: 32 }, { country: "TH", amount: 4, percent: 16 }, { country: "VN", amount: 3, percent: 12 }, { country: "SG", amount: 2, percent: 8 }, { country: "JP", amount: 1.5, percent: 6 }], mainProducts: ["ماشین‌آلات", "نفت", "الکترونیک"] },
    investmentRisk: 40, relations: { "VN": "green", "TH": "green", "LA": "green" },
    customs: [{ name: "بندر سیانوكویل", coords: [10.6093, 103.5296], workingHours: "24/7" }]
  },
  "BN": {
    name: "برونئی", nameEn: "Brunei",
    capital: { name: "بندر سری بگاوان", coords: [4.9031, 114.9398] },
    continent: "asia",
    gdp: 15, gdpRank: 111, gdpPerCapita: 32000,
    inflation: 1.0, unemployment: 6.8, currency: "BND", currencyName: "دلار",
    population: 450000, populationDensity: 83, populationGrowth: 0.8,
    resources: { oil: { reserves: 1100, production: 120, unit: "mbbl", rank: 40 }, gas: { reserves: 300, production: 12, unit: "bcm", rank: 30 } },
    exports: { total: 8, partners: [{ country: "JP", amount: 2.5, percent: 31 }, { country: "AU", amount: 1.5, percent: 19 }, { country: "CN", amount: 1.2, percent: 15 }, { country: "IN", amount: 0.8, percent: 10 }, { country: "MY", amount: 0.6, percent: 8 }], mainProducts: ["نفت", "گاز", "پتروشیمی"] },
    imports: { total: 4, partners: [{ country: "CN", amount: 1, percent: 25 }, { country: "MY", amount: 0.6, percent: 15 }, { country: "SG", amount: 0.5, percent: 13 }, { country: "US", amount: 0.4, percent: 10 }, { country: "JP", amount: 0.3, percent: 8 }], mainProducts: ["ماشین‌آلات", "خودرو", "الکترونیک"] },
    investmentRisk: 20, relations: { "MY": "green", "SG": "green", "ID": "white" },
    customs: [{ name: "بندر سری بگاوان", coords: [4.9031, 114.9398], workingHours: "24/7" }]
  },
  "MV": {
    name: "مالدیو", nameEn: "Maldives",
    capital: { name: "ماله", coords: [4.1755, 73.5093] },
    continent: "asia",
    gdp: 6, gdpRank: 153, gdpPerCapita: 11000,
    inflation: 2.3, unemployment: 5.0, currency: "MVR", currencyName: "روفیا",
    population: 550000, populationDensity: 1800, populationGrowth: 0.2,
    resources: {},
    exports: { total: 0.5, partners: [{ country: "TH", amount: 0.15, percent: 30 }, { country: "FR", amount: 0.1, percent: 20 }, { country: "US", amount: 0.08, percent: 16 }, { country: "IN", amount: 0.06, percent: 12 }, { country: "SG", amount: 0.04, percent: 8 }], mainProducts: ["ماهی", "پوشاک"] },
    imports: { total: 2, partners: [{ country: "IN", amount: 0.5, percent: 25 }, { country: "CN", amount: 0.4, percent: 20 }, { country: "SG", amount: 0.3, percent: 15 }, { country: "AE", amount: 0.25, percent: 13 }, { country: "TH", amount: 0.2, percent: 10 }], mainProducts: ["غذا", "نفت", "ماشین‌آلات"] },
    investmentRisk: 30, relations: { "IN": "green", "LK": "green", "CN": "green" },
    customs: [{ name: "بندر ماله", coords: [4.1755, 73.5093], workingHours: "24/7" }]
  },
  "AF": {
    name: "افغانستان", nameEn: "Afghanistan",
    capital: { name: "کابل", coords: [34.5553, 69.2075] },
    continent: "asia",
    gdp: 14, gdpRank: 111, gdpPerCapita: 500,
    inflation: 2.0, unemployment: 11.2, currency: "AFN", currencyName: "افغانی",
    population: 41000000, populationDensity: 63, populationGrowth: 2.3,
    resources: { lithium: { reserves: 1000, production: 0, unit: "kt", rank: 3 }, copper: { reserves: 3000, production: 0, unit: "kt", rank: 20 }, gold: { reserves: 30, production: 0.5, unit: "tons", rank: 50 } },
    exports: { total: 1.5, partners: [{ country: "PK", amount: 0.5, percent: 33 }, { country: "IN", amount: 0.4, percent: 27 }, { country: "CN", amount: 0.3, percent: 20 }, { country: "IR", amount: 0.15, percent: 10 }, { country: "UZ", amount: 0.1, percent: 7 }], mainProducts: ["میوه", "پشم", "فرش"] },
    imports: { total: 7, partners: [{ country: "PK", amount: 2, percent: 29 }, { country: "CN", amount: 1.5, percent: 21 }, { country: "IR", amount: 1, percent: 14 }, { country: "IN", amount: 0.8, percent: 11 }, { country: "UZ", amount: 0.5, percent: 7 }], mainProducts: ["غذا", "نفت", "ماشین‌آلات"] },
    investmentRisk: 95, relations: { "PK": "white", "IR": "white", "CN": "white" },
    customs: [{ name: "گمرک کابل", coords: [34.5553, 69.2075], workingHours: "شنبه تا پنجشنبه: 8:00-16:00" }]
  },
  "CY": {
    name: "قبرس", nameEn: "Cyprus",
    capital: { name: "نیکوزیا", coords: [35.1856, 33.3823] },
    continent: "asia",
    gdp: 28, gdpRank: 112, gdpPerCapita: 31000,
    inflation: 2.5, unemployment: 6.8, currency: "EUR", currencyName: "یورو",
    population: 1200000, populationDensity: 131, populationGrowth: 0.7,
    resources: {},
    exports: { total: 4, partners: [{ country: "GR", amount: 0.8, percent: 20 }, { country: "IT", amount: 0.6, percent: 15 }, { country: "DE", amount: 0.5, percent: 13 }, { country: "UK", amount: 0.4, percent: 10 }, { country: "FR", amount: 0.3, percent: 8 }], mainProducts: ["دارو", "پنیر", "میوه"] },
    imports: { total: 8, partners: [{ country: "GR", amount: 1.5, percent: 19 }, { country: "IT", amount: 1.2, percent: 15 }, { country: "CN", amount: 1, percent: 13 }, { country: "DE", amount: 0.8, percent: 10 }, { country: "NL", amount: 0.6, percent: 8 }], mainProducts: ["ماشین‌آلات", "نفت", "غذا"] },
    investmentRisk: 25, relations: { "GR": "green", "TR": "orange", "UK": "green" },
    customs: [{ name: "بندر لیماسول", coords: [34.7071, 33.0226], workingHours: "24/7" }]
  },
  "MO": {
    name: "ماکائو", nameEn: "Macau",
    capital: { name: "ماکائو", coords: [22.1987, 113.5439] },
    continent: "asia",
    gdp: 22, gdpRank: 120, gdpPerCapita: 43000,
    inflation: 1.0, unemployment: 2.0, currency: "MOP", currencyName: "پاتاکا",
    population: 700000, populationDensity: 21645, populationGrowth: 0.8,
    resources: {},
    exports: { total: 1.2, partners: [{ country: "CN", amount: 0.5, percent: 42 }, { country: "HK", amount: 0.3, percent: 25 }, { country: "US", amount: 0.15, percent: 13 }, { country: "JP", amount: 0.1, percent: 8 }, { country: "KR", amount: 0.08, percent: 7 }], mainProducts: ["پوشاک", "ماشین‌آلات", "سیمان"] },
    imports: { total: 12, partners: [{ country: "CN", amount: 4, percent: 33 }, { country: "HK", amount: 2.5, percent: 21 }, { country: "US", amount: 1, percent: 8 }, { country: "JP", amount: 0.8, percent: 7 }, { country: "KR", amount: 0.6, percent: 5 }], mainProducts: ["ماشین‌آلات", "نفت", "غذا"] },
    investmentRisk: 10, relations: { "CN": "green", "HK": "green", "PT": "green" },
    customs: [{ name: "بندر ماکائو", coords: [22.1987, 113.5439], workingHours: "24/7" }]
  },
  "HK": {
    name: "هنگ‌کنگ", nameEn: "Hong Kong",
    capital: { name: "هنگ‌کنگ", coords: [22.3193, 114.1694] },
    continent: "asia",
    gdp: 383, gdpRank: 40, gdpPerCapita: 50000,
    inflation: 1.7, unemployment: 2.9, currency: "HKD", currencyName: "دلار",
    population: 7500000, populationDensity: 7140, populationGrowth: 0.2,
    resources: {},
    exports: { total: 570, partners: [{ country: "CN", amount: 285, percent: 50 }, { country: "US", amount: 40, percent: 7 }, { country: "IN", amount: 25, percent: 4 }, { country: "JP", amount: 20, percent: 4 }, { country: "SG", amount: 18, percent: 3 }], mainProducts: ["الکترونیک", "پوشاک", "جواهرات"] },
    imports: { total: 600, partners: [{ country: "CN", amount: 300, percent: 50 }, { country: "SG", amount: 30, percent: 5 }, { country: "JP", amount: 25, percent: 4 }, { country: "US", amount: 20, percent: 3 }, { country: "KR", amount: 18, percent: 3 }], mainProducts: ["الکترونیک", "ماشین‌آلات", "نفت"] },
    investmentRisk: 15, relations: { "CN": "green", "US": "green", "UK": "green" },
    customs: [{ name: "بندر هنگ‌کنگ", coords: [22.3193, 114.1694], workingHours: "24/7" }]
  },
  "TW": {
    name: "تایوان", nameEn: "Taiwan",
    capital: { name: "تایپه", coords: [25.0330, 121.5654] },
    continent: "asia",
    gdp: 790, gdpRank: 19, gdpPerCapita: 33000,
    inflation: 1.2, unemployment: 3.7, currency: "TWD", currencyName: "دلار",
    population: 24000000, populationDensity: 673, populationGrowth: 0.1,
    resources: {},
    exports: { total: 479, partners: [{ country: "CN", amount: 120, percent: 25 }, { country: "US", amount: 75, percent: 16 }, { country: "HK", amount: 50, percent: 10 }, { country: "JP", amount: 40, percent: 8 }, { country: "SG", amount: 30, percent: 6 }], mainProducts: ["الکترونیک", "ماشین‌آلات", "پلاستیک"] },
    imports: { total: 428, partners: [{ country: "CN", amount: 100, percent: 23 }, { country: "JP", amount: 60, percent: 14 }, { country: "US", amount: 50, percent: 12 }, { country: "KR", amount: 35, percent: 8 }, { country: "SG", amount: 25, percent: 6 }], mainProducts: ["الکترونیک", "نفت", "ماشین‌آلات"] },
    investmentRisk: 20, relations: { "CN": "orange", "US": "green", "JP": "green" },
    customs: [{ name: "بندر کائوهسیونگ", coords: [22.6273, 120.3014], workingHours: "24/7" }]
  },
  "IS": {
    name: "ایسلند", nameEn: "Iceland",
    capital: { name: "ریکیاویک", coords: [64.1466, -21.9426] },
    continent: "europe",
    gdp: 28, gdpRank: 113, gdpPerCapita: 73000,
    inflation: 6.0, unemployment: 3.0, currency: "ISK", currencyName: "کرون",
    population: 370000, populationDensity: 4, populationGrowth: 0.6,
    resources: {},
    exports: { total: 7, partners: [{ country: "NL", amount: 1.5, percent: 21 }, { country: "ES", amount: 1.2, percent: 17 }, { country: "UK", amount: 0.8, percent: 11 }, { country: "DE", amount: 0.7, percent: 10 }, { country: "FR", amount: 0.6, percent: 9 }], mainProducts: ["ماهی", "آلومینیوم", "پشم"] },
    imports: { total: 7.5, partners: [{ country: "NO", amount: 1.5, percent: 20 }, { country: "DE", amount: 1, percent: 13 }, { country: "CN", amount: 0.8, percent: 11 }, { country: "NL", amount: 0.6, percent: 8 }, { country: "US", amount: 0.5, percent: 7 }], mainProducts: ["ماشین‌آلات", "نفت", "غذا"] },
    investmentRisk: 10, relations: { "NO": "green", "DK": "green", "UK": "green" },
    customs: [{ name: "بندر ریکیاویک", coords: [64.1466, -21.9426], workingHours: "24/7" }]
  },
  "LU": {
    name: "لوکزامبورگ", nameEn: "Luxembourg",
    capital: { name: "لوکزامبورگ", coords: [49.6116, 6.1319] },
    continent: "europe",
    gdp: 87, gdpRank: 70, gdpPerCapita: 140000,
    inflation: 3.2, unemployment: 4.6, currency: "EUR", currencyName: "یورو",
    population: 650000, populationDensity: 252, populationGrowth: 1.1,
    resources: {},
    exports: { total: 150, partners: [{ country: "DE", amount: 40, percent: 27 }, { country: "BE", amount: 25, percent: 17 }, { country: "FR", amount: 20, percent: 13 }, { country: "NL", amount: 15, percent: 10 }, { country: "IT", amount: 10, percent: 7 }], mainProducts: ["فولاد", "ماشین‌آلات", "خدمات مالی"] },
    imports: { total: 140, partners: [{ country: "BE", amount: 35, percent: 25 }, { country: "DE", amount: 30, percent: 21 }, { country: "FR", amount: 20, percent: 14 }, { country: "CN", amount: 12, percent: 9 }, { country: "NL", amount: 10, percent: 7 }], mainProducts: ["ماشین‌آلات", "نفت", "الکترونیک"] },
    investmentRisk: 5, relations: { "BE": "green", "DE": "green", "FR": "green" },
    customs: [{ name: "گمرک لوکزامبورگ", coords: [49.6116, 6.1319], workingHours: "دوشنبه تا جمعه: 8:00-17:00" }]
  },
  "MT": {
    name: "مالت", nameEn: "Malta",
    capital: { name: "والتا", coords: [35.8997, 14.5146] },
    continent: "europe",
    gdp: 18, gdpRank: 129, gdpPerCapita: 33000,
    inflation: 5.6, unemployment: 3.0, currency: "EUR", currencyName: "یورو",
    population: 520000, populationDensity: 1650, populationGrowth: 0.3,
    resources: {},
    exports: { total: 4.5, partners: [{ country: "IT", amount: 0.8, percent: 18 }, { country: "DE", amount: 0.6, percent: 13 }, { country: "FR", amount: 0.5, percent: 11 }, { country: "US", amount: 0.4, percent: 9 }, { country: "UK", amount: 0.35, percent: 8 }], mainProducts: ["دارو", "الکترونیک", "ماهی"] },
    imports: { total: 7, partners: [{ country: "IT", amount: 1.2, percent: 17 }, { country: "DE", amount: 1, percent: 14 }, { country: "CN", amount: 0.8, percent: 11 }, { country: "FR", amount: 0.6, percent: 9 }, { country: "ES", amount: 0.5, percent: 7 }], mainProducts: ["ماشین‌آلات", "نفت", "غذا"] },
    investmentRisk: 15, relations: { "IT": "green", "UK": "green", "GR": "green" },
    customs: [{ name: "بندر والتا", coords: [35.8997, 14.5146], workingHours: "24/7" }]
  },
  "AL": {
    name: "آلبانی", nameEn: "Albania",
    capital: { name: "تیرانا", coords: [41.3275, 19.8187] },
    continent: "europe",
    gdp: 19, gdpRank: 122, gdpPerCapita: 6500,
    inflation: 3.0, unemployment: 11.4, currency: "ALL", currencyName: "لک",
    population: 2800000, populationDensity: 101, populationGrowth: -0.1,
    resources: { oil: { reserves: 200, production: 10, unit: "mbbl", rank: 60 }, chromium: { reserves: 200, production: 0.3, unit: "kt", rank: 3 } },
    exports: { total: 3.5, partners: [{ country: "IT", amount: 1, percent: 29 }, { country: "ES", amount: 0.5, percent: 14 }, { country: "GR", amount: 0.4, percent: 11 }, { country: "DE", amount: 0.3, percent: 9 }, { country: "CN", amount: 0.25, percent: 7 }], mainProducts: ["پوشاک", "کفش", "کروم"] },
    imports: { total: 6, partners: [{ country: "IT", amount: 1.5, percent: 25 }, { country: "GR", amount: 0.8, percent: 13 }, { country: "CN", amount: 0.7, percent: 12 }, { country: "DE", amount: 0.6, percent: 10 }, { country: "TR", amount: 0.5, percent: 8 }], mainProducts: ["ماشین‌آلات", "نفت", "غذا"] },
    investmentRisk: 40, relations: { "IT": "green", "GR": "green", "MK": "green" },
    customs: [{ name: "بندر دورس", coords: [41.3236, 19.4547], workingHours: "24/7" }]
  },
  "MK": {
    name: "مقدونیه شمالی", nameEn: "North Macedonia",
    capital: { name: "اسکوپیه", coords: [41.9973, 21.4280] },
    continent: "europe",
    gdp: 14, gdpRank: 140, gdpPerCapita: 7000,
    inflation: 9.0, unemployment: 14.5, currency: "MKD", currencyName: "دینار",
    population: 2100000, populationDensity: 83, populationGrowth: 0.0,
    resources: {},
    exports: { total: 7, partners: [{ country: "DE", amount: 1.5, percent: 21 }, { country: "BG", amount: 1, percent: 14 }, { country: "IT", amount: 0.8, percent: 11 }, { country: "RS", amount: 0.7, percent: 10 }, { country: "GR", amount: 0.6, percent: 9 }], mainProducts: ["ماشین‌آلات", "پوشاک", "غذا"] },
    imports: { total: 8.5, partners: [{ country: "DE", amount: 1.8, percent: 21 }, { country: "UK", amount: 1, percent: 12 }, { country: "CN", amount: 0.9, percent: 11 }, { country: "RS", amount: 0.8, percent: 9 }, { country: "IT", amount: 0.7, percent: 8 }], mainProducts: ["ماشین‌آلات", "نفت", "الکترونیک"] },
    investmentRisk: 35, relations: { "BG": "green", "GR": "green", "AL": "green" },
    customs: [{ name: "گمرک اسکوپیه", coords: [41.9973, 21.4280], workingHours: "دوشنبه تا جمعه: 8:00-17:00" }]
  },
  "BA": {
    name: "بوسنی و هرزگوین", nameEn: "Bosnia and Herzegovina",
    capital: { name: "سارایوو", coords: [43.8563, 18.4131] },
    continent: "europe",
    gdp: 24, gdpRank: 116, gdpPerCapita: 7000,
    inflation: 1.2, unemployment: 15.4, currency: "BAM", currencyName: "مارک",
    population: 3200000, populationDensity: 63, populationGrowth: -0.6,
    resources: {},
    exports: { total: 7.5, partners: [{ country: "DE", amount: 1.5, percent: 20 }, { country: "IT", amount: 1.2, percent: 16 }, { country: "HR", amount: 1, percent: 13 }, { country: "RS", amount: 0.8, percent: 11 }, { country: "AT", amount: 0.6, percent: 8 }], mainProducts: ["ماشین‌آلات", "پوشاک", "چوب"] },
    imports: { total: 11, partners: [{ country: "DE", amount: 2, percent: 18 }, { country: "IT", amount: 1.5, percent: 14 }, { country: "CN", amount: 1.2, percent: 11 }, { country: "HR", amount: 1, percent: 9 }, { country: "RS", amount: 0.8, percent: 7 }], mainProducts: ["ماشین‌آلات", "نفت", "غذا"] },
    investmentRisk: 40, relations: { "HR": "green", "RS": "white", "ME": "green" },
    customs: [{ name: "گمرک سارایوو", coords: [43.8563, 18.4131], workingHours: "دوشنبه تا جمعه: 8:00-17:00" }]
  },
  "ME": {
    name: "مونته‌نگرو", nameEn: "Montenegro",
    capital: { name: "پودگوریتسا", coords: [42.4304, 19.2594] },
    continent: "europe",
    gdp: 6, gdpRank: 151, gdpPerCapita: 9000,
    inflation: 5.4, unemployment: 15.2, currency: "EUR", currencyName: "یورو",
    population: 620000, populationDensity: 46, populationGrowth: -0.1,
    resources: {},
    exports: { total: 0.8, partners: [{ country: "RS", amount: 0.2, percent: 25 }, { country: "IT", amount: 0.15, percent: 19 }, { country: "HR", amount: 0.12, percent: 15 }, { country: "BA", amount: 0.1, percent: 13 }, { country: "DE", amount: 0.08, percent: 10 }], mainProducts: ["آلومینیوم", "ماهی", "چوب"] },
    imports: { total: 2.5, partners: [{ country: "RS", amount: 0.5, percent: 20 }, { country: "CN", amount: 0.4, percent: 16 }, { country: "IT", amount: 0.3, percent: 12 }, { country: "DE", amount: 0.25, percent: 10 }, { country: "HR", amount: 0.2, percent: 8 }], mainProducts: ["ماشین‌آلات", "نفت", "غذا"] },
    investmentRisk: 35, relations: { "RS": "green", "BA": "green", "HR": "green" },
    customs: [{ name: "بندر بار", coords: [42.0944, 19.0944], workingHours: "24/7" }]
  },
  "XK": {
    name: "کوزوو", nameEn: "Kosovo",
    capital: { name: "پریشتینا", coords: [42.6629, 21.1655] },
    continent: "europe",
    gdp: 9, gdpRank: 144, gdpPerCapita: 5000,
    inflation: 2.6, unemployment: 17.3, currency: "EUR", currencyName: "یورو",
    population: 1900000, populationDensity: 175, populationGrowth: 0.2,
    resources: { lignite: { reserves: 1500, production: 8, unit: "mt", rank: 10 } },
    exports: { total: 0.6, partners: [{ country: "AL", amount: 0.15, percent: 25 }, { country: "IT", amount: 0.12, percent: 20 }, { country: "DE", amount: 0.1, percent: 17 }, { country: "RS", amount: 0.08, percent: 13 }, { country: "MK", amount: 0.06, percent: 10 }], mainProducts: ["پوشاک", "معدن", "میوه"] },
    imports: { total: 3.5, partners: [{ country: "RS", amount: 0.8, percent: 23 }, { country: "DE", amount: 0.6, percent: 17 }, { country: "CN", amount: 0.5, percent: 14 }, { country: "IT", amount: 0.4, percent: 11 }, { country: "AL", amount: 0.3, percent: 9 }], mainProducts: ["ماشین‌آلات", "نفت", "غذا"] },
    investmentRisk: 50, relations: { "AL": "green", "MK": "green", "RS": "orange" },
    customs: [{ name: "گمرک پریشتینا", coords: [42.6629, 21.1655], workingHours: "دوشنبه تا جمعه: 8:00-17:00" }]
  },
  "BY": {
    name: "بلاروس", nameEn: "Belarus",
    capital: { name: "مینسک", coords: [53.9045, 27.5615] },
    continent: "europe",
    gdp: 68, gdpRank: 78, gdpPerCapita: 7200,
    inflation: 5.8, unemployment: 0.3, currency: "BYN", currencyName: "روبل",
    population: 9400000, populationDensity: 46, populationGrowth: -0.3,
    resources: { potash: { reserves: 1000, production: 7, unit: "mt", rank: 3 } },
    exports: { total: 40, partners: [{ country: "RU", amount: 18, percent: 45 }, { country: "UA", amount: 4, percent: 10 }, { country: "PL", amount: 3, percent: 8 }, { country: "DE", amount: 2.5, percent: 6 }, { country: "CN", amount: 2, percent: 5 }], mainProducts: ["پتاس", "نفت", "ماشین‌آلات"] },
    imports: { total: 42, partners: [{ country: "RU", amount: 20, percent: 48 }, { country: "CN", amount: 4, percent: 10 }, { country: "DE", amount: 3, percent: 7 }, { country: "PL", amount: 2.5, percent: 6 }, { country: "UA", amount: 2, percent: 5 }], mainProducts: ["نفت", "ماشین‌آلات", "الکترونیک"] },
    investmentRisk: 70, relations: { "RU": "green", "UA": "orange", "PL": "orange" },
    customs: [{ name: "گمرک مینسک", coords: [53.9045, 27.5615], workingHours: "دوشنبه تا جمعه: 9:00-18:00" }]
  },
  "MD": {
    name: "مولداوی", nameEn: "Moldova",
    capital: { name: "کیشیناو", coords: [47.0104, 28.8638] },
    continent: "europe",
    gdp: 14, gdpRank: 141, gdpPerCapita: 5500,
    inflation: 14.0, unemployment: 2.4, currency: "MDL", currencyName: "لئو",
    population: 2600000, populationDensity: 123, populationGrowth: -0.2,
    resources: {},
    exports: { total: 4, partners: [{ country: "RO", amount: 1.2, percent: 30 }, { country: "RU", amount: 0.8, percent: 20 }, { country: "IT", amount: 0.5, percent: 13 }, { country: "DE", amount: 0.4, percent: 10 }, { country: "UA", amount: 0.3, percent: 8 }], mainProducts: ["شراب", "میوه", "پوشاک"] },
    imports: { total: 6.5, partners: [{ country: "RO", amount: 1.5, percent: 23 }, { country: "RU", amount: 1.2, percent: 18 }, { country: "CN", amount: 0.8, percent: 12 }, { country: "DE", amount: 0.6, percent: 9 }, { country: "UA", amount: 0.5, percent: 8 }], mainProducts: ["ماشین‌آلات", "نفت", "غذا"] },
    investmentRisk: 50, relations: { "RO": "green", "UA": "white", "RU": "orange" },
    customs: [{ name: "گمرک کیشیناو", coords: [47.0104, 28.8638], workingHours: "دوشنبه تا جمعه: 8:00-17:00" }]
  },
  "AD": {
    name: "آندورا", nameEn: "Andorra",
    capital: { name: "آندورا لا ولا", coords: [42.5063, 1.5218] },
    continent: "europe",
    gdp: 3.3, gdpRank: 162, gdpPerCapita: 42000,
    inflation: 1.0, unemployment: 2.0, currency: "EUR", currencyName: "یورو",
    population: 78000, populationDensity: 170, populationGrowth: 0.2,
    resources: {},
    exports: { total: 0.15, partners: [{ country: "ES", amount: 0.06, percent: 40 }, { country: "FR", amount: 0.05, percent: 33 }, { country: "DE", amount: 0.02, percent: 13 }, { country: "IT", amount: 0.01, percent: 7 }, { country: "US", amount: 0.008, percent: 5 }], mainProducts: ["توتون", "مبلمان"] },
    imports: { total: 1.5, partners: [{ country: "ES", amount: 0.6, percent: 40 }, { country: "FR", amount: 0.5, percent: 33 }, { country: "DE", amount: 0.2, percent: 13 }, { country: "IT", amount: 0.1, percent: 7 }, { country: "CN", amount: 0.08, percent: 5 }], mainProducts: ["غذا", "نفت", "ماشین‌آلات"] },
    investmentRisk: 10, relations: { "ES": "green", "FR": "green" },
    customs: [{ name: "گمرک آندورا", coords: [42.5063, 1.5218], workingHours: "دوشنبه تا جمعه: 9:00-17:00" }]
  },
  "MC": {
    name: "موناکو", nameEn: "Monaco",
    capital: { name: "موناکو", coords: [43.7384, 7.4246] },
    continent: "europe",
    gdp: 8.6, gdpRank: 146, gdpPerCapita: 234000,
    inflation: 1.5, unemployment: 2.0, currency: "EUR", currencyName: "یورو",
    population: 39000, populationDensity: 26337, populationGrowth: 0.2,
    resources: {},
    exports: { total: 1.2, partners: [{ country: "FR", amount: 0.5, percent: 42 }, { country: "IT", amount: 0.3, percent: 25 }, { country: "DE", amount: 0.15, percent: 13 }, { country: "ES", amount: 0.1, percent: 8 }, { country: "CH", amount: 0.08, percent: 7 }], mainProducts: ["دارو", "کالاهای لوکس"] },
    imports: { total: 1.5, partners: [{ country: "FR", amount: 0.6, percent: 40 }, { country: "IT", amount: 0.4, percent: 27 }, { country: "DE", amount: 0.2, percent: 13 }, { country: "ES", amount: 0.15, percent: 10 }, { country: "CH", amount: 0.1, percent: 7 }], mainProducts: ["غذا", "نفت", "ماشین‌آلات"] },
    investmentRisk: 5, relations: { "FR": "green", "IT": "green" },
    customs: [{ name: "بندر موناکو", coords: [43.7384, 7.4246], workingHours: "24/7" }]
  },
  "SM": {
    name: "سان مارینو", nameEn: "San Marino",
    capital: { name: "سان مارینو", coords: [43.9424, 12.4578] },
    continent: "europe",
    gdp: 1.7, gdpRank: 169, gdpPerCapita: 50000,
    inflation: 1.5, unemployment: 8.1, currency: "EUR", currencyName: "یورو",
    population: 34000, populationDensity: 566, populationGrowth: 0.2,
    resources: {},
    exports: { total: 0.3, partners: [{ country: "IT", amount: 0.15, percent: 50 }, { country: "DE", amount: 0.06, percent: 20 }, { country: "FR", amount: 0.04, percent: 13 }, { country: "US", amount: 0.03, percent: 10 }, { country: "ES", amount: 0.02, percent: 7 }], mainProducts: ["تمبر", "شراب", "پنیر"] },
    imports: { total: 0.4, partners: [{ country: "IT", amount: 0.2, percent: 50 }, { country: "DE", amount: 0.08, percent: 20 }, { country: "FR", amount: 0.05, percent: 13 }, { country: "CN", amount: 0.04, percent: 10 }, { country: "ES", amount: 0.03, percent: 8 }], mainProducts: ["غذا", "نفت", "ماشین‌آلات"] },
    investmentRisk: 10, relations: { "IT": "green", "VA": "green" },
    customs: [{ name: "گمرک سان مارینو", coords: [43.9424, 12.4578], workingHours: "دوشنبه تا جمعه: 9:00-17:00" }]
  },
  "LI": {
    name: "لیختن‌اشتاین", nameEn: "Liechtenstein",
    capital: { name: "فادوتس", coords: [47.1410, 9.5209] },
    continent: "europe",
    gdp: 6.2, gdpRank: 149, gdpPerCapita: 180000,
    inflation: 0.5, unemployment: 1.8, currency: "CHF", currencyName: "فرانک",
    population: 39000, populationDensity: 238, populationGrowth: 0.7,
    resources: {},
    exports: { total: 4.5, partners: [{ country: "CH", amount: 1.5, percent: 33 }, { country: "DE", amount: 1.2, percent: 27 }, { country: "US", amount: 0.6, percent: 13 }, { country: "AT", amount: 0.4, percent: 9 }, { country: "FR", amount: 0.3, percent: 7 }], mainProducts: ["ماشین‌آلات", "دندان", "الکترونیک"] },
    imports: { total: 2.5, partners: [{ country: "CH", amount: 0.8, percent: 32 }, { country: "DE", amount: 0.6, percent: 24 }, { country: "AT", amount: 0.3, percent: 12 }, { country: "IT", amount: 0.2, percent: 8 }, { country: "CN", amount: 0.15, percent: 6 }], mainProducts: ["ماشین‌آلات", "نفت", "غذا"] },
    investmentRisk: 5, relations: { "CH": "green", "AT": "green", "DE": "green" },
    customs: [{ name: "گمرک فادوتس", coords: [47.1410, 9.5209], workingHours: "دوشنبه تا جمعه: 8:00-17:00" }]
  },
  "VA": {
    name: "واتیکان", nameEn: "Vatican City",
    capital: { name: "واتیکان", coords: [41.9029, 12.4534] },
    continent: "europe",
    gdp: 0.5, gdpRank: 195, gdpPerCapita: 60000,
    inflation: 0.0, unemployment: 0.0, currency: "EUR", currencyName: "یورو",
    population: 800, populationDensity: 2000, populationGrowth: 0.0,
    resources: {},
    exports: { total: 0.01, partners: [{ country: "IT", amount: 0.005, percent: 50 }, { country: "FR", amount: 0.002, percent: 20 }, { country: "DE", amount: 0.001, percent: 10 }, { country: "US", amount: 0.001, percent: 10 }, { country: "ES", amount: 0.0005, percent: 5 }], mainProducts: ["تمبر", "سکه", "کتاب"] },
    imports: { total: 0.3, partners: [{ country: "IT", amount: 0.15, percent: 50 }, { country: "FR", amount: 0.06, percent: 20 }, { country: "DE", amount: 0.03, percent: 10 }, { country: "ES", amount: 0.02, percent: 7 }, { country: "CH", amount: 0.015, percent: 5 }], mainProducts: ["غذا", "نفت", "ماشین‌آلات"] },
    investmentRisk: 5, relations: { "IT": "green" },
    customs: [{ name: "گمرک واتیکان", coords: [41.9029, 12.4534], workingHours: "دوشنبه تا جمعه: 9:00-17:00" }]
  },
  "BS": {
    name: "باهاما", nameEn: "Bahamas",
    capital: { name: "ناسائو", coords: [25.0479, -77.3554] },
    continent: "north_america",
    gdp: 13, gdpRank: 143, gdpPerCapita: 33000,
    inflation: 1.0, unemployment: 10.1, currency: "BSD", currencyName: "دلار",
    population: 400000, populationDensity: 40, populationGrowth: 0.9,
    resources: {},
    exports: { total: 0.6, partners: [{ country: "US", amount: 0.3, percent: 50 }, { country: "CA", amount: 0.1, percent: 17 }, { country: "ES", amount: 0.08, percent: 13 }, { country: "FR", amount: 0.06, percent: 10 }, { country: "IT", amount: 0.04, percent: 7 }], mainProducts: ["ماهی", "نمک", "روم"] },
    imports: { total: 3.5, partners: [{ country: "US", amount: 1.5, percent: 43 }, { country: "CN", amount: 0.5, percent: 14 }, { country: "ES", amount: 0.3, percent: 9 }, { country: "IT", amount: 0.25, percent: 7 }, { country: "FR", amount: 0.2, percent: 6 }], mainProducts: ["غذا", "نفت", "ماشین‌آلات"] },
    investmentRisk: 25, relations: { "US": "green", "UK": "green", "CA": "green" },
    customs: [{ name: "بندر ناسائو", coords: [25.0479, -77.3554], workingHours: "24/7" }]
  },
  "BB": {
    name: "باربادوس", nameEn: "Barbados",
    capital: { name: "بریج‌تاون", coords: [13.0975, -59.6105] },
    continent: "north_america",
    gdp: 5.7, gdpRank: 155, gdpPerCapita: 20000,
    inflation: 4.0, unemployment: 10.0, currency: "BBD", currencyName: "دلار",
    population: 290000, populationDensity: 680, populationGrowth: 0.1,
    resources: {},
    exports: { total: 0.5, partners: [{ country: "US", amount: 0.2, percent: 40 }, { country: "TR", amount: 0.1, percent: 20 }, { country: "CA", amount: 0.08, percent: 16 }, { country: "UK", amount: 0.06, percent: 12 }, { country: "CN", amount: 0.04, percent: 8 }], mainProducts: ["شکر", "روم", "ماهی"] },
    imports: { total: 1.8, partners: [{ country: "US", amount: 0.6, percent: 33 }, { country: "TR", amount: 0.3, percent: 17 }, { country: "CN", amount: 0.25, percent: 14 }, { country: "CA", amount: 0.2, percent: 11 }, { country: "UK", amount: 0.15, percent: 8 }], mainProducts: ["غذا", "نفت", "ماشین‌آلات"] },
    investmentRisk: 30, relations: { "US": "green", "UK": "green", "CA": "green" },
    customs: [{ name: "بندر بریج‌تاون", coords: [13.0975, -59.6105], workingHours: "24/7" }]
  },
  "TT": {
    name: "ترینیداد و توباگو", nameEn: "Trinidad and Tobago",
    capital: { name: "پورت آو اسپین", coords: [10.6918, -61.2225] },
    continent: "north_america",
    gdp: 24, gdpRank: 117, gdpPerCapita: 17000,
    inflation: 5.3, unemployment: 3.5, currency: "TTD", currencyName: "دلار",
    population: 1400000, populationDensity: 274, populationGrowth: 0.2,
    resources: { oil: { reserves: 200, production: 60, unit: "mbbl", rank: 55 }, gas: { reserves: 300, production: 40, unit: "bcm", rank: 25 } },
    exports: { total: 8, partners: [{ country: "US", amount: 3, percent: 38 }, { country: "AR", amount: 0.8, percent: 10 }, { country: "CO", amount: 0.6, percent: 8 }, { country: "CN", amount: 0.5, percent: 6 }, { country: "ES", amount: 0.4, percent: 5 }], mainProducts: ["نفت", "گاز", "پتروشیمی"] },
    imports: { total: 7, partners: [{ country: "US", amount: 2.5, percent: 36 }, { country: "CN", amount: 1, percent: 14 }, { country: "CO", amount: 0.6, percent: 9 }, { country: "BR", amount: 0.5, percent: 7 }, { country: "ES", amount: 0.4, percent: 6 }], mainProducts: ["ماشین‌آلات", "نفت", "غذا"] },
    investmentRisk: 35, relations: { "US": "green", "VE": "white", "GY": "white" },
    customs: [{ name: "بندر پورت آو اسپین", coords: [10.6918, -61.2225], workingHours: "24/7" }]
  },
  "AG": {
    name: "آنتیگوا و باربودا", nameEn: "Antigua and Barbuda",
    capital: { name: "سنت جانز", coords: [17.1274, -61.8468] },
    continent: "north_america",
    gdp: 1.8, gdpRank: 168, gdpPerCapita: 18000,
    inflation: 1.0, unemployment: 11.0, currency: "XCD", currencyName: "دلار",
    population: 100000, populationDensity: 223, populationGrowth: 0.8,
    resources: {},
    exports: { total: 0.05, partners: [{ country: "PL", amount: 0.02, percent: 40 }, { country: "US", amount: 0.01, percent: 20 }, { country: "UK", amount: 0.008, percent: 16 }, { country: "CA", amount: 0.006, percent: 12 }, { country: "CN", amount: 0.004, percent: 8 }], mainProducts: ["ماهی", "پنبه"] },
    imports: { total: 0.6, partners: [{ country: "US", amount: 0.2, percent: 33 }, { country: "CN", amount: 0.15, percent: 25 }, { country: "PL", amount: 0.1, percent: 17 }, { country: "CA", amount: 0.08, percent: 13 }, { country: "UK", amount: 0.05, percent: 8 }], mainProducts: ["غذا", "نفت", "ماشین‌آلات"] },
    investmentRisk: 30, relations: { "US": "green", "UK": "green", "CA": "green" },
    customs: [{ name: "بندر سنت جانز", coords: [17.1274, -61.8468], workingHours: "24/7" }]
  },
  "GD": {
    name: "گرنادا", nameEn: "Grenada",
    capital: { name: "سنت جورجز", coords: [12.0560, -61.7488] },
    continent: "north_america",
    gdp: 1.3, gdpRank: 172, gdpPerCapita: 12000,
    inflation: 2.5, unemployment: 15.0, currency: "XCD", currencyName: "دلار",
    population: 110000, populationDensity: 320, populationGrowth: 0.4,
    resources: {},
    exports: { total: 0.05, partners: [{ country: "US", amount: 0.02, percent: 40 }, { country: "PL", amount: 0.01, percent: 20 }, { country: "CA", amount: 0.008, percent: 16 }, { country: "UK", amount: 0.006, percent: 12 }, { country: "CN", amount: 0.004, percent: 8 }], mainProducts: ["جوز هندی", "موز", "کاکائو"] },
    imports: { total: 0.4, partners: [{ country: "US", amount: 0.15, percent: 38 }, { country: "CN", amount: 0.1, percent: 25 }, { country: "PL", amount: 0.06, percent: 15 }, { country: "CA", amount: 0.05, percent: 13 }, { country: "UK", amount: 0.03, percent: 8 }], mainProducts: ["غذا", "نفت", "ماشین‌آلات"] },
    investmentRisk: 35, relations: { "US": "green", "UK": "green", "CA": "green" },
    customs: [{ name: "بندر سنت جورجز", coords: [12.0560, -61.7488], workingHours: "24/7" }]
  },
  "LC": {
    name: "سنت لوسیا", nameEn: "Saint Lucia",
    capital: { name: "کاستریس", coords: [14.0101, -60.9875] },
    continent: "north_america",
    gdp: 2.2, gdpRank: 165, gdpPerCapita: 12000,
    inflation: 2.5, unemployment: 16.8, currency: "XCD", currencyName: "دلار",
    population: 180000, populationDensity: 300, populationGrowth: 0.3,
    resources: {},
    exports: { total: 0.2, partners: [{ country: "US", amount: 0.08, percent: 40 }, { country: "PL", amount: 0.04, percent: 20 }, { country: "CA", amount: 0.03, percent: 15 }, { country: "UK", amount: 0.025, percent: 13 }, { country: "CN", amount: 0.015, percent: 8 }], mainProducts: ["موز", "کاکائو", "ماهی"] },
    imports: { total: 0.6, partners: [{ country: "US", amount: 0.2, percent: 33 }, { country: "CN", amount: 0.15, percent: 25 }, { country: "PL", amount: 0.1, percent: 17 }, { country: "CA", amount: 0.08, percent: 13 }, { country: "UK", amount: 0.05, percent: 8 }], mainProducts: ["غذا", "نفت", "ماشین‌آلات"] },
    investmentRisk: 30, relations: { "US": "green", "UK": "green", "CA": "green" },
    customs: [{ name: "بندر کاستریس", coords: [14.0101, -60.9875], workingHours: "24/7" }]
  },
  "VC": {
    name: "سنت وینسنت و گرنادین‌ها", nameEn: "Saint Vincent and the Grenadines",
    capital: { name: "کینگستاون", coords: [13.1600, -61.2249] },
    continent: "north_america",
    gdp: 0.9, gdpRank: 174, gdpPerCapita: 8000,
    inflation: 1.0, unemployment: 18.8, currency: "XCD", currencyName: "دلار",
    population: 110000, populationDensity: 283, populationGrowth: 0.1,
    resources: {},
    exports: { total: 0.05, partners: [{ country: "PL", amount: 0.02, percent: 40 }, { country: "US", amount: 0.01, percent: 20 }, { country: "CA", amount: 0.008, percent: 16 }, { country: "UK", amount: 0.006, percent: 12 }, { country: "CN", amount: 0.004, percent: 8 }], mainProducts: ["موز", "جوز هندی", "ماهی"] },
    imports: { total: 0.4, partners: [{ country: "US", amount: 0.15, percent: 38 }, { country: "CN", amount: 0.1, percent: 25 }, { country: "PL", amount: 0.06, percent: 15 }, { country: "CA", amount: 0.05, percent: 13 }, { country: "UK", amount: 0.03, percent: 8 }], mainProducts: ["غذا", "نفت", "ماشین‌آلات"] },
    investmentRisk: 35, relations: { "US": "green", "UK": "green", "CA": "green" },
    customs: [{ name: "بندر کینگستاون", coords: [13.1600, -61.2249], workingHours: "24/7" }]
  },
  "KN": {
    name: "سنت کیتس و نویس", nameEn: "Saint Kitts and Nevis",
    capital: { name: "باستر", coords: [17.3026, -62.7177] },
    continent: "north_america",
    gdp: 1.1, gdpRank: 173, gdpPerCapita: 19000,
    inflation: 1.0, unemployment: 4.5, currency: "XCD", currencyName: "دلار",
    population: 50000, populationDensity: 200, populationGrowth: 0.6,
    resources: {},
    exports: { total: 0.05, partners: [{ country: "US", amount: 0.02, percent: 40 }, { country: "PL", amount: 0.01, percent: 20 }, { country: "CA", amount: 0.008, percent: 16 }, { country: "UK", amount: 0.006, percent: 12 }, { country: "CN", amount: 0.004, percent: 8 }], mainProducts: ["شکر", "ماهی"] },
    imports: { total: 0.3, partners: [{ country: "US", amount: 0.12, percent: 40 }, { country: "CN", amount: 0.08, percent: 27 }, { country: "PL", amount: 0.05, percent: 17 }, { country: "CA", amount: 0.04, percent: 13 }, { country: "UK", amount: 0.025, percent: 8 }], mainProducts: ["غذا", "نفت", "ماشین‌آلات"] },
    investmentRisk: 30, relations: { "US": "green", "UK": "green", "CA": "green" },
    customs: [{ name: "بندر باستر", coords: [17.3026, -62.7177], workingHours: "24/7" }]
  },
  "DM": {
    name: "دومینیکا", nameEn: "Dominica",
    capital: { name: "روزو", coords: [15.3092, -61.3790] },
    continent: "north_america",
    gdp: 0.6, gdpRank: 177, gdpPerCapita: 8000,
    inflation: 1.0, unemployment: 23.0, currency: "XCD", currencyName: "دلار",
    population: 72000, populationDensity: 96, populationGrowth: 0.2,
    resources: {},
    exports: { total: 0.05, partners: [{ country: "JP", amount: 0.02, percent: 40 }, { country: "US", amount: 0.01, percent: 20 }, { country: "CA", amount: 0.008, percent: 16 }, { country: "UK", amount: 0.006, percent: 12 }, { country: "CN", amount: 0.004, percent: 8 }], mainProducts: ["موز", "صابون", "میوه"] },
    imports: { total: 0.3, partners: [{ country: "US", amount: 0.12, percent: 40 }, { country: "CN", amount: 0.08, percent: 27 }, { country: "CA", amount: 0.05, percent: 17 }, { country: "UK", amount: 0.04, percent: 13 }, { country: "TR", amount: 0.03, percent: 10 }], mainProducts: ["غذا", "نفت", "ماشین‌آلات"] },
    investmentRisk: 35, relations: { "US": "green", "UK": "green", "CA": "green" },
    customs: [{ name: "بندر روزو", coords: [15.3092, -61.3790], workingHours: "24/7" }]
  },
  "BZ": {
    name: "بلیز", nameEn: "Belize",
    capital: { name: "بلموپان", coords: [17.2510, -88.7590] },
    continent: "north_america",
    gdp: 2.8, gdpRank: 163, gdpPerCapita: 6800,
    inflation: 3.0, unemployment: 3.0, currency: "BZD", currencyName: "دلار",
    population: 410000, populationDensity: 18, populationGrowth: 1.9,
    resources: {},
    exports: { total: 0.6, partners: [{ country: "US", amount: 0.25, percent: 42 }, { country: "UK", amount: 0.1, percent: 17 }, { country: "GT", amount: 0.08, percent: 13 }, { country: "MX", amount: 0.06, percent: 10 }, { country: "CR", amount: 0.04, percent: 7 }], mainProducts: ["شکر", "موز", "ماهی"] },
    imports: { total: 1.2, partners: [{ country: "US", amount: 0.5, percent: 42 }, { country: "MX", amount: 0.2, percent: 17 }, { country: "CN", amount: 0.15, percent: 13 }, { country: "GT", amount: 0.1, percent: 8 }, { country: "CR", amount: 0.08, percent: 7 }], mainProducts: ["ماشین‌آلات", "نفت", "غذا"] },
    investmentRisk: 30, relations: { "US": "green", "UK": "green", "GT": "white" },
    customs: [{ name: "بندر بلیز", coords: [17.4950, -88.2019], workingHours: "24/7" }]
  },
  "SR": {
    name: "سورینام", nameEn: "Suriname",
    capital: { name: "پاراماریبو", coords: [5.8520, -55.2038] },
    continent: "south_america",
    gdp: 3, gdpRank: 161, gdpPerCapita: 5500,
    inflation: 55.0, unemployment: 8.7, currency: "SRD", currencyName: "دلار",
    population: 600000, populationDensity: 4, populationGrowth: 0.9,
    resources: { gold: { reserves: 200, production: 30, unit: "tons", rank: 20 }, bauxite: { reserves: 580, production: 3, unit: "mt", rank: 8 } },
    exports: { total: 2.5, partners: [{ country: "CH", amount: 0.8, percent: 32 }, { country: "AE", amount: 0.5, percent: 20 }, { country: "US", amount: 0.4, percent: 16 }, { country: "BE", amount: 0.3, percent: 12 }, { country: "NL", amount: 0.25, percent: 10 }], mainProducts: ["طلا", "باکسیت", "نفت"] },
    imports: { total: 1.8, partners: [{ country: "US", amount: 0.5, percent: 28 }, { country: "NL", amount: 0.4, percent: 22 }, { country: "CN", amount: 0.3, percent: 17 }, { country: "TR", amount: 0.2, percent: 11 }, { country: "BR", amount: 0.15, percent: 8 }], mainProducts: ["ماشین‌آلات", "نفت", "غذا"] },
    investmentRisk: 50, relations: { "NL": "green", "GY": "white", "BR": "white" },
    customs: [{ name: "بندر پاراماریبو", coords: [5.8520, -55.2038], workingHours: "24/7" }]
  },
  "GF": {
    name: "گویان فرانسه", nameEn: "French Guiana",
    capital: { name: "کاین", coords: [4.9224, -52.3135] },
    continent: "south_america",
    gdp: 5, gdpRank: 150, gdpPerCapita: 18000,
    inflation: 2.0, unemployment: 19.0, currency: "EUR", currencyName: "یورو",
    population: 300000, populationDensity: 4, populationGrowth: 2.2,
    resources: { gold: { reserves: 50, production: 2, unit: "tons", rank: 45 } },
    exports: { total: 0.3, partners: [{ country: "FR", amount: 0.15, percent: 50 }, { country: "US", amount: 0.05, percent: 17 }, { country: "SR", amount: 0.03, percent: 10 }, { country: "BR", amount: 0.025, percent: 8 }, { country: "GY", amount: 0.02, percent: 7 }], mainProducts: ["طلا", "میگو", "چوب"] },
    imports: { total: 1.5, partners: [{ country: "FR", amount: 0.6, percent: 40 }, { country: "US", amount: 0.3, percent: 20 }, { country: "SR", amount: 0.15, percent: 10 }, { country: "BR", amount: 0.12, percent: 8 }, { country: "CN", amount: 0.1, percent: 7 }], mainProducts: ["غذا", "نفت", "ماشین‌آلات"] },
    investmentRisk: 30, relations: { "FR": "green", "SR": "white", "BR": "white" },
    customs: [{ name: "بندر کاین", coords: [4.9224, -52.3135], workingHours: "24/7" }]
  },
  "BN": {
    name: "برونئی", nameEn: "Brunei",
    capital: { name: "بندر سری بگاوان", coords: [4.9031, 114.9398] },
    continent: "asia",
    gdp: 15, gdpRank: 111, gdpPerCapita: 32000,
    inflation: 1.0, unemployment: 6.8, currency: "BND", currencyName: "دلار",
    population: 450000, populationDensity: 83, populationGrowth: 0.8,
    resources: { oil: { reserves: 1100, production: 120, unit: "mbbl", rank: 40 }, gas: { reserves: 300, production: 12, unit: "bcm", rank: 30 } },
    exports: { total: 8, partners: [{ country: "JP", amount: 2.5, percent: 31 }, { country: "AU", amount: 1.5, percent: 19 }, { country: "CN", amount: 1.2, percent: 15 }, { country: "IN", amount: 0.8, percent: 10 }, { country: "MY", amount: 0.6, percent: 8 }], mainProducts: ["نفت", "گاز", "پتروشیمی"] },
    imports: { total: 4, partners: [{ country: "CN", amount: 1, percent: 25 }, { country: "MY", amount: 0.6, percent: 15 }, { country: "SG", amount: 0.5, percent: 13 }, { country: "US", amount: 0.4, percent: 10 }, { country: "JP", amount: 0.3, percent: 8 }], mainProducts: ["ماشین‌آلات", "خودرو", "الکترونیک"] },
    investmentRisk: 20, relations: { "MY": "green", "SG": "green", "ID": "white" },
    customs: [{ name: "بندر سری بگاوان", coords: [4.9031, 114.9398], workingHours: "24/7" }]
  },
  "MV": {
    name: "مالدیو", nameEn: "Maldives",
    capital: { name: "ماله", coords: [4.1755, 73.5093] },
    continent: "asia",
    gdp: 6, gdpRank: 153, gdpPerCapita: 11000,
    inflation: 2.3, unemployment: 5.0, currency: "MVR", currencyName: "روفیا",
    population: 550000, populationDensity: 1800, populationGrowth: 0.2,
    resources: {},
    exports: { total: 0.5, partners: [{ country: "TH", amount: 0.15, percent: 30 }, { country: "FR", amount: 0.1, percent: 20 }, { country: "US", amount: 0.08, percent: 16 }, { country: "IN", amount: 0.06, percent: 12 }, { country: "SG", amount: 0.04, percent: 8 }], mainProducts: ["ماهی", "پوشاک"] },
    imports: { total: 2, partners: [{ country: "IN", amount: 0.5, percent: 25 }, { country: "CN", amount: 0.4, percent: 20 }, { country: "SG", amount: 0.3, percent: 15 }, { country: "AE", amount: 0.25, percent: 13 }, { country: "TH", amount: 0.2, percent: 10 }], mainProducts: ["غذا", "نفت", "ماشین‌آلات"] },
    investmentRisk: 30, relations: { "IN": "green", "LK": "green", "CN": "green" },
    customs: [{ name: "بندر ماله", coords: [4.1755, 73.5093], workingHours: "24/7" }]
  },
  "LA": {
    name: "لائوس", nameEn: "Laos",
    capital: { name: "ویانتیان", coords: [17.9757, 102.6331] },
    continent: "asia",
    gdp: 15, gdpRank: 135, gdpPerCapita: 2500,
    inflation: 3.0, unemployment: 0.7, currency: "LAK", currencyName: "کیپ",
    population: 7500000, populationDensity: 32, populationGrowth: 1.4,
    resources: { hydro: { reserves: 26000, production: 5000, unit: "MW", rank: 10 }, copper: { reserves: 5000, production: 100, unit: "kt", rank: 15 } },
    exports: { total: 6, partners: [{ country: "TH", amount: 2, percent: 33 }, { country: "CN", amount: 1.5, percent: 25 }, { country: "VN", amount: 1, percent: 17 }, { country: "MY", amount: 0.5, percent: 8 }, { country: "JP", amount: 0.4, percent: 7 }], mainProducts: ["برق", "مس", "چوب"] },
    imports: { total: 5.5, partners: [{ country: "TH", amount: 2, percent: 36 }, { country: "CN", amount: 1.5, percent: 27 }, { country: "VN", amount: 0.8, percent: 15 }, { country: "MY", amount: 0.5, percent: 9 }, { country: "JP", amount: 0.4, percent: 7 }], mainProducts: ["ماشین‌آلات", "نفت", "غذا"] },
    investmentRisk: 45, relations: { "TH": "green", "VN": "green", "CN": "green" },
    customs: [{ name: "گمرک ویانتیان", coords: [17.9757, 102.6331], workingHours: "دوشنبه تا جمعه: 8:00-17:00" }]
  },
  "KH": {
    name: "کامبوج", nameEn: "Cambodia",
    capital: { name: "پنوم‌پن", coords: [11.5564, 104.9282] },
    continent: "asia",
    gdp: 29, gdpRank: 110, gdpPerCapita: 1700,
    inflation: 2.9, unemployment: 0.3, currency: "KHR", currencyName: "ریل",
    population: 17000000, populationDensity: 96, populationGrowth: 1.3,
    resources: {},
    exports: { total: 19, partners: [{ country: "US", amount: 8, percent: 42 }, { country: "CN", amount: 3, percent: 16 }, { country: "GB", amount: 2, percent: 11 }, { country: "JP", amount: 1.5, percent: 8 }, { country: "VN", amount: 1.2, percent: 6 }], mainProducts: ["پوشاک", "ماهی", "برنج"] },
    imports: { total: 25, partners: [{ country: "CN", amount: 8, percent: 32 }, { country: "TH", amount: 4, percent: 16 }, { country: "VN", amount: 3, percent: 12 }, { country: "SG", amount: 2, percent: 8 }, { country: "JP", amount: 1.5, percent: 6 }], mainProducts: ["ماشین‌آلات", "نفت", "الکترونیک"] },
    investmentRisk: 40, relations: { "VN": "green", "TH": "green", "LA": "green" },
    customs: [{ name: "بندر سیانوكویل", coords: [10.6093, 103.5296], workingHours: "24/7" }]
  },
  "PSE": {
    name: "فلسطین", nameEn: "Palestine",
    capital: { name: "رام‌الله", coords: [31.9073, 35.2043] },
    continent: "asia",
    gdp: 18, gdpRank: 130, gdpPerCapita: 3600,
    inflation: 3.7, unemployment: 26.0, currency: "ILS", currencyName: "شکل",
    population: 5200000, populationDensity: 847, populationGrowth: 2.4,
    resources: {},
    exports: { total: 0.8, partners: [{ country: "IL", amount: 0.4, percent: 50 }, { country: "JO", amount: 0.15, percent: 19 }, { country: "AE", amount: 0.1, percent: 13 }, { country: "SA", amount: 0.08, percent: 10 }, { country: "TR", amount: 0.05, percent: 6 }], mainProducts: ["سنگ", "زیتون", "پوشاک"] },
    imports: { total: 6, partners: [{ country: "IL", amount: 3, percent: 50 }, { country: "TR", amount: 0.8, percent: 13 }, { country: "CN", amount: 0.6, percent: 10 }, { country: "JO", amount: 0.5, percent: 8 }, { country: "AE", amount: 0.4, percent: 7 }], mainProducts: ["غذا", "نفت", "ماشین‌آلات"] },
    investmentRisk: 90, relations: { "IL": "red", "JO": "green", "EG": "green" },
    customs: [{ name: "گمرک رام‌الله", coords: [31.9073, 35.2043], workingHours: "یکشنبه تا پنجشنبه: 8:00-16:00" }]
  },
  "TL": {
    name: "تیمور شرقی", nameEn: "Timor-Leste",
    capital: { name: "دیلی", coords: [-8.5569, 125.5603] },
    continent: "asia",
    gdp: 3, gdpRank: 156, gdpPerCapita: 2000,
    inflation: 0.9, unemployment: 4.4, currency: "USD", currencyName: "دلار",
    population: 1300000, populationDensity: 88, populationGrowth: 1.8,
    resources: { oil: { reserves: 0, production: 0, unit: "mbbl", rank: 0 }, gas: { reserves: 0, production: 0, unit: "bcm", rank: 0 } },
    exports: { total: 0.2, partners: [{ country: "SG", amount: 0.08, percent: 40 }, { country: "US", amount: 0.04, percent: 20 }, { country: "DE", amount: 0.03, percent: 15 }, { country: "AU", amount: 0.025, percent: 13 }, { country: "JP", amount: 0.015, percent: 8 }], mainProducts: ["نفت", "قهوه", "ساندالوود"] },
    imports: { total: 0.8, partners: [{ country: "SG", amount: 0.3, percent: 38 }, { country: "CN", amount: 0.2, percent: 25 }, { country: "ID", amount: 0.15, percent: 19 }, { country: "AU", amount: 0.1, percent: 13 }, { country: "MY", amount: 0.05, percent: 6 }], mainProducts: ["غذا", "نفت", "ماشین‌آلات"] },
    investmentRisk: 50, relations: { "ID": "white", "AU": "green", "PT": "green" },
    customs: [{ name: "بندر دیلی", coords: [-8.5569, 125.5603], workingHours: "24/7" }]
  },
  "MH": {
    name: "جزایر مارشال", nameEn: "Marshall Islands",
    capital: { name: "ماجورو", coords: [7.1164, 171.1853] },
    continent: "oceania",
    gdp: 0.25, gdpRank: 188, gdpPerCapita: 4000,
    inflation: 0.5, unemployment: 36.0, currency: "USD", currencyName: "دلار",
    population: 60000, populationDensity: 332, populationGrowth: 1.4,
    resources: {},
    exports: { total: 0.05, partners: [{ country: "US", amount: 0.02, percent: 40 }, { country: "JP", amount: 0.01, percent: 20 }, { country: "AU", amount: 0.008, percent: 16 }, { country: "CN", amount: 0.006, percent: 12 }, { country: "KR", amount: 0.004, percent: 8 }], mainProducts: ["ماهی", "نارگیل"] },
    imports: { total: 0.15, partners: [{ country: "US", amount: 0.06, percent: 40 }, { country: "JP", amount: 0.03, percent: 20 }, { country: "CN", amount: 0.025, percent: 17 }, { country: "AU", amount: 0.02, percent: 13 }, { country: "KR", amount: 0.01, percent: 7 }], mainProducts: ["غذا", "نفت", "ماشین‌آلات"] },
    investmentRisk: 40, relations: { "US": "green", "AU": "green", "NZ": "green" },
    customs: [{ name: "بندر ماجورو", coords: [7.1164, 171.1853], workingHours: "24/7" }]
  },
  "FM": {
    name: "میکرونزی", nameEn: "Micronesia",
    capital: { name: "پالیکیر", coords: [6.9248, 158.1610] },
    continent: "oceania",
    gdp: 0.4, gdpRank: 186, gdpPerCapita: 3500,
    inflation: 0.5, unemployment: 16.2, currency: "USD", currencyName: "دلار",
    population: 115000, populationDensity: 164, populationGrowth: 0.9,
    resources: {},
    exports: { total: 0.05, partners: [{ country: "US", amount: 0.02, percent: 40 }, { country: "JP", amount: 0.01, percent: 20 }, { country: "AU", amount: 0.008, percent: 16 }, { country: "CN", amount: 0.006, percent: 12 }, { country: "KR", amount: 0.004, percent: 8 }], mainProducts: ["ماهی", "میوه"] },
    imports: { total: 0.2, partners: [{ country: "US", amount: 0.08, percent: 40 }, { country: "JP", amount: 0.04, percent: 20 }, { country: "CN", amount: 0.03, percent: 15 }, { country: "AU", amount: 0.025, percent: 13 }, { country: "KR", amount: 0.015, percent: 8 }], mainProducts: ["غذا", "نفت", "ماشین‌آلات"] },
    investmentRisk: 40, relations: { "US": "green", "AU": "green", "NZ": "green" },
    customs: [{ name: "بندر پالیکیر", coords: [6.9248, 158.1610], workingHours: "24/7" }]
  },
  "PW": {
    name: "پالائو", nameEn: "Palau",
    capital: { name: "نگرولمود", coords: [7.5150, 134.5825] },
    continent: "oceania",
    gdp: 0.3, gdpRank: 187, gdpPerCapita: 16000,
    inflation: 2.4, unemployment: 1.7, currency: "USD", currencyName: "دلار",
    population: 18000, populationDensity: 39, populationGrowth: 0.4,
    resources: {},
    exports: { total: 0.02, partners: [{ country: "JP", amount: 0.01, percent: 50 }, { country: "US", amount: 0.005, percent: 25 }, { country: "AU", amount: 0.003, percent: 15 }, { country: "CN", amount: 0.001, percent: 5 }, { country: "KR", amount: 0.0005, percent: 3 }], mainProducts: ["ماهی", "نارگیل"] },
    imports: { total: 0.2, partners: [{ country: "US", amount: 0.08, percent: 40 }, { country: "JP", amount: 0.04, percent: 20 }, { country: "CN", amount: 0.03, percent: 15 }, { country: "AU", amount: 0.025, percent: 13 }, { country: "KR", amount: 0.015, percent: 8 }], mainProducts: ["غذا", "نفت", "ماشین‌آلات"] },
    investmentRisk: 30, relations: { "US": "green", "JP": "green", "AU": "green" },
    customs: [{ name: "بندر نگرولمود", coords: [7.5150, 134.5825], workingHours: "24/7" }]
  },
  "NR": {
    name: "نائورو", nameEn: "Nauru",
    capital: { name: "یارن", coords: [-0.5228, 166.9315] },
    continent: "oceania",
    gdp: 0.15, gdpRank: 192, gdpPerCapita: 12000,
    inflation: 0.5, unemployment: 23.0, currency: "AUD", currencyName: "دلار",
    population: 11000, populationDensity: 550, populationGrowth: 0.5,
    resources: { phosphate: { reserves: 0, production: 0, unit: "mt", rank: 0 } },
    exports: { total: 0.01, partners: [{ country: "AU", amount: 0.005, percent: 50 }, { country: "NZ", amount: 0.003, percent: 30 }, { country: "JP", amount: 0.001, percent: 10 }, { country: "KR", amount: 0.0005, percent: 5 }, { country: "CN", amount: 0.0003, percent: 3 }], mainProducts: ["فسفات", "ماهی"] },
    imports: { total: 0.1, partners: [{ country: "AU", amount: 0.04, percent: 40 }, { country: "NZ", amount: 0.03, percent: 30 }, { country: "CN", amount: 0.015, percent: 15 }, { country: "JP", amount: 0.01, percent: 10 }, { country: "KR", amount: 0.005, percent: 5 }], mainProducts: ["غذا", "نفت", "ماشین‌آلات"] },
    investmentRisk: 40, relations: { "AU": "green", "NZ": "green", "FJ": "white" },
    customs: [{ name: "بندر یارن", coords: [-0.5228, 166.9315], workingHours: "24/7" }]
  },
  "TV": {
    name: "تووالو", nameEn: "Tuvalu",
    capital: { name: "فونافوتی", coords: [-8.5200, 179.1983] },
    continent: "oceania",
    gdp: 0.06, gdpRank: 194, gdpPerCapita: 5000,
    inflation: 3.0, unemployment: 0.0, currency: "AUD", currencyName: "دلار",
    population: 12000, populationDensity: 436, populationGrowth: 0.9,
    resources: {},
    exports: { total: 0.005, partners: [{ country: "AU", amount: 0.002, percent: 40 }, { country: "NZ", amount: 0.0015, percent: 30 }, { country: "FJ", amount: 0.001, percent: 20 }, { country: "JP", amount: 0.0005, percent: 10 }], mainProducts: ["ماهی", "نارگیل"] },
    imports: { total: 0.03, partners: [{ country: "AU", amount: 0.012, percent: 40 }, { country: "NZ", amount: 0.009, percent: 30 }, { country: "FJ", amount: 0.006, percent: 20 }, { country: "CN", amount: 0.002, percent: 7 }, { country: "JP", amount: 0.001, percent: 3 }], mainProducts: ["غذا", "نفت", "ماشین‌آلات"] },
    investmentRisk: 35, relations: { "AU": "green", "NZ": "green", "FJ": "green" },
    customs: [{ name: "بندر فونافوتی", coords: [-8.5200, 179.1983], workingHours: "24/7" }]
  },
  "KI": {
    name: "کیریباتی", nameEn: "Kiribati",
    capital: { name: "تاراوا", coords: [1.3382, 173.0176] },
    continent: "oceania",
    gdp: 0.2, gdpRank: 189, gdpPerCapita: 1500,
    inflation: 0.6, unemployment: 30.6, currency: "AUD", currencyName: "دلار",
    population: 120000, populationDensity: 152, populationGrowth: 1.1,
    resources: {},
    exports: { total: 0.02, partners: [{ country: "AU", amount: 0.008, percent: 40 }, { country: "NZ", amount: 0.006, percent: 30 }, { country: "FJ", amount: 0.004, percent: 20 }, { country: "JP", amount: 0.001, percent: 5 }, { country: "CN", amount: 0.0005, percent: 3 }], mainProducts: ["ماهی", "نارگیل"] },
    imports: { total: 0.15, partners: [{ country: "AU", amount: 0.06, percent: 40 }, { country: "NZ", amount: 0.045, percent: 30 }, { country: "FJ", amount: 0.03, percent: 20 }, { country: "CN", amount: 0.01, percent: 7 }, { country: "JP", amount: 0.005, percent: 3 }], mainProducts: ["غذا", "نفت", "ماشین‌آلات"] },
    investmentRisk: 40, relations: { "AU": "green", "NZ": "green", "FJ": "white" },
    customs: [{ name: "بندر تاراوا", coords: [1.3382, 173.0176], workingHours: "24/7" }]
  },
  "WS": {
    name: "ساموآ", nameEn: "Samoa",
    capital: { name: "آپیا", coords: [-13.7590, -172.1046] },
    continent: "oceania",
    gdp: 0.8, gdpRank: 180, gdpPerCapita: 4000,
    inflation: 3.0, unemployment: 5.2, currency: "WST", currencyName: "تالا",
    population: 200000, populationDensity: 70, populationGrowth: 0.6,
    resources: {},
    exports: { total: 0.05, partners: [{ country: "AU", amount: 0.02, percent: 40 }, { country: "NZ", amount: 0.015, percent: 30 }, { country: "US", amount: 0.008, percent: 16 }, { country: "JP", amount: 0.004, percent: 8 }, { country: "CN", amount: 0.002, percent: 4 }], mainProducts: ["ماهی", "نارگیل", "کاکائو"] },
    imports: { total: 0.3, partners: [{ country: "NZ", amount: 0.12, percent: 40 }, { country: "AU", amount: 0.09, percent: 30 }, { country: "CN", amount: 0.045, percent: 15 }, { country: "US", amount: 0.03, percent: 10 }, { country: "SG", amount: 0.015, percent: 5 }], mainProducts: ["غذا", "نفت", "ماشین‌آلات"] },
    investmentRisk: 35, relations: { "NZ": "green", "AU": "green", "US": "green" },
    customs: [{ name: "بندر آپیا", coords: [-13.7590, -172.1046], workingHours: "24/7" }]
  },
  "TO": {
    name: "تونگا", nameEn: "Tonga",
    capital: { name: "نوکوالوفا", coords: [-21.1393, -175.2018] },
    continent: "oceania",
    gdp: 0.5, gdpRank: 185, gdpPerCapita: 5000,
    inflation: 7.4, unemployment: 1.1, currency: "TOP", currencyName: "پاآنگا",
    population: 100000, populationDensity: 139, populationGrowth: 0.8,
    resources: {},
    exports: { total: 0.03, partners: [{ country: "NZ", amount: 0.012, percent: 40 }, { country: "AU", amount: 0.009, percent: 30 }, { country: "US", amount: 0.005, percent: 17 }, { country: "JP", amount: 0.002, percent: 7 }, { country: "CN", amount: 0.001, percent: 3 }], mainProducts: ["ماهی", "وانیل", "کدو"] },
    imports: { total: 0.2, partners: [{ country: "NZ", amount: 0.08, percent: 40 }, { country: "AU", amount: 0.06, percent: 30 }, { country: "CN", amount: 0.03, percent: 15 }, { country: "US", amount: 0.02, percent: 10 }, { country: "FJ", amount: 0.01, percent: 5 }], mainProducts: ["غذا", "نفت", "ماشین‌آلات"] },
    investmentRisk: 35, relations: { "NZ": "green", "AU": "green", "FJ": "green" },
    customs: [{ name: "بندر نوکوالوفا", coords: [-21.1393, -175.2018], workingHours: "24/7" }]
  },
  "ST": {
    name: "سائوتومه و پرنسیپ", nameEn: "São Tomé and Príncipe",
    capital: { name: "سائوتومه", coords: [0.1864, 6.6131] },
    continent: "africa",
    gdp: 0.5, gdpRank: 184, gdpPerCapita: 2200,
    inflation: 8.0, unemployment: 12.2, currency: "STN", currencyName: "دوبرا",
    population: 220000, populationDensity: 228, populationGrowth: 1.9,
    resources: {},
    exports: { total: 0.05, partners: [{ country: "NL", amount: 0.02, percent: 40 }, { country: "PT", amount: 0.015, percent: 30 }, { country: "BE", amount: 0.008, percent: 16 }, { country: "CN", amount: 0.004, percent: 8 }, { country: "FR", amount: 0.003, percent: 6 }], mainProducts: ["کاکائو", "قهوه", "نارگیل"] },
    imports: { total: 0.15, partners: [{ country: "PT", amount: 0.06, percent: 40 }, { country: "CN", amount: 0.03, percent: 20 }, { country: "NL", amount: 0.02, percent: 13 }, { country: "BE", amount: 0.015, percent: 10 }, { country: "FR", amount: 0.01, percent: 7 }], mainProducts: ["غذا", "نفت", "ماشین‌آلات"] },
    investmentRisk: 45, relations: { "PT": "green", "GA": "white", "GQ": "white" },
    customs: [{ name: "بندر سائوتومه", coords: [0.1864, 6.6131], workingHours: "24/7" }]
  },
  "SC": {
    name: "سیشل", nameEn: "Seychelles",
    capital: { name: "ویکتوریا", coords: [-4.6191, 55.4513] },
    continent: "africa",
    gdp: 1.6, gdpRank: 166, gdpPerCapita: 15000,
    inflation: 2.0, unemployment: 3.0, currency: "SCR", currencyName: "روپیه",
    population: 100000, populationDensity: 214, populationGrowth: 0.6,
    resources: {},
    exports: { total: 0.6, partners: [{ country: "FR", amount: 0.2, percent: 33 }, { country: "UK", amount: 0.15, percent: 25 }, { country: "IT", amount: 0.1, percent: 17 }, { country: "DE", amount: 0.08, percent: 13 }, { country: "US", amount: 0.05, percent: 8 }], mainProducts: ["ماهی", "وانیل", "کاکائو"] },
    imports: { total: 1.2, partners: [{ country: "AE", amount: 0.3, percent: 25 }, { country: "FR", amount: 0.25, percent: 21 }, { country: "CN", amount: 0.2, percent: 17 }, { country: "IN", amount: 0.15, percent: 13 }, { country: "MA", amount: 0.1, percent: 8 }], mainProducts: ["غذا", "نفت", "ماشین‌آلات"] },
    investmentRisk: 30, relations: { "FR": "green", "UK": "green", "MU": "green" },
    customs: [{ name: "بندر ویکتوریا", coords: [-4.6191, 55.4513], workingHours: "24/7" }]
  },
  "GA": {
    name: "گابن", nameEn: "Gabon",
    capital: { name: "لیبرویل", coords: [0.4162, 9.4673] },
    continent: "africa",
    gdp: 20, gdpRank: 123, gdpPerCapita: 8000,
    inflation: 4.3, unemployment: 20.0, currency: "XAF", currencyName: "فرانک",
    population: 2300000, populationDensity: 9, populationGrowth: 2.3,
    resources: { oil: { reserves: 2000, production: 200, unit: "mbbl", rank: 38 }, manganese: { reserves: 240, production: 2, unit: "mt", rank: 2 } },
    exports: { total: 6, partners: [{ country: "CN", amount: 2, percent: 33 }, { country: "FR", amount: 1, percent: 17 }, { country: "SG", amount: 0.8, percent: 13 }, { country: "US", amount: 0.6, percent: 10 }, { country: "IT", amount: 0.5, percent: 8 }], mainProducts: ["نفت", "منگنز", "چوب"] },
    imports: { total: 3, partners: [{ country: "FR", amount: 0.8, percent: 27 }, { country: "CN", amount: 0.6, percent: 20 }, { country: "BE", amount: 0.4, percent: 13 }, { country: "US", amount: 0.3, percent: 10 }, { country: "IT", amount: 0.25, percent: 8 }], mainProducts: ["ماشین‌آلات", "نفت", "غذا"] },
    investmentRisk: 45, relations: { "FR": "green", "CM": "white", "GQ": "white" },
    customs: [{ name: "بندر لیبرویل", coords: [0.4162, 9.4673], workingHours: "24/7" }]
  },
  "CG": {
    name: "کنگو", nameEn: "Republic of the Congo",
    capital: { name: "برازاویل", coords: [-4.2634, 15.2429] },
    continent: "africa",
    gdp: 13, gdpRank: 144, gdpPerCapita: 2500,
    inflation: 3.0, unemployment: 22.0, currency: "XAF", currencyName: "فرانک",
    population: 5600000, populationDensity: 16, populationGrowth: 2.3,
    resources: { oil: { reserves: 1600, production: 300, unit: "mbbl", rank: 36 }, potash: { reserves: 100, production: 0, unit: "mt", rank: 10 } },
    exports: { total: 5, partners: [{ country: "CN", amount: 2, percent: 40 }, { country: "IT", amount: 0.8, percent: 16 }, { country: "FR", amount: 0.6, percent: 12 }, { country: "ES", amount: 0.4, percent: 8 }, { country: "US", amount: 0.3, percent: 6 }], mainProducts: ["نفت", "چوب", "پتاس"] },
    imports: { total: 3.5, partners: [{ country: "CN", amount: 1, percent: 29 }, { country: "FR", amount: 0.6, percent: 17 }, { country: "BE", amount: 0.4, percent: 11 }, { country: "IT", amount: 0.3, percent: 9 }, { country: "IN", amount: 0.25, percent: 7 }], mainProducts: ["ماشین‌آلات", "نفت", "غذا"] },
    investmentRisk: 50, relations: { "FR": "green", "CD": "white", "CM": "white" },
    customs: [{ name: "بندر برازاویل", coords: [-4.2634, 15.2429], workingHours: "24/7" }]
  },
  "CD": {
    name: "کنگو دموکراتیک", nameEn: "Democratic Republic of the Congo",
    capital: { name: "کینشاسا", coords: [-4.4419, 15.2663] },
    continent: "africa",
    gdp: 64, gdpRank: 81, gdpPerCapita: 600,
    inflation: 23.0, unemployment: 4.6, currency: "CDF", currencyName: "فرانک",
    population: 102000000, populationDensity: 45, populationGrowth: 3.2,
    resources: { cobalt: { reserves: 3600, production: 100, unit: "kt", rank: 1 }, copper: { reserves: 20000, production: 1300, unit: "kt", rank: 6 }, diamonds: { reserves: 150, production: 12, unit: "mct", rank: 3 }, gold: { reserves: 1000, production: 30, unit: "tons", rank: 18 } },
    exports: { total: 12, partners: [{ country: "CN", amount: 6, percent: 50 }, { country: "ZA", amount: 1.5, percent: 13 }, { country: "BE", amount: 1, percent: 8 }, { country: "IN", amount: 0.8, percent: 7 }, { country: "AE", amount: 0.6, percent: 5 }], mainProducts: ["کبالت", "مس", "الماس"] },
    imports: { total: 10, partners: [{ country: "CN", amount: 3, percent: 30 }, { country: "ZA", amount: 1.5, percent: 15 }, { country: "BE", amount: 1, percent: 10 }, { country: "IN", amount: 0.8, percent: 8 }, { country: "KE", amount: 0.6, percent: 6 }], mainProducts: ["ماشین‌آلات", "نفت", "غذا"] },
    investmentRisk: 85, relations: { "RW": "orange", "UG": "orange", "TZ": "white" },
    customs: [{ name: "بندر کینشاسا", coords: [-4.4419, 15.2663], workingHours: "24/7" }]
  },
  "BI": {
    name: "بوروندی", nameEn: "Burundi",
    capital: { name: "گیتگا", coords: [-3.4284, 29.9253] },
    continent: "africa",
    gdp: 3, gdpRank: 157, gdpPerCapita: 300,
    inflation: 18.0, unemployment: 1.0, currency: "BIF", currencyName: "فرانک",
    population: 13000000, populationDensity: 463, populationGrowth: 3.1,
    resources: { nickel: { reserves: 180, production: 0, unit: "kt", rank: 11 } },
    exports: { total: 0.3, partners: [{ country: "CH", amount: 0.1, percent: 33 }, { country: "AE", amount: 0.06, percent: 20 }, { country: "PK", amount: 0.04, percent: 13 }, { country: "CN", amount: 0.03, percent: 10 }, { country: "IN", amount: 0.02, percent: 7 }], mainProducts: ["قهوه", "چای", "پنبه"] },
    imports: { total: 1, partners: [{ country: "CN", amount: 0.3, percent: 30 }, { country: "IN", amount: 0.2, percent: 20 }, { country: "SA", amount: 0.15, percent: 15 }, { country: "TZ", amount: 0.1, percent: 10 }, { country: "KE", amount: 0.08, percent: 8 }], mainProducts: ["غذا", "نفت", "ماشین‌آلات"] },
    investmentRisk: 80, relations: { "RW": "orange", "TZ": "white", "CD": "white" },
    customs: [{ name: "گمرک گیتگا", coords: [-3.4284, 29.9253], workingHours: "دوشنبه تا جمعه: 8:00-17:00" }]
  },
  "LS": {
    name: "لسوتو", nameEn: "Lesotho",
    capital: { name: "ماسرو", coords: [-29.3101, 27.4784] },
    continent: "africa",
    gdp: 2.6, gdpRank: 162, gdpPerCapita: 1200,
    inflation: 6.1, unemployment: 22.4, currency: "LSL", currencyName: "لوتی",
    population: 2200000, populationDensity: 73, populationGrowth: 0.8,
    resources: { diamonds: { reserves: 1, production: 0.05, unit: "mct", rank: 15 } },
    exports: { total: 1, partners: [{ country: "ZA", amount: 0.5, percent: 50 }, { country: "US", amount: 0.2, percent: 20 }, { country: "BE", amount: 0.1, percent: 10 }, { country: "CN", amount: 0.08, percent: 8 }, { country: "IN", amount: 0.06, percent: 6 }], mainProducts: ["الماس", "پوشاک", "پشم"] },
    imports: { total: 2, partners: [{ country: "ZA", amount: 1, percent: 50 }, { country: "CN", amount: 0.3, percent: 15 }, { country: "IN", amount: 0.2, percent: 10 }, { country: "US", amount: 0.15, percent: 8 }, { country: "BE", amount: 0.12, percent: 6 }], mainProducts: ["غذا", "نفت", "ماشین‌آلات"] },
    investmentRisk: 50, relations: { "ZA": "green", "SZ": "green" },
    customs: [{ name: "گمرک ماسرو", coords: [-29.3101, 27.4784], workingHours: "دوشنبه تا جمعه: 8:00-17:00" }]
  },
  "SZ": {
    name: "اسواتینی", nameEn: "Eswatini",
    capital: { name: "مبابانه", coords: [-26.3167, 31.1333] },
    continent: "africa",
    gdp: 4.7, gdpRank: 157, gdpPerCapita: 4000,
    inflation: 5.0, unemployment: 22.0, currency: "SZL", currencyName: "لیلانگنی",
    population: 1200000, populationDensity: 68, populationGrowth: 0.8,
    resources: { coal: { reserves: 200, production: 0.5, unit: "mt", rank: 30 } },
    exports: { total: 1.8, partners: [{ country: "ZA", amount: 0.9, percent: 50 }, { country: "US", amount: 0.3, percent: 17 }, { country: "MO", amount: 0.2, percent: 11 }, { country: "CN", amount: 0.15, percent: 8 }, { country: "IN", amount: 0.1, percent: 6 }], mainProducts: ["شکر", "پنبه", "میوه"] },
    imports: { total: 2, partners: [{ country: "ZA", amount: 1, percent: 50 }, { country: "CN", amount: 0.3, percent: 15 }, { country: "IN", amount: 0.2, percent: 10 }, { country: "MO", amount: 0.15, percent: 8 }, { country: "US", amount: 0.12, percent: 6 }], mainProducts: ["غذا", "نفت", "ماشین‌آلات"] },
    investmentRisk: 45, relations: { "ZA": "green", "LS": "green", "MZ": "white" },
    customs: [{ name: "گمرک مبابانه", coords: [-26.3167, 31.1333], workingHours: "دوشنبه تا جمعه: 8:00-17:00" }]
  },
  "MW": {
    name: "مالاوی", nameEn: "Malawi",
    capital: { name: "لیلونگوه", coords: [-13.9626, 33.7741] },
    continent: "africa",
    gdp: 13, gdpRank: 145, gdpPerCapita: 600,
    inflation: 20.0, unemployment: 5.9, currency: "MWK", currencyName: "کواچا",
    population: 20000000, populationDensity: 203, populationGrowth: 2.6,
    resources: {},
    exports: { total: 1.2, partners: [{ country: "ZA", amount: 0.4, percent: 33 }, { country: "BE", amount: 0.2, percent: 17 }, { country: "US", amount: 0.15, percent: 13 }, { country: "CN", amount: 0.12, percent: 10 }, { country: "IN", amount: 0.1, percent: 8 }], mainProducts: ["توتون", "چای", "شکر"] },
    imports: { total: 2.5, partners: [{ country: "ZA", amount: 0.8, percent: 32 }, { country: "CN", amount: 0.5, percent: 20 }, { country: "IN", amount: 0.3, percent: 12 }, { country: "MO", amount: 0.25, percent: 10 }, { country: "TZ", amount: 0.2, percent: 8 }], mainProducts: ["غذا", "نفت", "ماشین‌آلات"] },
    investmentRisk: 60, relations: { "ZA": "green", "TZ": "green", "MZ": "green" },
    customs: [{ name: "گمرک لیلونگوه", coords: [-13.9626, 33.7741], workingHours: "دوشنبه تا جمعه: 8:00-17:00" }]
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

