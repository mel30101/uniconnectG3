const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Rutas del monorepo
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

// Permitir que Metro resuelva los módulos .mjs de Firebase correctamente
config.resolver.sourceExts.push('mjs');

// Prioriza variantes .native.ts/.native.tsx antes que las genéricas
config.resolver.sourceExts = [
  'native.tsx', 'native.ts', 'native.jsx', 'native.js',
  ...config.resolver.sourceExts,
];

// Forzar resolución de React desde node_modules de mobile (única instancia)
config.resolver.extraNodeModules = {
  react: path.resolve(projectRoot, 'node_modules/react'),
  'react-native': path.resolve(projectRoot, 'node_modules/react-native'),
  zustand: path.resolve(projectRoot, 'node_modules/zustand'),
};

// Incluir la raíz del monorepo para encontrar @uniconnect/shared
config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('./custom-transformer.js'),
};

module.exports = config;
