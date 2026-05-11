import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { UCaldasTheme } from '../../../../app/constants/Colors';
import { styles } from './GroupDetailStyles';

export const PendingRequests = ({ requests, processRequest }: { requests: any[], processRequest: Function }) => {
    const router = useRouter();

    return (
        <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
                <Ionicons name="notifications-outline" size={20} color={UCaldasTheme.azulOscuro} />
                <Text style={styles.sectionTitle}>Solicitudes Pendientes</Text>
            </View>
            {requests.map((req) => (
                <View key={req.id} style={styles.memberItem}>
                    <View style={styles.memberInfo}>
                        <TouchableOpacity
                            onPress={() => router.push({ pathname: "/user/[id]", params: { id: req.userId } })}
                        >

                            <Text style={{ fontWeight: 'bold', color: UCaldasTheme.azulOscuro, textDecorationLine: 'underline' }}>
                                {req.userName}
                            </Text>
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#4CAF50' }]} onPress={() => processRequest(req.id, 'accepted')}>
                                <Text style={styles.actionButtonText}>Aceptar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#F44336', marginLeft: 10 }]} onPress={() => processRequest(req.id, 'rejected')}>
                                <Text style={styles.actionButtonText}>Rechazar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );
};