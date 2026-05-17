import { useState } from 'react'
import { Users, Plus, Mail, Award } from 'lucide-react'
import type { AcademicProfile } from '@uniconnect/shared'
import { apiClient } from '../../main'

interface ProfileEnrichedViewProps {
  userId: string
}

const STAT_CARDS = [
  {
    key: 'gruposCreados' as const,
    label: 'Grupos Creados',
    icon: Plus,
    color: '#7c3aed',
    bg: '#f5f3ff',
  },
  {
    key: 'gruposParticipa' as const,
    label: 'Grupos Participados',
    icon: Users,
    color: '#2563eb',
    bg: '#eff6ff',
  },
  {
    key: 'mensajesEnviados' as const,
    label: 'Mensajes Enviados',
    icon: Mail,
    color: '#16a34a',
    bg: '#f0fdf4',
  },
]

export default function ProfileEnrichedView({ userId }: ProfileEnrichedViewProps) {
  const [profile, setProfile] = useState<AcademicProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const handleLoad = async () => {
    setLoading(true)
    try {
      const res = await apiClient.getAxiosInstance().get<AcademicProfile>(
        `/api/users/estadisticas/${userId}?vista=completa`
      )
      setProfile(res.data ?? null)
      setLoaded(true)
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }

  if (!loaded) {
    return (
      <button
        onClick={handleLoad}
        disabled={loading}
        className="w-full py-3 text-sm font-medium text-[#002344] border border-[#002344] rounded-lg hover:bg-[#002344]/5 transition-colors disabled:opacity-50"
      >
        {loading ? 'Cargando...' : 'Ver vista completa'}
      </button>
    )
  }

  if (!profile) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
        <p className="text-gray-500 text-sm">No se pudieron cargar las estadísticas</p>
      </div>
    )
  }

  const stats = profile.estadisticas
  const insignias = profile.insignias ?? []

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Estadísticas</h2>
        <div className="grid grid-cols-3 gap-4">
          {STAT_CARDS.map(card => {
            const Icon = card.icon
            const value = stats?.[card.key] ?? 0
            return (
              <div
                key={card.key}
                className="rounded-xl p-4 flex flex-col items-center gap-2"
                style={{ backgroundColor: card.bg }}
              >
                <Icon size={24} style={{ color: card.color }} />
                <p className="text-2xl font-bold" style={{ color: card.color }}>{value}</p>
                <p className="text-xs text-gray-600 text-center">{card.label}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Insignias */}
      {insignias.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Award size={20} className="text-[#b39055]" />
            Insignias
          </h2>
          <div className="flex flex-wrap gap-3">
            {insignias.map((badge, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                style={{ backgroundColor: '#fef9ee', color: '#b39055', border: '1px solid #b3905530' }}
              >
                <Award size={14} />
                {badge}
              </span>
            ))}
          </div>
        </div>
      )}

      {insignias.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <Award size={32} className="text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Aún no tienes insignias. ¡Sigue participando!</p>
        </div>
      )}
    </div>
  )
}
