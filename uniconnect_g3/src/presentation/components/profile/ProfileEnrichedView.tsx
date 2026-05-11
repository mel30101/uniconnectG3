import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UCaldasTheme } from '@/app/constants/Colors';
import { Estadisticas } from '../../../domain/entities/AcademicProfile';

interface ProfileEnrichedViewProps {
    estadisticas?: Estadisticas;
    insignias?: string[];
}

export const ProfileEnrichedView: React.FC<ProfileEnrichedViewProps> = ({ estadisticas, insignias }) => {
    if (!estadisticas && (!insignias || insignias.length === 0)) {
        return null;
    }

    return (
        <View style={styles.container}>
            {estadisticas && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Estadísticas de Participación</Text>
                    <View style={styles.statsGrid}>
                        <View style={styles.statCard}>
                            <View style={[styles.iconCircle, { backgroundColor: '#E3F2FD' }]}>
                                <Ionicons name="people" size={24} color="#1976D2" />
                            </View>
                            <Text style={styles.statValue}>{estadisticas.gruposParticipa}</Text>
                            <Text style={styles.statLabel}>Grupos</Text>
                        </View>

                        <View style={styles.statCard}>
                            <View style={[styles.iconCircle, { backgroundColor: '#F3E5F5' }]}>
                                <Ionicons name="add-circle" size={24} color="#7B1FA2" />
                            </View>
                            <Text style={styles.statValue}>{estadisticas.gruposCreados}</Text>
                            <Text style={styles.statLabel}>Creados</Text>
                        </View>

                        <View style={styles.statCard}>
                            <View style={[styles.iconCircle, { backgroundColor: '#E8F5E9' }]}>
                                <Ionicons name="mail" size={24} color="#388E3C" />
                            </View>
                            <Text style={styles.statValue}>{estadisticas.mensajesEnviados}</Text>
                            <Text style={styles.statLabel}>Mensajes</Text>
                        </View>
                    </View>
                </View>
            )}

            {insignias && insignias.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Logros e Insignias</Text>
                    <View style={styles.badgesContainer}>
                        {insignias.map((insignia, index) => (
                            <View key={index} style={styles.badgeItem}>
                                <View style={styles.badgeIcon}>
                                    <Ionicons name="ribbon" size={20} color={UCaldasTheme.dorado} />
                                </View>
                                <Text style={styles.badgeText}>{insignia}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        marginBottom: 20,
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: UCaldasTheme.azulOscuro,
        marginBottom: 20,
        textAlign: 'center',
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statCard: {
        alignItems: 'center',
        flex: 1,
    },
    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    statValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: UCaldasTheme.azulOscuro,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
        fontWeight: '500',
    },
    badgesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    badgeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FAF9F6',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        margin: 5,
        borderWidth: 1,
        borderColor: '#EFEBE9',
    },
    badgeIcon: {
        marginRight: 6,
    },
    badgeText: {
        fontSize: 13,
        color: '#444',
        fontWeight: '600',
    },
});