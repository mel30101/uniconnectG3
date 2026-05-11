import { useEffect, useRef, useState } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../../data/sources/FirebaseClient';

interface UseGroupObserverOptions {
  /** Cuando un nuevo admin acepta la transferencia (creatorId cambió y ya no soy admin). */
  onTransferAccepted?: () => void;
  /** Cuando el candidato rechazó (pendingAdminTransfer pasó de pending a null sin cambiar creatorId). */
  onTransferRejected?: (candidateName?: string) => void;
  /** ID del admin actual para distinguir aceptación vs rechazo. */
  currentAdminId?: string;
  /** Llamado cuando cambian miembros (para que el padre re-fetch del detalle). */
  onMembersChanged?: () => void;
  /** Habilitado solo cuando el usuario es admin (evita listeners innecesarios). */
  enabled?: boolean;
  /** ID del usuario actual: si se provee, se observa su solicitud personal en el grupo. */
  userId?: string;
}

/**
 * Observer reactivo del grupo basado en Firestore onSnapshot.
 *
 * Suscribe a:
 *  - groups/{groupId}                       → estado del grupo (pendingAdminTransfer, creatorId)
 *  - groups/{groupId}/requests (status==pending) → solicitudes pendientes
 *  - group_members where groupId == groupId  → cambios en miembros
 */
export const useGroupObserver = (
  groupId: string | undefined,
  options: UseGroupObserverOptions = {}
) => {
  const {
    onTransferAccepted,
    onTransferRejected,
    currentAdminId,
    onMembersChanged,
    enabled = true,
    userId,
  } = options;

  const [requests, setRequests] = useState<any[]>([]);
  const [groupData, setGroupData] = useState<any>(null);
  const [loadingObs, setLoadingObs] = useState(true);
  const [userRequest, setUserRequest] = useState<{ status: 'pending' | 'accepted' | 'rejected' } | null>(null);

  // Ref para detectar transición de pendingAdminTransfer
  const prevTransferRef = useRef<any>(null);
  const prevCreatorRef = useRef<string | null>(null);

  useEffect(() => {
    if (!groupId || !enabled) return;

    setLoadingObs(true);

    // 1. Solicitudes pendientes (subcolección)
    const reqQuery = query(
      collection(db, 'groups', groupId, 'requests'),
      where('status', '==', 'pending')
    );
    const unsubRequests = onSnapshot(
      reqQuery,
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
        setRequests(list);
      },
      (err) => console.warn('[useGroupObserver] requests error:', err)
    );

    // 2. Doc del grupo (para detectar pendingAdminTransfer y creatorId)
    const groupRef = doc(db, 'groups', groupId);
    const unsubGroup = onSnapshot(
      groupRef,
      (snap) => {
        const data = snap.exists() ? { id: snap.id, ...(snap.data() as any) } : null;
        setGroupData(data);
        setLoadingObs(false);

        if (!data) return;

        const prevTransfer = prevTransferRef.current;
        const prevCreator = prevCreatorRef.current;
        const newTransfer = data.pendingAdminTransfer ?? null;
        const newCreator = data.creatorId ?? null;

        // Detectar resolución de transferencia: pasó de pending a null
        const wasPending = prevTransfer && prevTransfer.status === 'pending';
        const isNowNull = !newTransfer;

        if (wasPending && isNowNull) {
          // Si creatorId cambió y ya NO soy yo → ACEPTADA
          if (currentAdminId && newCreator && newCreator !== currentAdminId && prevCreator === currentAdminId) {
            onTransferAccepted?.();
          } else {
            // Sigue siendo el mismo creator → RECHAZADA
            onTransferRejected?.(prevTransfer?.candidateName);
          }
        }

        prevTransferRef.current = newTransfer;
        prevCreatorRef.current = newCreator;
      },
      (err) => {
        console.warn('[useGroupObserver] group doc error:', err);
        setLoadingObs(false);
      }
    );

    // 3. Miembros (top-level collection 'group_members')
    const membersQuery = query(
      collection(db, 'group_members'),
      where('groupId', '==', groupId)
    );
    const unsubMembers = onSnapshot(
      membersQuery,
      () => {
        // Notificar al padre para refetch (los nombres se resuelven server-side)
        onMembersChanged?.();
      },
      (err) => console.warn('[useGroupObserver] members error:', err)
    );

    // 4. (Opcional) Solicitud personal del usuario actual: groups/{groupId}/requests/{userId}
    let unsubUserReq: (() => void) | null = null;
    if (userId) {
      const userReqRef = doc(db, 'groups', groupId, 'requests', userId);
      unsubUserReq = onSnapshot(
        userReqRef,
        (snap) => {
          if (!snap.exists()) {
            setUserRequest(null);
            return;
          }
          const data = snap.data() as any;
          setUserRequest({ status: data.status });
        },
        (err) => console.warn('[useGroupObserver] user request error:', err)
      );
    }

    return () => {
      unsubRequests();
      unsubGroup();
      unsubMembers();
      if (unsubUserReq) unsubUserReq();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId, enabled, currentAdminId, userId]);

  return {
    requests,
    groupData,
    loadingObs,
    pendingTransfer: groupData?.pendingAdminTransfer ?? null,
    userRequest,
  };
};
