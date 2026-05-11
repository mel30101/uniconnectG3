import { X } from 'lucide-react';
import type { AcademicProfile, Section } from '@uniconnect/shared';
import ProfileInfoEdit from './ProfileInfoEdit';
import ProfileAcademicEdit from './ProfileAcademicEdit';
import Spinner from '../Spinner';

interface OnboardingModalProps {
  user: any;
  profileData: Partial<AcademicProfile>;
  setProfileData: (data: Partial<AcademicProfile>) => void;
  updateCareer: (id: string) => void;
  sections: Section[];
  fetchingStructure: boolean;
  saving: boolean;
  onSave: () => void;
}

export default function OnboardingModal({
  user,
  profileData,
  setProfileData,
  updateCareer,
  sections,
  fetchingStructure,
  saving,
  onSave,
}: OnboardingModalProps) {
  const canSave = profileData.careerId && profileData.facultyId && profileData.academicLevelId && profileData.formationLevelId;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">¡Bienvenido a UniConnect!</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Completa tu perfil para empezar a conectar con la comunidad U de Caldas
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <ProfileInfoEdit
            user={user}
            profileData={profileData}
            setProfileData={setProfileData}
          />

          <ProfileAcademicEdit
            profileData={profileData}
            setProfileData={setProfileData}
            updateCareer={updateCareer}
            sections={sections}
            fetchingStructure={fetchingStructure}
            hasProfile={false}
          />

          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">
            <button
              onClick={onSave}
              disabled={!canSave || saving}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner />
                  Guardando...
                </span>
              ) : (
                'Finalizar Registro'
              )}
            </button>
          </div>

          {!canSave && (
            <p className="text-sm text-amber-600 dark:text-amber-400 text-center">
              Por favor completa todos los campos obligatorios de la sección académica
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
