import { IAcademicRepository } from '../../domain/repositories/IAcademicRepository';
import { AcademicApi } from '@uniconnect/shared';
import type { Career, Section, Subject } from '@uniconnect/shared';
import apiClient from '../sources/ApiClient';

// Backend (academic-service academicController) returns raw arrays directly.
const arr = (r: unknown): any[] => {
  const v = (r as any)?.data ?? r;
  return Array.isArray(v) ? v : [];
};

export class ApiAcademicRepository implements IAcademicRepository {
  private academicApi: AcademicApi;

  constructor() {
    this.academicApi = new AcademicApi(apiClient);
  }

  async getCareers(): Promise<Career[]> {
    const response = await this.academicApi.getCareers();
    return arr(response) as Career[];
  }

  async getCareerStructure(careerId: string): Promise<Section[]> {
    const response = await this.academicApi.getCareerStructure(careerId);
    return arr(response) as Section[];
  }

  async getSubjects(): Promise<Subject[]> {
    const response = await this.academicApi.getSubjects();
    return arr(response) as Subject[];
  }
}
