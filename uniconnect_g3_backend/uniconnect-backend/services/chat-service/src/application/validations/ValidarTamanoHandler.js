const BaseHandler = require('./BaseHandler');

/**
 * Valida que el mensaje no exceda el tamaño máximo de caracteres permitido.
 */
class ValidarTamanoHandler extends BaseHandler {
  /**
   * @param {number} maxSize Límite máximo de caracteres (por defecto 1000).
   */
  constructor(maxSize = 1000) {
    super();
    this.maxSize = maxSize;
  }

  async manejar(request) {
    const { text, mensajeDecorado } = request;

    // Verificar si el mensaje decorado tiene metadatos de archivo (Criterio: Validar sobre mensaje ya decorado)
    let hasFile = false;
    if (mensajeDecorado && typeof mensajeDecorado.getMetadata === 'function') {
      const metadata = mensajeDecorado.getMetadata();
      if (metadata && metadata.url) {
        hasFile = true;
      }
    }

    if (text && text.length > this.maxSize) {
      return this.retornarError(
        'El mensaje excede el límite de caracteres permitido',
        'MESSAGE_TOO_LONG'
      );
    }

    // Validar que el mensaje no esté completamente vacío
    if (!text && !hasFile) {
      return this.retornarError(
        'El mensaje no puede estar vacío',
        'MESSAGE_EMPTY'
      );
    }

    return await super.manejar(request);
  }
}

module.exports = ValidarTamanoHandler;
