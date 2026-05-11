import React, { useEffect } from 'react';
import { User, CheckCircle, AlertTriangle, XCircle, X, Calendar } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { AppNotification } from '../../../domain/entities/AppNotification';
import { useNotificationContext } from '../../context/NotificationContext';
import { respondToAdminTransfer } from '../../../di/container';
import { authStore } from '@uniconnect/shared';
import { UCaldasTheme } from '@/app/constants/Colors';

// Importación condicional para evitar errores en Native
let motion: any = View;
let AnimatePresence: any = React.Fragment;

if (Platform.OS === 'web') {
  const fm = require('framer-motion');
  motion = fm.motion;
  AnimatePresence = fm.AnimatePresence;
}

interface ToastProps {
  notification: AppNotification;
}

const NotificationToast: React.FC<ToastProps> = ({ notification }) => {
  const router = useRouter();
  const { removeToast } = useNotificationContext();
  const user = authStore((state) => state.user);

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(notification.id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [notification.id, removeToast]);

  const handleAction = () => {
    if (notification.type === 'join_request' && notification.data?.groupId) {
      router.push(`/group/${notification.data.groupId}/admin` as any);
    } else if (notification.type === 'new_event') {
      router.push('/(tabs)/home' as any);
    } else if (notification.data?.groupId) {
      router.push(`/group/${notification.data.groupId}` as any);
    }
    removeToast(notification.id);
  };

  const handleAdminTransfer = async (action: 'accept' | 'reject') => {
    if (!user?.uid || !notification.data?.groupId) return;
    try {
      await respondToAdminTransfer.execute(notification.data.groupId, user.uid, action);
      removeToast(notification.id);
    } catch (error) {
      console.error("Error responding to admin transfer:", error);
    }
  };

  const config = {
    join_request: {
      borderColor: '#0056b3',
      icon: <User color="#0056b3" size={22} />,
      title: 'Solicitud de Ingreso',
    },
    new_member: {
      borderColor: '#28a745',
      icon: <CheckCircle color="#28a745" size={22} />,
      title: 'Nuevo Miembro',
    },
    admin_transfer: {
      borderColor: UCaldasTheme.dorado,
      icon: <AlertTriangle color={UCaldasTheme.dorado} size={22} />,
      title: 'Transferencia de Administración',
    },
    request_rejected: {
      borderColor: '#dc3545',
      icon: <XCircle color="#dc3545" size={22} />,
      title: 'Solicitud Rechazada',
    },
    admin_transfer_rejected: {
      borderColor: '#dc3545',
      icon: <XCircle color="#dc3545" size={22} />,
      title: 'Transferencia Rechazada',
    },
    new_event: {
      borderColor: '#9b59b6',
      icon: <Calendar color="#9b59b6" size={22} />,
      title: 'Nuevo Evento',
    }
  };

  const typeConfig = config[notification.type as keyof typeof config] || config.join_request;

  const isWeb = Platform.OS === 'web';
  const MotionView = isWeb ? motion.div : View;
  // motion.div (framer-motion) no acepta arrays como style: hay que aplanar.
  const composedStyle = isWeb
    ? StyleSheet.flatten([styles.toastContainer, { borderLeftColor: typeConfig.borderColor }])
    : [styles.toastContainer, { borderLeftColor: typeConfig.borderColor }];

  return (
    <MotionView
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      style={composedStyle}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>{typeConfig.icon}</View>

        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{typeConfig.title}</Text>
          <Text style={styles.message}>{notification.message}</Text>

          <View style={styles.actionRow}>
            {['join_request', 'new_member', 'admin_transfer_accepted', 'admin_assigned', 'new_event'].includes(notification.type || '') && (
              <TouchableOpacity onPress={handleAction} style={styles.primaryButton}>
                <Text style={styles.buttonText}>{notification.type === 'new_event' ? 'Ir al inicio' : (notification.type === 'join_request' ? 'Ver solicitud' : 'Ir al grupo')}</Text>
              </TouchableOpacity>
            )}

            {notification.type === 'admin_transfer' && (
              <>
                <TouchableOpacity onPress={() => handleAdminTransfer('accept')} style={styles.successButton}>
                  <Text style={styles.buttonText}>Aceptar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleAdminTransfer('reject')} style={styles.dangerButton}>
                  <Text style={styles.buttonText}>Rechazar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        <TouchableOpacity onPress={() => removeToast(notification.id)} style={{ padding: 4 }}>
          <X color="#999" size={20} />
        </TouchableOpacity>
      </View>
    </MotionView>
  );
};

export const NotificationStack: React.FC = () => {
  const { toasts } = useNotificationContext();

  if (Platform.OS !== 'web' && toasts.length === 0) return null;

  return (
    <View style={styles.stackContainer}>
      <AnimatePresence mode="popLayout">
        {toasts.map((notification: any) => (
          <NotificationToast key={notification.id} notification={notification} />
        ))}
      </AnimatePresence>
    </View>
  );
};

const styles = StyleSheet.create({
  stackContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 9999,
    width: Platform.OS === 'web' ? 380 : '90%',
    alignItems: 'flex-end',
  },
  toastContainer: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
      } as any
    }),
  },
  content: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#4a4a4a',
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 10,
  },
  primaryButton: {
    backgroundColor: UCaldasTheme.azulOscuro,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  successButton: {
    backgroundColor: '#28a745',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  dangerButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  }
});