import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { UCaldasTheme } from "@/app/constants/Colors";
import { profileStyles as styles } from "./ProfileStyles";

interface ProfileInfoReadProps {
    user: any;
    profileData: any;
    careers: any[];
}

export function ProfileInfoRead({
    user,
    profileData,
    careers,
}: ProfileInfoReadProps) {
    return (
        <>
            <View style={styles.sectionCard}>
                <Text style={styles.formTitle}>Información Personal</Text>

                {profileData.showEmail && (
                    <View style={styles.infoRow}>
                        <Ionicons name="mail-outline" size={20} color={UCaldasTheme.azulOscuro} />
                        <Text style={styles.infoValue}>{user?.email}</Text>
                    </View>
                )}

                {profileData.phone ? (
                    <View style={styles.infoRow}>
                        <Ionicons name="call-outline" size={20} color={UCaldasTheme.azulOscuro} />
                        <Text style={styles.infoValue}>{profileData.phone}</Text>
                    </View>
                ) : null}

                {profileData.studyPreference ? (
                    <View style={styles.infoRow}>
                        <Ionicons name="school-outline" size={20} color={UCaldasTheme.azulOscuro} />
                        <Text style={styles.infoValue}>
                            Preferencia de estudio: {profileData.studyPreference}
                        </Text>
                    </View>
                ) : null}

                {profileData.age ? (
                    <View style={styles.infoRow}>
                        <Ionicons name="calendar-outline" size={20} color={UCaldasTheme.azulOscuro} />
                        <Text style={styles.infoValue}>{profileData.age} años</Text>
                    </View>
                ) : null}

                {profileData.biography ? (
                    <View style={styles.bioContainer}>
                        <Text style={styles.bioTitle}>Acerca de mí</Text>
                        <Text style={styles.bioText}>{profileData.biography}</Text>
                    </View>
                ) : null}
            </View>
        </>
    );
}
