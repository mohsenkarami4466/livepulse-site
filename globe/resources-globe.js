// کره منابع ۳D با اطلاعات منابع طبیعی
class ResourcesGlobe extends GlobeBase {
  constructor(containerId) {
    super(containerId, mockResourcesData);
    this.markers = [];
  }

  initialize() {
    // ایجاد کره پایه
    this.createBaseGlobe();
    
    // اضافه کردن markers منابع طبیعی
    this.addResourceMarkers();
    
    // اضافه کردن تعامل‌ها
    this.addInteractions();
    
    return this;
  }

  addResourceMarkers() {
    if (!this.globe) return;

    this.markers = mockResourcesData.map(point => ({
      lat: point.lat,
      lng: point.lng,
      size: 0.4,
      color: point.color,
      tooltip: createTooltipHTML(point, 'resources')
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
    // اضافه کردن rings برای تأکید روی مناطق مهم
    const rings = mockResourcesData.map(point => ({
      lat: point.lat,
      lng: point.lng,
      color: point.color,
      maxRadius: 2,
      propagationSpeed: 1,
      repeatPeriod: 2000
    }));

    this.globe
      .ringsData(rings)
      .ringColor('color')
      .ringMaxRadius('maxRadius')
      .ringPropagationSpeed('propagationSpeed')
      .ringRepeatPeriod('repeatPeriod');
  }

  // فیلتر کردن منابع (اختیاری)
  filterResources(resourceType) {
    const filtered = mockResourcesData.filter(point => 
      point.resource === resourceType
    );
    // آپدیت markers با داده‌های فیلتر شده
  }
}
