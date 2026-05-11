import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { Message } from '../../domain/entities/Message';
import { IGroupChatRepository } from '../../domain/repositories/IGroupChatRepository';
import apiClient from '../sources/ApiClient';
import { db } from '../sources/FirebaseClient';

export class FirestoreGroupChatRepository implements IGroupChatRepository {
  async sendGroupMessage(groupId: string, text: string, senderId: string): Promise<void> {
    await apiClient.post(`/api/group-chats/${groupId}/messages`, {
      senderId,
      text,
    });
  }

  async sendGroupFileMessage(groupId: string, senderId: string, file: any, text?: string): Promise<void> {
    const formData = new FormData();
    formData.append('senderId', senderId);
    if (text) {
      formData.append('text', text);
    }

    // Caso 1: Es un File nativo del navegador (web)
    if (typeof File !== 'undefined' && file instanceof File) {
      formData.append('file', file, file.name);
    }
    // Caso 2: Es un objeto con URI (mobile)
    else if (file && file.uri) {
      const name: string = file.name || 'archivo_uniconnect';
      const type: string = file.mimeType || file.type || 'application/octet-stream';
      formData.append('file', {
        uri: file.uri,
        name,
        type,
      } as any);
    }
    // Caso 3: Tiene una propiedad .file (wrapper de DocumentPicker)
    else if (file && file.file) {
      formData.append('file', file.file, file.file.name || 'archivo_uniconnect');
    }
    else {
      throw new Error('Objeto de archivo inválido');
    }

    await apiClient.post(`/api/group-chats/${groupId}/files`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  async addGroupReaction(groupId: string, messageId: string, emoji: string, userId: string): Promise<void> {
    await apiClient.post(`/api/group-chats/${groupId}/messages/${messageId}/reactions`, {
      emoji,
      userId
    });
  }

  subscribeToGroupMessages(groupId: string, callback: (messages: Message[]) => void): () => void {
    const q = query(
      collection(db, 'groups', groupId, 'messages'),
      orderBy('createdAt', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as any;

        // Extraer datos de archivo desde metadata.archivo (decorador MensajeConArchivo del backend)
        const archivo = data.metadata?.archivo;
        const fileUrl = data.fileUrl || archivo?.url || null;
        const fileName = data.fileName || archivo?.fileName || null;
        const fileSize = data.size || data.fileSize || archivo?.tamano || null;

        return {
          id: docSnap.id,
          type: data.type ?? 'text',
          ...data,
          // Normalización: el backend guarda 'content', el UI espera 'text'
          text: data.text || data.content,
          senderId: data.senderId || data.sender?.id,
          // Normalizar campos de archivo al nivel raíz para MensajeFactory/ChatBubble
          fileUrl,
          fileName,
          size: fileSize,
        } as Message;
      });
      callback(messages);
    });
  }
}
