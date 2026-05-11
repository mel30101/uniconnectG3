import ChatListItem from "@/src/presentation/components/chat/ChatListItem";
import { chatRepo } from "@/src/di/container";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { authStore } from '@uniconnect/shared';
import { Chat } from "@/src/domain/entities/Chat";

export default function ChatListScreen() {
  const user = authStore((state) => state.user);
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    if (!user?.uid) return;
    const unsubscribe = chatRepo.subscribeToUserChats(user.uid, setChats);
    return unsubscribe;
  }, [user]);

  if (!user) {
    return <Text>Cargando...</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={chats}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ChatListItem
            chat={item}
            currentUserId={user.uid}
            onPress={() =>
              router.push(`/chat/${item.id}`)
            }
          />
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 40 }}>
            No tienes chats aún
          </Text>
        }
      />
    </View>
  );
}