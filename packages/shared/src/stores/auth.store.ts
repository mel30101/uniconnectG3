import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  
  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user 
  }),
  
  setToken: (token) => set({ token }),
  
  logout: () => set({ 
    user: null, 
    token: null, 
    isAuthenticated: false 
  }),
  
  clearAuth: () => set({ 
    user: null, 
    token: null, 
    isAuthenticated: false 
  }),
}));

// Alias for backward compatibility with mobile
export const authStore = useAuthStore;
