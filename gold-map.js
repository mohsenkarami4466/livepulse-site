// نقشه طلای جهان - نسخه دیباگ شده
class GoldMap {
    constructor() {
        this.currentMode = 'reserves';
        this.currentYear = '2024';
        this.selectedCountries = [];
        this.zoomTransform = d3.zoomIdentity;
        this.isDragging = false;
        this.worldAtlas = null;
        
        this.worldData = this.generateWorldData();
        this.init();
    }

    generateWorldData() {
        const baseData = {
            'USA': { name: 'ایالات متحده', baseReserves: 8133, baseProduction: 200, baseGDP: 25462 },
            'CHN': { name: 'چین', baseReserves: 1948, baseProduction: 365, baseGDP: 17963 },
            'DEU': { name: 'آلمان', baseReserves: 3356, baseProduction: 0, baseGDP: 4082 },
            'RUS': { name: 'روسیه', baseReserves: 2299, baseProduction: 310, baseGDP: 1830 },
            'FRA': { name: 'فرانسه', baseReserves: 2436, baseProduction: 0, baseGDP: 2937 },
            'ITA': { name: 'ایتالیا', baseReserves: 2451, baseProduction: 0, baseGDP: 2090 },
            'ZAF': { name: 'آفریقای جنوبی', baseReserves: 125, baseProduction: 110, baseGDP: 405 },
            'AUS': { name: 'استرالیا', baseReserves: 79, baseProduction: 320, baseGDP: 1693 },
            'CAN': { name: 'کانادا', baseReserves: 0, baseProduction: 180, baseGDP: 2145 },
            'BRA': { name: 'برزیل', baseReserves: 129, baseProduction: 60, baseGDP: 1920 },
            'IND': { name: 'هند', baseReserves: 768, baseProduction: 2, baseGDP: 3540 },
            'TUR': { name: 'ترکیه', baseReserves: 440, baseProduction: 42, baseGDP: 906 },
            'IRN': { name: 'ایران', baseReserves: 320, baseProduction: 8, baseGDP: 367 },
            'GBR': { name: 'انگلیس', baseReserves: 310, baseProduction: 0, baseGDP: 3187 },
            'JPN': { name: 'ژاپن', baseReserves: 846, baseProduction: 0, baseGDP: 4925 },
            'SAU': { name: 'عربستان', baseReserves: 323, baseProduction: 0, baseGDP: 1107 }
        };

        const years = ['2024'];
        const data = {};

        years.forEach(year => {
            data[year] = {};
            Object.entries(baseData).forEach(([code, country]) => {
                data[year][code] = {
                    name: country.name,
                    reserves: country.baseReserves,
                    production: country.baseProduction,
                    gdp: country.baseGDP,
                    growth: (2 + Math.random() * 4).toFixed(1),
                    population: this.getPopulation(code)
                };
            });
        });

        return data;
    }

    getPopulation(countryCode) {
        const populations = {
            'USA': 331, 'CHN': 1402, 'IND': 1380, 'IRN': 87,
            'RUS': 144, 'BRA': 213, 'DEU': 83, 'FRA': 67,
            'ITA': 60, 'GBR': 67, 'JPN': 126, 'TUR': 84,
            'ZAF': 59, 'AUS': 25, 'CAN': 38, 'SAU': 35
        };
        return populations[countryCode] || 50;
    }

    async init() {
        console.log('🌍 در حال راه‌اندازی نقشه طلا...');
        await this.loadWorldAtlas();
        this.setupMap();
        this.setupControls();
        this.setupEventListeners();
        this.updateTopCountries();
        console.log('✅ نقشه آماده است');
    }

    async loadWorldAtlas() {
        try {
            this.worldAtlas = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
            console.log('✅ داده‌های نقشه لود شد');
        } catch (error) {
            console.error('❌ خطا در لود نقشه:', error);
            this.showError();
        }
    }

    setupMap() {
        const container = d3.select('#goldMap');
        const width = container.node().clientWidth || 800;
        const height = container.node().clientHeight || 500;

        console.log(`📐 ابعاد نقشه: ${width}x${height}`);

        // پاک کردن کامل
        container.html('');

        this.svg = container.append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('background', '#0f172a')
            .style('border-radius', '8px');

        // projection ساده‌تر
        this.projection = d3.geoNaturalEarth1()
            .scale(width / 5.5) // scale کمتر برای نمایش بهتر
            .translate([width / 2, height / 2])
            .center([0, 0]);

        this.path = d3.geoPath().projection(this.projection);

        this.mapGroup = this.svg.append('g');
        this.dataGroup = this.svg.append('g');

        this.drawMap();
        this.setupZoom();
        this.setupTooltip();
        
        console.log('🗺️ نقشه رسم شد');
    }

    drawMap() {
        if (!this.worldAtlas) {
            console.error('❌ داده‌های نقشه موجود نیست');
            return;
        }

        try {
            const countries = topojson.feature(this.worldAtlas, this.worldAtlas.objects.countries);
            console.log(`🇺🇳 تعداد کشورها: ${countries.features.length}`);

            // رسم کشورها
            this.countryPaths = this.mapGroup.selectAll('.country')
                .data(countries.features)
                .enter()
                .append('path')
                .attr('class', 'country')
                .attr('d', this.path)
                .attr('data-code', d => d.id)
                .style('fill', d => this.getCountryColor(d))
                .style('stroke', '#475569')
                .style('stroke-width', '0.5')
                .style('cursor', 'pointer')
                .on('mouseover', (event, d) => this.handleMouseOver(event, d))
                .on('mouseout', () => this.handleMouseOut())
                .on('click', (event, d) => this.handleCountryClick(event, d));

            console.log('🎨 کشورها رسم شدند');

            // تست: چک کن رنگ‌ها درست اعمال میشن
            this.countryPaths.each(function(d) {
                const fillColor = d3.select(this).style('fill');
                console.log(`رنگ کشور ${d.id}: ${fillColor}`);
            });

            // اضافه کردن داده‌ها با تاخیر برای اطمینان
            setTimeout(() => {
                this.addDataLabels(countries.features);
            }, 100);

        } catch (error) {
            console.error('❌ خطا در رسم نقشه:', error);
        }
    }

    addDataLabels(countries) {
        console.log('🏷️ در حال اضافه کردن برچسب داده‌ها...');
        
        // پاک کردن قبلی
        this.dataGroup.selectAll('.data-label').remove();

        const visibleCountries = countries.filter(d => {
            const data = this.getCountryData(d.id);
            const hasData = data && data[this.currentMode] > 0;
            if (hasData) {
                console.log(`✅ کشور با داده: ${data.name} - ${data[this.currentMode]}`);
            }
            return hasData;
        });

        console.log(`📊 تعداد کشورهای با داده: ${visibleCountries.length}`);

        this.dataLabels = this.dataGroup.selectAll('.data-label')
            .data(visibleCountries)
            .enter()
            .append('text')
            .attr('class', 'data-label')
            .attr('x', d => {
                const centroid = this.path.centroid(d);
                return centroid[0];
            })
            .attr('y', d => {
                const centroid = this.path.centroid(d);
                return centroid[1];
            })
            .attr('text-anchor', 'middle')
            .attr('dy', '0.35em')
            .style('font-size', '7px')
            .style('font-weight', 'bold')
            .style('fill', '#ffffff')
            .style('pointer-events', 'none')
            .style('text-shadow', '1px 1px 3px #000000')
            .style('opacity', 0.9)
            .text(d => {
                const data = this.getCountryData(d.id);
                if (!data) return '';
                
                const value = data[this.currentMode];
                // فرمت‌بزی مختلف برای مقادیر
                if (value < 10) return value.toString();
                if (value < 1000) return this.formatNumber(value);
                return (value / 1000).toFixed(1) + 'K';
            });

        console.log('✅ برچسب داده‌ها اضافه شد');
    }

    getCountryData(countryCode) {
        const data = this.worldData[this.currentYear]?.[countryCode];
        return data;
    }

    getCountryColor(countryData) {
        const countryCode = countryData.id;
        const data = this.getCountryData(countryCode);
        
        if (!data) {
            console.log(`❌ بدون داده: ${countryCode}`);
            return '#4b5563'; // خاکستری تیره
        }
        
        const value = data[this.currentMode];
        console.log(`🎨 رنگ‌بندی ${data.name}: ${value}`);

        if (value === 0 || value === undefined) return '#4b5563';

        // رنگ‌بندی بسیار واضح
        if (this.currentMode === 'reserves') {
            if (value < 100) return '#fef3c7';
            if (value < 500) return '#fde68a';
            if (value < 1000) return '#fcd34d';
            if (value < 2000) return '#fbbf24';
            if (value < 5000) return '#f59e0b';
            return '#d97706';
        } else if (this.currentMode === 'production') {
            if (value < 50) return '#dbeafe';
            if (value < 100) return '#93c5fd';
            if (value < 200) return '#60a5fa';
            if (value < 300) return '#3b82f6';
            return '#2563eb';
        } else {
            if (value < 1000) return '#dcfce7';
            if (value < 5000) return '#86efac';
            if (value < 10000) return '#4ade80';
            if (value < 20000) return '#22c55e';
            return '#16a34a';
        }
    }

    // بقیه متدها مانند قبل...
    setupZoom() {
        this.zoom = d3.zoom()
            .scaleExtent([1, 8])
            .on('start', () => {
                this.isDragging = true;
            })
            .on('zoom', (event) => {
                this.zoomTransform = event.transform;
                this.mapGroup.attr('transform', event.transform);
                this.dataGroup.attr('transform', event.transform);
            })
            .on('end', () => {
                this.isDragging = false;
            });

        this.svg.call(this.zoom);
    }

    setupTooltip() {
        d3.select('.map-tooltip')?.remove();
        
        this.tooltip = d3.select('body')
            .append('div')
            .attr('class', 'map-tooltip')
            .style('opacity', 0)
            .style('position', 'absolute')
            .style('background', 'rgba(0, 0, 0, 0.95)')
            .style('color', 'white')
            .style('padding', '12px')
            .style('border-radius', '8px')
            .style('font-size', '14px')
            .style('font-family', 'system-ui')
            .style('pointer-events', 'none')
            .style('z-index', '1000')
            .style('border', '1px solid #f59e0b')
            .style('backdrop-filter', 'blur(10px)')
            .style('max-width', '300px');
    }

    handleMouseOver(event, countryData) {
        if (this.isDragging) return;

        const countryCode = countryData.id;
        const data = this.getCountryData(countryCode);
        
        if (data) {
            const value = data[this.currentMode];
            const modeText = this.getModeText();
            
            this.tooltip
                .style('opacity', 1)
                .html(`
                    <div style="font-weight: bold; color: #fbbf24; margin-bottom: 8px; font-size: 16px;">
                        ${data.name}
                    </div>
                    <div style="margin-bottom: 4px;">${modeText}: <strong>${this.formatNumber(value)} ${this.getUnit()}</strong></div>
                    <div style="margin-bottom: 4px;">📅 سال: <strong>${this.currentYear}</strong></div>
                    <div style="margin-bottom: 4px;">📈 رشد اقتصادی: <strong>${data.growth}%</strong></div>
                    <div style="margin-bottom: 4px;">👥 جمعیت: <strong>${this.formatNumber(data.population)} میلیون</strong></div>
                    <div style="font-size: 12px; opacity: 0.8; border-top: 1px solid rgba(255,255,255,0.3); padding-top: 8px;">
                        ${this.selectedCountries.some(c => c.code === countryCode) ? '✓ انتخاب شده' : 'برای مقایسه کلیک کنید'}
                    </div>
                `)
                .style('left', (event.pageX + 15) + 'px')
                .style('top', (event.pageY - 15) + 'px');
        }

        d3.select(event.currentTarget)
            .style('stroke', '#f59e0b')
            .style('stroke-width', '2');
    }

    handleMouseOut() {
        this.tooltip.style('opacity', 0);
        d3.selectAll('.country')
            .style('stroke', '#475569')
            .style('stroke-width', '0.5');
    }

    handleCountryClick(event, countryData) {
        if (this.isDragging) return;

        const countryCode = countryData.id;
        const data = this.getCountryData(countryCode);
        
        if (!data) return;

        const existingIndex = this.selectedCountries.findIndex(c => c.code === countryCode);
        
        if (existingIndex > -1) {
            this.selectedCountries.splice(existingIndex, 1);
            d3.select(event.currentTarget).classed('selected', false);
        } else {
            if (this.selectedCountries.length >= 2) {
                const removedCountry = this.selectedCountries.shift();
                this.mapGroup.selectAll(`.country[data-code="${removedCountry.code}"]`).classed('selected', false);
            }
            
            this.selectedCountries.push({ 
                code: countryCode, 
                data: data,
                year: this.currentYear
            });
            d3.select(event.currentTarget).classed('selected', true);
        }

        this.updateCountryComparison();
    }

    updateCountryComparison() {
        const container = document.getElementById('countryComparison');
        
        if (this.selectedCountries.length === 0) {
            container.innerHTML = `
                <div class="comparison-placeholder">
                    <p>🌍 برای مقایسه، روی کشورها کلیک کنید</p>
                    <small>می‌توانید حداکثر ۲ کشور را مقایسه کنید</small>
                </div>
            `;
            return;
        }

        let comparisonHTML = '';
        
        this.selectedCountries.forEach((country, index) => {
            const data = country.data;
            comparisonHTML += `
                <div class="country-card">
                    <div class="country-card-header">
                        <span class="country-card-name">${data.name}</span>
                        <span class="country-card-year">${country.year}</span>
                        <button class="country-card-remove" onclick="goldMap.removeCountry('${country.code}')">×</button>
                    </div>
                    <div class="country-stats">
                        <div class="stat-item">
                            <span class="stat-label">💰 ذخایر طلا:</span>
                            <span class="stat-value">${this.formatNumber(data.reserves)} تن</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">⛏️ برداشت طلا:</span>
                            <span class="stat-value">${this.formatNumber(data.production)} تن</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">📈 GDP:</span>
                            <span class="stat-value">${this.formatNumber(data.gdp)} میلیارد $</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">📊 رشد اقتصادی:</span>
                            <span class="stat-value">${data.growth}%</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">👥 جمعیت:</span>
                            <span class="stat-value">${this.formatNumber(data.population)} میلیون</span>
                        </div>
                    </div>
                </div>
            `;
        });

        if (this.selectedCountries.length === 2) {
            comparisonHTML += this.generateComparisonChart();
        }

        container.innerHTML = comparisonHTML;
    }

    generateComparisonChart() {
        const country1 = this.selectedCountries[0];
        const country2 = this.selectedCountries[1];
        
        const maxReserves = Math.max(country1.data.reserves, country2.data.reserves);
        const maxProduction = Math.max(country1.data.production, country2.data.production);
        
        return `
            <div class="comparison-chart">
                <div style="color: #fbbf24; font-weight: bold; margin-bottom: 15px; text-align: center;">📊 نمودار مقایسه</div>
                
                <div style="margin-bottom: 12px;">
                    <div style="font-size: 0.8rem; color: #94a3b8; margin-bottom: 6px;">💰 ذخایر طلا (تن)</div>
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
                        <div style="width: 60px; font-size: 0.75rem; color: #60a5fa;">${country1.data.name}</div>
                        <div style="flex: 1; height: 8px; background: #334155; border-radius: 4px; overflow: hidden;">
                            <div style="height: 100%; background: #60a5fa; width: ${(country1.data.reserves / maxReserves) * 100}%"></div>
                        </div>
                        <div style="width: 50px; font-size: 0.75rem; text-align: left; color: #e2e8f0;">${this.formatNumber(country1.data.reserves)}</div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 60px; font-size: 0.75rem; color: #f87171;">${country2.data.name}</div>
                        <div style="flex: 1; height: 8px; background: #334155; border-radius: 4px; overflow: hidden;">
                            <div style="height: 100%; background: #f87171; width: ${(country2.data.reserves / maxReserves) * 100}%"></div>
                        </div>
                        <div style="width: 50px; font-size: 0.75rem; text-align: left; color: #e2e8f0;">${this.formatNumber(country2.data.reserves)}</div>
                    </div>
                </div>
                
                <div style="margin-bottom: 12px;">
                    <div style="font-size: 0.8rem; color: #94a3b8; margin-bottom: 6px;">⛏️ برداشت طلا (تن)</div>
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
                        <div style="width: 60px; font-size: 0.75rem; color: #60a5fa;">${country1.data.name}</div>
                        <div style="flex: 1; height: 8px; background: #334155; border-radius: 4px; overflow: hidden;">
                            <div style="height: 100%; background: #60a5fa; width: ${(country1.data.production / maxProduction) * 100}%"></div>
                        </div>
                        <div style="width: 50px; font-size: 0.75rem; text-align: left; color: #e2e8f0;">${this.formatNumber(country1.data.production)}</div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 60px; font-size: 0.75rem; color: #f87171;">${country2.data.name}</div>
                        <div style="flex: 1; height: 8px; background: #334155; border-radius: 4px; overflow: hidden;">
                            <div style="height: 100%; background: #f87171; width: ${(country2.data.production / maxProduction) * 100}%"></div>
                        </div>
                        <div style="width: 50px; font-size: 0.75rem; text-align: left; color: #e2e8f0;">${this.formatNumber(country2.data.production)}</div>
                    </div>
                </div>
            </div>
        `;
    }

    removeCountry(countryCode) {
        this.selectedCountries = this.selectedCountries.filter(c => c.code !== countryCode);
        this.mapGroup.selectAll('.country').classed('selected', false);
        this.selectedCountries.forEach(country => {
            this.mapGroup.selectAll(`.country[data-code="${country.code}"]`).classed('selected', true);
        });
        this.updateCountryComparison();
    }

    setupControls() {
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.control-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentMode = e.target.dataset.mode;
                this.updateMap();
                this.updateTopCountries();
                this.updateCountryComparison();
            });
        });

        document.querySelectorAll('.year-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.year-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentYear = e.target.dataset.year;
                this.updateMap();
                this.updateTopCountries();
                
                this.selectedCountries.forEach(country => {
                    country.year = this.currentYear;
                    country.data = this.getCountryData(country.code);
                });
                this.updateCountryComparison();
            });
        });
    }

    setupEventListeners() {
        document.getElementById('resetZoom').addEventListener('click', () => {
            this.svg.transition().duration(750).call(
                this.zoom.transform,
                d3.zoomIdentity
            );
        });

        // رفع مشکل resize در موبایل
        window.addEventListener('resize', () => {
            setTimeout(() => {
                this.setupMap();
            }, 500);
        });
    }

    updateMap() {
        console.log('🔄 آپدیت نقشه...');
        
        // آپدیت رنگ کشورها
        this.countryPaths
            .style('fill', d => this.getCountryColor(d));

        // آپدیت داده‌ها
        this.addDataLabels(this.countryPaths.data());
    }

    updateTopCountries() {
        const yearData = this.worldData[this.currentYear];
        if (!yearData) return;

        const topCountries = Object.entries(yearData)
            .filter(([, country]) => country[this.currentMode] > 0)
            .sort(([,a], [,b]) => b[this.currentMode] - a[this.currentMode])
            .slice(0, 10);

        const listDiv = document.getElementById('topCountriesList');
        listDiv.innerHTML = topCountries.map(([code, country], index) => `
            <div class="country-item">
                <span class="country-rank">${index + 1}</span>
                <span class="country-name">${country.name}</span>
                <span class="country-value">${this.formatNumber(country[this.currentMode])} ${this.getUnit()}</span>
            </div>
        `).join('');
    }

    getModeText() {
        const modes = {
            reserves: 'ذخایر طلا',
            production: 'برداشت طلا', 
            gdp: 'تولید ناخالص داخلی'
        };
        return modes[this.currentMode];
    }

    getUnit() {
        const units = {
            reserves: 'تن',
            production: 'تن',
            gdp: 'میلیارد $'
        };
        return units[this.currentMode];
    }

    formatNumber(num) {
        return new Intl.NumberFormat('fa-IR').format(num);
    }

    showError() {
        const container = document.getElementById('goldMap');
        container.innerHTML = `
            <div style="color: white; text-align: center; padding: 50px;">
                <h3>⚠️ خطا در بارگذاری نقشه</h3>
                <p>لطفاً اتصال اینترنت خود را بررسی کنید</p>
                <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #f59e0b; border: none; border-radius: 5px; cursor: pointer;">
                    🔄 تلاش مجدد
                </button>
            </div>
        `;
    }
}

// راه‌اندازی نقشه
let goldMap;
document.addEventListener('DOMContentLoaded', function() {
    goldMap = new GoldMap();
});
