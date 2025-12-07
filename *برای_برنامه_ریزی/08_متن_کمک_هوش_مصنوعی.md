# 🤖 Context برای Agent بعدی

**تاریخ ایجاد:** 2024-12-05  
**هدف:** کمک به agent بعدی برای درک کامل وضعیت پروژه و ادامه کار

---

## 📍 وضعیت فعلی پروژه

### ✅ کارهای تکمیل شده:

**فاز 1: Code Corrections (تکمیل شد)**
1. ✅ استفاده از CONFIG در 3 فایل (23 مورد)
2. ✅ بهبود Error Handling در 2 فایل (9 مورد)
3. ✅ جلوگیری از Duplicate Event Listeners در 2 فایل (20+ مورد)

**فاز 2: Code Improvements (تکمیل شد)**
1. ✅ بررسی Code Duplication - گزارش ایجاد شد
2. ✅ ایجاد utility functions مشترک - 7 function
3. ✅ بهینه‌سازی Performance - debounce و cleanup
4. ✅ بهبود مدیریت State - StateManager ایجاد شد

**جمع:** بیش از 65 مورد بهبود انجام شد

---

## 🎯 کار بعدی: تبدیل به React

**وضعیت:** آماده برای شروع  
**فایل راهنما:** `REACT_MIGRATION_PLAN.md`  
**فایل وضعیت:** `MIGRATION_STATUS.md`

### استراتژی:
- تبدیل تدریجی و مرحله‌ای
- تست بعد از هر مرحله
- بک‌آپ قبل از هر مرحله

### مراحل React Migration:
1. Setup React Project
2. تبدیل Layout و Navigation
3. تبدیل Views (صفحات)
4. تبدیل Cards و Indicators
5. تبدیل Globe Components
6. تبدیل Tools Components
7. تبدیل Modals و UI Components
8. تبدیل State Management
9. تبدیل Utilities و Helpers
10. Testing و Optimization

---

## 📦 بک‌آپ

**بک‌آپ کامل:**
- مسیر: `backups/backup-before-react-20251206-035410.tar.gz`
- حجم: 1.3 MB
- شامل: تمام فایل‌های پروژه (به جز node_modules و .git)
- تاریخ: 2024-12-06 03:54

**نکته:** در صورت نیاز به rollback، از این بک‌آپ استفاده کنید.

---

## 📁 ساختار پروژه

### فایل‌های اصلی:
- `index.html` - صفحه اصلی
- `style.css` - استایل‌های اصلی
- `config.js` - تنظیمات متمرکز
- `script-main.js` - داده‌ها و state
- `script-views.js` - مدیریت صفحات
- `script-globes.js` - مدیریت کره‌ها
- `script-cards.js` - تولید کارت‌ها
- `script-tools.js` - ابزارها
- `script-ui.js` - UI interactions
- `script-init.js` - راه‌اندازی

### فایل‌های Utility:
- `utils/logger.js` - سیستم لاگ
- `utils/error-handler.js` - مدیریت خطا
- `utils/api-helper.js` - helper برای API
- `utils/performance.js` - بهینه‌سازی performance
- `utils/state-manager.js` - مدیریت state
- `utils/globe-helpers.js` - helper functions برای globe

### فایل‌های Globe:
- `globe/financial-globe.js` - کره مالی
- `globe/resources-globe.js` - کره منابع
- `globe/globe-base.js` - کلاس پایه (برای three-globe)

### فایل‌های Documentation:
- `MASTER_PLAN.md` - برنامه کامل کارها
- `REACT_MIGRATION_PLAN.md` - برنامه تبدیل به React/Next.js
- `MIGRATION_STATUS.md` - وضعیت migration
- `WORK_PROGRESS.md` - گزارش پیشرفت
- `CODE_DUPLICATION_REPORT.md` - گزارش duplicate code

---

## 🔧 تکنولوژی‌های استفاده شده

- **Three.js** - برای 3D globes
- **D3.js** - برای نقشه‌های 2D
- **GSAP** - برای انیمیشن‌ها
- **Vanilla JavaScript** - کد اصلی (قبل از React)

---

## 📋 چک‌لیست شروع React Migration

### قبل از شروع:
- [x] بک‌آپ کامل گرفته شد
- [x] تمام کارهای فاز 1 و 2 تکمیل شدند
- [x] Documentation کامل است
- [ ] بررسی Node.js و npm نصب است
- [ ] تصمیم گیری: Vite یا Create React App

### مرحله 1.1: Setup React Project
- [ ] نصب React و ReactDOM
- [ ] Setup build system
- [ ] Setup folder structure
- [ ] Setup routing
- [ ] Setup state management
- [ ] تست: صفحه خالی React نمایش داده شود

---

## ⚠️ نکات مهم

1. **بک‌آپ:** قبل از شروع هر مرحله، بک‌آپ بگیرید
2. **تست:** بعد از هر مرحله، تست کامل انجام دهید
3. **Commit:** بعد از هر مرحله، commit کنید
4. **Documentation:** تمام تغییرات را document کنید
5. **Rollback:** در صورت مشکل، از بک‌آپ استفاده کنید

---

## 🎯 معیارهای موفقیت

### React Migration:
- ✅ تمام صفحات کار کنند
- ✅ تمام features کار کنند
- ✅ Performance بهتر یا برابر باشد
- ✅ کد تمیز‌تر و maintainable‌تر باشد

---

## 📞 در صورت مشکل

1. بررسی `REACT_MIGRATION_PLAN.md` برای جزئیات
2. بررسی `MIGRATION_STATUS.md` برای وضعیت فعلی
3. استفاده از بک‌آپ برای rollback
4. بررسی console برای خطاها

---

**آماده برای شروع React Migration!** 🚀

