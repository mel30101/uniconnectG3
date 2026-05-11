import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Modal, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { UCaldasTheme } from '../../../../app/constants/Colors';
import { styles } from './GroupDetailStyles';

export const AddMemberModal = ({ visible, onClose, group, availableStudents, performSearch, addMemberToGroup }: any) => {
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (visible && group?.subjectId) {
            performSearch("", [group.subjectId]);
        }
    }, [visible, group?.subjectId]);

    return (
        <Modal visible={visible} animationType="slide">
            <SafeAreaView style={{ flex: 1, padding: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close" size={28} color={UCaldasTheme.azulOscuro} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 15 }}>Buscar Compañeros</Text>
                </View>

                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar por nombre..."
                    value={searchQuery}
                    onChangeText={(text) => {
                        setSearchQuery(text);
                        performSearch(text, [group.subjectId]);
                    }}
                />

                <FlatList
                    data={availableStudents}
                    keyExtractor={(item) => item.uid}
                    renderItem={({ item }) => {
                        const isAlreadyInGroup = group?.members?.some((m: any) => m.id === item.uid);
                        return (
                            <View style={[styles.memberItem, { opacity: isAlreadyInGroup ? 0.6 : 1 }]}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontWeight: '600', fontSize: 16 }}>{item.name}</Text>
                                    {isAlreadyInGroup && (
                                        <Text style={{ color: '#666', fontSize: 12, fontStyle: 'italic' }}>Ya es miembro</Text>
                                    )}
                                </View>
                                <TouchableOpacity
                                    disabled={isAlreadyInGroup}
                                    onPress={async () => {
                                        const success = await addMemberToGroup(item.uid);
                                        if (success) {
                                            Alert.alert("Éxito", "Estudiante añadido");
                                            onClose();
                                        }
                                    }}
                                    style={{
                                        backgroundColor: isAlreadyInGroup ? '#BDBDBD' : UCaldasTheme.azulOscuro,
                                        paddingVertical: 8, paddingHorizontal: 15, borderRadius: 5
                                    }}
                                >
                                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                                        {isAlreadyInGroup ? "Miembro" : "Añadir"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        );
                    }}
                />
            </SafeAreaView>
        </Modal>
    );
};