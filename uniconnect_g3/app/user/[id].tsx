import { getOrCreateChat } from "@/src/di/container";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { UCaldasTheme } from "../constants/Colors";
import { authStore } from '@uniconnect/shared';
import { useProfile } from "@/src/presentation/hooks/useProfile";
import { ProfileEnrichedView } from "@/src/presentation/components/profile/ProfileEnrichedView";

export default function ExternalProfileScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const authUser = authStore((state) => state.user);

    const {
        profileData: user,
        loading,
        hasProfile,
        isFullView,
        loadingFull,
        fetchFullProfile,
    } = useProfile(typeof id === 'string' ? id : id?.[0]);

    if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} color={UCaldasTheme.azulOscuro} />;
    if (!hasProfile) return <View style={styles.container}><Text>No se encontró el perfil.</Text></View>;

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={28} color="#111827" />
            </TouchableOpacity>

            <View style={styles.header}>
                <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarText}>{user.userName?.charAt(0)}</Text>
                </View>

                <Text style={styles.name}>{user.userName}</Text>
                {user.showEmail && (
                    <Text style={styles.emailText}>{user.email}</Text>
                )}
            </View>

            {(user.age || user.phone || user.studyPreference || user.biography) ? (
                <View style={styles.infoCard}>
                    <Text style={styles.sectionTitle}>Información Personal</Text>

                    {user.age ? (
                        <View style={styles.infoRow}>
                            <Ionicons name="calendar-outline" size={20} color={UCaldasTheme.azulOscuro} />
                            <Text style={styles.infoValue}>{user.age} años</Text>
                        </View>
                    ) : null}

                    {user.phone ? (
                        <View style={styles.infoRow}>
                            <Ionicons name="call-outline" size={20} color={UCaldasTheme.azulOscuro} />
                            <Text style={styles.infoValue}>{user.phone}</Text>
                        </View>
                    ) : null}

                    {user.studyPreference ? (
                        <View style={styles.infoRow}>
                            <Ionicons name="school-outline" size={20} color={UCaldasTheme.azulOscuro} />
                            <Text style={styles.infoValue}>Preferencia de estudio: {user.studyPreference}</Text>
                        </View>
                    ) : null}

                    {user.biography ? (
                        <View style={styles.bioContainer}>
                            <Text style={styles.bioTitle}>Acerca de mí</Text>
                            <Text style={styles.bioText}>{user.biography}</Text>
                        </View>
                    ) : null}
                </View>
            ) : null}

            <View style={styles.infoCard}>
                <Text style={styles.sectionTitle}>Información Académica</Text>

                <View style={readStyles.pathItem}>
                    <Ionicons name="business-outline" size={20} color={UCaldasTheme.dorado} style={{ marginRight: 12 }} />
                    <View>
                        <Text style={readStyles.pathLabel}>Facultad</Text>
                        <Text style={readStyles.pathValue}>{user.facultyName || "No especificada"}</Text>
                    </View>
                </View>

                <View style={readStyles.pathItem}>
                    <Ionicons name="school-outline" size={20} color={UCaldasTheme.dorado} style={{ marginRight: 12 }} />
                    <View>
                        <Text style={readStyles.pathLabel}>Nivel Académico</Text>
                        <Text style={readStyles.pathValue}>{user.academicLevelName || "No especificado"}</Text>
                    </View>
                </View>

                <View style={readStyles.pathItem}>
                    <Ionicons name="ribbon-outline" size={20} color={UCaldasTheme.dorado} style={{ marginRight: 12 }} />
                    <View>
                        <Text style={readStyles.pathLabel}>Nivel de Formación</Text>
                        <Text style={readStyles.pathValue}>{user.formationLevelName || "No especificado"}</Text>
                    </View>
                </View>

                <View style={readStyles.pathItem}>
                    <Ionicons name="briefcase-outline" size={20} color={UCaldasTheme.dorado} style={{ marginRight: 12 }} />
                    <View>
                        <Text style={readStyles.pathLabel}>Carrera</Text>
                        <Text style={readStyles.pathValue}>{user.careerName || "No especificada"}</Text>
                    </View>
                </View>

                <Text style={[styles.sectionTitle, { marginTop: 15, fontSize: 16 }]}>Materias Actuales</Text>
                {user.subjectNames && user.subjectNames.length > 0 ? (
                    user.subjectNames.map((name: string, index: number) => (
                        <View key={index} style={styles.subjectItem}>
                            <Ionicons name="book-outline" size={18} color={UCaldasTheme.azulOscuro} />
                            <Text style={styles.subjectText}>{name}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={{ fontStyle: "italic", color: "#6b7280" }}>No hay materias registradas</Text>
                )}
            </View>

            {/* VISTA ENRIQUECIDA (ESTADISTICAS E INSIGNIAS) */}
            <View style={{ paddingHorizontal: 20 }}>
                {!isFullView ? (
                    <TouchableOpacity
                        style={styles.fullViewButton}
                        onPress={fetchFullProfile}
                        disabled={loadingFull}
                    >
                        {loadingFull ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <>
                                <Ionicons name="stats-chart-outline" size={20} color="#fff" style={{ marginRight: 10 }} />
                                <Text style={styles.fullViewButtonText}>Ver vista completa</Text>
                            </>
                        )}
                    </TouchableOpacity>
                ) : (
                    <ProfileEnrichedView
                        estadisticas={user.estadisticas}
                        insignias={user.insignias}
                    />
                )}
            </View>

            <TouchableOpacity
                style={styles.chatButton}
                onPress={async () => {
                    if (!authUser?.uid || !id) return;
                    const chatId = await getOrCreateChat.execute(
                        authUser.uid,
                        id as string,
                        authUser.name ?? "usuario",
                        user.userName || "Estudiante"
                    );
                    router.push({
                        pathname: "/chat/[chatId]",
                        params: { chatId },
                    });
                }}
            >
                <Ionicons name="chatbubble-ellipses" size={20} color="#fff" style={{ marginRight: 10 }} />
                <Text style={styles.chatButtonText}>Iniciar Chat</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const readStyles = StyleSheet.create({
    pathItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    pathLabel: { fontSize: 12, color: '#666', fontWeight: '500' },
    pathValue: { fontSize: 15, color: UCaldasTheme.azulOscuro, fontWeight: '600' }
});

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f4f6f8" },
    backButton: { marginTop: 50, marginLeft: 20, width: 40, height: 40, justifyContent: "center" },
    header: { alignItems: "center", paddingHorizontal: 30, paddingBottom: 20 },
    avatarPlaceholder: {
        width: 100, height: 100, borderRadius: 50, backgroundColor: UCaldasTheme.azulOscuro,
        justifyContent: "center", alignItems: "center", marginBottom: 15
    },
    avatarText: { color: "#fff", fontSize: 40, fontWeight: "bold" },
    name: { fontSize: 22, fontWeight: "bold", color: UCaldasTheme.azulOscuro, textAlign: "center", width: '100%' },
    infoCard: { backgroundColor: "#fff", margin: 20, borderRadius: 16, padding: 20, elevation: 2 },
    sectionTitle: { fontSize: 17, fontWeight: "700", marginBottom: 15, color: "#374151" },
    subjectItem: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
    subjectText: { marginLeft: 10, fontSize: 15, color: "#4b5563" },
    fullViewButton: {
        backgroundColor: UCaldasTheme.dorado, flexDirection: "row",
        padding: 16, borderRadius: 12, justifyContent: "center", alignItems: "center",
        marginBottom: 10, elevation: 3
    },
    fullViewButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
    chatButton: {
        backgroundColor: UCaldasTheme.azulOscuro, flexDirection: "row", marginHorizontal: 20,
        padding: 16, borderRadius: 12, justifyContent: "center", alignItems: "center",
        marginTop: 10, elevation: 3
    },
    chatButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
    emailText: { fontSize: 15, color: "#4b5563", marginTop: 5 },
    infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
    infoValue: { marginLeft: 10, fontSize: 15, color: "#4b5563" },
    bioContainer: {
        marginTop: 10, padding: 15, backgroundColor: "#f9fafb",
        borderRadius: 12, borderWidth: 1, borderColor: "#eee"
    },
    bioTitle: { fontWeight: "bold", color: UCaldasTheme.azulOscuro, marginBottom: 8, fontSize: 15 },
    bioText: { color: "#4b5563", fontSize: 14, lineHeight: 22 },
});