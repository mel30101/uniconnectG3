// @ts-nocheck
import { IGroupRepository } from '../../domain/repositories/IGroupRepository';

export class LeaveGroup {
  constructor(private groupRepo: IGroupRepository) {}

  async execute(groupId: string, userId: string) {
    return this.groupRepo.leaveGroup(groupId, userId);
  }
}

