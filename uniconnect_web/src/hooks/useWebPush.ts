import { useState, useEffect } from 'react'

interface WebPushState {
  permission: NotificationPermission
  supported: boolean
  token: string | null
  requestPermission: () => Promise<void>
}

export function useWebPush(): WebPushState {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [token, setToken] = useState<string | null>(null)
  const supported = 'Notification' in window && 'serviceWorker' in navigator

  useEffect(() => {
    if (supported) {
      setPermission(Notification.permission)
    }
  }, [supported])

  const requestPermission = async () => {
    if (!supported) {
      console.warn('[WebPush] Not supported in this browser')
      return
    }

    try {
      // Request notification permission
      const perm = await Notification.requestPermission()
      setPermission(perm)

      if (perm !== 'granted') {
        console.warn('[WebPush] Permission denied')
        return
      }

      // Register service worker
      const registration = await navigator.serviceWorker.register('/sw.js')
      console.log('[WebPush] Service Worker registered:', registration)

      // TODO: Get FCM token from Firebase Messaging
      // This requires firebase-messaging SDK and vapidKey configuration
      // For now, we just confirm the SW is registered
      // 
      // Example (when Firebase is configured):
      // const messaging = getMessaging()
      // const fcmToken = await getToken(messaging, { vapidKey: '...', serviceWorkerRegistration: registration })
      // setToken(fcmToken)
      // Send fcmToken to backend to associate with user

      console.log('[WebPush] Ready for push notifications')
    } catch (error) {
      console.error('[WebPush] Setup failed:', error)
    }
  }

  return { permission, supported, token, requestPermission }
}
