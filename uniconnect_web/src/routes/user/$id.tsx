import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore, type AcademicProfile } from '@uniconnect/shared'
import { apiClient } from '../../main'
import { db } from '../../lib/firestore'
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore'
import Avatar from '../../components/Avatar'
import Spinner from '../../components/Spinner'
import ProfileInfoRead from '../../components/profile/ProfileInfoRead'
import ProfileAcademicRead from '../../components/profile/ProfileAcademicRead'
import ProfileEnrichedView from '../../components/profile/ProfileEnrichedView'
import { ArrowLeft, MessageCircle, Award, Loader2 } from 'lucide-react'

export default function ExternalProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user: authUser } = useAuthStore()

  const [profileData, setProfileData] = useState<Partial<AcademicProfile> | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFullView, setIsFullView] = useState(false)
  const [loadingFull, setLoadingFull] = useState(false)
  const [fullProfileData, setFullProfileData] = useState<AcademicProfile | null>(null)
  const [chatLoading, setChatLoading] = useState(false)
  const fetchedRef = useRef(false)

  useEffect(() => {
    if (!id || fetchedRef.current) return
    fetchedRef.current = true
    setLoading(true)
    apiClient.getAxiosInstance()
      .get(`/api/users/profile/${id}`)
      .then(res => {
        if (res.data) {
          setProfileData(res.data)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  const fetchFullProfile = async () => {
    if (!id || isFullView) {
      setIsFullView(true)
      return
    }
    setLoadingFull(true)
    try {
      const res = await apiClient.getAxiosInstance().get<AcademicProfile>(
        `/api/users/profile/estadisticas/${id}?vista=completa`
      )
      if (res.data) {
        setFullProfileData(res.data)
        setIsFullView(true)
      }
    } catch (e) {
      console.error('Error loading full profile:', e)
    } finally {
      setLoadingFull(false)
    }
  }

  const handleStartChat = async () => {
    if (!authUser?.uid || !id) return
    setChatLoading(true)
    try {
      // Check if chat already exists
      const snap = await getDocs(query(
        collection(db, 'chats'),
        where('participants', 'array-contains', authUser.uid)
      ))
      const existing = snap.docs.find(d => {
        const p: string[] = d.data().participants ?? []
        return p.length === 2 && p.includes(id)
      })
      if (existing) {
        navigate('/chat', { state: { selectedChatId: existing.id } })
        return
      }
      // Create new chat
      const chatDoc = await addDoc(collection(db, 'chats'), {
        participants: [authUser.uid, id],
        participantsInfo: {
          [authUser.uid]: { name: authUser.name ?? 'Usuario' },
          [id]: { name: profileData?.userName ?? 'Estudiante' },
        },
        lastMessage: '',
        updatedAt: serverTimestamp(),
      })
      navigate('/chat', { state: { selectedChatId: chatDoc.id } })
    } catch (err) {
      console.error('Error creating chat:', err)
    } finally {
      setChatLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando perfil...</span>
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <p className="text-red-600">Perfil no encontrado</p>
          <button
            onClick={() => navigate(-1)}
            className="inline-block mt-4 text-[#002344] hover:underline"
          >
            Volver
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-[#6b7280] hover:text-[#111827]"
      >
        <ArrowLeft size={16} />Volver
      </button>

      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-4">
          <Avatar name={profileData.userName ?? 'Estudiante'} size="lg" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {profileData.userName ?? 'Estudiante'}
            </h1>
            {profileData.showEmail && profileData.email && (
              <p className="text-gray-500 dark:text-gray-400">{profileData.email}</p>
            )}
            {profileData.careerName && (
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                {profileData.careerName}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Personal Info */}
      {(profileData.age || profileData.phone || profileData.studyPreference || profileData.biography) && (
        <ProfileInfoRead
          user={{ name: profileData.userName ?? '', email: profileData.email ?? '' } as any}
          profileData={profileData}
        />
      )}

      {/* Academic Info */}
      <ProfileAcademicRead profileData={profileData} sections={[]} />

      {/* Full view button / enriched view */}
      {!isFullView ? (
        <button
          onClick={fetchFullProfile}
          disabled={loadingFull}
          className="w-full py-3 text-sm font-medium text-white bg-[#b39055] rounded-lg hover:bg-[#b39055]/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loadingFull ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Cargando...
            </>
          ) : (
            <>
              <Award size={16} />
              Ver vista completa
            </>
          )}
        </button>
      ) : (
        <ProfileEnrichedView
          estadisticas={fullProfileData?.estadisticas}
          insignias={fullProfileData?.insignias}
        />
      )}

      {/* Chat button */}
      <button
        onClick={handleStartChat}
        disabled={chatLoading}
        className="w-full flex items-center justify-center gap-2 py-3 bg-[#002344] hover:bg-[#002344]/90 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
      >
        {chatLoading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Buscando chat...
          </>
        ) : (
          <>
            <MessageCircle size={18} />
            Iniciar Chat Privado
          </>
        )}
      </button>
    </div>
  )
}
