// کره مالی ۳D با اطلاعات بازارها
class FinancialGlobe extends GlobeBase {
  constructor(containerId) {
    super(containerId, mockFinancialData);
    this.markers = [];
  }

  initialize() {
    // ایجاد کره پایه
    const globe = this.createBaseGlobe();
    
    if (!globe) {
      console.error('نتوانستیم کره مالی رو ایجاد کنیم');
      return this;
    }
    
    // اضافه کردن markers بازارهای مالی
    this.addFinancialMarkers();
    
    return this;
  }

  addFinancialMarkers() {
    if (!this.globe) return;

    this.markers = mockFinancialData.map(point => ({
      lat: point.lat,
      lng: point.lng,
      size: point.status === 'open' ? 0.5 : 0.3,
      color: point.color,
      tooltip: createTooltipHTML(point, 'financial')
    }));

    // اضافه کردن markers به کره
    this.globe
      .pointsData(this.markers)
      .pointAltitude(0)
      .pointRadius('size')
      .pointColor('color')
      .pointLabel('tooltip');
  }

  addInteractions() {
    // اضافه کردن خطوط بین بازارهای مهم (اختیاری)
    const arcs = [
      { startLat: 40.7128, startLng: -74.0060, endLat: 51.5074, endLng: -0.1278 }, // NY-London
      { startLat: 51.5074, startLng: -0.1278, endLat: 35.6895, endLng: 139.6917 }, // London-Tokyo
    ];

    this.globe
      .arcsData(arcs)
      .arcColor(() => ['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.3)'])
      .arcStroke(0.2)
      .arcDashLength(0.5)
      .arcDashGap(1)
      .arcDashAnimateTime(2000);
  }

  // آپدیت وضعیت بازارها (real-time)
  updateMarketStatus() {
    // بعداً با داده real-time پر می‌شود
    console.log('آپدیت وضعیت بازارها...');
  }
}
