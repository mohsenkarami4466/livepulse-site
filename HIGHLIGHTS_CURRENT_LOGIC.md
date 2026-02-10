# 📋 منطق فعلی موقعیت‌یابی Highlights

## 🎯 منطق فعلی (بعد از ساده‌سازی)

### فایل اصلی: `globe/globe-clock.js` (خط 341-389)

```javascript
function updateHighlightsPosition() {
  // 1. جلوگیری از اجرای همزمان
  if (isUpdatingHighlightsPosition) return;
  isUpdatingHighlightsPosition = true;
  
  // 2. پیدا کردن highlights section
  const layoutMain = document.querySelector('.layout-main');
  const highlightsSection = layoutMain?.querySelector('.highlights-section');
  
  // 3. پیدا کردن کارت مجموع دارایی‌ها
  const portfolioCard = document.querySelector('.portfolio-summary-card');
  
  // 4. محاسبه موقعیت
  const portfolioRect = portfolioCard.getBoundingClientRect();
  const layoutMainRect = layoutMain.getBoundingClientRect();
  const distance = portfolioRect.bottom - layoutMainRect.top;
  const marginTop = distance > 0 ? distance + 20 : 20; // 20px پایین‌تر
  
  // 5. اعمال margin-top
  requestAnimationFrame(() => {
    highlightsSection.style.marginTop = `${marginTop}px`;
    highlightsSection.style.setProperty('margin-top', `${marginTop}px`, 'important');
  });
}
```

---

## 🔗 وابستگی‌ها

### 1. **فایل JavaScript**: `globe/globe-clock.js`
   - تابع: `updateHighlightsPosition()`
   - لود می‌شود در: `index.html` (خط 58)

### 2. **فراخوانی**: فقط از `src/components/Portfolio/PortfolioSummary.jsx`
   - بعد از `updatePosition()` (موقعیت‌یابی کارت)
   - تاخیر: 50ms بعد از `updatePosition()`
   - در دو جا:
     - لود اولیه: 500ms + 50ms = 550ms
     - resize: بعد از `updatePosition()` + 50ms

### 3. **المان‌های DOM مورد نیاز**:
   - `.layout-main` (container اصلی)
   - `.highlights-section` (بخش highlights)
   - `.portfolio-summary-card` (کارت مجموع دارایی‌ها)

---

## 📐 فرمول محاسبه

```
1. portfolioRect = portfolioCard.getBoundingClientRect()
2. layoutMainRect = layoutMain.getBoundingClientRect()
3. distance = portfolioRect.bottom - layoutMainRect.top
4. marginTop = distance > 0 ? distance + 20 : 20
```

**نتیجه**: highlights دقیقاً 20px پایین‌تر از کارت portfolio قرار می‌گیرد

---

## ⚠️ مشکلات احتمالی

### 1. **CSS Override**
   - `styles/components/sections.css` ممکن است margin-top را override کند
   - `src/components/Highlights/Highlights.css` هم استایل دارد
   - **راه حل**: inline style با `!important` استفاده شده است

### 2. **Timing Issue**
   - اگر `updateHighlightsPosition()` قبل از render شدن کارت portfolio اجرا شود
   - **راه حل**: تاخیر 50ms بعد از `updatePosition()`

### 3. **Scroll Position**
   - اگر صفحه scroll شده باشد، محاسبه ممکن است اشتباه باشد
   - **راه حل**: `getBoundingClientRect()` موقعیت viewport را می‌دهد

---

## 🔍 بررسی کدهای اضافی

### ✅ حذف شده:
- فراخوانی از `Layout.jsx` (حذف شد)
- کدهای پیچیده view فعال (حذف شد)
- debug logging پیچیده (حذف شد)
- header height calculation (حذف شد)

### ⚠️ باقی مانده:
- `src/utils/highlights-fix.js` - تابع `forceShowHighlights()` (اما margin-top را تغییر نمی‌دهد)
- CSS در `sections.css` و `Highlights.css` (اما inline style با !important override می‌کند)

---

## 🛠️ توصیه برای رفع مشکل

اگر هنوز مشکل دارید:

1. **بررسی console**: آیا `updateHighlightsPosition` فراخوانی می‌شود؟
2. **بررسی timing**: آیا کارت portfolio موقعیت نهایی خود را گرفته است؟
3. **بررسی CSS**: آیا CSS دیگری margin-top را override می‌کند؟
4. **بررسی scroll**: آیا صفحه scroll شده است؟

---

**تاریخ**: 2025-01-27

