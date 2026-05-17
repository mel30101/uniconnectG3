import { useState, useEffect } from 'react'
import { X, Search, UserPlus } from 'lucide-react'
import { apiClient, searchApi, groupApi } from '../../main'
import Avatar from '../Avatar'
import type { User } from '@uniconnect/shared'

interface AddMemberModalProps {
  groupId: string
  subjectId?: string
  currentUserId: string
  members: { id: string; name: string }[]
  onClose: () => void
  onAdded: () => void
}

export default function AddMemberModal({ groupId, subjectId, currentUserId, members, onClose, onAdded }: AddMemberModalProps) {
  const [search, setSearch] = useState('')
  const [students, setStudents] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const params: { name?: string; subjectIds?: string[]; excludeId?: string } = {
          excludeId: currentUserId,
        }
        if (subjectId) params.subjectIds = [subjectId]
        if (search.length >= 2) params.name = search

        const res = await searchApi.searchStudents(params)
        setStudents(res.data ?? [])
      } catch {
        setStudents([])
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(load, 300)
    return () => clearTimeout(timer)
  }, [search, subjectId, currentUserId])

  const isMember = (uid: string) => members.some(m => m.id === uid)

  const handleAdd = async (userId: string) => {
    setSubmitting(userId)
    try {
      await groupApi.addMember(groupId, userId, 'student')
      onAdded()
    } catch {
      alert('No se pudo añadir al miembro')
    } finally {
      setSubmitting(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Añadir Miembro</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 py-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nombre..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002344]/20 focus:border-[#002344]"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-5 pb-4">
          {loading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#002344]" />
            </div>
          )}

          {!loading && students.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-8">No se encontraron estudiantes</p>
          )}

          <div className="space-y-2">
            {students.map(student => {
              const member = isMember(student.uid)
              return (
                <div
                  key={student.uid}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    member ? 'bg-gray-50 opacity-60' : 'hover:bg-gray-50'
                  }`}
                >
                  <Avatar name={student.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{student.name}</p>
                    <p className="text-xs text-gray-500 truncate">{student.email}</p>
                  </div>
                  {member ? (
                    <span className="text-xs text-gray-400 font-medium">Ya es miembro</span>
                  ) : (
                    <button
                      onClick={() => handleAdd(student.uid)}
                      disabled={submitting === student.uid}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs bg-[#002344] text-white rounded-lg hover:bg-[#002344]/90 transition-colors disabled:opacity-50"
                    >
                      {submitting === student.uid ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b border-white" />
                      ) : (
                        <>
                          <UserPlus size={12} /> Añadir
                        </>
                      )}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
