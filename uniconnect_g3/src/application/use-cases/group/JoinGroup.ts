import { IGroupRepository } from '../../../domain/repositories/IGroupRepository';

export class JoinGroup {
  constructor(private groupRepo: IGroupRepository) {}

  async execute(groupId: string, userId: string, userName: string) {
    return this.groupRepo.sendJoinRequest(groupId, userId, userName);
  }
}
