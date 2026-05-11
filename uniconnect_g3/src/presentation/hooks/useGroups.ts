import { useCallback, useEffect, useState } from 'react';
import { getCareerStructure, getGroupDetail as getGroupDetailUC, getUserGroups } from '../../di/container';
import { Subject } from '../../domain/entities/Subject';
import { authStore } from '@uniconnect/shared';
import { useGroupActions } from './useGroupActions'; 

export const useGroups = () => {
  const user = authStore((state) => state.user);
  const actions = useGroupActions(); 

  const [loading, setLoading] = useState(false);
  const [userSubjects, setUserSubjects] = useState<Subject[]>([]);
  const [managedGroups, setManagedGroups] = useState<any[]>([]);
  const [memberGroups, setMemberGroups] = useState<any[]>([]);

  const fetchManagedGroups = useCallback(async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const data = await getUserGroups.execute(user.uid, 'admin');
      setManagedGroups(data);
    } catch (e) {
      console.error('Error fetching managed groups:', e);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  const fetchMemberGroups = useCallback(async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const data = await getUserGroups.execute(user.uid, 'student');
      setMemberGroups(data);
    } catch (e) {
      console.error('Error fetching member groups:', e);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  const fetchGroupDetail = useCallback(async (groupId: string) => {
    setLoading(true);
    try {
      return await getGroupDetailUC.execute(groupId);
    } catch (e) {
      console.error('Error fetching group detail:', e);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserSubjects = useCallback(async () => {
    if (!user?.uid || !user?.careerId) return;
    try {
      const sectionsData = await getCareerStructure.execute(user.careerId);
      const profileSubjects = user.subjects || [];
      const allSubjects: Subject[] = [];
      sectionsData.forEach((section: any) => {
        section.subjects.forEach((sub: any) => {
          if (profileSubjects.includes(sub.id)) {
            allSubjects.push({ id: sub.id, name: sub.name });
          }
        });
      });
      setUserSubjects(allSubjects);
    } catch (e) {
      console.error('Error fetching subjects for groups:', e);
    }
  }, [user?.uid, user?.careerId, user?.subjects]);

  useEffect(() => { fetchUserSubjects(); }, [fetchUserSubjects]);

  return {
    userSubjects,
    managedGroups,
    memberGroups,
    fetchManagedGroups,
    fetchMemberGroups,
    fetchGroupDetail,
    loading,
    ...actions, 
  };
};