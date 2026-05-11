// @ts-nocheck
import { IAcademicRepository } from '../../domain/repositories/IAcademicRepository';

export class GetSubjects {
  constructor(private academicRepo: IAcademicRepository) {}

  async execute() {
    return this.academicRepo.getSubjects();
  }
}

