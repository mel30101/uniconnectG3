import { StyleSheet, Platform } from 'react-native';
import { UCaldasTheme } from '@/app/constants/Colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 15,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: UCaldasTheme.azulOscuro,
  },
  headerSub: {
    fontSize: 13,
    color: UCaldasTheme.grisTexto,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: UCaldasTheme.azulOscuro + '10',
  },
  headerBtnText: {
    fontSize: 12,
    color: UCaldasTheme.azulOscuro,
    fontWeight: '600',
  },
  headerBtnDanger: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#dc354510',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  // --- Empty State ---
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f2f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: UCaldasTheme.negro,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: UCaldasTheme.grisTexto,
    textAlign: 'center',
    lineHeight: 20,
  },
  // --- Notification Card ---
  notifCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  notifCardUnread: {
    backgroundColor: '#f0f7ff',
    borderLeftWidth: 3,
    borderLeftColor: UCaldasTheme.azulOscuro,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  notifContent: {
    flex: 1,
  },
  notifTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notifLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  notifTime: {
    fontSize: 11,
    color: '#999',
  },
  notifMessage: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  notifMessageUnread: {
    color: '#1a1a1a',
    fontWeight: '500',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: UCaldasTheme.azulOscuro,
    marginLeft: 8,
    marginTop: 6,
  },
  // --- Acciones admin_transfer ---
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  acceptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#28a745',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  rejectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#dc3545',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});
