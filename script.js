// داده‌های نمونه برای بازار
const marketData = {
    btc: { price: 45234.56, change: 2.34 },
    eth: { price: 3123.45, change: 1.89 },
    gold: { price: 1987.65, change: -0.45 }
};

// شبیه‌سازی تحلیل AI
const aiAnalysis = {
    sentiment: 'positive',
    confidence: 87,
    message: 'تحلیل AI نشان می‌دهد روند صعودی در کوتاه‌مدت ادامه خواهد دارد'
};

// تابع برای آپدیت قیمت‌ها
function updatePrices() {
    document.getElementById('btc-price').textContent = `$${marketData.btc.price.toLocaleString()}`;
    document.getElementById('eth-price').textContent = `$${marketData.eth.price.toLocaleString()}`;
    document.getElementById('gold-price').textContent = `$${marketData.gold.price.toLocaleString()}`;
}

// تابع برای شبیه‌سازی تغییرات قیمت
function simulatePriceChanges() {
    setInterval(() => {
        // تغییرات کوچک تصادفی در قیمت‌ها
        marketData.btc.price *= (1 + (Math.random() - 0.5) * 0.01);
        marketData.eth.price *= (1 + (Math.random() - 0.5) * 0.01);
        marketData.gold.price *= (1 + (Math.random() - 0.5) * 0.005);
        
        updatePrices();
        
        // لاگ برای دیدن تغییرات در کنسول
        console.log('Prices updated:', marketData);
    }, 5000); // هر ۵ ثانیه آپدیت شود
}

// تابع برای رسم نمودار ساده
function drawSimpleChart() {
    const canvas = document.getElementById('marketChart');
    const ctx = canvas.getContext('2d');
    
    // پاک کردن کانواس
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // داده‌های نمونه برای نمودار
    const data = [65, 59, 80, 81, 56, 55, 70, 75, 72, 68, 76, 82];
    
    // تنظیمات نمودار
    ctx.strokeStyle = '#00b4db';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue;
    const width = canvas.width - 40;
    const height = canvas.height - 40;
    
    // رسم خط نمودار
    data.forEach((value, index) => {
        const x = 20 + (index / (data.length - 1)) * width;
        const y = 20 + height - ((value - minValue) / range) * height;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // نقاط روی نمودار
    ctx.fillStyle = '#0083b0';
    data.forEach((value, index) => {
        const x = 20 + (index / (data.length - 1)) * width;
        const y = 20 + height - ((value - minValue) / range) * height;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
    });
}

// تابع اصلی برای راه‌اندازی
function initializeApp() {
    console.log('🚀 LivePulse Application Starting...');
    
    // آپدیت اولیه قیمت‌ها
    updatePrices();
    
    // شروع شبیه‌سازی تغییرات قیمت
    simulatePriceChanges();
    
    // رسم نمودار
    drawSimpleChart();
    
    // آپدیت دوره‌ای نمودار
    setInterval(drawSimpleChart, 10000);
    
    console.log('✅ LivePulse Application Started Successfully!');
}

// راه‌اندازی برنامه وقتی صفحه لود شد
document.addEventListener('DOMContentLoaded', initializeApp);

// هندل خطاها
window.addEventListener('error', (event) => {
    console.error('❌ Application Error:', event.error);
});
