import { useState, useEffect } from 'react';
import type { AcademicProfile, Section } from '@uniconnect/shared';
import { apiClient } from '../../main';
import Spinner from '../Spinner';

interface ProfileAcademicEditProps {
  profileData: Partial<AcademicProfile>;
  setProfileData: (data: Partial<AcademicProfile>) => void;
  updateCareer: (id: string) => void;
  sections: Section[];
  fetchingStructure: boolean;
  hasProfile: boolean;
}

export default function ProfileAcademicEdit({
  profileData,
  setProfileData,
  updateCareer,
  sections,
  fetchingStructure,
  hasProfile,
}: ProfileAcademicEditProps) {
  const [faculties, setFaculties] = useState<{ id: string; name: string }[]>([]);
  const [academicLevels, setAcademicLevels] = useState<{ id: string; name: string }[]>([]);
  const [formationLevels, setFormationLevels] = useState<{ id: string; name: string }[]>([]);
  const [careers, setCareers] = useState<{ id: string; name: string }[]>([]);
  const [loadingHierarchy, setLoadingHierarchy] = useState(false);

  // Load faculties on mount
  useEffect(() => {
    setLoadingHierarchy(true);
    apiClient.getAxiosInstance().get<{ id: string; name: string }[]>('/api/hierarchy/faculties')
      .then((res) => setFaculties(res.data || []))
      .catch(console.error)
      .finally(() => setLoadingHierarchy(false));
  }, []);

  // Load academic levels when faculty changes
  useEffect(() => {
    if (profileData.facultyId) {
      apiClient.getAxiosInstance().get<{ id: string; name: string }[]>(`/api/hierarchy/academic-levels/${profileData.facultyId}`)
        .then((res) => setAcademicLevels(res.data || []))
        .catch(console.error);
    } else {
      setAcademicLevels([]);
    }
  }, [profileData.facultyId]);

  // Load formation levels when academic level changes
  useEffect(() => {
    if (profileData.facultyId && profileData.academicLevelId) {
      apiClient.getAxiosInstance().get<{ id: string; name: string }[]>(
        `/api/hierarchy/formation-levels/${profileData.facultyId}/${profileData.academicLevelId}`
      )
        .then((res) => setFormationLevels(res.data || []))
        .catch(console.error);
    } else {
      setFormationLevels([]);
    }
  }, [profileData.facultyId, profileData.academicLevelId]);

  // Load careers when formation level changes
  useEffect(() => {
    if (profileData.facultyId && profileData.academicLevelId && profileData.formationLevelId) {
      apiClient.getAxiosInstance().get<{ id: string; name: string }[]>(
        `/api/hierarchy/careers-by-path/${profileData.facultyId}/${profileData.academicLevelId}/${profileData.formationLevelId}`
      )
        .then((res) => setCareers(res.data || []))
        .catch(console.error);
    } else {
      setCareers([]);
    }
  }, [profileData.facultyId, profileData.academicLevelId, profileData.formationLevelId]);

  const handleFacultyChange = (id: string) => {
    setProfileData({
      ...profileData,
      facultyId: id,
      academicLevelId: '',
      formationLevelId: '',
      careerId: '',
      subjects: [],
    });
  };

  const handleAcademicLevelChange = (id: string) => {
    setProfileData({
      ...profileData,
      academicLevelId: id,
      formationLevelId: '',
      careerId: '',
      subjects: [],
    });
  };

  const handleFormationLevelChange = (id: string) => {
    setProfileData({
      ...profileData,
      formationLevelId: id,
      careerId: '',
      subjects: [],
    });
  };

  const handleCareerChange = (id: string) => {
    updateCareer(id);
  };

  const toggleSubject = (subjectId: string) => {
    const subjects = profileData.subjects || [];
    const isSelected = subjects.includes(subjectId);
    const newSubjects = isSelected
      ? subjects.filter(id => id !== subjectId)
      : [...subjects, subjectId];
    setProfileData({ ...profileData, subjects: newSubjects });
  };

  const isFieldDisabled = hasProfile;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Perfil Académico</h2>
      
      {loadingHierarchy ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Facultad {isFieldDisabled && <span className="text-xs text-gray-500">(No editable)</span>}
            </label>
            <select
              value={profileData.facultyId || ''}
              onChange={(e) => handleFacultyChange(e.target.value)}
              disabled={isFieldDisabled}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
              <option value="">Selecciona una facultad...</option>
              {faculties.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nivel Académico {isFieldDisabled && <span className="text-xs text-gray-500">(No editable)</span>}
            </label>
            <select
              value={profileData.academicLevelId || ''}
              onChange={(e) => handleAcademicLevelChange(e.target.value)}
              disabled={!profileData.facultyId || isFieldDisabled}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
              <option value="">Selecciona un nivel académico...</option>
              {academicLevels.map(al => (
                <option key={al.id} value={al.id}>{al.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nivel de Formación {isFieldDisabled && <span className="text-xs text-gray-500">(No editable)</span>}
            </label>
            <select
              value={profileData.formationLevelId || ''}
              onChange={(e) => handleFormationLevelChange(e.target.value)}
              disabled={!profileData.academicLevelId || isFieldDisabled}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
              <option value="">Selecciona un nivel de formación...</option>
              {formationLevels.map(fl => (
                <option key={fl.id} value={fl.id}>{fl.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Carrera {isFieldDisabled && <span className="text-xs text-gray-500">(No editable)</span>}
            </label>
            <select
              value={profileData.careerId || ''}
              onChange={(e) => handleCareerChange(e.target.value)}
              disabled={!profileData.formationLevelId || isFieldDisabled}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
              <option value="">Selecciona una carrera...</option>
              {careers.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {fetchingStructure ? (
            <div className="flex justify-center py-8">
              <Spinner />
              <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando materias...</span>
            </div>
          ) : sections.length > 0 ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Selecciona tus materias del semestre actual
              </label>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {sections.map(section => (
                  <details key={section.sectionId} className="border border-gray-200 dark:border-slate-600 rounded-lg">
                    <summary className="px-4 py-2 cursor-pointer bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 font-medium text-gray-900 dark:text-white">
                      {section.sectionName} ({section.subjects.length})
                    </summary>
                    <div className="p-3 space-y-2">
                      {section.subjects.map(subject => {
                        const isSelected = profileData.subjects?.includes(subject.id);
                        return (
                          <label
                            key={subject.id}
                            className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-500'
                                : 'hover:bg-gray-50 dark:hover:bg-slate-700'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSubject(subject.id)}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <span className={`flex-1 text-sm ${isSelected ? 'font-medium text-blue-700 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                              {subject.name}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ) : profileData.careerId ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No hay materias disponibles para esta carrera.</p>
          ) : null}
        </>
      )}
    </div>
  );
}
