// @ts-nocheck
import { IGroupRepository } from '../../domain/repositories/IGroupRepository';

export class AddMember {
  constructor(private groupRepo: IGroupRepository) {}

  async execute(groupId: string, userId: string, role: string = 'student') {
    return this.groupRepo.addMember(groupId, userId, role);
  }
}

