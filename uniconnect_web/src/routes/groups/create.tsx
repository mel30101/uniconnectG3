import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useSocialStore } from '@uniconnect/shared'
import { CreateGroupSchema } from '@uniconnect/shared/validators'
import { groupApi } from '../../main'
import { ArrowLeft } from 'lucide-react'

const CATEGORIES = ['academic', 'social', 'sports', 'cultural', 'professional', 'other'] as const

export default function CreateGroupPage() {
  const navigate = useNavigate()
  const { addGroup } = useSocialStore()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<typeof CATEGORIES[number]>('academic')
  const [privacy, setPrivacy] = useState<'public' | 'private'>('public')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = CreateGroupSchema.parse({ name, description, category, privacy })
      const res = await groupApi.createGroup(payload)
      if (res.data) {
        addGroup(res.data)
        navigate(`/groups/${res.data.id}`)
      } else {
        setError(res.error?.message ?? 'Failed to create group')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Validation error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <Link to="/groups" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft size={16} />Back to Groups
      </Link>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Create Group</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Group name (min 3 chars)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              rows={3}
              maxLength={500}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="What is this group about? (min 10 chars)"
            />
            <p className="text-xs text-gray-400 text-right">{description.length}/500</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as typeof CATEGORIES[number])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent capitalize"
              >
                {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Privacy</label>
              <select
                value={privacy}
                onChange={e => setPrivacy(e.target.value as 'public' | 'private')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? 'Creating…' : 'Create Group'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/groups')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
