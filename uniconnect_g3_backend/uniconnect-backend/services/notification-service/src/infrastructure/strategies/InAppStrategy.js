const INotificacionStrategy = require('../../domain/strategies/INotificacionStrategy');

class InAppStrategy extends INotificacionStrategy {
  constructor(notificationRepo) {
    super();
    this.notificationRepo = notificationRepo;
    this.canal = 'in_app';
  }

  async enviar(notification) {
    try {
      console.log(`[InAppStrategy] Persisting notification for user ${notification.userId}`);
      
      // Manejar tanto la instancia de la entidad como el DTO plano
      const data = typeof notification.toFirestore === 'function' 
        ? notification.toFirestore() 
        : (typeof notification.getDTO === 'function' ? notification.getDTO() : notification);

      const result = await this.notificationRepo.save(data);
      
      return {
        canal: 'in_app',
        enviado: true,
        id: result
      };
    } catch (error) {
      console.error('[InAppStrategy] Error:', error.message);
      return {
        canal: 'in_app',
        enviado: false,
        error: error.message
      };
    }
  }
}

module.exports = InAppStrategy;
