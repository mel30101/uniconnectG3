import { useParams } from 'react-router-dom'
import { useAuthStore, useUserStore } from '@uniconnect/shared'
import { useProfile } from '../hooks/useProfile'
import Avatar from '../components/Avatar'
import Spinner from '../components/Spinner'
import ProfileInfoRead from '../components/profile/ProfileInfoRead'
import ProfileInfoEdit from '../components/profile/ProfileInfoEdit'
import ProfileAcademicRead from '../components/profile/ProfileAcademicRead'
import ProfileAcademicEdit from '../components/profile/ProfileAcademicEdit'
import OnboardingModal from '../components/profile/OnboardingModal'
import { Pencil, LogOut } from 'lucide-react'

export default function ProfilePage() {
  const { id } = useParams()
  const { user: authUser, logout } = useAuthStore()
  const { clearProfile } = useUserStore()
  const {
    user,
    profileData,
    loading,
    saving,
    fetchingStructure,
    isEditing,
    setIsEditing,
    hasProfile,
    showOnboarding,
    sections,
    setProfileData,
    updateCareer,
    saveProfile,
    loadCareerStructure,
  } = useProfile(id)

  const isOwnProfile = !id || id === authUser?.uid

  const handleEdit = () => {
    setIsEditing(true)
    // Load career structure when entering edit mode if user has a career
    if (profileData.careerId && sections.length === 0) {
      loadCareerStructure(profileData.careerId)
    }
  }

  const handleSave = async () => {
    const result = await saveProfile()
    if (!result?.success) {
      alert(result?.error || 'Failed to save profile')
    }
  }

  const handleLogout = async () => {
    await logout()
    clearProfile()
    window.location.href = '/login'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Sincronizando con la U de Caldas...</span>
      </div>
    )
  }

  // Show onboarding modal for first-time users
  if (showOnboarding) {
    return (
      <OnboardingModal
        user={user}
        profileData={profileData}
        setProfileData={setProfileData}
        updateCareer={updateCareer}
        sections={sections}
        fetchingStructure={fetchingStructure}
        saving={saving}
        onSave={handleSave}
      />
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar src={user?.photoURL} name={user?.name} size="lg" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user?.name ?? '—'}
              </h1>
              <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
              {profileData.careerName && (
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                  {profileData.careerName}
                </p>
              )}
            </div>
          </div>
          {isOwnProfile && !isEditing && (
            <div className="flex gap-2">
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                <Pencil size={16} />
                Editar
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut size={16} />
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Content */}
      {isEditing ? (
        <>
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
            hasProfile={hasProfile}
          />

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </>
      ) : (
        <>
          <ProfileInfoRead user={user} profileData={profileData} />
          <ProfileAcademicRead profileData={profileData} sections={sections} />
        </>
      )}
    </div>
  )
}
