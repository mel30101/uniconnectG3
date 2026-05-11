import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { AppNotification } from '../../domain/entities/AppNotification';
import { registerToastHandler } from '../utils/showToast';

interface NotificationContextType {
  notifications: AppNotification[];
  toasts: AppNotification[];
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  addToastOnly: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  setPersistedNotifications: (notifications: AppNotification[]) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  removeToast: (id: string) => void;
  clearAll: () => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const mapToastTypeToNotification = (type: 'success' | 'error' | 'info' | 'warning') => {
  switch (type) {
    case 'success': return 'new_member';
    case 'error': return 'request_rejected';
    case 'warning': return 'admin_transfer';
    default: return 'join_request';
  }
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [toasts, setToasts] = useState<AppNotification[]>([]);

  const unreadCount = useMemo(() => 
    notifications.filter(n => !n.read).length, 
  [notifications]);

  const addNotification = useCallback((notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: AppNotification = {
      ...notif,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      read: false,
    };
    // Persistente (campana) + efímera (toast)
    setNotifications((prev) => [newNotification, ...prev]);
    setToasts((prev) => [newNotification, ...prev]);
  }, []);

  // Solo toast efímero (no persiste en campana)
  const addToast = useCallback((notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newToast: AppNotification = {
      ...notif,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      read: false,
    };
    setToasts((prev) => [newToast, ...prev]);
  }, []);

  // Reemplaza las notificaciones de la campana con las persistidas de Firestore
  const setPersistedNotifications = useCallback((notifs: AppNotification[]) => {
    setNotifications(notifs);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setToasts((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    setToasts([]);
  }, []);

  // Registrar handler global para showToast (solo efímero, no persiste en campana)
  useEffect(() => {
    registerToastHandler(({ type = 'info', title, message }) => {
      const notifType = mapToastTypeToNotification(type);
      addToast({
        type: notifType,
        message: title ? `${title}: ${message}` : message,
        data: {},
      });
    });
  }, [addToast]);

  const value = useMemo(() => ({
    notifications,
    toasts,
    addNotification,
    addToastOnly: addToast,
    setPersistedNotifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
    removeToast,
    clearAll,
    unreadCount,
  }), [notifications, toasts, addNotification, addToast, setPersistedNotifications, markAsRead, markAllAsRead, removeNotification, removeToast, clearAll, unreadCount]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};
