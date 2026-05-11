import type { Message } from '../types';
import { getSocket } from './socket';

export interface ChatSocketHandlers {
  onNewMessage: (callback: (message: Message) => void) => void;
  onMessageRead: (callback: (data: { chatId: string; userId: string }) => void) => void;
  onTyping: (callback: (data: { chatId: string; userId: string; isTyping: boolean }) => void) => void;
  offNewMessage: () => void;
  offMessageRead: () => void;
  offTyping: () => void;
}

export const createChatSocketHandlers = (): ChatSocketHandlers => {
  const socket = getSocket();
  
  if (!socket) {
    throw new Error('[ChatSocket] Socket not initialized');
  }

  return {
    onNewMessage: (callback) => {
      socket.on('message:new', callback);
    },
    
    onMessageRead: (callback) => {
      socket.on('message:read', callback);
    },
    
    onTyping: (callback) => {
      socket.on('user:typing', callback);
    },
    
    offNewMessage: () => {
      socket.off('message:new');
    },
    
    offMessageRead: () => {
      socket.off('message:read');
    },
    
    offTyping: () => {
      socket.off('user:typing');
    },
  };
};

export const emitSendMessage = (chatId: string, content: string): void => {
  const socket = getSocket();
  if (!socket) {
    console.error('[ChatSocket] Cannot send message: socket not initialized');
    return;
  }
  
  socket.emit('message:send', { chatId, content });
};

export const emitTyping = (chatId: string, isTyping: boolean): void => {
  const socket = getSocket();
  if (!socket) return;
  
  socket.emit('user:typing', { chatId, isTyping });
};

export const emitMarkAsRead = (chatId: string): void => {
  const socket = getSocket();
  if (!socket) return;
  
  socket.emit('message:read', { chatId });
};

export const joinChatRoom = (chatId: string): void => {
  const socket = getSocket();
  if (!socket) return;
  
  socket.emit('chat:join', { chatId });
};

export const leaveChatRoom = (chatId: string): void => {
  const socket = getSocket();
  if (!socket) return;
  
  socket.emit('chat:leave', { chatId });
};
