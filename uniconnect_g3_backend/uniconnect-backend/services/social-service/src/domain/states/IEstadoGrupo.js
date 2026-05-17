class IEstadoGrupo {
  constructor(subject) {
    this.subject = subject;
  }
  
  getFriendlyName() {
    switch (this.constructor.name) {
      case 'Activo': return 'Activo';
      case 'PendienteTransferencia': return 'Transferencia Pendiente';
      case 'TransferenciaAceptada': return 'Transferencia Aceptada';
      case 'Disuelto': return 'Disuelto';
      case 'Bloqueado': return 'Bloqueado';
      default: return 'Desconocido';
    }
  }

  isExitLocked(context, currentUserId) {
    return false;
  }

  async solicitar(context) {
    throw new Error(`[State Error] Action "solicitar" is not allowed in state ${this.constructor.name}`);
  }

  async aceptar(context) {
    throw new Error(`[State Error] Action "aceptar" is not allowed in state ${this.constructor.name}`);
  }

  async rechazar(context) {
    throw new Error(`[State Error] Action "rechazar" is not allowed in state ${this.constructor.name}`);
  }

  async transferir(context) {
    throw new Error(`[State Error] Action "transferir" is not allowed in state ${this.constructor.name}`);
  }

  async disolver(context) {
    throw new Error(`[State Error] Action "disolver" is not allowed in state ${this.constructor.name}`);
  }

  async bloquear(context) {
    throw new Error(`[State Error] Action "bloquear" is not allowed in state ${this.constructor.name}`);
  }

  async desbloquear(context) {
    throw new Error(`[State Error] Action "desbloquear" is not allowed in state ${this.constructor.name}`);
  }
}

module.exports = IEstadoGrupo;
