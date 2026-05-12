import { useEffect, useState } from 'react';
import { useChatSocket } from './useChatSocket';

export function useMyPresence() {}

const POLL_INTERVAL_MS = 5000;

export function useOtherPresence(otherUserId: string | null) {
  const [isOnline, setIsOnline] = useState(false);
  const chatSocket = useChatSocket();

  useEffect(() => {
    if (!otherUserId || !chatSocket) return;

    const queryStatus = () => {
      chatSocket.emit('check_user_status', { userId: otherUserId }, (res: { status: string }) => {
        setIsOnline(res?.status === 'online');
      });
    };

    // Consulta inicial
    if (chatSocket.connected) {
      queryStatus();
    } else {
      chatSocket.once('connect', queryStatus);
    }

    // Polling: el backend emite USER_STATUS_CHANGED solo a rooms de grupos,
    // no al chat 1-a-1, por lo que necesitamos consultar periódicamente.
    const interval = setInterval(queryStatus, POLL_INTERVAL_MS);

    // Listener por si el backend hace fallback broadcast (io.emit)
    const handler = (data: { userId: string; status: string }) => {
      if (data.userId === otherUserId) setIsOnline(data.status === 'online');
    };
    chatSocket.on('USER_STATUS_CHANGED', handler);

    return () => {
      clearInterval(interval);
      chatSocket.off('connect', queryStatus);
      chatSocket.off('USER_STATUS_CHANGED', handler);
    };
  }, [otherUserId, chatSocket]);

  return { isOnline };
}
