const INotificacionStrategy = require('../../domain/strategies/INotificacionStrategy');

class ResumenDiarioStrategy extends INotificacionStrategy {
  constructor(db) {
    super();
    this.canal = 'resumen_diario';
    this.db = db;
  }

  async enviar(notification) {
    try {
      if (!this.db) {
        throw new Error("Firestore DB instance is required");
      }

      const { userId, title, body, type } = notification;

      // Se guarda como un documento dentro de una subcolección del usuario
      // Ruta: daily_buffer/{userId}/notifications/{notificationId}
      const bufferRef = this.db.collection('daily_buffer').doc(userId).collection('notifications');

      await bufferRef.add({
        title,
        body,
        type,
        timestamp: new Date().toISOString()
      });

      console.log(`[ResumenDiarioStrategy] 🕒 Notificación "${title}" guardada en daily_buffer para el usuario ${userId}.`);
      
      return { 
        success: true, 
        channel: 'resumen_diario',
        canal: this.canal, 
        enviado: true 
      };
    } catch (error) {
      console.error('[ResumenDiarioStrategy] Error:', error.message);
      throw error;
    }
  }
}

module.exports = ResumenDiarioStrategy;
