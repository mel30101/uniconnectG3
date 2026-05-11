import { IChatRepository, ChatFile } from '../../../domain/repositories/IChatRepository';

export class SendFileMessage {
  constructor(private chatRepo: IChatRepository) {}

  async execute(chatId: string, senderId: string, file: ChatFile, text?: string) {
    return this.chatRepo.sendFileMessage(chatId, senderId, file, text);
  }
}