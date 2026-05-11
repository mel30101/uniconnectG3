import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { authStore } from '@uniconnect/shared';

// Singleton-ish approach using a module-level variable to persist the socket
let sharedSocket: Socket | null = null;

export const useSocket = () => {
  const user = authStore((state) => state.user);

  useEffect(() => {
    if (!user?.uid) {
      if (sharedSocket) {
        sharedSocket.disconnect();
        sharedSocket = null;
      }
      return;
    }

    if (!sharedSocket) {
      const socketUrl = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3003';

      sharedSocket = io(socketUrl, {
        query: { userId: user.uid },
        transports: ['websocket', 'polling'],
        reconnection: true,
      });

      sharedSocket.on('connect', () => {
        console.log('[Socket] Connected to shared socket instance');
      });

      sharedSocket.on('disconnect', () => {
        console.log('[Socket] Disconnected from shared socket instance');
      });
    }

    return () => {
      // We don't disconnect here because it's shared. 
      // It only disconnects when the user logs out (the if !user.uid block)
    };
  }, [user?.uid]);

  return {
    socket: sharedSocket,
    isConnected: sharedSocket?.connected || false,
  };
};
