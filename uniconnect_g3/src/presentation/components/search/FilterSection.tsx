import UCaldasTheme from "@/app/constants/Colors";
import { Collapsible } from "../common/Collapsible";
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FilterSectionProps {
    sections: any[];
    selectedMaterias: string[];
    onToggleMateria: (id: string) => void;
    onApply: () => void;
    onClear: () => void;
    loading: boolean;
    showClear: boolean;
}

export const FilterSection = ({
    sections,
    selectedMaterias,
    onToggleMateria,
    onApply,
    onClear,
    loading,
    showClear
}: FilterSectionProps) => {
    return (
        <View style={styles.filtersWrapper}>
            <View style={styles.filterCard}>
                <View style={styles.filterHeader}>
                    <Text style={styles.filterTitle}>Filtros</Text>
                    {selectedMaterias.length > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>
                                {selectedMaterias.length}
                            </Text>
                        </View>
                    )}
                </View>

                <Text style={styles.sectionLabel}>Secciones y Materias</Text>
                <View style={styles.sectionsContainer}>
                    {sections.map((section) => (
                        <Collapsible key={section.sectionId} title={section.sectionName}>
                            <View style={styles.chipsContainer}>
                                {section.subjects.map((subject: any) => (
                                    <TouchableOpacity
                                        key={subject.id}
                                        onPress={() => onToggleMateria(subject.id)}
                                        style={[
                                            styles.chip,
                                            selectedMaterias.includes(subject.id) && styles.chipActive,
                                        ]}
                                    >
                                        <Text style={[
                                            styles.chipText,
                                            selectedMaterias.includes(subject.id) && styles.chipTextActive,
                                        ]}>
                                            {subject.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </Collapsible>
                    ))}
                </View>
            </View>

            <TouchableOpacity
                onPress={onApply}
                style={[styles.searchButton, loading && { opacity: 0.7 }]}
                disabled={loading}
            >
                <Text style={styles.searchButtonText}>
                    {loading ? "Buscando..." : "Aplicar Filtros y Buscar"}
                </Text>
            </TouchableOpacity>

            {showClear && (
                <TouchableOpacity onPress={onClear}>
                    <Text style={styles.clearText}>Limpiar filtros</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f4f6f8",
    },

    filtersWrapper: {
        marginBottom: 10,
    },

    searchButton: {
        backgroundColor: UCaldasTheme.azulOscuro,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
    },

    searchButtonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },

    clearText: {
        color: "#374151",
        textAlign: "center",
        marginTop: 12,
        fontWeight: "600",
    },

    chip: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        backgroundColor: "#e5e7eb",
        borderRadius: 20,
    },

    chipActive: {
        backgroundColor: UCaldasTheme.azulOscuro,
    },

    chipText: {
        fontSize: 14,
        color: "#333",
    },

    chipTextActive: {
        color: "#ffffff",
        fontWeight: "600",
    },

    filterCard: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#b0b0b0",
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
    },

    filterHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },

    filterTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111827",
    },

    badge: {
        backgroundColor: UCaldasTheme.azulOscuro,
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },

    badgeText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },

    sectionLabel: {
        fontSize: 13,
        fontWeight: "600",
        color: "#6b7280",
        marginBottom: 8,
    },

    switchRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 15,
    },

    sectionsContainer: {
        marginTop: 5,
        marginBottom: 15,
        gap: 10,
    },

    chipsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        paddingVertical: 10,
    },
});