import type { Group } from '@uniconnect/shared';

export interface IGroupRepository {
  getUserGroups(userId: string, role: 'admin' | 'student'): Promise<Group[]>;
  getGroupDetail(groupId: string): Promise<Group | null>;
  createGroup(name: string, subjectId: string, description: string, creatorId: string): Promise<any>;
  sendJoinRequest(groupId: string, userId: string, userName: string): Promise<any>;
  getRequests(groupId: string): Promise<any[]>;
  processRequest(groupId: string, requestId: string, status: 'accepted' | 'rejected'): Promise<boolean>;
  removeMember(groupId: string, userId: string, adminId: string): Promise<any>;
  transferAdmin(groupId: string, adminId: string, newAdminId: string): Promise<any>;
  addMember(groupId: string, userId: string, role: string): Promise<boolean>;
  leaveGroup(groupId: string, userId: string): Promise<boolean>;
  getAvailableStudents(groupId: string, subjectId: string, search?: string): Promise<any[]>;
  deleteUserRequests(groupId: string, userId: string): Promise<boolean>;
  respondToAdminTransfer(groupId: string, candidateId: string, action: 'accept' | 'reject'): Promise<boolean>;
  requestAdminTransfer(groupId: string, adminId: string, candidateId: string): Promise<boolean>;
}