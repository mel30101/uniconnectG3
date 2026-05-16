const IEstadoGrupo = require('./IEstadoGrupo');

class Disuelto extends IEstadoGrupo {
  constructor(subject) {
    super(subject);
  }
  getFriendlyName() {
    return 'Grupo Disuelto';
  }

  _rejectAction() {
    throw new Error('ACTION_REJECTED: The group is dissolved and cannot perform actions');
  }

  async solicitar(context) { this._rejectAction(); }
  
  async aceptar(context) { 
    throw new Error('[Forbidden] No se puede operar en un grupo disuelto'); 
  }
  
  async rechazar(context) { this._rejectAction(); }
  
  async transferir(context) { 
    throw new Error('[Forbidden] No se puede operar en un grupo disuelto'); 
  }
  async disolver(context) { this._rejectAction(); }
  async bloquear(context) { this._rejectAction(); }
  async desbloquear(context) { this._rejectAction(); }
}

module.exports = Disuelto;
