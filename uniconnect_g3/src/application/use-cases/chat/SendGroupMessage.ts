import { IGroupChatRepository } from '../../../domain/repositories/IGroupChatRepository';

export class SendGroupMessage {
  constructor(private groupChatRepo: IGroupChatRepository) {}

  async execute(groupId: string, text: string, senderId: string) {
    return this.groupChatRepo.sendGroupMessage(groupId, text, senderId);
  }
}
