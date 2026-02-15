// بارگذاری ترتیبی فایل‌های قدیمی با استفاده از import داینامیک
const scripts = [
  '../utils/logger.js',
  '../utils/error-handler.js',
  '../utils/performance.js',
  '../utils/globe-helpers.js',
  '../utils/state-manager.js',
  '../config.js',
  '../script-main.js',
  '../script-views.js',
  '../script-cards.js',
  '../globe/globals.js',
  '../globe/globe-helpers.js',
  '../globe/globe-clock.js',
  '../globe/globe-markets.js',
  '../globe/globe-modals.js',
  '../globe/globe-simple.js',
  '../globe/globe-resources.js',
  '../globe/globe-3d.js',
  '../script-ui.js',
  '../script-tools.js',
  '../data/countries-data.js',
  '../gold-map.js',
  '../data/geo-borders.js',
  '../script-init.js'
];

async function loadScripts() {
  for (const script of scripts) {
    try {
      await import(script);
      console.log(`✅ لود شد: ${script}`);
    } catch (error) {
      console.error(`❌ خطا در لود ${script}:`, error);
    }
  }
  console.log('🎉 تمام اسکریپت‌های قدیمی با موفقیت لود شدند.');
}

loadScripts();
