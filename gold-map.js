// ==================== //
// نقشه طلای جهان - کامل و حرفه‌ای
// ==================== //

class WorldGoldMap {
    constructor() {
        this.currentYear = '2024';
        this.currentFilter = 'reserves';
        this.selectedCountries = [];
        this.worldData = null;
        this.svg = null;
        this.projection = null;
        this.path = null;
        this.zoom = null;
        this.g = null;

        this.init();
    }

    async init() {
        try {
            console.log('🚀 راه‌اندازی نقشه طلای جهان...');
            await this.loadWorldData();
            this.createMap();
            this.setupInteractions();
            this.updateAll();
            console.log('✅ نقشه با موفقیت راه‌اندازی شد');
        } catch (error) {
            console.error('❌ خطا در راه‌اندازی نقشه:', error);
            this.showError('خطا در بارگذاری نقشه. لطفاً صفحه را رفرش کنید.');
        }
    }

    async loadWorldData() {
        const urls = [
            'https://unpkg.com/world-atlas@2/countries-110m.json',
            'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'
        ];
        
        for (let url of urls) {
            try {
                this.worldData = await d3.json(url);
                console.log('✅ نقشه از این آدرس لود شد:', url);
                return;
            } catch (error) {
                console.warn('⚠️ خطا در لود از:', url);
            }
        }
        throw new Error('نقشه جهان بارگذاری نشد');
    }

    createMap() {
        const container = document.getElementById('goldMap');
        if (!container) {
            throw new Error('المان #goldMap یافت نشد');
        }

        const width = container.clientWidth;
        const height = Math.max(600, window.innerHeight * 0.7);

        // پاکسازی کامل
        d3.select('#goldMap').selectAll('*').remove();

        // ایجاد SVG
        this.svg = d3.select('#goldMap')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('background', 'var(--bg-secondary)')
            .style('border-radius', '12px')
            .style('cursor', 'grab');

        this.g = this.svg.append('g');

        // projection
        this.projection = d3.geoNaturalEarth1()
            .scale(width / 6.5)
            .translate([width / 2, height / 2]);

        this.path = d3.geoPath().projection(this.projection);

        // رسم کشورها
        this.drawCountries();
        this.createTooltip();
    }

    drawCountries() {
        const countries = topojson.feature(this.worldData, this.worldData.objects.countries).features;

        this.g.selectAll('.country')
            .data(countries)
            .enter()
            .append('path')
            .attr('class', 'country')
            .attr('d', this.path)
            .attr('fill', d => this.getCountryColor(d))
            .attr('stroke', 'var(--glass-border)')
            .attr('stroke-width', 0.7)
            .style('cursor', 'pointer')
            .style('transition', 'all 0.3s ease')
            .on('click', (event, d) => this.handleCountryClick(event, d))
            .on('mouseover', (event, d) => this.handleCountryHover(event, d))
            .on('mouseout', (event, d) => this.handleCountryMouseOut(event, d));
    }

    setupInteractions() {
        // زوم و پان
        this.zoom = d3.zoom()
            .scaleExtent([1, 12])
            .on('zoom', (event) => {
                this.g.attr('transform', event.transform);
                this.updateCoordinates(event.transform);
            });

        this.svg.call(this.zoom);

        // رویدادهای کلیک
        this.setupEventListeners();
    }

    setupEventListeners() {
        // فیلترها
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.setActiveFilter(btn);
            });
        });

        // سال‌ها
        document.querySelectorAll('.year-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.setActiveYear(btn);
            });
        });

        // کنترل‌های نقشه
        document.getElementById('resetZoom')?.addEventListener('click', () => this.resetZoom());
        document.getElementById('zoomIn')?.addEventListener('click', () => this.zoomIn());
        document.getElementById('zoomOut')?.addEventListener('click', () => this.zoomOut());
        document.getElementById('globe3dBtn')?.addEventListener('click', () => this.showGlobeModal());

        // رسپانسیو
        window.addEventListener('resize', () => this.handleResize());
    }

    setActiveFilter(btn) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.dataset.filter;
        this.updateAll();
    }

    setActiveYear(btn) {
        document.querySelectorAll('.year-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentYear = btn.dataset.year;
        this.updateAll();
    }

    getCountryColor(country) {
        const data = this.getCountryData(country);
        if (!data || !data[this.currentFilter]) {
            return 'var(--bg-secondary)';
        }

        const value = data[this.currentFilter];
        return this.getColorForValue(value, this.currentFilter);
    }

    getColorForValue(value, filter) {
        const colorScales = {
            reserves: d3.scaleSequential(d3.interpolateYlOrBr).domain([0, 10000]),
            production: d3.scaleSequential(d3.interpolateGreens).domain([0, 400]),
            gdp: d3.scaleSequential(d3.interpolateBlues).domain([0, 30000000]),
            economicRank: d3.scaleSequential(d3.interpolateReds).domain([1, 50]),
            oil: d3.scaleSequential(d3.interpolateOranges).domain([0, 15000]),
            gas: d3.scaleSequential(d3.interpolatePurples).domain([0, 1000000]),
            bankRank: d3.scaleSequential(d3.interpolateViridis).domain([1, 50])
        };

        return colorScales[filter] ? colorScales[filter](value) : 'var(--bg-secondary)';
    }

    getCountryData(country) {
        const countryMap = {
            // آمریکا
            'United States of America': 'USA',
            'United States': 'USA',
            
            // آسیا
            'China': 'CHN',
            'Russian Federation': 'RUS',
            'Iran (Islamic Republic of)': 'IRN',
            'Iran': 'IRN',
            'Saudi Arabia': 'SAU',
            'India': 'IND',
            'Japan': 'JPN',
            'South Korea': 'KOR',
            'Turkey': 'TUR',
            'Indonesia': 'IDN',
            'Pakistan': 'PAK',
            'Bangladesh': 'BGD',
            'Vietnam': 'VNM',
            'Philippines': 'PHL',
            'Thailand': 'THA',
            'Malaysia': 'MYS',
            'Uzbekistan': 'UZB',
            'Iraq': 'IRQ',
            'Afghanistan': 'AFG',
            'Yemen': 'YEM',
            'Syria': 'SYR',
            'Kazakhstan': 'KAZ',
            'United Arab Emirates': 'ARE',
            'Israel': 'ISR',
            'Qatar': 'QAT',
            'Kuwait': 'KWT',
            'Oman': 'OMN',
            'Jordan': 'JOR',
            'Azerbaijan': 'AZE',
            'Tajikistan': 'TJK',
            'Kyrgyzstan': 'KGZ',
            'Turkmenistan': 'TKM',
            'Lebanon': 'LBN',
            
            // اروپا
            'Germany': 'DEU',
            'United Kingdom': 'GBR',
            'France': 'FRA',
            'Italy': 'ITA',
            'Spain': 'ESP',
            'Ukraine': 'UKR',
            'Poland': 'POL',
            'Netherlands': 'NLD',
            'Belgium': 'BEL',
            'Sweden': 'SWE',
            'Czechia': 'CZE',
            'Greece': 'GRC',
            'Portugal': 'PRT',
            'Hungary': 'HUN',
            'Austria': 'AUT',
            'Switzerland': 'CHE',
            'Denmark': 'DNK',
            'Finland': 'FIN',
            'Norway': 'NOR',
            'Ireland': 'IRL',
            'Romania': 'ROU',
            'Belarus': 'BLR',
            
            // آفریقا
            'Nigeria': 'NGA',
            'Ethiopia': 'ETH',
            'Egypt': 'EGY',
            'Democratic Republic of the Congo': 'COD',
            'South Africa': 'ZAF',
            'Tanzania': 'TZA',
            'Kenya': 'KEN',
            'Uganda': 'UGA',
            'Algeria': 'DZA',
            'Sudan': 'SDN',
            'Morocco': 'MAR',
            'Angola': 'AGO',
            'Ghana': 'GHA',
            'Mozambique': 'MOZ',
            'Madagascar': 'MDG',
            
            // آمریکای لاتین
            'Brazil': 'BRA',
            'Mexico': 'MEX',
            'Colombia': 'COL',
            'Argentina': 'ARG',
            'Peru': 'PER',
            'Venezuela': 'VEN',
            'Chile': 'CHL',
            'Ecuador': 'ECU',
            'Guatemala': 'GTM',
            'Cuba': 'CUB',
            'Bolivia': 'BOL',
            
            // اقیانوسیه
            'Australia': 'AUS',
            'Papua New Guinea': 'PNG',
            'New Zealand': 'NZL',
            'Fiji': 'FJI'
        };

        const code = countryMap[country.properties.name];
        return this.getCompleteData()[this.currentYear]?.[code];
    }

    handleCountryClick(event, d) {
        const data = this.getCountryData(d);
        if (!data) {
            this.showTooltip(event, '⚠️ داده‌ای برای این کشور موجود نیست');
            return;
        }

        const countryCode = this.getCountryCode(d.properties.name);
        const existingIndex = this.selectedCountries.findIndex(c => c.code === countryCode);

        if (existingIndex > -1) {
            this.selectedCountries.splice(existingIndex, 1);
            d3.select(event.target).classed('selected', false);
        } else {
            if (this.selectedCountries.length >= 2) {
                const removed = this.selectedCountries.shift();
                this.g.selectAll('.country').classed('selected', false);
            }
            
            this.selectedCountries.push({
                code: countryCode,
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
            .transition()
            .duration(200)
            .attr('stroke', 'var(--accent-blue)')
            .attr('stroke-width', 2);

        if (data) {
            this.showTooltip(event, this.createTooltipContent(data));
        }
    }

    handleCountryMouseOut(event, d) {
        d3.select(event.target)
            .transition()
            .duration(200)
            .attr('stroke', 'var(--glass-border)')
            .attr('stroke-width', 0.7);

        this.hideTooltip();
    }

    createTooltip() {
        d3.select('.gold-map-tooltip')?.remove();
        
        d3.select('body').append('div')
            .attr('class', 'gold-map-tooltip')
            .style('opacity', 0);
    }

    createTooltipContent(data) {
        const value = data[this.currentFilter];
        const formattedValue = this.formatValue(value, this.currentFilter);
        const filterLabel = this.getFilterLabel(this.currentFilter);
        
        return `
            <div class="tooltip-header">
                <strong>${data.name}</strong>
            </div>
            <div class="tooltip-content">
                <div class="tooltip-row">
                    <span class="tooltip-label">${filterLabel}:</span>
                    <span class="tooltip-value">${formattedValue}</span>
                </div>
                <div class="tooltip-row">
                    <span class="tooltip-label">📅 سال:</span>
                    <span class="tooltip-value">${this.currentYear}</span>
                </div>
            </div>
        `;
    }

    showTooltip(event, content) {
        d3.select('.gold-map-tooltip')
            .html(content)
            .style('opacity', 1)
            .style('left', (event.pageX + 15) + 'px')
            .style('top', (event.pageY - 15) + 'px');
    }

    hideTooltip() {
        d3.select('.gold-map-tooltip').style('opacity', 0);
    }

    updateAll() {
        this.updateMapColors();
        this.updateTopCountries();
        this.updateCountryComparison();
    }

    updateMapColors() {
        this.g.selectAll('.country')
            .transition()
            .duration(600)
            .attr('fill', d => this.getCountryColor(d));
    }

    updateTopCountries() {
        const currentData = this.getCompleteData()[this.currentYear];
        if (!currentData) return;

        const sortedCountries = Object.values(currentData)
            .sort((a, b) => {
                if (this.currentFilter.includes('Rank')) {
                    return a[this.currentFilter] - b[this.currentFilter];
                }
                return b[this.currentFilter] - a[this.currentFilter];
            })
            .slice(0, 10);

        const html = sortedCountries.map((country, index) => {
            const value = this.formatValue(country[this.currentFilter], this.currentFilter);
            const medal = index < 3 ? ['🥇', '🥈', '🥉'][index] : `${index + 1}`;
            
            return `
                <div class="country-item" onclick="worldGoldMap.selectCountryFromList('${country.code}')">
                    <span class="country-rank">${medal}</span>
                    <span class="country-name">${country.name}</span>
                    <span class="country-value">${value}</span>
                </div>
            `;
        }).join('');

        const listElement = document.getElementById('topCountriesList');
        if (listElement) {
            listElement.innerHTML = html;
        }
    }

    updateCountryComparison() {
        const container = document.getElementById('countryComparison');
        if (!container) return;

        if (this.selectedCountries.length === 0) {
            container.innerHTML = `
                <div class="comparison-placeholder">
                    <p>🌍 برای مقایسه، روی کشورها در نقشه کلیک کنید</p>
                    <small>می‌توانید حداکثر ۲ کشور را انتخاب کنید</small>
                </div>
            `;
            return;
        }

        const html = this.selectedCountries.map(country => `
            <div class="country-card">
                <div class="country-card-header">
                    <span class="country-card-name">${country.name}</span>
                    <div class="card-actions">
                        <span class="country-card-year">${this.currentYear}</span>
                        <button class="country-card-remove" onclick="worldGoldMap.removeCountry('${country.code}')">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                                <path d="M1 1L11 11M11 1L1 11"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="country-stats">
                    <div class="stat-item">
                        <span class="stat-label">💰 ذخایر طلا</span>
                        <span class="stat-value">${country.data.reserves} تن</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">⛏️ برداشت طلا</span>
                        <span class="stat-value">${country.data.production} تن</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">📈 تولید ناخالص</span>
                        <span class="stat-value">${this.formatValue(country.data.gdp, 'gdp')}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">🏆 رتبه اقتصادی</span>
                        <span class="stat-value">${country.data.economicRank}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">🛢️ تولید نفت</span>
                        <span class="stat-value">${this.formatValue(country.data.oil, 'oil')}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">🔥 تولید گاز</span>
                        <span class="stat-value">${this.formatValue(country.data.gas, 'gas')}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">🏦 رتبه بانک مرکزی</span>
                        <span class="stat-value">${country.data.bankRank}</span>
                    </div>
                </div>
            </div>
        `).join('');

        // اضافه کردن نمودار مقایسه
        if (this.selectedCountries.length === 2) {
            const chartHTML = this.createComparisonChart();
            container.innerHTML = html + chartHTML;
        } else {
            container.innerHTML = html;
        }
    }

    createComparisonChart() {
        const [country1, country2] = this.selectedCountries;
        
        const maxValues = {
            reserves: Math.max(country1.data.reserves, country2.data.reserves, 1),
            production: Math.max(country1.data.production, country2.data.production, 1),
            gdp: Math.max(country1.data.gdp, country2.data.gdp, 1),
            oil: Math.max(country1.data.oil, country2.data.oil, 1)
        };

        return `
            <div class="comparison-chart">
                <div class="chart-title">📊 مقایسه نموداری</div>
                <div class="chart-bars">
                    <div class="chart-bar">
                        <div class="bar-label">ذخایر طلا (تن)</div>
                        <div class="bar-container">
                            <div class="bar bar-1" style="width: ${(country1.data.reserves / maxValues.reserves) * 100}%">
                                <span class="bar-value">${country1.data.reserves}</span>
                            </div>
                            <div class="bar bar-2" style="width: ${(country2.data.reserves / maxValues.reserves) * 100}%">
                                <span class="bar-value">${country2.data.reserves}</span>
                            </div>
                        </div>
                    </div>
                    <div class="chart-bar">
                        <div class="bar-label">برداشت طلا (تن)</div>
                        <div class="bar-container">
                            <div class="bar bar-1" style="width: ${(country1.data.production / maxValues.production) * 100}%">
                                <span class="bar-value">${country1.data.production}</span>
                            </div>
                            <div class="bar bar-2" style="width: ${(country2.data.production / maxValues.production) * 100}%">
                                <span class="bar-value">${country2.data.production}</span>
                            </div>
                        </div>
                    </div>
                    <div class="chart-bar">
                        <div class="bar-label">تولید نفت (هزار بشکه)</div>
                        <div class="bar-container">
                            <div class="bar bar-1" style="width: ${(country1.data.oil / maxValues.oil) * 100}%">
                                <span class="bar-value">${this.formatValue(country1.data.oil, 'oil')}</span>
                            </div>
                            <div class="bar bar-2" style="width: ${(country2.data.oil / maxValues.oil) * 100}%">
                                <span class="bar-value">${this.formatValue(country2.data.oil, 'oil')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    selectCountryFromList(countryCode) {
        const currentData = this.getCompleteData()[this.currentYear];
        const country = currentData[countryCode];
        
        if (country) {
            this.selectedCountries = [{
                code: countryCode,
                name: country.name,
                data: country
            }];
            
            this.g.selectAll('.country').classed('selected', false);
            this.updateCountryComparison();
        }
    }

    removeCountry(countryCode) {
        this.selectedCountries = this.selectedCountries.filter(c => c.code !== countryCode);
        this.g.selectAll('.country').classed('selected', false);
        this.updateCountryComparison();
    }

    // کنترل‌های زوم
    resetZoom() {
        this.svg.transition()
            .duration(750)
            .call(this.zoom.transform, d3.zoomIdentity);
    }

    zoomIn() {
        this.svg.transition()
            .duration(300)
            .call(this.zoom.scaleBy, 1.5);
    }

    zoomOut() {
        this.svg.transition()
            .duration(300)
            .call(this.zoom.scaleBy, 0.75);
    }

    updateCoordinates(transform) {
        const coordsElement = document.getElementById('coordinates');
        if (coordsElement) {
            coordsElement.textContent = `مقیاس: ${transform.k.toFixed(1)}x`;
        }
    }

    handleResize() {
        setTimeout(() => {
            if (this.worldData) {
                this.createMap();
                this.setupInteractions();
                this.updateAll();
            }
        }, 250);
    }

    showGlobeModal() {
        const modal = document.createElement('div');
        modal.className = 'premium-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>🌍 نمای سه بعدی پیشرفته</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="premium-icon">🚀</div>
                    <p>برای دسترسی به نمای سه بعدی تعاملی کره زمین، اشتراک ویژه تهیه کنید.</p>
                    <div class="premium-features">
                        <div class="feature">✨ نمای 3D واقعی کره زمین</div>
                        <div class="feature">🎯 چرخش و زوم پیشرفته</div>
                        <div class="feature">📊 تحلیل‌های سه بعدی</div>
                        <div class="feature">💎 داده‌های تاریخی کامل</div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="this.closest('.premium-modal').remove()">متوجه شدم</button>
                    <button class="btn btn-secondary" onclick="worldGoldMap.redirectToSubscription()">خرید اشتراک</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        setTimeout(() => {
            if (document.body.contains(modal)) {
                modal.remove();
            }
        }, 8000);
    }

    redirectToSubscription() {
        console.log('هدایت به صفحه اشتراک...');
        // window.location.href = '/subscription';
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--accent-red);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 10000;
            max-width: 300px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => errorDiv.remove(), 5000);
    }

    getFilterLabel(filter) {
        const labels = {
            reserves: 'ذخایر طلا',
            production: 'برداشت طلا',
            gdp: 'تولید ناخالص',
            economicRank: 'رتبه اقتصادی',
            oil: 'تولید نفت',
            gas: 'تولید گاز',
            bankRank: 'رتبه بانک مرکزی'
        };
        return labels[filter] || filter;
    }

    formatValue(value, filter) {
        if (filter === 'gdp') {
            return (value / 1000000).toFixed(1) + 'T';
        }
        if (filter === 'oil') {
            return (value / 1000).toFixed(1) + 'K';
        }
        if (filter === 'gas') {
            return (value / 1000000).toFixed(1) + 'B';
        }
        return value.toLocaleString('en-US');
    }

    getCountryCode(name) {
        const countryMap = {
            'United States of America': 'USA',
            'China': 'CHN',
            'Russian Federation': 'RUS',
            'Iran (Islamic Republic of)': 'IRN',
            'Saudi Arabia': 'SAU',
            // ... بقیه کشورها
        };
        return countryMap[name] || name;
    }

    getCompleteData() {
        return {
            "2024": {
                "USA": { 
                    name: "ایالات متحده آمریکا", 
                    code: "USA",
                    reserves: 8133, 
                    production: 200, 
                    gdp: 25400000, 
                    economicRank: 1,
                    oil: 12800,
                    gas: 934000,
                    bankRank: 1
                },
                "CHN": { 
                    name: "چین", 
                    code: "CHN",
                    reserves: 1948, 
                    production: 350, 
                    gdp: 17900000, 
                    economicRank: 2,
                    oil: 4800,
                    gas: 207000,
                    bankRank: 3
                },
                "IRN": { 
                    name: "ایران", 
                    code: "IRN",
                    reserves: 425, 
                    production: 85, 
                    gdp: 1620000, 
                    economicRank: 25,
                    oil: 3100,
                    gas: 258000,
                    bankRank: 28
                },
                "RUS": { 
                    name: "روسیه", 
                    code: "RUS",
                    reserves: 2299, 
                    production: 300, 
                    gdp: 1860000, 
                    economicRank: 11,
                    oil: 10700,
                    gas: 701000,
                    bankRank: 15
                },
                "SAU": { 
                    name: "عربستان سعودی", 
                    code: "SAU",
                    reserves: 323, 
                    production: 250, 
                    gdp: 1100000, 
                    economicRank: 18,
                    oil: 11500,
                    gas: 112000,
                    bankRank: 22
                },
                "IND": { 
                    name: "هند", 
                    code: "IND",
                    reserves: 754, 
                    production: 90, 
                    gdp: 3740000, 
                    economicRank: 5,
                    oil: 800,
                    gas: 32000,
                    bankRank: 8
                },
                "DEU": { 
                    name: "آلمان", 
                    code: "DEU",
                    reserves: 3366, 
                    production: 5, 
                    gdp: 4080000, 
                    economicRank: 4,
                    oil: 220,
                    gas: 68000,
                    bankRank: 6
                },
                "JPN": { 
                    name: "ژاپن", 
                    code: "JPN",
                    reserves: 846, 
                    production: 8, 
                    gdp: 4910000, 
                    economicRank: 3,
                    oil: 120,
                    gas: 3200,
                    bankRank: 4
                },
                "GBR": { 
                    name: "انگلستان", 
                    code: "GBR",
                    reserves: 310, 
                    production: 1, 
                    gdp: 3130000, 
                    economicRank: 6,
                    oil: 950,
                    gas: 42000,
                    bankRank: 7
                },
                "FRA": { 
                    name: "فرانسه", 
                    code: "FRA",
                    reserves: 2436, 
                    production: 2, 
                    gdp: 2930000, 
                    economicRank: 7,
                    oil: 160,
                    gas: 1800,
                    bankRank: 9
                },
                "CAN": { 
                    name: "کانادا", 
                    code: "CAN",
                    reserves: 180, 
                    production: 180, 
                    gdp: 2140000, 
                    economicRank: 9,
                    oil: 5200,
                    gas: 178000,
                    bankRank: 12
                },
                "AUS": { 
                    name: "استرالیا", 
                    code: "AUS",
                    reserves: 79, 
                    production: 320, 
                    gdp: 1540000, 
                    economicRank: 13,
                    oil: 280,
                    gas: 142000,
                    bankRank: 18
                },
                "TUR": { 
                    name: "ترکیه", 
                    code: "TUR",
                    reserves: 478, 
                    production: 120, 
                    gdp: 906000, 
                    economicRank: 19,
                    oil: 65,
                    gas: 450,
                    bankRank: 25
                },
                "BRA": { 
                    name: "برزیل", 
                    code: "BRA",
                    reserves: 129, 
                    production: 60, 
                    gdp: 1920000, 
                    economicRank: 12,
                    oil: 2700,
                    gas: 24300,
                    bankRank: 20
                },
                "ZAF": { 
                    name: "آفریقای جنوبی", 
                    code: "ZAF",
                    reserves: 125, 
                    production: 110, 
                    gdp: 406000, 
                    economicRank: 35,
                    oil: 0,
                    gas: 0,
                    bankRank: 40
                },
                "ARE": { 
                    name: "امارات متحده عربی", 
                    code: "ARE",
                    reserves: 215, 
                    production: 45, 
                    gdp: 501000, 
                    economicRank: 32,
                    oil: 3800,
                    gas: 62000,
                    bankRank: 30
                },
                "NGA": { 
                    name: "نیجریه", 
                    code: "NGA",
                    reserves: 21, 
                    production: 85, 
                    gdp: 395000, 
                    economicRank: 38,
                    oil: 1700,
                    gas: 49000,
                    bankRank: 45
                },
                "EGY": { 
                    name: "مصر", 
                    code: "EGY",
                    reserves: 88, 
                    production: 35, 
                    gdp: 477000, 
                    economicRank: 33,
                    oil: 650,
                    gas: 67000,
                    bankRank: 35
                },
                "PAK": { 
                    name: "پاکستان", 
                    code: "PAK",
                    reserves: 64, 
                    production: 2, 
                    gdp: 376000, 
                    economicRank: 44,
                    oil: 85,
                    gas: 39000,
                    bankRank: 50
                },
                "IDN": { 
                    name: "اندونزی", 
                    code: "IDN",
                    reserves: 78, 
                    production: 130, 
                    gdp: 1280000, 
                    economicRank: 27,
                    oil: 740,
                    gas: 89000,
                    bankRank: 32
                },
                "MEX": { 
                    name: "مکزیک", 
                    code: "MEX",
                    reserves: 120, 
                    production: 110, 
                    gdp: 1290000, 
                    economicRank: 26,
                    oil: 1900,
                    gas: 37000,
                    bankRank: 29
                },
                "KOR": { 
                    name: "کره جنوبی", 
                    code: "KOR",
                    reserves: 104, 
                    production: 0, 
                    gdp: 1730000, 
                    economicRank: 14,
                    oil: 0,
                    gas: 0,
                    bankRank: 11
                },
                "ITA": { 
                    name: "ایتالیا", 
                    code: "ITA",
                    reserves: 2451, 
                    production: 0, 
                    gdp: 2010000, 
                    economicRank: 8,
                    oil: 90,
                    gas: 3200,
                    bankRank: 10
                },
                "ESP": { 
                    name: "اسپانیا", 
                    code: "ESP",
                    reserves: 281, 
                    production: 0, 
                    gdp: 1420000, 
                    economicRank: 15,
                    oil: 20,
                    gas: 50,
                    bankRank: 16
                },
                "NLD": { 
                    name: "هلند", 
                    code: "NLD",
                    reserves: 612, 
                    production: 0, 
                    gdp: 1010000, 
                    economicRank: 17,
                    oil: 180,
                    gas: 45000,
                    bankRank: 13
                },
                "CHE": { 
                    name: "سوئیس", 
                    code: "CHE",
                    reserves: 1040, 
                    production: 0, 
                    gdp: 840000, 
                    economicRank: 20,
                    oil: 0,
                    gas: 0,
                    bankRank: 5
                }
            },
            "2023": {
                "USA": { reserves: 8000, production: 190, gdp: 25000000, economicRank: 1, oil: 12500, gas: 920000, bankRank: 1 },
                "CHN": { reserves: 1900, production: 340, gdp: 17500000, economicRank: 2, oil: 4700, gas: 205000, bankRank: 3 },
                "IRN": { reserves: 420, production: 80, gdp: 1580000, economicRank: 26, oil: 3050, gas: 255000, bankRank: 28 }
            },
            "2022": {
                "USA": { reserves: 7900, production: 185, gdp: 24500000, economicRank: 1, oil: 12300, gas: 910000, bankRank: 1 },
                "CHN": { reserves: 1850, production: 330, gdp: 17000000, economicRank: 2, oil: 4600, gas: 200000, bankRank: 3 }
            }
        };
    }
}

// راه‌اندازی نقشه
let worldGoldMap;

document.addEventListener('DOMContentLoaded', function() {
    if (typeof d3 !== 'undefined' && typeof topojson !== 'undefined') {
        setTimeout(() => {
            worldGoldMap = new WorldGoldMap();
        }, 100);
    } else {
        console.error('کتابخانه‌های D3.js و TopoJSON باید بارگذاری شوند');
    }
});
