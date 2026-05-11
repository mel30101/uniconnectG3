import { useState, useEffect } from 'react'
import { useAuthStore } from '@uniconnect/shared'
import { Link } from 'react-router-dom'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function HomePage() {
  const { isAuthenticated, user, token, logout } = useAuthStore()
  const [apiStatus, setApiStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [apiMessage, setApiMessage] = useState('')

  // T3.23 - Test API connectivity
  useEffect(() => {
    const testApiConnection = async () => {
      setApiStatus('loading')
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/status`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (response.ok) {
          const data = await response.json()
          setApiStatus('success')
          setApiMessage(`Gateway connected: ${data.status || 'OK'}`)
        } else {
          setApiStatus('error')
          setApiMessage(`Gateway error: ${response.status} ${response.statusText}`)
        }
      } catch (error) {
        setApiStatus('error')
        setApiMessage(`Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    testApiConnection()
  }, [])

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* T4.3 - OAuth Debugger (temporary) */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-blue-900">🔍 OAuth Debugger</h2>
          {isAuthenticated && (
            <button
              onClick={() => { logout(); localStorage.clear() }}
              className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
            >
              Cerrar Sesión
            </button>
          )}
        </div>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside ml-2">
          <li>isAuthenticated: {isAuthenticated ? '✅ true' : '❌ false'}</li>
          <li>Name: {user?.displayName ?? '—'}</li>
          <li>Email: {user?.email ?? '—'}</li>
          <li>UID: {user?.id ?? '—'}</li>
          <li>Token: {token ? `✅ ${token.slice(0, 12)}…` : '❌ null'}</li>
        </ul>
      </div>

      {/* T3.23 - Test API connectivity */}
      <div className={`border rounded-lg p-4 ${
        apiStatus === 'success' ? 'bg-green-50 border-green-200' :
        apiStatus === 'error' ? 'bg-red-50 border-red-200' :
        'bg-gray-50 border-gray-200'
      }`}>
        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
          {apiStatus === 'loading' && <Loader2 className="animate-spin" size={20} />}
          {apiStatus === 'success' && <CheckCircle className="text-green-600" size={20} />}
          {apiStatus === 'error' && <XCircle className="text-red-600" size={20} />}
          API Connectivity Test
        </h2>
        <div className="text-sm space-y-1">
          <p><strong>Backend URL:</strong> {import.meta.env.VITE_BACKEND_URL}</p>
          <p><strong>Status:</strong> {apiMessage}</p>
        </div>
      </div>

      {/* Main content */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to UniConnect
        </h1>
        
        {isAuthenticated ? (
          <div>
            <p className="text-lg text-gray-600 mb-6">
              Hello, {user?.displayName || 'User'}! 👋
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/profile"
                className="p-6 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <h3 className="font-semibold text-blue-900 mb-2">Your Profile</h3>
                <p className="text-sm text-blue-700">View and edit your profile</p>
              </Link>
              
              <Link
                to="/groups"
                className="p-6 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <h3 className="font-semibold text-green-900 mb-2">Groups</h3>
                <p className="text-sm text-green-700">Join study groups</p>
              </Link>
              
              <Link
                to="/chat"
                className="p-6 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <h3 className="font-semibold text-purple-900 mb-2">Chat</h3>
                <p className="text-sm text-purple-700">Message your peers</p>
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-lg text-gray-600 mb-6">
              Connect with students from your university. Join groups, chat, and collaborate.
            </p>
            <div className="flex gap-4">
              <Link
                to="/login"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
