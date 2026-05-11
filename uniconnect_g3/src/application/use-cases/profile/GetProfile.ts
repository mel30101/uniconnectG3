import { IAcademicRepository } from '../../../domain/repositories/IAcademicRepository';
import { IProfileRepository } from '../../../domain/repositories/IProfileRepository';

export class GetProfile {
  constructor(
    private profileRepo: IProfileRepository,
    private academicRepo: IAcademicRepository
  ) {}

  async execute(uid: string) {
    const [profile, careers] = await Promise.all([
      this.profileRepo.getProfile(uid),
      this.academicRepo.getCareers(),
    ]);

    let sections: any[] = [];
    if (profile?.careerId) {
      sections = await this.academicRepo.getCareerStructure(profile.careerId);
    }

    return { profile, careers, sections };
  }
}
