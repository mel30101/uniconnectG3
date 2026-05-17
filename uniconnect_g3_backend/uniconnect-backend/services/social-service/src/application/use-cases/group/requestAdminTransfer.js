const GroupMember = require('../../../domain/GroupMember');

class RequestAdminTransfer {
  constructor(groupRepo, groupMemberRepo, userRepo, db, subject) {
    this.groupRepo = groupRepo;
    this.groupMemberRepo = groupMemberRepo;
    this.userRepo = userRepo;
    this.db = db;
    this.subject = subject;
  }

  async execute(groupId, adminId, candidateId) {
    if (!adminId || !candidateId) {
      throw new Error('MISSING_FIELDS');
    }

    const group = await this.groupRepo.findById(groupId);
    if (!group) {
      throw new Error('GROUP_NOT_FOUND');
    }

    // Verificar que el adminId es realmente el creador/admin del grupo
    if (group.creatorId !== adminId) {
      throw new Error('NOT_AUTHORIZED');
    }

    // Verificar que el candidato es miembro del grupo
    const candidateMember = await this.groupMemberRepo.findByGroupAndUser(groupId, candidateId);
    if (!candidateMember) {
      throw new Error('CANDIDATE_NOT_A_MEMBER');
    }

    // 1. Reconstruir el miembro (admin) y delegar al estado
    const member = new GroupMember({
      groupId,
      userId: adminId
    });
    member.state = { subject: this.subject };
    member.transitionTo('Activo');
    member.candidateId = candidateId;

    const requester = await this.userRepo.findById(adminId);
    member.userName = requester ? (requester.name || requester.displayName || 'Un administrador') : 'Un administrador';

    await member.transferir();

    // 2. Persistencia en base al nuevo estado
    if (member.state.constructor.name === 'PendienteTransferencia') {
      await this.groupRepo.update(groupId, {
        pendingAdminTransfer: {
          candidateId,
          requesterId: adminId,
          status: 'pending',
          requestedAt: new Date()
        }
      });
    }

    return { success: true, message: 'Solicitud de transferencia enviada. Estado: PendienteTransferencia' };
  }
}

module.exports = RequestAdminTransfer;
