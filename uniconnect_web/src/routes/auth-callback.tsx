import { useGoogleAuth } from '../hooks/useGoogleAuth'
import { Loader2 } from 'lucide-react'

export default function AuthCallbackPage() {
  const { loading, error } = useGoogleAuth()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {loading ? (
          <>
            <Loader2 className="animate-spin mx-auto mb-4 text-blue-600" size={48} />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Completing sign in...
            </h2>
            <p className="text-gray-600">Please wait while we authenticate you with Google.</p>
          </>
        ) : error ? (
          <>
            <div className="text-red-600 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Authentication Failed
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <a
              href="/login"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Login
            </a>
          </>
        ) : null}
      </div>
    </div>
  )
}
