#!/bin/bash
# بررسی وضعیت سرور و باز کردن Firefox در صورت نیاز

PORT=3000
URL="http://localhost:$PORT"

# بررسی اینکه آیا سرور در حال اجرا است
if curl -s -o /dev/null -w "%{http_code}" "$URL" | grep -q "200"; then
    echo "✅ سرور در حال اجرا است روی $URL"
    echo "🌐 باز کردن Firefox..."
    firefox "$URL" 2>/dev/null &
    exit 0
else
    echo "❌ سرور در حال اجرا نیست"
    echo "🚀 راه‌اندازی سرور..."
    
    cd "$(dirname "$0")"
    pkill -f "vite" 2>/dev/null
    sleep 2
    
    npm run dev > /tmp/vite.log 2>&1 &
    sleep 4
    
    # بررسی مجدد
    if curl -s -o /dev/null -w "%{http_code}" "$URL" | grep -q "200"; then
        echo "✅ سرور با موفقیت راه‌اندازی شد"
        echo "🌐 باز کردن Firefox..."
        firefox "$URL" 2>/dev/null &
    else
        echo "❌ خطا در راه‌اندازی سرور"
        echo "📋 بررسی لاگ: tail -20 /tmp/vite.log"
        tail -20 /tmp/vite.log
        exit 1
    fi
fi

