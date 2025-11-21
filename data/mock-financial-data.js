// داده‌های نمونه برای کره مالی
const mockFinancialData = [
  {
    lat: 40.7128, lng: -74.0060, // نیویورک
    name: "وال استریت (NYSE)",
    country: "آمریکا",
    hours: "09:30 - 16:00 EST",
    status: "open",
    color: "#10b981",
    indicators: {
      goldPrice: 1950,
      sp500: 4500,
      volume: "4.2B"
    }
  },
  {
    lat: 51.5074, lng: -0.1278, // لندن
    name: "بورس لندن (LSE)", 
    country: "انگلیس",
    hours: "08:00 - 16:30 GMT",
    status: "closed",
    color: "#ef4444",
    indicators: {
      goldPrice: 1925,
      ftse100: 7500,
      volume: "1.8B"
    }
  },
  {
    lat: 35.6895, lng: 139.6917, // توکیو
    name: "بورس توکیو (TSE)",
    country: "ژاپن",
    hours: "09:00 - 15:00 JST", 
    status: "closed",
    color: "#ef4444",
    indicators: {
      goldPrice: 1935,
      nikkei: 33000,
      volume: "2.1B"
    }
  }
];

// بعداً با API واقعی جایگزین می‌شود
