// Test file to verify all exports from @uniconnect/shared
import {
  // Types
  User,
  UserProfile,
  Group,
  Event,
  Chat,
  Message,
  ApiResponse,
  
  // Validators
  UserProfileSchema,
  GroupSchema,
  EventSchema,
  MessageSchema,
  
  // API
  ApiClient,
  AuthApi,
  UserApi,
  GroupApi,
  ChatApi,
  initSocket,
  getSocket,
  
  // Stores
  useAuthStore,
  useUserStore,
  useChatStore,
  useSocialStore,
  
  // Utils
  decodeToken,
  isTokenValid,
  formatDate,
  getRelativeTime,
  isValidEmail,
  isValidPassword,
} from './src/index';

console.log('✅ All exports verified successfully');
