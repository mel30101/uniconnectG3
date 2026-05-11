import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { UCaldasTheme } from '../../../../app/constants/Colors';
import { styles } from './GroupDetailStyles';

export const GroupInfo = ({ group, isAdmin }: { group: any, isAdmin: boolean }) => (
    <>
        <View style={styles.mainInfoCard}>
            <View style={styles.groupHeader}>
                <Text style={styles.groupName}>{group.name}</Text>
                <View style={styles.subjectBox}>
                    <Ionicons name="book" size={16} color={UCaldasTheme.dorado} />
                    <Text style={styles.subjectName}>{group.subjectName}</Text>
                </View>
                <View style={styles.badgeWrapper}>
                    {isAdmin && (
                        <View style={styles.adminBadge}>
                            <Ionicons name="shield-checkmark" size={14} color="#fff" />
                            <Text style={styles.adminBadgeText}>Administrador</Text>
                        </View>
                    )}
                </View>
            </View>
        </View>
        {group.description && group.description.trim().length > 0 && (
            <View style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                    <Ionicons name="information-circle-outline" size={20} color={UCaldasTheme.azulOscuro} />
                    <Text style={styles.sectionTitle}>Descripción</Text>
                </View>
                <Text style={styles.description}>{group.description}</Text>
            </View>
        )}
    </>
);