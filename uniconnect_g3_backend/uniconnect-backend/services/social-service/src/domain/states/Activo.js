const IEstadoGrupo = require('./IEstadoGrupo');

class Activo extends IEstadoGrupo {
  constructor(subject) {
    super(subject);
  }

  async transferir(context) {
    // 1. Transición al estado PendienteTransferencia (Criterio 2)
    context.transitionTo('PendienteTransferencia');

    // 2. Emisión de eventos con el nuevo estado (Criterio 6)
    if (this.subject) {
      this.subject.notify('ADMIN_TRANSFER_REQUESTED', {
        groupId: context.groupId,
        oldAdminId: context.userId,
        candidateId: context.candidateId,
        newState: context.state.getFriendlyName()
      });
    }
    return true;
  }

  async disolver(context) {
    context.transitionTo('Disuelto');
    if (this.subject) {
      this.subject.notify('GROUP_DISSOLVED', {
        groupId: context.groupId,
        newState: context.state.getFriendlyName()
      });
    }
    return true;
  }

  async bloquear(context) {
    context.transitionTo('Bloqueado');
    if (this.subject) {
      this.subject.notify('GROUP_LOCKED', {
        groupId: context.groupId,
        newState: context.state.getFriendlyName()
      });
    }
    return true;
  }
}

module.exports = Activo;
