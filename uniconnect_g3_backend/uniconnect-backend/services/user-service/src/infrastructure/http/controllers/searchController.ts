import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/errorMiddleware';
import SearchStudents from '../../../application/use-cases/searchStudents';

interface SearchControllerUseCases {
  searchStudents: SearchStudents;
}

// Dynamic ESM import helper for CommonJS to prevent CJS compilation errors
const getShared = () => Function('return import("@uniconnect/shared")')() as Promise<typeof import('@uniconnect/shared')>;

export default class SearchController {
  private searchStudentsUC: SearchStudents;

  constructor(useCases: SearchControllerUseCases) {
    this.searchStudentsUC = useCases.searchStudents;
  }

  public searchStudents = asyncHandler(async (req: Request, res: Response) => {
    const { name, subjectId, excludeId } = req.query;

    // Load ESM module dynamically
    const { UserSearchSchema } = await getShared();

    // Validate search query using UserSearchSchema from @uniconnect/shared
    UserSearchSchema.parse({
      query: name as string,
      ...req.query
    });

    const results = await this.searchStudentsUC.execute({
      name: name as string,
      subjectId: subjectId as string,
      excludeId: excludeId as string
    });
    res.json(results);
  });
}
