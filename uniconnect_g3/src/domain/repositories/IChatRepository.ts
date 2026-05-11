import { Message } from '../entities/Message';
import { Chat } from '../entities/Chat';
export interface ChatFile {
  uri: string;
  name: string;
  type: string;
  size?: number;
}

export interface IChatRepository {
  sendMessage(chatId: string, text: string, senderId: string): Promise<void>;
  sendFileMessage(chatId: string, senderId: string, file: ChatFile, text?: string): Promise<void>;
  addReaction(chatId: string, messageId: string, emoji: string, userId: string): Promise<void>;
  subscribeToMessages(chatId: string, callback: (messages: Message[]) => void): () => void;
  subscribeToUserChats(userId: string, callback: (chats: Chat[]) => void): () => void;
  getOrCreateChat(
    currentUserId: string, 
    otherUserId: string, 
    currentUserName?: string, 
    otherUserName?: string
  ): Promise<string>;
  getChatDetails(chatId: string): Promise<any>;
}