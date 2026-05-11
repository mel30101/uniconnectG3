import { create } from 'zustand';
import type { User, UserProfile, AcademicProfile } from '../types';

interface UserState {
  currentProfile: UserProfile | null;
  searchResults: User[];
  isLoading: boolean;
  error: string | null;
  
  // Academic profile state
  profile: AcademicProfile | null;
  profileLoaded: boolean;
  
  setCurrentProfile: (profile: UserProfile | null) => void;
  setSearchResults: (results: User[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearSearch: () => void;
  
  // Academic profile actions
  setProfile: (profile: AcademicProfile | null) => void;
  setProfileLoaded: (loaded: boolean) => void;
  clearProfile: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  currentProfile: null,
  searchResults: [],
  isLoading: false,
  error: null,
  profile: null,
  profileLoaded: false,
  
  setCurrentProfile: (profile) => set({ currentProfile: profile }),
  setSearchResults: (results) => set({ searchResults: results }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearSearch: () => set({ searchResults: [], error: null }),
  
  setProfile: (profile) => set({ profile, profileLoaded: true }),
  setProfileLoaded: (loaded) => set({ profileLoaded: loaded }),
  clearProfile: () => set({ profile: null, profileLoaded: false }),
}));
