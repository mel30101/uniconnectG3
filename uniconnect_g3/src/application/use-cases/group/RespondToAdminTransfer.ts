import { IGroupRepository } from '../../../domain/repositories/IGroupRepository';

export class RespondToAdminTransfer {
  constructor(private groupRepository: IGroupRepository) {}

  async execute(groupId: string, candidateId: string, action: 'accept' | 'reject'): Promise<boolean> {
    return this.groupRepository.respondToAdminTransfer(groupId, candidateId, action);
  }
}
