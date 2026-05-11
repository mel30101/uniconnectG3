import { IEventRepository } from '../../domain/repositories/IEventRepository';
import { EventApi } from '@uniconnect/shared';
import type { Event, EventCategory } from '@uniconnect/shared';
import apiClient from '../sources/ApiClient';

// Backend (social-service eventController) returns raw arrays/objects directly.
const arr = (r: unknown): any[] => {
  const v = (r as any)?.data ?? r;
  return Array.isArray(v) ? v : [];
};

export class ApiEventRepository implements IEventRepository {
  private eventApi: EventApi;

  constructor() {
    this.eventApi = new EventApi(apiClient);
  }

  async getEvents(categoryId?: string): Promise<Event[]> {
    const response = await this.eventApi.getEvents(categoryId);
    return arr(response) as Event[];
  }

  async getCategories(): Promise<EventCategory[]> {
    const response = await this.eventApi.getCategories();
    return arr(response) as EventCategory[];
  }

  async subscribeToCategory(userId: string, categoryId: string): Promise<void> {
    await this.eventApi.subscribeToCategory(userId, categoryId);
  }

  async unsubscribeFromCategory(userId: string, categoryId: string): Promise<void> {
    await this.eventApi.unsubscribeFromCategory(userId, categoryId);
  }

  async getSubscribedCategories(userId: string): Promise<string[]> {
    const response = await this.eventApi.getSubscribedCategories(userId);
    return arr(response) as string[];
  }
}
