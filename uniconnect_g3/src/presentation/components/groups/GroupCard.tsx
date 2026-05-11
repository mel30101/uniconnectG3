import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { styles } from './GroupCardStyles';

interface GroupCardProps {
    group: {
        id: string;
        name: string;
        subjectName: string;
        adminName?: string;
    };
    isAdmin?: boolean;
}

export const GroupCard = ({ group, isAdmin = true }: GroupCardProps) => {
    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push({ pathname: "/group/[id]", params: { id: group.id } })}
        >
            <View style={styles.header}>
                <View style={styles.titleInfo}>
                    <Text style={styles.groupName}>{group.name}</Text>
                    <Text style={styles.subjectName}>{group.subjectName}</Text>
                    {group.adminName && (
                        <Text style={{ fontSize: 13, color: '#666', marginTop: 4 }}>
                            <Ionicons name="person-outline" size={13} color="#666" /> Admin: {group.adminName}
                        </Text>
                    )}
                </View>
                {isAdmin && (
                    <View style={styles.adminBadge}>
                        <Ionicons name="shield-checkmark" size={12} color="#fff" />
                        <Text style={styles.adminBadgeText}>Eres Admin</Text>
                    </View>
                )}
                <Ionicons name="chevron-forward" size={20} color="#ccc" style={{ marginLeft: 8 }} />
            </View>
        </TouchableOpacity>
    );
};
