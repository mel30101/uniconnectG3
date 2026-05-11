import { useGroupDetail } from '@/src/presentation/hooks/useGroupDetail';
import { useSearchStudents } from "@/src/presentation/hooks/useSearchStudents";
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, View } from 'react-native';
import { MobileGroupDetail } from '@/src/presentation/components/groups/MobileGroupDetail';
import { DesktopAdminGroupDetail } from '@/src/presentation/components/groups/DesktopAdminGroupDetail';
import { WebHeader } from '@/src/presentation/components/layout/WebHeader';

export default function GroupDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const groupActions = useGroupDetail(id!);
    const { group, requests, loading, isAdmin, isMember, user } = groupActions;

    const [sendingRequest, setSendingRequest] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    
    const { users: availableStudents, performSearch } = useSearchStudents(user?.uid);

    useEffect(() => {
        if (isAdmin && id) groupActions.fetchRequests();
    }, [isAdmin, id]);

    const handleJoinRequest = async () => {
        setSendingRequest(true);
        const success = await groupActions.joinGroup();
        setSendingRequest(false);
        if (success) router.back();
    };

    const handleLeaveGroup = () => {
        if (Platform.OS === 'web') {
            if (window.confirm("¿Estás seguro de que quieres salir del grupo?")) {
                groupActions.leaveGroup().then((success: boolean) => {
                    if (success) router.replace('/(tabs)/home');
                });
            }
        } else {
            Alert.alert("Salir del grupo", "¿Estás seguro de que quieres salir?", [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Sí, salir", style: "destructive", 
                    onPress: async () => {
                        const success = await groupActions.leaveGroup();
                        if (success) router.replace('/(tabs)/home');
                    } 
                }
            ]);
        }
    };

    if (Platform.OS === 'web' && isAdmin) {
        return (
            <View style={{ flex: 1 }}>
                <WebHeader />
                <DesktopAdminGroupDetail 
                    groupActions={groupActions} 
                    id={id} 
                    availableStudents={availableStudents}
                    performSearch={performSearch}
                />
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            {Platform.OS === 'web' && <WebHeader />}
            <MobileGroupDetail 
                groupActions={groupActions}
                id={id}
                sendingRequest={sendingRequest}
                showAddModal={showAddModal}
                setShowAddModal={setShowAddModal}
                availableStudents={availableStudents}
                performSearch={performSearch}
                handleJoinRequest={handleJoinRequest}
                handleLeaveGroup={handleLeaveGroup}
            />
        </View>
    );
}