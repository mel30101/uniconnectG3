import type { User, AcademicProfile } from '@uniconnect/shared';

interface ProfileInfoReadProps {
  user: User | null;
  profileData: Partial<AcademicProfile>;
}

export default function ProfileInfoRead({ user, profileData }: ProfileInfoReadProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Información Personal</h2>
      
      <div>
        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Nombre completo</label>
        <p className="text-gray-900 dark:text-white">{user?.name || '—'}</p>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Correo institucional</label>
        <p className="text-gray-900 dark:text-white">{user?.email || '—'}</p>
        {profileData.showEmail && (
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">✓ Visible en tu perfil público</p>
        )}
      </div>

      {profileData.biography && (
        <div>
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Biografía</label>
          <p className="text-gray-900 dark:text-white">{profileData.biography}</p>
        </div>
      )}

      {profileData.phone && (
        <div>
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Teléfono</label>
          <p className="text-gray-900 dark:text-white">{profileData.phone}</p>
        </div>
      )}

      {profileData.age && (
        <div>
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Edad</label>
          <p className="text-gray-900 dark:text-white">{profileData.age} años</p>
        </div>
      )}

      {profileData.studyPreference && (
        <div>
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Preferencia de estudio</label>
          <p className="text-gray-900 dark:text-white">{profileData.studyPreference}</p>
        </div>
      )}
    </div>
  );
}
