// @ts-nocheck
import { IGroupRepository } from '../../domain/repositories/IGroupRepository';

export class ProcessRequest {
  constructor(private groupRepo: IGroupRepository) {}

  async execute(groupId: string, requestId: string, status: 'accepted' | 'rejected') {
    return this.groupRepo.processRequest(groupId, requestId, status);
  }
}

