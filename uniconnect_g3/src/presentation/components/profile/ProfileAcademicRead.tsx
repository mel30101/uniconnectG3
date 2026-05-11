import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { UCaldasTheme } from "@/app/constants/Colors";
import { profileStyles as styles } from "./ProfileStyles";

interface ProfileAcademicReadProps {
    profileData: any;
    sections: any[];
}

export function ProfileAcademicRead({
    profileData,
    sections,
}: ProfileAcademicReadProps) {
    return (
        <View style={styles.sectionCard}>
            <Text style={[styles.formTitle, { marginTop: 10 }]}>
                Información Académica
            </Text>

            <View style={readStyles.pathContainer}>
                <PathItem
                    label="Facultad"
                    value={profileData.facultyName}
                    icon="business-outline"
                />
                <PathItem
                    label="Nivel Académico"
                    value={profileData.academicLevelName}
                    icon="school-outline"
                />
                <PathItem
                    label="Nivel de Formación"
                    value={profileData.formationLevelName}
                    icon="ribbon-outline"
                />
                <PathItem
                    label="Carrera"
                    value={profileData.careerName}
                    icon="briefcase-outline"
                />
            </View>

            <Text style={[styles.sectionLabel, { marginTop: 15 }]}>Mis Materias Actuales:</Text>
            {sections.length > 0 ? (
                sections.map((section) => (
                    <View key={section.sectionId}>
                        {section.subjects
                            .filter((s: any) => profileData.subjects.includes(s.id))
                            .map((subject: any) => (
                                <View key={subject.id} style={styles.subjectDisplay}>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <Ionicons
                                            name="book-outline"
                                            size={18}
                                            color={UCaldasTheme.azulOscuro}
                                            style={{ marginRight: 10 }}
                                        />
                                        <Text style={styles.subjectText}>{subject.name}</Text>
                                    </View>
                                </View>
                            ))}
                    </View>
                ))
            ) : (
                <Text style={styles.emptyText}>No hay materias seleccionadas.</Text>
            )}
        </View>
    );
}

const PathItem = ({ label, value, icon }: { label: string, value: string, icon: any }) => (
    <View style={readStyles.pathItem}>
        <Ionicons name={icon} size={20} color={UCaldasTheme.dorado} style={{ marginRight: 12 }} />
        <View>
            <Text style={readStyles.pathLabel}>{label}</Text>
            <Text style={readStyles.pathValue}>{value || "No especificado"}</Text>
        </View>
    </View>
);

const readStyles = StyleSheet.create({
    pathContainer: {
        marginTop: 5,
        marginBottom: 10,
    },
    pathItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    pathLabel: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    pathValue: {
        fontSize: 15,
        color: UCaldasTheme.azulOscuro,
        fontWeight: '600',
    }
});
