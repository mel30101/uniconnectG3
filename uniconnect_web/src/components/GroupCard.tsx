import { Link } from 'react-router-dom'
import type { Group } from '@uniconnect/shared'
import { Users } from 'lucide-react'

interface GroupCardProps {
  group: Group
  subjectName?: string
  creatorName?: string
}

export default function GroupCard({ group, subjectName, creatorName }: GroupCardProps) {
  return (
    <Link
      to={`/groups/${group.id}`}
      className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm transition-all"
    >
      {group.imageURL ? (
        <img src={group.imageURL} alt={group.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
      ) : (
        <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
          <Users size={20} className="text-blue-600 dark:text-blue-400" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="font-medium text-gray-900 dark:text-white truncate">{group.name}</p>
        {group.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{group.description}</p>
        )}
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          {subjectName && (
            <span className="text-xs text-blue-600 dark:text-blue-400">{subjectName}</span>
          )}
          {creatorName && (
            <span className="text-xs text-gray-500 dark:text-gray-400">Admin: {creatorName}</span>
          )}
          {group.memberCount !== undefined && group.memberCount > 0 && (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Users size={12} />{group.memberCount} miembros
            </span>
          )}
          {group.privacy === 'private' && (
            <span className="text-xs text-amber-600 dark:text-amber-400">Privado</span>
          )}
        </div>
      </div>
    </Link>
  )
}
