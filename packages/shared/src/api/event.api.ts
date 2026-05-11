import type { ApiClient } from './client';
import type { Event, EventCategory, ApiResponse } from '../types';

export class EventApi {
  constructor(private client: ApiClient) {}

  async getEvents(categoryId?: string): Promise<ApiResponse<Event[]>> {
    const url = categoryId ? `/api/events?category=${categoryId}` : '/api/events';
    return this.client.get<Event[]>(url);
  }

  async getCategories(): Promise<ApiResponse<EventCategory[]>> {
    return this.client.get<EventCategory[]>('/api/events/categories');
  }

  async subscribeToCategory(userId: string, categoryId: string): Promise<ApiResponse<void>> {
    return this.client.post<void>('/api/events/suscribir', { userId, categoryId });
  }

  async unsubscribeFromCategory(userId: string, categoryId: string): Promise<ApiResponse<void>> {
    return this.client.delete<void>('/api/events/suscribir', { params: { userId, categoryId } });
  }

  async getSubscribedCategories(userId: string): Promise<ApiResponse<string[]>> {
    return this.client.get<string[]>(`/api/events/suscripciones/${userId}`);
  }
}
