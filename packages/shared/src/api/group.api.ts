import type { ApiClient } from './client';
import { API_ENDPOINTS, buildQueryString } from './endpoints';
import type { Group, GroupMember, PaginatedResponse, ApiResponse } from '../types';
import type { CreateGroupInput, UpdateGroupInput, GroupSearchInput } from '../validators';

export interface JoinRequest {
  id: string;
  userId: string;
  userName: string;
  groupId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

export class GroupApi {
  constructor(private client: ApiClient) {}

  async listGroups(params?: GroupSearchInput): Promise<PaginatedResponse<Group>> {
    const query = params ? buildQueryString(params) : '';
    return this.client.get<Group[]>(`${API_ENDPOINTS.GROUP.LIST}${query}`) as Promise<PaginatedResponse<Group>>;
  }

  async getUserGroups(userId: string, role: 'admin' | 'student'): Promise<ApiResponse<Group[]>> {
    return this.client.get<Group[]>(`/api/groups/user/${userId}?role=${role}`);
  }

  async getGroup(groupId: string): Promise<ApiResponse<Group>> {
    return this.client.get<Group>(API_ENDPOINTS.GROUP.DETAIL(groupId));
  }

  async createGroup(data: CreateGroupInput): Promise<ApiResponse<Group>> {
    return this.client.post<Group>(API_ENDPOINTS.GROUP.CREATE, data);
  }

  async updateGroup(groupId: string, data: UpdateGroupInput): Promise<ApiResponse<Group>> {
    return this.client.put<Group>(API_ENDPOINTS.GROUP.UPDATE(groupId), data);
  }

  async deleteGroup(groupId: string): Promise<ApiResponse<void>> {
    return this.client.delete<void>(API_ENDPOINTS.GROUP.DELETE(groupId));
  }

  async getMembers(groupId: string): Promise<ApiResponse<GroupMember[]>> {
    return this.client.get<GroupMember[]>(API_ENDPOINTS.GROUP.MEMBERS(groupId));
  }

  async joinGroup(groupId: string): Promise<ApiResponse<void>> {
    return this.client.post<void>(API_ENDPOINTS.GROUP.JOIN(groupId));
  }

  async leaveGroup(groupId: string, userId: string): Promise<ApiResponse<void>> {
    return this.client.delete<void>(`/api/groups/${groupId}/leave/${userId}`);
  }

  async sendJoinRequest(groupId: string, userId: string, userName: string): Promise<ApiResponse<JoinRequest>> {
    return this.client.post<JoinRequest>(`/api/groups/${groupId}/requests`, { userId, userName });
  }

  async getRequests(groupId: string): Promise<ApiResponse<JoinRequest[]>> {
    return this.client.get<JoinRequest[]>(`/api/groups/${groupId}/requests`);
  }

  async processRequest(groupId: string, requestId: string, status: 'accepted' | 'rejected'): Promise<ApiResponse<void>> {
    return this.client.put<void>(`/api/groups/${groupId}/requests/${requestId}`, { status });
  }

  async removeMember(groupId: string, userId: string, adminId: string): Promise<ApiResponse<void>> {
    return this.client.delete<void>(`/api/groups/${groupId}/members/${userId}?adminId=${adminId}`);
  }

  async addMember(groupId: string, userId: string, role: string): Promise<ApiResponse<void>> {
    return this.client.post<void>(`/api/groups/${groupId}/members`, { userId, role });
  }

  async transferAdmin(groupId: string, adminId: string, newAdminId: string): Promise<ApiResponse<void>> {
    return this.client.put<void>(`/api/groups/${groupId}/transfer-admin`, { adminId, newAdminId });
  }

  async requestAdminTransfer(groupId: string, adminId: string, candidateId: string): Promise<ApiResponse<void>> {
    return this.client.post<void>(`/api/groups/${groupId}/transfer-admin/request`, { adminId, candidateId });
  }

  async respondToAdminTransfer(groupId: string, candidateId: string, action: 'accept' | 'reject'): Promise<ApiResponse<void>> {
    return this.client.post<void>(`/api/groups/${groupId}/transfer-admin/response`, { candidateId, action });
  }

  async getAvailableStudents(groupId: string, subjectId: string, search: string = ''): Promise<ApiResponse<any[]>> {
    return this.client.get<any[]>(`/api/groups/${groupId}/available-students?subjectId=${subjectId}&search=${search}`);
  }

  async deleteUserRequests(groupId: string, userId: string): Promise<ApiResponse<void>> {
    return this.client.delete<void>(`/api/groups/${groupId}/requests/${userId}`);
  }
}
