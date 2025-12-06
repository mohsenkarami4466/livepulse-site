/**
 * 📦 Export تمام utility functions
 * 
 * نکته: فایل‌های utils در root از module.exports استفاده می‌کنند
 * بنابراین نمی‌توانیم مستقیماً import کنیم
 * به جای آن، از window object استفاده می‌کنیم
 */

// Logger - از window.logger استفاده می‌شود
export const logger = typeof window !== 'undefined' ? window.logger : null

// Error Handler - از window.errorHandler استفاده می‌شود
export const errorHandler = typeof window !== 'undefined' ? window.errorHandler : null

// Performance - از window.PerformanceUtils استفاده می‌شود
export const debounce = typeof window !== 'undefined' && window.debounce ? window.debounce : null
export const throttle = typeof window !== 'undefined' && window.throttle ? window.throttle : null
export const requestAnimationFrameSafe = typeof window !== 'undefined' && window.PerformanceUtils ? window.PerformanceUtils.requestAnimationFrameSafe : null
export const cancelAnimationFrameSafe = typeof window !== 'undefined' && window.PerformanceUtils ? window.PerformanceUtils.cancelAnimationFrameSafe : null
export const createDebouncedResizeHandler = typeof window !== 'undefined' && window.PerformanceUtils ? window.PerformanceUtils.createDebouncedResizeHandler : null

// Globe Helpers - از window.GlobeHelpers استفاده می‌شود
export const latLngToVector3 = typeof window !== 'undefined' && window.GlobeHelpers ? window.GlobeHelpers.latLngToVector3 : null
export const calculateCameraPositionForIran = typeof window !== 'undefined' && window.GlobeHelpers ? window.GlobeHelpers.calculateCameraPositionForIran : null
export const createGlobeMarker = typeof window !== 'undefined' && window.GlobeHelpers ? window.GlobeHelpers.createGlobeMarker : null
export const loadTextureWithFallback = typeof window !== 'undefined' && window.GlobeHelpers ? window.GlobeHelpers.loadTextureWithFallback : null
export const setupGlobeResizeHandler = typeof window !== 'undefined' && window.GlobeHelpers ? window.GlobeHelpers.setupGlobeResizeHandler : null
export const cleanupGlobeResizeHandler = typeof window !== 'undefined' && window.GlobeHelpers ? window.GlobeHelpers.cleanupGlobeResizeHandler : null
export const createGlobeAtmosphere = typeof window !== 'undefined' && window.GlobeHelpers ? window.GlobeHelpers.createGlobeAtmosphere : null

// Card Helpers - این‌ها ES modules هستند
export {
  formatPrice,
  getLastUpdateTime,
  generateMiniChartSVG
} from './card-helpers'

// State Manager - از window.stateManager استفاده می‌شود
export const StateManager = typeof window !== 'undefined' && window.stateManager ? window.stateManager : null

