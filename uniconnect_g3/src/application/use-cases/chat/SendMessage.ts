import { IChatRepository } from '../../../domain/repositories/IChatRepository';

export class SendMessage {
  constructor(private chatRepo: IChatRepository) {}

  async execute(chatId: string, text: string, senderId: string) {
    return this.chatRepo.sendMessage(chatId, text, senderId);
  }
}
