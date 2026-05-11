import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './TransferAdminModalStyles';

interface TransferAdminModalProps {
  visible: boolean;
  onClose: () => void;
  members: any[];
  adminId: string;
  /** Estado pendingAdminTransfer del observer (objeto o null). */
  pendingTransfer: any;
  /** Dispara el envío de la solicitud al backend. */
  onConfirmTransfer: (candidateId: string) => Promise<boolean>;
}

const BLOCKED_MESSAGE =
  'Tu salida está bloqueada hasta que el sucesor acepte la administración.';

export const TransferAdminModal: React.FC<TransferAdminModalProps> = ({
  visible,
  onClose,
  members,
  adminId,
  pendingTransfer,
  onConfirmTransfer,
}) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const eligible = useMemo(
    () => (members || []).filter((m: any) => m && m.id !== adminId),
    [members, adminId]
  );

  const isBlocked = !!pendingTransfer && pendingTransfer.status === 'pending';

  // Si llega un pendingTransfer (rechazo previo limpia y vuelve a abrir → reset)
  useEffect(() => {
    if (!isBlocked) setSelected(null);
  }, [isBlocked]);

  // Reset al cerrar
  useEffect(() => {
    if (!visible) {
      setSelected(null);
      setSubmitting(false);
    }
  }, [visible]);

  const handleConfirm = async () => {
    if (!selected || submitting) return;
    setSubmitting(true);
    const ok = await onConfirmTransfer(selected);
    setSubmitting(false);
    if (ok) {
      // Cerrar el modal: el bloqueo se refleja en la card de Abandonar Grupo
      onClose();
    }
  };

  const confirmDisabled = !selected || submitting;

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Transferir Administración Obligatoria</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} disabled={isBlocked}>
              <Ionicons name="close" size={22} color={isBlocked ? '#c0ccda' : '#708ab5'} />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Para abandonar el grupo debes transferir la administración a otro miembro.
            Tu salida se confirmará cuando el sucesor acepte la transferencia.
          </Text>

          {isBlocked && (
            <View style={styles.warningBanner}>
              <Ionicons name="lock-closed" size={18} color="#b8860b" />
              <Text style={styles.warningText}>{BLOCKED_MESSAGE}</Text>
            </View>
          )}

          <Text style={styles.label}>Selecciona un sucesor:</Text>

          <ScrollView style={styles.list} nestedScrollEnabled>
            {eligible.length === 0 ? (
              <Text style={styles.emptyText}>
                No hay otros miembros en el grupo a quien transferir la administración.
              </Text>
            ) : (
              eligible.map((m: any, idx: number) => {
                const isSel = selected === m.id;
                const initials = (m.name || 'U').substring(0, 2).toUpperCase();
                return (
                  <TouchableOpacity
                    key={m.id || idx}
                    onPress={() => !isBlocked && setSelected(m.id)}
                    style={[
                      styles.memberRow,
                      idx === eligible.length - 1 && styles.memberRowLast,
                      isSel && styles.memberRowSelected,
                    ]}
                    disabled={isBlocked}
                  >
                    <View style={[styles.radio, isSel && styles.radioSelected]}>
                      {isSel && <View style={styles.radioInner} />}
                    </View>
                    <View style={styles.memberAvatar}>
                      <Text style={styles.memberAvatarText}>{initials}</Text>
                    </View>
                    <Text style={styles.memberName}>{m.name || 'Usuario'}</Text>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.btnSecondary}
              onPress={onClose}
              disabled={isBlocked}
            >
              <Text style={styles.btnSecondaryText}>
                {isBlocked ? 'Esperando respuesta...' : 'Cancelar'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnPrimary, confirmDisabled && styles.btnPrimaryDisabled]}
              onPress={handleConfirm}
              disabled={confirmDisabled}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnPrimaryText}>
                  {isBlocked ? 'Salida bloqueada' : 'Confirmar Salida'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
