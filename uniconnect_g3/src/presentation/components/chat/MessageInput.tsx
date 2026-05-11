import { authStore } from '@uniconnect/shared';
import * as DocumentPicker from 'expo-document-picker';
import { useState } from 'react';
import { ActivityIndicator, Alert, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { sendFileMessage as sendFileMessageUC, sendMessage as sendMessageUC } from '../../../di/container';

export default function MessageInput({ chatId }: { chatId: string }) {
  const [text, setText] = useState('');
  const user = authStore(state => state.user);
  const insets = useSafeAreaInsets();
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!text.trim() || !user?.uid || isSending) return;
    setIsSending(true);
    try {
      await sendMessageUC.execute(chatId, text, user.uid);
      setText('');
    } catch (error) {
      console.error('[Chat] Error al enviar mensaje:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handlePickFile = async () => {
    if (!user?.uid || isSending) return;

    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!res.canceled && res.assets && res.assets.length > 0) {
        setIsSending(true);
        const asset = res.assets[0];

        let detectedType = asset.mimeType;
        if (!detectedType && asset.name.toLowerCase().endsWith('.pdf')) {
          detectedType = 'application/pdf';
        }

        const fileToUpload = {
          uri: Platform.OS === 'ios' ? asset.uri.replace('file://', '') : asset.uri,
          type: detectedType || 'application/octet-stream',
          name: asset.name,
          size: asset.size,
          file: asset.file
        };

        await sendFileMessageUC.execute(chatId, user.uid, fileToUpload, text);
        setText('');
      }
    } catch (err) {
      console.log("Error al seleccionar archivo:", err);
      if (Platform.OS === 'web') {
        window.alert("No se pudo enviar el archivo. Revisa tu conexión.");
      } else {
        Alert.alert("Error", "No se pudo enviar el archivo.");
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        padding: 8,
        paddingTop: 10,
        paddingBottom: Math.max(insets.bottom, 10),
        backgroundColor: '#f4f6f8',
      }}
    >
      <Pressable
        onPress={handlePickFile}
        disabled={isSending}
        style={{ justifyContent: 'center', marginRight: 10, opacity: isSending ? 0.5 : 1 }}
      >
        <Text style={{ fontSize: 24 }}>📎</Text>
      </Pressable>

      <TextInput
        style={{
          flex: 1,
          borderWidth: 1,
          borderRadius: 20,
          paddingHorizontal: 15,
          paddingVertical: 8,
          marginRight: 8,
          backgroundColor: isSending ? '#f0f0f0' : '#fff',
          borderColor: '#e5e7eb',
          fontSize: 16,
        }}
        value={text}
        onChangeText={setText}
        placeholder="Escribe un mensaje..."
        onSubmitEditing={handleSend}
        blurOnSubmit={false}
        editable={!isSending}
      />

      <Pressable
        onPress={handleSend}
        disabled={isSending || !text.trim()}
        style={({ pressed }) => ({
          backgroundColor: (isSending || !text.trim()) ? '#a5a2f3' : (pressed ? '#3730a3' : '#4f46e5'),
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
          minWidth: 80,
          opacity: (isSending || !text.trim()) ? 0.7 : 1,
        })}
      >
        {isSending ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Enviar</Text>
        )}
      </Pressable>
    </View>
  );
}
