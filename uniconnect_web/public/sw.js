/* eslint-disable no-restricted-globals */
/// <reference lib="webworker" />

// Service Worker for Web Push Notifications
// This runs in the background and handles push events from FCM

self.addEventListener('install', (event) => {
  console.log('[SW] Service Worker installing')
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('[SW] Service Worker activating')
  event.waitUntil(self.clients.claim())
})

self.addEventListener('push', (event) => {
  console.log('[SW] Push received:', event)
  
  if (!event.data) return

  const data = event.data.json()
  const title = data.title || 'UniConnect'
  const options = {
    body: data.body || data.message || 'New notification',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    data: data.data || {},
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  )
})

self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event)
  event.notification.close()

  // Open the app or focus existing window
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a window is already open, focus it
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus()
        }
      }
      // Otherwise open a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow('/')
      }
    })
  )
})
