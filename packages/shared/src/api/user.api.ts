import type { ApiClient } from './client';
import { API_ENDPOINTS, buildQueryString } from './endpoints';
import type { User, UserProfile, PaginatedResponse, ApiResponse } from '../types';
import type { UserSearchInput, UpdateUserProfileInput } from '../validators';

export class UserApi {
  constructor(private client: ApiClient) {}

  async getProfile(userId: string): Promise<ApiResponse<UserProfile>> {
    return this.client.get<UserProfile>(API_ENDPOINTS.USER.PROFILE(userId));
  }

  async updateProfile(data: UpdateUserProfileInput): Promise<ApiResponse<UserProfile>> {
    return this.client.put<UserProfile>(API_ENDPOINTS.USER.UPDATE_PROFILE, data);
  }

  async searchUsers(params: UserSearchInput): Promise<PaginatedResponse<User>> {
    const query = buildQueryString(params);
    return this.client.get<User[]>(`${API_ENDPOINTS.USER.SEARCH}${query}`) as Promise<PaginatedResponse<User>>;
  }
}
