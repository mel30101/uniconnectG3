import React, { useState, useCallback } from 'react';
import { Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { UCaldasTheme } from '@/app/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { groupsStyles as styles } from './GroupsStyles';
import { CreateGroupModal } from './CreateGroupModal';
import { GroupCard } from './GroupCard';
import { useGroups } from '../../hooks/useGroups';

export function MobileGroupView() {
    const [activeTab, setActiveTab] = useState<'miembro' | 'admin'>('miembro');
    const [modalVisible, setModalVisible] = useState(false);
    const { managedGroups, memberGroups, fetchManagedGroups, fetchMemberGroups, loading } = useGroups();

    useFocusEffect(
        useCallback(() => {
            if (activeTab === 'admin') {
                fetchManagedGroups();
            } else if (activeTab === 'miembro') {
                fetchMemberGroups();
            }
        }, [activeTab, fetchManagedGroups, fetchMemberGroups])
    );

    return (
        <View style={styles.container}>
            {/* Tab Switcher */}
            <View style={styles.tabBar}>
                <TouchableOpacity
                    style={[styles.tabItem, activeTab === 'miembro' && styles.activeTabItem]}
                    onPress={() => setActiveTab('miembro')}
                >
                    <Text style={[styles.tabText, activeTab === 'miembro' && styles.activeTabText]}>
                        Mis Grupos
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabItem, activeTab === 'admin' && styles.activeTabItem]}
                    onPress={() => setActiveTab('admin')}
                >
                    <Text style={[styles.tabText, activeTab === 'admin' && styles.activeTabText]}>
                        Admin
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {activeTab === 'miembro' ? (
                    <View style={styles.adminContainer}>
                        <View style={styles.tabHeader}>
                            <Text style={styles.placeholderTitle}>Mis Grupos</Text>
                            <Text style={styles.placeholderSubtitle}>
                                Comunidades de estudio a las que perteneces.
                            </Text>
                        </View>

                        {loading ? (
                            <ActivityIndicator size="large" color={UCaldasTheme.azulOscuro} style={{ marginTop: 40 }} />
                        ) : memberGroups.length > 0 ? (
                            <View style={{ marginTop: 10 }}>
                                {memberGroups.map((group) => (
                                    <GroupCard key={group.id} group={group} isAdmin={false} />
                                ))}
                            </View>
                        ) : (
                            <View style={styles.placeholderContainer}>
                                <Ionicons name="people-outline" size={80} color={UCaldasTheme.azulOscuro} />
                                <Text style={styles.placeholderTitle}>Grupos seguidos</Text>
                                <Text style={styles.placeholderSubtitle}>
                                    Aquí verás las comunidades de estudio a las que perteneces.
                                </Text>
                            </View>
                        )}
                    </View>
                ) : (
                    <View style={styles.adminContainer}>
                        <View style={styles.tabHeader}>
                            <Text style={styles.placeholderTitle}>Gestión de grupos</Text>
                            <Text style={styles.placeholderSubtitle}>
                                Grupos donde tienes rol administrativo.
                            </Text>

                            <TouchableOpacity
                                style={styles.createButton}
                                onPress={() => setModalVisible(true)}
                            >
                                <Ionicons name="add-circle" size={20} color="#fff" style={{ marginRight: 8 }} />
                                <Text style={styles.createButtonText}>Crear Grupo</Text>
                            </TouchableOpacity>
                        </View>

                        {loading ? (
                            <ActivityIndicator size="large" color={UCaldasTheme.azulOscuro} style={{ marginTop: 40 }} />
                        ) : managedGroups.length > 0 ? (
                            <View style={{ marginTop: 10 }}>
                                {managedGroups.map((group) => (
                                    <GroupCard key={group.id} group={group} isAdmin={true} />
                                ))}
                            </View>
                        ) : (
                            <View style={styles.placeholderContainer}>
                                <Ionicons name="shield-checkmark-outline" size={80} color={UCaldasTheme.azulOscuro} />
                                <Text style={styles.placeholderTitle}>Sin grupos que gestionar</Text>
                                <Text style={styles.placeholderSubtitle}>
                                    Aquí aparecerán los grupos que hayas creado.
                                </Text>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>

            <CreateGroupModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSuccess={() => {
                    setModalVisible(false);
                    fetchManagedGroups();
                }}
            />
        </View>
    );
}
