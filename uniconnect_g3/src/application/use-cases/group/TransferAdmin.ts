// @ts-nocheck
import { IGroupRepository } from '../../domain/repositories/IGroupRepository';

export class TransferAdmin {
  constructor(private groupRepo: IGroupRepository) {}

  async execute(groupId: string, adminId: string, newAdminId: string) {
    return this.groupRepo.transferAdmin(groupId, adminId, newAdminId);
  }
}

