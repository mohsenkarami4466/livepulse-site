// سوییچ تم
function switchTheme(theme) {
    document.body.className = theme + '-theme';
    document.querySelectorAll('.theme-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

// تغییر رنگ تدریجی (۳ ثانیه)
function smoothColorChange(newColor, element) {
    element.style.transition = 'all 3s ease';
    element.style.background = newColor;
}

// تغییر رنگ هر کارت بر اساس عملکرد
function updateCardColors() {
    const cards = document.querySelectorAll('.price-card');
    
    cards.forEach(card => {
        const changeElement = card.querySelector('.change');
        if (changeElement.classList.contains('positive')) {
            smoothColorChange('rgba(0, 184, 148, 0.1)', card);
        } else if (changeElement.classList.contains('negative')) {
            smoothColorChange('rgba(255, 107, 107, 0.1)', card);
        } else {
            smoothColorChange('rgba(253, 203, 110, 0.1)', card);
        }
    });
}

// شبیه‌سازی داده (موقت)
function simulateData() {
    // قیمت‌ها
    document.getElementById('btcPrice').textContent = '۶۸,۴۲۳ $';
    document.getElementById('btcChange').textContent = '+۲.۱٪';
    document.getElementById('btcChange').className = 'change positive';
    
    document.getElementById('goldPrice').textContent = '۲,۳۴۵ $';
    document.getElementById('goldChange').textContent = '+۰.۸٪';
    document.getElementById('goldChange').className = 'change positive';
    
    document.getElementById('oilPrice').textContent = '۸۵.۶۷ $';
    document.getElementById('oilChange').textContent = '-۱.۲٪';
    document.getElementById('oilChange').className = 'change negative';
    
    document.getElementById('usdPrice').textContent = '۱.۰۸ €';
    document.getElementById('usdChange').textContent = '+۰.۳٪';
    document.getElementById('usdChange').className = 'change positive';
    
    // وضعیت بازار
    document.getElementById('marketStatus').textContent = '📊 وضعیت بازار: 📈 صعودی';
    document.getElementById('aiAnalysis').textContent = 'بازار امروز روند صعودی دارد. پیش‌بینی رشد ۲-۳٪ در ۲۴ ساعت آینده.';
    document.getElementById('breakingNews').textContent = 'توییت جدید ترامپ درباره سیاست مالی - تأثیر مثبت روی طلا';
    
    // آپدیت رنگ کارت‌ها
    updateCardColors();
}

// شبیه‌سازی چت AI
function askAI() {
    const question = document.getElementById('questionInput').value;
    const responseDiv = document.getElementById('aiResponse');
    
    if (!question) return;
    
    responseDiv.innerHTML = '🤖 در حال تحلیل سوال شما...';
    
    // شبیه‌سازی تأخیر
    setTimeout(() => {
        responseDiv.innerHTML = `
            <strong>سوال شما:</strong> ${question}<br><br>
            <strong>پاسخ هوش مصنوعی:</strong> بر اساس تحلیل فعلی، بازار روند صعودی دارد. 
            پیشنهاد می‌کنم موقعیت‌های کوتاه‌مدت در نظر بگیرید. 
            (این پاسخ آزمایشی است - به زودی به real AI متصل می‌شود)
        `;
    }, 2000);
}

// اجرای اولیه
simulateData();

// آپدیت دوره‌ای داده (هر ۳۰ ثانیه)
setInterval(simulateData, 30000);
