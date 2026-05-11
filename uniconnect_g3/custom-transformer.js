/**
 * custom-transformer.js
 * Transforma import.meta en código compatible con el navegador
 * antes de que Metro lo empaquete.
 */
const upstreamTransformer = require('@expo/metro-config/babel-transformer');

module.exports.transform = function ({ src, filename, options }) {
  // Remplazamos import.meta.url por una cadena vacía compatible con CommonJS
  if (src.includes('import.meta')) {
    src = src.replace(/import\.meta\.url/g, '""');
    src = src.replace(/import\.meta\.env/g, 'process.env');
    src = src.replace(/import\.meta/g, '({})');
  }
  return upstreamTransformer.transform({ src, filename, options });
};
