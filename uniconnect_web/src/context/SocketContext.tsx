import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { io, type Socket } from 'socket.io-client';
import { authStore } from '@uniconnect/shared';
import { useMyPresence } from '../hooks/usePresence';

interface SocketContextType {
  notifSocket: Socket | null;
  chatSocket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({
  notifSocket: null,
  chatSocket: null,
});

export function SocketProvider({ children }: { children: ReactNode }) {
  const [notifSocket, setNotifSocket] = useState<Socket | null>(null);
  const [chatSocket, setChatSocket] = useState<Socket | null>(null);
  const { user } = authStore();

  useEffect(() => {
    if (!user?.uid) return;

    const ns = io('http://localhost:3003', {
      transports: ['polling', 'websocket'],
      query: { userId: user.uid },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });
    ns.on('connect', () => {
      console.log('[NotifSocket] Conectado al social-service');
      setNotifSocket(ns);
    });
    ns.on('connect_error', (err) => console.warn('[NotifSocket] Error:', err.message));

    const cs = io('http://localhost:3004', {
      transports: ['polling', 'websocket'],
      query: { userId: user.uid },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });
    cs.on('connect', () => {
      console.log('[ChatSocket] Conectado al chat-service');
      setChatSocket(cs);
    });
    cs.on('connect_error', (err) => console.warn('[ChatSocket] Error:', err.message));

    return () => {
      ns.disconnect();
      cs.disconnect();
      setNotifSocket(null);
      setChatSocket(null);
    };
  }, [user?.uid]);

  useMyPresence();

  return (
    <SocketContext.Provider value={{ notifSocket, chatSocket }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useNotifSocket = () => useContext(SocketContext).notifSocket;
export const useChatSocket = () => useContext(SocketContext).chatSocket;
export const useSocket = () => useContext(SocketContext).chatSocket;
