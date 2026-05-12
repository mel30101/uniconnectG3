const IObserver = require('../../domain/observer/IObserver');
const { ChatEvents } = require('../../domain/observer/ISubject');
const http = require('http');

/**
 * Observer que intercepta mensajes con menciones y dispara 
 * la notificación in-app a través del NotificationService.
 */
class MentionNotificationObserver extends IObserver {
  constructor(db) {
    super();
    this.db = db;
    // URL del servicio de notificaciones (configurable por env)
    this.notificationServiceUrl = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3006';
  }

  async update(event, data) {
    // Solo nos interesan los nuevos mensajes
    if (event !== ChatEvents.NUEVO_MENSAJE) return;

    const { groupId, message } = data;
    const mentions = message.metadata?.menciones || [];

    // Si no hay menciones, no hacemos nada
    if (mentions.length === 0) return;

    try {
      console.log(`[MentionNotificationObserver] Procesando ${mentions.length} menciones para el mensaje ${message.message_id}`);

      // 1. Obtener información contextual (Nombre del grupo y del emisor)
      const groupDoc = await this.db.collection('groups').doc(groupId).get();
      const groupData = groupDoc.exists ? groupDoc.data() : { name: 'un grupo' };
      
      const senderDoc = await this.db.collection('users').doc(message.sender.id).get();
      const senderData = senderDoc.exists ? senderDoc.data() : { name: 'Un compañero' };

      // 2. Notificar a cada usuario mencionado (excepto si se mencionó a sí mismo)
      for (const userId of mentions) {
        if (userId === message.sender.id) continue;

        console.log(`[MentionNotificationObserver] Notificando mención a userId: ${userId}`);
        this.triggerNotification(userId, {
          senderName: senderData.name || senderData.displayName || 'Alguien',
          groupName: groupData.name,
          message: message.content,
          groupId: groupId
        });
      }
    } catch (error) {
      console.error('[MentionNotificationObserver] Error procesando menciones:', error);
    }
  }

  triggerNotification(userId, payload) {
    const postData = JSON.stringify({
      event: 'MENCION', // Esto dispara la lógica en NotificationService
      payload: {
        userId,
        ...payload
      }
    });

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(`${this.notificationServiceUrl}/notify`, options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => { responseBody += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 400) {
          console.error(`[MentionNotificationObserver] Error en NotificationService (${res.statusCode}):`, responseBody);
        }
      });
    });

    req.on('error', (e) => {
      console.error(`[MentionNotificationObserver] Fallo al conectar con NotificationService: ${e.message}`);
    });

    req.write(postData);
    req.end();
  }
}

module.exports = MentionNotificationObserver;
