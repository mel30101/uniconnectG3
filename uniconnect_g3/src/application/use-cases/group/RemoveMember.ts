import { IGroupRepository } from '../../../domain/repositories/IGroupRepository';

export class RemoveMember {
  constructor(private groupRepo: IGroupRepository) {}

  async execute(groupId: string, userId: string, adminId: string) {
    return this.groupRepo.removeMember(groupId, userId, adminId);
  }
}
