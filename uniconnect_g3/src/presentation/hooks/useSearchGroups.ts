import { useState } from 'react';
import { searchGroups } from '../../di/container';
import { authStore } from '@uniconnect/shared';
import { Group } from '../../domain/entities/Group';

export const useSearchGroups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const user = authStore((state) => state.user);

  const performSearch = async (search: string, subjectId?: string, userSubjectIds?: string[]) => {
    if (!user?.uid) return;
    try {
      setLoading(true);
      const data = await searchGroups.execute(search.trim(), subjectId, userSubjectIds, user.uid);
      setGroups(data);
    } catch (error) {
      console.error('Error searching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetResults = () => setGroups([]);

  return { groups, loading, performSearch, resetResults };
};
