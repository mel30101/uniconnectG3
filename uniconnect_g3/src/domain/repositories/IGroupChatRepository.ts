import { Message } from '../entities/Message';

export interface IGroupChatRepository {
  sendGroupMessage(groupId: string, text: string, senderId: string): Promise<void>;
  sendGroupFileMessage(groupId: string, senderId: string, file: any, text?: string): Promise<void>;
  addGroupReaction(groupId: string, messageId: string, emoji: string, userId: string): Promise<void>;
  subscribeToGroupMessages(groupId: string, callback: (messages: Message[]) => void): () => void;
}
