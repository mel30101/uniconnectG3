import { Collapsible } from "@/src/presentation/components/common/Collapsible";
import { useProfile } from "@/src/presentation/hooks/useProfile";
import { authStore } from '@uniconnect/shared';
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { UCaldasTheme } from "../constants/Colors";
import { profileStyles as styles } from "@/src/presentation/components/profile/ProfileStyles";
import { ProfileInfoRead } from "@/src/presentation/components/profile/ProfileInfoRead";
import { ProfileAcademicRead } from "@/src/presentation/components/profile/ProfileAcademicRead";
import { ProfileInfoEdit } from "@/src/presentation/components/profile/ProfileInfoEdit";
import { ProfileAcademicEdit } from "@/src/presentation/components/profile/ProfileAcademicEdit";
import { ProfileEnrichedView } from "@/src/presentation/components/profile/ProfileEnrichedView";

export default function ProfileScreen() {
  const logout = authStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  const {
    user,
    loading,
    saving,
    fetchingStructure,
    isEditing,
    setIsEditing,
    hasProfile,
    careers,
    sections,
    profileData,
    setProfileData,
    updateCareer,
    saveProfile,
    isFullView,
    loadingFull,
    fetchFullProfile,
  } = useProfile();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={UCaldasTheme.azulOscuro} />
        <Text style={styles.loadingText}>
          Sincronizando con la U de Caldas...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {hasProfile && !isEditing ? (
        /* --- VISTA DE PERFIL (SOLO LECTURA) --- */
        <View style={styles.content}>
          <View style={styles.transparentHeader}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{user?.name?.charAt(0)}</Text>
            </View>
            <Text style={styles.mainTitle}>{user?.name}</Text>
            <Text style={styles.careerBadge}>
              {careers.find((c: any) => c.id === profileData.careerId)?.name ||
                "Carrera no asignada"}
            </Text>
          </View>

          <ProfileInfoRead
            user={user}
            profileData={profileData}
            careers={careers}
          />

          <ProfileAcademicRead
            profileData={profileData}
            sections={sections}
          />

          {!isFullView ? (
            <TouchableOpacity
              style={[styles.editButton, { backgroundColor: UCaldasTheme.dorado, marginTop: 10 }]}
              onPress={fetchFullProfile}
              disabled={loadingFull}
            >
              {loadingFull ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="stats-chart-outline" size={20} color="#fff" style={{ marginRight: 10 }} />
                  <Text style={styles.editButtonText}>Ver vista completa</Text>
                </>
              )}
            </TouchableOpacity>
          ) : (
            <ProfileEnrichedView
              estadisticas={profileData.estadisticas}
              insignias={profileData.insignias}
            />
          )}

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Ionicons
              name="create-outline"
              size={20}
              color="#fff"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.editButtonText}>Actualizar Datos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: '#d32f2f', marginTop: 10 }]}
            onPress={handleLogout}
          >
            <Ionicons
              name="log-out-outline"
              size={20}
              color="#fff"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.editButtonText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* --- VISTA DE FORMULARIO (EDICIÓN / REGISTRO) --- */
        <View style={styles.content}>
          {!hasProfile && (
            <View style={{ marginBottom: 20, alignItems: 'center' }}>
              <Ionicons name="person-add-outline" size={40} color={UCaldasTheme.dorado} />
              <Text style={[styles.mainTitle, { marginTop: 10 }]}>Configura tu perfil</Text>
              <Text style={{ color: '#666', textAlign: 'center', marginTop: 5, paddingHorizontal: 20 }}>
                Completa tu información para empezar a conectar con la comunidad U de Caldas.
              </Text>
            </View>
          )}

          <Collapsible title="Editar Información Personal">
            <View style={{ paddingTop: 10 }}>
              <ProfileInfoEdit
                user={user}
                profileData={profileData}
                setProfileData={setProfileData}
              />
            </View>
          </Collapsible>

          <Collapsible title="Editar Información Académica">
            <View style={{ paddingTop: 10 }}>
              <ProfileAcademicEdit
                profileData={profileData}
                setProfileData={setProfileData}
                careers={careers}
                updateCareer={updateCareer}
                sections={sections}
                fetchingStructure={fetchingStructure}
              />
            </View>
          </Collapsible>

          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={saveProfile}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color={UCaldasTheme.azulOscuro} />
            ) : (
              <Text style={styles.saveText}>
                {hasProfile ? "Guardar Cambios" : "Finalizar Registro"}
              </Text>
            )}
          </TouchableOpacity>

          {hasProfile && (
            <TouchableOpacity
              style={styles.cancelLink}
              onPress={() => setIsEditing(false)}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </ScrollView>
  );
}