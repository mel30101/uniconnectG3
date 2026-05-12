import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyCkqMJRNienmfDh1onIRVpkzMLUMHYKYd0',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'uniconnect-g3.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'uniconnect-g3',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'uniconnect-g3.firebasestorage.app',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '545904567797',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:545904567797:web:cbf240a7aa54fbad09acbc',
};

const app = initializeApp(firebaseConfig);

// Inicializar Auth con persistencia de React Native
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);
export const storage = getStorage(app);
