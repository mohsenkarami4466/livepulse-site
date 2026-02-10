# 📋 تحلیل کامل موقعیت‌یابی Highlights - تمام کدها و وابستگی‌ها

## 🎯 هدف
این فایل شامل تمام کدها، وابستگی‌ها، منطق‌ها و فایل‌های مرتبط با موقعیت‌یابی highlights است.

---

## 📁 فایل‌های اصلی مرتبط

### 1. فایل‌های JavaScript/React

#### 1.1. `globe/globe-clock.js` ⭐ **فایل اصلی محاسبه موقعیت**
- **تابع اصلی**: `updateHighlightsPosition()` (خط 337-602)
- **تابع wrapper**: `updateHighlightsPositionSafe()` (خط 606-612)
- **Flag جلوگیری از اجرای همزمان**: `isUpdatingHighlightsPosition` (خط 335)
- **منطق محاسبه**:
  - پیدا کردن `.portfolio-summary-card`
  - محاسبه `getBoundingClientRect()` برای portfolio card و layout-main
  - محاسبه فاصله: `portfolioBottomViewport - layoutMainTopViewport + 10px`
  - اعمال `margin-top` با `!important` از طریق inline style
- **وابستگی‌ها**:
  - `.portfolio-summary-card` (کارت مجموع دارایی‌ها)
  - `.layout-main` (container اصلی)
  - `.highlights-section` و کلاس‌های مشابه
- **فراخوانی‌ها**:
  - از `Layout.jsx` (خط 100-101)
  - از `PortfolioSummary.jsx` (خط 278-279, 290-291)
  - از resize event listener در `Layout.jsx` (خط 126)

#### 1.2. `src/components/Layout/Layout.jsx` ⭐ **فراخوانی اصلی**
- **Effect**: خط 95-131
- **فراخوانی اولیه**: setTimeout 600ms (خط 111-113)
- **Resize handler**: debounce 200ms + 100ms delay (خط 118-128)
- **تابع**: `callUpdateHighlights()` (خط 97-107)
- **وابستگی‌ها**:
  - `window.updateHighlightsPosition` از `globe-clock.js`
  - `window.updateHighlightsPositionSafe` (fallback)

#### 1.3. `src/components/Portfolio/PortfolioSummary.jsx` ⭐ **موقعیت‌یابی کارت portfolio**
- **تابع**: `updatePosition()` (خط 184-269)
- **Effect**: خط 183-288
- **فراخوانی اولیه**: setTimeout 500ms (خط 273-281)
- **Resize handler**: خط 285-293
- **فراخوانی `updateHighlightsPosition`**: 
  - بعد از `updatePosition()` در timeout اولیه (خط 277-281)
  - بعد از `updatePosition()` در resize handler (خط 289-293)
- **تاخیر**: 50ms بعد از `updatePosition()`
- **وابستگی‌ها**:
  - `#globeClockWrapper` (کره کوچک)
  - `.indicators-glass-card` (کارت جفت ارزها)
  - `header` (هدر)

#### 1.4. `src/components/Highlights/Highlights.jsx` ⭐ **کامپوننت React**
- **کامپوننت**: `Highlights()` (خط 89-208)
- **کلاس‌های CSS**: `.highlights-section`, `.highlights-container`, `.highlight-circle`
- **وابستگی‌ها**:
  - `useLocation` از react-router-dom
  - `useApp` Context
- **نکته**: این کامپوننت فقط محتوا را render می‌کند، موقعیت از JavaScript تنظیم می‌شود


#### 1.6. `script-views.js` ⚠️ **فایل قدیمی (vanilla JS)**
- **نکته**: در خط 133-139 اشاره می‌کند که `updateHighlightsPosition` حذف شده و در `Layout.jsx` فراخوانی می‌شود
- **کپی‌ها**: `public/script-views.js`, `docs/script-views.js`, `dist/script-views.js`
- **نکته**: این فایل دیگر `updateHighlightsPosition` را فراخوانی نمی‌کند

#### 1.7. `src/App.jsx` ⚠️ **فایل اصلی App**
- **نکته**: در خط 41-43 اشاره می‌کند که `updateHighlightsPosition` در `Layout.jsx` مدیریت می‌شود
- **نکته**: کد مربوط به highlights حذف شده است

#### 1.8. `src/components/Layout/Layout.css` ⚠️ **استایل Layout**
- **نکته**: در خط 27 و 41 اشاره می‌کند که highlights `margin-bottom` دارد
- **نکته**: در خط 30-34 و 72-73 اشاره می‌کند که استایل‌های highlights به `sections.css` منتقل شده‌اند
- **وابستگی‌ها**: `.layout-main`, `.layout-main > .view`

---

### 2. فایل‌های CSS

#### 2.1. `src/components/Highlights/Highlights.css` ⭐ **استایل اصلی**
- **Selector**: `.highlights-section` (خط 16-57)
- **ویژگی‌های مهم**:
  - `position: relative !important` (خط 24)
  - `margin-top`: از JavaScript تنظیم می‌شود (خط 39-40)
  - `margin-left: 5px !important` (خط 41)
  - `margin-right: 5px !important` (خط 42)
  - `height: 80px !important` (خط 35)
  - `width: calc(100vw - 10px) !important` (خط 28)
- **Responsive breakpoints**:
  - Tablet (768px-1023px): خط 166-183
  - Mobile (max-width: 767px): خط 186-205
  - Small Mobile (max-width: 480px): خط 208-226

#### 2.2. `styles/components/sections.css` ⚠️ **استایل قدیمی (ممکن است override کند)**
- **Selector**: `.highlights-section` و کلاس‌های مشابه (خط 283-326)
- **ویژگی‌های مهم**:
  - `position: relative !important` (خط 303)
  - `margin-top`: از JavaScript تنظیم می‌شود (خط 313-314)
  - `height: 80px !important` (خط 309)
  - `width: calc(100vw - 10px) !important` (خط 304)
- **Responsive breakpoints**:
  - Tablet (768px-1023px): خط 368-412
  - Mobile (480px-767px): خط 414-462
  - Small Mobile (max-width: 479px): خط 464-512
  - Very Small (max-width: 390px): خط 514-562
  - Tiny (max-width: 320px): خط 564-608
- **نکته**: این فایل ممکن است با `Highlights.css` تداخل داشته باشد

---

### 3. فایل‌های تکرار شده (کپی در فولدرهای مختلف)

#### 3.1. `globe/globe-clock.js` (اصلی)
- **کپی‌ها**:
  - `public/globe/globe-clock.js` (قدیمی - بدون flag)
  - `docs/globe/globe-clock.js` (قدیمی - بدون flag)
  - `dist/globe/globe-clock.js` (build شده)

#### 3.2. `src/utils/highlights-fix.js` (اصلی)
- **کپی‌ها**:
  - `public/utils/highlights-fix.js`
  - `docs/utils/highlights-fix.js`
  - `dist/utils/highlights-fix.js`

#### 3.3. `styles/components/sections.css` (اصلی)
- **کپی‌ها**:
  - `public/styles/components/sections.css`
  - `docs/styles/components/sections.css`
  - `dist/styles/components/sections.css`

---

## 🔄 ترتیب اجرا و وابستگی‌ها

### ترتیب اجرا در لود اولیه:

1. **React App Mount** → `Layout.jsx` render می‌شود
2. **PortfolioSummary.jsx** → `updatePosition()` با تاخیر 500ms اجرا می‌شود
3. **PortfolioSummary.jsx** → بعد از `updatePosition()`, `updateHighlightsPosition()` با تاخیر 50ms فراخوانی می‌شود
4. **Layout.jsx** → `updateHighlightsPosition()` با تاخیر 600ms فراخوانی می‌شود (backup)

### ترتیب اجرا در Resize:

1. **PortfolioSummary.jsx** → `updatePosition()` اجرا می‌شود
2. **PortfolioSummary.jsx** → بعد از `updatePosition()`, `updateHighlightsPosition()` با تاخیر 50ms فراخوانی می‌شود
3. **Layout.jsx** → `updateHighlightsPosition()` با debounce 200ms + 100ms delay فراخوانی می‌شود

---

## 🧮 منطق محاسبه موقعیت

### فرمول محاسبه:

```javascript
// 1. پیدا کردن موقعیت portfolio card در viewport
portfolioRect = portfolioCard.getBoundingClientRect()
portfolioBottomViewport = portfolioRect.bottom

// 2. پیدا کردن موقعیت layout-main در viewport
layoutMainRect = layoutMain.getBoundingClientRect()
layoutMainTopViewport = layoutMainRect.top

// 3. محاسبه فاصله
distance = portfolioBottomViewport - layoutMainTopViewport

// 4. محاسبه margin-top
if (distance <= 0) {
  marginTop = 10px  // فقط spacing
} else {
  marginTop = distance + 10px  // فاصله + spacing
}
```

### مقادیر ثابت:
- **spacing**: 10px (خط 412 در `globe-clock.js`)
- **height highlights-section**: 80px (دسکتاپ), 70px (تبلت), 60px (موبایل)

---

## ⚠️ مشکلات احتمالی

### 1. **تداخل در فراخوانی‌ها**
- `Layout.jsx` و `PortfolioSummary.jsx` هر دو `updateHighlightsPosition()` را فراخوانی می‌کنند
- ممکن است چند بار اجرا شود و موقعیت تغییر کند

### 2. **تاخیرهای مختلف**
- `PortfolioSummary`: 500ms + 50ms = 550ms
- `Layout`: 600ms
- ممکن است ترتیب اجرا مشکل ایجاد کند

### 3. **CSS Override**
- `sections.css` و `Highlights.css` ممکن است با هم تداخل داشته باشند
- `!important` در هر دو فایل استفاده شده

### 4. **Resize Event**
- دو resize handler وجود دارد:
  - در `PortfolioSummary.jsx` (بدون debounce)
  - در `Layout.jsx` (با debounce)
- ممکن است چند بار اجرا شود

### 5. **Flag Protection**
- فقط در `globe/globe-clock.js` (اصلی) وجود دارد
- در کپی‌های قدیمی (`public/`, `docs/`) وجود ندارد

---

## 🔍 کلاس‌های CSS مرتبط

### Selector های اصلی:
- `.highlights-section` (اصلی)
- `.home-highlights`
- `.news-highlights`
- `.tools-highlights`
- `.education-highlights`
- `.relax-highlights`
- `.globe-highlights`

### Container:
- `.highlights-container`

### Items:
- `.highlight-circle`

### وابستگی‌ها:
- `.layout-main` (parent container)
- `.portfolio-summary-card` (مرجع موقعیت)
- `header` (fallback)

---

## 📊 خلاصه فایل‌ها

| فایل | نوع | نقش | اولویت |
|------|-----|-----|--------|
| `globe/globe-clock.js` | JS | محاسبه و اعمال موقعیت | ⭐⭐⭐ |
| `src/components/Layout/Layout.jsx` | React | فراخوانی تابع | ⭐⭐⭐ |
| `src/components/Portfolio/PortfolioSummary.jsx` | React | موقعیت کارت + فراخوانی | ⭐⭐⭐ |
| `src/components/Highlights/Highlights.jsx` | React | Render کامپوننت | ⭐⭐ |
| `src/components/Highlights/Highlights.css` | CSS | استایل اصلی | ⭐⭐ |
| `styles/components/sections.css` | CSS | استایل قدیمی | ⭐ |
| `src/utils/highlights-fix.js` | JS | فیکس استایل‌ها | ⭐ |
| `src/components/Layout/Layout.css` | CSS | استایل layout | ⭐ |
| `script-views.js` | JS | فایل قدیمی (غیرفعال) | - |

---

## 🛠️ توصیه‌های اصلاح

### 1. یکسان‌سازی فراخوانی‌ها
- فقط از یک جا `updateHighlightsPosition()` را فراخوانی کنید
- پیشنهاد: فقط از `PortfolioSummary.jsx` بعد از `updatePosition()`

### 2. حذف کپی‌های قدیمی
- فایل‌های در `public/`, `docs/`, `dist/` را به‌روزرسانی یا حذف کنید

### 3. یکسان‌سازی CSS
- یکی از `sections.css` یا `Highlights.css` را به عنوان اصلی انتخاب کنید
- یا merge کنید

### 4. بهبود Flag Protection
- مطمئن شوید flag در همه نسخه‌ها وجود دارد

### 5. کاهش تاخیرها
- تاخیرها را بهینه کنید تا سریع‌تر اجرا شود

---

## 📝 نکات مهم

1. **موقعیت highlights از JavaScript تنظیم می‌شود** - CSS فقط استایل‌های پایه را تعریف می‌کند
2. **margin-top با inline style و !important اعمال می‌شود** - برای override کردن CSS
3. **کارت portfolio با position: fixed است** - در viewport است، نه در document flow
4. **layout-main در document flow است** - موقعیت آن با scroll تغییر می‌کند
5. **محاسبه بر اساس viewport coordinates است** - `getBoundingClientRect()` استفاده می‌شود

---

## 🐛 مشکلات شناسایی شده

### مشکل 1: فراخوانی‌های تکراری
- **مکان**: `Layout.jsx` و `PortfolioSummary.jsx` هر دو `updateHighlightsPosition()` را فراخوانی می‌کنند
- **تاثیر**: ممکن است موقعیت highlights چند بار تغییر کند
- **راه حل**: فقط از `PortfolioSummary.jsx` بعد از `updatePosition()` فراخوانی شود

### مشکل 2: تاخیرهای مختلف
- **مکان**: 
  - `PortfolioSummary`: 500ms + 50ms = 550ms
  - `Layout`: 600ms
- **تاثیر**: ممکن است ترتیب اجرا مشکل ایجاد کند
- **راه حل**: یکسان‌سازی تاخیرها

### مشکل 3: CSS Override
- **مکان**: `sections.css` و `Highlights.css` هر دو استایل highlights را تعریف می‌کنند
- **تاثیر**: ممکن است استایل‌ها با هم تداخل داشته باشند
- **راه حل**: یکی را به عنوان اصلی انتخاب کنید یا merge کنید

### مشکل 4: فایل‌های کپی قدیمی
- **مکان**: `public/`, `docs/`, `dist/` شامل نسخه‌های قدیمی هستند
- **تاثیر**: ممکن است نسخه قدیمی اجرا شود
- **راه حل**: به‌روزرسانی یا حذف کپی‌ها

### مشکل 5: Flag Protection ناقص
- **مکان**: فقط در `globe/globe-clock.js` (اصلی) وجود دارد
- **تاثیر**: در کپی‌های قدیمی ممکن است چند بار اجرا شود
- **راه حل**: به‌روزرسانی همه نسخه‌ها

---

## ✅ راه حل پیشنهادی

### مرحله 1: یکسان‌سازی فراخوانی‌ها
```javascript
// فقط در PortfolioSummary.jsx بعد از updatePosition()
updatePosition()
setTimeout(() => {
  if (typeof window.updateHighlightsPosition === 'function') {
    window.updateHighlightsPosition()
  }
}, 50)
```

### مرحله 2: حذف فراخوانی از Layout.jsx
```javascript
// حذف یا comment کردن فراخوانی از Layout.jsx
// چون PortfolioSummary خودش فراخوانی می‌کند
```

### مرحله 3: یکسان‌سازی CSS
- انتخاب `Highlights.css` به عنوان اصلی
- حذف یا comment کردن استایل‌های highlights از `sections.css`

### مرحله 4: به‌روزرسانی کپی‌ها
- به‌روزرسانی `public/globe/globe-clock.js` با flag
- به‌روزرسانی `docs/globe/globe-clock.js` با flag

---

**تاریخ ایجاد**: 2025-01-27
**آخرین بروزرسانی**: 2025-01-27

