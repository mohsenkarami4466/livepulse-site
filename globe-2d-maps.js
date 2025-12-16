// مدیریت نقشه‌های 2D در هایلایت‌های کره‌ها
// این فایل نقشه‌های 2D را برای هر هایلایت ایجاد می‌کند و اتصال دو طرفه با کره 3D برقرار می‌کند

// ذخیره instance های نقشه‌های 2D
const globe2DMaps = {};

// داده‌های انتخابی مشترک بین نقشه 2D و کره 3D
const sharedGlobeData = {
    selectedCountry: null,
    selectedFilter: null,
    selectedYear: null
};

/**
 * ایجاد نقشه 2D برای یک هایلایت
 */
function createGlobe2DMap(globeType, containerId) {
    const log = window.logger || { warn: console.warn, info: console.log };
    
    if (!containerId) {
        log.warn(`containerId برای ${globeType} پیدا نشد`);
        return null;
    }
    
    const container = document.getElementById(containerId);
    if (!container) {
        log.warn(`المان ${containerId} پیدا نشد`);
        return null;
    }
    
    // اگر قبلاً ساخته شده، آن را برگردان
    if (globe2DMaps[globeType]) {
        return globe2DMaps[globeType];
    }
    
    // تنظیم container برای نقشه
    container.innerHTML = '';
    const mapDiv = document.createElement('div');
    mapDiv.id = `${globeType}Map2DVisual`;
    mapDiv.className = 'gold-map-visual';
    mapDiv.style.width = '100%';
    mapDiv.style.height = '100%';
    container.appendChild(mapDiv);
    
    // ایجاد instance جدید از WorldGoldMapGlass با container سفارشی
    const mapInstance = new WorldGoldMapGlass(mapDiv.id);
    mapInstance.globeType = globeType;
    
    // ذخیره instance
    globe2DMaps[globeType] = mapInstance;
    
    log.info(`نقشه 2D برای ${globeType} ایجاد شد`);
    
    return mapInstance;
}

/**
 * راه‌اندازی نقشه‌های 2D برای همه هایلایت‌ها
 */
function setupGlobe2DMaps() {
    const log = window.logger || { info: console.log, warn: console.warn, debug: console.log };
    
    // فقط در صفحه کره‌ها نقشه‌های 2D را ایجاد کن
    const globeView = document.getElementById('globeView');
    if (!globeView || !globeView.classList.contains('active-view')) {
        log.debug('صفحه کره‌ها فعال نیست، نقشه‌های 2D ایجاد نمی‌شوند');
        return;
    }
    
    const globePanels = document.querySelectorAll('.globe-panel[data-globe-panel]');
    log.debug(`پیدا کردن ${globePanels.length} پنل کره`);
    
    globePanels.forEach(panel => {
        const globeType = panel.getAttribute('data-globe-panel');
        const mapContainer = panel.querySelector('.globe-2d-map-container');
        
        if (mapContainer && mapContainer.id) {
            log.debug(`پیدا کردن container برای ${globeType}: ${mapContainer.id}`);
            // ایجاد نقشه با تاخیر برای اطمینان از بارگذاری کامل DOM
            setTimeout(() => {
                createGlobe2DMap(globeType, mapContainer.id);
            }, 1000);
        } else {
            log.warn(`container برای ${globeType} پیدا نشد`);
        }
    });
    
    // راه‌اندازی event listener ها
    setupGlobe2DEventListeners();
}

/**
 * راه‌اندازی نقشه‌های 2D وقتی صفحه کره‌ها فعال می‌شود
 */
function initGlobe2DMapsOnViewChange() {
    // چک کردن تغییر صفحه
    const observer = new MutationObserver(() => {
        const globeView = document.getElementById('globeView');
        if (globeView && globeView.classList.contains('active-view')) {
            // اگر صفحه کره‌ها فعال شد و نقشه‌ها هنوز ایجاد نشده‌اند
            if (Object.keys(globe2DMaps).length === 0) {
                setTimeout(() => {
                    setupGlobe2DMaps();
                }, 500);
            }
        }
    });
    
    // مشاهده تغییرات در کلاس active-view
    const views = document.querySelectorAll('.view');
    views.forEach(view => {
        observer.observe(view, {
            attributes: true,
            attributeFilter: ['class']
        });
    });
}

/**
 * راه‌اندازی event listener ها برای نقشه‌های 2D
 */
function setupGlobe2DEventListeners() {
    // دکمه تمام صفحه برای نقشه‌های 2D
    document.querySelectorAll('.map-fullscreen-btn').forEach(btn => {
        btn.addEventListener('click', (_e) => {
            const mapId = btn.getAttribute('data-map-id');
            toggleMapFullscreen(mapId);
        });
    });
    
    // دکمه باز کردن کره 3D از نقشه 2D
    document.querySelectorAll('.map-to-3d-btn').forEach(btn => {
        btn.addEventListener('click', (_e) => {
            const globeType = btn.getAttribute('data-globe-type');
            openGlobe3DFrom2D(globeType);
        });
    });
    
    // دکمه بازگشت از کره 3D به نقشه 2D
    document.querySelectorAll('.globe-to-2d-btn').forEach(btn => {
        btn.addEventListener('click', (_e) => {
            const globeType = btn.getAttribute('data-globe-type');
            returnTo2DFrom3D(globeType);
        });
    });
    
}

/**
 * تغییر حالت تمام صفحه برای نقشه 2D
 */
function toggleMapFullscreen(mapId) {
    const log = window.logger || { warn: console.warn };
    const mapContainer = document.querySelector(`#${mapId.replace('-map', 'Map2D')}`) || 
                         document.querySelector(`.globe-2d-map-container[data-map-id="${mapId}"]`);
    
    if (!mapContainer) {
        log.warn(`نقشه ${mapId} پیدا نشد`);
        return;
    }
    
    if (mapContainer.classList.contains('fullscreen')) {
        // خروج از حالت تمام صفحه
        mapContainer.classList.remove('fullscreen');
        document.body.style.overflow = '';
    } else {
        // ورود به حالت تمام صفحه
        mapContainer.classList.add('fullscreen');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * باز کردن کره 3D از نقشه 2D با حفظ انتخاب کشور
 */
function openGlobe3DFrom2D(globeType) {
    // ذخیره داده‌های انتخابی
    const mapInstance = globe2DMaps[globeType];
    if (mapInstance && mapInstance.selectedCountries && mapInstance.selectedCountries.length > 0) {
        sharedGlobeData.selectedCountry = mapInstance.selectedCountries[0];
        sharedGlobeData.selectedFilter = mapInstance.currentFilter;
        sharedGlobeData.selectedYear = mapInstance.currentYear;
    }
    
    // باز کردن کره 3D مربوطه
    switch(globeType) {
        case 'resources':
            if (typeof openResourcesGlobe === 'function') {
                openResourcesGlobe();
                // اعمال انتخاب کشور به کره 3D بعد از باز شدن
                setTimeout(() => {
                    if (sharedGlobeData.selectedCountry && typeof applyCountrySelectionTo3D === 'function') {
                        applyCountrySelectionTo3D('resources', sharedGlobeData.selectedCountry);
                    }
                }, 1000);
            }
            break;
        case 'weather':
            if (typeof open3DGlobe === 'function') {
                open3DGlobe('weather');
                setTimeout(() => {
                    if (sharedGlobeData.selectedCountry && typeof applyCountrySelectionTo3D === 'function') {
                        applyCountrySelectionTo3D('weather', sharedGlobeData.selectedCountry);
                    }
                }, 1000);
            } else if (typeof window.open3DGlobe === 'function') {
                window.open3DGlobe('weather');
            }
            break;
        case 'military':
            if (typeof open3DGlobe === 'function') {
                open3DGlobe('military');
                setTimeout(() => {
                    if (sharedGlobeData.selectedCountry && typeof applyCountrySelectionTo3D === 'function') {
                        applyCountrySelectionTo3D('military', sharedGlobeData.selectedCountry);
                    }
                }, 1000);
            } else if (typeof window.open3DGlobe === 'function') {
                window.open3DGlobe('military');
            }
            break;
        case 'universities':
            if (typeof open3DGlobe === 'function') {
                open3DGlobe('universities');
                setTimeout(() => {
                    if (sharedGlobeData.selectedCountry && typeof applyCountrySelectionTo3D === 'function') {
                        applyCountrySelectionTo3D('universities', sharedGlobeData.selectedCountry);
                    }
                }, 1000);
            } else if (typeof window.open3DGlobe === 'function') {
                window.open3DGlobe('universities');
            }
            break;
        case 'historical':
            if (typeof open3DGlobe === 'function') {
                open3DGlobe('historical');
                setTimeout(() => {
                    if (sharedGlobeData.selectedCountry && typeof applyCountrySelectionTo3D === 'function') {
                        applyCountrySelectionTo3D('historical', sharedGlobeData.selectedCountry);
                    }
                }, 1000);
            } else if (typeof window.open3DGlobe === 'function') {
                window.open3DGlobe('historical');
            }
            break;
        case 'earthquake':
            if (typeof open3DGlobe === 'function') {
                open3DGlobe('earthquake');
                setTimeout(() => {
                    if (sharedGlobeData.selectedCountry && typeof applyCountrySelectionTo3D === 'function') {
                        applyCountrySelectionTo3D('earthquake', sharedGlobeData.selectedCountry);
                    }
                }, 1000);
            } else if (typeof window.open3DGlobe === 'function') {
                window.open3DGlobe('earthquake');
            }
            break;
        case 'natural-resources':
            if (typeof open3DGlobe === 'function') {
                open3DGlobe('natural-resources');
                setTimeout(() => {
                    if (sharedGlobeData.selectedCountry && typeof applyCountrySelectionTo3D === 'function') {
                        applyCountrySelectionTo3D('natural-resources', sharedGlobeData.selectedCountry);
                    }
                }, 1000);
            } else if (typeof window.open3DGlobe === 'function') {
                window.open3DGlobe('natural-resources');
            }
            break;
        default: {
            const log = window.logger || { warn: console.warn };
            log.warn(`نوع کره ${globeType} شناخته نشد`);
        }
    }
}

/**
 * اعمال انتخاب کشور به کره 3D
 */
function applyCountrySelectionTo3D(globeType, countryData) {
    if (!countryData) return;
    
    // استخراج کد کشور از countryData
    let countryCode = null;
    if (typeof countryData === 'string') {
        // اگر فقط نام کشور است، کد را پیدا کن
        countryCode = countryData;
    } else if (countryData.code) {
        countryCode = countryData.code;
    } else if (countryData.name) {
        // پیدا کردن کد از نام کشور
        const mapInstance = globe2DMaps[globeType];
        if (mapInstance && mapInstance.countryNameToCode) {
            const normalized = mapInstance.normalizeCountryName ? 
                mapInstance.normalizeCountryName(countryData.name) : 
                countryData.name.toLowerCase();
            countryCode = mapInstance.countryNameToCode[normalized];
        }
    }
    
    if (!countryCode) {
        const log = window.logger || { warn: console.warn };
        log.warn(`کد کشور برای ${countryData} پیدا نشد`);
        return;
    }
    
    // اعمال انتخاب بر اساس نوع کره
    switch(globeType) {
        case 'resources':
            if (typeof selectCountry === 'function') {
                selectCountry(countryCode);
            } else if (typeof window.selectCountry === 'function') {
                window.selectCountry(countryCode);
            }
            // زوم به کشور
            if (typeof zoomToCountry === 'function') {
                setTimeout(() => zoomToCountry(countryCode), 500);
            } else if (typeof window.zoomToCountry === 'function') {
                setTimeout(() => window.zoomToCountry(countryCode), 500);
            }
            break;
        case 'weather':
        case 'military':
        case 'universities':
        case 'historical':
        case 'earthquake':
        case 'natural-resources':
            // برای سایر کره‌ها، از تابع عمومی زوم استفاده کن
            if (window.simpleGlobeScenes && window.simpleGlobeScenes[globeType]) {
                const scene = window.simpleGlobeScenes[globeType];
                if (scene && scene.earth && typeof findCountryByCode === 'function') {
                    const country = findCountryByCode(countryCode);
                    if (country && country.capital && country.capital.coords) {
                        const [lat, lng] = country.capital.coords;
                        // استفاده از تابع زوم موجود
                        if (typeof zoomToLocation === 'function') {
                            zoomToLocation(globeType, lat, lng);
                        } else if (scene.camera && scene.controls) {
                            // زوم دستی
                            const phi = (90 - lat) * (Math.PI / 180);
                            const theta = (lng + 180) * (Math.PI / 180);
                            const distance = 2.2;
                            const x = -distance * Math.sin(phi) * Math.cos(theta);
                            const y = distance * Math.cos(phi);
                            const z = distance * Math.sin(phi) * Math.sin(theta);
                            
                            scene.camera.position.set(x, y, z);
                            scene.camera.lookAt(0, 0, 0);
                            if (scene.controls) {
                                scene.controls.target.set(0, 0, 0);
                                scene.controls.update();
        }
                        }
                    }
                }
            }
            break;
    }
}

/**
 * بازگشت از کره 3D به نقشه 2D با حفظ انتخاب
 */
function returnTo2DFrom3D(globeType) {
    // بستن کره 3D
    const modalId = globeType === 'natural-resources' ? 'naturalResourcesGlobeModal' : `${globeType}GlobeModal`;
    if (typeof closeGlobeModal === 'function') {
        closeGlobeModal(modalId);
    } else {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
        
        // بازگشت به صفحه کره‌ها
        if (typeof showView === 'function') {
            showView('globe');
        }
    }
    
    // بعد از بازگشت، هایلایت مربوطه را فعال کن
    setTimeout(() => {
        const globeCircle = document.querySelector(`.highlight-circle[data-globe="${globeType}"]`);
        const globePanel = document.querySelector(`.globe-panel[data-globe-panel="${globeType}"]`);
        
        if (globeCircle) {
            document.querySelectorAll('.highlight-circle[data-globe]').forEach(c => c.classList.remove('active'));
            globeCircle.classList.add('active');
        }
        
        if (globePanel) {
            document.querySelectorAll('.globe-panel[data-globe-panel]').forEach(p => p.classList.remove('active'));
            globePanel.classList.add('active');
        }
    }, 200);
    
    // اعمال انتخاب‌های ذخیره شده به نقشه 2D
    if (sharedGlobeData.selectedCountry && globe2DMaps[globeType]) {
        const mapInstance = globe2DMaps[globeType];
        
        // پیدا کردن کد کشور
        let countryCode = null;
        if (typeof sharedGlobeData.selectedCountry === 'string') {
            countryCode = sharedGlobeData.selectedCountry;
        } else if (sharedGlobeData.selectedCountry.code) {
            countryCode = sharedGlobeData.selectedCountry.code;
        } else if (sharedGlobeData.selectedCountry.name) {
            // پیدا کردن کد از نام
            if (mapInstance.countryNameToCode) {
                const normalized = mapInstance.normalizeCountryName ? 
                    mapInstance.normalizeCountryName(sharedGlobeData.selectedCountry.name) : 
                    sharedGlobeData.selectedCountry.name.toLowerCase();
                countryCode = mapInstance.countryNameToCode[normalized];
            }
        }
        
        if (countryCode && mapInstance.g) {
            // پیدا کردن path کشور در نقشه 2D
            const countryPath = mapInstance.g.selectAll('path.country')
                .filter(d => {
                    const code = mapInstance.getCountryCode ? 
                        mapInstance.getCountryCode(d.properties?.name) : null;
                    return code === countryCode;
                });
            
            if (countryPath.size() > 0) {
                // انتخاب کشور در نقشه
                mapInstance.g.selectAll('path.country').classed('selected', false);
                countryPath.classed('selected', true);
                
                // اضافه کردن به selectedCountries
                const countryData = mapInstance.getCompleteData ? 
                    mapInstance.getCompleteData()[mapInstance.currentYear]?.[countryCode] : null;
                
                if (countryData) {
                    mapInstance.selectedCountries = [{
                        code: countryCode,
                        name: countryData.name || sharedGlobeData.selectedCountry.name,
                        data: countryData
                    }];
                    
                    // به‌روزرسانی مقایسه کشورها
                    if (mapInstance.updateCountryComparison) {
                        mapInstance.updateCountryComparison();
                    }
                }
                
                // زوم به کشور در نقشه 2D
                if (mapInstance.svg && mapInstance.projection) {
                    const bounds = d3.geoPath().projection(mapInstance.projection).bounds(
                        countryPath.datum()
                    );
                    if (bounds && bounds.length === 2) {
                        const dx = bounds[1][0] - bounds[0][0];
                        const dy = bounds[1][1] - bounds[0][1];
                        const x = (bounds[0][0] + bounds[1][0]) / 2;
                        const y = (bounds[0][1] + bounds[1][1]) / 2;
                        const scale = Math.max(1, Math.min(8, 0.95 / Math.max(dx / mapInstance.svg.attr('width'), dy / mapInstance.svg.attr('height'))));
                        const translate = [mapInstance.svg.attr('width') / 2 - scale * x, mapInstance.svg.attr('height') / 2 - scale * y];
                        
                        mapInstance.svg.transition()
                            .duration(750)
                            .call(mapInstance.zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
                    }
                }
            }
        }
    }
}

// در دسترس قرار دادن توابع
window.setupGlobe2DMaps = setupGlobe2DMaps;
window.openGlobe3DFrom2D = openGlobe3DFrom2D;
window.returnTo2DFrom3D = returnTo2DFrom3D;
window.sharedGlobeData = sharedGlobeData;
window.initGlobe2DMapsOnViewChange = initGlobe2DMapsOnViewChange;
