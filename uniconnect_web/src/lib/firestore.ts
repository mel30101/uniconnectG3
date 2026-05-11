import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);

export interface FirestoreChat {
  id: string;
  participants: string[];
  participantsInfo: Record<string, { name: string }>;
  lastMessage?: string;
  updatedAt?: { _seconds: number; _nanoseconds: number };
}

export function subscribeToUserChats(
  userId: string,
  callback: (chats: FirestoreChat[]) => void
): () => void {
  const q = query(
    collection(db, 'chats'),
    where('participants', 'array-contains', userId),
    orderBy('updatedAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const chats = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FirestoreChat[];
    callback(chats);
  });
}
