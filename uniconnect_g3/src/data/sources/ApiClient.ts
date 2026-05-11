import { createApiClient, authStore } from '@uniconnect/shared';
import Constants from 'expo-constants';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3000';

const apiClient = createApiClient({
  baseURL: BACKEND_URL,
  getAuthToken: async () => {
    return authStore.getState().token;
  },
  onUnauthorized: () => {
    authStore.getState().logout();
  },
});

export default apiClient;
