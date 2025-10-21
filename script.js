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
            
            // اسکرول به بخش مربوطه
            const categoryName = this.dataset.category;
            const section = document.getElementById(categoryName + '-section');
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// تحلیل رابطه‌ای هوشمند
function generateAIHints() {
    const oilPrice = parseFloat(document.getElementById('iranOilPrice').textContent) || 85;
    const goldPrice = parseFloat(document.getElementById('worldGoldPrice').textContent) || 2345;
    const btcPrice = parseFloat(document.getElementById('btcPrice').textContent) || 68423;
    
    // تحلیل رابطه نفت و طلا
    if (oilPrice > 90) {
        document.getElementById('iranOilHint').textContent = '📈 احتمال رشد طلا';
        document.getElementById('worldGoldHint').textContent = '🛢️ تأثیرپذیر از نفت';
    }
    
    // تحلیل رابطه طلا و بیت‌کوین
    if (goldPrice > 2400) {
        document.getElementById('worldGoldHint').textContent += ' ₿ ممکن است سرمایه به رمزارزها برود';
        document.getElementById('btcHint').textContent = '🥇 رقابت با طلا';
    }
    
    // تحلیل کلی بازار
    if (btcPrice > 70000) {
        document.getElementById('marketStatus').textContent = '📊 وضعیت بازار: 🚀 صعود قوی';
        document.getElementById('aiAnalysis').textContent = 'بازار در حالت صعودی قوی قرار دارد. نفت بالا رفته که معمولاً منجر به تورم و رشد طلا می‌شود. رمزارزها نیز روند مثبت دارند.';
    }
}

// شبیه‌سازی داده‌های واقعی
function simulateRealData() {
    // رمزارزها
    document.getElementById('btcPrice').textContent = '۶۸,۴۲۳ $';
    document.getElementById('btcChange').textContent = '+۲.۱٪';
    document.getElementById('btcChange').className = 'change positive';
    
    document.getElementById('usdtPrice').textContent = '۱.۰۰ $';
    document.getElementById('usdtChange').textContent = '۰.۰٪';
    document.getElementById('usdtChange').className = 'change neutral';
    
    document.getElementById('ethPrice').textContent = '۳,۸۵۰ $';
    document.getElementById('ethChange').textContent = '+۱.۸٪';
    document.getElementById('ethChange').className = 'change positive';
    
    document.getElementById('shibPrice').textContent = '۰.۰۰۰۰۲۸ $';
    document.getElementById('shibChange').textContent = '+۵.۲٪';
    document.getElementById('shibChange').className = 'change positive';
    
    document.getElementById('dogePrice').textContent = '۰.۱۵ $';
    document.getElementById('dogeChange').textContent = '-۰.۸٪';
    document.getElementById('dogeChange').className = 'change negative';

    // ارزهای خارجی
    document.getElementById('usdPrice').textContent = '۵۸,۵۰۰ تومان';
    document.getElementById('usdChange').textContent = '+۰.۳٪';
    document.getElementById('usdChange').className = 'change positive';
    
    document.getElementById('eurPrice').textContent = '۶۲,۸۰۰ تومان';
    document.getElementById('eurChange').textContent = '+۰.۵٪';
    document.getElementById('eurChange').className = 'change positive';
    
    document.getElementById('tryPrice').textContent = '۱,۸۵۰ تومان';
    document.getElementById('tryChange').textContent = '-۰.۲٪';
    document.getElementById('tryChange').className = 'change negative';
    
    document.getElementById('aedPrice').textContent = '۱۵,۹۰۰ تومان';
    document.getElementById('aedChange').textContent = '+۰.۳٪';
    document.getElementById('aedChange').className = 'change positive';
    
    document.getElementById('gbpPrice').textContent = '۷۲,۵۰۰ تومان';
    document.getElementById('gbpChange').textContent = '+۰.۴٪';
    document.getElementById('gbpChange').className = 'change positive';

    // طلا و سکه
    document.getElementById('gold18Price').textContent = '۳,۲۵۰,۰۰۰ تومان';
    document.getElementById('gold18Change').textContent = '+۰.۸٪';
    document.getElementById('gold18Change').className = 'change positive';
    
    document.getElementById('coinPrice').textContent = '۴۰,۵۰۰,۰۰۰ تومان';
    document.getElementById('coinChange').textContent = '+۱.۲٪';
    document.getElementById('coinChange').className = 'change positive';
    
    document.getElementById('baharPrice').textContent = '۳۸,۲۰۰,۰۰۰ تومان';
    document.getElementById('baharChange').textContent = '+۱.۱٪';
    document.getElementById('baharChange').className = 'change positive';
    
    document.getElementById('nesfePrice').textContent = '۲۰,۱۰۰,۰۰۰ تومان';
    document.getElementById('nesfeChange').textContent = '+۱.۰٪';
    document.getElementById('nesfeChange').className = 'change positive';
    
    document.getElementById('worldGoldPrice').textContent = '۲,۳۴۵ $';
    document.getElementById('worldGoldChange').textContent = '+۰.۹٪';
    document.getElementById('worldGoldChange').className = 'change positive';

    // نفت و انرژی
    document.getElementById('iranOilPrice').textContent = '۸۷.۵ $';
    document.getElementById('iranOilChange').textContent = '+۳.۲٪';
    document.getElementById('iranOilChange').className = 'change positive';
    
    document.getElementById('brentPrice').textContent = '۸۹.۲ $';
    document.getElementById('brentChange').textContent = '+۲.۸٪';
    document.getElementById('brentChange').className = 'change positive';
    
    document.getElementById('wtiPrice').textContent = '۸۵.۶ $';
    document.getElementById('wtiChange').textContent = '+۲.۵٪';
    document.getElementById('wtiChange').className = 'change positive';
    
    document.getElementById('gasolinePrice').textContent = '۳۵,۰۰۰ تومان';
    document.getElementById('gasolineChange').textContent = '+۱.۵٪';
    document.getElementById('gasolineChange').className = 'change positive';
    
    document.getElementById('opecPrice').textContent = '۸۸.۱ $';
    document.getElementById('opecChange').textContent = '+۲.۹٪';
    document.getElementById('opecChange').className = 'change positive';

    // وضعیت بازار
    document.getElementById('marketStatus').textContent = '📊 وضعیت بازار: 📈 صعودی';
    document.getElementById('breakingNews').textContent = 'توییت جدید ترامپ درباره سیاست مالی - تأثیر مثبت روی طلا و نفت';
    
    // تولید راهنمای AI
    generateAIHints();
}

// شبیه‌سازی چت AI
function askAI() {
    const question = document.getElementById('questionInput').value;
    const responseDiv = document.getElementById('aiResponse');
    
    if (!question) return;
    
    responseDiv.innerHTML = '🤖 در حال تحلیل سوال شما...';
    
    // شبیه‌سازی تأخیر
    setTimeout(() => {
        let response = '';
        
        if (question.includes('نفت') && question.includes('طلا')) {
            response = 'بر اساس داده‌های فعلی، افزایش نفت معمولاً منجر به تورم و رشد طلا می‌شود. اگر نفت ۵٪ بالا برود، انتظار رشد ۱-۲٪ در طلا داریم.';
        } else if (question.includes('بیت‌کوین') && question.includes('طلا')) {
            response = 'طلای دیجیتال (بیت‌کوین) و طلای فیزیکی گاهی رابطه معکوس دارند. وقتی طلا نزولی است، ممکن است سرمایه به سمت رمزارزها حرکت کند.';
        } else if (question.includes('دلار') && question.includes('نفت')) {
            response = 'قدرت دلار آمریکا معمولاً با قیمت نفت رابطه معکوس دارد. دلار قوی → نفت ارزان‌تر، دلار ضعیف → نفت گران‌تر.';
        } else {
            response = 'بر اساس تحلیل فعلی، بازار روند صعودی دارد. نفت و طلا هر دو در حال رشد هستند که نشان‌دهنده تورم احتمالی است. پیشنهاد می‌کنم موقعیت‌های کوتاه‌مدت در نظر بگیرید.';
        }
        
        responseDiv.innerHTML = `
            <strong>سوال شما:</strong> ${question}<br><br>
            <strong>🤖 تحلیل هوش مصنوعی:</strong> ${response}
        `;
    }, 2000);
}

// اجرای اولیه
updateDateTime();
setupCategories();
simulateRealData();

// آپدیت دوره‌ای
setInterval(updateDateTime, 1000);
setInterval(simulateRealData, 30000); // هر ۳۰ ثانیه آپدیت
