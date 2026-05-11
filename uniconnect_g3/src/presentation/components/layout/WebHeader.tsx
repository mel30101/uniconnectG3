import { Ionicons } from '@expo/vector-icons';
import { Link, usePathname } from 'expo-router';
import { Image, Text, View } from 'react-native';
import { UCaldasTheme } from '@/app/constants/Colors';
import React from 'react';
import NotificationCenter from '../notifications/NotificationCenter';

export function WebHeader() {
  const pathname = usePathname();

  return (
    <View style={{
      backgroundColor: UCaldasTheme.azulOscuro,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 15,
      paddingVertical: 10,
      zIndex: 1000,
      position: 'relative',
      overflow: 'visible',
    }}>
      {/* Lado izquierdo: Logo, Título y Opciones del Menú */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image
          source={{ uri: 'https://www.ucaldas.edu.co/portal/wp-content/uploads/2023/06/Logo_80_anos_Universidad_de_Caldas_Blanco.png' }}
          style={{ width: 70, height: 50, marginRight: 10 }}
          resizeMode="contain"
        />
        <Text style={{ color: UCaldasTheme.blanco, fontSize: 18, fontWeight: 'bold' }}>
          UniConnect G3
        </Text>

        {/* Opciones del menú agrupadas a la izquierda */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, marginLeft: 60 }}>
          <Link href="/home" style={{ flexDirection: 'row', alignItems: 'center', opacity: pathname === '/home' ? 1 : 0.7 }}>
            <Ionicons name="book" size={18} color={UCaldasTheme.blanco} style={{ marginRight: 5 }} />
            <Text style={{ color: UCaldasTheme.blanco, fontWeight: pathname === '/home' ? 'bold' : 'normal', fontSize: 16 }}>Inicio</Text>
          </Link>
          <Link href="/search" style={{ flexDirection: 'row', alignItems: 'center', opacity: pathname === '/search' ? 1 : 0.7 }}>
            <Ionicons name="search" size={18} color={UCaldasTheme.blanco} style={{ marginRight: 5 }} />
            <Text style={{ color: UCaldasTheme.blanco, fontWeight: pathname === '/search' ? 'bold' : 'normal', fontSize: 16 }}>Buscar</Text>
          </Link>
          <Link href="/mis-grupos" style={{ flexDirection: 'row', alignItems: 'center', opacity: pathname === '/mis-grupos' || pathname.startsWith('/group') ? 1 : 0.7 }}>
            <Ionicons name="people" size={18} color={UCaldasTheme.blanco} style={{ marginRight: 5 }} />
            <Text style={{ color: UCaldasTheme.blanco, fontWeight: pathname === '/mis-grupos' || pathname.startsWith('/group') ? 'bold' : 'normal', fontSize: 16 }}>Grupos</Text>
          </Link>
          <Link href="/chat" style={{ flexDirection: 'row', alignItems: 'center', opacity: pathname === '/chat' || pathname.startsWith('/chat/') ? 1 : 0.7 }}>
            <Ionicons name="chatbubbles" size={18} color={UCaldasTheme.blanco} style={{ marginRight: 5 }} />
            <Text style={{ color: UCaldasTheme.blanco, fontWeight: pathname === '/chat' || pathname.startsWith('/chat/') ? 'bold' : 'normal', fontSize: 16 }}>Chats</Text>
          </Link>
        </View>
      </View>

      {/* Lado derecho: Notificaciones y Perfil */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <NotificationCenter />
        
        <Link href="/profile" style={{ flexDirection: 'row', alignItems: 'center', opacity: pathname === '/profile' ? 1 : 0.7 }}>
          <Ionicons name="person" size={18} color={UCaldasTheme.blanco} style={{ marginRight: 5 }} />
          <Text style={{ color: UCaldasTheme.blanco, fontWeight: pathname === '/profile' ? 'bold' : 'normal', fontSize: 16 }}>Perfil</Text>
        </Link>
      </View>
    </View>
  );
}
