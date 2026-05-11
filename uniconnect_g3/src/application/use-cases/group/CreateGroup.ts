// @ts-nocheck
import { IGroupRepository } from '../../domain/repositories/IGroupRepository';

export class CreateGroup {
  constructor(private groupRepo: IGroupRepository) {}

  async execute(name: string, subjectId: string, description: string, creatorId: string) {
    return this.groupRepo.createGroup(name, subjectId, description, creatorId);
  }
}

