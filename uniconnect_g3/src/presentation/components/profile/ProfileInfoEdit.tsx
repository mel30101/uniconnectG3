import React from "react";
import { Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Collapsible } from "../common/Collapsible";
import { UCaldasTheme } from "@/app/constants/Colors";
import { profileStyles as styles } from "./ProfileStyles";

interface ProfileInfoEditProps {
    user: any;
    profileData: any;
    setProfileData: (data: any) => void;
}

export function ProfileInfoEdit({
    user,
    profileData,
    setProfileData,
}: ProfileInfoEditProps) {
    return (
        <>
            <View style={styles.rowCard}>
                <View style={{ flex: 1, paddingRight: 10 }}>
                    <Text style={styles.label}>
                        ¿Mostrar correo institucional en el perfil?
                    </Text>
                    <Text style={styles.infoText}>{user?.email}</Text>
                </View>
                <Switch
                    value={profileData.showEmail}
                    onValueChange={(val) =>
                        setProfileData({ ...profileData, showEmail: val })
                    }
                    trackColor={{ false: "#767577", true: UCaldasTheme.dorado }}
                    thumbColor={
                        profileData.showEmail ? UCaldasTheme.azulOscuro : "#f4f3f4"
                    }
                />
            </View>

            <Text style={styles.label}>Celular (Opcional):</Text>
            <TextInput
                style={styles.input}
                value={profileData.phone}
                onChangeText={(text) => {
                    // Solo permitir números
                    const cleaned = text.replace(/[^0-9]/g, "");
                    setProfileData({ ...profileData, phone: cleaned });
                }}
                placeholder="3000000000"
                keyboardType="numeric"
                maxLength={10}
            />

            <Text style={styles.label}>Edad (Opcional):</Text>
            <TextInput
                style={styles.input}
                value={profileData.age}
                onChangeText={(text) => {
                    // Solo permitir números
                    const cleaned = text.replace(/[^0-9]/g, "");
                    setProfileData({ ...profileData, age: cleaned });
                }}
                placeholder="Ej: 21"
                keyboardType="numeric"
                maxLength={2}
            />

            <Text style={styles.label}>Biografía (Opcional):</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                value={profileData.biography}
                onChangeText={(text) =>
                    setProfileData({ ...profileData, biography: text })
                }
                placeholder="Cuéntanos un poco sobre ti..."
                multiline
                numberOfLines={4}
                maxLength={300}
            />
            <Text style={styles.charCount}>
                {profileData.biography?.length || 0}/300
            </Text>

            <Text style={styles.label}>
                Preferencia de estudio (Presencial / Virtual):
            </Text>
            <View style={styles.card}>
                <Collapsible
                    title={profileData.studyPreference || "Selecciona preferencia (Opcional)..."}
                >
                    <View style={{ paddingVertical: 10 }}>
                        {["Presencial", "Virtual", "Cualquiera"].map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={[
                                    styles.subjectItem,
                                    profileData.studyPreference === option && styles.selected,
                                ]}
                                onPress={() =>
                                    setProfileData({
                                        ...profileData,
                                        studyPreference: option,
                                    })
                                }
                            >
                                <Text
                                    style={
                                        profileData.studyPreference === option
                                            ? styles.whiteText
                                            : styles.blackText
                                    }
                                >
                                    {option}
                                </Text>
                                {profileData.studyPreference === option && (
                                    <Ionicons name="checkmark-circle" size={20} color="#fff" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </Collapsible>
            </View>
        </>
    );
}
