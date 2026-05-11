import { getOrCreateChat } from '@/src/di/container';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Text, TouchableOpacity, View, Platform } from 'react-native';
import { UCaldasTheme } from '../../../../app/constants/Colors';
import { styles } from './GroupDetailStyles';

export const MembersList = ({ group, isAdmin, isMember, user, groupActions }: any) => {
    const router = useRouter();

    const confirmTransfer = (member: any) => {
        if (Platform.OS === 'web') {
            if (window.confirm(`¿Estás seguro de ceder la administración a ${member.name}? Perderás tus privilegios de administrador.`)) {
                groupActions.transferAdmin(member.id).then((success: boolean) => {
                    if (success) router.back();
                });
            }
        } else {
            Alert.alert("Ceder cargo", `¿Ceder administración a ${member.name}?`, [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Aceptar", style: "destructive", onPress: async () => {
                        const success = await groupActions.transferAdmin(member.id);
                        if (success) router.back();
                    }
                }
            ]);
        }
    };

    const confirmRemove = (member: any) => {
        if (Platform.OS === 'web') {
            if (window.confirm(`¿Eliminar a ${member.name} del grupo?`)) {
                groupActions.removeMember(member.id);
            }
        } else {
            Alert.alert("Eliminar miembro", `¿Eliminar a ${member.name} del grupo?`, [
                { text: "Cancelar", style: "cancel" },
                { text: "Eliminar", style: "destructive", onPress: () => groupActions.removeMember(member.id) }
            ]);
        }
    };

    const openChat = async (member: any) => {
        if (!user?.uid || !member.id) return;
        const chatId = await getOrCreateChat.execute(user.uid, member.id, user.name ?? "usuario", member.name);
        router.push({ pathname: "/chat/[chatId]", params: { chatId } });
    };

    return (
        <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
                <Ionicons name="people-outline" size={20} color={UCaldasTheme.azulOscuro} />
                <Text style={styles.sectionTitle}>Miembros de la Comunidad</Text>
            </View>
            <View style={styles.membersList}>
                {group.members.map((member: any) => (
                    <View key={member.id} style={styles.memberItem}>
                        <View style={styles.memberAvatar}>
                            <Text style={styles.avatarText}>{member.name.charAt(0).toUpperCase()}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.memberInfo}
                            disabled={!isMember}
                            onPress={() => router.push({ pathname: "/user/[id]", params: { id: member.id } })}
                        >
                            <Text style={[styles.memberName, isMember && { color: UCaldasTheme.azulOscuro, textDecorationLine: 'underline' }]}>
                                {member.name}
                            </Text>
                            <Text style={styles.memberRole}>
                                {member.role === 'admin' ? 'Administrador' : 'Estudiante'}
                            </Text>
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginLeft: 'auto' }}>
                            {member.role === 'admin' && (
                                <View style={styles.starCircle}><Ionicons name="star" size={14} color="#fff" /></View>
                            )}
                            {isAdmin && member.id !== user?.uid && (
                                <TouchableOpacity onPress={() => confirmTransfer(member)}>
                                    <Ionicons name="key-outline" size={22} color={UCaldasTheme.dorado} />
                                </TouchableOpacity>
                            )}
                            {isAdmin && member.role !== 'admin' && (
                                <TouchableOpacity onPress={() => confirmRemove(member)}>
                                    <Ionicons name="trash-outline" size={22} color="#F44336" />
                                </TouchableOpacity>
                            )}
                            {isMember && member.id !== user?.uid && (
                                <TouchableOpacity onPress={() => openChat(member)}>
                                    <Ionicons name="chatbubble-ellipses" size={24} color={UCaldasTheme.azulOscuro} />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};