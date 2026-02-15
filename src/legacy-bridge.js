// بارگذاری تمام اسکریپت‌های قدیمی به صورت ماژول
// این فایل باعث می‌شود تمام توابع و متغیرهای سراسری در window تعریف شوند

import '../utils/logger.js';
import '../utils/error-handler.js';
import '../utils/performance.js';
import '../utils/globe-helpers.js';
import '../utils/state-manager.js';
import '../config.js';
import '../script-main.js';
import '../script-views.js';
import '../script-cards.js';
import '../globe/globals.js';
import '../globe/globe-helpers.js';
import '../globe/globe-clock.js';
import '../globe/globe-markets.js';
import '../globe/globe-modals.js';
import '../globe/globe-simple.js';
import '../globe/globe-resources.js';
import '../globe/globe-3d.js';
import '../script-ui.js';
import '../script-tools.js';
import '../data/countries-data.js';
import '../gold-map.js';
import '../data/geo-borders.js';
import '../script-init.js';

// اطمینان از وجود آبجکت logger
if (typeof window !== 'undefined' && !window.logger) {
  window.logger = console;
}

console.log('✅ Legacy bridge loaded: all old scripts are now bundled.');
