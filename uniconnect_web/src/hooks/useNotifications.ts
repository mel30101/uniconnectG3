import { useState, useEffect, useCallback } from 'react'
import { useAuthStore } from '@uniconnect/shared'
import { apiClient } from '../main'
import { useNotifSocket } from '../context/SocketContext'

export interface AppNotification {
  id: string
  userId: string
  title: string
  body: string
  metadata: { groupId?: string; type?: string; [key: string]: unknown }
  type: string
  status: 'read' | 'unread'
  createdAt: string
}

const GROUP_NOTIF_TYPES = ['group_request', 'request_accepted', 'request_rejected']

export function useNotifications() {
  const { user } = useAuthStore()
  const notifSocket = useNotifSocket()
  const [notifications, setNotifications] = useState<AppNotification[]>([])

  const load = useCallback(async () => {
    if (!user?.uid) return
    try {
      const res = await apiClient.getAxiosInstance().get<{ data: AppNotification[] }>(
        `/api/notifications/${user.uid}`
      )
      setNotifications(res.data?.data ?? [])
    } catch {
      // non-critical — silently fail
    }
  }, [user?.uid])

  // Carga inicial + polling fallback
  useEffect(() => {
    load()
    const interval = setInterval(load, 30_000)
    return () => clearInterval(interval)
  }, [load])

  // Tiempo real: escucha evento 'notification' del social-service (puerto 3003)
  // WebSocketNotificationObserver.js emite: io.to(userId).emit('notification', { type, groupId, groupName, message })
  useEffect(() => {
    if (!notifSocket) return

    const handleNotification = (data: { type: string; groupId?: string; groupName?: string; message: string }) => {
      const newNotif: AppNotification = {
        id: `rt-${Date.now()}`,
        userId: user?.uid ?? '',
        title: data.groupName ?? 'Notificación',
        body: data.message,
        metadata: { groupId: data.groupId, type: data.type },
        type: 'group',
        status: 'unread',
        createdAt: new Date().toISOString(),
      }
      setNotifications(prev => [newNotif, ...prev])
    }

    notifSocket.on('notification', handleNotification)
    return () => { notifSocket.off('notification', handleNotification) }
  }, [notifSocket, user?.uid])

  const markRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: 'read' } : n))
  }, [])

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, status: 'read' })))
  }, [])

  const unreadCount = notifications.filter(n => n.status === 'unread').length

  const groupUnreadCount = notifications.filter(
    n => n.status === 'unread' && n.type === 'group' && GROUP_NOTIF_TYPES.includes(n.metadata?.type ?? '')
  ).length

  return { notifications, unreadCount, groupUnreadCount, markRead, markAllRead, reload: load }
}
