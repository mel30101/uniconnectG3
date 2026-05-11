import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Image } from 'react-native';
import { UCaldasTheme } from '@/app/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './DesktopGroupDashboardStyles';
import { useFocusEffect, useRouter } from 'expo-router';
import { useGroups } from '../../hooks/useGroups';
import { CreateGroupModal } from './CreateGroupModal';

// --- Tarjeta de Grupo para Escritorio ---
function DesktopGroupCard({ group, isAdmin }: { group: any, isAdmin: boolean }) {
    const router = useRouter();
    // Colores basados en si es admin o no (para el banner)
    const bannerColor = isAdmin ? '#003366' : '#B8860B'; // Navy para admin, Dorado para miembro
    const roleText = isAdmin ? 'ADMINISTRADOR' : 'MIEMBRO';
    
    // Obtener los miembros reales (si no vienen, usamos un array vacío)
    const members = group.members || [];
    const membersCount = members.length;
    const previewMembers = members.slice(0, 3);
    const extraMembers = membersCount > 3 ? membersCount - 3 : 0;

    return (
        <TouchableOpacity 
            style={styles.cardContainer} 
            activeOpacity={0.95}
            onPress={() => router.push({ pathname: "/group/[id]", params: { id: group.id } })}
        >
            {/* Banner superior */}
            <View style={[styles.cardBanner, { backgroundColor: bannerColor }]}>
                <View style={styles.roleBadge}>
                    <Text style={styles.roleText}>{roleText}</Text>
                </View>
            </View>

            {/* Ícono flotante */}
            <View style={styles.cardIconContainer}>
                <Ionicons name={isAdmin ? "laptop-outline" : "library-outline"} size={20} color="#002147" />
            </View>

            <View style={styles.cardContent}>
                {/* Título y Estado */}
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle} numberOfLines={2}>{group.name}</Text>
                    <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>ACTIVO</Text>
                    </View>
                </View>

                {/* Materia y Admin */}
                {(!isAdmin && (group.subjectName || group.adminName)) && (
                    <View style={{ marginBottom: 10 }}>
                        {group.subjectName && (
                            <Text style={{ fontSize: 13, color: '#002147', fontWeight: '600' }}>
                                <Ionicons name="book-outline" size={12} /> Materia: {group.subjectName}
                            </Text>
                        )}
                        {group.adminName && (
                            <Text style={{ fontSize: 13, color: '#002147', fontWeight: '600', marginTop: 2 }}>
                                <Ionicons name="person-outline" size={12} /> Administrador: {group.adminName}
                            </Text>
                        )}
                    </View>
                )}

                {/* Descripción */}
                <Text style={styles.cardDescription} numberOfLines={3}>
                    {group.description || 'Sin descripción disponible para esta comunidad.'}
                </Text>

                {/* Miembros */}
                <View style={styles.membersRow}>
                    <View style={styles.avatarsContainer}>
                        {previewMembers.map((member: any, index: number) => (
                            <Image 
                                key={member.id || index}
                                source={{ uri: member.photoURL || 'https://via.placeholder.com/150' }}
                                style={[styles.avatar, index > 0 && { marginLeft: -10 }]}
                            />
                        ))}
                        {extraMembers > 0 && (
                            <View style={styles.avatarMore}>
                                <Text style={styles.avatarMoreText}>+{extraMembers}</Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.membersCount}>
                        <Ionicons name="people" size={16} color="#708ab5" style={{ marginRight: 4 }} />
                        <Text style={styles.membersText}>{membersCount} Miembros</Text>
                    </View>
                </View>
            </View>

            {/* Acciones */}
            {isAdmin && (
                <View style={styles.cardActions}>
                    <TouchableOpacity 
                        style={styles.manageButton}
                        onPress={() => router.push({ pathname: "/group/[id]", params: { id: group.id } })}
                    >
                        <Text style={styles.manageButtonText}>Gestionar</Text>
                    </TouchableOpacity>
                </View>
            )}
        </TouchableOpacity>
    );
}

// --- Tarjeta de Estadísticas ---
function StatCard({ title, value, icon, borderColor }: { title: string, value: string, icon: any, borderColor: string }) {
    return (
        <View style={[styles.statCard, { borderLeftColor: borderColor }]}>
            <View style={styles.statIconWrapper}>
                <Ionicons name={icon} size={24} color="#002147" />
            </View>
            <View>
                <Text style={styles.statTitle}>{title}</Text>
                <Text style={styles.statValue}>{value}</Text>
            </View>
        </View>
    );
}

// --- COMPONENTE PRINCIPAL (DASHBOARD) ---
export function DesktopGroupDashboard() {
    const [activeTab, setActiveTab] = useState<'admin' | 'miembro'>('miembro');
    const [isCreateModalVisible, setCreateModalVisible] = useState(false);
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

    const currentGroups = activeTab === 'admin' ? managedGroups : memberGroups;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>

            {/* Header: Título */}
            <View style={styles.headerRow}>
                <View>
                    <Text style={styles.pageTitle}>Gestión de Grupos</Text>
                    <Text style={styles.pageSubtitle}>Comunidades de investigación y estudio.</Text>
                </View>
                {activeTab === 'admin' && (
                    <TouchableOpacity 
                        style={styles.primaryButton}
                        onPress={() => setCreateModalVisible(true)}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="add" size={20} color="#ffffff" style={{ marginRight: 8 }} />
                        <Text style={styles.primaryButtonText}>Nuevo Grupo</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Tab Switcher */}
            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'miembro' && styles.activeTab]}
                    onPress={() => setActiveTab('miembro')}
                >
                    <Text style={[styles.tabText, activeTab === 'miembro' && styles.activeTabText]}>Grupos de los que soy Miembro</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'admin' && styles.activeTab]}
                    onPress={() => setActiveTab('admin')}
                >
                    <Text style={[styles.tabText, activeTab === 'admin' && styles.activeTabText]}>Grupos que Administro</Text>
                </TouchableOpacity>
            </View>

            {/* Stats Row */}
            <View style={styles.statsRow}>
                <StatCard title="TOTAL GRUPOS" value={currentGroups.length.toString()} icon="people" borderColor="#B8860B" />
                {/* Actualmente seteado a 0 hasta que el backend soporte contabilidad de mensajes no leídos */}
                <StatCard title="MENSAJES NUEVOS" value="0" icon="chatbubble" borderColor="#708ab5" />
            </View>

            {/* Content Grid */}
            {loading ? (
                <ActivityIndicator size="large" color="#002147" style={{ marginTop: 60 }} />
            ) : (
                <View style={styles.gridContainer}>
                    {currentGroups.map((group: any) => (
                        <View key={group.id} style={styles.gridItem}>
                            <DesktopGroupCard group={group} isAdmin={activeTab === 'admin'} />
                        </View>
                    ))}
                </View>
            )}

            {/* Pagination Placeholder */}
            {!loading && (
                <View style={styles.paginationRow}>
                    <Text style={styles.paginationText}>Mostrando {currentGroups.length} grupos registrados</Text>
                    <View style={styles.paginationControls}>
                        <TouchableOpacity style={styles.pageButton}><Ionicons name="chevron-back" size={16} color="#002147" /></TouchableOpacity>
                        <TouchableOpacity style={[styles.pageButton, styles.pageButtonActive]}><Text style={styles.pageButtonActiveText}>1</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.pageButton}><Text style={styles.pageButtonText}>2</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.pageButton}><Text style={styles.pageButtonText}>3</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.pageButton}><Ionicons name="chevron-forward" size={16} color="#002147" /></TouchableOpacity>
                    </View>
                </View>
            )}

            <CreateGroupModal 
                visible={isCreateModalVisible}
                onClose={() => setCreateModalVisible(false)}
                onSuccess={() => {
                    setCreateModalVisible(false);
                    if (activeTab === 'admin') fetchManagedGroups();
                }}
            />

        </ScrollView>
    );
}

