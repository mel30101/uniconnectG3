const GroupMessage = require('../../domain/GroupMessage');
const MensajeConArchivo = require('../../domain/decorators/MensajeConArchivo');
const MensajeConMencion = require('../../domain/decorators/MensajeConMencion');
const ValidationChainFactory = require('../factories/ValidationChainFactory');
const chatSubject = require('../observer/ChatSubject');
const { ChatEvents } = require('../../domain/observer/ISubject');

class SendGroupMessage {
  constructor(groupMessageRepo, groupMemberRepo, cloudinaryService = null) {
    this.groupMessageRepo = groupMessageRepo;
    this.groupMemberRepo = groupMemberRepo;
    this.cloudinaryService = cloudinaryService;

    // Inicializamos la cadena de validación
    this.validationChain = ValidationChainFactory.createGroupMessageChain(this.groupMemberRepo);
  }

  async execute(groupId, senderId, messageData, file = null) {
    // 1. Subir archivo a Cloudinary ANTES (Sacrificando eficiencia por requerimiento de diseño)
    let fileUrl = messageData.fileUrl || null;
    let fileName = messageData.fileName || null;
    let type = messageData.type || 'text';
    let mimeType = null;
    let tamano = 0;

    if (file && this.cloudinaryService) {
      try {
        const uploadResult = await this.cloudinaryService.uploadFile(file);
        fileUrl = uploadResult.fileUrl || uploadResult.secure_url;
        fileName = file.originalname;
        type = 'file';
        mimeType = file.mimetype;
        tamano = file.size;
      } catch (error) {
        console.error('Error uploading file to Cloudinary:', error);
        throw new Error('No se pudo subir el archivo para el chat grupal');
      }
    }

    // 2. Crear instancia base del mensaje de grupo
    let message = new GroupMessage({
      senderId,
      type,
      text: messageData.text || '',
      fileUrl,
      fileName
    });

    // 3. Aplicar Decoradores (Modularmente) ANTES de la cadena
    if (type === 'file' && fileUrl) {
      message = new MensajeConArchivo(message, {
        url: fileUrl,
        mimeType: mimeType || 'application/octet-stream',
        tamano: tamano || 0,
        fileName: fileName
      });
    }

    // Extracción provisional de menciones para el decorador
    const textStr = messageData.text || '';
    const mentionRegex = /@(\w+)/g;
    const matches = [...textStr.matchAll(mentionRegex)];
    const rawMentions = matches.map(m => m[1]);
    if (rawMentions.length > 0) {
      message = new MensajeConMencion(message, rawMentions);
    }

    // 4. Ejecutar Cadena de Responsabilidad (Validación) enviando el mensaje decorado
    const validationRequest = {
      groupId,
      senderId,
      text: messageData.text,
      file,
      mensajeDecorado: message
    };

    let validationResult;
    try {
      validationResult = await this.validationChain.manejar(validationRequest);
      
      // Aseguramos el formato de ResultadoValidacion
      if (!validationResult.hasOwnProperty('mensaje')) {
        validationResult.mensaje = message;
      }
    } catch (e) {
      console.error('[SendGroupMessage] Excepción inesperada en la cadena de validación:', e);
      throw new Error('Ocurrió un error interno durante la validación del mensaje');
    }

    if (!validationResult.esValido) {
      const error = new Error(validationResult.error);
      error.codigo = validationResult.codigo;
      throw error;
    }

    // Usar el mensaje validado
    const validMessage = validationResult.mensaje;
    const messageJson = validMessage.toJSON();

    // Inyectar menciones renderizadas por la cadena si existen
    if (validationRequest.renderedText) {
      messageJson.renderedContent = validationRequest.renderedText;
    }
    if (validationRequest.mentions && validationRequest.mentions.length > 0) {
      // Re-decorar o actualizar con los IDs correctos si es necesario, 
      // pero como ya extrajimos rawMentions, confiaremos en los datos de la cadena
      messageJson.metadata = messageJson.metadata || {};
      messageJson.metadata.menciones = validationRequest.mentions;
    }

    // 5. Guardar en Base de Datos (Persistencia)
    const messageId = await this.groupMessageRepo.create(groupId, messageJson);

    const result = {
      messageId,
      ...messageJson
    };

    // 6. Notificar a los Observadores (ChatSubject)
    chatSubject.notify(ChatEvents.NUEVO_MENSAJE, {
      groupId,
      message: {
        message_id: messageId,
        timestamp: new Date().toISOString(),
        sender: { id: senderId },
        content: result.content,
        renderedContent: result.renderedContent,
        metadata: result.metadata
      }
    });

    return result;
  }
}

module.exports = SendGroupMessage;