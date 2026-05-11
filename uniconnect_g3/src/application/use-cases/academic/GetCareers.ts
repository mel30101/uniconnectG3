// @ts-nocheck
import { IAcademicRepository } from '../../domain/repositories/IAcademicRepository';

export class GetCareers {
  constructor(private academicRepo: IAcademicRepository) {}

  async execute() {
    return this.academicRepo.getCareers();
  }
}

