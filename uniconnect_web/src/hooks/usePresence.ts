import { useEffect, useState } from 'react';
import { doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firestore';
import { useAuthStore } from '@uniconnect/shared';
import type { Socket } from 'socket.io-client';

// Hook para PUBLICAR la presencia del usuario actual
export function useMyPresence(notifSocket: Socket | null) {
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user?.uid || !db) return;

    const presenceRef = doc(db, 'presence', user.uid);

    // Marcar como online al conectar
    const markOnline = () => {
      setDoc(presenceRef, {
        online: true,
        lastSeen: serverTimestamp(),
        uid: user.uid,
      }, { merge: true }).catch(console.error);
    };

    // Marcar como offline
    const markOffline = () => {
      setDoc(presenceRef, {
        online: false,
        lastSeen: serverTimestamp(),
      }, { merge: true }).catch(console.error);
    };

    // Marcar online inmediatamente
    markOnline();

    // Marcar offline cuando el socket se desconecta
    if (notifSocket) {
      notifSocket.on('connect', markOnline);
      notifSocket.on('disconnect', markOffline);
    }

    // Marcar offline al cerrar la pestaña/navegador
    window.addEventListener('beforeunload', markOffline);
    
    // También al perder visibilidad (minimizar, cambiar pestaña)
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        markOffline();
      } else {
        markOnline();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      markOffline();
      window.removeEventListener('beforeunload', markOffline);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (notifSocket) {
        notifSocket.off('connect', markOnline);
        notifSocket.off('disconnect', markOffline);
      }
    };
  }, [user?.uid, notifSocket]);
}

// Hook para LEER la presencia de otro usuario
export function useOtherPresence(otherUserId: string | null) {
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState<Date | null>(null);

  useEffect(() => {
    if (!otherUserId || !db) return;

    const presenceRef = doc(db, 'presence', otherUserId);
    const unsubscribe = onSnapshot(presenceRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setIsOnline(data.online === true);
        const ts = data.lastSeen;
        if (ts?.toDate) setLastSeen(ts.toDate());
      } else {
        setIsOnline(false);
      }
    });

    return () => unsubscribe();
  }, [otherUserId]);

  return { isOnline, lastSeen };
}
