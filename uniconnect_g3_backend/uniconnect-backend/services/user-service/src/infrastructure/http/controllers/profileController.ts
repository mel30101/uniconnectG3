import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/errorMiddleware';
import GetFullProfile from '../../../application/use-cases/getFullProfile';
import SaveAcademicProfile from '../../../application/use-cases/saveAcademicProfile';
import GetDecoratedProfile from '../../../application/use-cases/getDecoratedProfile';

interface ProfileControllerUseCases {
  getFullProfile: GetFullProfile;
  saveAcademicProfile: SaveAcademicProfile;
  getDecoratedProfile: GetDecoratedProfile;
}

// Dynamic ESM import helper for CommonJS to prevent CJS compilation errors
const getShared = () => Function('return import("@uniconnect/shared")')() as Promise<typeof import('@uniconnect/shared')>;

export default class ProfileController {
  private saveAcademicProfileUC: SaveAcademicProfile;
  private getDecoratedProfileUC: GetDecoratedProfile;

  constructor(useCases: ProfileControllerUseCases) {
    this.saveAcademicProfileUC = useCases.saveAcademicProfile;
    this.getDecoratedProfileUC = useCases.getDecoratedProfile;
  }

  public getProfile = asyncHandler(async (req: Request, res: Response) => {
    const profile = await this.getDecoratedProfileUC.execute(req.params.studentId as string, 'base');
    res.status(200).json(profile);
  });

  public getDecoratedProfile = asyncHandler(async (req: Request, res: Response) => {
    const vista = (req.query.vista as string) || 'base';
    const profile = await this.getDecoratedProfileUC.execute(req.params.studentId as string, vista);
    res.status(200).json(profile);
  });

  public upsertProfile = asyncHandler(async (req: Request, res: Response) => {
    const { studentId, subjects, careerId } = req.body;
    if (!studentId || !subjects || !careerId) {
      return res.status(400).json({ error: "Datos incompletos (studentId, subjects y careerId son requeridos)" });
    }

    // Load ESM module dynamically
    const { UserSchema } = await getShared();

    // "Ley de Hierro" validation using @uniconnect/shared's UserSchema
    const payloadToValidate = {
      uid: studentId,
      ...req.body
    };
    UserSchema.partial().parse(payloadToValidate);

    const result = await this.saveAcademicProfileUC.execute(req.body);
    res.status(200).json(result);
  });
}
