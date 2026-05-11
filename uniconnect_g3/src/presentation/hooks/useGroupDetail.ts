import { useCallback, useEffect, useState } from 'react';
import { ApiGroupRepository } from '../../data/repositories/ApiGroupRepository';
import { getGroupDetail as getGroupDetailUC } from '../../di/container';
import { authStore } from '@uniconnect/shared';
import { useGroupActions } from './useGroupActions';
import { useGroupObserver } from './useGroupObserver';

const groupRepo = new ApiGroupRepository();

export const useGroupDetail = (groupId: string) => {
  const user = authStore((state) => state.user);
  
  const { joinGroup, processRequest, transferAdmin, requestAdminTransfer, removeMember, addMemberToGroup, leaveGroup } = useGroupActions();

  const [group, setGroup] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDetail = useCallback(async () => {
    if (!groupId) return;
    setLoading(true);
    try {
      const data = await getGroupDetailUC.execute(groupId);
      setGroup(data);
    } catch (e) {
      console.error('Error fetching group detail:', e);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  const fetchRequests = useCallback(async () => {
    if (!groupId) return;
    try {
      const data = await groupRepo.getRequests(groupId);
      setRequests(data);
    } catch (e) {
      console.error(e);
    }
  }, [groupId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  // Observer reactivo (Firestore onSnapshot) sobre solicitudes, doc del grupo, miembros y solicitud propia
  const { requests: liveRequests, pendingTransfer, userRequest, groupData } = useGroupObserver(groupId, {
    enabled: !!groupId && !!user?.uid,
    currentAdminId: user?.uid,
    userId: user?.uid,
    onMembersChanged: () => {
      // Cualquier cambio en miembros refresca el detalle (nombres resueltos en backend)
      fetchDetail();
    },
  });

  // Reemplazar solicitudes locales por las en vivo cuando lleguen
  useEffect(() => {
    setRequests(liveRequests);
  }, [liveRequests]);

  const handleJoin = async () => await joinGroup(groupId);

  const handleProcessRequest = async (requestId: string, status: 'accepted' | 'rejected') => {
    // Observer actualiza la UI; no se requiere refetch manual
    return await processRequest(groupId, requestId, status);
  };

  const handleTransferAdmin = async (newAdminId: string) => await transferAdmin(groupId, newAdminId);

  const handleRequestAdminTransfer = async (candidateId: string) =>
    await requestAdminTransfer(groupId, candidateId);

  const handleRemoveMember = async (memberId: string) => {
    const success = await removeMember(groupId, memberId);
    if (success) fetchDetail();
    return success;
  };

  const handleAddMember = async (userId: string) => {
    const success = await addMemberToGroup(groupId, userId);
    if (success) fetchDetail();
    return success;
  };

  const handleLeaveGroup = async () => await leaveGroup(groupId);

  const isAdmin = group?.members?.some((m: any) => m.id === user?.uid && m.role === 'admin');
  const isMember = group?.members?.some((m: any) => m.id === user?.uid);

  return {
    group,
    requests,
    loading,
    isAdmin,
    isMember,
    user,
    pendingTransfer,
    liveCreatorId: groupData?.creatorId,
    userRequest,
    fetchDetail,
    fetchRequests,
    joinGroup: handleJoin,
    processRequest: handleProcessRequest,
    transferAdmin: handleTransferAdmin,
    requestAdminTransfer: handleRequestAdminTransfer,
    removeMember: handleRemoveMember,
    addMemberToGroup: handleAddMember,
    leaveGroup: handleLeaveGroup,
  };
};