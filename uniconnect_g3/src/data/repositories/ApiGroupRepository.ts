import { IGroupRepository } from '../../domain/repositories/IGroupRepository';
import { GroupApi } from '@uniconnect/shared';
import type { Group } from '@uniconnect/shared';
import apiClient from '../sources/ApiClient';

// Backend (social-service groupController) returns raw objects/arrays directly:
//   res.json(groups)  /  res.json(result)  — no { success, data } wrapper.
// ApiClient returns the HTTP body typed as ApiResponse<T>.
// We must read the value directly, not via .data.
const raw = (r: unknown): any => r;
const arr = (r: unknown): any[] => {
  const v = raw(r).data ?? r;
  return Array.isArray(v) ? v : [];
};
const obj = (r: unknown): any => raw(r).data ?? r;
// For boolean results: if the call didn't throw, treat as success.
const ok = (): boolean => true;

export class ApiGroupRepository implements IGroupRepository {
  private groupApi: GroupApi;

  constructor() {
    this.groupApi = new GroupApi(apiClient);
  }

  async getUserGroups(userId: string, role: 'admin' | 'student'): Promise<Group[]> {
    const response = await this.groupApi.getUserGroups(userId, role);
    return arr(response) as Group[];
  }

  async getGroupDetail(groupId: string): Promise<Group | null> {
    try {
      const response = await this.groupApi.getGroup(groupId);
      return (obj(response) as Group) || null;
    } catch {
      return null;
    }
  }

  async createGroup(name: string, subjectId: string, description: string, creatorId: string): Promise<any> {
    const response = await this.groupApi.createGroup({ name, subjectId, description, creatorId } as any);
    return obj(response);
  }

  async sendJoinRequest(groupId: string, userId: string, userName: string): Promise<any> {
    const response = await this.groupApi.sendJoinRequest(groupId, userId, userName);
    return obj(response);
  }

  async getRequests(groupId: string): Promise<any[]> {
    const response = await this.groupApi.getRequests(groupId);
    return arr(response);
  }

  async processRequest(groupId: string, requestId: string, status: 'accepted' | 'rejected'): Promise<boolean> {
    await this.groupApi.processRequest(groupId, requestId, status);
    return ok();
  }

  async removeMember(groupId: string, userId: string, adminId: string): Promise<any> {
    const response = await this.groupApi.removeMember(groupId, userId, adminId);
    return obj(response);
  }

  async transferAdmin(groupId: string, adminId: string, newAdminId: string): Promise<any> {
    const response = await this.groupApi.transferAdmin(groupId, adminId, newAdminId);
    return obj(response);
  }

  async addMember(groupId: string, userId: string, role: string): Promise<boolean> {
    await this.groupApi.addMember(groupId, userId, role);
    return ok();
  }

  async leaveGroup(groupId: string, userId: string): Promise<boolean> {
    await this.groupApi.leaveGroup(groupId, userId);
    return ok();
  }

  async getAvailableStudents(groupId: string, subjectId: string, search: string = ''): Promise<any[]> {
    const response = await this.groupApi.getAvailableStudents(groupId, subjectId, search);
    return arr(response);
  }

  async deleteUserRequests(groupId: string, userId: string): Promise<boolean> {
    try {
      await this.groupApi.deleteUserRequests(groupId, userId);
      return ok();
    } catch (error) {
      console.error("Error eliminando solicitudes viejas:", error);
      return false;
    }
  }

  async respondToAdminTransfer(groupId: string, candidateId: string, action: 'accept' | 'reject'): Promise<boolean> {
    await this.groupApi.respondToAdminTransfer(groupId, candidateId, action);
    return ok();
  }

  async requestAdminTransfer(groupId: string, adminId: string, candidateId: string): Promise<boolean> {
    await this.groupApi.requestAdminTransfer(groupId, adminId, candidateId);
    return ok();
  }
}
