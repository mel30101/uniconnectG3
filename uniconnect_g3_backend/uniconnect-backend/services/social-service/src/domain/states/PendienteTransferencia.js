const IEstadoGrupo = require('./IEstadoGrupo');

class PendienteTransferencia extends IEstadoGrupo {
  constructor(subject) {
    super(subject);
  }
  
  isExitLocked(context, currentUserId) {
    return currentUserId === context.requesterId;
  }

  async aceptar(context) {
    context.transitionTo('TransferenciaAceptada');

    if (this.subject) {
      this.subject.notify('ADMIN_TRANSFER_COMPLETED', {
        groupId: context.groupId,
        userId: context.userId,
        newState: context.state.getFriendlyName()
      });
    }
    return true;
  }

  async rechazar(context) {
    // Retorno al estado inicial (Criterio 4)
    context.transitionTo('Activo');

    // Emisión de evento (Criterio 6)
    if (this.subject) {
      this.subject.notify('ADMIN_TRANSFER_REJECTED', {
        groupId: context.groupId,
        userId: context.userId,
        newState: context.state.getFriendlyName()
      });
    }
    return true;
  }
}

module.exports = PendienteTransferencia;
