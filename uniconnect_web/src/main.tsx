import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createApiClient, AuthApi, UserApi, GroupApi, ChatApi, AcademicApi, EventApi, SearchApi } from '@uniconnect/shared/api'
import { initStorageSync } from './adapters/storage'
import './index.css'
import App from './App.tsx'

// Initialize storage sync (restore session from localStorage)
initStorageSync()

// Initialize API client with backend URL
export const apiClient = createApiClient({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  getAuthToken: async () => localStorage.getItem('auth_token'),
  onUnauthorized: () => {
    localStorage.removeItem('auth_token')
    window.location.href = '/login'
  },
})

// Initialize Auth API
export const authApi = new AuthApi(apiClient)
export const userApi = new UserApi(apiClient)
export const groupApi = new GroupApi(apiClient)
export const chatApi = new ChatApi(apiClient)
export const academicApi = new AcademicApi(apiClient)
export const eventApi = new EventApi(apiClient)
export const searchApi = new SearchApi(apiClient)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
