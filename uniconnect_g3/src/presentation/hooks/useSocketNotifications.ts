import { useEffect, useCallback } from 'react';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, deleteDoc, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../../data/sources/FirebaseClient';
import { authStore } from '@uniconnect/shared';
import { useNotificationContext } from '../context/NotificationContext';
import { useSocket } from './useSocket';
import { AppNotification } from '../../domain/entities/AppNotification';

// Tipos amigables para el Frontend (UI)
const FRIENDLY_TYPES: Record<string, string> = {
  'SOLICITUD_INGRESO': 'join_request',
  'TRANSFERENCIA_ADMIN_SOLICITADA': 'admin_transfer',
  'MIEMBRO_ACEPTADO': 'new_member',
  'MIEMBRO_RECHAZADO': 'request_rejected',
  'TRANSFERENCIA_ADMIN': 'admin_assigned',
  'TRANSFERENCIA_ADMIN_ACEPTADA': 'admin_transfer_accepted',
  'TRANSFERENCIA_ADMIN_RECHAZADA': 'admin_transfer_rejected',
  'NUEVO_EVENTO': 'new_event',
};

export const useSocketNotifications = () => {
  const user = authStore((state) => state.user);
  const { addNotification, addToastOnly, setPersistedNotifications, markAsRead, removeNotification, clearAll } = useNotificationContext();
  const { socket, isConnected } = useSocket();

  // 1. Firestore onSnapshot → alimenta la campana (notificaciones persistentes)
  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, 'notifications'),
      where('targetUserId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const mapped: AppNotification[] = snapshot.docs.map((doc) => {
          const d = doc.data();
          const friendlyType = FRIENDLY_TYPES[d.type] || d.type;
          return {
            id: doc.id,
            type: friendlyType,
            message: d.message || '',
            timestamp: d.createdAt?.toDate?.()?.toISOString?.() || new Date().toISOString(),
            read: d.read ?? false,
            data: {
              groupId: d.groupId,
              groupName: d.groupName,
              eventId: d.eventId,
              eventName: d.eventName,
              category: d.category,
            },
          };
        });
        setPersistedNotifications(mapped);
      },
      (err) => console.warn('[useSocketNotifications] Firestore listener error:', err)
    );

    return () => unsub();
  }, [user?.uid, setPersistedNotifications]);

  // 2. WebSocket → campana + toast (Firestore onSnapshot reemplaza la campana cuando sincroniza)
  useEffect(() => {
    if (!socket || !user?.uid) return;

    const handleNotification = (payload: any) => {
      console.log('[Socket] Received notification:', payload);

      const friendlyType = FRIENDLY_TYPES[payload.type] || payload.type;

      addNotification({
        type: friendlyType,
        message: payload.message,
        data: {
          groupId: payload.groupId,
          groupName: payload.groupName,
          eventId: payload.eventId,
          eventName: payload.eventName,
          category: payload.category,
          ...payload.data
        }
      });
    };

    socket.on('notification', handleNotification);

    return () => {
      socket.off('notification', handleNotification);
    };
  }, [socket, user?.uid, addNotification]);

  // Wrappers que actualizan Firestore + estado local (onSnapshot refleja el cambio)
  const persistedMarkAsRead = useCallback(async (id: string) => {
    markAsRead(id);
    try {
      await updateDoc(doc(db, 'notifications', id), { read: true });
    } catch (e) {
      console.warn('[useSocketNotifications] Error marking as read:', e);
    }
  }, [markAsRead]);

  const persistedRemove = useCallback(async (id: string) => {
    removeNotification(id);
    try {
      await deleteDoc(doc(db, 'notifications', id));
    } catch (e) {
      console.warn('[useSocketNotifications] Error removing notification:', e);
    }
  }, [removeNotification]);

  const persistedClearAll = useCallback(async () => {
    clearAll();
    if (!user?.uid) return;
    try {
      const q = query(collection(db, 'notifications'), where('targetUserId', '==', user.uid));
      const snap = await getDocs(q);
      const batch = writeBatch(db);
      snap.docs.forEach((d) => batch.delete(d.ref));
      await batch.commit();
    } catch (e) {
      console.warn('[useSocketNotifications] Error clearing all:', e);
    }
  }, [clearAll, user?.uid]);

  return {
    markAsRead: persistedMarkAsRead,
    removeNotification: persistedRemove,
    clearAll: persistedClearAll,
    isConnected,
  };
};
