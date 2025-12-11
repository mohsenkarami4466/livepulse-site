#!/bin/bash
# اسکریپت ساده برای deploy

echo "🔨 در حال build..."
npm run build

echo "📦 در حال کپی به docs..."
rm -rf docs/*
cp -r dist/* docs/
cp .nojekyll docs/

echo "✅ آماده برای commit!"
echo ""
echo "حالا این دستورات را اجرا کنید:"
echo "  git add docs/"
echo "  git commit -m 'deploy'"
echo "  git push origin main"

