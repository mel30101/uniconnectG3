// @ts-nocheck
import { IGroupRepository } from '../../domain/repositories/IGroupRepository';

export class GetAvailableStudents {
  constructor(private groupRepo: IGroupRepository) {}

  async execute(groupId: string, subjectId: string, search: string = '') {
    return this.groupRepo.getAvailableStudents(groupId, subjectId, search);
  }
}

