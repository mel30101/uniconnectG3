import { useGroupChat } from '@/src/presentation/hooks/useGroupChat';
import { useGroupDetail } from '@/src/presentation/hooks/useGroupDetail';
import { useHeaderHeight } from '@react-navigation/elements';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState, useRef } from 'react';
import { FlatList, Keyboard, KeyboardAvoidingView, Text, View } from 'react-native';
import ChatBubble from '@/src/presentation/components/chat/ChatBubble';
import GroupMessageInput from '@/src/presentation/components/chat/GroupMessageInput';
import UCaldasTheme from '../../constants/Colors';
import { getOrCreateChat } from '@/src/di/container';

export default function GroupChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { messages, user, handleAddReaction } = useGroupChat(id);
  const { group } = useGroupDetail(id);

  const flatListRef = useRef<FlatList>(null);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const headerHeight = useHeaderHeight();
  const router = useRouter();

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handlePrivateMessage = async (targetUserId: string) => {
    if (!user?.uid) return;
    try {
      const chatId = await getOrCreateChat.execute(user.uid, targetUserId);
      router.push(`/chat/${chatId}`);
    } catch (e) {
      console.error("No se pudo iniciar chat privado", e);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: group?.name ? `Chat ${group.name}` : 'Chat Grupal',
          headerStyle: {
            backgroundColor: UCaldasTheme.azulOscuro,
          },
          headerTintColor: '#fff',
          headerTitleAlign: 'left',
          headerBackTitle: 'Volver',
        }}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={70}
      >
        <FlatList
          ref={flatListRef}
          data={[...messages].reverse()}
          keyExtractor={item => item.id}
          inverted={true}
          contentContainerStyle={{ paddingBottom: 10, paddingTop: 10 }}
          renderItem={({ item }) => {
            const isOwn = item.senderId === user?.uid;
            const isMentioned = !!(item.hasMention && user?.uid && item.mentionedUserIds?.includes(user.uid));
            let senderName = undefined;

            if (!isOwn && group?.members) {
              const member = group.members.find((m: any) => m.id === item.senderId);
              if (member && member.name) {
                // Tomar primer nombre y primer apellido para que no sea tan largo
                const nameParts = member.name.split(' ');
                senderName = nameParts.length > 1 ? `${nameParts[0]} ${nameParts[1]}` : nameParts[0];
              }
            }

            return (
              <ChatBubble
                message={item}
                isOwn={isOwn}
                senderName={senderName}
                isMentioned={isMentioned}
                onPrivateMessage={handlePrivateMessage}
                onReaction={handleAddReaction}
              />
            );
          }}
        />
        <GroupMessageInput groupId={id} />
      </KeyboardAvoidingView>
    </>
  );
}
