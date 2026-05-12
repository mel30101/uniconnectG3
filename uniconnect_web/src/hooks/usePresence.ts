import { useEffect, useState } from 'react';
import { useChatSocket, useChatConnected } from '../context/SocketContext';

export function useMyPresence() {}

export function useOtherPresence(otherUserId: string | null) {
  const [isOnline, setIsOnline] = useState(false);
  const chatSocket = useChatSocket();
  const chatConnected = useChatConnected();

  useEffect(() => {
    if (!otherUserId || !chatSocket || !chatConnected) return;

    // Consulta estado inicial
    chatSocket.emit('check_user_status', { userId: otherUserId }, (res: any) => {
      setIsOnline(res?.status === 'online');
    });

    // Listener en tiempo real
    const handler = (data: { userId: string; status: string }) => {
      if (data.userId === otherUserId) {
        setIsOnline(data.status === 'online');
      }
    };
    chatSocket.on('USER_STATUS_CHANGED', handler);

    return () => {
      chatSocket.off('USER_STATUS_CHANGED', handler);
    };
  }, [otherUserId, chatSocket, chatConnected]);

  return { isOnline };
}
