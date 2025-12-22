/**
 * ============================================
 * 🌐 Globe 3D - 3D Globes Data Loading
 * ============================================
 * 
 * این فایل شامل تمام توابع مربوط به کره‌های 3D است.
 * This file contains all functions related to 3D globes.
 * 
 * وابستگی‌ها / Dependencies:
 * - THREE.js (THREE.Group, THREE.Mesh, THREE.Vector3, etc.)
 * - globe-helpers.js (addEventListenerOnce)
 * - globe-simple.js (buildSimpleGlobe, window.simpleGlobeScenes)
 * - globe-resources.js (createNeonMarker, getFacilityColor)
 * - window.countriesData (داده‌های کشورها)
 * - window.iranProvinces (داده‌های استان‌های ایران)
 * - window.logger (optional)
 * - window.errorHandler (optional)
 * 
 * استفاده / Usage:
 * این فایل باید بعد از globe-helpers.js, globe-clock.js, globe-markets.js, globe-simple.js, globe-resources.js لود شود.
 * This file should be loaded after globe-helpers.js, globe-clock.js, globe-markets.js, globe-simple.js, globe-resources.js.
 * 
 * توابع اصلی / Main Functions:
 * - load3DGlobeData: بارگذاری داده‌های کره 3D بر اساس نوع
 * - setupEarthquakeFilters: راه‌اندازی فیلترهای زلزله
 * - setupNaturalResourcesFilters: راه‌اندازی فیلترهای منابع طبیعی
 * - loadWeatherData: بارگذاری داده‌های آب و هوا
 * - loadMilitaryData: بارگذاری داده‌های نظامی
 * - loadUniversitiesData: بارگذاری داده‌های دانشگاه
 * - loadHistoricalData: بارگذاری داده‌های تاریخی
 * - loadEarthquakeData: بارگذاری داده‌های زلزله
 * - loadNaturalResourcesData: بارگذاری داده‌های منابع طبیعی
 * 
 * Export ها / Exports:
 * تمام توابع و داده‌ها به window export می‌شوند برای استفاده در سایر فایل‌ها.
 * All functions and data are exported to window for use in other files.
 * 
 * ============================================
 */

function setupEarthquakeFilters() {
    const yearFilter = document.getElementById('earthquakeYearFilter');
    if (yearFilter) {
        const handler = (e) => {
            const year = e.target.value;
            filterEarthquakesByYear(year);
        };
        // حذف listener قبلی اگر وجود داشت
        yearFilter.removeEventListener('change', handler);
        addEventListenerOnce(yearFilter, 'change', handler, 'earthquake-year-filter');
    }
    
    document.querySelectorAll('#earthquakeFilterPanel [data-magnitude]').forEach((btn, index) => {
        const handler = () => {
            document.querySelectorAll('#earthquakeFilterPanel [data-magnitude]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const magnitude = btn.dataset.magnitude;
            filterEarthquakesByMagnitude(magnitude);
        };
        // حذف listener قبلی اگر وجود داشت
        btn.removeEventListener('click', handler);
        addEventListenerOnce(btn, 'click', handler, `earthquake-magnitude-${index}`);
    });
    
    // راه‌اندازی انتخاب شهر
    setupEarthquakeCitySelection();
}

// راه‌اندازی انتخاب شهر برای اعلان زلزله
function setupEarthquakeCitySelection() {
    const provinceSelect = document.getElementById('earthquakeProvinceSelect');
    const cityList = document.getElementById('earthquakeCityList');
    
    if (!provinceSelect || !cityList || typeof iranProvinces === 'undefined') return;
    
    // پر کردن لیست استان‌ها
    Object.keys(iranProvinces).forEach(provinceName => {
        const option = document.createElement('option');
        option.value = provinceName;
        option.textContent = iranProvinces[provinceName].name;
        provinceSelect.appendChild(option);
    });
    
    // تغییر استان - نمایش شهرهای آن استان
    const provinceChangeHandler = (e) => {
        const selectedProvince = e.target.value;
        cityList.innerHTML = '';
        
        if (selectedProvince === 'all') {
            // نمایش همه شهرها
            Object.values(iranProvinces).forEach(province => {
                province.cities.forEach(city => {
                    const cityItem = document.createElement('div');
                    cityItem.className = 'city-item';
                    cityItem.dataset.city = city.name;
                    cityItem.dataset.coords = city.coords.join(',');
                    cityItem.innerHTML = `
                        <span>📍 ${city.name}</span>
                        <span>${province.name}</span>
                    `;
                    const cityClickHandler = () => {
                        document.querySelectorAll('.city-item').forEach(item => item.classList.remove('selected'));
                        cityItem.classList.add('selected');
                        // ذخیره انتخاب
                        localStorage.setItem('earthquakeSelectedCity', JSON.stringify({
                            name: city.name,
                            province: province.name,
                            coords: city.coords
                        }));
                    };
                    cityItem.addEventListener('click', cityClickHandler);
                    cityList.appendChild(cityItem);
                });
            });
        } else if (iranProvinces[selectedProvince]) {
            // نمایش شهرهای استان انتخاب شده
            iranProvinces[selectedProvince].cities.forEach(city => {
                const cityItem = document.createElement('div');
                cityItem.className = 'city-item';
                cityItem.dataset.city = city.name;
                cityItem.dataset.coords = city.coords.join(',');
                cityItem.innerHTML = `
                    <span>📍 ${city.name}</span>
                    <span>${iranProvinces[selectedProvince].name}</span>
                `;
                const cityClickHandler2 = () => {
                    document.querySelectorAll('.city-item').forEach(item => item.classList.remove('selected'));
                    cityItem.classList.add('selected');
                    // ذخیره انتخاب
                    localStorage.setItem('earthquakeSelectedCity', JSON.stringify({
                        name: city.name,
                        province: iranProvinces[selectedProvince].name,
                        coords: city.coords
                    }));
                };
                cityItem.addEventListener('click', cityClickHandler2);
                cityList.appendChild(cityItem);
            });
        }
    };
    
    // اضافه کردن event listener با محافظت از duplicate
    provinceSelect.removeEventListener('change', provinceChangeHandler);
    addEventListenerOnce(provinceSelect, 'change', provinceChangeHandler, 'earthquake-province-select');
    
    // بارگذاری انتخاب قبلی
    const savedCity = localStorage.getItem('earthquakeSelectedCity');
    if (savedCity) {
        try {
            const cityData = JSON.parse(savedCity);
            provinceSelect.value = cityData.province;
            provinceSelect.dispatchEvent(new Event('change'));
            setTimeout(() => {
                const cityItem = Array.from(cityList.children).find(item => 
                    item.dataset.city === cityData.name
                );
                if (cityItem) {
                    cityItem.classList.add('selected');
                }
            }, 100);
        } catch (e) {
            const log = window.logger || { warn: console.warn }; log.warn('⚠️ خطا در بارگذاری شهر انتخاب شده:', e);
        }
    }
}

// ذخیره تنظیمات اعلان زلزله
function saveEarthquakeNotificationSettings() {
    const enabled = document.getElementById('earthquakeNotificationEnabled')?.checked || false;
    const minMagnitude = document.getElementById('earthquakeMinMagnitude')?.value || '5';
    const selectedCity = localStorage.getItem('earthquakeSelectedCity');
    
    const settings = {
        enabled,
        minMagnitude: parseFloat(minMagnitude),
        city: selectedCity ? JSON.parse(selectedCity) : null
    };
    
    localStorage.setItem('earthquakeNotificationSettings', JSON.stringify(settings));
    const log = window.logger || { info: console.log }; log.info('✅ تنظیمات اعلان زلزله ذخیره شد:', settings);
    
    // نمایش پیام موفقیت
    alert('✅ تنظیمات با موفقیت ذخیره شد!');
}

// بررسی اعلان‌های زلزله (فراخوانی دوره‌ای)
function checkEarthquakeNotifications() {
    const settingsStr = localStorage.getItem('earthquakeNotificationSettings');
    if (!settingsStr) return;
    
    try {
        const settings = JSON.parse(settingsStr);
        if (!settings.enabled || !settings.city) return;
        
        // در آینده: بررسی زلزله‌های جدید از API
        // برای الان فقط یک نمونه
        const log = window.logger || { info: console.log }; log.info('🔔 بررسی اعلان‌های زلزله...');
    } catch (e) {
        const log = window.logger || { warn: console.warn }; log.warn('⚠️ خطا در بررسی اعلان‌ها:', e);
    }
}

// در دسترس قرار دادن توابع
window.saveEarthquakeNotificationSettings = saveEarthquakeNotificationSettings;

// فیلتر زلزله‌ها بر اساس سال
function filterEarthquakesByYear(year) {
    const scene = window.simpleGlobeScenes['earthquake'];
    if (!scene || !scene.scene) return;
    
    scene.scene.traverse((obj) => {
        if (obj.name === 'earthquakes') {
            obj.children.forEach(marker => {
                if (marker.userData && marker.userData.type === 'earthquake') {
                    const eqYear = marker.userData.date ? parseInt(marker.userData.date.split('-')[0]) : null;
                    let visible = true;
                    
                    if (year === 'all') {
                        visible = true;
                    } else if (year === 'before-1980') {
                        visible = eqYear && eqYear < 1980;
                    } else if (year === '1980-1989') {
                        visible = eqYear && eqYear >= 1980 && eqYear < 1990;
                    } else if (year === '1990-1999') {
                        visible = eqYear && eqYear >= 1990 && eqYear < 2000;
                    } else if (year === '2000-2009') {
                        visible = eqYear && eqYear >= 2000 && eqYear < 2010;
                    } else if (year === '2010-2014') {
                        visible = eqYear && eqYear >= 2010 && eqYear < 2015;
                    } else {
                        const filterYear = parseInt(year);
                        visible = eqYear === filterYear;
                    }
                    
                    marker.visible = visible;
                }
            });
        }
    });
}

// فیلتر زلزله‌ها بر اساس بزرگی
function filterEarthquakesByMagnitude(magnitude) {
    const scene = window.simpleGlobeScenes['earthquake'];
    if (!scene || !scene.scene) return;
    
    scene.scene.traverse((obj) => {
        if (obj.name === 'earthquakes') {
            obj.children.forEach(marker => {
                if (marker.userData && marker.userData.type === 'earthquake') {
                    const mag = marker.userData.magnitude || 0;
                    let visible = true;
                    
                    if (magnitude === 'all') {
                        visible = true;
                    } else if (magnitude === '8+') {
                        visible = mag >= 8.0;
                    } else if (magnitude === '7-8') {
                        visible = mag >= 7.0 && mag < 8.0;
                    } else if (magnitude === '6-7') {
                        visible = mag >= 6.0 && mag < 7.0;
                    } else if (magnitude === '5-6') {
                        visible = mag >= 5.0 && mag < 6.0;
                    }
                    
                    marker.visible = visible;
                }
            });
        }
    });
}

// راه‌اندازی فیلترهای کره منابع طبیعی
function setupNaturalResourcesFilters() {
    document.querySelectorAll('#naturalResourcesFilterPanel [data-resource]').forEach((btn, index) => {
        const handler = () => {
            document.querySelectorAll('#naturalResourcesFilterPanel [data-resource]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const resource = btn.dataset.resource;
            filterNaturalResources(resource);
        };
        btn.removeEventListener('click', handler);
        addEventListenerOnce(btn, 'click', handler, `natural-resources-filter-${index}`);
    });
}

// فیلتر منابع طبیعی
function filterNaturalResources(resource) {
    const scene = window.simpleGlobeScenes['natural-resources'];
    if (!scene || !scene.scene) return;
    
    scene.scene.traverse((obj) => {
        if (obj.name === 'naturalResources') {
            obj.children.forEach(item => {
                if (item.userData && item.userData.type) {
                    if (resource === 'all') {
                        item.visible = true;
                    } else {
                        item.visible = item.userData.type === resource;
                    }
                }
            });
        }
    });
}

// بارگذاری داده‌های کره 3D بر اساس نوع
function load3DGlobeData(type, _container) {
    const scene = window.simpleGlobeScenes[type];
    if (!scene || !scene.scene) return;
    
    switch(type) {
        case 'weather':
            loadWeatherData(scene);
            break;
        case 'military':
            loadMilitaryData(scene);
            break;
        case 'universities':
            loadUniversitiesData(scene);
            break;
        case 'historical':
            loadHistoricalData(scene);
            break;
        case 'earthquake':
            loadEarthquakeData(scene);
            break;
        case 'natural-resources':
            loadNaturalResourcesData(scene);
            break;
    }
}

// داده‌های آب و هوای شهرهای مهم
const weatherData = {
    'US': [
        { name: 'نیویورک', coords: [40.7128, -74.0060], temp: 15, condition: 'آفتابی', humidity: 65 },
        { name: 'لس آنجلس', coords: [34.0522, -118.2437], temp: 22, condition: 'آفتابی', humidity: 55 },
        { name: 'شیکاگو', coords: [41.8781, -87.6298], temp: 8, condition: 'ابری', humidity: 70 }
    ],
    'UK': [
        { name: 'لندن', coords: [51.5074, -0.1278], temp: 12, condition: 'بارانی', humidity: 80 }
    ],
    'FR': [
        { name: 'پاریس', coords: [48.8566, 2.3522], temp: 14, condition: 'ابری', humidity: 75 }
    ],
    'DE': [
        { name: 'برلین', coords: [52.5200, 13.4050], temp: 10, condition: 'ابری', humidity: 72 }
    ],
    'JP': [
        { name: 'توکیو', coords: [35.6762, 139.6503], temp: 18, condition: 'آفتابی', humidity: 60 }
    ],
    'CN': [
        { name: 'پکن', coords: [39.9042, 116.4074], temp: 16, condition: 'مه', humidity: 45 }
    ],
    'IR': [
        { name: 'تهران', coords: [35.6892, 51.3890], temp: 20, condition: 'آفتابی', humidity: 40 },
        { name: 'اصفهان', coords: [32.6546, 51.6680], temp: 18, condition: 'آفتابی', humidity: 35 }
    ],
    'RU': [
        { name: 'مسکو', coords: [55.7558, 37.6173], temp: 5, condition: 'برفی', humidity: 85 }
    ],
    'IN': [
        { name: 'دهلی', coords: [28.6139, 77.2090], temp: 28, condition: 'آفتابی', humidity: 55 }
    ],
    'BR': [
        { name: 'سائوپائولو', coords: [-23.5505, -46.6333], temp: 24, condition: 'ابری', humidity: 78 }
    ],
    'AU': [
        { name: 'سیدنی', coords: [-33.8688, 151.2093], temp: 22, condition: 'آفتابی', humidity: 65 }
    ],
    'CA': [
        { name: 'تورنتو', coords: [43.6532, -79.3832], temp: 6, condition: 'ابری', humidity: 70 }
    ],
    'SA': [
        { name: 'ریاض', coords: [24.7136, 46.6753], temp: 32, condition: 'آفتابی', humidity: 25 }
    ],
    'TR': [
        { name: 'استانبول', coords: [41.0082, 28.9784], temp: 16, condition: 'ابری', humidity: 68 }
    ],
    'EG': [
        { name: 'قاهره', coords: [30.0444, 31.2357], temp: 26, condition: 'آفتابی', humidity: 50 }
    ]
};

// بارگذاری داده‌های آب و هوا
function loadWeatherData(scene) {
    const log = window.logger || { info: console.log }; log.info('🌤️ بارگذاری داده‌های آب و هوا...');
    
    if (!scene || !scene.scene || !scene.earth) {
        const log = window.logger || { warn: console.warn }; log.warn('⚠️ scene یا earth پیدا نشد در loadWeatherData', {
            hasScene: !!scene,
            hasSceneScene: !!(scene && scene.scene),
            hasEarth: !!(scene && scene.earth)
        });
        return;
    }
    
    if (typeof createNeonMarker === 'undefined') {
        const log = window.logger || { error: console.error }; log.error('❌ تابع createNeonMarker پیدا نشد!');
        return;
    }
    
    const weatherGroup = new THREE.Group();
    weatherGroup.name = 'weather';
    
    let markerCount = 0;
    
    try {
        Object.entries(weatherData).forEach(([countryCode, cities]) => {
            cities.forEach(city => {
                if (city.coords && city.coords.length === 2) {
                    try {
                        const [lat, lng] = city.coords;
                        
                        // رنگ بر اساس دما
                        let color = 0x4facfe; // آبی (سرد)
                        if (city.temp > 25) color = 0xff6b6b; // قرمز (گرم)
                        else if (city.temp > 15) color = 0xffd93d; // زرد (معتدل)
                        
                        // ایجاد مارکر آب و هوا - استفاده از type پیش‌فرض اگر weather تعریف نشده
                        let marker;
                        try {
                            marker = createNeonMarker(color, 0.008, 'weather');
                        } catch (e) {
                            const log = window.logger || { warn: console.warn }; log.warn('⚠️ خطا در createNeonMarker با type weather، استفاده از پیش‌فرض:', e);
                            marker = createNeonMarker(color, 0.008, 'customs'); // fallback
                        }
                        
                        if (!marker) {
                            const log = window.logger || { warn: console.warn }; log.warn('⚠️ marker ایجاد نشد برای:', city.name);
                            return;
                        }
                        
                        // تبدیل به مختصات 3D
                        const phi = (90 - lat) * (Math.PI / 180);
                        const theta = (lng + 180) * (Math.PI / 180);
                        const radius = 1.005;
                        
                        const x = -radius * Math.sin(phi) * Math.cos(theta);
                        const y = radius * Math.cos(phi);
                        const z = radius * Math.sin(phi) * Math.sin(theta);
                        
                        marker.position.set(x, y, z);
                        
                        // چرخاندن به سمت بالا
                        const normal = new THREE.Vector3(x, y, z).normalize();
                        marker.lookAt(normal.multiplyScalar(2).add(marker.position));
                        marker.rotateX(Math.PI / 2);
                        
                        // ذخیره اطلاعات
                        marker.userData = {
                            type: 'weather',
                            country: countryCode,
                            name: city.name,
                            temp: city.temp,
                            condition: city.condition,
                            humidity: city.humidity,
                            coords: [lat, lng]
                        };
                        
                        weatherGroup.add(marker);
                        markerCount++;
                    } catch (e) {
                        const log = window.logger || { error: console.error }; log.error('❌ خطا در ایجاد marker برای شهر:', city.name, e);
                    }
                }
            });
        });
        
        // اضافه کردن به earth برای چرخش با کره
        if (scene.earth) {
            scene.earth.add(weatherGroup);
        } else {
            scene.scene.add(weatherGroup);
        }
        const log = window.logger || { info: console.log }; log.info(`✅ ${markerCount} مارکر آب و هوا اضافه شد`);
    } catch (error) {
        const log = window.logger || { error: console.error }; log.error('❌ خطا در loadWeatherData:', error);
    }
}

// بارگذاری داده‌های نظامی
function loadMilitaryData(scene) {
    const log = window.logger || { info: console.log }; log.info('⚔️ بارگذاری داده‌های نظامی...');
    
    if (!scene || !scene.scene || !scene.earth) {
        const log = window.logger || { warn: console.warn }; log.warn('⚠️ scene یا earth پیدا نشد در loadMilitaryData');
        return;
    }
    
    try {
        // استفاده از داده‌های conflicts و military موجود
        if (typeof createAllConflicts === 'function') {
            const conflictsGroup = createAllConflicts(scene.earth);
            if (conflictsGroup) {
                // conflictsGroup قبلاً به earth اضافه شده در createAllConflicts
                // فقط اگر نیاز به اضافه کردن به scene باشد
                if (!scene.earth.children.includes(conflictsGroup)) {
                    scene.earth.add(conflictsGroup);
                }
                const log = window.logger || { info: console.log }; log.info('✅ درگیری‌های نظامی اضافه شدند');
            }
        } else {
            const log = window.logger || { warn: console.warn }; log.warn('⚠️ تابع createAllConflicts پیدا نشد');
        }
        
        // نمایش قدرت نظامی
        if (typeof showAirForceOnGlobe === 'function') {
            showAirForceOnGlobe();
        }
        if (typeof showGroundForceOnGlobe === 'function') {
            showGroundForceOnGlobe();
        }
        if (typeof showNavyOnGlobe === 'function') {
            showNavyOnGlobe();
        }
    } catch (error) {
        const log = window.logger || { error: console.error }; log.error('❌ خطا در loadMilitaryData:', error);
    }
}

// داده‌های دانشگاه‌های مهم جهان
const universitiesData = {
    'US': [
        { name: 'دانشگاه هاروارد', coords: [42.3770, -71.1167], rank: 1, students: 23000, description: 'قدیمی‌ترین دانشگاه آمریکا' },
        { name: 'دانشگاه MIT', coords: [42.3601, -71.0942], rank: 2, students: 11500, description: 'موسسه فناوری ماساچوست' },
        { name: 'دانشگاه استنفورد', coords: [37.4275, -122.1697], rank: 3, students: 17000, description: 'دانشگاه سیلیکون ولی' },
        { name: 'دانشگاه ییل', coords: [41.3163, -72.9223], rank: 4, students: 12000, description: 'دانشگاه آیوی لیگ' }
    ],
    'UK': [
        { name: 'دانشگاه آکسفورد', coords: [51.7548, -1.2544], rank: 1, students: 24000, description: 'قدیمی‌ترین دانشگاه انگلیسی‌زبان' },
        { name: 'دانشگاه کمبریج', coords: [52.2053, 0.1218], rank: 2, students: 23000, description: 'دانشگاه معتبر بریتانیا' }
    ],
    'CN': [
        { name: 'دانشگاه پکن', coords: [39.9896, 116.3168], rank: 1, students: 35000, description: 'بهترین دانشگاه چین' },
        { name: 'دانشگاه چینگ‌هوا', coords: [40.0011, 116.3264], rank: 2, students: 36000, description: 'دانشگاه فنی پکن' }
    ],
    'IR': [
        { name: 'دانشگاه تهران', coords: [35.7036, 51.3515], rank: 1, students: 50000, description: 'بزرگترین دانشگاه ایران' },
        { name: 'دانشگاه شریف', coords: [35.7036, 51.3515], rank: 2, students: 12000, description: 'دانشگاه فنی تهران' },
        { name: 'دانشگاه امیرکبیر', coords: [35.7036, 51.3515], rank: 3, students: 15000, description: 'دانشگاه پلی‌تکنیک' }
    ],
    'DE': [
        { name: 'دانشگاه مونیخ', coords: [48.1500, 11.5800], rank: 1, students: 52000, description: 'بزرگترین دانشگاه آلمان' },
        { name: 'دانشگاه هایدلبرگ', coords: [49.4100, 8.7100], rank: 2, students: 30000, description: 'قدیمی‌ترین دانشگاه آلمان' }
    ],
    'FR': [
        { name: 'دانشگاه سوربن', coords: [48.8496, 2.3440], rank: 1, students: 55000, description: 'دانشگاه معتبر پاریس' }
    ],
    'JP': [
        { name: 'دانشگاه توکیو', coords: [35.7127, 139.7620], rank: 1, students: 28000, description: 'بهترین دانشگاه ژاپن' }
    ],
    'RU': [
        { name: 'دانشگاه دولتی مسکو', coords: [55.7036, 37.5286], rank: 1, students: 47000, description: 'بزرگترین دانشگاه روسیه' }
    ],
    'IN': [
        { name: 'موسسه فناوری هند', coords: [19.1334, 72.9137], rank: 1, students: 10000, description: 'IIT بمبئی' }
    ],
    'CA': [
        { name: 'دانشگاه تورنتو', coords: [43.6532, -79.3832], rank: 1, students: 90000, description: 'بزرگترین دانشگاه کانادا' }
    ],
    'AU': [
        { name: 'دانشگاه ملی استرالیا', coords: [-35.2809, 149.1300], rank: 1, students: 20000, description: 'بهترین دانشگاه استرالیا' }
    ]
};

// داده‌های مکان‌های تاریخی مهم جهان
const historicalSitesData = {
    'EG': [
        { name: 'اهرام جیزه', coords: [29.9792, 31.1342], year: -2580, description: 'یکی از عجایب هفتگانه' },
        { name: 'ابوالهول', coords: [29.9753, 31.1376], year: -2500, description: 'مجسمه اسرارآمیز' }
    ],
    'GR': [
        { name: 'آکروپولیس', coords: [37.9715, 23.7267], year: -447, description: 'معبد آتنا' },
        { name: 'پارتنون', coords: [37.9715, 23.7267], year: -432, description: 'معبد یونان باستان' }
    ],
    'IT': [
        { name: 'کولوسئوم', coords: [41.8902, 12.4922], year: 80, description: 'آمفی‌تئاتر روم' },
        { name: 'برج کج پیزا', coords: [43.7230, 10.3966], year: 1173, description: 'برج معروف' }
    ],
    'CN': [
        { name: 'دیوار چین', coords: [40.4319, 116.5704], year: -700, description: 'دیوار بزرگ چین' },
        { name: 'شهر ممنوعه', coords: [39.9163, 116.3972], year: 1420, description: 'کاخ امپراتوری' }
    ],
    'IN': [
        { name: 'تاج محل', coords: [27.1751, 78.0421], year: 1632, description: 'مقبره عاشقانه' }
    ],
    'IR': [
        { name: 'تخت جمشید', coords: [29.9352, 52.8914], year: -518, description: 'پایتخت هخامنشیان' },
        { name: 'چغازنبیل', coords: [32.0081, 48.5203], year: -1250, description: 'زیگورات ایلامی' },
        { name: 'میدان نقش جهان', coords: [32.6546, 51.6680], year: 1598, description: 'میدان تاریخی اصفهان' }
    ],
    'TR': [
        { name: 'ایاصوفیه', coords: [41.0086, 28.9802], year: 537, description: 'کلیسا و مسجد' }
    ],
    'PE': [
        { name: 'ماچو پیچو', coords: [-13.1631, -72.5450], year: 1450, description: 'شهر اینکا' }
    ],
    'MX': [
        { name: 'چیچن ایتزا', coords: [20.6843, -88.5678], year: 600, description: 'معبد مایا' }
    ],
    'GB': [
        { name: 'استون‌هنج', coords: [51.1789, -1.8262], year: -3000, description: 'سنگ‌چین باستانی' }
    ],
    'FR': [
        { name: 'برج ایفل', coords: [48.8584, 2.2945], year: 1889, description: 'نماد پاریس' },
        { name: 'کلیسای نوتردام', coords: [48.8530, 2.3499], year: 1345, description: 'کلیسای گوتیک' }
    ],
    'US': [
        { name: 'مجسمه آزادی', coords: [40.6892, -74.0445], year: 1886, description: 'نماد آزادی' }
    ],
    'SA': [
        { name: 'کعبه', coords: [21.4225, 39.8262], year: -2000, description: 'قبله مسلمانان' }
    ],
    'JO': [
        { name: 'پترا', coords: [30.3285, 35.4444], year: -312, description: 'شهر صورتی' }
    ],
    'RU': [
        { name: 'کرملین', coords: [55.7520, 37.6173], year: 1156, description: 'قلعه مسکو' }
    ]
};

// بارگذاری داده‌های دانشگاه‌ها
function loadUniversitiesData(scene) {
    const log = window.logger || { info: console.log }; log.info('🎓 بارگذاری داده‌های دانشگاه‌ها...');
    
    if (!scene || !scene.scene || !scene.earth) {
        const log = window.logger || { warn: console.warn }; log.warn('⚠️ scene یا earth پیدا نشد در loadUniversitiesData');
        return;
    }
    
    if (typeof createNeonMarker === 'undefined') {
        const log = window.logger || { error: console.error }; log.error('❌ تابع createNeonMarker پیدا نشد!');
        return;
    }
    
    const universitiesGroup = new THREE.Group();
    universitiesGroup.name = 'universities';
    
    let markerCount = 0;
    
    try {
        Object.entries(universitiesData).forEach(([countryCode, universities]) => {
            universities.forEach(uni => {
                if (uni.coords && uni.coords.length === 2) {
                    try {
                        const [lat, lng] = uni.coords;
                        
                        // ایجاد مارکر دانشگاه (کتاب)
                        const marker = createNeonMarker(0x4facfe, 0.008, 'university');
                        
                        if (!marker) {
                            const log = window.logger || { warn: console.warn }; log.warn('⚠️ marker ایجاد نشد برای:', uni.name);
                            return;
                        }
                        
                        // تبدیل به مختصات 3D
                        const phi = (90 - lat) * (Math.PI / 180);
                        const theta = (lng + 180) * (Math.PI / 180);
                        const radius = 1.005;
                        
                        const x = -radius * Math.sin(phi) * Math.cos(theta);
                        const y = radius * Math.cos(phi);
                        const z = radius * Math.sin(phi) * Math.sin(theta);
                        
                        marker.position.set(x, y, z);
                        
                        // چرخاندن به سمت بالا
                        const normal = new THREE.Vector3(x, y, z).normalize();
                        marker.lookAt(normal.multiplyScalar(2).add(marker.position));
                        marker.rotateX(Math.PI / 2);
                        
                        // ذخیره اطلاعات
                        marker.userData = {
                            type: 'university',
                            country: countryCode,
                            name: uni.name,
                            rank: uni.rank,
                            students: uni.students,
                            description: uni.description,
                            coords: [lat, lng]
                        };
                        
                        universitiesGroup.add(marker);
                        markerCount++;
                    } catch (e) {
                        const log = window.logger || { error: console.error }; log.error('❌ خطا در ایجاد marker برای دانشگاه:', uni.name, e);
                    }
                }
            });
        });
        
        // اضافه کردن به earth برای چرخش با کره
        if (scene.earth) {
            scene.earth.add(universitiesGroup);
        } else {
            scene.scene.add(universitiesGroup);
        }
        const log = window.logger || { info: console.log }; log.info(`✅ ${markerCount} مارکر دانشگاه اضافه شد`);
    } catch (error) {
        const log = window.logger || { error: console.error }; log.error('❌ خطا در loadUniversitiesData:', error);
    }
}

// بارگذاری داده‌های تاریخی
function loadHistoricalData(scene) {
    const log = window.logger || { info: console.log }; log.info('🏛️ بارگذاری داده‌های مکان‌های تاریخی...');
    
    if (!scene || !scene.scene || !scene.earth) {
        const log = window.logger || { warn: console.warn }; log.warn('⚠️ scene یا earth پیدا نشد در loadHistoricalData');
        return;
    }
    
    if (typeof createNeonMarker === 'undefined') {
        const log = window.logger || { error: console.error }; log.error('❌ تابع createNeonMarker پیدا نشد!');
        return;
    }
    
    const historicalGroup = new THREE.Group();
    historicalGroup.name = 'historical';
    
    let markerCount = 0;
    
    try {
        Object.entries(historicalSitesData).forEach(([countryCode, sites]) => {
            sites.forEach(site => {
                if (site.coords && site.coords.length === 2) {
                    try {
                        const [lat, lng] = site.coords;
                        
                        // ایجاد مارکر تاریخی (ستون)
                        const marker = createNeonMarker(0xfa709a, 0.01, 'historical');
                        
                        if (!marker) {
                            const log = window.logger || { warn: console.warn }; log.warn('⚠️ marker ایجاد نشد برای:', site.name);
                            return;
                        }
                        
                        // تبدیل به مختصات 3D
                        const phi = (90 - lat) * (Math.PI / 180);
                        const theta = (lng + 180) * (Math.PI / 180);
                        const radius = 1.005;
                        
                        const x = -radius * Math.sin(phi) * Math.cos(theta);
                        const y = radius * Math.cos(phi);
                        const z = radius * Math.sin(phi) * Math.sin(theta);
                        
                        marker.position.set(x, y, z);
                        
                        // چرخاندن به سمت بالا
                        const normal = new THREE.Vector3(x, y, z).normalize();
                        marker.lookAt(normal.multiplyScalar(2).add(marker.position));
                        marker.rotateX(Math.PI / 2);
                        
                        // ذخیره اطلاعات
                        marker.userData = {
                            type: 'historical',
                            country: countryCode,
                            name: site.name,
                            year: site.year,
                            description: site.description,
                            coords: [lat, lng]
                        };
                        
                        historicalGroup.add(marker);
                        markerCount++;
                    } catch (e) {
                        const log = window.logger || { error: console.error }; log.error('❌ خطا در ایجاد marker برای مکان تاریخی:', site.name, e);
                    }
                }
            });
        });
        
        // اضافه کردن به earth برای چرخش با کره
        if (scene.earth) {
            scene.earth.add(historicalGroup);
        } else {
            scene.scene.add(historicalGroup);
        }
        const log = window.logger || { info: console.log }; log.info(`✅ ${markerCount} مارکر تاریخی اضافه شد`);
    } catch (error) {
        const log = window.logger || { error: console.error }; log.error('❌ خطا در loadHistoricalData:', error);
    }
}

// داده‌های زلزله‌های مهم جهان (به‌روز)
const earthquakeData = {
    'JP': [
        { name: 'زلزله توکیو', coords: [35.6762, 139.6503], magnitude: 7.2, date: '2024-01-15', depth: 10, description: 'زلزله بزرگ توکیو' },
        { name: 'زلزله فوکوشیما', coords: [37.4500, 141.0333], magnitude: 9.0, date: '2011-03-11', depth: 30, description: 'زلزله و سونامی 2011' }
    ],
    'US': [
        { name: 'زلزله سانفرانسیسکو', coords: [37.7749, -122.4194], magnitude: 6.9, date: '1989-10-17', depth: 18, description: 'زلزله لوماپریتا' },
        { name: 'زلزله لس آنجلس', coords: [34.0522, -118.2437], magnitude: 6.7, date: '1994-01-17', depth: 18, description: 'زلزله نورثریج' },
        { name: 'زلزله آلاسکا', coords: [61.2181, -149.9003], magnitude: 9.2, date: '1964-03-27', depth: 25, description: 'بزرگترین زلزله آمریکا' }
    ],
    'CN': [
        { name: 'زلزله سیچوان', coords: [30.5728, 104.0668], magnitude: 8.0, date: '2008-05-12', depth: 19, description: 'زلزله بزرگ سیچوان' },
        { name: 'زلزله تانگشان', coords: [39.6333, 118.1833], magnitude: 7.8, date: '1976-07-28', depth: 12, description: 'مرگبارترین زلزله چین' }
    ],
    'IR': [
        { name: 'زلزله بم', coords: [29.1060, 58.3570], magnitude: 6.6, date: '2003-12-26', depth: 10, description: 'زلزله بم' },
        { name: 'زلزله رودبار', coords: [36.8100, 49.4100], magnitude: 7.3, date: '1990-06-20', depth: 18, description: 'زلزله رودبار و منجیل' },
        { name: 'زلزله کرمانشاه', coords: [34.3142, 47.0650], magnitude: 7.3, date: '2017-11-12', depth: 19, description: 'زلزله کرمانشاه' }
    ],
    'TR': [
        { name: 'زلزله ازمیت', coords: [40.7667, 29.9167], magnitude: 7.6, date: '1999-08-17', depth: 17, description: 'زلزله ازمیت' },
        { name: 'زلزله استانبول', coords: [41.0082, 28.9784], magnitude: 7.4, date: '1999-08-17', depth: 15, description: 'زلزله استانبول' }
    ],
    'IT': [
        { name: 'زلزله ل\'آکویلا', coords: [42.3500, 13.4000], magnitude: 6.3, date: '2009-04-06', depth: 8, description: 'زلزله ل\'آکویلا' }
    ],
    'CL': [
        { name: 'زلزله والپارایسو', coords: [-33.0472, -71.6127], magnitude: 8.8, date: '2010-02-27', depth: 35, description: 'بزرگترین زلزله شیلی' }
    ],
    'ID': [
        { name: 'زلزله سوماترا', coords: [3.2950, 95.9826], magnitude: 9.1, date: '2004-12-26', depth: 30, description: 'زلزله و سونامی اقیانوس هند' }
    ],
    'NZ': [
        { name: 'زلزله کریست‌چرچ', coords: [-43.5321, 172.6362], magnitude: 6.3, date: '2011-02-22', depth: 5, description: 'زلزله کریست‌چرچ' }
    ],
    'PK': [
        { name: 'زلزله کشمیر', coords: [34.5000, 73.5000], magnitude: 7.6, date: '2005-10-08', depth: 26, description: 'زلزله کشمیر' }
    ],
    'HT': [
        { name: 'زلزله پورت-او-پرنس', coords: [18.5944, -72.3074], magnitude: 7.0, date: '2010-01-12', depth: 13, description: 'زلزله هائیتی' }
    ],
    'NP': [
        { name: 'زلزله کاتماندو', coords: [27.7172, 85.3240], magnitude: 7.8, date: '2015-04-25', depth: 15, description: 'زلزله نپال' }
    ]
};

// بارگذاری داده‌های زلزله
function loadEarthquakeData(scene) {
    const log = window.logger || { info: console.log }; log.info('🌋 بارگذاری داده‌های زلزله...');
    
    if (!scene || !scene.scene || !scene.earth) {
        const log = window.logger || { warn: console.warn }; log.warn('⚠️ scene یا earth پیدا نشد در loadEarthquakeData');
        return;
    }
    
    if (typeof createNeonMarker === 'undefined') {
        const log = window.logger || { error: console.error }; log.error('❌ تابع createNeonMarker پیدا نشد!');
        return;
    }
    
    const earthquakeGroup = new THREE.Group();
    earthquakeGroup.name = 'earthquakes';
    
    let markerCount = 0;
    
    try {
        Object.entries(earthquakeData).forEach(([countryCode, earthquakes]) => {
            earthquakes.forEach(eq => {
                if (eq.coords && eq.coords.length === 2) {
                    try {
                        const [lat, lng] = eq.coords;
                        
                        // رنگ بر اساس بزرگی
                        let color = 0x22c55e; // سبز (کوچک)
                        let size = 0.008;
                        if (eq.magnitude >= 8.0) {
                            color = 0xdc2626; // قرمز تیره (خیلی بزرگ)
                            size = 0.015;
                        } else if (eq.magnitude >= 7.0) {
                            color = 0xf59e0b; // نارنجی (بزرگ)
                            size = 0.012;
                        } else if (eq.magnitude >= 6.0) {
                            color = 0xfbbf24; // زرد (متوسط)
                            size = 0.010;
                        }
                        
                        // ایجاد مارکر زلزله (دایره با موج)
                        const marker = createNeonMarker(color, size, 'earthquake');
                        
                        if (!marker) {
                            const log = window.logger || { warn: console.warn }; log.warn('⚠️ marker ایجاد نشد برای:', eq.name);
                            return;
                        }
                        
                        // تبدیل به مختصات 3D
                        const phi = (90 - lat) * (Math.PI / 180);
                        const theta = (lng + 180) * (Math.PI / 180);
                        const radius = 1.005;
                        
                        const x = -radius * Math.sin(phi) * Math.cos(theta);
                        const y = radius * Math.cos(phi);
                        const z = radius * Math.sin(phi) * Math.sin(theta);
                        
                        marker.position.set(x, y, z);
                        
                        // چرخاندن به سمت بالا
                        const normal = new THREE.Vector3(x, y, z).normalize();
                        marker.lookAt(normal.multiplyScalar(2).add(marker.position));
                        marker.rotateX(Math.PI / 2);
                        
                        // ذخیره اطلاعات
                        marker.userData = {
                            type: 'earthquake',
                            country: countryCode,
                            name: eq.name,
                            magnitude: eq.magnitude,
                            date: eq.date,
                            depth: eq.depth,
                            description: eq.description,
                            coords: [lat, lng]
                        };
                        
                        earthquakeGroup.add(marker);
                        markerCount++;
                    } catch (e) {
                        const log = window.logger || { error: console.error }; log.error('❌ خطا در ایجاد marker برای زلزله:', eq.name, e);
                    }
                }
            });
        });
        
        // اضافه کردن به earth برای چرخش با کره
        if (scene.earth) {
            scene.earth.add(earthquakeGroup);
        } else {
            scene.scene.add(earthquakeGroup);
        }
        const log = window.logger || { info: console.log }; log.info(`✅ ${markerCount} مارکر زلزله اضافه شد`);
        
        // حذف شده: بارگذاری مرزهای استانی و شهری ایران
        // این مرزها ربطی به زلزله ندارند و باید جداگانه اضافه شوند
    } catch (error) {
        const log = window.logger || { error: console.error }; log.error('❌ خطا در loadEarthquakeData:', error);
    }
}

// بارگذاری مرزهای استانی و شهری ایران
function loadIranProvincialBorders(scene) {
    const log = window.logger || { info: console.log, warn: console.warn };
    log.info('🗺️ بارگذاری مرزهای استانی و شهری ایران...');
    
    if (!scene || !scene.scene || !scene.earth) return;
    if (typeof iranProvinces === 'undefined') {
        log.warn('⚠️ داده‌های استان‌های ایران پیدا نشد');
        return;
    }
    
    const iranBordersGroup = new THREE.Group();
    iranBordersGroup.name = 'iranProvincialBorders';
    
    // ایجاد خطوط مرزی بین استان‌ها (خطوط مستقیم بین مراکز استان‌ها)
    const provinces = Object.values(iranProvinces);
    const cfg = window.CONFIG || CONFIG;
    const _iranCenter = [cfg.GLOBE.IRAN.LAT, cfg.GLOBE.IRAN.LNG]; // مرکز تقریبی ایران
    
    // ایجاد خطوط مرزی بین استان‌های مجاور
    provinces.forEach((province, index) => {
        const [lat, lng] = province.center;
        
        // نقطه مرکز استان (کوچک و سبز)
        const provinceCenter = createProvinceBorder(province.center, 0x00ff00, 0.8);
        provinceCenter.userData = {
            type: 'province',
            name: province.name,
            center: province.center
        };
        iranBordersGroup.add(provinceCenter);
        
        // خطوط مرزی بین استان‌های مجاور (خطوط مستقیم)
        provinces.forEach((neighbor, neighborIndex) => {
            if (index !== neighborIndex) {
                const [neighborLat, neighborLng] = neighbor.center;
                
                // محاسبه فاصله بین دو استان
                const distance = Math.sqrt(
                    Math.pow(lat - neighborLat, 2) + Math.pow(lng - neighborLng, 2)
                );
                
                // فقط استان‌های نزدیک (فاصله کمتر از 5 درجه)
                if (distance < 5) {
                    const points = [];
                    const steps = 20;
                    for (let i = 0; i <= steps; i++) {
                        const t = i / steps;
                        const midLat = lat + (neighborLat - lat) * t;
                        const midLng = lng + (neighborLng - lng) * t;
                        
                        const phi = (90 - midLat) * (Math.PI / 180);
                        const theta = (midLng + 180) * (Math.PI / 180);
                        const radius = 1.001;
                        
                        const x = -radius * Math.sin(phi) * Math.cos(theta);
                        const y = radius * Math.cos(phi);
                        const z = radius * Math.sin(phi) * Math.sin(theta);
                        
                        points.push(new THREE.Vector3(x, y, z));
                    }
                    
                    const geometry = new THREE.BufferGeometry().setFromPoints(points);
                    const material = new THREE.LineBasicMaterial({
                        color: 0x00ff00,
                        transparent: true,
                        opacity: 0.4,
                        linewidth: 1
                    });
                    const line = new THREE.Line(geometry, material);
                    line.userData = {
                        type: 'provinceBorder',
                        from: province.name,
                        to: neighbor.name
                    };
                    iranBordersGroup.add(line);
                }
            }
        });
        
        // خطوط شهری (نقاط برای شهرها)
        province.cities.forEach(city => {
            if (city.coords && city.coords.length === 2) {
                const cityMarker = createCityMarker(city.coords, 0x4488ff, 0.6);
                cityMarker.userData = {
                    type: 'city',
                    name: city.name,
                    province: province.name,
                    coords: city.coords,
                    population: city.population
                };
                iranBordersGroup.add(cityMarker);
            }
        });
    });
    
    // اضافه کردن به earth
    scene.earth.add(iranBordersGroup);
    scene.iranBordersGroup = iranBordersGroup;
    
    log.info(`✅ مرزهای ${provinces.length} استان ایران اضافه شدند`);
}

// ایجاد مرز استان (خطوط واقعی مرزی - حذف دایره‌های سفید)
function createProvinceBorder(center, color = 0x00ff00, opacity = 0.6) {
    const [lat, lng] = center;
    const group = new THREE.Group();
    
    // تبدیل به مختصات 3D
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const radius = 1.001;
    
    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    
    // حذف دایره - فقط یک نقطه کوچک برای نشان دادن مرکز استان
    const pointGeometry = new THREE.SphereGeometry(0.003, 8, 8);
    const pointMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: opacity
    });
    const point = new THREE.Mesh(pointGeometry, pointMaterial);
    point.position.set(x, y, z);
    group.add(point);
    
    return group;
}

// ایجاد مارکر شهر
function createCityMarker(coords, color = 0x4488ff, opacity = 0.4) {
    const [lat, lng] = coords;
    
    // تبدیل به مختصات 3D
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const radius = 1.002;
    
    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    
    // نقطه کوچک برای شهر
    const geometry = new THREE.SphereGeometry(0.003, 8, 8);
    const material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: opacity
    });
    const marker = new THREE.Mesh(geometry, material);
    marker.position.set(x, y, z);
    
    return marker;
}

// داده‌های منابع طبیعی (آب، چوب، دام، طیور، حیوانات، جنگل، رودخانه، بیابان)
const naturalResourcesData = {
    // جنگل‌ها
    forests: {
        'BR': [
            { name: 'جنگل آمازون', coords: [-3.4653, -62.2159], area: 5500000, age: 55, type: 'استوایی', description: 'بزرگترین جنگل بارانی جهان' }
        ],
        'RU': [
            { name: 'جنگل تایگا', coords: [60.0, 100.0], area: 12000000, age: 10000, type: 'بورئال', description: 'بزرگترین جنگل جهان' }
        ],
        'CA_BC': [
            { name: 'جنگل بریتیش کلمبیا', coords: [54.0, -125.0], area: 600000, age: 500, type: 'معتدل', description: 'جنگل معتدل کانادا' }
        ],
        'ID': [
            { name: 'جنگل بارانی بورنئو', coords: [-0.7893, 113.9213], area: 400000, age: 130, type: 'استوایی', description: 'جنگل بارانی بورنئو' }
        ],
        'IR': [
            { name: 'جنگل هیرکانی', coords: [36.5, 51.0], area: 20000, age: 40, type: 'معتدل', description: 'جنگل هیرکانی شمال ایران' }
        ],
        'US': [
            { name: 'جنگل ملی یوسمیتی', coords: [37.8651, -119.5383], area: 3000, age: 200, type: 'معتدل', description: 'جنگل ملی یوسمیتی' },
            { name: 'جنگل ملی یلوستون', coords: [44.4280, -110.5885], area: 9000, age: 150, type: 'معتدل', description: 'جنگل ملی یلوستون' }
        ],
        'IN': [
            { name: 'جنگل سونداربانس', coords: [21.9497, 89.1833], area: 10000, age: 4000, type: 'مانگرو', description: 'بزرگترین جنگل مانگرو جهان' }
        ],
        'MY': [
            { name: 'جنگل بارانی مالزی', coords: [4.2105, 101.9758], area: 200000, age: 130, type: 'استوایی', description: 'جنگل بارانی مالزی' }
        ],
        'CD': [
            { name: 'جنگل کنگو', coords: [-0.2280, 15.8277], area: 2000000, age: 60, type: 'استوایی', description: 'دومین جنگل بارانی بزرگ جهان' }
        ],
        'CA': [
            { name: 'جنگل ملی بانف', coords: [51.1784, -115.5708], area: 6641, age: 100, type: 'بورئال', description: 'جنگل ملی بانف' }
        ],
        'NO': [
            { name: 'جنگل نروژ', coords: [60.4720, 8.4689], area: 120000, age: 10000, type: 'بورئال', description: 'جنگل بورئال نروژ' }
        ],
        'SE': [
            { name: 'جنگل سوئد', coords: [59.3293, 18.0686], area: 280000, age: 10000, type: 'بورئال', description: 'جنگل بورئال سوئد' }
        ],
        'FI': [
            { name: 'جنگل فنلاند', coords: [61.9241, 25.7482], area: 230000, age: 10000, type: 'بورئال', description: 'جنگل بورئال فنلاند' }
        ]
    },
    // رودخانه‌ها
    rivers: {
        'EG': [
            { name: 'نیل', start: [0.0, 32.9], end: [31.0, 30.0], length: 6650, description: 'طولانی‌ترین رودخانه جهان' }
        ],
        'BR': [
            { name: 'آمازون', start: [-5.0, -70.0], end: [-0.0, -50.0], length: 6400, description: 'بزرگترین رودخانه جهان' }
        ],
        'CN': [
            { name: 'یانگتسه', start: [33.0, 91.0], end: [31.0, 121.0], length: 6300, description: 'طولانی‌ترین رودخانه چین' }
        ],
        'US': [
            { name: 'میسیسیپی', start: [47.0, -95.0], end: [29.0, -89.0], length: 3734, description: 'رودخانه میسیسیپی' }
        ],
        'IR': [
            { name: 'کارون', start: [32.0, 50.0], end: [30.0, 48.0], length: 950, description: 'طولانی‌ترین رودخانه ایران' },
            { name: 'زاینده‌رود', start: [33.0, 50.0], end: [32.0, 51.0], length: 405, description: 'رودخانه اصفهان' },
            { name: 'سفیدرود', start: [36.0, 49.0], end: [37.0, 49.0], length: 670, description: 'رودخانه سفیدرود' }
        ],
        'RU': [
            { name: 'ولگا', start: [57.0, 32.0], end: [45.0, 47.0], length: 3692, description: 'طولانی‌ترین رودخانه اروپا' },
            { name: 'ینیسئی', start: [52.0, 93.0], end: [69.0, 86.0], length: 3487, description: 'رودخانه سیبری' }
        ],
        'IN': [
            { name: 'گانگس', start: [30.0, 79.0], end: [22.0, 88.0], length: 2525, description: 'رودخانه مقدس هند' },
            { name: 'براهماپوترا', start: [30.0, 91.0], end: [24.0, 90.0], length: 2900, description: 'رودخانه براهماپوترا' }
        ],
        'AR': [
            { name: 'پارانا', start: [-20.0, -52.0], end: [-34.0, -58.0], length: 4880, description: 'رودخانه پارانا' }
        ],
        'AU': [
            { name: 'موری', start: [-36.0, 148.0], end: [-35.0, 139.0], length: 2508, description: 'طولانی‌ترین رودخانه استرالیا' }
        ],
        'AF': [
            { name: 'هیرمند', start: [33.0, 66.0], end: [31.0, 61.0], length: 1150, description: 'رودخانه هیرمند' }
        ],
        'PK': [
            { name: 'سند', start: [35.0, 74.0], end: [24.0, 68.0], length: 3200, description: 'رودخانه سند' }
        ],
        'BD': [
            { name: 'پادما', start: [24.0, 89.0], end: [22.0, 90.0], length: 120, description: 'شاخه‌ای از گانگس' }
        ],
        'TH': [
            { name: 'چائو فرایا', start: [15.0, 100.0], end: [13.0, 100.0], length: 372, description: 'رودخانه اصلی تایلند' }
        ],
        'VN': [
            { name: 'مکونگ', start: [22.0, 103.0], end: [10.0, 106.0], length: 4350, description: 'رودخانه مکونگ' }
        ],
        'MM': [
            { name: 'ایروادی', start: [25.0, 97.0], end: [16.0, 96.0], length: 2170, description: 'رودخانه اصلی میانمار' }
        ],
        'LA': [
            { name: 'مکونگ', start: [20.0, 102.0], end: [14.0, 105.0], length: 800, description: 'بخشی از رودخانه مکونگ' }
        ],
        'KH': [
            { name: 'مکونگ', start: [14.0, 105.0], end: [11.0, 105.0], length: 500, description: 'بخشی از رودخانه مکونگ' }
        ],
        'TR': [
            { name: 'فرات', start: [39.0, 40.0], end: [36.0, 38.0], length: 2800, description: 'رودخانه فرات' },
            { name: 'دجله', start: [38.0, 40.0], end: [33.0, 44.0], length: 1850, description: 'رودخانه دجله' }
        ],
        'IQ': [
            { name: 'فرات', start: [36.0, 38.0], end: [31.0, 47.0], length: 1200, description: 'بخشی از رودخانه فرات' },
            { name: 'دجله', start: [33.0, 44.0], end: [30.0, 48.0], length: 1400, description: 'بخشی از رودخانه دجله' }
        ],
        'SY': [
            { name: 'فرات', start: [36.0, 38.0], end: [35.0, 40.0], length: 600, description: 'بخشی از رودخانه فرات' }
        ],
        'NG': [
            { name: 'نیجر', start: [9.0, 7.0], end: [5.0, 6.0], length: 4180, description: 'رودخانه نیجر' }
        ],
        'EG_Nile': [
            { name: 'نیل', start: [0.0, 32.9], end: [31.0, 30.0], length: 6650, description: 'طولانی‌ترین رودخانه جهان' }
        ],
        'SD': [
            { name: 'نیل', start: [4.0, 32.0], end: [15.0, 32.0], length: 1500, description: 'بخشی از رودخانه نیل' }
        ],
        'ET': [
            { name: 'نیل آبی', start: [12.0, 37.0], end: [15.0, 32.0], length: 1450, description: 'شاخه‌ای از نیل' }
        ],
        'UG': [
            { name: 'نیل سفید', start: [0.0, 32.0], end: [4.0, 32.0], length: 3700, description: 'شاخه‌ای از نیل' }
        ],
        'ZA': [
            { name: 'اورنج', start: [-29.0, 29.0], end: [-33.0, 18.0], length: 2200, description: 'رودخانه اورنج' }
        ],
        'ZM': [
            { name: 'زامبزی', start: [-11.0, 24.0], end: [-18.0, 36.0], length: 2574, description: 'رودخانه زامبزی' }
        ],
        'TZ': [
            { name: 'روزیزی', start: [-3.0, 29.0], end: [-8.0, 31.0], length: 300, description: 'رودخانه روزیزی' }
        ]
    },
    // بیابان‌ها
    deserts: {
        'SA': [
            { name: 'ربع الخالی', coords: [20.0, 50.0], area: 650000, temp: 50, description: 'بزرگترین بیابان شنی جهان' }
        ],
        'CN': [
            { name: 'گبی', coords: [42.0, 105.0], area: 1300000, temp: 40, description: 'بیابان گبی' }
        ],
        'AU': [
            { name: 'ویکتوریا', coords: [-29.0, 129.0], area: 348750, temp: 45, description: 'بزرگترین بیابان استرالیا' }
        ],
        'IR': [
            { name: 'دشت لوت', coords: [30.0, 58.0], area: 51800, temp: 70, description: 'گرم‌ترین نقطه زمین' },
            { name: 'کویر مرکزی', coords: [33.0, 54.0], area: 77000, temp: 50, description: 'کویر مرکزی ایران' }
        ],
        'US': [
            { name: 'موهاوی', coords: [35.0, -115.0], area: 124000, temp: 50, description: 'بیابان موهاوی' },
            { name: 'سونورا', coords: [32.0, -112.0], area: 260000, temp: 45, description: 'بیابان سونورا' }
        ],
        'MX': [
            { name: 'چیهواهوا', coords: [28.0, -105.0], area: 362600, temp: 40, description: 'بزرگترین بیابان آمریکای شمالی' }
        ],
        'AR': [
            { name: 'پاتاگونیا', coords: [-40.0, -70.0], area: 673000, temp: 10, description: 'بیابان سرد پاتاگونیا' }
        ],
        'CL': [
            { name: 'آتاکاما', coords: [-24.0, -69.0], area: 105000, temp: 25, description: 'خشک‌ترین بیابان جهان' }
        ],
        'NA': [
            { name: 'صحرای بزرگ آفریقا', coords: [23.0, 10.0], area: 9000000, temp: 50, description: 'بزرگترین بیابان گرم جهان' }
        ],
        'MN': [
            { name: 'گبی', coords: [42.0, 105.0], area: 1300000, temp: 40, description: 'بیابان گبی' }
        ],
        'KZ': [
            { name: 'قره‌قوم', coords: [40.0, 60.0], area: 350000, temp: 45, description: 'بیابان قره‌قوم' }
        ],
        'UZ': [
            { name: 'قیزیل‌قوم', coords: [42.0, 64.0], area: 300000, temp: 45, description: 'بیابان قیزیل‌قوم' }
        ],
        'IN': [
            { name: 'تار', coords: [27.0, 71.0], area: 200000, temp: 50, description: 'بیابان تار' }
        ],
        'PK': [
            { name: 'چولستان', coords: [29.0, 72.0], area: 26000, temp: 50, description: 'بیابان چولستان' }
        ],
        'AF': [
            { name: 'دشت مارگو', coords: [31.0, 64.0], area: 150000, temp: 45, description: 'بیابان دشت مارگو' }
        ],
        'OM': [
            { name: 'ربع الخالی', coords: [20.0, 55.0], area: 650000, temp: 50, description: 'بخشی از ربع الخالی' }
        ],
        'AE': [
            { name: 'ربع الخالی', coords: [23.0, 55.0], area: 650000, temp: 50, description: 'بخشی از ربع الخالی' }
        ],
        'YE': [
            { name: 'ربع الخالی', coords: [18.0, 50.0], area: 650000, temp: 50, description: 'بخشی از ربع الخالی' }
        ],
        'JO': [
            { name: 'وادی روم', coords: [29.5, 35.4], area: 720, temp: 40, description: 'بیابان وادی روم' }
        ],
        'IL': [
            { name: 'نگب', coords: [30.5, 34.8], area: 12000, temp: 40, description: 'بیابان نگب' }
        ],
        'EG': [
            { name: 'صحرای شرقی', coords: [26.0, 33.0], area: 223000, temp: 45, description: 'صحرای شرقی مصر' },
            { name: 'صحرای غربی', coords: [25.0, 27.0], area: 680000, temp: 45, description: 'صحرای غربی مصر' }
        ],
        'LY': [
            { name: 'صحرای لیبی', coords: [25.0, 18.0], area: 1100000, temp: 50, description: 'بخشی از صحرای بزرگ آفریقا' }
        ],
        'DZ': [
            { name: 'صحرای الجزایر', coords: [26.0, 3.0], area: 900000, temp: 50, description: 'بخشی از صحرای بزرگ آفریقا' }
        ],
        'MA': [
            { name: 'صحرای مراکش', coords: [25.0, -5.0], area: 252000, temp: 50, description: 'بخشی از صحرای بزرگ آفریقا' }
        ],
        'TD': [
            { name: 'صحرای چاد', coords: [17.0, 19.0], area: 1200000, temp: 50, description: 'بخشی از صحرای بزرگ آفریقا' }
        ],
        'NE': [
            { name: 'صحرای نیجر', coords: [17.0, 8.0], area: 1200000, temp: 50, description: 'بخشی از صحرای بزرگ آفریقا' }
        ],
        'ML': [
            { name: 'صحرای مالی', coords: [20.0, -3.0], area: 1200000, temp: 50, description: 'بخشی از صحرای بزرگ آفریقا' }
        ],
        'MR': [
            { name: 'صحرای موریتانی', coords: [20.0, -10.0], area: 1030000, temp: 50, description: 'بخشی از صحرای بزرگ آفریقا' }
        ],
        'BW': [
            { name: 'کالاهاری', coords: [-23.0, 21.0], area: 900000, temp: 40, description: 'بیابان کالاهاری' }
        ],
        'ZA': [
            { name: 'نامیب', coords: [-24.0, 15.0], area: 81000, temp: 35, description: 'بیابان نامیب' }
        ],
        'AU_deserts': [
            { name: 'ویکتوریا', coords: [-29.0, 129.0], area: 348750, temp: 45, description: 'بزرگترین بیابان استرالیا' },
            { name: 'گریت سندی', coords: [-20.0, 125.0], area: 284993, temp: 45, description: 'بیابان گریت سندی' },
            { name: 'سیمپسون', coords: [-25.0, 137.0], area: 176500, temp: 45, description: 'بیابان سیمپسون' },
            { name: 'گریت ویکتوریا', coords: [-29.0, 129.0], area: 348750, temp: 45, description: 'بیابان گریت ویکتوریا' }
        ]
    },
    // منابع آب زیرزمینی
    groundwater: {
        'US': [
            { name: 'آبخوان اوگالالا', coords: [39.0, -100.0], volume: 3000, depth: 30, description: 'بزرگترین آبخوان آمریکا' }
        ],
        'AU': [
            { name: 'آبخوان بزرگ آرتزین', coords: [-25.0, 140.0], volume: 65000, depth: 2000, description: 'بزرگترین آبخوان جهان' }
        ],
        'IR': [
            { name: 'آبخوان تهران', coords: [35.7, 51.4], volume: 500, depth: 100, description: 'آبخوان تهران' }
        ]
    },
    // دام و طیور
    livestock: {
        'CN': [
            { name: 'گاو', count: 100000000, coords: [35.0, 105.0], description: 'بزرگترین گله گاو جهان' },
            { name: 'خوک', count: 450000000, coords: [35.0, 105.0], description: 'بزرگترین گله خوک جهان' }
        ],
        'IN': [
            { name: 'گاو', count: 300000000, coords: [20.0, 77.0], description: 'گله بزرگ گاو هند' },
            { name: 'بز', count: 150000000, coords: [20.0, 77.0], description: 'گله بزرگ بز' }
        ],
        'BR': [
            { name: 'گاو', count: 215000000, coords: [-15.0, -47.0], description: 'گله بزرگ گاو برزیل' }
        ],
        'IR': [
            { name: 'گوسفند', count: 50000000, coords: [35.0, 51.0], description: 'گله گوسفند ایران' },
            { name: 'بز', count: 25000000, coords: [35.0, 51.0], description: 'گله بز ایران' }
        ]
    },
    // حیوانات وحشی
    wildlife: {
        'KE': [
            { name: 'شیر', count: 25000, coords: [-1.0, 36.0], description: 'جمعیت شیر کنیا' },
            { name: 'فیل', count: 35000, coords: [-1.0, 36.0], description: 'جمعیت فیل کنیا' }
        ],
        'ZA': [
            { name: 'کرگدن', count: 20000, coords: [-25.0, 28.0], description: 'جمعیت کرگدن آفریقای جنوبی' }
        ],
        'IN': [
            { name: 'ببر', count: 3000, coords: [20.0, 77.0], description: 'جمعیت ببر هند' },
            { name: 'فیل', count: 27000, coords: [20.0, 77.0], description: 'جمعیت فیل هند' }
        ],
        'RU': [
            { name: 'خرس قهوه‌ای', count: 120000, coords: [55.0, 37.0], description: 'جمعیت خرس روسیه' }
        ],
        'CN': [
            { name: 'پاندا', count: 1800, coords: [30.0, 105.0], description: 'جمعیت پاندا چین' }
        ]
    },
    // حیوانات دریایی
    marineLife: {
        'AU': [
            { name: 'کوسه سفید', count: 5000, coords: [-25.0, 153.0], description: 'کوسه سفید استرالیا' },
            { name: 'وال', count: 30000, coords: [-25.0, 153.0], description: 'وال استرالیا' }
        ],
        'US': [
            { name: 'فک', count: 150000, coords: [37.0, -122.0], description: 'فک کالیفرنیا' }
        ],
        'IS': [
            { name: 'وال', count: 20000, coords: [64.0, -21.0], description: 'وال ایسلند' }
        ],
        'JP': [
            { name: 'وال', count: 25000, coords: [35.0, 139.0], description: 'وال ژاپن' }
        ]
    }
};

// بارگذاری داده‌های منابع طبیعی
function loadNaturalResourcesData(scene) {
    const log = window.logger || { info: console.log }; log.info('🌿 بارگذاری داده‌های منابع طبیعی...');
    
    if (!scene || !scene.scene || !scene.earth) {
        const log = window.logger || { warn: console.warn }; log.warn('⚠️ scene یا earth پیدا نشد در loadNaturalResourcesData');
        return;
    }
    
    if (typeof createNeonMarker === 'undefined') {
        const log = window.logger || { error: console.error }; log.error('❌ تابع createNeonMarker پیدا نشد!');
        return;
    }
    
    const resourcesGroup = new THREE.Group();
    resourcesGroup.name = 'naturalResources';
    
    let markerCount = 0;
    
    try {
        // جنگل‌ها
        Object.entries(naturalResourcesData.forests).forEach(([countryCode, forests]) => {
            forests.forEach(forest => {
                if (forest.coords && forest.coords.length === 2) {
                    try {
                        const [lat, lng] = forest.coords;
                        const marker = createNeonMarker(0x22c55e, 0.012, 'forest');
                        
                        if (!marker) {
                            const log = window.logger || { warn: console.warn }; log.warn('⚠️ marker ایجاد نشد برای جنگل:', forest.name);
                            return;
                        }
                        
                        const phi = (90 - lat) * (Math.PI / 180);
                        const theta = (lng + 180) * (Math.PI / 180);
                        const radius = 1.005;
                        
                        const x = -radius * Math.sin(phi) * Math.cos(theta);
                        const y = radius * Math.cos(phi);
                        const z = radius * Math.sin(phi) * Math.sin(theta);
                        
                        marker.position.set(x, y, z);
                        const normal = new THREE.Vector3(x, y, z).normalize();
                        marker.lookAt(normal.multiplyScalar(2).add(marker.position));
                        marker.rotateX(Math.PI / 2);
                        
                        marker.userData = {
                            type: 'forest',
                            country: countryCode,
                            name: forest.name,
                            area: forest.area,
                            age: forest.age,
                            forestType: forest.type,
                            description: forest.description,
                            coords: [lat, lng]
                        };
                        
                        resourcesGroup.add(marker);
                        markerCount++;
                    } catch (e) {
                        const log = window.logger || { error: console.error }; log.error('❌ خطا در ایجاد marker برای جنگل:', forest.name, e);
                    }
                }
            });
        });
    
    // رودخانه‌ها - خطوط آبی
    Object.entries(naturalResourcesData.rivers).forEach(([countryCode, rivers]) => {
        rivers.forEach(river => {
            if (river.start && river.end) {
                const [startLat, startLng] = river.start;
                const [endLat, endLng] = river.end;
                
                // ایجاد خط رودخانه
                const points = [];
                const steps = 50;
                for (let i = 0; i <= steps; i++) {
                    const t = i / steps;
                    const lat = startLat + (endLat - startLat) * t;
                    const lng = startLng + (endLng - startLng) * t;
                    
                    const phi = (90 - lat) * (Math.PI / 180);
                    const theta = (lng + 180) * (Math.PI / 180);
                    const radius = 1.002;
                    
                    const x = -radius * Math.sin(phi) * Math.cos(theta);
                    const y = radius * Math.cos(phi);
                    const z = radius * Math.sin(phi) * Math.sin(theta);
                    
                    points.push(new THREE.Vector3(x, y, z));
                }
                
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const material = new THREE.LineBasicMaterial({
                    color: 0x3b82f6,
                    linewidth: 2,
                    transparent: true,
                    opacity: 0.8
                });
                const line = new THREE.Line(geometry, material);
                line.userData = {
                    type: 'river',
                    country: countryCode,
                    name: river.name,
                    length: river.length,
                    description: river.description
                };
                resourcesGroup.add(line);
            }
        });
    });
    
        // بیابان‌ها
        Object.entries(naturalResourcesData.deserts).forEach(([countryCode, deserts]) => {
            deserts.forEach(desert => {
                if (desert.coords && desert.coords.length === 2) {
                    try {
                        const [lat, lng] = desert.coords;
                        const marker = createNeonMarker(0xf59e0b, 0.010, 'desert');
                        
                        if (!marker) {
                            const log = window.logger || { warn: console.warn }; log.warn('⚠️ marker ایجاد نشد برای بیابان:', desert.name);
                            return;
                        }
                        
                        const phi = (90 - lat) * (Math.PI / 180);
                        const theta = (lng + 180) * (Math.PI / 180);
                        const radius = 1.005;
                        
                        const x = -radius * Math.sin(phi) * Math.cos(theta);
                        const y = radius * Math.cos(phi);
                        const z = radius * Math.sin(phi) * Math.sin(theta);
                        
                        marker.position.set(x, y, z);
                        const normal = new THREE.Vector3(x, y, z).normalize();
                        marker.lookAt(normal.multiplyScalar(2).add(marker.position));
                        marker.rotateX(Math.PI / 2);
                        
                        marker.userData = {
                            type: 'desert',
                            country: countryCode,
                            name: desert.name,
                            area: desert.area,
                            temperature: desert.temp,
                            description: desert.description,
                            coords: [lat, lng]
                        };
                        
                        resourcesGroup.add(marker);
                        markerCount++;
                    } catch (e) {
                        const log = window.logger || { error: console.error }; log.error('❌ خطا در ایجاد marker برای بیابان:', desert.name, e);
                    }
                }
            });
        });
        
        // منابع آب زیرزمینی
        Object.entries(naturalResourcesData.groundwater).forEach(([countryCode, aquifers]) => {
            aquifers.forEach(aquifer => {
                if (aquifer.coords && aquifer.coords.length === 2) {
                    try {
                        const [lat, lng] = aquifer.coords;
                        const marker = createNeonMarker(0x0ea5e9, 0.009, 'groundwater');
                        
                        if (!marker) {
                            const log = window.logger || { warn: console.warn }; log.warn('⚠️ marker ایجاد نشد برای آب زیرزمینی:', aquifer.name);
                            return;
                        }
                        
                        const phi = (90 - lat) * (Math.PI / 180);
                        const theta = (lng + 180) * (Math.PI / 180);
                        const radius = 1.005;
                        
                        const x = -radius * Math.sin(phi) * Math.cos(theta);
                        const y = radius * Math.cos(phi);
                        const z = radius * Math.sin(phi) * Math.sin(theta);
                        
                        marker.position.set(x, y, z);
                        const normal = new THREE.Vector3(x, y, z).normalize();
                        marker.lookAt(normal.multiplyScalar(2).add(marker.position));
                        marker.rotateX(Math.PI / 2);
                        
                        marker.userData = {
                            type: 'groundwater',
                            country: countryCode,
                            name: aquifer.name,
                            volume: aquifer.volume,
                            depth: aquifer.depth,
                            description: aquifer.description,
                            coords: [lat, lng]
                        };
                        
                        resourcesGroup.add(marker);
                        markerCount++;
                    } catch (e) {
                        const log = window.logger || { error: console.error }; log.error('❌ خطا در ایجاد marker برای آب زیرزمینی:', aquifer.name, e);
                    }
                }
            });
        });
        
        // دام و طیور
        Object.entries(naturalResourcesData.livestock).forEach(([countryCode, animals]) => {
            animals.forEach(animal => {
                if (animal.coords && animal.coords.length === 2) {
                    try {
                        const [lat, lng] = animal.coords;
                        const marker = createNeonMarker(0x8b5cf6, 0.008, 'livestock');
                        
                        if (!marker) {
                            const log = window.logger || { warn: console.warn }; log.warn('⚠️ marker ایجاد نشد برای دام:', animal.name);
                            return;
                        }
                        
                        const phi = (90 - lat) * (Math.PI / 180);
                        const theta = (lng + 180) * (Math.PI / 180);
                        const radius = 1.005;
                        
                        const x = -radius * Math.sin(phi) * Math.cos(theta);
                        const y = radius * Math.cos(phi);
                        const z = radius * Math.sin(phi) * Math.sin(theta);
                        
                        marker.position.set(x, y, z);
                        const normal = new THREE.Vector3(x, y, z).normalize();
                        marker.lookAt(normal.multiplyScalar(2).add(marker.position));
                        marker.rotateX(Math.PI / 2);
                        
                        marker.userData = {
                            type: 'livestock',
                            country: countryCode,
                            name: animal.name,
                            count: animal.count,
                            description: animal.description,
                            coords: [lat, lng]
                        };
                        
                        resourcesGroup.add(marker);
                        markerCount++;
                    } catch (e) {
                        const log = window.logger || { error: console.error }; log.error('❌ خطا در ایجاد marker برای دام:', animal.name, e);
                    }
                }
            });
        });
        
        // حیوانات وحشی
        Object.entries(naturalResourcesData.wildlife).forEach(([countryCode, animals]) => {
            animals.forEach(animal => {
                if (animal.coords && animal.coords.length === 2) {
                    try {
                        const [lat, lng] = animal.coords;
                        const marker = createNeonMarker(0xec4899, 0.008, 'wildlife');
                        
                        if (!marker) {
                            const log = window.logger || { warn: console.warn }; log.warn('⚠️ marker ایجاد نشد برای حیوان وحشی:', animal.name);
                            return;
                        }
                        
                        const phi = (90 - lat) * (Math.PI / 180);
                        const theta = (lng + 180) * (Math.PI / 180);
                        const radius = 1.005;
                        
                        const x = -radius * Math.sin(phi) * Math.cos(theta);
                        const y = radius * Math.cos(phi);
                        const z = radius * Math.sin(phi) * Math.sin(theta);
                        
                        marker.position.set(x, y, z);
                        const normal = new THREE.Vector3(x, y, z).normalize();
                        marker.lookAt(normal.multiplyScalar(2).add(marker.position));
                        marker.rotateX(Math.PI / 2);
                        
                        marker.userData = {
                            type: 'wildlife',
                            country: countryCode,
                            name: animal.name,
                            count: animal.count,
                            description: animal.description,
                            coords: [lat, lng]
                        };
                        
                        resourcesGroup.add(marker);
                        markerCount++;
                    } catch (e) {
                        const log = window.logger || { error: console.error }; log.error('❌ خطا در ایجاد marker برای حیوان وحشی:', animal.name, e);
                    }
                }
            });
        });
        
        // حیوانات دریایی
        Object.entries(naturalResourcesData.marineLife).forEach(([countryCode, animals]) => {
            animals.forEach(animal => {
                if (animal.coords && animal.coords.length === 2) {
                    try {
                        const [lat, lng] = animal.coords;
                        const marker = createNeonMarker(0x06b6d4, 0.008, 'marine');
                        
                        if (!marker) {
                            const log = window.logger || { warn: console.warn }; log.warn('⚠️ marker ایجاد نشد برای حیوان دریایی:', animal.name);
                            return;
                        }
                        
                        const phi = (90 - lat) * (Math.PI / 180);
                        const theta = (lng + 180) * (Math.PI / 180);
                        const radius = 1.005;
                        
                        const x = -radius * Math.sin(phi) * Math.cos(theta);
                        const y = radius * Math.cos(phi);
                        const z = radius * Math.sin(phi) * Math.sin(theta);
                        
                        marker.position.set(x, y, z);
                        const normal = new THREE.Vector3(x, y, z).normalize();
                        marker.lookAt(normal.multiplyScalar(2).add(marker.position));
                        marker.rotateX(Math.PI / 2);
                        
                        marker.userData = {
                            type: 'marine',
                            country: countryCode,
                            name: animal.name,
                            count: animal.count,
                            description: animal.description,
                            coords: [lat, lng]
                        };
                        
                        resourcesGroup.add(marker);
                        markerCount++;
                    } catch (e) {
                        const log = window.logger || { error: console.error }; log.error('❌ خطا در ایجاد marker برای حیوان دریایی:', animal.name, e);
                    }
                }
            });
        });
    
        // اضافه کردن به earth برای چرخش با کره
        if (scene.earth) {
            scene.earth.add(resourcesGroup);
        } else {
            scene.scene.add(resourcesGroup);
        }
        const log = window.logger || { info: console.log }; log.info(`✅ ${markerCount} مارکر منابع طبیعی اضافه شد`);
    } catch (error) {
        const log = window.logger || { error: console.error }; log.error('❌ خطا در loadNaturalResourcesData:', error);
    }
}

// ============================================
// Export توابع و داده‌ها به window
// Export functions and data to window
// ============================================
// 
// توجه: توابع openFinancialGlobe, openResourcesGlobe, open3DGlobe, closeGlobeModal, resetGlobeView
// در globe-modals.js تعریف شده‌اند و در آنجا export می‌شوند.
// 
// توجه: توابع populateMarketList, setupMarketSelector
// در globe-markets.js تعریف شده‌اند و در آنجا export می‌شوند.
// 
// این فایل فقط توابع مربوط به کره‌های 3D را export می‌کند.
// 
// Note: Functions openFinancialGlobe, openResourcesGlobe, open3DGlobe, closeGlobeModal, resetGlobeView
// are defined in globe-modals.js and exported there.
// 
// Note: Functions populateMarketList, setupMarketSelector
// are defined in globe-markets.js and exported there.
// 
// This file only exports functions related to 3D globes.

window.load3DGlobeData = load3DGlobeData;
window.setupEarthquakeFilters = setupEarthquakeFilters;
window.setupNaturalResourcesFilters = setupNaturalResourcesFilters;
window.loadWeatherData = loadWeatherData;
window.loadMilitaryData = loadMilitaryData;
window.loadUniversitiesData = loadUniversitiesData;
window.loadHistoricalData = loadHistoricalData;
window.loadEarthquakeData = loadEarthquakeData;
window.loadNaturalResourcesData = loadNaturalResourcesData;
window.setupEarthquakeCitySelection = setupEarthquakeCitySelection;
window.saveEarthquakeNotificationSettings = saveEarthquakeNotificationSettings;
window.checkEarthquakeNotifications = checkEarthquakeNotifications;
window.filterEarthquakesByYear = filterEarthquakesByYear;
window.filterEarthquakesByMagnitude = filterEarthquakesByMagnitude;
window.filterNaturalResources = filterNaturalResources;
window.loadIranProvincialBorders = loadIranProvincialBorders;
window.createProvinceBorder = createProvinceBorder;
window.createCityMarker = createCityMarker;

// Export داده‌ها
window.weatherData = weatherData;
window.universitiesData = universitiesData;
window.historicalSitesData = historicalSitesData;
window.earthquakeData = earthquakeData;
window.naturalResourcesData = naturalResourcesData;

