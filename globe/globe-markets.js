/**
 * ============================================
 * 💹 Globe Markets - Market Functions
 * ============================================
 * 
 * این فایل شامل تمام توابع مربوط به بازارهای مالی است.
 * This file contains all functions related to financial markets.
 * 
 * وابستگی‌ها / Dependencies:
 * - THREE.js (THREE.Vector3, THREE.Vector2)
 * - globe-helpers.js (addEventListenerOnce)
 * - window.marketData (داده‌های بازارها)
 * - window.simpleGlobeScenes (scene های کره‌ها)
 * - window.logger (optional)
 * - window.errorHandler (optional)
 * 
 * استفاده / Usage:
 * این فایل باید بعد از globe-helpers.js و globe-clock.js لود شود.
 * This file should be loaded after globe-helpers.js and globe-clock.js.
 * 
 * توابع اصلی / Main Functions:
 * - getMarketStatusInfo: دریافت وضعیت بازار (باز/بسته/در حال باز شدن/در حال بسته شدن)
 * - getMarketStatusColor: دریافت رنگ وضعیت بازار
 * - zoomToMarker: زوم به بازار انتخاب شده روی کره
 * - showMarketPopup: نمایش پنجره اطلاعات بازار
 * - populateMarketList: پر کردن لیست بازارها
 * - selectMarketFromList: انتخاب بازار از لیست
 * - setupMarketSelector: راه‌اندازی دکمه انتخاب بازار
 * - getUserTimezone: دریافت منطقه زمانی کاربر
 * - convertUTCtoLocal: تبدیل زمان UTC به زمان محلی
 * - saveMarketNotification: ذخیره تنظیمات اعلان بازار
 * - startMarketNotificationChecker: شروع چک کردن زمان‌های بازار برای اعلان
 * - checkMarketNotifications: چک کردن زمان‌های بازار
 * - sendMarketNotification: ارسال اعلان بازار
 * 
 * Export ها / Exports:
 * تمام توابع به window export می‌شوند برای استفاده در سایر فایل‌ها.
 * All functions are exported to window for use in other files.
 * 
 * ============================================
 */

/**
 * 📊 دریافت اطلاعات وضعیت بازار
 * Get market status information
 * 
 * این تابع وضعیت فعلی بازار را بر اساس زمان UTC محاسبه می‌کند.
 * This function calculates the current market status based on UTC time.
 * 
 * @param {Object} market - شیء بازار شامل open, close, coords
 * @returns {Object} - شیء شامل status, isOpen, coreColor, glowColor, label
 * 
 * وضعیت‌ها / Statuses:
 * - 'opening': در حال باز شدن (1 ساعت قبل از باز شدن)
 * - 'closing': در حال بسته شدن (1 ساعت قبل از بسته شدن)
 * - 'open': باز
 * - 'closed': بسته
 * 
 * رنگ‌ها / Colors:
 * - opening: 0xffdd00 (زرد)
 * - closing: 0xff8800 (نارنجی)
 * - open: 0x00ff00 (سبز)
 * - closed: 0xff0000 (قرمز)
 */
function getMarketStatusInfo(market) {
    const now = new Date();
    const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
    
    const [openH, openM] = market.open.split(':').map(Number);
    const [closeH, closeM] = market.close.split(':').map(Number);
    const openMin = openH * 60 + openM;
    const closeMin = closeH * 60 + closeM;
    
    // در حال باز شدن (1 ساعت قبل از باز شدن)
    // Opening soon (1 hour before opening)
    if (utcMinutes >= openMin - 60 && utcMinutes < openMin) {
        return {
            status: 'opening',
            isOpen: false,
            coreColor: 0xffdd00,    // زرد پررنگ / Bright yellow
            glowColor: 0xffdd00,
            label: 'در حال باز شدن'
        };
    }
    // در حال بسته شدن (1 ساعت قبل از بسته شدن)
    // Closing soon (1 hour before closing)
    if (utcMinutes >= closeMin - 60 && utcMinutes < closeMin) {
        return {
            status: 'closing',
            isOpen: true,
            coreColor: 0xff8800,    // نارنجی پررنگ / Bright orange
            glowColor: 0xff8800,
            label: 'در حال بسته شدن'
        };
    }
    // باز / Open
    if (utcMinutes >= openMin && utcMinutes < closeMin) {
        return {
            status: 'open',
            isOpen: true,
            coreColor: 0x00ff00,    // سبز پررنگ / Bright green
            glowColor: 0x00ff00,
            label: 'باز'
        };
    }
    // بسته / Closed
    return {
        status: 'closed',
        isOpen: false,
        coreColor: 0xff0000,    // قرمز پررنگ / Bright red
        glowColor: 0xff0000,
        label: 'بسته'
    };
}

/**
 * 🎨 دریافت رنگ وضعیت بازار (نسخه ساده)
 * Get market status color (simple version)
 * 
 * این تابع برای سازگاری با کدهای قدیمی است.
 * This function is for compatibility with old code.
 * 
 * @param {Object} market - شیء بازار
 * @returns {number} - رنگ hex وضعیت بازار
 */
function getMarketStatusColor(market) {
    return getMarketStatusInfo(market).coreColor;
}

/**
 * 🎯 زوم به مارکر بازار انتخاب شده
 * Zoom to selected market marker
 * 
 * این تابع دوربین را به سمت بازار انتخاب شده می‌برد.
 * This function moves the camera to the selected market.
 * 
 * @param {Object} market - شیء بازار شامل coords
 * @param {THREE.PerspectiveCamera} camera - دوربین کره
 * @param {THREE.OrbitControls} controls - کنترل‌های کره
 * @param {THREE.Mesh} earth - کره زمین
 * 
 * وابستگی‌ها / Dependencies:
 * - THREE.js (THREE.Vector3)
 * - requestAnimationFrame
 */
function zoomToMarker(market, camera, controls, earth) {
    if (!market || !camera) return;
    
    const log = window.logger || { info: console.log }; 
    log.info(`🎯 زوم به: ${market.name} (${market.coords[0]}, ${market.coords[1]})`);
    
    const lat = market.coords[0];
    const lng = market.coords[1];
    
    // تبدیل lat/lng به موقعیت روی کره
    // Convert lat/lng to position on globe
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    
    // موقعیت نقطه روی کره
    // Point position on globe
    const targetX = -Math.sin(phi) * Math.cos(theta);
    const targetY = Math.cos(phi);
    const targetZ = Math.sin(phi) * Math.sin(theta);
    
    // ابتدا کره رو ریست کن به چرخش صفر
    // Reset globe rotation to zero first
    if (earth) earth.rotation.y = 0;
    
    // موقعیت نهایی دوربین (کمی دورتر از نقطه هدف)
    // Final camera position (slightly away from target point)
    const distance = 2.0;
    const targetCamPos = new THREE.Vector3(
        targetX * distance,
        targetY * distance,
        targetZ * distance
    );
    
    // انیمیشن / Animation
    const startCamPos = camera.position.clone();
    const duration = 1200;
    const startTime = Date.now();
    
    const animateCamera = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        
        // حرکت دوربین / Move camera
        camera.position.lerpVectors(startCamPos, targetCamPos, ease);
        camera.lookAt(0, 0, 0);
        
        if (controls) {
            controls.update();
        }
        
        if (progress < 1) {
            requestAnimationFrame(animateCamera);
        }
    };
    animateCamera();
}

/**
 * 📋 نمایش پنجره اطلاعات بازار
 * Show market information popup
 * 
 * این تابع یک پنجره شیشه‌ای (glassmorphism) با اطلاعات بازار نمایش می‌دهد.
 * This function displays a glassmorphism popup with market information.
 * 
 * @param {Object} market - شیء بازار شامل name, open, close, coords
 * @param {HTMLElement} container - container کره برای اضافه کردن popup
 * 
 * ویژگی‌ها / Features:
 * - نمایش وضعیت بازار (باز/بسته)
 * - نمایش ساعات کاری UTC و محلی
 * - نمایش زمان باقیمانده تا باز/بسته شدن
 * - تنظیمات اعلان
 * 
 * وابستگی‌ها / Dependencies:
 * - getUserTimezone
 * - convertUTCtoLocal
 * - window.saveMarketNotification
 */
function showMarketPopup(market, container) {
    // حذف popup قبلی / Remove previous popup
    const oldPopup = container.querySelector('.market-3d-popup');
    if (oldPopup) oldPopup.remove();
    
    // محاسبات زمان / Time calculations
    const now = new Date();
    const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
    const [openH, openM] = market.open.split(':').map(Number);
    const [closeH, closeM] = market.close.split(':').map(Number);
    const openMin = openH * 60 + openM;
    const closeMin = closeH * 60 + closeM;
    
    // بررسی وضعیت بازار / Check market status
    let isOpen = false;
    if (closeMin > openMin) {
        isOpen = utcMinutes >= openMin && utcMinutes < closeMin;
    } else {
        // بازار شبانه (مثلا 22:00 - 07:00) / Overnight market (e.g. 22:00 - 07:00)
        isOpen = utcMinutes >= openMin || utcMinutes < closeMin;
    }
    
    // محاسبه زمان محلی کاربر / Calculate user local time
    const userTimezone = getUserTimezone();
    const userOffset = userTimezone.offset;
    const localOpenTime = convertUTCtoLocal(market.open, userOffset);
    const localCloseTime = convertUTCtoLocal(market.close, userOffset);
    
    // محاسبه زمان باقیمانده / Calculate remaining time
    let timeRemaining = '';
    if (isOpen) {
        const minutesLeft = closeMin > utcMinutes ? closeMin - utcMinutes : (1440 - utcMinutes + closeMin);
        const hoursLeft = Math.floor(minutesLeft / 60);
        const minsLeft = minutesLeft % 60;
        timeRemaining = `⏱️ ${hoursLeft} ساعت و ${minsLeft} دقیقه تا بسته شدن`;
    } else {
        let minutesToOpen = openMin > utcMinutes ? openMin - utcMinutes : (1440 - utcMinutes + openMin);
        const hoursToOpen = Math.floor(minutesToOpen / 60);
        const minsToOpen = minutesToOpen % 60;
        timeRemaining = `⏱️ ${hoursToOpen} ساعت و ${minsToOpen} دقیقه تا باز شدن`;
    }
    
    // بارگذاری تنظیمات ناتیفیکیشن قبلی / Load previous notification settings
    const savedNotifications = JSON.parse(localStorage.getItem('marketNotifications') || '{}');
    const savedSetting = savedNotifications[market.name] || {};
    const isNotifyEnabled = savedSetting.enabled || false;
    const notifyMinutes = savedSetting.minutesBefore || 15;
    
    const popup = document.createElement('div');
    popup.className = 'market-3d-popup glass-popup';
    popup.innerHTML = `
        <div class="glass-popup-header">
            <div class="popup-status-badge ${isOpen ? 'open' : 'closed'}">
                ${isOpen ? '🟢 باز' : '🔴 بسته'}
            </div>
            <button class="glass-popup-close" onclick="this.closest('.market-3d-popup').remove()">×</button>
        </div>
        
        <h3 class="glass-popup-title">${market.name}</h3>
        <p class="popup-time-remaining">${timeRemaining}</p>
        
        <div class="glass-popup-section">
            <h4>🕐 ساعات کاری (UTC)</h4>
            <div class="time-grid">
                <div class="time-item">
                    <span class="time-label">باز شدن</span>
                    <span class="time-value">${market.open}</span>
                </div>
                <div class="time-item">
                    <span class="time-label">بسته شدن</span>
                    <span class="time-value">${market.close}</span>
                </div>
            </div>
        </div>
        
        <div class="glass-popup-section">
            <h4>📍 ساعت محلی شما (${userTimezone.name})</h4>
            <div class="time-grid">
                <div class="time-item local">
                    <span class="time-label">باز شدن</span>
                    <span class="time-value">${localOpenTime}</span>
                </div>
                <div class="time-item local">
                    <span class="time-label">بسته شدن</span>
                    <span class="time-value">${localCloseTime}</span>
                </div>
            </div>
        </div>
        
        <div class="glass-popup-section notification-section">
            <h4>🔔 اعلان‌ها</h4>
            <p class="notification-info">اعلان‌ها طبق ساعت محلی شما (${userTimezone.name}) ارسال می‌شوند</p>
            <div class="notification-row">
                <label class="toggle-switch">
                    <input type="checkbox" id="notify-${market.name.replace(/\s/g, '')}" ${isNotifyEnabled ? 'checked' : ''}>
                    <span class="toggle-slider"></span>
                </label>
                <span>اعلان قبل از باز شدن</span>
            </div>
            <select class="notify-time-select" ${!isNotifyEnabled ? 'disabled' : ''}>
                <option value="5" ${notifyMinutes === 5 ? 'selected' : ''}>5 دقیقه قبل</option>
                <option value="15" ${notifyMinutes === 15 ? 'selected' : ''}>15 دقیقه قبل</option>
                <option value="30" ${notifyMinutes === 30 ? 'selected' : ''}>30 دقیقه قبل</option>
                <option value="60" ${notifyMinutes === 60 ? 'selected' : ''}>1 ساعت قبل</option>
            </select>
        </div>
        
        <button class="glass-popup-save" onclick="saveMarketNotification('${market.name}', this)">
            💾 ذخیره و فعال‌سازی اعلان
        </button>
    `;
    
    container.appendChild(popup);
    
    // رویداد تغییر checkbox / Checkbox change event
    const checkbox = popup.querySelector('input[type="checkbox"]');
    const select = popup.querySelector('.notify-time-select');
    if (checkbox && select) {
        checkbox.addEventListener('change', () => {
            select.disabled = !checkbox.checked;
        });
    }
    
    // انیمیشن ورود / Entrance animation
    setTimeout(() => popup.classList.add('visible'), 10);
}

/**
 * ⏰ دریافت منطقه زمانی کاربر
 * Get user timezone
 * 
 * این تابع منطقه زمانی کاربر را از localStorage یا مرورگر دریافت می‌کند.
 * This function gets user timezone from localStorage or browser.
 * 
 * @returns {Object} - شیء شامل offset, name, offsetStr
 * 
 * ویژگی‌ها / Features:
 * - اول از localStorage چک می‌کند (اگر کاربر دستی تنظیم کرده)
 * - سپس از مرورگر تشخیص می‌دهد
 * - نام منطقه زمانی را به فارسی تبدیل می‌کند
 */
function getUserTimezone() {
    // اول چک کن آیا کاربر دستی تنظیم کرده
    // First check if user manually set timezone
    const savedTimezone = localStorage.getItem('userTimezone');
    if (savedTimezone) {
        try {
            return JSON.parse(savedTimezone);
        } catch (e) {
            // Ignore invalid timezone data
        }
    }
    
    // تشخیص خودکار / Auto detection
    const offset = -new Date().getTimezoneOffset();
    const hours = Math.floor(Math.abs(offset) / 60);
    const mins = Math.abs(offset) % 60;
    const sign = offset >= 0 ? '+' : '-';
    const offsetStr = `${sign}${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    
    // تلاش برای دریافت نام منطقه زمانی
    // Try to get timezone name
    let timezoneName = 'محلی';
    try {
        timezoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;
        // تبدیل به نام فارسی‌تر / Convert to Persian name
        if (timezoneName.includes('Tehran')) timezoneName = 'تهران';
        else if (timezoneName.includes('Dubai')) timezoneName = 'دبی';
        else if (timezoneName.includes('London')) timezoneName = 'لندن';
        else if (timezoneName.includes('New_York')) timezoneName = 'نیویورک';
        else if (timezoneName.includes('Tokyo')) timezoneName = 'توکیو';
        else timezoneName = `UTC${offsetStr}`;
    } catch (e) {
        timezoneName = `UTC${offsetStr}`;
    }
    
    return {
        offset: offset,
        name: timezoneName,
        offsetStr: offsetStr
    };
}

/**
 * 🔄 تبدیل زمان UTC به زمان محلی
 * Convert UTC time to local time
 * 
 * @param {string} utcTime - زمان UTC به فرمت "HH:MM"
 * @param {number} offsetMinutes - offset منطقه زمانی به دقیقه
 * @returns {string} - زمان محلی به فرمت "HH:MM"
 */
function convertUTCtoLocal(utcTime, offsetMinutes) {
    const [hours, mins] = utcTime.split(':').map(Number);
    let totalMins = hours * 60 + mins + offsetMinutes;
    
    // نرمالایز به 24 ساعت / Normalize to 24 hours
    while (totalMins < 0) totalMins += 1440;
    while (totalMins >= 1440) totalMins -= 1440;
    
    const localHours = Math.floor(totalMins / 60);
    const localMins = totalMins % 60;
    
    return `${localHours.toString().padStart(2, '0')}:${localMins.toString().padStart(2, '0')}`;
}

/**
 * 📍 درخواست مجوز لوکیشن
 * Request location permission
 * 
 * این تابع مجوز لوکیشن را از کاربر درخواست می‌کند.
 * This function requests location permission from user.
 * 
 * نکته: خطاهای Google Maps API را ignore می‌کند.
 * Note: Ignores Google Maps API errors.
 */
function requestLocationPermission() {
    // این خطا از مرورگر می‌آید و نمی‌توان آن را کاملاً suppress کرد
    // This error comes from browser and cannot be fully suppressed
    // اما می‌توانیم geolocation را optional کنیم
    // But we can make geolocation optional
    if ('geolocation' in navigator) {
        try {
            const options = { 
                enableHighAccuracy: false, 
                timeout: 5000, // کاهش timeout / Reduce timeout
                maximumAge: 300000 // 5 دقیقه cache / 5 minutes cache
            };
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const log = window.logger || { info: console.log }; 
                    log.info('📍 لوکیشن دریافت شد:', position.coords);
                    // ذخیره لوکیشن برای استفاده بعدی / Save location for later use
                    localStorage.setItem('userLocation', JSON.stringify({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        timestamp: Date.now()
                    }));
                },
                (error) => {
                    // خطای Google Maps API را ignore کن
                    // Ignore Google Maps API errors
                    if (error.message && (
                        error.message.includes('googleapis') || 
                        error.message.includes('Network location provider') ||
                        error.message.includes('403')
                    )) {
                        return;
                    }
                    // فقط خطاهای غیر از permission denied را نمایش بده
                    // Only show errors other than permission denied
                    if (error.code !== 1 && error.code !== error.PERMISSION_DENIED) {
                        const log = window.logger || { warn: console.warn }; 
                        log.warn('⚠️ خطا در دریافت لوکیشن:', error.message);
                    }
                },
                options
            );
        } catch (error) {
            // خطای Google Maps API را ignore کن
            // Ignore Google Maps API errors
            if (error.message && (
                error.message.includes('googleapis') || 
                error.message.includes('Network location provider') ||
                error.message.includes('403')
            )) {
                return;
            } else {
                const log = window.logger || { warn: console.warn }; 
                log.warn('⚠️ خطا در geolocation:', error.message);
            }
        }
    }
}

/**
 * ⚙️ تنظیم دستی منطقه زمانی
 * Set manual timezone
 * 
 * @param {number} offsetHours - offset منطقه زمانی به ساعت
 * @param {string} name - نام منطقه زمانی
 */
function setManualTimezone(offsetHours, name) {
    const offsetMinutes = offsetHours * 60;
    localStorage.setItem('userTimezone', JSON.stringify({
        offset: offsetMinutes,
        name: name,
        offsetStr: (offsetHours >= 0 ? '+' : '') + offsetHours + ':00',
        manual: true
    }));
    const log = window.logger || { info: console.log }; 
    log.info('✅ منطقه زمانی تنظیم شد:', name);
}

/**
 * 💾 ذخیره تنظیمات ناتیفیکیشن بازار
 * Save market notification settings
 * 
 * این تابع به window export می‌شود برای استفاده در HTML.
 * This function is exported to window for use in HTML.
 * 
 * @param {string} marketName - نام بازار
 * @param {HTMLElement} btn - دکمه ذخیره
 */
window.saveMarketNotification = function(marketName, btn) {
    const popup = btn.closest('.market-3d-popup');
    const checkbox = popup.querySelector('input[type="checkbox"]');
    const select = popup.querySelector('.notify-time-select');
    
    // درخواست مجوز نوتیفیکیشن / Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
    
    const settings = JSON.parse(localStorage.getItem('marketNotifications') || '{}');
    
    if (checkbox && checkbox.checked) {
        settings[marketName] = {
            enabled: true,
            minutesBefore: parseInt(select?.value || 15)
        };
        localStorage.setItem('marketNotifications', JSON.stringify(settings));
        
        // شروع چک کردن زمان‌ها / Start checking times
        startMarketNotificationChecker();
        
        btn.textContent = '✅ اعلان فعال شد!';
        btn.style.background = 'var(--card-bg)';
        btn.style.color = 'var(--text-primary)';
        setTimeout(() => {
            btn.textContent = '💾 ذخیره و فعال‌سازی اعلان';
            btn.style.background = '';
            btn.style.color = '';
        }, 2000);
    } else {
        // غیرفعال کردن اعلان / Disable notification
        if (settings[marketName]) {
            settings[marketName].enabled = false;
        }
        localStorage.setItem('marketNotifications', JSON.stringify(settings));
        
        btn.textContent = '❌ اعلان غیرفعال شد';
        btn.style.background = 'var(--card-bg)';
        btn.style.color = 'var(--text-primary)';
        setTimeout(() => {
            btn.textContent = '💾 ذخیره و فعال‌سازی اعلان';
            btn.style.background = '';
            btn.style.color = '';
        }, 2000);
    }
};

/**
 * 🔔 چک کننده زمان بازارها برای ارسال نوتیفیکیشن
 * Market notification checker interval
 * 
 * این متغیر interval ID را نگه می‌دارد.
 * This variable holds the interval ID.
 */
let notificationCheckerInterval = null;

/**
 * ▶️ شروع چک کردن زمان‌های بازار برای اعلان
 * Start market notification checker
 * 
 * این تابع یک interval ایجاد می‌کند که هر دقیقه زمان‌های بازار را چک می‌کند.
 * This function creates an interval that checks market times every minute.
 */
function startMarketNotificationChecker() {
    if (notificationCheckerInterval) return; // از قبل فعال است / Already active
    
    notificationCheckerInterval = setInterval(() => {
        checkMarketNotifications();
    }, 60000); // هر دقیقه چک کن / Check every minute
    
    const log = window.logger || { info: console.log }; 
    log.info('🔔 سیستم اعلان بازارها فعال شد');
}

/**
 * 🔍 چک کردن زمان‌های بازار برای ارسال اعلان
 * Check market times for notifications
 * 
 * این تابع تمام بازارهای فعال را چک می‌کند و در صورت نیاز اعلان ارسال می‌کند.
 * This function checks all active markets and sends notifications if needed.
 * 
 * وابستگی‌ها / Dependencies:
 * - window.marketData
 * - getUserTimezone
 * - convertUTCtoLocal
 * - sendMarketNotification
 */
function checkMarketNotifications() {
    const settings = JSON.parse(localStorage.getItem('marketNotifications') || '{}');
    const now = new Date();
    const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
    
    if (typeof marketData === 'undefined') return;
    
    marketData.forEach(market => {
        const marketSetting = settings[market.name];
        if (!marketSetting || !marketSetting.enabled) return;
        
        const [openH, openM] = market.open.split(':').map(Number);
        const openMin = openH * 60 + openM;
        const minutesUntilOpen = openMin - utcMinutes;
        
        // اگر زمان اعلان رسیده / If notification time has arrived
        if (minutesUntilOpen > 0 && minutesUntilOpen <= marketSetting.minutesBefore) {
            // چک کن که قبلاً اعلان نداده باشیم / Check that we haven't notified before
            const lastNotified = localStorage.getItem(`notified_${market.name}`);
            const today = now.toDateString();
            
            if (lastNotified !== today) {
                sendMarketNotification(market, minutesUntilOpen);
                localStorage.setItem(`notified_${market.name}`, today);
            }
        }
    });
}

/**
 * 📤 ارسال اعلان بازار
 * Send market notification
 * 
 * @param {Object} market - شیء بازار
 * @param {number} minutesUntilOpen - دقیقه تا باز شدن
 * 
 * وابستگی‌ها / Dependencies:
 * - getUserTimezone
 * - convertUTCtoLocal
 * - window.Notification API
 */
function sendMarketNotification(market, minutesUntilOpen) {
    const userTimezone = getUserTimezone();
    const localOpenTime = convertUTCtoLocal(market.open, userTimezone.offset);
    
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`🔔 ${market.name}`, {
            body: `بازار ${minutesUntilOpen} دقیقه دیگر باز می‌شود (ساعت ${localOpenTime} محلی)`,
            icon: '/favicon.ico',
            tag: market.name
        });
    }
    
    const log = window.logger || { info: console.log }; 
    log.info(`🔔 اعلان: ${market.name} - ${minutesUntilOpen} دقیقه تا باز شدن`);
}

/**
 * 📋 پر کردن لیست بازارها
 * Populate market list
 * 
 * این تابع لیست بازارها را در پنل انتخاب بازار پر می‌کند.
 * This function populates the market list in the market selector panel.
 * 
 * وابستگی‌ها / Dependencies:
 * - window.marketData
 * - getMarketStatusColor
 * - selectMarketFromList
 */
function populateMarketList() {
    const listContainer = document.getElementById('marketSelectList');
    if (!listContainer || typeof marketData === 'undefined') return;
    
    listContainer.innerHTML = '';
    
    marketData.forEach((market, index) => {
        const statusColor = getMarketStatusColor(market);
        let statusClass = 'closed';
        if (statusColor === 0x22c55e) statusClass = 'open';
        else if (statusColor === 0xfbbf24) statusClass = 'opening';
        else if (statusColor === 0xf97316) statusClass = 'closing';
        
        const item = document.createElement('div');
        item.className = 'market-select-item';
        item.innerHTML = `
            <span class="market-name">${market.name}</span>
            <span class="market-status-dot ${statusClass}"></span>
        `;
        item.addEventListener('click', () => {
            selectMarketFromList(market, index);
        });
        listContainer.appendChild(item);
    });
}

/**
 * ✅ انتخاب بازار از لیست
 * Select market from list
 * 
 * این تابع وقتی کاربر روی یک بازار در لیست کلیک می‌کند فراخوانی می‌شود.
 * This function is called when user clicks on a market in the list.
 * 
 * @param {Object} market - شیء بازار
 * @param {number} index - ایندکس بازار در لیست
 * 
 * وابستگی‌ها / Dependencies:
 * - window.simpleGlobeScenes
 * - zoomToMarker
 * - showMarketPopup
 */
function selectMarketFromList(market, index) {
    const log = window.logger || { info: console.log }; 
    log.info('📍 انتخاب بازار:', market.name);
    
    // بستن پنل لیست بازارها (هر دو کلاس)
    // Close market list panel (both classes)
    const panel = document.getElementById('marketSelectPanel');
    if (panel) {
        panel.classList.remove('visible');
        panel.classList.remove('active');
    }
    
    // دسترسی به scene کره مالی
    // Access financial globe scene
    const globeScene = window.simpleGlobeScenes && window.simpleGlobeScenes['financial'];
    if (!globeScene) return;
    
    // توقف چرخش اتوماتیک
    // Stop auto rotation
    if (globeScene.stopRotate) globeScene.stopRotate();
    
    // زوم به بازار
    // Zoom to market
    zoomToMarker(market, globeScene.camera, globeScene.controls, globeScene.earth);
    
    // نمایش popup بازار با استایل جدید
    // Show market popup with new style
    const container = document.getElementById('financialGlobeContainer');
    if (container) {
        showMarketPopup(market, container);
    }
}

/**
 * 🎛️ راه‌اندازی دکمه انتخاب بازار
 * Setup market selector button
 * 
 * این تابع event listener های دکمه انتخاب بازار را تنظیم می‌کند.
 * This function sets up event listeners for the market selector button.
 * 
 * وابستگی‌ها / Dependencies:
 * - populateMarketList
 */
function setupMarketSelector() {
    const btn = document.getElementById('marketSelectorBtn');
    const panel = document.getElementById('marketSelectPanel');
    const searchInput = document.getElementById('marketSearchInput');
    
    if (btn && panel) {
        btn.addEventListener('click', () => {
            panel.classList.toggle('visible');
            populateMarketList(); // آپدیت وضعیت‌ها / Update statuses
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const items = document.querySelectorAll('.market-select-item');
            items.forEach(item => {
                const name = item.querySelector('.market-name').textContent.toLowerCase();
                item.style.display = name.includes(query) ? 'flex' : 'none';
            });
        });
    }
    
    // بستن پنل با کلیک خارج
    // Close panel on outside click
    document.addEventListener('click', (e) => {
        if (panel && !panel.contains(e.target) && btn && !btn.contains(e.target)) {
            panel.classList.remove('visible');
        }
    });
}

// ============================================
// Export توابع به window
// Export functions to window
// ============================================

window.getMarketStatusInfo = getMarketStatusInfo;
window.getMarketStatusColor = getMarketStatusColor;
window.zoomToMarker = zoomToMarker;
window.showMarketPopup = showMarketPopup;
window.getUserTimezone = getUserTimezone;
window.convertUTCtoLocal = convertUTCtoLocal;
window.requestLocationPermission = requestLocationPermission;
window.setManualTimezone = setManualTimezone;
window.startMarketNotificationChecker = startMarketNotificationChecker;
window.checkMarketNotifications = checkMarketNotifications;
window.sendMarketNotification = sendMarketNotification;
window.populateMarketList = populateMarketList;
window.selectMarketFromList = selectMarketFromList;
window.setupMarketSelector = setupMarketSelector;

