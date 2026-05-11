import { IChatRepository } from '../../domain/repositories/IChatRepository';
import { Message } from '../../domain/entities/Message';
import { Chat } from '../../domain/entities/Chat';
import { db } from '../sources/FirebaseClient';
import apiClient from '../sources/ApiClient';
import {
  addDoc, collection, doc, getDoc, getDocs,
  onSnapshot, orderBy, query, serverTimestamp,
  updateDoc, where,
} from 'firebase/firestore';

export class FirestoreChatRepository implements IChatRepository {
  async sendMessage(chatId: string, text: string, senderId: string): Promise<void> {
    await addDoc(collection(db, 'chats', chatId, 'messages'), {
      type: 'text',
      text,
      senderId,
      createdAt: serverTimestamp(),
    });

    await updateDoc(doc(db, 'chats', chatId), {
      lastMessage: text,
      updatedAt: serverTimestamp(),
    });
  }

  async sendFileMessage(chatId: string, senderId: string, file: any, text?: string): Promise<void> {
    const f = file.uri ? file : file.assets?.[0];
    if (!f || !f.uri) {
      throw new Error('Objeto de archivo inválido');
    }

    const uri: string = f.uri;
    const name: string = f.name || 'archivo_uniconnect';
    const type: string = f.mimeType || f.type || 'application/octet-stream';

    const formData = new FormData();
    formData.append('senderId', senderId);
    if (text) {
      formData.append('text', text);
    }
    
    if (file.file) {
      formData.append('file', file.file);
    } else {
      formData.append('file', {
        uri,
        name,
        type,
      } as any);
    }

    await apiClient.post(`/api/chat/${chatId}/files`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  async addReaction(chatId: string, messageId: string, emoji: string, userId: string): Promise<void> {
    await apiClient.post(`/api/chat/${chatId}/messages/${messageId}/reactions`, {
      emoji,
      userId
    });
  }

  subscribeToMessages(chatId: string, callback: (messages: Message[]) => void): () => void {
    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('createdAt', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as any;

        // Extraer datos de archivo desde metadata.archivo (decorador MensajeConArchivo del backend)
        const archivo = data.metadata?.archivo;
        const fileUrl = data.fileUrl || archivo?.url || null;
        const fileName = data.fileName || archivo?.fileName || null;
        const fileSize = data.fileSize || archivo?.tamano || null;

        return {
          id: docSnap.id,
          type: data.type ?? 'text',
          ...data,
          // Normalizar campos de archivo al nivel raíz para ChatBubble
          fileUrl,
          fileName,
          size: fileSize,
        } as Message;
      });
      callback(messages);
    });
  }

  subscribeToUserChats(userId: string, callback: (chats: Chat[]) => void): () => void {
    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', userId),
      orderBy('updatedAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const chats = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Chat[];
      callback(chats);
    });
  }

  async getOrCreateChat(
    currentUserId: string,
    otherUserId: string,
    currentUserName?: string,
    otherUserName?: string
  ): Promise<string> {
    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', currentUserId)
    );

    const snapshot = await getDocs(q);
    const existingChat = snapshot.docs.find((docSnap) => {
      const participants = docSnap.data().participants;
      return participants.includes(otherUserId);
    });

    if (existingChat) {
      return existingChat.id;
    }

    const chatDoc = await addDoc(collection(db, 'chats'), {
      participants: [currentUserId, otherUserId],
      participantsInfo: {
        [currentUserId]: { name: currentUserName },
        [otherUserId]: { name: otherUserName },
      },
      lastMessage: '',
      updatedAt: serverTimestamp(),
    });
    return chatDoc.id;
  }

  async getChatDetails(chatId: string): Promise<any> {
    const chatRef = doc(db, 'chats', chatId);
    const chatSnap = await getDoc(chatRef);
    if (chatSnap.exists()) {
      return chatSnap.data();
    }
    return null;
  }
}
