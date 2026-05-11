import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSocialStore } from '@uniconnect/shared'
import { API_ENDPOINTS } from '@uniconnect/shared/api'
import { apiClient } from '../../main'
import type { Event } from '@uniconnect/shared'
import { Calendar, MapPin, Users, ArrowLeft } from 'lucide-react'

function formatDateTime(date: Date | string) {
  return new Date(date).toLocaleString(undefined, {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function EventDetailPage() {
  const { id = '' } = useParams()
  const { setLoading, setError, isLoading, error } = useSocialStore()
  const [event, setEvent] = useState<Event | null>(null)
  const [attending, setAttending] = useState(false)
  const [rsvpLoading, setRsvpLoading] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    apiClient.get<Event>(API_ENDPOINTS.EVENT.DETAIL(id))
      .then(res => {
        if (res.data) setEvent(res.data)
        else setError(res.error?.message ?? 'Event not found')
      })
      .catch(() => setError('Failed to load event'))
      .finally(() => setLoading(false))
  }, [id, setLoading, setError])

  const handleRSVP = async () => {
    setRsvpLoading(true)
    try {
      if (attending) {
        await apiClient.post(API_ENDPOINTS.EVENT.UNATTEND(id))
        setAttending(false)
        if (event) setEvent({ ...event, attendeeCount: event.attendeeCount - 1 })
      } else {
        await apiClient.post(API_ENDPOINTS.EVENT.ATTEND(id))
        setAttending(true)
        if (event) setEvent({ ...event, attendeeCount: event.attendeeCount + 1 })
      }
    } finally {
      setRsvpLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (error || !event) {
    return <p className="text-center text-red-600 py-12">{error ?? 'Event not found'}</p>
  }

  const isFull = event.maxAttendees != null && event.attendeeCount >= event.maxAttendees

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link to="/events" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft size={16} />Back to Events
      </Link>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        {event.imageURL && (
          <img src={event.imageURL} alt={event.title} className="w-full h-48 object-cover rounded-lg" />
        )}

        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
          <button
            onClick={handleRSVP}
            disabled={rsvpLoading || (!attending && isFull)}
            className={`flex-shrink-0 px-4 py-2 text-sm rounded-lg transition-colors disabled:opacity-50 ${
              attending
                ? 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {rsvpLoading ? '…' : attending ? 'Cancel RSVP' : isFull ? 'Full' : 'Attend'}
          </button>
        </div>

        <p className="text-gray-700 text-sm">{event.description}</p>

        <div className="space-y-2 text-sm text-gray-600">
          <p className="flex items-center gap-2"><Calendar size={16} className="text-blue-500" />{formatDateTime(event.startDate)} → {formatDateTime(event.endDate)}</p>
          <p className="flex items-center gap-2"><MapPin size={16} className="text-blue-500" />{event.location}</p>
          <p className="flex items-center gap-2">
            <Users size={16} className="text-blue-500" />
            {event.attendeeCount}{event.maxAttendees ? ` / ${event.maxAttendees}` : ''} attending
            {isFull && <span className="text-red-500 font-medium ml-1">· Full</span>}
          </p>
        </div>
      </div>
    </div>
  )
}
