import React from 'react';
import { View, Text, StyleSheet, Image, Platform } from 'react-native';
import { Event } from '@/src/domain/entities/Event';

interface EventCardProps {
  event: Event;
}

const TYPE_COLORS: Record<string, string> = {
  cultural: '#FF9800',
  deportivo: '#4CAF50',
  académico: '#2196F3',
  social: '#E91E63',
};

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-ES', options);
  };

  const badgeColor = TYPE_COLORS[(event.type || '').toLowerCase()] || '#999';

  return (
    <View style={styles.cardContainer}>
      {event.imageUrl && (
        <Image
          source={{ uri: event.imageUrl }}
          style={styles.eventImage}
          resizeMode="cover"
        />
      )}

      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <View style={[styles.typeBadge, { backgroundColor: badgeColor }]}>
            <Text style={styles.typeText}>{event.type || 'General'}</Text>
          </View>
          <Text style={styles.eventTitle} numberOfLines={2}>{event.title}</Text>
        </View>

        <View style={styles.detailsRow}>
          {event.date && <Text style={styles.detailText}>📅 {formatDate(event.date)}</Text>}
          <Text style={styles.detailText}>🕒 {event.time} ({event.duration})</Text>
        </View>

        <View style={styles.locationContainer}>
          <Text style={styles.locationText}>📍 {event.location}</Text>
        </View>

        <Text style={styles.descriptionText} numberOfLines={3}>
          {event.description}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 4 },
    }),
  },
  eventImage: { width: '100%', height: 150 },
  contentContainer: { padding: 16 },
  headerRow: { marginBottom: 10 },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  typeText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  eventTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A', lineHeight: 26 },
  detailsRow: { marginBottom: 8, gap: 4 },
  detailText: { fontSize: 14, color: '#555555', fontWeight: '500' },
  locationContainer: { backgroundColor: '#F0F0F0', padding: 8, borderRadius: 6, marginBottom: 12 },
  locationText: { fontSize: 14, color: '#333333', fontWeight: '600' },
  descriptionText: { fontSize: 14, color: '#666666', lineHeight: 20, fontStyle: 'italic' },
});