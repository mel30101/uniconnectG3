import type { ApiClient } from './client';
import type { User, Group, ApiResponse } from '../types';

export interface SearchStudentsParams {
  name?: string;
  subjectIds?: string[];
  excludeId?: string;
}

export interface SearchGroupsParams {
  search?: string;
  subjectId?: string;
  userSubjectIds?: string[];
  userId?: string;
}

export class SearchApi {
  constructor(private client: ApiClient) {}

  async searchStudents(params: SearchStudentsParams): Promise<ApiResponse<User[]>> {
    const queryParams = new URLSearchParams();
    if (params.name) queryParams.append('name', params.name);
    if (params.subjectIds && params.subjectIds.length > 0) {
      queryParams.append('subjectId', params.subjectIds.join(','));
    }
    if (params.excludeId) queryParams.append('excludeId', params.excludeId);

    return this.client.get<User[]>(`/api/search-students?${queryParams.toString()}`);
  }

  async searchGroups(params: SearchGroupsParams): Promise<ApiResponse<Group[]>> {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append('search', params.search);
    if (params.subjectId) queryParams.append('subjectId', params.subjectId);
    if (params.userSubjectIds && params.userSubjectIds.length > 0) {
      queryParams.append('userSubjectIds', params.userSubjectIds.join(','));
    }
    if (params.userId) queryParams.append('userId', params.userId);

    return this.client.get<Group[]>(`/api/groups?${queryParams.toString()}`);
  }
}
