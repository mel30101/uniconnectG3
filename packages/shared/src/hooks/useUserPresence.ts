import { useEffect, useState, useCallback } from 'react';
import { getSocket } from '../api/socket';

export interface UserPresenceStatus {
  userId: string;
  status: 'online' | 'offline';
}

export interface UseUserPresenceReturn {
  onlineUsers: Set<string>;
  isUserOnline: (userId: string) => boolean;
  checkUserStatus: (userId: string) => Promise<'online' | 'offline'>;
}

/**
 * Hook para manejar la presencia de usuarios en tiempo real
 * Escucha eventos USER_STATUS_CHANGED del backend
 */
export const useUserPresence = (): UseUserPresenceReturn => {
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    const socket = getSocket();
    
    if (!socket) {
      console.warn('[useUserPresence] Socket not initialized');
      return;
    }

    // Escuchar cambios de estado de usuarios
    const handleStatusChange = ({ userId, status }: UserPresenceStatus) => {
      setOnlineUsers((prev) => {
        const newSet = new Set(prev);
        if (status === 'online') {
          newSet.add(userId);
        } else {
          newSet.delete(userId);
        }
        return newSet;
      });
    };

    socket.on('USER_STATUS_CHANGED', handleStatusChange);

    // Cleanup
    return () => {
      socket.off('USER_STATUS_CHANGED', handleStatusChange);
    };
  }, []);

  const isUserOnline = useCallback(
    (userId: string): boolean => {
      return onlineUsers.has(userId);
    },
    [onlineUsers]
  );

  const checkUserStatus = useCallback(
    (userId: string): Promise<'online' | 'offline'> => {
      return new Promise((resolve) => {
        const socket = getSocket();
        
        if (!socket) {
          console.warn('[useUserPresence] Socket not initialized');
          resolve('offline');
          return;
        }

        socket.emit('check_user_status', { userId }, (response: UserPresenceStatus) => {
          resolve(response.status);
        });
      });
    },
    []
  );

  return {
    onlineUsers,
    isUserOnline,
    checkUserStatus,
  };
};
