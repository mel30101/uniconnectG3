const IEstadoGrupo = require('./IEstadoGrupo');

class TransferenciaAceptada extends IEstadoGrupo {
  constructor(subject) {
    super(subject);
  }
}

module.exports = TransferenciaAceptada;
