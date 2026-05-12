import { useEffect, useState } from 'react';
import { useChatSocket } from './useChatSocket';

export function useMyPresence() {}

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

    if (chatSocket.connected) {
      queryStatus();
    } else {
      chatSocket.once('connect', queryStatus);
    }

    const handler = (data: { userId: string; status: string }) => {
      if (data.userId === otherUserId) setIsOnline(data.status === 'online');
    };
    chatSocket.on('USER_STATUS_CHANGED', handler);

    return () => {
      chatSocket.off('connect', queryStatus);
      chatSocket.off('USER_STATUS_CHANGED', handler);
    };
  }, [otherUserId, chatSocket]);

  return { isOnline };
}
