// API endpoint constants
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    GOOGLE: '/auth/google',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },

  // User endpoints
  USER: {
    PROFILE: (userId: string) => `/api/users/profile/${userId}`,
    UPDATE_PROFILE: '/api/users/profile',
    SEARCH: '/api/users/search',
  },

  // Group endpoints
  GROUP: {
    LIST: '/api/groups',
    DETAIL: (groupId: string) => `/api/groups/${groupId}`,
    CREATE: '/api/groups',
    UPDATE: (groupId: string) => `/api/groups/${groupId}`,
    DELETE: (groupId: string) => `/api/groups/${groupId}`,
    MEMBERS: (groupId: string) => `/api/groups/${groupId}/members`,
    JOIN: (groupId: string) => `/api/groups/${groupId}/join`,
    LEAVE: (groupId: string) => `/api/groups/${groupId}/leave`,
  },

  // Event endpoints
  EVENT: {
    LIST: '/api/events',
    DETAIL: (eventId: string) => `/api/events/${eventId}`,
    CREATE: '/api/events',
    UPDATE: (eventId: string) => `/api/events/${eventId}`,
    DELETE: (eventId: string) => `/api/events/${eventId}`,
    ATTEND: (eventId: string) => `/api/events/${eventId}/attend`,
    UNATTEND: (eventId: string) => `/api/events/${eventId}/unattend`,
    ATTENDEES: (eventId: string) => `/api/events/${eventId}/attendees`,
  },

  // Chat endpoints
  CHAT: {
    LIST: '/api/chats',
    DETAIL: (chatId: string) => `/api/chats/${chatId}`,
    CREATE: '/api/chats',
    MESSAGES: (chatId: string) => `/api/chats/${chatId}/messages`,
    SEND_MESSAGE: (chatId: string) => `/api/chats/${chatId}/messages`,
    MARK_READ: (chatId: string) => `/api/chats/${chatId}/read`,
  },

  // Notification endpoints
  NOTIFICATION: {
    LIST: '/api/notifications',
    MARK_READ: (notificationId: string) => `/api/notifications/${notificationId}/read`,
    MARK_ALL_READ: '/api/notifications/read-all',
    DELETE: (notificationId: string) => `/api/notifications/${notificationId}`,
  },

  // Academic endpoints
  ACADEMIC: {
    CAREERS: '/api/academic/careers',
    FACULTIES: '/api/academic/faculties',
    SUBJECTS: '/api/academic/subjects',
  },
} as const;

// Helper to build query string
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : '';
}
