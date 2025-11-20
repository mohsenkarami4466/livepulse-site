// gold-map-glass.js - نسخه کامل با 60 کشور
class WorldGoldMapGlass {
    constructor() {
        this.currentYear = '2024';
        this.currentFilter = 'reserves';
        this.selectedCountries = [];
        this.worldData = null;
        this.isMobile = window.innerWidth <= 768;
        this.isDarkMode = document.documentElement.classList.contains('dark-theme');

        this.init();
    }

    async init() {
        try {
            await this.loadWorldData();
            this.createMap();
            this.bindEvents();
            this.updateAll();
            this.setupMobileOptimizations();
            
            // تشخیص تغییر تم
            this.setupThemeObserver();
        } catch (error) {
            console.error('خطا در بارگذاری نقشه:', error);
            this.showError('خطا در بارگذاری نقشه. لطفاً صفحه را رفرش کنید.');
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
        if (e.target.closest('#goldMapGlass') && e.touches.length > 1) {
            e.preventDefault();
        }
    }

    async loadWorldData() {
        try {
            const response = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
            this.worldData = await response.json();
        } catch (error) {
            console.error('خطا در بارگذاری داده‌های نقشه:', error);
            throw error;
        }
    }

    createMap() {
        const container = document.getElementById('goldMapGlass');
        if (!container) {
            console.error('Container #goldMapGlass not found');
            return;
        }

        const width = container.clientWidth;
        const height = this.isMobile ? 300 : 500;

        // پاکسازی قبلی
        container.innerHTML = '';

        this.svg = d3.select('#goldMapGlass')
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', `0 0 ${width} ${height}`)
            .style('background', 'var(--bg-secondary)')
            .style('border-radius', '12px')
            .style('cursor', 'grab');

        this.projection = d3.geoNaturalEarth1()
            .scale(width / 6.8)
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
            .style('background', 'var(--glass-bg)')
            .style('backdrop-filter', 'blur(10px)')
            .style('border', '1px solid var(--glass-border)')
            .style('border-radius', '8px')
            .style('padding', '8px 12px')
            .style('font-size', '0.8rem')
            .style('pointer-events', 'none')
            .style('opacity', 0)
            .style('z-index', 1000)
            .style('color', 'var(--text-primary)');
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
            .attr('stroke', 'var(--glass-border)')
            .attr('stroke-width', 0.5)
            .style('cursor', 'pointer')
            .style('transition', 'fill 0.3s ease')
            .on('click', (event, d) => this.handleCountryClick(event, d))
            .on('mouseover', (event, d) => this.handleCountryHover(event, d))
            .on('mouseout', (event, d) => this.handleCountryMouseOut(event, d));
    }

    bindEvents() {
        // فیلترها
        document.querySelectorAll('.glass-filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.setActiveFilter(btn);
            });
        });

        // سال‌ها
        document.querySelectorAll('.glass-year-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.setActiveYear(btn);
            });
        });

        // کنترل‌های نقشه
        const resetZoomBtn = document.getElementById('resetZoom');
        const zoomInBtn = document.getElementById('zoomIn');
        const zoomOutBtn = document.getElementById('zoomOut');
        const globe3dBtn = document.getElementById('globe3dBtn');

        if (resetZoomBtn) resetZoomBtn.addEventListener('click', () => this.resetZoom());
        if (zoomInBtn) zoomInBtn.addEventListener('click', () => this.zoomIn());
        if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => this.zoomOut());
        if (globe3dBtn) globe3dBtn.addEventListener('click', () => this.showGlobeModal());

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
        
        const badge = document.getElementById('currentFilterBadge');
        if (badge) {
            badge.textContent = this.getFilterLabel(this.currentFilter);
        }
        
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
    }

    updateMapColors() {
        this.g.selectAll('path.country')
            .attr('fill', d => this.getCountryColor(d));
    }

    updateTopCountries() {
        const currentData = this.getCompleteData()[this.currentYear];
        if (!currentData) return;

        const sorted = Object.values(currentData)
            .sort((a, b) => {
                const valA = a[this.currentFilter];
                const valB = b[this.currentFilter];
                
                if (this.currentFilter.includes('Rank')) {
                    return valA - valB;
                }
                return valB - valA;
            })
            .slice(0, 20); // نمایش 20 کشور برتر

        const html = sorted.map((country, index) => {
            const value = this.formatValue(country[this.currentFilter], this.currentFilter);
            let medalClass = 'other';
            let medalText = (index + 1).toString();
            
            if (index === 0) { medalClass = 'gold'; medalText = '🥇'; }
            else if (index === 1) { medalClass = 'silver'; medalText = '🥈'; }
            else if (index === 2) { medalClass = 'bronze'; medalText = '🥉'; }

            return `
                <div class="country-rank-item" onclick="worldGoldMapGlass.selectCountryFromList('${country.code}')">
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
    }

    updateCountryComparison() {
        const container = document.getElementById('countryComparison');
        if (!container) return;

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

        const cardsHtml = this.selectedCountries.map(country => `
            <div class="country-comparison-card">
                <div class="comparison-card-header">
                    <h4>${country.name}</h4>
                    <button class="remove-btn" onclick="worldGoldMapGlass.removeCountry('${country.code}')">
                        ✕
                    </button>
                </div>
                <div class="comparison-stats">
                    <div class="stat-row">
                        <span>💰 ذخایر طلا:</span>
                        <strong>${country.data.reserves} تن</strong>
                    </div>
                    <div class="stat-row">
                        <span>⛏️ برداشت طلا:</span>
                        <strong>${country.data.production} تن</strong>
                    </div>
                    <div class="stat-row">
                        <span>📈 تولید ناخالص:</span>
                        <strong>${this.formatValue(country.data.gdp, 'gdp')}</strong>
                    </div>
                    <div class="stat-row">
                        <span>🏆 رتبه اقتصادی:</span>
                        <strong>${country.data.economicRank}</strong>
                    </div>
                </div>
            </div>
        `).join('');

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
        if (!data || !data[this.currentFilter]) return 'var(--bg-tertiary)';

        const value = data[this.currentFilter];
        const scales = {
            reserves: d3.scaleSequential(d3.interpolateYlOrBr).domain([0, 10000]),
            production: d3.scaleSequential(d3.interpolateGreens).domain([0, 400]),
            gdp: d3.scaleSequential(d3.interpolateBlues).domain([0, 30000000]),
            economicRank: d3.scaleSequential(d3.interpolateReds).domain([1, 60]),
            oil: d3.scaleSequential(d3.interpolateOranges).domain([0, 15000]),
            gas: d3.scaleSequential(d3.interpolatePurples).domain([0, 1000000])
        };

        return scales[this.currentFilter] ? scales[this.currentFilter](value) : 'var(--bg-tertiary)';
    }

    getCountryData(country) {
        const countryMap = {
            'United States of America': 'USA',
            'United States': 'USA',
            'China': 'CHN',
            'Russian Federation': 'RUS',
            'Iran (Islamic Republic of)': 'IRN',
            'Iran': 'IRN',
            'Saudi Arabia': 'SAU',
            'India': 'IND',
            'Japan': 'JPN',
            'South Korea': 'KOR',
            'Turkey': 'TUR',
            'Brazil': 'BRA',
            'United Kingdom': 'GBR',
            'Germany': 'DEU',
            'France': 'FRA',
            'Italy': 'ITA',
            'Mexico': 'MEX',
            'Canada': 'CAN',
            'Australia': 'AUS',
            'Spain': 'ESP',
            'Indonesia': 'IDN',
            'Netherlands': 'NLD',
            'South Africa': 'ZAF',
            'Switzerland': 'CHE',
            'Taiwan': 'TWN',
            'Poland': 'POL',
            'Sweden': 'SWE',
            'Belgium': 'BEL',
            'Thailand': 'THA',
            'Nigeria': 'NGA',
            'Argentina': 'ARG',
            'Norway': 'NOR',
            'Israel': 'ISR',
            'Hong Kong': 'HKG',
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
            'Czech Republic': 'CZE',
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
            'Cuba': 'CUB',
            'Azerbaijan': 'AZE',
            'Belarus': 'BLR',
            'Sri Lanka': 'LKA',
            'Myanmar': 'MMR',
            'Luxembourg': 'LUX',
            'Dominican Republic': 'DOM',
            'Uzbekistan': 'UZB',
            'Kenya': 'KEN',
            'Guatemala': 'GTM',
            'Uruguay': 'URY',
            'Croatia': 'HRV',
            'Bulgaria': 'BGR',
            'Macao': 'MAC',
            'Ethiopia': 'ETH',
            'Lebanon': 'LBN'
        };

        const code = countryMap[country.properties.name];
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
            this.selectedCountries.splice(existingIndex, 1);
            d3.select(event.target).classed('selected', false);
        } else {
            if (this.selectedCountries.length >= 2) {
                const removed = this.selectedCountries.shift();
                this.g.selectAll('path.country').classed('selected', false);
            }
            this.selectedCountries.push({
                code: code,
                name: data.name,
                data: data
            });
            d3.select(event.target).classed('selected', true);
        }

        this.updateCountryComparison();
    }

    handleCountryHover(event, d) {
        const data = this.getCountryData(d);
        d3.select(event.target)
            .attr('stroke', 'var(--accent-blue)')
            .attr('stroke-width', 1.5);

        if (data) {
            this.showTooltip(event, this.createTooltipContent(data));
        }
    }

    handleCountryMouseOut(event, d) {
        d3.select(event.target)
            .attr('stroke', 'var(--glass-border)')
            .attr('stroke-width', 0.5);
        this.hideTooltip();
    }

    createTooltipContent(data) {
        const value = data[this.currentFilter];
        const formatted = this.formatValue(value, this.currentFilter);
        const label = this.getFilterLabel(this.currentFilter);
        
        return `
            <strong>${data.name}</strong><br/>
            ${label}: ${formatted}<br/>
            سال: ${this.currentYear}
        `;
    }

    showTooltip(event, content) {
        this.tooltip
            .html(content)
            .style('opacity', 1)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px');
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
            gas: 'تولید گاز'
        };
        return labels[filter] || filter;
    }

    formatValue(value, filter) {
        if (filter === 'gdp') return (value / 1000000).toFixed(1) + 'T';
        if (filter === 'oil') return (value / 1000).toFixed(1) + 'K';
        if (filter === 'gas') return (value / 1000000).toFixed(1) + 'B';
        return Number(value).toLocaleString('en-US');
    }

    getCountryCode(name) {
        const map = {
            'United States of America': 'USA',
            'China': 'CHN',
            'Russian Federation': 'RUS',
            'Iran (Islamic Republic of)': 'IRN',
            'Saudi Arabia': 'SAU',
            'India': 'IND',
            'Japan': 'JPN',
            'South Korea': 'KOR',
            'Turkey': 'TUR',
            'Brazil': 'BRA',
            'United Kingdom': 'GBR',
            'Germany': 'DEU',
            'France': 'FRA',
            'Italy': 'ITA',
            'Mexico': 'MEX',
            'Canada': 'CAN',
            'Australia': 'AUS',
            'Spain': 'ESP',
            'Indonesia': 'IDN',
            'Netherlands': 'NLD',
            'South Africa': 'ZAF',
            'Switzerland': 'CHE',
            'Taiwan': 'TWN',
            'Poland': 'POL',
            'Sweden': 'SWE',
            'Belgium': 'BEL',
            'Thailand': 'THA',
            'Nigeria': 'NGA',
            'Argentina': 'ARG',
            'Norway': 'NOR',
            'Israel': 'ISR',
            'Hong Kong': 'HKG',
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
            'Czech Republic': 'CZE',
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
            'Cuba': 'CUB',
            'Azerbaijan': 'AZE',
            'Belarus': 'BLR',
            'Sri Lanka': 'LKA',
            'Myanmar': 'MMR',
            'Luxembourg': 'LUX',
            'Dominican Republic': 'DOM',
            'Uzbekistan': 'UZB',
            'Kenya': 'KEN',
            'Guatemala': 'GTM',
            'Uruguay': 'URY',
            'Croatia': 'HRV',
            'Bulgaria': 'BGR',
            'Macao': 'MAC',
            'Ethiopia': 'ETH',
            'Lebanon': 'LBN'
        };
        return map[name] || name;
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

    getCompleteData() {
        return {
            "2024": {
                "USA": { name: "ایالات متحده آمریکا", code: "USA", reserves: 8133, production: 200, gdp: 25400000, economicRank: 1, oil: 12800, gas: 934000 },
                "CHN": { name: "چین", code: "CHN", reserves: 1948, production: 350, gdp: 17900000, economicRank: 2, oil: 4800, gas: 207000 },
                "IRN": { name: "ایران", code: "IRN", reserves: 425, production: 85, gdp: 1620000, economicRank: 25, oil: 3100, gas: 258000 },
                "RUS": { name: "روسیه", code: "RUS", reserves: 2299, production: 300, gdp: 1860000, economicRank: 11, oil: 10700, gas: 701000 },
                "SAU": { name: "عربستان سعودی", code: "SAU", reserves: 323, production: 250, gdp: 1100000, economicRank: 18, oil: 11500, gas: 112000 },
                "IND": { name: "هند", code: "IND", reserves: 754, production: 90, gdp: 3740000, economicRank: 5, oil: 800, gas: 32000 },
                "DEU": { name: "آلمان", code: "DEU", reserves: 3366, production: 5, gdp: 4080000, economicRank: 4, oil: 220, gas: 68000 },
                "JPN": { name: "ژاپن", code: "JPN", reserves: 846, production: 8, gdp: 4910000, economicRank: 3, oil: 120, gas: 3200 },
                "GBR": { name: "انگلستان", code: "GBR", reserves: 310, production: 1, gdp: 3130000, economicRank: 6, oil: 950, gas: 42000 },
                "FRA": { name: "فرانسه", code: "FRA", reserves: 2436, production: 2, gdp: 2930000, economicRank: 7, oil: 160, gas: 1800 },
                "CAN": { name: "کانادا", code: "CAN", reserves: 180, production: 180, gdp: 2140000, economicRank: 9, oil: 5200, gas: 178000 },
                "AUS": { name: "استرالیا", code: "AUS", reserves: 79, production: 320, gdp: 1540000, economicRank: 13, oil: 280, gas: 142000 },
                "ITA": { name: "ایتالیا", code: "ITA", reserves: 2451, production: 0, gdp: 2010000, economicRank: 8, oil: 90, gas: 3200 },
                "BRA": { name: "برزیل", code: "BRA", reserves: 129, production: 60, gdp: 1920000, economicRank: 12, oil: 2700, gas: 24300 },
                "KOR": { name: "کره جنوبی", code: "KOR", reserves: 104, production: 0, gdp: 1730000, economicRank: 14, oil: 0, gas: 0 },
                "ESP": { name: "اسپانیا", code: "ESP", reserves: 281, production: 0, gdp: 1420000, economicRank: 15, oil: 20, gas: 50 },
                "MEX": { name: "مکزیک", code: "MEX", reserves: 120, production: 110, gdp: 1290000, economicRank: 16, oil: 1900, gas: 37000 },
                "IDN": { name: "اندونزی", code: "IDN", reserves: 78, production: 130, gdp: 1280000, economicRank: 17, oil: 740, gas: 89000 },
                "NLD": { name: "هلند", code: "NLD", reserves: 612, production: 0, gdp: 1010000, economicRank: 19, oil: 180, gas: 45000 },
                "TUR": { name: "ترکیه", code: "TUR", reserves: 478, production: 120, gdp: 906000, economicRank: 20, oil: 65, gas: 450 },
                "CHE": { name: "سوئیس", code: "CHE", reserves: 1040, production: 0, gdp: 840000, economicRank: 21, oil: 0, gas: 0 },
                "POL": { name: "لهستان", code: "POL", reserves: 228, production: 0, gdp: 679000, economicRank: 22, oil: 20, gas: 4000 },
                "SWE": { name: "سوئد", code: "SWE", reserves: 126, production: 0, gdp: 591000, economicRank: 23, oil: 0, gas: 0 },
                "BEL": { name: "بلژیک", code: "BEL", reserves: 227, production: 0, gdp: 578000, economicRank: 24, oil: 0, gas: 0 },
                "THA": { name: "تایلند", code: "THA", reserves: 154, production: 0, gdp: 546000, economicRank: 26, oil: 220, gas: 38000 },
                "NGA": { name: "نیجریه", code: "NGA", reserves: 21, production: 85, gdp: 514000, economicRank: 27, oil: 1680, gas: 49000 },
                "ARG": { name: "آرژانتین", code: "ARG", reserves: 61, production: 60, gdp: 487000, economicRank: 28, oil: 510, gas: 40000 },
                "NOR": { name: "نروژ", code: "NOR", reserves: 37, production: 0, gdp: 482000, economicRank: 29, oil: 1750, gas: 112000 },
                "ISR": { name: "اسرائیل", code: "ISR", reserves: 0, production: 0, gdp: 522000, economicRank: 30, oil: 0, gas: 0 },
                "ARE": { name: "امارات متحده عربی", code: "ARE", reserves: 215, production: 45, gdp: 501000, economicRank: 31, oil: 3800, gas: 62000 },
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
                "CZE": { name: "جمهوری چک", code: "CZE", reserves: 0, production: 0, gdp: 330000, economicRank: 44, oil: 0, gas: 0 },
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
                "SVK": { name: "اسلواکی", code: "SVK", reserves: 0, production: 0, gdp: 127000, economicRank: 60, oil: 0, gas: 0 }
            }
        };
    }
}

// مقداردهی اولیه
let worldGoldMapGlass;

document.addEventListener('DOMContentLoaded', function() {
    if (typeof d3 !== 'undefined') {
        worldGoldMapGlass = new WorldGoldMapGlass();
    } else {
        console.error('D3.js بارگذاری نشده است');
    }
});
