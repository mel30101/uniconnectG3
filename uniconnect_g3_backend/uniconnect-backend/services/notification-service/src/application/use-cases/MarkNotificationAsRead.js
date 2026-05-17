class MarkNotificationAsRead {
  constructor(notificationRepo) {
    this.notificationRepo = notificationRepo;
  }

  async execute(notificationId, authUserId) {
    if (!notificationId || !authUserId) {
      throw new Error('MISSING_FIELDS');
    }

    const notification = await this.notificationRepo.findById(notificationId);
    if (!notification) {
      throw new Error('NOTIFICATION_NOT_FOUND');
    }

    if (notification.userId !== authUserId) {
      throw new Error('UNAUTHORIZED');
    }

    if (notification.status !== 'read') {
      await this.notificationRepo.markAsRead(notificationId);
    }
    
    return true;
  }
}

module.exports = MarkNotificationAsRead;
