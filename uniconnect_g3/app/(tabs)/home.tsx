import React, { useEffect, useState, useMemo } from 'react';
import { ActivityIndicator, SectionList, Image, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { EventCard } from '@/src/presentation/components/common/EventCard';
import { authStore } from '@uniconnect/shared';
import { UCaldasTheme } from '../constants/Colors';
import { Event } from '@/src/domain/entities/Event';
import { useEvents } from '@/src/presentation/hooks/useEvents';
import { Ionicons } from '@expo/vector-icons';

export default function WelcomeScreen() {
  const user = authStore((state) => state.user);
  const userName = user?.name;
  const {
    events,
    categories,
    subscribedCategoryIds,
    loading,
    loadingCategories,
    submittingSubscription,
    fetchEvents,
    toggleSubscription
  } = useEvents();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const categoryMap = useMemo(() => {
    const map: { [key: string]: string } = {};
    categories.forEach(cat => {
      map[cat.name] = cat.id;
    });
    return map;
  }, [categories]);

  const handleCategorySelect = (categoryId: string) => {
    const newCategory = selectedCategoryId === categoryId ? null : categoryId;
    setSelectedCategoryId(newCategory);
    fetchEvents(newCategory || undefined);
  };

  // Transformar eventos en secciones organizadas por categoría
  const sections = useMemo(() => {
    const groups: { [key: string]: Event[] } = {};

    events.forEach(event => {
      const eventType = event.type || 'General';
      if (!groups[eventType]) {
        groups[eventType] = [];
      }
      groups[eventType].push(event);
    });

    return Object.keys(groups).map(categoryName => ({
      title: categoryName,
      data: groups[categoryName]
    })).sort((a, b) => a.title.localeCompare(b.title));
  }, [events]);

  const renderEventItem = ({ item }: { item: Event }) => (
    <EventCard event={item} />
  );

  const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => {
    const categoryId = categoryMap[title];
    const isSubscribedToThis = categoryId ? subscribedCategoryIds.includes(categoryId) : false;

    return (
      <View style={styles.sectionHeaderContainer}>
        <View style={styles.sectionHeaderTitleWrapper}>
          <View style={styles.sectionHeaderDot} />
          <Text style={styles.sectionHeaderText}>{title}</Text>
        </View>
        {categoryId && (
          <TouchableOpacity
            style={[
              styles.subscribeButtonInHeader,
              isSubscribedToThis && styles.unsubscribeButtonInHeader
            ]}
            onPress={() => toggleSubscription(categoryId)}
            disabled={submittingSubscription}
          >
            <Ionicons
              name={isSubscribedToThis ? "notifications-off" : "notifications"}
              size={14}
              color={UCaldasTheme.dorado}
            />
            <Text style={[
              styles.subscribeButtonTextInHeader,
              isSubscribedToThis && styles.unsubscribeButtonTextInHeader
            ]}>
              {isSubscribedToThis ? 'Anular' : 'Suscribirse'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderCategoryItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        selectedCategoryId === item.id && styles.categoryChipSelected
      ]}
      onPress={() => handleCategorySelect(item.id)}
    >
      <Text style={[
        styles.categoryText,
        selectedCategoryId === item.id && styles.categoryTextSelected
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        <View style={styles.originalHeader}>
          {events.length === 0 && !loading && (
            <Image
              source={{ uri: 'https://vectorseek.com/wp-content/uploads/2023/09/Universidad-de-Caldas-Logo-Vector.svg-.png' }}
              style={{ width: 100, height: 100, marginBottom: 10 }}
            />
          )}
          <Text style={{ color: UCaldasTheme.azulOscuro, fontWeight: 'bold', fontSize: 24 }}>
            Universidad de Caldas
          </Text>
          <Text style={styles.subtitle}>
            Bienvenido a UniConnect,
          </Text>
          <Text style={styles.userName}>{userName || 'Estudiante'}</Text>
        </View>

        <View style={styles.eventsSection}>
          <View style={styles.listHeader}>
            <Text style={styles.eventsTitle}>Explorar Eventos</Text>
            {selectedCategoryId && (
              <TouchableOpacity onPress={() => handleCategorySelect(selectedCategoryId)}>
                <Text style={styles.clearFilterText}>Ver todos</Text>
              </TouchableOpacity>
            )}
          </View>

          {!loadingCategories && categories.length > 0 && (
            <View style={styles.categoriesContainer}>
              <FlatList
                data={categories}
                keyExtractor={(item) => item.id}
                renderItem={renderCategoryItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesList}
              />
            </View>
          )}

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={UCaldasTheme.azulOscuro} />
              <Text style={styles.loadingText}>Cargando eventos...</Text>
            </View>
          ) : (
            <SectionList
              sections={sections}
              keyExtractor={(item) => item.id}
              renderItem={renderEventItem}
              renderSectionHeader={renderSectionHeader}
              stickySectionHeadersEnabled={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="calendar-outline" size={60} color="#ccc" />
                  <Text style={styles.emptyText}>
                    {selectedCategoryId
                      ? 'No hay eventos disponibles en esta categoría.'
                      : 'No hay eventos próximos en este momento.'}
                  </Text>
                </View>
              }
            />
          )}
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 20, paddingTop: 40 },
  originalHeader: { alignItems: 'center', marginBottom: 20 },
  userName: { fontSize: 22, color: '#333', marginVertical: 5, fontWeight: '700' },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center' },
  eventsSection: { flex: 1 },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  eventsTitle: { fontSize: 20, fontWeight: 'bold', color: '#111' },
  clearFilterText: { color: UCaldasTheme.azulOscuro, fontWeight: '600' },
  categoriesContainer: { marginBottom: 15 },
  categoriesList: { paddingRight: 20 },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  categoryChipSelected: {
    backgroundColor: UCaldasTheme.azulOscuro,
    borderColor: UCaldasTheme.azulOscuro,
  },
  categoryText: { color: '#4b5563', fontWeight: '600', fontSize: 13 },
  categoryTextSelected: { color: '#fff', fontWeight: '700' },
  listContent: { paddingBottom: 30 },
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    marginTop: 5,
    gap: 15,
  },
  sectionHeaderTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionHeaderDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: UCaldasTheme.dorado,
    marginRight: 8,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '800',
    color: UCaldasTheme.azulOscuro,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  subscribeButtonInHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: UCaldasTheme.dorado,
    gap: 4
  },
  subscribeButtonTextInHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: UCaldasTheme.dorado,
    textTransform: 'uppercase',
  },
  unsubscribeButtonInHeader: {
    backgroundColor: '#fdfbf7',
    borderColor: UCaldasTheme.dorado,
  },
  unsubscribeButtonTextInHeader: {
    color: UCaldasTheme.dorado,
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#666' },
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyText: { marginTop: 12, color: '#999', textAlign: 'center', fontSize: 16, paddingHorizontal: 40 },
});
;