import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@uniconnect/shared'
import type { User } from '@uniconnect/shared'

/**
 * Google OAuth hook for web.
 *
 * Flow:
 * 1. signInWithGoogle() → redirects browser to GET /auth/google?redirect=<callbackUrl>
 * 2. Backend (Passport.js) handles the OAuth dance with Google
 * 3. Backend redirects to <callbackUrl>?name=...&email=...&uid=...
 * 4. On /auth/callback, this hook reads query params and hydrates the auth store.
 *
 * The redirect intent is saved in sessionStorage before the full-page redirect
 * so it survives the OAuth round-trip.
 */
export function useGoogleAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { setUser, setToken } = useAuthStore()

  // Handle OAuth callback — only runs when on /auth/callback
  useEffect(() => {
    if (location.pathname !== '/auth/callback') return

    const params = new URLSearchParams(window.location.search)
    const name = params.get('name')
    const email = params.get('email')
    const uid = params.get('uid')
    const errorParam = params.get('error')

    if (errorParam) {
      setError(
        errorParam === 'domain_not_allowed'
          ? 'Your account domain is not allowed. Use your university email.'
          : 'Google authentication failed. Please try again.'
      )
      return
    }

    if (!uid || !email) return // No callback params — nothing to process

    setLoading(true)

    const now = new Date()
    const user: User = {
      uid,
      email,
      name: name ?? email,
      createdAt: now,
      updatedAt: now,
    }

    // Use uid as the session identifier. The backend issues an HttpOnly JWT cookie
    // for state=web redirects; for URL-redirect flow the uid serves as the token
    // until a dedicated token endpoint is available (see findings.md).
    setToken(uid)
    setUser(user)

    const redirectTo = sessionStorage.getItem('google_oauth_redirect') ?? '/'
    sessionStorage.removeItem('google_oauth_redirect')

    navigate(redirectTo, { replace: true })
    setLoading(false)
  }, [location.pathname, navigate, setToken, setUser])

  const signInWithGoogle = () => {
    // Persist redirect intent before the full-page redirect (location.state is lost)
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/'
    sessionStorage.setItem('google_oauth_redirect', from)

    // Use redirect=web so the backend issues the JWT cookie and redirects to DASHBOARD_URL
    // (DASHBOARD_URL is now set to http://localhost:5173 in auth-service/.env)
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google?redirect=web`
  }

  return { signInWithGoogle, loading, error }
}
