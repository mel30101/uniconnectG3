import { IAcademicRepository } from '../../../domain/repositories/IAcademicRepository';
import { IProfileRepository } from '../../../domain/repositories/IProfileRepository';

export class GetFullProfile {
    constructor(
        private profileRepo: IProfileRepository,
        private academicRepo: IAcademicRepository
    ) { }

    async execute(uid: string) {
        const [profile, careers] = await Promise.all([
            this.profileRepo.getFullProfile(uid),
            this.academicRepo.getCareers(),
        ]);

        let sections: any[] = [];
        if (profile?.careerId) {
            sections = await this.academicRepo.getCareerStructure(profile.careerId);
        }

        return { profile, careers, sections };
    }
}