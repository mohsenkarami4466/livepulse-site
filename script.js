// script.js — LivePulse basic logic
const API_ENDPOINTS = {
  crypto: '/api/crypto',   // <- replace with your worker/Netlify function or Cloudflare worker
  fx: '/api/fx',
  gold: '/api/gold',
  oil: '/api/oil',
};

const SAMPLE = {
  crypto: [
    {symbol:'BTC', name:'Bitcoin', price: 46320, change: 2.4},
    {symbol:'ETH', name:'Ethereum', price: 3200, change: -1.1},
    {symbol:'USDT', name:'Tether', price: 1.00, change: 0.0},
    {symbol:'DOGE', name:'Dogecoin', price: 0.14, change: 5.2},
    {symbol:'SHIB', name:'Shiba', price: 0.000007, change: -0.2},
  ],
  fx: [
    {symbol:'USD', name:'دلار', price: 42000, change: 0.2},
    {symbol:'EUR', name:'یورو', price: 45000, change: -0.1},
    {symbol:'GBP', name:'پوند', price: 52000, change: 0.5},
    {symbol:'AED', name:'درهم', price: 11400, change: 0.1},
    {symbol:'TRY', name:'لیر', price: 2200, change: -0.8},
  ],
  gold: [
    {symbol:'G18', name:'طلای ۱۸', price: 1250000, change: 0.3},
    {symbol:'SEEK', name:'سکه امامی', price: 21000000, change: -0.5},
    {symbol:'BAHAR', name:'بهار آزادی', price: 11000000, change: 0.2},
    {symbol:'HALF', name:'نیم سکه', price: 5600000, change: -0.1},
    {symbol:'G1oz', name:'طلای جهانی', price: 1920, change: 1.1},
  ],
  oil: [
    {symbol:'BRN', name:'Brent', price: 84.2, change: 0.9},
    {symbol:'WTI', name:'WTI', price: 79.4, change: -0.5},
    {symbol:'IRN', name:'نفت ایران', price: 75.0, change: 0.3},
    {symbol:'GAS', name:'بنزین', price: 1.07, change: 0.1},
    {symbol:'OPEC', name:'اوپک', price: 82.0, change: 0.2},
  ]
};

const POLL_INTERVAL = 15000; // ms

const grid = document.getElementById('grid');
const cats = document.querySelectorAll('.cat');
const aiHint = document.getElementById('aiHint');
const statusEl = document.getElementById('status');
const timeEl = document.getElementById('time');
let active = 'crypto';

// utility: format numbers
function fmt(n){
  if (Math.abs(n) >= 1000) return n.toLocaleString();
  return n;
}

// initial render
function renderList(cat, list){
  grid.innerHTML = '';
  list.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="title">
        <div>
          <div class="symbol">${item.symbol} <span style="color:var(--muted);font-weight:500;font-size:13px"> ${item.name}</span></div>
        </div>
        <div class="price">${fmt(item.price)}</div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
        <div class="small">آخرین به‌روزرسانی: الان</div>
        <div class="delta ${item.change>=0 ? 'up' : 'down'}">${item.change>=0? '+'+item.change+'%': item.change+'%'}</div>
      </div>
    `;
    // hover -> AI hint demo
    card.addEventListener('mouseenter', ()=> {
      aiHint.textContent = `[AI] تحلیل فوری: ${item.symbol} — ${generateHint(cat, item)}`;
    });
    grid.appendChild(card);
  });
}

// sample hint generator (replace with AI call)
function generateHint(cat, item){
  if(cat === 'crypto'){
    if(item.change > 2) return `${item.symbol} رشد سریع داشته؛ توجه به حجم معاملات.`;
    if(item.change < -1) return `${item.symbol} در اصلاح؛ ممکنه فرصت خرید کوتاه‌مدت باشد.`;
    return `${item.symbol} نوسان معمول.`;
  }
  if(cat === 'oil'){
    if(item.change > 0.7) return `افزایش نفت → فشار صعودی بر قیمت بنزین و احتمالا افزایش طلا.`;
    return `نوسان اندک در نفت.`;
  }
  return `تغییر ${item.change}% — بررسی بیشتر توصیه می‌شود.`;
}

// fetch real data (placeholder)
async function fetchData(cat){
  statusEl.textContent = 'درحال دریافت';
  try{
    // TODO: replace with real endpoint (Cloudflare Worker or Netlify function)
    // const res = await fetch(API_ENDPOINTS[cat]);
    // const data = await res.json();
    // for demo we use SAMPLE
    await sleep(200);
    statusEl.textContent = 'زنده';
    return SAMPLE[cat];
  }catch(e){
    statusEl.textContent = 'خطا';
    console.error(e);
    return SAMPLE[cat];
  }
}

function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

async function update(){
  const list = await fetchData(active);
  renderList(active, list);
  document.querySelectorAll('.cat').forEach(b=>b.classList.toggle('active', b.dataset.cat === active));
  // update clock
  timeEl.textContent = new Date().toLocaleTimeString('fa-IR');
}

// init
cats.forEach(b=>{
  b.addEventListener('click', ()=>{
    active = b.dataset.cat;
    update();
  });
});
document.getElementById('themeToggle').addEventListener('click', ()=>{
  document.body.classList.toggle('dark');
});

// poller
update();
setInterval(update, POLL_INTERVAL);
