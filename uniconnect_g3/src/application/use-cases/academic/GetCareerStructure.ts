// @ts-nocheck
import { IAcademicRepository } from '../../domain/repositories/IAcademicRepository';

export class GetCareerStructure {
  constructor(private academicRepo: IAcademicRepository) {}
  async execute(careerId: string) {
    return this.academicRepo.getCareerStructure(careerId);
  }
}

