import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore, useUserStore } from '@uniconnect/shared'
import { apiClient } from '../../main'
import Spinner from '../../components/Spinner'
import ModalErrorBoundary from '../../components/ModalErrorBoundary'
import { useNotifications } from '../../hooks/useNotifications'
import { Users, Plus, X, ChevronDown, BookOpen, User, MessageSquare, School } from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface UserGroup {
  id: string
  name: string
  subjectId?: string
  subjectName: string
  adminName: string
  description?: string
  members: string[]
  creatorId?: string
  createdAt?: string
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function GroupCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
      <div className="h-24 bg-gray-200" />
      <div className="p-4 space-y-2">
        <div className="h-5 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-100 rounded w-full" />
        <div className="h-4 bg-gray-100 rounded w-1/2" />
      </div>
    </div>
  )
}

// ─── Group Card ───────────────────────────────────────────────────────────────

interface GroupCardProps {
  group: UserGroup
  isAdmin: boolean
  onNavigate: () => void
}

function GroupCard({ group, isAdmin, onNavigate }: GroupCardProps) {
  return (
    <div
      onClick={onNavigate}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col"
    >
      {/* Dorado header */}
      <div className="bg-[#b39055] h-24 relative flex items-center px-4">
        <School size={36} className="text-white/80" />
        <span
          className={`absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full ${
            isAdmin
              ? 'bg-[#002344] text-white'
              : 'bg-white/20 text-white'
          }`}
        >
          {isAdmin ? 'ADMINISTRADOR' : 'MIEMBRO'}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div>
          <h3 className="font-bold text-[#111827] text-base leading-tight">{group.name}</h3>
          <span className="inline-block mt-1 text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
            ACTIVO
          </span>
        </div>

        {group.subjectName && (
          <p className="flex items-center gap-1.5 text-xs text-[#6b7280]">
            <BookOpen size={12} className="flex-shrink-0" />
            {group.subjectName}
          </p>
        )}

        {!isAdmin && group.adminName && (
          <p className="flex items-center gap-1.5 text-xs text-[#6b7280]">
            <User size={12} className="flex-shrink-0" />
            {group.adminName}
          </p>
        )}

        {group.description && (
          <p className="text-xs text-[#6b7280] line-clamp-2">{group.description}</p>
        )}

        {/* Footer */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-[#6b7280]">
            <Users size={13} />
            {group.members.length} Miembro{group.members.length !== 1 ? 's' : ''}
          </span>
          {isAdmin && (
            <button
              onClick={e => { e.stopPropagation(); onNavigate() }}
              className="text-xs px-3 py-1 border border-[#002344] text-[#002344] rounded-lg hover:bg-[#002344] hover:text-white transition-colors"
            >
              Gestionar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Create Group Modal ───────────────────────────────────────────────────────

interface CreateGroupModalProps {
  onClose: () => void
  onSuccess: () => void
  userSubjects: { id: string; name: string }[]
  userId: string
}

function CreateGroupModal({ onClose, onSuccess, userSubjects, userId }: CreateGroupModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedSubject, setSelectedSubject] = useState<{ id: string; name: string } | null>(null)
  const [subjectOpen, setSubjectOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreate = async () => {
    if (!name.trim() || name.trim().length < 3) {
      setError('El nombre debe tener al menos 3 caracteres.')
      return
    }
    if (!selectedSubject) {
      setError('Selecciona una materia.')
      return
    }
    setError(null)
    setLoading(true)
    try {
      await apiClient.getAxiosInstance().post('/api/groups', {
        name: name.trim(),
        subjectId: selectedSubject.id,
        description: description.trim(),
        creatorId: userId,
      })
      onSuccess()
    } catch (e: unknown) {
      const serverMsg = (e as any)?.response?.data?.message || ''
      const errorMap: Record<string, string> = {
        GROUP_NAME_ALREADY_EXISTS: 'Ya existe un grupo con ese nombre.',
        SUBJECT_GROUP_LIMIT_REACHED: 'Se alcanzó el límite de 3 grupos para esta materia.',
        NAME_TOO_SHORT: 'El nombre debe tener al menos 3 caracteres.',
        MISSING_FIELDS: 'Completa todos los campos requeridos.',
      }
      setError(errorMap[serverMsg] || 'No se pudo crear el grupo. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" translate="no">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-bold text-[#111827]">Crear Nuevo Grupo</h2>
            <p className="text-sm text-[#6b7280]">Define tu comunidad de estudio</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1">
              Nombre del grupo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={30}
              placeholder="Ej: Estudio Cálculo I"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-[#111827] text-sm focus:outline-none focus:ring-2 focus:ring-[#002344]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1">
              Materia <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setSubjectOpen(o => !o)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-gray-300 text-sm text-left focus:outline-none focus:ring-2 focus:ring-[#002344]"
              >
                <span className={selectedSubject ? 'text-[#111827]' : 'text-gray-400'}>
                  {selectedSubject ? selectedSubject.name : 'Selecciona una materia...'}
                </span>
                <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
              </button>
              {subjectOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {userSubjects.length === 0 ? (
                    <p className="px-3 py-2 text-sm text-[#6b7280]">No tienes materias registradas.</p>
                  ) : (
                    userSubjects.map(s => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => { setSelectedSubject(s); setSubjectOpen(false) }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-[#F4F6F8] transition-colors ${
                          selectedSubject?.id === s.id ? 'text-[#002344] font-medium' : 'text-[#111827]'
                        }`}
                      >
                        {s.name}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1">Descripción</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              placeholder="¿De qué trata el grupo?"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-[#111827] text-sm focus:outline-none focus:ring-2 focus:ring-[#002344] resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 p-5 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm border border-gray-300 text-[#6b7280] rounded-lg hover:bg-[#F4F6F8] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleCreate}
            disabled={loading}
            className="flex-1 px-4 py-2 text-sm bg-[#002344] hover:bg-[#002344]/90 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Spinner /> : <><Plus size={16} />Crear Grupo</>}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type Tab = 'member' | 'admin'

export default function GroupsPage() {
  const { user } = useAuthStore()
  const { profile } = useUserStore()
  const navigate = useNavigate()
  const { groupUnreadCount } = useNotifications()

  const [activeTab, setActiveTab] = useState<Tab>('member')
  const [memberGroups, setMemberGroups] = useState<UserGroup[]>([])
  const [adminGroups, setAdminGroups] = useState<UserGroup[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const loadedRef = useRef(false)

  const userSubjects = (profile?.subjects ?? []).map((id, i) => ({
    id,
    name: profile?.subjectNames?.[i] ?? id,
  }))

  const loadGroups = async () => {
    if (!user?.uid) return
    setLoading(true)
    try {
      const [memberRes, adminRes] = await Promise.all([
        apiClient.getAxiosInstance().get<UserGroup[]>(`/api/groups/user/${user.uid}?role=student`),
        apiClient.getAxiosInstance().get<UserGroup[]>(`/api/groups/user/${user.uid}?role=admin`),
      ])
      setMemberGroups(memberRes.data || [])
      setAdminGroups(adminRes.data || [])
      loadedRef.current = true
    } catch (e) {
      console.error('Error loading groups:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!loadedRef.current) loadGroups()
  }, [user?.uid])

  const activeGroups = activeTab === 'member' ? memberGroups : adminGroups

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Gestión de Grupos</h1>
          <p className="text-sm text-[#6b7280] mt-1">Comunidades de investigación y estudio.</p>
        </div>
        {activeTab === 'admin' && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#002344] hover:bg-[#002344]/90 text-white text-sm rounded-lg transition-colors flex-shrink-0"
          >
            <Plus size={16} />Nuevo Grupo
          </button>
        )}
      </div>

      {/* Tabs — Part 5 palette */}
      <div className="flex border-b border-gray-200">
        {(['member', 'admin'] as Tab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-[#002344] text-[#111827] font-bold'
                : 'border-transparent text-[#6b7280] hover:text-[#111827]'
            }`}
          >
            {tab === 'member' ? 'Grupos de los que soy Miembro' : 'Grupos que Administro'}
          </button>
        ))}
      </div>

      {/* Stat cards — Part 4 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border-l-4 border-[#b39055] p-4 flex items-center gap-4 shadow-sm">
          <Users size={32} className="text-[#002344] flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wide">Total Grupos</p>
            <p className="text-3xl font-bold text-[#111827]">{loading ? '—' : activeGroups.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border-l-4 border-[#b39055] p-4 flex items-center gap-4 shadow-sm">
          <MessageSquare size={32} className="text-[#002344] flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wide">Mensajes Nuevos</p>
            <p className="text-3xl font-bold text-[#111827]">{groupUnreadCount}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <GroupCardSkeleton /><GroupCardSkeleton /><GroupCardSkeleton />
        </div>
      ) : activeGroups.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Users size={56} className="text-gray-300 mb-4" />
          {activeTab === 'member' ? (
            <>
              <p className="text-[#111827] font-medium">Aún no eres miembro de ningún grupo.</p>
              <p className="text-sm text-[#6b7280] mt-1">
                Ve a{' '}
                <Link to="/search" className="text-[#002344] hover:underline">Buscar</Link>
                {' '}para unirte a uno.
              </p>
            </>
          ) : (
            <>
              <p className="text-[#111827] font-medium">Aún no administras ningún grupo.</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-[#002344] hover:bg-[#002344]/90 text-white text-sm rounded-lg transition-colors"
              >
                <Plus size={16} />Crear tu primer grupo
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeGroups.map(group => (
            <GroupCard
              key={group.id}
              group={group}
              isAdmin={activeTab === 'admin'}
              onNavigate={() => navigate(`/groups/${group.id}`)}
            />
          ))}
        </div>
      )}

      {showModal && (
        <ModalErrorBoundary onError={() => setShowModal(false)}>
          <CreateGroupModal
            onClose={() => setShowModal(false)}
            onSuccess={() => {
              setShowModal(false)
              loadedRef.current = false
              loadGroups()
              setActiveTab('admin')
            }}
            userSubjects={userSubjects}
            userId={user?.uid ?? ''}
          />
        </ModalErrorBoundary>
      )}
    </div>
  )
}
