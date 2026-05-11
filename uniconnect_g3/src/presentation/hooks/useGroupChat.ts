import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { groupChatRepo, sendGroupFileMessage as sendGroupFileMessageUC, sendGroupMessage as sendGroupMessageUC } from '../../di/container';
import { Message } from '../../domain/entities/Message';
import { useSocket } from '../hooks/useSocket';
import { authStore } from '@uniconnect/shared';

import { useGroupDetail } from './useGroupDetail';

export const useGroupChat = (groupId: string) => {
  const user = authStore((state) => state.user);
  const { socket } = useSocket();
  const { group } = useGroupDetail(groupId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);

  // Efecto 1: Suscripción a Firestore — SIEMPRE se ejecuta, independiente del socket
  useEffect(() => {
    if (!groupId || !user) return;

    console.log(`[Firestore] Suscribiendo a mensajes del grupo [${groupId}]`);
    const unsubscribe = groupChatRepo.subscribeToGroupMessages(groupId, setMessages);

    return () => {
      unsubscribe();
    };
  }, [groupId, user]);

  // Efecto 2: Socket — solo se ejecuta cuando el socket está disponible
  useEffect(() => {
    if (!groupId || !user || !socket) return;

    socket.emit('join_group', { groupId, userId: user.uid });
    console.log(`[Socket] Usuario [${user.uid}] unido a la sala del grupo [${groupId}]`);

    const handleNewMessage = (payload: any) => {
      const archivo = payload.metadata?.archivo;
      const normalizedMessage: Message = {
        ...payload,
        id: payload.id || payload.message_id,
        text: payload.text || payload.content,
        senderId: payload.senderId || payload.sender?.id,
        createdAt: payload.createdAt || payload.timestamp,
        fileUrl: payload.fileUrl || archivo?.url || null,
        fileName: payload.fileName || archivo?.fileName || null,
        size: payload.size || payload.fileSize || archivo?.tamano || null,
      };

      setMessages((prev) => {
        const alreadyExists = prev.some((m) => m.id === normalizedMessage.id);
        if (alreadyExists) return prev;
        return [...prev, normalizedMessage];
      });
    };

    const handleMessageUpdated = (data: { messageId: string, reacciones: any }) => {
      //console.log('[DEBUG] Se llamó a handleAddReaction, mensaje:', messages); // <--- ESTO ES LO NUEVO
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === data.messageId ? { ...msg, reacciones: data.reacciones } : msg
        )
      );
    };

    socket.on('new_message', handleNewMessage);
    socket.on('message_updated', handleMessageUpdated);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('message_updated', handleMessageUpdated);
      socket.emit('leave_group', { groupId });
    };
  }, [groupId, user, socket]);

  const sendMessage = async (text: string) => {
    if (!user?.uid) return;
    try {
      await sendGroupMessageUC.execute(groupId, text, user.uid);
    } catch (error) {
      console.error('[HTTP] Error enviando mensaje grupal:', error);
    }
  };

  const sendFileMessage = async (file: any, text?: string) => {
    if (!user?.uid) return;
    setIsSending(true);
    try {
      await sendGroupFileMessageUC.execute(groupId, user.uid, file, text);
    } catch (error: any) {
      console.error('[HTTP] Error enviando archivo:', error);
      if (Platform.OS === 'web') {
        window.alert(`Error: ${error.message || 'Error al subir archivo'}`);
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleAddReaction = async (messageId: string, emoji: string) => {
    if (!user?.uid) return;
    try {
      await groupChatRepo.addGroupReaction(groupId, messageId, emoji, user.uid);
    } catch (error) {
      console.error('[HTTP] Error al reaccionar:', error);
    }
  };

  return {
    messages,
    sendMessage,
    sendFileMessage,
    handleAddReaction,
    isSending,
    user,
  };
};