/**
 * Bridge for legacy window-based interactions to keep React code cleaner.
 * Centralizes event names and safe access to window, logger, and appState.
 */

const isBrowser = typeof window !== 'undefined'

const logger = isBrowser
  ? window.logger || { debug: () => {}, warn: () => {}, error: () => {} }
  : { debug: () => {}, warn: () => {}, error: () => {} }

export const events = {
  financialGlobeOpen: 'financialGlobeOpen',
  resourcesGlobeOpen: 'resourcesGlobeOpen',
  marketHoursOpen: 'marketHoursOpen',
  categoryChanged: 'categoryChanged'
}

export function addEventListener(name, handler) {
  if (!isBrowser) return
  window.addEventListener(name, handler)
}

export function removeEventListener(name, handler) {
  if (!isBrowser) return
  window.removeEventListener(name, handler)
}

export function dispatch(name, detail) {
  if (!isBrowser) return
  window.dispatchEvent(new CustomEvent(name, { detail }))
}

export function setAppStatePatch(patch) {
  if (!isBrowser || !window.appState) return
  Object.assign(window.appState, patch)
}

export function getLogger() {
  return logger
}

export function ensureReactOnWindow(ReactLib) {
  if (!isBrowser) return
  if (!window.React) {
    window.React = ReactLib
  }
}

