import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { Collapsible } from "../common/Collapsible";
import { UCaldasTheme } from "@/app/constants/Colors";
import { profileStyles as styles } from "./ProfileStyles";

import { AcademicHierarchySelector } from "./AcademicHierarchySelector";

interface ProfileAcademicEditProps {
    profileData: any;
    setProfileData: (data: any) => void;
    careers: any[];
    updateCareer: (id: string) => void;
    sections: any[];
    fetchingStructure?: boolean;
}

export function ProfileAcademicEdit({
    profileData,
    setProfileData,
    careers,
    updateCareer,
    sections,
    fetchingStructure,
}: ProfileAcademicEditProps) {
    return (
        <>
            <AcademicHierarchySelector
                profileData={profileData}
                setProfileData={setProfileData}
                updateCareer={updateCareer}
            />
            
            {fetchingStructure && (
                <View style={styles.fetchingContainer}>
                    <ActivityIndicator size="small" color={UCaldasTheme.dorado} />
                    <Text style={{ color: UCaldasTheme.grisTexto, marginTop: 10 }}>
                        Cargando materias...
                    </Text>
                </View>
            )}

            {fetchingStructure ? (
                <View style={styles.fetchingContainer}>
                    <ActivityIndicator size="large" color={UCaldasTheme.dorado} />
                    <Text style={{ color: UCaldasTheme.grisTexto, marginTop: 10 }}>
                        Cargando estructura académica...
                    </Text>
                </View>
            ) : (
                <>
                    <Text style={styles.sectionLabel}>Selecciona tus materias:</Text>
                    {sections.map((section) => (
                        <View key={section.sectionId} style={{ marginBottom: 10 }}>
                            <Collapsible title={section.sectionName}>
                                <View style={{ paddingVertical: 10 }}>
                                    {section.subjects.map((subject: any) => (
                                        <TouchableOpacity
                                            key={subject.id}
                                            style={[
                                                styles.subjectItem,
                                                profileData.subjects.includes(subject.id) && styles.selected,
                                            ]}
                                            onPress={() => {
                                                const isSelected = profileData.subjects.includes(subject.id);
                                                const newSubjects = isSelected
                                                    ? profileData.subjects.filter((id: string) => id !== subject.id)
                                                    : [...profileData.subjects, subject.id];
                                                setProfileData({
                                                    ...profileData,
                                                    subjects: newSubjects,
                                                });
                                            }}
                                        >
                                            <View style={{ flex: 1, marginRight: 10 }}>
                                                <Text
                                                    style={[
                                                        styles.subjectText,
                                                        profileData.subjects.includes(subject.id) && { color: '#fff' }
                                                    ]}
                                                >
                                                    {subject.name}
                                                </Text>
                                            </View>
                                            {profileData.subjects.includes(subject.id) && (
                                                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </Collapsible>
                        </View>
                    ))}
                </>
            )}
        </>
    );
}
