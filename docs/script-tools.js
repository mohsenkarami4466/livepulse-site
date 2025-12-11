// ==================== //
// 🛠️ بخش ابزارها
// ==================== //
// 🛠️ بخش ابزارها
// ==================== //

/**
 * 🛠️ فعال‌سازی ابزار مشخص
 */
function activateTool(toolId) {
    // مخفی کردن همه ابزارها
    document.querySelectorAll('.tool-section').forEach(tool => {
        tool.classList.remove('active-tool');
    });
    
    // 🆕 مطمئن شو محتوای ابزار نمایش داده بشه
    const toolsContent = document.querySelector('.tools-content');
    if (toolsContent) {
        toolsContent.style.display = 'block';
    }
    
    // فعال‌سازی ابزار انتخاب شده
    const targetTool = document.getElementById(toolId + 'Section');
    if (targetTool) {
        targetTool.classList.add('active-tool');
        appState.currentTool = toolId;
    }
    
    // آپدیت هایلایت‌های ابزار
    document.querySelectorAll('[data-tool]').forEach(circle => {
        circle.classList.remove('active');
    });
    document.querySelector(`[data-tool="${toolId}"]`).classList.add('active');
    
    // 🆕 اگر صندوق شخصی انتخاب شد، دارایی‌ها رو آپدیت کن
    if (toolId === 'personalFund') {
        updatePortfolioDisplay();
    }
}

/**
 * 📊 آپدیت نمایش مجموع دارایی‌ها
 */
function updateAssetsDisplay() {
    const totalAssets = document.getElementById('totalAssets');
    const goldAmount = document.getElementById('goldAmount');
    const usdAmount = document.getElementById('usdAmount');
    const btcAmount = document.getElementById('btcAmount');
    
    if (totalAssets) totalAssets.textContent = '۰ ریال';
    if (goldAmount) goldAmount.textContent = '۰ گرم';
    if (usdAmount) usdAmount.textContent = '۰ دلار';
    if (btcAmount) btcAmount.textContent = '۰ BTC';
}

/**
 * ➕ افزودن دارایی به صندوق
 */
function addAssetToPortfolio() {
    const marketType = document.getElementById('marketType')?.value;
    const assetAmount = parseFloat(document.getElementById('assetAmount')?.value) || 0;
    
    if (!marketType || assetAmount <= 0) {
        alert('⚠️ لطفا نوع بازار و مقدار را وارد کنید');
        return;
    }
    
    // دریافت دارایی‌های موجود از localStorage
    let portfolio = JSON.parse(localStorage.getItem('userPortfolio') || '[]');
    
    // بررسی اینکه آیا این دارایی قبلاً اضافه شده
    const existingIndex = portfolio.findIndex(item => item.marketType === marketType);
    
    if (existingIndex >= 0) {
        // اگر موجود است، مقدار را به‌روزرسانی کن
        portfolio[existingIndex].amount += assetAmount;
    } else {
        // اگر جدید است، اضافه کن
        portfolio.push({
            marketType,
            amount: assetAmount,
            addedAt: new Date().toISOString()
        });
    }
    
    // ذخیره در localStorage
    localStorage.setItem('userPortfolio', JSON.stringify(portfolio));
    
    // به‌روزرسانی نمایش
    updatePortfolioDisplay();
    
    // پاک کردن فرم
    const form = document.getElementById('portfolioAssetForm');
    if (form) form.reset();
    
    alert('✅ دارایی با موفقیت اضافه شد');
}

/**
 * 📊 به‌روزرسانی نمایش صندوق
 */
function updatePortfolioDisplay() {
    const portfolio = JSON.parse(localStorage.getItem('userPortfolio') || '[]');
    const assetsGrid = document.getElementById('assetsGrid');
    const totalPortfolioValue = document.getElementById('totalPortfolioValue');
    
    if (!assetsGrid) return;
    
    if (portfolio.length === 0) {
        assetsGrid.innerHTML = `
            <div class="empty-assets">
                <span>📦</span>
                <p>هنوز دارایی ثبت نکردی</p>
                <small>از فرم پایین دارایی اضافه کن</small>
            </div>
        `;
        if (totalPortfolioValue) totalPortfolioValue.textContent = '۰';
        return;
    }
    
    // نمایش دارایی‌ها
    let totalValue = 0;
    assetsGrid.innerHTML = portfolio.map((asset, index) => {
        // محاسبه ارزش (نمونه)
        const price = getAssetPrice(asset.marketType);
        const value = asset.amount * price;
        totalValue += value;
        
        return `
            <div class="asset-item">
                <div class="asset-info">
                    <span class="asset-name">${getAssetName(asset.marketType)}</span>
                    <span class="asset-amount">${asset.amount} ${getAssetUnit(asset.marketType)}</span>
                </div>
                <div class="asset-value">${formatPrice(value, 'IRR')}</div>
                <button class="asset-remove" onclick="removeAssetFromPortfolio(${index})">🗑️</button>
            </div>
        `;
    }).join('');
    
    if (totalPortfolioValue) {
        totalPortfolioValue.textContent = formatPrice(totalValue, 'IRR').replace(' تومان', '');
    }
    
    // به‌روزرسانی کارت مجموع دارایی‌ها در header
    if (typeof window !== 'undefined' && window.updatePortfolioSummaryValue) {
        const formattedValue = formatPrice(totalValue, 'IRR');
        
        // محاسبه تغییر نسبت به گذشته
        const previousValue = parseFloat(localStorage.getItem('portfolio-previous-value') || '0');
        let change = { value: 0, percent: 0, isUp: true };
        
        if (previousValue > 0) {
            const changeValue = totalValue - previousValue;
            const changePercent = ((changeValue / previousValue) * 100).toFixed(2);
            change = {
                value: changeValue,
                percent: Math.abs(changePercent),
                isUp: changeValue >= 0
            };
        } else {
            // ذخیره مقدار فعلی برای دفعه بعد
            localStorage.setItem('portfolio-previous-value', totalValue.toString());
        }
        
        window.updatePortfolioSummaryValue(formattedValue, change);
    }
}

/**
 * 🗑️ حذف دارایی از صندوق
 */
function removeAssetFromPortfolio(index) {
    let portfolio = JSON.parse(localStorage.getItem('userPortfolio') || '[]');
    portfolio.splice(index, 1);
    localStorage.setItem('userPortfolio', JSON.stringify(portfolio));
    updatePortfolioDisplay();
}

/**
 * 💰 دریافت قیمت دارایی
 */
function getAssetPrice(marketType) {
    const cfg = window.CONFIG || CONFIG;
    const prices = {
        'BTC': 42000000,
        'ETH': 2500000,
        'USDT': 58000,
        'GOLD18': cfg.PRICES?.GOLD?.BASE_PRICE_24 * 0.75 || 2000000,
        'GOLD24': cfg.PRICES?.GOLD?.BASE_PRICE_24 || 2500000,
        'COIN': cfg.PRICES?.GOLD?.BASE_PRICE_24 * 1.1 || 2750000,
        'USD': 58000,
        'EUR': 62000,
        'GBP': 72000
    };
    return prices[marketType] || 0;
}

/**
 * 📝 دریافت نام دارایی
 */
function getAssetName(marketType) {
    const names = {
        'BTC': 'بیت‌کوین',
        'ETH': 'اتریوم',
        'USDT': 'تتر',
        'GOLD18': 'طلای ۱۸ عیار',
        'GOLD24': 'طلای ۲۴ عیار',
        'COIN': 'سکه امامی',
        'USD': 'دلار آمریکا',
        'EUR': 'یورو',
        'GBP': 'پوند انگلیس'
    };
    return names[marketType] || marketType;
}

/**
 * 📏 دریافت واحد دارایی
 */
function getAssetUnit(marketType) {
    const units = {
        'BTC': 'BTC',
        'ETH': 'ETH',
        'USDT': 'USDT',
        'GOLD18': 'گرم',
        'GOLD24': 'گرم',
        'COIN': 'عدد',
        'USD': 'دلار',
        'EUR': 'یورو',
        'GBP': 'پوند'
    };
    return units[marketType] || '';
}

/**
 * 🥇 محاسبه قیمت طلا
 */
function calculateGoldPrice() {
    if (!checkUsageLimit('tools')) return;
    
    const cfg = window.CONFIG || CONFIG;
    const weight = parseFloat(document.getElementById('goldWeight').value) || 0;
    const carat = parseInt(document.getElementById('goldCarat').value) || cfg.TOOLS.GOLD.DEFAULT_CARAT;
    const wage = parseFloat(document.getElementById('goldWage').value) || cfg.TOOLS.GOLD.DEFAULT_WAGE;
    
    if (weight <= 0) {
        elements.goldResult.innerHTML = '<div class="error">⚠️ لطفا وزن را وارد کنید</div>';
        return;
    }
    
    // قیمت پایه طلای ۲۴ عیار (تومان)
    const basePrice24 = cfg.PRICES.GOLD.BASE_PRICE_24;
    const caratRatio = carat / 24;
    const basePrice = basePrice24 * caratRatio * weight;
    const wageAmount = basePrice * (wage / 100);
    const finalPrice = basePrice + wageAmount;
    
    elements.goldResult.innerHTML = `
        <div class="success">
            <h4>💰 نتیجه محاسبه:</h4>
            <p>قیمت طلای ${carat} عیار: ${formatPrice(finalPrice, 'IRR')}</p>
            <p>وزن: ${weight} گرم</p>
            <p>اجرت: ${wage}%</p>
            <small>🕒 قیمت لحظه‌ای: ${formatPrice(basePrice24, 'IRR')} برای طلای ۲۴ عیار</small>
        </div>
    `;
    
    incrementUsage('tools');
}

/**
 * 💎 آنالیز الماس از روی عکس
 */
function analyzeDiamond() {
    if (!checkUsageLimit('tools')) return;
    
    const fileInput = document.getElementById('diamondImage');
    
    if (!fileInput.files.length) {
        elements.diamondResult.innerHTML = '<div class="error">⚠️ لطفا عکس الماس را انتخاب کنید</div>';
        return;
    }
    
    elements.diamondResult.innerHTML = `
        <div class="loading">
            🔍 در حال آنالیز تصویر...
        </div>
    `;
    
    // شبیه‌سازی پردازش تصویر
    setTimeout(() => {
        const results = {
            quality: 'عالی',
            carat: 1.2,
            color: 'D',
            clarity: 'IF',
            estimatedPrice: 85000000
        };
        
        elements.diamondResult.innerHTML = `
            <div class="success">
                <h4>💎 نتیجه آنالیز الماس:</h4>
                <p>کیفیت: ${results.quality}</p>
                <p>قیراط: ${results.carat}</p>
                <p>رنگ: ${results.color}</p>
                <p>شفافیت: ${results.clarity}</p>
                <p>💰 قیمت تخمینی: ${formatPrice(results.estimatedPrice, 'IRR')}</p>
                <small>📍 این تحلیل نمونه است. در نسخه نهایی از هوش مصنوعی استفاده می‌شود</small>
            </div>
        `;
        
        incrementUsage('tools');
    }, 2000);
}

/**
 * 🥈 محاسبه قیمت نقره
 */
function calculateSilver() {
    if (!checkUsageLimit('tools')) return;
    
    const cfg = window.CONFIG || CONFIG;
    const weight = parseFloat(document.getElementById('silverWeight')?.value) || 0;
    const carat = parseInt(document.getElementById('silverCarat')?.value) || 999;
    const wage = parseFloat(document.getElementById('silverWage')?.value) || cfg.TOOLS.SILVER?.DEFAULT_WAGE || 5;
    
    if (weight <= 0) {
        const silverResult = document.getElementById('silverResult');
        if (silverResult) {
            silverResult.innerHTML = '<div class="error">⚠️ لطفا وزن را وارد کنید</div>';
        }
        return;
    }
    
    // قیمت پایه نقره 999 (تومان به ازای هر گرم)
    const basePrice999 = cfg.PRICES?.SILVER?.BASE_PRICE_999 || 50000;
    const caratRatio = carat / 999;
    const basePrice = basePrice999 * caratRatio * weight;
    const wageAmount = basePrice * (wage / 100);
    const finalPrice = basePrice + wageAmount;
    
    const silverResult = document.getElementById('silverResult');
    if (silverResult) {
        silverResult.innerHTML = `
            <div class="success">
                <h4>💰 نتیجه محاسبه:</h4>
                <p>قیمت نقره ${carat} عیار: ${formatPrice(finalPrice, 'IRR')}</p>
                <p>وزن: ${weight} گرم</p>
                <p>اجرت: ${wage}%</p>
                <small>🕒 قیمت لحظه‌ای: ${formatPrice(basePrice999, 'IRR')} برای نقره 999 عیار</small>
            </div>
        `;
    }
    
    incrementUsage('tools');
}

/**
 * 💠 آنالیز سنگ قیمتی از روی عکس
 */
function analyzeGem() {
    if (!checkUsageLimit('tools')) return;
    
    const fileInput = document.getElementById('gemlImage');
    
    if (!fileInput || !fileInput.files.length) {
        const gemlResult = document.getElementById('gemlResult');
        if (gemlResult) {
            gemlResult.innerHTML = '<div class="error">⚠️ لطفا عکس سنگ را انتخاب کنید</div>';
        }
        return;
    }
    
    const gemlResult = document.getElementById('gemlResult');
    if (gemlResult) {
        gemlResult.innerHTML = `
            <div class="loading">
                🔍 در حال آنالیز تصویر...
            </div>
        `;
    }
    
    // شبیه‌سازی پردازش تصویر
    setTimeout(() => {
        const results = {
            type: 'یاقوت قرمز',
            quality: 'عالی',
            carat: 2.5,
            color: 'قرمز عمیق',
            clarity: 'VS1',
            estimatedPrice: 120000000
        };
        
        if (gemlResult) {
            gemlResult.innerHTML = `
                <div class="success">
                    <h4>💠 نتیجه آنالیز سنگ:</h4>
                    <p>نوع: ${results.type}</p>
                    <p>کیفیت: ${results.quality}</p>
                    <p>قیراط: ${results.carat}</p>
                    <p>رنگ: ${results.color}</p>
                    <p>شفافیت: ${results.clarity}</p>
                    <p>💰 قیمت تخمینی: ${formatPrice(results.estimatedPrice, 'IRR')}</p>
                    <small>📍 این تحلیل نمونه است. در نسخه نهایی از هوش مصنوعی استفاده می‌شود</small>
                </div>
            `;
        }
        
        incrementUsage('tools');
    }, 2000);
}

/**
 * 🔄 تبدیل ارز
 */
function convertCurrency() {
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    const amount = parseFloat(document.getElementById('amount').value) || 0;
    
    if (amount <= 0) {
        elements.conversionResult.textContent = '⚠️ مبلغ را وارد کنید';
        return;
    }
    
    const fromRate = sampleData.exchangeRates[fromCurrency];
    const toRate = sampleData.exchangeRates[toCurrency];
    
    if (fromCurrency === 'IRR') {
        // تبدیل از ریال به ارز دیگر
        const result = amount / toRate;
        elements.conversionResult.textContent = `${result.toFixed(4)} ${toCurrency}`;
    } else if (toCurrency === 'IRR') {
        // تبدیل از ارز دیگر به ریال
        const result = amount * fromRate;
        elements.conversionResult.textContent = `${formatPrice(result, 'IRR')}`;
    } else {
        // تبدیل بین دو ارز خارجی
        const result = (amount * fromRate) / toRate;
        elements.conversionResult.textContent = `${result.toFixed(4)} ${toCurrency}`;
    }
}

/**
 * 🪙 آنالیز سکه قدیمی
 */
function analyzeCoin() {
    if (!checkUsageLimit('tools')) return;
    
    const fileInput = document.getElementById('coinImage');
    
    if (!fileInput.files.length) {
        elements.coinResult.innerHTML = '<div class="error">⚠️ لطفا عکس سکه را انتخاب کنید</div>';
        return;
    }
    
    elements.coinResult.innerHTML = `
        <div class="loading">
            🔍 در حال آنالیز سکه...
        </div>
    `;
    
    // شبیه‌سازی پردازش تصویر
    setTimeout(() => {
        const results = {
            type: 'سکه پهلوی',
            year: '۱۳۰۵',
            material: 'نقره',
            condition: 'خوب',
            estimatedPrice: 2500000
        };
        
        elements.coinResult.innerHTML = `
            <div class="success">
                <h4>🪙 نتیجه آنالیز سکه:</h4>
                <p>نوع: ${results.type}</p>
                <p>سال: ${results.year}</p>
                <p>جنس: ${results.material}</p>
                <p>وضعیت: ${results.condition}</p>
                <p>💰 قیمت تخمینی: ${formatPrice(results.estimatedPrice, 'IRR')}</p>
                <small>📍 این تحلیل نمونه است. در نسخه نهایی از هوش مصنوعی استفاده می‌شود</small>
            </div>
        `;
        
        incrementUsage('tools');
    }, 2000);
}

// ==================== //
// 📰 مدیریت سیستم اخبار //
// ==================== //

/**
 * 📡 لود اخبار بر اساس دسته‌بندی
 */
function loadNews(category = 'all') {
    const newsFeed = document.getElementById('newsFeed');
    
    if (!newsFeed) {
        const log = window.logger || { warn: console.warn }; log.warn('⚠️ newsFeed element پیدا نشد!');
        return;
    }
    
    // چک مجدد قبل از set innerHTML
    if (!newsFeed || !newsFeed.innerHTML) {
        const log = window.logger || { warn: console.warn }; log.warn('⚠️ newsFeed element معتبر نیست!');
        return;
    }
    
    // نمایش حالت لودینگ
    try {
        if (newsFeed) {
            newsFeed.innerHTML = `
            <div class="news-placeholder">
                <div class="loading-news">
                    <div class="spinner"></div>
                    <p>📡 در حال دریافت اخبار ${getCategoryName(category)}...</p>
                </div>
            </div>
        `;
        }
        
        // شبیه‌سازی دریافت اخبار
        setTimeout(() => {
            displayNews(generateSampleNews(category));
        }, 1500);
    } catch (error) {
        const log = window.logger || { error: console.error }; log.error('❌ خطا در loadNews:', error);
    }
}

/**
 * 🎴 نمایش اخبار در صفحه
 */
function displayNews(news) {
    const newsFeed = document.getElementById('newsFeed');
    
    if (!newsFeed) {
        const log = window.logger || { warn: console.warn }; log.warn('⚠️ newsFeed element پیدا نشد در displayNews!');
        return;
    }
    
    if (news.length === 0) {
        try {
            newsFeed.innerHTML = `
                <div class="news-placeholder">
                    <p>📭 خبری در این دسته‌بندی یافت نشد</p>
                </div>
            `;
        } catch (error) {
            const log = window.logger || { error: console.error }; log.error('❌ خطا در displayNews (خالی):', error);
        }
        return;
    }
    
    try {
        if (!newsFeed) {
            const log = window.logger || { warn: console.warn }; log.warn('⚠️ newsFeed element پیدا نشد!');
            return;
        }
        newsFeed.innerHTML = news.map(item => `
        <div class="news-card" data-category="${item.category}">
            <span class="news-category ${item.category}">${getCategoryName(item.category)}</span>
            <h3 class="news-title">${item.title}</h3>
            <p class="news-summary">${item.summary}</p>
            <div class="news-meta">
                <span class="news-source">${item.source}</span>
                <span class="news-time">${item.time}</span>
            </div>
        </div>
    `).join('');
    } catch (error) {
        const log = window.logger || { error: console.error }; log.error('❌ خطا در displayNews:', error);
    }
}

/**
 * 📋 تولید اخبار نمونه
 */
function generateSampleNews(category) {
    const sampleNews = {
        all: [
            {
                category: 'forex',
                title: 'بانک مرکزی اروپا سیاست پولی خود را تغییر داد',
                summary: 'نرخ بهره اصلی بدون تغییر باقی ماند اما سیگنال‌هایی از کاهش در آینده نزدیک مشاهده می‌شود.',
                source: 'ForexLive',
                time: '۲ ساعت پیش'
            },
            {
                category: 'crypto',
                title: 'بیت‌کوین به مرز ۴۵,۰۰۰ دلار نزدیک شد',
                summary: 'رشد ۵ درصدی در ۲۴ ساعت گذشته همراه با افزایش حجم معاملات.',
                source: 'CoinDesk',
                time: '۱ ساعت پیش'
            }
        ],
        forex: [
            {
                category: 'forex',
                title: 'دلار آمریکا در برابر یورو تقویت شد',
                summary: 'شاخص دلار ۰.۳ درصد رشد کرد در حالی که EUR/USD به ۱.۰۸۵۰ رسید.',
                source: 'Bloomberg',
                time: '۳۰ دقیقه پیش'
            }
        ],
        crypto: [
            {
                category: 'crypto',
                title: 'اتریوم رشد ۸ درصدی را تجربه کرد',
                summary: 'ارتقای شبکه و افزایش فعالیت‌های DeFi محرک اصلی رشد قیمت بوده است.',
                source: 'CryptoSlate',
                time: '۴۵ دقیقه پیش'
            }
        ]
    };
    
    return category === 'all' ? sampleNews.all : (sampleNews[category] || []);
}

/**
 * 🏷️ دریافت نام فارسی دسته‌بندی
 */
function getCategoryName(category) {
    const names = {
        'all': 'همه',
        'forex': 'فارکس',
        'crypto': 'رمزارز',
        'iran-stock': 'بورس ایران',
        'global-stock': 'بورس جهانی',
        'commodities': 'کالاها',
        'macro': 'اقتصاد کلان'
    };
    
    return names[category] || category;
}

/**
 * ⚙️ راه‌اندازی سیستم اخبار
 */
function setupNewsSystem() {
    // لود اخبار اولیه
    loadNews('all');
    
    // ایونت‌لیستنر برای فیلترها
    document.querySelectorAll('.news-filter').forEach(filter => {
        filter.addEventListener('click', function() {
            // آپدیت فیلتر فعال
            document.querySelectorAll('.news-filter').forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            // لود اخبار دسته‌بندی انتخاب شده
            const category = this.getAttribute('data-category');
            loadNews(category);
        });
    });
}

// راه‌اندازی سیستم اخبار هنگام لود صفحه
// این listener قبلاً در initializeLivePulse اجرا می‌شود
// برای جلوگیری از duplicate، این را comment می‌کنیم
// document.addEventListener('DOMContentLoaded', function() {
//     if (document.getElementById('newsView')) {
//         setupNewsSystem();
//     }
// });

// ==================== //
// 💬 بخش چت هوش مصنوعی
// ==================== //

/**
 * 💬 ارسال پیام به چت
 */
function sendChatMessage() {
    if (!checkUsageLimit('chat')) return;
    
    const message = elements.chatInput.value.trim();
    if (!message) return;
    
    // اضافه کردن پیام کاربر
    addChatMessage(message, 'user');
    elements.chatInput.value = '';
    
    // شبیه‌سازی پاسخ هوش مصنوعی
    simulateAIResponse(message);
    
    incrementUsage('chat');
    updateUsageDisplay();
}

/**
 * 🤖 شبیه‌سازی پاسخ هوش مصنوعی
 */
function simulateAIResponse(userMessage) {
    // نمایش وضعیت در حال پردازش
    const thinkingMessage = addChatMessage('🤔 در حال تحلیل سوال شما...', 'ai');
    
    setTimeout(() => {
        // حذف پیام "در حال پردازش"
        thinkingMessage.remove();
        
        // تولید پاسخ نمونه
        const responses = [
            `بر اساس تحلیل من از بازار، شرایط فعلی مناسب به نظر می‌رسد.`,
            `پیشنهاد می‌کنم در تصمیم‌گیری‌های مالی احتیاط کنید.`,
            `تحلیل تکنیکال نشان‌دهنده روند صعودی در کوتاه‌مدت است.`,
            `با توجه به اخبار اخیر، ممکن است نوساناتی در بازار ایجاد شود.`
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const fullResponse = `سوال شما: "${userMessage}"\n\n${randomResponse}\n\n📍 این پاسخ نمونه است و از n8n دریافت خواهد شد.`;
        
        addChatMessage(fullResponse, 'ai');
    }, 1500);
}

/**
 * 💬 اضافه کردن پیام به چت
 */
function addChatMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `${sender}-message`;
    messageDiv.innerHTML = `<p>${text}</p>`;
    
    elements.chatMessages.appendChild(messageDiv);
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
    
    return messageDiv;
}

// ==================== //
// ⚙️ ابزارهای کمکی
// ==================== //

/**
 * 💰 فرمت‌دهی قیمت
 */
function formatPrice(price, symbol) {
    if (symbol === 'IRR' || price > 1000) {
        return new Intl.NumberFormat('fa-IR').format(Math.round(price)) + ' تومان';
    } else if (price < 1) {
        return '$' + price.toFixed(4);
    } else {
        return '$' + new Intl.NumberFormat('en-US').format(price.toFixed(2));
    }
}

// Export توابع به window برای استفاده در React
if (typeof window !== 'undefined') {
    window.calculateGoldPrice = calculateGoldPrice;
    window.calculateSilver = calculateSilver;
    window.analyzeDiamond = analyzeDiamond;
    window.analyzeGem = analyzeGem;
    window.analyzeCoin = analyzeCoin;
    window.convertCurrency = convertCurrency;
    window.activateTool = activateTool;
    window.addAssetToPortfolio = addAssetToPortfolio;
    window.updatePortfolioDisplay = updatePortfolioDisplay;
    window.removeAssetFromPortfolio = removeAssetFromPortfolio;
}

/**
 * ✅ بررسی محدودیت استفاده
 */
function checkUsageLimit(type) {
    const cfg = window.CONFIG || CONFIG;
    const limit = type === 'chat' ? cfg.TOOLS.USAGE_LIMIT.CHAT : cfg.TOOLS.USAGE_LIMIT.TOOLS;
    if (appState.userUsage[type] >= limit) {
        alert(`⚠️ شما از ${type === 'chat' ? 'چت' : 'ابزار'} رایگان خود استفاده کرده‌اید. لطفا اشتراک خریداری کنید.`);
        return false;
    }
    return true;
}

/**
 * 📈 افزایش شمارنده استفاده
 */
function incrementUsage(type) {
    appState.userUsage[type]++;
    saveUserState();
}

/**
 * 🔢 آپدیت نمایش استفاده
 */
function updateUsageDisplay() {
    elements.chatUsage.textContent = appState.userUsage.chat;
}

// ==================== //
// 🎛️ تنظیم ایونت‌لیستنرها
// ==================== //

/**
 * 🖥️ تغییر حالت تمام صفحه برای کل سایت - ساده و تمیز مثل مرورگر
 */
function toggleSiteFullscreen() {
    const isFullscreen = !!(document.fullscreenElement || 
                           document.webkitFullscreenElement || 
                           document.mozFullScreenElement || 
                           document.msFullscreenElement);
    
    if (!isFullscreen) {
        // ورود به حالت تمام صفحه - فقط از Fullscreen API استفاده می‌کنیم
        const element = document.documentElement;
        
        if (element.requestFullscreen) {
            element.requestFullscreen().catch(err => {
                const log = window.logger || { warn: console.warn }; log.warn('خطا در ورود به حالت تمام صفحه:', err);
            });
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        } else {
            const log = window.logger || { warn: console.warn }; log.warn('مرورگر شما از Fullscreen API پشتیبانی نمی‌کند');
        }
    } else {
        // خروج از حالت تمام صفحه
        if (document.exitFullscreen) {
            document.exitFullscreen().catch(err => {
                const log = window.logger || { warn: console.warn }; log.warn('خطا در خروج از حالت تمام صفحه:', err);
            });
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

/**
 * 🔄 مدیریت تغییر حالت تمام صفحه - برای به‌روزرسانی آیکون
 */
function handleFullscreenChange() {
    const isFullscreen = !!(document.fullscreenElement || 
                           document.webkitFullscreenElement || 
                           document.mozFullScreenElement || 
                           document.msFullscreenElement);
    
    const fullscreenToggle = document.getElementById('fullscreenToggle');
    const fullscreenIcon = fullscreenToggle?.querySelector('.fullscreen-icon');
    
    if (fullscreenIcon) {
        // تغییر آیکون بر اساس حالت
        fullscreenIcon.textContent = isFullscreen ? '⛶' : '⛶';
        fullscreenToggle.title = isFullscreen ? 'خروج از تمام صفحه' : 'تمام صفحه';
    }
}

