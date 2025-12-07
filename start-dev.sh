#!/bin/bash

# 🚀 اسکریپت راه‌اندازی سریع سرور توسعه و Firefox
# استفاده: ./start-dev.sh

echo "🚀 در حال راه‌اندازی سرور توسعه..."

# رفتن به فولدر پروژه
cd "$(dirname "$0")"

# بررسی اینکه آیا سرور قبلاً در حال اجراست
if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1 || lsof -Pi :3002 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  سرور قبلاً در حال اجراست!"
    PORT=$(lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1 && echo "5173" || echo "3002")
    echo "✅ باز کردن Firefox در پورت $PORT..."
    firefox "http://localhost:$PORT" 2>/dev/null &
    exit 0
fi

# اجرای سرور در background
echo "📦 در حال اجرای npm run dev..."
npm run dev > /tmp/vite-dev.log 2>&1 &
DEV_PID=$!

# منتظر ماندن تا سرور راه بیفتد
echo "⏳ منتظر راه‌اندازی سرور..."
sleep 5

# پیدا کردن پورت
PORT="5173"
if ! curl -s "http://localhost:5173" > /dev/null 2>&1; then
    # اگر 5173 کار نکرد، پورت‌های دیگر را چک کن
    for p in 3002 3000 3001 5174; do
        if curl -s "http://localhost:$p" > /dev/null 2>&1; then
            PORT=$p
            break
        fi
    done
fi

echo "✅ سرور روی پورت $PORT راه‌اندازی شد!"
echo "🌐 باز کردن Firefox..."

# باز کردن Firefox
firefox "http://localhost:$PORT" 2>/dev/null &

echo ""
echo "✨ آماده است!"
echo "📝 برای مشاهده لاگ‌ها: tail -f /tmp/vite-dev.log"
echo "🛑 برای توقف سرور: kill $DEV_PID"
echo ""
echo "PID سرور: $DEV_PID"

