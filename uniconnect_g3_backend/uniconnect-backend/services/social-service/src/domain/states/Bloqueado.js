const IEstadoGrupo = require('./IEstadoGrupo');

class Bloqueado extends IEstadoGrupo {
  constructor(subject) {
    super(subject);
  }
  getFriendlyName() {
    return 'Grupo Bloqueado';
  }

  _rejectAction() {
    throw new Error('ACTION_REJECTED: The group is currently locked for administrative reasons');
  }

  async desbloquear(context) {
    context.transitionTo('Activo');
    if (this.subject) {
      this.subject.notify('GROUP_UNLOCKED', {
        groupId: context.groupId,
        newState: context.state.getFriendlyName()
      });
    }
    return true;
  }

  async solicitar(context) { this._rejectAction(); }
  async aceptar(context) { this._rejectAction(); }
  async rechazar(context) { this._rejectAction(); }
  async transferir(context) { this._rejectAction(); }
  async disolver(context) { this._rejectAction(); }
  async bloquear(context) { this._rejectAction(); }
}

module.exports = Bloqueado;
