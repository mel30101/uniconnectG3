import { create } from 'zustand';
import type { Group, Event, GroupMember } from '../types';

interface SocialState {
  groups: Group[];
  events: Event[];
  activeGroup: Group | null;
  groupMembers: Record<string, GroupMember[]>;
  isLoading: boolean;
  error: string | null;
  
  setGroups: (groups: Group[]) => void;
  setEvents: (events: Event[]) => void;
  setActiveGroup: (group: Group | null) => void;
  setGroupMembers: (groupId: string, members: GroupMember[]) => void;
  addGroup: (group: Group) => void;
  removeGroup: (groupId: string) => void;
  addEvent: (event: Event) => void;
  removeEvent: (eventId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useSocialStore = create<SocialState>((set) => ({
  groups: [],
  events: [],
  activeGroup: null,
  groupMembers: {},
  isLoading: false,
  error: null,
  
  setGroups: (groups) => set({ groups }),
  setEvents: (events) => set({ events }),
  setActiveGroup: (group) => set({ activeGroup: group }),
  
  setGroupMembers: (groupId, members) => set((state) => ({
    groupMembers: { ...state.groupMembers, [groupId]: members }
  })),
  
  addGroup: (group) => set((state) => ({
    groups: [...state.groups, group]
  })),
  
  removeGroup: (groupId) => set((state) => ({
    groups: state.groups.filter(g => g.id !== groupId)
  })),
  
  addEvent: (event) => set((state) => ({
    events: [...state.events, event]
  })),
  
  removeEvent: (eventId) => set((state) => ({
    events: state.events.filter(e => e.id !== eventId)
  })),
  
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
