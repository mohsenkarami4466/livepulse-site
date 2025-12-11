# 📊 گزارش Code Duplication در Globe Classes

**تاریخ:** 2024-12-05  
**هدف:** شناسایی و کاهش Code Duplication در کلاس‌های Globe

---

## 🔍 تحلیل Duplicate Code

### کلاس‌های مورد بررسی:
1. `FinancialGlobe` (`globe/financial-globe.js`)
2. `ResourcesGlobe` (`globe/resources-globe.js`)

---

## 📋 منطق مشترک شناسایی شده

### 1. Constructor (100% مشترک)
```javascript
constructor() {
    this.container = null;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.globe = null;
    this.controls = null;
    this.animationId = null;
    this.markers = [];
    this.isInitialized = false;
}
```
**تفاوت:** `ResourcesGlobe` یک `currentFilter` اضافی دارد

---

### 2. init() (100% مشترک)
```javascript
init(containerId) {
    // کد یکسان در هر دو کلاس
}
```

---

### 3. waitAndCreate() (100% مشترک)
```javascript
waitAndCreate() {
    // کد یکسان در هر دو کلاس
    // فقط log message متفاوت است
}
```

---

### 4. createScene() (95% مشترک)
**مشترک:**
- بررسی THREE.js
- ساخت Scene
- ساخت Camera (با محاسبات یکسان)
- ساخت Renderer
- ساخت Controls
- فراخوانی `createGlobe()`, `addLights()`, `addMarkers()`, `setupEvents()`
- شروع animation

**تفاوت:**
- Background color: `0x000814` vs `0x0a0a0f`

---

### 5. createGlobe() (90% مشترک)
**مشترک:**
- ساخت geometry
- ساخت material (با پارامترهای متفاوت)
- بارگذاری texture (با همان logic)
- فراخوانی `addAtmosphere()`

**تفاوت:**
- Material color: `FINANCIAL_COLOR` vs `RESOURCES_COLOR`
- Material shininess, emissive (مقادیر متفاوت)

---

### 6. addAtmosphere() (95% مشترک)
**مشترک:**
- ساخت geometry
- ساخت shader material
- ساخت atmosphere mesh

**تفاوت:**
- Shader color: `vec4(0.3, 0.6, 1.0, 1.0)` vs `vec4(1.0, 0.8, 0.3, 1.0)`
- Intensity calculation: `0.7` vs `0.6`

---

### 7. addLights() (80% مشترک)
**مشترک:**
- ساخت AmbientLight
- ساخت DirectionalLight

**تفاوت:**
- Financial: PointLight با رنگ `0x3b82f6`
- Resources: PointLight (goldLight) با رنگ `0xffd700`
- Intensity multipliers: `1.0` vs `0.8`

---

### 8. animate() (100% مشترک)
```javascript
animate() {
    // کد یکسان در هر دو کلاس
}
```

---

### 9. resetView() (100% مشترک)
```javascript
resetView() {
    // کد یکسان در هر دو کلاس
}
```

---

### 10. destroy() (100% مشترک)
```javascript
destroy() {
    // کد یکسان در هر دو کلاس
}
```

---

### 11. setupEvents() (احتمالاً مشترک)
نیاز به بررسی بیشتر

---

### 12. Instance Management (100% مشترک)
```javascript
var [type]GlobeInstance = null;

function init[Type]Globe(containerId) {
    // کد یکسان
}

function reset[Type]GlobeView() {
    // کد یکسان
}
```

---

## 📊 آمار Duplication

| بخش | درصد مشترک | خطوط کد مشترک (تقریبی) |
|-----|-----------|----------------------|
| Constructor | 100% | ~10 |
| init() | 100% | ~15 |
| waitAndCreate() | 100% | ~25 |
| createScene() | 95% | ~100 |
| createGlobe() | 90% | ~70 |
| addAtmosphere() | 95% | ~30 |
| addLights() | 80% | ~15 |
| animate() | 100% | ~5 |
| resetView() | 100% | ~10 |
| destroy() | 100% | ~25 |
| Instance Management | 100% | ~20 |

**جمع کل:** حدود **325 خط کد مشترک** از **~470 خط کد** در هر کلاس

**درصد Duplication:** حدود **70%**

---

## 🎯 پیشنهاد Refactoring

### گزینه 1: ایجاد BaseGlobe Class (پیشنهادی)
**مزایا:**
- کاهش قابل توجه duplicate code
- نگهداری آسان‌تر
- افزودن قابلیت‌های جدید آسان‌تر

**معایب:**
- نیاز به refactoring کامل
- زمان: 2-3 ساعت

### گزینه 2: استخراج Utility Functions
**مزایا:**
- تغییرات کمتر
- ریسک کمتر

**معایب:**
- کاهش کمتر duplicate code
- زمان: 1-2 ساعت

---

## ✅ تصمیم

**پیشنهاد:** ایجاد `BaseGlobeThree` class برای استخراج منطق مشترک

**مراحل:**
1. ایجاد `globe/base-globe-three.js`
2. استخراج متدهای مشترک
3. Refactor کردن `FinancialGlobe` و `ResourcesGlobe` برای extend کردن `BaseGlobeThree`
4. تست و اطمینان از عملکرد صحیح

---

## 📝 نکات مهم

1. **Abstract Methods:** برخی متدها باید abstract باشند:
   - `addMarkers()` - هر کلاس منطق متفاوتی دارد
   - `createMarker()` - هر کلاس marker متفاوتی می‌سازد

2. **Configurable Values:** مقادیر قابل تنظیم:
   - Background color
   - Material colors
   - Light colors
   - Shader colors

3. **Backward Compatibility:** باید مطمئن شویم که API عمومی تغییر نمی‌کند

---

**آماده برای شروع Refactoring!** 🚀

