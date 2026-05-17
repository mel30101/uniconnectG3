const GroupMember = require('../../../domain/GroupMember');

class HandleRequestAction {
  constructor(groupMemberRepo, groupRequestRepo, groupRepo, subject) {
    this.groupMemberRepo = groupMemberRepo;
    this.groupRequestRepo = groupRequestRepo;
    this.groupRepo = groupRepo;
    this.subject = subject;
  }

  async execute(groupId, requestId, status) {
    // 1. Buscamos el grupo para ver si está en un estado que permita aceptar miembros (Criterio de seguridad)
    const group = await this.groupRepo.findById(groupId);
    
    // Si el grupo está 'Bloqueado' o 'Disuelto', no debería poder aceptar miembros
    if (group.state.constructor.name !== 'Activo') {
      throw new Error(`No se pueden procesar solicitudes. El grupo está en estado: ${group.state.constructor.name}`);
    }

    if (status === 'accepted') {
      // 2. Persistencia: Agregar el miembro al repositorio
      await this.groupMemberRepo.add({
        groupId,
        userId: requestId,
        role: 'student',
        joinedAt: new Date()
      });

      // 3. Actualizar la solicitud
      await this.groupRequestRepo.updateStatus(groupId, requestId, 'accepted');

      // 4. Notificar (Usando los nuevos nombres de eventos estandarizados)
      this.subject.notify('NOTIFICACION_SISTEMA', {
        targetUserId: requestId,
        userId: requestId,
        type: 'group_request_accepted', // Nombre limpio
        groupId,
        groupName: group.name
      });

    } else {
      // Si es rechazada
      await this.groupRequestRepo.updateStatus(groupId, requestId, 'rejected');
    }

    return { message: `Solicitud ${status} correctamente para el grupo ${group.name}` };
  }
}

module.exports = HandleRequestAction;
