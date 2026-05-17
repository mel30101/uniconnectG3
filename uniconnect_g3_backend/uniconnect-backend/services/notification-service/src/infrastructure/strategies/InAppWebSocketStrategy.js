const INotificacionStrategy = require('../../domain/strategies/INotificacionStrategy');

class InAppWebSocketStrategy extends INotificacionStrategy {
  constructor(notificationRepo, io) {
    super();
    this.canal = 'inapp'; // Maintains compatibility with frontend/preferences
    this.notificationRepo = notificationRepo;
    this.io = io;
  }

  async enviar(notification) {
    try {
      console.log(`[InAppWebSocketStrategy] Persisting notification for user ${notification.userId}`);
      
      // Manejar tanto la instancia de la entidad como el DTO plano
      const data = typeof notification.toFirestore === 'function' 
        ? notification.toFirestore() 
        : (typeof notification.getDTO === 'function' ? notification.getDTO() : notification);

      const result = await this.notificationRepo.save(data);
      
      if (this.io) {
        console.log(`[InAppWebSocketStrategy] Emitting socket to user room: ${data.userId}`);
        this.io.to(data.userId).emit('notification', {
          id: result,
          ...data
        });
      }
      
      return {
        canal: this.canal,
        enviado: true,
        id: result
      };
    } catch (error) {
      console.error('[InAppWebSocketStrategy] Error:', error.message);
      return {
        canal: this.canal,
        enviado: false,
        error: error.message
      };
    }
  }
}

module.exports = InAppWebSocketStrategy;
