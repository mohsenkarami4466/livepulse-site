// ساعت و تاریخ
function updateDateTime() {
    const now = new Date();
    
    // ساعت
    const time = now.toLocaleTimeString('fa-IR');
    document.getElementById('currentTime').textContent = time;
    
    // تاریخ
    const date = now.toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('currentDate').textContent = date;
}

// سوییچ تم با کلید برق
function toggleTheme() {
    const isDark = document.body.classList.contains('dark-theme');
    if (isDark) {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
    }
}

// حالت ذره‌بین
function toggleZoom() {
    document.body.classList.toggle('zoomed');
}

// نمایش ورود (موقت)
function showLogin() {
    alert('سیستم ورود به زودی فعال می‌شود! 🚀');
}

// تغییر دسته‌بندی
function setupCategories() {
    const categories = document.querySelectorAll('.category-circle');
    
    categories.forEach(category => {
        category.addEventListener('click', function() {
            // حذف active از همه
            categories.forEach(cat => cat.classList.remove('active'));
            // اضافه کردن active به این دسته
            this.classList.add('active');
            
            // اینجا بعداً محتوای مربوط به دسته رو لود می‌کنیم
            const categoryName = this.dataset.category;
            console.log('دسته انتخاب شده:', categoryName);
        });
    });
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
            smoothColorChange('rgba(72, 187, 120, 0.1)', card);
        } else if (changeElement.classList.contains('negative')) {
            smoothColorChange('rgba(245, 101, 101, 0.1)', card);
        } else {
            smoothColorChange('rgba(237, 137, 54, 0.1)', card);
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
updateDateTime();
setupCategories();
simulateData();

// آپدیت دوره‌ای
setInterval(updateDateTime, 1000);
setInterval(simulateData, 30000);
