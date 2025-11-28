// توابع پایه و مشترک برای هر دو کره
class GlobeBase {
  constructor(containerId, data) {
    this.containerId = containerId;
    this.data = data;
    this.globe = null;
    this.initialView = { lat: 0, lng: 0, altitude: 1.5 };
  }

  // ایجاد کره پایه
  createBaseGlobe() {
    const globeElement = document.getElementById(this.containerId);
    
    // چک کن که المان وجود داره
    if (!globeElement) {
      console.error('المان پیدا نشد:', this.containerId);
      return null;
    }

    // پاک کردن محتوای قبلی
    globeElement.innerHTML = '';

    try {
      this.globe = Globe()
        .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
        .backgroundImageUrl('https://unpkg.com/three-globe/example/img/night-sky.png')
        .width(globeElement.clientWidth)
        .height(globeElement.clientHeight)
        .pointOfView(this.initialView, 0);

      // اضافه کردن به DOM
      globeElement.appendChild(this.globe());
      
      console.log('✅ کره ساخته شد برای:', this.containerId);
      return this.globe;
    } catch (error) {
      console.error('خطا در ساخت کره:', error);
      return null;
    }
  }

  // ریست کردن دید به حالت اولیه
  resetView() {
    if (this.globe) {
      this.globe.pointOfView(this.initialView, 1000);
    }
  }

  // هندل کردن ریزپانسیو
  handleResize() {
    if (this.globe) {
      const container = document.getElementById(this.containerId);
      this.globe.width(container.clientWidth);
      this.globe.height(container.clientHeight);
    }
  }
}

// تابع کمکی برای ایجاد HTML tooltip
function createTooltipHTML(data, type) {
  if (type === 'financial') {
    return `
      <div class="tooltip financial-tooltip">
        <h3>${data.name}</h3>
        <p>📍 کشور: ${data.country}</p>
        <p>🕒 ساعت کار: ${data.hours}</p>
        <p>📊 وضعیت: <span class="status-${data.status}">${data.status === 'open' ? '🟢 باز' : '🔴 بسته'}</span></p>
        <p>💰 قیمت طلا: $${data.indicators.goldPrice}</p>
      </div>
    `;
  } else {
    return `
      <div class="tooltip resources-tooltip">
        <h3>${data.name}</h3>
        <p>📍 کشور: ${data.country}</p>
        <p>💎 منبع: ${data.resource}</p>
        <p>📦 ذخایر: ${data.reserves}</p>
        <p>⚡ تولید: ${data.production}</p>
      </div>
    `;
  }
}
