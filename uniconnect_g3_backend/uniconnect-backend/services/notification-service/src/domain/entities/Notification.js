const INotificacion = require('./INotificacion');

class Notification extends INotificacion {
  constructor({ id, userId, title, body, metadata = {}, type, status = 'unread', priority = 'normal', createdAt = new Date() }) {
    super();
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.body = body;
    this.metadata = metadata; // { chatId, groupId, eventId, etc. }
    this.type = type; // 'chat', 'group', 'event'
    this.status = status || 'unread'; // 'read', 'unread'
    this.priority = priority || 'normal'; // 'normal', 'urgente', 'critica'
    this.createdAt = createdAt || new Date();
  }

  static fromFirestore(id, data) {
    return new Notification({
      id,
      ...data,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
    });
  }

  getDTO() {
    const safePriority = this.priority || 'normal';
    const weightMap = { critica: 3, urgente: 2, normal: 1 };

    return {
      userId: this.userId,
      title: this.title,
      body: this.body,
      metadata: this.metadata,
      type: this.type,
      status: this.status,
      priority: safePriority,
      priorityWeight: weightMap[safePriority] || 1,
      createdAt: this.createdAt
    };
  }

  toFirestore() {
    return this.getDTO();
  }
}

module.exports = Notification;
