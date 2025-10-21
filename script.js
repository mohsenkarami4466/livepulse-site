// سوییچ تم
function switchTheme(theme) {
    document.body.className = theme + '-theme';
    document.querySelectorAll('.theme-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

// هاور هوشمند (اینجا بعداً کامل می‌شه)
document.querySelectorAll('.price-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        // بعداً تحلیل AI نمایش داده می‌شه
        console.log('هاور روی:', this.dataset.asset);
    });
});

// شبیه‌سازی داده (موقت)
function simulateData() {
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
    
    document.getElementById('marketStatus').textContent = '📊 وضعیت بازار: 📈 صعودی';
    document.getElementById('aiAnalysis').textContent = 'بازار امروز روند صعودی دارد. پیش‌بینی رشد ۲-۳٪ در ۲۴ ساعت آینده.';
    document.getElementById('breakingNews').textContent = 'توییت جدید ترامپ درباره سیاست مالی - تأثیر مثبت روی طلا';
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

// تغییر رنگ بر اساس بازار (آزمایشی)
setTimeout(() => {
    document.body.style.background = 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)';
}, 5000);
