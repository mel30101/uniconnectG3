import { useEffect, useState, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../../data/sources/FirebaseClient';
import { authStore } from '@uniconnect/shared';

// Hook para PUBLICAR la presencia del usuario actual
export function useMyPresence(socket?: any) {
  const { user } = authStore();
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    if (!user?.uid || !db) return;

    const presenceRef = doc(db, 'presence', user.uid);

    const markOnline = () => {
      setDoc(presenceRef, {
        online: true,
        lastSeen: serverTimestamp(),
        uid: user.uid,
      }, { merge: true }).catch(console.error);
    };

    const markOffline = () => {
      setDoc(presenceRef, {
        online: false,
        lastSeen: serverTimestamp(),
      }, { merge: true }).catch(console.error);
    };

    // Marcar online al montar
    markOnline();

    // AppState: equivalente a visibilitychange en React Native
    // 'active' = app en primer plano → online
    // 'background' / 'inactive' = app minimizada → offline
    const subscription = AppState.addEventListener(
      'change',
      (nextState: AppStateStatus) => {
        if (nextState === 'active') {
          markOnline();
        } else if (nextState === 'background' || nextState === 'inactive') {
          markOffline();
        }
        appState.current = nextState;
      }
    );

    // Socket events (si el socket está disponible)
    if (socket) {
      socket.on('connect', markOnline);
      socket.on('disconnect', markOffline);
    }

    return () => {
      markOffline();
      subscription.remove();
      if (socket) {
        socket.off('connect', markOnline);
        socket.off('disconnect', markOffline);
      }
    };
  }, [user?.uid, socket]);
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
