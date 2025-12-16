module.exports = {
  root: true,
  env: { 
    browser: true, 
    es2020: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist/**', '.eslintrc.cjs', 'node_modules/**', 'docs/**', 'public/**', '**/dist/**', '**/docs/**', '**/public/**'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  globals: {
    'THREE': 'readonly',
    'module': 'readonly',
    'countriesData': 'readonly',
    'getRelationColor': 'readonly',
    'getConflictColor': 'readonly',
    'worldResources': 'readonly',
    'WorldGoldMapGlass': 'readonly',
    'openResourcesGlobe': 'readonly',
    'open3DGlobe': 'readonly',
    'selectCountry': 'readonly',
    'zoomToCountry': 'readonly',
    'findCountryByCode': 'readonly',
    'zoomToLocation': 'readonly',
    'closeGlobeModal': 'readonly',
    'showView': 'readonly',
    'd3': 'readonly',
    'CONFIG': 'readonly',
    'mockFinancialData': 'readonly',
    'debounce': 'readonly',
    'cancelAnimationFrameSafe': 'readonly',
    'addEventListenerOnce': 'readonly',
    'iranProvinces': 'readonly',
  },
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/prop-types': 'off',
    'no-unused-vars': ['warn', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    'no-dupe-keys': 'error',
  },
}

