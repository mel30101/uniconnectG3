import { useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { chatRepo, sendFileMessage as sendFileMessageUC, sendMessage as sendMessageUC } from '../../di/container';
import { Message } from '../../domain/entities/Message';
import { authStore } from '@uniconnect/shared';

export const useChat = (chatId: string) => {
  const user = authStore((state) => state.user);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatDetails, setChatDetails] = useState<any>(null);

  useEffect(() => {
    if (!chatId) return;

    const unsubscribe = chatRepo.subscribeToMessages(chatId, setMessages);

    const fetchDetails = async () => {
      const details = await chatRepo.getChatDetails(chatId);
      setChatDetails(details);
    };
    fetchDetails();

    return unsubscribe;
  }, [chatId]);

  const sendMessage = async (text: string) => {
    if (!user?.uid) return;
    await sendMessageUC.execute(chatId, text, user.uid);
  };

  const sendFileMessage = async (file: any) => {
    if (!user?.uid) return;
    await sendFileMessageUC.execute(chatId, user.uid, file);
  };

  /*** const handleAddReaction = async (messageId: string, emoji: string) => {
  //  if (!user?.uid) return;
  //  try {
      await chatRepo.addReaction(chatId, messageId, emoji, user.uid);
    } catch (error) {
      console.error('[HTTP] Error al reaccionar:', error);
    }
  }; ***/

  const handleAddReaction = async (messageId: string, emoji: string) => {
    console.log('[DEBUG] Se llamó a handleAddReaction, mensaje:', messageId); 
    if (!user?.uid) {
      console.warn('[UI] Usuario no logueado al intentar reaccionar');
      Alert.alert('Atención', 'No se pudo verificar el usuario para la reacción.');
      return;
    }

    try {
      console.log('[API] Enviando reacción a:', chatId, messageId);
      await chatRepo.addReaction(chatId, messageId, emoji, user.uid);
    } catch (error) {
      console.error('[HTTP] Error al reaccionar:', error);

     
      if (Platform.OS === 'web') {
        window.alert('Error al reaccionar: ' + String(error));
      } else {
        Alert.alert('Error', 'No se pudo registrar la reacción en el servidor.');
      }
    }
  };

  const otherUserId = chatDetails?.participants?.find((id: string) => id !== user?.uid);
  const otherUserName = otherUserId && chatDetails?.participantsInfo?.[otherUserId]?.name
    ? chatDetails.participantsInfo[otherUserId].name
    : 'Cargando...';

  return {
    messages,
    chatDetails,
    otherUserName,
    sendMessage,
    sendFileMessage,
    handleAddReaction,
    user,
  };
};
