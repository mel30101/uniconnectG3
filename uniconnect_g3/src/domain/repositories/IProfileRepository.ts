import type { AcademicProfile } from '@uniconnect/shared';

export interface IProfileRepository {
  getProfile(uid: string): Promise<AcademicProfile | null>;
  getFullProfile(uid: string): Promise<AcademicProfile | null>;
  saveProfile(studentId: string, profileData: Partial<AcademicProfile>): Promise<AcademicProfile>;
}