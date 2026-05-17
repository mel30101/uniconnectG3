class NotificationObserver {
  constructor(sendNotificationUseCase) {
    this.sendNotificationUseCase = sendNotificationUseCase;
  }

  async onMention(userId, mentionedBy, groupName, messagePreview, groupId) {
    return this.sendNotificationUseCase.execute({
      userId,
      title: `Mención en ${groupName}`,
      body: `${mentionedBy} te ha mencionado: "${messagePreview}"`,
      metadata: { groupId, type: 'mention' },
      type: 'chat_mention'
    });
  }

  async onPrivateMessage(receiverId, senderName, messagePreview, chatId) {
    return this.sendNotificationUseCase.execute({
      userId: receiverId,
      title: `Nuevo mensaje de ${senderName}`,
      body: messagePreview,
      metadata: { chatId, type: 'private_message' },
      type: 'private_message'
    });
  }

  async onGroupRequest(adminId, requesterName, groupName, groupId, requestId) {
    return this.sendNotificationUseCase.execute({
      userId: adminId,
      title: 'Nueva solicitud de unión',
      body: `${requesterName} quiere unirse a tu grupo "${groupName}"`,
      metadata: { groupId, requestId, type: 'group_request' },
      type: 'group_request'
    });
  }

  async onGroupRequestHandled(userId, accepted, groupName, groupId) {
    return this.sendNotificationUseCase.execute({
      userId,
      title: accepted ? '¡Solicitud aceptada!' : 'Solicitud rechazada',
      body: accepted
        ? `Tu solicitud para unirte a "${groupName}" fue aceptada`
        : `Tu solicitud para unirte a "${groupName}" fue rechazada`,
      metadata: { groupId, type: accepted ? 'request_accepted' : 'request_rejected' },
      type: 'group_update'
    });
  }

  async onAdminTransfer(userId, groupName, groupId) {
    return this.sendNotificationUseCase.execute({
      userId,
      title: 'Nuevo rol de Administrador',
      body: `Ahora eres el administrador del grupo "${groupName}"`,
      metadata: { groupId, type: 'admin_transfer' },
      type: 'group_update'
    });
  }

  async onAdminTransferRequested(userId, requesterName, groupName, groupId) {
    return this.sendNotificationUseCase.execute({
      userId,
      title: 'Solicitud de Administración',
      body: `${requesterName} te ha solicitado ser el administrador del grupo "${groupName}"`,
      metadata: { groupId, type: 'admin_transfer_requested' },
      type: 'group_update'
    });
  }

  async onAdminTransferAccepted(userId, acceptorName, groupName, groupId) {
    return this.sendNotificationUseCase.execute({
      userId,
      title: 'Transferencia de Administración Aceptada',
      body: `${acceptorName} ha aceptado ser el administrador del grupo "${groupName}"`,
      metadata: { groupId, type: 'admin_transfer_accepted' },
      type: 'group_update'
    });
  }

  async onAdminTransferRejected(userId, rejectorName, groupName, groupId) {
    return this.sendNotificationUseCase.execute({
      userId,
      title: 'Transferencia de Administración Rechazada',
      body: `${rejectorName} ha rechazado la solicitud para ser administrador del grupo "${groupName}"`,
      metadata: { groupId, type: 'admin_transfer_rejected' },
      type: 'group_update'
    });
  }

  async onNewEvent(userId, categoryName, eventTitle, eventId) {
    return this.sendNotificationUseCase.execute({
      userId,
      title: `Nuevo evento en ${categoryName}`,
      body: eventTitle,
      metadata: { eventId, type: 'new_event' },
      type: 'event'
    });
  }
}

module.exports = NotificationObserver;
