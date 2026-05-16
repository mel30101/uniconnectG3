class GroupMember {
  constructor({ groupId, userId, role, joinedAt, state }) {
    this.groupId = groupId;
    this.userId = userId;
    this.role = role || 'student';
    this.joinedAt = joinedAt || new Date();
    this.state = state || null;
  }

  transitionTo(stateName) {
    const Activo = require('./states/Activo');
    const PendienteTransferencia = require('./states/PendienteTransferencia');
    const TransferenciaAceptada = require('./states/TransferenciaAceptada');
    const Disuelto = require('./states/Disuelto');
    const Bloqueado = require('./states/Bloqueado');
    
    const subject = this.state ? this.state.subject : null;

    switch (stateName) {
      case 'Activo': this.state = new Activo(subject); break;
      case 'PendienteTransferencia': this.state = new PendienteTransferencia(subject); break;
      case 'TransferenciaAceptada': this.state = new TransferenciaAceptada(subject); break;
      case 'Disuelto': this.state = new Disuelto(subject); break;
      case 'Bloqueado': this.state = new Bloqueado(subject); break;
      default: throw new Error(`State ${stateName} is not recognized.`);
    }
  }

  async solicitar() {
    if (!this.state) throw new Error('STATE_NOT_INITIALIZED');
    return this.state.solicitar(this);
  }

  async aceptar() {
    if (!this.state) throw new Error('STATE_NOT_INITIALIZED');
    return this.state.aceptar(this);
  }

  async rechazar() {
    if (!this.state) throw new Error('STATE_NOT_INITIALIZED');
    return this.state.rechazar(this);
  }

  async transferir() {
    if (!this.state) throw new Error('STATE_NOT_INITIALIZED');
    return this.state.transferir(this);
  }

  async disolver() {
    if (!this.state) throw new Error('STATE_NOT_INITIALIZED');
    return this.state.disolver(this);
  }

  async bloquear() {
    if (!this.state) throw new Error('STATE_NOT_INITIALIZED');
    return this.state.bloquear(this);
  }

  async desbloquear() {
    if (!this.state) throw new Error('STATE_NOT_INITIALIZED');
    return this.state.desbloquear(this);
  }

  isAdmin() {
    return this.role === 'admin';
  }
}

module.exports = GroupMember;
