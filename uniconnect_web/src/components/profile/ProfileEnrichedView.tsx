import { Users, Plus, Mail, Award } from 'lucide-react'
import type { Estadisticas } from '@uniconnect/shared'

interface ProfileEnrichedViewProps {
  estadisticas?: Estadisticas
  insignias?: string[]
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

export default function ProfileEnrichedView({ estadisticas, insignias }: ProfileEnrichedViewProps) {
  if (!estadisticas && (!insignias || insignias.length === 0)) {
    return null
  }

  return (
    <div className="space-y-6">
      {estadisticas && (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-center">
            Estadísticas de Participación
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {STAT_CARDS.map(card => {
              const Icon = card.icon
              const value = estadisticas[card.key] ?? 0
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
      )}

      {insignias && insignias.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-2">
            <Award size={20} className="text-[#b39055]" />
            Logros e Insignias
          </h2>
          <div className="flex flex-wrap gap-3 justify-center">
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
    </div>
  )
}
