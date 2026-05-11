import type { ApiClient } from './client';
import { API_ENDPOINTS } from './endpoints';
import type { Chat, Message, ApiResponse } from '../types';
import type { CreateChatInput, SendMessageInput } from '../validators';

export class ChatApi {
  constructor(private client: ApiClient) {}

  async listChats(): Promise<ApiResponse<Chat[]>> {
    return this.client.get<Chat[]>(API_ENDPOINTS.CHAT.LIST);
  }

  async getChat(chatId: string): Promise<ApiResponse<Chat>> {
    return this.client.get<Chat>(API_ENDPOINTS.CHAT.DETAIL(chatId));
  }

  async createChat(data: CreateChatInput): Promise<ApiResponse<Chat>> {
    return this.client.post<Chat>(API_ENDPOINTS.CHAT.CREATE, data);
  }

  async getMessages(chatId: string): Promise<ApiResponse<Message[]>> {
    return this.client.get<Message[]>(API_ENDPOINTS.CHAT.MESSAGES(chatId));
  }

  async sendMessage(data: SendMessageInput): Promise<ApiResponse<Message>> {
    return this.client.post<Message>(API_ENDPOINTS.CHAT.SEND_MESSAGE(data.chatId), data);
  }

  async markAsRead(chatId: string): Promise<ApiResponse<void>> {
    return this.client.post<void>(API_ENDPOINTS.CHAT.MARK_READ(chatId));
  }
}
