import type { User, AcademicProfile } from '@uniconnect/shared';

interface ProfileInfoEditProps {
  user: User | null;
  profileData: Partial<AcademicProfile>;
  setProfileData: (data: Partial<AcademicProfile>) => void;
}

export default function ProfileInfoEdit({ user, profileData, setProfileData }: ProfileInfoEditProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Información Personal</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Nombre completo
        </label>
        <input
          type="text"
          value={user?.name || ''}
          disabled
          className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Este campo no se puede editar (viene de Google)</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Correo institucional
        </label>
        <input
          type="email"
          value={user?.email || ''}
          disabled
          className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
        />
        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            id="showEmail"
            checked={profileData.showEmail}
            onChange={(e) => setProfileData({ ...profileData, showEmail: e.target.checked })}
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="showEmail" className="text-sm text-gray-700 dark:text-gray-300">
            Mostrar correo en mi perfil público
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Teléfono (Opcional)
        </label>
        <input
          type="tel"
          value={profileData.phone || ''}
          onChange={(e) => {
            const cleaned = e.target.value.replace(/[^0-9]/g, '');
            setProfileData({ ...profileData, phone: cleaned });
          }}
          maxLength={10}
          placeholder="3000000000"
          className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Edad (Opcional)
        </label>
        <input
          type="number"
          value={profileData.age || ''}
          onChange={(e) => {
            const cleaned = e.target.value.replace(/[^0-9]/g, '');
            setProfileData({ ...profileData, age: cleaned });
          }}
          min={15}
          max={99}
          placeholder="21"
          className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Biografía (Opcional)
        </label>
        <textarea
          value={profileData.biography || ''}
          onChange={(e) => setProfileData({ ...profileData, biography: e.target.value })}
          maxLength={300}
          rows={4}
          placeholder="Cuéntanos un poco sobre ti..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none dark:bg-slate-700 dark:text-white"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">
          {(profileData.biography || '').length}/300
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Preferencia de estudio
        </label>
        <select
          value={profileData.studyPreference || ''}
          onChange={(e) => setProfileData({ ...profileData, studyPreference: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
        >
          <option value="">Selecciona una opción (Opcional)</option>
          <option value="Presencial">Presencial</option>
          <option value="Virtual">Virtual</option>
          <option value="Cualquiera">Cualquiera</option>
        </select>
      </div>
    </div>
  );
}
