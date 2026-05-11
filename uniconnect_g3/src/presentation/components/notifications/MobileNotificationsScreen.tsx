import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useNotificationContext } from '../../context/NotificationContext';
import { authStore } from '@uniconnect/shared';
import { respondToAdminTransfer } from '../../../di/container';
import { UCaldasTheme } from '@/app/constants/Colors';
import { styles } from './MobileNotificationsScreenStyles';

// --- Helpers ---
function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return 'hace un momento';
  if (diffMin < 60) return `hace ${diffMin} min`;
  if (diffHr < 24) return `hace ${diffHr}h`;
  if (diffDay < 7) return `hace ${diffDay}d`;
  return date.toLocaleDateString('es');
}

const TYPE_CONFIG: Record<string, { icon: keyof typeof Ionicons.glyphMap; color: string; label: string }> = {
  join_request: { icon: 'person-add', color: '#0056b3', label: 'Solicitud de Ingreso' },
  new_member: { icon: 'checkmark-circle', color: '#28a745', label: 'Nuevo Miembro' },
  admin_transfer: { icon: 'alert-circle', color: UCaldasTheme.dorado, label: 'Transferencia Admin' },
  request_rejected: { icon: 'close-circle', color: '#dc3545', label: 'Solicitud Rechazada' },
  admin_transfer_rejected: { icon: 'close-circle', color: '#dc3545', label: 'Transferencia Rechazada' },
  admin_transfer_accepted: { icon: 'checkmark-circle', color: '#28a745', label: 'Transferencia Aceptada' },
  new_event: { icon: 'calendar', color: '#9b59b6', label: 'Nuevo Evento' },
};

const getConfig = (type: string) =>
  TYPE_CONFIG[type] || { icon: 'notifications' as keyof typeof Ionicons.glyphMap, color: '#666', label: 'Notificación' };

// --- Componente Principal ---
export function MobileNotificationsScreen() {
  const router = useRouter();
  const user = authStore((s) => s.user);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useNotificationContext();

  const handlePress = (notif: any) => {
    markAsRead(notif.id);
    const groupId = notif.data?.groupId;
    if (notif.type === 'join_request' || notif.type === 'admin_transfer_rejected') {
      router.push(`/group/${groupId}/admin` as any);
    } else if (['new_member', 'admin_transfer_accepted', 'admin_assigned'].includes(notif.type)) {
      router.push(`/group/${groupId}` as any);
    } else if (notif.type === 'new_event') {
      router.push('/(tabs)/home' as any);
    }
  };

  const handleAdminTransfer = async (notif: any, action: 'accept' | 'reject') => {
    if (!user?.uid || !notif.data?.groupId) return;
    try {
      await respondToAdminTransfer.execute(notif.data.groupId, user.uid, action);
      removeNotification(notif.id);
    } catch (error) {
      console.error('Error respondiendo transferencia:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Notificaciones</Text>
          <Text style={styles.headerSub}>
            {unreadCount > 0 ? `${unreadCount} sin leer` : 'Todo al día'}
          </Text>
        </View>
        {notifications.length > 0 && (
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={markAllAsRead} style={styles.headerBtn}>
              <Ionicons name="checkmark-done" size={18} color={UCaldasTheme.azulOscuro} />
              <Text style={styles.headerBtnText}>Leer todo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={clearAll} style={styles.headerBtnDanger}>
              <Ionicons name="trash-outline" size={18} color="#dc3545" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Lista */}
      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="notifications-off-outline" size={48} color="#ccc" />
            </View>
            <Text style={styles.emptyTitle}>Sin notificaciones</Text>
            <Text style={styles.emptyText}>
              Cuando recibas solicitudes de ingreso, transferencias u otras actualizaciones, aparecerán aquí.
            </Text>
          </View>
        ) : (
          notifications.map((notif) => {
            const cfg = getConfig(notif.type || 'default');
            return (
              <TouchableOpacity
                key={notif.id}
                style={[styles.notifCard, !notif.read && styles.notifCardUnread]}
                onPress={() => handlePress(notif)}
                activeOpacity={0.7}
              >
                <View style={[styles.iconCircle, { backgroundColor: cfg.color + '15' }]}>
                  <Ionicons name={cfg.icon} size={22} color={cfg.color} />
                </View>

                <View style={styles.notifContent}>
                  <View style={styles.notifTopRow}>
                    <Text style={[styles.notifLabel, { color: cfg.color }]}>{cfg.label}</Text>
                    <Text style={styles.notifTime}>{timeAgo(notif.timestamp || '')}</Text>
                  </View>
                  <Text
                    style={[styles.notifMessage, !notif.read && styles.notifMessageUnread]}
                    numberOfLines={3}
                  >
                    {notif.message}
                  </Text>

                  {notif.type === 'admin_transfer' && (
                    <View style={styles.actionRow}>
                      <TouchableOpacity style={styles.acceptBtn} onPress={() => handleAdminTransfer(notif, 'accept')}>
                        <Ionicons name="checkmark" size={16} color="#fff" />
                        <Text style={styles.actionBtnText}>Aceptar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.rejectBtn} onPress={() => handleAdminTransfer(notif, 'reject')}>
                        <Ionicons name="close" size={16} color="#fff" />
                        <Text style={styles.actionBtnText}>Rechazar</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                {!notif.read && <View style={styles.unreadDot} />}
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
