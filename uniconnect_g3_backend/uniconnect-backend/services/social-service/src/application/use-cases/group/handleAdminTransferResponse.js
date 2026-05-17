const GroupMember = require('../../../domain/GroupMember');

class HandleAdminTransferResponse {
  constructor(groupRepo, groupMemberRepo, userRepo, db, subject) {
    this.groupRepo = groupRepo;
    this.groupMemberRepo = groupMemberRepo;
    this.userRepo = userRepo;
    this.db = db;
    this.subject = subject;
  }

  async execute(groupId, candidateId, action) {
    const group = await this.groupRepo.findById(groupId);
    const transfer = group ? group.pendingAdminTransfer : null;
    const requesterId = transfer ? transfer.requesterId : null;

    // 1. Reconstruir al candidato y delegar la instanciación al contexto (Criterio 5)
    const member = new GroupMember({
      groupId,
      userId: candidateId
    });
    // Forzamos el estado inicial en memoria a PendienteTransferencia estableciendo el subject
    member.state = { subject: this.subject }; 
    member.transitionTo('PendienteTransferencia');

    if (action === 'accept') {
      // 2. Delegar la transición al estado (lanzará error si el estado no lo permite)
      await member.aceptar();

      // 3. Persistencia: Transacción Atómica (Criterio 3)
      if (member.state.constructor.name === 'TransferenciaAceptada') {
        try {
          await this.db.runTransaction(async (transaction) => {
            const groupRef = this.db.collection('groups').doc(groupId);
            transaction.update(groupRef, { creatorId: candidateId, pendingAdminTransfer: null });

            const candidateMember = await this.groupMemberRepo.getRefsByGroupAndUser(groupId, candidateId);
            if (candidateMember) transaction.update(candidateMember.ref, { role: 'admin' });

            if (requesterId) {
              const oldAdminMember = await this.groupMemberRepo.getRefsByGroupAndUser(groupId, requesterId);
              // Remover al antiguo admin del grupo según regla de negocio
              if (oldAdminMember) transaction.delete(oldAdminMember.ref);
            }
          });

          return { success: true, message: 'Transferencia completada. Estado: TransferenciaAceptada' };
        } catch (error) {
          // Verificación de Integridad: Si la BD falla, revertimos el estado en memoria
          member.transitionTo('PendienteTransferencia');
          throw new Error('Fallo en la persistencia, el estado se ha revertido: ' + error.message);
        }
      }
    } else if (action === 'reject') {
      await member.rechazar();

      if (member.state.constructor.name === 'Activo') {
        try {
          await this.groupRepo.update(groupId, { pendingAdminTransfer: null });
          return { success: true, message: 'Solicitud de transferencia rechazada. Estado regresó a Activo.' };
        } catch (error) {
          // Revertir el estado en memoria si la BD falla
          member.transitionTo('PendienteTransferencia');
          throw new Error('Fallo en la persistencia del rechazo, estado revertido: ' + error.message);
        }
      }
    }
  }
}

module.exports = HandleAdminTransferResponse;
