import { useEffect, useState } from 'react';
import { useChatSocket, useChatConnected } from '../context/SocketContext';

export function useMyPresence() {}

export function useOtherPresence(otherUserId: string | null) {
  const [isOnline, setIsOnline] = useState(false);
  const chatSocket = useChatSocket();
  const chatConnected = useChatConnected();

  useEffect(() => {
    if (!otherUserId || !chatSocket || !chatConnected) return;

    console.log('[Presencia WEB] socket conectado:', chatSocket.id);
    console.log('[Presencia WEB] emitiendo check_user_status para:', otherUserId);

    // Consulta estado inicial
    chatSocket.emit('check_user_status', { userId: otherUserId }, (res: any) => {
      console.log('[Presencia WEB] check_user_status response:', res);
      setIsOnline(res?.status === 'online');
    });

    // Listener en tiempo real
    const handler = (data: { userId: string; status: string }) => {
      console.log('[Presencia WEB] USER_STATUS_CHANGED recibido:', data);
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
