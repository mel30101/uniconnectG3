import { ISearchRepository } from '../../domain/repositories/ISearchRepository';
import { SearchApi } from '@uniconnect/shared';
import type { User, Group } from '@uniconnect/shared';
import apiClient from '../sources/ApiClient';

// Backend (user-service searchController, social-service groupController)
// returns raw arrays directly — no { success, data } wrapper.
const arr = (r: unknown): any[] => {
  const v = (r as any)?.data ?? r;
  return Array.isArray(v) ? v : [];
};

export class ApiSearchRepository implements ISearchRepository {
  private searchApi: SearchApi;

  constructor() {
    this.searchApi = new SearchApi(apiClient);
  }

  async searchStudents(name?: string, subjectIds?: string[], excludeId?: string): Promise<User[]> {
    const response = await this.searchApi.searchStudents({ name, subjectIds, excludeId });
    return arr(response) as User[];
  }

  async searchGroups(name?: string, subjectId?: string, userSubjectIds?: string[], userId?: string): Promise<Group[]> {
    const response = await this.searchApi.searchGroups({
      search: name,
      subjectId,
      userSubjectIds,
      userId,
    });
    return arr(response) as Group[];
  }
}
