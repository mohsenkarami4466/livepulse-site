# 🚀 راهنمای استفاده از React Version

## ⚠️ مهم: استفاده از Vite Dev Server

**این پروژه React نیاز به Vite dev server دارد!**

### ❌ اشتباه:
- باز کردن `index.html` با Live Server (پورت 5500)
- باز کردن مستقیم فایل HTML در مرورگر

### ✅ درست:
استفاده از Vite dev server:

```bash
npm run dev
```

سپس مرورگر را باز کنید و به آدرس زیر بروید:
```
http://localhost:3000
```

---

## 📋 دستورات

### Development
```bash
npm run dev
```
- سرور development در `http://localhost:3000` راه‌اندازی می‌شود
- Hot Module Replacement (HMR) فعال است
- تغییرات به صورت خودکار reload می‌شوند

### Production Build
```bash
npm run build
```
- فایل‌های production در پوشه `dist/` ساخته می‌شوند

### Preview Production Build
```bash
npm run preview
```
- برای تست build production قبل از deploy

---

## 📁 ساختار پروژه

```
cursor1/
├── src/                    # React source files
│   ├── components/        # React components
│   ├── pages/             # Page components
│   ├── router/            # Routing
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom hooks
│   └── utils/             # Utilities
├── public/                # Static files
│   ├── style.css
│   ├── globe/
│   ├── utils/
│   └── data/
├── index.html             # Entry point (React version)
├── index-vanilla-backup.html  # Backup از vanilla JS version
├── vite.config.js         # Vite configuration
└── package.json           # Dependencies
```

---

## 🔄 Backward Compatibility

- `index-vanilla-backup.html` - نسخه اصلی vanilla JS (برای reference)
- فایل‌های vanilla JS در پروژه باقی مانده‌اند
- می‌توانیم به تدریج migrate کنیم

---

## 🐛 حل مشکلات

### خطای MIME type
اگر خطای `"text/jsx" was blocked` می‌بینید:
- ✅ از `npm run dev` استفاده کنید (نه Live Server)
- ✅ به `http://localhost:3000` بروید (نه `http://127.0.0.1:5500`)

### پورت 3000 در حال استفاده است
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
# یا
pkill -f vite
```

---

## 📝 نکات

1. **همیشه از Vite dev server استفاده کنید** برای React version
2. برای vanilla JS version، می‌توانید از `index-vanilla-backup.html` استفاده کنید
3. فایل‌های static در `public/` قرار دارند و به صورت خودکار serve می‌شوند

---

**آماده برای ادامه migration!** 🚀

