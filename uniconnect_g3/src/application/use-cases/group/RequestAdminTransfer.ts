import { IGroupRepository } from '../../../domain/repositories/IGroupRepository';

export class RequestAdminTransfer {
  constructor(private groupRepository: IGroupRepository) {}

  async execute(groupId: string, adminId: string, candidateId: string): Promise<boolean> {
    return this.groupRepository.requestAdminTransfer(groupId, adminId, candidateId);
  }
}
