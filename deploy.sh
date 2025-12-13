#!/bin/bash
# اسکریپت ساده برای deploy

echo "🔨 در حال build..."
npm run build

echo "📦 در حال کپی به docs..."
rm -rf docs/*
cp -r dist/* docs/
cp .nojekyll docs/

# کپی index.html به 404.html برای GitHub Pages SPA
if [ -f "docs/index.html" ]; then
  cp docs/index.html docs/404.html
  echo "✅ 404.html از index.html ساخته شد"
else
  echo "⚠️  index.html در docs/ پیدا نشد!"
fi

echo "✅ آماده برای commit!"
echo ""
echo "حالا این دستورات را اجرا کنید:"
echo "  git add docs/"
echo "  git commit -m 'deploy'"
echo "  git push origin main"

