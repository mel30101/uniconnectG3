// @ts-nocheck
import { ISearchRepository } from '../../domain/repositories/ISearchRepository';

export class SearchStudents {
  constructor(private searchRepo: ISearchRepository) {}

  async execute(name?: string, subjectIds?: string[], excludeId?: string) {
    return this.searchRepo.searchStudents(name, subjectIds, excludeId);
  }
}

