// gold-map-glass.js - نسخه کامل با 60 کشور
class WorldGoldMapGlass {
    constructor(containerId) {
        this.currentYear = '2024';
        this.currentFilter = 'reserves';
        this.selectedCountries = [];
        this.worldData = null;
        this.countriesInfo = null;
        this.isMobile = window.innerWidth <= 768;
        this.isDarkMode = document.documentElement.classList.contains('dark-theme');
        this.countryNameToCode = {};
        this.countryInfoByCode = {};
        this.completeData = null;
        this.globeType = null; // null = نقشه اصلی، 'resources'/'weather'/'military' = نقشه در هایلایت
        this.containerId = containerId || 'goldMapGlass'; // ID container برای نقشه
        this.isFullscreen = false; // وضعیت تمام صفحه

        this.init();
    }

    async init() {
        try {
            await this.loadWorldData();
            this.buildCountryCodeMap();
            this.completeData = this.buildCompleteData();
            this.createMap();
            this.bindEvents();
            this.updateFilterBadge();
            this.updateAll();
            this.setupMobileOptimizations();
            
            // تشخیص تغییر تم
            this.setupThemeObserver();
            
            // اطمینان از اینکه event listener ها بعد از render شدن DOM اضافه شوند
            setTimeout(() => {
                this.setupCompareEvents();
                this.setupFullscreenEvents();
            }, 500);
        } catch (error) {
            const log = window.logger || { error: console.error };
            log.error('خطا در بارگذاری نقشه:', error);
            if (window.errorHandler) {
                window.errorHandler.handleError(error, 'WorldGoldMapGlass.init');
            }
            this.showError('خطا در بارگذاری نقشه. لطفاً صفحه را رفرش کنید.');
        }
    }
    
    setupCompareEvents() {
        // دکمه مقایسه
        const compareToggle = document.getElementById('compareToggle');
        if (compareToggle) {
            // حذف event listener های قبلی
            const newToggle = compareToggle.cloneNode(true);
            compareToggle.parentNode.replaceChild(newToggle, compareToggle);
            
            newToggle.addEventListener('click', () => {
                const comparePanel = document.getElementById('comparePanel');
                if (comparePanel) {
                    comparePanel.classList.toggle('hidden');
                }
            });
        }
        
        // دکمه بستن مقایسه
        const closeCompare = document.getElementById('closeCompare');
        if (closeCompare) {
            // حذف event listener های قبلی
            const newClose = closeCompare.cloneNode(true);
            closeCompare.parentNode.replaceChild(newClose, closeCompare);
            
            newClose.addEventListener('click', () => {
                const comparePanel = document.getElementById('comparePanel');
                if (comparePanel) {
                    comparePanel.classList.add('hidden');
                }
            });
        }
    }
    
    setupFullscreenEvents() {
        const fullscreenToggle = document.getElementById('mapFullscreenToggle');
        if (!fullscreenToggle) return;
        
        // حذف event listener های قبلی
        const newToggle = fullscreenToggle.cloneNode(true);
        fullscreenToggle.parentNode.replaceChild(newToggle, fullscreenToggle);
        
        newToggle.addEventListener('click', () => {
            this.toggleFullscreen();
        });
        
        // گوش دادن به تغییرات fullscreen
        document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('webkitfullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('mozfullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('MSFullscreenChange', () => this.handleFullscreenChange());
    }
    
    toggleFullscreen() {
        const mapContainer = document.getElementById('goldMapSection');
        if (!mapContainer) return;
        
        const isFullscreen = !!(document.fullscreenElement || 
                               document.webkitFullscreenElement || 
                               document.mozFullScreenElement || 
                               document.msFullscreenElement);
        
        if (!isFullscreen) {
            // ورود به حالت تمام صفحه
            if (mapContainer.requestFullscreen) {
                mapContainer.requestFullscreen().catch(err => {
                    const log = window.logger || { warn: console.warn };
                    log.warn('خطا در ورود به حالت تمام صفحه:', err);
                });
            } else if (mapContainer.webkitRequestFullscreen) {
                mapContainer.webkitRequestFullscreen();
            } else if (mapContainer.mozRequestFullScreen) {
                mapContainer.mozRequestFullScreen();
            } else if (mapContainer.msRequestFullscreen) {
                mapContainer.msRequestFullscreen();
            }
        } else {
            // خروج از حالت تمام صفحه
            if (document.exitFullscreen) {
                document.exitFullscreen().catch(err => {
                    const log = window.logger || { warn: console.warn };
                    log.warn('خطا در خروج از حالت تمام صفحه:', err);
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
    
    handleFullscreenChange() {
        const isFullscreen = !!(document.fullscreenElement || 
                               document.webkitFullscreenElement || 
                               document.mozFullScreenElement || 
                               document.msFullscreenElement);
        
        this.isFullscreen = isFullscreen;
        const mapContainer = document.getElementById('goldMapSection');
        const fullscreenToggle = document.getElementById('mapFullscreenToggle');
        const fullscreenIcon = fullscreenToggle?.querySelector('.fullscreen-icon');
        
        if (mapContainer) {
            if (isFullscreen) {
                mapContainer.classList.add('map-fullscreen-active');
            } else {
                mapContainer.classList.remove('map-fullscreen-active');
            }
        }
        
        if (fullscreenIcon) {
            fullscreenIcon.textContent = isFullscreen ? '⛶' : '⛶';
            if (fullscreenToggle) {
                fullscreenToggle.title = isFullscreen ? 'خروج از تمام صفحه' : 'تمام صفحه';
            }
        }
        
        // به‌روزرسانی اندازه نقشه
        if (this.svg) {
            setTimeout(() => {
                this.createMap();
            }, 100);
        }
    }

    setupThemeObserver() {
        // مشاهده تغییرات در تم
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    this.isDarkMode = document.documentElement.classList.contains('dark-theme');
                    this.updateWaterColor();
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });
    }

    setupMobileOptimizations() {
        if (this.isMobile) {
            document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
        }
    }

    handleTouchStart(e) {
        const container = document.getElementById(this.containerId);
        if (container && e.target.closest(`#${this.containerId}`) && e.touches.length > 1) {
            e.preventDefault();
        }
    }

    async loadWorldData() {
        try {
            const atlasResponse = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
            this.worldData = await atlasResponse.json();

            // داده‌های کشورها از منبع داخلی استفاده می‌شود چون منبع خارجی قابل اعتماد نیست
            this.countriesInfo = [];
            const log = window.logger || { info: console.log, error: console.error };
            log.info('✅ نقشه جهان بارگذاری شد');
        } catch (error) {
            const log = window.logger || { error: console.error };
            log.error('خطا در بارگذاری داده‌های نقشه:', error);
            if (window.errorHandler) {
                window.errorHandler.handleError(error, 'WorldGoldMapGlass.loadWorldData');
            }
            throw error;
        }
    }

    buildCountryCodeMap() {
        this.countryNameToCode = {};
        this.countryInfoByCode = {};

        if (Array.isArray(this.countriesInfo)) {
            this.countriesInfo.forEach(info => {
                const code = info.cca3;
                if (!code) return;
                const names = new Set();
                if (info.name?.common) names.add(info.name.common);
                if (info.name?.official) names.add(info.name.official);

                if (info.translations) {
                    Object.values(info.translations).forEach(tr => {
                        if (tr?.common) names.add(tr.common);
                        if (tr?.official) names.add(tr.official);
                    });
                }

                names.forEach(name => {
                    if (!name) return;
                    const normalized = this.normalizeCountryName(name);
                    this.countryNameToCode[normalized] = code;
                });

                this.countryInfoByCode[code] = {
                    nameEn: info.name?.common || code,
                    nameFa: info.translations?.fas?.common || info.translations?.ara?.common
                };
            });
        }

        const overrides = {
            'united states of america': 'USA',
            'united states': 'USA',
            'south korea': 'KOR',
            'north korea': 'PRK',
            'democratic republic of the congo': 'COD',
            'dem. rep. congo': 'COD',
            'republic of the congo': 'COG',
            'czech republic': 'CZE',
            'czech rep.': 'CZE',
            'ivory coast': 'CIV',
            'cote d ivoire': 'CIV',
            'laos': 'LAO',
            'bahamas': 'BHS',
            'bolivia': 'BOL',
            'myanmar (burma)': 'MMR',
            'burma': 'MMR',
            'syria': 'SYR',
            'cape verde': 'CPV',
            'bosnia and herzegovina': 'BIH',
            'bosnia and herz.': 'BIH',
            'solomon islands': 'SLB',
            'solomon is.': 'SLB',
            'eswatini': 'SWZ',
            'swaziland': 'SWZ'
        };

        Object.entries(overrides).forEach(([name, code]) => {
            this.countryNameToCode[this.normalizeCountryName(name)] = code;
        });

        this.extendCountryMapFromTopojson();
    }

    normalizeCountryName(name) {
        return name.replace(/\s*\(.*?\)\s*/g, '').replace(/’/g, "'").toLowerCase().trim();
    }

    extendCountryMapFromTopojson() {
        if (!this.worldData || !this.worldData.objects?.countries) return;
        const features = topojson.feature(this.worldData, this.worldData.objects.countries).features;
        features.forEach(feature => {
            const name = feature.properties?.name;
            if (!name) return;

            const normalized = this.normalizeCountryName(name);
            if (!this.countryNameToCode[normalized]) {
                const fallbackCode = this.generateFallbackCode(feature, normalized);
                this.countryNameToCode[normalized] = fallbackCode;
                if (!this.countryInfoByCode[fallbackCode]) {
                    this.countryInfoByCode[fallbackCode] = {
                        nameEn: name,
                        nameFa: name
                    };
                }
            }
        });
    }

    generateFallbackCode(feature, normalizedName) {
        if (feature.id) {
            return `C${feature.id}`;
        }
        const letters = (normalizedName || '').replace(/[^a-z]/g, '').toUpperCase();
        return letters ? letters.slice(0, 6) : `C${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    }

    createMap() {
        const container = document.getElementById('goldMapGlass');
        if (!container) {
            const log = window.logger || { error: console.error };
            log.error('Container #goldMapGlass not found');
            return;
        }

        const width = container.clientWidth;
        const height = this.isMobile ? 300 : 500;

        // پاکسازی قبلی
        container.innerHTML = '';

        this.svg = d3.select(`#${this.containerId}`)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', `0 0 ${width} ${height}`)
            .style('background', 'var(--bg-secondary)')
            .style('border-radius', '12px')
            .style('cursor', 'grab');

        this.projection = d3.geoNaturalEarth1()
            .scale(width / 5)  // زوم بیشتر برای نمایش بهتر
            .translate([width / 2, height / 2]);

        this.path = d3.geoPath().projection(this.projection);

        this.zoom = d3.zoom()
            .scaleExtent([1, 8])
            .on('zoom', (event) => {
                this.g.attr('transform', event.transform);
                this.updateCoordinates(event.transform);
            });

        this.svg.call(this.zoom);

        this.g = this.svg.append('g');
        this.drawCountries();
        this.createTooltip();
        this.createLegend(); // ایجاد راهنمای رنگ
        this.updateWaterColor();
    }

    updateWaterColor() {
        // آپدیت رنگ آب‌ها بر اساس تم
        const waterColor = this.isDarkMode 
            ? 'url(#waterGradientDark)'
            : 'url(#waterGradientLight)';
        
        this.svg.selectAll('.ocean').remove();
        
        // اضافه کردن گرادیانت برای آب‌ها
        const defs = this.svg.append('defs');
        
        // گرادیانت برای حالت روشن
        const gradientLight = defs.append('linearGradient')
            .attr('id', 'waterGradientLight')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '100%')
            .attr('y2', '100%');
            
        gradientLight.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', '#4fd1c7')
            .attr('stop-opacity', 1);
            
        gradientLight.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', '#319795')
            .attr('stop-opacity', 1);

        // گرادیانت برای حالت تاریک با اثر نیونی
        const gradientDark = defs.append('linearGradient')
            .attr('id', 'waterGradientDark')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '100%')
            .attr('y2', '100%');
            
        gradientDark.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', '#00f5ff')
            .attr('stop-opacity', 0.8);
            
        gradientDark.append('stop')
            .attr('offset', '50%')
            .attr('stop-color', '#4fd1c7')
            .attr('stop-opacity', 0.6);
            
        gradientDark.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', '#00b5b8')
            .attr('stop-opacity', 0.8);

        // پس‌زمینه اقیانوس
        this.svg.append('rect')
            .attr('class', 'ocean')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('fill', waterColor);
    }

    createTooltip() {
        d3.select('.gold-map-tooltip').remove();
        
        this.tooltip = d3.select('body')
            .append('div')
            .attr('class', 'gold-map-tooltip')
            .style('position', 'absolute')
            .style('background', 'var(--glass-bg, rgba(18, 18, 18, 0.95))')
            .style('backdrop-filter', 'var(--glass-blur, blur(20px) saturate(150%))')
            .style('-webkit-backdrop-filter', 'var(--glass-blur, blur(20px) saturate(150%))')
            .style('border', '1px solid var(--glass-border, rgba(251, 146, 60, 0.2))')
            .style('border-radius', '0.875rem')
            .style('padding', '1rem')
            .style('box-shadow', 'var(--glass-shadow, 0 10px 30px rgba(0, 0, 0, 0.3))')
            .style('color', 'var(--text-primary, #ffffff)')
            .style('z-index', '10000')
            .style('pointer-events', 'none')
            .style('opacity', 0)
            .style('max-width', this.isMobile ? '220px' : '240px') // کوچکتر برای دسکتاپ
            .style('font-size', this.isMobile ? '0.7rem' : '0.75rem')
            .style('line-height', '1.4')
            .style('padding', this.isMobile ? '0.65rem' : '0.75rem');
    }

    drawCountries() {
        if (!this.worldData) return;

        const countries = topojson.feature(this.worldData, this.worldData.objects.countries).features;

        this.g.selectAll('path.country')
            .data(countries)
            .enter()
            .append('path')
            .attr('class', 'country')
            .attr('d', this.path)
            .attr('fill', d => this.getCountryColor(d))
            .attr('stroke', 'transparent')
            .attr('stroke-width', 0)
            .style('cursor', 'pointer')
            .style('transition', 'fill 0.3s ease, opacity 0.2s ease, filter 0.2s ease')
            .on('click', (event, d) => this.handleCountryClick(event, d))
            .on('mouseover', (event, d) => this.handleCountryHover(event, d))
            .on('mouseout', (event, d) => this.handleCountryMouseOut(event, d))
            .on('touchstart', (event, d) => {
                event.preventDefault();
                this.handleCountryTouch(event, d);
            });
    }

    bindEvents() {
        // فیلترهای قدیمی (دکمه‌ای)
        document.querySelectorAll('.glass-filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.setActiveFilter(btn);
            });
        });

        // فیلتر جدید (select)
        const mapFilterSelect = document.getElementById('mapFilter');
        if (mapFilterSelect) {
            this.currentFilter = mapFilterSelect.value;
            mapFilterSelect.addEventListener('change', (e) => {
                this.currentFilter = e.target.value;
                this.updateFilterBadge();
                this.updateAll();
            });
        }

        // سال‌ها - قدیمی
        document.querySelectorAll('.glass-year-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.setActiveYear(btn);
            });
        });

        // سال‌ها - dropdown جدید
        const yearSelect = document.getElementById('yearFilter');
        if (yearSelect) {
            this.currentYear = yearSelect.value;
            yearSelect.addEventListener('change', (e) => {
                this.currentYear = e.target.value;
                this.updateAll();
            });
        }

        // کنترل‌های نقشه
        const resetZoomBtn = document.getElementById('resetZoom');
        const zoomInBtn = document.getElementById('zoomIn');
        const zoomOutBtn = document.getElementById('zoomOut');

        if (resetZoomBtn) resetZoomBtn.addEventListener('click', () => this.resetZoom());
        if (zoomInBtn) zoomInBtn.addEventListener('click', () => this.zoomIn());
        if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => this.zoomOut());
        
        // دکمه مقایسه و بستن - در setupCompareEvents اضافه می‌شوند
        
        // ریسایز
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.isMobile = window.innerWidth <= 768;
                this.createMap();
                this.updateAll();
            }, 250);
        });
    }

    setActiveFilter(btn) {
        document.querySelectorAll('.glass-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.dataset.filter;
        
        this.updateFilterBadge();
        this.updateAll();
    }

    setActiveYear(btn) {
        document.querySelectorAll('.glass-year-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentYear = btn.dataset.year;
        this.updateAll();
    }

    updateAll() {
        this.updateMapColors();
        this.updateTopCountries();
        this.updateCountryComparison();
        this.updateSelectionCount();
        this.updateLegend(); // به‌روزرسانی legend با تغییر فیلتر
    }

    updateFilterBadge() {
        const badge = document.getElementById('currentFilterBadge');
        if (badge) {
            badge.textContent = this.getFilterLabel(this.currentFilter);
        }
    }

    updateMapColors() {
        this.g.selectAll('path.country')
            .attr('fill', d => this.getCountryColor(d));
    }

    updateTopCountries() {
        // استفاده از requestAnimationFrame برای بهبود عملکرد
        requestAnimationFrame(() => {
            const currentData = this.getCompleteData()[this.currentYear];
            if (!currentData) return;

            const sorted = Object.values(currentData)
                .sort((a, b) => {
                    const valA = a[this.currentFilter] || 0;
                    const valB = b[this.currentFilter] || 0;
                    
                    if (this.currentFilter.includes('Rank')) {
                        return valA - valB;
                    }
                    return valB - valA;
                })
                .slice(0, 20); // نمایش 20 کشور برتر

            const html = sorted.map((country, index) => {
                const value = country[this.currentFilter] ? this.formatValue(country[this.currentFilter], this.currentFilter) : 'N/A';
                let medalClass = 'other';
                let medalText = (index + 1).toString();
                
                if (index === 0) { medalClass = 'gold'; medalText = '🥇'; }
                else if (index === 1) { medalClass = 'silver'; medalText = '🥈'; }
                else if (index === 2) { medalClass = 'bronze'; medalText = '🥉'; }

                return `
                    <div class="country-rank-item" onclick="window.worldGoldMapGlass && window.worldGoldMapGlass.selectCountryFromList('${country.code}')">
                        <div class="rank-medal ${medalClass}">${medalText}</div>
                        <div class="country-info">
                            <div class="country-name">${country.name}</div>
                        </div>
                        <div class="country-value">${value}</div>
                    </div>
                `;
            }).join('');

            const list = document.getElementById('topCountriesList');
            if (list) list.innerHTML = html;
        });
    }

    updateCountryComparison() {
        const container = document.getElementById('countryComparison');
        if (!container) {
            // اگر container پیدا نشد، کمی صبر کن و دوباره تلاش کن
            setTimeout(() => this.updateCountryComparison(), 100);
            return;
        }

        if (this.selectedCountries.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🌍</div>
                    <p>برای مقایسه، روی کشورها در نقشه کلیک کنید</p>
                    <small>می‌توانید حداکثر ۲ کشور را انتخاب کنید</small>
                </div>
            `;
            return;
        }

        // دریافت داده‌های به‌روز از سال و فیلتر فعلی
        const currentData = this.getCompleteData()[this.currentYear];
        
        const cardsHtml = this.selectedCountries.map(country => {
            // دریافت داده‌های به‌روز کشور
            const countryData = currentData?.[country.code] || country.data;
            
            const reserves = countryData.reserves ? this.formatValue(countryData.reserves, 'reserves') : 'N/A';
            const production = countryData.production ? this.formatValue(countryData.production, 'production') : 'N/A';
            const gdp = countryData.gdp ? this.formatValue(countryData.gdp, 'gdp') : 'N/A';
            const oil = countryData.oil ? this.formatValue(countryData.oil, 'oil') : 'N/A';
            const gas = countryData.gas ? this.formatValue(countryData.gas, 'gas') : 'N/A';
            const population = countryData.population ? this.formatValue(countryData.population, 'population') : 'N/A';
            const economicRank = countryData.economicRank || 'N/A';
            
            return `
                <div class="country-comparison-card">
                    <div class="comparison-card-header">
                        <h4>${countryData.name || country.name}</h4>
                        <button class="remove-btn" onclick="window.worldGoldMapGlass && window.worldGoldMapGlass.removeCountry('${country.code}')">
                            ✕
                        </button>
                    </div>
                    <div class="comparison-stats">
                        <div class="stat-row">
                            <span>💰 ذخایر طلا:</span>
                            <strong>${reserves} تن</strong>
                        </div>
                        <div class="stat-row">
                            <span>⛏️ برداشت طلا:</span>
                            <strong>${production} تن</strong>
                        </div>
                        <div class="stat-row">
                            <span>🛢️ تولید نفت:</span>
                            <strong>${oil} هزار بشکه</strong>
                        </div>
                        <div class="stat-row">
                            <span>🔥 تولید گاز:</span>
                            <strong>${gas} میلیارد متر مکعب</strong>
                        </div>
                        <div class="stat-row">
                            <span>📈 تولید ناخالص:</span>
                            <strong>${gdp} میلیون دلار</strong>
                        </div>
                        <div class="stat-row">
                            <span>👥 جمعیت:</span>
                            <strong>${population} نفر</strong>
                        </div>
                        <div class="stat-row">
                            <span>🏆 رتبه اقتصادی:</span>
                            <strong>${economicRank}</strong>
                        </div>
                        <div class="stat-row">
                            <span>📅 سال:</span>
                            <strong>${this.currentYear}</strong>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = cardsHtml;
        this.updateSelectionCount();
    }

    updateSelectionCount() {
        const countElement = document.getElementById('selectedCount');
        if (countElement) {
            countElement.textContent = this.selectedCountries.length;
        }
    }

    getCountryColor(country) {
        const data = this.getCountryData(country);
        if (!data || !data[this.currentFilter]) {
            // رنگ پیش‌فرض برای کشورهای بدون داده
            return this.isDarkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(203, 213, 225, 0.6)';
        }

        const value = data[this.currentFilter];
        
        // رنگ‌های بهینه‌شده برای هر فیلتر
        const scales = {
            reserves: d3.scaleSequential()
                .domain([0, 10000])
                .interpolator(t => d3.interpolateRgb('#2b1055', '#ffd166')(t)),
            production: d3.scaleSequential()
                .domain([0, 400])
                .interpolator(t => d3.interpolateRgb('#0f172a', '#34d399')(t)),
            gdp: d3.scaleSequential()
                .domain([0, 30000000])
                .interpolator(t => d3.interpolateRgb('#0f172a', '#60a5fa')(t)),
            economicRank: d3.scaleSequential()
                .domain([200, 1])
                .interpolator(t => d3.interpolateRgb('#4c0519', '#f472b6')(t)),
            oil: d3.scaleSequential()
                .domain([0, 15000])
                .interpolator(t => d3.interpolateRgb('#1f2937', '#fb923c')(t)),
            gas: d3.scaleSequential()
                .domain([0, 1000000])
                .interpolator(t => d3.interpolateRgb('#0f172a', '#a78bfa')(t)),
            population: d3.scaleSequential()
                .domain([0, 1500000000])
                .interpolator(t => d3.interpolateRgb('#0f172a', '#ea580c')(t))
        };

        return scales[this.currentFilter] ? scales[this.currentFilter](value) : 'rgba(100, 116, 139, 0.5)';
    }
    
    // ایجاد راهنمای رنگ (Legend)
    createLegend() {
        // حذف legend قبلی اگر وجود دارد
        d3.select('.map-color-legend').remove();
        
        const container = document.getElementById('goldMapGlass');
        if (!container) return;
        
        const parentContainer = container.parentElement;
        if (!parentContainer) return;
        
        // ایجاد container برای legend
        this.legendContainer = d3.select(parentContainer)
            .append('div')
            .attr('class', 'map-color-legend')
            .style('position', 'absolute')
            .style('bottom', '20px')
            .style('left', '20px')
            .style('z-index', '1000');
        
        this.updateLegend();
    }
    
    // به‌روزرسانی راهنمای رنگ بر اساس فیلتر فعلی
    updateLegend() {
        if (!this.legendContainer) return;
        
        const filterInfo = this.getFilterInfo(this.currentFilter);
        const scale = this.getColorScale(this.currentFilter);
        
        if (!scale || !filterInfo) return;
        
        // محاسبه مقادیر برای نمایش
        const minValue = filterInfo.domain[0];
        const maxValue = filterInfo.domain[1];
        const midValue = (minValue + maxValue) / 2;
        
        const formatMin = this.formatValue(minValue, this.currentFilter);
        const formatMid = this.formatValue(midValue, this.currentFilter);
        const formatMax = this.formatValue(maxValue, this.currentFilter);
        
        // ایجاد gradient برای نمایش رنگ‌ها
        // رنگ تیره = کمترین مقدار
        // رنگ روشن = بیشترین مقدار
        const minColor = scale(minValue);
        const maxColor = scale(maxValue);
        
        // gradient از چپ به راست (کم به زیاد)
        // اعداد: کم در راست، زیاد در چپ (RTL)
        this.legendContainer.html(`
            <div class="legend-header">
                <strong>${filterInfo.label}</strong>
            </div>
            <div class="legend-gradient-container">
                <div class="legend-gradient-bar" style="background: linear-gradient(to right, ${minColor}, ${maxColor});"></div>
            </div>
            <div class="legend-values">
                <span class="legend-max">${formatMax}</span>
                <span class="legend-mid">${formatMid}</span>
                <span class="legend-min">${formatMin}</span>
            </div>
        `);
    }
    
    // اطلاعات فیلترها
    getFilterInfo(filter) {
        const filters = {
            reserves: { label: '💰 ذخایر طلا', domain: [0, 10000], unit: 'تن' },
            production: { label: '⛏️ برداشت طلا', domain: [0, 400], unit: 'تن' },
            gdp: { label: '📈 تولید ناخالص', domain: [0, 30000000], unit: 'میلیون دلار' },
            economicRank: { label: '🏆 رتبه اقتصادی', domain: [200, 1], unit: '' },
            oil: { label: '🛢️ تولید نفت', domain: [0, 15000], unit: 'هزار بشکه' },
            gas: { label: '🔥 تولید گاز', domain: [0, 1000000], unit: 'میلیارد متر مکعب' },
            population: { label: '👥 جمعیت', domain: [0, 1500000000], unit: 'نفر' }
        };
        return filters[filter];
    }
    
    // دریافت scale رنگ برای فیلتر
    getColorScale(filter) {
        const scales = {
            reserves: d3.scaleSequential()
                .domain([0, 10000])
                .interpolator(t => d3.interpolateRgb('#2b1055', '#ffd166')(t)),
            production: d3.scaleSequential()
                .domain([0, 400])
                .interpolator(t => d3.interpolateRgb('#0f172a', '#34d399')(t)),
            gdp: d3.scaleSequential()
                .domain([0, 30000000])
                .interpolator(t => d3.interpolateRgb('#0f172a', '#60a5fa')(t)),
            economicRank: d3.scaleSequential()
                .domain([200, 1])
                .interpolator(t => d3.interpolateRgb('#4c0519', '#f472b6')(t)),
            oil: d3.scaleSequential()
                .domain([0, 15000])
                .interpolator(t => d3.interpolateRgb('#1f2937', '#fb923c')(t)),
            gas: d3.scaleSequential()
                .domain([0, 1000000])
                .interpolator(t => d3.interpolateRgb('#0f172a', '#a78bfa')(t)),
            population: d3.scaleSequential()
                .domain([0, 1500000000])
                .interpolator(t => d3.interpolateRgb('#0f172a', '#ea580c')(t))
        };
        return scales[filter];
    }

    getCountryData(country) {
        const code = this.getCountryCode(country.properties.name);
        if (!code) return null;
        return this.getCompleteData()[this.currentYear]?.[code];
    }

    handleCountryClick(event, d) {
        const data = this.getCountryData(d);
        if (!data) {
            this.showTooltip(event, 'داده‌ای برای این کشور موجود نیست');
            return;
        }

        const code = this.getCountryCode(d.properties.name);
        const existingIndex = this.selectedCountries.findIndex(c => c.code === code);

        if (existingIndex > -1) {
            // حذف کشور از انتخاب
            this.selectedCountries.splice(existingIndex, 1);
            d3.select(event.target).classed('selected', false);
        } else {
            // اضافه کردن کشور به انتخاب
            if (this.selectedCountries.length >= 2) {
                // حذف اولین کشور انتخاب شده
                const removed = this.selectedCountries.shift();
                // حذف کلاس selected از همه کشورها
                this.g.selectAll('path.country').classed('selected', false);
            }
            // اضافه کردن کشور جدید
            this.selectedCountries.push({
                code: code,
                name: data.name,
                data: data
            });
            d3.select(event.target).classed('selected', true);
        }

        // به‌روزرسانی مقایسه با داده‌های به‌روز
        this.updateCountryComparison();
        
        // انتخاب کشور در کره منابع (فقط اگر کره 3D قبلاً باز باشد)
        // این کد فقط برای نقشه‌های 2D در هایلایت‌های کره‌ها است، نه برای نقشه اصلی
        if (this.globeType && typeof window.selectCountry === 'function') {
            const log = window.logger || { info: console.log };
            log.info('🌍 انتخاب کشور در کره منابع:', code);
            
            // بررسی اینکه آیا کره 3D مربوطه باز است یا نه
            const modalId = this.globeType === 'resources' ? 'resourcesGlobeModal' : 
                           this.globeType === 'weather' ? 'weatherGlobeModal' :
                           this.globeType === 'military' ? 'militaryGlobeModal' : null;
            
            if (modalId) {
                const modal = document.getElementById(modalId);
                // فقط اگر کره 3D قبلاً باز باشد، کشور را انتخاب کن
                if (modal && modal.classList.contains('active')) {
                    window.selectCountry(code);
                }
            }
        }
    }

    handleCountryHover(event, d) {
        const data = this.getCountryData(d);
        // تغییر opacity برای hover (بدون stroke)
        d3.select(event.target)
            .style('opacity', 0.8)
            .style('filter', 'brightness(1.2)');

        if (data) {
            this.showTooltip(event, this.createTooltipContent(data));
        }
    }

    handleCountryMouseOut(event, d) {
        d3.select(event.target)
            .style('opacity', 1)
            .style('filter', 'brightness(1)');
        this.hideTooltip();
    }
    
    handleCountryTouch(event, d) {
        const data = this.getCountryData(d);
        if (data) {
            // برای موبایل/تبلت: نمایش tooltip با کلیک
            const touch = event.touches[0] || event.changedTouches[0];
            const syntheticEvent = {
                pageX: touch.pageX,
                pageY: touch.pageY,
                clientX: touch.clientX,
                clientY: touch.clientY
            };
            this.showTooltip(syntheticEvent, this.createTooltipContent(data));
            
            // بستن tooltip با کلیک مجدد یا بعد از 5 ثانیه
            setTimeout(() => {
                this.hideTooltip();
            }, 5000);
        }
    }

    createTooltipContent(data) {
        // نمایش تمام اطلاعات در tooltip
        const reserves = data.reserves ? this.formatValue(data.reserves, 'reserves') : 'N/A';
        const production = data.production ? this.formatValue(data.production, 'production') : 'N/A';
        const gdp = data.gdp ? this.formatValue(data.gdp, 'gdp') : 'N/A';
        const oil = data.oil ? this.formatValue(data.oil, 'oil') : 'N/A';
        const gas = data.gas ? this.formatValue(data.gas, 'gas') : 'N/A';
        const population = data.population ? this.formatValue(data.population, 'population') : 'N/A';
        const economicRank = data.economicRank || 'N/A';
        
        return `
            <div class="country-tooltip-content">
                <strong>${data.name}</strong>
                <div class="tooltip-stats">
                    <div class="tooltip-stat-row">
                        <span>💰 ذخایر طلا:</span>
                        <strong>${reserves} تن</strong>
                    </div>
                    <div class="tooltip-stat-row">
                        <span>⛏️ برداشت طلا:</span>
                        <strong>${production} تن</strong>
                    </div>
                    <div class="tooltip-stat-row">
                        <span>🛢️ تولید نفت:</span>
                        <strong>${oil} هزار بشکه</strong>
                    </div>
                    <div class="tooltip-stat-row">
                        <span>🔥 تولید گاز:</span>
                        <strong>${gas} میلیارد متر مکعب</strong>
                    </div>
                    <div class="tooltip-stat-row">
                        <span>📈 تولید ناخالص:</span>
                        <strong>${gdp} میلیون دلار</strong>
                    </div>
                    <div class="tooltip-stat-row">
                        <span>👥 جمعیت:</span>
                        <strong>${population} نفر</strong>
                    </div>
                    <div class="tooltip-stat-row">
                        <span>🏆 رتبه اقتصادی:</span>
                        <strong>${economicRank}</strong>
                    </div>
                    <div class="tooltip-year">سال: ${this.currentYear}</div>
                </div>
            </div>
        `;
    }

    showTooltip(event, content) {
        const tooltip = this.tooltip
            .html(content)
            .style('opacity', 1);
        
        // محاسبه موقعیت tooltip برای جلوگیری از خروج از صفحه
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
        
        // اندازه tooltip بر اساس نوع دستگاه
        const tooltipWidth = isMobile ? 220 : isTablet ? 240 : 240; // کوچکتر برای دسکتاپ
        const tooltipHeight = isMobile ? 320 : isTablet ? 340 : 340; // کوچکتر برای دسکتاپ
        const padding = 10;
        
        let left = event.pageX + padding;
        let top = event.pageY - padding;
        
        // بررسی خروج از سمت راست
        if (left + tooltipWidth > window.innerWidth) {
            left = event.pageX - tooltipWidth - padding;
        }
        
        // بررسی خروج از پایین
        if (top + tooltipHeight > window.innerHeight) {
            top = event.pageY - tooltipHeight - padding;
        }
        
        // بررسی خروج از بالا
        if (top < 0) {
            top = padding;
        }
        
        // بررسی خروج از چپ
        if (left < 0) {
            left = padding;
        }
        
        tooltip
            .style('left', left + 'px')
            .style('top', top + 'px')
            .style('max-width', tooltipWidth + 'px');
    }

    hideTooltip() {
        this.tooltip.style('opacity', 0);
    }

    selectCountryFromList(code) {
        const current = this.getCompleteData()[this.currentYear];
        const country = current[code];
        if (!country) return;
        
        this.selectedCountries = [{ code, name: country.name, data: country }];
        this.updateCountryComparison();
    }

    removeCountry(code) {
        this.selectedCountries = this.selectedCountries.filter(c => c.code !== code);
        this.g.selectAll('path.country').classed('selected', false);
        this.updateCountryComparison();
    }

    getFilterLabel(filter) {
        const labels = {
            reserves: 'ذخایر طلا',
            production: 'برداشت طلا',
            gdp: 'تولید ناخالص',
            economicRank: 'رتبه اقتصادی',
            oil: 'تولید نفت',
            gas: 'تولید گاز',
            population: 'جمعیت'
        };
        return labels[filter] || filter;
    }

    formatValue(value, filter) {
        if (filter === 'gdp') return (value / 1000000).toFixed(1) + 'T';
        if (filter === 'oil') return (value / 1000).toFixed(1) + 'K';
        if (filter === 'gas') return (value / 1000000).toFixed(1) + 'B';
        if (filter === 'population') return (value / 1000000).toFixed(2) + 'M';
        return Number(value).toLocaleString('en-US');
    }

    getCountryCode(name) {
        if (!name) return null;
        
        // نگاشت مستقیم نام کشورها به کد ISO - این نگاشت باید با نام‌های TopoJSON مطابقت داشته باشد
        const directMap = {
            'United States of America': 'USA',
            'United States': 'USA',
            'China': 'CHN',
            'Russia': 'RUS',
            'Russian Federation': 'RUS',
            'Iran': 'IRN',
            'Saudi Arabia': 'SAU',
            'India': 'IND',
            'Germany': 'DEU',
            'Japan': 'JPN',
            'United Kingdom': 'GBR',
            'France': 'FRA',
            'Canada': 'CAN',
            'Australia': 'AUS',
            'Italy': 'ITA',
            'Brazil': 'BRA',
            'South Korea': 'KOR',
            'Korea': 'KOR',
            'Spain': 'ESP',
            'Mexico': 'MEX',
            'Indonesia': 'IDN',
            'Netherlands': 'NLD',
            'Turkey': 'TUR',
            'Switzerland': 'CHE',
            'Poland': 'POL',
            'Sweden': 'SWE',
            'Belgium': 'BEL',
            'Thailand': 'THA',
            'Nigeria': 'NGA',
            'Argentina': 'ARG',
            'Norway': 'NOR',
            'Israel': 'ISR',
            'United Arab Emirates': 'ARE',
            'South Africa': 'ZAF',
            'Singapore': 'SGP',
            'Malaysia': 'MYS',
            'Philippines': 'PHL',
            'Colombia': 'COL',
            'Pakistan': 'PAK',
            'Chile': 'CHL',
            'Bangladesh': 'BGD',
            'Egypt': 'EGY',
            'Finland': 'FIN',
            'Vietnam': 'VNM',
            'Viet Nam': 'VNM',
            'Czech Republic': 'CZE',
            'Czechia': 'CZE',
            'Romania': 'ROU',
            'Portugal': 'PRT',
            'Peru': 'PER',
            'New Zealand': 'NZL',
            'Greece': 'GRC',
            'Iraq': 'IRQ',
            'Algeria': 'DZA',
            'Qatar': 'QAT',
            'Kazakhstan': 'KAZ',
            'Hungary': 'HUN',
            'Ukraine': 'UKR',
            'Kuwait': 'KWT',
            'Morocco': 'MAR',
            'Angola': 'AGO',
            'Ecuador': 'ECU',
            'Slovakia': 'SVK',
            'Oman': 'OMN',
            'Azerbaijan': 'AZE',
            'Turkmenistan': 'TKM',
            'Uzbekistan': 'UZB',
            'Ghana': 'GHA',
            'Libya': 'LBY',
            'Venezuela': 'VEN',
            'Sudan': 'SDN',
            'Tanzania': 'TZA',
            'United Republic of Tanzania': 'TZA',
            'Myanmar': 'MMR',
            'Burma': 'MMR',
            'Ireland': 'IRL',
            'Austria': 'AUT',
            'Denmark': 'DNK',
            'Hong Kong': 'HKG',
            'Taiwan': 'TWN',
            'Cuba': 'CUB',
            'Belarus': 'BLR',
            'Sri Lanka': 'LKA',
            'Luxembourg': 'LUX',
            'Dominican Republic': 'DOM',
            'Kenya': 'KEN',
            'Guatemala': 'GTM',
            'Uruguay': 'URY',
            'Croatia': 'HRV',
            'Bulgaria': 'BGR',
            'Ethiopia': 'ETH',
            'Lebanon': 'LBN',
            'Serbia': 'SRB',
            'Jordan': 'JOR',
            'Tunisia': 'TUN',
            'Bolivia': 'BOL',
            'Paraguay': 'PRY',
            'Panama': 'PAN',
            'Costa Rica': 'CRI',
            'Slovenia': 'SVN',
            'Lithuania': 'LTU',
            'Latvia': 'LVA',
            'Estonia': 'EST',
            'Bahrain': 'BHR',
            'Cyprus': 'CYP',
            'Afghanistan': 'AFG',
            'Nepal': 'NPL',
            'Cambodia': 'KHM',
            'Yemen': 'YEM',
            'Syria': 'SYR',
            'Syrian Arab Republic': 'SYR',
            'Zimbabwe': 'ZWE',
            'Zambia': 'ZMB',
            'Uganda': 'UGA',
            'Senegal': 'SEN',
            'Democratic Republic of the Congo': 'COD',
            'Dem. Rep. Congo': 'COD',
            'Democratic Rep. of the Congo': 'COD',
            'D.R. Congo': 'COD',
            'DRC': 'COD',
            'Republic of the Congo': 'COG',
            'Republic of Congo': 'COG',
            'Congo': 'COG',
            'Congo-Brazzaville': 'COG',
            'Mali': 'MLI',
            'Burkina Faso': 'BFA',
            'Madagascar': 'MDG',
            'Mozambique': 'MOZ',
            // کشورهای آفریقایی بیشتر
            'Nigeria': 'NGA',
            'South Africa': 'ZAF',
            'Kenya': 'KEN',
            'Ethiopia': 'ETH',
            'Tanzania': 'TZA',
            'Algeria': 'DZA',
            'Morocco': 'MAR',
            'Ghana': 'GHA',
            'Angola': 'AGO',
            'Sudan': 'SDN',
            'Libya': 'LBY',
            'Tunisia': 'TUN',
            'Cameroon': 'CMR',
            'Ivory Coast': 'CIV',
            "Côte d'Ivoire": 'CIV',
            'Niger': 'NER',
            'Chad': 'TCD',
            'Mauritania': 'MRT',
            'Benin': 'BEN',
            'Togo': 'TGO',
            'Sierra Leone': 'SLE',
            'Liberia': 'LBR',
            'Central African Republic': 'CAF',
            'Central African Rep.': 'CAF',
            'Eritrea': 'ERI',
            'Somalia': 'SOM',
            'South Sudan': 'SSD',
            'S. Sudan': 'SSD',
            'Malawi': 'MWI',
            'Rwanda': 'RWA',
            'Burundi': 'BDI',
            'Lesotho': 'LSO',
            'Guinea': 'GIN',
            'Guinea-Bissau': 'GNB',
            'Equatorial Guinea': 'GNQ',
            'Eq. Guinea': 'GNQ',
            'Djibouti': 'DJI',
            'Mauritius': 'MUS',
            'Comoros': 'COM',
            'Cape Verde': 'CPV',
            'Cabo Verde': 'CPV',
            'Seychelles': 'SYC',
            'Gambia': 'GMB',
            'The Gambia': 'GMB',
            'Gabon': 'GAB',
            'Namibia': 'NAM',
            'Botswana': 'BWA',
            'Zimbabwe': 'ZWE',
            'Swaziland': 'SWZ',
            'Eswatini': 'SWZ',
            'São Tomé and Príncipe': 'STP',
            'Sao Tome and Principe': 'STP',
            'Western Sahara': 'ESH',
            'W. Sahara': 'ESH',
            'Papua New Guinea': 'PNG',
            'Mongolia': 'MNG',
            'Botswana': 'BWA',
            'Namibia': 'NAM',
            'Gabon': 'GAB',
            'Jamaica': 'JAM',
            'Trinidad and Tobago': 'TTO',
            'Iceland': 'ISL',
            'Georgia': 'GEO',
            'Armenia': 'ARM',
            'Albania': 'ALB',
            'North Macedonia': 'MKD',
            'Macedonia': 'MKD',
            'Bosnia and Herzegovina': 'BIH',
            'Bosnia and Herz.': 'BIH',
            'Moldova': 'MDA',
            'Montenegro': 'MNE',
            'Kosovo': 'XKX',
            'Kyrgyzstan': 'KGZ',
            'Tajikistan': 'TJK',
            'Laos': 'LAO',
            'Brunei': 'BRN',
            'Bahamas': 'BHS',
            'Haiti': 'HTI',
            'Honduras': 'HND',
            'El Salvador': 'SLV',
            'Nicaragua': 'NIC',
            'Chad': 'TCD',
            'Niger': 'NER',
            'Mauritania': 'MRT',
            'Benin': 'BEN',
            'Togo': 'TGO',
            'Sierra Leone': 'SLE',
            'Liberia': 'LBR',
            'Central African Republic': 'CAF',
            'Central African Rep.': 'CAF',
            'Eritrea': 'ERI',
            'Somalia': 'SOM',
            'South Sudan': 'SSD',
            'S. Sudan': 'SSD',
            'Malawi': 'MWI',
            'Rwanda': 'RWA',
            'Burundi': 'BDI',
            'Lesotho': 'LSO',
            'Guinea': 'GIN',
            'Guinea-Bissau': 'GNB',
            'Equatorial Guinea': 'GNQ',
            'Eq. Guinea': 'GNQ',
            'Republic of the Congo': 'COG',
            'Djibouti': 'DJI',
            'Mauritius': 'MUS',
            'Comoros': 'COM',
            'Cape Verde': 'CPV',
            'Cabo Verde': 'CPV',
            'Seychelles': 'SYC',
            'Fiji': 'FJI',
            'Solomon Islands': 'SLB',
            'Solomon Is.': 'SLB',
            'Vanuatu': 'VUT',
            'Samoa': 'WSM',
            'New Caledonia': 'NCL',
            'French Polynesia': 'PYF',
            'Guam': 'GUM',
            'Puerto Rico': 'PRI',
            'Timor-Leste': 'TLS',
            'East Timor': 'TLS',
            'Bhutan': 'BTN',
            'Maldives': 'MDV',
            'Malta': 'MLT',
            'Andorra': 'AND',
            'Monaco': 'MCO',
            'Liechtenstein': 'LIE',
            'San Marino': 'SMR',
            'North Korea': 'PRK',
            'Dem. Rep. Korea': 'PRK',
            'Western Sahara': 'ESH',
            'W. Sahara': 'ESH',
            'Greenland': 'GRL',
            'Falkland Islands': 'FLK',
            'Falkland Is.': 'FLK',
            'French Guiana': 'GUF',
            'Fr. Guiana': 'GUF',
            'Suriname': 'SUR',
            'Guyana': 'GUY',
            'Belize': 'BLZ',
            'Eswatini': 'SWZ',
            'Swaziland': 'SWZ'
        };
        
        // اول در نگاشت مستقیم جستجو کن
        if (directMap[name]) {
            return directMap[name];
        }
        
        // سپس در نگاشت داینامیک جستجو کن
        const normalized = this.normalizeCountryName(name);
        if (this.countryNameToCode[normalized]) {
            return this.countryNameToCode[normalized];
        }
        
        // در نهایت در نگاشت مستقیم با نام نرمال شده جستجو کن
        for (const [key, value] of Object.entries(directMap)) {
            if (this.normalizeCountryName(key) === normalized) {
                return value;
            }
        }
        
        return null;
    }

    resetZoom() {
        this.svg.transition().duration(500).call(this.zoom.transform, d3.zoomIdentity);
    }

    zoomIn() {
        this.svg.transition().duration(250).call(this.zoom.scaleBy, 1.5);
    }

    zoomOut() {
        this.svg.transition().duration(250).call(this.zoom.scaleBy, 0.75);
    }

    updateCoordinates(transform) {
        const element = document.getElementById('coordinates');
        if (element) {
            element.textContent = `مقیاس: ${transform.k.toFixed(1)}x`;
        }
    }

    showGlobeModal() {
        // ============================================
        // این بخش برای نمای سه بعدی آماده شده است
        // می‌توانید از کتابخانه‌های زیر استفاده کنید:
        // 1. Three.js + D3 برای نقشه سه بعدی
        // 2. Globe.gl برای گلوب تعاملی
        // 3. Cesium برای زمین سه بعدی حرفه‌ای
        // ============================================
        
        // نمونه کد برای شروع:
        /*
        const globeContainer = document.createElement('div');
        globeContainer.className = 'globe-3d-container';
        globeContainer.innerHTML = `
            <div class="globe-modal">
                <div class="modal-header">
                    <h3>🌍 نمای سه بعدی زمین</h3>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="globe-content">
                    <div id="globe3d"></div>
                </div>
            </div>
        `;
        document.body.appendChild(globeContainer);
        
        // اینجا کدهای three.js یا globe.gl را اضافه کنید
        */
        
        // فعلاً پیام ساده نمایش داده می‌شود
        this.showMessage(
            '🌍 نمای سه بعدی', 
            'این قابلیت در نسخه بعدی اضافه خواهد شد. می‌توانید از کتابخانه Three.js یا Globe.gl استفاده کنید.'
        );
    }

    showMessage(title, message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'premium-feature-message';
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-icon">🚀</div>
                <h3>${title}</h3>
                <p>${message}</p>
                <button class="message-close-btn">متوجه شدم</button>
            </div>
        `;
        
        document.body.appendChild(messageDiv);
        
        const closeBtn = messageDiv.querySelector('.message-close-btn');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(messageDiv);
        });
        
        // بستن خودکار بعد از 5 ثانیه
        setTimeout(() => {
            if (document.body.contains(messageDiv)) {
                document.body.removeChild(messageDiv);
            }
        }, 5000);
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--accent-red);
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            z-index: 10000;
            max-width: 300px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 4000);
    }

    buildCompleteData() {
        const baseData2024 = this.generateBaseData2024();
        this.ensureCountryCoverage(baseData2024);
        // اضافه کردن جمعیت به کشورها
        this.addPopulationToCountries(baseData2024);

        const dataset = { "2024": baseData2024 };
        ['2023', '2022', '2021', '2020'].forEach((year, index) => {
            dataset[year] = this.generateYearData(baseData2024, index + 1);
        });
        return dataset;
    }

    generateYearData(baseData, yearOffset) {
        const result = {};
        Object.keys(baseData).forEach(code => {
            const country = { ...baseData[code] };
            country.reserves = Math.max(0, Math.round(country.reserves * (1 - yearOffset * 0.02)));
            country.production = Math.max(0, Math.round(country.production * (1 - yearOffset * 0.03)));
            country.gdp = Math.max(0, Math.round(country.gdp * (1 - yearOffset * 0.04)));
            country.oil = Math.max(0, Math.round(country.oil * (1 - yearOffset * 0.01)));
            country.gas = Math.max(0, Math.round(country.gas * (1 - yearOffset * 0.01)));
            // جمعیت با نرخ رشد سالانه 1.2% کاهش می‌یابد (برای سال‌های گذشته)
            if (country.population) {
                country.population = Math.max(0, Math.round(country.population * (1 - yearOffset * 0.012)));
            }
            result[code] = country;
        });
        return result;
    }

    generateBaseData2024() {
        return {
            // کشورهای اصلی با داده‌های کامل
                "USA": { name: "ایالات متحده آمریکا", code: "USA", reserves: 8133, production: 200, gdp: 25400000, economicRank: 1, oil: 12800, gas: 934000 },
                "CHN": { name: "چین", code: "CHN", reserves: 1948, production: 350, gdp: 17900000, economicRank: 2, oil: 4800, gas: 207000 },
                "JPN": { name: "ژاپن", code: "JPN", reserves: 846, production: 8, gdp: 4910000, economicRank: 3, oil: 120, gas: 3200 },
            "DEU": { name: "آلمان", code: "DEU", reserves: 3366, production: 5, gdp: 4080000, economicRank: 4, oil: 220, gas: 68000 },
            "IND": { name: "هند", code: "IND", reserves: 754, production: 90, gdp: 3740000, economicRank: 5, oil: 800, gas: 32000 },
                "GBR": { name: "انگلستان", code: "GBR", reserves: 310, production: 1, gdp: 3130000, economicRank: 6, oil: 950, gas: 42000 },
                "FRA": { name: "فرانسه", code: "FRA", reserves: 2436, production: 2, gdp: 2930000, economicRank: 7, oil: 160, gas: 1800 },
                "ITA": { name: "ایتالیا", code: "ITA", reserves: 2451, production: 0, gdp: 2010000, economicRank: 8, oil: 90, gas: 3200 },
            "CAN": { name: "کانادا", code: "CAN", reserves: 180, production: 180, gdp: 2140000, economicRank: 9, oil: 5200, gas: 178000 },
            "RUS": { name: "روسیه", code: "RUS", reserves: 2299, production: 300, gdp: 1860000, economicRank: 11, oil: 10700, gas: 701000 },
                "BRA": { name: "برزیل", code: "BRA", reserves: 129, production: 60, gdp: 1920000, economicRank: 12, oil: 2700, gas: 24300 },
            "AUS": { name: "استرالیا", code: "AUS", reserves: 79, production: 320, gdp: 1540000, economicRank: 13, oil: 280, gas: 142000 },
                "KOR": { name: "کره جنوبی", code: "KOR", reserves: 104, production: 0, gdp: 1730000, economicRank: 14, oil: 0, gas: 0 },
                "ESP": { name: "اسپانیا", code: "ESP", reserves: 281, production: 0, gdp: 1420000, economicRank: 15, oil: 20, gas: 50 },
                "MEX": { name: "مکزیک", code: "MEX", reserves: 120, production: 110, gdp: 1290000, economicRank: 16, oil: 1900, gas: 37000 },
                "IDN": { name: "اندونزی", code: "IDN", reserves: 78, production: 130, gdp: 1280000, economicRank: 17, oil: 740, gas: 89000 },
            "SAU": { name: "عربستان سعودی", code: "SAU", reserves: 323, production: 250, gdp: 1100000, economicRank: 18, oil: 11500, gas: 112000 },
                "NLD": { name: "هلند", code: "NLD", reserves: 612, production: 0, gdp: 1010000, economicRank: 19, oil: 180, gas: 45000 },
                "TUR": { name: "ترکیه", code: "TUR", reserves: 478, production: 120, gdp: 906000, economicRank: 20, oil: 65, gas: 450 },
                "CHE": { name: "سوئیس", code: "CHE", reserves: 1040, production: 0, gdp: 840000, economicRank: 21, oil: 0, gas: 0 },
                "POL": { name: "لهستان", code: "POL", reserves: 228, production: 0, gdp: 679000, economicRank: 22, oil: 20, gas: 4000 },
                "SWE": { name: "سوئد", code: "SWE", reserves: 126, production: 0, gdp: 591000, economicRank: 23, oil: 0, gas: 0 },
                "BEL": { name: "بلژیک", code: "BEL", reserves: 227, production: 0, gdp: 578000, economicRank: 24, oil: 0, gas: 0 },
            "IRN": { name: "ایران", code: "IRN", reserves: 425, production: 85, gdp: 1620000, economicRank: 25, oil: 3100, gas: 258000 },
                "THA": { name: "تایلند", code: "THA", reserves: 154, production: 0, gdp: 546000, economicRank: 26, oil: 220, gas: 38000 },
                "NGA": { name: "نیجریه", code: "NGA", reserves: 21, production: 85, gdp: 514000, economicRank: 27, oil: 1680, gas: 49000 },
                "ARG": { name: "آرژانتین", code: "ARG", reserves: 61, production: 60, gdp: 487000, economicRank: 28, oil: 510, gas: 40000 },
                "NOR": { name: "نروژ", code: "NOR", reserves: 37, production: 0, gdp: 482000, economicRank: 29, oil: 1750, gas: 112000 },
                "ISR": { name: "اسرائیل", code: "ISR", reserves: 0, production: 0, gdp: 522000, economicRank: 30, oil: 0, gas: 0 },
            "ARE": { name: "امارات", code: "ARE", reserves: 215, production: 45, gdp: 501000, economicRank: 31, oil: 3800, gas: 62000 },
                "ZAF": { name: "آفریقای جنوبی", code: "ZAF", reserves: 125, production: 110, gdp: 406000, economicRank: 32, oil: 0, gas: 0 },
                "HKG": { name: "هنگ کنگ", code: "HKG", reserves: 2, production: 0, gdp: 383000, economicRank: 33, oil: 0, gas: 0 },
                "SGP": { name: "سنگاپور", code: "SGP", reserves: 0, production: 0, gdp: 424000, economicRank: 34, oil: 0, gas: 0 },
                "MYS": { name: "مالزی", code: "MYS", reserves: 38, production: 25, gdp: 407000, economicRank: 35, oil: 560, gas: 74000 },
                "PHL": { name: "فیلیپین", code: "PHL", reserves: 197, production: 40, gdp: 435000, economicRank: 36, oil: 20, gas: 3200 },
                "COL": { name: "کلمبیا", code: "COL", reserves: 25, production: 45, gdp: 363000, economicRank: 37, oil: 780, gas: 11000 },
                "PAK": { name: "پاکستان", code: "PAK", reserves: 64, production: 2, gdp: 376000, economicRank: 38, oil: 85, gas: 38000 },
                "CHL": { name: "شیلی", code: "CHL", reserves: 0, production: 40, gdp: 317000, economicRank: 39, oil: 10, gas: 1000 },
                "BGD": { name: "بنگلادش", code: "BGD", reserves: 14, production: 0, gdp: 460000, economicRank: 40, oil: 4, gas: 28000 },
                "EGY": { name: "مصر", code: "EGY", reserves: 80, production: 15, gdp: 477000, economicRank: 41, oil: 560, gas: 65000 },
                "FIN": { name: "فنلاند", code: "FIN", reserves: 49, production: 0, gdp: 297000, economicRank: 42, oil: 0, gas: 0 },
                "VNM": { name: "ویتنام", code: "VNM", reserves: 10, production: 5, gdp: 408000, economicRank: 43, oil: 260, gas: 9800 },
            "CZE": { name: "چک", code: "CZE", reserves: 0, production: 0, gdp: 330000, economicRank: 44, oil: 0, gas: 0 },
                "ROU": { name: "رومانی", code: "ROU", reserves: 103, production: 0, gdp: 304000, economicRank: 45, oil: 70, gas: 10000 },
                "PRT": { name: "پرتغال", code: "PRT", reserves: 382, production: 0, gdp: 251000, economicRank: 46, oil: 0, gas: 0 },
                "PER": { name: "پرو", code: "PER", reserves: 34, production: 130, gdp: 264000, economicRank: 47, oil: 40, gas: 12000 },
                "NZL": { name: "نیوزیلند", code: "NZL", reserves: 0, production: 0, gdp: 247000, economicRank: 48, oil: 20, gas: 4200 },
                "GRC": { name: "یونان", code: "GRC", reserves: 3, production: 0, gdp: 239000, economicRank: 49, oil: 0, gas: 0 },
                "IRQ": { name: "عراق", code: "IRQ", reserves: 96, production: 12, gdp: 267000, economicRank: 50, oil: 4500, gas: 9000 },
                "DZA": { name: "الجزایر", code: "DZA", reserves: 173, production: 1, gdp: 224000, economicRank: 51, oil: 1350, gas: 93000 },
                "QAT": { name: "قطر", code: "QAT", reserves: 45, production: 0, gdp: 235000, economicRank: 52, oil: 1850, gas: 177000 },
                "KAZ": { name: "قزاقستان", code: "KAZ", reserves: 335, production: 110, gdp: 246000, economicRank: 53, oil: 1800, gas: 28000 },
                "HUN": { name: "مجارستان", code: "HUN", reserves: 0, production: 0, gdp: 203000, economicRank: 54, oil: 0, gas: 2000 },
                "UKR": { name: "اوکراین", code: "UKR", reserves: 26, production: 3, gdp: 160000, economicRank: 55, oil: 30, gas: 19000 },
                "KWT": { name: "کویت", code: "KWT", reserves: 79, production: 0, gdp: 184000, economicRank: 56, oil: 2650, gas: 18000 },
                "MAR": { name: "مراکش", code: "MAR", reserves: 22, production: 0, gdp: 147000, economicRank: 57, oil: 0, gas: 0 },
                "AGO": { name: "آنگولا", code: "AGO", reserves: 30, production: 40, gdp: 124000, economicRank: 58, oil: 1200, gas: 11000 },
                "ECU": { name: "اکوادور", code: "ECU", reserves: 11, production: 25, gdp: 121000, economicRank: 59, oil: 480, gas: 500 },
            "SVK": { name: "اسلواکی", code: "SVK", reserves: 0, production: 0, gdp: 127000, economicRank: 60, oil: 0, gas: 0 },
            "AZE": { name: "آذربایجان", code: "AZE", reserves: 30, production: 1, gdp: 69000, economicRank: 61, oil: 750, gas: 35000 },
            "TKM": { name: "ترکمنستان", code: "TKM", reserves: 24, production: 1, gdp: 68000, economicRank: 62, oil: 220, gas: 77000 },
            "UZB": { name: "ازبکستان", code: "UZB", reserves: 340, production: 100, gdp: 80000, economicRank: 63, oil: 40, gas: 58000 },
            "OMN": { name: "عمان", code: "OMN", reserves: 0, production: 0, gdp: 108000, economicRank: 64, oil: 980, gas: 41000 },
            "GHA": { name: "غنا", code: "GHA", reserves: 9, production: 100, gdp: 73000, economicRank: 65, oil: 200, gas: 1500 },
            "LBY": { name: "لیبی", code: "LBY", reserves: 116, production: 1, gdp: 50000, economicRank: 66, oil: 1200, gas: 12000 },
            "VEN": { name: "ونزوئلا", code: "VEN", reserves: 161, production: 20, gdp: 95000, economicRank: 67, oil: 3000, gas: 38000 },
            "SDN": { name: "سودان", code: "SDN", reserves: 41, production: 1, gdp: 45000, economicRank: 68, oil: 75, gas: 5000 },
            "TZA": { name: "تانزانیا", code: "TZA", reserves: 0, production: 50, gdp: 64000, economicRank: 69, oil: 0, gas: 6400 },
            "MMR": { name: "میانمار", code: "MMR", reserves: 7, production: 5, gdp: 58000, economicRank: 70, oil: 14, gas: 18000 },
            // کشورهای بیشتر
            "IRL": { name: "ایرلند", code: "IRL", reserves: 6, production: 0, gdp: 516000, economicRank: 71, oil: 0, gas: 3000 },
            "AUT": { name: "اتریش", code: "AUT", reserves: 280, production: 0, gdp: 477000, economicRank: 72, oil: 15, gas: 1200 },
            "DNK": { name: "دانمارک", code: "DNK", reserves: 66, production: 0, gdp: 395000, economicRank: 73, oil: 65, gas: 1800 },
            "TWN": { name: "تایوان", code: "TWN", reserves: 423, production: 0, gdp: 785000, economicRank: 74, oil: 0, gas: 0 },
            "CUB": { name: "کوبا", code: "CUB", reserves: 0, production: 0, gdp: 107000, economicRank: 75, oil: 45, gas: 1000 },
            "BLR": { name: "بلاروس", code: "BLR", reserves: 0, production: 0, gdp: 73000, economicRank: 76, oil: 30, gas: 200 },
            "LKA": { name: "سریلانکا", code: "LKA", reserves: 0, production: 0, gdp: 74000, economicRank: 77, oil: 0, gas: 0 },
            "LUX": { name: "لوکزامبورگ", code: "LUX", reserves: 0, production: 0, gdp: 87000, economicRank: 78, oil: 0, gas: 0 },
            "DOM": { name: "دومینیکن", code: "DOM", reserves: 0, production: 0, gdp: 95000, economicRank: 79, oil: 0, gas: 0 },
            "KEN": { name: "کنیا", code: "KEN", reserves: 0, production: 0, gdp: 110000, economicRank: 80, oil: 0, gas: 0 },
            "GTM": { name: "گواتمالا", code: "GTM", reserves: 0, production: 0, gdp: 92000, economicRank: 81, oil: 8, gas: 0 },
            "URY": { name: "اروگوئه", code: "URY", reserves: 0, production: 0, gdp: 71000, economicRank: 82, oil: 0, gas: 0 },
            "HRV": { name: "کرواسی", code: "HRV", reserves: 0, production: 0, gdp: 68000, economicRank: 83, oil: 12, gas: 1000 },
            "BGR": { name: "بلغارستان", code: "BGR", reserves: 40, production: 0, gdp: 84000, economicRank: 84, oil: 1, gas: 100 },
            "ETH": { name: "اتیوپی", code: "ETH", reserves: 0, production: 5, gdp: 126000, economicRank: 85, oil: 0, gas: 0 },
            "LBN": { name: "لبنان", code: "LBN", reserves: 286, production: 0, gdp: 22000, economicRank: 86, oil: 0, gas: 0 },
            "SRB": { name: "صربستان", code: "SRB", reserves: 18, production: 0, gdp: 63000, economicRank: 87, oil: 15, gas: 400 },
            "JOR": { name: "اردن", code: "JOR", reserves: 0, production: 0, gdp: 46000, economicRank: 88, oil: 0, gas: 200 },
            "TUN": { name: "تونس", code: "TUN", reserves: 7, production: 0, gdp: 46000, economicRank: 89, oil: 40, gas: 2000 },
            "BOL": { name: "بولیوی", code: "BOL", reserves: 0, production: 0, gdp: 44000, economicRank: 90, oil: 18, gas: 15000 },
            "PRY": { name: "پاراگوئه", code: "PRY", reserves: 0, production: 0, gdp: 42000, economicRank: 91, oil: 0, gas: 0 },
            "CMR": { name: "کامرون", code: "CMR", reserves: 0, production: 0, gdp: 44000, economicRank: 92, oil: 75, gas: 2500 },
            "CIV": { name: "ساحل عاج", code: "CIV", reserves: 0, production: 0, gdp: 70000, economicRank: 93, oil: 30, gas: 2800 },
            "PAN": { name: "پاناما", code: "PAN", reserves: 0, production: 0, gdp: 66000, economicRank: 94, oil: 0, gas: 0 },
            "CRI": { name: "کاستاریکا", code: "CRI", reserves: 0, production: 0, gdp: 64000, economicRank: 95, oil: 0, gas: 0 },
            "SVN": { name: "اسلوونی", code: "SVN", reserves: 3, production: 0, gdp: 62000, economicRank: 96, oil: 0, gas: 0 },
            "LTU": { name: "لیتوانی", code: "LTU", reserves: 6, production: 0, gdp: 66000, economicRank: 97, oil: 2, gas: 0 },
            "LVA": { name: "لتونی", code: "LVA", reserves: 0, production: 0, gdp: 40000, economicRank: 98, oil: 0, gas: 0 },
            "EST": { name: "استونی", code: "EST", reserves: 0, production: 0, gdp: 38000, economicRank: 99, oil: 0, gas: 0 },
            "BHR": { name: "بحرین", code: "BHR", reserves: 0, production: 0, gdp: 44000, economicRank: 100, oil: 190, gas: 18000 },
            "CYP": { name: "قبرس", code: "CYP", reserves: 0, production: 0, gdp: 28000, economicRank: 101, oil: 0, gas: 0 },
            "AFG": { name: "افغانستان", code: "AFG", reserves: 0, production: 0, gdp: 14000, economicRank: 102, oil: 0, gas: 200 },
            "NPL": { name: "نپال", code: "NPL", reserves: 0, production: 0, gdp: 36000, economicRank: 103, oil: 0, gas: 0 },
            "KHM": { name: "کامبوج", code: "KHM", reserves: 0, production: 0, gdp: 29000, economicRank: 104, oil: 0, gas: 0 },
            "YEM": { name: "یمن", code: "YEM", reserves: 0, production: 0, gdp: 21000, economicRank: 105, oil: 50, gas: 500 },
            "SYR": { name: "سوریه", code: "SYR", reserves: 26, production: 0, gdp: 12000, economicRank: 106, oil: 20, gas: 3000 },
            "ZWE": { name: "زیمبابوه", code: "ZWE", reserves: 0, production: 15, gdp: 28000, economicRank: 107, oil: 0, gas: 0 },
            "ZMB": { name: "زامبیا", code: "ZMB", reserves: 0, production: 5, gdp: 29000, economicRank: 108, oil: 0, gas: 0 },
            "UGA": { name: "اوگاندا", code: "UGA", reserves: 0, production: 0, gdp: 45000, economicRank: 109, oil: 0, gas: 0 },
            "SEN": { name: "سنگال", code: "SEN", reserves: 0, production: 0, gdp: 28000, economicRank: 110, oil: 0, gas: 0 },
            "COD": { name: "کنگو دموکراتیک", code: "COD", reserves: 0, production: 25, gdp: 64000, economicRank: 111, oil: 20, gas: 0 },
            "COG": { name: "کنگو", code: "COG", reserves: 0, production: 0, gdp: 15000, economicRank: 112, oil: 300, gas: 2000 },
            "MLI": { name: "مالی", code: "MLI", reserves: 0, production: 70, gdp: 19000, economicRank: 113, oil: 0, gas: 0 },
            "BFA": { name: "بورکینافاسو", code: "BFA", reserves: 0, production: 60, gdp: 18000, economicRank: 114, oil: 0, gas: 0 },
            "MDG": { name: "ماداگاسکار", code: "MDG", reserves: 0, production: 0, gdp: 14000, economicRank: 115, oil: 0, gas: 0 },
            "MOZ": { name: "موزامبیک", code: "MOZ", reserves: 0, production: 0, gdp: 18000, economicRank: 116, oil: 0, gas: 5200 },
            "PNG": { name: "پاپوآ گینه نو", code: "PNG", reserves: 0, production: 60, gdp: 30000, economicRank: 117, oil: 40, gas: 13000 },
            "MNG": { name: "مغولستان", code: "MNG", reserves: 3, production: 20, gdp: 15000, economicRank: 118, oil: 25, gas: 0 },
            "BWA": { name: "بوتسوانا", code: "BWA", reserves: 0, production: 0, gdp: 19000, economicRank: 119, oil: 0, gas: 0 },
            "NAM": { name: "نامیبیا", code: "NAM", reserves: 0, production: 0, gdp: 13000, economicRank: 120, oil: 0, gas: 0 },
            "GAB": { name: "گابن", code: "GAB", reserves: 0, production: 0, gdp: 19000, economicRank: 121, oil: 200, gas: 400 },
            "JAM": { name: "جامائیکا", code: "JAM", reserves: 0, production: 0, gdp: 16000, economicRank: 122, oil: 0, gas: 0 },
            "TTO": { name: "ترینیداد", code: "TTO", reserves: 0, production: 0, gdp: 24000, economicRank: 123, oil: 60, gas: 32000 },
            "ISL": { name: "ایسلند", code: "ISL", reserves: 0, production: 0, gdp: 25000, economicRank: 124, oil: 0, gas: 0 },
            "GEO": { name: "گرجستان", code: "GEO", reserves: 0, production: 0, gdp: 19000, economicRank: 125, oil: 0, gas: 0 },
            "ARM": { name: "ارمنستان", code: "ARM", reserves: 0, production: 0, gdp: 14000, economicRank: 126, oil: 0, gas: 0 },
            "ALB": { name: "آلبانی", code: "ALB", reserves: 3, production: 0, gdp: 18000, economicRank: 127, oil: 14, gas: 50 },
            "MKD": { name: "مقدونیه", code: "MKD", reserves: 7, production: 0, gdp: 14000, economicRank: 128, oil: 0, gas: 0 },
            "BIH": { name: "بوسنی", code: "BIH", reserves: 0, production: 0, gdp: 24000, economicRank: 129, oil: 0, gas: 0 },
            "MDA": { name: "مولداوی", code: "MDA", reserves: 0, production: 0, gdp: 14000, economicRank: 130, oil: 0, gas: 0 },
            "MNE": { name: "مونته‌نگرو", code: "MNE", reserves: 0, production: 0, gdp: 6000, economicRank: 131, oil: 0, gas: 0 },
            "KGZ": { name: "قرقیزستان", code: "KGZ", reserves: 3, production: 25, gdp: 10000, economicRank: 132, oil: 4, gas: 30 },
            "TJK": { name: "تاجیکستان", code: "TJK", reserves: 0, production: 4, gdp: 11000, economicRank: 133, oil: 0, gas: 20 },
            "LAO": { name: "لائوس", code: "LAO", reserves: 0, production: 30, gdp: 19000, economicRank: 134, oil: 0, gas: 0 },
            "BRN": { name: "برونئی", code: "BRN", reserves: 0, production: 0, gdp: 14000, economicRank: 135, oil: 100, gas: 11000 },
            "BHS": { name: "باهاما", code: "BHS", reserves: 0, production: 0, gdp: 12000, economicRank: 136, oil: 0, gas: 0 },
            "HTI": { name: "هائیتی", code: "HTI", reserves: 0, production: 0, gdp: 8000, economicRank: 137, oil: 0, gas: 0 },
            "HND": { name: "هندوراس", code: "HND", reserves: 0, production: 0, gdp: 31000, economicRank: 138, oil: 0, gas: 0 },
            "SLV": { name: "السالوادور", code: "SLV", reserves: 0, production: 0, gdp: 32000, economicRank: 139, oil: 0, gas: 0 },
            "NIC": { name: "نیکاراگوئه", code: "NIC", reserves: 0, production: 0, gdp: 15000, economicRank: 140, oil: 0, gas: 0 },
            "TCD": { name: "چاد", code: "TCD", reserves: 0, production: 0, gdp: 12000, economicRank: 141, oil: 120, gas: 0 },
            "NER": { name: "نیجر", code: "NER", reserves: 0, production: 0, gdp: 14000, economicRank: 142, oil: 20, gas: 0 },
            "MRT": { name: "موریتانی", code: "MRT", reserves: 0, production: 0, gdp: 10000, economicRank: 143, oil: 5, gas: 0 },
            "BEN": { name: "بنین", code: "BEN", reserves: 0, production: 0, gdp: 18000, economicRank: 144, oil: 0, gas: 0 },
            "TGO": { name: "توگو", code: "TGO", reserves: 0, production: 0, gdp: 8000, economicRank: 145, oil: 0, gas: 0 },
            "SLE": { name: "سیرالئون", code: "SLE", reserves: 0, production: 0, gdp: 4000, economicRank: 146, oil: 0, gas: 0 },
            "LBR": { name: "لیبریا", code: "LBR", reserves: 0, production: 0, gdp: 4000, economicRank: 147, oil: 0, gas: 0 },
            "CAF": { name: "آفریقای مرکزی", code: "CAF", reserves: 0, production: 0, gdp: 2000, economicRank: 148, oil: 0, gas: 0 },
            "ERI": { name: "اریتره", code: "ERI", reserves: 0, production: 0, gdp: 2000, economicRank: 149, oil: 0, gas: 0 },
            "SOM": { name: "سومالی", code: "SOM", reserves: 0, production: 0, gdp: 8000, economicRank: 150, oil: 0, gas: 0 },
            "SSD": { name: "سودان جنوبی", code: "SSD", reserves: 0, production: 0, gdp: 4000, economicRank: 151, oil: 150, gas: 0 },
            "MWI": { name: "مالاوی", code: "MWI", reserves: 0, production: 0, gdp: 12000, economicRank: 152, oil: 0, gas: 0 },
            "RWA": { name: "رواندا", code: "RWA", reserves: 0, production: 0, gdp: 13000, economicRank: 153, oil: 0, gas: 0 },
            "BDI": { name: "بوروندی", code: "BDI", reserves: 0, production: 0, gdp: 3000, economicRank: 154, oil: 0, gas: 0 },
            "LSO": { name: "لسوتو", code: "LSO", reserves: 0, production: 0, gdp: 2000, economicRank: 155, oil: 0, gas: 0 },
            "GIN": { name: "گینه", code: "GIN", reserves: 0, production: 20, gdp: 16000, economicRank: 156, oil: 0, gas: 0 },
            "GNB": { name: "گینه بیسائو", code: "GNB", reserves: 0, production: 0, gdp: 1500, economicRank: 157, oil: 0, gas: 0 },
            "GNQ": { name: "گینه استوایی", code: "GNQ", reserves: 0, production: 0, gdp: 12000, economicRank: 158, oil: 100, gas: 6000 },
            "DJI": { name: "جیبوتی", code: "DJI", reserves: 0, production: 0, gdp: 3500, economicRank: 159, oil: 0, gas: 0 },
            "SWZ": { name: "اسواتینی", code: "SWZ", reserves: 0, production: 0, gdp: 5000, economicRank: 160, oil: 0, gas: 0 },
            "FJI": { name: "فیجی", code: "FJI", reserves: 0, production: 0, gdp: 5000, economicRank: 161, oil: 0, gas: 0 },
            "SLB": { name: "جزایر سلیمان", code: "SLB", reserves: 0, production: 0, gdp: 1500, economicRank: 162, oil: 0, gas: 0 },
            "TLS": { name: "تیمور شرقی", code: "TLS", reserves: 0, production: 0, gdp: 3000, economicRank: 163, oil: 15, gas: 6000 },
            "BTN": { name: "بوتان", code: "BTN", reserves: 0, production: 0, gdp: 2500, economicRank: 164, oil: 0, gas: 0 },
            "MLT": { name: "مالت", code: "MLT", reserves: 0, production: 0, gdp: 18000, economicRank: 165, oil: 0, gas: 0 },
            "PRK": { name: "کره شمالی", code: "PRK", reserves: 0, production: 0, gdp: 18000, economicRank: 166, oil: 0, gas: 0 },
            "GRL": { name: "گرینلند", code: "GRL", reserves: 0, production: 0, gdp: 3000, economicRank: 167, oil: 0, gas: 0 },
            "SUR": { name: "سورینام", code: "SUR", reserves: 0, production: 0, gdp: 4000, economicRank: 168, oil: 15, gas: 0 },
            "GUY": { name: "گویان", code: "GUY", reserves: 0, production: 0, gdp: 14000, economicRank: 169, oil: 340, gas: 0 },
            "BLZ": { name: "بلیز", code: "BLZ", reserves: 0, production: 0, gdp: 2000, economicRank: 170, oil: 1, gas: 0 },
            // کشورهای بیشتر - تکمیل لیست
            "MUS": { name: "موریس", code: "MUS", reserves: 0, production: 0, gdp: 12000, economicRank: 171, oil: 0, gas: 0 },
            "VUT": { name: "وانواتو", code: "VUT", reserves: 0, production: 0, gdp: 900, economicRank: 172, oil: 0, gas: 0 },
            "WSM": { name: "ساموآ", code: "WSM", reserves: 0, production: 0, gdp: 800, economicRank: 173, oil: 0, gas: 0 },
            "COM": { name: "کومور", code: "COM", reserves: 0, production: 0, gdp: 1200, economicRank: 174, oil: 0, gas: 0 },
            "CPV": { name: "کیپ ورد", code: "CPV", reserves: 0, production: 0, gdp: 2000, economicRank: 175, oil: 0, gas: 0 },
            "SYC": { name: "سیشل", code: "SYC", reserves: 0, production: 0, gdp: 1800, economicRank: 176, oil: 0, gas: 0 },
            "MDV": { name: "مالدیو", code: "MDV", reserves: 0, production: 0, gdp: 5000, economicRank: 177, oil: 0, gas: 0 },
            "AND": { name: "آندورا", code: "AND", reserves: 0, production: 0, gdp: 3200, economicRank: 178, oil: 0, gas: 0 },
            "MCO": { name: "موناکو", code: "MCO", reserves: 0, production: 0, gdp: 7000, economicRank: 179, oil: 0, gas: 0 },
            "LIE": { name: "لیختن‌اشتاین", code: "LIE", reserves: 0, production: 0, gdp: 6500, economicRank: 180, oil: 0, gas: 0 },
            "SMR": { name: "سان مارینو", code: "SMR", reserves: 0, production: 0, gdp: 1700, economicRank: 181, oil: 0, gas: 0 },
            "XKX": { name: "کوزوو", code: "XKX", reserves: 0, production: 0, gdp: 9000, economicRank: 182, oil: 0, gas: 0 },
            "ESH": { name: "صحرای غربی", code: "ESH", reserves: 0, production: 0, gdp: 900, economicRank: 183, oil: 0, gas: 0 },
            "FLK": { name: "جزایر فالکلند", code: "FLK", reserves: 0, production: 0, gdp: 200, economicRank: 184, oil: 0, gas: 0 },
            "GUF": { name: "گویان فرانسه", code: "GUF", reserves: 0, production: 0, gdp: 4500, economicRank: 185, oil: 0, gas: 0 },
            "NCL": { name: "کالدونیای جدید", code: "NCL", reserves: 0, production: 0, gdp: 11000, economicRank: 186, oil: 0, gas: 0 },
            "PYF": { name: "پلی‌نزی فرانسه", code: "PYF", reserves: 0, production: 0, gdp: 6000, economicRank: 187, oil: 0, gas: 0 },
            "GUM": { name: "گوام", code: "GUM", reserves: 0, production: 0, gdp: 6000, economicRank: 188, oil: 0, gas: 0 },
            "PRI": { name: "پورتوریکو", code: "PRI", reserves: 0, production: 0, gdp: 105000, economicRank: 189, oil: 0, gas: 0 },
            "ATG": { name: "آنتیگوا و باربودا", code: "ATG", reserves: 0, production: 0, gdp: 1800, economicRank: 190, oil: 0, gas: 0 },
            "BRB": { name: "باربادوس", code: "BRB", reserves: 0, production: 0, gdp: 5200, economicRank: 191, oil: 0, gas: 0 },
            "DMA": { name: "دومینیکا", code: "DMA", reserves: 0, production: 0, gdp: 600, economicRank: 192, oil: 0, gas: 0 },
            "GRD": { name: "گرنادا", code: "GRD", reserves: 0, production: 0, gdp: 1200, economicRank: 193, oil: 0, gas: 0 },
            "KNA": { name: "سنت کیتس و نویس", code: "KNA", reserves: 0, production: 0, gdp: 1000, economicRank: 194, oil: 0, gas: 0 },
            "LCA": { name: "سنت لوسیا", code: "LCA", reserves: 0, production: 0, gdp: 2000, economicRank: 195, oil: 0, gas: 0 },
            "VCT": { name: "سنت وینسنت", code: "VCT", reserves: 0, production: 0, gdp: 900, economicRank: 196, oil: 0, gas: 0 },
            "TON": { name: "تونگا", code: "TON", reserves: 0, production: 0, gdp: 500, economicRank: 197, oil: 0, gas: 0 },
            "KIR": { name: "کیریباتی", code: "KIR", reserves: 0, production: 0, gdp: 200, economicRank: 198, oil: 0, gas: 0 },
            "MHL": { name: "جزایر مارشال", code: "MHL", reserves: 0, production: 0, gdp: 250, economicRank: 199, oil: 0, gas: 0 },
            "FSM": { name: "میکرونزی", code: "FSM", reserves: 0, production: 0, gdp: 400, economicRank: 200, oil: 0, gas: 0 },
            "NRU": { name: "نائورو", code: "NRU", reserves: 0, production: 0, gdp: 130, economicRank: 201, oil: 0, gas: 0 },
            "PLW": { name: "پالائو", code: "PLW", reserves: 0, production: 0, gdp: 280, economicRank: 202, oil: 0, gas: 0 },
            "TUV": { name: "تووالو", code: "TUV", reserves: 0, production: 0, gdp: 50, economicRank: 203, oil: 0, gas: 0 },
            "VAT": { name: "واتیکان", code: "VAT", reserves: 0, production: 0, gdp: 0, economicRank: 204, oil: 0, gas: 0 },
            "GMB": { name: "گامبیا", code: "GMB", reserves: 0, production: 0, gdp: 2000, economicRank: 205, oil: 0, gas: 0 },
            "GNQ": { name: "گینه استوایی", code: "GNQ", reserves: 0, production: 0, gdp: 12000, economicRank: 206, oil: 100, gas: 6000 },
            "STP": { name: "سائوتومه", code: "STP", reserves: 0, production: 0, gdp: 500, economicRank: 207, oil: 0, gas: 0 },
            "BDI": { name: "بوروندی", code: "BDI", reserves: 0, production: 0, gdp: 3000, economicRank: 208, oil: 0, gas: 0 },
            "PSE": { name: "فلسطین", code: "PSE", reserves: 0, production: 0, gdp: 18000, economicRank: 209, oil: 0, gas: 0 },
            "MAC": { name: "ماکائو", code: "MAC", reserves: 0, production: 0, gdp: 29000, economicRank: 210, oil: 0, gas: 0 }
        };
    }

    getCompleteData() {
        if (!this.completeData) {
            this.completeData = this.buildCompleteData();
        }
        return this.completeData;
    }

    ensureCountryCoverage(baseData) {
        if (this.countryInfoByCode) {
            Object.entries(this.countryInfoByCode).forEach(([code, info]) => {
                if (!baseData[code]) {
                    baseData[code] = this.createDefaultCountryData(code, info);
                }
            });
        }

        if (this.worldData?.objects?.countries) {
            const features = topojson.feature(this.worldData, this.worldData.objects.countries).features;
            features.forEach(feature => {
                const code = this.getCountryCode(feature.properties?.name);
                if (!code) return;
                if (!this.countryInfoByCode[code]) {
                    this.countryInfoByCode[code] = {
                        nameEn: feature.properties?.name,
                        nameFa: feature.properties?.name
                    };
                }
                if (!baseData[code]) {
                    baseData[code] = this.createDefaultCountryData(code, this.countryInfoByCode[code]);
                }
            });
        }
    }

    createDefaultCountryData(code, info = {}) {
        return {
            name: info.nameFa || info.nameEn || code,
            code,
            reserves: 0,
            production: 0,
            gdp: 0,
            economicRank: 999,
            oil: 0,
            gas: 0,
            population: 0
        };
    }
    
    // تابع برای اضافه کردن جمعیت به کشورها (داده‌های تقریبی)
    addPopulationToCountries(baseData) {
        // داده‌های جمعیت تقریبی برای کشورهای اصلی (به میلیون)
        const populationData = {
            "USA": 339, "CHN": 1400, "JPN": 125, "DEU": 84, "IND": 1400, "GBR": 68, "FRA": 68,
            "ITA": 59, "CAN": 38, "RUS": 144, "BRA": 215, "AUS": 26, "KOR": 52, "ESP": 47,
            "MEX": 128, "IDN": 275, "SAU": 36, "NLD": 17, "TUR": 85, "CHE": 9, "POL": 38,
            "SWE": 10, "BEL": 12, "IRN": 88, "THA": 70, "NGA": 220, "ARG": 46, "NOR": 5,
            "ISR": 9, "ARE": 10, "ZAF": 60, "HKG": 7, "SGP": 6, "MYS": 33, "PHL": 115,
            "COL": 52, "PAK": 240, "CHL": 19, "BGD": 170, "EGY": 110, "FIN": 6, "VNM": 98,
            "CZE": 11, "ROU": 19, "PRT": 10, "PER": 34, "NZL": 5, "GRC": 11, "IRQ": 44,
            "DZA": 45, "QAT": 3, "KAZ": 19, "HUN": 10, "UKR": 44, "KWT": 4, "MAR": 37,
            "AGO": 34, "ECU": 18, "SVK": 5, "AZE": 10, "TKM": 6, "UZB": 35, "OMN": 5,
            "GHA": 32, "LBY": 7, "VEN": 28, "SDN": 48, "TZA": 63, "MMR": 54
        };
        
        // اضافه کردن جمعیت به کشورها
        Object.keys(baseData).forEach(code => {
            if (!baseData[code].population) {
                baseData[code].population = populationData[code] ? populationData[code] * 1000000 : 0;
            }
        });
        
        return baseData;
    }
}

// مقداردهی اولیه
let worldGoldMapGlass;

// تابع برای initialize کردن نقشه (برای استفاده در React)
window.initGoldMap = function() {
    const container = document.getElementById('goldMapGlass');
    if (!container) {
        const log = window.logger || { warn: console.warn };
        log.warn('Container #goldMapGlass هنوز پیدا نشد - بعداً تلاش می‌کنیم');
        return;
    }
    
    // بررسی D3.js - با تاخیر برای اطمینان از بارگذاری کامل
    const checkD3AndInit = () => {
        if (typeof d3 === 'undefined' || typeof d3.select === 'undefined') {
            const log = window.logger || { error: console.error };
            log.error('D3.js بارگذاری نشده است');
            if (window.errorHandler) {
                window.errorHandler.showUserError('کتابخانه D3.js بارگذاری نشده است. لطفاً صفحه را رفرش کنید.', 'خطای بارگذاری');
            }
            return;
        }
        
        // بررسی دوباره container قبل از فراخوانی createMap
        const containerCheck = document.getElementById('goldMapGlass');
        if (!containerCheck) {
            const log = window.logger || { warn: console.warn };
            log.warn('Container #goldMapGlass هنوز پیدا نشد - بعداً تلاش می‌کنیم');
            return;
        }
        
        // اگر قبلاً ساخته شده، فقط createMap را فراخوانی کن
        if (worldGoldMapGlass) {
            try {
                worldGoldMapGlass.createMap();
            } catch (error) {
                const log = window.logger || { error: console.error };
                log.error('خطا در createMap:', error);
                if (window.errorHandler) {
                    window.errorHandler.handleError(error, 'WorldGoldMapGlass.createMap');
                }
            }
        } else {
            // ایجاد instance جدید
            try {
                worldGoldMapGlass = new WorldGoldMapGlass();
                window.worldGoldMapGlass = worldGoldMapGlass; // برای دسترسی از React
            } catch (error) {
                const log = window.logger || { error: console.error };
                log.error('خطا در ایجاد WorldGoldMapGlass:', error);
                if (window.errorHandler) {
                    window.errorHandler.handleError(error, 'WorldGoldMapGlass.constructor');
                }
            }
        }
    };
    
    // اگر D3.js آماده است، بلافاصله اجرا کن، وگرنه کمی صبر کن
    if (typeof d3 !== 'undefined' && typeof d3.select !== 'undefined') {
        checkD3AndInit();
    } else {
        setTimeout(checkD3AndInit, 500);
    }
};

// برای backward compatibility - فقط اگر container وجود داشت
document.addEventListener('DOMContentLoaded', function() {
    // تاخیر برای اطمینان از render شدن React
    setTimeout(() => {
        const container = document.getElementById('goldMapGlass');
        if (container && typeof d3 !== 'undefined') {
            window.initGoldMap();
        }
    }, 2000);
});
