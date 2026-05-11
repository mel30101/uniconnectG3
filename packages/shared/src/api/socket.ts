import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;
let socketUrl: string = '';

export const initSocket = (url: string, token?: string): Socket => {
  if (socket && socket.connected) {
    return socket;
  }

  socketUrl = url;
  
  socket = io(url, {
    transports: ['websocket', 'polling'],
    auth: token ? { token } : undefined,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('[Socket] Connected to server');
  });

  socket.on('disconnect', (reason) => {
    console.log('[Socket] Disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('[Socket] Connection error:', error);
  });

  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const reconnectSocket = (token?: string): Socket | null => {
  if (!socketUrl) {
    console.error('[Socket] Cannot reconnect: no URL set');
    return null;
  }
  
  disconnectSocket();
  return initSocket(socketUrl, token);
};
