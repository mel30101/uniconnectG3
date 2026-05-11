import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Collapsible } from '../common/Collapsible';
import { profileStyles as styles } from './ProfileStyles';
import apiClient from '../../../data/sources/ApiClient';

interface SelectorProps {
    label: string;
    value: string;
    onValueChange: (value: string) => void;
    items: { id: string; name: string }[];
    enabled?: boolean;
}

const Selector = ({ label, value, onValueChange, items, enabled = true }: SelectorProps) => {
    const selectedItem = items.find(item => item.id === value);

    return (
        <View style={compStyles.selectorContainer}>
            <Text style={styles.label}>{label}</Text>
            <View style={[styles.card, !enabled && compStyles.disabledCard]}>
                <Collapsible
                    title={selectedItem ? selectedItem.name : `Seleccione ${label}...`}
                    disabled={!enabled}
                >
                    <View style={{ paddingVertical: 10, paddingHorizontal: 15 }}>
                        {items.length === 0 ? (
                            <Text style={styles.emptyText}>No hay opciones disponibles</Text>
                        ) : (
                            items.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[
                                        styles.subjectItem,
                                        value === item.id && styles.selected,
                                    ]}
                                    onPress={() => onValueChange(item.id)}
                                >
                                    <Text
                                        style={
                                            value === item.id
                                                ? styles.whiteText
                                                : styles.blackText
                                        }
                                    >
                                        {item.name}
                                    </Text>
                                    {value === item.id && (
                                        <Ionicons name="checkmark-circle" size={20} color="#fff" />
                                    )}
                                </TouchableOpacity>
                            ))
                        )}
                    </View>
                </Collapsible>
            </View>
        </View>
    );
};

interface Props {
    profileData: any;
    setProfileData: (data: any) => void;
    updateCareer: (id: string) => void;
}

export const AcademicHierarchySelector = ({ profileData, setProfileData, updateCareer }: Props) => {
    const [faculties, setFaculties] = useState<{ id: string; name: string }[]>([]);
    const [academicLevels, setAcademicLevels] = useState<{ id: string; name: string }[]>([]);
    const [formationLevels, setFormationLevels] = useState<{ id: string; name: string }[]>([]);
    const [careers, setCareers] = useState<{ id: string; name: string }[]>([]);

    // Load faculties on mount
    useEffect(() => {
        apiClient.get<{ id: string; name: string }[]>('/api/hierarchy/faculties')
            .then((res: any) => setFaculties(res.data))
            .catch(console.error);
    }, []);

    // Load levels when faculty changes
    useEffect(() => {
        if (profileData.facultyId) {
            apiClient.get<{ id: string; name: string }[]>(`/api/hierarchy/academic-levels/${profileData.facultyId}`)
                .then((res: any) => setAcademicLevels(res.data))
                .catch(console.error);
        } else {
            setAcademicLevels([]);
        }
    }, [profileData.facultyId]);

    // Load formation levels when academic level changes
    useEffect(() => {
        if (profileData.facultyId && profileData.academicLevelId) {
            apiClient.get<{ id: string; name: string }[]>(`/api/hierarchy/formation-levels/${profileData.facultyId}/${profileData.academicLevelId}`)
                .then((res: any) => setFormationLevels(res.data))
                .catch(console.error);
        } else {
            setFormationLevels([]);
        }
    }, [profileData.facultyId, profileData.academicLevelId]);

    // Load careers when formation level changes
    useEffect(() => {
        if (profileData.facultyId && profileData.academicLevelId && profileData.formationLevelId) {
            apiClient.get<{ id: string; name: string }[]>(`/api/hierarchy/careers-by-path/${profileData.facultyId}/${profileData.academicLevelId}/${profileData.formationLevelId}`)
                .then((res: any) => setCareers(res.data))
                .catch(console.error);
        } else {
            setCareers([]);
        }
    }, [profileData.facultyId, profileData.academicLevelId, profileData.formationLevelId]);

    const handleFacultyChange = (id: string) => {
        setProfileData((prev: any) => ({
            ...prev,
            facultyId: id,
            academicLevelId: "",
            formationLevelId: "",
            careerId: "",
            subjects: []
        }));
    };

    const handleAcademicLevelChange = (id: string) => {
        setProfileData((prev: any) => ({
            ...prev,
            academicLevelId: id,
            formationLevelId: "",
            careerId: "",
            subjects: []
        }));
    };

    const handleFormationLevelChange = (id: string) => {
        setProfileData((prev: any) => ({
            ...prev,
            formationLevelId: id,
            careerId: "",
            subjects: []
        }));
    };

    const handleCareerChange = (id: string) => {
        updateCareer(id);
    };

    return (
        <View style={compStyles.container}>
            <Selector
                label="Facultad"
                value={profileData.facultyId}
                onValueChange={handleFacultyChange}
                items={faculties}
            />
            <Selector
                label="Nivel Académico"
                value={profileData.academicLevelId}
                onValueChange={handleAcademicLevelChange}
                items={academicLevels}
                enabled={!!profileData.facultyId}
            />
            <Selector
                label="Nivel de Formación"
                value={profileData.formationLevelId}
                onValueChange={handleFormationLevelChange}
                items={formationLevels}
                enabled={!!profileData.academicLevelId}
            />
            <Selector
                label="Carrera"
                value={profileData.careerId}
                onValueChange={handleCareerChange}
                items={careers}
                enabled={!!profileData.formationLevelId}
            />
        </View>
    );
};

const compStyles = StyleSheet.create({
    container: {
        padding: 5,
    },
    selectorContainer: {
        width: '100%',
        marginBottom: 10,
    },
    disabledCard: {
        backgroundColor: '#f5f5f5',
        opacity: 0.6,
        borderColor: '#eee',
    }
});
