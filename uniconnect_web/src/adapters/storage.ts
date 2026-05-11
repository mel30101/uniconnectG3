import { useAuthStore } from '@uniconnect/shared'

/**
 * Storage adapter para web usando localStorage.
 * Sincroniza automáticamente el token de autenticación con el authStore.
 */

const AUTH_TOKEN_KEY = 'auth_token'
const AUTH_USER_KEY = 'auth_user'

export const storage = {
  /**
   * Obtiene el token de autenticación desde localStorage
   */
  getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY)
  },

  /**
   * Guarda el token de autenticación en localStorage
   */
  setToken(token: string): void {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
  },

  /**
   * Elimina el token de autenticación de localStorage
   */
  removeToken(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY)
  },

  /**
   * Obtiene los datos del usuario desde localStorage
   */
  getUser(): string | null {
    return localStorage.getItem(AUTH_USER_KEY)
  },

  /**
   * Guarda los datos del usuario en localStorage
   */
  setUser(user: string): void {
    localStorage.setItem(AUTH_USER_KEY, user)
  },

  /**
   * Elimina los datos del usuario de localStorage
   */
  removeUser(): void {
    localStorage.removeItem(AUTH_USER_KEY)
  },

  /**
   * Limpia todos los datos de autenticación
   */
  clear(): void {
    this.removeToken()
    this.removeUser()
  },
}

/**
 * Inicializa la sincronización entre localStorage y authStore.
 * Debe llamarse una vez al inicio de la aplicación.
 */
export function initStorageSync(): void {
  // Restaurar sesión desde localStorage al cargar la app
  const token = storage.getToken()
  const userJson = storage.getUser()

  if (token && userJson) {
    try {
      const user = JSON.parse(userJson)
      useAuthStore.getState().setToken(token)
      useAuthStore.getState().setUser(user)
    } catch (error) {
      console.error('Failed to restore session:', error)
      storage.clear()
    }
  }

  // Suscribirse a cambios en el authStore para sincronizar con localStorage
  useAuthStore.subscribe((state, prevState) => {
    // Sincronizar token
    if (state.token !== prevState.token) {
      if (state.token) {
        storage.setToken(state.token)
      } else {
        storage.removeToken()
      }
    }

    // Sincronizar user
    if (state.user !== prevState.user) {
      if (state.user) {
        storage.setUser(JSON.stringify(state.user))
      } else {
        storage.removeUser()
      }
    }
  })
}
