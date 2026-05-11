import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import type { AppNavigation } from '@uniconnect/shared/navigation'

/**
 * Navigation adapter para web usando react-router-dom.
 * Implementa la interfaz AppNavigation para compatibilidad cross-platform.
 */
export function useAppNavigation(): AppNavigation {
  const navigate = useNavigate()
  const params = useParams() as Record<string, string>
  const [searchParams] = useSearchParams()

  // Combinar params de ruta y query params
  const allParams: Record<string, string> = {
    ...params,
    ...Object.fromEntries(searchParams.entries()),
  }

  return {
    push(path: string, queryParams?: Record<string, unknown>): void {
      if (queryParams) {
        const search = new URLSearchParams(
          Object.entries(queryParams).map(([key, value]) => [key, String(value)])
        ).toString()
        navigate(`${path}?${search}`)
      } else {
        navigate(path)
      }
    },

    replace(path: string): void {
      navigate(path, { replace: true })
    },

    back(): void {
      navigate(-1)
    },

    params: allParams,
  }
}
