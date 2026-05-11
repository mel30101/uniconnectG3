import { Pressable, Text } from 'react-native';

export default function ChatListItem({ chat, currentUserId ,onPress }: any) {

    const otherUserId = chat.participants?.find((id: string) => id !== currentUserId);

    const otherUserName = otherUserId && chat.participantsInfo?.[otherUserId]?.name?
    chat.participantsInfo[otherUserId].name
    : 'Usuario desconocido';

    return (
        <Pressable
            onPress={onPress}
            style={{
                padding: 16,
                borderBottomWidth: 1,
                borderColor: '#e5e7eb',
            }}
        >
            <Text style={{ fontWeight: '600', fontSize: 16 }}>
                {otherUserName}
            </Text>

            {chat.lastMessage && (
                <Text style={{ color: '#6b7280', marginTop: 4 }}>
                    {chat.lastMessage}
                </Text>
            )}
        </Pressable>
    );
}