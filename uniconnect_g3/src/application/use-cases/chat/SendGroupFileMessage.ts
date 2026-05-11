import { IGroupChatRepository } from '../../../domain/repositories/IGroupChatRepository';

export class SendGroupFileMessage {
  constructor(private groupChatRepo: IGroupChatRepository) {}

  async execute(groupId: string, senderId: string, file: any, text?: string) {
    return this.groupChatRepo.sendGroupFileMessage(groupId, senderId, file, text);
  }
}
