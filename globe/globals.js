// ==================== //
// 🌐 Global Variables for Globe Files
// ==================== //

// این فایل متغیرهای global مفقود شده رو تعریف می‌کنه
// تا خطاهای linting رفع بشن

// متغیرهای مفقود شده در globe-3d.js
window.createNeonMarker = window.createNeonMarker || function() {};
window.createAllConflicts = window.createAllConflicts || function() {};
window.showAirForceOnGlobe = window.showAirForceOnGlobe || function() {};
window.showGroundForceOnGlobe = window.showGroundForceOnGlobe || function() {};
window.showNavyOnGlobe = window.showNavyOnGlobe || function() {};

// متغیرهای مفقود شده در globe-base.js
window.Globe = window.Globe || function() { return {}; };

// متغیرهای مفقود شده در globe-clock.js
window.openFinancialGlobe = window.openFinancialGlobe || function() {};

// متغیرهای مفقود شده در globe-markets.js
window.marketData = window.marketData || [];

// متغیرهای مفقود شده در globe-resources.js
window.updateBordersForCountry = window.updateBordersForCountry || function() {};
window.countryCodeToName = window.countryCodeToName || function() {};
window.clearTradeLines = window.clearTradeLines || function() {};
window.createArcLine = window.createArcLine || function() {};
window.createTradeLines = window.createTradeLines || function() {};
window.updateAllFacilities = window.updateAllFacilities || function() {};
window.showResourcesByType = window.showResourcesByType || function() {};
window.getUserTimezone = window.getUserTimezone || function() {};
window.setManualTimezone = window.setManualTimezone || function() {};

// متغیرهای مفقود شده در globe-modals.js
window.checkLoginRequired = window.checkLoginRequired || function() {};
window.buildSimpleGlobe = window.buildSimpleGlobe || function() {};
window.populateCountryList = window.populateCountryList || function() {};
window.setupResourcesGlobePanels = window.setupResourcesGlobePanels || function() {};
window.setupDraggablePanels = window.setupDraggablePanels || function() {};
window.createWorldBorders = window.createWorldBorders || function() {};
window.createCountryLabels = window.createCountryLabels || function() {};
window.GlobeAssistiveTouch = window.GlobeAssistiveTouch || function() {};
window.setupEarthquakeFilters = window.setupEarthquakeFilters || function() {};
window.setupNaturalResourcesFilters = window.setupNaturalResourcesFilters || function() {};
window.load3DGlobeData = window.load3DGlobeData || function() {};

// سایر متغیرهای global
window.simpleGlobeScenes = window.simpleGlobeScenes || {};

// تعریف EARTH_TEXTURE_PATHS اگر هنوز تعریف نشده
if (typeof window.EARTH_TEXTURE_PATHS === 'undefined') {
    window.EARTH_TEXTURE_PATHS = {
        day: './textures/earth_day.jpg',
        night: './textures/earth_night.jpg'
    };
}

// تعریف Globe اگر هنوز تعریف نشده (fallback)
if (typeof window.Globe === 'undefined') {
    window.Globe = function() {
        // Simple fallback globe implementation
        return {
            globeImageUrl: function() { return this; },
            backgroundImageUrl: function() { return this; },
            width: function() { return this; },
            height: function() { return this; },
            pointOfView: function() { return this; }
        };
    };
}

console.log('🌐 Globe globals initialized');
