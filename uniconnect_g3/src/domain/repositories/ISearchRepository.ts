import type { User, Group } from '@uniconnect/shared';

export interface ISearchRepository {
  searchStudents(name?: string, subjectIds?: string[], excludeId?: string): Promise<User[]>;
  searchGroups(name?: string, subjectId?: string, userSubjectIds?: string[], userId?: string): Promise<Group[]>;
}
