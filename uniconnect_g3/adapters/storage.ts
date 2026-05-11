import AsyncStorage from '@react-native-async-storage/async-storage';
import { authStore } from '@uniconnect/shared';

const TOKEN_KEY = '@uniconnect:token';

export const initializeStorage = async () => {
  // Hydrate token from AsyncStorage on app start
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (token) {
      authStore.getState().setToken(token);
    }
  } catch (error) {
    console.error('Failed to load token from storage:', error);
  }

  // Subscribe to auth store changes to persist token
  authStore.subscribe(
    async (state: any) => {
      const token = state.token;
      try {
        if (token) {
          await AsyncStorage.setItem(TOKEN_KEY, token);
        } else {
          await AsyncStorage.removeItem(TOKEN_KEY);
        }
      } catch (error) {
        console.error('Failed to persist token:', error);
      }
    }
  );
};
