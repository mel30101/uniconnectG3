import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { apiClient } from '../../main'
import Card, { CardHeader, CardBody } from '../../components/Card'
import { BookOpen, Search, ArrowLeft } from 'lucide-react'

interface Subject {
  id: string
  name: string
  code?: string
  credits?: number
  sectionId?: string
  [key: string]: unknown
}

interface Section {
  sectionId: string
  sectionName: string
  subjects: Subject[]
}

export default function SubjectsPage() {
  const [searchParams] = useSearchParams()
  const careerId = searchParams.get('careerId') ?? ''
  const careerName = searchParams.get('careerName') ?? 'Career'

  const [sections, setSections] = useState<Section[]>([])
  const [query, setQuery] = useState('')
  const [sectionFilter, setSectionFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!careerId) return
    setLoading(true)
    setError('')
    apiClient.get<Section[]>(`/api/career-structure/${careerId}`)
      .then(res => setSections(res.data ?? []))
      .catch(() => setError('Failed to load subjects'))
      .finally(() => setLoading(false))
  }, [careerId])

  // Client-side filtering: by section and subject name
  const visibleSections = sections
    .filter(s => !sectionFilter || s.sectionId === sectionFilter)
    .map(s => ({
      ...s,
      subjects: query
        ? s.subjects.filter(sub => sub.name.toLowerCase().includes(query.toLowerCase()))
        : s.subjects,
    }))
    .filter(s => s.subjects.length > 0)

  const totalSubjects = visibleSections.reduce((n, s) => n + s.subjects.length, 0)

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center gap-2">
        <Link to="/academic/careers" className="text-gray-500 hover:text-gray-700">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{careerName}</h1>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search subjects…"
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
        {sections.length > 0 && (
          <select
            value={sectionFilter}
            onChange={e => setSectionFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-700"
          >
            <option value="">All sections</option>
            {sections.map(s => (
              <option key={s.sectionId} value={s.sectionId}>{s.sectionName}</option>
            ))}
          </select>
        )}
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      )}

      {!careerId && (
        <p className="text-center text-gray-500 py-8">
          Select a career from <Link to="/academic/careers" className="text-blue-600 hover:underline">Careers</Link>.
        </p>
      )}

      {error && <p className="text-center text-red-600 text-sm py-8">{error}</p>}

      {!loading && !error && careerId && visibleSections.length === 0 && (
        <p className="text-center text-gray-500 py-8">No subjects found.</p>
      )}

      {!loading && visibleSections.length > 0 && (
        <>
          <p className="text-sm text-gray-500">{totalSubjects} subject{totalSubjects !== 1 ? 's' : ''}</p>
          <div className="space-y-4">
            {visibleSections.map(section => (
              <Card key={section.sectionId}>
                <CardHeader>
                  <h2 className="font-semibold text-gray-900">{section.sectionName}</h2>
                </CardHeader>
                <CardBody>
                  <div className="space-y-2">
                    {section.subjects.map(subject => (
                      <div key={subject.id} className="flex items-center gap-3 py-1">
                        <BookOpen size={16} className="text-blue-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{subject.name}</p>
                          <div className="flex gap-3 text-xs text-gray-400">
                            {subject.code && <span>{subject.code}</span>}
                            {subject.credits != null && <span>{subject.credits} credits</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
