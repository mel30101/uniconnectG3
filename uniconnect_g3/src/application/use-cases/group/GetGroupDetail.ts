// @ts-nocheck
import { IGroupRepository } from '../../domain/repositories/IGroupRepository';

export class GetGroupDetail {
  constructor(private groupRepo: IGroupRepository) {}

  async execute(groupId: string) {
    return this.groupRepo.getGroupDetail(groupId);
  }
}

