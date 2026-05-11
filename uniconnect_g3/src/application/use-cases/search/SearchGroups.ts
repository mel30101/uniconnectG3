// @ts-nocheck
import { ISearchRepository } from '../../domain/repositories/ISearchRepository';

export class SearchGroups {
  constructor(private searchRepo: ISearchRepository) {}

  async execute(name?: string, subjectId?: string, userSubjectIds?: string[], userId?: string) {
    return this.searchRepo.searchGroups(name, subjectId, userSubjectIds, userId);
  }
}

