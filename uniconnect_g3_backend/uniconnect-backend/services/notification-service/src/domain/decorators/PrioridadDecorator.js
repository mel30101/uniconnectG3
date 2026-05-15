const NotificacionDecorator = require('./NotificacionDecorator');

class PrioridadDecorator extends NotificacionDecorator {
  constructor(notificacion, priority) {
    super(notificacion);
    const allowedPriorities = ['normal', 'urgente', 'critica'];
    if (!allowedPriorities.includes(priority)) {
      throw new Error(`Prioridad no válida. Valores permitidos: ${allowedPriorities.join(', ')}`);
    }
    this.priority = priority;
  }

  getDTO() {
    const dto = super.getDTO();
    const weights = { critica: 3, urgente: 2, normal: 1 };
    return {
      ...dto,
      priority: this.priority,
      priorityWeight: weights[this.priority] || 1
    };
  }
}

module.exports = PrioridadDecorator;
