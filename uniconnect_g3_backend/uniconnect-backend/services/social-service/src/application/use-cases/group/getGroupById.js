class GetGroupById {
  constructor(groupRepo, groupMemberRepo, groupRequestRepo, catalogRepo, userRepo) {
    this.groupRepo = groupRepo;
    this.groupMemberRepo = groupMemberRepo;
    this.groupRequestRepo = groupRequestRepo;
    this.catalogRepo = catalogRepo;
    this.userRepo = userRepo;
  }

  async execute(groupId, userId = null) {
    const group = await this.groupRepo.findById(groupId);
    if (!group) return null;

    // Obtener nombre de la materia
    const subject = await this.catalogRepo.getSubjectById(group.subjectId);
    const subjectName = subject ? subject.name : 'Materia desconocida';

    // Obtener miembros con detalles
    const members = await this.groupMemberRepo.findByGroupId(groupId);
    const memberIds = members.map(m => m.userId);
    const memberUsers = await this.userRepo.findByIds(memberIds);

    const memberDetails = memberUsers.map(u => ({
      id: u.id,
      name: u.exists !== false ? u.name : 'Usuario desconocido',
      role: members.find(m => m.userId === u.id)?.role || 'student'
    }));

    let dbStatus = 'none';
    let requesterId = null;

    if (userId) {
      if (group.pendingAdminTransfer && group.pendingAdminTransfer.status === 'pending' && (group.creatorId === userId || group.pendingAdminTransfer.candidateId === userId)) {
        dbStatus = 'transfer_pending';
        requesterId = group.pendingAdminTransfer.requesterId;
      } else if (group.creatorId === userId) {
        dbStatus = 'admin';
      } else if (memberIds.includes(userId)) {
        dbStatus = 'member';
      } else {
        // Check for pending/rejected requests
        const request = await this.groupRequestRepo.findByGroupAndUser(groupId, userId);
        if (request) {
          dbStatus = request.status || 'pending';
        }
      }
    }

    const Activo = require('../../../domain/states/Activo');
    const PendienteTransferencia = require('../../../domain/states/PendienteTransferencia');
    const TransferenciaAceptada = require('../../../domain/states/TransferenciaAceptada');
    
    class GroupContext {
      constructor(status, reqId) {
        this.requesterId = reqId;
        switch (status) {
          case 'pending': 
            // Fallback since we deleted SolicitudIngresoState. 
            // Using an anonymous object to avoid breaking the UI for pending users.
            this.state = { getFriendlyName: () => 'Pendiente de Ingreso', isExitLocked: () => false }; 
            break;
          case 'member':
          case 'admin': this.state = new Activo(null); break;
          case 'transfer_pending': this.state = new PendienteTransferencia(null); break;
          case 'rejected': 
            this.state = { getFriendlyName: () => 'Rechazado', isExitLocked: () => false }; 
            break;
          default: this.state = null;
        }
      }
      getState() { return this.state; }
    }

    const context = new GroupContext(dbStatus, requesterId);
    let userStatus = dbStatus === 'none' ? 'none' : 'Desconocido';
    let isExitLocked = false;

    if (context.getState()) {
      userStatus = context.getState().getFriendlyName();
      isExitLocked = context.getState().isExitLocked(context, userId);
    }

    return {
      ...group,
      subjectName,
      members: memberDetails,
      userStatus,
      isExitLocked
    };
  }
}

module.exports = GetGroupById;
