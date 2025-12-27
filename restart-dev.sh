#!/bin/bash
# اسکریپت restart کردن سرور development

echo "🛑 متوقف کردن سرورهای قبلی..."
pkill -f "vite" 2>/dev/null
sleep 2

echo "🚀 راه‌اندازی سرور Vite..."
cd "$(dirname "$0")"
npm run dev > /tmp/vite.log 2>&1 &

sleep 3

# بررسی وضعیت سرور
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
    echo "✅ سرور با موفقیت راه‌اندازی شد روی http://localhost:3000"
    echo "📋 لاگ‌ها در /tmp/vite.log ذخیره می‌شوند"
    echo ""
    echo "برای مشاهده لاگ‌ها: tail -f /tmp/vite.log"
    echo "برای باز کردن در Firefox: firefox http://localhost:3000"
else
    echo "❌ خطا در راه‌اندازی سرور. بررسی لاگ: tail -20 /tmp/vite.log"
    tail -20 /tmp/vite.log
fi

