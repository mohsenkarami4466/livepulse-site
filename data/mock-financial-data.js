// داده‌های بازارهای جهانی برای کره مالی
const mockFinancialData = [
  {
    lat: 40.7128, lng: -74.0060, // نیویورک
    name: "بورس نیویورک (NYSE)",
    country: "آمریکا",
    hours: "09:30 - 16:00",
    timezone: "America/New_York",
    utcOffset: -5,
    status: "open",
    color: "#10b981",
    indicators: {
      goldPrice: 2340,
      index: "S&P 500",
      indexValue: 5800,
      volume: "4.2B"
    }
  },
  {
    lat: 51.5074, lng: -0.1278, // لندن
    name: "بورس لندن (LSE)", 
    country: "انگلیس",
    hours: "08:00 - 16:30",
    timezone: "Europe/London",
    utcOffset: 0,
    status: "closed",
    color: "#ef4444",
    indicators: {
      goldPrice: 2325,
      index: "FTSE 100",
      indexValue: 8200,
      volume: "1.8B"
    }
  },
  {
    lat: 35.6895, lng: 139.6917, // توکیو
    name: "بورس توکیو (TSE)",
    country: "ژاپن",
    hours: "09:00 - 15:00", 
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    status: "closed",
    color: "#ef4444",
    indicators: {
      goldPrice: 2335,
      index: "Nikkei 225",
      indexValue: 39000,
      volume: "2.1B"
    }
  },
  {
    lat: 22.3193, lng: 114.1694, // هنگ کنگ
    name: "بورس هنگ کنگ (HKEX)",
    country: "هنگ کنگ",
    hours: "09:30 - 16:00",
    timezone: "Asia/Hong_Kong",
    utcOffset: 8,
    status: "closed",
    color: "#ef4444",
    indicators: {
      goldPrice: 2330,
      index: "Hang Seng",
      indexValue: 19500,
      volume: "1.5B"
    }
  },
  {
    lat: 31.2304, lng: 121.4737, // شانگهای
    name: "بورس شانگهای (SSE)",
    country: "چین",
    hours: "09:30 - 15:00",
    timezone: "Asia/Shanghai",
    utcOffset: 8,
    status: "closed",
    color: "#ef4444",
    indicators: {
      goldPrice: 2328,
      index: "SSE Composite",
      indexValue: 3100,
      volume: "3.2B"
    }
  },
  {
    lat: 50.1109, lng: 8.6821, // فرانکفورت
    name: "بورس فرانکفورت (FSE)",
    country: "آلمان",
    hours: "09:00 - 17:30",
    timezone: "Europe/Berlin",
    utcOffset: 1,
    status: "closed",
    color: "#ef4444",
    indicators: {
      goldPrice: 2322,
      index: "DAX",
      indexValue: 19200,
      volume: "1.2B"
    }
  },
  {
    lat: 48.8566, lng: 2.3522, // پاریس
    name: "بورس پاریس (Euronext)",
    country: "فرانسه",
    hours: "09:00 - 17:30",
    timezone: "Europe/Paris",
    utcOffset: 1,
    status: "closed",
    color: "#ef4444",
    indicators: {
      goldPrice: 2320,
      index: "CAC 40",
      indexValue: 7600,
      volume: "0.9B"
    }
  },
  {
    lat: 1.3521, lng: 103.8198, // سنگاپور
    name: "بورس سنگاپور (SGX)",
    country: "سنگاپور",
    hours: "09:00 - 17:00",
    timezone: "Asia/Singapore",
    utcOffset: 8,
    status: "closed",
    color: "#ef4444",
    indicators: {
      goldPrice: 2332,
      index: "STI",
      indexValue: 3400,
      volume: "0.7B"
    }
  },
  {
    lat: -33.8688, lng: 151.2093, // سیدنی
    name: "بورس استرالیا (ASX)",
    country: "استرالیا",
    hours: "10:00 - 16:00",
    timezone: "Australia/Sydney",
    utcOffset: 11,
    status: "closed",
    color: "#ef4444",
    indicators: {
      goldPrice: 2338,
      index: "ASX 200",
      indexValue: 8100,
      volume: "0.8B"
    }
  },
  {
    lat: 19.0760, lng: 72.8777, // مومبای
    name: "بورس بمبئی (BSE)",
    country: "هند",
    hours: "09:15 - 15:30",
    timezone: "Asia/Kolkata",
    utcOffset: 5.5,
    status: "closed",
    color: "#ef4444",
    indicators: {
      goldPrice: 2342,
      index: "Sensex",
      indexValue: 79000,
      volume: "2.5B"
    }
  },
  {
    lat: 35.7219, lng: 51.3347, // تهران
    name: "بورس تهران (TSETMC)",
    country: "ایران",
    hours: "09:00 - 12:30",
    timezone: "Asia/Tehran",
    utcOffset: 3.5,
    status: "closed",
    color: "#fbbf24",
    indicators: {
      goldPrice: 2345,
      index: "TEDPIX",
      indexValue: 2150000,
      volume: "8.5T"
    }
  },
  {
    lat: 24.7136, lng: 46.6753, // ریاض
    name: "بورس سعودی (Tadawul)",
    country: "عربستان",
    hours: "10:00 - 15:00",
    timezone: "Asia/Riyadh",
    utcOffset: 3,
    status: "closed",
    color: "#ef4444",
    indicators: {
      goldPrice: 2340,
      index: "TASI",
      indexValue: 11800,
      volume: "1.1B"
    }
  },
  {
    lat: 25.2048, lng: 55.2708, // دبی
    name: "بورس دبی (DFM)",
    country: "امارات",
    hours: "10:00 - 14:00",
    timezone: "Asia/Dubai",
    utcOffset: 4,
    status: "closed",
    color: "#ef4444",
    indicators: {
      goldPrice: 2338,
      index: "DFM",
      indexValue: 4200,
      volume: "0.5B"
    }
  },
  {
    lat: 37.5665, lng: 126.9780, // سئول
    name: "بورس کره (KRX)",
    country: "کره جنوبی",
    hours: "09:00 - 15:30",
    timezone: "Asia/Seoul",
    utcOffset: 9,
    status: "closed",
    color: "#ef4444",
    indicators: {
      goldPrice: 2336,
      index: "KOSPI",
      indexValue: 2550,
      volume: "1.8B"
    }
  },
  {
    lat: -23.5505, lng: -46.6333, // سائوپائولو
    name: "بورس برزیل (B3)",
    country: "برزیل",
    hours: "10:00 - 17:00",
    timezone: "America/Sao_Paulo",
    utcOffset: -3,
    status: "closed",
    color: "#ef4444",
    indicators: {
      goldPrice: 2342,
      index: "Bovespa",
      indexValue: 127000,
      volume: "1.4B"
    }
  },
  {
    lat: 55.7558, lng: 37.6173, // مسکو
    name: "بورس مسکو (MOEX)",
    country: "روسیه",
    hours: "10:00 - 18:50",
    timezone: "Europe/Moscow",
    utcOffset: 3,
    status: "closed",
    color: "#ef4444",
    indicators: {
      goldPrice: 2340,
      index: "MOEX",
      indexValue: 2800,
      volume: "0.6B"
    }
  }
];

// تابع برای بروزرسانی وضعیت بازارها بر اساس ساعت
function updateMarketStatuses() {
  const now = new Date();
  const utcHour = now.getUTCHours();
  const utcMinute = now.getUTCMinutes();
  const currentUtcTime = utcHour + utcMinute / 60;
  
  mockFinancialData.forEach(market => {
    const [openTime, closeTime] = market.hours.split(' - ');
    const [openHour, openMin] = openTime.split(':').map(Number);
    const [closeHour, closeMin] = closeTime.split(':').map(Number);
    
    // تبدیل به UTC
    const openUtc = (openHour - market.utcOffset + 24) % 24 + openMin / 60;
    const closeUtc = (closeHour - market.utcOffset + 24) % 24 + closeMin / 60;
    
    // بررسی باز بودن
    let isOpen = false;
    if (closeUtc > openUtc) {
      isOpen = currentUtcTime >= openUtc && currentUtcTime < closeUtc;
    } else {
      isOpen = currentUtcTime >= openUtc || currentUtcTime < closeUtc;
    }
    
    // بررسی آخر هفته
    const dayOfWeek = now.getUTCDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      isOpen = false;
    }
    
    market.status = isOpen ? 'open' : 'closed';
    market.color = isOpen ? '#10b981' : '#ef4444';
  });
}

// بروزرسانی هر دقیقه
setInterval(updateMarketStatuses, 60000);
updateMarketStatuses();

// تابع برای پر کردن لیست بازارها
function _populateMarketList() {
  const marketList = document.getElementById('marketList');
  if (!marketList) return;
  
  const html = mockFinancialData.map(market => `
    <div class="market-item ${market.status}" data-lat="${market.lat}" data-lng="${market.lng}">
      <div class="market-details">
        <div class="market-name">${market.name}</div>
        <div class="market-time">${market.hours} (${market.country})</div>
      </div>
      <span class="market-status ${market.status}">${market.status === 'open' ? 'باز' : 'بسته'}</span>
    </div>
  `).join('');
  
  marketList.innerHTML = html;
  
  // اضافه کردن event listener برای زوم روی بازار
  marketList.querySelectorAll('.market-item').forEach(item => {
    item.addEventListener('click', () => {
      const lat = parseFloat(item.dataset.lat);
      const lng = parseFloat(item.dataset.lng);
      if (window.zoomToLocation) {
        window.zoomToLocation(lat, lng);
      }
    });
  });
}

// تشخیص منطقه زمانی کاربر
function detectUserTimezone() {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const offset = -new Date().getTimezoneOffset() / 60;
  const sign = offset >= 0 ? '+' : '';
  
  const timezoneEl = document.getElementById('userTimezone');
  if (timezoneEl) {
    timezoneEl.textContent = `UTC${sign}${offset}`;
  }
  
  return { timezone, offset };
}

// راه‌اندازی
document.addEventListener('DOMContentLoaded', () => {
  detectUserTimezone();
});
