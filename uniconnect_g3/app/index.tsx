import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import React, { useState, useEffect } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import { authStore } from '@uniconnect/shared';
import { useAppNavigation } from '@/src/presentation/hooks/useAppNavigation.native';
import { UCaldasTheme } from './constants/Colors';

export default function LoginScreen() {
  const setUser = authStore((state) => state.setUser);
  const [authError, setAuthError] = useState(false);
  const navigation = useAppNavigation();

  const handleGoogleLogin = async () => {
    const expoUrl = Linking.createURL('/');
    const backendUrl = `${process.env.EXPO_PUBLIC_BACKEND_URL}/auth/google`;

    if (Platform.OS === 'web') {
      window.location.href = `${backendUrl}?redirect=web`;
      return;
    }

    try {
      const result = await WebBrowser.openAuthSessionAsync(
        `${backendUrl}?redirect=${encodeURIComponent(expoUrl)}`,
        expoUrl
      );

      if (result.type === 'success' && result.url) {
        const { queryParams } = Linking.parse(result.url);

        if (queryParams && queryParams.error === 'domain_not_allowed') {
          setAuthError(true);
        }

        else if (queryParams && queryParams.uid) {
          setUser({
            id: queryParams.uid as string,
            uid: queryParams.uid as string,
            name: queryParams.name as string,
            email: queryParams.email as string,
          });
          navigation.replace("/(tabs)/home");
        }
      }
    } catch (error) {
      console.error("Error en el login:", error);
      const msg = error instanceof Error ? error.message : '';
      if (msg.includes('No matching browser') || msg.includes('browser activity')) {
        Alert.alert(
          'Navegador no encontrado',
          'Asegúrate de tener Chrome u otro navegador instalado y habilitado en tu dispositivo.',
        );
      } else {
        Alert.alert("Error", "Ocurrió un problema al intentar conectar con el servidor.");
      }
    }
  };

  useEffect(() => {
    if (Platform.OS !== 'web') {
      WebBrowser.warmUpAsync();
      return () => { WebBrowser.coolDownAsync(); };
    }
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('error') === 'domain_not_allowed') {
        setAuthError(true);
      } else if (params.get('uid')) {
        setUser({
          id: params.get('uid') as string,
          uid: params.get('uid') as string,
          name: params.get('name') as string,
          email: params.get('email') as string,
        });
        navigation.replace("/(tabs)/home");
      }
    }
  }, []);

  if (authError) {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, { color: '#d32f2f' }]}>Acceso Denegado</Text>
        <Text style={styles.subtitle}>
          Debes usar obligatoriamente tu correo institucional de @ucaldas.edu.co para ingresar.
        </Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: UCaldasTheme.azulOscuro }]}
          onPress={() => setAuthError(false)}
        >
          <Text style={styles.buttonText}>Volver a intentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Image
        source={{ uri: 'https://vectorseek.com/wp-content/uploads/2023/09/Universidad-de-Caldas-Logo-Vector.svg-.png' }}
        style={{ width: 250, height: 250, marginBottom: 10 }}
        resizeMode="contain"
      />
      <Text style={{ color: UCaldasTheme.azulOscuro, fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
        UniConnect G3
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleGoogleLogin}>
        <Text style={styles.buttonText}>Iniciar sesión con Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1a73e8'
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
    marginTop: 10
  },
  button: {
    backgroundColor: '#4285F4',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    elevation: 3
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
});