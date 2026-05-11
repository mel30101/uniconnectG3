import { IProfileRepository } from '../../domain/repositories/IProfileRepository';
import { AcademicApi } from '@uniconnect/shared';
import type { AcademicProfile } from '@uniconnect/shared';
import apiClient from '../sources/ApiClient';

// Backend (user-service profileController) returns the profile object directly:
//   res.status(200).json(profile)   ← no { success, data } wrapper
// ApiClient.get() returns response.data (the HTTP body), so the raw object
// arrives typed as ApiResponse<T>. We must read it directly, not via .data.
const raw = (r: unknown): any => r;

export class ApiProfileRepository implements IProfileRepository {
  private academicApi: AcademicApi;

  constructor() {
    this.academicApi = new AcademicApi(apiClient);
  }

  async getProfile(uid: string): Promise<AcademicProfile | null> {
    try {
      const response = await this.academicApi.getProfile(uid);
      const profile = raw(response).data ?? response;
      return (profile as AcademicProfile) || null;
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      throw error;
    }
  }

  async getFullProfile(uid: string): Promise<AcademicProfile | null> {
    try {
      const response = await this.academicApi.getFullProfile(uid);
      const profile = raw(response).data ?? response;
      return (profile as AcademicProfile) || null;
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      throw error;
    }
  }

  async saveProfile(studentId: string, profileData: Partial<AcademicProfile>): Promise<AcademicProfile> {
    const response = await this.academicApi.saveProfile(studentId, profileData);
    return (raw(response).data ?? response) as AcademicProfile;
  }
}
