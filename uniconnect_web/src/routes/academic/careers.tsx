import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiClient } from '../../main'
import Card, { CardBody } from '../../components/Card'
import { GraduationCap, Search } from 'lucide-react'

interface Career {
  id: string
  name: string
  facultyId?: string
  [key: string]: unknown
}

export default function CareersPage() {
  const [careers, setCareers] = useState<Career[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    apiClient.get<Career[]>('/api/careers')
      .then(res => setCareers(res.data ?? []))
      .catch(() => setError('Failed to load careers'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = query
    ? careers.filter(c => c.name.toLowerCase().includes(query.toLowerCase()))
    : careers

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Careers</h1>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search careers…"
          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      )}

      {error && <p className="text-center text-red-600 text-sm py-8">{error}</p>}

      {!loading && !error && filtered.length === 0 && (
        <p className="text-center text-gray-500 py-8">No careers found.</p>
      )}

      {!loading && filtered.length > 0 && (
        <div className="space-y-2">
          {filtered.map(career => (
            <Link key={career.id} to={`/academic/subjects?careerId=${career.id}&careerName=${encodeURIComponent(career.name)}`}>
              <Card>
                <CardBody>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <GraduationCap size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{career.name}</p>
                      {career.facultyId && (
                        <p className="text-xs text-gray-400">Faculty: {career.facultyId}</p>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
