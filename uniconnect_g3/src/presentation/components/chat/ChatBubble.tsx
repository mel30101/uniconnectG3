import UCaldasTheme from '@/app/constants/Colors';
import { MensajeFactory } from '@/src/domain/models/chat/MensajeFactory';
import { authStore } from '@uniconnect/shared';
import { useState } from 'react';
import { Modal, Platform, Pressable, Text, TouchableWithoutFeedback, View } from 'react-native';

const REACTION_EMOJIS = ['👍', '❤️', '😂', '🔥', '😮', '😢'];

export default function ChatBubble({ message, isOwn, senderName, isMentioned, onPrivateMessage, onReaction }: any) {
  const [showMenu, setShowMenu] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const currentUser = authStore(state => state.user);

  const mensajeDecorado = MensajeFactory.create(message, currentUser?.uid || '');

  const handleReaction = (emoji: string) => {
    console.log('[UI] Reaccionando con:', emoji, 'msgId:', message.id);
    if (onReaction) onReaction(message.id, emoji);
    setShowReactions(false);
  };

  return (
    <View style={{
      alignSelf: isOwn ? 'flex-end' : 'flex-start',
      margin: 8,
      maxWidth: '75%',
    }}>
      <Pressable
        onLongPress={() => {
          console.log('[UI] onLongPress activado');
          setShowReactions(true);
        }}
        onPress={() => {
          if (Platform.OS === 'web') {
            console.log('[UI] onPress (Web) activado');
            setShowReactions(true);
          }
        }}
        delayLongPress={400}
        style={({ pressed }) => ({
          backgroundColor: isOwn
            ? (isMentioned ? '#1e3a8a' : UCaldasTheme.azulOscuro)
            : (isMentioned ? '#fef3c7' : '#e5e7eb'),
          padding: 10,
          borderRadius: 12,
          borderWidth: isMentioned ? 2 : 0,
          borderColor: isMentioned ? '#f59e0b' : 'transparent',
          opacity: pressed ? 0.85 : 1,
        })}
      >
        {!isOwn && senderName && (
          <View style={{ position: 'relative', zIndex: 10 }}>
            <Pressable onPress={() => setShowMenu(!showMenu)}>
              <Text style={{
                fontSize: 12,
                fontWeight: 'bold',
                color: '#6b7280',
                marginBottom: 4,
              }}>
                {senderName}
              </Text>
            </Pressable>
            {showMenu && (
              <View style={{
                position: 'absolute',
                top: 20,
                left: 0,
                backgroundColor: '#fff',
                padding: 8,
                borderRadius: 6,
                elevation: 5,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
                zIndex: 1000,
                minWidth: 140,
              }}>
                <Pressable onPress={() => {
                  setShowMenu(false);
                  if (onPrivateMessage) onPrivateMessage(message.senderId);
                }}>
                  <Text style={{ color: '#4f46e5', fontSize: 13, fontWeight: 'bold' }}>💬 Mensaje privado</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}

        {/* Renderizado delegado al patrón Decorator */}
        {mensajeDecorado.render()}
      </Pressable>

      {/* Modal de Reacciones */}
      <Modal
        visible={showReactions}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowReactions(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowReactions(false)}>
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}>
            <TouchableWithoutFeedback onPress={() => { }}>
              <View style={{
                flexDirection: 'row',
                backgroundColor: '#fff',
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 30,
                elevation: 10,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 8,
              }}>
                {REACTION_EMOJIS.map(emoji => (
                  <Pressable
                    key={emoji}
                    onPress={() => handleReaction(emoji)}
                    style={({ pressed }) => ({
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 12,
                      backgroundColor: pressed ? '#f3f4f6' : 'transparent',
                      transform: [{ scale: pressed ? 1.3 : 1 }],
                    })}
                  >
                    <Text style={{ fontSize: 28 }}>{emoji}</Text>
                  </Pressable>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}