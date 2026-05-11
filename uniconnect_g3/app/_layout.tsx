import { useEffect, useState } from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';
import { Stack, useRouter, useSegments, useRootNavigationState, usePathname } from 'expo-router';
import { authStore } from '@uniconnect/shared';
import { initializeStorage } from '@/adapters/storage';
import { NotificationProvider } from '@/src/presentation/context/NotificationContext';
import { useSocketNotifications } from '@/src/presentation/hooks/useSocketNotifications';
import { NotificationStack } from '@/src/presentation/components/notifications/NotificationToast';
import { useMyPresence } from '@/src/presentation/hooks/usePresence';
import UCaldasTheme from "@/app/constants/Colors";

function NotificationListener() {
  useSocketNotifications();
  return null;
}

export default function RootLayout() {
  const user = authStore((state) => state.user);
  const [hasHydrated, setHasHydrated] = useState(false);

  const segments = useSegments();
  const router = useRouter();
  const pathname = usePathname();
  const navigationState = useRootNavigationState();

  // Initialize shared package and storage
  useEffect(() => {
    const initialize = async () => {
      try {
        // Initialize storage adapter (hydrates token from AsyncStorage)
        await initializeStorage();

        setHasHydrated(true);
      } catch (error) {
        console.error('[Layout] Initialization error:', error);
        setHasHydrated(true);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    if (!hasHydrated || !navigationState?.key) return;

    const isInsidePrivateArea = segments[0] === '(tabs)' || segments[0] === 'chat' || segments[0] === 'group';
    const isAtLoginOrNotFound = pathname === '/' || segments[0] === '+not-found';

    if (!user && isInsidePrivateArea) {
      router.replace('/');
    } else if (user && isAtLoginOrNotFound) {
      router.replace('/(tabs)/home');
    }
  }, [user, hasHydrated, segments, navigationState?.key]);

  // Publicar presencia del usuario actual
  useMyPresence();

  if (!hasHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color={UCaldasTheme.azulOscuro} />
      </View>
    );
  }

  return (
    <NotificationProvider>
      <NotificationListener />
      <NotificationStack />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="chat/[chatId]"
          options={{
            headerStyle: { backgroundColor: UCaldasTheme.azulOscuro },
            headerTintColor: '#fff',
            title: ''
          }}
        />
      </Stack>
    </NotificationProvider>
  );
}