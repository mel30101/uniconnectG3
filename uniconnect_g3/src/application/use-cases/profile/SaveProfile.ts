// @ts-nocheck
import { IProfileRepository } from '../../domain/repositories/IProfileRepository';
import { AcademicProfile } from '../../domain/entities/AcademicProfile';

export class SaveProfile {
  constructor(private profileRepo: IProfileRepository) {}

  validate(profileData: Partial<AcademicProfile>): string | null {
    const { phone, age, facultyId, academicLevelId, formationLevelId, careerId, subjects } = profileData;

    if (phone && phone.toString().length !== 10) {
      return 'El número de celular debe tener exactamente 10 dígitos.';
    }
    if (age && age.toString().length !== 2) {
      return 'La edad debe tener exactamente 2 dígitos.';
    }
    if (!facultyId || !academicLevelId || !formationLevelId || !careerId) {
      return 'Para continuar, es obligatorio completar todo tu recorrido académico (Facultad, Niveles y Carrera).';
    }
    if (!subjects || subjects.length === 0) {
      return 'Debes seleccionar al menos una materia para registrar tu perfil académico.';
    }
    return null;
  }

  async execute(studentId: string, profileData: Partial<AcademicProfile>) {
    const error = this.validate(profileData);
    if (error) {
      throw new Error(error);
    }
    return this.profileRepo.saveProfile(studentId, profileData);
  }
}

