import {
  addMember,
  createGroup as createGroupUC,
  joinGroup as joinGroupUC,
  leaveGroup as leaveGroupUC,
  processRequest as processRequestUC,
  removeMember as removeMemberUC,
  transferAdmin as transferAdminUC,
  requestAdminTransfer as requestAdminTransferUC,
} from '../../di/container';
import { authStore } from '@uniconnect/shared';
import { handleApiError } from '../utils/errorHandler';
import { showToast } from '../utils/showToast';

export const useGroupActions = () => {
  const user = authStore((state) => state.user);

  const createGroup = async (name: string, subjectId: string, description: string) => {
    if (!user?.uid) return null;
    try {
      const result = await createGroupUC.execute(name, subjectId, description, user.uid);
      showToast('Grupo creado correctamente.', 'success');
      return result;
    } catch (e: any) {
      handleApiError(e, 'No se pudo crear el grupo.');
      return null;
    }
  };

  const joinGroup = async (groupId: string) => {
    if (!user?.uid || !user?.name) return false;
    try {
      await joinGroupUC.execute(groupId, user.uid, user.name);
      showToast('Solicitud enviada correctamente. Espera a que un administrador la apruebe.', 'success', '¡Éxito!');
      return true;
    } catch (e: any) {
      handleApiError(e, 'No se pudo enviar la solicitud.');
      return false;
    }
  };

  const processRequest = async (groupId: string, requestId: string, status: 'accepted' | 'rejected') => {
    try {
      const success = await processRequestUC.execute(groupId, requestId, status);
      if (success) {
        showToast(
          status === 'accepted' ? 'Solicitud aceptada correctamente.' : 'Solicitud rechazada.',
          'success'
        );
        return true;
      }
    } catch (e: any) {
      handleApiError(e, 'No se pudo procesar la solicitud.');
    }
    return false;
  };

  const transferAdmin = async (groupId: string, newAdminId: string) => {
    if (!user?.uid) return false;
    try {
      await transferAdminUC.execute(groupId, user.uid, newAdminId);
      showToast('Has cedido la administración de este grupo.', 'success', '¡Éxito!');
      return true;
    } catch (e: any) {
      handleApiError(e, 'No se pudo transferir la administración.');
      return false;
    }
  };

  const removeMember = async (groupId: string, memberId: string) => {
    if (!user?.uid) return false;
    try {
      await removeMemberUC.execute(groupId, memberId, user.uid);
      showToast('Miembro eliminado.', 'success');
      return true;
    } catch (e: any) {
      handleApiError(e, 'No se pudo eliminar al miembro.');
      return false;
    }
  };

  const addMemberToGroup = async (groupId: string, userId: string) => {
    try {
      const success = await addMember.execute(groupId, userId);
      return success;
    } catch (e: any) {
      handleApiError(e, 'Error al añadir miembro.');
      return false;
    }
  };

  const leaveGroup = async (groupId: string) => {
    if (!user?.uid) return false;
    try {
      const success = await leaveGroupUC.execute(groupId, user.uid);
      if (success) {
        try {
          const { ApiGroupRepository } = await import('../../data/repositories/ApiGroupRepository');
          const repo = new ApiGroupRepository();
          await repo.deleteUserRequests(groupId, user.uid);
        } catch (cleanError) {
          console.warn("No se pudieron limpiar las solicitudes, pero el usuario salió.");
        }
        return true;
      }
      return false;
    } catch (e: any) {
      handleApiError(e, 'No se pudo salir del grupo.');
      return false;
    }
  };

  const requestAdminTransfer = async (groupId: string, candidateId: string) => {
    if (!user?.uid) return false;
    try {
      await requestAdminTransferUC.execute(groupId, user.uid, candidateId);
      showToast('Solicitud de transferencia enviada al candidato.', 'info');
      return true;
    } catch (e: any) {
      handleApiError(e, 'No se pudo enviar la solicitud de transferencia.');
      return false;
    }
  };

  return {
    createGroup,
    joinGroup,
    processRequest,
    transferAdmin,
    requestAdminTransfer,
    removeMember,
    addMemberToGroup,
    leaveGroup,
  };
};