import { IChatRepository } from '../../../domain/repositories/IChatRepository';

export class GetOrCreateChat {
  constructor(private chatRepo: IChatRepository) {}

  async execute(currentUserId: string, otherUserId: string, currentUserName?: string, otherUserName?: string) {
    return this.chatRepo.getOrCreateChat(currentUserId, otherUserId, currentUserName, otherUserName);
  }
}
