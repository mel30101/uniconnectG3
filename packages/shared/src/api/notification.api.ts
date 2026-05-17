import type { ApiClient } from './client';
import type { Notification, ApiResponse } from '../types';

export class NotificationApi {
  constructor(private client: ApiClient) {}

  async getNotifications(userId: string): Promise<ApiResponse<Notification[]>> {
    return this.client.get<Notification[]>(`/api/notifications/${userId}`);
  }

  async markAsRead(notificationId: string): Promise<ApiResponse<void>> {
    return this.client.patch<void>(`/api/notifications/${notificationId}/read`);
  }

  async markAllAsRead(userId: string): Promise<ApiResponse<void>> {
    return this.client.patch<void>(`/api/notifications/user/${userId}/read-all`);
  }

  async getUnreadCount(userId: string): Promise<ApiResponse<number>> {
    return this.client.get<number>(`/api/notifications/${userId}/unread-count`);
  }
}
