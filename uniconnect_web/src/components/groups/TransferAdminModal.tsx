import { useState } from 'react'
import { X, AlertTriangle, CheckCircle } from 'lucide-react'
import { apiClient } from '../../main'
import Avatar from '../Avatar'

interface TransferAdminModalProps {
  groupId: string
  adminId: string
  groupName: string
  members: { id: string; name: string; role: string }[]
  pendingTransfer: { candidateId: string; status: string } | null
  onClose: () => void
  onSuccess: () => void
}

export default function TransferAdminModal({
  groupId,
  adminId,
  groupName,
  members,
  pendingTransfer,
  onClose,
  onSuccess,
}: TransferAdminModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const eligibleMembers = members.filter(m => m.id !== adminId)
  const isBlocked = pendingTransfer?.status === 'pending'

  const handleConfirm = async () => {
    if (!selectedId) return
    setSubmitting(true)
    try {
      await apiClient.getAxiosInstance().post(`/api/groups/${groupId}/transfer-admin/request`, {
        adminId,
        candidateId: selectedId,
      })
      onSuccess()
    } catch (e: unknown) {
      const msg = (e as any)?.response?.data?.message || 'No se pudo solicitar la transferencia'
      alert(msg)
    } finally {
      setSubmitting(false)
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
          <h2 className="text-lg font-bold text-gray-900">Transferir Administración</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100" disabled={isBlocked}>
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Blocked banner */}
        {isBlocked && (
          <div className="mx-5 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
            <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              Tu salida está bloqueada hasta que el sucesor acepte la administración.
            </p>
          </div>
        )}

        {/* Description */}
        <div className="px-5 py-4">
          <p className="text-sm text-gray-600">
            Debes transferir la administración de <strong>{groupName}</strong> a otro miembro antes de salir del grupo.
          </p>
        </div>

        {/* Member list */}
        <div className="flex-1 overflow-y-auto px-5 pb-4">
          {eligibleMembers.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-6">No hay miembros elegibles</p>
          ) : (
            <div className="space-y-2">
              {eligibleMembers.map(m => (
                <button
                  key={m.id}
                  onClick={() => !isBlocked && setSelectedId(m.id)}
                  disabled={isBlocked}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${
                    selectedId === m.id
                      ? 'border-[#002344] bg-[#002344]/5'
                      : isBlocked
                      ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                      : 'border-gray-200 hover:border-[#002344]/30 hover:bg-gray-50'
                  }`}
                >
                  <Avatar name={m.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{m.name}</p>
                    <p className="text-xs text-gray-500">{m.role === 'admin' ? 'Administrador' : 'Estudiante'}</p>
                  </div>
                  {selectedId === m.id && (
                    <CheckCircle size={18} className="text-[#002344]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            disabled={isBlocked}
            className="flex-1 py-2.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedId || submitting || isBlocked}
            className="flex-1 py-2.5 text-sm bg-[#002344] text-white rounded-lg hover:bg-[#002344]/90 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Enviando...' : 'Confirmar Transferencia'}
          </button>
        </div>
      </div>
    </div>
  )
}
