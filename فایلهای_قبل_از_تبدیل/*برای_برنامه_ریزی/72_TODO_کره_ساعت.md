# 📝 TODO: رفع مشکل Globe Clock

**تاریخ:** 2024-12-06  
**وضعیت:** ⏳ **برای بعد**

---

## ❌ مشکلات فعلی

1. **Visibility:** فقط هاله اطراف Globe Clock دیده می‌شود، خود کره دیده نمی‌شود
2. **Positioning:** Globe Clock زیر header است، باید بالاتر باشد (در کد اصلی: بالا و سمت چپ)
3. **Rendering:** کره Three.js ممکن است درست رندر نشود

---

## 🔍 بررسی‌های لازم

### 1. بررسی کد اصلی
- `index-vanilla-backup.html` - خط 24-29: موقعیت Globe Clock
- `public/style.css` - خط 364-378: CSS برای `.globe-clock-wrapper`
- `script-globes.js` - تابع `updateGlobePosition()`: تنظیم موقعیت
- `script-globes.js` - تابع `initGlobe()`: راه‌اندازی کره

### 2. بررسی React Component
- `src/components/Globes/GlobeClock.jsx` - بررسی useEffect و refs
- `src/components/Globes/GlobeClock.css` - بررسی CSS override ها
- `src/components/Layout/Layout.jsx` - بررسی قرارگیری در Layout

### 3. بررسی Three.js
- آیا `window.initGlobe` فراخوانی می‌شود؟
- آیا `#globeContainer` درست پیدا می‌شود؟
- آیا Three.js scene درست ساخته می‌شود؟

---

## ✅ راه حل‌های احتمالی

1. **Positioning:**
   - بررسی `updateGlobePosition()` و اطمینان از فراخوانی
   - تنظیم `top` بر اساس ارتفاع header
   - استفاده از `position: fixed` با `top` مناسب

2. **Visibility:**
   - بررسی z-index
   - بررسی opacity و visibility
   - بررسی اینکه آیا Three.js canvas درست رندر می‌شود

3. **Rendering:**
   - اطمینان از اینکه `initGlobe()` بعد از mount فراخوانی می‌شود
   - بررسی اینکه container درست پیدا می‌شود
   - بررسی console برای خطاهای Three.js

---

## 📝 یادداشت

این مشکل را بعد از تکمیل React Migration حل می‌کنیم با مراجعه به کدهای قدیمی.

