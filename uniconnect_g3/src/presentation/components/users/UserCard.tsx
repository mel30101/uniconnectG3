import { useRouter } from "expo-router";
import { memo } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { User } from "@/src/domain/entities/User";

interface UserCardProps {
    user: User;
}

function UserCard({ user }: UserCardProps) {
    const router = useRouter();

    console.log(`Renderizando tarjeta de: ${user.name}`); // Solo para que veas la magia en la consola

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/user/${user.uid}`)}
        >
            <Text style={styles.name}>{user.name}</Text>
        </TouchableOpacity>
    );
}

export default memo(UserCard);

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        padding: 15,
        marginVertical: 8,
        borderRadius: 10,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    name: {
        fontWeight: "bold",
        fontSize: 16,
        color: "#1a1a1a",
    },
    monitor: {
        color: "green",
        fontWeight: "bold",
        fontSize: 12,
        marginTop: 4,
    },
});