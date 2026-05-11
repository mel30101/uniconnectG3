// @ts-nocheck
import { IGroupRepository } from '../../domain/repositories/IGroupRepository';

export class GetUserGroups {
  constructor(private groupRepo: IGroupRepository) {}

  async execute(userId: string, role: 'admin' | 'student') {
    return this.groupRepo.getUserGroups(userId, role);
  }
}

