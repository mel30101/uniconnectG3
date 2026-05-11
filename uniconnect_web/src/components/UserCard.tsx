import { Link } from 'react-router-dom'
import type { User } from '@uniconnect/shared'
import Avatar from './Avatar'

interface UserCardProps {
  user: User
}

export default function UserCard({ user }: UserCardProps) {
  return (
    <Link
      to={`/profile/${user.uid}`}
      className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
    >
      <Avatar src={user.photoURL} name={user.name} size="md" />
      <div className="min-w-0">
        <p className="font-medium text-gray-900 truncate">{user.name}</p>
        <p className="text-sm text-gray-500 truncate">{user.email}</p>
        {user.career && (
          <p className="text-xs text-blue-600 truncate">
            {user.career}{user.semester ? ` · Sem. ${user.semester}` : ''}
          </p>
        )}
      </div>
    </Link>
  )
}
