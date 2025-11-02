// نقشه طلای جهان - نسخه کاملاً اصلاح شده
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
            'USA': { name: 'ایالات متحده', reserves: 8133, production: 200, gdp: 25462 },
            'CHN': { name: 'چین', reserves: 1948, production: 365, gdp: 17963 },
            'DEU': { name: 'آلمان', reserves: 3356, production: 0, gdp: 4082 },
            'RUS': { name: 'روسیه', reserves: 2299, production: 310, gdp: 1830 },
            'FRA': { name: 'فرانسه', reserves: 2436, production: 0, gdp: 2937 },
            'ITA': { name: 'ایتالیا', reserves: 2451, production: 0, gdp: 2090 },
            'ZAF': { name: 'آفریقای جنوبی', reserves: 125, production: 110, gdp: 405 },
            'AUS': { name: 'استرالیا', reserves: 79, production: 320, gdp: 1693 },
            'CAN': { name: 'کانادا', reserves: 0, production: 180, gdp: 2145 },
            'BRA': { name: 'برزیل', reserves: 129, production: 60, gdp: 1920 },
            'IND': { name: 'هند', reserves: 768, production: 2, gdp: 3540 },
            'TUR': { name: 'ترکیه', reserves: 440, production: 42, gdp: 906 },
            'IRN': { name: 'ایران', reserves: 320, production: 8, gdp: 367 },
            'GBR': { name: 'انگلیس', reserves: 310, production: 0, gdp: 3187 },
            'JPN': { name: 'ژاپن', reserves: 846, production: 0, gdp: 4925 },
            'SAU': { name: 'عربستان', reserves: 323, production: 0, gdp: 1107 }
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
            this.worldAtlas = await d3.json('world-map.json');
            console.log('✅ فایل نقشه لود شد');
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

        container.html('');

        this.svg = container.append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('background', '#0f172a')
            .style('border-radius', '8px');

        this.projection = d3.geoNaturalEarth1()
            .scale(width / 5.5)
            .translate([width / 2, height / 2])
            .center([0, 0]);

        this.path = d3.geoPath().projection(this.projection);

        this.mapGroup = this.svg.append('g');
        this.dataGroup = this.svg.append('g');

        this.drawMap();
        this.setupZoom();
        this.setupTooltip();
    }

    drawMap() {
        if (!this.worldAtlas) {
            console.error('❌ داده‌های نقشه موجود نیست');
            return;
        }

        try {
            const countries = topojson.feature(this.worldAtlas, this.worldAtlas.objects.countries);
            console.log(`🇺🇳 تعداد کشورها: ${countries.features.length}`);

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

            setTimeout(() => {
                this.addDataLabels(countries.features);
            }, 100);

        } catch (error) {
            console.error('❌ خطا در رسم نقشه:', error);
        }
    }

    addDataLabels(countries) {
        console.log('🏷️ در حال اضافه کردن برچسب داده‌ها...');
        
        this.dataGroup.selectAll('.data-label').remove();

        const visibleCountries = countries.filter(d => {
            const data = this.getCountryDataByNumericCode(d.id);
            return data && data[this.currentMode] > 0;
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
                const data = this.getCountryDataByNumericCode(d.id);
                if (!data) return '';
                
                const value = data[this.currentMode];
                if (value < 10) return value.toString();
                if (value < 1000) return this.formatNumber(value);
                return (value / 1000).toFixed(1) + 'K';
            });

        console.log('✅ برچسب داده‌ها اضافه شد');
    }

    // تابع جدید برای تبدیل کد عددی به حرفی
    getCountryDataByNumericCode(numericCode) {
        const codeMap = {
            '004': 'AFG', '008': 'ALB', '012': 'DZA', '016': 'ASM', '020': 'AND',
            '024': 'AGO', '028': 'ATG', '032': 'ARG', '036': 'AUS', '040': 'AUT',
            '044': 'BHS', '048': 'BHR', '050': 'BGD', '051': 'ARM', '052': 'BRB',
            '056': 'BEL', '060': 'BMU', '064': 'BTN', '068': 'BOL', '070': 'BIH',
            '072': 'BWA', '076': 'BRA', '084': 'BLZ', '086': 'IOT', '090': 'SLB',
            '092': 'VGB', '096': 'BRN', '100': 'BGR', '104': 'MMR', '108': 'BDI',
            '112': 'BLR', '116': 'KHM', '120': 'CMR', '124': 'CAN', '132': 'CPV',
            '136': 'CYM', '140': 'CAF', '144': 'LKA', '148': 'TCD', '152': 'CHL',
            '156': 'CHN', '158': 'TWN', '162': 'CXR', '166': 'CCK', '170': 'COL',
            '174': 'COM', '175': 'MYT', '178': 'COG', '180': 'COD', '184': 'COK',
            '188': 'CRI', '191': 'HRV', '192': 'CUB', '196': 'CYP', '203': 'CZE',
            '204': 'BEN', '208': 'DNK', '212': 'DMA', '214': 'DOM', '218': 'ECU',
            '222': 'SLV', '226': 'GNQ', '231': 'ETH', '232': 'ERI', '233': 'EST',
            '234': 'FRO', '238': 'FLK', '239': 'SGS', '242': 'FJI', '246': 'FIN',
            '248': 'ALA', '250': 'FRA', '254': 'GUF', '258': 'PYF', '260': 'ATF',
            '262': 'DJI', '266': 'GAB', '268': 'GEO', '270': 'GMB', '275': 'PSE',
            '276': 'DEU', '288': 'GHA', '292': 'GIB', '296': 'KIR', '300': 'GRC',
            '304': 'GRL', '308': 'GRD', '312': 'GLP', '316': 'GUM', '320': 'GTM',
            '324': 'GIN', '328': 'GUY', '332': 'HTI', '334': 'HMD', '336': 'VAT',
            '340': 'HND', '344': 'HKG', '348': 'HUN', '352': 'ISL', '356': 'IND',
            '360': 'IDN', '364': 'IRN', '368': 'IRQ', '372': 'IRL', '376': 'ISR',
            '380': 'ITA', '384': 'CIV', '388': 'JAM', '392': 'JPN', '398': 'KAZ',
            '400': 'JOR', '404': 'KEN', '408': 'PRK', '410': 'KOR', '414': 'KWT',
            '417': 'KGZ', '418': 'LAO', '422': 'LBN', '426': 'LSO', '428': 'LVA',
            '430': 'LBR', '434': 'LBY', '438': 'LIE', '440': 'LTU', '442': 'LUX',
            '446': 'MAC', '450': 'MDG', '454': 'MWI', '458': 'MYS', '462': 'MDV',
            '466': 'MLI', '470': 'MLT', '474': 'MTQ', '478': 'MRT', '480': 'MUS',
            '484': 'MEX', '492': 'MCO', '496': 'MNG', '498': 'MDA', '499': 'MNE',
            '500': 'MSR', '504': 'MAR', '508': 'MOZ', '512': 'OMN', '516': 'NAM',
            '520': 'NRU', '524': 'NPL', '528': 'NLD', '531': 'CUW', '533': 'ABW',
            '534': 'SXM', '535': 'BES', '540': 'NCL', '548': 'VUT', '554': 'NZL',
            '558': 'NIC', '562': 'NER', '566': 'NGA', '570': 'NIU', '574': 'NFK',
            '578': 'NOR', '580': 'MNP', '581': 'UMI', '583': 'FSM', '584': 'MHL',
            '585': 'PLW', '586': 'PAK', '591': 'PAN', '598': 'PNG', '600': 'PRY',
            '604': 'PER', '608': 'PHL', '612': 'PCN', '616': 'POL', '620': 'PRT',
            '624': 'GNB', '626': 'TLS', '630': 'PRI', '634': 'QAT', '638': 'REU',
            '642': 'ROU', '643': 'RUS', '646': 'RWA', '652': 'BLM', '654': 'SHN',
            '659': 'KNA', '660': 'AIA', '662': 'LCA', '663': 'MAF', '666': 'SPM',
            '670': 'VCT', '674': 'SMR', '678': 'STP', '682': 'SAU', '686': 'SEN',
            '688': 'SRB', '690': 'SYC', '694': 'SLE', '702': 'SGP', '703': 'SVK',
            '704': 'VNM', '705': 'SVN', '706': 'SOM', '710': 'ZAF', '716': 'ZWE',
            '724': 'ESP', '728': 'SSD', '729': 'SDN', '732': 'ESH', '740': 'SUR',
            '744': 'SJM', '748': 'SWZ', '752': 'SWE', '756': 'CHE', '760': 'SYR',
            '762': 'TJK', '764': 'THA', '768': 'TGO', '772': 'TKL', '776': 'TON',
            '780': 'TTO', '784': 'ARE', '788': 'TUN', '792': 'TUR', '795': 'TKM',
            '796': 'TCA', '798': 'TUV', '800': 'UGA', '804': 'UKR', '807': 'MKD',
            '818': 'EGY', '826': 'GBR', '831': 'GGY', '832': 'JEY', '833': 'IMN',
            '834': 'TZA', '840': 'USA', '850': 'VIR', '854': 'BFA', '858': 'URY',
            '860': 'UZB', '862': 'VEN', '876': 'WLF', '882': 'WSM', '887': 'YEM',
            '894': 'ZMB'
        };
        
        const countryCode = codeMap[numericCode];
        if (!countryCode) return null;
        
        return this.worldData[this.currentYear]?.[countryCode];
    }

    getCountryColor(countryData) {
        const numericCode = countryData.id;
        const data = this.getCountryDataByNumericCode(numericCode);
        
        if (!data) return '#4b5563';
        
        const value = data[this.currentMode];
        if (value === 0 || value === undefined) return '#4b5563';

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

        const numericCode = countryData.id;
        const data = this.getCountryDataByNumericCode(numericCode);
        
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
                        ${this.selectedCountries.some(c => c.numericCode === numericCode) ? '✓ انتخاب شده' : 'برای مقایسه کلیک کنید'}
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

        const numericCode = countryData.id;
        const data = this.getCountryDataByNumericCode(numericCode);
        
        if (!data) return;

        const existingIndex = this.selectedCountries.findIndex(c => c.numericCode === numericCode);
        
        if (existingIndex > -1) {
            this.selectedCountries.splice(existingIndex, 1);
            d3.select(event.currentTarget).classed('selected', false);
        } else {
            if (this.selectedCountries.length >= 2) {
                const removedCountry = this.selectedCountries.shift();
                this.mapGroup.selectAll(`.country[data-code="${removedCountry.numericCode}"]`).classed('selected', false);
            }
            
            this.selectedCountries.push({ 
                numericCode: numericCode,
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
                        <button class="country-card-remove" onclick="goldMap.removeCountry('${country.numericCode}')">×</button>
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

    removeCountry(numericCode) {
        this.selectedCountries = this.selectedCountries.filter(c => c.numericCode !== numericCode);
        this.mapGroup.selectAll('.country').classed('selected', false);
        this.selectedCountries.forEach(country => {
            this.mapGroup.selectAll(`.country[data-code="${country.numericCode}"]`).classed('selected', true);
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
                    country.data = this.getCountryDataByNumericCode(country.numericCode);
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

        window.addEventListener('resize', () => {
            setTimeout(() => {
                this.setupMap();
            }, 500);
        });
    }

    updateMap() {
        console.log('🔄 آپدیت نقشه...');
        
        this.countryPaths
            .style('fill', d => this.getCountryColor(d));

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

let goldMap;
document.addEventListener('DOMContentLoaded', function() {
    goldMap = new GoldMap();
});
