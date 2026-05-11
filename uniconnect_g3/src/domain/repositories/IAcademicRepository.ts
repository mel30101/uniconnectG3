import type { Career, Section, Subject } from '@uniconnect/shared';

export interface IAcademicRepository {
  getCareers(): Promise<Career[]>;
  getCareerStructure(careerId: string): Promise<Section[]>;
  getSubjects(): Promise<Subject[]>;
  getFaculties?(): Promise<any[]>;
  getAcademicLevels?(): Promise<any[]>;
  getFormationLevels?(): Promise<any[]>;
}
