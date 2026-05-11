const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Permitir que Metro resuelva los módulos .mjs de Firebase correctamente
config.resolver.sourceExts.push('mjs');

// Prioriza variantes .native.ts/.native.tsx antes que las genéricas
// Metro ya resuelve .native por defecto, pero lo hacemos explícito
config.resolver.sourceExts = [
  'native.tsx', 'native.ts', 'native.jsx', 'native.js',
  ...config.resolver.sourceExts,
];

config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('./custom-transformer.js'),
};

module.exports = config;
