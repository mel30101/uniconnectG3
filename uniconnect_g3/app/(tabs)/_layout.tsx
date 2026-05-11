import { Ionicons } from '@expo/vector-icons';
import { Tabs, Link, usePathname } from 'expo-router';
import { Image, Text, View, Platform } from 'react-native';
import { UCaldasTheme } from '../constants/Colors';
import { useEffect } from 'react';
import { authStore } from '@uniconnect/shared';
import { ApiProfileRepository } from '@/src/data/repositories/ApiProfileRepository';
import { WebHeader } from '@/src/presentation/components/layout/WebHeader';
import { useNotificationContext } from '@/src/presentation/context/NotificationContext';

export default function TabLayout() {
  const { user, setUser } = authStore();
  const pathname = usePathname();
  const { unreadCount } = useNotificationContext();

  useEffect(() => {
    const syncProfile = async () => {
      if (user?.uid && !user.careerId) {
        try {
          const profileRepo = new ApiProfileRepository();
          const profile = await profileRepo.getProfile(user.uid);
          if (profile) {
            setUser({ ...user, ...profile } as any);
          }
        } catch (error) {
          console.error("Error syncing profile in layout:", error);
        }
      }
    };
    syncProfile();
  }, [user?.uid, user?.careerId]);

  return (
    <View style={{ flex: 1 }}>
      {Platform.OS === 'web' && <WebHeader />}
      <Tabs
        screenOptions={{
          headerShown: Platform.OS !== 'web',
          // 1. Estilo global del encabezado para todas las pestañas
          headerStyle: {
            backgroundColor: UCaldasTheme.azulOscuro,
            elevation: 0, // Quita la sombra en Android
            shadowOpacity: 0, // Quita la sombra en iOS
          },
          headerTintColor: UCaldasTheme.blanco,
          headerTitleAlign: 'left',
          tabBarStyle: { display: Platform.OS === 'web' ? 'none' : 'flex' },

          // 2. Insertar el Logo y el nombre de la Universidad
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={{ uri: 'https://www.ucaldas.edu.co/portal/wp-content/uploads/2023/06/Logo_80_anos_Universidad_de_Caldas_Blanco.png' }}
                style={{ width: 70, height: 50, marginRight: 10 }}
                resizeMode="contain"
              />
              <Text style={{ color: UCaldasTheme.blanco, fontSize: 18, fontWeight: 'bold' }}>
                UniConnect G3
              </Text>
            </View>
          ),
        }}
      >
        {/* Pestaña de Inicio */}
        <Tabs.Screen
          name="home"
          options={{
            title: 'Inicio',
            tabBarIcon: ({ color }) => <Ionicons name="book" size={24} color={color} />,
          }}
        />

        {/* Pestaña de Buscar */}
        <Tabs.Screen
          name="search"
          options={{
            title: 'Buscar',
            tabBarIcon: ({ color }) => <Ionicons name="search" size={24} color={color} />,
          }}
        />

        {/* Pestaña de Mis Grupos */}
        <Tabs.Screen
          name="mis-grupos"
          options={{
            title: 'Grupos',
            tabBarIcon: ({ color }) => <Ionicons name="people" size={24} color={color} />,
            headerTitle: () => (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={{ uri: 'https://www.ucaldas.edu.co/portal/wp-content/uploads/2023/06/Logo_80_anos_Universidad_de_Caldas_Blanco.png' }}
                  style={{ width: 70, height: 50, marginRight: 10 }}
                  resizeMode="contain"
                />
                <Text style={{ color: UCaldasTheme.blanco, fontSize: 18, fontWeight: 'bold' }}>
                  UniConnect G3
                </Text>
              </View>
            ),
          }}
        />


        {/* Pestaña de Chats*/}
        <Tabs.Screen
          name="chat/index"
          options={{
            title: 'Chats',
            tabBarIcon: ({ color }) => <Ionicons name="chatbubbles" size={24} color={color} />,
          }}
        />

        {/* Pestaña de Notificaciones (solo visible en móvil) */}
        <Tabs.Screen
          name="notifications"
          options={{
            title: 'Alertas',
            tabBarIcon: ({ color }) => (
              <View style={{ position: 'relative' }}>
                <Ionicons name="notifications" size={24} color={color} />
                {unreadCount > 0 && (
                  <View style={{
                    position: 'absolute',
                    top: -4,
                    right: -6,
                    backgroundColor: '#dc3545',
                    borderRadius: 9,
                    minWidth: 16,
                    height: 16,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 3,
                  }}>
                    <Text style={{ color: '#fff', fontSize: 9, fontWeight: 'bold' }}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Text>
                  </View>
                )}
              </View>
            ),
          }}
        />

        {/* Pestaña de Perfil - AQUÍ QUITAMOS EL HEADER DUPLICADO */}
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
          }}
        />
      </Tabs>
    </View>
  );
}