import type { AcademicProfile, Section } from '@uniconnect/shared';

interface ProfileAcademicReadProps {
  profileData: Partial<AcademicProfile>;
  sections: Section[];
}

export default function ProfileAcademicRead({ profileData, sections }: ProfileAcademicReadProps) {
  const selectedSubjects = sections.flatMap(section => 
    section.subjects.filter(subject => profileData.subjects?.includes(subject.id))
  );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Perfil Académico</h2>
      
      <div>
        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Carrera</label>
        <p className="text-gray-900 dark:text-white">{profileData.careerName || '—'}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Este campo no se puede cambiar después del registro</p>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Nivel académico</label>
        <p className="text-gray-900 dark:text-white">{profileData.academicLevelName || '—'}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Este campo no se puede cambiar después del registro</p>
      </div>

      {profileData.facultyName && (
        <div>
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Facultad</label>
          <p className="text-gray-900 dark:text-white">{profileData.facultyName}</p>
        </div>
      )}

      {profileData.formationLevelName && (
        <div>
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Nivel de formación</label>
          <p className="text-gray-900 dark:text-white">{profileData.formationLevelName}</p>
        </div>
      )}

      <div>
        <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 block">
          Materias del semestre actual ({selectedSubjects.length})
        </label>
        {selectedSubjects.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">No has seleccionado materias aún</p>
        ) : (
          <div className="space-y-2">
            {sections.map(section => {
              const sectionSubjects = section.subjects.filter(subject => 
                profileData.subjects?.includes(subject.id)
              );
              if (sectionSubjects.length === 0) return null;
              
              return (
                <div key={section.sectionId} className="border-l-2 border-blue-500 pl-3">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {section.sectionName}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {sectionSubjects.map(subject => (
                      <span
                        key={subject.id}
                        className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm rounded-full"
                      >
                        {subject.name}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
