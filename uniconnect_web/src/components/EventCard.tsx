import { Link } from 'react-router-dom'
import type { Event } from '@uniconnect/shared'
import { Calendar, MapPin, Users } from 'lucide-react'

interface EventCardProps {
  event: Event
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function EventCard({ event }: EventCardProps) {
  const isFull = event.maxAttendees != null && event.attendeeCount >= event.maxAttendees

  return (
    <Link
      to={`/events/${event.id}`}
      className="flex gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
    >
      {/* Date badge */}
      <div className="flex-shrink-0 w-14 text-center">
        <div className="bg-blue-600 text-white text-xs font-bold rounded-t px-2 py-0.5">
          {new Date(event.startDate).toLocaleString('default', { month: 'short' }).toUpperCase()}
        </div>
        <div className="border border-t-0 border-gray-200 rounded-b text-xl font-bold text-gray-900 leading-tight py-1">
          {new Date(event.startDate).getDate()}
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-medium text-gray-900 truncate">{event.title}</p>
        <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
          <MapPin size={12} className="flex-shrink-0" /><span className="truncate">{event.location}</span>
        </p>
        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
          <span className="flex items-center gap-1"><Calendar size={12} />{formatDate(event.startDate)}</span>
          <span className="flex items-center gap-1">
            <Users size={12} />{event.attendeeCount}{event.maxAttendees ? `/${event.maxAttendees}` : ''}
          </span>
          {isFull && <span className="text-red-500 font-medium">Full</span>}
        </div>
      </div>
    </Link>
  )
}
