/**
 * ============================================
 * 🌍 Globe Resources - Resources Globe Functions
 * ============================================
 * 
 * این فایل شامل تمام توابع مربوط به کره منابع است.
 * This file contains all functions related to the resources globe.
 * 
 * وابستگی‌ها / Dependencies:
 * - THREE.js (THREE.Group, THREE.Mesh, THREE.Vector3, etc.)
 * - globe-helpers.js (addEventListenerOnce)
 * - globe-simple.js (buildSimpleGlobe, simpleGlobeScenes)
 * - window.countriesData (داده‌های کشورها)
 * - window.createWorldBorders (تابع ساخت مرزها)
 * - window.createTankMarker, window.createAircraftMarker, window.createShipMarker, window.createSoldierMarker (توابع ساخت مارکرهای نظامی)
 * - window.logger (optional)
 * - window.errorHandler (optional)
 * 
 * استفاده / Usage:
 * این فایل باید بعد از globe-helpers.js, globe-clock.js, globe-markets.js, globe-simple.js لود شود.
 * This file should be loaded after globe-helpers.js, globe-clock.js, globe-markets.js, globe-simple.js.
 * 
 * توابع اصلی / Main Functions:
 * - resourcesGlobeData: object نگه‌دارنده داده‌های کره منابع
 * - createAllConflicts: ساخت گروه درگیری‌ها
 * - selectCountry: انتخاب کشور
 * - showFacilityPopup: نمایش popup المان‌ها
 * - showCountryInfo: نمایش اطلاعات کشور
 * - zoomToCountry: زوم به کشور
 * - populateCountryList: پر کردن لیست کشورها
 * - createDefaultCountryData: ایجاد داده پیش‌فرض برای کشور
 * - generateDefaultFacilities: تولید المان‌های پیش‌فرض
 * - showCountryFacilities: نمایش المان‌های کشور
 * - addFacilityMarker: اضافه کردن مارکر المان
 * - getFacilityColor: دریافت رنگ المان
 * - closeGlobeFacilityPopup: بستن popup المان
 * 
 * Export ها / Exports:
 * تمام توابع و متغیرها به window export می‌شوند برای استفاده در سایر فایل‌ها.
 * All functions and variables are exported to window for use in other files.
 * 
 * ============================================
 */

// 🌍 کره منابع - اطلاعات کشورها
// ==================== //

// متغیرهای سراسری برای کره منابع
let resourcesGlobeData = {
    selectedCountry: null,
    bordersGroup: null,
    conflictsGroup: null,
    tradeLinesGroup: null,
    labelsGroup: null,
    showBorders: true,
    showConflicts: true,
    showTradeLines: false,
    showLabels: true,
    tradeType: 'exports'
};

// ایجاد گروه جنگ‌ها و درگیری‌ها با تانک
function createAllConflicts(earth) {
    const conflictsGroup = new THREE.Group();
    conflictsGroup.name = 'conflicts';
    
    if (typeof countriesData === 'undefined' || !countriesData) return conflictsGroup;
    
    // بررسی همه کشورها برای جنگ‌ها
    Object.entries(countriesData).forEach(([countryCode, countryData]) => {
        if (countryData.conflicts && Array.isArray(countryData.conflicts) && countryData.conflicts.length > 0) {
            countryData.conflicts.forEach(conflict => {
                // استفاده از مختصات جنگ یا پایتخت کشور مقابل
                let coords = conflict.coords;
                if (!coords && conflict.opponent && countriesData[conflict.opponent]) {
                    const opponentData = countriesData[conflict.opponent];
                    if (opponentData.capital && opponentData.capital.coords) {
                        coords = opponentData.capital.coords;
                    }
                }
                
                if (coords && coords.length === 2) {
                    const [lat, lng] = coords;
                    
                    // ایجاد تانک برای نمایش جنگ
                    const tank = createTankMarker(0xdc2626, 0.012); // قرمز تیره
                    
                    // تبدیل به مختصات 3D
                    const phi = (90 - lat) * (Math.PI / 180);
                    const theta = (lng + 180) * (Math.PI / 180);
                    const radius = 1.006;
                    
                    const x = -radius * Math.sin(phi) * Math.cos(theta);
                    const y = radius * Math.cos(phi);
                    const z = radius * Math.sin(phi) * Math.sin(theta);
                    
                    tank.position.set(x, y, z);
                    
                    // چرخاندن تانک به سمت بالا
                    const normal = new THREE.Vector3(x, y, z).normalize();
                    tank.lookAt(normal.multiplyScalar(2).add(tank.position));
                    tank.rotateX(Math.PI / 2);
                    
                    // ذخیره اطلاعات
                    tank.userData = {
                        type: 'conflict',
                        country: countryCode,
                        countryName: countryData.name,
                        opponent: conflict.opponent,
                        opponentName: countriesData[conflict.opponent]?.name || conflict.opponent,
                        intensity: conflict.intensity || 'conflict',
                        since: conflict.since || 'unknown',
                        description: conflict.description || 'درگیری',
                        coords: [lat, lng]
                    };
                    
                    conflictsGroup.add(tank);
                }
            });
        }
    });
    
    if (earth && earth.scene) {
        earth.scene.add(conflictsGroup);
    }
    
    return conflictsGroup;
}

// نمایش قدرت نظامی - نیروی هوایی
function showAirForceOnGlobe() {
    if (!window.resourcesGlobeObjects || !window.resourcesGlobeObjects.earth) return;
    
    if (!militaryMarkersGroup) {
        militaryMarkersGroup = new THREE.Group();
        militaryMarkersGroup.name = 'militaryMarkers';
        window.resourcesGlobeObjects.earth.scene.add(militaryMarkersGroup);
    }
    
    if (typeof countriesData === 'undefined' || !countriesData) return;
    
    Object.entries(countriesData).forEach(([code, data]) => {
        if (data.military && data.military.airForce) {
            const airForce = data.military.airForce;
            const capital = data.capital;
            
            if (capital && capital.coords) {
                const [lat, lng] = capital.coords;
                
                // ایجاد هواپیمای جنگی
                const aircraft = createAircraftMarker(0xef4444, 0.01);
                
                // تبدیل به مختصات 3D
                const phi = (90 - lat) * (Math.PI / 180);
                const theta = (lng + 180) * (Math.PI / 180);
                const radius = 1.005;
                
                const x = -radius * Math.sin(phi) * Math.cos(theta);
                const y = radius * Math.cos(phi);
                const z = radius * Math.sin(phi) * Math.sin(theta);
                
                aircraft.position.set(x, y, z);
                
                // چرخاندن به سمت بالا
                const normal = new THREE.Vector3(x, y, z).normalize();
                aircraft.lookAt(normal.multiplyScalar(2).add(aircraft.position));
                aircraft.rotateX(Math.PI / 2);
                
                // ذخیره اطلاعات
                aircraft.userData = {
                    type: 'military-air',
                    country: code,
                    countryName: data.name,
                    rank: airForce.rank,
                    aircraft: airForce.aircraft,
                    description: airForce.description
                };
                
                militaryMarkersGroup.add(aircraft);
            }
        }
    });
}

// نمایش قدرت نظامی - نیروی زمینی (تانک و سرباز)
function showGroundForceOnGlobe() {
    if (!window.resourcesGlobeObjects || !window.resourcesGlobeObjects.earth) return;
    
    if (!militaryMarkersGroup) {
        militaryMarkersGroup = new THREE.Group();
        militaryMarkersGroup.name = 'militaryMarkers';
        window.resourcesGlobeObjects.earth.scene.add(militaryMarkersGroup);
    }
    
    Object.entries(countriesData).forEach(([code, data]) => {
        if (data.military && data.military.groundForce) {
            const groundForce = data.military.groundForce;
            const capital = data.capital;
            
            if (capital && capital.coords) {
                const [lat, lng] = capital.coords;
                
                // ایجاد تانک
                const tank = createTankMarker(0x64748b, 0.012);
                
                // تبدیل به مختصات 3D
                const phi = (90 - lat) * (Math.PI / 180);
                const theta = (lng + 180) * (Math.PI / 180);
                const radius = 1.005;
                
                const x = -radius * Math.sin(phi) * Math.cos(theta);
                const y = radius * Math.cos(phi);
                const z = radius * Math.sin(phi) * Math.sin(theta);
                
                tank.position.set(x, y, z);
                
                // چرخاندن به سمت بالا
                const normal = new THREE.Vector3(x, y, z).normalize();
                tank.lookAt(normal.multiplyScalar(2).add(tank.position));
                tank.rotateX(Math.PI / 2);
                
                // ذخیره اطلاعات
                tank.userData = {
                    type: 'military-ground',
                    country: code,
                    countryName: data.name,
                    rank: groundForce.rank,
                    tanks: groundForce.tanks,
                    soldiers: groundForce.soldiers,
                    description: groundForce.description
                };
                
                militaryMarkersGroup.add(tank);
                
                // اضافه کردن سربازان (چند ردیف کوچک)
                const soldierCount = Math.min(5, Math.floor(groundForce.soldiers / 100000));
                for (let i = 0; i < soldierCount; i++) {
                    const offset = (i - soldierCount / 2) * 0.02;
                    const soldier = createSoldierMarker(0x64748b, 0.005);
                    
                    const offsetPhi = (90 - (lat + offset)) * (Math.PI / 180);
                    const offsetTheta = ((lng + offset) + 180) * (Math.PI / 180);
                    
                    const sx = -radius * Math.sin(offsetPhi) * Math.cos(offsetTheta);
                    const sy = radius * Math.cos(offsetPhi);
                    const sz = radius * Math.sin(offsetPhi) * Math.sin(offsetTheta);
                    
                    soldier.position.set(sx, sy, sz);
                    
                    const sNormal = new THREE.Vector3(sx, sy, sz).normalize();
                    soldier.lookAt(sNormal.multiplyScalar(2).add(soldier.position));
                    soldier.rotateX(Math.PI / 2);
                    
                    soldier.userData = {
                        type: 'soldier',
                        country: code,
                        countryName: data.name
                    };
                    
                    militaryMarkersGroup.add(soldier);
                }
            }
        }
    });
}

// نمایش قدرت نظامی - نیروی دریایی
function showNavyOnGlobe() {
    if (!window.resourcesGlobeObjects || !window.resourcesGlobeObjects.earth) return;
    
    if (!militaryMarkersGroup) {
        militaryMarkersGroup = new THREE.Group();
        militaryMarkersGroup.name = 'militaryMarkers';
        window.resourcesGlobeObjects.earth.scene.add(militaryMarkersGroup);
    }
    
    Object.entries(countriesData).forEach(([code, data]) => {
        if (data.military && data.military.navy) {
            const navy = data.military.navy;
            // استفاده از بندر یا پایتخت ساحلی
            let coords = null;
            if (data.ports && data.ports.length > 0) {
                coords = data.ports[0].coords;
            } else if (data.capital && data.capital.coords) {
                coords = data.capital.coords;
            }
            
            if (coords && coords.length === 2) {
                const [lat, lng] = coords;
                
                // ایجاد کشتی جنگی
                const ship = createShipMarker(0x0ea5e9, 0.012);
                
                // تبدیل به مختصات 3D
                const phi = (90 - lat) * (Math.PI / 180);
                const theta = (lng + 180) * (Math.PI / 180);
                const radius = 1.005;
                
                const x = -radius * Math.sin(phi) * Math.cos(theta);
                const y = radius * Math.cos(phi);
                const z = radius * Math.sin(phi) * Math.sin(theta);
                
                ship.position.set(x, y, z);
                
                // چرخاندن به سمت بالا
                const normal = new THREE.Vector3(x, y, z).normalize();
                ship.lookAt(normal.multiplyScalar(2).add(ship.position));
                ship.rotateX(Math.PI / 2);
                
                // ذخیره اطلاعات
                ship.userData = {
                    type: 'military-navy',
                    country: code,
                    countryName: data.name,
                    rank: navy.rank,
                    ships: navy.ships,
                    submarines: navy.submarines,
                    description: navy.description
                };
                
                militaryMarkersGroup.add(ship);
            }
        }
    });
}

// متغیر گروه المان‌های نظامی
let militaryMarkersGroup = null;

// پاک کردن المان‌های نظامی
function hideMilitaryMarkers() {
    if (militaryMarkersGroup && window.resourcesGlobeObjects && window.resourcesGlobeObjects.earth) {
        window.resourcesGlobeObjects.earth.scene.remove(militaryMarkersGroup);
        militaryMarkersGroup.traverse((obj) => {
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) obj.material.dispose();
            if (obj instanceof THREE.Light) obj.dispose();
        });
        militaryMarkersGroup = null;
    }
}

// پر کردن لیست کشورها
function populateCountryList() {
    const listContainer = document.getElementById('countryList');
    if (!listContainer || typeof countriesData === 'undefined' || !countriesData) return;
    
    listContainer.innerHTML = '';
    
    // گرفتن پرچم کشور از کد کشور
    const getFlag = (code) => {
        const flags = {
            'IR': '🇮🇷', 'US': '🇺🇸', 'RU': '🇷🇺', 'CN': '🇨🇳', 'UK': '🇬🇧',
            'DE': '🇩🇪', 'FR': '🇫🇷', 'JP': '🇯🇵', 'IN': '🇮🇳', 'BR': '🇧🇷',
            'SA': '🇸🇦', 'AE': '🇦🇪', 'TR': '🇹🇷', 'IL': '🇮🇱', 'EG': '🇪🇬',
            'AU': '🇦🇺', 'CA': '🇨🇦', 'KR': '🇰🇷', 'KP': '🇰🇵', 'PK': '🇵🇰',
            'AF': '🇦🇫', 'IQ': '🇮🇶', 'SY': '🇸🇾', 'YE': '🇾🇪', 'UA': '🇺🇦',
            'ZA': '🇿🇦'
        };
        return flags[code] || '🏳️';
    };
    
    // بررسی وجود countriesData
    if (typeof countriesData === 'undefined' || !countriesData) return;
    
    // مرتب‌سازی بر اساس GDP
    const sortedCountries = Object.entries(countriesData)
        .sort((a, b) => (b[1].gdp || 0) - (a[1].gdp || 0));
    
    sortedCountries.forEach(([code, data]) => {
        const item = document.createElement('div');
        item.className = 'country-item';
        item.dataset.code = code;
        
        // تعیین سطح ریسک
        let riskClass = 'low';
        if (data.investmentRisk >= 60) riskClass = 'high';
        else if (data.investmentRisk >= 35) riskClass = 'medium';
        
        item.innerHTML = `
            <span class="flag">${getFlag(code)}</span>
            <span class="name">${data.name}</span>
            <span class="risk ${riskClass}">${data.investmentRisk || 0}%</span>
        `;
        
        item.addEventListener('click', () => selectCountry(code));
        listContainer.appendChild(item);
    });
}

// ایجاد داده پیش‌فرض برای کشورهایی که در countriesData نیستند
function createDefaultCountryData(code, countryName = null) {
    // استفاده از countryCodeToName اگر موجود باشد
    const name = countryName || (window.countryCodeToName && window.countryCodeToName[code]) || code;
    
    return {
        name: name,
        nameEn: name,
        capital: { name: name, coords: [0, 0] },
        continent: "asia",
        gdp: 50,
        gdpRank: 150,
        gdpPerCapita: 2000,
        inflation: 5,
        unemployment: 5,
        currency: "USD",
        currencyName: "دلار",
        population: 10000000,
        populationDensity: 50,
        populationGrowth: 1,
        resources: {},
        exports: {
            total: 10,
            partners: [
                { country: "CN", amount: 3, percent: 30 },
                { country: "US", amount: 2, percent: 20 },
                { country: "DE", amount: 1, percent: 10 }
            ],
            mainProducts: ["محصولات"]
        },
        imports: {
            total: 12,
            partners: [
                { country: "CN", amount: 4, percent: 33 },
                { country: "US", amount: 2, percent: 17 },
                { country: "DE", amount: 1, percent: 8 }
            ],
            mainProducts: ["ماشین‌آلات", "الکترونیک"]
        },
        investmentRisk: 50,
        riskFactors: [],
        relations: {}
    };
}

// انتخاب کشور
function selectCountry(code) {
    const log = window.logger || { info: console.log }; log.info('🏳️ انتخاب کشور:', code);
    
    resourcesGlobeData.selectedCountry = code;
    
    // بررسی وجود countriesData
    if (typeof countriesData === 'undefined' || !countriesData) {
        const log = window.logger || { warn: console.warn };
        log.warn('⚠️ countriesData تعریف نشده است');
        return;
    }
    
    let countryData = countriesData[code];
    
    // اگر کشور در countriesData نیست، داده پیش‌فرض ایجاد کن
    if (!countryData) {
        const log = window.logger || { warn: console.warn }; log.warn('⚠️ کشور در countriesData پیدا نشد، ایجاد داده پیش‌فرض:', code);
        countryData = createDefaultCountryData(code);
        // اضافه کردن به countriesData برای استفاده بعدی
        countriesData[code] = countryData;
    }
    
    // بستن پنل لیست کشورها بعد از انتخاب
    const countrySelectPanel = document.getElementById('countrySelectPanel');
    if (countrySelectPanel) {
        countrySelectPanel.classList.remove('active');
    }
    
    // به‌روزرسانی UI لیست
    document.querySelectorAll('.country-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.code === code) {
            item.classList.add('active');
        }
    });
    
    // نمایش پنل اطلاعات کشور
    showCountryInfo(code, countryData);
    
    // به‌روزرسانی مرزها بر اساس روابط
    if (resourcesGlobeData.bordersGroup) {
        updateBordersForCountry(resourcesGlobeData.bordersGroup, code);
    }
    
    // نمایش راهنمای رنگ‌ها (کوچک در گوشه)
    // document.getElementById('relationsLegend')?.classList.add('active');
    
    // نمایش المان‌های این کشور (گمرک، پالایشگاه، معادن و...)
    if (window.resourcesGlobeObjects && window.resourcesGlobeObjects.earth) {
        const earth = window.resourcesGlobeObjects.earth;
        
        // ایجاد گروه المان‌های کشور اگر وجود نداشته باشد
        if (!facilityMarkersGroup) {
            facilityMarkersGroup = new THREE.Group();
            facilityMarkersGroup.name = 'facilityMarkers';
            earth.add(facilityMarkersGroup);
        }
        
        // نمایش همه المان‌های کشور انتخاب شده
        const countryData = countriesData[code] || {};
        showCountryFacilities(code, countryData);
    }
    
    // زوم به کشور
    zoomToCountry(code);
}

// تولید المان‌های پیش‌فرض برای کشورهایی که المان ندارند - بهبود یافته
function generateDefaultFacilities(countryCode, countryData) {
    const facilities = {
        customs: [],
        refineries: [],
        mines: [],
        ports: [],
        oilRigs: []
    };
    
    if (!countryData.capital || !countryData.capital.coords) return facilities;
    
    const [capLat, capLng] = countryData.capital.coords;
    const resources = countryData.resources || {};
    const gdp = countryData.gdp || 10;
    const population = countryData.population || 1000000;
    
    // گمرکات - حداقل 1 تا 3 گمرک بر اساس اندازه کشور
    const customsCount = Math.min(3, Math.max(1, Math.floor(population / 10000000) + 1));
    for (let i = 0; i < customsCount; i++) {
        const offset = i * 0.3;
        facilities.customs.push({
            name: i === 0 ? `گمرک ${countryData.capital.name}` : `گمرک مرزی ${i}`,
            coords: [capLat + (i % 2 === 0 ? offset : -offset), capLng + (i % 3 === 0 ? offset : -offset)],
            workingHours: "دوشنبه تا جمعه: 9:00-17:00",
            description: i === 0 ? "گمرک اصلی" : "گمرک مرزی"
        });
    }
    
    // پالایشگاه‌ها - بر اساس نفت و گاز
    if (resources.oil || resources.gas) {
        const oilProduction = resources.oil?.production || 0;
        const gasProduction = resources.gas?.production || 0;
        const totalProduction = oilProduction + gasProduction;
        
        // تعداد پالایشگاه بر اساس تولید
        const refineryCount = Math.min(5, Math.max(1, Math.floor(totalProduction / 200) + 1));
        for (let i = 0; i < refineryCount; i++) {
            const offset = (i + 1) * 0.4;
            facilities.refineries.push({
                name: `پالایشگاه ${countryData.capital.name} ${i + 1}`,
                coords: [capLat + offset, capLng + (i % 2 === 0 ? offset : -offset)],
                capacity: `${Math.floor(totalProduction / refineryCount / 1000)}k bbl/day`,
                description: `پالایشگاه ${i + 1}`
            });
        }
    }
    
    // سکوهای نفتی - فقط برای کشورهای ساحلی با نفت
    if ((resources.oil || resources.gas) && (countryData.ports || Math.abs(capLat) < 60)) {
        const oilProduction = resources.oil?.production || 0;
        const rigCount = Math.min(3, Math.max(1, Math.floor(oilProduction / 100)));
        for (let i = 0; i < rigCount; i++) {
            const offset = (i + 1) * 0.6;
            facilities.oilRigs.push({
                name: `سکوی نفتی ${countryData.name} ${i + 1}`,
                coords: [capLat + offset, capLng + offset],
                capacity: `${Math.floor(oilProduction / rigCount / 1000)}k bbl/day`,
                description: "سکوی دریایی"
            });
        }
    }
    
    // معادن - بر اساس منابع معدنی
    const mineTypes = [];
    if (resources.gold) mineTypes.push({ type: 'طلا', name: 'طلا' });
    if (resources.silver) mineTypes.push({ type: 'نقره', name: 'نقره' });
    if (resources.copper) mineTypes.push({ type: 'مس', name: 'مس' });
    if (resources.iron) mineTypes.push({ type: 'آهن', name: 'آهن' });
    if (resources.diamonds) mineTypes.push({ type: 'الماس', name: 'الماس' });
    if (resources.coal) mineTypes.push({ type: 'زغال', name: 'زغال سنگ' });
    if (resources.uranium) mineTypes.push({ type: 'اورانیوم', name: 'اورانیوم' });
    if (resources.bauxite) mineTypes.push({ type: 'باکسیت', name: 'باکسیت' });
    
    mineTypes.forEach((mineType, i) => {
        const offset = (i + 1) * 0.5;
        facilities.mines.push({
            name: `معدن ${mineType.name} ${countryData.name}`,
            coords: [capLat - offset, capLng - (i % 2 === 0 ? offset : -offset)],
            capacity: "متغیر",
            description: `معدن ${mineType.name}`
        });
    });
    
    // بنادر - برای کشورهای ساحلی
    if (!countryData.ports || countryData.ports.length === 0) {
        if (Math.abs(capLat) < 60) { // کشورهای ساحلی
            const portCount = Math.min(3, Math.max(1, Math.floor(gdp / 50) + 1));
            for (let i = 0; i < portCount; i++) {
                const offset = i * 0.4;
                facilities.ports.push({
                    name: i === 0 ? `بندر ${countryData.capital.name}` : `بندر ${i + 1}`,
                    coords: [capLat + (i % 2 === 0 ? offset : -offset), capLng + offset],
                    workingHours: "24/7",
                    description: i === 0 ? "بندر اصلی" : "بندر تجاری"
                });
            }
        }
    }
    
    return facilities;
}

// نمایش المان‌های یک کشور خاص
function showCountryFacilities(countryCode, countryData) {
    if (!facilityMarkersGroup) return;
    
    // حذف المان‌های قبلی این کشور (اگر وجود داشته باشد)
    const existingMarkers = facilityMarkersGroup.children.filter(child => 
        child.userData && child.userData.country === countryCode
    );
    existingMarkers.forEach(marker => {
        facilityMarkersGroup.remove(marker);
        marker.traverse((obj) => {
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) obj.material.dispose();
            if (obj instanceof THREE.Light) obj.dispose();
        });
    });
    
    // استفاده از المان‌های موجود یا تولید پیش‌فرض
    const defaultFacilities = generateDefaultFacilities(countryCode, countryData);
    
    // اضافه کردن گمرکات
    const customs = countryData.customs || defaultFacilities.customs;
    if (Array.isArray(customs) && customs.length > 0) {
        customs.forEach(customs => {
            if (customs.coords && customs.coords.length === 2) {
                addFacilityMarker(customs, countryCode, countryData.name, 'customs', getFacilityColor('customs'));
            }
        });
    }
    
    // اضافه کردن پالایشگاه‌ها
    const refineries = countryData.refineries || defaultFacilities.refineries;
    if (Array.isArray(refineries) && refineries.length > 0) {
        refineries.forEach(refinery => {
            if (refinery.coords && refinery.coords.length === 2) {
                addFacilityMarker(refinery, countryCode, countryData.name, 'refinery', getFacilityColor('refinery'));
            }
        });
    }
    
    // اضافه کردن کارخانه‌ها
    if (countryData.factories && Array.isArray(countryData.factories)) {
        countryData.factories.forEach(factory => {
            if (factory.coords && factory.coords.length === 2) {
                addFacilityMarker(factory, countryCode, countryData.name, 'factory', getFacilityColor('factory'));
            }
        });
    }
    
    // اضافه کردن معادن
    const mines = countryData.mines || defaultFacilities.mines;
    if (Array.isArray(mines) && mines.length > 0) {
        mines.forEach(mine => {
            if (mine.coords && mine.coords.length === 2) {
                addFacilityMarker(mine, countryCode, countryData.name, 'mine', getFacilityColor('mine'));
            }
        });
    }
    
    // اضافه کردن بنادر
    const ports = countryData.ports || defaultFacilities.ports;
    if (Array.isArray(ports) && ports.length > 0) {
        ports.forEach(port => {
            if (port.coords && port.coords.length === 2) {
                addFacilityMarker(port, countryCode, countryData.name, 'port', getFacilityColor('port'));
            }
        });
    }
    
    // اضافه کردن سکوهای نفتی
    const oilRigs = countryData.oilRigs || defaultFacilities.oilRigs;
    if (Array.isArray(oilRigs) && oilRigs.length > 0) {
        oilRigs.forEach(rig => {
            if (rig.coords && rig.coords.length === 2) {
                addFacilityMarker(rig, countryCode, countryData.name, 'oil-rig', getFacilityColor('oil-rig'));
            }
        });
    }
}

// تکمیل داده‌های صادرات/واردات برای کشورهایی که ندارند
function ensureTradeData(countryCode, countryData) {
    // اگر صادرات/واردات دارد، برگردان
    if (countryData.exports && countryData.imports) {
        return countryData;
    }
    
    // تولید داده‌های پیش‌فرض بر اساس GDP و موقعیت جغرافیایی
    const gdp = countryData.gdp || 100;
    const continent = countryData.continent || 'asia';
    
    // شرکای تجاری پیش‌فرض بر اساس قاره
    const defaultPartners = {
        'asia': ['CN', 'JP', 'IN', 'KR', 'SG'],
        'europe': ['DE', 'FR', 'UK', 'IT', 'NL'],
        'africa': ['CN', 'US', 'FR', 'IN', 'DE'],
        'north_america': ['US', 'CA', 'MX', 'CN', 'JP'],
        'south_america': ['US', 'CN', 'BR', 'AR', 'CL'],
        'oceania': ['CN', 'US', 'JP', 'KR', 'AU']
    };
    
    const partners = defaultPartners[continent] || ['CN', 'US', 'DE', 'JP', 'FR'];
    
    // تولید صادرات/واردات بر اساس GDP
    const exportTotal = gdp * 0.15; // 15% GDP
    const importTotal = gdp * 0.18; // 18% GDP
    
    if (!countryData.exports) {
        countryData.exports = {
            total: exportTotal,
            partners: partners.slice(0, 5).map((p, i) => ({
                country: p,
                amount: exportTotal * (0.3 - i * 0.05),
                percent: Math.round((0.3 - i * 0.05) * 100)
            })),
            mainProducts: ["محصولات", "کالا", "خدمات"]
        };
    }
    
    if (!countryData.imports) {
        countryData.imports = {
            total: importTotal,
            partners: partners.slice(0, 5).map((p, i) => ({
                country: p,
                amount: importTotal * (0.3 - i * 0.05),
                percent: Math.round((0.3 - i * 0.05) * 100)
            })),
            mainProducts: ["ماشین‌آلات", "الکترونیک", "نفت"]
        };
    }
    
    return countryData;
}

// نمایش اطلاعات کشور
function showCountryInfo(code, data) {
    const panel = document.getElementById('countryInfoPanel');
    const nameEl = document.getElementById('selectedCountryName');
    const contentEl = document.getElementById('countryInfoContent');
    
    if (!panel || !contentEl) return;
    
    // تکمیل داده‌های تجاری
    const completeData = ensureTradeData(code, data);
    
    nameEl.textContent = `${completeData.name} (${completeData.nameEn})`;
    
    // فرمت‌کردن اعداد
    const formatNumber = (num) => {
        if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num?.toLocaleString() || '-';
    };
    
    const formatMoney = (num) => {
        return '$' + formatNumber(num);
    };
    
    // ساخت HTML اطلاعات
    contentEl.innerHTML = `
        <!-- اقتصادی -->
        <div class="info-section">
            <h5>📊 اقتصادی</h5>
            <div class="info-grid">
                <div class="info-item">
                    <div class="label">GDP</div>
                    <div class="value">${formatMoney(completeData.gdp)}B</div>
                </div>
                <div class="info-item">
                    <div class="label">رتبه جهانی</div>
                    <div class="value">#${completeData.gdpRank || '-'}</div>
                </div>
                <div class="info-item">
                    <div class="label">درآمد سرانه</div>
                    <div class="value">${formatMoney(completeData.gdpPerCapita)}</div>
                </div>
                <div class="info-item">
                    <div class="label">تورم</div>
                    <div class="value ${completeData.inflation > 10 ? 'negative' : ''}">${completeData.inflation || 0}%</div>
                </div>
                <div class="info-item">
                    <div class="label">بیکاری</div>
                    <div class="value ${completeData.unemployment > 15 ? 'negative' : ''}">${completeData.unemployment || 0}%</div>
                </div>
                <div class="info-item">
                    <div class="label">ارز</div>
                    <div class="value">${completeData.currencyName || '-'}</div>
                </div>
            </div>
        </div>
        
        <!-- جمعیتی -->
        <div class="info-section">
            <h5>👥 جمعیتی</h5>
            <div class="info-grid">
                <div class="info-item">
                    <div class="label">جمعیت</div>
                    <div class="value">${formatNumber(completeData.population)}</div>
                </div>
                <div class="info-item">
                    <div class="label">تراکم</div>
                    <div class="value">${completeData.populationDensity || 0}/km²</div>
                </div>
                <div class="info-item">
                    <div class="label">نرخ رشد</div>
                    <div class="value ${completeData.populationGrowth > 0 ? 'positive' : 'negative'}">${completeData.populationGrowth || 0}%</div>
                </div>
            </div>
        </div>
        
        <!-- منابع طبیعی -->
        ${completeData.resources && Object.keys(completeData.resources).length > 0 ? `
        <div class="info-section">
            <h5>⛏️ منابع طبیعی</h5>
            ${Object.entries(completeData.resources).map(([key, res]) => `
                <div class="resource-bar">
                    <div class="header">
                        <span>${getResourceName(key)}</span>
                        <span>رتبه ${res.rank || '-'}</span>
                    </div>
                    <div class="bar">
                        <div class="fill ${key}" style="width: ${Math.min(100, 100 - (res.rank || 50) * 2)}%"></div>
                    </div>
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        <!-- صادرات -->
        ${completeData.exports ? `
        <div class="info-section">
            <h5>📤 صادرات (${formatMoney(completeData.exports.total)}B)</h5>
            <div class="trade-partners">
                ${completeData.exports.partners?.slice(0, 10).map(p => `
                    <div class="trade-partner" onclick="showTradeLine('${code}', '${p.country}', 'exports')">
                        <span class="flag">${getCountryFlag(p.country)}</span>
                        <span class="country">${getCountryName(p.country)}</span>
                        <span class="amount">${formatMoney(p.amount)}B</span>
                        <span class="percent">${p.percent}%</span>
                    </div>
                `).join('')}
            </div>
            <button class="filter-btn" style="margin-top:10px;width:100%" onclick="showAllTradeLines('${code}', 'exports')">
                📤 نمایش همه صادرات روی نقشه
            </button>
        </div>
        ` : ''}
        
        <!-- واردات -->
        ${completeData.imports ? `
        <div class="info-section">
            <h5>📥 واردات (${formatMoney(completeData.imports.total)}B)</h5>
            <div class="trade-partners">
                ${completeData.imports.partners?.slice(0, 10).map(p => `
                    <div class="trade-partner" onclick="showTradeLine('${code}', '${p.country}', 'imports')">
                        <span class="flag">${getCountryFlag(p.country)}</span>
                        <span class="country">${getCountryName(p.country)}</span>
                        <span class="amount">${formatMoney(p.amount)}B</span>
                        <span class="percent">${p.percent}%</span>
                    </div>
                `).join('')}
            </div>
            <button class="filter-btn" style="margin-top:10px;width:100%" onclick="showAllTradeLines('${code}', 'imports')">
                📥 نمایش همه واردات روی نقشه
            </button>
        </div>
        ` : ''}
        
        <!-- ریسک سرمایه‌گذاری -->
        <div class="info-section">
            <h5>⚠️ ریسک سرمایه‌گذاری</h5>
            <div class="risk-indicator">
                <div class="meter">
                    <div class="needle" style="left: ${data.investmentRisk || 0}%"></div>
                </div>
                <div class="value" style="color: ${data.investmentRisk >= 60 ? '#ef4444' : data.investmentRisk >= 35 ? '#f59e0b' : '#22c55e'}">
                    ${data.investmentRisk || 0}%
                </div>
            </div>
            ${data.riskFactors?.length > 0 ? `
            <div style="font-size:0.8rem;color:rgba(255,255,255,0.6);margin-top:8px">
                ⚡ ${data.riskFactors.join(' • ')}
            </div>
            ` : ''}
        </div>
        
        <!-- درگیری‌ها -->
        ${data.conflicts?.length > 0 ? `
        <div class="info-section">
            <h5>⚔️ درگیری‌ها</h5>
            ${data.conflicts.map(c => `
                <div style="background:rgba(239,68,68,0.2);padding:10px;border-radius:8px;margin-bottom:8px">
                    <div style="font-weight:bold;color:#ef4444">
                        ${c.intensity === 'war' ? '🔴 جنگ' : c.intensity === 'tension' ? '🟠 تنش' : '🟡 درگیری'}
                        با ${getCountryName(c.opponent)}
                    </div>
                    <div style="font-size:0.8rem;color:rgba(255,255,255,0.7);margin-top:4px">
                        ${c.description} (از ${c.since})
                    </div>
                </div>
            `).join('')}
        </div>
        ` : ''}
    `;
    
    panel.classList.add('active');
}

// بستن پنل اطلاعات کشور
function closeCountryInfo() {
    const panel = document.getElementById('countryInfoPanel');
    if (panel) panel.classList.remove('active');
    
    document.getElementById('relationsLegend')?.classList.remove('active');
    resourcesGlobeData.selectedCountry = null;
    
    // ریست رنگ مرزها
    if (resourcesGlobeData.bordersGroup) {
        resourcesGlobeData.bordersGroup.children.forEach(group => {
            group.children.forEach(line => {
                if (line.material) {
                    line.material.color.setHex(0x4488ff);
                    line.material.opacity = 0.4;
                }
            });
        });
    }
}

// گرفتن نام منبع
function getResourceName(key) {
    const names = {
        'oil': '🛢️ نفت',
        'gas': '💨 گاز طبیعی',
        'gold': '🥇 طلا',
        'iron': '⚫ آهن',
        'copper': '🟤 مس',
        'coal': '⬛ زغال‌سنگ',
        'uranium': '☢️ اورانیوم',
        'diamonds': '💎 الماس',
        'platinum': '⚪ پلاتین',
        'chromium': '🔘 کروم',
        'rareEarth': '🌍 خاک‌های کمیاب',
        'potash': '🧂 پتاس',
        'manganese': '⚙️ منگنز',
        'niobium': '🔷 نیوبیم',
        'lithium': '🔋 لیتیم',
        'boron': '💠 بور',
        'mica': '✨ میکا'
    };
    return names[key] || key;
}

// گرفتن پرچم کشور
function getCountryFlag(code) {
    const flags = {
        'IR': '🇮🇷', 'US': '🇺🇸', 'RU': '🇷🇺', 'CN': '🇨🇳', 'UK': '🇬🇧',
        'DE': '🇩🇪', 'FR': '🇫🇷', 'JP': '🇯🇵', 'IN': '🇮🇳', 'BR': '🇧🇷',
        'SA': '🇸🇦', 'AE': '🇦🇪', 'TR': '🇹🇷', 'IL': '🇮🇱', 'EG': '🇪🇬',
        'AU': '🇦🇺', 'CA': '🇨🇦', 'KR': '🇰🇷', 'KP': '🇰🇵', 'PK': '🇵🇰',
        'AF': '🇦🇫', 'IQ': '🇮🇶', 'SY': '🇸🇾', 'YE': '🇾🇪', 'UA': '🇺🇦',
        'ZA': '🇿🇦', 'NL': '🇳🇱', 'IT': '🇮🇹', 'ES': '🇪🇸', 'MX': '🇲🇽',
        'AR': '🇦🇷', 'VN': '🇻🇳', 'TW': '🇹🇼', 'HK': '🇭🇰', 'TH': '🇹🇭',
        'ID': '🇮🇩', 'MY': '🇲🇾', 'PH': '🇵🇭', 'SG': '🇸🇬', 'NZ': '🇳🇿',
        'CH': '🇨🇭', 'AT': '🇦🇹', 'BE': '🇧🇪', 'PL': '🇵🇱', 'SE': '🇸🇪',
        'NO': '🇳🇴', 'DK': '🇩🇰', 'FI': '🇫🇮', 'IE': '🇮🇪', 'PT': '🇵🇹',
        'GR': '🇬🇷', 'CZ': '🇨🇿', 'HU': '🇭🇺', 'RO': '🇷🇴', 'BY': '🇧🇾',
        'KZ': '🇰🇿', 'UZ': '🇺🇿', 'AZ': '🇦🇿', 'GE': '🇬🇪', 'AM': '🇦🇲',
        'QA': '🇶🇦', 'KW': '🇰🇼', 'BH': '🇧🇭', 'OM': '🇴🇲', 'JO': '🇯🇴',
        'LB': '🇱🇧', 'PS': '🇵🇸', 'NG': '🇳🇬', 'KE': '🇰🇪', 'ET': '🇪🇹',
        'MA': '🇲🇦', 'DZ': '🇩🇿', 'TN': '🇹🇳', 'LY': '🇱🇾', 'SD': '🇸🇩'
    };
    return flags[code] || '🏳️';
}

// گرفتن نام کشور
function getCountryName(code) {
    if (countriesData[code]) return countriesData[code].name;
    return countryCodeToName[code] || code;
}

// زوم به کشور
function zoomToCountry(code) {
    const data = countriesData[code];
    if (!data || !data.capital) return;
    
    const [lat, lng] = data.capital.coords;
    const log = window.logger || { info: console.log }; log.info(`🎯 زوم به ${data.name}: lat=${lat}, lng=${lng}`);
    
    // استفاده از تابع موجود برای زوم
    if (window.resourcesGlobeObjects) {
        const { camera, controls, earth, stopRotate } = window.resourcesGlobeObjects;
        if (camera && earth) {
            // توقف چرخش اتوماتیک
            if (stopRotate) stopRotate();
            
            // ریست چرخش کره برای هماهنگی با مختصات
            earth.rotation.y = 0;
            
            // محاسبه موقعیت دوربین
            // توجه: باید از همون فرمول مرزها استفاده کنیم
            const phi = (90 - lat) * (Math.PI / 180);
            const theta = (lng + 180) * (Math.PI / 180);
            
            const distance = 2.2; // نزدیکتر برای دید بهتر
            const x = -distance * Math.sin(phi) * Math.cos(theta);
            const y = distance * Math.cos(phi);
            const z = distance * Math.sin(phi) * Math.sin(theta);
            
            // انیمیشن دوربین
            const startPos = camera.position.clone();
            const endPos = new THREE.Vector3(x, y, z);
            const duration = 1200;
            const startTime = Date.now();
            
            const animateZoom = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
                
                camera.position.lerpVectors(startPos, endPos, eased);
                camera.lookAt(0, 0, 0);
                
                if (controls) controls.update();
                
                if (progress < 1) {
                    requestAnimationFrame(animateZoom);
                }
            };
            animateZoom();
        }
    }
}

// نمایش خط تجارت به یک کشور
function showTradeLine(fromCode, toCode, type) {
    const log = window.logger || { info: console.log }; log.info(`📊 نمایش خط ${type} از ${fromCode} به ${toCode}`);
    
    if (!window.resourcesGlobeObjects) return;
    const { earth } = window.resourcesGlobeObjects;
    
    // پاک کردن خطوط قبلی
    clearTradeLines(earth);
    
    const fromData = countriesData[fromCode];
    const toData = countriesData[toCode];
    
    if (!fromData || !toData) return;
    
    const fromCoords = fromData.capital.coords;
    const toCoords = toData.capital.coords;
    
    const color = type === 'exports' ? 0x22c55e : 0x3b82f6;
    
    const arc = createArcLine(fromCoords, toCoords, color, 0.3);
    
    const tradeGroup = new THREE.Group();
    tradeGroup.name = 'tradeLines';
    tradeGroup.add(arc);
    
    // اضافه کردن به earth نه scene
    earth.add(tradeGroup);
    resourcesGlobeData.tradeLinesGroup = tradeGroup;
}

// نمایش همه خطوط تجارت
function showAllTradeLines(countryCode, type) {
    const log = window.logger || { info: console.log }; log.info(`📊 نمایش همه ${type} برای ${countryCode}`);
    
    if (!window.resourcesGlobeObjects) return;
    const { earth } = window.resourcesGlobeObjects;
    
    // پاک کردن خطوط قبلی
    clearTradeLines(earth);
    
    // ایجاد خطوط جدید - اضافه کردن به earth نه scene
    const tradeGroup = createTradeLines(countryCode, type, earth);
    resourcesGlobeData.tradeLinesGroup = tradeGroup;
}

// راه‌اندازی پنل‌های کره منابع
function setupResourcesGlobePanels() {
    // دکمه نمایش/مخفی فیلترها
    const toggleFiltersBtn = document.getElementById('toggleFiltersBtn');
    if (toggleFiltersBtn) {
        toggleFiltersBtn.addEventListener('click', () => {
            const panel = document.getElementById('resourcesFilterPanel');
            if (panel) panel.classList.toggle('active');
        });
    }
    
    // دکمه نمایش/مخفی لیست کشورها
    const toggleCountriesBtn = document.getElementById('toggleCountriesBtn');
    if (toggleCountriesBtn) {
        toggleCountriesBtn.addEventListener('click', () => {
            const panel = document.getElementById('countrySelectPanel');
            if (panel) panel.classList.toggle('active');
        });
    }
    
    // جستجوی کشور
    const searchInput = document.getElementById('countrySearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            document.querySelectorAll('.country-item').forEach(item => {
                const name = item.querySelector('.name')?.textContent.toLowerCase() || '';
                item.style.display = name.includes(query) ? 'flex' : 'none';
            });
        });
    }
    
    // فیلتر منابع (نفت، گاز، طلا و...)
    document.querySelectorAll('#resourceFilters .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // فقط یکی فعال باشه
            document.querySelectorAll('#resourceFilters .filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            filterCountriesByResource(filter);
        });
    });
    
    // فیلترهای نمایش (مرزها، صادرات، واردات، درگیری)
    document.querySelectorAll('#viewFilters .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            const view = btn.dataset.view;
            
            switch(view) {
                case 'borders':
                    resourcesGlobeData.showBorders = btn.classList.contains('active');
                    if (resourcesGlobeData.bordersGroup) {
                        resourcesGlobeData.bordersGroup.visible = resourcesGlobeData.showBorders;
                    }
                    break;
                case 'labels':
                    resourcesGlobeData.showLabels = btn.classList.contains('active');
                    if (resourcesGlobeData.labelsGroup) {
                        resourcesGlobeData.labelsGroup.visible = resourcesGlobeData.showLabels;
                    }
                    break;
                case 'conflicts':
                    resourcesGlobeData.showConflicts = btn.classList.contains('active');
                    if (resourcesGlobeData.conflictsGroup) {
                        resourcesGlobeData.conflictsGroup.visible = resourcesGlobeData.showConflicts;
                    }
                    break;
                case 'exports':
                case 'imports':
                    if (btn.classList.contains('active')) {
                        if (resourcesGlobeData.selectedCountry) {
                            showAllTradeLines(resourcesGlobeData.selectedCountry, view);
                        } else {
                            alert('🌍 ابتدا یک کشور انتخاب کنید');
                            btn.classList.remove('active');
                        }
                    } else {
                        // پاک کردن خطوط تجارت
                        if (window.resourcesGlobeObjects && window.resourcesGlobeObjects.earth) {
                            clearTradeLines(window.resourcesGlobeObjects.earth);
                        }
                    }
                    break;
            }
        });
    });
    
    // فیلتر قدرت نظامی
    document.querySelectorAll('#militaryFilters .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // فقط یک فیلتر می‌تونه فعال باشه
            document.querySelectorAll('#militaryFilters .filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const militaryType = btn.dataset.military;
            
            // پاک کردن المان‌های قبلی
            hideMilitaryMarkers();
            
            if (militaryType === 'all') {
                // نمایش همه
                showAirForceOnGlobe();
                showGroundForceOnGlobe();
                showNavyOnGlobe();
            } else if (militaryType === 'air') {
                showAirForceOnGlobe();
            } else if (militaryType === 'ground') {
                showGroundForceOnGlobe();
            } else if (militaryType === 'navy') {
                showNavyOnGlobe();
            } else if (militaryType === 'rank') {
                // نمایش بر اساس رتبه (فقط 10 کشور برتر)
                const topCountries = Object.entries(countriesData)
                    .filter(([code, data]) => data.military && data.military.rank)
                    .sort((a, b) => (a[1].military.rank || 999) - (b[1].military.rank || 999))
                    .slice(0, 10);
                
                topCountries.forEach(([code, data]) => {
                    if (data.military) {
                        if (data.military.airForce) showAirForceOnGlobe();
                        if (data.military.groundForce) showGroundForceOnGlobe();
                        if (data.military.navy) showNavyOnGlobe();
                    }
                });
            }
        });
    });
    
    // فیلتر قاره
    document.querySelectorAll('#continentFilters .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#continentFilters .filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const continent = btn.dataset.continent;
            filterCountriesByContinent(continent);
        });
    });
    
    // فیلتر تاسیسات (پالایشگاه، کارخانه، گمرک) - پشتیبانی از چند فیلتر همزمان
    document.querySelectorAll('#facilityFilters .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            updateAllFacilities(); // به‌روزرسانی همه المان‌ها بر اساس فیلترهای فعال
        });
    });
    
    // تابع به‌روزرسانی همه المان‌ها بر اساس فیلترهای فعال
    window.updateAllFacilities = function() {
        if (!window.resourcesGlobeObjects || !window.resourcesGlobeObjects.earth) return;
        
        // پاک کردن همه المان‌ها
        hideAllFacilities();
        
        // گرفتن فیلترهای فعال
        const activeFilters = Array.from(document.querySelectorAll('#facilityFilters .filter-btn.active'))
            .map(btn => btn.dataset.filter);
        
        // نمایش المان‌های مربوط به فیلترهای فعال
        activeFilters.forEach(filter => {
            if (filter === 'customs') {
                showCustomsOnGlobe();
            } else if (filter === 'refinery') {
                showRefineriesOnGlobe();
            } else if (filter === 'factory') {
                showFactoriesOnGlobe();
            } else if (filter === 'mine') {
                showMinesOnGlobe();
            } else if (filter === 'port') {
                showPortsOnGlobe();
            } else if (filter === 'oil-rig') {
                showOilRigsOnGlobe();
            }
        });
    };
    
    // فیلتر سال
    const yearFilter = document.getElementById('yearFilter');
    if (yearFilter) {
        yearFilter.addEventListener('change', (e) => {
            const selectedYear = e.target.value;
            const log = window.logger || { info: console.log }; log.info(`📅 تغییر سال به: ${selectedYear}`);
            resourcesGlobeData.selectedYear = selectedYear;
            
            // در آینده: بارگذاری داده‌های سال از API
            // برای الان فقط یک پیام نمایش می‌دهیم
            if (selectedYear !== '2024') {
                showYearChangeMessage(selectedYear);
            }
            
            // به‌روزرسانی اطلاعات کشور انتخابی
            if (resourcesGlobeData.selectedCountry) {
                const countryData = countriesData[resourcesGlobeData.selectedCountry];
                if (countryData) {
                    showCountryInfo(resourcesGlobeData.selectedCountry, countryData);
                }
            }
        });
    }
}

// نمایش پیام تغییر سال
function showYearChangeMessage(year) {
    // اگر قبلاً پیام موجود است، حذفش کن
    const existingMsg = document.querySelector('.year-change-message');
    if (existingMsg) existingMsg.remove();
    
    const msg = document.createElement('div');
    msg.className = 'year-change-message';
    msg.innerHTML = `
        <div class="year-msg-content">
            <span>📅</span>
            <span>داده‌های سال ${year} از طریق API بارگذاری خواهد شد</span>
        </div>
    `;
    msg.style.cssText = `
        position: fixed;
        bottom: 150px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(59, 130, 246, 0.9);
        color: white;
        padding: 12px 24px;
        border-radius: 12px;
        backdrop-filter: blur(10px);
        z-index: 99999;
        animation: slideUp 0.3s ease;
    `;
    
    document.body.appendChild(msg);
    
    setTimeout(() => {
        msg.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => msg.remove(), 300);
    }, 3000);
}

// فیلتر کشورها بر اساس منبع طبیعی و نمایش آیکون‌ها روی نقشه
function filterCountriesByResource(resourceType) {
    // فیلتر لیست کشورها
    document.querySelectorAll('.country-item').forEach(item => {
        const code = item.dataset.code;
        const data = countriesData[code];
        
        if (resourceType === 'all') {
            item.style.display = 'flex';
        } else if (data && data.resources && data.resources[resourceType]) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
    
    // نمایش آیکون‌های منابع روی نقشه
    if (window.resourcesGlobeObjects && window.resourcesGlobeObjects.earth) {
        const earth = window.resourcesGlobeObjects.earth;
        
        if (typeof showResourcesByType === 'function') {
            showResourcesByType(earth, resourceType);
        }
    }
}

// فیلتر کشورها بر اساس قاره
function filterCountriesByContinent(continent) {
    document.querySelectorAll('.country-item').forEach(item => {
        const code = item.dataset.code;
        const data = countriesData[code];
        
        if (continent === 'all' || (data && data.continent === continent)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// نمایش المان‌های روی کره (گمرک، معادن، پالایشگاه و...)
let facilityMarkersGroup = null;
let globePopup = null;

// رنگ‌های بهینه شده برای هر نوع المان (با درخشش بیشتر و زیباتر)
const FACILITY_COLORS = {
    'customs': 0xffd700,      // طلایی درخشان - گمرک
    'refinery': 0x3b82f6,     // آبی روشن - پالایشگاه
    'factory': 0x6366f1,      // بنفش-آبی - کارخانه
    'mine': 0x22c55e,         // سبز زمردی - معدن
    'port': 0x8b5cf6,         // بنفش روشن - بندر
    'oil-rig': 0xf59e0b,      // نارنجی طلایی - سکوی نفتی
    'military-air': 0xef4444, // قرمز روشن - نیروی هوایی
    'military-ground': 0x64748b, // خاکستری فولادی - نیروی زمینی
    'military-navy': 0x0ea5e9,  // آبی دریایی - نیروی دریایی
    'tank': 0xdc2626,         // قرمز تیره - تانک
    'soldier': 0x64748b,      // خاکستری - سرباز
    'aircraft': 0xef4444,     // قرمز - هواپیمای جنگی
    'ship': 0x0ea5e9          // آبی - کشتی جنگی
};

// تابع کمکی برای گرفتن رنگ المان
function getFacilityColor(type) {
    return FACILITY_COLORS[type] || 0xffffff;
}

// ایجاد چراغ نئونی زیبا - قابل مشاهده از بالا با چرخش و افکت‌های بهتر
function createNeonMarker(color, size = 0.008, type = 'customs') {
    const group = new THREE.Group();
    
    // شکل بر اساس نوع المان - کوچک و کم‌نور برای نمایش بهتر
    let shapeGeometry;
    let shapeSize = size;
    let baseSize = size * 0.4; // کاهش اندازه پایه به 0.4 برابر (قبلاً 1.2 بود)
    
    if (type === 'customs') {
        // گمرک: مثلث طلایی با پایه بزرگتر و نوک تیز
        shapeGeometry = new THREE.ConeGeometry(baseSize * 1.8, baseSize * 3.5, 3);
        shapeSize = baseSize * 1.6;
    } else if (type === 'refinery') {
        // پالایشگاه: استوانه آبی با قطر بیشتر و برج بلند
        shapeGeometry = new THREE.CylinderGeometry(baseSize * 1.6, baseSize * 1.8, baseSize * 3.2, 12);
        shapeSize = baseSize * 1.4;
    } else if (type === 'factory') {
        // کارخانه: مکعب با لبه‌های گرد
        shapeGeometry = new THREE.BoxGeometry(baseSize * 2.2, baseSize * 2.8, baseSize * 2.2);
        shapeSize = baseSize * 1.4;
    } else if (type === 'mine') {
        // معدن: الماس سبز بزرگتر با برش‌های بیشتر
        shapeGeometry = new THREE.OctahedronGeometry(baseSize * 2.2);
        shapeSize = baseSize * 1.7;
    } else if (type === 'port') {
        // بندر: استوانه بنفش بلندتر با قطر بیشتر
        shapeGeometry = new THREE.CylinderGeometry(baseSize * 1.4, baseSize * 1.6, baseSize * 3.5, 10);
        shapeSize = baseSize * 1.5;
    } else if (type === 'oil-rig') {
        // سکوی نفتی: هرم نارنجی بزرگتر با پایه چهارگوش
        shapeGeometry = new THREE.ConeGeometry(baseSize * 2.0, baseSize * 4.0, 4);
        shapeSize = baseSize * 1.8;
    } else if (type === 'military-air') {
        // نیروی هوایی: هواپیمای جنگی (مثلث با بال)
        shapeGeometry = new THREE.ConeGeometry(baseSize * 1.5, baseSize * 3.0, 3);
        shapeSize = baseSize * 1.5;
    } else if (type === 'military-ground' || type === 'tank') {
        // نیروی زمینی/تانک: مکعب مستطیل با لوله
        shapeGeometry = new THREE.BoxGeometry(baseSize * 2.5, baseSize * 1.5, baseSize * 2.0);
        shapeSize = baseSize * 1.4;
    } else if (type === 'military-navy') {
        // نیروی دریایی: کشتی (استوانه کشیده)
        shapeGeometry = new THREE.CylinderGeometry(baseSize * 1.2, baseSize * 1.4, baseSize * 3.5, 8);
        shapeSize = baseSize * 1.5;
    } else if (type === 'soldier') {
        // سرباز: استوانه کوچک
        shapeGeometry = new THREE.CylinderGeometry(baseSize * 0.8, baseSize * 0.8, baseSize * 2.0, 8);
        shapeSize = baseSize * 1.0;
    } else if (type === 'university') {
        // دانشگاه: مکعب با لبه‌های گرد (کتاب)
        shapeGeometry = new THREE.BoxGeometry(baseSize * 2.0, baseSize * 2.8, baseSize * 1.5);
        shapeSize = baseSize * 1.4;
    } else if (type === 'historical') {
        // تاریخی: استوانه بلند (ستون)
        shapeGeometry = new THREE.CylinderGeometry(baseSize * 1.2, baseSize * 1.4, baseSize * 4.0, 12);
        shapeSize = baseSize * 1.6;
    } else if (type === 'weather') {
        // آب و هوا: کره کوچک
        shapeGeometry = new THREE.SphereGeometry(baseSize * 1.5, 16, 16);
        shapeSize = baseSize * 1.3;
    } else if (type === 'earthquake') {
        // زلزله: دایره با موج (ring)
        shapeGeometry = new THREE.RingGeometry(baseSize * 0.8, baseSize * 1.5, 32);
        shapeSize = baseSize * 1.2;
    } else if (type === 'forest') {
        // جنگل: درخت (مخروط)
        shapeGeometry = new THREE.ConeGeometry(baseSize * 1.5, baseSize * 3.0, 8);
        shapeSize = baseSize * 1.5;
    } else if (type === 'desert') {
        // بیابان: هرم مسطح
        shapeGeometry = new THREE.ConeGeometry(baseSize * 2.0, baseSize * 1.5, 6);
        shapeSize = baseSize * 1.3;
    } else if (type === 'groundwater') {
        // آب زیرزمینی: استوانه
        shapeGeometry = new THREE.CylinderGeometry(baseSize * 1.2, baseSize * 1.2, baseSize * 2.0, 12);
        shapeSize = baseSize * 1.3;
    } else if (type === 'livestock') {
        // دام: مکعب کوچک
        shapeGeometry = new THREE.BoxGeometry(baseSize * 1.5, baseSize * 1.5, baseSize * 1.5);
        shapeSize = baseSize * 1.2;
    } else if (type === 'wildlife') {
        // حیوانات وحشی: کره
        shapeGeometry = new THREE.SphereGeometry(baseSize * 1.3, 12, 12);
        shapeSize = baseSize * 1.2;
    } else if (type === 'marine') {
        // حیوانات دریایی: استوانه کوچک
        shapeGeometry = new THREE.CylinderGeometry(baseSize * 1.0, baseSize * 1.0, baseSize * 1.8, 10);
        shapeSize = baseSize * 1.2;
    } else {
        // پیش‌فرض: کره
        shapeGeometry = new THREE.SphereGeometry(baseSize * 1.8, 12, 12);
        shapeSize = baseSize * 1.3;
    }
    
    // المان اصلی با درخشش کم
    const lightMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.8,
        emissive: color,
        emissiveIntensity: 0.3, // کاهش از 1.0 به 0.3
        side: THREE.DoubleSide
    });
    const light = new THREE.Mesh(shapeGeometry, lightMaterial);
    group.add(light);
    
    // لایه درونی با درخشش کم
    const innerGlowGeometry = shapeGeometry.clone();
    innerGlowGeometry.scale(0.65, 0.65, 0.65);
    const innerGlowMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.4, // کاهش از 0.7 به 0.4
        emissive: color,
        emissiveIntensity: 0.4, // کاهش از 1.5 به 0.4
        side: THREE.DoubleSide
    });
    const innerGlow = new THREE.Mesh(innerGlowGeometry, innerGlowMaterial);
    group.add(innerGlow);
    
    // لایه میانی حذف شد - برای کاهش نور
    
    // حلقه چرخان بیرونی - کوچک و کم‌نور
    const ringGeometry = new THREE.RingGeometry(shapeSize * 1.3, shapeSize * 1.6, 24);
    const ringMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.3, // کاهش از 0.8 به 0.3
        side: THREE.DoubleSide,
        emissive: color,
        emissiveIntensity: 0.15 // کاهش از 0.4 به 0.15
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = -Math.PI / 2;
    ring.userData.rotate = true;
    ring.userData.rotationSpeed = 0.025;
    group.add(ring);
    
    // هاله نور کوچک - فقط یک هاله کوچک
    const glowGeometry = new THREE.CircleGeometry(size * 2.0, 32); // کاهش از 5.5 به 2.0
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.2, // کاهش از 0.5 به 0.2
        side: THREE.DoubleSide,
        emissive: color,
        emissiveIntensity: 0.1 // کاهش از 0.3 به 0.1
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.rotation.x = -Math.PI / 2;
    group.add(glow);
    
    // نور نقطه‌ای کوچک و کم‌نور - فقط یک نور
    const pointLight = new THREE.PointLight(color, 0.2, 0.15); // کاهش از 1.5 به 0.2
    pointLight.position.set(0, 0, 0);
    pointLight.decay = 2;
    group.add(pointLight);
    
    // ذخیره اطلاعات چرخش
    group.userData.rotateRings = true;
    group.userData.rings = [ring];
    
    return group;
}

// ایجاد تانک جنگی (برای نمایش درگیری‌ها)
function createTankMarker(color = 0xef4444, size = 0.01) {
    const group = new THREE.Group();
    
    // بدنه تانک (مکعب)
    const bodyGeometry = new THREE.BoxGeometry(size * 2.5, size * 1.2, size * 2.0);
    const bodyMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.95,
        emissive: color,
        emissiveIntensity: 0.7
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = size * 0.6;
    group.add(body);
    
    // برجک تانک (استوانه)
    const turretGeometry = new THREE.CylinderGeometry(size * 0.8, size * 0.8, size * 0.8, 8);
    const turretMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.9,
        emissive: color,
        emissiveIntensity: 0.8
    });
    const turret = new THREE.Mesh(turretGeometry, turretMaterial);
    turret.position.set(0, size * 1.4, 0);
    group.add(turret);
    
    // لوله تانک
    const barrelGeometry = new THREE.CylinderGeometry(size * 0.15, size * 0.15, size * 1.5, 6);
    const barrelMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.9,
        emissive: color,
        emissiveIntensity: 0.9
    });
    const barrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
    barrel.rotation.z = Math.PI / 2;
    barrel.position.set(size * 0.75, size * 1.4, 0);
    group.add(barrel);
    
    // حلقه چرخان
    const ringGeometry = new THREE.RingGeometry(size * 1.8, size * 2.4, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
        emissive: color,
        emissiveIntensity: 0.3
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = -Math.PI / 2;
    ring.userData.rotate = true;
    ring.userData.rotationSpeed = 0.02;
    group.add(ring);
    
    // هاله نور
    const glowGeometry = new THREE.CircleGeometry(size * 4, 64);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
        emissive: color,
        emissiveIntensity: 0.2
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.rotation.x = -Math.PI / 2;
    group.add(glow);
    
    // نور نقطه‌ای
    const pointLight = new THREE.PointLight(color, 1.0, 0.25);
    pointLight.position.set(0, size * 1.0, 0);
    group.add(pointLight);
    
    group.userData.rotateRings = true;
    group.userData.rings = [ring];
    
    return group;
}

// ایجاد هواپیمای جنگی (برای نیروی هوایی)
function createAircraftMarker(color = 0xef4444, size = 0.008) {
    const group = new THREE.Group();
    
    // بدنه هواپیما (مثلث)
    const bodyGeometry = new THREE.ConeGeometry(size * 1.2, size * 2.5, 3);
    const bodyMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.95,
        emissive: color,
        emissiveIntensity: 0.8
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.rotation.z = Math.PI / 2;
    group.add(body);
    
    // بال‌ها (مستطیل)
    const wingGeometry = new THREE.BoxGeometry(size * 3.0, size * 0.3, size * 1.0);
    const wingMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.9,
        emissive: color,
        emissiveIntensity: 0.7
    });
    const wing = new THREE.Mesh(wingGeometry, wingMaterial);
    wing.position.y = size * 0.5;
    group.add(wing);
    
    // حلقه چرخان
    const ringGeometry = new THREE.RingGeometry(size * 1.5, size * 2.0, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
        emissive: color,
        emissiveIntensity: 0.4
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = -Math.PI / 2;
    ring.userData.rotate = true;
    ring.userData.rotationSpeed = 0.03;
    group.add(ring);
    
    // هاله نور
    const glowGeometry = new THREE.CircleGeometry(size * 4, 64);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
        emissive: color,
        emissiveIntensity: 0.2
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.rotation.x = -Math.PI / 2;
    group.add(glow);
    
    // نور نقطه‌ای
    const pointLight = new THREE.PointLight(color, 1.0, 0.25);
    group.add(pointLight);
    
    group.userData.rotateRings = true;
    group.userData.rings = [ring];
    
    return group;
}

// ایجاد کشتی جنگی (برای نیروی دریایی)
function createShipMarker(color = 0x0ea5e9, size = 0.01) {
    const group = new THREE.Group();
    
    // بدنه کشتی (استوانه کشیده)
    const hullGeometry = new THREE.CylinderGeometry(size * 1.0, size * 1.2, size * 3.5, 8);
    const hullMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.95,
        emissive: color,
        emissiveIntensity: 0.7
    });
    const hull = new THREE.Mesh(hullGeometry, hullMaterial);
    hull.rotation.z = Math.PI / 2;
    group.add(hull);
    
    // عرشه (مستطیل)
    const deckGeometry = new THREE.BoxGeometry(size * 2.5, size * 0.2, size * 3.5);
    const deckMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.9,
        emissive: color,
        emissiveIntensity: 0.6
    });
    const deck = new THREE.Mesh(deckGeometry, deckMaterial);
    deck.position.y = size * 0.6;
    group.add(deck);
    
    // حلقه چرخان
    const ringGeometry = new THREE.RingGeometry(size * 1.8, size * 2.4, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
        emissive: color,
        emissiveIntensity: 0.3
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = -Math.PI / 2;
    ring.userData.rotate = true;
    ring.userData.rotationSpeed = 0.02;
    group.add(ring);
    
    // هاله نور
    const glowGeometry = new THREE.CircleGeometry(size * 5, 64);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
        emissive: color,
        emissiveIntensity: 0.2
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.rotation.x = -Math.PI / 2;
    group.add(glow);
    
    // نور نقطه‌ای
    const pointLight = new THREE.PointLight(color, 1.0, 0.3);
    group.add(pointLight);
    
    group.userData.rotateRings = true;
    group.userData.rings = [ring];
    
    return group;
}

// ایجاد سرباز (برای نیروی زمینی)
function createSoldierMarker(color = 0x64748b, size = 0.006) {
    const group = new THREE.Group();
    
    // بدن سرباز (استوانه)
    const bodyGeometry = new THREE.CylinderGeometry(size * 0.6, size * 0.6, size * 1.5, 8);
    const bodyMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.95,
        emissive: color,
        emissiveIntensity: 0.6
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = size * 0.75;
    group.add(body);
    
    // سر (کره)
    const headGeometry = new THREE.SphereGeometry(size * 0.5, 8, 8);
    const headMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.9,
        emissive: color,
        emissiveIntensity: 0.7
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = size * 1.75;
    group.add(head);
    
    // حلقه چرخان
    const ringGeometry = new THREE.RingGeometry(size * 1.2, size * 1.6, 24);
    const ringMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
        emissive: color,
        emissiveIntensity: 0.3
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = -Math.PI / 2;
    ring.userData.rotate = true;
    ring.userData.rotationSpeed = 0.025;
    group.add(ring);
    
    // هاله نور
    const glowGeometry = new THREE.CircleGeometry(size * 3, 64);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide,
        emissive: color,
        emissiveIntensity: 0.15
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.rotation.x = -Math.PI / 2;
    group.add(glow);
    
    // نور نقطه‌ای
    const pointLight = new THREE.PointLight(color, 0.8, 0.2);
    pointLight.position.set(0, size * 1.0, 0);
    group.add(pointLight);
    
    group.userData.rotateRings = true;
    group.userData.rings = [ring];
    
    return group;
}

// نمایش گمرکات روی کره
function showCustomsOnGlobe() {
    if (!window.resourcesGlobeObjects || !window.resourcesGlobeObjects.earth) return;
    
    const { earth } = window.resourcesGlobeObjects;
    
    // پاک کردن مارکرهای قبلی
    hideAllFacilities();
    
    if (!facilityMarkersGroup) {
        facilityMarkersGroup = new THREE.Group();
        facilityMarkersGroup.name = 'facilityMarkers';
        earth.add(facilityMarkersGroup);
    }
    
    // اضافه کردن گمرکات همه کشورها
    Object.entries(countriesData).forEach(([code, data]) => {
        if (data.customs && Array.isArray(data.customs)) {
            data.customs.forEach(customs => {
                if (customs.coords && customs.coords.length === 2) {
                    const [lat, lng] = customs.coords;
                    const marker = createNeonMarker(getFacilityColor('customs'), 0.008, 'customs'); // طلایی
                    
                    // تبدیل به مختصات 3D
                    const phi = (90 - lat) * (Math.PI / 180);
                    const theta = (lng + 180) * (Math.PI / 180);
                    const radius = 1.005;
                    
                    const x = -radius * Math.sin(phi) * Math.cos(theta);
                    const y = radius * Math.cos(phi);
                    const z = radius * Math.sin(phi) * Math.sin(theta);
                    
                    marker.position.set(x, y, z);
                    
                    // چرخاندن المان به سمت بالا (عمود بر سطح کره)
                    const normal = new THREE.Vector3(x, y, z).normalize();
                    marker.lookAt(normal.multiplyScalar(2).add(marker.position));
                    marker.rotateX(Math.PI / 2); // 90 درجه برای دیده شدن از بالا
                    
                    // ذخیره اطلاعات
                    marker.userData = {
                        type: 'customs',
                        country: code,
                        countryName: data.name,
                        name: customs.name || 'گمرک',
                        coords: [lat, lng],
                        workingHours: customs.workingHours || '24/7',
                        description: customs.description || ''
                    };
                    
                    // اضافه کردن event listener
                    marker.children[0].userData = marker.userData;
                    marker.children[0].raycast = function(raycaster, intersects) {
                        const geometry = this.geometry;
                        const material = this.material;
                        const matrixWorld = this.matrixWorld;
                        const sphere = new THREE.Sphere(this.position, 0.01);
                        if (raycaster.ray.intersectSphere(sphere, new THREE.Vector3())) {
                            intersects.push({
                                distance: raycaster.ray.origin.distanceTo(this.position),
                                point: raycaster.ray.origin.clone(),
                                object: this
                            });
                        }
                    };
                    
                    facilityMarkersGroup.add(marker);
                }
            });
        }
    });
    
    const log = window.logger || { info: console.log }; log.info('🛃 گمرکات روی نقشه نمایش داده شدند');
}

function hideCustomsOnGlobe() {
    if (facilityMarkersGroup) {
        const customsMarkers = facilityMarkersGroup.children.filter(child => 
            child.userData && child.userData.type === 'customs'
        );
        customsMarkers.forEach(marker => {
            facilityMarkersGroup.remove(marker);
            marker.traverse((child) => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) child.material.dispose();
                if (child instanceof THREE.Light) child.dispose();
            });
        });
    }
}

function hideAllFacilities() {
    if (facilityMarkersGroup) {
        // فقط المان‌های خاص را پاک کن، نه همه
        const toRemove = [];
        facilityMarkersGroup.children.forEach(child => {
            if (child.userData && child.userData.type) {
                toRemove.push(child);
            }
        });
        toRemove.forEach(child => {
            facilityMarkersGroup.remove(child);
            child.traverse((obj) => {
                if (obj.geometry) obj.geometry.dispose();
                if (obj.material) obj.material.dispose();
                if (obj instanceof THREE.Light) obj.dispose();
            });
        });
    }
}

// نمایش پالایشگاه‌ها
function showRefineriesOnGlobe() {
    if (!window.resourcesGlobeObjects || !window.resourcesGlobeObjects.earth) return;
    
    if (!facilityMarkersGroup) {
        facilityMarkersGroup = new THREE.Group();
        facilityMarkersGroup.name = 'facilityMarkers';
        window.resourcesGlobeObjects.earth.add(facilityMarkersGroup);
    }
    
    Object.entries(countriesData).forEach(([code, data]) => {
        if (data.refineries && Array.isArray(data.refineries)) {
            data.refineries.forEach(refinery => {
                if (refinery.coords && refinery.coords.length === 2) {
                    addFacilityMarker(refinery, code, data.name, 'refinery', getFacilityColor('refinery'));
                }
            });
        }
    });
}

// نمایش کارخانه‌ها
function showFactoriesOnGlobe() {
    if (!window.resourcesGlobeObjects || !window.resourcesGlobeObjects.earth) return;
    
    if (!facilityMarkersGroup) {
        facilityMarkersGroup = new THREE.Group();
        facilityMarkersGroup.name = 'facilityMarkers';
        window.resourcesGlobeObjects.earth.add(facilityMarkersGroup);
    }
    
    Object.entries(countriesData).forEach(([code, data]) => {
        if (data.factories && Array.isArray(data.factories)) {
            data.factories.forEach(factory => {
                if (factory.coords && factory.coords.length === 2) {
                    addFacilityMarker(factory, code, data.name, 'factory', getFacilityColor('factory'));
                }
            });
        }
    });
}

// نمایش معادن
function showMinesOnGlobe() {
    if (!window.resourcesGlobeObjects || !window.resourcesGlobeObjects.earth) return;
    
    if (!facilityMarkersGroup) {
        facilityMarkersGroup = new THREE.Group();
        facilityMarkersGroup.name = 'facilityMarkers';
        window.resourcesGlobeObjects.earth.add(facilityMarkersGroup);
    }
    
    Object.entries(countriesData).forEach(([code, data]) => {
        if (data.mines && Array.isArray(data.mines)) {
            data.mines.forEach(mine => {
                if (mine.coords && mine.coords.length === 2) {
                    addFacilityMarker(mine, code, data.name, 'mine', getFacilityColor('mine'));
                }
            });
        }
    });
}

// نمایش بنادر
function showPortsOnGlobe() {
    if (!window.resourcesGlobeObjects || !window.resourcesGlobeObjects.earth) return;
    
    if (!facilityMarkersGroup) {
        facilityMarkersGroup = new THREE.Group();
        facilityMarkersGroup.name = 'facilityMarkers';
        window.resourcesGlobeObjects.earth.add(facilityMarkersGroup);
    }
    
    Object.entries(countriesData).forEach(([code, data]) => {
        if (data.ports && Array.isArray(data.ports)) {
            data.ports.forEach(port => {
                if (port.coords && port.coords.length === 2) {
                    addFacilityMarker(port, code, data.name, 'port', getFacilityColor('port'));
                }
            });
        }
    });
}

// نمایش سکوهای نفتی
function showOilRigsOnGlobe() {
    if (!window.resourcesGlobeObjects || !window.resourcesGlobeObjects.earth) return;
    
    if (!facilityMarkersGroup) {
        facilityMarkersGroup = new THREE.Group();
        facilityMarkersGroup.name = 'facilityMarkers';
        window.resourcesGlobeObjects.earth.add(facilityMarkersGroup);
    }
    
    Object.entries(countriesData).forEach(([code, data]) => {
        if (data.oilRigs && Array.isArray(data.oilRigs)) {
            data.oilRigs.forEach(rig => {
                if (rig.coords && rig.coords.length === 2) {
                    addFacilityMarker(rig, code, data.name, 'oil-rig', getFacilityColor('oil-rig'));
                }
            });
        }
    });
}

// تابع مشترک برای اضافه کردن المان
function addFacilityMarker(facility, countryCode, countryName, type, color) {
    const [lat, lng] = facility.coords;
    const marker = createNeonMarker(color, 0.008, type);
    
    // تبدیل به مختصات 3D
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const radius = 1.005;
    
    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    
    marker.position.set(x, y, z);
    
    // چرخاندن المان به سمت بالا
    const normal = new THREE.Vector3(x, y, z).normalize();
    marker.lookAt(normal.multiplyScalar(2).add(marker.position));
    marker.rotateX(Math.PI / 2);
    
    // ذخیره اطلاعات
    marker.userData = {
        type: type,
        country: countryCode,
        countryName: countryName,
        name: facility.name || type,
        coords: [lat, lng],
        workingHours: facility.workingHours || '24/7',
        description: facility.description || '',
        capacity: facility.capacity || '',
        phone: facility.phone || ''
    };
    
    facilityMarkersGroup.add(marker);
}

// نمایش popup روی کره برای المان‌ها - با اطلاعات کامل
function showFacilityPopup(facilityData, worldPoint, container, camera) {
    // حذف popup قبلی
    if (globePopup) {
        globePopup.remove();
        globePopup = null;
    }
    
    // ایجاد popup جدید
    globePopup = document.createElement('div');
    globePopup.className = 'globe-facility-popup';
    
    // محتوای popup بر اساس نوع المان
    const iconMap = {
        'customs': '🛃',
        'refinery': '🏭',
        'factory': '🏭',
        'mine': '⛏️',
        'oil-rig': '🛢️',
        'port': '⚓',
        'conflict': '⚔️',
        'tank': '🚛',
        'military-air': '✈️',
        'military-ground': '🚛',
        'military-navy': '🚢',
        'soldier': '👤',
        'aircraft': '✈️',
        'ship': '🚢',
        'university': '🎓',
        'historical': '🏛️',
        'weather': '🌤️',
        'earthquake': '🌋',
        'forest': '🌲',
        'river': '🌊',
        'desert': '🏜️',
        'groundwater': '💧',
        'livestock': '🐄',
        'wildlife': '🦁',
        'marine': '🐋'
    };
    const icon = iconMap[facilityData.type] || '📍';
    
    const typeNames = {
        'customs': 'گمرک',
        'refinery': 'پالایشگاه',
        'factory': 'کارخانه',
        'mine': 'معدن',
        'oil-rig': 'سکوی نفتی',
        'port': 'بندر',
        'conflict': 'درگیری',
        'tank': 'تانک',
        'military-air': 'نیروی هوایی',
        'military-ground': 'نیروی زمینی',
        'military-navy': 'نیروی دریایی',
        'soldier': 'سرباز',
        'aircraft': 'هواپیمای جنگی',
        'ship': 'کشتی جنگی',
        'university': 'دانشگاه',
        'historical': 'مکان تاریخی',
        'weather': 'آب و هوا',
        'earthquake': 'زلزله',
        'forest': 'جنگل',
        'river': 'رودخانه',
        'desert': 'بیابان',
        'groundwater': 'آب زیرزمینی',
        'livestock': 'دام و طیور',
        'wildlife': 'حیوانات وحشی',
        'marine': 'حیوانات دریایی'
    };
    const typeName = typeNames[facilityData.type] || facilityData.type;
    
    let content = `
        <div class="popup-header">
            <span class="popup-icon">${icon}</span>
            <div class="popup-title-group">
                <h4>${facilityData.name}</h4>
                <span class="popup-type">${typeName}</span>
            </div>
            <button class="popup-close" onclick="closeGlobeFacilityPopup()">×</button>
        </div>
        <div class="popup-body">
            <div class="popup-info-row">
                <span class="label">🌍 کشور:</span>
                <span class="value">${facilityData.countryName || facilityData.country}</span>
            </div>
            ${facilityData.workingHours ? `
            <div class="popup-info-row">
                <span class="label">🕐 ساعات کاری:</span>
                <span class="value">${facilityData.workingHours}</span>
            </div>
            ` : ''}
            ${facilityData.capacity ? `
            <div class="popup-info-row">
                <span class="label">📊 ظرفیت:</span>
                <span class="value">${facilityData.capacity}</span>
            </div>
            ` : ''}
            ${facilityData.description ? `
            <div class="popup-info-row popup-description">
                <span class="label">📝 توضیحات:</span>
                <span class="value">${facilityData.description}</span>
            </div>
            ` : ''}
            ${facilityData.phone ? `
            <div class="popup-info-row">
                <span class="label">📞 تماس:</span>
                <span class="value">${facilityData.phone}</span>
            </div>
            ` : ''}
            ${facilityData.rank ? `
            <div class="popup-info-row">
                <span class="label">🏆 رتبه:</span>
                <span class="value">#${facilityData.rank}</span>
            </div>
            ` : ''}
            ${facilityData.students ? `
            <div class="popup-info-row">
                <span class="label">👥 دانشجویان:</span>
                <span class="value">${facilityData.students.toLocaleString()}</span>
            </div>
            ` : ''}
            ${facilityData.year ? `
            <div class="popup-info-row">
                <span class="label">📅 سال:</span>
                <span class="value">${facilityData.year > 0 ? facilityData.year + ' میلادی' : Math.abs(facilityData.year) + ' قبل از میلاد'}</span>
            </div>
            ` : ''}
            ${facilityData.intensity ? `
            <div class="popup-info-row">
                <span class="label">⚔️ شدت:</span>
                <span class="value">${facilityData.intensity === 'war' ? 'جنگ' : facilityData.intensity === 'tension' ? 'تنش' : 'درگیری'}</span>
            </div>
            ` : ''}
            ${facilityData.opponentName ? `
            <div class="popup-info-row">
                <span class="label">🎯 مقابل:</span>
                <span class="value">${facilityData.opponentName}</span>
            </div>
            ` : ''}
            ${facilityData.since ? `
            <div class="popup-info-row">
                <span class="label">📅 از سال:</span>
                <span class="value">${facilityData.since}</span>
            </div>
            ` : ''}
            ${facilityData.aircraft ? `
            <div class="popup-info-row">
                <span class="label">✈️ هواپیما:</span>
                <span class="value">${facilityData.aircraft.toLocaleString()}</span>
            </div>
            ` : ''}
            ${facilityData.tanks ? `
            <div class="popup-info-row">
                <span class="label">🚛 تانک:</span>
                <span class="value">${facilityData.tanks.toLocaleString()}</span>
            </div>
            ` : ''}
            ${facilityData.soldiers ? `
            <div class="popup-info-row">
                <span class="label">👤 سرباز:</span>
                <span class="value">${facilityData.soldiers.toLocaleString()}</span>
            </div>
            ` : ''}
            ${facilityData.ships ? `
            <div class="popup-info-row">
                <span class="label">🚢 کشتی:</span>
                <span class="value">${facilityData.ships.toLocaleString()}</span>
            </div>
            ` : ''}
            ${facilityData.submarines ? `
            <div class="popup-info-row">
                <span class="label">🌊 زیردریایی:</span>
                <span class="value">${facilityData.submarines.toLocaleString()}</span>
            </div>
            ` : ''}
            ${facilityData.temp !== undefined ? `
            <div class="popup-info-row">
                <span class="label">🌡️ دما:</span>
                <span class="value">${facilityData.temp}°C</span>
            </div>
            ` : ''}
            ${facilityData.condition ? `
            <div class="popup-info-row">
                <span class="label">☁️ وضعیت:</span>
                <span class="value">${facilityData.condition}</span>
            </div>
            ` : ''}
            ${facilityData.humidity !== undefined ? `
            <div class="popup-info-row">
                <span class="label">💧 رطوبت:</span>
                <span class="value">${facilityData.humidity}%</span>
            </div>
            ` : ''}
            ${facilityData.magnitude !== undefined ? `
            <div class="popup-info-row">
                <span class="label">📊 بزرگی:</span>
                <span class="value">${facilityData.magnitude} ریشتر</span>
            </div>
            ` : ''}
            ${facilityData.date ? `
            <div class="popup-info-row">
                <span class="label">📅 تاریخ:</span>
                <span class="value">${facilityData.date}</span>
            </div>
            ` : ''}
            ${facilityData.depth !== undefined ? `
            <div class="popup-info-row">
                <span class="label">⬇️ عمق:</span>
                <span class="value">${facilityData.depth} کیلومتر</span>
            </div>
            ` : ''}
            ${facilityData.area !== undefined ? `
            <div class="popup-info-row">
                <span class="label">📐 مساحت:</span>
                <span class="value">${facilityData.area.toLocaleString()} کیلومتر مربع</span>
            </div>
            ` : ''}
            ${facilityData.age !== undefined ? `
            <div class="popup-info-row">
                <span class="label">⏳ قدمت:</span>
                <span class="value">${facilityData.age} ${facilityData.age > 1000 ? 'سال' : 'میلیون سال'}</span>
            </div>
            ` : ''}
            ${facilityData.forestType ? `
            <div class="popup-info-row">
                <span class="label">🌳 نوع:</span>
                <span class="value">${facilityData.forestType}</span>
            </div>
            ` : ''}
            ${facilityData.length !== undefined ? `
            <div class="popup-info-row">
                <span class="label">📏 طول:</span>
                <span class="value">${facilityData.length.toLocaleString()} کیلومتر</span>
            </div>
            ` : ''}
            ${facilityData.temperature !== undefined ? `
            <div class="popup-info-row">
                <span class="label">🌡️ دما:</span>
                <span class="value">${facilityData.temperature}°C</span>
            </div>
            ` : ''}
            ${facilityData.volume !== undefined ? `
            <div class="popup-info-row">
                <span class="label">💧 حجم:</span>
                <span class="value">${facilityData.volume.toLocaleString()} کیلومتر مکعب</span>
            </div>
            ` : ''}
            ${facilityData.depth !== undefined && facilityData.type === 'groundwater' ? `
            <div class="popup-info-row">
                <span class="label">⬇️ عمق:</span>
                <span class="value">${facilityData.depth} متر</span>
            </div>
            ` : ''}
            ${facilityData.count !== undefined ? `
            <div class="popup-info-row">
                <span class="label">🔢 تعداد:</span>
                <span class="value">${facilityData.count.toLocaleString()}</span>
            </div>
            ` : ''}
            <div class="popup-info-row">
                <span class="label">📍 مختصات:</span>
                <span class="value">${facilityData.coords && facilityData.coords.length >= 2 ? `${facilityData.coords[0].toFixed(4)}, ${facilityData.coords[1].toFixed(4)}` : 'نامشخص'}</span>
            </div>
        </div>
    `;
    
    globePopup.innerHTML = content;
    container.appendChild(globePopup);
    
    // موقعیت popup بر اساس موقعیت 3D
    const updatePopupPosition = () => {
        if (!globePopup || !camera) return;
        
        // تبدیل نقطه 3D به موقعیت صفحه
        const vector = worldPoint.clone();
        vector.project(camera);
        
        const x = (vector.x * 0.5 + 0.5) * container.clientWidth;
        const y = (-vector.y * 0.5 + 0.5) * container.clientHeight;
        
        // تنظیم موقعیت با offset برای نمایش کنار المان
        const offsetX = 15;
        const offsetY = -10;
        
        globePopup.style.left = (x + offsetX) + 'px';
        globePopup.style.top = (y + offsetY) + 'px';
        
        // اگر popup خارج از صفحه است، مخفی کن
        if (x < -50 || x > container.clientWidth + 50 || y < -50 || y > container.clientHeight + 50) {
            globePopup.style.opacity = '0';
            globePopup.style.pointerEvents = 'none';
        } else {
            globePopup.style.opacity = '1';
            globePopup.style.pointerEvents = 'auto';
        }
    };
    
    updatePopupPosition();
    
    // آپدیت موقعیت در هر فریم
    const updateLoop = () => {
        if (globePopup && globePopup.parentNode) {
            updatePopupPosition();
            requestAnimationFrame(updateLoop);
        }
    };
    updateLoop();
}

// بستن popup
window.closeGlobeFacilityPopup = function() {
    if (globePopup) {
        globePopup.remove();
        globePopup = null;
    }
};

// نمایش/مخفی کردن راهنما
window.toggleLegend = function() {
    const legend = document.getElementById('globeLegend');
    const items = document.getElementById('legendItems');
    const toggle = legend?.querySelector('.legend-toggle');
    
    if (!legend || !items) return;
    
    if (items.style.display === 'none') {
        items.style.display = 'flex';
        if (toggle) toggle.textContent = '−';
    } else {
        items.style.display = 'none';
        if (toggle) toggle.textContent = '+';
    }
};

// Export توابع (این export ها در انتهای فایل انجام می‌شوند)
// Export functions (these exports are done at the end of the file)

// تابع برای زوم روی یک نقطه روی کره
window.zoomToLocation = function(lat, lng) {
    const log = window.logger || { info: console.log }; log.info(`🎯 زوم به: ${lat}, ${lng}`);
    // این تابع بعداً برای زوم به نقطه خاص پیاده‌سازی می‌شود
};

// راه‌اندازی پنل‌های کره بزرگ
function setupGlobePanels() {
    // استفاده از توابع از window (تعریف شده در globe-markets.js)
    // Use functions from window (defined in globe-markets.js)
    if (typeof window.populateMarketList === 'function') {
        window.populateMarketList();
    }
    if (typeof window.setupMarketSelector === 'function') {
        window.setupMarketSelector();
    }
    setupGlobeFabMenus();
}

// توجه: توابع populateMarketList, selectMarketFromList, setupMarketSelector
// در globe-markets.js تعریف شده‌اند و در آنجا export می‌شوند.
// این توابع duplicate حذف شده‌اند.
// 
// Note: Functions populateMarketList, selectMarketFromList, setupMarketSelector
// are defined in globe-markets.js and exported there.
// These duplicate functions have been removed.

// راه‌اندازی منوهای fab کره‌ها
function setupGlobeFabMenus() {
    // منوی کره مالی
    const financialFab = document.getElementById('financialGlobeFab');
    if (financialFab) {
        const fabBtn = financialFab.querySelector('.globe-fab-btn');
        if (fabBtn) {
            fabBtn.addEventListener('click', () => {
                financialFab.classList.toggle('active');
            });
        }
        
        financialFab.querySelectorAll('.fab-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                handleFinancialFabAction(action);
            });
        });
    }
    
    // منوی کره منابع
    const resourcesFab = document.getElementById('resourcesGlobeFab');
    if (resourcesFab) {
        const fabBtn = resourcesFab.querySelector('.globe-fab-btn');
        if (fabBtn) {
            fabBtn.addEventListener('click', () => {
                resourcesFab.classList.toggle('active');
            });
        }
        
        resourcesFab.querySelectorAll('.fab-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                const action = btn.dataset.action;
                
                if (filter) {
                    handleResourcesFilter(filter, btn);
                } else if (action) {
                    handleResourcesFabAction(action);
                }
            });
        });
    }
}

// پردازش عملیات fab کره مالی
function handleFinancialFabAction(action) {
    switch(action) {
        case 'timezone':
            showTimezoneSettings();
            break;
        case 'filter':
            showMarketFilter();
            break;
        case 'notify':
            showNotificationSettings();
            break;
        case 'reset':
            resetGlobeView('financial');
            break;
    }
}

// پردازش فیلتر منابع
function handleResourcesFilter(filter, btn) {
    // حذف کلاس active از همه
    btn.closest('.globe-fab-options').querySelectorAll('.fab-option').forEach(b => {
        b.classList.remove('active');
    });
    btn.classList.add('active');
    
    const log = window.logger || { info: console.log }; log.info(`🔍 فیلتر منابع: ${filter}`);
    // اینجا می‌توان مارکرهای روی کره را فیلتر کرد
}

// پردازش عملیات fab کره منابع
function handleResourcesFabAction(action) {
    if (action === 'reset') {
        resetGlobeView('resources');
    }
}

// نمایش تنظیمات منطقه زمانی
/**
 * ⏰ نمایش تنظیمات منطقه زمانی
 */
function showTimezoneSettings() {
    const currentTimezone = getUserTimezone();
    
    // ایجاد مودال تنظیمات
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <h3>⏰ تنظیمات منطقه زمانی</h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
            </div>
            <div class="modal-body">
                <div style="margin-bottom: 20px;">
                    <p><strong>منطقه زمانی فعلی:</strong> ${currentTimezone.name} (${currentTimezone.offsetStr})</p>
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">این منطقه زمانی به صورت خودکار از مرورگر شما تشخیص داده شده است.</p>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">انتخاب منطقه زمانی دستی:</label>
                    <select id="timezoneSelect" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--glass-border); background: var(--bg-secondary); color: var(--text-primary);">
                        <option value="auto">🔍 تشخیص خودکار (پیشنهادی)</option>
                        <option value="+03:30">🇮🇷 تهران (UTC+3:30)</option>
                        <option value="+04:00">🇦🇪 دبی (UTC+4:00)</option>
                        <option value="+00:00">🇬🇧 لندن (UTC+0:00)</option>
                        <option value="-05:00">🇺🇸 نیویورک (UTC-5:00)</option>
                        <option value="+09:00">🇯🇵 توکیو (UTC+9:00)</option>
                        <option value="+08:00">🇨🇳 پکن (UTC+8:00)</option>
                        <option value="+05:30">🇮🇳 دهلی (UTC+5:30)</option>
                        <option value="+02:00">🇪🇬 قاهره (UTC+2:00)</option>
                    </select>
                </div>
                
                <div style="display: flex; gap: 10px;">
                    <button onclick="saveTimezoneSettings()" style="flex: 1; padding: 12px; background: var(--card-bg); color: var(--text-primary); border: 1px solid var(--glass-border); border-radius: 8px; cursor: pointer; font-weight: 600;">
                        💾 ذخیره
                    </button>
                    <button onclick="this.closest('.modal-overlay').remove()" style="flex: 1; padding: 12px; background: var(--bg-secondary); color: var(--text-primary); border: 1px solid var(--glass-border); border-radius: 8px; cursor: pointer;">
                        انصراف
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    
    // تنظیم مقدار فعلی
    const select = modal.querySelector('#timezoneSelect');
    if (currentTimezone.offsetStr) {
        const currentOption = Array.from(select.options).find(opt => opt.value === currentTimezone.offsetStr);
        if (currentOption) {
            select.value = currentTimezone.offsetStr;
        } else if (currentTimezone.manual) {
            select.value = currentTimezone.offsetStr;
        }
    }
    
    // بستن با کلیک روی overlay
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

/**
 * 💾 ذخیره تنظیمات منطقه زمانی
 */
function saveTimezoneSettings() {
    const select = document.getElementById('timezoneSelect');
    if (!select) return;
    
    const selectedValue = select.value;
    
    if (selectedValue === 'auto') {
        // حذف تنظیمات دستی و استفاده از تشخیص خودکار
        localStorage.removeItem('userTimezone');
        alert('✅ منطقه زمانی به حالت خودکار تنظیم شد');
    } else {
        // تنظیم دستی
        const [sign, hours, mins] = selectedValue.match(/([+-])(\d{2}):(\d{2})/);
        const offsetHours = parseInt(sign + hours);
        const offsetMinutes = offsetHours * 60;
        
        const timezoneNames = {
            '+03:30': 'تهران',
            '+04:00': 'دبی',
            '+00:00': 'لندن',
            '-05:00': 'نیویورک',
            '+09:00': 'توکیو',
            '+08:00': 'پکن',
            '+05:30': 'دهلی',
            '+02:00': 'قاهره'
        };
        
        setManualTimezone(offsetHours, timezoneNames[selectedValue] || `UTC${selectedValue}`);
        alert(`✅ منطقه زمانی به ${timezoneNames[selectedValue] || selectedValue} تنظیم شد`);
    }
    
    // بستن مودال
    const modal = select.closest('.modal-overlay');
    if (modal) modal.remove();
    
    // رفرش صفحه برای اعمال تغییرات
    setTimeout(() => {
        location.reload();
    }, 1000);
}

/**
 * 🔍 نمایش فیلتر بازارها
 */
function showMarketFilter() {
    // باز کردن کره مالی با فیلتر
    if (typeof openFinancialGlobe === 'function') {
        openFinancialGlobe();
        
        // باز کردن پنل انتخاب بازار
        setTimeout(() => {
            const marketSelectPanel = document.getElementById('marketSelectPanel');
            if (marketSelectPanel) {
                marketSelectPanel.classList.add('active');
            }
        }, 500);
    } else {
        // اگر کره مالی در دسترس نیست، نمایش پیام
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 400px;">
                <div class="modal-header">
                    <h3>🔍 فیلتر بازارها</h3>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                </div>
                <div class="modal-body">
                    <p>برای استفاده از فیلتر بازارها، لطفاً ابتدا کره مالی را باز کنید.</p>
                    <button onclick="this.closest('.modal-overlay').remove(); if(typeof openFinancialGlobe === 'function') openFinancialGlobe();" 
                            style="width: 100%; padding: 12px; margin-top: 15px; background: var(--card-bg); color: var(--text-primary); border: 1px solid var(--glass-border); border-radius: 8px; cursor: pointer; font-weight: 600;">
                        🌍 باز کردن کره مالی
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.style.display = 'flex';
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }
}

/**
 * 🔔 نمایش تنظیمات اعلان
 */
function showNotificationSettings() {
    const savedNotifications = JSON.parse(localStorage.getItem('marketNotifications') || '{}');
    const enabledMarkets = Object.keys(savedNotifications).filter(key => savedNotifications[key].enabled);
    
    // ایجاد مودال تنظیمات
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px; max-height: 80vh; overflow-y: auto;">
            <div class="modal-header">
                <h3>🔔 تنظیمات اعلان‌ها</h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
            </div>
            <div class="modal-body">
                <div style="margin-bottom: 20px;">
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">
                        می‌توانید برای بازارهای مختلف اعلان تنظیم کنید. اعلان‌ها قبل از باز شدن بازار ارسال می‌شوند.
                    </p>
                </div>
                
                ${typeof marketData !== 'undefined' && marketData.length > 0 ? `
                    <div style="margin-bottom: 15px;">
                        <h4 style="margin-bottom: 10px;">بازارهای فعال:</h4>
                        <div id="notificationMarketsList" style="display: flex; flex-direction: column; gap: 10px;">
                            ${marketData.slice(0, 10).map(market => {
                                const setting = savedNotifications[market.name] || {};
                                const isEnabled = setting.enabled || false;
                                return `
                                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: var(--bg-secondary); border-radius: 8px; border: 1px solid var(--glass-border);">
                                        <div>
                                            <strong>${market.name}</strong>
                                            <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 4px;">
                                                ${market.open} - ${market.close} (UTC)
                                            </div>
                                        </div>
                                        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                            <input type="checkbox" ${isEnabled ? 'checked' : ''} 
                                                   onchange="toggleMarketNotification('${market.name}', this.checked)"
                                                   style="width: 18px; height: 18px; cursor: pointer;">
                                            <span>${isEnabled ? '✅ فعال' : '❌ غیرفعال'}</span>
                                        </label>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                ` : `
                    <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
                        <p>📭 هیچ بازاری برای تنظیم اعلان یافت نشد.</p>
                        <p style="font-size: 0.9rem; margin-top: 10px;">لطفاً کره مالی را باز کنید تا بازارها بارگذاری شوند.</p>
                    </div>
                `}
                
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--glass-border);">
                    <button onclick="this.closest('.modal-overlay').remove()" 
                            style="width: 100%; padding: 12px; background: var(--bg-secondary); color: var(--text-primary); border: 1px solid var(--glass-border); border-radius: 8px; cursor: pointer; font-weight: 600;">
                        بستن
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    
    // بستن با کلیک روی overlay
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
}
    });
}

/**
 * 🔔 فعال/غیرفعال کردن اعلان یک بازار
 */
function toggleMarketNotification(marketName, enabled) {
    const settings = JSON.parse(localStorage.getItem('marketNotifications') || '{}');
    
    if (enabled) {
        settings[marketName] = {
            enabled: true,
            minutesBefore: 15
        };
        // درخواست مجوز نوتیفیکیشن
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    } else {
        if (settings[marketName]) {
            settings[marketName].enabled = false;
        }
    }
    
    localStorage.setItem('marketNotifications', JSON.stringify(settings));
    
    // شروع/توقف چک کننده
    if (enabled) {
        if (typeof startMarketNotificationChecker === 'function') {
            startMarketNotificationChecker();
        }
    }
    
    const log = window.logger || { info: console.log }; log.info(`${enabled ? '✅' : '❌'} اعلان ${marketName} ${enabled ? 'فعال' : 'غیرفعال'} شد`);
}

// در دسترس قرار دادن توابع
window.toggleMarketNotification = toggleMarketNotification;
window.saveTimezoneSettings = saveTimezoneSettings;

function resetGlobeView(type) {
    const log = window.logger || { info: console.log }; log.info(`🔄 بازیابی دید کره ${type}`);
    
    // برای کره‌های بزرگ
    if (type === 'financial' && window.financialGlobe) {
        window.financialGlobe.resetView();
        return;
    } else if (type === 'resources' && window.resourcesGlobe) {
        window.resourcesGlobe.resetView();
        return;
    }
    
    const globeScene = simpleGlobeScenes[type];
    if (!globeScene) return;
    
    // برگرداندن دوربین به موقعیت ایران
    if (globeScene.camera) {
        const cfg = window.CONFIG || CONFIG;
        const iranLat = cfg.GLOBE.IRAN.LAT;
        const iranLng = cfg.GLOBE.IRAN.LNG;
        const phi = (90 - iranLat) * (Math.PI / 180);
        const theta = (iranLng + 180) * (Math.PI / 180);
        const distance = 2.5;
        const x = -distance * Math.sin(phi) * Math.cos(theta);
        const y = distance * Math.cos(phi);
        const z = distance * Math.sin(phi) * Math.sin(theta);
        
        const startPos = globeScene.camera.position.clone();
        const targetPos = new THREE.Vector3(x, y, z);
        const duration = 800;
        const startTime = Date.now();
        
        const animateReset = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            globeScene.camera.position.lerpVectors(startPos, targetPos, easeProgress);
            
            if (progress < 1) {
                requestAnimationFrame(animateReset);
            }
        };
        animateReset();
    }
    
    // ریست چرخش کره
    if (globeScene.earth) {
        globeScene.earth.rotation.y = 0;
    }
    
    // حذف popup باز
    const containerId = type === 'financial' ? 'financialGlobeContainer' : 'resourcesGlobeContainer';
    const container = document.getElementById(containerId);
    if (container) {
        const popup = container.querySelector('.market-3d-popup');
        if (popup) popup.remove();
    }
    
    // مخفی کردن پنل انتخاب بازار
    const panel = document.getElementById('marketSelectPanel');
    if (panel) panel.classList.remove('visible');
}

// توابع isUserLoggedIn و showLoginPrompt قبلاً در بالا تعریف شدند



// ============================================
// Export توابع و متغیرها به window
// Export functions and variables to window
// ============================================

window.resourcesGlobeData = resourcesGlobeData;
window.createAllConflicts = createAllConflicts;
window.selectCountry = selectCountry;
window.showFacilityPopup = showFacilityPopup;
window.showCountryInfo = showCountryInfo;
window.zoomToCountry = zoomToCountry;
window.populateCountryList = populateCountryList;
window.createDefaultCountryData = createDefaultCountryData;
window.generateDefaultFacilities = generateDefaultFacilities;
window.showCountryFacilities = showCountryFacilities;
window.addFacilityMarker = addFacilityMarker;
window.getFacilityColor = getFacilityColor;
window.closeGlobeFacilityPopup = closeGlobeFacilityPopup;
window.closeCountryInfo = closeCountryInfo;
window.showTradeLine = showTradeLine;
window.showAllTradeLines = showAllTradeLines;
window.showAirForceOnGlobe = showAirForceOnGlobe;
window.showGroundForceOnGlobe = showGroundForceOnGlobe;
window.showNavyOnGlobe = showNavyOnGlobe;
window.hideMilitaryMarkers = hideMilitaryMarkers;
window.setupResourcesGlobePanels = setupResourcesGlobePanels;
window.filterCountriesByResource = filterCountriesByResource;
window.filterCountriesByContinent = filterCountriesByContinent;
// toggleLegend قبلاً در خط 2426 به window export شده است

// Export متغیرهای global
window.globePopup = globePopup;
window.facilityMarkersGroup = facilityMarkersGroup;
window.militaryMarkersGroup = militaryMarkersGroup;

