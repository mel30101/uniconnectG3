import { useEffect, useState } from 'react';
import { searchStudents, getCareerStructure } from '../../di/container';
import { User } from '../../domain/entities/User';
import { Section } from '../../domain/entities/Section';
import { ApiProfileRepository } from '../../data/repositories/ApiProfileRepository';

export const useSearchStudents = (userId?: string, initialCareerId?: string) => {
  const [users, setUsers] = useState<User[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeCareerId, setActiveCareerId] = useState<string | undefined>(initialCareerId);

  useEffect(() => {
    const verifyAcademicProfile = async () => {
      if (!userId) return;
      if (initialCareerId) {
        setActiveCareerId(initialCareerId);
        return;
      }
      try {
        const profileRepo = new ApiProfileRepository();
        const profile = await profileRepo.getProfile(userId);
        if (profile?.careerId) {
          setActiveCareerId(profile.careerId);
        }
      } catch (error) {
        console.error('Error verificando perfil académico:', error);
      }
    };
    verifyAcademicProfile();
  }, [userId, initialCareerId]);

  useEffect(() => {
    if (!activeCareerId) return;
    const loadSections = async () => {
      try {
        const data = await getCareerStructure.execute(activeCareerId);
        setSections(data);
      } catch (error) {
        console.error('Error al cargar secciones:', error);
      }
    };
    loadSections();
  }, [activeCareerId]);

  const performSearch = async (search: string, selectedMaterias: string[]) => {
    try {
      setLoading(true);
      const data = await searchStudents.execute(
        search.trim(),
        selectedMaterias.length > 0 ? selectedMaterias : undefined,
        userId
      );
      setUsers(data as User[]);
    } catch (error) {
      console.error('Error en búsqueda:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetResults = () => setUsers([]);

  return { users, sections, loading, performSearch, resetResults, hasCareer: !!activeCareerId };
};
