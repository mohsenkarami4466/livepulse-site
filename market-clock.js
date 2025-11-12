// ==================== کامپوننت ساعت بازار حرفه‌ای ====================
class MarketClock {
    constructor() {
        this.containerId = 'marketClockWidget';
        this.markets = [];
        this.animationId = null;
        
        // تنظیمات رنگ
        this.colors = {
            earth: 'rgba(30, 41, 59, 0.95)',
            continents: 'rgba(148, 163, 184, 0.3)',
            open: '#00ff88',
            opening: '#ffee55',
            closing: '#ff6b6b',
            timelineOpen: 'rgba(255, 238, 85, 0.7)',
            timelineClosing: 'rgba(255, 107, 107, 0.7)'
        };
    }

    // راه‌اندازی اولیه
    init() {
        console.log('🕒 راه‌اندازی ساعت بازار...');
        this.createContainer();
        this.createCanvas();
        this.createSVG();
        this.loadMarkets();
        this.startAnimation();
        this.setupInteractions();
    }

    // ایجاد کانتینر اصلی
    createContainer() {
        // حذف اگر وجود دارد
        const existing = document.getElementById(this.containerId);
        if (existing) existing.remove();

        const container = document.createElement('div');
        container.id = this.containerId;
        container.className = 'market-clock-widget';
        
        // موقعیت ثابت و مطمئن
        container.style.cssText = `
            position: fixed;
            top: 80px;
            left: 20px;
            width: 150px;
            height: 150px;
            z-index: 9998;
            cursor: pointer;
            border-radius: 50%;
            background: rgba(15, 23, 42, 0.9);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        `;

        // اضافه کردن به صفحه
        document.body.appendChild(container);
        this.container = container;
    }

    // ایجاد Canvas برای نقشه
    createCanvas() {
        const canvas = document.createElement('canvas');
        canvas.width = 150;
        canvas.height = 150;
        canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 50%;
        `;

        this.container.appendChild(canvas);
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    // ایجاد SVG برای متن‌ها
    createSVG() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 150 150');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            pointer-events: none;
        `;

        this.container.appendChild(svg);
        this.svg = svg;

        // ایجاد لایه‌های SVG
        this.hoursGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.labelsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.svg.appendChild(this.hoursGroup);
        this.svg.appendChild(this.labelsGroup);
    }

    // بارگذاری بازارها
    loadMarkets() {
        this.markets = [
            {
                id: 'nyse',
                name: 'نیویورک',
                symbol: '🇺🇸',
                lat: 40.7,
                lng: -74.0,
                openUTC: 14,
                closeUTC: 21
            },
            {
                id: 'lse',
                name: 'لندن',
                symbol: '🇬🇧', 
                lat: 51.5,
                lng: -0.1,
                openUTC: 8,
                closeUTC: 16
            },
            {
                id: 'tse',
                name: 'توکیو',
                symbol: '🇯🇵',
                lat: 35.7,
                lng: 139.8,
                openUTC: 0,
                closeUTC: 6
            },
            {
                id: 'tse-iran',
                name: 'تهران',
                symbol: '🇮🇷',
                lat: 35.7,
                lng: 51.4,
                openUTC: 5,
                closeUTC: 9
            }
        ];

        this.drawHourLabels();
    }

    // رسم اعداد ساعت
    drawHourLabels() {
        this.hoursGroup.innerHTML = '';
        
        const center = 75;
        const radius = 60;
        
        for (let hour = 0; hour < 24; hour++) {
            const angle = (hour * 15 - 90) * Math.PI / 180;
            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);
            
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', x);
            text.setAttribute('y', y);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'middle');
            text.setAttribute('class', 'hour-text');
            text.textContent = this.toPersianNumber(hour === 0 ? 24 : hour);
            
            this.hoursGroup.appendChild(text);
        }
    }

    // تبدیل به فارسی
    toPersianNumber(num) {
        const persian = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return num.toString().replace(/\d/g, d => persian[parseInt(d)]);
    }

    // گرفتن زمان UTC
    getCurrentUTC() {
        const now = new Date();
        return now.getUTCHours() + now.getUTCMinutes() / 60;
    }

    // به‌روزرسانی نمایش
    updateDisplay() {
        const currentUTC = this.getCurrentUTC();
        
        this.drawEarth();
        this.drawTimelines(currentUTC);
        this.drawMarketPoints(currentUTC);
        this.updateMarketLabels(currentUTC);
    }

    // رسم زمین
    drawEarth() {
        this.ctx.clearRect(0, 0, 150, 150);
        
        // زمین
        this.ctx.beginPath();
        this.ctx.arc(75, 75, 60, 0, Math.PI * 2);
        this.ctx.fillStyle = this.colors.earth;
        this.ctx.fill();
        
        // شبکه جغرافیایی
        this.drawGrid();
    }

    // رسم شبکه
    drawGrid() {
        this.ctx.strokeStyle = this.colors.continents;
        this.ctx.lineWidth = 0.5;
        
        // مدارها
        for (let i = 1; i <= 2; i++) {
            this.ctx.beginPath();
            this.ctx.arc(75, 75, 60 * (i / 3), 0, Math.PI * 2);
            this.ctx.stroke();
        }
        
        // نصف‌النهارها
        for (let i = 0; i < 8; i++) {
            const angle = (i * 45) * Math.PI / 180;
            this.ctx.beginPath();
            this.ctx.moveTo(75, 75);
            this.ctx.lineTo(75 + 60 * Math.cos(angle), 75 + 60 * Math.sin(angle));
            this.ctx.stroke();
        }
    }

    // رسم خطوط زمانی
    drawTimelines(currentUTC) {
        const center = 75;
        const radius = 60;
        
        // خط باز شدن (زرد)
        this.drawTimeline(center, radius, currentUTC, this.colors.timelineOpen);
        
        // خط بسته شدن (قرمز)
        this.drawTimeline(center, radius, currentUTC + 1, this.colors.timelineClosing);
    }

    // رسم یک خط زمانی
    drawTimeline(center, radius, time, color) {
        const angle = (time * 15) * Math.PI / 180;
        
        this.ctx.beginPath();
        this.ctx.moveTo(center, center);
        this.ctx.lineTo(center + radius * Math.cos(angle), center + radius * Math.sin(angle));
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';
        this.ctx.stroke();
    }

    // رسم نقاط بازار
    drawMarketPoints(currentUTC) {
        this.markets.forEach(market => {
            const status = this.getMarketStatus(market, currentUTC);
            if (status !== 'closed') {
                this.drawMarketPoint(market, status);
            }
        });
    }

    // رسم یک نقطه
    drawMarketPoint(market, status) {
        const pos = this.latLngToPoint(market.lat, market.lng);
        const x = 75 + pos.x * 45;
        const y = 75 + pos.y * 45;
        
        let color, size;
        switch(status) {
            case 'open':
                color = this.colors.open;
                size = 3;
                break;
            case 'opening-soon':
                color = this.colors.opening;
                size = 4;
                break;
            case 'closing-soon':
                color = this.colors.closing;
                size = 4;
                break;
        }
        
        // چشمک زن
        const pulse = 0.5 + 0.5 * Math.sin(Date.now() * 0.01);
        
        this.ctx.beginPath();
        this.ctx.arc(x, y, size, 0, Math.PI * 2);
        this.ctx.fillStyle = color;
        this.ctx.globalAlpha = pulse;
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
    }

    // تبدیل مختصات
    latLngToPoint(lat, lng) {
        const phi = (90 - lat) * Math.PI / 180;
        const theta = (lng + 180) * Math.PI / 180;
        
        return {
            x: Math.sin(phi) * Math.cos(theta),
            y: Math.sin(phi) * Math.sin(theta)
        };
    }

    // وضعیت بازار
    getMarketStatus(market, currentUTC) {
        const open = market.openUTC;
        const close = market.closeUTC;
        
        if (close < open) {
            if (currentUTC >= open || currentUTC < close) return 'open';
        } else {
            if (currentUTC >= open && currentUTC < close) return 'open';
        }
        
        const toOpen = (open - currentUTC + 24) % 24;
        if (toOpen <= 1) return 'opening-soon';
        
        const toClose = (close - currentUTC + 24) % 24;
        if (toClose <= 1) return 'closing-soon';
        
        return 'closed';
    }

    // برچسب بازارها
    updateMarketLabels(currentUTC) {
        this.labelsGroup.innerHTML = '';
        
        const active = this.markets.filter(m => this.getMarketStatus(m, currentUTC) !== 'closed')
                                  .slice(0, 2);
        
        active.forEach((market, i) => {
            const angle = (i * 180 - 90) * Math.PI / 180;
            const x = 75 + 50 * Math.cos(angle);
            const y = 75 + 50 * Math.sin(angle);
            
            const status = this.getMarketStatus(market, currentUTC);
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', x);
            text.setAttribute('y', y);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'middle');
            text.setAttribute('class', 'market-label');
            
            if (status === 'open') {
                text.textContent = `${market.symbol} باز`;
            } else {
                text.textContent = market.symbol;
            }
            
            this.labelsGroup.appendChild(text);
        });
    }

    // شروع انیمیشن
    startAnimation() {
        const animate = () => {
            this.updateDisplay();
            this.animationId = requestAnimationFrame(animate);
        };
        animate();
    }

    // تعاملات
    setupInteractions() {
        this.container.addEventListener('click', () => {
            console.log('باز کردن ساعت کامل...');
        });
    }

    // پاک‌سازی
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.container) {
            this.container.remove();
        }
    }
}

// راه‌اندازی
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const clock = new MarketClock();
        clock.init();
        window.marketClock = clock;
    }, 500);
});
