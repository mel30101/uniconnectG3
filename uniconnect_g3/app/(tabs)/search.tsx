import { GroupCard } from "@/src/presentation/components/groups/GroupCard";
import { FilterSection } from "@/src/presentation/components/search/FilterSection";
import { useGroups } from "@/src/presentation/hooks/useGroups";
import { useSearchGroups } from "@/src/presentation/hooks/useSearchGroups";
import { authStore } from '@uniconnect/shared';
import { UCaldasTheme } from "../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from "react-native";

export default function SearchScreen() {
    const { user } = authStore();
    const { userSubjects } = useGroups();
    const { groups, loading, performSearch, resetResults } = useSearchGroups();

    const [search, setSearch] = useState("");
    const [selectedMateria, setSelectedMateria] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const isSelectingFromDropdown = useRef(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const sections = useMemo(() => [
        {
            sectionId: "enrolled",
            sectionName: "Mis Materias Actuales",
            subjects: userSubjects
        }
    ], [userSubjects]);

    // Carga inicial de todos los grupos de las materias del usuario
    useEffect(() => {
        if (user?.uid && isInitialLoad) {
            performSearch("", undefined, user?.subjects);
            setIsInitialLoad(false);
        }
    }, [user?.uid, isInitialLoad, user?.subjects]);

    useEffect(() => {
        if (isSelectingFromDropdown.current) {
            isSelectingFromDropdown.current = false;
            return;
        }

        if (search.length >= 3) {
            setShowDropdown(true);
            performSearch(search, selectedMateria || undefined, user?.subjects);
        } else if (search.length === 0 && !selectedMateria) {
            setShowDropdown(false);
            performSearch("", undefined, user?.subjects);
            setHasSearched(false);
        } else {
            setShowDropdown(false);
        }
    }, [search, selectedMateria, user?.subjects]);

    const sortedGroups = useMemo(() => {
        return [...groups]
            .filter(g => g.creatorId !== user?.uid) // Ya lo hace el backend, pero por seguridad
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [groups, user?.uid]);

    const handleSearch = (term?: string) => {
        const finalTerm = term !== undefined ? term : search;

        if (finalTerm.trim() === "" && !selectedMateria) {
            setSearch("");
            resetResults();
            setHasSearched(false);
            setShowDropdown(false);
            return;
        }

        if (term !== undefined) {
            isSelectingFromDropdown.current = true;
        }

        setSearch(finalTerm);
        setShowDropdown(false);
        setShowFilters(false);
        setHasSearched(true);
        performSearch(finalTerm, selectedMateria || undefined, user?.subjects);
    };

    const clearFilters = () => {
        setSearch("");
        setSelectedMateria(null);
        resetResults();
        setHasSearched(false);
        setShowFilters(true);
    };

    const toggleMateria = (id: string) => {
        setSelectedMateria(prev => prev === id ? null : id);
        if (!selectedMateria) setHasSearched(true);
    };

    const checkMatch = (text: string, query: string) => {
        if (!text || !query) return false;
        const searchLower = query.toLowerCase();
        const searchTerms = searchLower.split(' ').filter(t => t.length > 0);
        const words = text.toLowerCase().split(' ');

        return searchTerms.every(term =>
            words.some(word => word.startsWith(term))
        );
    };

    const groupResults = useMemo(() => {
        return groups.filter(g => checkMatch(g.name, search)).slice(0, 5);
    }, [groups, search]);

    const subjectResults = useMemo(() => {
        const seen = new Set();
        return groups.filter(g => {
            const matches = checkMatch(g.subjectName || '', search);
            if (matches && !seen.has(g.subjectId)) {
                seen.add(g.subjectId);
                return true;
            }
            return false;
        }).slice(0, 5);
    }, [groups, search]);

    return (
        <View style={styles.container}>
            <View style={styles.topRow}>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#9ca3af" />
                    <TextInput
                        placeholder="Buscar por grupo o materia..."
                        value={search}
                        onChangeText={setSearch}
                        placeholderTextColor="#9ca3af"
                        onSubmitEditing={() => handleSearch()}
                        style={styles.input}
                    />
                    {search.length > 0 && (
                        <TouchableOpacity onPress={() => setSearch("")}>
                            <Ionicons name="close-circle" size={20} color="#9ca3af" style={{ marginRight: 5 }} />
                        </TouchableOpacity>
                    )}
                </View>

                <TouchableOpacity
                    style={[styles.filterIconBtn, showFilters && styles.filterIconBtnActive]}
                    onPress={() => setShowFilters(!showFilters)}
                >
                    <Ionicons
                        name="options-outline"
                        size={24}
                        color={showFilters ? "#fff" : UCaldasTheme.azulOscuro}
                    />
                </TouchableOpacity>
            </View>

            {showDropdown && (groupResults.length > 0 || subjectResults.length > 0) && (
                <View style={styles.dropdown}>
                    <ScrollView keyboardShouldPersistTaps="handled">
                        {groupResults.length > 0 && (
                            <View>
                                <Text style={styles.dropdownHeader}>Nombres de Grupo</Text>
                                {groupResults.map(g => (
                                    <TouchableOpacity
                                        key={`g-${g.id}`}
                                        style={styles.dropdownItem}
                                        onPress={() => handleSearch(g.name)}
                                    >
                                        <Ionicons name="people-outline" size={16} color="#6b7280" />
                                        <Text style={styles.dropdownText}>{g.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                        {subjectResults.length > 0 && (
                            <View>
                                <Text style={styles.dropdownHeader}>Grupos por Materia</Text>
                                {subjectResults.map(g => (
                                    <TouchableOpacity
                                        key={`s-${g.subjectId}`}
                                        style={styles.dropdownItem}
                                        onPress={() => handleSearch(g.subjectName || '')}
                                    >
                                        <Ionicons name="book-outline" size={16} color="#6b7280" />
                                        <Text style={styles.dropdownText}>{g.subjectName}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </ScrollView>
                </View>
            )}

            {showFilters && (
                <FilterSection
                    sections={sections}
                    selectedMaterias={selectedMateria ? [selectedMateria] : []}
                    onToggleMateria={toggleMateria}
                    onApply={() => handleSearch()}
                    onClear={clearFilters}
                    loading={loading}
                    showClear={!!(search || selectedMateria)}
                />
            )}

            <FlatList
                data={sortedGroups}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <GroupCard group={{
                    ...item,
                    subjectName: item.subjectName ?? "Sin materia" 
                }} isAdmin={false} />}
                contentContainerStyle={{ paddingTop: 10, paddingBottom: 30 }}
                ListEmptyComponent={!loading ? (
                    <View style={styles.emptyContainer}>
                        {hasSearched ? (
                            <>
                                <Ionicons name="alert-circle-outline" size={80} color="#d1d5db" />
                                <Text style={styles.emptyTitle}>Sin resultados</Text>
                                <Text style={styles.emptySubtitle}>
                                    No encontramos grupos que coincidan con "{search || "la materia seleccionada"}".
                                </Text>
                            </>
                        ) : (
                            <>
                                <Ionicons name="people-circle-outline" size={80} color="#d1d5db" />
                                <Text style={styles.emptyTitle}>Encuentra Grupos de Estudio</Text>
                                <Text style={styles.emptySubtitle}>
                                    Busca por nombre de grupo o materia para unirte a una comunidad.
                                </Text>
                            </>
                        )}
                    </View>
                ) : (
                    <View style={{ marginTop: 20 }}>
                        <ActivityIndicator size="large" color={UCaldasTheme.azulOscuro} />
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#f4f6f8" },
    topRow: { flexDirection: "row", alignItems: "center", marginBottom: 15, gap: 12, marginTop: 40 },
    searchContainer: {
        flex: 1, flexDirection: "row", alignItems: "center",
        backgroundColor: "#fff", borderRadius: 12, paddingHorizontal: 12, height: 50, elevation: 2,
        shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3
    },
    filterIconBtn: {
        backgroundColor: "#fff", width: 50, height: 50,
        borderRadius: 12, justifyContent: "center", alignItems: "center", elevation: 2
    },
    filterIconBtnActive: { backgroundColor: UCaldasTheme.azulOscuro },
    input: { flex: 1, marginLeft: 8, fontSize: 16, color: "#1f2937" },
    emptyContainer: { alignItems: "center", marginTop: 60, paddingHorizontal: 20 },
    emptyTitle: { fontSize: 18, fontWeight: "bold", marginTop: 15, color: "#374151" },
    emptySubtitle: { fontSize: 14, color: "#6b7280", marginTop: 5, textAlign: "center" },
    dropdown: {
        position: 'absolute', top: 105, left: 16, right: 16,
        backgroundColor: '#fff', borderRadius: 12, elevation: 5,
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2, shadowRadius: 5, zIndex: 1000, maxHeight: 300, padding: 8
    },
    dropdownHeader: {
        fontSize: 12, fontWeight: 'bold', color: '#9ca3af',
        textTransform: 'uppercase', paddingHorizontal: 12, paddingVertical: 8,
        borderBottomWidth: 1, borderBottomColor: '#f3f4f6'
    },
    dropdownItem: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: 12, paddingHorizontal: 12, gap: 10
    },
    dropdownText: { fontSize: 15, color: '#374151' }
});