import React from 'react';
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { UCaldasTheme } from '@/app/constants/Colors';
import { styles } from '@/app/group/GroupDetailStyles';
import { AddMemberModal } from './AddMemberModal';
import { GroupInfo } from './GroupInfo';
import { MembersList } from './MembersList';
import { PendingRequests } from './PendingRequests';

export function MobileGroupDetail({ groupActions, id, sendingRequest, showAddModal, setShowAddModal, availableStudents, performSearch, handleJoinRequest, handleLeaveGroup }: any) {
    const router = useRouter();
    const { group, requests, loading, isAdmin, isMember, user, userRequest } = groupActions;

    if (loading && !group) return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={UCaldasTheme.azulOscuro} />
            <Text style={styles.loadingText}>Cargando detalles...</Text>
        </View>
    );

    if (!group) return (
        <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={60} color="#ccc" />
            <Text style={styles.errorText}>No se encontró el grupo.</Text>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Text style={styles.backButtonText}>Volver</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Stack.Screen options={{ headerShown: false }} />
            
            <View style={styles.headerNav}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backCircle}>
                    <Ionicons name="arrow-back" size={24} color={UCaldasTheme.azulOscuro} />
                </TouchableOpacity>
                <Text style={styles.headerNavTitle}>Detalles del Grupo</Text>
                <View style={{ width: 45 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <GroupInfo group={group} isAdmin={isAdmin} />
                
                {isMember && (
                    <TouchableOpacity 
                        style={[styles.actionButton, { backgroundColor: UCaldasTheme.azulOscuro, marginTop: 15, marginBottom: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]} 
                        onPress={() => router.push(`/group/chat/${id}`)}
                    >
                        <Ionicons name="chatbubbles-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Ingresar al Chat del Grupo</Text>
                    </TouchableOpacity>
                )}
                
                <MembersList 
                    group={group} 
                    isAdmin={isAdmin} 
                    isMember={isMember} 
                    user={user} 
                    groupActions={groupActions} 
                />

                {isAdmin && requests.length > 0 && (
                    <PendingRequests requests={requests} processRequest={groupActions.processRequest} />
                )}

                {isMember && !isAdmin && (
                    <TouchableOpacity style={styles.leaveButton} onPress={handleLeaveGroup}>
                        <Ionicons name="log-out-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Salirme del grupo</Text>
                    </TouchableOpacity>
                )}

                {isAdmin && (
                    <TouchableOpacity 
                        style={[styles.actionButton, { backgroundColor: '#4CAF50', marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]} 
                        onPress={() => setShowAddModal(true)}
                    >
                        <Text style={{ color: '#fff', fontWeight: 'bold', marginRight: 8 }}>Añadir miembro</Text>
                        <Ionicons name="add-circle" size={20} color="#fff" />
                    </TouchableOpacity>
                )}
            </ScrollView>

            {!isMember && (() => {
                const isPending = userRequest?.status === 'pending';
                const wasRejected = userRequest?.status === 'rejected';
                const buttonLabel = isPending
                    ? 'Solicitud enviada'
                    : wasRejected
                        ? 'Volver a hacer solicitud para unirme'
                        : 'Solicitar unirme al grupo';
                const iconName = isPending ? 'time-outline' : 'person-add-outline';
                const buttonDisabled = sendingRequest || isPending;

                return (
                    <View style={styles.footerContainer}>
                        <TouchableOpacity
                            style={[styles.requestButton, buttonDisabled && styles.requestButtonDisabled]}
                            onPress={handleJoinRequest}
                            disabled={buttonDisabled}
                        >
                            {sendingRequest ? <ActivityIndicator color="#fff" /> : (
                                <>
                                    <Ionicons name={iconName as any} size={20} color="#fff" style={{ marginRight: 8 }} />
                                    <Text style={styles.requestButtonText}>{buttonLabel}</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                );
            })()}

            <AddMemberModal 
                visible={showAddModal} 
                onClose={() => setShowAddModal(false)} 
                group={group} 
                requests={requests}
                availableStudents={availableStudents}
                performSearch={performSearch}
                addMemberToGroup={groupActions.addMemberToGroup}
            />
        </SafeAreaView>
    );
}
