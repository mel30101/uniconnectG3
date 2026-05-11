import type { ApiClient } from './client';
import type { Career, Section, Subject, AcademicProfile, ApiResponse } from '../types';

export class AcademicApi {
  constructor(private client: ApiClient) {}

  async getCareers(): Promise<ApiResponse<Career[]>> {
    return this.client.get<Career[]>('/api/careers');
  }

  async getCareerStructure(careerId: string): Promise<ApiResponse<Section[]>> {
    return this.client.get<Section[]>(`/api/career-structure/${careerId}`);
  }

  async getSubjects(): Promise<ApiResponse<Subject[]>> {
    return this.client.get<Subject[]>('/api/subjects');
  }

  async getProfile(uid: string): Promise<ApiResponse<AcademicProfile>> {
    return this.client.get<AcademicProfile>(`/api/academic-profile/${uid}`);
  }

  async getFullProfile(uid: string): Promise<ApiResponse<AcademicProfile>> {
    return this.client.get<AcademicProfile>(`/api/academic-profile/estadisticas/${uid}?vista=completa`);
  }

  async saveProfile(studentId: string, profileData: Partial<AcademicProfile>): Promise<ApiResponse<AcademicProfile>> {
    return this.client.post<AcademicProfile>('/api/academic-profile', {
      studentId,
      ...profileData,
    });
  }
}
