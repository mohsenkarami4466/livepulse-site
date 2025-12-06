/**
 * 🎴 Helper functions for Cards
 */

/**
 * ⏱️ دریافت زمان آخرین آپدیت
 */
export function getLastUpdateTime() {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const seconds = now.getSeconds().toString().padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

/**
 * 💰 فرمت کردن قیمت
 */
export function formatPrice(price, symbol) {
  if (!price && price !== 0) return 'N/A'
  
  // برای ارزها
  if (['USD', 'EUR', 'GBP', 'TRY', 'AED', 'CAD', 'AUD', 'CNY', 'JPY', 'CHF'].includes(symbol)) {
    return new Intl.NumberFormat('fa-IR').format(Math.round(price)) + ' تومان'
  }
  
  // برای طلا
  if (symbol === 'GOLD' || symbol.includes('GOLD')) {
    return new Intl.NumberFormat('fa-IR').format(Math.round(price)) + ' تومان'
  }
  
  // برای رمزارزها
  if (['BTC', 'ETH', 'TRX', 'DOGE', 'XRP', 'ADA', 'BNB', 'SOL', 'DOT', 'MATIC'].includes(symbol)) {
    return '$' + new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price)
  }
  
  // برای شاخص‌ها
  if (symbol === 'TEDPIX' || symbol.includes('INDEX')) {
    return new Intl.NumberFormat('fa-IR').format(Math.round(price))
  }
  
  // پیش‌فرض
  return new Intl.NumberFormat('fa-IR').format(Math.round(price))
}

/**
 * 📊 تولید نمودار SVG مینی برای کارت - سبک کندل‌استیک حرفه‌ای
 */
export function generateMiniChartSVG(symbol, isUp) {
  const seed = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const candleCount = 12 // تعداد کندل‌ها
  const candles = []
  
  // تولید داده‌های کندل
  let basePrice = 50
  
  for (let i = 0; i < candleCount; i++) {
    const noise = Math.sin(seed * 0.1 + i * 0.8) * 15 + Math.cos(seed * 0.2 + i * 0.5) * 10
    const trend = isUp ? i * 1.5 : -i * 1.5
    
    const open = basePrice + noise * 0.3
    const close = open + (Math.random() - 0.5) * 8 + (isUp ? 2 : -2)
    const high = Math.max(open, close) + Math.random() * 4 + 1
    const low = Math.min(open, close) - Math.random() * 4 - 1
    
    candles.push({
      open: Math.max(10, Math.min(90, open + trend)),
      close: Math.max(10, Math.min(90, close + trend)),
      high: Math.max(10, Math.min(95, high + trend)),
      low: Math.max(5, Math.min(90, low + trend)),
      isGreen: close > open
    })
    
    basePrice = close
  }
  
  // نرمال‌سازی
  const allValues = candles.flatMap(c => [c.open, c.close, c.high, c.low])
  const minVal = Math.min(...allValues)
  const maxVal = Math.max(...allValues)
  const range = maxVal - minVal || 1
  
  const normalize = (val) => 5 + ((val - minVal) / range) * 90
  
  // ساخت SVG
  const width = 100
  const height = 100
  const candleWidth = width / candleCount * 0.6
  const gap = width / candleCount * 0.4
  
  let svgContent = ''
  
  candles.forEach((candle, i) => {
    const x = i * (candleWidth + gap) + gap / 2
    const openY = height - normalize(candle.open)
    const closeY = height - normalize(candle.close)
    const highY = height - normalize(candle.high)
    const lowY = height - normalize(candle.low)
    
    const bodyTop = Math.min(openY, closeY)
    const bodyHeight = Math.abs(closeY - openY) || 1
    const color = candle.isGreen ? '#22c55e' : '#ef4444'
    
    // فیتیله بالا و پایین
    svgContent += `<line x1="${x + candleWidth/2}" y1="${highY}" x2="${x + candleWidth/2}" y2="${bodyTop}" stroke="${color}" stroke-width="0.8" />`
    svgContent += `<line x1="${x + candleWidth/2}" y1="${bodyTop + bodyHeight}" x2="${x + candleWidth/2}" y2="${lowY}" stroke="${color}" stroke-width="0.8" />`
    
    // بدنه کندل
    svgContent += `<rect x="${x}" y="${bodyTop}" width="${candleWidth}" height="${bodyHeight}" fill="${color}" rx="0.5" />`
  })
  
  // اضافه کردن خط روند
  const trendPoints = candles.map((c, i) => {
    const x = i * (candleWidth + gap) + gap / 2 + candleWidth / 2
    const y = height - normalize((c.open + c.close) / 2)
    return `${x},${y}`
  })
  
  const uniqueId = `trend-${symbol}-${Date.now()}-${Math.random()}`
  const trendColor = isUp ? '#22c55e' : '#ef4444'
  
  return `
    <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" style="width:100%;height:100%;">
      <defs>
        <linearGradient id="${uniqueId}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${isUp ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}" />
          <stop offset="100%" stop-color="transparent" />
        </linearGradient>
      </defs>
      <!-- ناحیه پس‌زمینه -->
      <polygon points="0,${height} ${trendPoints.join(' ')} ${width},${height}" fill="url(#${uniqueId})" />
      <!-- کندل‌ها -->
      ${svgContent}
      <!-- خط روند -->
      <polyline points="${trendPoints.join(' ')}" fill="none" stroke="${trendColor}" stroke-width="1" stroke-opacity="0.5" stroke-dasharray="2,2" />
    </svg>
  `
}

