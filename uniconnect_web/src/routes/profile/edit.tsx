import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, useUserStore } from '@uniconnect/shared'
import { UpdateUserProfileSchema } from '@uniconnect/shared/validators'
import { userApi } from '../../main'
import Avatar from '../../components/Avatar'

export default function ProfileEditPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { currentProfile, setCurrentProfile } = useUserStore()

  const base = currentProfile ?? user
  const [displayName, setDisplayName] = useState(base?.displayName ?? '')
  const [career, setCareer] = useState(base?.career ?? '')
  const [semester, setSemester] = useState(String(base?.semester ?? ''))
  const [bio, setBio] = useState(currentProfile?.bio ?? '')
  const [interests, setInterests] = useState((currentProfile?.interests ?? []).join(', '))
  const [photoURL, setPhotoURL] = useState(base?.photoURL ?? '')
  const [previewURL, setPreviewURL] = useState(base?.photoURL ?? '')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    // Preview only — actual upload would require a dedicated endpoint
    const objectUrl = URL.createObjectURL(file)
    setPreviewURL(objectUrl)
    // Keep photoURL as-is until upload endpoint is available
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const payload = UpdateUserProfileSchema.parse({
        displayName: displayName || undefined,
        career: career || undefined,
        semester: semester ? parseInt(semester, 10) : undefined,
        bio: bio || undefined,
        interests: interests ? interests.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        photoURL: photoURL || undefined,
      })

      const res = await userApi.updateProfile(payload)
      if (res.data) {
        setCurrentProfile(res.data)
        navigate('/profile')
      } else {
        setError(res.error?.message ?? 'Update failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Validation error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Edit Profile</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Avatar picker */}
        <div className="flex items-center gap-4 mb-6">
          <Avatar src={previewURL} name={displayName} size="lg" />
          <div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="text-sm px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Change photo
            </button>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG · max 2MB</p>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
            <input
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Career</label>
              <input
                value={career}
                onChange={e => setCareer(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g. Computer Science"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
              <input
                type="number"
                min={1}
                max={10}
                value={semester}
                onChange={e => setSemester(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1–10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={3}
              maxLength={500}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Tell others about yourself…"
            />
            <p className="text-xs text-gray-400 text-right">{bio.length}/500</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Interests</label>
            <input
              value={interests}
              onChange={e => setInterests(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Comma-separated: AI, Music, Sports"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? 'Saving…' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/profile')}
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
