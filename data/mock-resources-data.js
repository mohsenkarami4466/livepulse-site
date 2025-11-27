// داده‌های منابع طبیعی جهان برای کره منابع
const mockResourcesData = [
  // طلا - بزرگترین معادن جهان
  {
    lat: -26.2041, lng: 28.0473, // آفریقای جنوبی - Witwatersrand
    name: "معادن طلای ویتواترسراند",
    country: "آفریقای جنوبی",
    resource: "gold",
    color: "#ffd700",
    reserves: "40,000 تن",
    production: "118 تن/سال",
    rank: 1
  },
  {
    lat: -6.1745, lng: 106.8227, // اندونزی - Grasberg
    name: "معدن گراسبرگ",
    country: "اندونزی",
    resource: "gold",
    color: "#ffd700",
    reserves: "2,500 تن",
    production: "60 تن/سال",
    rank: 2
  },
  {
    lat: 39.9042, lng: 116.4074, // چین
    name: "معادن طلای چین",
    country: "چین",
    resource: "gold",
    color: "#ffd700",
    reserves: "2,000 تن",
    production: "350 تن/سال",
    rank: 3
  },
  {
    lat: -25.2744, lng: 133.7751, // استرالیا
    name: "معادن طلای استرالیا",
    country: "استرالیا",
    resource: "gold",
    color: "#ffd700",
    reserves: "10,000 تن",
    production: "320 تن/سال",
    rank: 4
  },
  {
    lat: 61.5240, lng: -105.3188, // کانادا
    name: "معادن طلای کانادا",
    country: "کانادا",
    resource: "gold",
    color: "#ffd700",
    reserves: "2,300 تن",
    production: "180 تن/سال",
    rank: 5
  },
  {
    lat: 61.5240, lng: 105.3188, // روسیه
    name: "معادن طلای روسیه",
    country: "روسیه",
    resource: "gold",
    color: "#ffd700",
    reserves: "5,300 تن",
    production: "330 تن/سال",
    rank: 6
  },
  {
    lat: 35.7219, lng: 51.3347, // ایران
    name: "معادن طلای ایران (سریدون)",
    country: "ایران",
    resource: "gold",
    color: "#ffd700",
    reserves: "350 تن",
    production: "8 تن/سال",
    rank: 40
  },
  {
    lat: -13.1631, lng: -72.5450, // پرو
    name: "معدن یاناکوچا",
    country: "پرو",
    resource: "gold",
    color: "#ffd700",
    reserves: "1,800 تن",
    production: "40 تن/سال",
    rank: 7
  },
  {
    lat: 5.6037, lng: -0.1870, // غنا
    name: "معادن طلای غنا",
    country: "غنا",
    resource: "gold",
    color: "#ffd700",
    reserves: "1,000 تن",
    production: "130 تن/سال",
    rank: 8
  },
  {
    lat: 40.4637, lng: -3.7492, // اسپانیا
    name: "معدن لاس کروسس",
    country: "اسپانیا",
    resource: "gold",
    color: "#ffd700",
    reserves: "200 تن",
    production: "5 تن/سال",
    rank: 50
  },

  // نفت - بزرگترین ذخایر جهان
  {
    lat: 24.4539, lng: 54.3773, // امارات
    name: "میدان نفتی زاکوم",
    country: "امارات",
    resource: "oil",
    color: "#1a1a1a",
    reserves: "66 میلیارد بشکه",
    production: "3.8 میلیون بشکه/روز",
    rank: 1
  },
  {
    lat: 26.0667, lng: 50.5577, // عربستان - غوار
    name: "میدان نفتی غوار",
    country: "عربستان",
    resource: "oil",
    color: "#1a1a1a",
    reserves: "80 میلیارد بشکه",
    production: "5 میلیون بشکه/روز",
    rank: 2
  },
  {
    lat: 30.0444, lng: 51.4215, // ایران - آزادگان
    name: "میدان نفتی آزادگان",
    country: "ایران",
    resource: "oil",
    color: "#1a1a1a",
    reserves: "42 میلیارد بشکه",
    production: "1.2 میلیون بشکه/روز",
    rank: 3
  },
  {
    lat: 29.3117, lng: 47.4818, // کویت - برقان
    name: "میدان نفتی برقان",
    country: "کویت",
    resource: "oil",
    color: "#1a1a1a",
    reserves: "70 میلیارد بشکه",
    production: "1.7 میلیون بشکه/روز",
    rank: 4
  },
  {
    lat: 30.0330, lng: 47.9740, // عراق - رمیله
    name: "میدان نفتی رمیله",
    country: "عراق",
    resource: "oil",
    color: "#1a1a1a",
    reserves: "17 میلیارد بشکه",
    production: "1.5 میلیون بشکه/روز",
    rank: 5
  },
  {
    lat: 10.4806, lng: -66.9036, // ونزوئلا
    name: "کمربند نفتی اورینوکو",
    country: "ونزوئلا",
    resource: "oil",
    color: "#1a1a1a",
    reserves: "300 میلیارد بشکه",
    production: "0.7 میلیون بشکه/روز",
    rank: 6
  },
  {
    lat: 61.5240, lng: 73.3688, // روسیه - سامتلور
    name: "میدان نفتی سامتلور",
    country: "روسیه",
    resource: "oil",
    color: "#1a1a1a",
    reserves: "28 میلیارد بشکه",
    production: "3.2 میلیون بشکه/روز",
    rank: 7
  },
  {
    lat: 56.1304, lng: -106.3468, // کانادا - شن‌های نفتی
    name: "شن‌های نفتی آلبرتا",
    country: "کانادا",
    resource: "oil",
    color: "#1a1a1a",
    reserves: "168 میلیارد بشکه",
    production: "3.5 میلیون بشکه/روز",
    rank: 8
  },
  {
    lat: 31.9686, lng: -99.9018, // آمریکا - پرمین
    name: "حوضه پرمین",
    country: "آمریکا",
    resource: "oil",
    color: "#1a1a1a",
    reserves: "75 میلیارد بشکه",
    production: "5.5 میلیون بشکه/روز",
    rank: 9
  },
  {
    lat: 4.5709, lng: -74.2973, // کلمبیا
    name: "حوضه‌های نفتی کلمبیا",
    country: "کلمبیا",
    resource: "oil",
    color: "#1a1a1a",
    reserves: "2 میلیارد بشکه",
    production: "0.8 میلیون بشکه/روز",
    rank: 20
  },

  // گاز - بزرگترین ذخایر جهان
  {
    lat: 26.3333, lng: 51.1833, // قطر - گنبد شمالی
    name: "میدان گازی گنبد شمالی",
    country: "قطر",
    resource: "gas",
    color: "#a855f7",
    reserves: "900 TCF",
    production: "177 BCM/سال",
    rank: 1
  },
  {
    lat: 27.5000, lng: 52.0000, // ایران - پارس جنوبی
    name: "میدان گازی پارس جنوبی",
    country: "ایران",
    resource: "gas",
    color: "#a855f7",
    reserves: "500 TCF",
    production: "230 BCM/سال",
    rank: 2
  },
  {
    lat: 66.5167, lng: 66.6500, // روسیه - یامبورگ
    name: "میدان گازی یامال",
    country: "روسیه",
    resource: "gas",
    color: "#a855f7",
    reserves: "1,200 TCF",
    production: "700 BCM/سال",
    rank: 3
  },
  {
    lat: 40.0150, lng: 58.3810, // ترکمنستان - گالکینش
    name: "میدان گازی گالکینش",
    country: "ترکمنستان",
    resource: "gas",
    color: "#a855f7",
    reserves: "350 TCF",
    production: "77 BCM/سال",
    rank: 4
  },
  {
    lat: 40.7128, lng: -74.0060, // آمریکا - مارسلوس
    name: "حوضه شیل مارسلوس",
    country: "آمریکا",
    resource: "gas",
    color: "#a855f7",
    reserves: "480 TCF",
    production: "934 BCM/سال",
    rank: 5
  },
  {
    lat: -25.2744, lng: 133.7751, // استرالیا
    name: "میدان گازی گورگون",
    country: "استرالیا",
    resource: "gas",
    color: "#a855f7",
    reserves: "40 TCF",
    production: "142 BCM/سال",
    rank: 6
  },
  {
    lat: 28.3949, lng: -81.7931, // نروژ - ترول
    name: "میدان گازی ترول",
    country: "نروژ",
    resource: "gas",
    color: "#a855f7",
    reserves: "40 TCF",
    production: "112 BCM/سال",
    rank: 7
  },
  {
    lat: 4.0383, lng: 21.7587, // الجزایر - حاسی رمل
    name: "میدان گازی حاسی رمل",
    country: "الجزایر",
    resource: "gas",
    color: "#a855f7",
    reserves: "100 TCF",
    production: "93 BCM/سال",
    rank: 8
  },
  {
    lat: 6.5244, lng: 3.3792, // نیجریه
    name: "میادین گازی نیجریه",
    country: "نیجریه",
    resource: "gas",
    color: "#a855f7",
    reserves: "200 TCF",
    production: "49 BCM/سال",
    rank: 9
  },
  {
    lat: 23.8859, lng: 45.0792, // عربستان
    name: "میدان گازی الجافوره",
    country: "عربستان",
    resource: "gas",
    color: "#a855f7",
    reserves: "200 TCF",
    production: "112 BCM/سال",
    rank: 10
  }
];

// تابع فیلتر منابع
function filterResources(type) {
  if (type === 'all') return mockResourcesData;
  return mockResourcesData.filter(r => r.resource === type);
}

// تابع برای پر کردن لجند
function populateResourcesLegend() {
  const legend = document.getElementById('resourcesLegend');
  if (!legend) return;
  
  const counts = {
    gold: mockResourcesData.filter(r => r.resource === 'gold').length,
    oil: mockResourcesData.filter(r => r.resource === 'oil').length,
    gas: mockResourcesData.filter(r => r.resource === 'gas').length
  };
  
  legend.innerHTML = `
    <div class="legend-item"><span class="legend-color gold"></span> طلا (${counts.gold})</div>
    <div class="legend-item"><span class="legend-color oil"></span> نفت (${counts.oil})</div>
    <div class="legend-item"><span class="legend-color gas"></span> گاز (${counts.gas})</div>
  `;
}
